// Run: node tests/roll-result-formatting.test.js
// Mock-only: NOT Foundry integration verification.
import assert from 'node:assert/strict';
import { formatWoD20RollResult } from '../src/roll-result-formatting.js';
function fakeCard(label, danger=false) {
  const classes = new Set();
  const area = { textContent: label,
    classList: { add: x => classes.add(x),
      remove: (...xs) => xs.forEach(x => classes.delete(x)) },
    querySelector: sel => sel === '.danger' && danger ? {} : null };
  const html = { querySelector: sel => sel === '.wod20-roll .tray-success-area' ? area : null };
  formatWoD20RollResult(html);
  return classes;
}
assert(fakeCard('Successes: 3').has('wod20-result-success'));
assert(fakeCard('Successes: 0').has('wod20-result-zero'));
assert(!fakeCard('BOTCH', true).has('wod20-result-success'));
assert(!fakeCard('Other card').size);
formatWoD20RollResult({querySelector: () => null});
console.log('Mock checks passed (5).');
