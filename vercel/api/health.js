// Vercel API Route - Health Check
// Original: server/app.js -> app.get('/health', ...)
export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Кэширование на 60 секунд для CDN
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=30')
  res.setHeader('Vercel-CDN-Cache-Control', 'max-age=60')

  res.status(200).json({
    ok: true,
    timestamp: new Date().toISOString(),
  })
}
