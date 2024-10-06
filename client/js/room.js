// window.onload = () => {
const socket = io();
const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get('roomId');
const currentPlayer = urlParams.get('currentPlayer');

// Variable to hold player symbol
let playerSymbol = '';

socket.emit('update-room',{currentPlayer ,roomId});

socket.on('room-updated', ({ roomData, roomId }) => {
  
  alert('this is called '+roomId+' roomData '+roomData.player1+', '+roomData.player2);
  
  document.getElementById('roomIdDisplay').innerText = roomId;
  document.getElementById('player1Name').innerText = roomData.player1.name ? roomData.player1.name : 'Waiting...';
  document.getElementById('player2Name').innerText = roomData.player2.name ? roomData.player2.name : 'Waiting for Player 2...';
  document.getElementById('gameSelected').innerHTML = roomData.selectedGame;

  if (roomData.player1 && roomData.player2) {
    document.getElementById('gameSelected').classList.remove('hidden');
    document.getElementById('gameSelection').classList.remove('hidden');
    document.getElementById('startGameButton').classList.remove('hidden');
  } else {
    document.getElementById('gameSelect').classList.add('hidden');
    document.getElementById('startGameButton').classList.add('hidden');
  }
});

document.getElementById('startGameButton').addEventListener('click', () => {
  const selectedGame = document.getElementById('gameSelect').value;
  if (selectedGame) {
    socket.emit('game-selected', { roomId, game: selectedGame });
  } else {
    alert('Please select a game first!');
  }
});

socket.on('game-selection-update', ({ selectedGame }) => {
  document.getElementById('gameSelect').value = selectedGame ;
  alert(`Game selected: ${selectedGame}`);
});

socket.on('redirect-to-game', ({ roomId, game, playerSymbol }) => {
  switch (game) {
    case 'Tic-Tac-Toe':
      window.location.href = `/tic-tac-toe?roomId=${roomId}&currentUser=${currentPlayer}`;
      break;
    case 'Snake and Ladder':
      window.location.href = `/snake-ladder?roomId=${roomId}&currentUser=${currentPlayer}`;
      break;
    case 'Ludo':
      window.location.href = `/ludo?roomId=${roomId}&currentUser=${currentPlayer}`;
      break;
    case 'Truth-Dare':
      window.location.href = `/truth-dare?roomId=${roomId}&currentUser=${currentPlayer}`;
      break;
    default:
      alert('Invalid game selection');
  }
});


socket.on('room-full', () => {
  alert('Room is full!');
});

socket.on('error', ({ message }) => {
  alert(message);
});

// };