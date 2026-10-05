import { test } from 'node:test';
import assert from 'node:assert/strict';
import { activeNavigation } from '../../src/lib/scroll-navigation.ts';

const sections = [
  { href: '/funcionalidades', top: 600, bottom: 1600 },
  { href: '/funcionalidades', top: 1600, bottom: 2400 },
  { href: '/planes', top: 2400, bottom: 4000 },
  { href: '/comunidad', top: 4000, bottom: 5000 },
];
const atScroll = scroll => activeNavigation(sections.map(section => ({ ...section, top: section.top - scroll, bottom: section.bottom - scroll })), 160);

test('tracks the reading line down and back up without changing clean paths', () => {
  for (const [scroll, expected] of [[0, null], [600, '/funcionalidades'], [1500, '/funcionalidades'], [2400, '/planes'], [4100, '/comunidad'], [2400, '/planes'], [600, '/funcionalidades'], [0, null]]) {
    assert.equal(atScroll(scroll), expected);
  }
});
test('changes at a shared section boundary and clears past the last section', () => {
  assert.equal(atScroll(2240), '/planes');
  assert.equal(atScroll(4840), null);
});
test('clears state when no sections are mounted or the reading line is in a gap', () => {
  assert.equal(activeNavigation([], 160), null);
  assert.equal(activeNavigation([{ href: '/planes', top: 180, bottom: 300 }], 160), null);
});
