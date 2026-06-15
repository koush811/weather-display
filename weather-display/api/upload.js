import { put } from "@vercel/blob"

export const config = {
  api: {
    bodyParser: false,
  },
}

async function readFile(req) {
  const chunks = []

  for await (const chunk of req) {
    chunks.push(chunk)
  }

  return Buffer.concat(chunks)
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" })
  }

  try {
    const token = req.headers["x-adminpage-token"]

    if (token !== process.env.ADMINPAGE_TOKEN) {
      return res.status(403).json({ error: "Forbidden" })
    }

    const filename = req.headers["x-file-name"]
    const contentType = req.headers["content-type"]

    if (!filename) {
      return res.status(400).json({ error: "filename required" })
    }

    const allowTypes = [
      "application/pdf",
      "image/png",
      "image/jpeg",
    ]

    if (!allowTypes.includes(contentType)) {
      return res.status(400).json({ error: "invalid file type" })
    }

    const body = await readFile(req)

    const blob = await put(
      `uploads/${Date.now()}-${filename}`,
      body,
      {
        access: "public",
        contentType,
      }
    )

    return res.status(200).json(blob)

  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: "upload failed" })
  }
}