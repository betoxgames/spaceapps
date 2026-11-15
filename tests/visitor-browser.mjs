import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import sharp from 'sharp';

const base = process.env.PREVIEW_URL || process.env.BASE_URL || 'http://127.0.0.1:4173/';
const ids = ['nico', 'adan', 'leo', 'max', 'saul', 'dante', 'victor', 'teo', 'ren'];
const entrance = ['opening', 'entering', 'closing', 'walking', 'settling', 'ready'];
const departure = ['reacting', 'leaving', 'exit-opening', 'exiting', 'exit-closing'];
const capturePhases = new Set(['entering', 'walking', 'ready', 'reacting', 'exiting']);
const sheets = new Map();
const errors = [];
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
const page = await context.newPage();
page.on('pageerror', error => errors.push(error.message));

const snapshot = (target = page) => target.evaluate(() => ({ ...window.__SPACE_PAPERS__.visitor(), z: Number(document.querySelector('.scene-visitor')?.style.zIndex) }));
const view = (target = page) => target.evaluate(() => window.__SPACE_PAPERS__.view());
const step = (ms = 50, target = page) => target.evaluate(ms => window.__SPACE_PAPERS__.advanceTime(ms), ms);
const unique = states => [...new Set(states.map(state => state.phase))];
const pose = state => Object.fromEntries(['phase', 'elapsed', 'x', 'y', 'scale', 'door', 'animation', 'visible', 'z'].map(key => [key, state[key]]));

async function load(target = page) {
  await target.goto(base);
  await target.waitForFunction(() => typeof window.__SPACE_PAPERS__?.manualTime === 'function');
  await target.evaluate(() => window.__SPACE_PAPERS__.manualTime());
}

async function engineer(id, kind = 'valid', target = page) {
  await target.evaluate(({ id, kind }) => {
    window.__SPACE_PAPERS__.scenario(kind);
    window.__SPACE_PAPERS__.engineer(id);
  }, { id, kind });
  await target.waitForFunction(() => document.querySelector('#visitor-portrait')?.dataset.viewerState !== 'loading');
  await target.waitForFunction(() => window.__SPACE_PAPERS__.visitor().phase !== 'loading');
}

async function camera(position, target = page) {
  await target.locator(`[data-action="camera-${position}"]`).first().click();
  assert.equal((await view(target)).camera, position);
}

async function capture(id, phase) {
  for (const position of ['room', 'desk']) {
    const before = await snapshot();
    const button = page.locator(`[data-action="camera-${position}"]`).first();
    if (await button.isEnabled()) await camera(position);
    else if ((await view()).camera !== position) continue;
    assert.deepEqual(pose(await snapshot()), pose(before), 'camera switching must not move the visitor or door');
    const png = await page.screenshot({ animations: 'disabled' });
    const label = Buffer.from(`<svg width="400" height="28"><rect width="400" height="28" fill="#102d36"/><text x="12" y="20" fill="white" font-size="16" font-family="sans-serif">${id} · ${phase} · ${position}</text></svg>`);
    const thumb = await sharp(png).resize(400, 225).extend({ top: 28, bottom: 0, left: 0, right: 0, background: '#102d36' }).composite([{ input: label, top: 0, left: 0 }]).png().toBuffer();
    const key = `${phase}-${position}`;
    if (!sheets.has(key)) sheets.set(key, []);
    sheets.get(key).push({ id, image: thumb });
  }
}

async function walkUntil(stop, { target = page, id, captures = false } = {}) {
  const states = [];
  const captured = new Set();
  for (let count = 0; count < 500; count++) {
    const state = await snapshot(target);
    states.push(state);
    assert.ok(Number.isFinite(state.x) && Number.isFinite(state.y) && Number.isFinite(state.scale), 'positions and scale must be finite');
    assert.ok(state.scale > 0, 'visitor scale must remain positive');
    const captureAfter = 200;
    if (captures && capturePhases.has(state.phase) && !captured.has(state.phase) && (state.elapsed >= captureAfter || state.phase === 'ready')) {
      captured.add(state.phase);
      await capture(id, state.phase);
    }
    if (captures && state.phase === 'entering' && state.elapsed >= 1950 && !captured.has('entering-end')) {
      captured.add('entering-end');
      await capture(id, 'entering-end');
    }
    if (stop(state, states)) return states;
    await step(50, target);
  }
  assert.fail(`visitor did not reach expected state: ${JSON.stringify(states.at(-1))}`);
}

async function stamp(kind, target = page) {
  await camera('desk', target);
  await target.locator(`[data-stamp-tool="${kind}"]`).click();
  await target.keyboard.press('1');
  await target.keyboard.press('Enter');
  assert.equal((await snapshot(target)).phase, 'reacting', 'a stamp starts the supplied reaction before the exit');
}

function verifyEntrance(states) {
  assert.deepEqual(unique(states), entrance, 'entrance phases run in physical order');
  const entering = states.filter(state => state.phase === 'entering');
  const walking = states.filter(state => state.phase === 'walking');
  assert.ok(entering.some(state => Math.hypot(state.x - entering[0].x, state.y - entering[0].y) > 10), 'crossing the doorway has visible displacement');
  assert.ok(walking.some(state => Math.hypot(state.x - walking[0].x, state.y - walking[0].y) > 10), 'walking to the desk has visible displacement');
  const beforeClosing = entering.at(-1), closing = states.find(state => state.phase === 'closing');
  assert.ok(entering.every(state => state.door === '0016'), 'the doorway remains open throughout crossing');
  assert.ok(entering.every(state => state.z === 4 && state.visible), 'the visitor appears in front of the fully open doorway throughout entry');
  assert.ok(Math.abs(entering[0].x - 245) < 10, 'the first sampled entry frame is at the apparent doorway centre');
  assert.ok(Math.abs(entering[0].y - 650) < 2, 'the first sampled entry frame has feet on the doorway floor');
  assert.ok(entering.at(-1).scale > entering[0].scale, 'approaching the desk gradually increases adult scale');
  assert.ok(states.filter(state => state.phase === 'opening').every(state => !state.visible), 'the visitor waits until the door is fully open');
  assert.ok(states.filter(state => state.phase === 'closing').every(state => state.x >= 530 && state.y >= 680), 'closure waits for the complete body to clear the threshold');
  assert.ok(Math.hypot(closing.x - beforeClosing.x, closing.y - beforeClosing.y) < 20, 'door closure cannot teleport the engineer');
  const ready = states.at(-1);
  assert.equal(ready.visible, true);
  assert.equal(ready.animation, 'idle');
  assert.equal(ready.z, 4, 'the visitor stands in front of the wall and behind the desk');
  assert.ok(ready.scale >= entering[0].scale, 'perspective does not shrink the visitor when approaching the desk');
}

try {
  await load();
  for (const id of ids) {
    await engineer(id);
    assert.equal(await page.locator('#visitor-portrait').getAttribute('data-viewer-state'), 'ready', `${id} loads its provided render`);
    const arrival = await walkUntil(state => state.phase === 'ready', { id, captures: true });
    verifyEntrance(arrival);
    const stock = await page.evaluate(() => window.__SPACE_PAPERS__.state().stock);
    await stamp('return');
    assert.equal((await snapshot()).animation, 'return', `${id} selects its return render`);
    const exit = await walkUntil((_state, states) => states.some(state => state.phase === 'exit-closing') && !departure.includes(_state.phase), { id, captures: true });
    assert.deepEqual(unique(exit).slice(0, departure.length), departure, `${id} reacts and leaves through the door before closing`);
    assert.ok(exit.filter(state => state.phase === 'exiting').every(state => state.z === 4), 'the exit returns to the same doorway staging');
    assert.deepEqual(await page.evaluate(() => window.__SPACE_PAPERS__.state().stock), stock, 'returning remains free');

    await engineer(id);
    await walkUntil(state => state.phase === 'ready');
    await stamp('approve');
    await step(300);
    assert.equal((await snapshot()).animation, 'approve', `${id} selects its approval render`);
    await capture(id, 'approve');
    const approvedExit = await walkUntil((_state, states) => states.some(state => state.phase === 'exit-closing') && !departure.includes(_state.phase));
    assert.deepEqual(unique(approvedExit).slice(0, departure.length), departure, `${id} approval also completes the physical exit`);
    assert.equal((await view()).phase, 'cinema', 'the mission consequence starts only after the doorway closes');
  }

  // A delayed collection callback must not collect the next proposal when one
  // long active frame completes the entire preceding reaction and departure.
  await engineer('nico', 'short');
  await walkUntil(state => state.phase === 'ready');
  await stamp('return');
  await step(6000);
  assert.equal((await view()).phase, 'desk');
  assert.equal(await page.locator('#flight.collecting,#life.collecting,#power.collecting').count(), 0, 'late collection touches only the departing papers');

  // Pausing must freeze the exact same active-time state, including the render.
  await engineer('nico');
  await walkUntil(state => state.phase === 'entering' && state.elapsed >= 300);
  await page.keyboard.press('Escape');
  assert.equal((await view()).paused, true);
  const paused = pose(await snapshot());
  const canvas = await page.locator('#visitor-portrait canvas').evaluate(canvas => canvas.toDataURL());
  await step(5000);
  await page.waitForTimeout(180);
  assert.deepEqual(pose(await snapshot()), paused);
  assert.equal(await page.locator('#visitor-portrait canvas').evaluate(canvas => canvas.toDataURL()), canvas);
  await page.locator('[data-action="resume"]').click();
  await step(100);
  assert.notDeepEqual(pose(await snapshot()), paused, 'resume advances from the same point');

  // Drive the real visibility listener; hidden time cannot be consumed on resume.
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  assert.equal((await view()).paused, true);
  const hidden = pose(await snapshot());
  await step(20000);
  assert.deepEqual(pose(await snapshot()), hidden);
  await page.evaluate(() => {
    delete document.hidden;
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await page.locator('[data-action="resume"]').click();
  await step(50);
  assert.notDeepEqual(pose(await snapshot()), hidden);

  // Approval acknowledges authorization, independently of the eventual mission result.
  const approvals = [];
  for (const kind of ['valid', 'short']) {
    await engineer('adan', kind);
    await walkUntil(state => state.phase === 'ready');
    await stamp('approve');
    await step(300);
    approvals.push({ animation: (await snapshot()).animation, speech: await page.locator('#speech').textContent(), image: await page.locator('#visitor-portrait canvas').evaluate(canvas => canvas.toDataURL()) });
    assert.equal(await page.locator('#cinema').isVisible(), false, 'the consequence waits for the reaction and physical exit');
  }
  assert.deepEqual(approvals[0], approvals[1], 'approval reactions must not leak a guaranteed success or failure');
  // A long active frame spanning the exit/cinema boundary must only give the
  // following scene its unused time, never count the physical exit twice.
  await walkUntil(state => state.phase === 'exit-closing');
  const boundary = await snapshot();
  await step(640 - boundary.elapsed + 120);
  assert.equal((await view()).phase, 'cinema');
  assert.equal((await view()).cinemaElapsed, 120, 'cinema receives only time after the completed doorway closure');


  const reducedContext = await browser.newContext({ viewport: { width: 1280, height: 720 }, reducedMotion: 'reduce' });
  const reduced = await reducedContext.newPage();
  reduced.on('pageerror', error => errors.push(error.message));
  await load(reduced);
  await engineer('ren', 'valid', reduced);
  const reducedArrival = await walkUntil(state => state.phase === 'ready', { target: reduced });
  assert.deepEqual(unique(reducedArrival), entrance, 'reduced motion preserves the same logical entrance');
  for (const phase of entrance) {
    const positions = new Set(reducedArrival.filter(state => state.phase === phase).map(state => `${state.x},${state.y},${state.scale}`));
    assert.ok(positions.size <= 2, `${phase}: reduced motion uses discrete poses instead of continuous movement`);
  }
  const still = await reduced.locator('#visitor-portrait canvas').evaluate(canvas => canvas.toDataURL());
  await step(350, reduced);
  assert.equal(await reduced.locator('#visitor-portrait canvas').evaluate(canvas => canvas.toDataURL()), still, 'reduced motion freezes the idle sprite');
  await stamp('return', reduced);
  const reactionStill = await reduced.locator('#visitor-portrait canvas').evaluate(canvas => canvas.toDataURL());
  assert.notEqual(reactionStill, still, 'reduced motion retains a meaningful pose from the supplied return clip');
  await step(350, reduced);
  assert.equal(await reduced.locator('#visitor-portrait canvas').evaluate(canvas => canvas.toDataURL()), reactionStill, 'the reduced-motion reaction remains stationary');
  const reducedExit = await walkUntil((_state, states) => states.some(state => state.phase === 'exit-closing') && !departure.includes(_state.phase), { target: reduced });
  assert.deepEqual(unique(reducedExit).slice(0, departure.length), departure);
  await reducedContext.close();

  // A delayed or unavailable atlas must not start an invisible crossing or hang a visit.
  const delayedContext = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const delayed = await delayedContext.newPage();
  delayed.on('pageerror', error => errors.push(error.message));
  let release;
  const gate = new Promise(resolve => { release = resolve; });
  await delayed.route('**/art/engineers/*.webp', async route => { await gate; await route.continue(); });
  await load(delayed);
  await delayed.locator('[data-action="new-shift"]').click();
  await delayed.waitForFunction(() => window.__SPACE_PAPERS__.visitor().phase === 'loading');
  await step(15000, delayed);
  assert.equal((await snapshot(delayed)).phase, 'loading', 'asset loading does not spend doorway time');
  release();
  await delayed.waitForFunction(() => document.querySelector('#visitor-portrait')?.dataset.viewerState === 'ready');
  await walkUntil(state => state.phase === 'ready', { target: delayed });
  await delayedContext.close();

  const failedContext = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const failed = await failedContext.newPage();
  failed.on('pageerror', error => errors.push(error.message));
  await failed.route('**/art/engineers/*.webp', route => route.abort());
  await load(failed);
  await failed.locator('[data-action="new-shift"]').click();
  await failed.waitForFunction(() => document.querySelector('#visitor-portrait')?.dataset.viewerState === 'fallback');
  await walkUntil(state => state.phase === 'ready', { target: failed });
  await failedContext.close();

  await mkdir('test-results/visitors', { recursive: true });
  for (const [name, images] of sheets) {
    const width = 1200, height = Math.ceil(images.length / 3) * 253;
    await sharp({ create: { width, height, channels: 4, background: '#102d36' } }).composite(images.map(({ image }, index) => ({ input: image, left: index % 3 * 400, top: Math.floor(index / 3) * 253 }))).png().toFile(`test-results/visitors/${name}.png`);
  }
  await writeFile('test-results/visitors/coverage.json', JSON.stringify({ engineers: ids, entrance, departure, contactSheets: [...sheets.keys()], checks: ['pause', 'visibilitychange', 'camera', 'reduced motion', 'delayed assets', 'missing assets', 'approval outcome neutrality', 'free returns'] }, null, 2));
  assert.deepEqual(errors, []);
  console.log('PASS: all nine visitors appear in front of the open doorway, reach the desk, react and leave; pause, hidden time, cameras, reduced motion, asset delays/failure and outcome-neutral approvals. Contact sheets: test-results/visitors/.');
} finally {
  await browser.close();
}
