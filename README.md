# Disaster-Response-Coordination-Platform
✅ Phase 1: Setup & Environment Preparation

------------------------
Step 1.1 — Setup Folder Structure
Create a clean folder structure:

disaster-platform/
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── utils/
│   ├── services/
│   ├── sockets/
│   ├── app.js
│   ├── server.js
├── frontend/  # Keep this minimal for now
├── .env
├── README.md

-----------------------
Step 1.2 — Install Dependencies
Go to the backend folder and run:

npm init -y
npm install express supabase-js axios dotenv socket.io cors
npm install nodemon --save-dev
Create scripts in package.json:

"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}

----------------------
Step 1.3 — Setup .env File

PORT=5000
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_google_gemini_api_key
MAPBOX_KEY=your_mapbox_key (if using Mapbox)

---------------------------
🔁 Phase 2: Supabase Setup
Step 2.1 — Create a Free Supabase Project
Go to supabase.com → create project.

----------------------------

Step 2.2 — Setup Tables in Supabase
Create the following tables via SQL Editor:


-- disasters
CREATE TABLE disasters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  location_name TEXT,
  location GEOGRAPHY,
  description TEXT,
  tags TEXT[],
  owner_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  audit_trail JSONB
);

-- reports
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  disaster_id UUID REFERENCES disasters(id),
  user_id TEXT,
  content TEXT,
  image_url TEXT,
  verification_status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- resources
CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  disaster_id UUID REFERENCES disasters(id),
  name TEXT,
  location_name TEXT,
  location GEOGRAPHY,
  type TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- cache
CREATE TABLE cache (
  key TEXT PRIMARY KEY,
  value JSONB,
  expires_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX disasters_location_idx ON disasters USING GIST(location);
CREATE INDEX resources_location_idx ON resources USING GIST(location);
CREATE INDEX disasters_tags_idx ON disasters USING GIN(tags);

---------------------------
