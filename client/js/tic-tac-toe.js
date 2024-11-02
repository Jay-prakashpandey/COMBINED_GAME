const socket = io();

const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get('roomId');
const currentUser = urlParams.get('currentUser');

let playerSymbol = null; // The symbol ('X' or 'O') assigned to the current user
let activePlayer = "X"; // The player whose turn it currently is
const cells = document.querySelectorAll(".cell");
const turnIndicator = document.getElementById("turn-indicator");

const backButton = document.getElementById('Go-Back');



// Request the game state when reconnecting
socket.emit('reconnect-room', { roomId, playerName: currentUser, gameSelected: 'ticTacToe' });

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
  socket.emit("reset-game",{ roomId } );
});

backButton.addEventListener('click', () => {
  // If you want to go to a specific URL, use window.location.href
  socket.emit('back-click', {roomId});
});

// reset room 
socket.on('game-reseted',({board}) => {
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

socket.on('back-clicked', ({}) => {
  window.location.href = `/room?roomId=${roomId}&currentPlayer=${currentUser}`;
});
