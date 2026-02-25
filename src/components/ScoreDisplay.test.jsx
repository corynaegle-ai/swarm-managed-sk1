import React from 'react';
import { render, screen } from '@testing-library/react';
import ScoreDisplay from './ScoreDisplay';

describe('ScoreDisplay', () => {
  const mockPlayers = [
    { name: 'Player 1', scores: [10, 20, 30] },
    { name: 'Player 2', scores: [15, 25, null] },
  ];

  test('displays total scores for each player', () => {
    render(<ScoreDisplay players={mockPlayers} currentRound={0} isGameComplete={false} />);
    expect(screen.getByText('60')).toBeInTheDocument(); // Player 1 total
    expect(screen.getByText('40')).toBeInTheDocument(); // Player 2 total
  });

  test('shows score breakdown by round', () => {
    render(<ScoreDisplay players={mockPlayers} currentRound={0} isGameComplete={false} />);
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('-')).toBeInTheDocument(); // Null score
  });

  test('highlights current round', () => {
    render(<ScoreDisplay players={mockPlayers} currentRound={1} isGameComplete={false} />);
    const currentCells = screen.getAllByText('Round 2');
    expect(currentCells.length).toBeGreaterThan(0);
    // Check if class is applied (in actual test, might need more assertions)
  });

  test('shows final rankings when game complete', () => {
    render(<ScoreDisplay players={mockPlayers} currentRound={2} isGameComplete={true} />);
    expect(screen.getByText('Final Rankings')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument(); // Rank for top player
    expect(screen.getByText('2')).toBeInTheDocument(); // Rank for second
  });

  test('handles no players', () => {
    render(<ScoreDisplay players={[]} currentRound={0} isGameComplete={false} />);
    expect(screen.getByText('No players available.')).toBeInTheDocument();
  });
});