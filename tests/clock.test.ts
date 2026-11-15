import { test } from 'node:test';
import assert from 'node:assert/strict';
import { GameClock } from '../src/core/clock.ts';
test('hidden and paused time does not expire tasks or advance scenes', () => {
  const clock = new GameClock(); let fired = 0, elapsed = 0;
  clock.subscribe(dt => elapsed += dt); clock.after(30000, () => fired++);
  clock.advance(0); clock.advance(10000); clock.setPaused(true);
  clock.advance(20000); clock.advance(100000); assert.equal(elapsed, 10000);
  clock.setPaused(false); clock.advance(110000); clock.advance(129999);
  assert.equal(fired, 0); clock.advance(130000); assert.equal(fired, 1);
  clock.advance(140000); assert.equal(fired, 1);
});
test('cancelled callbacks and reset sessions cannot fire later', () => {
  const clock = new GameClock(); let n = 0;
  const id = clock.after(5, () => n++); clock.cancel(id);
  clock.after(5, () => n++); clock.clear(); clock.advance(0); clock.advance(10); assert.equal(n, 0);
});
