import Weather from "./frontend/components/Weather";
import Clock from "./frontend/components/Clock"
import Alert from "./frontend/components/Alert"
import Wbgt from "./frontend/components/wbgt"
import Table from "./frontend/components/table";
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
                <Alert></Alert>
            </div>
            <div className="dev">
                <Table></Table>
            </div>
        </>
    )
}

export default app