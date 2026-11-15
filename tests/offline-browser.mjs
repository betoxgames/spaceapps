import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { mkdir } from 'node:fs/promises';
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:1280,height:720},offline:true});
const page=await context.newPage(),errors=[],external=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('request',r=>{if(/^https?:/.test(r.url()))external.push(r.url());});
async function resumeIfPaused(){if(await page.locator('[data-action="resume"]').isVisible())await page.locator('[data-action="resume"]').click();}
try{
 await page.goto(pathToFileURL(resolve(process.env.PLAY_HTML||'index.html')).href);
 await page.locator('[data-action="new-shift"]').click();
 await page.waitForFunction(()=>document.querySelector('#visitor-portrait')?.dataset.viewerState==='ready');
 await page.waitForTimeout(800);await resumeIfPaused();
 assert.equal(await page.evaluate(()=>window.__SPACE_PAPERS__!==undefined),false,'production has no development fixtures');
 assert.equal(await page.evaluate(()=>Object.keys(window.__SPACE_PAPERS_ASSETS__).filter(k=>k.startsWith('art/engineers/')).length),9);
 await page.locator('[data-action="camera-desk"]').first().click();
 await page.keyboard.press('b');await page.locator('[data-action="book-destinations"]').first().click();await page.locator('[data-action="destination-earth"]').click();
 assert.match(await page.locator('#manual').innerText(),/11,500/);
 await page.keyboard.press('1');await page.keyboard.press('Enter');await page.keyboard.press('ArrowLeft');await page.keyboard.press('Enter');
 assert.equal(await page.locator('#flight').getAttribute('data-stored'),'false');
 await page.locator('[data-stamp-tool="return"]').click();await page.keyboard.press('1');await page.keyboard.press('Enter');
 await page.waitForTimeout(900);await resumeIfPaused();assert.equal(await page.locator('#flight').count(),1);
 await page.keyboard.press('Escape');await page.locator('[data-action="leave"]').click();await page.locator('[data-action="menu"]').click();
 await page.locator('[data-action="training"]').click();
 for(const key of ['1']){await page.keyboard.press(key);await page.keyboard.press('Enter');await page.keyboard.press('Enter');}
 await page.keyboard.press('b');await page.locator('[data-action="book-destinations"]').first().click();await page.locator('[data-action="destination-earth"]').click();
 for(const key of ['2','3']){await page.keyboard.press(key);await page.keyboard.press('Enter');await page.keyboard.press('Enter');}
 await page.keyboard.press('i');await page.locator('[data-stamp-tool="approve"]').click();await page.keyboard.press('1');await page.keyboard.press('Enter');
 await page.waitForSelector('#cinema:not([hidden])');await page.locator('[data-action="skip"]').click();await page.locator('[data-action="skip"]').click();await page.waitForSelector('.report-paper');
 assert.match(await page.locator('.report-paper').innerText(),/safe return/i);
 assert.deepEqual(errors,[]);assert.deepEqual(external,[],'direct-file play must not request downloads or a server');
 await mkdir('test-results',{recursive:true});await page.screenshot({path:'test-results/offline-playable.png'});
 console.log('PASS: file:// index.html with network OFF, embedded engineers, manual, keyboard paper handling, return, tutorial approval and report. No external requests or page errors.');
}finally{await browser.close();}
