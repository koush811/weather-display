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


    return(
        <>
            <div className="content clock">               
                <h2>現在時刻</h2>
                <h2>{month}</h2>
                <h2>{hour}:{minute}:{second}</h2>
            </div>
        </>

    )
}

export default Clock
