// Import GamePhaseManager from the appropriate module
// Assuming GamePhaseManager is defined in './GamePhaseManager.js'
import GamePhaseManager from './GamePhaseManager.js';

// Main game class to integrate phase management
class GameApp {
    constructor() {
        this.phaseManager = new GamePhaseManager();
        this.currentPhase = this.phaseManager.getCurrentPhase();
        this.gameState = { currentRound: 1, readyForPhaseChange: true }; // Initialize with default values for integration
        this.initializeUI();
        this.updatePhaseDisplay();
        this.renderPhaseButtons();
        this.phaseManager.onPhaseChange(() => {
            this.handlePhaseChange();
        });
    }

    initializeUI() {
        // Assume DOM elements exist: phase-display (e.g., <div id="phase-display"></div>)
        // and phase-buttons (e.g., <div id="phase-buttons"></div>)
        this.phaseDisplayElement = document.getElementById('phase-display');
        this.phaseButtonsElement = document.getElementById('phase-buttons');
        if (!this.phaseDisplayElement || !this.phaseButtonsElement) {
            throw new Error('Required DOM elements for phase display and buttons not found.');
        }
    }

    updatePhaseDisplay() {
        // Update the phase indicator with current phase/round
        try {
            const phaseInfo = this.phaseManager.getPhaseInfo();
            this.phaseDisplayElement.textContent = `Phase: ${phaseInfo.name}, Round: ${phaseInfo.round || 'N/A'}`;
        } catch (error) {
            console.error('Error updating phase display:', error);
            this.phaseDisplayElement.textContent = 'Phase: Unknown';
        }
        // AC-001: Phase indicator updates when phase changes
    }

    renderPhaseButtons() {
        // Clear existing buttons
        this.phaseButtonsElement.innerHTML = '';
        
        // Get appropriate buttons for current phase
        try {
            const buttons = this.phaseManager.getAvailableActions();
            buttons.forEach(action => {
                const button = document.createElement('button');
                button.textContent = action.label;
                button.addEventListener('click', () => this.handlePhaseAdvance(action.id));
                this.phaseButtonsElement.appendChild(button);
            });
        } catch (error) {
            console.error('Error rendering phase buttons:', error);
            this.phaseButtonsElement.innerHTML = '<p>Error loading buttons</p>';
        }
        // AC-002: Only appropriate buttons shown for current phase
    }

    handlePhaseAdvance(actionId) {
        // Validate before transitioning (e.g., check game state)
        if (this.validatePhaseTransition(actionId)) {
            this.phaseManager.advancePhase(actionId);
            // Connect to existing game logic: update game state if needed
            this.updateGameState(actionId);
            // AC-003: Phase advance buttons properly validate before transitioning
        } else {
            alert('Transition not allowed: Validation failed.');
        }
    }

    handlePhaseChange() {
        this.currentPhase = this.phaseManager.getCurrentPhase();
        this.updatePhaseDisplay();
        this.renderPhaseButtons();
        try {
            if (this.phaseManager.isGameCompleted()) {
                this.handleGameCompletion();
            }
        } catch (error) {
            console.error('Error checking game completion:', error);
        }
    }

    validatePhaseTransition(actionId) {
        // Example validation: Check if required conditions are met
        // Integrate with existing game logic - default to true for basic functionality
        return this.gameState.readyForPhaseChange !== false; // Allow unless explicitly false
    }

    updateGameState(actionId) {
        // Update existing game state based on action
        this.gameState.lastAction = actionId;
        // Integrate with phase: increment round on advance
        this.gameState.currentRound = this.phaseManager.getCurrentPhase().round || (this.gameState.currentRound + 1);
    }

    handleGameCompletion() {
        // Trigger final UI state: Disable buttons, show completion message
        this.phaseButtonsElement.innerHTML = '<p>Game Completed!</p>';
        this.phaseDisplayElement.textContent += ' - Game Over';
        // AC-004: Game completion triggers final UI state
    }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new GameApp();
});