import Weather from "./frontend/components/Weather";
import Clock from "./frontend/components/Clock"
import "./app.css"

function app(){
    return(
        <>
            <div className="dev weather">
                <Weather></Weather>
            </div>
            <div className="dev clock">
                <Clock></Clock>
            </div>
            <div className="dev Alert">

            </div>
            <div className="dev info">

            </div>
        </>
    )
}

export default app