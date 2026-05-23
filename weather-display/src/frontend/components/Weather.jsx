import { useEffect, useState } from "react"
import "../components.css"

function Weather(){
    const [weather,setWeather] = useState(null)

    useEffect(()=>{
        let isMounted = true
        let intervalId = null

        const fetchData = async () => {
            try {
                const res = await fetch("http://localhost:3000/api/weather")
                if (!res.ok) return
                const data = await res.json()
                if (isMounted) setWeather(data)
            } catch (e) {
                console.error(e)
            }
        }

        const start = () => {
            fetchData()
            intervalId = setInterval(fetchData, 60000) // 60秒ごと
        }

        const stop = () => {
            if (intervalId) { clearInterval(intervalId); intervalId = null }
        }

        start()

        const onVisibility = () => {
            if (document.hidden) stop()
            else start()
            }
            document.addEventListener("visibilitychange", onVisibility)

            return () => {
                isMounted = false
                stop()
                document.removeEventListener("visibilitychange", onVisibility)
            }
    },[])

        if(!weather){
            return <p>loading...</p>
        }

    const weatherValue = weather.weather
    const tempValue = weather.temp
    const humidityValue = weather.humidity

    let tempColor = ""

    if(tempValue >= 35){
        tempColor = "#5e0300"
    }else if(tempValue >= 30){
        tempColor = "red"
    }else if(tempValue >= 25){
        tempColor = "yellow"
    }else if(tempValue >= 20){
        tempColor = "#00ca0a"
    }else{
        tempColor = "#ffffff"
    }

    return(
        <div className="content">
            <h2>現在の名古屋市の天気</h2>
            <div className="item weather">
                <p>天気</p>
                <h2>{weather.weather}</h2>
            </div>
            <div className="item kionn">
                <p>気温</p>
                <h2 style={{color: tempColor}}>{weather.temp}度</h2>
            </div>
            <div className="item situdo">
                <p>湿度</p>
                <h2>{weather.humidity}%</h2>
            </div>     
        </div>
    )
}

export default Weather