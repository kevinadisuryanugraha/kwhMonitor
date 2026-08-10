// Vercel Serverless Function — CORS Proxy for KWh Meter API
export default async function handler(req, res) {
  const deviceId = req.query.id || 'E83DC19F498C';
  const targetUrl = `https://kwhmeter2.pojiweb.online/api/web/data?id=${encodeURIComponent(deviceId)}`;

  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'KWh-Meter-Monitoring/1.0',
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        error: `Remote API responded with status ${response.status}`,
      });
    }

    const data = await response.json();
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(data);
  } catch (error) {
    res.status(502).json({
      success: false,
      error: 'Failed to fetch from target KWh meter API endpoint',
      details: error?.message || String(error),
    });
  }
}
