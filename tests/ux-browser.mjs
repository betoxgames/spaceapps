import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const browser = await chromium.launch({ headless: true });
const url = process.env.PREVIEW_URL || 'http://127.0.0.1:4173/';
const errors = [];
await mkdir('test-results', { recursive: true });

async function dialogName(page) {
  return page.locator('#modal-layer').evaluate(element => {
    const labels = element.getAttribute('aria-labelledby');
    return element.getAttribute('aria-label') || labels?.split(/\s+/).map(id => document.getElementById(id)?.textContent).join(' ').trim();
  });
}

async function assertInViewport(locator, viewport, label) {
  const bounds = await locator.boundingBox();
  assert.ok(bounds, `${label} is visible`);
  assert.ok(bounds.x >= -1 && bounds.y >= -1 && bounds.x + bounds.width <= viewport.width + 1 && bounds.y + bounds.height <= viewport.height + 1, `${label} fits ${viewport.width}×${viewport.height}: ${JSON.stringify(bounds)}`);
}

try {
  // Native-size menus must stay readable and actionable, including short landscape screens.
  for (const viewport of [{ width: 360, height: 740 }, { width: 390, height: 844 }, { width: 768, height: 1024 }, { width: 960, height: 540 }, { width: 1280, height: 720 }, { width: 1440, height: 900 }, { width: 1920, height: 1080 }]) {
    const context = await browser.newContext({ viewport, reducedMotion: 'reduce' });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(url);
    assert.ok(await dialogName(page), 'menu dialog has an accessible name');
    const begin = page.locator('[data-action="new-shift"]');
    await assertInViewport(begin, viewport, 'Begin shift');
    await assertInViewport(page.locator('[data-action="training"]'), viewport, 'Training');
    const beginBounds = await begin.boundingBox();
    if (viewport.width < 1000 || viewport.height < 560) assert.ok(beginBounds.height >= 44, 'compact menu uses touch-sized primary targets');

    // Closed seed details must never allow Tab to escape the active dialog.
    for (let index = 0; index < 14; index++) {
      await page.keyboard.press('Tab');
      assert.equal(await page.evaluate(() => document.querySelector('#modal-layer').contains(document.activeElement)), true, 'Tab stays in the menu with replay collapsed');
    }
    await page.locator('[data-action="options"]').click();
    assert.ok(await dialogName(page), 'options dialog has an accessible name');
    await page.locator('[data-action="settings-done"]').scrollIntoViewIfNeeded();
    await assertInViewport(page.locator('[data-action="settings-done"]'), viewport, 'Options Done');
    await page.locator('#reduced').check();
    await page.locator('#muted').check();
    await page.locator('#click-placement').check();
    await page.locator('[data-action="settings-done"]').click();
    await page.locator('[data-action="credits"]').click();
    assert.ok(await dialogName(page), 'credits dialog has an accessible name');
    await page.locator('[data-action="settings-done"]').scrollIntoViewIfNeeded();
    await assertInViewport(page.locator('[data-action="settings-done"]'), viewport, 'Credits Back');
    await page.locator('[data-action="settings-done"]').click();
    await page.reload();
    await page.locator('[data-action="options"]').click();
    assert.equal(await page.locator('#reduced').isChecked(), true, 'reduced motion persists');
    assert.equal(await page.locator('#muted').isChecked(), true, 'mute persists');
    assert.equal(await page.locator('#click-placement').isChecked(), true, 'two-click placement persists');
    await page.screenshot({ path: `test-results/ux-options-${viewport.width}x${viewport.height}.png` });
    if (viewport.width === 390) {
      await page.locator('[data-action="settings-done"]').click();
      await page.locator('[data-action="new-shift"]').click();
      const dismiss = page.locator('[data-action="dismiss-screen-hint"]');
      if (await dismiss.isVisible()) await dismiss.click();
      await page.getByRole('button', { name: /Inspect desk/ }).click();
      await page.locator('#life').scrollIntoViewIfNeeded();
      await page.locator('#life').click();
      assert.equal(await page.locator('#life').getAttribute('data-stored'), 'false', 'compact screen can retrieve a document by clicking its paper preview');
      await page.locator('#life').scrollIntoViewIfNeeded();
      await assertInViewport(page.locator('#life'), viewport, 'Recovered life-support document');
      await page.screenshot({ path: 'test-results/ux-compact-physical-desk.png' });
    }
    await context.close();
  }

  const context = await browser.newContext({ viewport: { width: 1280, height: 720 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(url);
  await page.locator('[data-action="new-shift"]').click();
  await page.getByRole('button', { name: /Inspect desk/ }).click();
  for (const key of ['1', '2', '3']) await page.keyboard.press(key);
  for (const id of ['flight', 'life', 'power']) {
    const documentLayout = await page.locator(`#${id}`).evaluate(element => {
      const note = element.querySelector('.document-note').getBoundingClientRect();
      const footer = element.querySelector('.paper-footer').getBoundingClientRect();
      return { fits: element.scrollHeight <= element.clientHeight + 2, noteBeforeFooter: note.bottom <= footer.top + 1 };
    });
    assert.equal(documentLayout.fits, true, `${id} content fits the physical paper`);
    assert.equal(documentLayout.noteBeforeFooter, true, `${id} instructions do not overlap its footer`);
  }
  await page.keyboard.press('b');
  await page.locator('[data-action="book-destinations"]').first().click();
  assert.equal(await page.evaluate(() => document.activeElement?.dataset.action), 'book-destinations', 'manual tab retains keyboard focus after rerender');
  await page.locator('[data-action="destination-earth"]').click();
  assert.equal(await page.evaluate(() => document.activeElement?.dataset.action), 'destination-earth', 'route selection retains keyboard focus');
  await page.locator('[data-action="book-rules"]').click();
  await page.locator('[data-action="book-next"]').click();
  assert.equal(await page.evaluate(() => document.activeElement?.dataset.action), 'book-next', 'manual pagination retains keyboard focus');
  for (const [tab, pages] of [['rules', 4], ['science', 5]]) {
    await page.locator(`[data-action="book-${tab}"]`).first().click();
    for (let index = 0; index < pages; index++) {
      const clipped = await page.locator('.book-spread > section').evaluateAll(elements => elements.some(element => element.scrollHeight > element.clientHeight + 2 && ['hidden', 'clip'].includes(getComputedStyle(element).overflowY)));
      assert.equal(clipped, false, `${tab} page ${index + 1} does not hide manual content`);
      await page.locator('[data-action="book-next"]').click();
    }
  }
  await page.locator('[data-action="close-manual"]').click();
  assert.equal(await page.evaluate(() => document.activeElement?.dataset.action), 'manual', 'closing the manual returns focus to its cover');

  await page.keyboard.press('Escape');
  assert.ok(await dialogName(page), 'pause dialog has an accessible name');
  await page.locator('.pause-switch').evaluate(element => element.focus());
  assert.equal(await page.evaluate(() => document.querySelector('#modal-layer').contains(document.activeElement)), true, 'background controls cannot take focus behind a modal');
  await page.locator('[data-action="options"]').click();
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('[data-action="resume"]').isVisible(), true, 'Escape from options returns to pause');
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#modal-layer').isVisible(), false, 'Escape from pause resumes the desk');

  // A fatal incident's report and final screen are navigable without pointer movement.
  await page.evaluate(() => { window.__SPACE_PAPERS__.manualTime(); window.__SPACE_PAPERS__.scenario('emergency:E02'); });
  await page.locator('[data-action="confirm-emergency"]').click();
  await page.waitForSelector('#cinema:not([hidden])');
  await page.locator('[data-action="skip"]').click();
  await page.locator('[data-action="skip"]').click();
  assert.ok(await dialogName(page), 'report dialog has an accessible name');
  await page.locator('[data-action="archive"]').click();
  assert.ok(await dialogName(page), 'final evaluation has an accessible name');
  assert.equal(await page.locator('[data-action="final-prev"]').isDisabled(), true, 'first log page disables Previous');
  assert.equal(await page.locator('[data-action="final-next"]').isDisabled(), true, 'single log page disables Next');
  await page.screenshot({ path: 'test-results/ux-final-desktop.png' });
  await context.close();
  assert.deepEqual(errors, [], 'all UX flows have no uncaught browser errors');
  console.log('PASS: seven screen sizes, readable compact menus, scrollable credits, named dialogs, keyboard focus containment and restoration, persistent accessibility options, manual navigation, pause, report and final evaluation.');
} finally {
  await browser.close();
}
