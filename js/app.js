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
