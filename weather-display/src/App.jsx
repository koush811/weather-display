import { useEffect, useState } from "react"
import Weather from "./frontend/components/Weather"
import Clock from "./frontend/components/Clock"
import Alert from "./frontend/components/Alert"
import Table from "./frontend/components/table"
import "./app.css"
import logo from "./frontend/imgs/image.png"
import File from "./frontend/components/file"

function App() {
  const [weather, setWeather] = useState(null)
  const [heat, setHeat] = useState(null)

  const isHeatSeason = () => {
    const now = new Date()

    const month = now.getMonth() + 1
    const day = now.getDate()

    if (month < 4 || month > 10) return false

    if (month === 4 && day < 22) return false
    if (month === 10 && day > 21) return false

    return true
  }

  useEffect(() => {
    const fetchData = async () => {
        try {
            const weatherRes = await fetch("/api/weather")

            if (weatherRes.ok) {
            setWeather(await weatherRes.json())
            } else {
            setWeather(null)
            }

            if (isHeatSeason()) {
            const heatRes = await fetch("/api/heat")

            if (heatRes.ok) {
                setHeat(await heatRes.json())
            } else {
                setHeat({
                currentWbgt: null,
                alertMessage: "データなし",
                })
            }
            }
        } catch (error) {
            console.error(error)

            setWeather(null)

            setHeat({
            currentWbgt: null,
            alertMessage: "データなし",
            })
        }
    }

    fetchData()

    const interval = setInterval(fetchData, 60000)

    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <header>
        <img src={logo} alt="" />
        <h3>愛知総合工科高校保健委員会</h3>
      </header>

      <div className="dev weather">
        <Weather weather={weather} heat={heat} />
      </div>

      {isHeatSeason() && (
        <>
          <div className="dev Alert">
            <Alert heat={heat} />
          </div>

          <div className="dev">
            <Table />
          </div>
        </>
      )}
      <div className="dev">
        <File />
      </div>
    </>
  )
}

export default App