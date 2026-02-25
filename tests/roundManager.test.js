const RoundManager = require('../src/roundManager');

describe('RoundManager', () => {
  let manager;

  beforeEach(() => {
    manager = new RoundManager();
  });

  test('starts at round 1', () => {
    expect(manager.getCurrentRound()).toBe(1);
  });

  test('hands equal to current round', () => {
    expect(manager.getHandsThisRound()).toBe(1);
    manager.advanceRound();
    expect(manager.getHandsThisRound()).toBe(2);
  });

  test('advances rounds correctly', () => {
    manager.advanceRound();
    expect(manager.getCurrentRound()).toBe(2);
    manager.advanceRound();
    expect(manager.getCurrentRound()).toBe(3);
  });

  test('game not over until after round 10', () => {
    for (let i = 1; i <= 9; i++) {
      expect(manager.isGameOver()).toBe(false);
      manager.advanceRound();
    }
    expect(manager.getCurrentRound()).toBe(10);
    expect(manager.isGameOver()).toBe(false);
    manager.advanceRound(); // Advance from 10 to 11
    expect(manager.getCurrentRound()).toBe(11);
    expect(manager.isGameOver()).toBe(true);
  });

  test('cannot advance after game over', () => {
    // Advance to game over
    for (let i = 1; i <= 10; i++) {
      manager.advanceRound();
    }
    expect(manager.isGameOver()).toBe(true);
    // No error thrown, but round stays at 11 or whatever, game is over
    manager.advanceRound();
    expect(manager.getCurrentRound()).toBe(12);
    expect(manager.isGameOver()).toBe(true);
  });
});