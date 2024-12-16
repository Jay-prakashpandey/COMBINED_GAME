const socket = io();
const moveSound = new Audio('/audio/move.mp3');
const winSound = new Audio('/audio/winharpsichord-39642.mp3');

const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get('roomId');
const currentUser = urlParams.get('currentUser');

const gameBoard = document.getElementById('game-board');
const currentPlayerIndicator = document.getElementById('turn-indicator');
const resetButton = document.getElementById('reset-button');

let playerSymbol = null; // Replace with logic to determine player symbol
let currentPlayer = 'X'; // Game starts with player X

document.getElementById('Go-Back').addEventListener('click', () => {
    // If you want to go to a specific URL, use window.location.href
    socket.emit('back-click', {roomId});
});

// Generate Connect-4 board dynamically
function generateBoard() {
    gameBoard.innerHTML = '';
    for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 7; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.column = col; // Store column index for easy move handling
            gameBoard.appendChild(cell);
        }
    }
}

// Handle player move
function handleMove(event) {
    const cell = event.target;
    if (!cell.classList.contains('cell') || currentPlayer !== playerSymbol) return;
    moveSound.play();
    const column = parseInt(cell.dataset.column);
    socket.emit('connect4-move', { roomId, column, playerSymbol });
}

// Update board UI
function updateBoard(board) {
    const cells = gameBoard.querySelectorAll('.cell');
    cells.forEach((cell, index) => {
        const row = Math.floor(index / 7);
        const col = index % 7;
        cell.dataset.player = board[row][col];
    });
}

// Handle receiving the game state after reconnection
socket.on('reconnected', ({ board, currentPlayer, userSymbol, p1, p2 }) => {
    generateBoard();
    // Update the board with the current game state
    updateBoard(board);

    playerSymbol= userSymbol;
    document.getElementById('playerX').innerText=p1;
    document.getElementById('playerO').innerText=p2;
    activePlayer = currentPlayer;
    gameBoard.addEventListener('click', handleMove);
    if(activePlayer==='X'){
        currentPlayerIndicator.textContent = ` ${p1}'s Turn`;
    }else{
        currentPlayerIndicator.textContent = ` ${p2}'s Turn`;
    }
});

// Listen for game updates
socket.on('connect4-updated', ({ board, currentPlayer: nextPlayer }) => {
    updateBoard(board);
    currentPlayer = nextPlayer;
    currentPlayerIndicator.textContent = nextPlayer;
});

socket.on('connect4-winner', ({ winner }) => {
    winSound.play();
    alert(`${winner} wins!`);
});

socket.on('connect4-draw', () => {
    alert('Game is a draw!');
});

// Reset game
resetButton.addEventListener('click', () => {
    socket.emit('reset-game', { roomId });
});

socket.on('game-reseted', ({ board }) => {
    updateBoard(board);
    currentPlayerIndicator.textContent = 'X';
});

socket.on('back-clicked', () => {
    window.location.href = `/room?roomId=${roomId}&currentPlayer=${currentUser}`;
});

// Request the game state when reconnecting
socket.emit('reconnect-room', { roomId, playerName: currentUser , gameSelected: 'connect4'});
