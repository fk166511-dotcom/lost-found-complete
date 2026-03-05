// Vercel Serverless Function
// /api/match  — Face++ compare
// /api/upload — Cloudinary photo upload

const CLOUDINARY_CLOUD  = 'dmvzxdqv4';
const CLOUDINARY_KEY    = '836199428744759';
const CLOUDINARY_SECRET = 'BuZj8AHMA7_OtWp3XFbMfoq1VDU';

function sha1(str) {
  const crypto = require('crypto');
  return crypto.createHash('sha1').update(str).digest('hex');
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const path = req.url.split('?')[0];

  // == UPLOAD TO CLOUDINARY ==
  if (path.endsWith('/upload')) {
    try {
      const { image_base64, folder } = req.body;
      if (!image_base64) return res.status(400).json({ error: 'Image required' });

      const timestamp  = Math.floor(Date.now() / 1000);
      const folderName = folder || 'lost-found';
      const signature  = sha1(`folder=${folderName}&timestamp=${timestamp}${CLOUDINARY_SECRET}`);

      const form = new URLSearchParams();
      form.append('file',      image_base64);
      form.append('api_key',   CLOUDINARY_KEY);
      form.append('timestamp', timestamp);
      form.append('folder',    folderName);
      form.append('signature', signature);

      const r    = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`, { method: 'POST', body: form });
      const data = await r.json();

      if (data.error) return res.status(400).json({ error: data.error.message });
      return res.status(200).json({ url: data.secure_url, public_id: data.public_id });

    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // == FACE++ MATCH ==
  if (path.endsWith('/match')) {
    try {
      const { img1_url, img2_url, img1_base64, img2_base64 } = req.body;
      const FACEPP_KEY    = process.env.FACEPP_API_KEY;
      const FACEPP_SECRET = process.env.FACEPP_API_SECRET;

      if (!FACEPP_KEY) return res.status(500).json({ error: 'Face++ credentials missing' });

      const form = new URLSearchParams();
      form.append('api_key',    FACEPP_KEY);
      form.append('api_secret', FACEPP_SECRET);

      if (img1_url && img2_url) {
        form.append('image_url1', img1_url);
        form.append('image_url2', img2_url);
      } else {
        form.append('image_base64_1', (img1_base64 || '').replace(/^data:image\/\w+;base64,/, ''));
        form.append('image_base64_2', (img2_base64 || '').replace(/^data:image\/\w+;base64,/, ''));
      }

      const r    = await fetch('https://api-us.faceplusplus.com/facepp/v3/compare', { method: 'POST', body: form, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
      const data = await r.json();

      if (data.error_message) return res.status(200).json({ score: 0, error: data.error_message });
      return res.status(200).json({ score: Math.round(data.confidence || 0) });

    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(404).json({ error: 'Route not found' });
  }
    
