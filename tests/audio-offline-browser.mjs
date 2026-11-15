import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

// Exercise real MP3 decoding and Web Audio under the browser's gesture policy.
const browser = await chromium.launch({ headless: true, args: ['--autoplay-policy=user-gesture-required'] });
const context = await browser.newContext({ offline: true, viewport: { width: 1280, height: 720 } });
const page = await context.newPage(), errors = [], external = [];
page.on('pageerror', error => errors.push(error.message));
page.on('request', request => { if (/^https?:/.test(request.url())) external.push(request.url()); });
await page.addInitScript(() => {
  const Native = window.AudioContext;
  const log = window.audioProbe = { contexts: [], sources: [], gains: [], ended: [] };
  window.AudioContext = class extends Native {
    constructor(...args) { super(...args); log.contexts.push(this); }
    createGain() { const gain = super.createGain(); log.gains.push(gain); return gain; }
    createBufferSource() {
      const source = super.createBufferSource(), start = source.start.bind(source);
      source.addEventListener('ended', () => log.ended.push(source));
      source.start = (...args) => { log.sources.push(source); return start(...args); };
      return source;
    }
  };
});
try {
  await page.goto(pathToFileURL(resolve(process.env.PLAY_HTML || 'index.html')).href);
  assert.equal(await page.evaluate(() => window.audioProbe.contexts.length), 0, 'no audio context before interaction');
  assert.deepEqual(await page.evaluate(() => Object.keys(window.__SPACE_PAPERS_ASSETS__).filter(key => key.startsWith('assets/audio/')).sort()), ['assets/audio/ambient-music.mp3', 'assets/audio/door.mp3', 'assets/audio/stamp.mp3']);
  await page.locator('[data-action="options"]').click();
  await page.waitForFunction(() => window.audioProbe.sources.some(source => source.loop));
  await page.waitForFunction(() => Math.abs(window.audioProbe.gains[0].gain.value * window.audioProbe.gains[1].gain.value - .063) < .0001);
  const initial = await page.evaluate(() => {
    const music = window.audioProbe.sources.find(source => source.loop);
    return { duration: music.buffer.duration, channels: music.buffer.numberOfChannels, state: window.audioProbe.contexts[0].state, gains: window.audioProbe.gains.map(gain => gain.gain.value) };
  });
  assert.ok(initial.duration > 224 && initial.duration < 225, 'the supplied music decodes offline');
  assert.equal(initial.channels, 2);
  assert.equal(initial.state, 'running');
  assert.ok(Math.abs(initial.gains[0] * initial.gains[1] - .063) < .0001, 'initial music level is subdued');
  // Accelerate only this test's real source to cross the end of the MP3 quickly.
  await page.evaluate(() => { window.audioProbe.sources.find(source => source.loop).playbackRate.value = 1000; });
  await page.waitForTimeout(350);
  assert.equal(await page.evaluate(() => window.audioProbe.sources.filter(source => source.loop).length), 1, 'loop boundary creates no second source');
  assert.equal(await page.evaluate(() => window.audioProbe.ended.filter(source => source.loop).length), 0, 'music continues after the loop boundary');
  await page.locator('#music-volume').fill('0');
  await page.waitForFunction(() => window.audioProbe.gains[1].gain.value === 0);
  assert.equal(await page.evaluate(() => window.audioProbe.gains[1].gain.value), 0);
  await page.locator('#muted').check();
  await page.waitForFunction(() => window.audioProbe.gains[0].gain.value === 0);
  assert.equal(await page.evaluate(() => window.audioProbe.gains[0].gain.value), 0);
  await page.locator('#muted').uncheck();
  await page.locator('[data-action="settings-done"]').click();
  await page.locator('[data-action="new-shift"]').click();
  await page.waitForFunction(() => window.audioProbe.sources.some(source => !source.loop && source.buffer.duration > 1.8 && source.buffer.duration < 1.9));
  await page.locator('[data-action="pause"]').click();
  await page.waitForFunction(() => window.audioProbe.contexts[0].state === 'suspended');
  const frozen = await page.evaluate(() => window.audioProbe.contexts[0].currentTime);
  await page.waitForTimeout(150);
  assert.equal(await page.evaluate(() => window.audioProbe.contexts[0].currentTime), frozen, 'pause preserves the playback position');
  await page.locator('[data-action="resume"]').click();
  await page.waitForFunction(() => window.audioProbe.contexts[0].state === 'running');
  assert.equal(await page.evaluate(() => window.audioProbe.contexts.length), 1);
  assert.equal(await page.evaluate(() => window.audioProbe.sources.filter(source => source.loop).length), 1);
  assert.deepEqual(errors, []);
  assert.deepEqual(external, [], 'audio and gameplay remain fully offline');
  console.log('PASS: real MP3 decoding, strict gesture policy, quiet single loop, door cue, controls and pause/resume via file:// with network OFF.');
} finally { await browser.close(); }
