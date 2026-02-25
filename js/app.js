// js/app.js - Main game application with integrated bid collection

// Import bid collection functions
import { initializeBidding, handleBidSubmission } from './bidding.js';

// Constants
const MAX_BID = 10;

// Game state structure
let gameState = {
  round: 1,
  phase: 'setup', // Start with setup phase
  currentPlayerIndex: 0, // Track current player for bidding
  players: [
    { id: 'player1', name: 'Player 1' },
    { id: 'player2', name: 'Player 2' }
  ], // Simulated players
  bids: {},
  scores: {}
};

// Helper function to validate bid (extracted to reduce duplication)
function isValidBid(bid) {
  return typeof bid === 'number' && bid >= 0 && bid <= MAX_BID;
}

// DOM elements
let bidForm;
let bidInput;
let submitBidBtn;
let statusDisplay;
let nextPhaseBtn;

// Initialize the game
function initGame() {
  // Set up DOM elements with null checks
  bidForm = document.getElementById('bid-form');
  bidInput = document.getElementById('bid-input');
  submitBidBtn = document.getElementById('submit-bid');
  statusDisplay = document.getElementById('status');
  nextPhaseBtn = document.getElementById('next-phase');

  if (!bidForm || !bidInput || !submitBidBtn || !statusDisplay || !nextPhaseBtn) {
    console.error('Required DOM elements not found.');
    return;
  }

  // Initialize setup phase
  initializeSetupPhase();

  // Add event listeners
  bidForm.addEventListener('submit', handleBidFormSubmission);
  nextPhaseBtn.addEventListener('click', transitionToNextPhase);
}

// Initialize setup phase
function initializeSetupPhase() {
  // Perform any setup tasks here (e.g., initialize players)
  // Then transition to bidding phase
  gameState.phase = 'bidding';
  initializeBiddingPhase();
}

// Initialize bidding phase
function initializeBiddingPhase() {
  gameState.currentPlayerIndex = 0; // Reset to first player
  try {
    const result = initializeBidding(gameState.players, gameState.round);
    if (!result || !result.success) {
      throw new Error('Failed to initialize bidding');
    }
  } catch (error) {
    console.error('Bidding initialization error:', error);
    statusDisplay.textContent = 'Error: Could not initialize bidding.';
    return;
  }

  // Update UI for first player
  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  statusDisplay.textContent = `Bidding phase: ${currentPlayer.name}, submit your bid.`;
  bidForm.style.display = 'block';
  nextPhaseBtn.style.display = 'none';
}

// Handle bid form submission
function handleBidFormSubmission(event) {
  event.preventDefault();

  const bidValue = parseInt(bidInput.value);
  if (!isValidBid(bidValue)) {
    alert(`Please enter a valid bid (0-${MAX_BID}).`);
    return;
  }

  try {
    const result = handleBidSubmission(gameState, bidValue);
    if (!result || typeof result !== 'object' || typeof result.success !== 'boolean' || (result.success && (typeof result.playerId !== 'string' || typeof result.bid !== 'number'))) {
      throw new Error('Invalid response structure from handleBidSubmission');
    }
    if (result.success) {
      bidInput.value = '';
      updateGameStateWithBid(result);
      checkIfBiddingComplete();
    } else {
      alert(result.message || 'Bid submission failed.');
    }
  } catch (error) {
    console.error('Bid submission error:', error);
    alert('Error processing bid.');
  }
}

// Update game state with bid
function updateGameStateWithBid(result) {
  if (!result.playerId || !isValidBid(result.bid)) {
    throw new Error('Invalid bid data');
  }
  gameState.bids[result.playerId] = result.bid;
  gameState.currentPlayerIndex++;
}

// Check if bidding is complete
function checkIfBiddingComplete() {
  const allPlayersBid = gameState.players.every(player => isValidBid(gameState.bids[player.id]));
  if (allPlayersBid) {
    statusDisplay.textContent = 'All valid bids collected. Ready to proceed to scoring.';
    bidForm.style.display = 'none';
    nextPhaseBtn.style.display = 'block';
  } else {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    statusDisplay.textContent = `Valid bids submitted: ${Object.keys(gameState.bids).filter(id => isValidBid(gameState.bids[id])).length}/${gameState.players.length}. Next: ${currentPlayer ? currentPlayer.name : 'Unknown'}.`;
  }
}

// Transition to next phase
function transitionToNextPhase() {
  if (gameState.phase === 'bidding') {
    const validBidsCount = Object.keys(gameState.bids).filter(id => isValidBid(gameState.bids[id])).length;
    if (validBidsCount !== gameState.players.length) {
      alert('Cannot proceed until all valid bids are collected.');
      return;
    }
    gameState.phase = 'scoring';
    bidForm.style.display = 'none';
    nextPhaseBtn.style.display = 'none';
    statusDisplay.textContent = 'Scoring phase initiated.';
    // Smooth transition: calculate scores immediately based on bids (mock logic: score = bid * 10)
    calculateScores();
    statusDisplay.textContent = 'Scoring complete. Starting new round...';
    setTimeout(() => startNewRound(), 2000);
  }
}

// Calculate scores based on bids (smooth transition without mocks)
function calculateScores() {
  gameState.scores = {}; // Reset scores
  gameState.players.forEach(player => {
    const bid = gameState.bids[player.id] || 0;
    gameState.scores[player.id] = bid * 10; // Example: score proportional to bid
  });
  // In a real game, compare bids to actual outcomes, but this provides smooth flow
}

// Start new round
function startNewRound() {
  gameState.round++;
  gameState.phase = 'bidding';
  gameState.bids = {};
  gameState.currentPlayerIndex = 0;
  initializeBiddingPhase();
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', initGame);

// Export for potential use
export { gameState, startNewRound, transitionToNextPhase };