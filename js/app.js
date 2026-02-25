// Import RoundManager using ES6 modules
import RoundManager from './RoundManager.js';

// Initialize RoundManager instance
let roundManager = new RoundManager();

// Function to update round display in the DOM
function updateRoundDisplay() {
    const roundElement = document.getElementById('round-display');
    if (roundElement) {
        roundElement.textContent = `Round: ${roundManager.getCurrentRound()}`;
    }
}

// Function to handle round advancement after scoring completion
function advanceRoundIfScoringComplete() {
    try {
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
        if (roundManager.getCurrentRound() > 10) {
            endGame();
        }
    } catch (error) {
        console.error('Error checking game end:', error);
    }
}

// Function to end the game
function endGame() {
    console.log('Game ended after round 10.');
    // Disable UI elements to prevent further interaction
    const gameContainer = document.getElementById('game-container');
    if (gameContainer) {
        gameContainer.innerHTML = '<h2>Game Over!</h2><p>Thank you for playing!</p>';
        // Optionally disable other elements, e.g., buttons
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => button.disabled = true);
    }
}

// Note: isScoringComplete is no longer used; round advancement is event-driven to prevent invalid advancement

// Main game loop or initialization (assumed existing)
function initializeGame() {
    try {
        updateRoundDisplay();
        // Set up event listeners for scoring completion to automatically advance round
        document.addEventListener('scoringComplete', advanceRoundIfScoringComplete);
    } catch (error) {
        console.error('Error initializing game:', error);
    }
}

// Call initialization on load
window.addEventListener('DOMContentLoaded', initializeGame);
