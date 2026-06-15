import { useEffect, useState } from "react"

function File() {
  const [file, setFile] = useState(null)

  useEffect(() => {
    const fetchFile = async () => {
      try {
        const res = await fetch("/api/file")

        if (!res.ok) {
          setFile(null)
          return
        }

        const data = await res.json()
        setFile(data)

      } catch (err) {
        console.error(err)
      }
    }

    fetchFile()
  }, [])

  if (!file) {
    return (
      <div className="item">
        <h2>配布資料</h2>
        <p>資料なし</p>
      </div>
    )
  }

  const isPdf =
    file.contentType === "application/pdf"

  return (
    <div className="item">
      <h2>配布資料</h2>

      {isPdf ? (
        <iframe
          src={file.url}
          width="100%"
          height="800"
          title="pdf"
        />
      ) : (
        <img
          src={file.url}
          alt=""
          style={{
            width: "100%",
            maxWidth: "1000px",
          }}
        />
      )}
    </div>
  )
}

export default File