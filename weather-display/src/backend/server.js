require("dotenv").config()

const express = require("express")
const cors = require("cors")
const path = require("path")

const app = express()

const db = require("./db")
const { error } = require("console")

app.use(cors())
app.use(express.json())

let weatherData = null

async function updateWeather() {

    try {

        const apiKey = process.env.API_KEY
        const city = "Nagoya"

        const url =
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=ja`

        const response = await fetch(url)
        const data = await response.json()

        const temp = data.main.temp
        const humidity = data.main.humidity

        const wbgt =
            0.725 * temp +
            0.0368 * humidity +
            3.94

        weatherData = {

            weather: data.weather[0].description,
            temp: temp,
            humidity: humidity,
            wbgt: wbgt.toFixed(1),

        }

        console.log("weather updated")

    } catch (error) {

        console.log(error)

    }

}

updateWeather()

setInterval(updateWeather, 600000)

app.get("/api/weather", (req, res) => {

    res.json(weatherData)
    console.log("updated")

})


app.get("/api/alert",(req,res)=>{
    db.get(
        "SELECT * FROM alerts ORDER BY id DESC LIMIT 1",
        (err,row)=>{
            if(err){
                return res.status(500).json({
                    error: "DBエラー"
                })
            }

            res.json(row)
        }

    )
})

app.post("/api/alert",(req,res)=>{

    const { message, level } = req.body

    db.run(

        `
        
        INSERT INTO alerts(message,level)

        VALUES(?,?)
        
        `,

        [message,level],

        (err)=>{

            if(err){

                return res.status(500).json({
                    error:"insert error"
                })

            }

            res.json({
                success:true
            })

        }

    )

})

const adminPath = path.join(__dirname, "../../admin.html")

app.get("/admin", (req, res) => {
  res.sendFile(adminPath)
})

const distPath = path.join(__dirname, "../../dist")

app.use(express.static(distPath))

app.use((req, res) => {

    res.sendFile(path.join(distPath, "index.html"))

})

app.listen(3000, () => {

    console.log("start")

})
