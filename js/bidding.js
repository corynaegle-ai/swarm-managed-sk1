// js/bidding.js - Bid collection utilities

export function initializeBidding(players, round) {
  // Initialize bidding for the round
  // Assume players take turns; this could be enhanced for UI prompts
  return { success: true, message: `Bidding initialized for round ${round}.` };
}

export function handleBidSubmission(gameState, bidValue) {
  // Simulate submitting bid for the current player (managed in app.js)
  // In a real implementation, this might validate against game rules
  const isValid = bidValue >= 0 && bidValue <= 10; // Assuming MAX_BID is 10
  if (isValid) {
    return {
      success: true,
      playerId: gameState.players[gameState.currentPlayerIndex].id,
      bid: bidValue,
      message: 'Bid submitted successfully.'
    };
  } else {
    return {
      success: false,
      message: `Invalid bid. Must be between 0 and 10.`
    };
  }
}
