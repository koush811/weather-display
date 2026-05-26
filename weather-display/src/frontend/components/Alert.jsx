import { useEffect, useState } from "react"
import "../components.css"

function Alert() {
	const [alertData, setAlertData] = useState(null)

	useEffect(() => {
		let isMounted = true

		const fetchAlert = async () => {
			try {
				const response = await fetch("/api/alert")
				if (!response.ok) return

				const data = await response.json()
				if (isMounted) setAlertData(data)
			} catch (error) {
				console.error(error)
			}
		}

		fetchAlert()
		const intervalId = setInterval(fetchAlert, 10000)

		return () => {
			isMounted = false
			clearInterval(intervalId)
		}
	}, [])

	if (!alertData) {
		return (
			<div className="item alert">
				<h2>熱中症警戒アラート</h2>
				<p>読み込み中...</p>
			</div>
		)
	}

	const levelText = {
		special: "熱中症特別警戒アラート",
		warning: "熱中症警戒アラート",
		heat31: "日最高暑さ指数(予測値)31以上",
		none: "アラートなし",
	}

	return (
		<div className="item alert">
			<h2>熱中症警戒アラート</h2>
			<h3>{levelText[alertData.level] ?? "アラートなし"}</h3>
		</div>
	)
}

export default Alert

