import { useEffect, useState } from "react"
import "../components.css"
import Wbgt from "./wbgt"

function Weather() {
  const [weather, setWeather] = useState(null)
  const [streaming, setStreaming] = useState(false)
  const FETCH_URL = "http://localhost:3000/api/weather"
  const STREAM_URL = "http://localhost:3000/api/weather/stream"
  const POLL_INTERVAL = 10_000 

  useEffect(() => {
    let isMounted = true
    let pollId = null
    let es = null

    const fetchOnce = async () => {
      try {
        const res = await fetch(FETCH_URL)
        if (!res.ok) return
        const data = await res.json()
        if (isMounted) setWeather(data)
      } catch (e) {
        console.error("fetch error", e)
      }
    }

    const startPolling = (interval = POLL_INTERVAL) => {
      if (pollId) return
      fetchOnce()
      pollId = setInterval(fetchOnce, interval)
      setStreaming(false)
    }

    const stopPolling = () => {
      if (pollId) { clearInterval(pollId); pollId = null }
    }

    const startEventSource = () => {
      try {
        es = new EventSource(STREAM_URL)
        es.onopen = () => {
          setStreaming(true)
        }
        es.onmessage = (e) => {
          try {
            const data = JSON.parse(e.data)
            if (isMounted) setWeather(data)
          } catch (err) {
            console.error("SSE JSON parse error", err)
          }
        }
        es.onerror = (err) => {
          console.warn("SSE error, falling back to polling", err)
          if (es) { es.close(); es = null }
          startPolling()
        }
      } catch (err) {
        console.warn("EventSource not available, using polling", err)
        startPolling()
      }
    }

    startEventSource()

    const handleVisibility = () => {
      if (document.hidden) {
        if (es) { es.close(); es = null }
        stopPolling()
      } else {
        startEventSource()
      }
    }
    document.addEventListener("visibilitychange", handleVisibility)

    return () => {
      isMounted = false
      document.removeEventListener("visibilitychange", handleVisibility)
      if (es) { es.close(); es = null }
      stopPolling()
    }
  }, [])

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