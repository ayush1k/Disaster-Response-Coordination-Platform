const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Routes
const disasterRoutes = require('./routes/disasters');
app.use('/disasters', disasterRoutes);

module.exports = app;
