const Player = require('./player');

class Game {
  constructor() {
    this.players = [];
    this.isGameStarted = false;
  }

  addPlayer(name) {
    if (this.isGameStarted) {
      throw new Error('Cannot add players after the game has started');
    }
    if (this.players.length >= 8) {
      throw new Error('Cannot add more than 8 players');
    }
    const player = new Player(name);
    this.players.push(player);
    return player;
  }

  startGame() {
    if (this.players.length < 2 || this.players.length > 8) {
      throw new Error('Game must have between 2 and 8 players to start');
    }
    this.isGameStarted = true;
  }

  getPlayerNames() {
    return this.players.map(player => player.name);
  }

  getPlayersDisplay() {
    return this.players.map(player => player.toString()).join('\n');
  }
}

module.exports = Game;