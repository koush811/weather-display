module.exports = async (req, res) => {
	if (req.method !== "GET") {
		res.setHeader("Allow", "GET")
		return res.status(405).json({ error: "Method Not Allowed" })
	}

	try {
		const apiKey = process.env.API_KEY
		if (!apiKey) {
			return res.status(500).json({ error: "API_KEY is not configured" })
		}

		const city = req.query.city || "Nagoya"
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
