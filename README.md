this is 2-players multi game

client/index.html:
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Multiplayer Game Lobby - Snake and Ladder, Tic-Tac-Toe, Ludo">
  <title>Multiplayer Game Lobby</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <div class="container">
    <h1>Welcome to the Game Lobby</h1>
    <p>Please enter your name to start:</p>
    
    <input type="text" id="playerName" placeholder="Enter your name" required>
    <button id="enterNameButton">Submit</button>

    <div id="roomOptions" class="hidden">
      <h2>Hello <span id="displayName"></span>!</h2>
      <p>Would you like to create a new game room or join an existing one?</p>

      <div class="buttons">
        <button id="createRoomButton">Create Room</button>
        <button id="joinRoomButton">Join Room</button>
      </div>

      <div id="joinRoomForm" class="hidden">
        <input type="text" id="roomId" placeholder="Enter room ID">
        <button id="joinRoomSubmitButton">Join</button>
      </div>
    </div>
  </div>

  <script src="/socket.io/socket.io.js"></script>
  <script src="js/main.js"></script>
</body>
</html>
------------------------
client/css/style.css:
/* General Styles */
body {
    font-family: Arial, sans-serif;
    background-color: #f0f0f0;
    text-align: center;
    margin: 0;
    padding: 0;
}

.container {
    width: 80%;
    margin: auto;
    padding: 20px;
}

.hidden {
    display: none;
}

/* Game-specific Styles */
/* #game-board {
    display: inline-block;
    margin: 20px auto;
    max-width: 600px;
    width: 100%;
    aspect-ratio: 1/1;
    position: relative;
    border: 2px solid #ddd;
} */

table {
    width: 100%;
    height: 100%;
    border-collapse: collapse;
}

td {
    border: 1px solid #ddd;
    width: 33%;
    height: 33%;
    font-size: 40px;
    text-align: center;
    vertical-align: middle;
}

/* Controls */
#game-controls {
    margin-top: 20px;
}

button {
    padding: 10px 20px;
    font-size: 16px;
    background-color: #007bff;
    color: white;
    border: none;
    cursor: pointer;
}

button:disabled {
    background-color: grey;
    color: white;
    cursor: not-allowed;
}

#dice-result, #turn-indicator {
    margin-top: 10px;
    font-size: 18px;
}

/* Basic styling for the game room */
.container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    text-align: center;
    font-family: Arial, sans-serif;
  }
  
  h1, p {
    margin-bottom: 20px;
  }
  
  .hidden {
    display: none;
  }
  
  /* Styling the dropdown (gameSelect) */
  #gameSelect {
    padding: 10px;
    margin-bottom: 20px;
    width: 100%;
    max-width: 300px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #f9f9f9;
    font-size: 16px;
  }
  
  /* Styling the game selection button */
  #gameSelectionButton {
    background-color: #4CAF50;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
  }
  
  #gameSelectionButton:hover {
    background-color: #45a049;
  }
  
  /* Styling for room and player information */
  #roomIdDisplay, #player1Name, #player2Name {
    font-weight: bold;
    font-size: 18px;
  }
  
  /* Button hover and focus effects */
  button:focus, select:focus {
    outline: none;
    box-shadow: 0 0 5px rgba(81, 203, 238, 1);
    border: 1px solid rgba(81, 203, 238, 1);
  }
------------------------------
client/room.html:
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Multiplayer Game Room">
  <title>Game Room</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <div class="container">
    <h1>Game Room</h1>
    <p>Room ID: <span id="roomIdDisplay"></span></p>

    <div>
      <p>Player 1: <span id="player1Name">Waiting...</span></p>
      <p>Player 2: <span id="player2Name">Waiting for Player 2...</span></p>
      <p>gameSelected: <span id="gameSelected" class="hidden"></span> </p>
    </div>

    <div id="gameSelection" class="hidden">
      <label for="gameSelect">Choose a game:</label>
      <select id="gameSelect">
        <option value="Tic-Tac-Toe">Tic-Tac-Toe</option>
        <option value="Snake and Ladder">Snake and Ladder</option>
        <option value="Ludo">Ludo</option>
        <option value="connect4">CONNECT-4</option>
        <option value="Truth-Dare">Truth-Dare</option>
        <option value="chess">Chess</option>
      </select>
      <button id="startGameButton" class="hidden">Start Game</button>
    </div>
  </div>

  <script src="/socket.io/socket.io.js"></script>
  <script src="js/room.js"></script>
</body>
</html>
-------------------------
  
