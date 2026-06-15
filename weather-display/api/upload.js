import { put } from "@vercel/blob";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({
        error: "Method Not Allowed",
      });
    }

    const token = req.headers["x-adminpage-token"];

    if (token !== process.env.ADMINPAGE_TOKEN) {
      return res.status(403).json({
        error: "Forbidden",
      });
    }

    const filename = decodeURIComponent(
      req.headers["x-file-name"] || "file"
    );

    const blob = await put(
        `uploads/${filename}`,
        req,
    {
        access: "public",
    }
    )

    return res.status(200).json(blob);
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: err.message,
      stack: err.stack,
    });
  }
}