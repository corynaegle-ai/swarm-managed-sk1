// bid-collection.js
// Handles bid collection UI, validation, and data gathering for the game.

const BID_MIN = 0; // Minimum bid value
const BID_MAX = (handsInRound) => handsInRound; // Maximum bid is handsInRound

// Creates the bid form by generating input fields for each player.
// Assumes players is an array of objects with 'id' and 'name' properties.
// Assumes a container element with id 'bid-form-container' exists in the DOM.
function createBidForm(players, handsInRound) {
  const container = document.getElementById('bid-form-container');
  if (!container) {
    throw new Error('Bid form container not found');
  }
  container.innerHTML = ''; // Clear existing content

  players.forEach(player => {
    const label = document.createElement('label');
    label.textContent = `${player.name} bid (0-${handsInRound}): `;
    label.setAttribute('for', `bid-${player.id}`);

    const input = document.createElement('input');
    input.type = 'number';
    input.id = `bid-${player.id}`;
    input.min = BID_MIN;
    input.max = BID_MAX(handsInRound);
    input.value = '';

    const errorSpan = document.createElement('span');
    errorSpan.id = `error-${player.id}`;
    errorSpan.style.color = 'red';
    errorSpan.style.display = 'none';

    container.appendChild(label);
    container.appendChild(input);
    container.appendChild(errorSpan);
    container.appendChild(document.createElement('br'));
  });
}

// Validates a single bid: must be between 0 and handsInRound inclusive.
function validateBid(bid, handsInRound) {
  const numBid = parseInt(bid, 10);
  return !isNaN(numBid) && numBid >= BID_MIN && numBid <= BID_MAX(handsInRound);
}

// Validates all bids and displays error messages for invalid ones.
// Returns true if all are valid, false otherwise.
function validateAllBids(players, handsInRound) {
  let allValid = true;
  players.forEach(player => {
    const input = document.getElementById(`bid-${player.id}`);
    const errorSpan = document.getElementById(`error-${player.id}`);
    if (!input) {
      throw new Error(`Input for player ${player.id} not found`);
    }
    const bid = input.value;
    if (!validateBid(bid, handsInRound)) {
      errorSpan.textContent = `Invalid bid: must be 0-${handsInRound}`;
      errorSpan.style.display = 'inline';
      allValid = false;
    } else {
      errorSpan.style.display = 'none';
    }
  });
  return allValid;
}

// Collects bids from the form inputs.
// Returns an object mapping playerId to bid amount.
function collectBids(players) {
  const bids = {};
  players.forEach(player => {
    const input = document.getElementById(`bid-${player.id}`);
    if (!input) {
      throw new Error(`Input for player ${player.id} not found`);
    }
    bids[player.id] = parseInt(input.value, 10);
  });
  return bids;
}

// Returns the collected bid data, same as collectBids for game state.
function getBidData(players) {
  return collectBids(players);
}

// Export functions for use in main game flow
export { createBidForm, validateBid, validateAllBids, collectBids, getBidData };