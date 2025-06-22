import fetch from 'node-fetch';
import supabase from '../utils/supabaseClient.js';

// ------------------ Location Extraction Utility ------------------

function extractCandidateLocation(description) {
  const regex = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,3})\b/g;
  const matches = [...description.matchAll(regex)].map(m => m[1]);

  const blacklist = [
    'Severe', 'Heavy', 'Massive', 'Extreme', 'Tsunami', 'Flash',
    'Cold', 'Powerful', 'Warning', 'Fire', 'Flood', 'Storm',
    'Rainfall', 'Heatwave', 'Thunderstorm', 'Outages', 'Disaster'
  ];

  const filtered = matches.filter(
    phrase => !blacklist.includes(phrase.split(' ')[0])
  );

  const priority = [
    'Delhi', 'Mumbai', 'Patna', 'Kathmandu', 'Guwahati', 'Shimla',
    'Port Blair', 'Munnar', 'Itanagar', 'Bhuj', 'Surat', 'Jaipur',
    'Kanyakumari', 'Chennai', 'Visakhapatnam', 'Darjeeling', 'Dehradun',
    'Kolkata', 'Leh', 'Bandipur'
  ];

  for (const loc of filtered) {
    if (priority.some(p => loc.toLowerCase().includes(p.toLowerCase()))) {
      return loc;
    }
  }

  return filtered[0] || null;
}

// ------------------ POST /disasters ------------------

export async function createDisaster(req, res) {
  const { title, description, tags, owner_id } = req.body;

  if (!title || !description || !owner_id) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Step 1: Extract location
  const locationCandidate = extractCandidateLocation(description);
  let location_name = null;
  let latitude = null;
  let longitude = null;

  if (locationCandidate) {
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationCandidate)}&limit=1`;
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (DisasterResponseBot; contact: ayushkumar47834@email.com)'
        }
      });

      const text = await response.text();

      try {
        const data = JSON.parse(text);

        if (data && data.length > 0) {
          const loc = data.find(d => d.display_name.includes('India')) || data[0];
          location_name = loc.display_name;
          latitude = parseFloat(loc.lat);
          longitude = parseFloat(loc.lon);
        }
      } catch (parseError) {
        console.error('Error parsing geocoding response:', text);
      }
    } catch (err) {
      console.error('Geocoding error:', err.message);
    }
  }

  // Step 2: Insert into Supabase
  console.log('Inserting disaster with values:', {
    title,
    description,
    tags,
    owner_id,
    location_name,
    latitude,
    longitude
  });

  const { data, error } = await supabase.from('disasters').insert([{
    title,
    description,
    tags,
    owner_id,
    location_name,
    latitude,
    longitude,
    audit_trail: [{
      action: 'create',
      user_id: owner_id,
      timestamp: new Date().toISOString()
    }]
  }]).select();

  if (error) return res.status(500).json({ error: error.message });

  const inserted = data?.[0];
  if (inserted && global.io) {
    global.io.emit('disaster_updated', { type: 'create', disaster: inserted });
  }

  res.status(201).json(inserted);
}

// ------------------ GET /disasters ------------------

export async function getDisasters(req, res) {
  const tag = req.query.tag;

  let query = supabase.from('disasters').select('*');

  if (tag) {
    query = query.contains('tags', [tag]);
  }

  const { data, error } = await query;

  if (error) return res.status(500).json({ error: error.message });

  res.status(200).json(data);
}

// ------------------ PUT /disasters/:id ------------------

export async function updateDisaster(req, res) {
  const { id } = req.params;
  const updates = req.body;

  updates.audit_trail = [{
    action: 'update',
    user_id: updates.owner_id || 'unknown',
    timestamp: new Date().toISOString()
  }];

  const { data, error } = await supabase
    .from('disasters')
    .update(updates)
    .eq('id', id)
    .select();

  if (error) return res.status(500).json({ error: error.message });

  if (global.io && data?.[0]) {
    global.io.emit('disaster_updated', { type: 'update', disaster: data[0] });
  }

  res.json(data[0]);
}

// ------------------ DELETE /disasters/:id ------------------

export async function deleteDisaster(req, res) {
  const { id } = req.params;

  const { error } = await supabase.from('disasters').delete().eq('id', id);

  if (error) return res.status(500).json({ error: error.message });

  if (global.io) {
    global.io.emit('disaster_updated', { type: 'delete', id });
  }

  res.json({ message: 'Disaster deleted' });
}
