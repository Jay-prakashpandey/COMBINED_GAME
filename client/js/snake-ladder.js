const socket = io();
document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const roomId = urlParams.get('roomId');
  let playerTurn = 1;

  const rollDiceButton = document.getElementById("roll-dice");
  const diceValueDisplay = document.getElementById("dice-value");

  rollDiceButton.addEventListener("click", () => {
    const diceRoll = Math.floor(Math.random() * 6) + 1;
    socket.emit("roll-dice-snake-ladder", { roomId, playerTurn, diceRoll });
  });

  socket.on("dice-result-snake-ladder", ({ diceRoll, player }) => {
    diceValueDisplay.textContent = `Player ${player} rolled: ${diceRoll}`;
    playerTurn = player === 1 ? 2 : 1;
  });

  socket.on("snake-ladder-game-update", (gameState) => {
    // Update board with player positions using gameState data
  });

  socket.on("snake-ladder-game-finished", ({ winner }) => {
    alert(`Player ${winner} wins the Snake and Ladder game!`);
  });
});
