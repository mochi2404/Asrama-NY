export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const backendUrl = process.env.BACKEND_URL?.trim().replace(/\/$/, '');
  if (!backendUrl) {
    return res.status(503).json({ success: false, message: 'BACKEND_URL belum diatur di Vercel' });
  }

  try {
    const response = await fetch(`${backendUrl}/api/backend`, {
      method: 'POST',
      headers: { 'Content-Type': req.headers['content-type'] || 'application/json' },
      body: JSON.stringify(req.body),
      signal: AbortSignal.timeout(25000),
    });
    const body = await response.text();
    res.status(response.status);
    res.setHeader('Content-Type', response.headers.get('content-type') || 'application/json; charset=utf-8');
    return res.send(body);
  } catch (error) {
    return res.status(502).json({
      success: false,
      message: 'Vercel tidak dapat menghubungi backend. Periksa BACKEND_URL dan port publik server.',
    });
  }
}
