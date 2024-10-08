/project-root
│
├── /client                # Frontend (HTML, CSS, JS) files
│   ├── /css
|   |   └── game.css       #Stylesheets
│   │   └── style.css      # Main stylesheet for the project
│   │
│   ├── /js                # Client-side JavaScript
│   │   ├── main.js        # General client-side logic (e.g., navigation, name form handling)
│   │   ├── socket.js      # Socket-related logic for handling room creation, joining, etc.
│   │   ├── tic-tac-toe.js # Game-specific logic for Tic Tac Toe
│   │   ├── snake-ladder.js# Game-specific logic for Snake & Ladder
│   │   └── ludo.js        # Game-specific logic for Ludo
│   │
│   ├── /games             # HTML files for each game
│   │   ├── tic-tac-toe.html  # Tic Tac Toe page
│   │   ├── snake-ladder.html # Snake & Ladder page
│   │   └── ludo.html         # Ludo page
│   │
│   ├── index.html         # Main landing page (user name input)
│   └── room.html          # Room creation/joining page
│
├── /server                # Backend (Node.js server) files
│   ├── server.js          # Main server entry point (express, socket.io)
│   └── /game-logic        # Game logic for each game
│       ├── tic-tac-toe.js # Tic Tac Toe game logic
│       ├── snake-ladder.js# Snake & Ladder game logic
│       └── ludo.js        # Ludo game logic
│
├── /public                # Publicly accessible files (e.g., images, sounds)
│   └── /images            # Images for the games
│
├── package.json           # Project metadata and dependencies
├── .env                   # Environment variables (for things like port numbers, DB credentials)
└── README.md              # Project documentation

-------------------------------------------
client/css/game.css:
body {
    font-family: Arial, sans-serif;
    background-color: #f0f0f0;
    text-align: center;
    margin: 0;
    padding: 0;
  }
  
  h1 {
    color: #333;
    margin: 20px 0;
  }
  
  #game-board {
    display: inline-block;
    margin: 20px auto;
    max-width: 600px;
    width: 100%;
    aspect-ratio: 1/1;
    position: relative;
    border: 2px solid #ddd;
  }
  
  table {
    width: 100%;
    height: 100%;
    border-collapse: collapse;
  }
  
  td {
    border: 2px solid #333;
    font-size: 40px;
    text-align: center;
    vertical-align: middle;
    padding: 0;
  }

  .cell {
    width: 33.33%; /* Cells take 1/3 of the table width */
    height: 33.33%; /* Cells take 1/3 of the table height */
    font-size: 3rem; /* Increase font size for visibility */
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .cell:hover {
      background-color: #e6e6e6; /* Highlight cell on hover */
  }

  .hidden {
    display: none;
  }
  /* td {
    border: 1px solid #ddd;
    width: 33%;
    height: 33%;
    font-size: 40px;
    text-align: center;
    vertical-align: middle;
  } */
  
  #game-controls {
    margin-top: 20px;
  }
  
  #turn-indicator {
    margin-top: 10px;
    font-size: 24px;
    color: #555;
  }

  #roll-dice {
    padding: 10px 20px;
    font-size: 16px;
    background-color: #007bff;
    color: white;
    border: none;
    cursor: pointer;
  }
  
  #roll-dice:disabled {
    background-color: grey;
    color: white;
    cursor: not-allowed;
  }
  
  #dice-result, #turn-indicator {
    margin-top: 10px;
    font-size: 18px;
  }
  
  /* .cell {
    width: 100px;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2em;
    border: 1px solid #000;
  } */

@media (max-width: 600px) {
  td {
      font-size: 24px; /* Adjust font size for smaller screens */
  }
  .cell {
      font-size: 2rem;
  }
}
--------------------------
client/css/style.js:
/* General Styles */
body {
    font-family: Arial, sans-serif;
    background-color: #f0f0f0;
    text-align: center;
    margin: 0;
    padding: 0;
}

.container {
    width: 80%;
    margin: auto;
    padding: 20px;
}

.hidden {
    display: none;
}

/* Game-specific Styles */
/* #game-board {
    display: inline-block;
    margin: 20px auto;
    max-width: 600px;
    width: 100%;
    aspect-ratio: 1/1;
    position: relative;
    border: 2px solid #ddd;
} */

table {
    width: 100%;
    height: 100%;
    border-collapse: collapse;
}

td {
    border: 1px solid #ddd;
    width: 33%;
    height: 33%;
    font-size: 40px;
    text-align: center;
    vertical-align: middle;
}

/* Controls */
#game-controls {
    margin-top: 20px;
}

button {
    padding: 10px 20px;
    font-size: 16px;
    background-color: #007bff;
    color: white;
    border: none;
    cursor: pointer;
}

button:disabled {
    background-color: grey;
    color: white;
    cursor: not-allowed;
}

#dice-result, #turn-indicator {
    margin-top: 10px;
    font-size: 18px;
}

/* Basic styling for the game room */
.container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    text-align: center;
    font-family: Arial, sans-serif;
  }
  
  h1, p {
    margin-bottom: 20px;
  }
  
  .hidden {
    display: none;
  }
  
  /* Styling the dropdown (gameSelect) */
  #gameSelect {
    padding: 10px;
    margin-bottom: 20px;
    width: 100%;
    max-width: 300px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #f9f9f9;
    font-size: 16px;
  }
  
  /* Styling the game selection button */
  #gameSelectionButton {
    background-color: #4CAF50;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
  }
  
  #gameSelectionButton:hover {
    background-color: #45a049;
  }
  
  /* Styling for room and player information */
  #roomIdDisplay, #player1Name, #player2Name {
    font-weight: bold;
    font-size: 18px;
  }
  
  /* Button hover and focus effects */
  button:focus, select:focus {
    outline: none;
    box-shadow: 0 0 5px rgba(81, 203, 238, 1);
    border: 1px solid rgba(81, 203, 238, 1);
  }
  --------------------------
client/games/ludo.html:
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Multiplayer Ludo Game">
  <title>Ludo Game</title>
  <link rel="stylesheet" href="../css/game.css">
</head>
<body>
  <h1>Ludo Game</h1>

  <div id="game-board">
    <!-- Ludo board can be an image or HTML elements -->
    <p>Game board will go here</p>
  </div>

  <div id="game-controls">
    <button id="roll-dice">Roll Dice</button>
    <p id="dice-result">Dice: <span id="dice-value">0</span></p>
    <p id="turn-indicator">Player 1's Turn</p>
  </div>

  <script src="/socket.io/socket.io.js"></script>
  <script src="../js/ludo.js"></script>
</body>
</html>
------------------------
client/games/snake-ladder.html:
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Multiplayer Snake and Ladder Game">
  <title>Snake and Ladder</title>
  <link rel="stylesheet" href="../css/game.css">
</head>
<body>
  <h1>Snake and Ladder Game</h1>
  <div id="game-board">
    <table>
      <!-- 10x10 Snake and Ladder board will be generated dynamically -->
      <tbody id="board"></tbody>
    </table>
    <div id="board-overlay"></div>
  </div>
  <div id="game-controls">
    <button id="roll-dice">Roll Dice</button>
    <p id="dice-result">Dice: <span id="dice-value">0</span></p>
    <p id="turn-indicator">Player 1's Turn</p>
  </div>
  <script src="/socket.io/socket.io.js"></script>
  <script src="../js/snake-ladder.js"></script>
</body>
</html>
--------------------
client/games/tic-tac-toe.html:
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Multiplayer Tic-Tac-Toe Game">
  <title>Tic-Tac-Toe</title>
  <link rel="stylesheet" href="../css/game.css">
</head>
<body>
  <h1>Tic-Tac-Toe Game</h1>
  <div id="game-board">
    <table>
      <tr>
        <td class="cell" id="0"></td>
        <td class="cell" id="1"></td>
        <td class="cell" id="2"></td>
      </tr>
      <tr>
        <td class="cell" id="3"></td>
        <td class="cell" id="4"></td>
        <td class="cell" id="5"></td>
      </tr>
      <tr>
        <td class="cell" id="6"></td>
        <td class="cell" id="7"></td>
        <td class="cell" id="8"></td>
      </tr>
    </table>
  </div>
  <div id="game-controls">
    <p id="turn-indicator">Player X's Turn</p>
    <div id="reset-game" class="hidden"><button>Play-Again</button></div>
  </div>
  <script src="/socket.io/socket.io.js"></script>
  <script src="../js/tic-tac-toe.js"></script>
</body>
</html>
-------------------------
client/js/ludo.js:
const socket = io();

const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get('roomId');
const currentUser = urlParams.get('currentUser');

let playerSymbol = null; // The symbol ('X' or 'O') assigned to the current user
let activePlayer = "X"; // The player whose turn it currently is
const cells = document.querySelectorAll(".cell");
const turnIndicator = document.getElementById("turn-indicator");

const rollDiceButton = document.getElementById("roll-dice");
const diceValueDisplay = document.getElementById("dice-value");

rollDiceButton.addEventListener("click", () => {
  const diceRoll = Math.floor(Math.random() * 6) + 1;
  socket.emit("roll-dice-ludo", { roomId, currentPlayer, diceRoll });
});

socket.on("dice-result-ludo", ({ diceRoll, player }) => {
  diceValueDisplay.textContent = `Player ${player} rolled: ${diceRoll}`;
  currentPlayer = player === 1 ? 2 : 1;
});

socket.on("ludo-game-update", (gameState) => {
  // Update game board logic with gameState positions, etc.
});

socket.on("ludo-game-finished", ({ winner }) => {
  alert(`Player ${winner} wins the Ludo game!`);
});
-----------------------------------
client/js/main.js
const socket = io();

// Enter player name
document.getElementById('enterNameButton').addEventListener('click', () => {
    const playerName = document.getElementById('playerName').value.trim();
    if (!playerName) return;
    document.getElementById('displayName').innerText = playerName;
    document.getElementById('roomOptions').classList.remove('hidden');
});

// Create a new room
document.getElementById('createRoomButton').addEventListener('click', () => {
    const playerName = document.getElementById('playerName').value.trim();
    if (!playerName) return;
    socket.emit('create-room', { playerName });
});

//join button 
document.getElementById('joinRoomButton').addEventListener('click', () => {
    document.getElementById('joinRoomForm').classList.remove('hidden');
});

// Join an existing room
document.getElementById('joinRoomSubmitButton').addEventListener('click', () => {
    const roomId = document.getElementById('roomId').value.trim();
    const playerName = document.getElementById('playerName').value.trim();
    if (!roomId || !playerName) return;
    socket.emit('join-room', { playerName, roomId });
});

// Room created handler
socket.on('room-created', ({ playerName, roomId }) => {
    socket.emit('join-room', { playerName, roomId });
});

// Room joined handler
socket.on('room-joined', ({ playerName, roomId }) => {
    window.location.href = `/room?roomId=${roomId}&currentPlayer=${playerName}`;
});

// Handle errors
socket.on('error', ({ message }) => {
    alert(message);
});
------------------------------
client/js/snake-ladder.js
const socket = io();
document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const roomId = urlParams.get('roomId');
  let playerTurn = 1;

  const rollDiceButton = document.getElementById("roll-dice");
  const diceValueDisplay = document.getElementById("dice-value");

  rollDiceButton.addEventListener("click", () => {
    const diceRoll = Math.floor(Math.random() * 6) + 1;
    socket.emit("roll-dice-snake-ladder", { roomId, playerTurn, diceRoll });
  });

  socket.on("dice-result-snake-ladder", ({ diceRoll, player }) => {
    diceValueDisplay.textContent = `Player ${player} rolled: ${diceRoll}`;
    playerTurn = player === 1 ? 2 : 1;
  });

  socket.on("snake-ladder-game-update", (gameState) => {
    // Update board with player positions using gameState data
  });

  socket.on("snake-ladder-game-finished", ({ winner }) => {
    alert(`Player ${winner} wins the Snake and Ladder game!`);
  });
});
----------------------------------------
client/js/room.js
const socket = io();
const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get('roomId');
const currentPlayer = urlParams.get('currentPlayer');

// Variable to hold player symbol
let playerSymbol = '';

socket.emit('update-room',{currentPlayer ,roomId});

socket.on('room-updated', ({ roomData, roomId }) => {
  
  alert('this is called '+roomId+' roomData '+roomData.player1+', '+roomData.player2);
  
  document.getElementById('roomIdDisplay').innerText = roomId;
  document.getElementById('player1Name').innerText = roomData.player1.name ? roomData.player1.name : 'Waiting...';
  document.getElementById('player2Name').innerText = roomData.player2.name ? roomData.player2.name : 'Waiting for Player 2...';
  document.getElementById('gameSelected').innerHTML = roomData.selectedGame;

  if (roomData.player1 && roomData.player2) {
    document.getElementById('gameSelected').classList.remove('hidden');
    document.getElementById('gameSelection').classList.remove('hidden');
    document.getElementById('startGameButton').classList.remove('hidden');
  } else {
    document.getElementById('gameSelect').classList.add('hidden');
    document.getElementById('startGameButton').classList.add('hidden');
  }
});

document.getElementById('startGameButton').addEventListener('click', () => {
  const selectedGame = document.getElementById('gameSelect').value;
  if (selectedGame) {
    socket.emit('game-selected', { roomId, game: selectedGame });
  } else {
    alert('Please select a game first!');
  }
});

socket.on('game-selection-update', ({ selectedGame }) => {
  document.getElementById('gameSelect').value = selectedGame ;
  alert(`Game selected: ${selectedGame}`);
});

socket.on('redirect-to-game', ({ roomId, game, playerSymbol }) => {
  switch (game) {
    case 'Tic-Tac-Toe':
      window.location.href = `/tic-tac-toe?roomId=${roomId}&currentUser=${currentPlayer}`;
      break;
    case 'Snake and Ladder':
      window.location.href = `/snake-ladder?roomId=${roomId}&currentUser=${currentPlayer}`;
      break;
    case 'Ludo':
      window.location.href = `/ludo?roomId=${roomId}&currentUser=${currentPlayer}`;
      break;
    case 'Truth-Dare':
      window.location.href = `/truth-dare?roomId=${roomId}&currentUser=${currentPlayer}`;
      break;
    default:
      alert('Invalid game selection');
  }
});


socket.on('room-full', () => {
  alert('Room is full!');
});

socket.on('error', ({ message }) => {
  alert(message);
});
--------------------------------------
client/js/tic-tac-toe.js
const socket = io();

const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get('roomId');
const currentUser = urlParams.get('currentUser');

let playerSymbol = null; // The symbol ('X' or 'O') assigned to the current user
let activePlayer = "X"; // The player whose turn it currently is
const cells = document.querySelectorAll(".cell");
const turnIndicator = document.getElementById("turn-indicator");

// Request the game state when reconnecting
socket.emit('reconnect-room', { roomId, playerName: currentUser });

// Handle receiving the game state after reconnection
socket.on('reconnected', ({ board, currentPlayer, userSymbol }) => {
    // Update the board with the current game state
    cells.forEach((cell, index) => {
        cell.textContent = board[index] || '';
    });
    playerSymbol= userSymbol;
    activePlayer = currentPlayer;
    turnIndicator.textContent = `Player ${activePlayer}'s Turn`;
});

function disableBoard() {
  cells.forEach( cell => cell.removeEventListener("click", handleCellClick));
}

function enableBoard(reset) {
  cells.forEach( cell => {
    if(reset=="True"){ cell.textContent = "";}
    cell.addEventListener("click", handleCellClick);
  });
}

// Handle cell click
function handleCellClick(e) {
  const cell = e.target;
  const position = parseInt(cell.id); // Get cell index from data attribute
  socket.emit("make-move", { roomId, position, playerSymbol });
}

cells.forEach((cell) => {
  cell.addEventListener("click", handleCellClick);
});

document.getElementById('reset-game').addEventListener('click', () => {
  socket.emit("resetTicTacToe",{ roomId } );
});

// reset room 
socket.on('game-reseted',({}) => {
  document.getElementById('reset-game').classList.add('hidden');
  enableBoard("True");
});

// Listen for a move from the other player
socket.on('move-made', ({ position, playerSymbol }) => {
  document.getElementById(position).textContent = playerSymbol;

  // Switch turn to the next player
  activePlayer = playerSymbol === 'X' ? 'O' : 'X';
  turnIndicator.textContent = `Player ${activePlayer}'s Turn`;
});

// Listen for the game winner
socket.on("tic-tac-toe-winner", ({ winner }) => {
  alert(`Player ${winner} wins the game!`);
  disableBoard();
  document.getElementById('reset-game').classList.remove('hidden');
});

// Handle game draw
socket.on("game-draw", () => {
  alert("The game is a draw!");
  disableBoard();
  document.getElementById('reset-game').classList.remove('hidden');
});
-----------------------------------
client/room.html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Multiplayer Game Room">
  <title>Game Room</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <div class="container">
    <h1>Game Room</h1>
    <p>Room ID: <span id="roomIdDisplay"></span></p>
    <div>
      <p>Player 1: <span id="player1Name">Waiting...</span></p>
      <p>Player 2: <span id="player2Name">Waiting for Player 2...</span></p>
      <p>gameSelected: <span id="gameSelected" class="hidden"></span> </p>
    </div>
    <div id="gameSelection" class="hidden">
      <label for="gameSelect">Choose a game:</label>
      <select id="gameSelect">
        <option value="Tic-Tac-Toe">Tic-Tac-Toe</option>
        <option value="Snake and Ladder">Snake and Ladder</option>
        <option value="Ludo">Ludo</option>
        <option value="Truth-Dare">Truth-Dare</option>
      </select>
      <button id="startGameButton" class="hidden">Start Game</button>
    </div>
  </div>
  <script src="/socket.io/socket.io.js"></script>
  <script src="js/room.js"></script>
</body>
</html>
-------------------
client/index.html:
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Multiplayer Game Room">
  <title>Game Room</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <div class="container">
    <h1>Game Room</h1>
    <p>Room ID: <span id="roomIdDisplay"></span></p>

    <div>
      <p>Player 1: <span id="player1Name">Waiting...</span></p>
      <p>Player 2: <span id="player2Name">Waiting for Player 2...</span></p>
      <p>gameSelected: <span id="gameSelected" class="hidden"></span> </p>
    </div>

    <div id="gameSelection" class="hidden">
      <label for="gameSelect">Choose a game:</label>
      <select id="gameSelect">
        <option value="Tic-Tac-Toe">Tic-Tac-Toe</option>
        <option value="Snake and Ladder">Snake and Ladder</option>
        <option value="Ludo">Ludo</option>
        <option value="Truth-Dare">Truth-Dare</option>
      </select>
      <button id="startGameButton" class="hidden">Start Game</button>
    </div>
  </div>

  <script src="/socket.io/socket.io.js"></script>
  <script src="js/room.js"></script>
</body>
</html>
-------------------
package.json
{
  "name": "multiplayer-game-project",
  "version": "1.0.0",
  "description": "A multiplayer game platform featuring Tic-Tac-Toe, Snake & Ladder, and Ludo with room-based gameplay.",
  "main": "server/server.js",
  "scripts": {
    "start": "node server/server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "socket.io": "^4.5.4",
    "ejs": "^3.1.8",
    "dotenv": "^16.0.3"
  },
  "devDependencies": {},
  "author": "Your Name",
  "license": "MIT"
}
--------------------------------
server/server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
// const { handleSocketConnection } = require('./socket').default; // Import socket handling code
const { handleSocketConnection } = require('./socket');
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
------------------------------------
server/socket.js
let rooms = {}; // Store rooms by roomId

function handleSocketConnection(io) {
    io.on('connection', (socket) => {
        
        console.log('A user connected with socket ID:', socket.id);
        // create a room 
        socket.on('create-room', ({ playerName }) => {
            try {
                const roomId = `room_${Math.floor(Math.random() * 10000)}`;
                rooms[roomId] = { player1: null, player2: null, selectedGame: null, ticTacToe: { board: Array(9).fill(null), currentPlayer: 'X' }};
                socket.emit('room-created', { playerName, roomId });
            } catch (error) {
                console.error('Error creating room:', error);
                socket.emit('error', { message: 'Failed to create room' });
            }
        });

        // Room update 
        socket.on('join-room', ({ playerName, roomId }) => {
            socket.emit('room-joined', ({ playerName, roomId }));
        });

        // Handle player reconnection
        socket.on('reconnect-room', ({ roomId, playerName }) => {
            const room = rooms[roomId];

            if (room) {
                // Join the room again
                socket.join(roomId);

                // Send the current game state to the reconnected player
                socket.emit('reconnected', {
                    board: room.ticTacToe.board,
                    currentPlayer: room.ticTacToe.currentPlayer,
                    userSymbol: room.player1.name === playerName ? 'X' : 'O'
                });

                console.log(`${playerName} reconnected to room ${roomId}`);
            } else {
                socket.emit('error', { message: 'Room does not exist' });
            }
        });

        socket.on('getPlayerSymbol', ({ roomId, currentUser }) => {
            const room = rooms[roomId];
            
            if (!room) {
                socket.emit('error', { message: 'Room does not exist' });
                return;
            }
        
            let playerSymbol = null;
            // socket.join(roomId);
        
            if (room.player1 && room.player1.name === currentUser) {
                playerSymbol = room.player1.Symbol;  // Corrected the casing of "symbol"
            } else if (room.player2 && room.player2.name === currentUser) {
                playerSymbol = room.player2.Symbol;  // Corrected the casing of "symbol"
            }
            if (playerSymbol) {
                // Emit the symbol back to the client
                socket.emit('playerSymbol', { symbol: playerSymbol });
            } else {
                socket.emit('error', { message: 'Player not found in room' });
            }
        });

        socket.on('update-room', ({ currentPlayer, roomId }) => {
            console.log('room '+ roomId + ' joined by: '+currentPlayer );
            try {

                if (rooms[roomId]) {
                    // Check if there is space in the room (only 2 players)
                    if (!rooms[roomId].player1) {
                        rooms[roomId].player1 = {name: currentPlayer, Symbol:'X'};
                        socket.join(roomId);
                    } else if (!rooms[roomId].player2) {
                        rooms[roomId].player2 = {name: currentPlayer, Symbol:'O'};
                        socket.join(roomId);
                    } else if(currentPlayer !== roomData.player1 || currentPlayer !==roomData.player2 ) {
                        socket.emit('room-full');
                    }
                    // Notify the room of the update
                    io.to(roomId).emit('room-updated', { roomData: rooms[roomId], roomId: roomId });
                } else {
                    socket.emit('error', { message: 'Room does not exist' });
                }
            } catch (error) {
                console.error('Error joining room:', error);
                socket.emit('error', { message: 'Failed to join room' });
            }
        });

        socket.on('game-selected', ({ roomId, game }) => {
            if (rooms[roomId]) {
                rooms[roomId].selectedGame = game;
                io.in(roomId).emit('game-selection-update', { selectedGame: game });
                
                // Redirect both players to the selected game page
                io.in(roomId).emit('redirect-to-game', { roomId, game });
            }
        });

        socket.on('roll-dice-ludo', ({ roomId, currentPlayer, diceRoll }) => {
            // Logic to handle dice roll for Ludo
            io.in(roomId).emit('dice-result-ludo', { diceRoll, player: currentPlayer });
            // Update game state, check win conditions, etc.
        });

        socket.on('roll-dice-snake-ladder', ({ roomId, currentPlayer, diceRoll }) => {
            // Logic to handle dice roll for Snake and Ladder
            io.in(roomId).emit('dice-result-snake-ladder', { diceRoll, player: currentPlayer });
            // Update game state, check win conditions, etc.
        });

        // Tic-Tac-Toe move handler
        socket.on('make-move', ({ roomId, position, playerSymbol }) => {
            let room = rooms[roomId];
            if (!room || room.selectedGame !== 'Tic-Tac-Toe') return;

            let { board, currentPlayer } = room.ticTacToe;
            console.log(`currentPlayer: ${currentPlayer} , playerSymbol: ${playerSymbol} board: ${board}`);

            // Check if it's the current player's turn and if the cell is empty
            if (currentPlayer === playerSymbol && board[position] === null) {
                board[position] = playerSymbol; // Update the board
                room.ticTacToe.currentPlayer = playerSymbol === 'X' ? 'O' : 'X'; // Switch turn
                
                io.to(roomId).emit('move-made', { position: position, playerSymbol: playerSymbol });
                // Check for winner or draw
                const winner = checkWinner(board, roomId);
                if (winner) {
                    io.in(roomId).emit('tic-tac-toe-winner', { winner });
                } else if (board.every(cell => cell !== null)) {
                    io.in(roomId).emit('game-draw');
                }
            }
        });

        socket.on('disconnect', () => {
            console.log(`Player disconnected`, socket.id);
                   
        });

        // Helper function to reset Tic-Tac-Toe game state
        socket.on('resetTicTacToe', ({ roomId }) => {
            if (rooms[roomId]) {
                rooms[roomId].ticTacToe.board = Array(9).fill(null);
                // Notify the game reseted
                io.to(roomId).emit('game-reseted', {});
            }
        });
        
    });
}

// Helper function to check for a Tic-Tac-Toe winner
function checkWinner(board, roomId) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        // console.log(board[a]+','+board[b]+','+board[c]);
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            let winner=null;
            if(rooms[roomId].player1.Symbol === board[a]) {
                winner = rooms[roomId].player1.name;
            }else{
                winner = rooms[roomId].player2.name;
            }
            return winner; // Return the winner ('X' or 'O')
        }
    }
    return null; // No winner yet
}

// export default { handleSocketConnection };
module.exports = { handleSocketConnection };
