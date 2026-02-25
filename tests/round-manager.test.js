// Simple test suite for RoundManager
// Assumes Node.js with assert module or browser console

const assert = typeof require !== 'undefined' ? require('assert') : {
  equal: (a, b, msg) => { if (a !== b) throw new Error(msg || `Expected ${a} to equal ${b}`); },
  throws: (fn, msg) => { try { fn(); throw new Error('Expected error'); } catch (e) { if (e.message !== msg) throw e; } }
};

const RoundManager = typeof require !== 'undefined' ? require('../js/round-manager') : window.RoundManager;

// Test initial state
test('Initial round is 1', () => {
  const rm = new RoundManager();
  assert.equal(rm.getCurrentRound(), 1, 'Current round should be 1');
});

test('Hands for round 1 is 1', () => {
  const rm = new RoundManager();
  assert.equal(rm.getHandsForRound(), 1, 'Hands for round 1 should be 1');
});

test('Cannot advance without scoring complete', () => {
  const rm = new RoundManager();
  assert.equal(rm.canAdvanceRound(), false, 'Should not be able to advance');
  assert.throws(() => rm.advanceRound(), 'Cannot advance round: scoring not complete');
});

test('Can advance after scoring', () => {
  const rm = new RoundManager();
  rm.scored = true; // Simulate external scoring completion
  assert.equal(rm.canAdvanceRound(), true, 'Should be able to advance');
  rm.advanceRound();
  assert.equal(rm.getCurrentRound(), 2, 'Should advance to round 2');
  assert.equal(rm.scored, false, 'Scored should reset');
});

test('Game not complete until after round 10', () => {
  const rm = new RoundManager();
  for (let i = 1; i <= 10; i++) {
    assert.equal(rm.isGameComplete(), false, `Game should not be complete at round ${i}`);
    if (i < 10) {
      rm.scored = true;
      rm.advanceRound();
    }
  }
  assert.equal(rm.isGameComplete(), true, 'Game should be complete after round 10');
});

// Run tests
function test(name, fn) {
  try {
    fn();
    console.log(`${name}: PASSED`);
  } catch (e) {
    console.log(`${name}: FAILED - ${e.message}`);
  }
}

// Execute all tests
test('Initial round is 1', () => {
  const rm = new RoundManager();
  assert.equal(rm.getCurrentRound(), 1, 'Current round should be 1');
});
test('Hands for round 1 is 1', () => {
  const rm = new RoundManager();
  assert.equal(rm.getHandsForRound(), 1, 'Hands for round 1 should be 1');
});
test('Cannot advance without scoring complete', () => {
  const rm = new RoundManager();
  assert.equal(rm.canAdvanceRound(), false, 'Should not be able to advance');
  assert.throws(() => rm.advanceRound(), 'Cannot advance round: scoring not complete');
});
test('Can advance after scoring', () => {
  const rm = new RoundManager();
  rm.scored = true;
  assert.equal(rm.canAdvanceRound(), true, 'Should be able to advance');
  rm.advanceRound();
  assert.equal(rm.getCurrentRound(), 2, 'Should advance to round 2');
  assert.equal(rm.scored, false, 'Scored should reset');
});
test('Game not complete until after round 10', () => {
  const rm = new RoundManager();
  for (let i = 1; i <= 10; i++) {
    assert.equal(rm.isGameComplete(), false, `Game should not be complete at round ${i}`);
    if (i < 10) {
      rm.scored = true;
      rm.advanceRound();
    }
  }
  assert.equal(rm.isGameComplete(), true, 'Game should be complete after round 10');
});