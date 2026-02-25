class RoundManager {
  constructor() {
    this.currentRound = 1;
    this.maxRounds = 10;
  }

  getCurrentRound() {
    return this.currentRound;
  }

  getHandsThisRound() {
    return this.currentRound;
  }

  advanceRound() {
    if (this.currentRound >= this.maxRounds) {
      this.currentRound++; // Allow advancing to 11 to trigger game over
      return;
    }
    this.currentRound++;
  }

  isGameOver() {
    return this.currentRound > this.maxRounds;
  }
}

module.exports = RoundManager;