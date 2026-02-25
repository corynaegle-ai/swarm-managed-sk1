const { Player, GameState } = require('../js/game.js');

describe('Player Class', () => {
  test('should create a player with id, name, and score', () => {
    const player = new Player(1, 'Alice', 10);
    expect(player.id).toBe(1);
    expect(player.name).toBe('Alice');
    expect(player.score).toBe(10);
  });

  test('should default score to 0', () => {
    const player = new Player(2, 'Bob');
    expect(player.score).toBe(0);
  });
});

describe('GameState Class', () => {
  let gameState;

  beforeEach(() => {
    gameState = new GameState();
  });

  test('should add a player successfully within limits', () => {
    const result = gameState.addPlayer('Alice');
    expect(result.success).toBe(true);
    expect(gameState.getPlayers().length).toBe(1);
    expect(gameState.getPlayers()[0].name).toBe('Alice');
    expect(gameState.getPlayers()[0].score).toBe(0);
  });

  test('should prevent adding more than 8 players', () => {
    for (let i = 0; i < 8; i++) {
      gameState.addPlayer(`Player${i}`);
    }
    const result = gameState.addPlayer('Player9');
    expect(result.success).toBe(false);
    expect(result.error).toBe('Maximum 8 players allowed');
    expect(gameState.getPlayers().length).toBe(8);
  });

  test('should remove a player successfully within limits', () => {
    gameState.addPlayer('Alice');
    gameState.addPlayer('Bob');
    gameState.addPlayer('Charlie');
    const result = gameState.removePlayer(gameState.getPlayers()[1].id);
    expect(result.success).toBe(true);
    expect(gameState.getPlayers().length).toBe(2);
  });

  test('should prevent removing below 2 players', () => {
    gameState.addPlayer('Alice');
    gameState.addPlayer('Bob');
    const result = gameState.removePlayer(gameState.getPlayers()[0].id);
    expect(result.success).toBe(false);
    expect(result.error).toBe('Minimum 2 players required');
    expect(gameState.getPlayers().length).toBe(2);
  });

  test('should return error for removing non-existent player', () => {
    gameState.addPlayer('Alice');
    const result = gameState.removePlayer(999);
    expect(result.success).toBe(false);
    expect(result.error).toBe('Player not found');
  });

  test('should get players array', () => {
    gameState.addPlayer('Alice');
    gameState.addPlayer('Bob');
    const players = gameState.getPlayers();
    expect(Array.isArray(players)).toBe(true);
    expect(players.length).toBe(2);
  });

  test('should validate player count', () => {
    expect(gameState.validatePlayerCount()).toBe(false);
    gameState.addPlayer('Alice');
    gameState.addPlayer('Bob');
    expect(gameState.validatePlayerCount()).toBe(true);
    for (let i = 0; i < 6; i++) {
      gameState.addPlayer(`Player${i}`);
    }
    expect(gameState.validatePlayerCount()).toBe(true);
    gameState.addPlayer('Player9');
    expect(gameState.validatePlayerCount()).toBe(false);
  });
});