import React, { useState, useEffect } from 'react';

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
  const [bidsSubmitted, setBidsSubmitted] = useState(false);
  const [scoresCalculated, setScoresCalculated] = useState(false);

  // Error handling: Ensure phase transitions are valid
  const advancePhase = () => {
    try {
      if (currentPhase === PHASES.SETUP) {
        setCurrentPhase(PHASES.BIDDING);
      } else if (currentPhase === PHASES.BIDDING && bidsSubmitted) {
        setCurrentPhase(PHASES.SCORING);
        setBidsSubmitted(false);
      } else if (currentPhase === PHASES.SCORING && scoresCalculated) {
        if (currentRound < MAX_ROUNDS) {
          setCurrentRound(currentRound + 1);
          setCurrentPhase(PHASES.BIDDING);
        } else {
          setCurrentPhase(PHASES.COMPLETE);
        }
        setScoresCalculated(false);
      }
    } catch (error) {
      console.error('Error advancing phase:', error);
      // Could trigger a callback or alert here
    }
  };

  const handleBidSubmit = () => {
    setBidsSubmitted(true);
  };

  const handleScoreCalculate = () => {
    setScoresCalculated(true);
  };

  const renderPhaseIndicator = () => {
    return <h2>Current Phase: {currentPhase.toUpperCase()} (Round {currentRound})</h2>;
  };

  const renderButtons = () => {
    if (currentPhase === PHASES.SETUP) {
      return <button onClick={advancePhase}>Start Bidding</button>;
    } else if (currentPhase === PHASES.BIDDING) {
      return <button onClick={handleBidSubmit} disabled={bidsSubmitted}>Submit Bid</button>;
    } else if (currentPhase === PHASES.SCORING) {
      return <button onClick={handleScoreCalculate} disabled={scoresCalculated}>Calculate Scores</button>;
    } else if (currentPhase === PHASES.COMPLETE) {
      return <p>Game Complete! Final scores here.</p>;
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