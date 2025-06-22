import express from 'express';
const router = express.Router();
import fetch from 'node-fetch';

// Simple location extractor using known cities (extendable)
function extractLocation(description) {
  const knownPlaces = ['Guwahati', 'Delhi', 'Mumbai', 'Chennai', 'Nainital', 'Kolkata', 'Lucknow'];
  for (const place of knownPlaces) {
    if (description.toLowerCase().includes(place.toLowerCase())) {
      return place;
    }
  }
  return null;
}

router.post('/', async (req, res) => {
  const { description } = req.body;
  const locationName = extractLocation(description);

  if (!locationName) {
    return res.status(400).json({ error: 'Location not found' });
  }

  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(locationName)}&format=json&limit=1`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Disaster-Response-App (youremail@example.com)'
      }
    });

    const data = await response.json();

    if (data.length === 0) {
      return res.status(404).json({ error: 'Location not found' });
    }

    const { lat, lon } = data[0];

    res.json({
      location_name: locationName,
      latitude: parseFloat(lat),
      longitude: parseFloat(lon)
    });
  } catch (error) {
    res.status(500).json({ error: 'Geocoding failed', details: error.message });
  }
});

export default router;
