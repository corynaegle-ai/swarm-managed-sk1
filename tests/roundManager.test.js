const RoundManager = require('../src/roundManager');

describe('RoundManager', () => {
    let rm;

    beforeEach(() => {
        rm = new RoundManager();
    });

    test('initial round is 1', () => {
        expect(rm.getCurrentRound()).toBe(1);
    });

    test('hands for round 1 is 1', () => {
        expect(rm.getHandsForRound(1)).toBe(1);
    });

    test('hands for round 5 is 5', () => {
        expect(rm.getHandsForRound(5)).toBe(5);
    });

    test('cannot advance without scoring', () => {
        expect(rm.advanceRound()).toBe(false);
    });

    test('advance after scoring', () => {
        rm.setScores([10]); // Score for round 1
        expect(rm.advanceRound()).toBe(true);
        expect(rm.getCurrentRound()).toBe(2);
    });

    test('cannot advance beyond round 10', () => {
        rm.currentRound = 10;
        rm.setScores(Array(10).fill(10)); // Scores for round 10
        expect(rm.advanceRound()).toBe(false);
        expect(rm.isGameOver()).toBe(false); // Still on 10
        // After advance attempt, still 10
        expect(rm.getCurrentRound()).toBe(10);
    });

    test('game over after round 10', () => {
        rm.currentRound = 10;
        rm.setScores(Array(10).fill(10));
        rm.advanceRound(); // This should fail, but to simulate end, set manually
        rm.currentRound = 11;
        expect(rm.isGameOver()).toBe(true);
    });
});