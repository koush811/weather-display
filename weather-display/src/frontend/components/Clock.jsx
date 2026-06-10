import { useEffect, useState } from "react"
import "../components.css"

function Clock(){
    const [time,setTime] = useState(new Date())

    useEffect(()=>{
        const timeID = setInterval(()=>{
            setTime(new Date())
        },1000)

        return ()=>clearInterval(timeID) 
    },[])

    const hour = String(time.getHours()).padStart(2,"0")
    const minute = String(time.getMinutes()).padStart(2,"0")
    const second = String(time.getSeconds()).padStart(2,"0")

    const month = String(new Date().toLocaleDateString("JP"))

    const secondDeg = time.getSeconds() * 6;
    const minuteDeg = time.getMinutes() * 6 + time.getSeconds() * 0.1;
    const hourDeg = (time.getHours() % 12) * 30 + time.getMinutes() * 0.5;

    return(
        <>
            <div className="content clock">               
                <h2>現在時刻</h2>
                <div className="analog-clock">
                    <div className="hour hari" style={{ transform: `rotate(${hourDeg}deg)` }}></div>
                    <div className="minute hari" style={{ transform: `rotate(${minuteDeg}deg)` }}></div>
                    <div className="second hari" style={{ transform: `rotate(${secondDeg}deg)` }}></div>
                    <div className="center"></div>
                </div>
                
                <h2>{month}</h2>
                <h2>{hour}:{minute}:{second}</h2>
            </div>
        </>

    )
}

export default Clock
