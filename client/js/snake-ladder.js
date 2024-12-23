const socket = io();
const rollingSound = new Audio('/audio/rpg-dice-rolling-95182.mp3');
const winSound = new Audio('/audio/winharpsichord-39642.mp3');

const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get('roomId');
const currentUser = urlParams.get('currentUser');

let playerSymbol = null; // The symbol ('X' or 'O') assigned to the current user
let activePlayer = "X"; // The player whose turn it currently is

const gameBoard = document.getElementById("game-board");
const diceX = document.getElementById('dice-imageX');
const diceO = document.getElementById('dice-imageO');
const snakes = { 99: 4, 94: 75, 70: 51, 52: 29, 30: 11 };
const ladders = { 3: 84, 7: 53, 15: 96, 21: 98, 54: 93};

// Request the game state when reconnecting
socket.emit('reconnect-room', { roomId, playerName: currentUser , gameSelected: 'snake_ladder'});

function createBoard(board, index){
  const cell = document.createElement("div");
  cell.classList.add("box");
  cell.id = `cell-${index}`;
  
  if ( index === 1 || index === board['X'] || index === board['O'] ) {
    
    if(board['X'] ===0 || (board['X'] === index && board['X'] !== 0)){
      cell.classList.add(`player-X`);
    }  
    if(board['O'] ===0 || board['O'] === index && board['O'] !== 0){
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
  const currentDice = activePlayer === 'X' ? diceX : diceO;
  const inactiveDice = activePlayer === 'X' ? diceO : diceX;

  inactiveDice.classList.add('hidden');
  currentDice.classList.remove('hidden');

  if (activePlayer === playerSymbol) {
    currentDice.addEventListener("click", handleDiceRoll);
  } else {
    currentDice.removeEventListener("click", handleDiceRoll);
  }
}

// Separate function to handle dice roll
function handleDiceRoll()  {
  rollingSound.play();
  // Start rolling animation
  // `dice${activePlayer}`.src = '/images/tenor.gif';
  const currentDice = activePlayer === 'X' ? diceX : diceO;
  currentDice.src ='/img/tenor.gif';
  // setTimeout(()=>{
  //   currentDice.src='/images/tenor.gif';
  // }, 60);
  // currentDice.src = '/images/tenor.gif';

  setTimeout(() => {
    const diceRoll = Math.floor(Math.random() * 6) + 1;
    // diceValueDisplay.textContent = `You rolled: ${diceRoll}`;
    // `dice${activePlayer}`.src = `/images/dice/dice-${diceRoll}.jpg`; // Display final result image
    // currentDice.src = `/images/dice/dice-${diceRoll}.jpg`;
    socket.emit("snake-move", { roomId, currentPlayer: activePlayer, diceValue: diceRoll });
  }, 1000);

}

// Listen for dice roll updates (sync animation and dice value)
socket.on("snake-ladder-dice-roll", ({ currentPlayer, diceValue }) => {
  const currentDice = currentPlayer === 'X' ? diceX : diceO;

  // Show dice roll animation
  currentDice.src = '/img/tenor.gif';

  setTimeout(() => {
      currentDice.src = `/img/dice/dice-${diceValue}.jpg`; // Display final dice value
  }, 1000);
});

// Handle receiving the game state after reconnection
socket.on('reconnected', ({ board, currentPlayer, userSymbol, p1, p2 }) => {
    // Update the board with the current game state
    updatePlayerPosition(board);

    playerSymbol= userSymbol;
    document.getElementById('playerX').innerText=p1;
    document.getElementById('playerO').innerText=p2;
    activePlayer = currentPlayer;
    // turnIndicator.textContent = `Player ${activePlayer}'s Turn`;
    toggleDice();
});


socket.on( "snake-ladder-updated", ({board, currentPlayer, currentPlayerName, diceRoll}) => {
    activePlayer = currentPlayer;
    // const currentDice = activePlayer === 'X' ? diceX : diceO;
    // currentDice.src = `/images/dice/dice-${diceRoll}.jpg`; // Display final result image
    updatePlayerPosition(board);
    if(diceRoll !== 6){
      // turnIndicator.textContent = ` ${currentPlayerName}'s Turn`; 
      setTimeout(() => {
        toggleDice(); // Toggle to the next player’s dice after 1.5 seconds
      }, 1000);
    }
    // `dice${activePlayer}`.src = `/images/dice/dice-${diceRoll}.jpg`; // Display final result image
  });

// Listen for the game winner
socket.on("snake-ladder-winner", ({ winner }) => {
  winSound.play();
  alert(`Player ${winner} wins the game!`);
  // document.getElementById('reset-game').classList.remove('hidden');
});

document.getElementById('resetButton').addEventListener('click', () => {
  socket.emit("reset-game",{ roomId } );
});

// reset room 
socket.on('game-reseted',({board}) => {
  // document.getElementById('reset-game').classList.add('hidden');
  updatePlayerPosition(board);
});

document.getElementById('Go-Back').addEventListener('click', () => {
  // If you want to go to a specific URL, use window.location.href
  socket.emit('back-click', {roomId});
});

socket.on('back-clicked', () => {
  window.location.href = `/room?roomId=${roomId}&currentPlayer=${currentUser}`;
});
