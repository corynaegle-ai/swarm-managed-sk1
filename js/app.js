import GameState from './game.js';

const gameState = new GameState();

const playerForm = document.querySelector('#player-form');
const playerNameInput = document.querySelector('#player-name');
const errorMessageDiv = document.querySelector('#error-message');
const playerList = document.querySelector('#player-list');
const startGameButton = document.querySelector('#start-game');

function validateName(name) {
  const trimmed = name.trim();
  if (trimmed === '') {
    return 'Player name cannot be empty.';
  }
  const players = gameState.getPlayers();
  if (players.some(player => player.name === trimmed)) {
    return 'Player name must be unique.';
  }
  return null;
}

function displayError(message) {
  errorMessageDiv.textContent = message;
  errorMessageDiv.style.display = 'block';
}

function clearError() {
  errorMessageDiv.textContent = '';
  errorMessageDiv.style.display = 'none';
}

function updateUI() {
  renderPlayerList();
  updateStartButton();
}

function renderPlayerList() {
  playerList.innerHTML = '';
  const players = gameState.getPlayers();
  players.forEach((player, index) => {
    const li = document.createElement('li');
    li.textContent = player.name;
    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remove';
    removeBtn.addEventListener('click', () => {
      gameState.removePlayer(index);
      updateUI();
    });
    li.appendChild(removeBtn);
    playerList.appendChild(li);
  });
}

function updateStartButton() {
  const players = gameState.getPlayers();
  startGameButton.disabled = players.length < 2 || players.length > 8;
}

playerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = playerNameInput.value;
  const players = gameState.getPlayers();
  if (players.length >= 8) {
    displayError('Maximum 8 players allowed.');
    return;
  }
  const error = validateName(name);
  if (error) {
    displayError(error);
  } else {
    clearError();
    gameState.addPlayer(name.trim());
    updateUI();
    playerForm.reset();
  }
});

// Initial render
updateUI();