import React from 'react';
import PropTypes from 'prop-types';
import './ScoreDisplay.css'; // Assuming CSS for styling

/**
 * ScoreDisplay component for showing game scores
 */
const ScoreDisplay = ({ players, currentRound, isGameComplete }) => {
  if (!players || players.length === 0) {
    return <div className="score-display-error">No players available.</div>;
  }

  // Calculate total scores
  const playersWithTotals = players.map(player => ({
    ...player,
    total: player.scores.reduce((sum, score) => sum + (score || 0), 0),
  }));

  // Sort for rankings if game complete
  const sortedPlayers = isGameComplete
    ? [...playersWithTotals].sort((a, b) => b.total - a.total)
    : playersWithTotals;

  return (
    <div className="score-display">
      <h2>Score Display</h2>
      {!isGameComplete && <p>Current Round: {currentRound + 1}</p>}
      <table className="score-table">
        <thead>
          <tr>
            <th>Player</th>
            {Array.from({ length: players[0].scores.length }, (_, i) => (
              <th key={i} className={i === currentRound && !isGameComplete ? 'current-round' : ''}>
                Round {i + 1}
              </th>
            ))}
            <th>Total</th>
            {isGameComplete && <th>Rank</th>}
          </tr>
        </thead>
        <tbody>
          {sortedPlayers.map((player, index) => (
            <tr key={player.name}>
              <td>{player.name}</td>
              {player.scores.map((score, roundIndex) => (
                <td key={roundIndex} className={roundIndex === currentRound && !isGameComplete ? 'current-round' : ''}>
                  {score !== null ? score : '-'}
                </td>
              ))}
              <td>{player.total}</td>
              {isGameComplete && <td>{index + 1}</td>}
            </tr>
          ))}
        </tbody>
      </table>
      {isGameComplete && <h3>Final Rankings</h3>}
    </div>
  );
};

ScoreDisplay.propTypes = {
  players: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      scores: PropTypes.arrayOf(PropTypes.number).isRequired,
    })
  ).isRequired,
  currentRound: PropTypes.number.isRequired,
  isGameComplete: PropTypes.bool.isRequired,
};

export default ScoreDisplay;