import { useEffect, useState } from "react"
import "../components.css"

function Weather() {
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch("/api/weather")

        if (!res.ok) {
          throw new Error("weather api error")
        }

        const data = await res.json()

        console.log("Weather API:", data)

        setWeather(data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchWeather()

    const interval = setInterval(fetchWeather, 600000)

    return () => clearInterval(interval)
  }, [])

  if (!weather) {
    return <p>loading...</p>
  }

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
    </div>
  )
}

export default Weather