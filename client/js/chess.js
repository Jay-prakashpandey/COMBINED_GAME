const socket = io();
const moveSound = new Audio('/audio/move.mp3');
const checkmateSound = new Audio('/audio/checkmate.mp3');
const winSound = new Audio('/audio/winharpsichord-39642.mp3');

 // Install chess.js via npm
const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get('roomId');
const currentUser = urlParams.get('currentUser');

let playerSymbol = null; // The symbol ('X' or 'O') assigned to the current user
let activePlayer = "X"; // The player whose turn it currently is

let chess_board, game=null, selectedPiece = null; // Chess.js instances

const chessBoardContainer = document.getElementById('chess-board');
const playerX = document.getElementById('playerX');
const playerO = document.getElementById('playerO');
const turnIndicator = document.getElementById('turn-indicator');

let Gp1,Gp2;

// Request the game state when reconnecting
socket.emit('reconnect-room', { roomId, playerName: currentUser , gameSelected: 'chess'});

// Handle receiving the game state after reconnection
socket.on('reconnected', ({ board, currentPlayer, userSymbol, p1, p2 }) => {
  game = game || new Chess(board);
  playerSymbol= userSymbol;
  Gp1=p1;
  Gp2=p2;
  playerX.innerText=`${p1}: white`;
  playerO.innerText=`${p2}: Black`;
  activePlayer = currentPlayer;
  turnIndicator.innerText = currentPlayer==='X'?p1:p2;
  initializeChess();
});

// Initialize Chessboard.js and Chess.js
function initializeChess() {
  chess_board = Chessboard(chessBoardContainer, {
      draggable: true,
      position:  game.fen(),
      orientation: playerSymbol === 'X' ? 'white' : 'black' ,
      onDragStart: ondragstart,
      onDrop: handleMove, // Handle moves on drag-drop
    });
  // Attach click listeners for highlighting and move handling
  chessBoardContainer.addEventListener('click', handleSquareClick);
  updateTurnIndicator(); // Show initial turn
}

function handleSquareClick(event) {
  // Ensure we target the square element even if a piece (image) is clicked
  removeGreySquares();
  // Check if it's the active player's turn
  if (
    (selectedPiece === null) ||
    (game.turn() === 'w' && playerSymbol !== 'X') ||
    (game.turn() === 'b' && playerSymbol !== 'O')
  ) {
    return;
  }
  
  const squareElement = event.target.closest('.square-55d63');
  const square = squareElement.dataset.square;
  ret=handleMove(selectedPiece, square);
  if (ret=='snapback'){
    selectedPiece=null;
  }
}

function greySquare(square) {
  const squareElement = document.querySelector(`.square-55d63[data-square="${square}"]`);
  if (squareElement) {
      const isBlackSquare = squareElement.classList.contains('black-3c85d');
      squareElement.style.backgroundColor = isBlackSquare ? '#696969' : '#a9a9a9';
  }
}

function removeGreySquares() {
  document.querySelectorAll('.square-55d63').forEach((square) => {
      square.style.backgroundColor = '';
  });
}

// Handle piece drag start (optional, use if needed)
function ondragstart(source, piece, position, orientation) {
  // Disallow moves if it's not the active player's turn
  if (
    (game.turn() === 'w' && playerSymbol !== 'X') ||
    (game.turn() === 'b' && playerSymbol !== 'O') ||
    (orientation === 'white' && piece.search(/^w/) === -1) ||
    (orientation === 'black' && piece.search(/^b/) === -1)
  ) {
    return false;
  }
  selectedPiece = source;
  highlightValidMoves();
}

// Handle move logic
function handleMove(source, target) {
  const move = game.move({ from: source, to: target, promotion: 'q' }); // Assume queen promotion
  if (!move) return 'snapback'; // Illegal move
  // Emit move to server
  socket.emit('chess-move', { roomId, move });
  moveSound.play();
  updateTurnIndicator();
  removeGreySquares();
  selectedPiece = null;
}

// Update turn indicator
function updateTurnIndicator() {
    const turn = game.turn() === 'w' ? Gp1 : Gp2;
    document.getElementById('turn-indicator').innerText = turn;
}

function highlightValidMoves() {
  removeGreySquares();
  if (!selectedPiece){
    return; // Important check
  }

  const moves = game.moves({
      square: selectedPiece,
      verbose: true,
  });

  if (moves.length === 0) return;

  moves.forEach((move) => {
      greySquare(move.to);
  });
}

socket.on("updateBoard", (move) => {
  game.move(move);
  chess_board.position(game.fen());
  moveSound.play();
  updateTurnIndicator();
});

// Reset the game
document.getElementById('reset-button').addEventListener('click', () => {
  socket.emit('reset-game', { roomId });
});
  
// reset room 
socket.on('game-reseted',() => {
  game.reset();
  chess_board.position('start');
  updateTurnIndicator();  
});

document.getElementById('Go-Back').addEventListener('click', () => {
  // If you want to go to a specific URL, use window.location.href
  socket.emit('back-click', {roomId});
});

socket.on('back-clicked', () => {
  window.location.href = `/room?roomId=${roomId}&currentPlayer=${currentUser}`;
});

socket.on('game-win', ({winner}) => {
  winSound.play();
  alert(`${winner} wins`);
});

socket.on('game-draw', ({}) =>{
  alert(`game is draw`);
});

socket.on('in-check', ({})=>{
  checkmateSound.play();
});

