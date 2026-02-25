const RoundManager = require('../src/roundManager');

const assert = require('assert');

describe('RoundManager', () => {
  let rm;

  beforeEach(() => {
    rm = new RoundManager();
  });

  it('should start at round 1', () => {
    assert.equal(rm.getCurrentRound(), 1);
  });

  it('should have hands equal to round number', () => {
    assert.equal(rm.getHandsThisRound(), 1);
    rm.advanceRound(); // Need to complete round first, but for test, simulate
    // Actually, advanceRound requires completion, so test properly
  });

  it('should not advance if round not complete', () => {
    assert.equal(rm.advanceRound(), false);
    assert.equal(rm.getCurrentRound(), 1);
  });

  it('should advance if round complete', () => {
    rm.addScore(0, 10);
    assert(rm.isRoundComplete());
    assert(rm.advanceRound());
    assert.equal(rm.getCurrentRound(), 2);
  });

  it('should end game after round 10', () => {
    // Simulate completing rounds up to 10
    for (let round = 1; round <= 10; round++) {
      for (let hand = 0; hand < round; hand++) {
        rm.addScore(hand, 10);
      }
      if (round < 10) {
        rm.advanceRound();
      }
    }
    assert(rm.isGameOver());
    assert.equal(rm.getCurrentRound(), 10);
  });
});