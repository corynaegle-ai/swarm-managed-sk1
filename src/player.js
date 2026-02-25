class Player {
  constructor(name) {
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      throw new Error('Player name must be a non-empty string');
    }
    this.name = name.trim();
    this.score = 0;
  }

  updateScore(points) {
    if (typeof points !== 'number') {
      throw new Error('Score update must be a number');
    }
    this.score += points;
  }

  toString() {
    return `${this.name}: ${this.score}`;
  }
}

module.exports = Player;