import "../components.css"

function Alert({ heat }) {
  return (
    <div className="item alert">
      <h2>熱中症警戒アラート</h2>

      <h3>
        {heat?.alertMessage ?? "データなし"}
      </h3>
    </div>
  )
}

export default Alert