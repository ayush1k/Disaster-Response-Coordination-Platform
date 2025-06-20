import express from 'express';
import cors from 'cors';
import disasterRoutes from './routes/disasters.js';
import geocodeRoutes from './routes/geocode.js';

const app = express();

app.use(cors());
app.use(express.json());

// Mount routes
app.use('/disasters', disasterRoutes);  // e.g., POST /disasters
app.use('/geocode', geocodeRoutes);     // e.g., POST /geocode

export default app;
