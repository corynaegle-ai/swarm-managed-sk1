class RoundManager {
  constructor() {
    this.currentRound = 1;
    this.maxRounds = 10;
    this.scoringComplete = false;
  }

  getCurrentRound() {
    return this.currentRound;
  }

  getHandsInRound() {
    return this.currentRound;
  }

  completeScoring() {
    this.scoringComplete = true;
  }

  advanceRound() {
    if (this.scoringComplete && this.currentRound < this.maxRounds) {
      this.currentRound++;
      this.scoringComplete = false;
      return true;
    } else if (this.currentRound >= this.maxRounds) {
      throw new Error('Game has ended after round 10');
    } else {
      throw new Error('Cannot advance: scoring not complete');
    }
  }

  isGameOver() {
    return this.currentRound > this.maxRounds;
  }
}

module.exports = RoundManager;