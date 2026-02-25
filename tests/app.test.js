// Basic test for player addition
import GameState from '../js/game.js';
import { jest } from '@jest/globals';

// Setup JSDOM
import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');
const dom = new JSDOM(html, { url: 'http://localhost' });
global.document = dom.window.document;
global.window = dom.window;

test('Adds a player successfully', async () => {
  // Import app module after setting up DOM
  await import('../js/app.js');
  
  const input = document.querySelector('#player-name');
  const form = document.querySelector('#player-form');
  input.value = 'Alice';
  form.dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
  
  expect(document.querySelector('#player-list').children.length).toBe(1);
  expect(document.querySelector('#player-list li').textContent).toContain('Alice');
});

test('Prevents adding more than 8 players', async () => {
  // Create fresh DOM for this test
  const dom2 = new JSDOM(html, { url: 'http://localhost' });
  global.document = dom2.window.document;
  global.window = dom2.window;
  
  await import('../js/app.js');
  
  const input = document.querySelector('#player-name');
  const form = document.querySelector('#player-form');
  const errorDiv = document.querySelector('#error-message');
  
  // Add 8 players
  for (let i = 0; i < 8; i++) {
    input.value = `Player${i + 1}`;
    form.dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
  }
  
  // Try to add 9th player
  input.value = 'Player9';
  form.dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
  
  expect(document.querySelector('#player-list').children.length).toBe(8);
  expect(errorDiv.textContent).toContain('Maximum 8 players allowed.');
});
