const socket = io();
const rollingSound = new Audio('/audio/rpg-dice-rolling-95182.mp3');
const winSound = new Audio('/audio/winharpsichord-39642.mp3');

const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get('roomId');
const currentUser = urlParams.get('currentUser');

let playerSymbol = null; // The symbol ('X' or 'O') assigned to the current user
let activePlayer = "X"; // The player whose turn it currently is

const gameBoard = document.getElementById("game-board");
const turnIndicator = document.getElementById("turn-indicator");
const diceValueDisplay = document.getElementById("dice-value");
const rollDiceButton = document.getElementById('dice-image');

// Request the game state when reconnecting
socket.emit('reconnect-room', { roomId, playerName: currentUser , gameSelected: 'snake_ladder'});

const backButton = document.getElementById('Go-Back');

backButton.addEventListener('click', () => {
  // If you want to go to a specific URL, use window.location.href
  socket.emit('back-click', {roomId});
});



function createBoard(board, index){
  const cell = document.createElement("div");
  cell.classList.add("box");
  cell.id = `cell-${index}`;
  
  if ( index === 1 || index === board['X'] || index === board['O'] ) {
    // const s = board['X'] === index ? 'X' : 'O';
    // cell.textContent = s;
    // cell.classList.add(`player-${s}`);
    if(board['X'] ===0 || board['X'] === index){
      cell.classList.add(`player-X`);
    }  
    if(board['O'] ===0 || board['O'] === index){
      cell.classList.add(`player-O`);
    }
  } else {
    cell.textContent = '';
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

function toggleDice(){
  if (activePlayer !== playerSymbol) {
    rollDiceButton.removeEventListener("click", handleDiceRoll);
  }else{
    rollDiceButton.addEventListener("click", handleDiceRoll);
  }
}

// Handle receiving the game state after reconnection
socket.on('reconnected', ({ board, currentPlayer, userSymbol }) => {
    // Update the board with the current game state
    updatePlayerPosition(board);

    playerSymbol= userSymbol;
    activePlayer = currentPlayer;
    turnIndicator.textContent = `Player ${activePlayer}'s Turn`;
    toggleDice();
});

// Separate function to handle dice roll
function handleDiceRoll()  {
  rollingSound.play();
  // Start rolling animation
  rollDiceButton.src = '/images/tenor.gif';

  setTimeout(() => {
    const diceRoll = Math.floor(Math.random() * 6) + 1;
    diceValueDisplay.textContent = `You rolled: ${diceRoll}`;
    rollDiceButton.src = `/images/dice/dice-${diceRoll}.jpg`; // Display final result image
    socket.emit("roll-dice-snake", { roomId, currentPlayer: activePlayer, diceValue: diceRoll });
  }, 1000);

}

socket.on( "snake-ladder-updated", ({board, currentPlayer, currentPlayerName, diceRoll}) => {
    activePlayer = currentPlayer;
    turnIndicator.textContent = ` ${currentPlayerName}'s Turn`; 
    rollDiceButton.src = `/images/dice/dice-${diceRoll}.jpg`; // Display final result image
    updatePlayerPosition(board);
    toggleDice();
  });

// Listen for the game winner
socket.on("snake-ladder-winner", ({ winner }) => {
  winSound.play();
  alert(`Player ${winner} wins the game!`);
  document.getElementById('reset-game').classList.remove('hidden');
});

document.getElementById('reset-game').addEventListener('click', () => {
  socket.emit("reset-game",{ roomId } );
});

// reset room 
socket.on('game-reseted',({board}) => {
  document.getElementById('reset-game').classList.add('hidden');
  updatePlayerPosition(board);
});

socket.on('back-clicked', ({}) => {
  window.location.href = `/room?roomId=${roomId}&currentPlayer=${currentUser}`;
});
