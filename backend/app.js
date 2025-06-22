import express from 'express';
import cors from 'cors';
import disasterRoutes from './routes/disasters.js';
import geocodeRoutes from './routes/geocode.js';
import resourceRoutes from './routes/resources.js';

const app = express();

app.use(cors());
app.use(express.json());

// Mount routes
app.use('/disasters', disasterRoutes);  // e.g., POST /disasters
app.use('/geocode', geocodeRoutes);     // e.g., POST /geocode
app.use('/disasters', resourceRoutes);

export default app;
