// Vercel API Route - Health Check
// Original: server/app.js -> app.get('/health', ...)
export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.status(200).json({ ok: true, timestamp: new Date().toISOString() });
}
