function getToken(req) {
  const headerToken = req.headers["x-adminpage-token"]
  if (Array.isArray(headerToken)) {
    return headerToken[0]
  }

  return headerToken || req.query.token || req.query.pageToken || ""
}

export default async function handler(req, res) {
  const adminPageToken = process.env.ADMINPAGE_TOKEN || ""

  if (req.method === "POST") {
    const token = getToken(req)
    if (!adminPageToken || !token || token !== adminPageToken) {
      return res.status(403).json({ error: "Forbidden" })
    }

    return res.status(200).json({ success: true })
  }

  if (req.method === "GET") {
    return res.redirect(302, "/admin/index.html")
  }

  res.setHeader("Allow", "GET, POST")
  return res.status(405).json({ error: "Method Not Allowed" })
}