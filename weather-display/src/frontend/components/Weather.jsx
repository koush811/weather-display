import { useEffect, useState } from "react"

function Weather(){
    const [weather,setWeather] = useState(null)

    useEffect(()=>{
        fetch("http://localhost:3000/api/weather")
            .then(res => res.json())
            .then(data => { setWeather(data) })
    },[])

    if(!weather){
        return <p>loading...</p>
    }

    return(
        <div>
            <h2>{weather.weather}</h2>

            <p>{weather.temp}度</p>

            <p>{weather.humidity}%</p>
        </div>
    )
}

export default Weather