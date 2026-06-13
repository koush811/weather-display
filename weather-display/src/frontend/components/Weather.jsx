import "../components.css"

function Weather({ weather, heat }) {
  if (!weather) {
    return <p>loading...</p>
  }

  let wbgtText = ""
  let wbgtColor = ""

  if (heat?.currentWbgt >= 31) {
    wbgtText = "危険"
    wbgtColor = "red"
  } else if (heat?.currentWbgt >= 28) {
    wbgtText = "厳重警戒"
    wbgtColor = "orange"
  } else if (heat?.currentWbgt >= 25) {
    wbgtText = "警戒"
    wbgtColor = "#ffe600"
  } else if (heat?.currentWbgt >= 21) {
    wbgtText = "注意"
    wbgtColor = "#00a9d3"
  } else {
    wbgtText = "安全"
    wbgtColor = "#00ff15"
  }

  return (
    <div className="content">
      <h2>現在の名古屋市の天気</h2>

      <div className="item weather">
        <p>天気</p>
        <h2>{weather.weather}</h2>
      </div>

      <div className="item kionn">
        <p>気温</p>
        <h2>{weather.temp}°C</h2>
      </div>

      <div className="item situdo">
        <p>湿度</p>
        <h2>{weather.humidity}%</h2>
      </div>

      {heat && (
        <div className="item wbgt">
          <h2>WBGT</h2>
          {heat?.currentWbgt !== null ? (
            <>
              <h2 style={{ color: wbgtColor }}>
                {heat.currentWbgt}
              </h2>
              <h3 style={{ color: wbgtColor }}>
                {wbgtText}
              </h3>
            </>
          ) : (
            <h3>データなし</h3>
          )}
        </div>
      )}
    </div>
  )
}

export default Weather