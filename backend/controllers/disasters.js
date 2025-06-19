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
    audit_trail: [{ action: 'create', user_id: owner_id, timestamp: new Date().toISOString() }]
  }]);

  if (error) return res.status(500).json({ error: error.message });

  global.io.emit('disaster_updated', { type: 'create', disaster: data[0] });

  res.status(201).json(data[0]);
};

// GET /disasters?tag=flood
const getDisasters = async (req, res) => {
  const tag = req.query.tag;

  let query = supabase.from('disasters').select('*');

  if (tag) {
    query = query.contains('tags', [tag]);
  }

  const { data, error } = await query;

  if (error) return res.status(500).json({ error: error.message });

  res.status(200).json(data);
};

// PUT /disasters/:id
const updateDisaster = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  // Add audit trail update
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

  global.io.emit('disaster_updated', { type: 'update', disaster: data[0] });

  res.json(data[0]);
};

// DELETE /disasters/:id
const deleteDisaster = async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase.from('disasters').delete().eq('id', id);

  if (error) return res.status(500).json({ error: error.message });

  global.io.emit('disaster_updated', { type: 'delete', id });

  res.json({ message: 'Disaster deleted' });
};

module.exports = {
  createDisaster,
  getDisasters,
  updateDisaster,
  deleteDisaster
};
