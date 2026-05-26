import { useEffect, useState } from "react"
import "../components.css"
import Wbgt from "./wbgt"

function Weather() {
  const [weather, setWeather] = useState(null)
  const [streaming, setStreaming] = useState(false)
  const FETCH_URL = "/api/weather"
  const STREAM_URL = "/api/weather/stream"
  const POLL_INTERVAL = 10_000 

  useEffect(()=>{

    const fetchWeather = async ()=>{

        const res = await fetch("/api/weather")
        const data = await res.json()

        setWeather(data)

    }

    fetchWeather()

    const interval = setInterval(fetchWeather,10000)

    return ()=>clearInterval(interval)

},[])

  if (!weather) return <p>loading...</p>

  const temp = weather.temp
  let tempColor = "#ffffff"
  if (temp >= 35) tempColor = "#5e0300"
  else if (temp >= 30) tempColor = "red"
  else if (temp >= 25) tempColor = "yellow"
  else if (temp >= 20) tempColor = "#00ca0a"

  return (
    <div className="content">
      <h2>現在の名古屋市の天気 </h2>
      <div className="item weather">
        <p>天気</p>
        <h2>{weather.weather}</h2>
      </div>
      <div className="item kionn">
        <p>気温</p>
        <h2 style={{ color: tempColor }}>{weather.temp}°C</h2>
      </div>
      <div className="item situdo">
        <p>湿度</p>
        <h2>{weather.humidity}%</h2>
      </div>

      <Wbgt wbgt={weather.wbgt}></Wbgt>
    </div>
  )
}

export default Weather