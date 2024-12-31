const socket = io();
const moveSound = new Audio('/audio/move.mp3');
const winSound = new Audio('/audio/winharpsichord-39642.mp3');

const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get('roomId');
const currentUser = urlParams.get('currentUser');

const gameBoard = document.getElementById('game-board');
const currentPlayerIndicator = document.getElementById('turn-indicator');
// const resetButton = document.getElementById('reset-button');

let playerSymbol = null; // Replace with logic to determine player symbol
let currentPlayer = 'X'; // Game starts with player X
let _board = Array(6).fill().map(() => Array(7).fill(null));
let Gp1=null, Gp2=null;

const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

// Request the game state when reconnecting
socket.emit('reconnect-room', { roomId, playerName: currentUser , gameSelected: 'connect4'});

// Generate Connect-4 board dynamically
function generateBoard() {
    gameBoard.innerHTML = '';
    for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 7; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.column = col; // Store column index for easy move handling
            cell.dataset.player = _board[row][col];
            gameBoard.appendChild(cell);
        }
    }
}

// Handle player move
function handleMove(event) {
    const cell = event.target;
    if (!cell.classList.contains('cell') || currentPlayer !== playerSymbol) return;
    // moveSound.play();
    const column = parseInt(cell.dataset.column);
    
    let row = -1;

    // Find the lowest empty row in the column
    for (let r = 5; r >= 0; r--) {
        if (!_board[r][column]) {
            _board[r][column] = playerSymbol;
            row = r;
            break;
        }
    }
    // column is full 
    if (row === -1) return;

    socket.emit('connect4-move', { roomId, row, column, playerSymbol });
}

// Update board UI
function updateBoard() {
    const cells = gameBoard.querySelectorAll('.cell');
    cells.forEach((cell, index) => {
        const row = Math.floor(index / 7);
        const col = index % 7;
        cell.dataset.player = _board[row][col];
    });
    // Find the specific cell using row and column
    currentPlayerIndicator.textContent = currentPlayer === 'X' ? Gp1 : Gp2;
}

// Handle receiving the game state after reconnection
socket.on('reconnected', ({ board, currentPlayer, userSymbol, p1, p2 }) => {

    _board= board;
    generateBoard();
    // Update the board with the current game state
    //updateBoard();
    playerSymbol= userSymbol;
    Gp1= p1;Gp2=p2;
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
socket.on('connect4-updated', ({ row, column, _currentPlayer }) => {
    const symbol = _currentPlayer === 'X' ? 'O' : 'X' ;
    _board[row][column]=symbol;
    currentPlayer = _currentPlayer;
    updateBoard();
    checkGameStatus( row, column, symbol);
});

function checkGameStatus( row, column, symbol){
    // Check for winner
    if (checkConnect4Winner( row, column, symbol)) {
        const winner = symbol === 'X' ? Gp1 : Gp2 ;
        winSound.play();
        alert(` ${winner} wins the game `);
    }else if(_board.every(row => row.every(cell => cell !== null))){
        alert(' game is draw! ');
    }else{
        moveSound.play();
    }
}

function checkConnect4Winner(row, col, symbol) {
    
    const directions = [
        { dr: 0, dc: 1 },   // Horizontal
        { dr: 1, dc: 0 },   // Vertical
        { dr: 1, dc: 1 },   // Diagonal \
        { dr: 1, dc: -1 }   // Diagonal /
    ];

    for (const { dr, dc } of directions) {
        let count = 1;

        for (let d = 1; d <= 3; d++) {
            const r = row + dr * d, c = col + dc * d;
            if (_board[r] && _board[r][c] === symbol) count++;
            else break;
        }

        for (let d = 1; d <= 3; d++) {
            const r = row - dr * d, c = col - dc * d;
            if (_board[r] && _board[r][c] === symbol) count++;
            else break;
        }

        if (count >= 4) return true;
    }

    return false;
}

// Reset game
document.getElementById('reset-button').addEventListener('click', () => {
    socket.emit('reset-game', { roomId });
});

// game reseted
socket.on('game-reseted', () => {
    _board = Array(6).fill().map(() => Array(7).fill(null)); ;
    generateBoard();
    currentPlayerIndicator.textContent = 'X';
});

// back button 
document.getElementById('Go-Back').addEventListener('click', () => {
    // If you want to go to a specific URL, use window.location.href
    socket.emit('back-click', {roomId});
});

// listen for back clicked 
socket.on('back-clicked', () => {
    window.location.href = `/room?roomId=${roomId}&currentPlayer=${currentUser}`;
});
