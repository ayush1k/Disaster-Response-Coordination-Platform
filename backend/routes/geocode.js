import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

function extractCandidateLocation(description) {
  const regex = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,3})\b/g;
  const matches = [...description.matchAll(regex)].map(m => m[1]);

  const priority = [
    'Delhi', 'Mumbai', 'Patna', 'Kathmandu', 'Guwahati', 'Shimla',
    'Port Blair', 'Munnar', 'Itanagar', 'Bhuj'
  ];

  for (const loc of matches) {
    if (priority.some(p => loc.toLowerCase().includes(p.toLowerCase()))) {
      return loc;
    }
  }

  return matches[0] || null;
}

router.post('/', async (req, res) => {
  try {
    const { description } = req.body;
    if (!description) {
      return res.status(400).json({ error: 'Missing description field' });
    }

    const locationCandidate = extractCandidateLocation(description);
    if (!locationCandidate) {
      return res.status(400).json({ error: 'Could not extract a location' });
    }

    console.log('🧠 Extracted location:', locationCandidate);

    const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationCandidate)}&limit=1`;
    const response = await fetch(nominatimUrl, {
      headers: { 'User-Agent': 'DisasterResponseApp/1.0' },
    });

    const data = await response.json();
    if (!data.length) {
      return res.status(404).json({ error: 'No results from geocoding API' });
    }

    const result = data[0];
    res.json({
      location_name: result.display_name,
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
    });
  } catch (error) {
    console.error('Geocoding Error:', error.message);
    res.status(500).json({ error: 'Server error during geocoding' });
  }
});

export default router;
