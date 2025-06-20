const supabase = require('../utils/supabaseClient');

// POST /disasters
const createDisaster = async (req, res) => {
  const { title, location_name, description, tags, owner_id } = req.body;

  const { data, error } = await supabase.from('disasters').insert([{
    title,
    location_name,
    description,
    tags,
    owner_id,
    audit_trail: [{
      action: 'create',
      user_id: owner_id,
      timestamp: new Date().toISOString()
    }]
  }]).select(); // ensures Supabase returns inserted rows

  if (error) return res.status(500).json({ error: error.message });

  if (!data || data.length === 0) {
    return res.status(500).json({ error: 'Insert failed, no data returned' });
  }

  global.io.emit('disaster_updated', { type: 'create', disaster: data[0] });

  res.status(201).json(data[0]);
};

// GET /disasters?tag=flood
const getDisasters = async (req, res) => {
  const tag = req.query.tag;

  let query = supabase.from('disasters').select('*');

  if (tag) {
    query = query.contains('tags', [tag]); // array contains
  }

  const { data, error } = await query;

  if (error) return res.status(500).json({ error: error.message });

  res.status(200).json(data);
};

// PUT /disasters/:id
const updateDisaster = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  // Fetch existing audit trail
  const { data: existingData, error: fetchError } = await supabase
    .from('disasters')
    .select('audit_trail')
    .eq('id', id)
    .single();

  if (fetchError) return res.status(500).json({ error: fetchError.message });

  const newAudit = {
    action: 'update',
    user_id: updates.owner_id || 'unknown',
    timestamp: new Date().toISOString()
  };

  const updatedTrail = Array.isArray(existingData.audit_trail)
    ? [...existingData.audit_trail, newAudit]
    : [newAudit];

  updates.audit_trail = updatedTrail;

  const { data, error } = await supabase
    .from('disasters')
    .update(updates)
    .eq('id', id)
    .select(); // return updated rows

  if (error) return res.status(500).json({ error: error.message });

  if (!data || data.length === 0) {
    return res.status(404).json({ error: 'Disaster not found or update failed' });
  }

  global.io.emit('disaster_updated', { type: 'update', disaster: data[0] });

  res.json(data[0]);
};

// DELETE /disasters/:id
const deleteDisaster = async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase.from('disasters').delete().eq('id', id);

  if (error) return res.status(500).json({ error: error.message });

  global.io.emit('disaster_updated', { type: 'delete', id });

  res.json({ message: 'Disaster deleted successfully' });
};

module.exports = {
  createDisaster,
  getDisasters,
  updateDisaster,
  deleteDisaster
};
