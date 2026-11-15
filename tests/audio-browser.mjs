import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const base = process.env.PREVIEW_URL || process.env.BASE_URL || 'http://127.0.0.1:4173/dev.html';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
await page.addInitScript(() => {
  const log = window.audioTest = { contexts: [], starts: [], stops: [], gains: [] };
  const originalFetch = window.fetch;
  window.fetch = (url, ...args) => {
    const name = String(url).match(/audio\/(stamp|door|ambient-music)\.mp3/);
    if (!name) return originalFetch(url, ...args);
    return Promise.resolve({ ok: true, arrayBuffer: async () => new TextEncoder().encode(name[1]).buffer });
  };
  class Gain {
    constructor() { this.gain = { setValueAtTime: value => { this.value = value; log.gains.push(value); }, linearRampToValueAtTime() {}, exponentialRampToValueAtTime() {} }; }
    connect() {} disconnect() {}
  }
  class Source {
    constructor(ctx) { this.ctx = ctx; }
    connect() {} disconnect() {}
    start() { log.starts.push({ name: this.buffer?.name, loop: !!this.loop }); }
    stop() { log.stops.push(this.buffer?.name); this.onended?.(); }
  }
  window.AudioContext = class {
    constructor() { this.state = 'suspended'; this.destination = {}; this.currentTime = 0; log.contexts.push(this); }
    createGain() { return new Gain(); }
    createBufferSource() { return new Source(this); }
    createOscillator() { const source = new Source(this); source.frequency = { setValueAtTime() {} }; return source; }
    decodeAudioData(bytes) { return Promise.resolve({ name: new TextDecoder().decode(bytes) }); }
    resume() { this.state = 'running'; return Promise.resolve(); }
    suspend() { this.state = 'suspended'; return Promise.resolve(); }
  };
});
try {
  await page.goto(base);
  await page.waitForFunction(() => typeof window.__SPACE_PAPERS__?.manualTime === 'function');
  await page.evaluate(() => window.__SPACE_PAPERS__.manualTime());
  assert.equal(await page.evaluate(() => window.audioTest.contexts.length), 0, 'audio must wait for a user gesture');
  await page.locator('[data-action="options"]').click();
  await page.waitForFunction(() => window.audioTest.starts.some(item => item.name === 'ambient-music'));
  assert.equal(await page.evaluate(() => window.audioTest.starts.filter(item => item.name === 'ambient-music' && item.loop).length), 1);
  await page.locator('#music-volume').fill('25');
  assert.equal(await page.locator('#music-volume-value').textContent(), '25%');
  assert.ok((await page.evaluate(() => window.audioTest.gains)).some(value => Math.abs(value - .09) < .0001), 'music volume controls the music gain');
  await page.locator('#muted').check();
  assert.equal((await page.evaluate(() => window.audioTest.gains)).at(-1), 0, 'mute controls master gain');
  await page.locator('#muted').uncheck();
  await page.locator('[data-action="settings-done"]').click();
  await page.locator('[data-action="new-shift"]').click();
  await page.waitForFunction(() => window.audioTest.starts.some(item => item.name === 'door'));
  await page.evaluate(() => window.__SPACE_PAPERS__.advanceTime(3000));
  assert.equal(await page.evaluate(() => window.audioTest.starts.filter(item => item.name === 'door').length), 2, 'door opens and closes with the visitor');
  assert.equal(await page.evaluate(() => window.audioTest.stops.filter(name => name === 'door').length), 1, 'a rapid door transition replaces the previous sound');
  await page.locator('[data-action="pause"]').click();
  assert.equal(await page.evaluate(() => window.audioTest.contexts[0].state), 'suspended');
  await page.locator('[data-action="resume"]').click();
  assert.equal(await page.evaluate(() => window.audioTest.contexts[0].state), 'running');
  await page.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, value: true }); document.dispatchEvent(new Event('visibilitychange')); });
  assert.equal(await page.evaluate(() => window.audioTest.contexts[0].state), 'suspended', 'hidden page suspends sound');
  await page.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, value: false }); document.dispatchEvent(new Event('visibilitychange')); });
  assert.equal(await page.evaluate(() => window.audioTest.contexts[0].state), 'suspended', 'returning to a paused game stays silent');
  await page.locator('[data-action="resume"]').click();
  assert.equal(await page.evaluate(() => window.audioTest.contexts.length), 1);
  assert.equal(await page.evaluate(() => window.audioTest.starts.filter(item => item.name === 'ambient-music').length), 1, 'interactions and resume must not duplicate music');
  assert.deepEqual(errors, []);
  console.log('Audio: gesture unlock, local cues, loop, volume, mute and pause passed.');
} finally { await browser.close(); }
