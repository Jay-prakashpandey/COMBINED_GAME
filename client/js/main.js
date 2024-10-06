const socket = io();

// Enter player name
document.getElementById('enterNameButton').addEventListener('click', () => {
    const playerName = document.getElementById('playerName').value.trim();
    if (!playerName) return;
    document.getElementById('displayName').innerText = playerName;
    document.getElementById('roomOptions').classList.remove('hidden');
});

// Create a new room
document.getElementById('createRoomButton').addEventListener('click', () => {
    const playerName = document.getElementById('playerName').value.trim();
    if (!playerName) return;
    socket.emit('create-room', { playerName });
});

//join button 
document.getElementById('joinRoomButton').addEventListener('click', () => {
    document.getElementById('joinRoomForm').classList.remove('hidden');
});

// Join an existing room
document.getElementById('joinRoomSubmitButton').addEventListener('click', () => {
    const roomId = document.getElementById('roomId').value.trim();
    const playerName = document.getElementById('playerName').value.trim();
    if (!roomId || !playerName) return;
    socket.emit('join-room', { playerName, roomId });
});

// Room created handler
socket.on('room-created', ({ playerName, roomId }) => {
    socket.emit('join-room', { playerName, roomId });
});

// Room joined handler
socket.on('room-joined', ({ playerName, roomId }) => {
    window.location.href = `/room?roomId=${roomId}&currentPlayer=${playerName}`;
});

// Handle errors
socket.on('error', ({ message }) => {
    alert(message);
});
