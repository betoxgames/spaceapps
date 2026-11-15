import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const errors = [];
const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
page.on('pageerror', error => errors.push(error.message));
const view = () => page.evaluate(() => window.__SPACE_PAPERS__.view());
const state = () => page.evaluate(() => window.__SPACE_PAPERS__.state());
const step = ms => page.evaluate(ms => window.__SPACE_PAPERS__.advanceTime(ms), ms);
const scenario = kind => page.evaluate(kind => { window.__SPACE_PAPERS__.manualTime();window.__SPACE_PAPERS__.scenario(kind); }, kind);
const open = () => page.locator('[data-action="open-dispatch"]').click();
try {
  await page.goto(process.env.PREVIEW_URL || 'http://127.0.0.1:4173');
  await scenario('emergency:E02');
  const before = await state();
  assert.equal(await page.locator('#dispatch').getAttribute('data-kind'), 'emergency');
  assert.match(await page.locator('#dispatch').innerText(), /SURVIVAL ALERT/);
  assert.equal(await page.locator('#emergency').isVisible(), false, 'response waits for its introduction');
  assert.equal(await page.locator('#stage').evaluate(el => el.inert), true);
  for (let i = 0; i < 5; i++) {
    await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(() => document.activeElement.closest('#dispatch') !== null), true, 'Tab stays inside the incoming message');
  }
  await step(1200);assert.equal((await view()).remaining, 30000);
  await page.screenshot({ path: 'test-results/dispatch-survival-arrival.png', animations: 'disabled' });
  await page.keyboard.press('Escape');const paused = (await view()).dispatch;
  await step(10000);assert.deepEqual((await view()).dispatch, paused, 'pause freezes delivery');
  await page.locator('[data-action="resume"]').click();
  await step(2000);
  assert.equal((await view()).dispatch, null);
  assert.equal((await view()).remaining, 30000, 'delivery consumes none of the response window');
  assert.equal(await page.locator('#emergency').isVisible(), true);
  assert.equal(await page.locator('#emergency').evaluate(el => document.activeElement === el), true, 'focus follows the delivered document');
  await step(650);assert.equal((await view()).remaining, 30000, 'document animation also preserves the full response window');
  await step(1000);assert.equal((await view()).remaining, 29000);
  assert.deepEqual(await state(), before, 'introductions and reading do not spend resources');
  await page.screenshot({ path: 'test-results/dispatch-survival-panel.png' });

  // Confirmation sends exactly one response, animates out, then shows neutral stages.
  await page.locator('#contribution').fill('100');
  await page.locator('[data-action="confirm-emergency"]').evaluate(el => { el.click();el.click(); });
  assert.equal((await state()).history.length, 1);
  assert.equal(await page.locator('#emergency').evaluate(el => el.classList.contains('dispatch-sent')), true);
  await page.keyboard.press('Escape');await step(5000);
  assert.equal((await view()).phase, 'emergency', 'pause also freezes the outgoing handoff');
  await page.locator('[data-action="resume"]').click();await step(480);
  assert.equal((await view()).phase, 'cinema');
  assert.match(await page.locator('.cine-caption h2').innerText(), /Response transmitted/);
  assert.equal(await page.locator('.cine-sequence i').count(), 3);
  assert.equal(await page.locator('.consequence-mark').count(), 0, 'handoff does not reveal the result');

  // A large frame advances only the portion after delivery and landing.
  await scenario('emergency:E03');await step(4850);
  assert.equal((await view()).remaining, 29000);
  await page.keyboard.press('Escape');const remaining = (await view()).remaining;
  await step(100000);assert.equal((await view()).remaining, remaining);
  await page.locator('[data-action="resume"]').click();await step(remaining);
  assert.equal((await state()).history.length, 1, 'timeout creates one response');
  assert.equal((await state()).terminal, 'emergency');

  // Every survival panel and both options of every base order fit their paper.
  for (const id of ['E01','E02','E03','E04','E05','E06','E07','E08']) {
    await scenario(`emergency:${id}`);await open();
    const fit = await page.locator('.emergency-body').evaluate(el => el.scrollHeight <= el.clientHeight + 2);
    assert.ok(fit, `${id} response content fits`);
  }
  for (const id of ['B01','B02','B03']) {
    await scenario(`operation:${id}`);const initial = await state();
    assert.match(await page.locator('#dispatch').innerText(), /BASE OPERATIONS/);
    await open();
    assert.equal((await view()).remaining, 30000, 'base planning has no response countdown');
    await page.locator('[data-action="choice-A"]').click();
    assert.match(await page.locator('.order-choice.chosen .choice-state').innerText(), /Selected/);
    assert.deepEqual((await state()).stock, initial.stock);
    assert.ok(await page.locator('#order').evaluate(el => el.scrollHeight <= el.clientHeight + 2), `${id} order fits`);
    if (id === 'B02') {
      await step(650);assert.match(await page.locator('#message-status').innerText(), /Consulting/);
      await step(2599);assert.match(await page.locator('#message-status').innerText(), /Consulting/);
      await step(1);assert.match(await page.locator('#message-status').innerText(), /Earth received/);
    }
    await page.screenshot({ path: `test-results/dispatch-${id}-panel.png` });
  }
  await page.waitForSelector('#visitor-portrait[data-viewer-state="ready"]', { state: 'attached' });await step(10000);
  await page.locator('[data-stamp-tool="approve"]').click();await page.locator('#order').focus();await page.keyboard.press('Enter');
  await step(1500);assert.equal((await view()).phase, 'cinema');
  assert.match(await page.locator('.cine-caption h2').innerText(), /Preparing the selected plan/);

  // Resetting during delivery cannot reopen a stale incident later.
  await scenario('emergency:E02');await scenario('valid');await step(10000);
  assert.equal((await view()).phase, 'desk');assert.equal((await view()).dispatch, null);
  assert.equal(await page.locator('#stage').evaluate(el => el.inert), false);
  assert.equal(await page.locator('#emergency').count(), 0);

  // Incoming messages remain readable at native size, including reduced motion.
  for (const viewport of [{ width: 360, height: 740 },{ width: 390, height: 844 },{ width: 960, height: 540 },{ width: 1280, height: 720 }]) {
    const compact = await browser.newPage({ viewport, reducedMotion: 'reduce' });
    compact.on('pageerror', error => errors.push(error.message));
    await compact.goto(process.env.PREVIEW_URL || 'http://127.0.0.1:4173');
    for (const kind of ['emergency:E03','operation:B02']) {
      await compact.evaluate(kind => { window.__SPACE_PAPERS__.manualTime();window.__SPACE_PAPERS__.scenario(kind); }, kind);
      const card = await compact.locator('.dispatch-card').boundingBox();
      assert.ok(card.x >= 0 && card.y >= 0 && card.x + card.width <= viewport.width + 1 && card.y + card.height <= viewport.height + 1, `${kind} fits ${viewport.width}×${viewport.height}`);
      assert.equal(await compact.locator('.dispatch-card').evaluate(el => getComputedStyle(el).animationName), 'none');
      assert.equal(await compact.locator('#small-screen').isVisible(), false, 'scroll hint does not cover the transmission');
      await compact.screenshot({ path: `test-results/dispatch-${kind.split(':')[0]}-${viewport.width}.png` });
      await compact.locator('[data-action="open-dispatch"]').click();
      assert.equal(await compact.locator('#dispatch').isVisible(), false);
    }
    await compact.close();
  }
  assert.deepEqual(errors, []);
  console.log('PASS: distinct animated dispatches, all incident/order layouts, full response time, pause, focus, reset, single confirmation, delayed outcome and four responsive sizes with reduced motion.');
} finally { await browser.close(); }
