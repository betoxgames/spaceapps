import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const base = process.env.PREVIEW_URL || 'http://127.0.0.1:4173/';
const browser = await chromium.launch({ headless: true });
await mkdir('test-results', { recursive: true });
try {
  for (const width of [1600, 1280]) {
    const page = await browser.newPage({ viewport: { width, height: width * 900 / 1600 }, reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.addInitScript(() => {
      window.stampSounds = [];
      const original = AudioBufferSourceNode.prototype.start;
      AudioBufferSourceNode.prototype.start = function (...args) {
        if (this.buffer && !this.loop) {
          const sampleRate = this.buffer.sampleRate, start = Math.floor((args[1] || 0) * sampleRate);
          let attack = start;
          while (attack < this.buffer.length && Array.from({ length: this.buffer.numberOfChannels }, (_, channel) => Math.abs(this.buffer.getChannelData(channel)[attack])).every(value => value <= .03)) attack++;
          window.stampSounds.push({ duration: this.buffer.duration, args, rate: this.playbackRate.value, attackDelay: (attack - start) / sampleRate / this.playbackRate.value, inkVisible: !!document.querySelector('.ink-mark.visible') });
        }
        return original.apply(this, args);
      };
    });
    await page.goto(base);
    await page.waitForFunction(() => performance.getEntriesByType('resource').filter(entry => /assets\/images\/ui\/(approve|return)-(idle|held)\.webp/.test(entry.name)).length === 4);
    await page.locator('[data-action="new-shift"]').click();
    // Verify the real supplied MP3 decodes; match playback by its actual duration.
    const duration = await page.evaluate(async () => {
      const context = new AudioContext();
      const bytes = await (await fetch('/assets/audio/stamp.mp3')).arrayBuffer();
      const buffer = await context.decodeAudioData(bytes);
      await context.close();
      return buffer.duration;
    });
    assert.ok(duration > 0, 'the supplied recording decodes');
    const stampCount = () => page.evaluate(duration => window.stampSounds.filter(sound => Math.abs(sound.duration - duration) < .00001).length, duration);
    async function setup() {
      await page.evaluate(() => { window.__SPACE_PAPERS__.manualTime(); window.__SPACE_PAPERS__.scenario('valid'); });
      await page.waitForFunction(() => window.__SPACE_PAPERS__.visitor().phase !== 'loading');
      await page.evaluate(() => window.__SPACE_PAPERS__.advanceTime(10000));
      await page.waitForSelector('.scene-visitor[data-visitor-phase="ready"]');
      await page.locator('[data-action="camera-desk"]').first().click();
      await page.keyboard.press('1');
      await page.evaluate(() => { window.stampSounds = []; });
    }
    const state = () => page.evaluate(() => window.__SPACE_PAPERS__.state());
    const center = async locator => {
      const box = await locator.boundingBox();
      return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
    };
    await setup();
    await page.evaluate(async () => {
      for (const state of ['approve-idle', 'return-idle', 'approve-held', 'return-held']) {
        const image = new Image(); image.src = `/assets/images/ui/${state}.webp`; await image.decode();
        if (image.naturalWidth !== 300 || image.naturalHeight !== 360) throw Error(`Invalid ${state}`);
      }
    });
    for (const kind of ['approve', 'return']) {
      const tool = page.locator(`[data-stamp-tool="${kind}"]`);
      const art = tool.locator('.stamp-art');
      assert.match(await art.evaluate(el => getComputedStyle(el).backgroundImage), new RegExp(`${kind}-idle.webp`));
      const before = await state();
      await tool.click();
      assert.equal(await tool.getAttribute('aria-pressed'), 'true');
      assert.match(await art.evaluate(el => getComputedStyle(el).backgroundImage), new RegExp(`${kind}-held.webp`));
      assert.deepEqual(await state(), before, 'selection cannot change the campaign');
      await page.keyboard.press('Escape');
      assert.equal(await tool.getAttribute('aria-pressed'), 'false');
      assert.equal(await stampCount(), 0, 'selection and cancellation never play the impact');
    }
    await page.screenshot({ path: `test-results/stamps-idle-${width}.png` });

    // Drag onto two overlapping sheets: only the upper visible document receives ink.
    await page.keyboard.press('2');
    const before = await state();
    const start = await center(page.locator('[data-stamp-tool="approve"]'));
    const target = await center(page.locator('#life'));
    await page.mouse.move(start.x, start.y); await page.mouse.down();
    await page.mouse.move(target.x, target.y, { steps: 10 });
    assert.equal(await page.locator('.stamp-ghost').isVisible(), true);
    assert.equal(await page.locator('.stamp-ghost').evaluate(el => getComputedStyle(el).pointerEvents), 'none');
    assert.match(await page.locator('.stamp-ghost').evaluate(el => getComputedStyle(el, ':before').backgroundImage), /approve-held.webp/);
    assert.equal(await page.locator('#life').evaluate(el => el.classList.contains('stamp-target')), true);
    await page.screenshot({ path: `test-results/stamps-drag-${width}.png` });
    await page.mouse.up();
    assert.equal(await page.locator('#life .ink-mark.visible.approve').count(), 1);
    assert.equal(await page.locator('#flight .ink-mark.visible').count(), 0);
    assert.equal((await state()).approvals, before.approvals + 1, 'one drag makes exactly one decision');
    assert.equal(await stampCount(), 1, 'one accepted decision plays the actual recording once');
    const stampCue = await page.evaluate(duration => window.stampSounds.find(sound => Math.abs(sound.duration - duration) < .00001), duration);
    assert.equal(stampCue.inkVisible, true, 'the visible imprint exists when its impact sound starts');
    assert.deepEqual(stampCue.args.slice(1), [.535, .28], 'the recording starts at the impact and excludes the late noise');
    assert.ok(Math.abs(stampCue.rate - 1.15) < .0001, 'the impact tail fits the stamping gesture');
    assert.ok(stampCue.attackDelay <= .015, 'the decoded impact is audible within 15 ms of the visible imprint');

    await setup();
    const untouched = await state();
    const returnTool = page.locator('[data-stamp-tool="return"]');
    const emptyStart = await center(returnTool);
    await page.mouse.move(emptyStart.x, emptyStart.y); await page.mouse.down();
    await page.mouse.move(width * .3, width * .3, { steps: 8 }); await page.mouse.up();
    assert.deepEqual(await state(), untouched, 'dragging to empty desk cancels without a decision');
    assert.equal(await stampCount(), 0);

    await returnTool.click();
    await page.locator('#flight').click({ position: { x: 50, y: 60 } });
    assert.equal(await page.locator('#flight .ink-mark.visible.return').count(), 1, 'click stamp then sheet still works');
    assert.equal(await stampCount(), 1);
    assert.deepEqual((await state()).stock, untouched.stock, 'return spends no resources');

    await setup();
    const keyboardBefore = await state();
    await page.locator('[data-stamp-tool="approve"]').focus(); await page.keyboard.press('Enter');
    await page.keyboard.press('1'); await page.keyboard.press('Enter');
    assert.equal((await state()).approvals, keyboardBefore.approvals + 1, 'keyboard stamping still works');
    assert.equal(await stampCount(), 1);
    assert.deepEqual(errors, []);
    await page.close();
  }
  console.log('PASS: supplied stamp poses and MP3, scaled drag, topmost target, click, keyboard, cancellation and exactly one decision/sound.');
} finally { await browser.close(); }
