const socket = io();

const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get('roomId');
const currentUser = urlParams.get('currentUser');
// Request player symbol
socket.emit('getPlayerSymbol', { roomId, currentUser });
// Listen for the player symbol response
let playerSymbol = null; // The symbol ('X' or 'O') assigned to the current user
socket.on('playerSymbol', ({ symbol }) => {
  alert(symbol);
  playerSymbol=symbol;
});
let activePlayer = "X"; // The player whose turn it currently is
const cells = document.querySelectorAll(".cell");
const turnIndicator = document.getElementById("turn-indicator");

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
  // alert(activePlayer+' , '+playerSymbol+','+ position);
  socket.emit("make-move", { roomId, position, playerSymbol });
}

cells.forEach((cell) => {
  cell.addEventListener("click", handleCellClick);
});

document.getElementById('reset-game').addEventListener('click', () => {
  socket.emit("resetTicTacToe",{ roomId } );
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