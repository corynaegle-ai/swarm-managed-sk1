// Import GamePhaseManager from the appropriate module
// Assuming GamePhaseManager is defined in './GamePhaseManager.js'
import GamePhaseManager from './GamePhaseManager.js';

// Main game class to integrate phase management
class GameApp {
    constructor() {
        this.phaseManager = new GamePhaseManager();
        this.currentPhase = this.phaseManager.getCurrentPhase();
        this.gameState = {}; // Placeholder for existing game state
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
        const phaseInfo = this.phaseManager.getPhaseInfo();
        this.phaseDisplayElement.textContent = `Phase: ${phaseInfo.name}, Round: ${phaseInfo.round || 'N/A'}`;
        // AC-001: Phase indicator updates when phase changes
    }

    renderPhaseButtons() {
        // Clear existing buttons
        this.phaseButtonsElement.innerHTML = '';
        
        // Get appropriate buttons for current phase
        const buttons = this.phaseManager.getAvailableActions();
        buttons.forEach(action => {
            const button = document.createElement('button');
            button.textContent = action.label;
            button.addEventListener('click', () => this.handlePhaseAdvance(action.id));
            this.phaseButtonsElement.appendChild(button);
        });
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
        if (this.phaseManager.isGameCompleted()) {
            this.handleGameCompletion();
        }
    }

    validatePhaseTransition(actionId) {
        // Example validation: Check if required conditions are met
        // Integrate with existing game logic
        return this.gameState.readyForPhaseChange || false;
    }

    updateGameState(actionId) {
        // Placeholder: Update existing game state based on action
        // e.g., this.gameState.currentRound++;
        this.gameState.lastAction = actionId;
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