import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
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
    
    // Verify the only button in bidding phase is Submit Bid
    const submitBidButton = screen.getByText('Submit Bid');
    expect(submitBidButton).toBeInTheDocument();
    
    // Submit bid to advance to scoring
    fireEvent.click(submitBidButton);
    expect(screen.getByText('Current Phase: SCORING (Round 1)')).toBeInTheDocument();
  });

  test('completes after round 10', () => {
    render(<GameFlow />);
    
    // Simulate 10 complete rounds
    for (let round = 1; round <= 10; round++) {
      // Verify current round in SETUP phase
      expect(screen.getByText(`Current Phase: SETUP (Round ${round})`)).toBeInTheDocument();
      
      // Setup -> Bidding
      act(() => {
        fireEvent.click(screen.getByText('Start Bidding'));
      });
      expect(screen.getByText(`Current Phase: BIDDING (Round ${round})`)).toBeInTheDocument();
      
      // Bidding -> Scoring
      act(() => {
        fireEvent.click(screen.getByText('Submit Bid'));
      });
      expect(screen.getByText(`Current Phase: SCORING (Round ${round})`)).toBeInTheDocument();
      
      // Scoring -> Next Round Setup or Game Complete
      act(() => {
        fireEvent.click(screen.getByText('Calculate Scores'));
      });
      if (round < 10) {
        expect(screen.getByText(`Current Phase: SETUP (Round ${round + 1})`)).toBeInTheDocument();
      } else {
        expect(screen.getByText('Game Complete!')).toBeInTheDocument();
      }
    }
  });
});
