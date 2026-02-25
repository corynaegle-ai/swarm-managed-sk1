// Main game application with score tracking and display integration

// Game state variables
let scores = {}; // Object to hold player scores, e.g., { player1: [10, 20], player2: [15, 25] }
let currentRound = 1;
let gameOver = false;

// DOM elements
const scoreDisplay = document.getElementById('score-display');

// Function to update score display
function updateScoreDisplay() {
  if (!scoreDisplay) return;

  let html = '<div class="score-table">';
  // Header
  html += '<div class="score-header">Player</div>';
  for (let round = 1; round <= currentRound; round++) {
    html += `<div class="score-header ${round === currentRound ? 'current-round' : ''}">Round ${round}</div>`;
  }
  html += '<div class="score-header">Total</div>';

  // Rows for each player
  for (const player in scores) {
    html += '<div class="score-row">';
    html += `<div class="score-cell">${player}</div>`;
    let total = 0;
    scores[player].forEach((score, index) => {
      total += score;
      html += `<div class="score-cell">${score}</div>`;
    });
    html += `<div class="score-cell">${total}</div>`;
    html += '</div>';
  }

  // Final rankings if game over
  if (gameOver) {
    html += '<div class="final-rankings">';
    const sortedPlayers = Object.keys(scores).sort((a, b) => {
      const totalA = scores[a].reduce((sum, s) => sum + s, 0);
      const totalB = scores[b].reduce((sum, s) => sum + s, 0);
      return totalB - totalA;
    });
    sortedPlayers.forEach((player, index) => {
      const total = scores[player].reduce((sum, s) => sum + s, 0);
      html += `<div class="score-row">`;
      html += `<div class="score-cell ${index === 0 ? 'winner' : ''}">${index + 1}. ${player}</div>`;
      html += `<div class="score-cell">${total}</div>`;
      html += '</div>';
    });
    html += '</div>';
  }

  html += '</div>';
  scoreDisplay.innerHTML = html;
}

// Function to add score for a player
function addScore(player, score) {
  if (!scores[player]) {
    scores[player] = [];
  }
  scores[player].push(score);
  updateScoreDisplay();
}

// Function to advance round
function nextRound() {
  currentRound++;
}

// Function to end game
function endGame() {
  gameOver = true;
  updateScoreDisplay();
}

// Main game loop (placeholder)
function gameLoop() {
  // Example: Simulate score updates
  // In real app, this would be triggered by game events
  setTimeout(() => {
    addScore('Player1', Math.floor(Math.random() * 10));
    addScore('Player2', Math.floor(Math.random() * 10));
    nextRound();
    if (currentRound > 5) {
      endGame();
    } else {
      gameLoop();
    }
  }, 1000);
}

// Initialize
window.onload = () => {
  updateScoreDisplay();
  // Start game loop
  gameLoop();
};