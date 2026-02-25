const Player = require('../src/player');
const Game = require('../src/game');

describe('Player Management', () => {
  test('Can add players one at a time with names', () => {
    const game = new Game();
    game.addPlayer('Alice');
    game.addPlayer('Bob');
    expect(game.players.length).toBe(2);
    expect(game.players[0].name).toBe('Alice');
    expect(game.players[1].name).toBe('Bob');
  });

  test('Validates 2-8 player limit on add', () => {
    const game = new Game();
    for (let i = 1; i <= 8; i++) {
      game.addPlayer(`Player${i}`);
    }
    expect(() => game.addPlayer('Player9')).toThrow('Cannot add more than 8 players');
  });

  test('Cannot start game with fewer than 2 or more than 8 players', () => {
    const game1 = new Game();
    game1.addPlayer('Alice');
    expect(() => game1.startGame()).toThrow('Game must have between 2 and 8 players to start');

    const game2 = new Game();
    for (let i = 1; i <= 9; i++) {
      game2.addPlayer(`Player${i}`);
    }
    expect(() => game2.startGame()).toThrow('Game must have between 2 and 8 players to start');

    const game3 = new Game();
    game3.addPlayer('Alice');
    game3.addPlayer('Bob');
    game3.startGame();
    expect(game3.isGameStarted).toBe(true);
  });

  test('Player names are displayed throughout the game', () => {
    const game = new Game();
    game.addPlayer('Alice');
    game.addPlayer('Bob');
    expect(game.getPlayerNames()).toEqual(['Alice', 'Bob']);
    expect(game.getPlayersDisplay()).toContain('Alice: 0');
    expect(game.getPlayersDisplay()).toContain('Bob: 0');
  });
});