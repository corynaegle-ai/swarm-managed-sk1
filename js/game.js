export class Player {
  constructor(name) {
    if (!name || typeof name !== 'string' || name.trim() === '') {
      throw new Error('Player name must be a non-empty string');
    }
    this.id = Date.now() + Math.random(); // Unique ID using timestamp and random for robustness
    this.name = name.trim();
    this.score = 0;
  }
}

export class GameState {
  constructor() {
    this.players = [];
  }

  addPlayer(name) {
    if (this.players.length >= 8) {
      return { success: false, error: 'Maximum of 8 players allowed' };
    }
    try {
      const player = new Player(name);
      this.players.push(player);
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  removePlayer(id) {
    if (this.players.length <= 2) {
      return { success: false, error: 'Minimum of 2 players required' };
    }
    const index = this.players.findIndex(p => p.id === id);
    if (index === -1) {
      return { success: false, error: 'Player not found' };
    }
    this.players.splice(index, 1);
    return { success: true };
  }

  getPlayers() {
    return [...this.players]; // Return a shallow copy to prevent external modification
  }

  validatePlayerCount() {
    return this.players.length >= 2 && this.players.length <= 8;
  }
}