class RoundPlayerData {
  constructor(bid, actualTricks, bonusPoints, handsInRound) {
    this.bid = bid;
    this.actualTricks = actualTricks;
    this.bonusPoints = bonusPoints;
    this.handsInRound = handsInRound;
  }

  calculateRoundScore() {
    if (this.bid === 0) {
      // Special case for zero bid
      if (this.actualTricks === 0) {
        return (10 * this.handsInRound) + this.bonusPoints;
      } else {
        return -10 * this.handsInRound;
      }
    } else {
      // General case
      if (this.bid === this.actualTricks) {
        return (20 * this.actualTricks) + this.bonusPoints;
      } else {
        return -10 * Math.abs(this.bid - this.actualTricks);
      }
    }
  }
}

module.exports = RoundPlayerData;
