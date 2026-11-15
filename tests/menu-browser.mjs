import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const browser = await chromium.launch({headless:true});
const url = pathToFileURL(resolve(process.env.PLAY_HTML || 'index.html')).href;
const errors=[], failures=[], external=[];
const context=await browser.newContext({viewport:{width:1440,height:900},offline:true,reducedMotion:'reduce'});
const page=await context.newPage();
page.on('pageerror',e=>errors.push(e.message));
page.on('requestfailed',r=>failures.push(r.url()));
page.on('request',r=>{if(/^https?:/.test(r.url()))external.push(r.url());});
const ready=()=>page.waitForSelector('.orbital-menu[data-scene-state="ready"]');
try {
  await page.goto(url);await ready();
  assert.equal(await page.locator('.orbital-menu').getAttribute('data-moon-pivot'),'Empty.001');
  assert.equal(await page.locator('.orbital-menu').getAttribute('data-station-layout'),'surface-campus');
  const zone=page.locator('[data-menu-control="orbit"]');
  const before=await page.locator('.orbital-menu').getAttribute('data-orbit');
  await zone.focus();await page.keyboard.press('ArrowRight');
  await page.waitForFunction(previous=>document.querySelector('.orbital-menu').dataset.orbit!==previous,before);
  const bounds=await zone.boundingBox();const rotated=await page.locator('.orbital-menu').getAttribute('data-orbit');
  await page.mouse.move(bounds.x+bounds.width*.5,bounds.y+bounds.height*.5);await page.mouse.down();await page.mouse.move(bounds.x+bounds.width*.5+100,bounds.y+bounds.height*.5+60,{steps:6});await page.mouse.up();
  assert.notEqual(await page.locator('.orbital-menu').getAttribute('data-orbit'),rotated,'mouse drag changes the actual 3D orientation');
  await page.locator('[data-menu-control="reset"]').click();
  assert.equal(await page.locator('.orbital-menu').getAttribute('data-orbit'),before,'reset restores the authored initial view');
  await page.locator('[data-menu-control="sound"]').click();assert.equal(await page.locator('[data-menu-control="sound"]').getAttribute('aria-pressed'),'true');
  await page.locator('[data-action="options"]').click();assert.equal(await page.locator('#muted').isChecked(),true);
  await page.locator('[data-action="settings-done"]').click();await ready();
  await page.locator('[data-action="credits"]').click();await page.locator('[data-action="settings-done"]').click();await ready();
  await page.locator('[data-menu-control="replay"]').click();await page.locator('#seed-input').fill('orbital-validation');await page.locator('#seed-input').press('Enter');
  await page.waitForSelector('#modal-layer[hidden]',{state:'attached'});assert.equal(await page.locator('#moon-scene canvas').count(),0,'menu GPU canvas is removed on game entry');
  await page.waitForSelector('.scene-visitor[data-visitor-phase="ready"]',{state:'attached'});
  await page.keyboard.press('Escape');await page.locator('[data-action="resume"]').click();
  await page.keyboard.press('Escape');await page.locator('[data-action="leave"]').click();await page.locator('[data-action="menu"]').click();await ready();
  await page.locator('[data-action="training"]').click();await page.waitForSelector('#training-guide:not([hidden])');
  assert.deepEqual(errors,[]);assert.deepEqual(failures,[]);assert.deepEqual(external,[]);
  await context.close();
  // Normal-motion entry plays the recovered Blender sequence through frame 48.
  const animated=await browser.newContext({viewport:{width:1280,height:720},offline:true});
  const motion=await animated.newPage();motion.on('pageerror',e=>errors.push(e.message));await motion.goto(url);
  await motion.waitForSelector('.orbital-menu[data-scene-state="ready"]');
  await motion.waitForFunction(()=>document.querySelector('.orbital-menu')?.dataset.lightFrame==='48',{timeout:20000});
  await motion.locator('[data-menu-control="rotate"]').click();await motion.waitForTimeout(700);
  const paused=await motion.locator('.orbital-menu').getAttribute('data-orbit');await motion.waitForTimeout(250);
  assert.equal(await motion.locator('.orbital-menu').getAttribute('data-orbit'),paused,'pause stops automatic rotation');
  await motion.locator('[data-action="new-shift"]').click();await motion.waitForSelector('.is-departing');
  await motion.waitForSelector('#modal-layer[hidden]',{state:'attached'});await animated.close();
  // A lost WebGL context presents the local poster and keeps navigation usable.
  const fallbackContext=await browser.newContext({viewport:{width:1440,height:900},offline:true,reducedMotion:'reduce'});
  const fallbackPage=await fallbackContext.newPage();await fallbackPage.goto(url);await fallbackPage.waitForSelector('.orbital-menu[data-scene-state="ready"]');
  await fallbackPage.locator('#moon-scene canvas').evaluate(canvas=>canvas.dispatchEvent(new Event('webglcontextlost',{cancelable:true})));
  await fallbackPage.waitForSelector('.orbital-menu[data-scene-state="fallback"]');
  await fallbackPage.locator('[data-action="new-shift"]').click();await fallbackPage.waitForSelector('#modal-layer[hidden]',{state:'attached'});
  assert.deepEqual(errors,[]);
  console.log('PASS: offline GLB, real rotation/keyboard/reset, lighting 1–48, pause, settings, credits, seed replay, training, cinematic game entry, GPU cleanup and WebGL fallback.');
} finally { await browser.close(); }
