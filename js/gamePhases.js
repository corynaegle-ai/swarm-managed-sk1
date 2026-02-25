class GamePhaseManager {
    #currentPhase;
    #currentRound;

    constructor() {
        this.#currentPhase = 'setup';
        this.#currentRound = 1;
    }

    getCurrentPhase() {
        return { phase: this.#currentPhase, round: this.#currentRound };
    }

    canAdvancePhase() {
        return this.#currentPhase !== 'complete';
    }

    advancePhase() {
        if (!this.canAdvancePhase()) {
            throw new Error('Cannot advance phase: game is complete');
        }
        if (this.#currentPhase === 'setup') {
            this.#currentPhase = 'bidding';
        } else if (this.#currentPhase === 'bidding') {
            this.#currentPhase = 'scoring';
        } else if (this.#currentPhase === 'scoring') {
            if (this.#currentRound < 10) {
                this.#currentPhase = 'setup';
                this.#currentRound++;
            } else {
                this.#currentPhase = 'complete';
            }
        }
    }

    isGameComplete() {
        return this.#currentPhase === 'complete';
    }
}

export default GamePhaseManager;
