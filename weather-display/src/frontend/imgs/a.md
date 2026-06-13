### 要件定義

# 目的
- このサイトは学校生徒向けの根中小対策掲示板です。
- 生徒はwbgt、熱中症警戒アラートの有無、などの情報を確認できます。

# サイトurl 
- https://weather-display-theta.vercel.app/

#　環境
- React
- Vite
- vercel

# 現在のサイトの状態
- 画面構成は現在の天気、現在時刻、熱中症警戒アラート、WBGT表の四つで構成されています。
- 天気画面はopenWeatherAPI ( `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=ja`) を使用して、都市の天気情報を取得し、取得した情報から天気、気温、湿度、WBGTを表示しています。表示しています。

weather-display\api\weather.js
```
export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET")
    return res.status(405).json({ error: "Method Not Allowed" })
  }

  try {
    const apiKey = process.env.API_KEY
    if (!apiKey) {
      return res.status(500).json({ error: "API_KEY is not configured" })
    }

    const city = "Nagoya"
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=ja`

    const response = await fetch(url)
    const data = await response.json()

    if (!response.ok) {
      return res.status(response.status).json({
        error: data?.message || "Failed to fetch weather",
      })
    }

    const temp = data.main?.temp
    const humidity = data.main?.humidity
    const wbgt =
      typeof temp === "number" && typeof humidity === "number"
        ? 0.725 * temp + 0.0368 * humidity + 3.94
        : null

    res.setHeader("Cache-Control", "public, s-maxage=600, stale-while-revalidate=60")
    res.setHeader("CDN-Cache-Control", "public, s-maxage=600, stale-while-revalidate=60")

    return res.status(200).json({
      weather: data.weather?.[0]?.description ?? "不明",
      temp,
      humidity,
      wbgt: wbgt === null ? null : Number(wbgt.toFixed(1)),
      city,
      updatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("weather api error:", error)
    return res.status(500).json({ error: "Internal Server Error" })
  }
}
```

- 熱中症警戒アラート情報は"https://weather-display-theta.vercel.app/admin"から管理者が入力しアラートの有無を表示しています

weather-display\public\admin.js
```
    (function () {
    console.log("public/admin.js")
    function qs(sel, root = document) { return root.querySelector(sel); }

    const loginView = qs('#loginView');
    const panel = qs('#panel');
    const pageTokenEl = qs('#pageToken');
    const loginBtn = qs('#loginBtn');
    const sendTokenEl = qs('#sendToken');
    const sendBtn = qs('#sendBtn');
    const resultEl = qs('#result');

    function showLogin() {
        loginView.style.display = 'block';
        panel.style.display = 'none';
    }

    function showPanel() {
        loginView.style.display = 'none';
        panel.style.display = 'block';
    }

    async function checkPageToken(token) {
        try {
            const res = await fetch('/api/admin', { method: 'POST', headers: { 'x-adminpage-token': token } });
            return res.status === 200;
        } catch (e) {
            return false;
        }
    }

    async function sendAlert(alertType, token) {
        try {
            const res = await fetch('/api/alert', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'x-admin-token': token,
                },
                body: JSON.stringify({ level: alertType }),
            });
            return res;
        } catch (e) {
            throw e;
        }
    }

    loginBtn.addEventListener('click', async function () {
        const token = pageTokenEl.value.trim();
        loginBtn.disabled = true;
        loginBtn.textContent = '検証中...';
        const ok = await checkPageToken(token);
        loginBtn.disabled = false;
        loginBtn.textContent = 'ログイン';
        if (ok) {
            showPanel();
        } else {
            alert('パスワードが違います');
        }
    });

    sendBtn.addEventListener('click', async function () {
        const token = sendTokenEl.value.trim();
        const alertType = document.querySelector('input[name="alert"]:checked').value;
        sendBtn.disabled = true;
        sendBtn.textContent = '送信中...';
        resultEl.textContent = '';
        try {
            const res = await sendAlert(alertType, token);
            if (res.status === 200) {
                resultEl.textContent = '送信しました';
            } else if (res.status === 403) {
                resultEl.textContent = '認証エラー';
            } else {
                resultEl.textContent = 'エラー: ' + res.status;
            }
        } catch (e) {
            resultEl.textContent = '送信失敗';
        }
        sendBtn.disabled = false;
        sendBtn.textContent = '送信';
    });

    sendTokenEl.addEventListener('input', function () {
        sendBtn.disabled = sendTokenEl.value.trim() === '';
    });

    showLogin();
})();
```

weather-display\api\alert.js
```
const ALERT_LABELS = {
  special: "熱中症特別警戒アラート",
  warning: "熱中症警戒アラート",
  heat31: "日最高暑さ指数(予測値)31以上",
  none: "アラートなし",
}

const ALERT_KEY = "alert:latest"

async function kvCommand(path) {
  const baseUrl = process.env.KV_REST_API_URL
  const token = process.env.KV_REST_API_TOKEN

  if (!baseUrl || !token) {
    return null
  }

  const response = await fetch(`${baseUrl}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!response.ok) {
    throw new Error(`KV request failed: ${response.status}`)
  }

  return response.json()
}

async function getAlertFromStore() {
  try {
    const result = await kvCommand(`/get/${ALERT_KEY}`)
    if (!result || !result.result) {
      return globalThis.__latestAlert || null
    }

    return JSON.parse(result.result)
  } catch (error) {
    console.error("kv get error:", error)
    return globalThis.__latestAlert || null
  }
}

async function setAlertToStore(alertPayload) {
  const value = encodeURIComponent(JSON.stringify(alertPayload))

  try {
    const result = await kvCommand(`/set/${ALERT_KEY}/${value}`)
    if (!result) {
      globalThis.__latestAlert = alertPayload
      return
    }

    globalThis.__latestAlert = alertPayload
  } catch (error) {
    console.error("kv set error:", error)
    globalThis.__latestAlert = alertPayload
  }
}

function getToken(req) {
  const header = req.headers["x-admin-token"]
  if (Array.isArray(header)) {
    return header[0]
  }
  return header || ""
}

function getRequestBody(req) {
  if (!req.body) return {}
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body)
    } catch {
      return {}
    }
  }
  return req.body
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    const row = await getAlertFromStore()

    // CDN/edge cache: short TTL so polls hit CDN, not origin.
    // s-maxage is seconds to cache at shared caches (CDN/edge).
    // stale-while-revalidate allows serving stale while revalidating in background.
    const cacheHeader = "public, s-maxage=300, stale-while-revalidate=300"
    res.setHeader("Cache-Control", cacheHeader)
    res.setHeader("CDN-Cache-Control", cacheHeader)

    if (!row) {
      return res.status(200).json({
        level: "none",
        message: ALERT_LABELS.none,
      })
    }

    return res.status(200).json(row)
  }

  if (req.method === "POST") {
    const adminToken = process.env.ADMIN_TOKEN || ""
    const token = getToken(req)

    if (!adminToken || !token || token !== adminToken) {
      return res.status(403).json({ error: "Forbidden" })
    }

    const body = getRequestBody(req)
    const level = body.level
    if (!level || !Object.prototype.hasOwnProperty.call(ALERT_LABELS, level)) {
      return res.status(400).json({ error: "invalid level" })
    }

    const alertPayload = {
      level,
      message: ALERT_LABELS[level],
      updatedAt: new Date().toISOString(),
    }

    await setAlertToStore(alertPayload)
    return res.status(200).json({ success: true })
  }

  res.setHeader("Allow", "GET, POST")
  return res.status(405).json({ error: "Method Not Allowed" })
}

```

# 要件
- 現在openweatherAPIで受け取っているが、wbgtのデータを取得できないので現在は
frontend側で気温と湿度の値から計算している。また、熱中症警戒アラートも管理者が入力知る必要がある。
- そこでこれらを自動化するために、環境省のapi(https://www.wbgt.env.go.jp/data_service.php)を使用して、wbgtの値と熱中症警戒アラートの有無を取得し、表示するようにします。
- 環境省のapiはCSV形式のテキストファイルになっている。(詳細はPDFを参照"https://www.wbgt.env.go.jp/man15NH/R08_wbgt_data_service_manual.pdf")
- この変更のための詳しい要件を定義し、その後コードを生成してください(こちらが指示するまでコードは書かないこと)。
- 他に変更のために必要な情報があれば報告してください