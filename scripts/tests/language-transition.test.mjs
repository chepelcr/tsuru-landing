import { test } from 'node:test';
import assert from 'node:assert/strict';
import { transitionLanguage } from '../../src/lib/language-transition.ts';

test('hides old content before changing language, then reveals the new content', t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const events = [];
  transitionLanguage(() => events.push('commit'), stage => events.push(stage), false);
  assert.deepEqual(events, ['exit']);
  t.mock.timers.tick(159);
  assert.deepEqual(events, ['exit']);
  t.mock.timers.tick(1);
  assert.deepEqual(events, ['exit', 'commit', 'enter']);
  t.mock.timers.tick(220);
  assert.deepEqual(events, ['exit', 'commit', 'enter', 'idle']);
});
test('cancellation prevents a stale language change', t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const events = [];
  const cancel = transitionLanguage(() => events.push('commit'), stage => events.push(stage), false);
  cancel();
  t.mock.timers.tick(500);
  assert.deepEqual(events, ['exit']);
});
test('reduced motion changes language immediately without hiding content', () => {
  const events = [];
  transitionLanguage(() => events.push('commit'), stage => events.push(stage), true);
  assert.deepEqual(events, ['commit', 'idle']);
});
