const socket = io();
const moveSound = new Audio('/audio/move.mp3');
const winSound = new Audio('/audio/winharpsichord-39642.mp3');

const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get('roomId');
const currentUser = urlParams.get('currentUser');

let playerSymbol = null; // The symbol ('X' or 'O') assigned to the current user
let activePlayer = "X"; // The player whose turn it currently is
const cells = document.querySelectorAll(".cell");
const turnIndicator = document.getElementById("turn-indicator");
const backButton = document.getElementById('Go-Back');
const resetButton = document.getElementById('reset-game');

// Request the game state when reconnecting
socket.emit('reconnect-room', { roomId, playerName: currentUser, gameSelected: 'ticTacToe' });

// Handle receiving the game state after reconnection
socket.on('reconnected', ({ board, currentPlayer, userSymbol }) => {
    // Update the board with the current game state
    updateBoard(board);
    playerSymbol= userSymbol;
    activePlayer = currentPlayer;
    turnIndicator.textContent = `Player ${activePlayer}'s Turn`;
});

function updateBoard(board){
    cells.forEach((cell, index) => {
      cell.textContent = board[index] || '';
      if(board[index]===null){
        cell.addEventListener("click", handleCellClick);
      }else{
        cell.removeEventListener("click", handleCellClick);
      }
  });
}

function disableBoard() {
  cells.forEach( cell => cell.removeEventListener("click", handleCellClick));
}

// Handle cell click
function handleCellClick(e) {
  const cell = e.target;
  const position = parseInt(cell.id); // Get cell index from data attribute
  socket.emit("ticTacToe-move", { roomId, position, playerSymbol });
}

cells.forEach((cell) => {
  cell.addEventListener("click", handleCellClick);
});

resetButton.addEventListener('click', () => {
  socket.emit("reset-game",{ roomId } );
});

backButton.addEventListener('click', () => {
  // If you want to go to a specific URL, use window.location.href
  socket.emit('back-click', {roomId});
});

// reset room 
socket.on('game-reseted',({board}) => {
  updateBoard(board);
});

// Listen for a move from the other player
socket.on('move-made', ({ position, playerSymbol }) => {
  moveSound.play();
  document.getElementById(position).textContent = playerSymbol;

  // Switch turn to the next player
  activePlayer = playerSymbol === 'X' ? 'O' : 'X';
  turnIndicator.textContent = `Player ${activePlayer}'s Turn`;
});

// Listen for the game winner
socket.on("tic-tac-toe-winner", ({ winner }) => {
  winSound.play();
  alert(`Player ${winner} wins the game!`);
  disableBoard();
});

// Handle game draw
socket.on("game-draw", () => {
  alert("The game is a draw!");
  disableBoard();
});

socket.on('back-clicked', () => {
  window.location.href = `/room?roomId=${roomId}&currentPlayer=${currentUser}`;
});

socket.on('error', ({ message }) => {
  alert(message);
});
