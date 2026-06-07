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
    const cacheHeader = "public, s-maxage=60, stale-while-revalidate=300"
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
