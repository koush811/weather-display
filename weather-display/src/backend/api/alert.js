const db = require("../db")

const ALERT_LABELS = {
	special: "熱中症特別警戒アラート",
	warning: "熱中症警戒アラート",
	heat31: "日最高暑さ指数(予測値)31以上",
	none: "アラートなし",
}

function getLatestAlert() {
	return new Promise((resolve, reject) => {
		db.get("SELECT * FROM alerts ORDER BY id DESC LIMIT 1", (err, row) => {
			if (err) return reject(err)
			resolve(row)
		})
	})
}

function insertAlert(message, level) {
	return new Promise((resolve, reject) => {
		db.run(
			"INSERT INTO alerts(message, level) VALUES(?, ?)",
			[message, level],
			(err) => {
				if (err) return reject(err)
				resolve()
			}
		)
	})
}

module.exports = async (req, res) => {
	if (req.method === "GET") {
		try {
			const row = await getLatestAlert()
			if (!row) {
				return res.status(200).json({
					level: "none",
					message: ALERT_LABELS.none,
				})
			}

			return res.status(200).json({
				id: row.id,
				level: row.level,
				message: row.message,
			})
		} catch (error) {
			console.error("alert GET error:", error)
			return res.status(500).json({ error: "DB error" })
		}
	}

	if (req.method === "POST") {
		const adminToken = process.env.ADMIN_TOKEN
		const token = req.headers["x-admin-token"]

		if (!adminToken || !token || token !== adminToken) {
			return res.status(403).json({ error: "Forbidden" })
		}

		const level = req.body?.level
		if (!level || !Object.prototype.hasOwnProperty.call(ALERT_LABELS, level)) {
			return res.status(400).json({ error: "invalid level" })
		}

		try {
			await insertAlert(ALERT_LABELS[level], level)
			return res.status(200).json({ success: true })
		} catch (error) {
			console.error("alert POST error:", error)
			return res.status(500).json({ error: "insert error" })
		}
	}

	res.setHeader("Allow", "GET, POST")
	return res.status(405).json({ error: "Method Not Allowed" })
}
