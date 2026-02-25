import React, { useState, useEffect } from 'react';
import './BidCollection.css';

const BidCollection = ({ players, handsInRound, onBidsCollected }) => {
  const [bids, setBids] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Initialize bids and errors for each player
    const initialBids = {};
    const initialErrors = {};
    players.forEach(player => {
      initialBids[player.id] = '';
      initialErrors[player.id] = '';
    });
    setBids(initialBids);
    setErrors(initialErrors);
  }, [players]);

  const validateBid = (playerId, value) => {
    const numValue = parseInt(value, 10);
    if (isNaN(numValue) || numValue < 0 || numValue > handsInRound) {
      return `Bid must be a number between 0 and ${handsInRound}.`;
    }
    return '';
  };

  const handleBidChange = (playerId, value) => {
    setBids(prev => ({ ...prev, [playerId]: value }));
    const error = validateBid(playerId, value);
    setErrors(prev => ({ ...prev, [playerId]: error }));
  };

  const isAllBidsValid = () => {
    return players.every(player => {
      const bid = bids[player.id];
      return bid !== '' && !errors[player.id];
    });
  };

  const handleSubmit = () => {
    if (isAllBidsValid()) {
      const collectedBids = {};
      players.forEach(player => {
        collectedBids[player.id] = parseInt(bids[player.id], 10);
      });
      onBidsCollected(collectedBids);
    }
  };

  return (
    <div className="bid-collection">
      <h2>Enter Your Bids</h2>
      {players.map(player => (
        <div key={player.id} className="bid-input-group">
          <label htmlFor={`bid-${player.id}`}>{player.name}'s Bid:</label>
          <input
            id={`bid-${player.id}`}
            type="number"
            min="0"
            max={handsInRound}
            value={bids[player.id] || ''}
            onChange={(e) => handleBidChange(player.id, e.target.value)}
            className={errors[player.id] ? 'error' : ''}
          />
          {errors[player.id] && <span className="error-message">{errors[player.id]}</span>}
        </div>
      ))}
      <button onClick={handleSubmit} disabled={!isAllBidsValid()}>
        Proceed to Scoring
      </button>
    </div>
  );
};

export default BidCollection;
