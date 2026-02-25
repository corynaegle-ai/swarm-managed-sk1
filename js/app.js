// js/app.js - Main game application with integrated bid collection

// Import bid collection functions (assuming they exist in js/bidding.js)
import { initializeBidding, handleBidSubmission } from './bidding.js';

// Game state structure
let gameState = {
  round: 1,
  phase: 'bidding', // Initial phase is bidding
  players: [],
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

  // Initialize bidding phase
  initializeBiddingPhase();

  // Add event listeners
  bidForm.addEventListener('submit', handleBidFormSubmission);
  nextPhaseBtn.addEventListener('click', transitionToScoring);
}

// Initialize bidding phase
function initializeBiddingPhase() {
  if (gameState.phase !== 'bidding') return;

  // Call initializeBidding to set up bid collection
  initializeBidding(gameState.players, gameState.round);

  // Update UI
  statusDisplay.textContent = 'Bidding phase: Submit your bids.';
  bidForm.style.display = 'block';
  nextPhaseBtn.style.display = 'none';
}

// Handle bid form submission
function handleBidFormSubmission(event) {
  event.preventDefault();

  const bidValue = parseInt(bidInput.value);
  if (isNaN(bidValue) || bidValue < 0) {
    alert('Please enter a valid bid.');
    return;
  }

  // Handle bid submission
  const result = handleBidSubmission(gameState, bidValue);
  if (result.success) {
    bidInput.value = '';
    updateGameStateWithBid(result);
    checkIfBiddingComplete();
  } else {
    alert(result.message);
  }
}

// Update game state with bid
function updateGameStateWithBid(result) {
  gameState.bids[result.playerId] = result.bid;
  // Additional game state updates as needed
}

// Check if bidding is complete
function checkIfBiddingComplete() {
  const allPlayersBid = gameState.players.every(player => gameState.bids[player.id] !== undefined);
  if (allPlayersBid) {
    statusDisplay.textContent = 'All bids collected. Ready to proceed to scoring.';
    nextPhaseBtn.style.display = 'block';
  } else {
    statusDisplay.textContent = `Bids submitted: ${Object.keys(gameState.bids).length}/${gameState.players.length}`;
  }
}

// Transition to scoring phase
function transitionToScoring() {
  if (Object.keys(gameState.bids).length !== gameState.players.length) {
    alert('Cannot proceed until all bids are collected.');
    return;
  }

  gameState.phase = 'scoring';
  bidForm.style.display = 'none';
  nextPhaseBtn.style.display = 'none';
  statusDisplay.textContent = 'Scoring phase initiated.';
  // Proceed to scoring logic (assuming external function)
  // startScoring(gameState);
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
export { gameState, startNewRound };