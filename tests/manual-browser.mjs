import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const errors = [];
const url = process.env.PREVIEW_URL || 'http://127.0.0.1:4173';
const page = await browser.newPage({ viewport: { width: 1600, height: 900 }, reducedMotion: 'reduce' });
page.on('pageerror', error => errors.push(error.message));
const click = action => page.locator(`[data-action="${action}"]`).first().click();
const view = () => page.evaluate(() => window.__SPACE_PAPERS__.view());
const state = () => page.evaluate(() => window.__SPACE_PAPERS__.state());
const step = ms => page.evaluate(ms => window.__SPACE_PAPERS__.advanceTime(ms), ms);
const fits = target => target.evaluate(el => ({ vertical: el.scrollHeight <= el.clientHeight + 2, horizontal: el.scrollWidth <= el.clientWidth + 1 }));
try {
  await page.goto(url);await click('new-shift');
  await page.evaluate(() => window.__SPACE_PAPERS__.manualTime());
  const initial = await state();
  await page.keyboard.press('b');
  assert.equal((await view()).bookDestination, null, 'opening the guide does not choose the mission’s answer');
  assert.equal(await page.locator('.guide-review-steps li').count(), 4);
  assert.deepEqual(await fits(page.locator('.guide-content')), { vertical: true, horizontal: true });
  await click('book-destinations');
  assert.equal(await page.locator('.guide-planet-card:visible').count(), 8);
  await click('manual-filter-orbit');assert.equal(await page.locator('.guide-planet-card:visible').count(), 4);
  await page.locator('#manual-search').fill('neP');
  assert.equal(await page.locator('.guide-planet-card:visible').count(), 1);
  assert.match(await page.locator('.guide-planet-card:visible').innerText(), /Neptune/);
  await page.locator('#manual-search').fill('Earth');
  assert.equal(await page.locator('.guide-search-empty').isVisible(), true, 'search and route type work together');
  await click('manual-clear-search');
  assert.equal(await page.locator('#manual-search').inputValue(), '');
  assert.equal(await page.locator('#manual-search').evaluate(el => el === document.activeElement), true);
  await page.keyboard.type('123');
  assert.equal(await page.locator('#flight').getAttribute('data-stored'), 'true', 'typing does not activate document shortcuts');
  await page.locator('#manual-search').fill('');
  assert.deepEqual(await fits(page.locator('.guide-content')), { vertical: true, horizontal: true });
  await page.screenshot({ path: 'test-results/manual-atlas-desktop.png' });

  // Verify every resource, unit and orbit restriction against the game catalog.
  const destinations = await page.evaluate(async () => (await import('/src/catalog.ts')).DESTINATIONS);
  for (const destination of destinations) {
    await click(`destination-${destination.id}`);
    const rows = await page.locator('.guide-resource-table tbody tr').evaluateAll(rows => rows.map(row => ({ resource: row.dataset.resource, amount: row.querySelector('td strong').textContent, unit: row.querySelector('td span').textContent })));
    assert.equal(rows.length, 5);
    for (const row of rows) {
      assert.equal(row.amount, (destination.minimum[row.resource] / 1000).toLocaleString('en-US'));
      assert.equal(row.unit, row.resource === 'water' ? 'L' : row.resource === 'energy' ? 'kWh' : 'kg');
    }
    assert.match(await page.locator('.guide-route-meta').innerText(), destination.mode === 'orbit' ? /ORBIT ONLY/ : /LOCAL MODULE/);
    assert.deepEqual(await fits(page.locator('.guide-content')), { vertical: true, horizontal: true }, `${destination.name} fits without scrolling`);
  }
  await click('destination-earth');
  await click('manual-sheet-life');
  assert.equal(await page.locator('#life').getAttribute('data-stored'), 'false');
  const book = await page.locator('#manual').boundingBox(), paper = await page.locator('#life').boundingBox();
  assert.ok(paper.x > book.x + book.width && paper.y >= 400, 'comparison sheet is beside the guide and clear of the tray');
  await click('manual-sheet-power');
  assert.equal(await page.locator('#power').getAttribute('data-stored'), 'false');
  await click('manual-stock');assert.equal(await page.locator('.guide-inventory-table').isVisible(), true);
  assert.equal(await page.locator('#ledger,.ledger-tool,.log-tool').count(), 0, 'inventory has no separate desk book');
  await click('book-destinations');await click('store');

  // Reader mode uses the same object, with preserved destination, pin and position.
  const transform = await page.locator('#manual').evaluate(el => el.style.transform);
  const handle = await page.locator('#manual').elementHandle();
  await click('pin');await click('manual-reading');
  assert.equal(await page.evaluate(el => el.parentElement.id, handle), 'manual-reader');
  assert.equal(await page.locator('#manual').count(), 1);
  assert.equal(await page.locator('#stage').evaluate(el => el.inert), true);
  assert.equal((await view()).bookDestination, 'earth');
  for (let i = 0; i < 24; i++) {
    await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(() => !!document.activeElement.closest('#manual-reader')), true, 'reader contains keyboard focus');
  }
  await click('book-rules');await click('manual-rule-2');
  assert.equal((await view()).bookPage, 2);
  await click('book-next');assert.equal((await view()).bookPage, 3);
  assert.equal(await page.evaluate(() => document.activeElement.dataset.action), 'book-next');
  for (const [tab, count] of [['rules', 4], ['science', 5]]) {
    await click(`book-${tab}`);
    for (let i = 0; i < count; i++) {
      assert.equal((await fits(page.locator('.guide-content'))).horizontal, true);
      if (tab === 'science') {
        assert.equal(await page.locator('.guide-science-panels > section').count(), 2);
        assert.match(await page.locator('.guide-source-link').getAttribute('href'), /^https:\/\//);
      }
      await click('book-next');
    }
  }
  await click('book-destinations');
  await page.screenshot({ path: 'test-results/manual-reader-desktop.png' });
  await page.keyboard.press('Escape');
  assert.equal((await view()).bookReading, false);
  assert.equal(await page.locator('#manual').evaluate(el => el.style.transform), transform);
  assert.equal(await page.locator('#manual').evaluate(el => el.classList.contains('pinned')), true);
  await click('close-manual');
  assert.equal(await page.evaluate(() => document.activeElement.dataset.action), 'manual');
  assert.deepEqual(await state(), initial, 'manual navigation, comparison and pinning do not change campaign accounting');

  // Emergency references expose only received events; the reader preserves the timer.
  await page.evaluate(() => window.__SPACE_PAPERS__.scenario('emergency:E02'));await click('open-dispatch');
  await page.keyboard.press('b');await click('book-emergencies');
  assert.equal(await page.locator('.guide-incident-card').count(), 1);
  assert.match(await page.locator('.guide-incident-card').innerText(), /E02/);
  assert.equal((await page.locator('.guide-content').innerText()).includes('Solar alert'), false);
  await click('manual-reading');await step(1000);
  assert.equal((await view()).remaining, 29000);
  assert.match(await page.locator('#reader-timer').innerText(), /29s/);
  await page.getByRole('button', { name: 'Pause game while reading' }).click();
  await step(5000);assert.equal((await view()).remaining, 29000);
  await click('resume');assert.equal((await view()).bookReading, true);
  await step(29000);
  assert.equal((await view()).bookReading, false, 'timeout safely returns from the reader to the response handoff');
  assert.equal(await page.locator('#manual-reader').isVisible(), false);
  await step(500);assert.equal((await view()).phase, 'cinema');

  // Native reader layout on phones, portrait tablets and short landscape screens.
  for (const viewport of [{ width: 360, height: 740 },{ width: 390, height: 844 },{ width: 768, height: 1024 },{ width: 960, height: 540 }]) {
    const mobile = await browser.newPage({ viewport, reducedMotion: 'reduce' });
    mobile.on('pageerror', error => errors.push(error.message));
    await mobile.goto(url);await mobile.locator('[data-action="new-shift"]').click();await mobile.keyboard.press('b');
    assert.equal(await mobile.locator('#manual-reader').isVisible(), true, 'compact screens open directly in reading view');
    for (const target of ['.guide-chrome','.guide-footer']) {
      const bounds = await mobile.locator(target).boundingBox();
      assert.ok(bounds.x >= 0 && bounds.y >= 0 && bounds.x + bounds.width <= viewport.width + 1 && bounds.y + bounds.height <= viewport.height + 1);
    }
    await mobile.locator('[data-action="book-destinations"]').first().click();
    assert.equal((await fits(mobile.locator('.guide-content'))).horizontal, true);
    await mobile.locator('[data-action="destination-neptune"]').click();
    assert.equal((await fits(mobile.locator('.guide-content'))).horizontal, true);
    assert.equal(await mobile.locator('.guide-resource-table tbody tr').count(), 5);
    await mobile.screenshot({ path: `test-results/manual-reader-${viewport.width}.png` });
    await mobile.locator('[data-action="book-science"]').click();
    assert.equal((await fits(mobile.locator('.guide-content'))).horizontal, true);
    await mobile.locator('[data-action="close-manual"]').click();
    assert.equal(await mobile.locator('#manual-reader').isVisible(), false);
    await mobile.keyboard.press('b');
    await mobile.evaluate(() => window.__SPACE_PAPERS__.scenario('valid'));
    assert.equal(await mobile.locator('#manual-reader').isVisible(), false, 'reset cannot leave an orphaned reader');
    assert.equal(await mobile.locator('#stage').evaluate(el => el.inert), false);
    await mobile.close();
  }
  assert.deepEqual(errors, []);
  console.log('PASS: eight destination dossiers, exact minimums, search/filter/caret, comparison controls, reading mode, pin/state/focus, all lessons and NASA notes, emergency timing and four responsive reader sizes.');
} finally { await browser.close(); }
