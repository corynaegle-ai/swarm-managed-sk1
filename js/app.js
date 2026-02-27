let rounds = [];
let currentRound = 0;
let gameOver = false;

function updateScoreDisplay() {
    var scoreRows = document.getElementById('score-rows');
    var rankingsList = document.getElementById('rankings-list');
    var finalRankings = document.getElementById('final-rankings');
    var rowsHTML = '';
    
    for (var i = 0; i < rounds.length; i++) {
        var scoreData = rounds[i];
        rowsHTML += '<div class="score-row' + (scoreData.round === currentRound ? ' current-round' : '') + '">' +
            '<div class="score-cell">' + scoreData.round + '</div>' +
            '<div class="score-cell">' + scoreData.p1 + '</div>' +
            '<div class="score-cell">' + scoreData.p2 + '</div>' +
            '<div class="score-cell">' + scoreData.p3 + '</div>' +
            '<div class="score-cell">' + scoreData.p4 + '</div>' +
            '<div class="score-cell">' + scoreData.total + '</div>' +
            '</div>';
    }
    
    scoreRows.innerHTML = rowsHTML;
    
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
        
        var rankingHTML = '';
        for (var k = 0; k < totals.length; k++) {
            var rank = k + 1;
            rankingHTML += '<div class="ranking-item rank-' + rank + '">' +
                '<span class="ranking-position">' + rank + '</span>' +
                '<span class="ranking-name">' + totals[k].name + '</span>' +
                '<span class="ranking-score">' + totals[k].score + ' points</span>' +
                '</div>';
        }
        rankingsList.innerHTML = rankingHTML;
        finalRankings.style.display = 'block';
    }
}

function addScore(roundNum, p1, p2, p3, p4) {
    rounds.push({ round: roundNum, p1: p1, p2: p2, p3: p3, p4: p4, total: p1 + p2 + p3 + p4 });
    updateScoreDisplay();
}

function endGame() {
    gameOver = true;
    updateScoreDisplay();
}

function handleScoreSubmission(event) {
    event.preventDefault();
    
    var form = document.getElementById('score-form');
    var p1Score = parseInt(document.getElementById('player1-tricks').value) + parseInt(document.getElementById('player1-bonus').value);
    var p2Score = parseInt(document.getElementById('player2-tricks').value) + parseInt(document.getElementById('player2-bonus').value);
    var p3Score = parseInt(document.getElementById('player3-tricks').value) + parseInt(document.getElementById('player3-bonus').value);
    var p4Score = parseInt(document.getElementById('player4-tricks').value) + parseInt(document.getElementById('player4-bonus').value);
    
    currentRound = currentRound + 1;
    addScore(currentRound, p1Score, p2Score, p3Score, p4Score);
    
    if (currentRound >= 13) {
        endGame();
        form.style.display = 'none';
    } else {
        form.reset();
    }
}

window.onload = function() {
    var form = document.getElementById('score-form');
    if (form) {
        form.addEventListener('submit', handleScoreSubmission);
    }
};
