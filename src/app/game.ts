import { trainingMarkup, type Training } from '../ui/training';
import { makeSteps, cinemaMarkup, updateCinemaFrame } from '../scenes/cinema';
import { proposalMarkup, emergencyMarkup, operationMarkup } from '../ui/documents';
import { shellMarkup } from '../ui/shell';
import { menuMarkup, pauseMarkup, optionsMarkup, creditsMarkup, helpMarkup, finalMarkup, trainingFinishedMarkup } from '../ui/screens';
import { button, nameOf } from '../ui/helpers';
import { loadPreferences, savePreferences } from '../core/preferences';
import { Dispatch, type DispatchBrief } from '../ui/dispatch';
import { manualMarkup, filterManualRoutes, type ManualTab, type RouteFilter } from '../ui/manual';
import { reportMarkup, historyMarkup } from '../ui/report';
import { PROTOCOLS, protocolMarkup } from '../ui/protocols';
import { DESTINATIONS, ENGINEERS, EVENTS, OPERATIONS, RESOURCE_LABELS, format, units, vector } from '../data/catalog';
import { createCampaign, nextProposal, approve, returnProposal, resolveEmergency, authorizeOperation, nextInterlude, finalGrade, type Campaign, type Resolution } from '../game/campaign';
import { Desk } from '../ui/desk';
import { GameClock } from '../core/clock';
import { Sound } from '../audio/sound';
import { assetUrl } from '../core/assets';
import { Camera } from '../scenes/camera';
import { EngineerViewer } from '../characters/engineer-viewer';
import { VisitorSequence } from '../scenes/visitor-sequence';
import { mountMenuMoon, type MoonMenuScene } from '../scenes/menu-moon';

type Phase = 'menu'|'desk'|'transition'|'cinema'|'report'|'emergency'|'operation'|'final';
const $ = <T extends HTMLElement = HTMLElement>(selector:string):T => document.querySelector<T>(selector)!;
let prefs=loadPreferences();
let phase:Phase='menu', campaign:Campaign=createCampaign('not-started'), visible:Campaign=campaign;
let paused=false, lastFocus:HTMLElement|null=null, modal='';
let modalReturnFocus:HTMLElement|null=null;
let screenHintDismissed=false;
let pending:Resolution|null=null, emergencyId='', remaining=30000, contribution=0, alarmSecond=-1;
let protocolSelection:number|null=null, responseLanding=0;
let operationId='', operationChoice:'A'|'B'|null=null, communication=0, messageSent=false;
let bookTab:ManualTab='index', bookDestination:string|null=null, bookPage=0, ledgerPage=0;
let bookReading=false, bookQuery='', bookFilter:RouteFilter='all';
let supplyView:'stock'|'record'='stock', supplyPage=0, comparisonReturn=false, manualFlightSeen='', manualCompared='';
let training:Training|null=null, busy=false, serial=0;
let cine:{steps:Array<{label:string;visual:string;phase:string}>;index:number;elapsed:number;speed:number;revealed:boolean}|null=null;
const clock=new GameClock(), sound=new Sound();
let menuScene:MoonMenuScene|null=null, menuDepartureTimer=0;
// Load both poses while the menu is open so the first pickup has no image swap delay.
for (const pose of ['approve-idle', 'return-idle', 'approve-held', 'return-held']) {
  const image = new Image(); image.src = assetUrl(`assets/images/ui/${pose}.webp`);
}

$('#app').innerHTML=shellMarkup();
const stage=$('#stage');
// The film uses the viewport independently of the scaled, scrollable desk.
$('#app').append($('#cinema'));
$('#cinema').setAttribute('role','dialog');
$('#cinema').setAttribute('aria-modal','true');
$('#cinema').setAttribute('aria-label','Mission cinematic');
const desk=new Desk(stage,{
  announce,
  presentation:{tray:{x:540,y:182,width:520,height:153},previewScale:.38,previewHeight:260,reading:{x:744,y:410},objectScale:.84},
  onPaper:()=>{sound.play('paper');progressTraining();updateTraySlots();},
  onStamp:stampDecision,
  canStamp:(stamp,target)=>!paused&&!busy&&((visitorSequence.snapshot().phase==='ready'&&phase==='desk'&&!!campaign.proposal&&['flight','life','power'].includes(target))||(phase==='operation'&&target==='order'&&stamp==='approve'&&operationChoice!==null)),
  onSelect:()=>{updateTraySlots();},
});
const camera = new Camera(stage, () => desk.cancel());
// The person shares the room's camera and sits between the doorway and desk layers.
const sceneVisitor=document.createElement('div');sceneVisitor.className='scene-visitor';
sceneVisitor.append($('#visitor-portrait'));$('.scene-environment').append(sceneVisitor);
const engineerViewer = new EngineerViewer($('#visitor-portrait'),state=>$('#visitor-portrait').dataset.viewerState=state);
const visitorSequence = new VisitorSequence(sceneVisitor,$('.scene-door'),engineerViewer,()=>setStampAvailability(),duration=>sound.play('door',duration));
window.addEventListener('pagehide',()=>{engineerViewer.dispose();disposeMenuScene();},{once:true});
const dispatch=new Dispatch($('#dispatch'),stage);
applyPreferences();

function announce(message:string){$('#announcement').textContent=message;updateStampStatus();}
function updateStampStatus(){
  const stamp=desk.stamp;
  $('#stamp-status > span').textContent=stamp?`${stamp==='approve'?'APPROVE':'RETURN'} selected · choose a sheet.`:'Compare first. Then stamp your decision.';
}
let toastTimer=0;
function toast(message:string){const el=$('#toast');(modal?$('#modal-layer'):stage).append(el);el.textContent=message;el.hidden=false;clock.cancel(toastTimer);toastTimer=clock.after(3500,()=>el.hidden=true);announce(message);}
function applyPreferences(){menuScene?.setReducedMotion(prefs.reduced);visitorSequence.setReducedMotion(prefs.reduced);sound.volume=prefs.volume;sound.musicVolume=prefs.musicVolume;sound.muted=prefs.muted;desk.clickPlacement=prefs.clickPlacement;stage.classList.toggle('reduced-motion',prefs.reduced);$('#dispatch').classList.toggle('reduced-motion',prefs.reduced);savePreferences(prefs);}
function scale(){
  desk.cancel();const width=window.innerWidth,height=window.innerHeight;
  const compact=width<1000||height<560;
  const fitted=Math.min(width/1600,height/900),s=compact?Math.max(.8,fitted):fitted;
  document.body.classList.toggle('compact-ui',compact);
  document.documentElement.style.setProperty('--ui-scale',String(fitted));
  stage.style.transform=`scale(${s})`;$('#viewport').style.width=`${1600*s}px`;$('#viewport').style.height=`${900*s}px`;
  $('#small-screen').hidden=!compact||phase==='menu'||screenHintDismissed||dispatch.active||bookReading;
}
function updateTraySlots(){
  stage.querySelectorAll<HTMLButtonElement>('[data-action^="restore-"]').forEach(slot=>{
    const item=desk.items.get(slot.dataset.action!.slice(8));
    slot.disabled=phase!=='desk'||!item||!!item.stored||paused||busy;
    slot.classList.toggle('empty',!!item&&!item.stored);
  });
}
function updateTaskGuide(){
  const guide=$('#task-guide');guide.hidden=!!training||!['transition','emergency','operation'].includes(phase);
  if(guide.hidden){guide.replaceChildren();updateTraySlots();return;}
  guide.innerHTML=phase==='emergency'?'<span class="eyebrow">PRIORITY / BASE RESPONSE</span><strong>Choose support. Confirm before time runs out.</strong>':phase==='operation'?'<span class="eyebrow">BASE ORDER / COMPARE COSTS</span><strong>Choose A or B, then approve the order.</strong>':`<span class="eyebrow">${$('.visitor-area').dataset.decision==='approve'?'CLEARANCE ISSUED':'REVISION REQUESTED'}</span><strong>${$('.visitor-area').dataset.decision==='approve'?'A moment to celebrate. Your mission projection is next.':'The engineer is taking the request back for revision.'}</strong>`;
  updateTraySlots();
}
function preserveControlFocus(root:HTMLElement,render:()=>void){
  const active=root.contains(document.activeElement)?document.activeElement as HTMLElement:null;
  const action=active?.dataset.action;render();
  if(active){const replacement=Array.from(root.querySelectorAll<HTMLElement>('[data-action]')).find(el=>el.dataset.action===action&&!el.matches(':disabled'));(replacement??root).focus({preventScroll:true});}
}
window.addEventListener('resize',scale);
sound.setHidden(document.hidden);
document.addEventListener('visibilitychange',()=>{sound.setHidden(document.hidden);if(document.hidden&&phase!=='menu')pause();});
window.addEventListener('blur',()=>{desk.cancel();if(phase!=='menu')pause();});
document.addEventListener('pointerdown',()=>sound.unlock());
document.addEventListener('keydown',()=>sound.unlock());

function mount(id:string,html:string,classes:string,x:number,y:number,width:number,height:number,kind:'paper'|'book'|'ledger'|'emergency'|'order',stored=false){
  desk.remove(id);const el=document.createElement('article');el.id=id;el.className=classes;el.innerHTML=html;
  el.setAttribute('aria-label',({flight:'Flight plan',life:'Life support request',power:'Propulsion and energy request',manual:'Mission manual',ledger:'Inventory and turn log',emergency:'Emergency response',order:'Internal base order',worksheet:'Technician worksheet'} as Record<string,string>)[id]??id);
  $('#objects').append(el);desk.register({id,el,x,y,width,height,kind,stored,tray:kind==='paper'?{x,y}:undefined});return el;
}
function showVisitor(id:string){
  $('.visitor-area').dataset.ready='false';delete $('.visitor-area').dataset.decision;
  $('.visitor-badge > span').textContent='MISSION ENGINEER';
  const engineer=ENGINEERS.find(e=>e.id===id)??ENGINEERS[1];
  $('#visitor-portrait').dataset.engineer=engineer.id;
  $('.visitor-area').style.setProperty('--engineer-color',engineer.color);
  $('#visitor-name').textContent=engineer.name;$('#speech').textContent=engineer.greeting;
  void visitorSequence.show(engineer.id,sound.ready());
}
function updateStatus(){
  const choices=visible.operationChoices;
  const success=visible.approvals?`${Math.round(visible.completed.length/visible.approvals*100)}%`:'—';
  $('#performance').innerHTML=`<div class="monitor-metric"><strong>${visible.completed.length}<span>/5</span></strong><span>DESTINATIONS</span></div><div class="monitor-metric"><strong>${success}</strong><span>MISSION SUCCESS</span></div><div class="monitor-progress" role="img" aria-label="${visible.completed.length} of 5 destinations complete">${Array.from({length:5},(_,i)=>`<i class="${i<visible.completed.length?'complete':''}"></i>`).join('')}</div>`;
  const systems=[
    {label:'LIFE SUPPORT',state:choices.B01==='A'?'Regenerative':choices.B01==='B'?'Reserve system':'Habitat ready',ready:true},
    {label:'SHELTER',state:choices.B02?'Prepared':'Not prepared',ready:!!choices.B02},
    {label:'FOOD SUPPLY',state:choices.B03==='A'?(visible.completed.length>=4?'Harvest used':'Crop growing'):choices.B03==='B'?'Stored rations':'Pending',ready:!!choices.B03},
  ];
  $('#base-status').innerHTML=systems.map(system=>`<div class="monitor-system ${system.ready?'ready':''}"><i aria-hidden="true"></i><span>${system.label}</span><strong>${system.state}</strong></div>`).join('');
  if(desk.items.has('manual'))renderManual();
}
function setStampAvailability(){
  stage.dataset.phase=phase;
  stage.inert=phase==='cinema'||!!modal||dispatch.active||bookReading;
  const visitorReady=visitorSequence.snapshot().phase==='ready';
  const ready=(phase==='desk'&&!!campaign.proposal&&visitorReady)||(phase==='operation'&&!!operationChoice);
  stage.querySelectorAll<HTMLButtonElement>('[data-action="camera-room"],[data-action="camera-desk"]').forEach(b=>b.disabled=paused||busy||phase!=='desk');
  $<HTMLButtonElement>('[data-stamp-tool="approve"]').disabled=paused||busy||!ready;
  $<HTMLButtonElement>('[data-stamp-tool="return"]').disabled=paused||busy||phase!=='desk'||!visitorReady;
  $('[data-stamp-tool="return"]').title=phase==='operation'?'Internal order: choose one option and approve it.':'Return the proposal without spending resources';
  $('[data-stamp-tool="approve"] small').textContent=phase==='operation'?'AUTHORIZE BASE ORDER':'AUTHORIZE RESOURCES';
  desk.enabled=!paused&&!busy&&!modal&&!bookReading&&['desk','emergency','operation'].includes(phase);
  stage.querySelectorAll<HTMLElement>('.station-header,.desk-tools,.desk-rail,.camera-controls,.room-tray,.document-tray,#training-guide').forEach(el=>el.inert=phase==='cinema');
  $('#objects').inert=camera.position==='room'||phase==='cinema';
  updateTaskGuide();updateStampStatus();
}
function start(seed?:string){
  training=null;resetSession();camera.set('room');campaign=createCampaign(seed?.trim()||crypto.randomUUID().slice(0,8));visible=campaign;
  stage.classList.remove('menu-mode');closeModal();campaign=nextProposal(campaign);visible=campaign;phase='desk';renderProposal();updateStatus();setStampAvailability();
  scale();announce('Your shift begins. Inspect the desk, read the route, compare the manual and check inventory before stamping.');
  $('[data-action="camera-desk"]').focus({preventScroll:true});
}
function resetSession(){sound.setEngine(null);setManualReading(false,false);dispatch.cancel();responseLanding=0;$('#app').scrollTo(0,0);delete $('.visitor-area').dataset.decision;stage.classList.remove('paused');clock.clear();visitorSequence.reset();clock.setPaused(false);sound.pause(false);paused=false;busy=false;pending=null;cine=null;delete stage.dataset.incident;emergencyId='';operationId='';operationChoice=null;communication=0;messageSent=false;desk.clear();bookTab='index';bookDestination=null;bookPage=0;bookQuery='';bookFilter='all';ledgerPage=0;supplyView='stock';supplyPage=0;comparisonReturn=false;manualFlightSeen='';manualCompared='';$('#cinema').hidden=true;$('#training-guide').hidden=true;$('#toast').hidden=true;}
function renderProposal(){
  for(const id of ['flight','life','power','order','emergency','worksheet'])desk.remove(id);
  const p=campaign.proposal;if(!p)return;manualFlightSeen='';manualCompared='';comparisonReturn=false;
  const d=DESTINATIONS.find(d=>d.id===p.destinationId)!;showVisitor(p.engineerId);phase='desk';busy=false;
  const papers=proposalMarkup(p,d);
  
  
  mount('flight',papers[0],'paper flight-paper',571,220,332,424,'paper',true);
  mount('life',papers[1],'paper life-paper',737,220,332,424,'paper',true);
  mount('power',papers[2],'paper power-paper',903,220,332,424,'paper',true);
  setStampAvailability();renderTraining();if(desk.items.has('manual'))renderManual();
}
function openManual(){
  camera.set('desk');updateTaskGuide();
  let item=desk.items.get('manual');
  if(!item){mount('manual','','manual',42,330,760,550,'book');item=desk.items.get('manual')!;}
  item.el.hidden=false;
  if(document.body.classList.contains('compact-ui')||bookReading)setManualReading(true);
  else{renderManual();desk.focus('manual');}
  sound.play('page');
  if(training?.lesson===1&&training.step===1){training.step=2;renderTraining();}progressTraining();
}
function setManualReading(reading:boolean,focus=true){
  const item=desk.items.get('manual');if(!item||!reading&&!bookReading)return;
  desk.cancel();bookReading=reading;
  const reader=$('#manual-reader');reader.hidden=!reading;reader.inert=!!modal;
  (reading?reader:$('#objects')).append(item.el);
  stage.inert=!!modal||dispatch.active||bookReading;
  $('#reader-timer').hidden=!reading||phase!=='emergency';
  $('#reader-timer').textContent=`${Math.ceil(remaining/1000)}s · Emergency timer continues · Pause stops time`;
  $('#small-screen').hidden=!document.body.classList.contains('compact-ui')||screenHintDismissed||bookReading||dispatch.active;
  setStampAvailability();renderManual();
  if(focus){if(reading)item.el.querySelector<HTMLElement>('[data-action="manual-reading"]')?.focus({preventScroll:true});else desk.focus('manual');}
}
function closeManual(){
  desk.cancel();setManualReading(false,false);
  const item=desk.items.get('manual');if(item)item.el.hidden=true;
  $('.book-tool').focus({preventScroll:true});
}
function knownIncidents(){
  const ids=new Set(visible.history.filter(entry=>entry.kind==='emergency').map(entry=>entry.event));
  if(phase==='emergency'&&emergencyId)ids.add(emergencyId);
  return EVENTS.filter(event=>ids.has(event.id));
}
function renderManual(){
  const item=desk.items.get('manual');if(!item)return;
  supplyPage=Math.min(supplyPage,Math.max(0,Math.ceil(visible.history.length/4)-1));
  preserveControlFocus(item.el,()=>{
    item.el.innerHTML=manualMarkup({tab:bookTab,destination:bookDestination,page:bookPage,query:bookQuery,filter:bookFilter,pinned:!!item.pinned,reading:bookReading,received:knownIncidents(),activeIncident:phase==='emergency'?emergencyId:null,proposal:phase==='desk'?campaign.proposal:null,stock:visible.stock,history:visible.history,supplyView,recordPage:supplyPage});
    filterManualRoutes(item.el,bookQuery,bookFilter);
    item.el.querySelector('[data-action="book-prev"]')?.setAttribute('aria-label','Previous manual page');
    item.el.querySelector('[data-action="book-next"]')?.setAttribute('aria-label','Next manual page');
  });
}
function openSupplies(view:'stock'|'record'){
  if(busy)return;
  camera.set('desk');updateTaskGuide();
  bookTab='supplies';supplyView=view;supplyPage=0;comparisonReturn=false;
  const item=desk.items.get('manual');
  if(!item||item.el.hidden||document.body.classList.contains('compact-ui')&&!bookReading)openManual();else{renderManual();desk.raise('manual');}
  const root=desk.items.get('manual')?.el;
  if(root&&(!root.contains(document.activeElement)||document.activeElement===root))root.querySelector<HTMLElement>('.guide-content')?.focus({preventScroll:true});
  progressTraining();sound.play('page');
}
function navigateManual(tab:ManualTab){
  bookTab=tab;bookPage=0;
  if(tab==='flight'&&phase==='desk'&&campaign.proposal)manualFlightSeen=campaign.proposal.id;
  if(tab==='compare'&&phase==='desk'&&campaign.proposal&&bookDestination)manualCompared=campaign.proposal.id;
  renderManual();const root=desk.items.get('manual')?.el;
  if(root&&document.activeElement===root)root.querySelector<HTMLElement>('.guide-content')?.focus({preventScroll:true});
  progressTraining();sound.play('page');
}
function chooseManualReference(compare=false){
  comparisonReturn=compare;bookDestination=null;bookQuery='';bookFilter='all';navigateManual('destinations');
}
function logEntries(entries:Resolution[],page:number){return historyMarkup(entries,page,nameOf);}

function stampDecision(stamp:'approve'|'return',target:string){
  if(busy||paused)return;
  if(phase==='operation'){
    if(stamp!=='approve'||!operationChoice||target!=='order')return;
    const tx=authorizeOperation(campaign,operationId,operationChoice,`order-${++serial}`);campaign=tx.state;pending=tx.resolution;beginStamp(stamp,target,()=>startCinema(tx.resolution));return;
  }
  if(phase!=='desk'||!campaign.proposal)return;
  if(training?.lesson===1 && (stamp!=='approve'||training.step<5)){toast(training.step<5?'Finish the comparison steps before stamping.':'This practice request meets every minimum. Try the Approve stamp.');return;}
  if(training?.lesson===2&&stamp==='approve')training.error=true;
  const tx=stamp==='approve'?approve(campaign,`mission-${++serial}`):returnProposal(campaign,`return-${++serial}`);
  campaign=tx.state;pending=tx.resolution;
  beginStamp(stamp,target,()=>{
    if(stamp==='return'){
      visible=campaign;updateStatus();
      if(training?.lesson===2){setupTraining(3);return;}
      pending=null;advance();
    }else startCinema(tx.resolution);
  });
}
function beginStamp(stamp:'approve'|'return',target:string,done:()=>void){
  busy=true;phase='transition';$('.visitor-area').dataset.decision=stamp;
  $('.visitor-badge > span').textContent=stamp==='approve'?'CLEARANCE ISSUED':'REVISION REQUESTED';
  $('#speech').textContent=stamp==='approve'?"Thank you, officer. We're cleared to go!":"Understood. We'll revise these papers.";
  setStampAvailability();
  const el=desk.items.get(target)?.el;if(el){const ink=el.querySelector('.ink-mark')??el.appendChild(Object.assign(document.createElement('div'),{className:'ink-mark'}));ink.textContent=stamp==='approve'?'AUTHORIZED':'RETURNED';ink.classList.add('visible',stamp);sound.play('stamp');}
  const collecting=['flight','life','power','order'].map(id=>desk.items.get(id)?.el);
  clock.after(260,()=>{for(const el of collecting)if(el?.isConnected)el.classList.add('collecting');});
  const finish=()=>{for(const id of ['flight','life','power','order'])desk.remove(id);done();};
  camera.set('room');
  // Reaction depends only on the stamp. Mission success stays hidden until reveal().
  visitorSequence.react(stamp,finish);
}
function advance(){
  busy=false;pending=null;const next=nextInterlude(campaign);visible=campaign;updateStatus();
  if(next.kind==='final'){showFinal(next.grade);return;}
  if(next.kind==='emergency'){showEmergency(next.eventId);return;}
  if(next.kind==='operation'){showOperation(next.operationId);return;}
  campaign=nextProposal(campaign);visible=campaign;renderProposal();
}
function receiveDispatch(brief:DispatchBrief,id:string){
  setManualReading(false,false);busy=true;responseLanding=0;desk.cancel();
  const item=desk.items.get(id)!;item.el.classList.add('dispatch-pending');
  dispatch.show(brief,prefs.reduced,()=>{
    busy=false;responseLanding=prefs.reduced?0:650;stage.inert=!!modal;$('#small-screen').hidden=!document.body.classList.contains('compact-ui')||screenHintDismissed;
    item.el.classList.remove('dispatch-pending');item.el.classList.add('dispatch-arriving');
    if(brief.kind==='operation'&&brief.code==='B02'){communication=2600;messageSent=true;}
    setStampAvailability();renderTraining();desk.focus(id);sound.play('paper');
    announce(brief.kind==='emergency'?(brief.practice?'Emergency practice. No time limit.':'Response panel ready. Thirty seconds. Choose support, then confirm.'):'Base order ready. Compare the two plans, then stamp your choice.');
  });
  stage.inert=true;$('#small-screen').hidden=true;setStampAvailability();renderTraining();
  sound.play(brief.kind==='emergency'?'alert':'transmission');
  announce(`${brief.kind==='emergency'?'Survival alert':'Base operations'}: ${brief.title}. Incoming transmission.`);
}
function showEmergency(id:string){
  dispatch.cancel();camera.set('desk');
  phase='emergency';busy=false;emergencyId=id;remaining=30000;contribution=0;alarmSecond=-1;protocolSelection=null;desk.remove('order');desk.remove('worksheet');stage.dataset.incident=id;
  const e=EVENTS.find(e=>e.id===id)!;const max=Math.min(100,Math.floor(campaign.stock[e.resource]*100/e.cost));
  showVisitor('victor');$('#speech').textContent='An incident needs your attention. Choose a contribution, then confirm.';
  const practice=training?.lesson===3&&training.practice!=='timed';
  mount('emergency',emergencyMarkup(id,e,max,practice),'emergency',200,300,880,550,'emergency');
  if(desk.items.has('manual'))renderManual();
  receiveDispatch({kind:'emergency',code:id,title:e.title,description:e.description,resource:e.resource,system:`${RESOURCE_LABELS[e.resource].label.toUpperCase()} / RESPONSE REQUIRED`,practice},'emergency');
}
function openWorksheet(){
  if(phase!=='emergency'||!PROTOCOLS[emergencyId])return;
  const existing=desk.items.get('worksheet');if(existing){desk.focus('worksheet');return;}
  mount('worksheet',protocolMarkup(emergencyId,protocolSelection),'paper protocol-sheet dispatch-arriving',1030,330,500,535,'book');
  desk.focus('worksheet');sound.play('page');
}
function updateContribution(){
  const slider=$<HTMLInputElement>('#contribution');if(!slider)return;contribution=Number(slider.value);
  const e=EVENTS.find(e=>e.id===emergencyId)!;const actual=Math.min(campaign.stock[e.resource],Math.floor(e.cost*contribution/100));
  slider.setAttribute('aria-valuetext',`${contribution}% contribution, ${Math.round(actual/e.cost*100)}% chance of recovery`);
  $('#contribution-percent').textContent=`${contribution}%`;$('#contribution-amount').textContent=`${format(actual)} ${RESOURCE_LABELS[e.resource].unit} ${RESOURCE_LABELS[e.resource].label.toLowerCase()}`;$('#probability').textContent=`${Math.round(actual/e.cost*100)}%`;
}
function confirmEmergency(expired=false){
  if(phase!=='emergency'||busy||paused)return;
  setManualReading(false,false);
  if(training?.lesson===3&&training.practice!=='timed'){
    const required=training.practice==='half'?50:100;
    if(contribution!==required){toast(`For this practice step, select ${required}%.`);return;}
    if(training.practice==='half'){training.practice='full';toast('500 kg gives a 50% chance. Now try a guaranteed recovery.');}
    else{training.practice='timed';toast('Full support guarantees recovery. Now try the real 30-second response.');}
    showEmergency('E02');return;
  }
  busy=true;setStampAvailability();const tx=resolveEmergency(campaign,emergencyId,expired?0:contribution,`incident-${++serial}`);campaign=tx.state;pending=tx.resolution;
  sound.play('confirm');desk.cancel();
  desk.items.get('emergency')?.el.classList.add('dispatch-sent');
  announce('Response sent. The intervention team is taking over.');
  clock.after(prefs.reduced?120:480,()=>{desk.remove('emergency');desk.remove('worksheet');delete stage.dataset.incident;startCinema(tx.resolution);});
}
function showOperation(id:string){
  dispatch.cancel();camera.set('desk');
  phase='operation';busy=false;operationId=id;operationChoice=null;desk.remove('emergency');
  const op=OPERATIONS.find(o=>o.id===id)!;showVisitor('adan');$('#speech').textContent='A decision for the base. Compare the costs, choose one option, then approve this order.';
  mount('order',operationMarkup(id,op),'order paper',360,290,860,570,'order');
  communication=0;messageSent=false;
  receiveDispatch({kind:'operation',code:id,title:op.title,description:id==='B01'?'The habitat needs a life-support plan. Choose how to keep the crew supplied.':id==='B02'?'Prepare a safe shelter for the crew and decide which activities can continue.':'The crew needs a food-supply plan. Compare growing locally with using stored rations.',resource:id==='B01'?'oxygen':id==='B02'?'energy':'food',system:'HABITAT / PLANNING REQUEST'},'order');
}
function chooseOperation(choice:'A'|'B'){
  if(phase!=='operation'||busy)return;operationChoice=choice;
  document.querySelectorAll<HTMLElement>('.order-choice').forEach(el=>{const active=el.dataset.action===`choice-${choice}`;el.classList.toggle('chosen',active);el.setAttribute('aria-pressed',String(active));const label=el.querySelector('.choice-state');if(label)label.textContent=active?'✓ Selected · approve to authorize':'Select this plan ↗';});
  $('#order-selected').textContent=`OPTION ${choice} · READY TO STAMP`;setStampAvailability();sound.play('confirm');announce(`Option ${choice} selected. Apply the Approve stamp to this order.`);
}


function startCinema(r:Resolution){
  setManualReading(false,false);dispatch.cancel();phase='cinema';busy=true;desk.cancel();setStampAvailability();$('#training-guide').hidden=true;
  for(const item of desk.items.values())item.el.hidden=true;
  cine={steps:makeSteps(r),index:0,elapsed:0,speed:1,revealed:false};pending=r;
  $('#cinema').hidden=false;$('#cinema').inert=false;$('#objects').inert=true;renderCinema();const next=$('#cinema [data-action="skip"]');next.focus({preventScroll:true});
}
function renderCinema(){
  if(!cine||!pending)return;
  const c=cine,r=pending;
  preserveControlFocus($('#cinema'),()=>{$('#cinema').innerHTML=cinemaMarkup(c,r,visible);});
  $('#cinema [data-action="speed"]').setAttribute('aria-pressed',String(c.speed===4));
  $('#cinema').dataset.speed=String(c.speed);
  updateCinemaFrame($('#cinema'),c,prefs.reduced);
  const visual=c.steps[c.index].visual;
  sound.setEngine(!c.revealed&&r.kind==='mission'?(['ascent','landing'].includes(visual)?'module':['outbound','return'].includes(visual)?'transport':null):null);
  if(prefs.reduced)$('#cinema').classList.add('static');else $('#cinema').classList.remove('static');
}
function reveal(){if(!cine||!pending||cine.revealed)return;sound.setEngine(null);cine.revealed=true;cine.elapsed=0;visible=campaign;updateStatus();sound.play(pending.success?'success':'failure');renderCinema();announce(pending.explanation);}
function showReport(){
  if(!pending)return;sound.setEngine(null);const r=pending;phase='report';cine=null;$('#cinema').hidden=true;visible=campaign;busy=false;setStampAvailability();
  showModal('report',reportMarkup(r,nameOf(r.destination),!!training&&(training.error||r.fatal)));
}
function archive(){
  closeModal();for(const id of ['manual']){const item=desk.items.get(id);if(item)item.el.hidden=false;}
  if(training){const lesson=training.lesson;if(training.error||pending?.fatal){setupTraining(lesson);return;}if(lesson===1){setupTraining(2);return;}if(lesson===3){setupTraining(4);return;}if(lesson===4){trainingFinished();return;}}
  advance();
}
function showFinal(grade:'certificate'|'office'|'dismissal'){
  phase='final';busy=false;training=null;setStampAvailability();const title=grade==='certificate'?'Clear skies, officer.':grade==='office'?'A new assignment.':'Your shift has ended.';
  const sub=grade==='certificate'?'CERTIFICATE OF LUNAR SERVICE':grade==='office'?'TRANSFER TO OPERATIONS OFFICE':'NOTICE OF DISMISSAL';
  showModal('final',finalMarkup(grade,campaign,title,sub));ledgerPage=0;renderFinalLog();
}
function renderFinalLog(){const entries=[...campaign.history].reverse(),pages=Math.max(1,Math.ceil(entries.length/4));ledgerPage=Math.max(0,Math.min(ledgerPage,pages-1));$('#final-log').innerHTML=logEntries(entries,ledgerPage);$('#final-page').textContent=`${ledgerPage+1} / ${pages}`;$<HTMLButtonElement>('[data-action="final-prev"]').disabled=ledgerPage===0;$<HTMLButtonElement>('[data-action="final-next"]').disabled=ledgerPage===pages-1;}

function setupTraining(lesson:number){
  manualFlightSeen='';manualCompared='';comparisonReturn=false;
  setManualReading(false,false);dispatch.cancel();clock.clear();desk.cancel();closeModal();$('#cinema').hidden=true;cine=null;pending=null;busy=false;paused=false;clock.setPaused(false);sound.pause(false);
  stage.classList.remove('paused');camera.set('desk');training={lesson,step:0,practice:'half',error:false};stage.classList.remove('menu-mode');
  for(const id of ['flight','life','power','order','emergency','worksheet'])desk.remove(id);
  campaign=createCampaign(`training-${lesson}`);campaign.stock=vector(200000,400000,100000,20000000,20000000);campaign.initial={...campaign.stock};campaign.events.forEach(e=>e.resolved=true);
  if(lesson===1||lesson===2){const d=DESTINATIONS.find(d=>d.id===(lesson===1?'earth':'mars'))!;campaign.proposal={id:`practice-${lesson}`,destinationId:d.id,engineerId:lesson===1?'adan':'leo',minimum:{...d.minimum},requested:{...d.minimum,...(lesson===2?{food:units(6900)}:{})}};visible=campaign;renderProposal();}
  if(lesson===3){campaign.events=[{id:'E02',afterSuccess:0,resolved:false}];visible=campaign;showEmergency('E02');}
  if(lesson===4){campaign.completed=['earth'];visible=campaign;showOperation('B01');}
  updateStatus();renderTraining();setStampAvailability();scale();if(lesson<3)desk.items.get('flight')?.el.focus({preventScroll:true});
}
function progressTraining(){
  if(!training)return;
  if(training.lesson===1){
    if(training.step===0&&(manualFlightSeen===campaign.proposal?.id||!desk.items.get('flight')?.stored)){training.step=1;renderTraining();}
    if(training.step===1&&desk.items.get('manual')&&!desk.items.get('manual')!.el.hidden){training.step=2;renderTraining();}
    if(training.step===3&&(manualCompared===campaign.proposal?.id||['flight','life','power'].every(id=>desk.items.get(id)?.stored===false))){training.step=4;renderTraining();}
    if(training.step===4&&bookTab==='supplies'&&supplyView==='stock'){training.step=5;renderTraining();}
  }
}
function renderTraining(){
  const guide=$('#training-guide');guide.hidden=!training||['cinema','report'].includes(phase);if(!training)return;guide.innerHTML=trainingMarkup(training);trainingHint='';
}
// The mask follows moving desk objects and also works over the full-screen manual and dispatch.
let trainingHint = '';
function updateTrainingSpotlight(){
  const spotlight=$<SVGElement & HTMLElement>('#training-spotlight'), guide=$('#training-guide');
  const active=!!training&&!['cinema','report','menu','final'].includes(phase)&&!modal&&!paused;
  spotlight.toggleAttribute('hidden',!active);guide.hidden=!active;
  if(active&&training){
    let selectors:string[]=[];let hint='';
    if(dispatch.active){selectors=['#dispatch [data-action="open-dispatch"]'];hint=training.lesson===4?'Open the plans.':'Open the response.';}
    else if(training.lesson===1){
      if(training.step===0)selectors=['#flight'];
      else if(training.step===1)selectors=['.book-tool'];
      else if(training.step===2){
        if(bookTab==='destinations'){selectors=['[data-action="destination-earth"]'];hint='Choose Earth.';}
        else {selectors=['#manual [data-action="book-destinations"]'];hint='Open Routes.';}
      }else if(training.step===3){
        if(bookReading){selectors=['[data-action="manual-sheet-life"]','[data-action="manual-sheet-power"]'];hint='Open both supply sheets.';}
        else selectors=['#life[data-stored="true"]','#power[data-stored="true"]'];
        if(!selectors.some(selector=>document.querySelector(selector)))selectors=['#life','#power'];
      }else if(training.step===4){selectors=['#manual [data-action="book-supplies"]','#manual [data-action="manual-stock"]'];hint='Open Inventory.';}
      else if(bookReading){selectors=['#manual [data-action="manual-reading"]'];hint='Back to the desk.';}
      else if(desk.stamp){selectors=['#flight','#life','#power'];hint='Tap a sheet to stamp it.';}
      else selectors=['[data-stamp-tool="approve"]'];
    }else if(training.lesson===2){
      if(desk.stamp){selectors=['#flight','#life','#power'];hint='Tap a sheet to return it.';}
      else selectors=['[data-stamp-tool="return"]'];
    }else if(training.lesson===3){
      const required=training.practice==='half'?50:100;
      if(training.practice==='timed'||contribution===required){selectors=['#contribution','[data-action="confirm-emergency"]'];}
      else selectors=['#contribution'];
    }else if(!operationChoice){selectors=['[data-action="choice-A"]','[data-action="choice-B"]'];hint='Choose a plan.';}
    else if(desk.stamp){selectors=['#order'];hint='Tap the order to approve it.';}
    else {selectors=['[data-stamp-tool="approve"]'];hint='Take APPROVE.';}
    const key=`${training.lesson}/${training.step}/${training.practice}/${hint}`;
    if(key!==trainingHint){guide.innerHTML=trainingMarkup(training,hint||undefined);trainingHint=key;}
    const rects=selectors.flatMap(selector=>Array.from(document.querySelectorAll<HTMLElement>(selector))).filter(el=>el.checkVisibility()&&!el.closest('[hidden]')).map(el=>el.getBoundingClientRect()).filter(r=>r.width>0&&r.height>0&&r.bottom>0&&r.right>0&&r.left<innerWidth&&r.top<innerHeight);
    const holes=rects.map(r=>{const x=Math.max(0,r.left-6),y=Math.max(0,r.top-6),w=Math.min(innerWidth,r.right+6)-x,h=Math.min(innerHeight,r.bottom+6)-y;return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="black"/>`;}).join('');
    const outlines=rects.map(r=>`<rect x="${r.left-6}" y="${r.top-6}" width="${r.width+12}" height="${r.height+12}" rx="10"/>`).join('');
    spotlight.innerHTML=`<defs><mask id="training-mask"><rect width="100%" height="100%" fill="white"/>${holes}</mask></defs><rect width="100%" height="100%" fill="rgba(3,17,24,.78)" mask="url(#training-mask)"/><g fill="none" stroke="#ffe39a" stroke-width="3">${outlines}</g>`;
    const topOverlap=rects.some(r=>r.top<145&&r.bottom>0);guide.classList.toggle('training-guide-bottom',topOverlap);
  }else trainingHint='';
  requestAnimationFrame(updateTrainingSpotlight);
}
requestAnimationFrame(updateTrainingSpotlight);
function trainingFinished(){training=null;phase='menu';$('#training-guide').hidden=true;setStampAvailability();showModal('training-finished',trainingFinishedMarkup());}

function modalFocusables(){return Array.from($('#modal-layer').querySelectorAll<HTMLElement>('button:not(:disabled),input:not(:disabled),a[href],summary,[tabindex="0"]')).filter(el=>el.checkVisibility()&&!el.closest('[hidden],[inert]')&&(!el.closest('details:not([open])')||el.matches('summary')));}
function showModal(name:string,html:string){
  disposeMenuScene();
  if(!modal)modalReturnFocus=document.activeElement as HTMLElement;
  modal=name;const layer=$('#modal-layer');stage.append($('#toast'));layer.innerHTML=html;layer.hidden=false;layer.scrollTop=0;layer.dataset.modal=name;
  layer.setAttribute('role','dialog');layer.setAttribute('aria-modal','true');layer.tabIndex=-1;
  const heading=layer.querySelector('h1');if(heading){heading.id='modal-title';layer.setAttribute('aria-labelledby','modal-title');}
  else{layer.removeAttribute('aria-labelledby');layer.setAttribute('aria-label','Space Papers');}
  stage.inert=true;$('#cinema').inert=true;$('#manual-reader').inert=true;$('#dispatch').inert=true;desk.enabled=false;$('#small-screen').hidden=true;
  if(name==='menu')mountOrbitalMenu(layer.querySelector<HTMLElement>('.orbital-menu')!);
  queueMicrotask(()=>{const first=name==='menu'?layer.querySelector<HTMLElement>('[data-action="new-shift"]'):modalFocusables()[0];(first??layer).focus({preventScroll:true});});
}
function closeModal(){
  disposeMenuScene();
  modal='';const layer=$('#modal-layer');stage.append($('#toast'));layer.hidden=true;layer.innerHTML='';stage.inert=phase==='cinema'||dispatch.active||bookReading;$('#cinema').inert=false;$('#manual-reader').inert=false;$('#dispatch').inert=false;$('#small-screen').hidden=!document.body.classList.contains('compact-ui')||phase==='menu'||screenHintDismissed||dispatch.active||bookReading;
  $('#objects').inert=camera.position==='room'||phase==='cinema';
  const target=modalReturnFocus;modalReturnFocus=null;
  if(target?.isConnected&&!target.closest('[hidden],[inert]'))target.focus({preventScroll:true});
}
function disposeMenuScene(){
  window.clearTimeout(menuDepartureTimer);menuDepartureTimer=0;menuScene?.dispose();menuScene=null;
}
function mountOrbitalMenu(root:HTMLElement){
  menuScene=mountMenuMoon(root,prefs.reduced);
  const soundButton=root.querySelector<HTMLButtonElement>('[data-menu-control="sound"]')!;
  const updateSound=()=>{soundButton.setAttribute('aria-pressed',String(prefs.muted));soundButton.setAttribute('aria-label',prefs.muted?'Unmute audio':'Mute audio');};updateSound();
  root.addEventListener('click',event=>{
    const control=(event.target as HTMLElement).closest<HTMLElement>('[data-menu-control]')?.dataset.menuControl;
    if(control==='home'){event.preventDefault();menuScene?.reset();}
    if(control==='sound'){prefs.muted=!prefs.muted;applyPreferences();updateSound();}
    if(control==='reset')menuScene?.reset();
    if(control==='lights'){menuScene?.replayLights();const button=root.querySelector<HTMLButtonElement>('[data-menu-control="rotate"]')!;button.setAttribute('aria-pressed','false');button.setAttribute('aria-label','Pause Moon rotation');button.textContent='Ⅱ';}
    if(control==='rotate'){
      const button=(event.target as HTMLElement).closest<HTMLButtonElement>('button')!;
      const paused=button.getAttribute('aria-pressed')!=='true';menuScene?.setPaused(paused);
      button.setAttribute('aria-pressed',String(paused));button.setAttribute('aria-label',paused?'Resume Moon rotation':'Pause Moon rotation');button.textContent=paused?'▷':'Ⅱ';
    }
    if(control==='replay'){
      const form=root.querySelector<HTMLFormElement>('.orbital-replay')!;form.hidden=!form.hidden;
      root.querySelector('[data-menu-control="replay"]')!.setAttribute('aria-expanded',String(!form.hidden));
      if(!form.hidden)form.querySelector('input')!.focus();
    }
  });
  root.querySelector('form')!.addEventListener('submit',event=>{event.preventDefault();const seed=root.querySelector<HTMLInputElement>('#seed-input')!.value;departMenu(()=>start(seed));});
}
function departMenu(launch:()=>void){
  if(menuDepartureTimer)return;
  const root=$('#modal-layer').querySelector<HTMLElement>('.orbital-menu');
  if(!root||prefs.reduced){launch();return;}
  root.classList.add('is-departing');root.inert=true;menuScene?.depart();
  announce('Shift authorized. Entering lunar operations.');
  menuDepartureTimer=window.setTimeout(()=>{menuDepartureTimer=0;launch();},750);
}
function menu(){resetSession();camera.set('room');training=null;phase='menu';stage.classList.add('menu-mode');setStampAvailability();
  scale();showModal('menu',menuMarkup());
}
function pause(){if(phase==='menu'||paused)return;paused=true;lastFocus=document.activeElement as HTMLElement;desk.cancel();clock.setPaused(true);sound.pause(true);stage.classList.add('paused');setStampAvailability();showPause();}
function showPause(){showModal('pause',pauseMarkup());}
function resume(){closeModal();paused=false;stage.classList.remove('paused');clock.setPaused(false);sound.pause(false);setStampAvailability();if(phase==='report')showReport();else if(phase==='final')showFinal(finalGrade(campaign.completed.length,campaign.approvals,!!campaign.terminal));else lastFocus?.isConnected&&lastFocus.focus({preventScroll:true});}
function options(){showModal('options',optionsMarkup(prefs));}
function credits(){showModal('credits',creditsMarkup());}
function help(){if(phase!=='menu'&&!paused)pause();showModal('help',helpMarkup());}

document.addEventListener('click',event=>{
  const target=(event.target as HTMLElement).closest<HTMLElement>('[data-action],[data-stamp-target]');if(!target)return;
  if(target.dataset.stampTarget){desk.applySelectedStamp(target.dataset.stampTarget);return;}
  const action=target.dataset.action!;if((target as HTMLButtonElement).disabled)return;
  if(action==='camera-desk'||action==='camera-room'){if(!paused&&!busy&&phase==='desk'){camera.set(action==='camera-desk'?'desk':'room', true);updateTaskGuide();announce(action==='camera-desk'?'Desk view. Read the route, compare the manual and check inventory.':'Room view.');}return;}
  if(action==='new-shift'){departMenu(()=>start());return;}if(action==='training'){departMenu(()=>{resetSession();setupTraining(1);});return;}
  if(action==='replay'){const seed=$<HTMLInputElement>('#seed-input')?.value;departMenu(()=>start(seed));return;}
  if(action==='menu'){menu();return;}if(action==='pause'){pause();return;}if(action==='resume'){resume();return;}
  if(action==='options'){options();return;}if(action==='credits'){credits();return;}if(action==='settings-done'){if(paused)showPause();else menu();return;}
  if(action==='dismiss-screen-hint'){screenHintDismissed=true;$('#small-screen').hidden=true;return;}
  if(action==='fullscreen'){if(!document.documentElement.requestFullscreen){toast('Full screen is unavailable in this browser.');return;}if(document.fullscreenElement)void document.exitFullscreen().catch(()=>toast('Full screen is unavailable.'));else void document.documentElement.requestFullscreen().catch(()=>toast('Full screen is unavailable. Enlarge the browser window instead.'));return;}
  if(action==='leave'||action==='exit-training'){if(!paused&&phase!=='menu')pause();showModal('leave',`<section class="small-panel"><h1>Leave this shift?</h1><p>Your current campaign will end. Only preferences are saved.</p>${button('Keep playing','resume','primary')}${button('End shift and leave','menu')}</section>`);return;}
  if(action==='help'){help();return;}if(action==='repeat-lesson'&&training){setupTraining(training.lesson);return;}
  if(paused)return;
  if(action==='open-dispatch'){dispatch.open();return;}
  if(action==='archive'){archive();return;}if(action==='speed'&&cine){cine.speed=cine.speed===1?4:1;$('#cinema').dataset.speed=String(cine.speed);target.textContent=`Speed ×${cine.speed}`;target.setAttribute('aria-pressed',String(cine.speed===4));return;}
  if(action==='skip'&&cine){if(cine.revealed)showReport();else{cine.index=cine.steps.length-1;reveal();}return;}
  if(action==='final-prev'){ledgerPage--;renderFinalLog();return;}if(action==='final-next'){ledgerPage++;renderFinalLog();return;}
  if(!['desk','emergency','operation'].includes(phase)||busy)return;
  if(action.startsWith('restore-')){
    const id=action.slice(8),item=desk.items.get(id);if(phase!=='desk'||!item?.tray)return;
    desk.cancel();desk.store(id);item.el.focus({preventScroll:true});sound.play('paper');updateTraySlots();
    announce(`${item.el.getAttribute('aria-label')} returned to its place.`);return;
  }
  if(action==='manual'){openManual();return;}
  if(action==='close-manual'){closeManual();return;}
  if(action==='pin'){const item=desk.items.get('manual')!;desk.setPinned('manual',!item.pinned);renderManual();return;}
  if(action==='store'){desk.storeAll();return;}if(action==='compare'){desk.beside(desk.selected);progressTraining();return;}if(action==='cancel-stamp'){desk.cancel();announce('Stamp cancelled.');return;}
  if(action==='manual-reading'){setManualReading(!bookReading);return;}
  if(action==='manual-atlas'){bookDestination=null;bookTab='destinations';renderManual();return;}
  if(action==='manual-stock'){openSupplies('stock');return;}
  if(action==='manual-record'){openSupplies('record');return;}
  if(action==='manual-flight'){if(phase==='desk'&&campaign.proposal)navigateManual('flight');return;}
  if(action==='manual-choose-route'){chooseManualReference();return;}
  if(action==='manual-compare-reference'){chooseManualReference(true);return;}
  if(action==='manual-compare'){if(phase==='desk'&&campaign.proposal)navigateManual('compare');return;}
  if(action==='manual-log-prev'||action==='manual-log-next'){const max=Math.max(0,Math.ceil(visible.history.length/4)-1);supplyPage=Math.max(0,Math.min(max,supplyPage+(action==='manual-log-prev'?-1:1)));renderManual();return;}
  if(action.startsWith('manual-sheet-')){const id=action.slice(13);setManualReading(false,false);desk.focus(id);desk.beside(id);progressTraining();return;}
  if(action.startsWith('manual-filter-')){const filter=action.slice(14);if(['all','surface','orbit'].includes(filter)){bookFilter=filter as RouteFilter;renderManual();}return;}
  if(action==='manual-clear-search'){bookQuery='';bookFilter='all';renderManual();desk.items.get('manual')?.el.querySelector<HTMLElement>('#manual-search')?.focus();return;}
  if(action.startsWith('manual-rule-')){bookTab='rules';bookPage=Number(action.slice(12));renderManual();sound.play('page');return;}
  if(action.startsWith('manual-science-')){bookTab='science';bookPage=Number(action.slice(15));renderManual();sound.play('page');return;}
  if(action==='book-prev'){bookPage=(bookPage+(bookTab==='rules'?3:bookTab==='science'?4:1))%(bookTab==='rules'?4:bookTab==='science'?5:2);renderManual();return;}
  if(action==='book-next'){bookPage=(bookPage+1)%(bookTab==='rules'?4:bookTab==='science'?5:2);renderManual();return;}
  if(action.startsWith('book-')){comparisonReturn=false;navigateManual(action.slice(5) as ManualTab);return;}
  if(action.startsWith('destination-')){bookDestination=action.slice(12);const tab=comparisonReturn?'compare':'destinations';comparisonReturn=false;navigateManual(tab);if(training?.lesson===1&&training.step===2&&bookDestination==='earth'){training.step=3;renderTraining();progressTraining();}return;}
  if(action==='inspect-incident'){openWorksheet();return;}
  if(action.startsWith('protocol-')&&phase==='emergency'){protocolSelection=Number(action.slice(9));const sheet=desk.items.get('worksheet');if(sheet){sheet.el.innerHTML=protocolMarkup(emergencyId,protocolSelection);sheet.el.querySelector<HTMLElement>(`[data-action="${action}"]`)?.focus();}sound.play('confirm');return;}
  if(action==='confirm-emergency'){confirmEmergency();return;}
  if(action==='choice-A'||action==='choice-B'){chooseOperation(action.at(-1) as 'A'|'B');return;}
  if(action==='operation-science'){bookTab='science';bookPage=operationId==='B01'?1:operationId==='B02'?3:2;openManual();return;}
});
document.addEventListener('click',event=>{const tool=(event.target as HTMLElement).closest<HTMLElement>('[data-stamp-tool]');if(tool&&!(tool as HTMLButtonElement).disabled&&!desk.stamp)desk.selectStamp(tool.dataset.stampTool as 'approve'|'return');});
document.addEventListener('input',event=>{
  const input=event.target as HTMLInputElement;if(input.id==='manual-search'){bookQuery=input.value;const root=desk.items.get('manual')?.el;if(root)filterManualRoutes(root,bookQuery,bookFilter);return;}if(input.id==='contribution'){updateContribution();return;}
  if(input.id==='inspection-dial'&&phase==='emergency'){protocolSelection=Number(input.value);const p=PROTOCOLS[emergencyId];const feedback=document.querySelector('.protocol-feedback');if(p&&feedback)feedback.textContent=p.feedback[protocolSelection];document.querySelectorAll<HTMLElement>('.protocol-options [data-action]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.action===`protocol-${protocolSelection}`)));return;}
  if(input.id==='volume'){prefs.volume=Number(input.value)/100;$('#volume-value').textContent=`${input.value}%`;input.setAttribute('aria-valuetext',`${input.value}%`);}
  if(input.id==='music-volume'){prefs.musicVolume=Number(input.value)/100;$('#music-volume-value').textContent=`${input.value}%`;input.setAttribute('aria-valuetext',`${input.value}%`);}
  if(input.id==='muted')prefs.muted=input.checked;
  if(input.id==='reduced')prefs.reduced=input.checked;
  if(input.id==='click-placement')prefs.clickPlacement=input.checked;
  applyPreferences();
});
document.addEventListener('keydown',event=>{
  if(event.key==='Tab'&&modal){const focusables=modalFocusables(),first=focusables[0],last=focusables.at(-1);if(!first){event.preventDefault();$('#modal-layer').focus();}else if(!$('#modal-layer').contains(document.activeElement)||event.shiftKey&&document.activeElement===first){event.preventDefault();(event.shiftKey?last:first)?.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}return;}
  if(event.key==='Tab'&&phase==='cinema'&&!paused){const controls=Array.from($('#cinema').querySelectorAll<HTMLButtonElement>('button:not(:disabled)'));const first=controls[0],last=controls.at(-1);if(!$('#cinema').contains(document.activeElement)||event.shiftKey&&document.activeElement===first){event.preventDefault();(event.shiftKey?last:first)?.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}return;}
  if(event.key==='Escape'&&bookReading&&!paused&&!modal){event.preventDefault();setManualReading(false);return;}
  if(event.key==='Escape'){event.preventDefault();if(paused){if(modal==='pause')resume();else showPause();}else if(phase!=='menu')pause();else menu();return;}
  if(modal)return;
  if(dispatch.active){
    if(event.key==='Tab'){event.preventDefault();const controls=Array.from($('#dispatch').querySelectorAll<HTMLButtonElement>('button'));const index=controls.indexOf(document.activeElement as HTMLButtonElement);controls[(index+(event.shiftKey?-1:1)+controls.length)%controls.length]?.focus();}
    return;
  }
  if(bookReading){
    if(event.key==='Tab'){
      const controls=Array.from($('#manual-reader').querySelectorAll<HTMLElement>('button:not(:disabled),input,a[href],[tabindex="0"]')).filter(el=>el.checkVisibility());
      const index=controls.indexOf(document.activeElement as HTMLElement);
      if(index<0||event.shiftKey&&index===0||!event.shiftKey&&index===controls.length-1){event.preventDefault();controls[event.shiftKey?controls.length-1:0]?.focus();}
    }else if(!(event.target as HTMLElement).matches('input,textarea,select')&&!event.ctrlKey&&!event.metaKey&&!event.altKey&&['i','r'].includes(event.key.toLowerCase())){event.preventDefault();openSupplies(event.key.toLowerCase()==='i'?'stock':'record');}
    return;
  }
  if((event.target as HTMLElement).matches('input,textarea,select')||event.ctrlKey||event.metaKey||event.altKey)return;
  if(event.repeat&&['Enter',' '].includes(event.key)){event.preventDefault();return;}
  if(event.key.toLowerCase()==='f'){event.preventDefault();if(document.fullscreenElement)void document.exitFullscreen().catch(()=>{});else if(document.documentElement.requestFullscreen)void document.documentElement.requestFullscreen().catch(()=>toast('Full screen is unavailable.'));return;}
  if(paused||!['desk','emergency','operation'].includes(phase))return;
  const key=event.key.toLowerCase();if(key==='b'){event.preventDefault();openManual();}if(key==='i'){event.preventDefault();openSupplies('stock');}if(key==='r'){event.preventDefault();openSupplies('record');}
  if(['1','2','3'].includes(key)){event.preventDefault();camera.set('desk');desk.focus(['flight','life','power'][Number(key)-1]);updateTaskGuide();}
});
clock.subscribe(dt=>{
  const visitorVisible=['desk','transition','emergency','operation'].includes(phase);
  sceneVisitor.hidden=!visitorVisible;
  engineerViewer.setVisible(visitorVisible);
  const previousPhase=phase;
  const unusedSceneTime=visitorSequence.tick(dt);
  const phaseTime=phase===previousPhase?dt:unusedSceneTime;
  $('.visitor-area').dataset.ready=String(visitorSequence.snapshot().phase==='ready'&&phase==='desk'||phase==='transition'&&['reacting','approved'].includes(visitorSequence.snapshot().phase));
  const deliveredTime=dispatch.tick(phaseTime),landingTime=Math.min(responseLanding,deliveredTime);
  responseLanding-=landingTime;const responseTime=deliveredTime-landingTime;
  if(phase==='emergency'&&!busy&&!(training?.lesson===3&&training.practice!=='timed')){
    remaining=Math.max(0,remaining-responseTime);desk.items.get('emergency')?.el.style.setProperty('--time-left',`${remaining/30000*100}%`);
    const sec=Math.ceil(remaining/1000);if(bookReading){const text=`${sec}s · Emergency timer continues · Pause stops time`;if($('#reader-timer').textContent!==text)$('#reader-timer').textContent=text;}const counter=$('#seconds');if(counter)counter.textContent=String(sec);
    desk.items.get('emergency')?.el.classList.toggle('urgent',remaining<=10000);
    if(sec<=10&&sec!==alarmSecond){alarmSecond=sec;sound.play('alert');if([10,5].includes(sec))announce(`${sec} seconds remaining.`);}
    if(remaining===0)confirmEmergency(true);
  }
  if(communication>0){communication=Math.max(0,communication-responseTime);if(communication===0&&messageSent){const status=$('#message-status');if(status)status.textContent='↙ Earth received the message. Local protocol remains your responsibility.';announce('Earth received the message. No additional resources.');}}
  if(cine&&phase==='cinema'){
    cine.elapsed+=phaseTime*cine.speed;
    updateCinemaFrame($('#cinema'),cine,prefs.reduced);
    if(cine.revealed){if(cine.elapsed>=2400)showReport();}
    else if(cine.elapsed>=(prefs.reduced?800:1800)){cine.elapsed=0;if(cine.index<cine.steps.length-1){cine.index++;renderCinema();}else reveal();}
  }
});
scale();menu();clock.start();

// Development-only inspection and fixtures. Vite removes this branch in production.
if(import.meta.env.DEV){
  Object.assign(window,{__SPACE_PAPERS__:{
    state:()=>structuredClone(campaign),view:()=>({phase,paused,cinemaElapsed:cine?.elapsed??null,camera:camera.position,remaining,contribution,bookDestination,bookTab,bookPage,bookReading,supplyView,supplyPage,training:training&&{...training},dispatch:dispatch.snapshot(),responseLanding,pending:pending&&{...pending}}),
    visitor:()=>visitorSequence.snapshot(),manualTime:()=>clock.stop(),advanceTime:(ms:number)=>clock.step(ms),
    start,training:setupTraining,engineer:(id:string)=>{if(ENGINEERS.some(e=>e.id===id)){showVisitor(id);camera.set('room');}},
    scenario:(kind:string)=>{start('qa-scenario');campaign.events.forEach(e=>e.resolved=true);campaign.stock=vector(200000,400000,100000,30000000,30000000);
      if(kind.startsWith('emergency')){const eventId=kind.split(':')[1]||'E02';campaign.events=[{id:eventId,afterSuccess:0,resolved:false}];visible=campaign;for(const id of ['flight','life','power'])desk.remove(id);showEmergency(eventId);}
      else if(kind.startsWith('operation')){const op=OPERATIONS.find(o=>o.id===(kind.split(':')[1]||'B01'))!;campaign.completed=DESTINATIONS.slice(0,op.afterSuccess).map(d=>d.id);campaign.approvals=campaign.completed.length;campaign.operationsResolved=OPERATIONS.filter(o=>o.afterSuccess<op.afterSuccess).map(o=>o.id);visible=campaign;for(const id of ['flight','life','power'])desk.remove(id);showOperation(op.id);}
      else{const d=DESTINATIONS.find(d=>d.id==='earth')!;campaign.proposal={id:'qa',destinationId:d.id,engineerId:'adan',minimum:{...d.minimum},requested:{...d.minimum}};if(kind==='short')campaign.proposal.requested.food=units(6900);if(kind==='stock')campaign.stock.energy=0;visible=campaign;renderProposal();}updateStatus();},
  }});
}
