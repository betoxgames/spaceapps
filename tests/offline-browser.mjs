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
await page.addInitScript(() => {
 window.offlineStampSounds=[];
 const start=AudioBufferSourceNode.prototype.start;
 AudioBufferSourceNode.prototype.start=function(...args){
  if(this.buffer&&!this.loop)window.offlineStampSounds.push(this.buffer.duration);
  return start.apply(this,args);
 };
});
async function resumeIfPaused(){if(await page.locator('[data-action="resume"]').isVisible())await page.locator('[data-action="resume"]').click();}
async function visitorReady(){await resumeIfPaused();await page.waitForSelector('.scene-visitor[data-visitor-phase="ready"]',{state:'attached'});}
try{
 await page.goto(pathToFileURL(resolve(process.env.PLAY_HTML||'index.html')).href);
 await page.locator('[data-action="new-shift"]').click();
 await page.waitForFunction(()=>document.querySelector('#visitor-portrait')?.dataset.viewerState==='ready');
 await visitorReady();
 assert.equal(await page.evaluate(()=>window.__SPACE_PAPERS__!==undefined),false,'production has no development fixtures');
 const decoded=await page.evaluate(async()=>{
  const result=[];
  for(const name of ['adan','dante','leo','max','nico','ren','saul','teo','victor']){
   const image=new Image();image.src=`public/assets/images/engineers/${name}.webp`;
   await image.decode();result.push({width:image.naturalWidth,height:image.naturalHeight});
  }
  return result;
 });
 assert.equal(decoded.length,9,'all nine local atlases decode with the network disabled');
 assert.ok(decoded.every(image=>image.width>=2048&&image.height>0),'offline atlas dimensions remain valid');
 const stampDuration=await page.evaluate(async()=>{
  const assets=window.__SPACE_PAPERS_ASSETS__;
  for(const name of ['approve-idle','approve-held','return-idle','return-held']){
   const image=new Image();image.src=`public/assets/images/ui/${name}.webp`;await image.decode();
   if(image.naturalWidth!==300||image.naturalHeight!==360)throw Error('Invalid local stamp');
  }
  const context=new AudioContext();
  const buffer=await context.decodeAudioData(await(await fetch(assets['assets/audio/stamp.mp3'])).arrayBuffer());
  await context.close();return buffer.duration;
 });
 assert.ok(stampDuration>0,'the stamp MP3 decodes with the network disabled');
 const stampCount=()=>page.evaluate(duration=>window.offlineStampSounds.filter(value=>Math.abs(value-duration)<.00001).length,stampDuration);

 await page.locator('[data-action="camera-desk"]').first().click();
 await page.keyboard.press('b');await page.locator('[data-action="book-destinations"]').first().click();await page.locator('[data-action="destination-earth"]').click();
 assert.match(await page.locator('#manual').innerText(),/11,500/);
 await page.locator('[data-action="manual-atlas"]').click();await page.locator('[data-action="manual-flight"]').click();
 assert.match(await page.locator('.guide-flight-facts').innerText(),/4 crew members/);
 await page.locator('[data-action="book-index"]').click();await page.locator('[data-action="manual-choose-route"]').click();
 assert.equal(await page.locator('.guide-planet-card').count(),8);
 await page.locator('[data-action="destination-earth"]').click();
 await page.locator('[data-action="manual-compare"]').click();
 assert.equal(await page.locator('.guide-comparison-table tbody tr').count(),5);
 await page.locator('[data-action="book-index"]').click();await page.locator('[data-action="manual-stock"]').click();
 assert.equal(await page.locator('.guide-inventory-table tbody tr').count(),5);
 assert.equal(await page.locator('#ledger,.ledger-tool,.log-tool').count(),0,'inventory lives only inside the manual');
 await page.locator('[data-action="book-destinations"]').click();
 await page.locator('[data-action="manual-reading"]').click();
 assert.equal(await page.locator('#manual-reader').isVisible(),true,'the guide can be enlarged offline');
 assert.equal(await page.locator('.guide-resource-table tbody tr').count(),5);
 await page.keyboard.press('Escape');
 assert.equal(await page.locator('#manual-reader').isVisible(),false,'Escape returns the same reference to the desk');
 assert.match(await page.locator('#manual').innerText(),/11,500/);
 await page.keyboard.press('1');await page.keyboard.press('Enter');await page.keyboard.press('ArrowLeft');await page.keyboard.press('Enter');
 assert.equal(await page.locator('#flight').getAttribute('data-stored'),'false');
 const returnedFlight=await page.locator('#flight').elementHandle();
 const soundsBeforeReturn=await stampCount();
 await page.locator('[data-stamp-tool="return"]').click();await page.keyboard.press('1');await page.keyboard.press('Enter');
 assert.equal(await stampCount(),soundsBeforeReturn+1,'offline return plays the supplied stamp recording exactly once');
 await page.waitForFunction(el=>!el.isConnected,returnedFlight);await resumeIfPaused();assert.equal(await page.locator('#flight').count(),1,'the completed exit replaces the returned proposal');await returnedFlight.dispose();
 await page.keyboard.press('Escape');await page.locator('[data-action="leave"]').click();await page.locator('[data-action="menu"]').click();
 await page.locator('[data-action="training"]').click();
 for(const key of ['1']){await page.keyboard.press(key);await page.keyboard.press('Enter');await page.keyboard.press('Enter');}
 await page.keyboard.press('b');await page.locator('[data-action="book-destinations"]').first().click();await page.locator('[data-action="destination-earth"]').click();
 for(const key of ['2','3']){await page.keyboard.press(key);await page.keyboard.press('Enter');await page.keyboard.press('Enter');}
 await page.keyboard.press('i');await visitorReady();await page.locator('[data-stamp-tool="approve"]').click();await page.keyboard.press('1');await page.keyboard.press('Enter');
 await page.waitForSelector('#cinema:not([hidden])');await page.locator('[data-action="skip"]').click();await page.locator('[data-action="skip"]').click();await page.waitForSelector('.report-paper');
 assert.match(await page.locator('.report-paper').innerText(),/safe return/i);
 // The offline build also delivers, animates and resolves a survival response.
 await page.locator('[data-action="archive"]').click();await visitorReady();
 await page.locator('[data-stamp-tool="return"]').click();await page.keyboard.press('1');await page.keyboard.press('Enter');
 await page.waitForSelector('#dispatch:not([hidden])');
 assert.match(await page.locator('#dispatch').innerText(),/SURVIVAL ALERT/);
 await page.screenshot({path:'test-results/offline-dispatch.png',animations:'disabled'});
 for(const amount of ['50','100','100']){
  await page.locator('[data-action="open-dispatch"]').click();
  await page.locator('#contribution').fill(amount);await page.locator('[data-action="confirm-emergency"]').click();
 }
 await page.waitForSelector('#cinema:not([hidden])');await page.locator('[data-action="skip"]').click();await page.locator('[data-action="skip"]').click();
 assert.match(await page.locator('.report-paper').innerText(),/INCIDENT RESOLVED/);
 assert.deepEqual(errors,[]);assert.deepEqual(external,[],'direct-file play must not request downloads or a server');
 await mkdir('test-results',{recursive:true});await page.screenshot({path:'test-results/offline-playable.png'});
 console.log('PASS: file:// distribution with network OFF, local images, manual, keyboard, return, tutorial approval, incoming survival transmission, support and recovery report. No external requests or page errors.');
}finally{await browser.close();}
