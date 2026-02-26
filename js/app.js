// TODO: Player names are hardcoded in index.html score table header.
// Consider implementing data-driven approach for dynamic player support.

// Game state
const gameState = {
    currentRound: 1,
    maxRounds: 13,
    scores: [
        { player: 'Player 1', scores: [] },
        { player: 'Player 2', scores: [] },
        { player: 'Player 3', scores: [] },
        { player: 'Player 4', scores: [] }
    ]
};

// Initialize score display
function initializeScoreDisplay() {
    const scoreRowsContainer = document.getElementById('score-rows');
    scoreRowsContainer.innerHTML = '';
}

// Update score display after scores are submitted
function updateScoreDisplay(roundNumber, roundScores) {
    const scoreRowsContainer = document.getElementById('score-rows');
    
    // Create score row
    const scoreRow = document.createElement('div');
    scoreRow.className = 'score-row';
    if (roundNumber === gameState.currentRound) {
        scoreRow.classList.add('current-round');
    }
    
    // Calculate round total
    const roundTotal = roundScores.reduce((sum, score) => sum + score, 0);
    
    // Build row HTML
    let rowHTML = `<div class="round-label">Round ${roundNumber}</div>`;
    roundScores.forEach(score => {
        rowHTML += `<div class="player-score">${score}</div>`;
    });
    rowHTML += `<div class="total-score">${roundTotal}</div>`;
    
    scoreRow.innerHTML = rowHTML;
    scoreRowsContainer.appendChild(scoreRow);
}

// Update cumulative scores in table
function updateCumulativeScores() {
    const scoreRowsContainer = document.getElementById('score-rows');
    const rows = scoreRowsContainer.querySelectorAll('.score-row');
    
    let cumulativeScores = [0, 0, 0, 0];
    
    rows.forEach((row, index) => {
        const playerScores = row.querySelectorAll('.player-score');
        playerScores.forEach((scoreEl, playerIndex) => {
            const score = parseInt(scoreEl.textContent);
            cumulativeScores[playerIndex] += score;
        });
    });
}

// Display final rankings when game ends
function displayFinalRankings() {
    const rankingsList = document.getElementById('rankings-list');
    const finalRankingsSection = document.getElementById('final-rankings');
    
    // Calculate final scores for each player
    const finalScores = gameState.scores.map((playerData, index) => {
        const totalScore = playerData.scores.reduce((sum, score) => sum + score, 0);
        return {
            rank: 0,
            name: playerData.player,
            score: totalScore
        };
    });
    
    // Sort by score descending
    finalScores.sort((a, b) => b.score - a.score);
    
    // Assign ranks
    finalScores.forEach((player, index) => {
        player.rank = index + 1;
    });
    
    // Clear previous rankings
    rankingsList.innerHTML = '';
    
    // Add ranking items
    finalScores.forEach(player => {
        const rankingItem = document.createElement('div');
        rankingItem.className = `ranking-item rank-${player.rank}`;
        rankingItem.innerHTML = `
            <span class="ranking-position">#${player.rank}</span>
            <span class="ranking-name">${player.name}</span>
            <span class="ranking-score">${player.score} points</span>
        `;
        rankingsList.appendChild(rankingItem);
    });
    
    // Show final rankings section
    finalRankingsSection.style.display = 'block';
}

// Handle score form submission
function handleScoreSubmission(event) {
    event.preventDefault();
    
    // Get form data
    const formData = new FormData(document.getElementById('score-form'));
    const roundScores = [];
    
    // Extract player scores
    for (let i = 1; i <= 4; i++) {
        const tricks = parseInt(formData.get(`player${i}-tricks`)) || 0;
        const bonus = parseInt(formData.get(`player${i}-bonus`)) || 0;
        const totalScore = tricks + bonus;
        roundScores.push(totalScore);
        
        // Store in game state
        gameState.scores[i - 1].scores.push(totalScore);
    }
    
    // Update score display
    updateScoreDisplay(gameState.currentRound, roundScores);
    updateCumulativeScores();
    
    // Check if game is complete
    if (gameState.currentRound >= gameState.maxRounds) {
        displayFinalRankings();
        // Disable form after final round
        document.getElementById('score-form').style.display = 'none';
    } else {
        // Move to next round
        gameState.currentRound++;
        updateRoundDisplay();
        // Reset form for next round
        document.getElementById('score-form').reset();
    }
}

// Update round display
function updateRoundDisplay() {
    document.getElementById('current-round').textContent = `Round: ${gameState.currentRound}`;
}

// Initialize game
function initializeGame() {
    initializeScoreDisplay();
    updateRoundDisplay();
    
    // Attach form submission handler
    const scoreForm = document.getElementById('score-form');
    if (scoreForm) {
        scoreForm.addEventListener('submit', handleScoreSubmission);
    }
}

// Start game when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeGame);
} else {
    initializeGame();
}
let rounds = [];
let currentRound = 0;
let gameOver = false;

function addScore(round, p1, p2, p3, p4) {
    rounds.push({ round: round, p1: p1, p2: p2, p3: p3, p4: p4, total: p1 + p2 + p3 + p4 });
    updateScoreDisplay();
}

function updateScoreDisplay() {
    const scoreRows = document.getElementById('score-rows');
    const rankingsList = document.getElementById('rankings-list');
    const finalRankings = document.getElementById('final-rankings');
    
    scoreRows.innerHTML = '';
    
    rounds.forEach((scoreData, index) => {
        const rowHTML = `<div class="score-row">
            <div class="score-cell">${scoreData.round}</div>
            <div class="score-cell">${scoreData.p1}</div>
            <div class="score-cell">${scoreData.p2}</div>
            <div class="score-cell">${scoreData.p3}</div>
            <div class="score-cell">${scoreData.p4}</div>
            <div class="score-cell">${scoreData.total}</div>
        </div>`;
        scoreRows.innerHTML += rowHTML;
    });
    
    if (gameOver && rankingsList && finalRankings) {
        const totals = [
            { name: 'Player 1', score: rounds.reduce((sum, r) => sum + r.p1, 0) },
            { name: 'Player 2', score: rounds.reduce((sum, r) => sum + r.p2, 0) },
            { name: 'Player 3', score: rounds.reduce((sum, r) => sum + r.p3, 0) },
            { name: 'Player 4', score: rounds.reduce((sum, r) => sum + r.p4, 0) }
        ];
        totals.sort((a, b) => b.score - a.score);
        rankingsList.innerHTML = totals.map((p, i) => `<div>${i + 1}. ${p.name}: ${p.score}</div>`).join('');
        finalRankings.style.display = 'block';
    }
}

function endGame() {
    gameOver = true;
    updateScoreDisplay();
}

window.onload = function() {
    // Initialize if needed
};
