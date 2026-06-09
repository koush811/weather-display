import Weather from "./frontend/components/Weather";
import Clock from "./frontend/components/Clock"
import Alert from "./frontend/components/Alert"
import Wbgt from "./frontend/components/wbgt"
import Table from "./frontend/components/table";
import "./app.css"
import logo from"./frontend/imgs/image.png"

function app(){
    return(
        <>
           <header>
            <img src={logo} alt="" />
            <p>愛知総合工科高校保健委員会</p>
            
           </header>
            <div className="dev weather">
                <Weather />
            </div>
            <div className="dev clock">
                <Clock/>
            </div>
            <div className="dev Alert">
                <Alert/>
            </div>
            <div className="dev">
                <Table/>
            </div>
        </>
    )
}

export default app