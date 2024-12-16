const { Chess } = require("chess.js");
let rooms = {}; // Store rooms by roomId
const snakes = { 99: 4, 94: 75, 70: 51, 52: 29, 30: 11 };
const ladders = { 3: 84, 7: 53, 15: 96, 21: 98, 54: 93};
const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

function handleSocketConnection(io) {
    io.on('connection', (socket) => {

        socket.on('create-room', ({ playerName }) => createRoom(socket, playerName));
        socket.on('join-room', ({ playerName, roomId }) => joinRoom(socket, playerName, roomId));
        socket.on('reconnect-room', data => reconnectRoom(socket, data));
        socket.on('update-room', ({ currentPlayer, roomId }) => updateRoom(socket, io, currentPlayer, roomId));
        socket.on('game-selected', ({ roomId, game }) => selectGame(io, roomId, game));
        // Games handler functions 
        socket.on('snake-move', data => handleSnakeLadderMove(io, data));
        socket.on('ticTacToe-move', data => handleTicTacToeMove(io, data));
        socket.on('connect4-move', data => handleConnect4Move(io, data));
        socket.on('chess-move', ({ roomId, move }) => handleChessMove(io, roomId, move));
        // common funtions
        socket.on('reset-game', ({ roomId }) => resetGame(io, roomId));
        socket.on('back-click', ({ roomId }) => io.to(roomId).emit('back-clicked'));
        socket.on('disconnect', () => console.log(`Player disconnected`, socket.id));
    });
}

// Helper functions for Connect-4
function createConnect4Board() {
    return Array(6).fill().map(() => Array(7).fill(null)); // 6 rows x 7 columns
}
        
// console.log('A user connected with socket ID:', socket.id);
// create a room 
function createRoom(socket, playerName){
    try {
        const roomId = Math.floor(Math.random() * 10000);
        rooms[roomId] = { 
            player1: null, player2: null, 
            selectedGame: null, currentPlayer: 'X', 
            connect4: { board: createConnect4Board()}, // 6 rows x 7 columns
            ticTacToe: { board: Array(9).fill(null)},
            ludo: {board:Array(57).fill(null)},
            snake_ladder: {board: {X: 0, O: 0}},
            chess: {board: new Chess()}
        };
        socket.emit('room-created', { playerName, roomId });
    } catch (error) {
        console.error('Error creating room:', error);
        socket.emit('error', { message: 'Failed to create room' });
    }
}

// Room update 
function joinRoom(socket, playerName, roomId) {
    socket.emit('room-joined', { playerName, roomId });
}
        
// Handle player reconnection
function reconnectRoom(socket, { roomId, playerName, gameSelected }) {
    const room = rooms[roomId];
    if (!room) return socket.emit('error', { message: 'Room does not exist' });
    socket.join(roomId);
    room.selectedGame = gameSelected;
    const playerSymbol = room.player1.name === playerName ? 'X' : 'O';
    let _board = room[gameSelected].board;
    _board = gameSelected==='chess'? _board.fen(): _board;
    socket.emit('reconnected', { board: _board, currentPlayer: room.currentPlayer, userSymbol: playerSymbol, p1:room.player1.name, p2:room.player2.name });
}

// rejoining in room 
function updateRoom(socket, io, currentPlayer, roomId) {
    const roomData = rooms[roomId];
    if (!roomData) return socket.emit('error', { message: 'Room does not exist' });
    try{
        const playerSlot = roomData.player1 ? 'player2' : 'player1';
        roomData[playerSlot] = roomData[playerSlot] || { name: currentPlayer, Symbol: playerSlot === 'player1' ? 'X' : 'O', totalWin: 0 };
        socket.join(roomId);
        io.to(roomId).emit('room-updated', { roomData });
    } catch (error) {
        console.error('Error joining room:', error);
        socket.emit('error', { message: 'Failed to join room' });
    }
}

function selectGame(io, roomId, game) {
    const room=rooms[roomId];
    if (room) {
        room.selectedGame = game;
        io.in(roomId).emit('game-selection-update', { selectedGame: game });
        io.in(roomId).emit('redirect-to-game', { roomId, game });
    }
}

function handleSnakeLadderMove(io, { roomId, currentPlayer, diceValue }) {
    
    // Step 1: Broadcast dice roll animation and value to all players
    io.to(roomId).emit('snake-ladder-dice-roll', {
        currentPlayer,
        diceValue,
    });

    const board = rooms[roomId].snake_ladder.board;
    let newPosition = board[currentPlayer] + diceValue;
    const updatedPosition = diceValue!==6 ? newPosition in snakes ? snakes[newPosition] : newPosition in ladders ? ladders[newPosition] : newPosition: newPosition;

    board[currentPlayer] = updatedPosition <= 100 ? updatedPosition : board[currentPlayer];
    if (updatedPosition === 100) return io.to(roomId).emit('snake-ladder-winner', { winner: rooms[roomId][currentPlayer === 'X' ? 'player1' : 'player2'].name });

    rooms[roomId].currentPlayer = diceValue !== 6 ? (currentPlayer === 'X' ? 'O' : 'X') : currentPlayer;
    io.to(roomId).emit('snake-ladder-updated', { board, currentPlayer: rooms[roomId].currentPlayer, diceRoll: diceValue });
}   

// Tic-Tac-Toe move handler
function handleTicTacToeMove(io, { roomId, position, playerSymbol }) {
    const room = rooms[roomId];
    if (!room || room.selectedGame !== 'ticTacToe') return;
    
    const board = room.ticTacToe.board;
    if (room.currentPlayer !== playerSymbol || board[position] !== null) return;
    
    board[position] = playerSymbol;
    room.currentPlayer = playerSymbol === 'X' ? 'O' : 'X';
    io.to(roomId).emit('move-made', { position, playerSymbol });
    
    const winner = checkWinner(board, roomId);
    if (winner) io.in(roomId).emit('tic-tac-toe-winner', { winner });
    else if (board.every(cell => cell !== null)) io.in(roomId).emit('game-draw');
}

// Chess-specific functions
function handleChessMove(io, roomId, move) {
    const room = rooms[roomId];
    if (!room || !room.chess.board) return;

    const game = room.chess.board;
    const result = game.move(move);
    if(result){
        if (game.in_checkmate) {
            io.to(room).emit('game-win', game.turn());
        }
        // draw? 
        else if (game.in_draw) {
            io.to(room).emit('game-draw');
        }
        // game still on
        else {
            if (game.in_check) {
                io.to(room).emit('in-Check', game.turn())
            }
            io.to(roomId).emit('updateBoard', move); // Sync board state
        }
    }
}

function handleConnect4Move(io, { roomId, column, playerSymbol }) {
    const room = rooms[roomId];
    if (!room || room.selectedGame !== 'connect4') return;

    const board = room.connect4.board;
    let row = -1;

    // Find the lowest empty row in the column
    for (let r = 5; r >= 0; r--) {
        if (!board[r][column]) {
            board[r][column] = playerSymbol;
            row = r;
            break;
        }
    }

    if (row === -1) return; // Column full

    // Check for winner
    if (checkConnect4Winner(board, row, column, playerSymbol)) {
        io.to(roomId).emit('connect4-winner', { winner: playerSymbol });
        return;
    }

    // Check for draw
    const isDraw = board.every(row => row.every(cell => cell !== null));
    if (isDraw) {
        io.to(roomId).emit('connect4-draw');
        return;
    }

    // Switch turn
    room.currentPlayer = playerSymbol === 'X' ? 'O' : 'X';
    io.to(roomId).emit('connect4-updated', { board, currentPlayer: room.currentPlayer });
}

// Helper function to check for a Tic-Tac-Toe winner
function checkWinner(board, roomId) {
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

function checkConnect4Winner(board, row, col, symbol) {
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
            if (board[r] && board[r][c] === symbol) count++;
            else break;
        }

        for (let d = 1; d <= 3; d++) {
            const r = row - dr * d, c = col - dc * d;
            if (board[r] && board[r][c] === symbol) count++;
            else break;
        }

        if (count >= 4) return true;
    }

    return false;
}

// Helper function to reset game state
function resetGame(io, roomId) {
    const room = rooms[roomId];
    if (!room) return;
    const gameSelected = room.selectedGame;
    if (gameSelected === 'connect4') {
        room.connect4.board = createConnect4Board();
    } else if(gameSelected === 'chess'){
        rooms[roomId].chess.board.reset();
    }
    else {
        room[gameSelected].board = gameSelected === 'snake_ladder' ? { X: 0, O: 0 } : Array(gameSelected === 'ticTacToe' ? 9 : 57).fill(null);
    }
    io.to(roomId).emit('game-reseted', { board: room[gameSelected].board });
}

// export default { handleSocketConnection };
module.exports = { handleSocketConnection };
