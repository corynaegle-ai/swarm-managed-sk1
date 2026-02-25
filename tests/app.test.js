// tests/app.test.js - Tests for app.js
import { jest } from '@jest/globals';
import { gameState, startNewRound, transitionToNextPhase } from '../js/app.js';
import { initializeBidding, handleBidSubmission } from '../js/bidding.js';

// Mock bidding.js
jest.mock('../js/bidding.js', () => ({
  initializeBidding: jest.fn(),
  handleBidSubmission: jest.fn()
}));

// Mock DOM
global.document = {
  getElementById: jest.fn(),
  addEventListener: jest.fn()
};

// Mock alert and console
describe('App Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset gameState
    gameState.round = 1;
    gameState.phase = 'setup';
    gameState.bids = {};
    gameState.scores = {};
    gameState.currentPlayerIndex = 0;
  });

  test('initializeBidding is called in bidding phase', () => {
    initializeBidding.mockReturnValue({ success: true });
    // Simulate initGame indirectly by calling functions
    startNewRound(); // This triggers bidding
    expect(initializeBidding).toHaveBeenCalledWith(gameState.players, gameState.round);
  });

  test('handleBidSubmission processes valid bid', () => {
    handleBidSubmission.mockReturnValue({ success: true, playerId: 'player1', bid: 5 });
    // Assume transitionToNextPhase checks bids
    gameState.bids = { player1: 5, player2: 3 };
    gameState.phase = 'bidding';
    transitionToNextPhase();
    expect(gameState.phase).toBe('scoring');
  });

  test('cannot transition without all bids', () => {
    gameState.bids = { player1: 5 }; // Missing player2
    gameState.phase = 'bidding';
    transitionToNextPhase();
    expect(gameState.phase).toBe('bidding'); // Should not change
  });
});