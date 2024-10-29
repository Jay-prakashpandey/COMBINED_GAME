const socket = io();

const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get('roomId');
const currentUser = urlParams.get('currentUser');

let playerSymbol = null; // The symbol assigned to the current user
let activePlayer = "X"; // The player whose turn it currently is
const rollDiceButton = document.getElementById("roll-dice");
const diceValueDisplay = document.getElementById("dice-value");
const turnIndicator = document.getElementById("turn-indicator");
const gameBoard = document.getElementById("game-board");

// Join the room
socket.emit("join-room", { roomId, currentUser });

socket.on("room-joined", ({ playerSymbol: assignedSymbol, gameState }) => {
  playerSymbol = assignedSymbol;
  updateGameBoard(gameState);
  alert(`You have joined the room as ${playerSymbol}.`);
  updateTurnIndicator();
});

// Roll the dice
rollDiceButton.addEventListener("click", () => {
  if (activePlayer !== playerSymbol) {
    alert("It's not your turn!");
    return;
  }

  const diceRoll = Math.floor(Math.random() * 6) + 1;
  socket.emit("roll-dice-ludo", { roomId, currentPlayer: currentUser, diceRoll });
});

socket.on("dice-result-ludo", ({ diceRoll, player }) => {
  diceValueDisplay.textContent = `Player ${player} rolled: ${diceRoll}`;

  if (player === playerSymbol) {
    movePlayerPiece(diceRoll); // Move the player's piece based on dice roll
  }

  activePlayer = player === "X" ? "O" : "X";
  updateTurnIndicator();
});

socket.on("ludo-game-update", (gameState) => {
  updateGameBoard(gameState); // Update game board with the current game state
});

socket.on("ludo-game-finished", ({ winner }) => {
  alert(`Player ${winner} wins the Ludo game!`);
  socket.disconnect();
});

function updateTurnIndicator() {
  turnIndicator.textContent = `It's ${activePlayer}'s turn!`;
}

function updateGameBoard(gameState) {
  // Render the board with the current positions of all pieces
  gameBoard.innerHTML = ""; // Clear the board
  gameState.players.forEach(player => {
    player.pieces.forEach(piece => {
      const pieceElement = document.createElement("div");
      pieceElement.classList.add("piece", `player-${player.symbol}`);
      pieceElement.style.top = `${piece.position.top}px`;
      pieceElement.style.left = `${piece.position.left}px`;
      gameBoard.appendChild(pieceElement);
    });
  });
}

function movePlayerPiece(diceRoll) {
  socket.emit("move-piece-ludo", { roomId, player: playerSymbol, diceRoll });
}