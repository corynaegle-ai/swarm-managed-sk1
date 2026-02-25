/**
 * Module for handling round scoring in the game.
 * Collects inputs and calculates scores based on bid accuracy.
 */

class RoundScoring {
  constructor(handsInRound) {
    this.handsInRound = handsInRound;
    this.playerData = [];
  }

  /**
   * Adds a player to the round with their bid.
   * @param {string} playerName - Name of the player.
   * @param {number} bid - The bid made by the player.
   */
  addPlayer(playerName, bid) {
    if (typeof bid !== 'number' || bid < 0 || !Number.isInteger(bid)) {
      throw new Error('Bid must be a non-negative integer.');
    }
    this.playerData.push({
      name: playerName,
      bid,
      actualTricks: null,
      bonusPoints: null,
      roundScore: 0
    });
  }

  /**
   * Inputs actual tricks taken for a player.
   * @param {string} playerName - Name of the player.
   * @param {number} tricks - Number of tricks taken.
   */
  inputActualTricks(playerName, tricks) {
    const player = this.playerData.find(p => p.name === playerName);
    if (!player) throw new Error('Player not found.');
    if (typeof tricks !== 'number' || tricks < 0 || !Number.isInteger(tricks)) {
      throw new Error('Tricks must be a non-negative integer.');
    }
    player.actualTricks = tricks;
  }

  /**
   * Inputs bonus points for a player (manual entry).
   * @param {string} playerName - Name of the player.
   * @param {number} bonus - Bonus points.
   */
  inputBonusPoints(playerName, bonus) {
    const player = this.playerData.find(p => p.name === playerName);
    if (!player) throw new Error('Player not found.');
    if (typeof bonus !== 'number' || bonus < 0) {
      throw new Error('Bonus points must be a non-negative number.');
    }
    player.bonusPoints = bonus;
  }

  /**
   * Calculates the round score for all players based on bid accuracy.
   * Updates player round scores.
   */
  calculateRoundScores() {
    this.playerData.forEach(player => {
      if (player.actualTricks === null) {
        throw new Error(`Actual tricks not input for player ${player.name}.`);
      }
      const diff = Math.abs(player.bid - player.actualTricks);
      let score = 0;
      if (player.bid === 0) {
        score = diff === 0 ? 10 * this.handsInRound : -10 * this.handsInRound;
      } else {
        score = diff === 0 ? 20 * player.actualTricks : -10 * diff;
      }
      player.roundScore = score;
    });
  }

  /**
   * Updates total scores for players.
   * @param {object} totalScores - Object with player names as keys and current totals as values.
   * @returns {object} Updated total scores.
   */
  updateTotalScores(totalScores) {
    this.playerData.forEach(player => {
      if (!(player.name in totalScores)) {
        totalScores[player.name] = 0;
      }
      // Bonus only if bid was exact
      const bonus = (player.bid === player.actualTricks) ? player.bonusPoints || 0 : 0;
      totalScores[player.name] += player.roundScore + bonus;
    });
    return totalScores;
  }
}

module.exports = RoundScoring;
