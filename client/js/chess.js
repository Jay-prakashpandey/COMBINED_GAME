const socket = io();
const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get('roomId');
const currentUser = urlParams.get('currentUser');

let board, game; // Chess.js instances
const chessBoardContainer = document.getElementById('chess-board');

// Initialize Chessboard.js and Chess.js
function initializeChess() {
  game = new Chess(); // Chess.js game state
  board = Chessboard(chessBoardContainer, {
    draggable: true,
    position: 'start',
    onDrop: handleMove,
  });
}

// Handle move logic
function handleMove(source, target) {
  const move = game.move({
    from: source,
    to: target,
    promotion: 'q', // Always promote to a queen for simplicity
  });

  if (move === null) {
    return 'snapback'; // Illegal move
  }

  // Emit move to server
  socket.emit('chess-move', { roomId, move });
  updateTurnIndicator();
}

// Update turn indicator
function updateTurnIndicator() {
    const turn = game.turn() === 'w' ? 'White' : 'Black';
    document.getElementById('turn-indicator').innerText = turn;
}

// Listen for opponent's moves
socket.on('chess-move', ({ move }) => {
  game.move(move);
  board.position(game.fen());
  updateTurnIndicator();
});

// Reset the game
document.getElementById('reset-button').addEventListener('click', () => {
  socket.emit('reset-game', { roomId });
});
  
// reset room 
socket.on('game-reseted',({board}) => {
    initializeChess();
});

socket.on('back-clicked', () => {
window.location.href = `/room?roomId=${roomId}&currentPlayer=${currentUser}`;
});

initializeChess();