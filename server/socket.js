const { Chess } = require("chess.js");
let rooms = {}; // Store rooms by roomId

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
        socket.on('ludo-move', data => handleLudoMove(io, data));
        socket.on('dice-roll', data => handleDiceRoll(io, data));
        // common funtions
        socket.on('reset-game', ({ roomId }) => resetGame(io, roomId));
        socket.on('back-click', ({ roomId }) => io.to(roomId).emit('back-clicked'));
        // socket.on('disconnect', () => console.log(`Player disconnected`, socket.id));
    });
}

function handleDiceRoll(io, data){
    rooms[data.roomId].currentPlayer=data.activePlayer;
    io.to(data.roomId).emit('dice-rolled', {diceValue: data.diceValue, currentPlayer:data.activePlayer});
}
        
// console.log('A user connected with socket ID:', socket.id);
// create a room 
function createRoom(socket, playerName){
    try {
        const roomId = Math.floor(Math.random() * 10000);
        rooms[roomId] = { 
            player1: null, player2: null, 
            selectedGame: null, currentPlayer: 'X', 
            connect4: { board: Array(6).fill().map(() => Array(7).fill(null))}, // 6 rows x 7 columns
            ticTacToe: { board: Array(9).fill(null)},
            ludo: { board: Array(8).fill(-1)},
            snake_ladder: { board: {X: 0, O: 0}},
            chess: { board: new Chess()}
        };
        socket.join(roomId);
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

// update selected Game 
function selectGame(io, roomId, game) {
    const room=rooms[roomId];
    if (room) {
        room.selectedGame = game;
        io.in(roomId).emit('game-selection-update', { selectedGame: game });
        io.in(roomId).emit('redirect-to-game', { roomId, game });
    }
}

function handleLudoMove(io, {roomId, _board, _pno , activePlayer, diceValue}){
    const room=rooms[roomId].ludo;
    room.board=_board;
    room.currentPlayer=activePlayer;
    // console.log(_board);
    io.to(roomId).emit('updateBoard', { board: _board, currentPlayer: room.currentPlayer, diceRoll: diceValue , pno:_pno});

}

function handleSnakeLadderMove(io, { roomId, _board, activePlayer, diceValue }) {
    const room = rooms[roomId];
    const board = room.snake_ladder.board;
    
    board.X = _board.X ;
    board.O = _board.O ;
    let newPosition = board[activePlayer] + diceValue;

    const updatedPosition = board[activePlayer]=== 0 ? diceValue === 6 ? 1 : 0 :  newPosition ;

    board[activePlayer] = updatedPosition <= 100 ? updatedPosition : board[activePlayer];

    rooms[roomId].currentPlayer = diceValue !== 6 ? (activePlayer === 'X' ? 'O' : 'X') : activePlayer;
    io.to(roomId).emit('updateBoard', { board, currentPlayer: room.currentPlayer, diceRoll: diceValue });
}   

// Tic-Tac-Toe move handler
function handleTicTacToeMove(io, { roomId, position, playerSymbol }) {
    const room = rooms[roomId];
    if (!room || room.selectedGame !== 'ticTacToe') return;
    
    const board = room.ticTacToe.board;
    if (room.currentPlayer !== playerSymbol || board[position] !== null) return;
    
    board[position] = playerSymbol;
    room.currentPlayer = playerSymbol === 'X' ? 'O' : 'X';
    io.to(roomId).emit('updateBoard', { position, _activePlayer: room.currentPlayer });
}

// Chess-specific functions
function handleChessMove(io, roomId, move) {
    const room = rooms[roomId];
    if (!room || !room.chess.board) return;

    const game = room.chess.board;
    const result = game.move(move);
    if(result){
        io.to(roomId).emit('updateBoard', move); // Sync board state
    }
}

// connect4 functions 
function handleConnect4Move(io, { roomId, row, column, playerSymbol }) {
    const room = rooms[roomId];
    if (!room || room.selectedGame !== 'connect4') return;

    const board = room.connect4.board;
    board[row][column] = playerSymbol;
    room.currentPlayer = playerSymbol === 'X' ? 'O' : 'X';
    io.to(roomId).emit('connect4-updated', { row, column, _currentPlayer: room.currentPlayer });
}

// Helper function to reset game state
function resetGame(io, roomId) {
    const room = rooms[roomId];
    if (!room) return;
    const gameSelected = room.selectedGame;
    if (gameSelected === 'connect4') {
        room.connect4.board = Array(6).fill().map(() => Array(7).fill(null));
    } else if(gameSelected === 'chess'){
        rooms[roomId].chess.board.reset();
    }
    else {
        room[gameSelected].board = gameSelected === 'snake_ladder' ? { X: 0, O: 0 } : Array(gameSelected === 'ticTacToe' ? 9 : 57).fill(null);
    }
    io.to(roomId).emit('game-reseted');
}

// export default { handleSocketConnection };
module.exports = { handleSocketConnection };
