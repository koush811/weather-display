import Weather from "./frontend/components/Weather";
import Clock from "./frontend/components/Clock"
import Alert from "./frontend/components/Alert"
import Wbgt from "./frontend/components/wbgt"
import Table from "./frontend/components/table";
import "./app.css"

function app(){
    return(
        <>
           <header>
            <img src="\src\frontend\imgs\image.png" alt="" />
            <p>愛知総合工科高校保健委員会</p>
            
           </header>
            <div className="dev weather">
                <Weather></Weather>
            </div>
            <div className="dev clock">
                <Clock></Clock>
            </div>
            <div className="dev Alert">
                <Alert></Alert>
            </div>
            <div className="dev">
                <Table></Table>
            </div>
        </>
    )
}

export default app