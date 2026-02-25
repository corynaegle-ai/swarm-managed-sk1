class RoundManager {
    constructor() {
        this.currentRound = 1;
        this.maxRounds = 10;
        this.scores = {}; // Object to store scores per round, e.g., {1: [score1], 2: [score1, score2], ...}
        this.scoringComplete = {}; // Track if scoring is complete for each round
    }

    getHandsForRound(round = this.currentRound) {
        return round;
    }

    setScores(scores) {
        if (scores.length !== this.getHandsForRound()) {
            throw new Error('Number of scores must match number of hands.');
        }
        this.scores[this.currentRound] = scores;
        this.scoringComplete[this.currentRound] = true;
    }

    advanceRound() {
        if (!this.scoringComplete[this.currentRound]) {
            return false; // Cannot advance without scoring
        }
        if (this.currentRound >= this.maxRounds) {
            return false; // Game over, no more rounds
        }
        this.currentRound++;
        return true;
    }

    isGameOver() {
        return this.currentRound > this.maxRounds;
    }

    getCurrentRound() {
        return this.currentRound;
    }

    getScoresForRound(round) {
        return this.scores[round] || [];
    }
}