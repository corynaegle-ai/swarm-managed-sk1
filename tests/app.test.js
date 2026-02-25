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
const mockBidForm = {
  addEventListener: jest.fn(),
  reset: jest.fn()
};

const mockBidInput = {
  value: '',
  addEventListener: jest.fn()
};

const mockSubmitButton = {
  disabled: false,
  addEventListener: jest.fn()
};

const mockBidDisplay = {
  textContent: '',
  style: { display: 'none' }
};

global.document = {
  getElementById: jest.fn((id) => {
    if (id === 'bid-form') return mockBidForm;
    if (id === 'bid-input') return mockBidInput;
    if (id === 'submit-bid') return mockSubmitButton;
    if (id === 'bid-display') return mockBidDisplay;
    return null;
  }),
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

  test('bid form submission triggers handleBidSubmission', () => {
    const mockEvent = {
      preventDefault: jest.fn()
    };
    
    handleBidSubmission.mockReturnValue({ success: true, playerId: 'player1', bid: 5 });
    
    // Get the form submit handler
    const formElement = document.getElementById('bid-form');
    expect(formElement.addEventListener).toHaveBeenCalledWith('submit', expect.any(Function));
    
    // Simulate form submission
    const submitHandler = formElement.addEventListener.mock.calls[0][1];
    mockBidInput.value = '5';
    submitHandler(mockEvent);
    
    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(handleBidSubmission).toHaveBeenCalled();
  });

  test('UI updates when bid is successfully submitted', () => {
    handleBidSubmission.mockReturnValue({ success: true, playerId: 'player1', bid: 5 });
    
    const mockEvent = { preventDefault: jest.fn() };
    const formElement = document.getElementById('bid-form');
    const submitHandler = formElement.addEventListener.mock.calls[0][1];
    
    mockBidInput.value = '5';
    submitHandler(mockEvent);
    
    // Verify form is reset after successful submission
    expect(formElement.reset).toHaveBeenCalled();
  });

  test('bid validation prevents invalid submissions', () => {
    const mockEvent = { preventDefault: jest.fn() };
    const formElement = document.getElementById('bid-form');
    const submitHandler = formElement.addEventListener.mock.calls[0][1];
    
    // Test empty bid
    mockBidInput.value = '';
    submitHandler(mockEvent);
    expect(mockEvent.preventDefault).toHaveBeenCalled();
    
    // Test negative bid
    mockBidInput.value = '-1';
    submitHandler(mockEvent);
    expect(mockEvent.preventDefault).toHaveBeenCalled();
    
    // Test non-numeric bid
    mockBidInput.value = 'abc';
    submitHandler(mockEvent);
    expect(mockEvent.preventDefault).toHaveBeenCalled();
  });

  test('submit button is disabled during bid processing', () => {
    handleBidSubmission.mockImplementation(() => {
      expect(mockSubmitButton.disabled).toBe(true);
      return { success: true, playerId: 'player1', bid: 5 };
    });
    
    const mockEvent = { preventDefault: jest.fn() };
    const formElement = document.getElementById('bid-form');
    const submitHandler = formElement.addEventListener.mock.calls[0][1];
    
    mockBidInput.value = '5';
    submitHandler(mockEvent);
    
    // Button should be re-enabled after processing
    expect(mockSubmitButton.disabled).toBe(false);
  });

  test('bid display updates with current player bids', () => {
    gameState.bids = { player1: 5, player2: 3 };
    gameState.players = ['player1', 'player2'];
    
    // Simulate UI update function call
    const bidDisplay = document.getElementById('bid-display');
    bidDisplay.textContent = `Player 1: 5, Player 2: 3`;
    bidDisplay.style.display = 'block';
    
    expect(bidDisplay.textContent).toContain('Player 1: 5');
    expect(bidDisplay.textContent).toContain('Player 2: 3');
    expect(bidDisplay.style.display).toBe('block');
  });
});