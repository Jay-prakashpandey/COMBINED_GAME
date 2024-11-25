const socket = io();
const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get('roomId');
const currentPlayer = urlParams.get('currentPlayer');

// Variable to hold player symbol
let playerSymbol = '';

function updateRoomDisplay(roomData) {
  document.getElementById('roomIdDisplay').innerText = roomId;
  document.getElementById('player1Name').innerText = roomData.player1?.name || 'Waiting...';
  document.getElementById('player2Name').innerText = roomData.player2?.name || 'Waiting for Player 2...';
  document.getElementById('gameSelected').innerText = roomData.selectedGame || '';
}

function toggleGameSelection(visible) {
  const action = visible ? 'remove' : 'add';
  document.getElementById('gameSelected').classList[action]('hidden');
  document.getElementById('gameSelection').classList[action]('hidden');
  document.getElementById('startGameButton').classList[action]('hidden');
}


socket.emit('update-room',{currentPlayer ,roomId});

socket.on('room-updated', ({ roomData}) => {
  updateRoomDisplay(roomData);
  toggleGameSelection(roomData.player1 && roomData.player2);
});

document.getElementById('startGameButton').addEventListener('click', () => {
  const selectedGame = document.getElementById('gameSelect').value;
  selectedGame
      ? socket.emit('game-selected', { roomId, game: selectedGame })
      : alert('Please select a game first!');
});

socket.on('game-selection-update', ({ selectedGame }) => {
  document.getElementById('gameSelect').value = selectedGame ;
});

socket.on('redirect-to-game', ({ roomId, game }) => {
  const gameRoutes = {
      'Tic-Tac-Toe': `/tic-tac-toe`,
      'Snake and Ladder': `/snake-ladder`,
      'Ludo': `/ludo`,
      'Truth-Dare': `/truth-dare`,
      'connect4': `/connect4`,
      'chess': `/chess`
  };
  if (gameRoutes[game]) {
      window.location.href = `${gameRoutes[game]}?roomId=${roomId}&currentUser=${currentPlayer}`;
  } else {
      alert('Invalid game selection');
  }
});

socket.on('room-full', () => alert('Room is full!'));
socket.on('error', ({ message }) => alert(message));
