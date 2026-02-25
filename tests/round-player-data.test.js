const RoundPlayerData = require('../js/round-player-data');

describe('RoundPlayerData', () => {
  test('stores bid, actualTricks, bonusPoints, handsInRound', () => {
    const rpd = new RoundPlayerData(1, 2, 5, 3);
    expect(rpd.bid).toBe(1);
    expect(rpd.actualTricks).toBe(2);
    expect(rpd.bonusPoints).toBe(5);
    expect(rpd.handsInRound).toBe(3);
  });

  test('calculateRoundScore for exact bid', () => {
    const rpd = new RoundPlayerData(2, 2, 10, 3);
    expect(rpd.calculateRoundScore()).toBe(40 + 10); // 20*2 + 10
  });

  test('calculateRoundScore for missed bid', () => {
    const rpd = new RoundPlayerData(2, 3, 10, 3);
    expect(rpd.calculateRoundScore()).toBe(-10); // -10*|2-3|
  });

  test('calculateRoundScore for zero bid exact', () => {
    const rpd = new RoundPlayerData(0, 0, 5, 4);
    expect(rpd.calculateRoundScore()).toBe(40 + 5); // 10*4 + 5
  });

  test('calculateRoundScore for zero bid missed', () => {
    const rpd = new RoundPlayerData(0, 1, 5, 4);
    expect(rpd.calculateRoundScore()).toBe(-40); // -10*4
  });

  test('bonus points only when bid exact', () => {
    const exact = new RoundPlayerData(1, 1, 10, 3);
    expect(exact.calculateRoundScore()).toBe(20 + 10);
    const missed = new RoundPlayerData(1, 0, 10, 3);
    expect(missed.calculateRoundScore()).toBe(-10); // bonus not added
  });
});
