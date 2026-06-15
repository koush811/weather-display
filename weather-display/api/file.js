import { list } from "@vercel/blob"

export default async function handler(req, res) {
  try {
    const { blobs } = await list({
      prefix: "uploads/",
    })

    if (!blobs.length) {
      return res.status(404).json({
        error: "file not found",
      })
    }

    const latest = blobs.sort(
      (a, b) =>
        new Date(b.uploadedAt) -
        new Date(a.uploadedAt)
    )[0]

    return res.status(200).json({
      url: latest.url,
      pathname: latest.pathname,
      contentType: latest.contentType,
      uploadedAt: latest.uploadedAt,
    })

  } catch (err) {
    console.error(err)
    return res.status(500).json({
      error: "load failed",
    })
  }
}