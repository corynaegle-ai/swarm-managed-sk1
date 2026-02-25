const { RoundPlayerData, RoundScoring } = require('../src/roundScoring');

describe('RoundScoring', () => {
  describe('RoundPlayerData', () => {
    let player;

    beforeEach(() => {
      player = new RoundPlayerData('player1', 3, 5);
    });

    test('initializes correctly', () => {
      expect(player.playerId).toBe('player1');
      expect(player.bid).toBe(3);
      expect(player.handsInRound).toBe(5);
      expect(player.actualTricks).toBeNull();
      expect(player.bonusPoints).toBeNull();
      expect(player.roundScore).toBeNull();
    });

    test('inputActualTricks sets actualTricks', () => {
      player.inputActualTricks(4);
      expect(player.actualTricks).toBe(4);
    });

    test('inputActualTricks throws on invalid input', () => {
      expect(() => player.inputActualTricks(-1)).toThrow('non-negative integer');
      expect(() => player.inputActualTricks(2.5)).toThrow('non-negative integer');
      expect(() => player.inputActualTricks('3')).toThrow('non-negative integer');
    });

    test('inputBonusPoints sets bonusPoints', () => {
      player.inputBonusPoints(10);
      expect(player.bonusPoints).toBe(10);
    });

    test('inputBonusPoints throws on invalid input', () => {
      expect(() => player.inputBonusPoints(-5)).toThrow('non-negative number');
      expect(() => player.inputBonusPoints('10')).toThrow('non-negative number');
    });

    test('calculateRoundScore exact bid non-zero', () => {
      player.inputActualTricks(3);
      player.inputBonusPoints(5);
      const score = player.calculateRoundScore();
      expect(score).toBe(20 * 3 + 5); // 60 + 5 = 65
      expect(player.roundScore).toBe(65);
    });

    test('calculateRoundScore missed bid non-zero', () => {
      player.inputActualTricks(2);
      player.inputBonusPoints(5);
      const score = player.calculateRoundScore();
      expect(score).toBe(-10 * 1); // -10, bonus not added
      expect(player.roundScore).toBe(-10);
    });

    test('calculateRoundScore zero bid exact', () => {
      const zeroPlayer = new RoundPlayerData('player2', 0, 5);
      zeroPlayer.inputActualTricks(0);
      zeroPlayer.inputBonusPoints(10);
      const score = zeroPlayer.calculateRoundScore();
      expect(score).toBe(10 * 5 + 10); // 50 + 10 = 60
      expect(zeroPlayer.roundScore).toBe(60);
    });

    test('calculateRoundScore zero bid missed', () => {
      const zeroPlayer = new RoundPlayerData('player2', 0, 5);
      zeroPlayer.inputActualTricks(1);
      zeroPlayer.inputBonusPoints(10);
      const score = zeroPlayer.calculateRoundScore();
      expect(score).toBe(-10 * 5); // -50, bonus not added
      expect(zeroPlayer.roundScore).toBe(-50);
    });

    test('calculateRoundScore with null bonusPoints treated as 0', () => {
      player.inputActualTricks(3);
      // bonusPoints remains null
      const score = player.calculateRoundScore();
      expect(score).toBe(20 * 3); // 60, null bonus = 0
      expect(player.roundScore).toBe(60);
    });

    test('calculateRoundScore throws if actualTricks not set', () => {
      expect(() => player.calculateRoundScore()).toThrow('Actual tricks must be input');
    });
  });

  describe('RoundScoring', () => {
    let roundScoring;
    const players = [
      { id: 'p1', bid: 3 },
      { id: 'p2', bid: 0 },
      { id: 'p3', bid: 4 }
    ];
    const handsInRound = 5;

    beforeEach(() => {
      roundScoring = new RoundScoring(players, handsInRound);
    });

    test('initializes players', () => {
      expect(roundScoring.players.length).toBe(3);
      expect(roundScoring.players[0].playerId).toBe('p1');
    });

    test('inputActualTricks batch', () => {
      roundScoring.inputActualTricks([
        { playerId: 'p1', actualTricks: 3 },
        { playerId: 'p2', actualTricks: 0 }
      ]);
      expect(roundScoring.players[0].actualTricks).toBe(3);
      expect(roundScoring.players[1].actualTricks).toBe(0);
    });

    test('inputBonusPoints batch', () => {
      roundScoring.inputBonusPoints([
        { playerId: 'p1', bonusPoints: 5 },
        { playerId: 'p2', bonusPoints: 0 }
      ]);
      expect(roundScoring.players[0].bonusPoints).toBe(5);
      expect(roundScoring.players[1].bonusPoints).toBe(0);
    });

    test('calculateRoundScores', () => {
      roundScoring.inputActualTricks([
        { playerId: 'p1', actualTricks: 3 },
        { playerId: 'p2', actualTricks: 0 },
        { playerId: 'p3', actualTricks: 5 }
      ]);
      roundScoring.inputBonusPoints([
        { playerId: 'p1', bonusPoints: 5 },
        { playerId: 'p2', bonusPoints: 10 },
        { playerId: 'p3', bonusPoints: 0 }
      ]);
      roundScoring.calculateRoundScores();
      expect(roundScoring.players[0].roundScore).toBe(20 * 3 + 5); // 65
      expect(roundScoring.players[1].roundScore).toBe(10 * 5 + 10); // 60
      expect(roundScoring.players[2].roundScore).toBe(-10 * 1); // -10
    });

    test('getRoundScores', () => {
      roundScoring.inputActualTricks([{ playerId: 'p1', actualTricks: 3 }]);
      roundScoring.inputBonusPoints([{ playerId: 'p1', bonusPoints: 5 }]);
      roundScoring.calculateRoundScores();
      const scores = roundScoring.getRoundScores();
      expect(scores).toEqual([
        { playerId: 'p1', roundScore: 65 },
        { playerId: 'p2', roundScore: null },
        { playerId: 'p3', roundScore: null }
      ]);
    });

    test('updateTotalScores', () => {
      const totalScores = { p1: 100, p2: 50, p3: 75 };
      roundScoring.inputActualTricks([
        { playerId: 'p1', actualTricks: 3 },
        { playerId: 'p2', actualTricks: 0 },
        { playerId: 'p3', actualTricks: 5 }
      ]);
      roundScoring.inputBonusPoints([
        { playerId: 'p1', bonusPoints: 5 },
        { playerId: 'p2', bonusPoints: 10 },
        { playerId: 'p3', bonusPoints: 0 }
      ]);
      roundScoring.calculateRoundScores();
      roundScoring.updateTotalScores(totalScores);
      expect(totalScores.p1).toBe(100 + 65);
      expect(totalScores.p2).toBe(50 + 60);
      expect(totalScores.p3).toBe(75 - 10);
    });
  });
});