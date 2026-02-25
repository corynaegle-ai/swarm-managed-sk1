// Basic test for player addition
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');
const dom = new JSDOM(html);
global.document = dom.window.document;
global.window = dom.window;

// Mock GameState
const GameState = class {
  constructor() { this.players = []; }
  addPlayer(name) { this.players.push(name); }
  removePlayer(index) { this.players.splice(index, 1); }
  getPlayers() { return this.players; }
};
global.GameState = GameState;

require('../js/app.js');

test('Adds a player successfully', () => {
  const input = document.querySelector('#player-name');
  const form = document.querySelector('#player-form');
  input.value = 'Alice';
  form.dispatchEvent(new window.Event('submit'));
  expect(document.querySelector('#player-list').children.length).toBe(1);
  expect(document.querySelector('#player-list li').textContent).toContain('Alice');
});