import fs from "fs"
import path from "path"

function getToken(req) {
  const headerToken = req.headers["x-adminpage-token"]
  if (Array.isArray(headerToken)) {
    return headerToken[0]
  }

  return headerToken || req.query.token || req.query.pageToken || ""
}

export default async function handler(req, res) {
  const adminPageToken = process.env.ADMINPAGE_TOKEN || ""
  const token = getToken(req)

  if (!adminPageToken || !token || token !== adminPageToken) {
    return res.status(403).send("Forbidden")
  }

  const filePath = path.join(process.cwd(), "admin.html")
  const html = fs.readFileSync(filePath, "utf8")

  res.setHeader("Content-Type", "text/html; charset=utf-8")
  return res.status(200).send(html)
}