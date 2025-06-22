import express from 'express';
import cors from 'cors';

import disasterRoutes from './routes/disasters.js';
import geocodeRoutes from './routes/geocode.js';
import resourceRoutes from './routes/resources.js';
import disasterRoutesAlt from './routes/disasterRoutes.js'; // Rename one of these!
import officialUpdatesRoutes from './routes/officialUpdates.js'; // ✅ add this

const app = express();

app.use(cors());
app.use(express.json());

app.use('/disasters', disasterRoutes);
app.use('/disasters', resourceRoutes);
app.use('/disasters', officialUpdatesRoutes); // ✅ mount here
app.use('/geocode', geocodeRoutes);
app.use('/', disasterRoutesAlt); // avoid duplicate paths

export default app;