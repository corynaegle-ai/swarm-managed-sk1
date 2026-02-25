const RoundScoring = require('../src/roundScoring');

describe('RoundScoring', () => {
  let scoring;

  beforeEach(() => {
    scoring = new RoundScoring(4); // Assume 4 hands in round
  });

  test('should add players correctly', () => {
    scoring.addPlayer('Alice', 3);
    expect(scoring.playerData[0].name).toBe('Alice');
    expect(scoring.playerData[0].bid).toBe(3);
  });

  test('should throw error for invalid bid', () => {
    expect(() => scoring.addPlayer('Alice', -1)).toThrow('Bid must be a non-negative integer.');
    expect(() => scoring.addPlayer('Alice', 2.5)).toThrow('Bid must be a non-negative integer.');
  });

  test('should input actual tricks', () => {
    scoring.addPlayer('Alice', 3);
    scoring.inputActualTricks('Alice', 3);
    expect(scoring.playerData[0].actualTricks).toBe(3);
  });

  test('should throw error for invalid tricks', () => {
    scoring.addPlayer('Alice', 3);
    expect(() => scoring.inputActualTricks('Alice', -1)).toThrow('Tricks must be a non-negative integer.');
  });

  test('should input bonus points', () => {
    scoring.addPlayer('Alice', 3);
    scoring.inputBonusPoints('Alice', 10);
    expect(scoring.playerData[0].bonusPoints).toBe(10);
  });

  test('should throw error for invalid bonus', () => {
    scoring.addPlayer('Alice', 3);
    expect(() => scoring.inputBonusPoints('Alice', -5)).toThrow('Bonus points must be a non-negative number.');
  });

  test('should calculate round scores for exact bid', () => {
    scoring.addPlayer('Alice', 3);
    scoring.inputActualTricks('Alice', 3);
    scoring.calculateRoundScores();
    expect(scoring.playerData[0].roundScore).toBe(60); // 20 * 3
  });

  test('should calculate round scores for missed bid', () => {
    scoring.addPlayer('Alice', 3);
    scoring.inputActualTricks('Alice', 2);
    scoring.calculateRoundScores();
    expect(scoring.playerData[0].roundScore).toBe(-10); // -10 * 1
  });

  test('should calculate round scores for zero bid exact', () => {
    scoring.addPlayer('Alice', 0);
    scoring.inputActualTricks('Alice', 0);
    scoring.calculateRoundScores();
    expect(scoring.playerData[0].roundScore).toBe(40); // 10 * 4
  });

  test('should calculate round scores for zero bid missed', () => {
    scoring.addPlayer('Alice', 0);
    scoring.inputActualTricks('Alice', 1);
    scoring.calculateRoundScores();
    expect(scoring.playerData[0].roundScore).toBe(-40); // -10 * 4
  });

  test('should update total scores with bonus only on exact bid', () => {
    scoring.addPlayer('Alice', 3);
    scoring.inputActualTricks('Alice', 3);
    scoring.inputBonusPoints('Alice', 10);
    scoring.calculateRoundScores();
    const totals = {};
    const updated = scoring.updateTotalScores(totals);
    expect(updated.Alice).toBe(70); // 60 + 10
  });

  test('should not add bonus on missed bid', () => {
    scoring.addPlayer('Alice', 3);
    scoring.inputActualTricks('Alice', 2);
    scoring.inputBonusPoints('Alice', 10);
    scoring.calculateRoundScores();
    const totals = {};
    const updated = scoring.updateTotalScores(totals);
    expect(updated.Alice).toBe(-10); // -10 + 0 bonus
  });

  test('should handle multiple players', () => {
    scoring.addPlayer('Alice', 3);
    scoring.addPlayer('Bob', 0);
    scoring.inputActualTricks('Alice', 3);
    scoring.inputActualTricks('Bob', 0);
    scoring.inputBonusPoints('Alice', 5);
    scoring.inputBonusPoints('Bob', 5);
    scoring.calculateRoundScores();
    const totals = {};
    const updated = scoring.updateTotalScores(totals);
    expect(updated.Alice).toBe(65); // 60 + 5
    expect(updated.Bob).toBe(40); // 40 + 0 (zero bid exact, no bonus added? Wait, zero bid exact is exact, so bonus should be added)
    // Wait, adjust: for Bob, bid=0, actual=0, exact, so bonus 5
    expect(updated.Bob).toBe(45); // 40 + 5
  });

  test('should throw error if tricks not input before calculation', () => {
    scoring.addPlayer('Alice', 3);
    expect(() => scoring.calculateRoundScores()).toThrow('Actual tricks not input for player Alice.');
  });
});