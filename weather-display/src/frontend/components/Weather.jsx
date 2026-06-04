import { useEffect, useState } from "react"
import "../components.css"
import Wbgt from "./wbgt"

function Weather() {
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch("/api/weather")
        const data = await res.json()
        setWeather(data)
      } catch (error) {
        console.error(error)
      } 
    }

    fetchWeather()
    const interval = setInterval(fetchWeather, 60000)

    return () => clearInterval(interval)
  }, [])

  if (!weather) return <p>loading...</p>

  return (
    <div className="content">
      <h2>現在の名古屋市の天気</h2>
      <div className="item weather">
        <p>天気</p>
        <h2>{weather.weather}</h2>
      </div>
      <div className="item kionn">
        <p>気温</p>
        <h2>{weather.temp}°C</h2>
      </div>
      <div className="item situdo">
        <p>湿度</p>
        <h2>{weather.humidity}%</h2>
      </div>

      <Wbgt wbgt={weather.wbgt} />
    </div>
  )
}

export default Weather