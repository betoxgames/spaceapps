import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const playwright=require('playwright');

import {existsSync,mkdirSync} from 'node:fs';
const browser=await playwright.chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1280,height:720}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
const url=process.env.PREVIEW_URL||'http://127.0.0.1:4173/';
const state=()=>page.evaluate(()=>window.__SPACE_PAPERS__.state());const view=()=>page.evaluate(()=>window.__SPACE_PAPERS__.view());
const scenario=kind=>page.evaluate(kind=>window.__SPACE_PAPERS__.scenario(kind),kind);
async function outcome(){await page.waitForSelector('#cinema:not([hidden])');await page.locator('[data-action=skip]').click();await page.locator('[data-action=skip]').click();await page.waitForSelector('.report-paper');}
try{
 await page.goto(url);await page.locator('[data-action="new-shift"]').click();
 for(const [id,answer] of [['E04',0],['E02',1],['E08',1],['E07',1],['E03',1]]){
  await scenario('emergency:'+id);const before=await state();
  await page.locator('[data-action="inspect-incident"]').click();
  await page.locator('[data-action="protocol-'+answer+'"]').click();
  assert.deepEqual((await state()).stock,before.stock,'diagnosis must not spend stock');
  assert.match(await page.locator('.protocol-feedback').innerText(),/shelter|isolated|paused|Cooling|Tank/i);
  const overflow=await page.locator('#worksheet').evaluate(e=>e.scrollHeight>e.clientHeight+2);
  assert.equal(overflow,false,id+' worksheet must fit at 1280×720');
  await page.keyboard.press('Escape');const time=(await view()).remaining;
  await page.waitForTimeout(300);assert.equal((await view()).remaining,time,'pause freezes emergency clock');
  await page.locator('[data-action="resume"]').click();
  // Bring response to the front, leaving the separate worksheet intact.
  await page.locator('#emergency .emergency-header').click();
  await page.locator('#contribution').fill('100');
  await page.locator('[data-action="confirm-emergency"]').click();
  await outcome();assert.equal((await state()).history.at(-1).success,true);
  assert.equal((await state()).history.length,1,'one confirmation produces exactly one ledger entry');
  assert.equal(await page.locator('#worksheet').count(),0,'worksheet is collected with emergency');
  await page.locator('[data-action="archive"]').click();
 }
 await scenario('emergency:E02');await page.locator('[data-action="confirm-emergency"]').click();await outcome();assert.equal((await state()).terminal,'emergency');
 assert.deepEqual(errors,[]);mkdirSync('test-results',{recursive:true});
 await scenario('emergency:E08');await page.locator('[data-action="inspect-incident"]').click();await page.screenshot({path:'test-results/emergency-routing.png'});
 console.log('PASS: five distinct incident worksheets, accounting, pause, guaranteed recovery, zero failure, cleanup, 1280×720 and no page errors.');
}finally{await browser.close();}
