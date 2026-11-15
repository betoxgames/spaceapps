import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const base = process.env.PREVIEW_URL || 'http://127.0.0.1:4173';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const errors = [];
page.on('pageerror', error => errors.push(error.message));

await page.addInitScript(() => {
  const log = window.cinemaAudio = { contexts: [], starts: [], stops: [], gains: [] };
  const originalFetch = window.fetch;
  window.fetch = (url, ...args) => {
    const match = String(url).match(/assets\/audio\/(ship-engine|stamp|door|ambient-music)\.mp3/);
    if (!match) return originalFetch(url, ...args);
    return Promise.resolve({ ok: true, arrayBuffer: async () => new TextEncoder().encode(match[1]).buffer });
  };
  class Gain {
    constructor() {
      this.values = [];
      this.gain = {
        setValueAtTime: value => { this.values.push(value); },
        linearRampToValueAtTime: value => { this.values.push(value); },
        exponentialRampToValueAtTime: value => { this.values.push(value); },
      };
    }
    connect() {}
    disconnect() {}
  }
  class Source {
    constructor() { this.playbackRate = { value: 1 }; }
    connect(target) {
      if (target && this.buffer) log.gains.push(...(target.values ?? []).map(value => ({ name: this.buffer.name, value })));
    }
    disconnect() {}
    start(...args) { log.starts.push({ name: this.buffer?.name, loop: !!this.loop, args }); }
    stop() { log.stops.push(this.buffer?.name); this.onended?.(); }
  }
  window.AudioContext = class {
    constructor() { this.state = 'suspended'; this.destination = {}; this.currentTime = 0; log.contexts.push(this); }
    createGain() { return new Gain(); }
    createBufferSource() { return new Source(); }
    createOscillator() { const source = new Source(); source.frequency = { setValueAtTime() {} }; return source; }
    decodeAudioData(bytes) {
      const name = new TextDecoder().decode(bytes);
      return Promise.resolve({ name, duration: name === 'ship-engine' ? 6.07 : 2 });
    }
    resume() { this.state = 'running'; return Promise.resolve(); }
    suspend() { this.state = 'suspended'; return Promise.resolve(); }
  };
});

const click = action => page.locator(`[data-action="${action}"]`).first().click();
const step = ms => page.evaluate(ms => window.__SPACE_PAPERS__.advanceTime(ms), ms);
const state = () => page.evaluate(() => window.__SPACE_PAPERS__.view());
const currentImages = () => page.locator('.projection-view .cinema-ship-image');
const imageStates = async () => currentImages().evaluateAll(images => images.map(image => ({
  ship: image.dataset.ship,
  powered: image.dataset.powered,
  frame: Number(image.dataset.frame),
  src: new URL(image.src).pathname,
  loaded: image.complete && image.naturalWidth > 0,
})));

async function startValidMission() {
  await page.evaluate(() => { window.__SPACE_PAPERS__.manualTime(); window.__SPACE_PAPERS__.scenario('valid'); });
  if (await page.locator('#dispatch').isVisible()) await click('open-dispatch');
  await page.waitForSelector('#visitor-portrait[data-viewer-state="ready"]', { state: 'attached' });
  await step(10000);
  await page.getByRole('button', { name: /Inspect desk/ }).click();
  await page.locator('[data-stamp-tool="approve"]').click();
  await page.keyboard.press('1');
  await page.keyboard.press('Enter');
  await step(1500);
  await page.waitForSelector('#cinema:not([hidden])');
}

try {
  await page.goto(base);
  await page.waitForFunction(() => typeof window.__SPACE_PAPERS__?.manualTime === 'function');
  await startValidMission();

  const expected = [
    { label: 'Preparing the lunar module', images: [['module', 'false']] },
    { label: 'Ascending from the Moon', images: [['module', 'true']] },
    { label: 'Transfer to the orbital transport', images: [['transport', 'false'], ['module', 'false']] },
    { label: 'Outbound to Earth', images: [['transport', 'true']] },
    { label: 'Local module operations on Earth', images: [['module', 'false']] },
    { label: 'Returning to the Moon', images: [['transport', 'true']] },
    { label: 'Lunar module descent', images: [['module', 'true']] },
    { label: 'Touchdown on the Moon', images: [['module', 'false']] },
  ];
  for (let index = 0; index < expected.length; index++) {
    assert.equal(await page.locator('.cine-caption h2').innerText(), expected[index].label, `beat ${index + 1} label`);
    await page.waitForFunction(() => Array.from(document.querySelectorAll('.projection-view .cinema-ship-image')).every(image => image.complete && image.naturalWidth > 0));
    const images = await imageStates();
    assert.deepEqual(images.map(({ ship, powered }) => [ship, powered]), expected[index].images, `beat ${index + 1} ship art`);
    assert.ok(images.every(image => image.loaded), `beat ${index + 1} uses loaded ship image assets`);
    assert.ok(images.every(image => image.src.endsWith(`/${image.ship}-${String(image.frame).padStart(4, '0')}.webp`)), `beat ${index + 1} frame URL matches its image`);

    if (index === 0) {
      await step(1800);
      const powered = page.locator('.projection-view .cinema-ship-image[data-powered="true"]');
      await step(300);
      const progressed = Number(await powered.getAttribute('data-frame'));
      assert.ok(progressed > 1, 'ignition frame advances with cinematic time');
      await page.locator('#cinema [data-action="pause"]').click();
      const frozen = await powered.getAttribute('data-frame');
      await step(1200);
      assert.equal(await powered.getAttribute('data-frame'), frozen, 'ignition frame freezes while paused');
      assert.equal(await page.evaluate(() => window.cinemaAudio.contexts[0].state), 'suspended', 'pause suspends engine audio');
      assert.equal(await page.evaluate(() => window.cinemaAudio.stops.filter(name => name === 'ship-engine').length), 0, 'pause keeps the engine source alive for position-preserving resume');
      await click('resume');
      await page.locator('#cinema [data-action="speed"]').click();
      assert.equal(await powered.getAttribute('data-frame'), frozen, 'speed change preserves the current ignition frame');
      await step(75);
      assert.ok(Number(await powered.getAttribute('data-frame')) > Number(frozen), 'ignition resumes from the same frame at the new speed');
      continue;
    }
    if (index < expected.length - 1) await step(index === 1 ? 375 : 450); // ×4 carries the sequence forward at 4× speed.
  }

  const engineStarts = await page.evaluate(() => window.cinemaAudio.starts.filter(source => source.name === 'ship-engine'));
  assert.ok(engineStarts.length >= 1, 'a powered ship beat starts the local engine recording');
  assert.ok(engineStarts.every(source => source.loop), 'engine recording loops as a continuous phase sound');
  const engineGain = await page.evaluate(() => window.cinemaAudio.gains.filter(gain => gain.name === 'ship-engine').map(gain => gain.value));
  assert.ok(engineGain.some(value => Math.abs(value - .16) < .0001 || Math.abs(value - .12) < .0001), 'engine has a quiet ship-specific gain');

  await page.locator('#cinema [data-action="skip"]').click();
  assert.equal(await page.locator('.projection-view.revealed').count(), 1, 'skip reveals the outcome before filing the report');
  await page.locator('#cinema [data-action="skip"]').click();
  await page.waitForFunction(() => window.__SPACE_PAPERS__.view().phase === 'report');
  assert.ok(await page.evaluate(() => window.cinemaAudio.stops.filter(name => name === 'ship-engine').length) >= 1, 'outcome stops the looping engine');
  assert.equal(await page.locator('#cinema').isVisible(), false, 'report closes the projection');

  const failure = await page.evaluate(async () => {
    const { makeSteps, cinemaMarkup } = await import('/src/scenes/cinema.ts');
    const resolution = structuredClone(window.__SPACE_PAPERS__.view().pending);
    resolution.success = false;
    resolution.stage = 'launch';
    const campaign = window.__SPACE_PAPERS__.state();
    const steps = makeSteps(resolution);
    const markup = cinemaMarkup({ steps, index: 0, elapsed: 0, speed: 1, revealed: true }, resolution, campaign);
    const holder = document.createElement('div'); holder.innerHTML = markup;
    return { mark: holder.querySelector('.consequence-mark')?.className, positive: holder.querySelector('.consequence-mark.positive') !== null };
  });
  assert.match(failure.mark, /negative/, 'failed mission uses the failure mark');
  assert.equal(failure.positive, false, 'failed mission never shows a success mark');

  const reduced = await page.evaluate(async () => {
    const { updateCinemaFrame } = await import('/src/scenes/cinema.ts');
    const root = document.createElement('div');
    root.innerHTML = '<img class="cinema-ship-image" data-ship="module" data-powered="true" data-frame="1" src="/assets/images/ships/module-0001.webp">';
    updateCinemaFrame(root, { steps: [], index: 0, elapsed: 1500, speed: 1, revealed: false }, true);
    return root.querySelector('img').dataset.frame;
  });
  assert.equal(reduced, '1', 'reduced motion keeps the engine frame static');
  assert.deepEqual(errors, []);
  console.log('PASS: all eight ship beats, transfer pair, real image frames, pause/speed ignition sync, quiet looping engine, skip cleanup, reduced motion and failure consequence.');
} finally {
  await browser.close();
}
