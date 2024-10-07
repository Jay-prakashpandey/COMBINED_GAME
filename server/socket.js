let rooms = {}; // Store rooms by roomId

function handleSocketConnection(io) {
    io.on('connection', (socket) => {
        
        console.log('A user connected with socket ID:', socket.id);

        socket.on('create-room', ({ playerName }) => {
            try {
                const roomId = `room_${Math.floor(Math.random() * 10000)}`;
                rooms[roomId] = { player1: null, player2: null, selectedGame: null, ticTacToe: { board: Array(9).fill(null), currentPlayer: 'X' }};
                socket.emit('room-created', { playerName, roomId });
            } catch (error) {
                console.error('Error creating room:', error);
                socket.emit('error', { message: 'Failed to create room' });
            }
        });

        // Room update 
        socket.on('join-room', ({ playerName, roomId }) => {
            // console.log('join-room '+roomId +' data: '+rooms[roomId].player1 +' , '+rooms[roomId].player2);
            // rooms[roomId].player2=playerName;
            socket.emit('room-joined', ({ playerName, roomId }));
        });

        socket.on('getPlayerSymbol', ({ roomId, currentUser }) => {
            const room = rooms[roomId];
            
            if (!room) {
                socket.emit('error', { message: 'Room does not exist' });
                return;
            }
        
            let playerSymbol = null;
            socket.join(roomId);
        
            if (room.player1 && room.player1.name === currentUser) {
                playerSymbol = room.player1.Symbol;  // Corrected the casing of "symbol"
            } else if (room.player2 && room.player2.name === currentUser) {
                playerSymbol = room.player2.Symbol;  // Corrected the casing of "symbol"
            }
            if (playerSymbol) {
                // Emit the symbol back to the client
                socket.emit('playerSymbol', { symbol: playerSymbol });
            } else {
                socket.emit('error', { message: 'Player not found in room' });
            }
        });

        socket.on('update-room', ({ currentPlayer, roomId }) => {
            console.log('room '+ roomId + ' joined by: '+currentPlayer );
            try {

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

        socket.on('roll-dice-ludo', ({ roomId, currentPlayer, diceRoll }) => {
            // Logic to handle dice roll for Ludo
            io.in(roomId).emit('dice-result-ludo', { diceRoll, player: currentPlayer });
            // Update game state, check win conditions, etc.
        });

        socket.on('roll-dice-snake-ladder', ({ roomId, currentPlayer, diceRoll }) => {
            // Logic to handle dice roll for Snake and Ladder
            io.in(roomId).emit('dice-result-snake-ladder', { diceRoll, player: currentPlayer });
            // Update game state, check win conditions, etc.
        });

        // Tic-Tac-Toe move handler
        socket.on('make-move', ({ roomId, position, playerSymbol }) => {
            let room = rooms[roomId];
            if (!room || room.selectedGame !== 'Tic-Tac-Toe') return;

            let { board, currentPlayer } = room.ticTacToe;
            console.log(`currentPlayer: ${currentPlayer} , playerSymbol: ${playerSymbol} board: ${board}`);

            // Check if it's the current player's turn and if the cell is empty
            if (currentPlayer === playerSymbol && board[position] === null) {
                board[position] = playerSymbol; // Update the board
                room.ticTacToe.currentPlayer = playerSymbol === 'X' ? 'O' : 'X'; // Switch turn
                
                io.to(roomId).emit('move-made', { position: position, playerSymbol: playerSymbol });
                // Check for winner or draw
                const winner = checkWinner(board, roomId);
                
                if (winner) {
                    io.in(roomId).emit('tic-tac-toe-winner', { winner });
                    // resetTicTacToe(roomId); // Reset game state after a win
                } else if (board.every(cell => cell !== null)) {
                    io.in(roomId).emit('game-draw');
                    // resetTicTacToe(roomId); // Reset game state after a draw
                }
            }
        });

        socket.on('disconnect', () => {
            console.log(`Player disconnected`, socket.id);
                   
        });

        // Helper function to reset Tic-Tac-Toe game state
        socket.on('resetTicTacToe', ({ roomId }) => {
            if (rooms[roomId]) {
                rooms[roomId].ticTacToe.board = Array(9).fill(null);
                // rooms[roomId].ticTacToe.currentPlayer = 'X';
            }
        });
        
    });
}

// Helper function to check for a Tic-Tac-Toe winner
function checkWinner(board, roomId) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
    
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            let winner=null;
            if(rooms[roomId].player1.Symbol === board[a]) {
                winner = rooms[roomId].player1.name;
            }else if(winner !== null){
                winner = rooms[roomId].player2.name;
            }
            return winner; // Return the winner ('X' or 'O')
        }
    }
    return null; // No winner yet
}



// export default { handleSocketConnection };
module.exports = { handleSocketConnection };
