import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1600,height:900}});
await page.goto(process.env.PREVIEW_URL||'http://127.0.0.1:4173');
await page.evaluate(async()=>{
 document.body.innerHTML='<div id="s" style="position:relative;width:1600px;height:900px"><button data-stamp-tool="approve" style="position:absolute;left:30px;top:700px">stamp</button></div>';
 const {Desk}=await import('/src/desk.ts');const s=document.querySelector('#s');window.calls=[];
 window.desk=new Desk(s,{announce:()=>{},onPaper:()=>{},onSelect:()=>{},canStamp:()=>true,onStamp:(...args)=>window.calls.push(args)});
 for(const [id,x,y,kind,stored] of [['paper',1100,200,'paper',true],['manual',100,100,'book',false]]) {const el=document.createElement('div');el.style.cssText='position:absolute;left:0;top:0;transform-origin:top left;background:#ddd';s.append(el);window.desk.register({id,el,x,y,width:300,height:300,kind,stored,tray:{x:1100,y:200}});}
});
const state=()=>page.evaluate(()=>{const {x,y,stored}=window.desk.items.get('paper');return {x,y,stored}});
await page.mouse.move(1120,220);await page.mouse.down();assert.deepEqual(await state(),{x:1100,y:200,stored:false});
await page.evaluate(()=>document.querySelector('#s').dispatchEvent(new PointerEvent('lostpointercapture',{pointerId:999})));assert.equal(await page.evaluate(()=>document.querySelector('[data-desk-id=paper]').classList.contains('held')),true);
await page.mouse.move(800,400);await page.mouse.up();assert.deepEqual(await state(),{x:780,y:380,stored:false});
await page.mouse.move(120,120);await page.mouse.down();await page.mouse.move(220,220);await page.mouse.up();assert.deepEqual(await page.evaluate(()=>{const {x,y}=window.desk.items.get('manual');return {x,y}}),{x:200,y:200});
await page.evaluate(()=>{window.desk.store('paper');window.desk.clickPlacement=true});await page.mouse.click(1120,220);assert.equal(await page.evaluate(()=>document.querySelector('[data-desk-id=paper]').classList.contains('placing')),true);await page.evaluate(()=>window.desk.cancel());assert.deepEqual(await state(),{x:1100,y:200,stored:true});
await page.evaluate(()=>{window.desk.clickPlacement=false;window.desk.moveTo('paper',700,300)});await page.mouse.click(35,705);assert.equal(await page.evaluate(()=>window.desk.stamp),'approve');await page.mouse.click(720,320);assert.deepEqual(await page.evaluate(()=>window.calls),[['approve','paper']]);
await page.evaluate(()=>{window.calls=[]});await page.mouse.move(35,705);await page.mouse.down();await page.mouse.move(720,320,{steps:5});await page.mouse.up();assert.deepEqual(await page.evaluate(()=>window.calls),[['approve','paper']]);
await page.evaluate(()=>{window.calls=[];window.desk.selectStamp('approve');window.desk.focus('paper')});await page.keyboard.press('Enter');assert.deepEqual(await page.evaluate(()=>window.calls),[['approve','paper']]);
console.log('desk browser interactions passed');await browser.close();
