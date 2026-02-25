// RoundManager class to manage rounds, each with N hands
class RoundManager {
  constructor() {
    this.currentRound = 1;
    this.scores = {}; // Object to hold scores per round, e.g., {1: [score1, score2, ...]}
    this.maxRounds = 10;
  }

  getCurrentRound() {
    return this.currentRound;
  }

  getHandsThisRound() {
    return this.currentRound;
  }

  addScore(handIndex, score) {
    if (!this.scores[this.currentRound]) {
      this.scores[this.currentRound] = [];
    }
    this.scores[this.currentRound][handIndex] = score;
  }

  getScoresForRound(round) {
    return this.scores[round] || [];
  }

  isRoundComplete() {
    const handsNeeded = this.getHandsThisRound();
    const currentScores = this.scores[this.currentRound] || [];
    return currentScores.length === handsNeeded && currentScores.every(score => score !== undefined && score !== null);
  }

  advanceRound() {
    if (this.isRoundComplete() && !this.isGameOver()) {
      this.currentRound++;
      return true;
    }
    return false;
  }

  isGameOver() {
    return this.currentRound > this.maxRounds;
  }
}

module.exports = RoundManager;