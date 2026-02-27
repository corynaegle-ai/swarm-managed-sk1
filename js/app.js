// Game state management
let rounds = [];
let currentRound = 0;
let gameOver = false;

/**
 * Updates the score display table and final rankings if game is over.
 * Reads from the global `rounds` array and displays scores in score-rows.
 */
function updateScoreDisplay() {
    var scoreRows = document.getElementById('score-rows');
    var rankingsList = document.getElementById('rankings-list');
    var finalRankings = document.getElementById('final-rankings');
    
    if (!scoreRows) return;
    
    // Clear existing rows
    while (scoreRows.firstChild) {
        scoreRows.removeChild(scoreRows.firstChild);
    }
    
    // Add score rows
    for (var i = 0; i < rounds.length; i++) {
        var scoreData = rounds[i];
        var scoreRow = document.createElement('div');
        scoreRow.className = 'score-row' + (scoreData.round === currentRound ? ' current-round' : '');
        
        var roundCell = document.createElement('div');
        roundCell.className = 'score-cell';
        roundCell.textContent = scoreData.round;
        scoreRow.appendChild(roundCell);
        
        var p1Cell = document.createElement('div');
        p1Cell.className = 'score-cell';
        p1Cell.textContent = scoreData.p1;
        scoreRow.appendChild(p1Cell);
        
        var p2Cell = document.createElement('div');
        p2Cell.className = 'score-cell';
        p2Cell.textContent = scoreData.p2;
        scoreRow.appendChild(p2Cell);
        
        var p3Cell = document.createElement('div');
        p3Cell.className = 'score-cell';
        p3Cell.textContent = scoreData.p3;
        scoreRow.appendChild(p3Cell);
        
        var p4Cell = document.createElement('div');
        p4Cell.className = 'score-cell';
        p4Cell.textContent = scoreData.p4;
        scoreRow.appendChild(p4Cell);
        
        var totalCell = document.createElement('div');
        totalCell.className = 'score-cell';
        totalCell.textContent = scoreData.total;
        scoreRow.appendChild(totalCell);
        
        scoreRows.appendChild(scoreRow);
    }
    
    // Display final rankings if game is over
    if (gameOver && rankingsList && finalRankings) {
        var totals = [];
        var playerNames = ['Player 1', 'Player 2', 'Player 3', 'Player 4'];
        
        for (var p = 0; p < 4; p++) {
            var sum = 0;
            for (var r = 0; r < rounds.length; r++) {
                if (p === 0) sum = sum + rounds[r].p1;
                else if (p === 1) sum = sum + rounds[r].p2;
                else if (p === 2) sum = sum + rounds[r].p3;
                else if (p === 3) sum = sum + rounds[r].p4;
            }
            totals.push({ name: playerNames[p], score: sum });
        }
        
        totals.sort(function(a, b) { return b.score - a.score; });
        
        while (rankingsList.firstChild) {
            rankingsList.removeChild(rankingsList.firstChild);
        }
        
        for (var k = 0; k < totals.length; k++) {
            var rank = k + 1;
            var rankingItem = document.createElement('div');
            rankingItem.className = 'ranking-item rank-' + rank;
            
            var rankSpan = document.createElement('span');
            rankSpan.className = 'ranking-position';
            rankSpan.textContent = rank;
            rankingItem.appendChild(rankSpan);
            
            var nameSpan = document.createElement('span');
            nameSpan.className = 'ranking-name';
            nameSpan.textContent = totals[k].name;
            rankingItem.appendChild(nameSpan);
            
            var scoreSpan = document.createElement('span');
            scoreSpan.className = 'ranking-score';
            scoreSpan.textContent = totals[k].score + ' points';
            rankingItem.appendChild(scoreSpan);
            
            rankingsList.appendChild(rankingItem);
        }
        finalRankings.style.display = 'block';
    }
}

/**
 * Adds a score entry for a given round.
 * @param {number} roundNum - The round number
 * @param {number} p1 - Player 1 score
 * @param {number} p2 - Player 2 score
 * @param {number} p3 - Player 3 score
 * @param {number} p4 - Player 4 score
 */
function addScore(roundNum, p1, p2, p3, p4) {
    rounds.push({ round: roundNum, p1: p1, p2: p2, p3: p3, p4: p4, total: p1 + p2 + p3 + p4 });
    updateScoreDisplay();
}

/**
 * Ends the game and displays final rankings.
 */
function endGame() {
    gameOver = true;
    updateScoreDisplay();
}

/**
 * Updates the round display text.
 */
function updateRoundDisplay() {
    var roundSpan = document.getElementById('current-round');
    if (roundSpan) {
        roundSpan.textContent = 'Round: ' + currentRound;
    }
}

/**
 * Handles form submission for score input.
 * @param {Event} event - The form submit event
 */
function handleScoreSubmission(event) {
    event.preventDefault();
    
    var form = document.getElementById('score-form');
    var p1TricksInput = document.getElementById('player1-tricks');
    var p1BonusInput = document.getElementById('player1-bonus');
    var p2TricksInput = document.getElementById('player2-tricks');
    var p2BonusInput = document.getElementById('player2-bonus');
    var p3TricksInput = document.getElementById('player3-tricks');
    var p3BonusInput = document.getElementById('player3-bonus');
    var p4TricksInput = document.getElementById('player4-tricks');
    var p4BonusInput = document.getElementById('player4-bonus');
    
    if (!p1TricksInput || !p2TricksInput || !p3TricksInput || !p4TricksInput) {
        return;
    }
    
    var p1Tricks = parseInt(p1TricksInput.value) || 0;
    var p1Bonus = parseInt(p1BonusInput.value) || 0;
    var p2Tricks = parseInt(p2TricksInput.value) || 0;
    var p2Bonus = parseInt(p2BonusInput.value) || 0;
    var p3Tricks = parseInt(p3TricksInput.value) || 0;
    var p3Bonus = parseInt(p3BonusInput.value) || 0;
    var p4Tricks = parseInt(p4TricksInput.value) || 0;
    var p4Bonus = parseInt(p4BonusInput.value) || 0;
    
    var p1Score = p1Tricks + p1Bonus;
    var p2Score = p2Tricks + p2Bonus;
    var p3Score = p3Tricks + p3Bonus;
    var p4Score = p4Tricks + p4Bonus;
    
    currentRound = currentRound + 1;
    updateRoundDisplay();
    addScore(currentRound, p1Score, p2Score, p3Score, p4Score);
    
    if (currentRound >= 13) {
        endGame();
        if (form) {
            form.style.display = 'none';
        }
    } else {
        form.reset();
    }
}

/**
 * Initialize the game when the window loads.
 */
window.addEventListener('load', function() {
    var form = document.getElementById('score-form');
    if (form) {
        form.addEventListener('submit', handleScoreSubmission);
    }
});
