// Import RoundManager using ES6 modules
import RoundManager from './RoundManager.js';

// Initialize RoundManager instance
let roundManager = new RoundManager();

// Function to update round display in the DOM
function updateRoundDisplay() {
    const roundElement = document.getElementById('round-display');
    if (!roundElement) {
        console.error('Error: round-display element not found in DOM');
        return;
    }
    try {
        const currentRound = roundManager.getCurrentRound();
        if (currentRound === null || currentRound === undefined) {
            console.error('Error: getCurrentRound() returned invalid value');
            return;
        }
        roundElement.textContent = `Round: ${currentRound}`;
    } catch (error) {
        console.error('Error updating round display:', error);
    }
}

// Function to handle round advancement after scoring completion
function advanceRoundIfScoringComplete(event) {
    try {
        // Validate that scoring is actually complete for the current round
        // Check event detail or game state to prevent invalid advancement
        if (!event || !event.detail || !event.detail.scoringComplete) {
            console.warn('Ignoring round advancement: scoring not confirmed complete');
            return;
        }
        
        roundManager.advanceRound();
        updateRoundDisplay();
        checkGameEnd();
    } catch (error) {
        console.error('Error advancing round:', error);
    }
}

// Function to check if game should end after round 10 completes
function checkGameEnd() {
    try {
        const currentRound = roundManager.getCurrentRound();
        if (currentRound === null || currentRound === undefined) {
            console.error('Error: getCurrentRound() returned invalid value in checkGameEnd');
            return;
        }
        // Game ends when we've just completed round 10 (advanced to round 11 or beyond)
        if (currentRound > 10) {
            endGame();
        }
    } catch (error) {
        console.error('Error checking game end:', error);
    }
}

// Function to end the game
function endGame() {
    try {
        console.log('Game ended after round 10.');
        
        // Remove the event listener to prevent any further round advancement
        document.removeEventListener('scoringComplete', advanceRoundIfScoringComplete);
        
        // Disable all interactive buttons to prevent further game actions
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            button.disabled = true;
        });
        
        // Show end game message by creating/updating an end game element
        // Do NOT use innerHTML on the game container to avoid destroying existing DOM
        const endGameElement = document.getElementById('end-game-message');
        if (endGameElement) {
            endGameElement.style.display = 'block';
            endGameElement.textContent = 'Game Over! Thank you for playing!';
        } else {
            // Create end game message if element doesn't exist
            const messageDiv = document.createElement('div');
            messageDiv.id = 'end-game-message';
            messageDiv.style.cssText = 'padding: 20px; background-color: #f0f0f0; border: 2px solid #333; text-align: center; margin-top: 20px; font-size: 18px; font-weight: bold;';
            messageDiv.textContent = 'Game Over! Thank you for playing!';
            const gameContainer = document.getElementById('game-container');
            if (gameContainer) {
                gameContainer.appendChild(messageDiv);
            } else {
                console.error('Error: game-container element not found, cannot display end game message');
            }
        }
    } catch (error) {
        console.error('Error ending game:', error);
    }
}

// Main game loop or initialization
function initializeGame() {
    try {
        updateRoundDisplay();
        
        // Set up event listener for scoring completion to trigger round advancement
        // The advanceRoundIfScoringComplete handler will validate scoring completion
        // before allowing the round to advance
        document.addEventListener('scoringComplete', advanceRoundIfScoringComplete);
        
        console.log('Game initialized successfully');
    } catch (error) {
        console.error('Error initializing game:', error);
    }
}

// Call initialization on load
window.addEventListener('DOMContentLoaded', initializeGame);
