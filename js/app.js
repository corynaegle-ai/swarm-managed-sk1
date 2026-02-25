// Game State
let gameState = {
    currentRound: 1,
    players: [],
    scores: {}, // { playerName: [score1, score2, ...] }
    handsThisRound: 0
};

/**
 * Initialize the application with player count
 * @param {number} playerCount - Number of players (default 4)
 */
function initializeGame(playerCount = 4) {
    gameState.players = Array.from({ length: playerCount }, (_, i) => `Player ${i + 1}`);
    gameState.scores = {};
    gameState.players.forEach(player => {
        gameState.scores[player] = [];
    });
    
    // Generate dynamic score table header
    generateScoreTableHeader();
    
    // Update CSS grid to match player count
    updateScoreTableGridColumns(playerCount);
}

/**
 * Generate score table header dynamically based on player count
 */
function generateScoreTableHeader() {
    const headerContainer = document.getElementById('score-header');
    headerContainer.innerHTML = '';
    headerContainer.style.display = 'grid';
    headerContainer.style.gridAutoFlow = 'column';
    headerContainer.style.gridAutoColumns = '1fr';
    
    // Add Round column
    const roundHeader = document.createElement('div');
    roundHeader.textContent = 'Round';
    headerContainer.appendChild(roundHeader);
    
    // Add player columns
    gameState.players.forEach(player => {
        const playerHeader = document.createElement('div');
        playerHeader.textContent = player;
        headerContainer.appendChild(playerHeader);
    });
    
    // Add Total column
    const totalHeader = document.createElement('div');
    totalHeader.textContent = 'Total';
    headerContainer.appendChild(totalHeader);
}

/**
 * Update CSS grid columns dynamically
 * @param {number} playerCount - Number of players
 */
function updateScoreTableGridColumns(playerCount) {
    const scoreTableContainer = document.getElementById('score-table-container');
    // Grid layout: Round + Players + Total
    const columnCount = playerCount + 2;
    scoreTableContainer.style.gridTemplateColumns = `repeat(${columnCount}, 1fr)`;
}

/**
 * Add a round's scores to the display
 * @param {number} roundNumber - Round number
 * @param {object} roundScores - Object with player names as keys and scores as values
 */
function addScoreRow(roundNumber, roundScores) {
    const scoreRowsContainer = document.getElementById('score-rows');
    const scoreRow = document.createElement('div');
    scoreRow.className = 'score-row';
    scoreRow.id = `round-${roundNumber}`;
    
    // Mark current round
    if (roundNumber === gameState.currentRound) {
        scoreRow.classList.add('current-round');
    }
    
    // Round number
    const roundCell = document.createElement('div');
    roundCell.className = 'round-col';
    roundCell.textContent = roundNumber;
    scoreRow.appendChild(roundCell);
    
    // Player scores
    let roundTotal = 0;
    gameState.players.forEach(player => {
        const score = roundScores[player] || 0;
        gameState.scores[player][roundNumber - 1] = score;
        roundTotal += score;
        
        const scoreCell = document.createElement('div');
        scoreCell.className = 'player-score';
        scoreCell.textContent = score;
        scoreRow.appendChild(scoreCell);
    });
    
    // Total for round
    const totalCell = document.createElement('div');
    totalCell.className = 'total-col';
    totalCell.textContent = roundTotal;
    scoreRow.appendChild(totalCell);
    
    scoreRowsContainer.appendChild(scoreRow);
}

/**
 * Update score display with current game state
 */
function updateScoreDisplay() {
    const scoreRowsContainer = document.getElementById('score-rows');
    scoreRowsContainer.innerHTML = '';
    
    // Redraw all score rows
    Object.keys(gameState.scores[gameState.players[0]] || []).forEach((_, roundIndex) => {
        const roundNumber = roundIndex + 1;
        const roundScores = {};
        gameState.players.forEach(player => {
            roundScores[player] = gameState.scores[player][roundIndex] || 0;
        });
        addScoreRow(roundNumber, roundScores);
    });
}

/**
 * Get cumulative scores for each player
 * @returns {object} Object with player names as keys and cumulative scores as values
 */
function getCumulativeScores() {
    const cumulativeScores = {};
    gameState.players.forEach(player => {
        cumulativeScores[player] = (gameState.scores[player] || []).reduce((sum, score) => sum + score, 0);
    });
    return cumulativeScores;
}

/**
 * Display final rankings
 */
function displayFinalRankings() {
    const cumulativeScores = getCumulativeScores();
    const rankings = gameState.players
        .map(player => ({
            name: player,
            score: cumulativeScores[player]
        }))
        .sort((a, b) => b.score - a.score);
    
    const rankingsList = document.getElementById('rankings-list');
    rankingsList.innerHTML = '';
    
    rankings.forEach((ranking, index) => {
        const rankingItem = document.createElement('div');
        rankingItem.className = 'ranking-item';
        
        // Add placement class
        if (index === 0) rankingItem.classList.add('first-place');
        else if (index === 1) rankingItem.classList.add('second-place');
        else if (index === 2) rankingItem.classList.add('third-place');
        
        // Ranking position
        const position = document.createElement('div');
        position.className = 'ranking-position';
        position.textContent = `#${index + 1}`;
        if (index === 0) position.classList.add('first-place');
        else if (index === 1) position.classList.add('second-place');
        else if (index === 2) position.classList.add('third-place');
        rankingItem.appendChild(position);
        
        // Player name
        const playerName = document.createElement('div');
        playerName.className = 'ranking-player-name';
        playerName.textContent = ranking.name;
        rankingItem.appendChild(playerName);
        
        // Score
        const score = document.createElement('div');
        score.className = 'ranking-score';
        score.textContent = ranking.score;
        rankingItem.appendChild(score);
        
        rankingsList.appendChild(rankingItem);
    });
    
    document.getElementById('final-rankings').style.display = 'block';
}

/**
 * Update round display
 */
function updateRoundDisplay() {
    document.getElementById('current-round').textContent = `Round: ${gameState.currentRound}`;
    document.getElementById('hands-info').textContent = `${gameState.handsThisRound} hands this round`;
}

/**
 * Submit scores for current round
 * @param {object} scoreData - Object with player names as keys and score values
 */
function submitRoundScores(scoreData) {
    // Add score row to display
    addScoreRow(gameState.currentRound, scoreData);
    
    // Update score display
    updateScoreDisplay();
}

/**
 * Advance to next round
 */
function nextRound() {
    gameState.currentRound++;
    gameState.handsThisRound = 0;
    updateRoundDisplay();
    updateScoreDisplay();
}

/**
 * End game and display final rankings
 */
function endGame() {
    displayFinalRankings();
}

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initializeGame(4); // Initialize with 4 players
    updateRoundDisplay();
    
    // Hook up score form submission
    const scoreForm = document.getElementById('score-form');
    if (scoreForm) {
        scoreForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Collect scores from form
            const scoreData = {};
            gameState.players.forEach((player, index) => {
                const playerNum = index + 1;
                const tricks = parseInt(document.getElementById(`player${playerNum}-tricks`).value) || 0;
                const bonus = parseInt(document.getElementById(`player${playerNum}-bonus`).value) || 0;
                scoreData[player] = tricks + bonus;
            });
            
            // Submit and update display
            submitRoundScores(scoreData);
            
            // Clear form
            scoreForm.reset();
        });
    }
});
// Main game application with score tracking and display integration

// Data model: per-round structure
let rounds = [];
let currentRoundNumber = 1;

// Function to update score display
function updateScoreDisplay() {
  // Update score rows (current rounds table)
  let rowsHtml = '';
  rounds.forEach(round => {
    const roundClass = round.round === currentRoundNumber ? 'current-round' : '';
    rowsHtml += `<div class="score-row ${roundClass}">`;
    rowsHtml += `<div class="score-cell">Round ${round.round}</div>`;
    rowsHtml += `<div class="score-cell">${round.p1}</div>`;
    rowsHtml += `<div class="score-cell">${round.p2}</div>`;
    rowsHtml += `<div class="score-cell">${round.p3}</div>`;
    rowsHtml += `<div class="score-cell">${round.p4}</div>`;
    const total = round.p1 + round.p2 + round.p3 + round.p4;
    rowsHtml += `<div class="score-cell">${total}</div>`;
    rowsHtml += '</div>';
  });
  document.getElementById('score-rows').innerHTML = rowsHtml;

  // Calculate cumulative totals for each player
  let p1Total = 0, p2Total = 0, p3Total = 0, p4Total = 0;
  rounds.forEach(round => {
    p1Total += round.p1;
    p2Total += round.p2;
    p3Total += round.p3;
    p4Total += round.p4;
  });

  // Build rankings data
  const rankingsData = [
    { name: 'Player 1', total: p1Total },
    { name: 'Player 2', total: p2Total },
    { name: 'Player 3', total: p3Total },
    { name: 'Player 4', total: p4Total }
  ];

  // Sort by total (descending)
  rankingsData.sort((a, b) => b.total - a.total);

  // Update rankings list
  let rankingsHtml = '';
  rankingsData.forEach((player, index) => {
    const winnerClass = index === 0 ? 'winner' : '';
    rankingsHtml += `<div class="score-row">`;
    rankingsHtml += `<div class="score-cell ${winnerClass}">${index + 1}. ${player.name}</div>`;
    rankingsHtml += `<div class="score-cell ${winnerClass}">${player.total}</div>`;
    rankingsHtml += '</div>';
  });
  document.getElementById('rankings-list').innerHTML = rankingsHtml;
}

// Function to add a round of scores
function addRound(p1, p2, p3, p4) {
  const round = {
    round: currentRoundNumber,
    p1: p1,
    p2: p2,
    p3: p3,
    p4: p4
  };
  rounds.push(round);
  updateScoreDisplay();
}

// Function to advance to next round
function nextRound() {
  currentRoundNumber++;
  updateScoreDisplay();
}
