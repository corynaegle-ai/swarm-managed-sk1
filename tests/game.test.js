import { Player, GameState } from '../js/game.js';

describe('Player', () => {
  test('creates player with id, name, score', () => {
    const player = new Player('Alice');
    expect(player.id).toBeDefined();
    expect(player.name).toBe('Alice');
    expect(player.score).toBe(0);
  });

  test('validates name', () => {
    expect(() => new Player('')).toThrow('Player name must be a non-empty string');
    expect(() => new Player(null)).toThrow('Player name must be a non-empty string');
  });
});

describe('GameState', () => {
  let game;

  beforeEach(() => {
    game = new GameState();
  });

  test('addPlayer adds player and returns success', () => {
    const result = game.addPlayer('Bob');
    expect(result.success).toBe(true);
    expect(game.getPlayers()).toHaveLength(1);
  });

  test('addPlayer validates max players', () => {
    for (let i = 0; i < 8; i++) game.addPlayer(`Player${i}`);
    const result = game.addPlayer('Extra');
    expect(result.success).toBe(false);
    expect(result.error).toBe('Maximum of 8 players allowed');
  });

  test('removePlayer removes player and returns success', () => {
    game.addPlayer('Charlie');
    game.addPlayer('Dave');
    game.addPlayer('Eve');
    const playerId = game.getPlayers()[1].id;
    const result = game.removePlayer(playerId);
    expect(result.success).toBe(true);
    expect(game.getPlayers()).toHaveLength(2);
  });

  test('removePlayer validates min players', () => {
    game.addPlayer('Alice');
    game.addPlayer('Bob');
    const result = game.removePlayer(game.getPlayers()[0].id);
    expect(result.success).toBe(false);
    expect(result.error).toBe('Minimum of 2 players required');
  });

  test('getPlayers returns copy', () => {
    game.addPlayer('Frank');
    const players = game.getPlayers();
    players.push({ id: 'fake', name: 'Fake', score: 0 }); // Modify copy
    expect(game.getPlayers()).toHaveLength(1); // Original unchanged
  });

  test('validatePlayerCount', () => {
    expect(game.validatePlayerCount()).toBe(false);
    game.addPlayer('Gina');
    game.addPlayer('Hank');
    expect(game.validatePlayerCount()).toBe(true);
    game.addPlayer('Ivy');
    game.addPlayer('Jack');
    game.addPlayer('Kate');
    game.addPlayer('Liam');
    game.addPlayer('Mia');
    game.addPlayer('Noah');
    expect(game.validatePlayerCount()).toBe(true);
    game.addPlayer('Owen');
    expect(game.validatePlayerCount()).toBe(false);
  });
});