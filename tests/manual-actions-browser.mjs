import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const errors = [];
const url = process.env.PREVIEW_URL || 'http://127.0.0.1:4173';
async function exercise(page, native) {
  const click = action => page.locator(`[data-action="${action}"]`).first().click();
  const view = () => page.evaluate(() => window.__SPACE_PAPERS__.view());
  await page.goto(url);
  await page.evaluate(() => { window.__SPACE_PAPERS__.manualTime();window.__SPACE_PAPERS__.scenario('valid'); });
  const before = await page.evaluate(() => window.__SPACE_PAPERS__.state());
  assert.equal(await page.locator('.ledger-tool,.log-tool,#ledger').count(), 0, 'no external stock book or turn-log tool exists');
  await page.keyboard.press('b');
  if (native) assert.equal(await page.locator('#manual-reader').isVisible(), true);

  await click('manual-flight');
  assert.equal((await view()).bookTab, 'flight');
  assert.match(await page.locator('.guide-flight-destination').innerText(), /Earth/);
  assert.match(await page.locator('.guide-flight-facts').innerText(), /4 crew members/);
  assert.equal(await page.locator('#flight').getAttribute('data-stored'), 'true', 'reading the plan does not add another object to the desk');
  await click('book-index');await click('manual-choose-route');
  assert.equal((await view()).bookDestination, null);
  assert.equal(await page.locator('.guide-planet-card:visible').count(), 8);
  await click('destination-mars');await click('book-index');await click('manual-choose-route');
  assert.equal((await view()).bookDestination, null, 'Find minimums opens the atlas instead of silently reusing an old reference');
  await click('book-index');await click('manual-compare');
  assert.equal((await view()).bookTab, 'compare');
  assert.equal(await page.locator('.guide-comparison-table tbody tr').count(), 5);
  assert.equal(await page.locator('[data-value="minimum"] strong').evaluateAll(es => es.every(el => el.textContent === '—')), true);
  await click('manual-compare-reference');await click('destination-earth');
  assert.equal((await view()).bookTab, 'compare', 'reference selection returns to comparison');
  for (const [resource, amount] of Object.entries(before.proposal.requested)) {
    assert.equal(await page.locator(`.guide-comparison-table tr[data-resource="${resource}"] [data-value="requested"] strong`).innerText(), (amount / 1000).toLocaleString('en-US'));
  }
  assert.equal(await page.locator('.guide-comparison-table tr[data-resource="food"] [data-value="minimum"] strong').innerText(), '11,500');
  assert.equal(await page.locator('.guide-comparison-table tr[data-resource="energy"] [data-value="minimum"] strong').innerText(), '1,100,000');
  assert.equal(await page.locator('.guide-content').evaluate(el => el.scrollWidth <= el.clientWidth + 1), true);
  await page.screenshot({ path: `test-results/manual-workflow-compare-${page.viewportSize().width}.png` });

  await click('book-index');await click('manual-stock');
  assert.equal((await view()).bookTab, 'supplies');
  assert.equal(await page.locator('.guide-inventory-table tbody tr').count(), 5);
  for (const [resource, amount] of Object.entries(before.stock)) {
    assert.equal(await page.locator(`.guide-inventory-table tr[data-resource="${resource}"] td strong`).innerText(), (amount / 1000).toLocaleString('en-US'));
  }
  if (native) assert.equal(await page.locator('#manual-reader').isVisible(), true, 'inventory stays in the same reading view');
  assert.equal(await page.locator('.guide-content').evaluate(el => el.scrollWidth <= el.clientWidth + 1), true);
  await page.screenshot({ path: `test-results/manual-workflow-inventory-${page.viewportSize().width}.png` });
  await click('manual-record');assert.equal(await page.locator('.guide-turn-record .empty-log').isVisible(), true);
  await page.keyboard.press('i');assert.equal(await page.locator('.guide-inventory-table').isVisible(), true);
  await page.keyboard.press('r');assert.equal(await page.locator('.guide-turn-record').isVisible(), true);
  assert.equal(await page.locator('.ledger-tool,.log-tool,#ledger').count(), 0, 'shortcuts navigate inside the manual');
  assert.deepEqual(await page.evaluate(() => window.__SPACE_PAPERS__.state()), before, 'all four steps are inspection only');

  await page.evaluate(() => window.__SPACE_PAPERS__.scenario('operation:B01'));
  await click('open-dispatch');await page.keyboard.press('b');await click('book-index');
  assert.equal(await page.locator('[data-action="manual-flight"]').isDisabled(), true);
  assert.equal(await page.locator('[data-action="manual-compare"]').isDisabled(), true);
  assert.match(await page.locator('.guide-review-steps').innerText(), /Available when a mission proposal arrives/);
  await click('manual-stock');assert.equal(await page.locator('.guide-inventory-table').isVisible(), true, 'inventory remains available for base orders');
  await click('close-manual');
  assert.equal(await page.evaluate(() => document.activeElement.dataset.action), 'manual');
}
try {
  for (const viewport of [{ width: 1600, height: 900 },{ width: 1280, height: 720 },{ width: 360, height: 740 },{ width: 390, height: 844 }]) {
    const page = await browser.newPage({ viewport, reducedMotion: 'reduce' });
    page.on('pageerror', error => errors.push(error.message));
    await exercise(page, viewport.width < 1000);
    await page.close();
  }

  // The four manual actions also complete the guided review without legacy books.
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, reducedMotion: 'reduce' });
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(url);
  await page.evaluate(() => { window.__SPACE_PAPERS__.manualTime();window.__SPACE_PAPERS__.training(1); });
  const click = action => page.locator(`[data-action="${action}"]`).first().click();
  await page.keyboard.press('b');await click('manual-flight');await click('book-index');
  await click('manual-choose-route');await click('destination-earth');await click('book-index');
  await click('manual-compare');await click('book-index');await click('manual-stock');
  assert.equal(await page.evaluate(() => window.__SPACE_PAPERS__.view().training.step), 5);
  assert.match(await page.locator('#training-guide').innerText(), /Take APPROVE/);

  // Pagination stays inside the guide and returns do not look like failed missions.
  await page.evaluate(() => window.__SPACE_PAPERS__.scenario('valid'));
  const initialStock = await page.evaluate(() => window.__SPACE_PAPERS__.state().stock);
  for (let i = 0; i < 5; i++) {
    await page.waitForSelector('#visitor-portrait[data-viewer-state="ready"]', { state: 'attached' });
    await page.evaluate(() => window.__SPACE_PAPERS__.advanceTime(10000));
    await page.keyboard.press('1');await page.locator('[data-stamp-tool="return"]').click();await page.keyboard.press('1');await page.keyboard.press('Enter');
    await page.evaluate(() => window.__SPACE_PAPERS__.advanceTime(6000));
    assert.equal(await page.evaluate(() => window.__SPACE_PAPERS__.view().phase), 'desk');
  }
  await page.keyboard.press('r');
  assert.equal(await page.locator('.guide-turn-record .record-returned').count(), 4);
  assert.equal(await page.locator('[data-action="manual-log-prev"]').isDisabled(), true);
  await click('manual-log-next');
  assert.equal(await page.locator('.guide-turn-record .record-returned').count(), 1);
  assert.equal(await page.locator('[data-action="manual-log-next"]').isDisabled(), true);
  assert.deepEqual(await page.evaluate(() => window.__SPACE_PAPERS__.state().stock), initialStock);
  assert.equal(await page.locator('#ledger,.ledger-tool,.log-tool').count(), 0);
  await page.close();
  assert.deepEqual(errors, []);
  console.log('PASS: all four manual steps, fresh atlas, both request sheets, inventory/log only inside manual, keyboard/native reading, no-proposal states, guided review and record pagination at four screen sizes.');
} finally { await browser.close(); }
