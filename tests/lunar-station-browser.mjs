import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const errors = [];
const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
page.on('pageerror', error => errors.push(error.message));
const step = ms => page.evaluate(ms => window.__SPACE_PAPERS__.advanceTime(ms), ms);
const click = action => page.locator(`[data-action="${action}"]`).first().click();
const scenario = id => page.evaluate(id => {
  window.__SPACE_PAPERS__.manualTime();window.__SPACE_PAPERS__.scenario(id);
}, id);
async function light(context, expected) {
  const station = page.locator(`${context} .lunar-station`);
  assert.equal(await station.getAttribute('data-light'), expected);
  await station.locator('img').evaluate(image => image.decode());
  assert.equal(await station.locator('img').evaluate(image => image.naturalWidth), 1920);
}
async function respond(id, amount) {
  await scenario(`emergency:${id}`);
  await light('#dispatch', id === 'E08' ? 'off' : 'red');
  await click('open-dispatch');
  await page.locator('#contribution').fill(amount);
  await click('confirm-emergency');await step(480);
  await light('#cinema', id === 'E08' ? 'off' : 'red');
}
try {
  await mkdir('test-results', { recursive: true });
  await page.goto(process.env.PREVIEW_URL || 'http://127.0.0.1:4173');
  for (const id of ['E01','E02','E03','E04','E05','E06','E07','E08']) {
    await respond(id, '100');
    const before = await page.evaluate(() => window.__SPACE_PAPERS__.view().cinemaElapsed);
    await page.keyboard.press('Escape');await step(10000);
    assert.equal(await page.evaluate(() => window.__SPACE_PAPERS__.view().cinemaElapsed), before, 'pause freezes station sequence');
    await click('resume');await step(1800);await light('#cinema', 'amber');
    assert.equal(await page.locator('.consequence-mark').count(), 0);
    await click('speed');await step(450);await light('#cinema', 'amber');
    assert.equal(await page.locator('.consequence-mark').count(), 0, 'checking does not reveal recovery');
    await step(450);await light('#cinema', 'white');
    if (id === 'E02') await page.screenshot({ path: 'test-results/lunar-station-recovered.png' });
    await click('skip');await light('#modal-layer', 'white');

    await respond(id, '0');
    await step(1800);await light('#cinema', 'amber');
    await step(1800);await light('#cinema', 'amber');
    await click('skip');await light('#cinema', 'off');
    assert.equal(await page.locator('.consequence-mark.negative').count(), 1);
    await click('skip');await light('#modal-layer', 'off');
  }
  for (const id of ['B01','B02','B03']) {
    for (const choice of ['A','B']) {
      await scenario(`operation:${id}`);
      await light('#dispatch', 'white');
      await click('open-dispatch');
      await page.waitForSelector('#visitor-portrait[data-viewer-state="ready"]', { state: 'attached' });
      await step(10000);await click(`choice-${choice}`);
      await page.locator('[data-stamp-tool="approve"]').click();
      await page.locator('#order').focus();await page.keyboard.press('Enter');await step(1500);
      await light('#cinema', 'white');
      await step(1800);await light('#cinema', 'amber');
      await step(1800);await light('#cinema', 'amber');
      assert.equal(await page.locator('.consequence-mark').count(), 0);
      await click('skip');await light('#cinema', 'white');
      await click('skip');await light('#modal-layer', 'white');
      assert.equal(await page.locator('.debrief-emblem svg').count(), 0, 'operation report uses the new exterior');
      if(id==='B01' && choice==='B') await page.screenshot({ path: 'test-results/lunar-station-operation-report.png', animations: 'disabled' });
    }
  }
  // Real layouts at narrow and short sizes, with the operating-system motion setting.
  for (const viewport of [{ width: 390, height: 844 }, { width: 960, height: 540 }]) {
    const compact = await browser.newPage({ viewport, reducedMotion: 'reduce' });
    compact.on('pageerror', error => errors.push(error.message));
    await compact.goto(process.env.PREVIEW_URL || 'http://127.0.0.1:4173');
    await compact.evaluate(() => { window.__SPACE_PAPERS__.manualTime();window.__SPACE_PAPERS__.scenario('emergency:E02'); });
    const card = await compact.locator('.dispatch-card').boundingBox();
    assert.ok(card.y >= -1 && card.y + card.height <= viewport.height + 1, 'render does not push the response action outside the viewport');
    await compact.locator('.lunar-station-image').evaluate(image => image.decode());
    await compact.screenshot({ path: `test-results/lunar-station-alert-${viewport.width}.png` });
    await compact.locator('[data-action="open-dispatch"]').click();
    await compact.locator('#contribution').fill('100');await compact.locator('[data-action="confirm-emergency"]').click();
    await compact.evaluate(() => window.__SPACE_PAPERS__.advanceTime(120));
    assert.equal(await compact.locator('#cinema').evaluate(el => el.classList.contains('static')), true);
    await compact.evaluate(() => window.__SPACE_PAPERS__.advanceTime(800));
    assert.equal(await compact.locator('#cinema .lunar-station').getAttribute('data-light'), 'amber');
    assert.equal(await compact.locator('#cinema .lunar-station-image').evaluate(el => getComputedStyle(el).animationName), 'none');
    await compact.close();
  }
  assert.deepEqual(errors, []);
  console.log('PASS: eight station emergencies and all six base plans, success/failure reveal, phase lighting, pause, ×4 speed, responsive dispatch and reduced motion.');
} finally { await browser.close(); }
