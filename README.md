# 🌐 Disaster Response Coordination Platform (Backend)

A real-time backend platform to coordinate disaster relief efforts using geospatial intelligence, AI, and open data. Built with **Node.js**, **Express**, **Supabase (PostgreSQL + PostGIS)**, **Socket.IO**, and the **Gemini API**.

---

## ✅ Features Implemented So Far

### 1. 📦 Disaster Management (CRUD)
- Create, read, update, and delete disaster reports.
- Each disaster contains:
  - `title`, `description`, `location_name`, `lat`, `lon`, `tags`, `created_at`, `owner_id`
- Data stored in Supabase PostgreSQL with PostGIS support.
- Emits `disaster_updated` WebSocket events on change.

### 2. 📍 Location Extraction & Geocoding
- Extracts location name from disaster descriptions using **Gemini API**.
- Geocodes location using **Nominatim (OpenStreetMap)**.
- Handles empty or irrelevant descriptions gracefully.

### 3. 🌐 WebSockets (Real-Time)
- Setup using **Socket.IO**.
- Emits:
  - `disaster_updated` when disasters change.
  - `social_media_updated` when new reports arrive.

### 4. 📢 Social Media Monitoring (Mocked)
- Endpoint: `GET /disasters/:id/social-media`
- Returns simulated tweets/posts for disasters.
- Emits live updates via `social_media_updated`.

### 5. 🗺️ Geospatial Resource Mapping
- Endpoint: `GET /disasters/:id/resources?lat=...&lon=...`
- Uses **PostGIS** and Supabase RPC function `get_nearby_resources` to fetch shelters, food, hospitals within 10 km.

---

## 🔧 Setup Instructions

### 1. Clone this Repository
```bash
git clone https://github.com/yourusername/disaster-platform.git
cd disaster-platform
 


Install Dependencies
npm install


Configure Environment Variables
Create a .env file:
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
GEMINI_API_KEY=your-gemini-api-key
PORT=3000


Run the Server
node index.js


📌 API Endpoints
✅ Disaster CRUD
POST /disasters

GET /disasters/:id

PUT /disasters/:id

DELETE /disasters/:id

✅ Geocoding
POST /geocode
Request: { description: "Bridge collapsed near Delhi" }
Response: { location_name: "Delhi", lat: 28.61, lon: 77.23 }

✅ Social Media Reports (Mocked)
GET /disasters/:id/social-media
Returns mock Twitter-style posts.

✅ Nearby Resources
GET /disasters/:id/resources?lat=...&lon=...
Returns shelters, hospitals, etc. from Supabase.

🧩 Tech Stack
Backend: Node.js, Express.js

Database: Supabase (PostgreSQL + PostGIS)

Real-time: Socket.IO

AI APIs: Google Gemini (for location extraction)

Geocoding: Nominatim (OpenStreetMap)



