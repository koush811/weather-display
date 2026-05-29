require("dotenv").config()

const express = require("express")
const cors = require("cors")
const path = require("path")
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")

const app = express()
const db = require("./db")

// ミドルウェア
app.use(helmet())
app.use(cors({ allowedHeaders: ["Content-Type", "X-Admin-Token"] }))
app.use(express.json({ limit: "2kb" })) // ボディサイズ制限

// 管理 API 用レート制限
const alertLimiter = rateLimit({
  windowMs: 60_000, // 1分
  max: 30, // 最大30リクエスト/分
  standardHeaders: true,
  legacyHeaders: false,
})
app.use("/api/alert", alertLimiter)

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || ""
const ADMINPAGE_TOKEN = process.env.ADMINPAGE_TOKEN || ""

// トークン検証ミドルウェア
function requireAdminToken(req, res, next) {
  const token = req.headers["x-admin-token"] || req.query.token
  if (!ADMIN_TOKEN || !token || token !== ADMIN_TOKEN) {
    return res.status(403).json({ error: "Forbidden" })
  }
  next()
}

function requireAdminPageToken(req, res, next) {
  const token = req.headers["x-adminpage-token"] || req.query.token || req.query.pageToken
  if (!ADMINPAGE_TOKEN || !token || token !== ADMINPAGE_TOKEN) {
    return res.status(403).send("Forbidden")
  }
  next()
}

// 外部天気 API を呼ぶユーティリティ
async function fetchWeatherData() {
  const apikey = process.env.API_KEY
  const city = "Nagoya"
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}&units=metric&lang=ja`

  const response = await fetch(url)
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data?.message || "weather fetch failed")
  }

  return {
    weather: data.weather?.[0]?.description ?? "不明",
    temp: data.main?.temp ?? null,
    humidity: data.main?.humidity ?? null,
    wbgt: null, // 必要なら計算して追加
  }
}

// フロント向け天気エンドポイント
app.get("/api/weather", requireAdminToken, async (req, res) => {
  try {
    const weather = await fetchWeatherData()
    res.json(weather)
  } catch (error) {
    console.error("fetchWeatherData error:", error)
    res.status(500).json({ error: "天気取得失敗" })
  }
})

// 最新アラート取得
app.get("/api/alert", requireAdminToken, (req, res) => {
  db.get("SELECT * FROM alerts ORDER BY id DESC LIMIT 1", (err, row) => {
    if (err) return res.status(500).json({ error: "DBエラー" })
    if (!row) return res.json({ level: "none", message: "アラートなし" })
    res.json(row)
  })
})

// アラート登録（認証・Content-Type・サイズ・バリデーション済み）
app.post("/api/alert", requireAdminToken, (req, res) => {
  const ct = req.get("content-type") || ""
  if (!ct.includes("application/json")) {
    return res.status(400).json({ error: "Content-Type must be application/json" })
  }

  const { level } = req.body
  const allowed = ["special", "warning", "heat31", "none"]
  if (typeof level !== "string" || !allowed.includes(level)) {
    return res.status(400).json({ error: "invalid level" })
  }

  const labels = {
    special: "熱中症特別警戒アラート",
    warning: "熱中症警戒アラート",
    heat31: "日最高暑さ指数(予測値)31以上",
    none: "アラートなし",
  }
  const message = labels[level] || "アラートなし"

  // audit log（トークンは出力しない）
  console.info(`admin action: set alert -> ${level}`)

  db.run(
    `INSERT INTO alerts(message, level) VALUES(?, ?)`,
    [message, level],
    (err) => {
      if (err) {
        console.error("db insert error:", err)
        return res.status(500).json({ error: "insert error" })
      }
      res.json({ success: true })
    }
  )
})

// 管理画面（表示用トークンで認証）
const adminPath = path.join(__dirname, "../../admin.html")
app.get("/admin", requireAdminPageToken, (req, res) => {
  res.sendFile(adminPath)
})

// 静的配布（ビルド後）
const distPath = path.join(__dirname, "../../dist")
app.use(express.static(distPath))
app.use((req, res) => {
  res.sendFile(path.join(distPath, "index.html"))
})

app.listen(3000, () => {
  console.log("start")
})