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
        
        console.log('A user connected with socket ID:', socket.id);
        // create a room 
        socket.on('create-room', ({ playerName }) => {
            try {
                const roomId = Math.floor(Math.random() * 10000);
                rooms[roomId] = { player1: null, player2: null, selectedGame: null, currentPlayer: 'X', 
                    ticTacToe: { board: Array(9).fill(null)},
                    ludo: {board:Array(57).fill(null)},
                    snake_ladder: {board: {X: 0, O: 0}}
                };
                socket.emit('room-created', { playerName, roomId });
            } catch (error) {
                console.error('Error creating room:', error);
                socket.emit('error', { message: 'Failed to create room' });
            }
        });

        // Room update 
        socket.on('join-room', ({ playerName, roomId }) => {
            socket.emit('room-joined', ({ playerName, roomId }));
        });

        // Handle player reconnection
        socket.on('reconnect-room', ({ roomId, playerName, gameSelected }) => {
            // console.log(`reconnect-room ${playerName}, ${gameSelected} ${rooms[roomId]['currentPlayer']} ${rooms[roomId][gameSelected]['X']}`);
            const room = rooms[roomId];

            if (room) {
                // Join the room again
                socket.join(roomId);
                room.selectedGame = gameSelected;
                // Send the current game state to the reconnected player
                socket.emit('reconnected', {
                    board: room[gameSelected].board,
                    currentPlayer: room.currentPlayer,
                    userSymbol: room.player1.name === playerName ? 'X' : 'O'
                });

                console.log(`${playerName} reconnected to room ${roomId}`);
            } else {
                socket.emit('error', { message: 'Room does not exist' });
            }
        });

        socket.on('update-room', ({ currentPlayer, roomId }) => {
            console.log('room '+ roomId + ' joined by: '+currentPlayer );
            try {
                const roomData = rooms[roomId];
                if (rooms[roomId]) {
                    // Check if there is space in the room (only 2 players)
                    if (!rooms[roomId].player1) {
                        rooms[roomId].player1 = {name: currentPlayer, Symbol:'X'};
                        socket.join(roomId);
                    } else if (!rooms[roomId].player2) {
                        rooms[roomId].player2 = {name: currentPlayer, Symbol:'O'};
                        socket.join(roomId);
                    } else if(currentPlayer !== roomData.player1 || currentPlayer !==roomData.player2 ) {
                        socket.emit('room-full');
                    }
                    // Notify the room of the update
                    io.to(roomId).emit('room-updated', { roomData: rooms[roomId], roomId: roomId });
                } else {
                    socket.emit('error', { message: 'Room does not exist' });
                }
            } catch (error) {
                console.error('Error joining room:', error);
                socket.emit('error', { message: 'Failed to join room' });
            }
        });

        socket.on('game-selected', ({ roomId, game }) => {
            if (rooms[roomId]) {
                rooms[roomId].selectedGame = game;
                io.in(roomId).emit('game-selection-update', { selectedGame: game });
                
                // Redirect both players to the selected game page
                io.in(roomId).emit('redirect-to-game', { roomId, game });
            }
        });

        socket.on('roll-dice-ludo', ({ roomId, currentPlayer, selectedGame }) => {
            // rooms[roomId][selectedGame][Symbol]= ;
            // Logic to handle dice roll for Ludo
            io.in(roomId).emit('dice-result-ludo', { diceRoll, player: currentPlayer });
            // Update game state, check win conditions, etc.
        });

        socket.on('roll-dice-snake', ({roomId, currentPlayer, diceValue }) => {
            const board = rooms[roomId].snake_ladder.board;
            const currentPlayerName = rooms[roomId][currentPlayer === 'X' ? 'player1' : 'player2'].name;
            
            let newPosition = board[currentPlayer] + diceValue;
            console.log(`newPosition: ${newPosition}`);
            // Check for snake or ladder
            if(diceValue !== 6){
                if (newPosition in snakes) newPosition = snakes[newPosition];
                if (newPosition in ladders) newPosition = ladders[newPosition];
            }
            // Update position or declare winner if position is 100
            if (newPosition <= 100) board[currentPlayer] = board[currentPlayer] ===0 ? (diceValue < 6 ? 0 : newPosition) : newPosition;
            if (newPosition === 100) {
                io.to(roomId).emit('snake-ladder-winner', { winner: currentPlayerName });
            } else {
                if (diceValue !== 6){
                    rooms[roomId].currentPlayer = currentPlayer === 'X' ? 'O' : 'X'; // Switch turn
                }
                console.log(`board-x: ${board.X}, ${board.O} `);
                io.to(roomId).emit('snake-ladder-updated', { board: board, currentPlayer: rooms[roomId].currentPlayer, currentPlayerName: currentPlayerName, diceRoll: diceValue});
            }
        });

        socket.on('move-piece-ludo', ({ roomId, player, diceRoll }) => {
            const room = rooms[roomId];
            const currentPlayer = room.ludo.players.find(p => p.symbol === player);
            
            // Update the player's piece based on the dice roll
            // Game logic to move pieces goes here
            
            io.to(roomId).emit('ludo-game-update', room.ludo);  // Send updated game state
        });

        // Tic-Tac-Toe move handler
        socket.on('make-move', ({ roomId, position, playerSymbol }) => {
            let room = rooms[roomId];
            if (!room || room.selectedGame !== 'ticTacToe') return;

            let board = room.ticTacToe.board;
            let currentPlayer = room.currentPlayer ;
            console.log(`currentPlayer: ${currentPlayer} , playerSymbol: ${playerSymbol} board: ${board}`);

            // Check if it's the current player's turn and if the cell is empty
            if (currentPlayer === playerSymbol && board[position] === null) {
                board[position] = playerSymbol; // Update the board
                room.currentPlayer = playerSymbol === 'X' ? 'O' : 'X'; // Switch turn
                
                io.to(roomId).emit('move-made', { position: position, playerSymbol: playerSymbol });
                // Check for winner or draw
                const winner = checkWinner(board, roomId);
                if (winner) {
                    io.in(roomId).emit('tic-tac-toe-winner', { winner });
                } else if (board.every(cell => cell !== null)) {
                    io.in(roomId).emit('game-draw');
                }
            }
        });

        socket.on('disconnect', () => {
            console.log(`Player disconnected`, socket.id);
                   
        });

        // Helper function to reset Tic-Tac-Toe game state
        socket.on('reset-game', ({ roomId }) => {
            const selectedGame = rooms[roomId].selectedGame;
            if (rooms[roomId]) {
                rooms[roomId].selectedGame.board = selectedGame === 'snake_ladder' ? {X: 0, O: 0}: selectedGame === 'ticTacToe' ? Array(9).fill(null): Array(57).fill(null);
                // Notify the game reseted
                io.to(roomId).emit('game-reseted', {board: rooms[roomId].selectedGame.board});
            }
        });
        
    });
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
