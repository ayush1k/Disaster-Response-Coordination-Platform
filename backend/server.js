import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import app from './app.js';
import { Server } from 'socket.io';

const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Set up WebSocket server
const io = new Server(server, {
  cors: {
    origin: "*", // You can restrict this in production
    methods: ["GET", "POST"]
  }
});

// Make io globally accessible in routes/controllers
global.io = io;

// Handle socket connections
io.on('connection', (socket) => {
  console.log('🟢 New WebSocket connection:', socket.id);

  socket.on('disconnect', () => {
    console.log('🔴 WebSocket disconnected:', socket.id);
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
