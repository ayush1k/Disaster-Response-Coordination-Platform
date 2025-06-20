import express from 'express';
import axios from 'axios';

const router = express.Router();

router.post('/', async (req, res) => {
  const { description } = req.body;

  try {
    const prompt = `
Extract the most relevant location mentioned in the following description and return its name along with its approximate latitude and longitude as a JSON object with the fields: "location_name", "latitude", and "longitude".

Description: "${description}"

Return only valid JSON, no text before or after it.
    `.trim();

    console.log("🔍 Sending prompt to Gemini:\n", prompt);

    const geminiResponse = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${process.env.GEMINI_API_KEY}`
,
      {
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      }
    );

    const raw = geminiResponse?.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    console.log("📥 Gemini Raw Response:\n", raw);

    const match = raw.match(/\{[\s\S]*?\}/);
    if (!match) throw new Error('No JSON object found in response');

    const parsed = JSON.parse(match[0]);

    if (!parsed.location_name || !parsed.latitude || !parsed.longitude) {
      throw new Error('Incomplete geocode data from Gemini');
    }

    res.json(parsed);

  } catch (error) {
    console.error('❌ Gemini Geocode Error:', error.message);
    res.status(500).json({ error: 'Failed to extract location or coordinates' });
  }
});

export default router;
