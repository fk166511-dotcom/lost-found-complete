// Vercel Serverless Function — Face++ Proxy
// POST /api/match
// Body: { img1_base64, img2_base64 }

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { img1_base64, img2_base64 } = req.body;

    if (!img1_base64 || !img2_base64) {
      return res.status(400).json({ error: 'Both images required' });
    }

    const FACEPP_KEY    = process.env.FACEPP_API_KEY;
    const FACEPP_SECRET = process.env.FACEPP_API_SECRET;

    if (!FACEPP_KEY || !FACEPP_SECRET) {
      return res.status(500).json({ error: 'Face++ credentials not configured' });
    }

    // Build form data for Face++ API
    const formData = new URLSearchParams();
    formData.append('api_key',        FACEPP_KEY);
    formData.append('api_secret',     FACEPP_SECRET);
    formData.append('image_base64_1', img1_base64.replace(/^data:image\/\w+;base64,/, ''));
    formData.append('image_base64_2', img2_base64.replace(/^data:image\/\w+;base64,/, ''));

    const response = await fetch('https://api-us.faceplusplus.com/facepp/v3/compare', {
      method: 'POST',
      body:   formData,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    const data = await response.json();

    if (data.error_message) {
      // Face++ error (e.g. no face detected)
      return res.status(200).json({ score: 0, error: data.error_message });
    }

    const score = Math.round(data.confidence || 0);
    return res.status(200).json({ score, thresholds: data.thresholds });

  } catch (err) {
    console.error('Face++ API error:', err);
    return res.status(500).json({ error: 'Internal server error', detail: err.message });
  }
}
