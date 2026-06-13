import { useEffect, useState } from "react"
import Wbgt from "./wbgt"

function Heat() {
    const [wbgt, setWbgt] = useState(null)
    const [error, setError] = useState(false)

    useEffect(() => {
        const fetchHeat = async () => {
            try {
                const response = await fetch("/api/heat")

                if (!response.ok) {
                    throw new Error("heat api error")
                }

                const data = await response.json()

                console.log("Heat API:", data)

                setWbgt(data.currentWbgt)
                setError(false)

            } catch (error) {
                console.error(error)
                setError(true)
            }
        }

        fetchHeat()

        const interval = setInterval(fetchHeat, 600000)

        return () => clearInterval(interval)
    }, [])

    if (error) {
        return (
            <div className="item wbgt">
                <h2>WBGT</h2>
                <h3>データなし</h3>
            </div>
        )
    }

    if (wbgt === null) {
        return (
            <div className="item wbgt">
                <h2>WBGT</h2>
                <h3>読み込み中...</h3>
            </div>
        )
    }

    return <Wbgt wbgt={wbgt} />
}

export default Heat