import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import app from './app.js'; // ✅ Make sure this file has .js extension
import { Server } from 'socket.io';

const PORT = process.env.PORT || 5000;

// Create server
const server = http.createServer(app);

// Setup WebSocket
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});
global.io = io;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
