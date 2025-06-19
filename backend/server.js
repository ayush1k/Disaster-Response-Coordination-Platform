require('dotenv').config();
const http = require('http');
const app = require('./app');
const { Server } = require('socket.io');

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
