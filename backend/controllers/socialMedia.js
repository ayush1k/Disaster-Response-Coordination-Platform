// controllers/socialMedia.js
export async function getDisasterSocialMediaReports(req, res) {
  const { id } = req.params;

  // You could later fetch real data or use Gemini/Bsky APIs here
  const mockReports = [
    {
      disaster_id: id,
      user: "citizen1",
      post: "#floodrelief Need urgent help in Guwahati city center!",
      timestamp: new Date().toISOString()
    },
    {
      disaster_id: id,
      user: "volunteer42",
      post: "Supplies available near Guwahati railway station. #help",
      timestamp: new Date().toISOString()
    }
  ];

  // Emit update to clients via WebSocket
  global.io.emit('social_media_updated', { disaster_id: id, reports: mockReports });

  res.status(200).json({ reports: mockReports });
}
