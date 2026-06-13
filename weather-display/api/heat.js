const ALERT_LABELS = {
  0: "アラートなし",
  1: "熱中症警戒アラート",
  2: "熱中症特別警戒情報（判定中）",
  3: "熱中症特別警戒アラート",
}

globalThis.lastAlertLevel ??= 0

function pad(num) {
  return String(num).padStart(2, "0")
}

function getJstDate() {
  const now = new Date()

  return new Date(
    now.toLocaleString("en-US", {
      timeZone: "Asia/Tokyo",
    })
  )
}

async function fetchText(url) {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`fetch failed ${response.status}`)
  }

  return response.text()
}

async function getCurrentWbgt() {
  const now = getJstDate()

  const year = now.getFullYear()
  const month = pad(now.getMonth() + 1)
  const day = now.getDate()

  const wbgtUrl =
    `https://www.wbgt.env.go.jp/est15WG/dl/wbgt_51106_${year}${month}.csv`

  console.log("WBGT URL:", wbgtUrl)

  const csv = await fetchText(wbgtUrl)

  const rows = csv.trim().split("\n").slice(1)

  const todayRows = rows.filter(row => {
    const cols = row.split(",")
    const date = cols[0]

    return date === `${year}/${now.getMonth() + 1}/${day}`
  })

  let currentWbgt = null

  for (let i = todayRows.length - 1; i >= 0; i--) {
    const cols = todayRows[i].split(",")

    if (cols[2] && cols[2].trim() !== "") {
      currentWbgt = Number(cols[2])
      break
    }
  }

  if (currentWbgt === null) {
    throw new Error("wbgt not found")
  }

  console.log("Current WBGT:", currentWbgt)

  return currentWbgt
}

async function getAlertInfo() {
  const now = getJstDate()

  let targetDate = new Date(now)
  let fileHour
  let useTargetDate2 = false

  const hour = now.getHours()

  if (hour >= 10) {
    fileHour = "10"
  } else if (hour >= 5) {
    fileHour = "05"
  } else {
    fileHour = "17"
    useTargetDate2 = true
    targetDate.setDate(targetDate.getDate() - 1)
  }

  const year = targetDate.getFullYear()
  const month = pad(targetDate.getMonth() + 1)
  const day = pad(targetDate.getDate())

  const alertUrl =
    `https://www.wbgt.env.go.jp/alert/dl/${year}/alert_${year}${month}${day}_${fileHour}.csv`

  console.log("Alert URL:", alertUrl)

  const csv = await fetchText(alertUrl)

  const rows = csv.trim().split("\n")

  /*const aichiRow = rows.find(row => {
    const cols = row.split(",")

    return cols[4]?.trim() === "愛知県"
  })*/
    const aichiRow = rows.find(row =>
        row.includes("愛知")
    )

  if (!aichiRow) {
    throw new Error("aichi row not found")
  }

  const cols = aichiRow.split(",")

  const flag = Number(
    useTargetDate2
      ? cols[7]
      : cols[6]
  )

  let alertLevel = flag

  if (flag === 9) {
    alertLevel = globalThis.lastAlertLevel
  } else {
    globalThis.lastAlertLevel = flag
  }

  console.log("Alert Flag:", alertLevel)

  return {
    alertLevel,
    alertMessage:
      ALERT_LABELS[alertLevel] ?? "アラートなし",
  }
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET")
    return res.status(405).json({
      error: "Method Not Allowed",
    })
  }

  try {
    const currentWbgt = await getCurrentWbgt()

    const {
      alertLevel,
      alertMessage,
    } = await getAlertInfo()

    const cacheHeader =
      "public, s-maxage=600, stale-while-revalidate=300"

    res.setHeader("Cache-Control", cacheHeader)
    res.setHeader("CDN-Cache-Control", cacheHeader)

    return res.status(200).json({
      currentWbgt,
      alertLevel,
      alertMessage,
      updatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("HEAT ERROR:", error)

    return res.status(500).json({
        error: error.message,
    })
    }

    console.log("===== ALERT CSV =====")
    console.log(rows.slice(0, 20))
}