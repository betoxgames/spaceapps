import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const errors = [];
try {
  for (const viewport of [{ width: 1600, height: 900 }, { width: 1280, height: 720 }]) {
    const page = await browser.newPage({ viewport, reducedMotion: 'reduce' });
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(process.env.PREVIEW_URL || 'http://127.0.0.1:4173');
    await page.locator('[data-action="new-shift"]').click();
    await page.evaluate(() => { window.__SPACE_PAPERS__.manualTime();window.__SPACE_PAPERS__.advanceTime(10000); });
    await page.getByRole('button', { name: /Inspect desk/ }).click();
    const state = await page.evaluate(() => window.__SPACE_PAPERS__.state());
    const factor = viewport.width / 1600;
    const move = (x, y) => page.mouse.move(x * factor, y * factor, { steps: 8 });
    const stored = id => page.locator(`#${id}`).getAttribute('data-stored');
    const slot = id => page.locator(`[data-action="restore-${id}"]`);
    const point = async locator => { const box = await locator.boundingBox();return { x: (box.x + box.width / 2) / factor, y: (box.y + box.height / 2) / factor }; };

    await page.keyboard.press('b');await page.keyboard.press('i');
    assert.equal(await page.locator('.guide-inventory-table').isVisible(), true);
    assert.equal(await page.locator('#ledger,.ledger-tool,.log-tool').count(), 0);
    await page.keyboard.press('2');
    const manual = await page.locator('#manual').boundingBox();
    const paper = await page.locator('#life').boundingBox();
    assert.ok(manual.x + manual.width + 50 * factor < paper.x, 'manual leaves a clear gap beside the sheet');
    assert.ok(paper.x + paper.width + 400 * factor < viewport.width, 'removing the stock book frees the right side of the desk');
    assert.ok(Math.abs(paper.width / factor - 332 * .84) < 1, 'open sheet uses the smaller physical scale');
    await page.locator('[data-action="compare"]').click();
    const compared = await page.locator('#life').boundingBox();
    assert.ok(Math.abs(compared.x - manual.x - manual.width - 30 * factor) < 1, 'comparison uses the visible book width');
    await page.keyboard.press('2');

    // The intended destination appears as soon as a sheet is picked up.
    await move(790, 450);await page.mouse.down();
    assert.match(await slot('life').getAttribute('class'), /return-target/);
    assert.equal(await slot('flight').evaluate(el => el.classList.contains('return-target')), false);
    await move(810, 290);
    assert.match(await slot('life').getAttribute('class'), /drop-ready/);
    assert.match(await slot('life').innerText(), /Release to return/);
    await page.mouse.up();
    assert.equal(await stored('life'), 'true');
    assert.equal(await page.locator('.return-target,.drop-ready').count(), 0, 'drop removes guidance');

    // A lower-corner grip can return a sheet by overlapping its own slot.
    await page.keyboard.press('2');
    await move(990, 720);await page.mouse.down();await move(990, 570);
    assert.match(await slot('life').getAttribute('class'), /drop-ready/, 'overlap accepts the sheet while the pointer remains below the tray');
    await page.mouse.up();assert.equal(await stored('life'), 'true');

    // Dropping over another position still restores the sheet to its own slot.
    await page.keyboard.press('2');await move(790, 450);await page.mouse.down();
    const other = await point(slot('flight'));await move(other.x, other.y);await page.mouse.up();
    assert.equal(await stored('life'), 'true');
    const returned = await page.locator('#life').boundingBox();
    assert.ok(Math.abs(returned.x / factor - 737) < 1, 'life support returns to position 02');

    // Escape restores the sheet and clears the return affordance.
    await page.keyboard.press('2');await move(790, 450);await page.mouse.down();await move(810, 290);
    await page.keyboard.press('Escape');await page.mouse.up();
    assert.equal(await stored('life'), 'false');
    assert.equal(await page.locator('.return-target,.drop-ready').count(), 0);
    assert.equal(await page.locator('[data-action="resume"]').count(), 0, 'cancelling a drag does not pause');

    // Keyboard movement can place a sheet back in the tray.
    await page.locator('#life').focus();await page.keyboard.press('Enter');
    for (let i = 0; i < 3; i++) await page.keyboard.press('Shift+ArrowUp');
    assert.match(await slot('life').getAttribute('class'), /drop-ready/);
    await page.keyboard.press('Enter');assert.equal(await stored('life'), 'true');

    // Moving a scaled sheet keeps the entire object above the bottom control rail.
    await page.keyboard.press('2');await page.keyboard.press('Enter');
    for (let i = 0; i < 35; i++) await page.keyboard.press('Shift+ArrowRight');
    for (let i = 0; i < 15; i++) await page.keyboard.press('Shift+ArrowDown');
    await page.keyboard.press('Enter');
    const edge = await page.locator('#life').boundingBox();
    assert.ok(Math.abs(edge.x + edge.width - viewport.width) < 1);
    assert.ok(Math.abs(edge.y + edge.height - 815 * factor) < 1);

    await page.locator('[data-action="store"]').click();await page.keyboard.press('2');
    await slot('life').click();assert.equal(await stored('life'), 'true', 'empty slots still return sheets by click');
    assert.deepEqual(await page.evaluate(() => window.__SPACE_PAPERS__.state()), state, 'organizing the desk does not alter campaign state');

    await page.keyboard.press('Escape');await page.locator('[data-action="options"]').click();
    await page.locator('#click-placement').check();await page.locator('[data-action="settings-done"]').click();
    await page.locator('[data-action="resume"]').click();
    await page.keyboard.press('2');await page.locator('#life').click();await move(1050, 225);
    assert.match(await slot('life').getAttribute('class'), /drop-ready/);
    await page.mouse.click(1050 * factor, 225 * factor);
    assert.equal(await stored('life'), 'true', 'two-click placement returns a sheet without dragging');
    assert.equal(await page.locator('.return-target,.drop-ready').count(), 0);
    await page.screenshot({ path: `test-results/desk-layout-${viewport.width}.png` });
    await page.close();
  }
  assert.deepEqual(errors, []);
  console.log('PASS: smaller desk layout, comparison spacing, matching return feedback, forgiving drops, cancellation, keyboard, scaled bounds, click and two-click returns at two screen sizes.');
} finally { await browser.close(); }
