import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

// Common non-location words to ignore
const blacklist = [
  'Severe', 'Heavy', 'Massive', 'Extreme', 'Tsunami', 'Flash',
  'Cold', 'Powerful', 'Warning', 'Fire', 'Flood', 'Storm',
  'Rainfall', 'Heatwave', 'Thunderstorm', 'Outages', 'Disaster'
];

// Function to extract location from description
function extractCandidateLocation(description) {
  const regex = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,3})\b/g;
  const matches = [...description.matchAll(regex)].map(m => m[1]);

  // Filter out blacklist words
  const filteredMatches = matches.filter(
    phrase => !blacklist.includes(phrase.split(' ')[0])
  );

  // Priority cities (case-insensitive matching)
  const priority = [
    'Delhi', 'Mumbai', 'Patna', 'Kathmandu', 'Guwahati', 'Shimla',
    'Port Blair', 'Munnar', 'Itanagar', 'Bhuj', 'Surat', 'Jaipur',
    'Kanyakumari', 'Chennai', 'Visakhapatnam', 'Darjeeling', 'Dehradun',
    'Kolkata', 'Leh', 'Bandipur'
  ];

  for (const loc of filteredMatches) {
    if (priority.some(p => loc.toLowerCase().includes(p.toLowerCase()))) {
      return loc;
    }
  }

  return filteredMatches[0] || null;
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

    const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationCandidate)}&limit=5`;
    const response = await fetch(nominatimUrl, {
      headers: { 'User-Agent': 'DisasterResponseApp/1.0' },
    });

    const data = await response.json();
    if (!data.length) {
      return res.status(404).json({ error: 'No results from geocoding API' });
    }

    // Prefer results containing "India"
    const preferred = data.find(loc => loc.display_name.includes('India')) || data[0];

    res.json({
      location_name: preferred.display_name,
      latitude: parseFloat(preferred.lat),
      longitude: parseFloat(preferred.lon),
    });
  } catch (error) {
    console.error('Geocoding Error:', error.message);
    res.status(500).json({ error: 'Server error during geocoding' });
  }
});

export default router;

