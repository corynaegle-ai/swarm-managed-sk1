class Player {
  constructor(id, name, score = 0) {
    this.id = id;
    this.name = name;
    this.score = score;
  }
}

class GameState {
  constructor() {
    this.players = [];
    this.idCounter = 0; // Use counter for unique IDs
  }

  addPlayer(name) {
    if (this.players.length >= 8) {
      return { success: false, error: "Maximum 8 players allowed" };
    }
    const id = ++this.idCounter; // Increment counter for unique ID
    const player = new Player(id, name, 0);
    this.players.push(player);
    return { success: true, player };
  }

  removePlayer(id) {
    const index = this.players.findIndex(p => p.id === id);
    if (index === -1) {
      return { success: false, error: "Player not found" };
    }
    if (this.players.length <= 2) {
      return { success: false, error: "Minimum 2 players required" };
    }
    this.players.splice(index, 1);
    return { success: true };
  }

  getPlayers() {
    return this.players;
  }

  validatePlayerCount() {
    return this.players.length >= 2 && this.players.length <= 8;
  }
}

// Export classes for use in other modules
module.exports = { Player, GameState };