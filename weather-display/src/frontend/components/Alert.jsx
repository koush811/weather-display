import { useEffect, useState } from "react"
import "../components.css"

function Alert() {
    const [alertMessage, setAlertMessage] = useState(null)
    const [error, setError] = useState(false)

    useEffect(() => {
        let isMounted = true

        const fetchAlert = async () => {
            try {
                const response = await fetch("/api/heat")

                if (!response.ok) {
                    throw new Error("heat api error")
                }

                const data = await response.json()

                console.log("Heat API:", data)

                if (isMounted) {
                    setAlertMessage(data.alertMessage)
                    setError(false)
                }
            } catch (error) {
                console.error(error)

                if (isMounted) {
                    setError(true)
                }
            }
        }

        fetchAlert()

        const intervalId = setInterval(fetchAlert, 600000)

        return () => {
            isMounted = false
            clearInterval(intervalId)
        }
    }, [])

    return (
        <div className="item alert">
            <h2>熱中症警戒アラート</h2>

            {error ? (
                <h3>データなし</h3>
            ) : (
                <h3>{alertMessage ?? "読み込み中..."}</h3>
            )}
        </div>
    )
}

export default Alert