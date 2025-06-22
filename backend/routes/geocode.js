import express from 'express';
import fetch from 'node-fetch';
import nlp from 'compromise';

const router = express.Router();

// Improved NLP-based location extractor
function extractCandidateLocation(text) {
  const doc = nlp(text);

  // Try to extract proper nouns (likely place names)
  let candidates = doc
    .nouns()
    .if('#ProperNoun')
    .out('array');

  // Clean up: remove stopwords or prepositions like "due", "because"
  const blacklist = ['there', 'here', 'someone', 'anywhere', 'due', 'because', 'at', 'in', 'on', 'to'];
  candidates = candidates.map(word => word.trim().split(' ')[0]); // Take first word only
  candidates = candidates.filter(
    word => word && !blacklist.includes(word.toLowerCase())
  );

  return candidates.length > 0 ? candidates[0] : null;
}

// POST /geocode
router.post('/', async (req, res) => {
  const { description } = req.body;

  const location = extractCandidateLocation(description);
  console.log('🧠 Extracted location:', location);

  if (!location) {
    return res.status(400).json({ error: 'No valid location found in description' });
  }

  // Use Nominatim to geocode the location
  const nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
    location
  )}&format=json&limit=1`;

  try {
    const response = await fetch(nominatimUrl, {
      headers: { 'User-Agent': 'DisasterResponsePlatform/1.0' }
    });
    const data = await response.json();

    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'No results from geocoding API' });
    }

    const place = data[0];
    res.json({
      location_name: place.display_name,
      latitude: parseFloat(place.lat),
      longitude: parseFloat(place.lon)
    });
  } catch (err) {
    console.error('Nominatim error:', err.message);
    res.status(500).json({ error: 'Geocoding service failed' });
  }
});

export default router;
