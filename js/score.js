// Score tracking module using vanilla JS objects and arrays
// Stores scores in a nested object: { playerId: [score1, score2, ...] }

// Initialize scores object and currentRound
let scores = {};
let currentRound = 0;

// Function to add a score for a specific player and round
function addScore(playerId, roundNumber, score) {
  if (typeof playerId !== 'string' || playerId.trim() === '') {
    throw new Error('Invalid playerId: must be a non-empty string');
  }
  if (!Number.isInteger(roundNumber) || roundNumber < 1) {
    throw new Error('Invalid roundNumber: must be a positive integer');
  }
  if (typeof score !== 'number' || isNaN(score)) {
    throw new Error('Invalid score: must be a number');
  }
  if (!scores[playerId]) {
    scores[playerId] = [];
  }
  // Ensure the array can hold up to roundNumber (1-indexed)
  while (scores[playerId].length < roundNumber) {
    scores[playerId].push(null); // Use null for missing rounds
  }
  scores[playerId][roundNumber - 1] = score;
  // Update currentRound to the max round added
  if (roundNumber > currentRound) {
    currentRound = roundNumber;
  }
}

// Function to get the total score for a player
function getTotalScore(playerId) {
  if (!scores[playerId]) {
    return 0;
  }
  return scores[playerId].reduce((total, score) => {
    return total + (score !== null ? score : 0);
  }, 0);
}

// Function to get scores by round for a player (array of scores)
function getScoresByRound(playerId) {
  if (!scores[playerId]) {
    return [];
  }
  return [...scores[playerId]]; // Return a copy
}

// Function to get all player totals as an object
function getAllPlayerTotals() {
  const totals = {};
  for (const playerId in scores) {
    totals[playerId] = getTotalScore(playerId);
  }
  return totals;
}

// Function to get the current round (highest round number added)
function getCurrentRound() {
  return currentRound;
}

// Export all functions
export { addScore, getTotalScore, getScoresByRound, getAllPlayerTotals, getCurrentRound };