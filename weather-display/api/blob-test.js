export default function handler(req, res) {
  res.status(200).json({
    cwd: process.cwd(),
    allKeys: Object.keys(process.env).filter(
      (k) => k.includes("BLOB") || k.includes("API")
    ),
    apiKey: process.env.API_KEY,
    blobStore: process.env.BLOB_STORE_ID,
    hasBlobToken: !!process.env.BLOB_READ_WRITE_TOKEN,
  })
}
