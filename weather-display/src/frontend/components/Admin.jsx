import { useState } from "react"

function Admin() {
  const [message, setMessage] = useState("")
  const [level, setLevel] = useState("warning")

  const submit = async () => {
    try {
      const res = await fetch("/api/alert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message,
          level
        })
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text)
      }

      alert("更新しました")
    } catch (error) {
      console.error(error)
      alert("更新に失敗しました")
    }
  }

  return (
    <div>
      <h1>管理画面</h1>

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="通知文"
      />

      <select
        value={level}
        onChange={(e) => setLevel(e.target.value)}
      >
        <option value="warning">警戒</option>
        <option value="danger">危険</option>
      </select>

      <button onClick={submit}>
        更新
      </button>
    </div>
  )
}

export default Admin