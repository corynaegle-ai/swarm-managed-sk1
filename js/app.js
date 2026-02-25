// js/app.js - Main game application with integrated bid collection

// Import bid collection functions (assuming they exist in js/bidding.js)
import { initializeBidding, handleBidSubmission } from './bidding.js';

// Constants
const MAX_BID = 10;

// Game state structure
let gameState = {
  round: 1,
  phase: 'setup', // Start with setup phase
  players: [
    { id: 'player1', name: 'Player 1' },
    { id: 'player2', name: 'Player 2' }
  ], // Simulated players
  bids: {},
  scores: {}
};

// DOM elements
let bidForm;
let bidInput;
let submitBidBtn;
let statusDisplay;
let nextPhaseBtn;

// Initialize the game
function initGame() {
  // Set up DOM elements
  bidForm = document.getElementById('bid-form');
  bidInput = document.getElementById('bid-input');
  submitBidBtn = document.getElementById('submit-bid');
  statusDisplay = document.getElementById('status');
  nextPhaseBtn = document.getElementById('next-phase');

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

  // Update UI
  statusDisplay.textContent = 'Bidding phase: Submit your bids.';
  bidForm.style.display = 'block';
  nextPhaseBtn.style.display = 'none';
}

// Handle bid form submission
function handleBidFormSubmission(event) {
  event.preventDefault();

  const bidValue = parseInt(bidInput.value);
  if (isNaN(bidValue) || bidValue < 0 || bidValue > MAX_BID) {
    alert(`Please enter a valid bid (0-${MAX_BID}).`);
    return;
  }

  try {
    const result = handleBidSubmission(gameState, bidValue);
    if (!result || typeof result !== 'object' || typeof result.success !== 'boolean' || typeof result.playerId !== 'string' || (result.success && typeof result.bid !== 'number')) {
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
  if (!result.playerId || typeof result.bid !== 'number') {
    throw new Error('Invalid bid data');
  }
  gameState.bids[result.playerId] = result.bid;
  // Additional game state updates as needed
}

// Check if bidding is complete
function checkIfBiddingComplete() {
  const allPlayersBid = gameState.players.every(player => {
    const bid = gameState.bids[player.id];
    return typeof bid === 'number' && bid >= 0 && bid <= MAX_BID;
  });
  if (allPlayersBid) {
    statusDisplay.textContent = 'All valid bids collected. Ready to proceed to scoring.';
    nextPhaseBtn.style.display = 'block';
  } else {
    statusDisplay.textContent = `Valid bids submitted: ${Object.keys(gameState.bids).filter(id => typeof gameState.bids[id] === 'number' && gameState.bids[id] >= 0 && gameState.bids[id] <= MAX_BID).length}/${gameState.players.length}`;
  }
}

// Transition to next phase
function transitionToNextPhase() {
  if (gameState.phase === 'bidding') {
    const validBidsCount = Object.keys(gameState.bids).filter(id => typeof gameState.bids[id] === 'number' && gameState.bids[id] >= 0 && gameState.bids[id] <= MAX_BID).length;
    if (validBidsCount !== gameState.players.length) {
      alert('Cannot proceed until all valid bids are collected.');
      return;
    }
    gameState.phase = 'scoring';
    bidForm.style.display = 'none';
    nextPhaseBtn.style.display = 'none';
    statusDisplay.textContent = 'Scoring phase initiated.';
    // Proceed to scoring logic (mock)
    setTimeout(() => {
      // Mock scoring
      gameState.scores = {}; // Reset scores
      gameState.players.forEach(player => {
        gameState.scores[player.id] = Math.floor(Math.random() * 100); // Mock score
      });
      statusDisplay.textContent = 'Scoring complete. Starting new round...';
      setTimeout(() => startNewRound(), 2000);
    }, 1000);
  }
}

// Start new round
function startNewRound() {
  gameState.round++;
  gameState.phase = 'bidding';
  gameState.bids = {};
  initializeBiddingPhase();
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', initGame);

// Export for potential use
export { gameState, startNewRound, transitionToNextPhase };