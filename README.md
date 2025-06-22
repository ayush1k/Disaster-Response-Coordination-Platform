# 🌍 Disaster Response Coordination Platform

This is a backend-heavy MERN stack application built to assist in real-time disaster management. It leverages geospatial data, AI location extraction, and mapping services to track and respond to ongoing disasters efficiently.

---

## ✅ Completed Steps (Up to Step 4)

### 1. 🚀 Project Setup
- Backend powered by **Node.js**, **Express.js**
- PostgreSQL database hosted on **Supabase**
- Realtime updates enabled via **Socket.IO**
- Environment variables stored in `.env` (not committed)

### 2. 📦 Disaster Data Management (CRUD)
- REST API for disaster operations:
  - `POST /disasters`: Create a disaster
  - `GET /disasters`: Get all disasters (supports `?tag=` filter)
  - `PUT /disasters/:id`: Update disaster details
  - `DELETE /disasters/:id`: Delete a disaster
- Each disaster stores:
  - `title`, `description`, `tags`, `owner_id`
  - `created_at`, `audit_trail` (tracks `create`, `update`, `delete` actions with `user_id` and `timestamp`)

### 3. 🔐 Mock Authentication
- Hardcoded users:
  - `netrunnerX` (admin)
  - `reliefAdmin` (contributor)
- No real authentication yet (for testing only)

### 4. 📍 Location Extraction + Geocoding
- 🧠 **Google Gemini API** used to extract location from unstructured descriptions
  - Prompt example: `Extract location from: "There has been a severe flood in Guwahati due to heavy rainfall."`
- 🗺️ **Nominatim (OpenStreetMap)** used to convert location names to geographic coordinates
  - Geocoding API: `https://nominatim.openstreetmap.org/search?q=<query>&format=json&limit=1`
- Extracted location and coordinates (`latitude`, `longitude`) stored in Supabase under each disaster
- Example disaster entry after geocoding:
  ```json
  {
    "title": "Flood in Guwahati",
    "location_name": "Guwahati, Kamrup Metropolitan, Assam, India",
    "latitude": 26.1806,
    "longitude": 91.7539
  }
 









 --------------------------------------- 
 testing step 4 
 Create a disaster with embedded location in description:
 curl -X POST http://localhost:5000/disasters \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Flood in Guwahati",
    "description": "There has been a severe flood in Guwahati due to heavy rainfall.",
    "tags": ["flood", "northeast"],
    "owner_id": "user_123"
  }'


  Expected Output:

Disaster stored with location_name, latitude, and longitude

audit_trail shows create action by user_123


