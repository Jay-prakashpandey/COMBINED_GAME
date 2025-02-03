const socket = io();

const createRoomButton = document.getElementById('createRoomButton');
const joinRoomForm = document.getElementById('joinRoomForm');

createRoomButton.addEventListener('click', () => {
    joinRoomForm.classList.add('hidden'); // Hide join room form
});

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
    const link = `${window.location.origin}/room.html?roomId=${roomId}`;
    shareLink.innerText = `Share this link: ${link}`;
    document.getElementById('shareLinkContainer').classList.remove('hidden');

    // Add functionality to copy the link
    document.getElementById('copyLinkButton').addEventListener('click', () => {
        navigator.clipboard.writeText(link)
        .then(() => alert('Link copied to clipboard!'))
        .catch((err) => alert('Failed to copy link.'));
    });
});

// Room joined handler
socket.on('room-joined', ({ playerName, roomId }) => {
    window.location.href = `/room?roomId=${roomId}&currentPlayer=${playerName}`;
});

// Handle errors
socket.on('error', ({ message }) => {
    alert(message);
});
