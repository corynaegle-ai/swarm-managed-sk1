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
