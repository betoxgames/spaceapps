import assert from 'node:assert/strict';
import { cp, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from 'playwright';

// A copied release must work independently of source files and node_modules.
const temp = await mkdtemp(path.join(tmpdir(), 'space papers distribution '));
let browser;
try {
  await cp('dist', temp, { recursive: true });
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ offline: true });
  const page = await context.newPage();
  const failures = [], errors = [], external = [];
  page.on('requestfailed', request => failures.push(`${request.url()}: ${request.failure()?.errorText}`));
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => { if (/^https?:/.test(request.url())) external.push(request.url()); });
  await page.goto(pathToFileURL(path.join(temp, 'index.html')).href);
  await page.locator('[data-action="new-shift"]').click();
  await page.waitForFunction(() => document.querySelector('#visitor-portrait')?.dataset.viewerState === 'ready');
  await page.evaluate(async () => {
    const image = new Image(); image.src = 'public/assets/images/scene/scene-base.webp'; await image.decode();
    for (const kind of ['module', 'transport']) for (const frame of ['0001', '0024']) {
      const ship = new Image(); ship.src = `public/assets/images/ships/${kind}-${frame}.webp`; await ship.decode();
    }
    const context = new AudioContext();
    const response = await fetch(window.__SPACE_PAPERS_ASSETS__['assets/audio/stamp.mp3']);
    await context.decodeAudioData(await response.arrayBuffer()); await context.close();
  });
  assert.deepEqual(errors, []);
  assert.deepEqual(failures, [], 'all requested local files must load');
  assert.deepEqual(external, []);
  console.log('PASS: copied distribution opens from a path with spaces, without source files, dependencies, network, or failed requests.');
} finally {
  await browser?.close();
  await rm(temp, { recursive: true, force: true });
}
