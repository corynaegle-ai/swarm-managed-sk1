import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GameFlow from './GameFlow';

describe('GameFlow', () => {
  test('renders initial phase indicator', () => {
    render(<GameFlow />);
    expect(screen.getByText('Current Phase: SETUP (Round 1)')).toBeInTheDocument();
  });

  test('advances from setup to bidding', () => {
    render(<GameFlow />);
    fireEvent.click(screen.getByText('Start Bidding'));
    expect(screen.getByText('Current Phase: BIDDING (Round 1)')).toBeInTheDocument();
  });

  test('does not allow skipping phases', () => {
    render(<GameFlow />);
    
    // Verify we start in SETUP phase
    expect(screen.getByText('Current Phase: SETUP (Round 1)')).toBeInTheDocument();
    
    // Verify we cannot skip directly to scoring phase from setup
    expect(screen.queryByText('Calculate Scores')).not.toBeInTheDocument();
    
    // Advance to bidding
    fireEvent.click(screen.getByText('Start Bidding'));
    expect(screen.getByText('Current Phase: BIDDING (Round 1)')).toBeInTheDocument();
    
    // Verify we cannot skip bidding - no direct way to advance without submitting bid
    expect(screen.queryByText('Start Playing')).not.toBeInTheDocument();
    
    // Submit bid to advance
    fireEvent.click(screen.getByText('Submit Bid'));
    expect(screen.getByText('Current Phase: PLAYING (Round 1)')).toBeInTheDocument();
    
    // Verify we must complete playing before scoring
    const completeButton = screen.getByText('Complete Round');
    expect(completeButton).toBeInTheDocument();
  });

  test('completes after round 10', () => {
    render(<GameFlow />);
    
    // Simulate 10 complete rounds
    for (let round = 1; round <= 10; round++) {
      // Verify current round
      expect(screen.getByText(`Current Phase: SETUP (Round ${round})`)).toBeInTheDocument();
      
      // Setup -> Bidding
      fireEvent.click(screen.getByText('Start Bidding'));
      expect(screen.getByText(`Current Phase: BIDDING (Round ${round})`)).toBeInTheDocument();
      
      // Bidding -> Playing
      fireEvent.click(screen.getByText('Submit Bid'));
      expect(screen.getByText(`Current Phase: PLAYING (Round ${round})`)).toBeInTheDocument();
      
      // Playing -> Scoring
      fireEvent.click(screen.getByText('Complete Round'));
      expect(screen.getByText(`Current Phase: SCORING (Round ${round})`)).toBeInTheDocument();
      
      // Scoring -> Next Round (or Game Complete)
      if (round < 10) {
        fireEvent.click(screen.getByText('Next Round'));
      } else {
        // After round 10, game should be complete
        fireEvent.click(screen.getByText('Calculate Scores'));
        expect(screen.getByText('Game Complete!')).toBeInTheDocument();
      }
    }
    
    // Verify game is in completed state
    expect(screen.getByText('Game Complete!')).toBeInTheDocument();
    expect(screen.queryByText('Start Bidding')).not.toBeInTheDocument();
  });
});