require("dotenv").config()
const express = require("express")
const cors = require("cors")

const app = express()

app.use(cors())
app.use(express.json())

app.get("/",(req,res)=>{
    res.send("server running")
})

app.get("/api/weather", async (req,res)=>{

    try{
        const apikey = process.env.API_KEY
        console.log(process.env.API_KEY)
        const city = "Nagoya"

        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}&units=metric&lang=ja`;

        const responce = await fetch(url)

        const data = await responce.json()

        console.log(data)

        res.json({
            weather: data.weather[0].description,
            temp:data.main.temp,
            humidity:data.main.humidity
        })

    }catch(error){
        res.status(500).json({
            error: "取得失敗"
        })
    }

})

app.listen(3000,()=>{
    console.log("start")
})