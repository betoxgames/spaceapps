import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1600, height: 900 }, hasTouch: true });
const page = await context.newPage();
const errors = [];
page.on('pageerror', error => errors.push(error.message));
try {
  const origin = new URL(process.env.PREVIEW_URL || 'http://127.0.0.1:4173').origin;
  await page.route('**/desk-accessibility-fixture', route => route.fulfill({ contentType: 'text/html', body: '<!doctype html><style>body{margin:0} .stamp-ghost{pointer-events:none}</style><body></body>' }));
  await page.goto(`${origin}/desk-accessibility-fixture`);
  await page.evaluate(async () => {
    document.body.innerHTML = `<div id="test-desk" style="position:relative;width:1600px;height:900px;transform-origin:top left">
      <button data-stamp-tool="approve" style="position:absolute;left:30px;top:700px;width:140px;height:50px;touch-action:none">Approve</button>
      <button data-stamp-tool="return" style="position:absolute;left:200px;top:700px;width:140px;height:50px;touch-action:none">Return</button>
    </div>`;
    const { Desk } = await import('/src/desk.ts');
    window.announcements = [];window.stamps = [];window.paperChanges = 0;window.escapeBubbled = 0;
    const stage = document.querySelector('#test-desk');
    window.testDesk = new Desk(stage, {
      announce: message => window.announcements.push(message),
      onPaper: () => window.paperChanges++, onSelect: () => {},
      canStamp: (_, id) => id === 'flight',
      onStamp: (...args) => window.stamps.push(args),
    });
    for (const [id, kind, x, y, stored] of [['flight', 'paper', 1100, 200, true], ['manual', 'book', 100, 100, false]]) {
      const el = document.createElement('article');el.setAttribute('aria-label', id === 'flight' ? 'Flight plan' : 'Mission manual');
      el.style.cssText = 'position:absolute;left:0;top:0;transform-origin:top left;background:#ddd;touch-action:none';
      stage.append(el);window.testDesk.register({ id, el, kind, x, y, width: 300, height: 300, stored, tray: { x: 1100, y: 200 } });
    }
    document.addEventListener('keydown', e => { if (e.key === 'Escape') window.escapeBubbled++; });
  });
  const state = () => page.evaluate(() => { const { x, y, stored } = window.testDesk.items.get('flight');return { x, y, stored }; });
  const paper = page.locator('[data-desk-id="flight"]');
  assert.match(await paper.getAttribute('aria-description'), /In the document tray/);
  await page.evaluate(() => window.testDesk.focus('flight'));
  assert.deepEqual(await state(), { x: 810, y: 360, stored: false }, 'recovery reveals the full document');
  assert.equal(await page.evaluate(() => window.paperChanges), 1, 'recovery advances tutorial callbacks');
  assert.equal(await paper.evaluate(el => document.activeElement === el), true);

  await page.keyboard.press('Enter');await page.keyboard.press('ArrowLeft');await page.keyboard.press('Shift+ArrowUp');
  assert.deepEqual(await state(), { x: 800, y: 320, stored: false });
  await page.keyboard.press('Escape');
  assert.deepEqual(await state(), { x: 810, y: 360, stored: false }, 'Escape restores position');
  assert.equal(await page.evaluate(() => window.escapeBubbled), 0, 'cancelled gesture does not also pause');
  await page.keyboard.press('Escape');assert.equal(await page.evaluate(() => window.escapeBubbled), 1, 'idle Escape remains available to pause');
  await page.keyboard.press('Enter');await page.keyboard.press('ArrowRight');await page.keyboard.press('Enter');
  assert.deepEqual(await state(), { x: 820, y: 360, stored: false }, 'Enter places the moved sheet');

  await page.evaluate(() => { window.testDesk.selectStamp('approve');window.testDesk.focus('flight'); });
  assert.equal(await page.locator('[data-stamp-tool="approve"]').getAttribute('aria-pressed'), 'true');
  assert.equal(await page.locator('[data-stamp-tool="return"]').getAttribute('aria-pressed'), 'false');
  assert.equal(await paper.evaluate(el => el.classList.contains('stamp-ready')), true);
  assert.equal(await paper.evaluate(el => el.classList.contains('stamp-target')), true);
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('[data-stamp-tool="approve"]').getAttribute('aria-pressed'), 'false');
  assert.equal(await paper.evaluate(el => el.classList.contains('stamp-ready')), false);
  assert.deepEqual(await page.evaluate(() => window.stamps), [], 'cancelling consumes no decision');

  await page.evaluate(() => { window.testDesk.moveTo('flight', 700, 300);window.testDesk.clickPlacement = true; });
  await page.touchscreen.tap(720, 320);await page.touchscreen.tap(950, 500);
  assert.deepEqual(await state(), { x: 800, y: 465, stored: false }, 'two-tap placement works on touch');
  await page.touchscreen.tap(50, 720);await page.touchscreen.tap(820, 485);
  assert.deepEqual(await page.evaluate(() => window.stamps), [['approve', 'flight']], 'touch stamp commits exactly once');

  await page.evaluate(() => { window.testDesk.clickPlacement = false;document.querySelector('#test-desk').style.transform = 'scale(.5)'; });
  await page.mouse.move(410, 242.5);await page.mouse.down();await page.mouse.move(310, 192.5);await page.mouse.up();
  assert.deepEqual(await state(), { x: 600, y: 365, stored: false }, 'dragging converts screen coordinates at reduced scale');
  await page.mouse.move(310, 192.5);await page.mouse.down();await page.mouse.move(360, 212.5);
  await page.evaluate(() => { const pointerId = window.testDesk.gesture.pointer;document.querySelector('#test-desk').dispatchEvent(new PointerEvent('pointercancel', { pointerId })); });
  await page.mouse.up();
  assert.deepEqual(await state(), { x: 600, y: 365, stored: false }, 'cancelled pointer gesture restores original coordinates');
  await page.evaluate(() => window.testDesk.setPinned('manual', true));
  await page.locator('[data-desk-id="manual"]').focus();await page.keyboard.press('Enter');
  assert.match(await page.evaluate(() => window.announcements.at(-1)), /pinned/);
  assert.deepEqual(errors, []);
  console.log('PASS: document recovery, keyboard placement, Escape cancellation, stamp states, touch placement and scaled dragging.');
} finally { await browser.close(); }
