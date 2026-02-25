// js/scoreDisplay.js
// Assumes global data object with structure: { players: [{name: 'Player1', scores: [10, 20, ...]}, ...], currentRound: 0, isGameComplete: false }
// Example: const gameData = { players: [{name: 'Alice', scores: [5, 10]}, {name: 'Bob', scores: [7, 8]}], currentRound: 1, isGameComplete: false };

function renderCurrentTotals(gameData) {
    if (!gameData || !gameData.players) {
        console.error('Invalid gameData for renderCurrentTotals');
        return;
    }
    const tbody = document.querySelector('#current-totals-body');
    if (!tbody) {
        console.error('Current totals body not found');
        return;
    }
    tbody.innerHTML = '';
    gameData.players.forEach(player => {
        const total = player.scores.reduce((sum, score) => sum + score, 0);
        const row = document.createElement('tr');
        const nameCell = document.createElement('td');
        nameCell.textContent = player.name;
        const scoreCell = document.createElement('td');
        scoreCell.textContent = total;
        row.appendChild(nameCell);
        row.appendChild(scoreCell);
        tbody.appendChild(row);
    });
}

function renderRoundBreakdown(gameData) {
    if (!gameData || !gameData.players) {
        console.error('Invalid gameData for renderRoundBreakdown');
        return;
    }
    const thead = document.querySelector('#round-breakdown-head');
    const tbody = document.querySelector('#round-breakdown-body');
    if (!thead || !tbody) {
        console.error('Round breakdown table elements not found');
        return;
    }
    const maxRounds = Math.max(...gameData.players.map(p => p.scores.length));
    thead.innerHTML = '<tr><th>Player</th>' + Array.from({length: maxRounds}, (_, i) => `<th>Round ${i + 1}</th>`).join('') + '</tr>';
    tbody.innerHTML = '';
    gameData.players.forEach(player => {
        const row = document.createElement('tr');
        const nameCell = document.createElement('td');
        nameCell.textContent = player.name;
        row.appendChild(nameCell);
        for (let i = 0; i < maxRounds; i++) {
            const cell = document.createElement('td');
            cell.textContent = player.scores[i] || '';
            row.appendChild(cell);
        }
        tbody.appendChild(row);
    });
}

function highlightCurrentRound(gameData) {
    if (!gameData || typeof gameData.currentRound !== 'number') {
        console.error('Invalid gameData for highlightCurrentRound');
        return;
    }
    const thead = document.querySelector('#round-breakdown-head');
    const tbody = document.querySelector('#round-breakdown-body');
    if (!thead || !tbody) {
        console.error('Round breakdown table elements not found');
        return;
    }
    // Remove previous highlights
    document.querySelectorAll('.active-round').forEach(el => el.classList.remove('active-round'));
    // Highlight current round column (1-indexed, so th:nth-child(gameData.currentRound + 2))
    const th = thead.querySelector(`th:nth-child(${gameData.currentRound + 2})`);
    if (th) th.classList.add('active-round');
    // Highlight cells in tbody
    tbody.querySelectorAll(`td:nth-child(${gameData.currentRound + 2})`).forEach(td => td.classList.add('active-round'));
}

function renderFinalRankings(gameData) {
    if (!gameData || !gameData.players || !gameData.isGameComplete) {
        console.error('Invalid or incomplete gameData for renderFinalRankings');
        return;
    }
    const section = document.querySelector('#final-rankings-section');
    const list = document.querySelector('#final-rankings-list');
    if (!section || !list) {
        console.error('Final rankings elements not found');
        return;
    }
    section.style.display = 'block';
    list.innerHTML = '';
    const sortedPlayers = gameData.players.sort((a, b) => {
        const totalA = a.scores.reduce((sum, s) => sum + s, 0);
        const totalB = b.scores.reduce((sum, s) => sum + s, 0);
        return totalB - totalA; // Descending order
    });
    sortedPlayers.forEach((player, index) => {
        const li = document.createElement('li');
        li.classList.add('final-ranking');
        const total = player.scores.reduce((sum, s) => sum + s, 0);
        li.textContent = `${index + 1}. ${player.name} - ${total} points`;
        list.appendChild(li);
    });
}

function updateScoreDisplay(gameData) {
    if (!gameData) {
        console.error('No gameData provided to updateScoreDisplay');
        return;
    }
    renderCurrentTotals(gameData);
    renderRoundBreakdown(gameData);
    highlightCurrentRound(gameData);
    if (gameData.isGameComplete) {
        renderFinalRankings(gameData);
    } else {
        document.querySelector('#final-rankings-section').style.display = 'none';
    }
}

// Example usage (remove in production):
// const gameData = { players: [{name: 'Alice', scores: [5, 10]}, {name: 'Bob', scores: [7, 8]}], currentRound: 1, isGameComplete: false };
// updateScoreDisplay(gameData);