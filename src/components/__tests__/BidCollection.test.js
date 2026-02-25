import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BidCollection from '../BidCollection';

describe('BidCollection', () => {
  const players = [
    { id: '1', name: 'Player 1' },
    { id: '2', name: 'Player 2' },
  ];
  const handsInRound = 5;
  const mockOnBidsCollected = jest.fn();

  beforeEach(() => {
    mockOnBidsCollected.mockClear();
  });

  test('renders input fields for each player', () => {
    render(<BidCollection players={players} handsInRound={handsInRound} onBidsCollected={mockOnBidsCollected} />);
    expect(screen.getByLabelText("Player 1's Bid:")).toBeInTheDocument();
    expect(screen.getByLabelText("Player 2's Bid:")).toBeInTheDocument();
  });

  test('validates bid within range', () => {
    render(<BidCollection players={players} handsInRound={handsInRound} onBidsCollected={mockOnBidsCollected} />);
    const input = screen.getByLabelText("Player 1's Bid:");
    fireEvent.change(input, { target: { value: '6' } });
    expect(screen.getByText(`Bid must be a number between 0 and ${handsInRound}.`)).toBeInTheDocument();
  });

  test('does not allow proceeding if bids are invalid', () => {
    render(<BidCollection players={players} handsInRound={handsInRound} onBidsCollected={mockOnBidsCollected} />);
    const button = screen.getByRole('button', { name: /proceed to scoring/i });
    expect(button).toBeDisabled();
    fireEvent.change(screen.getByLabelText("Player 1's Bid:"), { target: { value: '3' } });
    expect(button).toBeDisabled();
    fireEvent.change(screen.getByLabelText("Player 2's Bid:"), { target: { value: '2' } });
    expect(button).not.toBeDisabled();
  });

  test('calls onBidsCollected with valid bids', () => {
    render(<BidCollection players={players} handsInRound={handsInRound} onBidsCollected={mockOnBidsCollected} />);
    fireEvent.change(screen.getByLabelText("Player 1's Bid:"), { target: { value: '3' } });
    fireEvent.change(screen.getByLabelText("Player 2's Bid:"), { target: { value: '2' } });
    fireEvent.click(screen.getByRole('button', { name: /proceed to scoring/i }));
    expect(mockOnBidsCollected).toHaveBeenCalledWith({ '1': 3, '2': 2 });
  });

  test('shows validation errors for invalid bids', () => {
    render(<BidCollection players={players} handsInRound={handsInRound} onBidsCollected={mockOnBidsCollected} />);
    const input = screen.getByLabelText("Player 1's Bid:");
    fireEvent.change(input, { target: { value: '-1' } });
    expect(screen.getByText(`Bid must be a number between 0 and ${handsInRound}.`)).toBeInTheDocument();
  });
});
