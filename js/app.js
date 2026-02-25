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
        // Register phase change callback BEFORE initial UI updates to prevent race condition
        this.phaseManager.onPhaseChange(() => {
            this.handlePhaseChange();
        });
        this.updatePhaseDisplay();
        this.renderPhaseButtons();
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
            if (phaseInfo && typeof phaseInfo === 'object' && phaseInfo.name) {
                this.phaseDisplayElement.textContent = `Phase: ${phaseInfo.name}, Round: ${phaseInfo.round || 'N/A'}`;
            } else {
                this.phaseDisplayElement.textContent = 'Phase: Unknown';
            }
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
            if (Array.isArray(buttons)) {
                buttons.forEach(action => {
                    const button = document.createElement('button');
                    button.textContent = action.label;
                    button.addEventListener('click', () => this.handlePhaseAdvance(action.id));
                    this.phaseButtonsElement.appendChild(button);
                });
            } else {
                this.phaseButtonsElement.innerHTML = '<p>No actions available</p>';
            }
        } catch (error) {
            console.error('Error rendering phase buttons:', error);
            this.phaseButtonsElement.innerHTML = '<p>Error loading buttons</p>';
        }
        // AC-002: Only appropriate buttons shown for current phase
    }

    handlePhaseAdvance(actionId) {
        // Validate before transitioning (e.g., check game state)
        if (this.validatePhaseTransition(actionId)) {
            try {
                this.phaseManager.advancePhase(actionId);
                // Connect to existing game logic: update game state if needed
                this.updateGameState(actionId);
            } catch (error) {
                console.error('Error advancing phase:', error);
                this.showNotification('Error: Phase advance failed. Please try again.');
                // Revert any partial state changes if possible (not implemented here)
            }
            // AC-003: Phase advance buttons properly validate before transitioning
        } else {
            this.showNotification('Transition not allowed: Validation failed.');
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

    showNotification(message) {
        // Replace alert with non-blocking UI notification (assume a notification div exists)
        const notificationElement = document.getElementById('notification');
        if (notificationElement) {
            notificationElement.textContent = message;
            notificationElement.style.display = 'block';
            setTimeout(() => {
                notificationElement.style.display = 'none';
            }, 3000);
        } else {
            console.warn('Notification element not found, logging message:', message);
        }
    }

    validatePhaseTransition(actionId) {
        // Example validation: Check if required conditions are met
        // Integrate with existing game logic - strict check
        return this.gameState.readyForPhaseChange === true;
    }

    updateGameState(actionId) {
        // Update existing game state based on action
        this.gameState.lastAction = actionId;
        // Integrate with phase: sync round from phaseManager
        const currentPhase = this.phaseManager.getCurrentPhase();
        this.gameState.currentRound = (currentPhase && currentPhase.round) ? currentPhase.round : this.gameState.currentRound;
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