import React, { useState } from 'react';

const PHASES = {
  SETUP: 'setup',
  BIDDING: 'bidding',
  SCORING: 'scoring',
  COMPLETE: 'complete'
};

const MAX_ROUNDS = 10;

function GameFlow() {
  const [currentPhase, setCurrentPhase] = useState(PHASES.SETUP);
  const [currentRound, setCurrentRound] = useState(1);

  const renderPhaseIndicator = () => {
    return <h2>Current Phase: {currentPhase.toUpperCase()} (Round {currentRound})</h2>;
  };

  const renderButtons = () => {
    if (currentPhase === PHASES.SETUP) {
      return <button onClick={() => setCurrentPhase(PHASES.BIDDING)}>Start Bidding</button>;
    } else if (currentPhase === PHASES.BIDDING) {
      return <button onClick={() => setCurrentPhase(PHASES.SCORING)}>Submit Bid</button>;
    } else if (currentPhase === PHASES.SCORING) {
      return (
        <button
          onClick={() => {
            if (currentRound < MAX_ROUNDS) {
              setCurrentRound(prev => prev + 1);
              setCurrentPhase(PHASES.SETUP);
            } else {
              setCurrentPhase(PHASES.COMPLETE);
            }
          }}
        >
          Calculate Scores
        </button>
      );
    } else if (currentPhase === PHASES.COMPLETE) {
      return <p>Game Complete!</p>;
    }
    return null;
  };

  return (
    <div>
      {renderPhaseIndicator()}
      {renderButtons()}
    </div>
  );
}

export default GameFlow;
