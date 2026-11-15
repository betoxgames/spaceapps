import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const browser=await chromium.launch({headless:true});const page=await browser.newPage({viewport:{width:1280,height:720}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
const view=()=>page.evaluate(()=>window.__SPACE_PAPERS__.view());const state=()=>page.evaluate(()=>window.__SPACE_PAPERS__.state());
const move=async key=>{await page.keyboard.press(key);await page.keyboard.press('Enter');await page.keyboard.press('Enter')};
async function visitorReady(){await page.waitForSelector('.scene-visitor[data-visitor-phase="ready"]',{state:'attached'});assert.equal(await page.locator('[data-stamp-tool=approve]').isDisabled(),false,'stamps become available after the visitor reaches the desk');}
async function stamp(kind,key='1'){await visitorReady();await page.locator(`[data-stamp-tool="${kind}"]`).click();assert.equal((await view()).phase,'desk','selecting a stamp cannot decide');await page.keyboard.press(key);await page.keyboard.press('Enter')}
async function report(){await page.waitForSelector('#cinema:not([hidden])');await page.locator('[data-action=skip]').click();await page.locator('[data-action=skip]').click();await page.waitForSelector('.report-paper');await page.locator('[data-action=archive]').click()}
try {
 await page.goto(process.env.PREVIEW_URL||'http://127.0.0.1:4173/');await page.getByRole('button',{name:'Training',exact:true}).click();
 assert.match(await page.locator('#training-guide').innerText(),/Take the flight plan/);await move('1');assert.match(await page.locator('#training-guide').innerText(),/Open the Mission Manual/,'keyboard pickup advances training');
 await page.keyboard.press('b');await page.locator('[data-action=book-destinations]').first().click();await page.locator('[data-action=destination-earth]').click();
 assert.match(await page.locator('#manual').innerText(),/11,500[\s\S]*19,200[\s\S]*4,400/);await move('2');await move('3');await page.keyboard.press('i');
 assert.match(await page.locator('#training-guide').innerText(),/Take APPROVE/);await stamp('approve');await report();
 assert.equal((await view()).training.lesson,2);assert.match(await page.locator('#training-guide').innerText(),/6,900/);await stamp('return');await page.waitForFunction(()=>window.__SPACE_PAPERS__.view().training?.lesson===3);assert.equal((await state()).history.length,0,'the next training lesson starts only after the returned visitor leaves');
 await page.locator('[data-action="open-dispatch"]').click();assert.match(await page.locator('#emergency').innerText(),/Full intervention/i);await page.locator('#contribution').fill('50');await page.locator('[data-action=confirm-emergency]').click();await page.locator('[data-action="open-dispatch"]').click();await page.locator('#contribution').fill('100');await page.locator('[data-action=confirm-emergency]').click();await page.locator('[data-action="open-dispatch"]').click();await page.locator('#contribution').fill('100');await page.locator('[data-action=confirm-emergency]').click();await report();
 assert.equal((await view()).training.lesson,4);await page.locator('[data-action="open-dispatch"]').click();const before=await state();await page.locator('[data-action=choice-A]').click();assert.deepEqual((await state()).stock,before.stock,'choosing an operation is not an authorization');
 await page.waitForSelector('.scene-visitor[data-visitor-phase="ready"]',{state:'attached'});await page.locator('[data-stamp-tool=approve]').click();await page.locator('#order').focus();await page.keyboard.press('Enter');await report();
 assert.match(await page.locator('#modal-layer').innerText(),/TRAINING COMPLETE/);
 await page.locator('[data-action=menu]').click();await page.locator('[data-action=options]').click();await page.locator('#click-placement').check();await page.locator('[data-action=settings-done]').click();
 await page.evaluate(()=>window.__SPACE_PAPERS__.scenario('valid'));const stock=(await state()).stock;
 await page.getByRole('button',{name:/Inspect desk/}).click();const sheet=await page.locator('#flight').boundingBox();await page.mouse.click(sheet.x+12,sheet.y+12);await page.mouse.click(700,360);
 assert.equal(await page.locator('#flight').getAttribute('data-stored'),'false');await visitorReady();await page.locator('[data-stamp-tool=approve]').click();assert.deepEqual((await state()).stock,stock,'selecting stamp cannot spend stock');await page.locator('#flight').click({position:{x:60,y:80}});await page.waitForSelector('#cinema:not([hidden])');
 assert.notDeepEqual((await state()).stock,stock,'approval spends stock only after stamping');
 await page.evaluate(()=>window.__SPACE_PAPERS__.scenario('short'));const returnStock=(await state()).stock,returnedProposal=(await state()).proposal.id;await page.getByRole('button',{name:/Inspect desk/}).click();await stamp('return');await page.waitForFunction(id=>window.__SPACE_PAPERS__.state().proposal?.id!==id,returnedProposal);assert.deepEqual((await state()).stock,returnStock,'return spends nothing');
 assert.deepEqual(errors,[]);console.log('PASS: full four-part training, keyboard handling, two-click placement, deliberate approvals, return, emergency and operation.');
}finally{await browser.close()}
