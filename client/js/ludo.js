const socket = io();
document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const roomId = urlParams.get('roomId');
  let currentPlayer = 1;

  const rollDiceButton = document.getElementById("roll-dice");
  const diceValueDisplay = document.getElementById("dice-value");

  rollDiceButton.addEventListener("click", () => {
    const diceRoll = Math.floor(Math.random() * 6) + 1;
    socket.emit("roll-dice-ludo", { roomId, currentPlayer, diceRoll });
  });

  socket.on("dice-result-ludo", ({ diceRoll, player }) => {
    diceValueDisplay.textContent = `Player ${player} rolled: ${diceRoll}`;
    currentPlayer = player === 1 ? 2 : 1;
  });

  socket.on("ludo-game-update", (gameState) => {
    // Update game board logic with gameState positions, etc.
  });

  socket.on("ludo-game-finished", ({ winner }) => {
    alert(`Player ${winner} wins the Ludo game!`);
  });
});
