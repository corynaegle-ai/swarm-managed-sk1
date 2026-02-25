const RoundManager = require('../src/roundManager');

describe('RoundManager', () => {
  let manager;

  beforeEach(() => {
    manager = new RoundManager();
  });

  test('initial round is 1', () => {
    expect(manager.getCurrentRound()).toBe(1);
  });

  test('hands in round N is N', () => {
    expect(manager.getHandsInRound()).toBe(1);
  });

  test('advances round after scoring complete', () => {
    manager.completeScoring();
    manager.advanceRound();
    expect(manager.getCurrentRound()).toBe(2);
  });

  test('does not advance without scoring complete', () => {
    expect(() => manager.advanceRound()).toThrow('Cannot advance: scoring not complete');
  });

  test('game ends after round 10', () => {
    for (let i = 1; i < 10; i++) {
      manager.completeScoring();
      manager.advanceRound();
    }
    expect(manager.getCurrentRound()).toBe(10);
    expect(manager.isGameOver()).toBe(false);
    manager.completeScoring();
    expect(() => manager.advanceRound()).toThrow('Game has ended after round 10');
  });
});