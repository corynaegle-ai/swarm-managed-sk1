// tests/app.test.js - Tests for js/app.js
import { gameState, startNewRound, transitionToNextPhase } from '../js/app.js';

describe('Game Initialization and Bidding Flow', () => {
  beforeEach(() => {
    // Reset game state
    gameState.round = 1;
    gameState.phase = 'setup';
    gameState.bids = {};
    gameState.scores = {};
    // Mock DOM elements
    global.document = {
      getElementById: jest.fn((id) => ({
        addEventListener: jest.fn(),
        style: { display: 'none' },
        textContent: '',
        value: ''
      })),
      addEventListener: jest.fn()
    };
    global.alert = jest.fn();
  });

  test('initGame initializes setup and transitions to bidding', () => {
    // Mock bidding functions
    const mockInitializeBidding = jest.fn(() => ({ success: true }));
    const mockHandleBidSubmission = jest.fn();
    jest.doMock('../js/bidding.js', () => ({
      initializeBidding: mockInitializeBidding,
      handleBidSubmission: mockHandleBidSubmission
    }));
    const { initGame } = require('../js/app.js');
    initGame();
    expect(gameState.phase).toBe('bidding');
    expect(mockInitializeBidding).toHaveBeenCalledWith(gameState.players, gameState.round);
  });

  test('transitionToNextPhase blocks if bids incomplete', () => {
    gameState.phase = 'bidding';
    gameState.bids = { player1: 5 }; // Incomplete
    transitionToNextPhase();
    expect(gameState.phase).toBe('bidding');
    expect(global.alert).toHaveBeenCalledWith('Cannot proceed until all valid bids are collected.');
  });

  test('transitionToNextPhase succeeds with all valid bids', () => {
    gameState.phase = 'bidding';
    gameState.bids = { player1: 5, player2: 8 };
    jest.useFakeTimers();
    transitionToNextPhase();
    jest.runAllTimers();
    expect(gameState.phase).toBe('scoring');
  });

  test('startNewRound resets and initializes bidding', () => {
    const mockInitializeBidding = jest.fn(() => ({ success: true }));
    jest.doMock('../js/bidding.js', () => ({
      initializeBidding: mockInitializeBidding
    }));
    startNewRound();
    expect(gameState.round).toBe(2);
    expect(gameState.phase).toBe('bidding');
    expect(gameState.bids).toEqual({});
    expect(mockInitializeBidding).toHaveBeenCalledWith(gameState.players, gameState.round);
  });
});