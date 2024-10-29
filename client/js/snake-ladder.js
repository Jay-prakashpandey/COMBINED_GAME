const socket = io();
const rollingSound = new Audio('/audio/rpg-dice-rolling-95182.mp3');
const winSound = new Audio('/audio/winharpsichord-39642.mp3');

const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get('roomId');
const currentUser = urlParams.get('currentUser');

let sum = 0 ;
let playerSymbol = null; // The symbol ('X' or 'O') assigned to the current user
let activePlayer = "X"; // The player whose turn it currently is

const gameBoard = document.getElementById("game-board");
const turnIndicator = document.getElementById("turn-indicator");
const diceValueDisplay = document.getElementById("dice-value");
const rollDiceButton = document.getElementById('dice-image');
// Request the game state when reconnecting
socket.emit('reconnect-room', { roomId, playerName: currentUser , gameSelected: 'snake_ladder'});

function createBoard(board, index){
  const cell = document.createElement("div");
  cell.classList.add("box");
  cell.id = `cell-${index}`;
  if (index === board['X'] || index === board['O']) {
    const s = board['X'] === index ? 'X' : 'O';
    cell.textContent = s;
    cell.classList.add(`player-${s}`);
  } else {
    cell.textContent = index;
  }
  gameBoard.appendChild(cell);

}

function updatePlayerPosition(board){
  // Update the board with the current game state
  //remove previous board
  gameBoard.innerHTML = "";
  let index = 100;
  for (let row = 10; row > 0; row--) {
    for (let col = 1; col <= 10; col++) {
      const cellIndex = row % 2 === 0 ? index - col + 1 : index - (10 - col); // alternate directions
      createBoard(board, cellIndex);
    }
    index -= 10;
  } 
}

// Handle receiving the game state after reconnection
socket.on('reconnected', ({ board, currentPlayer, userSymbol }) => {
    // Update the board with the current game state
    updatePlayerPosition(board);

    playerSymbol= userSymbol;
    activePlayer = currentPlayer;
    turnIndicator.textContent = `Player ${activePlayer}'s Turn`;
});

// Roll the dice
rollDiceButton.addEventListener("click", () => {
  if (activePlayer !== playerSymbol) {
    alert("It's not your turn!");
    return;
  }
  rollingSound.play();
  // Start rolling animation
  rollDiceButton.src = '/images/tenor.gif';

  setTimeout(() => {
    const diceRoll = Math.floor(Math.random() * 6) + 1;
    diceValueDisplay.textContent = `You rolled: ${diceRoll}`;
    rollDiceButton.src = `/images/dice/dice-${diceRoll}.jpg`; // Display final result image
    if(diceRoll !== 6){
      sum += diceRoll ;
      socket.emit("roll-dice-snake", { roomId, currentPlayer: activePlayer, diceValue: sum });
      sum=0;
    }else{
      sum=6;
    }
  }, 1000);

});

socket.on( "snake-ladder-updated", ({board, currentPlayer, currentPlayerName}) => {
    updatePlayerPosition(board);
    activePlayer = currentPlayer;
    turnIndicator.textContent = ` ${currentPlayerName}'s Turn`; 
    toggleDice();
  });

// Listen for the game winner
socket.on("snake-ladder-winner", ({ winner }) => {
  winSound.play();
  alert(`Player ${winner} wins the game!`);
  document.getElementById('reset-game').classList.remove('hidden');
});

document.getElementById('reset-game').addEventListener('click', () => {
  socket.emit("resetTicTacToe",{ roomId } );
});

// reset room 
socket.on('game-reseted',({board}) => {
  document.getElementById('reset-game').classList.add('hidden');
  updatePlayerPosition(board);
});

