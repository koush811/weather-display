export default async function handler(req, res) {
  console.log("API_KEY =", process.env.API_KEY)
  console.log("ENV KEYS =", Object.keys(process.env).filter(k => k.includes("API")))


  if (req.method !== "GET") {
    res.setHeader("Allow", "GET")
    return res.status(405).json({
      error: "Method Not Allowed",
    })
  }

  try {
    const apiKey = process.env.API_KEY

    if (!apiKey) {
      return res.status(500).json({
        error: "API_KEY is not configured",
      })
    }

    const city = "Nagoya"

    const url =
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        city
      )}&appid=${apiKey}&units=metric&lang=ja`

    console.log("Weather URL:", url)

    const response = await fetch(url)

    const data = await response.json()

    if (!response.ok) {
      return res.status(response.status).json({
        error: data?.message || "Failed to fetch weather",
      })
    }

    const temp = data.main?.temp ?? null
    const humidity = data.main?.humidity ?? null

    console.log("Weather:", data.weather?.[0]?.description)
    console.log("Temp:", temp)
    console.log("Humidity:", humidity)

    const cacheHeader =
      "public, s-maxage=600, stale-while-revalidate=60"

    res.setHeader("Cache-Control", cacheHeader)
    res.setHeader("CDN-Cache-Control", cacheHeader)

    return res.status(200).json({
      weather: data.weather?.[0]?.description ?? "不明",
      temp,
      humidity,
      city,
      updatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("weather api error:", error)

    return res.status(500).json({
      error: "Internal Server Error",
    })
  }
}