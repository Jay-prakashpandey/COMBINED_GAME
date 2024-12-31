const socket = io();
const moveSound = new Audio('/audio/move.mp3');
const winSound = new Audio('/audio/winharpsichord-39642.mp3');

const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get('roomId');
const currentUser = urlParams.get('currentUser');

let playerSymbol = null; // The symbol ('X' or 'O') assigned to the current user
let activePlayer = "X"; // The player whose turn it currently is
let Gp1=null,Gp2=null;

const cells = document.querySelectorAll(".cell");

let _board = Array(9).fill(null);

const winPatterns = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6]             // Diagonals
];

// Request the game state when reconnecting
socket.emit('reconnect-room', { roomId, playerName: currentUser, gameSelected: 'ticTacToe' });

// Handle receiving the game state after reconnection
socket.on('reconnected', ({ board, currentPlayer, userSymbol, p1, p2 }) => {
    // Update the board with the current game state
    _board = board;
    Gp1 = p1;
    Gp2 = p2;
    generateBoard();
    playerSymbol = userSymbol;
    activePlayer = currentPlayer;
    const turn= activePlayer === 'X' ? Gp1 : Gp2 ;
    document.getElementById("turn-indicator").innerText = ` ${turn}`;
});

function generateBoard(){
  cells.forEach((cell, index) => {
    cell.textContent = _board[index] || '';
    if(_board[index]=== null){
      cell.addEventListener('click', handleCellClick);
    }
  });
}

function updateBoard(position, symbol){
  _board[position] = symbol ;
  document.getElementById(`${position}`).innerText = symbol ;
  document.getElementById("turn-indicator").innerText = activePlayer === 'X' ? Gp1 : Gp2 ;
}

// Handle cell click
function handleCellClick(e) {
  const cell = e.target;
  const position = parseInt(cell.id); // Get cell index from data attribute
  if(activePlayer === playerSymbol && _board[position] === null){
    socket.emit("ticTacToe-move", { roomId, position, playerSymbol });
  }
}

// Listen for a move from the other player
socket.on('updateBoard', ({ position, _activePlayer }) => {
  if(position === null) return;
  activePlayer = _activePlayer;
  const symbol = activePlayer === 'X' ? 'O' : 'X' ;
  _board[position] = symbol ;
  updateBoard(position, symbol);
  checkGameStatus();
});

function checkGameStatus(){
  const winner = checkWinner();
  if(winner!= null){
    winSound.play();
    alert(`${winner} win's the game`);
  }else if(_board.some(cell => cell !== null)){
    moveSound.play();
  }else{
    alert('game is draw ! ');
  }
}

// Helper function to check for a Tic-Tac-Toe winner
function checkWinner() {
  for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (_board[a] && _board[a] === _board[b] && _board[a] === _board[c]) {
        return _board[a] === 'X' ? Gp1 : Gp2; // Return the winner ('X' or 'O')
      }
  }
  return null; // No winner yet
}

document.getElementById('reset-game').addEventListener('click', () => {
  socket.emit("reset-game",{ roomId } );
});

// reset room 
socket.on('game-reseted',() => {
  _board=Array(9).fill(null);
  generateBoard();
});

document.getElementById('Go-Back').addEventListener('click', () => {
  // If you want to go to a specific URL, use window.location.href
  socket.emit('back-click', {roomId});
});

socket.on('back-clicked', () => {
  window.location.href = `/room?roomId=${roomId}&currentPlayer=${currentUser}`;
});

socket.on('error', ({ message }) => {
  alert(message);
});
