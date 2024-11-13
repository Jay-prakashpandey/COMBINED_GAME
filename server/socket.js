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
        socket.on('roll-dice-snake', data => rollDiceSnake(io, data));
        socket.on('make-move', data => makeTicTacToeMove(io, data));
        socket.on('reset-game', ({ roomId }) => resetGame(io, roomId));
        socket.on('back-click', ({ roomId }) => io.to(roomId).emit('back-clicked'));
        socket.on('disconnect', () => console.log(`Player disconnected`, socket.id));
    });
}
        
        // console.log('A user connected with socket ID:', socket.id);
        // create a room 
function createRoom(socket, playerName){
    try {
        const roomId = Math.floor(Math.random() * 10000);
        rooms[roomId] = { 
            player1: null, player2: null, 
            selectedGame: null, currentPlayer: 'X', 
            ticTacToe: { board: Array(9).fill(null)},
            ludo: {board:Array(57).fill(null)},
            snake_ladder: {board: {X: 0, O: 0}}
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
    socket.emit('reconnected', { board: room[gameSelected].board, currentPlayer: room.currentPlayer, userSymbol: playerSymbol, p1:room.player1.name, p2:room.player2.name });
}

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

function rollDiceSnake(io, { roomId, currentPlayer, diceValue }) {
    const board = rooms[roomId].snake_ladder.board;
    let newPosition = board[currentPlayer] + diceValue;
    const updatedPosition = diceValue!==6 ? newPosition in snakes ? snakes[newPosition] : newPosition in ladders ? ladders[newPosition] : newPosition: newPosition;

    board[currentPlayer] = updatedPosition <= 100 ? updatedPosition : board[currentPlayer];
    if (updatedPosition === 100) return io.to(roomId).emit('snake-ladder-winner', { winner: rooms[roomId][currentPlayer === 'X' ? 'player2' : 'player1'].name });

    rooms[roomId].currentPlayer = diceValue !== 6 ? (currentPlayer === 'X' ? 'O' : 'X') : currentPlayer;
    io.to(roomId).emit('snake-ladder-updated', { board, currentPlayer: rooms[roomId].currentPlayer, diceRoll: diceValue });
}

        // socket.on('roll-dice-snake', ({roomId, currentPlayer, diceValue }) => {
        //     const board = rooms[roomId].snake_ladder.board;
        //     const currentPlayerName = rooms[roomId][currentPlayer === 'X' ? 'player2' : 'player1'].name;
            
        //     let newPosition = board[currentPlayer] + diceValue;
        //     // console.log(`newPosition: ${newPosition}`);
        //     // Check for snake or ladder
        //     if(diceValue !== 6){
        //         if (newPosition in snakes) newPosition = snakes[newPosition];
        //         if (newPosition in ladders) newPosition = ladders[newPosition];
        //     }
        //     // Update position or declare winner if position is 100
        //     if (newPosition <= 100) board[currentPlayer] = board[currentPlayer] ===0 ? (diceValue < 6 ? 0 : newPosition) : newPosition;
        //     if (newPosition === 100) {
        //         io.to(roomId).emit('snake-ladder-winner', { winner: currentPlayerName });
        //     } else {
        //         if (diceValue !== 6){
        //             rooms[roomId].currentPlayer = currentPlayer === 'X' ? 'O' : 'X'; // Switch turn
        //         }
        //         // console.log(`board-x: ${board.X}, ${board.O} `);
        //         io.to(roomId).emit('snake-ladder-updated', { board: board, currentPlayer: rooms[roomId].currentPlayer, currentPlayerName: currentPlayerName, diceRoll: diceValue});
        //     }
        // });


// Tic-Tac-Toe move handler
function makeTicTacToeMove(io, { roomId, position, playerSymbol }) {
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


// Helper function to reset Tic-Tac-Toe game state
function resetGame(io, roomId) {
    const room = rooms[roomId];
    if (!room) return;
    const gameSelected = room.selectedGame;
    room[gameSelected].board = gameSelected === 'snake_ladder' ? { X: 0, O: 0 } : Array(gameSelected === 'ticTacToe' ? 9 : 57).fill(null);
    io.to(roomId).emit('game-reseted', { board: room[gameSelected].board });
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

// export default { handleSocketConnection };
module.exports = { handleSocketConnection };
