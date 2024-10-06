const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
const { handleSocketConnection } = require('./socket').default; // Import socket handling code

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());

app.use(express.static(path.join(__dirname, '/../client'))); // Serving static files from the 'client' folder

// Serve static files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/../client/index.html'));
});

app.get('/room', (req, res) => {
  res.sendFile(path.join(__dirname, '/../client/room.html'));
});

app.get('/tic-tac-toe', (req, res) => {
  res.sendFile(path.join(__dirname, '/../client/games/tic-tac-toe.html'));
});

app.get('/snake-ladder', (req, res) => {
  res.sendFile(path.join(__dirname, '/../client/games/snake-ladder.html'));
});

app.get('/ludo', (req, res) => {
  res.sendFile(path.join(__dirname, '/../client/games/ludo.html'));
});

app.get('/truth-dare', (req, res) => {
  res.sendFile(path.join(__dirname, '/../client/games/truth-dare.html'));
});

// Handle 404 errors
app.use((req, res, next) => {
  res.status(404).send('Sorry, we could not find that!');
});

// Initialize Socket.io connection handling
handleSocketConnection(io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
