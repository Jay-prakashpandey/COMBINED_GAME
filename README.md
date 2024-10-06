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
    border: 1px solid #ddd;
    width: 33%;
    height: 33%;
    font-size: 40px;
    text-align: center;
    vertical-align: middle;
  }
  
  #game-controls {
    margin-top: 20px;
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
snake-ladder.html
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
tic-tac-toe.html:
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
        <td class="cell" id="cell-0"></td>
        <td class="cell" id="cell-1"></td>
        <td class="cell" id="cell-2"></td>
      </tr>
      <tr>
        <td class="cell" id="cell-3"></td>
        <td class="cell" id="cell-4"></td>
        <td class="cell" id="cell-5"></td>
      </tr>
      <tr>
        <td class="cell" id="cell-6"></td>
        <td class="cell" id="cell-7"></td>
        <td class="cell" id="cell-8"></td>
      </tr>
    </table>
  </div>

  <div id="game-controls">
    <p id="turn-indicator">Player X's Turn</p>
  </div>

  <script src="/socket.io/socket.io.js"></script>
  <script src="../js/tic-tac-toe.js"></script>
</body>
</html>
-------------------------
client/js/ludo.js
const socket = io();
document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const roomId = urlParams.get('roomId');
  let currentPlayer = 1;

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
});
-----------------------------------
client/js/main.js
const socket = io();
document.getElementById('enterNameButton').addEventListener('click', () => {
    const playerName = document.getElementById('playerName').value.trim();
    if (!playerName) return;
    document.getElementById('displayName').innerText = playerName;
    document.getElementById('roomOptions').classList.remove('hidden');
});
document.getElementById('createRoomButton').addEventListener('click', () => {
    const playerName = document.getElementById('playerName').value.trim();
    if (!playerName) return;
    socket.emit('create-room', { playerName });
});
document.getElementById('joinRoomButton').addEventListener('click', () => {
    document.getElementById('joinRoomForm').classList.remove('hidden');
});
document.getElementById('joinRoomSubmitButton').addEventListener('click', () => {
    const roomId = document.getElementById('roomId').value.trim();
    const playerName = document.getElementById('playerName').value.trim();
    if (!roomId || !playerName) return;
    socket.emit('join-room', { playerName, roomId });
});
socket.on('room-created', ({ playerName, roomId }) => {
    socket.emit('join-room', { playerName, roomId });
});
socket.on('room-joined', ({ playerName, roomId }) => {
    window.location.href = `/room?roomId=${roomId}&currentPlayer=${playerName}`;
});
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

socket.emit('update-room',{currentPlayer ,roomId});

socket.on('room-updated', ({ roomData, roomId }) => {
  
  alert('this is called '+roomId+' roomData '+roomData.player1+', '+roomData.player2);
  
  document.getElementById('roomIdDisplay').innerText = roomId;
  document.getElementById('player1Name').innerText = roomData.player1 ? roomData.player1 : 'Waiting...';
  document.getElementById('player2Name').innerText = roomData.player2 ? roomData.player2 : 'Waiting for Player 2...';
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
  alert(`Game selected: ${selectedGame}`);
});

socket.on('redirect-to-game', ({ roomId, game }) => {
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

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const roomId = urlParams.get('roomId');
  const currentUser = urlParams.get('currentUser');
  let playerSymbol = null; // The symbol ('X' or 'O') assigned to the current user
  let activePlayer = "X"; // The player whose turn it currently is
  const cells = document.querySelectorAll(".cell");
  const turnIndicator = document.getElementById("turn-indicator");

  // Winning combinations (rows, columns, diagonals)
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];
  
  const board = Array(9).fill(null); // Representing the board

  // If mapping is empty, assign "X" to the first player, else assign "O"
  function assignSymbol(currentUser) {
    if (Object.keys(playerMapping).length === 0) {
      playerMapping[currentUser] = "X"; // First player gets "X"
      playerSymbol = "X";
    } else {
      playerMapping[currentUser] = "O"; // Second player gets "O"
      playerSymbol = "O";
    }
    turnIndicator.textContent = `You are Player:${currentUser}: ${playerSymbol}`;
  }

  // Request symbol assignment from the client side when the page loads
  assignSymbol(currentUser);

  // Check if the game is won
  function checkWinner(player) {
    return winningCombinations.some(combination =>
      combination.every(index => board[index] === player)
    );
  }

  // Disable all cells
  function disableBoard() {
    cells.forEach(cell => cell.removeEventListener("click", handleCellClick));
  }

  // Enable all empty cells
  function enableBoard() {
    cells.forEach(cell => {
      if (cell.textContent === "") {
        cell.addEventListener("click", handleCellClick);
      }
    });
  }

  // cells.forEach((cell) => {
  //   cell.addEventListener("click", () => {
  //     if (cell.textContent === "") {
  //       cell.textContent = activePlayer;
  //       socket.emit("make-move", { roomId, position: cell.id, player: currentUser });
  //       activeTurn = activeTurn === "X" ? "O" : "X";
  //     }
  //   });
  // });

  // Handle cell click
  function handleCellClick(e) {
    const cell = e.target;
    const position = parseInt(cell.id); // Cell index
    alert(activePlayer+' , '+playerSymbol+','+positionc);

    // Only allow move if it's the current player's turn and the cell is empty
    if (cell.textContent === "" && activePlayer === playerSymbol) {
      board[position] = playerSymbol;    // Update the board state
      cell.textContent = playerSymbol;

      socket.emit("make-move", { roomId, position, player: playerSymbol });

      if (checkWinner(playerSymbol)) {
        socket.emit("tic-tac-toe-winner", { roomId, winner: playerSymbol });
        disableBoard();
      } else if (board.every(cell => cell !== null)) {
        socket.emit("game-draw", { roomId });
      } else {
        // Switch to the other player
        activePlayer = activePlayer === "X" ? "O" : "X";
        turnIndicator.textContent = `Player ${activePlayer}'s Turn`;
      }
    }
  }

  cells.forEach((cell) => {
    cell.addEventListener("click", handleCellClick);
  });

   // Listen for a move from the other player
  socket.on("move-made", ({ position, player }) => {
    
    board[position] = player;
    document.getElementById(position).textContent = player;

    // Switch turn to the next player
    activePlayer = player === 'X' ? 'O' : 'X';
    turnIndicator.textContent = `Player ${activePlayer}'s Turn`;

    // Enable/Disable the board based on active player
    if (activePlayer === playerSymbol) {
      enableBoard(); // It's the local player's turn
    } else {
      disableBoard(); // Disable the board until the opponent moves
    }
  });

  // Listen for the game winner
  socket.on("tic-tac-toe-winner", ({ winner }) => {
    alert(`Player ${winner} wins the game!`);
    disableBoard();
  });

  // Handle game draw
  socket.on("game-draw", () => {
    alert("The game is a draw!");
    disableBoard();
  });

  // Listen for room update to assign the symbol to the player
  // socket.on('room-updated', ({ roomData }) => {
  //   if (currentUser === roomData.player1) {
  //     playerSymbol = 'X';
  //   } else if (currentUser === roomData.player2) {
  //     playerSymbol = 'O';
  //   }
    
  //   turnIndicator.textContent = `Player ${activePlayer}'s Turn`;
  //   if (playerSymbol === 'X') {
  //     enableBoard(); // Player X starts the game
  //   } else {
  //     disableBoard(); // Player O waits for Player X to make the first move
  //   }
  // });

  // // Start the game with X
  // turnIndicator.textContent = `Player ${currentUser}'s Turn`;
  // enableBoard(); // Enable board for the first player
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
-----------------------------
.env
PORT=3000

--------------------------------
server/server.js
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

// Room storage
let rooms = {};


// app.use(express.static('client'));
app.use(express.static(path.join(__dirname, '/../client'))); // Serving static files from the 'client' folder

// Serve static files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/../client/index.html'));
});

app.get('/room', (req, res) => {
  res.sendFile(path.join(__dirname, '/../client/room.html'));
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
            console.log('join-room '+roomId +' data: '+rooms[roomId].player1 +' , '+rooms[roomId].player2);
            // rooms[roomId].player2=playerName;
            
            socket.emit('room-joined', ({ playerName, roomId }));
        });

        socket.on('update-room', ({ currentPlayer, roomId }) => {
            console.log('room '+ roomId + ' joined by: '+currentPlayer );
            try {

                if (rooms[roomId]) {
                    // Check if there is space in the room (only 2 players)
                    if (!rooms[roomId].player1) {
                        rooms[roomId].player1 = currentPlayer;
                        socket.join(roomId);
                    } else if (!rooms[roomId].player2) {
                        rooms[roomId].player2 = currentPlayer;
                        socket.join(roomId);
                    } else if(currentPlayer !== roomData.player1 || currentPlayer !==roomData.player2 ) {
                        socket.emit('room-full');
                    }
                    // Notify the room of the update
                    io.to(roomId).emit('room-updated', { roomData: rooms[roomId], roomId:roomId });
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
        socket.on('make-move', ({ roomId, position, player }) => {
            console.log(`roomId: ${roomId} , position: ${position} , player: ${player}`);
            const room = rooms[roomId];
            if (!room || room.selectedGame !== 'tic-tac-toe') return;

            const { board, currentPlayer } = room.ticTacToe;

            // Check if it's the current player's turn and if the cell is empty
            if (currentPlayer === player && board[position] === null) {
                board[position] = player; // Update the board
                room.ticTacToe.currentPlayer = player === 'X' ? 'O' : 'X'; // Switch turn

                io.in(roomId).emit('move-made', { position, player });

                // Check for winner or draw
                const winner = checkWinner(board);
                if (winner) {
                    io.in(roomId).emit('tic-tac-toe-winner', { winner });
                    resetTicTacToe(roomId); // Reset game state after a win
                } else if (board.every(cell => cell !== null)) {
                    io.in(roomId).emit('game-draw');
                    resetTicTacToe(roomId); // Reset game state after a draw
                }
            }
        });

        socket.on('disconnect', () => {
            console.log(`Player disconnected`, socket.id);
                   
        });
    });
}

// Helper function to check for a Tic-Tac-Toe winner
function checkWinner(board) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a]; // Return the winner ('X' or 'O')
        }
    }
    return null; // No winner yet
}

// Helper function to reset Tic-Tac-Toe game state
function resetTicTacToe(roomId) {
    if (rooms[roomId]) {
        rooms[roomId].ticTacToe.board = Array(9).fill(null);
        rooms[roomId].ticTacToe.currentPlayer = 'X';
    }
}
export default { handleSocketConnection };
