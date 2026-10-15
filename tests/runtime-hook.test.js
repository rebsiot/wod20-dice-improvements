import assert from 'node:assert/strict';
const hooks = new Map();
globalThis.Hooks = {on: (name, cb) => hooks.set(name, cb)};
globalThis.game = {system: {id: 'worldofdarkness'}};
await import('../src/main.js');
assert.equal(typeof hooks.get('renderChatMessageHTML'), 'function');
const classes = new Set();
const area = {
 textContent: 'Successes: 2',
 classList: {remove: (...cs) => cs.forEach(x => classes.delete(x)), add: c => classes.add(c)},
 querySelector: () => null
};
const html = {querySelector: q => q === '.wod20-roll .tray-success-area' ? area : null};
hooks.get('renderChatMessageHTML')({}, html);
assert(classes.has('wod20-result-success'));
game.system.id = 'dnd5e';
area.textContent = 'Successes: 0';
hooks.get('renderChatMessageHTML')({}, html);
assert(classes.has('wod20-result-success'), 'Non-WoD system must not be decorated');
console.log('Runtime hook checks passed (3).');
