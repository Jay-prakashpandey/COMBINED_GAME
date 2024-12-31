const socket = io();
const rollingSound = new Audio('/audio/rpg-dice-rolling-95182.mp3');
const winSound = new Audio('/audio/winharpsichord-39642.mp3');
const moveSound = new Audio('/audio/move.mp3');

const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get('roomId');
const currentUser = urlParams.get('currentUser');

let playerSymbol = null; // The symbol ('X' or 'O') assigned to the current user
let activePlayer = "X"; // The player whose turn it currently is
let Gp1=null,Gp2=null;
let _board={X:0, O:0};

const gameBoard = document.getElementById("game-board");
const diceX = document.getElementById('dice-imageX');
const diceO = document.getElementById('dice-imageO');
const snake_ladder = [ [99,83,78,63,57,44,38,24,17,4],[94,87,75],[70,69,51],[52,49,32,29],[30,11],[21,40,59,62,83,98],[3,18,23,38,57,64,77,84],[54,67,74,88,93],[7,14,23,33,48,53] ];

// Request the game state when reconnecting
socket.emit('reconnect-room', { roomId, playerName: currentUser , gameSelected: 'snake_ladder'});

function createBoard(){
  gameBoard.innerHTML='';
  let index = 100;
  for (let row = 10; row > 0; row--) {
    for (let col = 1; col <= 10; col++) {
      const cellIndex = row % 2 === 0 ? index - col + 1 : index - (10 - col); // alternate directions
      const cell = document.createElement("div");
      cell.classList.add("box");
      cell.id = `cell-${cellIndex}`;
      if ( cellIndex === 1 || cellIndex === _board['X'] || cellIndex === _board['O'] ) {
    
        if(_board['X'] ===0 || (_board['X'] === cellIndex && _board['X'] !== 0)){
          cell.classList.add(`player-X`);
        }  
        if(_board['O'] ===0 || (_board['O'] === cellIndex && _board['O'] !== 0)){
          cell.classList.add(`player-O`);
        }
      } else {
        cell.textContent = '';
      }
      gameBoard.appendChild(cell);
    }
    index -= 10;
  }
}

function updatePlayerPosition(board, symbol, diceRoll){
  
  if(board[symbol]!==0) {
    const path = generatePath(_board[symbol], board[symbol], diceRoll);
    animateSnakeLadder(path, symbol);
  }
}

// Function to get/generate path for animation/ piece move
function generatePath(intPiecePosition, finalPiecePosition, diceRoll) {
  
  if(diceRoll !== 6){
    for (const _path of snake_ladder) {
      if (finalPiecePosition === _path[0]) {
        return _path;
      }
    }
  } 
  
  let path=[];
  while(intPiecePosition <= finalPiecePosition){
    intPiecePosition = intPiecePosition === 0 ? 1 : intPiecePosition;
    path.push(intPiecePosition);
    intPiecePosition++;
  }
  return path;
}

// Function to animate snake/ladder movement
function animateSnakeLadder(path, symbol) {
  // let currentPosition = players[playerSymbol].position;
  let index = 0;
  // console.log(`cell-${_board[symbol]}`);
  const animationInterval = setInterval(() => {
    if (index < path.length) {
      document.getElementById(`cell-${_board[symbol]}`).classList.remove(`player-${symbol}`);
      _board[symbol] = path[index];
      moveSound.play();
      document.getElementById(`cell-${_board[symbol]}`).classList.add(`player-${symbol}`);
      index++;
    } else {
      clearInterval(animationInterval); 
    }
  }, 250); // Adjust animation speed as needed
  
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
  const diceRoll = Math.floor(Math.random() * 6) + 1;
  socket.emit("snake-move", { roomId:roomId , _board :_board, activePlayer:activePlayer, diceValue: diceRoll });
}

// Handle receiving the game state after reconnection
socket.on('reconnected', ({ board, currentPlayer, userSymbol, p1, p2 }) => {
    // Update the board with the current game state
    _board = board ;
    playerSymbol= userSymbol;
    Gp1 = p1;
    Gp2 = p2;
    document.getElementById('playerX').innerText=p1;
    document.getElementById('playerO').innerText=p2;
    activePlayer = currentPlayer;
    createBoard();
    toggleDice();
});

socket.on( "updateBoard", ({board, currentPlayer, diceRoll}) => {
    
    if(board.X === 100 || board.O === 100) {
      winSound.play();
      const winner = activePlayer === 'X' ? Gp1 : Gp2 ;
      alert(`${winner} win's the game`);
    }

    const symbol = currentPlayer === 'X' ? 'O' : 'X' ;
    const currentDice = symbol === 'X' ? diceX : diceO;
    
    currentDice.src = '/img/tenor.gif';
    rollingSound.play();

    setTimeout(() => {
      currentDice.src = `/img/dice/dice-${diceRoll}.jpg`;
      updatePlayerPosition(board, symbol, diceRoll);
      activePlayer = currentPlayer ;
      // _board[activePlayer] = board[activePlayer];
    }, 1000);

    setTimeout(() => {
      toggleDice();
    }, 2000);
    
  });



document.getElementById('resetButton').addEventListener('click', () => {
  socket.emit("reset-game",{ roomId } );
});

// reset room 
socket.on('game-reseted',() => {
  // document.getElementById('reset-game').classList.add('hidden');
  _board.O = 0;
  _board.X = 0;
  createBoard();
});

document.getElementById('Go-Back').addEventListener('click', () => {
  // If you want to go to a specific URL, use window.location.href
  socket.emit('back-click', {roomId});
});

socket.on('back-clicked', () => {
  window.location.href = `/room?roomId=${roomId}&currentPlayer=${currentUser}`;
});
