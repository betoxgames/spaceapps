import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, reducedMotion: 'reduce' });
const errors = [], fixtures = [];
page.on('pageerror', error => errors.push(error.message));
const click = action => page.locator(`[data-action="${action}"]`).first().click();
const step = ms => page.evaluate(ms => window.__SPACE_PAPERS__.advanceTime(ms), ms);
const state = () => page.evaluate(() => window.__SPACE_PAPERS__.state());
async function assertInViewport(locator, viewport, label) {
  const bounds = await locator.boundingBox();
  assert.ok(bounds && bounds.x >= -1 && bounds.y >= -1 && bounds.x + bounds.width <= viewport.width + 1 && bounds.y + bounds.height <= viewport.height + 1, `${label} fits ${viewport.width}×${viewport.height}`);
}
async function outcome(kind, choice = 'A', contribution = '100') {
  await page.evaluate(kind => { window.__SPACE_PAPERS__.manualTime();window.__SPACE_PAPERS__.scenario(kind); }, kind);
  if (await page.locator('#dispatch').isVisible()) await click('open-dispatch');
  await page.waitForSelector('#visitor-portrait[data-viewer-state="ready"]', { state: 'attached' });
  await step(10000);
  if (kind.startsWith('emergency')) {
    await page.locator('#contribution').fill(contribution);await click('confirm-emergency');await step(500);
  } else {
    if (kind.startsWith('operation')) await click(`choice-${choice}`);
    else await page.getByRole('button', { name: /Inspect desk/ }).click();
    await page.locator('[data-stamp-tool="approve"]').click();
    if (kind.startsWith('operation')) await page.locator('#order').focus();
    else await page.keyboard.press('1');
    await page.keyboard.press('Enter');await step(1500);
  }
  await page.waitForSelector('#cinema:not([hidden])');await click('skip');await click('skip');
  await page.waitForSelector('.mission-debrief');
}
try {
  await page.goto(process.env.PREVIEW_URL || 'http://127.0.0.1:4173');
  for (const [kind, choice, amount] of [['valid'],['short'],['stock'],['operation:B01','A'],['operation:B02','B'],['emergency:E02','A','100'],['emergency:E02','A','0']]) {
    await outcome(kind, choice, amount);
    const resolution = await page.evaluate(() => window.__SPACE_PAPERS__.view().pending);
    const before = await state();
    fixtures.push({ resolution, destination: kind.startsWith('operation') || kind.startsWith('emergency') ? '' : 'Earth' });
    assert.equal(await page.locator('.debrief-verdict').innerText().then(text => /COMPLETE|RESOLVED/.test(text)), resolution.success);
    assert.equal(await page.locator('.report-paper table').count(), 0, 'accounting stays in the Stock ledger');
    assert.match(await page.locator('.debrief-saved').innerText(), /Added to your turn log/);
    assert.equal(await page.locator('.debrief-body').evaluate(el => el.scrollWidth <= el.clientWidth + 1), true);
    assert.ok(await page.locator('.debrief-hero p').evaluate(el => parseFloat(getComputedStyle(el).fontSize) >= 18), 'desktop body text uses native reading size');
    await assertInViewport(page.locator('[data-action="archive"]'), { width: 1280, height: 720 }, 'Continue action');
    if (kind === 'valid') assert.equal(await page.locator('.debrief-body').evaluate(el => el.scrollHeight <= el.clientHeight + 2), true, 'standard mission summary fits without scrolling');
    await page.screenshot({ path: `test-results/report-${kind.replace(':','-')}-${amount || 'default'}.png` });
    await page.locator('.debrief-body').focus();
    await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(() => document.activeElement.dataset.action), 'archive');
    await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(() => document.activeElement.classList.contains('debrief-body')), true, 'Tab stays in the report');
    await page.keyboard.press('Shift+Tab');await page.keyboard.press('Enter');
    assert.equal(await page.locator('.mission-debrief').count(), 0, 'filing advances exactly once');
    assert.deepEqual((await state()).stock, before.stock, 'reading and filing spend no additional resources');
    if (resolution.fatal) {
      assert.equal(await page.locator('.final-paper').isVisible(), true);
      assert.equal(await page.locator('.record-failure').count(), 1);
    } else {
      if (await page.locator('#dispatch').isVisible()) await click('open-dispatch');
      await page.keyboard.press('r');
      assert.equal(await page.locator('.guide-turn-record .record-entry').count(), 1);
      assert.equal(await page.locator('.guide-turn-record .record-entry').evaluate(el => el.classList.contains('record-success')), resolution.success);
      await page.screenshot({ path: `test-results/record-${kind.replace(':','-')}.png` });
    }
  }

  // Review long findings and retry/fatal actions in the same native report layout.
  const long = structuredClone(fixtures[1]);
  for (const key of Object.keys(long.resolution.requested)) { long.resolution.requested[key] = 0;long.resolution.spent[key] = 0; }
  fixtures.push(long);
  for (const viewport of [{ width: 360, height: 740 },{ width: 390, height: 844 },{ width: 768, height: 1024 },{ width: 960, height: 540 },{ width: 1440, height: 900 }]) {
    await page.setViewportSize(viewport);
    for (let index = 0; index < fixtures.length; index++) {
      const fixture = fixtures[index];
      await page.evaluate(async ({ resolution, destination }) => {
        const { reportMarkup } = await import('/src/report.ts');
        const layer = document.querySelector('#modal-layer');layer.hidden = false;layer.dataset.modal = 'report';
        layer.innerHTML = reportMarkup(resolution, destination, false);layer.querySelector('h1').id = 'modal-title';
      }, fixture);
      await assertInViewport(page.locator('.mission-debrief'), viewport, 'Report card');
      await assertInViewport(page.locator('[data-action="archive"]'), viewport, 'Continue action');
      assert.equal(await page.locator('.debrief-body').evaluate(el => el.scrollWidth <= el.clientWidth + 1), true, 'details do not scroll sideways');
      await page.locator('.debrief-body').evaluate(el => el.scrollTop = el.scrollHeight);
      await assertInViewport(page.locator('.debrief-next'), viewport, 'Next step after scrolling');
      if (index === 0 || index === 2 || index === 3) await page.screenshot({ path: `test-results/report-responsive-${viewport.width}-${index}.png` });
    }
  }
  await page.evaluate(async fixture => {
    const { reportMarkup } = await import('/src/report.ts');
    document.querySelector('#modal-layer').innerHTML = reportMarkup(fixture.resolution, fixture.destination, true);
  }, fixtures[1]);
  assert.match(await page.locator('[data-action="archive"]').innerText(), /Try lesson again/);
  assert.deepEqual(errors, []);
  console.log('PASS: mission, operation, emergency and fatal reports; readable native type; fixed Continue action; record cards; filing/accounting/focus; long findings and five responsive sizes.');
} finally { await browser.close(); }
