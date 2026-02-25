class RoundPlayerData {
  constructor(playerId, bid, handsInRound) {
    this.playerId = playerId;
    this.bid = bid;
    this.handsInRound = handsInRound;
    this.actualTricks = null;
    this.bonusPoints = null;
    this.roundScore = null;
  }

  inputActualTricks(actualTricks) {
    if (typeof actualTricks !== 'number' || actualTricks < 0 || !Number.isInteger(actualTricks)) {
      throw new Error('Actual tricks must be a non-negative integer');
    }
    this.actualTricks = actualTricks;
  }

  inputBonusPoints(bonusPoints) {
    if (typeof bonusPoints !== 'number' || bonusPoints < 0) {
      throw new Error('Bonus points must be a non-negative number');
    }
    this.bonusPoints = bonusPoints;
  }

  calculateRoundScore() {
    if (this.actualTricks === null) {
      throw new Error('Actual tricks must be input before calculating score');
    }
    let score;
    const difference = Math.abs(this.bid - this.actualTricks);
    if (this.bid === this.actualTricks) {
      if (this.bid === 0) {
        score = 10 * this.handsInRound;
      } else {
        score = 20 * this.actualTricks;
      }
    } else {
      if (this.bid === 0) {
        score = -10 * this.handsInRound;
      } else {
        score = -10 * difference;
      }
    }
    // Bonus points only added if bid was exact
    if (this.bid === this.actualTricks) {
      score += this.bonusPoints !== null ? this.bonusPoints : 0;
    }
    this.roundScore = score;
    return score;
  }
}

class RoundScoring {
  constructor(players, handsInRound) {
    this.handsInRound = handsInRound;
    this.players = players.map(p => new RoundPlayerData(p.id, p.bid, handsInRound));
  }

  inputActualTricks(playerInputs) {
    // playerInputs: array of {playerId, actualTricks}
    if (!Array.isArray(playerInputs)) {
      throw new Error('playerInputs must be an array');
    }
    playerInputs.forEach(input => {
      if (!input.playerId || typeof input.actualTricks !== 'number') {
        throw new Error('Each input must have playerId and actualTricks');
      }
      const player = this.players.find(p => p.playerId === input.playerId);
      if (player) {
        player.inputActualTricks(input.actualTricks);
      }
    });
  }

  inputBonusPoints(playerInputs) {
    // playerInputs: array of {playerId, bonusPoints}
    if (!Array.isArray(playerInputs)) {
      throw new Error('playerInputs must be an array');
    }
    playerInputs.forEach(input => {
      if (!input.playerId || typeof input.bonusPoints !== 'number') {
        throw new Error('Each input must have playerId and bonusPoints');
      }
      const player = this.players.find(p => p.playerId === input.playerId);
      if (player) {
        player.inputBonusPoints(input.bonusPoints);
      }
    });
  }

  calculateRoundScores() {
    this.players.forEach(player => {
      if (player.actualTricks === null) {
        throw new Error(`Actual tricks not input for player ${player.playerId}`);
      }
      player.calculateRoundScore();
    });
  }

  getRoundScores() {
    return this.players.map(p => ({ playerId: p.playerId, roundScore: p.roundScore }));
  }

  updateTotalScores(totalScores) {
    this.players.forEach(player => {
      if (player.roundScore === null) {
        throw new Error(`Round score not calculated for player ${player.playerId}`);
      }
      totalScores[player.playerId] = (totalScores[player.playerId] || 0) + player.roundScore;
    });
  }
}

module.exports = { RoundPlayerData, RoundScoring };