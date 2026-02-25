class RoundManager {
  constructor() {
    this.currentRound = 1;
    this.scored = false;
    this.handsPlayed = 0;
  }

  getCurrentRound() {
    return this.currentRound;
  }

  getHandsForRound() {
    return this.currentRound;
  }

  markScoringComplete() {
    this.scored = true;
  }

  canAdvanceRound() {
    return this.scored;
  }

  advanceRound() {
    if (this.canAdvanceRound()) {
      this.currentRound++;
      this.scored = false;
      this.handsPlayed = 0;
    } else {
      throw new Error('Cannot advance round: scoring not complete');
    }
  }

  isGameComplete() {
    return this.currentRound > 10;
  }
}

// Export for use in other modules (if in Node.js environment)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = RoundManager;
}
