import "../components.css"

function Wbgt({wbgt}){

    let text = ""
    let color = ""

    if(wbgt >= 31){
        text = "危険"
        color = "red"
    }else if(wbgt >= 28){
        text = "厳重警戒"
        color = "orange"
    }
    else if(wbgt >= 25){
        text = "警戒"
        color = "#ffe600"
    }else if(wbgt >= 21){
        text = "注意"
        color = "#00a9d3"
    }else{
        text = "安全"
        color ="#00ff15"
    }

    return (
        <>
            <div className="item wbgt">
                <h2>WBGT</h2>
                <h2 style={{color:color}}>{wbgt}</h2>
                <h3 style={{color:color}}>{text}</h3>
            </div>
        </>
    )
}


export default Wbgt


