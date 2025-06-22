import supabase from '../utils/supabaseClient.js';



export async function getNearbyResources(req, res) {
  const { id } = req.params;
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: "Missing lat/lon query params" });
  }

  try {
    const { data, error } = await supabase.rpc('get_nearby_resources', {
      disasterid: id,
      user_lat: parseFloat(lat),
      user_lon: parseFloat(lon),
      radius: 10000 // 10km
    });

    if (error) throw error;

    global.io.emit('resources_updated', {
      disaster_id: id,
      lat,
      lon,
      resources: data
    });

    return res.status(200).json({ resources: data });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
