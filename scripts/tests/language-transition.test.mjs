import { test } from 'node:test';
import assert from 'node:assert/strict';
import { transitionLanguage } from '../../src/lib/language-transition.ts';

// Minimal DOM for the body-level slide (the POS useLanguageSwitch motion).
function fakeDom(scrollY = 0) {
  const classes = new Set();
  const body = {
    style: {},
    classList: { add: (...c) => c.forEach(x => classes.add(x)), remove: (...c) => c.forEach(x => classes.delete(x)) },
  };
  const scrolls = [];
  globalThis.document = { body };
  globalThis.window = { scrollY, scrollTo: ({ top }) => scrolls.push(top) };
  return { body, classes, scrolls };
}

test('slides the page out, commits the language, then slides it back in', t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const dom = fakeDom(640);
  const events = [];
  transitionLanguage(() => events.push('commit'), stage => events.push(stage), false);
  assert.deepEqual(events, ['exit']);
  assert.ok(dom.classes.has('language-transitioning'));
  assert.equal(dom.body.style.top, '-640px');
  t.mock.timers.tick(299);
  assert.deepEqual(events, ['exit']);
  t.mock.timers.tick(1);
  assert.deepEqual(events, ['exit', 'commit', 'enter']);
  assert.ok(dom.classes.has('language-slide-in') && !dom.classes.has('language-transitioning'));
  t.mock.timers.tick(300);
  assert.deepEqual(events, ['exit', 'commit', 'enter', 'idle']);
  assert.equal(dom.classes.size, 0);
  assert.equal(dom.body.style.position, '');
  assert.deepEqual(dom.scrolls, [640]);
});

test('cancellation prevents a stale language change and releases the page', t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const dom = fakeDom();
  const events = [];
  const cancel = transitionLanguage(() => events.push('commit'), stage => events.push(stage), false);
  cancel();
  t.mock.timers.tick(1000);
  assert.deepEqual(events, ['exit']);
  assert.equal(dom.classes.size, 0);
  assert.equal(dom.body.style.overflow, '');
});

test('reduced motion changes language immediately without animating', () => {
  const dom = fakeDom();
  const events = [];
  transitionLanguage(() => events.push('commit'), stage => events.push(stage), true);
  assert.deepEqual(events, ['commit', 'idle']);
  assert.equal(dom.classes.size, 0);
});
