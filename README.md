# 🌍 Disaster Response Coordination Platform (Backend)

A backend-heavy MERN stack application designed to aid real-time disaster management and response through data aggregation, geospatial queries, and live updates. This README documents progress until **Step 4: Real-Time Social Media Monitoring**.

---

## ✅ Features Implemented (as per assignment)

### 1. Disaster Data Management (CRUD)
- **POST /disasters** – Create a new disaster.
- **GET /disasters** – List all disasters, supports filter by tag.
- **PUT /disasters/:id** – Update an existing disaster.
- **DELETE /disasters/:id** – Delete a disaster.
- Disaster model includes:
  - `title`
  - `location_name`
  - `description`
  - `tags`
  - `owner_id` (mock auth)
  - `created_at`

### 2. Location Extraction and Geocoding
- **POST /geocode**
  - Uses **Google Gemini API** to extract location name from a disaster description.
  - Uses **OpenStreetMap Nominatim API** to convert extracted location into `lat/lon`.
- Integration steps:
  - Gemini API prompt: _“Extract location from: [description]”_
  - Nominatim endpoint: `https://nominatim.openstreetmap.org/search?q=...&format=json&limit=1`

### 3. WebSocket Setup
- **Socket.IO** is configured and emits real-time updates.
- Global `io` object set up for use in controllers.
- Events:
  - `disaster_updated`
  - `social_media_updated` (already implemented)

### 4. Real-Time Social Media Monitoring
- **GET /disasters/:id/social-media**
  - Mock implementation using fake reports simulating posts like:
    - `"Need help in Guwahati #floodrelief"`
    - `"Supplies available near Guwahati railway station"`
  - Emits `social_media_updated` with structured JSON.
- Response example:
```json
{
  "reports": [
    {
      "disaster_id": "c979...",
      "user": "citizen1",
      "post": "#floodrelief Need urgent help in Guwahati city center!",
      "timestamp": "2025-06-22T13:56:47.862Z"
    },
    {
      "disaster_id": "c979...",
      "user": "volunteer42",
      "post": "Supplies available near Guwahati railway station. #help",
      "timestamp": "2025-06-22T13:56:47.863Z"
    }
  ]
}


--------------
