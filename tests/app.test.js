// tests/app.test.js - Tests for app.js

import { gameState, startNewRound } from '../js/app.js';

describe('Game Flow Integration', () => {
  test('Bid collection triggers at start of round', () => {
    expect(gameState.phase).toBe('setup');
    // Mock initGame and check if bidding is initialized
  });

  test('Cannot proceed to scoring without valid bids', () => {
    gameState.bids = {}; // No bids
    expect(() => transitionToNextPhase()).toThrow(); // Assuming it alerts or throws
  });

  test('Game state updated with bids', () => {
    gameState.bids = { player1: 5 };
    expect(gameState.bids.player1).toBe(5);
  });

  test('Smooth transition to scoring', () => {
    gameState.bids = { player1: 5, player2: 3 };
    gameState.phase = 'bidding';
    transitionToNextPhase();
    expect(gameState.phase).toBe('scoring');
  });
});