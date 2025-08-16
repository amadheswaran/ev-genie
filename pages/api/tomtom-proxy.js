// pages/api/tomtom-proxy.js

export default async function handler(req, res) {
  try {
    const { lat, lon, radius = 15000, limit = 50 } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({ error: 'lat & lon required' });
    }

    const apiKey = process.env.TOMTOM_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'TomTom API key not configured' });
    }

    // Use TomTom categorySearch for EV charging POIs (category param may vary)
    // This URL is conservative and returns POIs near the coords
    const url = `https://api.tomtom.com/search/2/categorySearch/electric%20vehicle%20station.json?key=${apiKey}&lat=${lat}&lon=${lon}&radius=${radius}&limit=${limit}`;

    const r = await fetch(url);
    if (!r.ok) {
      const text = await r.text();
      console.error('TomTom returned error', r.status, text);
      return res.status(502).json({ error: 'TomTom API error' });
    }
    const data = await r.json();
    // Return direct TOMTOM response (frontend normalizes)
    return res.status(200).json(data);
  } catch (err) {
    console.error('Proxy error', err);
    return res.status(500).json({ error: 'Internal proxy error' });
  }
}
