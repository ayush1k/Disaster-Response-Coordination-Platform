// controllers/getOfficialUpdates.js
import supabase from '../utils/supabaseClient.js';
import axios from 'axios';
import * as cheerio from 'cheerio';

const CACHE_TTL = 3600 * 1000; // 1 hour

export async function getOfficialUpdates(req, res) {
  const { id } = req.params;
  const cacheKey = `official_updates_${id}`;

  try {
    // 1. Check Supabase cache
    const { data: cachedData } = await supabase
      .from('cache')
      .select('value, expires_at')
      .eq('key', cacheKey)
      .single();

    if (cachedData && new Date(cachedData.expires_at) > new Date()) {
      global.io.emit('official_updates', { disaster_id: id, updates: cachedData.value });
      return res.status(200).json({ updates: cachedData.value });
    }

    // 2. Scrape official website (now using NASA News)
    const response = await axios.get('https://www.nasa.gov/news/');
    const $ = cheerio.load(response.data);

    const updates = [];
    $('h3.title a').each((i, el) => {
      const title = $(el).text().trim();
      const url = $(el).attr('href');
      if (title && url) {
        updates.push({
          title,
          url: url.startsWith('http') ? url : `https://www.nasa.gov${url}`
        });
      }
    });

    // 3. Cache it in Supabase
    await supabase.from('cache').upsert([
      {
        key: cacheKey,
        value: updates,
        expires_at: new Date(Date.now() + CACHE_TTL).toISOString()
      }
    ]);

    // 4. Emit and return
    global.io.emit('official_updates', { disaster_id: id, updates });
    return res.status(200).json({ updates });
  } catch (err) {
    console.error('Error in getOfficialUpdates:', err);
    return res.status(500).json({ error: err.message });
  }
}
