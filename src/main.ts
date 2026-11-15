import './style.css';
import './desk-design.css';
import scienceArchive from '../public/science.json';
import { PROTOCOLS, protocolMarkup } from './protocols';
import { DESTINATIONS, ENGINEERS, EVENTS, OPERATIONS, RESOURCES, RESOURCE_LABELS, format, units, vector, type Resource, type Resources } from './catalog';
import { createCampaign, nextProposal, approve, returnProposal, resolveEmergency, authorizeOperation, nextInterlude, finalGrade, type Campaign, type Resolution } from './domain';
import { Desk } from './desk';
import { GameClock } from './clock';
import { Sound } from './audio';
import { planet, ship, baseView, resourceIcon } from './art';
import { Camera } from './camera';
import { EngineerViewer } from './characters';
import { VisitorSequence } from './visitor';

type Phase = 'menu'|'desk'|'transition'|'cinema'|'report'|'emergency'|'operation'|'final';
interface Preferences {volume:number; muted:boolean; reduced:boolean; clickPlacement:boolean}
interface Training {lesson:number; step:number; practice:'half'|'full'|'timed'; error:boolean}
interface Science {id:string;title:string;organization:string;url:string;date?:string;observations:unknown;unit:string;transformation:string;limitations:unknown}
const $ = <T extends HTMLElement = HTMLElement>(selector:string):T => document.querySelector<T>(selector)!;
const esc = (value:unknown) => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
const button = (label:string,action:string,classes='') => `<button type="button" class="${classes}" data-action="${action}">${label}</button>`;
let prefs:Preferences={volume:.35,muted:false,reduced:matchMedia('(prefers-reduced-motion: reduce)').matches,clickPlacement:false};
try {const saved=JSON.parse(localStorage.getItem('space-papers-preferences-v1')??'{}');prefs={volume:Number.isFinite(saved.volume)?Math.max(0,Math.min(1,saved.volume)):.35,muted:saved.muted===true,reduced:typeof saved.reduced==='boolean'?saved.reduced:prefs.reduced,clickPlacement:saved.clickPlacement===true};}catch{}
let phase:Phase='menu', campaign:Campaign=createCampaign('not-started'), visible:Campaign=campaign;
let paused=false, lastFocus:HTMLElement|null=null, modal='';
let modalReturnFocus:HTMLElement|null=null;
let screenHintDismissed=false;
let pending:Resolution|null=null, emergencyId='', remaining=30000, contribution=0, alarmSecond=-1;
let protocolSelection:number|null=null;
let operationId='', operationChoice:'A'|'B'|null=null, communication=0, messageSent=false;
let bookTab='index', bookDestination:string|null=null, bookPage=0, ledgerTab='stock', ledgerPage=0;
let training:Training|null=null, busy=false, serial=0;
let science:Science[]=[];
let cine:{steps:Array<{label:string;visual:string;phase:string}>;index:number;elapsed:number;speed:number;revealed:boolean}|null=null;
const clock=new GameClock(), sound=new Sound();

$('#app').innerHTML=`<div id="viewport"><main id="stage" aria-label="Space Papers lunar operations desk">
  <div class="scene-environment" aria-hidden="true"><div class="scene-layer scene-background"></div><div class="scene-layer scene-door"></div><div class="scene-layer scene-desk"></div></div>
  <header class="station-header"><div class="bureau-mark">SP<span>✦</span></div><div>LUNAR OPERATIONS BUREAU<span>SPACE PAPERS / SECTOR 04</span></div><button data-action="pause" class="pause-switch" aria-label="Pause game">Ⅱ <span>PAUSE</span></button></header>
  <div class="visitor-area"><div id="visitor-portrait" aria-hidden="true"><svg viewBox="0 0 200 340" xmlns="http://www.w3.org/2000/svg"><circle cx="100" cy="53" r="35" fill="#899493"/><path d="M52 114 Q68 91 100 91 Q132 91 148 114 L171 231 L142 237 L132 178 L137 329 H105 L100 224 L95 329 H63 L68 178 L58 237 L29 231 Z" fill="#71817f" stroke="#4c5c5a" stroke-width="5"/></svg></div><div class="visitor-badge"><span>MISSION ENGINEER</span><strong id="visitor-name"></strong></div><div id="speech" class="speech"></div></div>
  <div class="wall-monitor"><div id="base-status" class="base-status" aria-label="Base operations status"></div><div id="performance" class="performance"></div></div>
  <div class="counter"><span class="counter-label">LUNAR TRANSIT AUTHORITY</span><span class="counter-code">REVIEW • COMPARE • AUTHORIZE</span></div>
  <div id="tray" class="document-tray" aria-label="Document tray"><div class="proposal-tray-heading"><span>MISSION PROPOSAL</span><span>3 SHEETS · CLICK OR DRAG</span></div><div class="tray-slots" aria-hidden="true"><i>01</i><i>02</i><i>03</i></div></div>
  <div class="desk-surface" aria-hidden="true"></div>
  <div class="desk-tools"><button class="book-tool" data-action="manual" aria-label="Open manual (B)"><span class="tool-edition">FIELD EDITION / 01</span><span class="book-cross" aria-hidden="true">✦</span><span class="tool-title">MISSION<br>MANUAL</span><span class="tool-description">Routes · Rules · Reference</span><kbd>B</kbd></button><button class="ledger-tool" data-action="inventory"><span class="tool-edition">LUNAR SUPPLY OFFICE</span><span class="stock-emblem" aria-hidden="true">▤</span><span class="tool-title">STOCK</span><small>RESOURCE INVENTORY</small><span class="tool-description">One store. Every decision.</span><kbd>I</kbd></button><button class="log-tool" data-action="record">TURN LOG<kbd>R</kbd></button><div class="desk-caption">YOUR DESK. YOUR DECISION.</div></div>
  <nav class="camera-controls" aria-label="Camera position"><button type="button" data-action="camera-room" aria-pressed="true">Room view</button><button type="button" data-action="camera-desk" aria-pressed="false">Desk view</button></nav>
  <div class="room-tray"><span>INCOMING DOCUMENTS</span><button type="button" data-action="camera-desk">Inspect desk <span aria-hidden="true">↗</span></button></div>
  <div id="task-guide" class="task-guide" role="status" aria-live="polite"></div>
  <nav id="document-shortcuts" class="document-shortcuts" aria-label="Recover mission documents">${button('01 · Flight plan','recover-flight')}${button('02 · Life support','recover-life')}${button('03 · Propulsion','recover-power')}</nav>
  <div id="shift-progress" class="shift-progress" aria-label="Shift progress"></div>
  <div id="objects"></div>
  <footer class="desk-rail"><div class="rail-actions">${button('↙ Store sheets','store')}${button('↔ Place beside book','compare')}${button('Controls','help')}</div><div id="stamp-status" class="stamp-status"><span>Compare first. Then stamp your decision.</span>${button('Cancel stamp','cancel-stamp')}</div><div class="stamp-rack"><button type="button" aria-pressed="false" class="stamp return" data-stamp-tool="return" aria-label="Pick up Return stamp"><span class="stamp-handle"></span><strong>RETURN</strong><small>NO RESOURCES SPENT</small></button><button type="button" aria-pressed="false" class="stamp approve" data-stamp-tool="approve" aria-label="Pick up Approve stamp"><span class="stamp-handle"></span><strong>APPROVE</strong><small>AUTHORIZE RESOURCES</small></button></div></footer>
  <div id="training-guide" class="training-guide" hidden></div><div id="cinema" class="cinema" hidden></div><div id="toast" class="toast" hidden></div>
  <div id="announcement" class="sr-only" role="status" aria-live="polite"></div>
</main></div><aside id="small-screen" hidden><span>Scroll to explore your desk. Landscape gives you more room.</span><button data-action="dismiss-screen-hint" aria-label="Dismiss screen hint">×</button></aside><div id="modal-layer" class="modal-layer" hidden></div>`;
const stage=$('#stage');
const desk=new Desk(stage,{
  announce,
  presentation:{tray:{x:540,y:210,width:520,height:153},previewScale:.42,previewHeight:260,reading:{x:790,y:376}},
  onPaper:()=>{sound.play('paper');progressTraining();},
  onStamp:stampDecision,
  canStamp:(stamp,target)=>!paused&&!busy&&((visitorSequence.snapshot().phase==='ready'&&phase==='desk'&&!!campaign.proposal&&['flight','life','power'].includes(target))||(phase==='operation'&&target==='order'&&stamp==='approve'&&operationChoice!==null)),
  onSelect:()=>{updateDocumentShortcuts();},
});
const camera = new Camera(stage, () => desk.cancel());
// The person shares the room's camera and sits between the doorway and desk layers.
const sceneVisitor=document.createElement('div');sceneVisitor.className='scene-visitor';
sceneVisitor.append($('#visitor-portrait'));$('.scene-environment').append(sceneVisitor);
const engineerViewer = new EngineerViewer($('#visitor-portrait'),state=>$('#visitor-portrait').dataset.viewerState=state);
const visitorSequence = new VisitorSequence(sceneVisitor,$('.scene-door'),engineerViewer,()=>setStampAvailability());
window.addEventListener('pagehide',()=>engineerViewer.dispose(),{once:true});
applyPreferences();
science = scienceArchive.sources as unknown as Science[];

function announce(message:string){$('#announcement').textContent=message;updateStampStatus();}
function updateStampStatus(){
  const stamp=desk.stamp;
  $('#stamp-status > span').textContent=stamp?`${stamp==='approve'?'APPROVE':'RETURN'} selected · choose a sheet.`:'Compare first. Then stamp your decision.';
}
let toastTimer=0;
function toast(message:string){const el=$('#toast');(modal?$('#modal-layer'):stage).append(el);el.textContent=message;el.hidden=false;clock.cancel(toastTimer);toastTimer=clock.after(3500,()=>el.hidden=true);announce(message);}
function applyPreferences(){visitorSequence.setReducedMotion(prefs.reduced);sound.volume=prefs.volume;sound.muted=prefs.muted;desk.clickPlacement=prefs.clickPlacement;stage.classList.toggle('reduced-motion',prefs.reduced);try{localStorage.setItem('space-papers-preferences-v1',JSON.stringify(prefs));}catch{}}
function scale(){
  desk.cancel();const width=window.innerWidth,height=window.innerHeight;
  const compact=width<1000||height<560;
  const fitted=Math.min(width/1600,height/900),s=compact?Math.max(.8,fitted):fitted;
  document.body.classList.toggle('compact-ui',compact);
  document.documentElement.style.setProperty('--ui-scale',String(fitted));
  stage.style.transform=`scale(${s})`;$('#viewport').style.width=`${1600*s}px`;$('#viewport').style.height=`${900*s}px`;
  $('#small-screen').hidden=!compact||phase==='menu'||screenHintDismissed;
}
function updateDocumentShortcuts(){
  stage.querySelectorAll<HTMLButtonElement>('[data-action^="recover-"]').forEach(b=>{
    const id=b.dataset.action!.slice(8);b.disabled=phase!=='desk'||!desk.items.has(id)||paused||busy;
    b.setAttribute('aria-pressed',String(desk.selected===id));
    b.title=`Bring ${id==='flight'?'flight plan':id==='life'?'life support':'propulsion and energy'} to the front`;
  });
}
function updateTaskGuide(){
  $('#document-shortcuts').hidden=camera.position!=='desk'||phase!=='desk';
  const guide=$('#task-guide');guide.hidden=!!training||!['desk','transition','emergency','operation'].includes(phase);
  const status=visitorSequence.snapshot().phase;
  guide.innerHTML=phase==='emergency'?'<span class="eyebrow">PRIORITY / BASE RESPONSE</span><strong>Choose support. Confirm before time runs out.</strong>':phase==='operation'?'<span class="eyebrow">BASE ORDER / COMPARE COSTS</span><strong>Choose A or B, then approve the order.</strong>':phase==='transition'?`<span class="eyebrow">${$('.visitor-area').dataset.decision==='approve'?'CLEARANCE ISSUED':'REVISION REQUESTED'}</span><strong>${$('.visitor-area').dataset.decision==='approve'?'A moment to celebrate. Your mission projection is next.':'The engineer is taking the request back for revision.'}</strong>`:`<span class="eyebrow">YOUR NEXT STEP</span><strong>${camera.position==='room'?'Inspect the desk to review this mission.':'Read the route → compare all five resources → check stock.'}</strong><span>${status==='ready'?'Approve a safe request. Return a request that falls short.':'The engineer is on the way. You can inspect the papers now.'}</span>`;
  updateDocumentShortcuts();
}
function preserveControlFocus(root:HTMLElement,render:()=>void){
  const active=root.contains(document.activeElement)?document.activeElement as HTMLElement:null;
  const action=active?.dataset.action;render();
  if(active){const replacement=Array.from(root.querySelectorAll<HTMLElement>('[data-action]')).find(el=>el.dataset.action===action&&!el.matches(':disabled'));(replacement??root).focus({preventScroll:true});}
}
window.addEventListener('resize',scale);
document.addEventListener('visibilitychange',()=>{if(document.hidden&&phase!=='menu')pause();});
window.addEventListener('blur',()=>{desk.cancel();if(phase!=='menu')pause();});
document.addEventListener('pointerdown',()=>sound.unlock(),{once:true});
document.addEventListener('keydown',()=>sound.unlock(),{once:true});

function mount(id:string,html:string,classes:string,x:number,y:number,width:number,height:number,kind:'paper'|'book'|'ledger'|'emergency'|'order',stored=false){
  desk.remove(id);const el=document.createElement('article');el.id=id;el.className=classes;el.innerHTML=html;
  el.setAttribute('aria-label',({flight:'Flight plan',life:'Life support request',power:'Propulsion and energy request',manual:'Mission manual',ledger:'Inventory and turn log',emergency:'Emergency response',order:'Internal base order',worksheet:'Technician worksheet'} as Record<string,string>)[id]??id);
  $('#objects').append(el);desk.register({id,el,x,y,width,height,kind,stored,tray:kind==='paper'?{x,y}:undefined});return el;
}
function resourceRows(amounts:Resources,keys:readonly Resource[]=RESOURCES,compact=false){return keys.map(r=>`<div class="resource-row ${compact?'compact':''}"><span class="resource-label">${resourceIcon(r)}${RESOURCE_LABELS[r].label}</span><span class="resource-value">${format(amounts[r])} <span>${RESOURCE_LABELS[r].unit}</span></span></div>`).join('');}
function costText(amounts:Resources){return RESOURCES.filter(r=>amounts[r]>0).map(r=>`${format(amounts[r])} ${RESOURCE_LABELS[r].unit} ${RESOURCE_LABELS[r].label.toLowerCase()}`).join(' + ');}
function nameOf(id?:string){return DESTINATIONS.find(d=>d.id===id)?.name??id??'';}
function showVisitor(id:string){
  $('.visitor-area').dataset.ready='false';delete $('.visitor-area').dataset.decision;
  $('.visitor-badge > span').textContent='MISSION ENGINEER';
  const engineer=ENGINEERS.find(e=>e.id===id)??ENGINEERS[1];
  $('#visitor-portrait').dataset.engineer=engineer.id;
  $('.visitor-area').style.setProperty('--engineer-color',engineer.color);
  $('#visitor-name').textContent=engineer.name;$('#speech').textContent=engineer.greeting;
  void visitorSequence.show(engineer.id);
}
function updateStatus(){
  $('#performance').innerHTML=`<span>SUCCESSFUL RETURNS</span><strong>${visible.completed.length}<small>/5</small></strong><span>${visible.approvals?`${visible.approvals} approved · ${Math.round(visible.completed.length/visible.approvals*100)}% success`:'Not yet evaluated'}</span>`;
  const choices=visible.operationChoices;
  const states=[choices.B01?(choices.B01==='A'?'Life support: regenerative':'Life support: reserves'):'Habitat ready',choices.B02?(choices.B02==='A'?'Shelter ready · Lab active':'Shelter ready · Lab paused'):'Shelter unprepared',choices.B03?(choices.B03==='A'?(visible.completed.length>=4?'Harvest used at base':'Local crop growing'):'Stored rations in use'):'Food program pending'];
  $('#base-status').innerHTML=`<span class="base-dot"></span> BASE STATUS<span>${states.map(esc).join('<br>')}</span>`;
  $('#shift-progress').innerHTML=`<span class="progress-caption">YOUR SHIFT</span><div class="destination-progress"><span class="progress-pips" aria-hidden="true">${Array.from({length:5},(_,i)=>`<i class="${i<visible.completed.length?'complete':''}"></i>`).join('')}</span><strong>${visible.completed.length} / 5 destinations</strong></div><span>${visible.events.filter(e=>e.resolved).length} / 2 incidents</span>`;
  if(desk.items.has('ledger'))renderLedger();
}
function setStampAvailability(){
  stage.dataset.phase=phase;
  const visitorReady=visitorSequence.snapshot().phase==='ready';
  const ready=(phase==='desk'&&!!campaign.proposal&&visitorReady)||(phase==='operation'&&!!operationChoice);
  stage.querySelectorAll<HTMLButtonElement>('[data-action="camera-room"],[data-action="camera-desk"]').forEach(b=>b.disabled=paused||busy||phase!=='desk');
  $<HTMLButtonElement>('[data-stamp-tool="approve"]').disabled=paused||busy||!ready;
  $<HTMLButtonElement>('[data-stamp-tool="return"]').disabled=paused||busy||phase!=='desk'||!visitorReady;
  $('[data-stamp-tool="return"]').title=phase==='operation'?'Internal order: choose one option and approve it.':'Return the proposal without spending resources';
  $('[data-stamp-tool="approve"] small').textContent=phase==='operation'?'AUTHORIZE BASE ORDER':'AUTHORIZE RESOURCES';
  desk.enabled=!paused&&!busy&&!modal&&['desk','emergency','operation'].includes(phase);
  stage.querySelectorAll<HTMLElement>('.station-header,.desk-tools,.desk-rail,.camera-controls,.room-tray,#document-shortcuts,#training-guide').forEach(el=>el.inert=phase==='cinema');
  $('#objects').inert=camera.position==='room'||phase==='cinema';
  updateTaskGuide();updateStampStatus();
}
function start(seed?:string){
  training=null;resetSession();camera.set('room');campaign=createCampaign(seed?.trim()||crypto.randomUUID().slice(0,8));visible=campaign;
  stage.classList.remove('menu-mode');closeModal();campaign=nextProposal(campaign);visible=campaign;phase='desk';renderProposal();updateStatus();setStampAvailability();
  scale();announce('Your shift begins. Inspect the desk, read the route, compare the manual and check inventory before stamping.');
  $('[data-action="camera-desk"]').focus({preventScroll:true});
}
function resetSession(){$('#app').scrollTo(0,0);delete $('.visitor-area').dataset.decision;stage.classList.remove('paused');clock.clear();visitorSequence.reset();clock.setPaused(false);sound.pause(false);paused=false;busy=false;pending=null;cine=null;delete stage.dataset.incident;emergencyId='';operationId='';operationChoice=null;communication=0;messageSent=false;desk.clear();bookTab='index';bookDestination=null;bookPage=0;ledgerPage=0;$('#cinema').hidden=true;$('#training-guide').hidden=true;$('#toast').hidden=true;}
function renderProposal(){
  for(const id of ['flight','life','power','order','emergency','worksheet'])desk.remove(id);
  const p=campaign.proposal;if(!p)return;
  const d=DESTINATIONS.find(d=>d.id===p.destinationId)!;showVisitor(p.engineerId);phase='desk';busy=false;
  const header=(n:string,title:string,subtitle:string)=>`<header class="paper-header"><span class="paper-form">SP / ${n}</span><span>LUNAR OPERATIONS</span></header><div class="paper-title"><span class="paper-section-number" aria-hidden="true">${n}</span><h2>${title}</h2></div><p class="paper-subtitle">${subtitle}</p>`;
  const preview=(n:string,title:string)=>`<div class="paper-preview" aria-hidden="true"><header><span>${n}</span><span>MISSION PAPER</span></header><strong>${title}</strong><span class="preview-rules"></span><footer>SPACE PAPERS <span>CREW OF 04</span></footer></div>`;
  const footer=`<footer class="paper-footer"><span>REQUEST ${p.id.replace('proposal-','').padStart(3,'0')}</span><span>SPACE PAPERS</span></footer><div class="ink-mark" aria-hidden="true"></div>`;
  mount('flight',`${header('01','Flight plan','LUNAR RETURN EXPEDITION')}${preview('01','Flight<br>plan')}<div class="flight-world">${planet(d.id)}</div><div class="route"><span>MOON</span><strong>→ ${d.name} →</strong><span>MOON</span></div><div class="flight-details"><span>4 crew members</span><strong>${d.mode==='orbit'?'ORBIT ONLY':'LOCAL MODULE'}</strong></div><p class="document-note">${d.mode==='orbit'?'No surface landing.':'Surface visit in this fictional scenario.'}</p>${footer}`,'paper flight-paper',565,242,332,424,'paper',true);
  mount('life',`${header('02','Life support','REQUESTED SUPPLIES')}${preview('02','Life<br>support')}${resourceRows(p.requested,['food','water','oxygen'])}<p class="document-note">For the complete expedition.<br>Compare with the mission manual.</p>${footer}`,'paper life-paper',730,242,332,424,'paper',true);
  mount('power',`${header('03','Propulsion<br>& energy','REQUESTED RESOURCES')}${preview('03','Propulsion<br>& energy')}${resourceRows(p.requested,['propellant','energy'])}<p class="document-note">Return journey and reserve included.<br>Energy is used over the mission, not stored in one battery.</p>${footer}`,'paper power-paper',895,242,332,424,'paper',true);
  setStampAvailability();renderTraining();
}
function openManual(){
  camera.set('desk');updateTaskGuide();
  let item=desk.items.get('manual');
  if(!item){mount('manual','','manual',36,382,720,418,'book');item=desk.items.get('manual')!;}
  item.el.hidden=false;renderManual();desk.focus('manual');sound.play('page');
  if(training?.lesson===1&&training.step===1){training.step=2;renderTraining();}
}
function renderManual(){
  const item=desk.items.get('manual');if(!item)return;
  const tab=(id:string,label:string)=>`<button data-action="book-${id}" class="${bookTab===id?'active':''}" aria-pressed="${bookTab===id}">${label}</button>`;
  let left='',right='';
  if(bookTab==='index'){
    left=`<span class="eyebrow">FIELD EDITION / 01</span><h2>Mission<br>manual.</h2><p class="manual-intro">A reference for every<br>safe return.</p><div class="manual-contents">${button('01 · Destination minimums','book-destinations')}${button('02 · Desk rules','book-rules')}${button('03 · Emergency response','book-emergencies')}</div>`;
    right=`<span class="eyebrow">YOUR REVIEW / FOUR CHECKS</span><h3>Before you stamp</h3><ol class="manual-steps"><li>Read the route on the flight plan.</li><li>Find its destination in this manual.</li><li>Compare all five requests with the minimums.</li><li>Check stock covers the full request.</li></ol><p class="fine-print">Returning a proposal is free. Approving spends resources, even if the mission fails.</p>`;
  } else if(bookTab==='destinations'){
    left=`<span class="eyebrow">FIND YOUR DESTINATION</span><div class="planet-grid">${DESTINATIONS.map(d=>`<button data-action="destination-${d.id}" class="${bookDestination===d.id?'selected':''}" aria-pressed="${bookDestination===d.id}"><span class="tiny-world" aria-hidden="true">${planet(d.id)}</span>${d.name}</button>`).join('')}</div><p class="fine-print">All routes: Moon → destination → Moon.<br>Four crew. Full expedition minimums.</p>`;
    const d=DESTINATIONS.find(d=>d.id===bookDestination);
    right=d?`<div class="manual-destination"><h3>${d.name}</h3><span>${d.mode==='orbit'?'ORBIT ONLY':'LOCAL MODULE'}</span></div>${resourceRows(d.minimum,RESOURCES,true)}<p class="fine-print">Fictional game balance. Return and reserve included.</p>`:`<div class="empty-page"><span>✦</span><h3>Where are they going?</h3><p>Read the flight plan.<br>Choose a destination on the left.</p></div>`;
  } else if(bookTab==='rules'){
    const pages=[
      [`<h3>Requests ≠ minimums</h3><p>The sheets show what the engineer requests. This book shows the minimum. The stock ledger shows what you have.</p><p>Each resource must meet its own minimum. Extra water cannot replace oxygen.</p>`,`<h3>One signature. One cost.</h3><p>Approve spends the request, including any extra. A failed mission does not refund resources.</p><p>A shortage in stock spends what is available and ends your shift. Return spends nothing.</p>`],
      [`<h3>Your assignment</h3><p>Complete five different destinations and resolve two unexpected emergencies. There are no fixed days or visitor limit.</p><p>Success rate = successful missions ÷ approved missions. Returns and base orders do not count.</p>`,`<h3>Your evaluation</h3><p>100%: certificate.<br>Above 40%, below 100%: office transfer.<br>40% or less: dismissal.</p><p>Stock deficit or an unresolved emergency ends your shift early.</p>`],
      [`<h3>One shared store</h3><p>The starting budget covers five reference destinations, two events and base operations, plus 10%. It is set once.</p><p>It does not guarantee every possible route. There are no refunds or resupplies.</p>`,`<h3>The base needs you</h3><p>After successes 1, 2 and 3, authorize life support, shelter preparation and food supply.</p><p>These orders use the same stock. A local harvest feeds the base; it never refills mission stock.</p>`],
      [`<h3>Our fictional universe</h3><p>Human journeys to all eight destinations and surface visits to Venus are fiction. Giants have orbital operations only.</p><p>No numerical travel duration is claimed.</p>`,`<h3>Keep units separate</h3><p>kg, L and kWh are not interchangeable. kWh measures energy; kW measures power.</p><p>Breathing oxygen is separate from propellant oxidizer. Mission energy is not battery size.</p>`],
    ];[left,right]=pages[bookPage%pages.length];
  } else if(bookTab==='emergencies'){
    left=`<h3>30 seconds to respond</h3><p>The timer starts when the notice appears. Choose a contribution, then confirm.</p><p>100% guarantees recovery.<br>50% means a 50% chance.<br>0% always fails.</p><p>Moving papers does not stop time. Pause does.</p>`;
    right=`<h3>Incident costs · ${bookPage%2+1}/2</h3>${EVENTS.slice((bookPage%2)*4,(bookPage%2)*4+4).map(e=>`<div class="incident-entry"><strong>${e.id} · ${e.title}</strong><span>${format(e.cost)} ${RESOURCE_LABELS[e.resource].unit} ${RESOURCE_LABELS[e.resource].label.toLowerCase()}</span></div>`).join('')}<p class="fine-print">Fictional response packages. Future incidents are not disclosed.</p>`;
  } else {
    const facts=[
      ['A real solar record','DONKI archived flare','2024-05-10T06:27:00-FLR-001 · v2','Class X3.9. Peak: 06:54 UTC, May 10, 2024.','This historical observation explains why crews monitor the Sun. It does not predict your next incident or a radiation dose.','https://ccmc.gsfc.nasa.gov/DONKI/events/30666/2/'],
      ['Water can circulate','NASA · ISS life support','98% water recovery','NASA demonstrated 98% recovery in the ISS water-recovery system.','Operating a regenerative system needs equipment and power. This does not grant free water or change our fictional mission minimums.','https://www.nasa.gov/missions/station/nasa-achieves-water-recovery-milestone-on-international-space-station/'],
      ['Growing takes time','NASA · Veg-01','28-day experiment','The Veg-01 experiment planned a 28-day growing cycle with lighting and periodic watering.','Our growing step is compressed simulation time. It is not a trip duration or a NASA crop-yield model. The harvest is used locally.','https://www.nasa.gov/missions/station/veggie-plant-growth-system-activated-on-international-space-station/'],
      ['A shelter needs shielding','NASA · lunar radiation','Protection is a design problem','Material between people and radiation helps protect a crew. Activities may need to be postponed.','Our power costs operate equipment in an existing shelter. Electricity is not shielding. Preparing the shelter does not pay for an E04 intervention.','https://science.nasa.gov/science-research/heliophysics/how-nasa-will-protect-astronauts-from-space-radiation-at-the-moon/'],
      ['A message is not instant','NASA · light travel','About 1.3 seconds one way','Light takes approximately 1.3 seconds to travel between the Moon and Earth.','Our 2.6-second exchange represents an ideal round trip. Real systems and people add delay. No time is added to your emergency clock.','https://science.nasa.gov/mission/webb/science-overview/science-explainers/how-does-webb-see-back-in-time/'],
    ];const f=facts[bookPage%facts.length];
    left=`<span class="eyebrow">NASA FIELD NOTE ${bookPage%5+1}/5</span><h3>${f[0]}</h3><p class="source-label">${f[1]}</p><strong class="science-fact">${f[2]}</strong><p>${f[3]}</p>`;
    right=`<span class="eyebrow">SCIENCE & OUR SIMULATION</span><p>${f[4]}</p><p>Mission quantities, base-order costs and survival probabilities are <strong>fictional game balance</strong>.</p><a class="source-link" href="${f[5]}" target="_blank" rel="noopener">Read the NASA source ↗</a>`;
  }
  preserveControlFocus(item.el,()=>{item.el.innerHTML=`<div class="manual-top"><span class="manual-brand">✦ <span>FIELD MANUAL</span></span><nav aria-label="Manual sections">${tab('index','Index')}${tab('destinations','Routes')}${tab('rules','Rules')}${tab('emergencies','Alerts')}${tab('science','NASA')}</nav></div><div class="book-spread" data-no-drag><section tabindex="0" aria-label="Left manual page">${left}</section><section tabindex="0" aria-label="Right manual page">${right}</section></div><footer class="manual-footer">${button(item.pinned?'Unpin book':'Pin book','pin')}<span>${bookTab==='rules'?`PAGE ${bookPage%4+1} / 4`:bookTab==='science'?`NASA ${bookPage%5+1} / 5`:bookTab==='emergencies'?`ALERTS ${bookPage%2+1} / 2`:'LUNAR OPERATIONS'}</span>${['rules','emergencies','science'].includes(bookTab)?`${button('‹','book-prev')}${button('›','book-next')}`:''}${button('Close','close-manual')}</footer>`;
  item.el.querySelector('[data-action="book-prev"]')?.setAttribute('aria-label','Previous manual page');item.el.querySelector('[data-action="book-next"]')?.setAttribute('aria-label','Next manual page');
  item.el.querySelector('[data-action="pin"]')?.setAttribute('aria-pressed',String(!!item.pinned));});
}
function openLedger(tab:string){
  camera.set('desk');updateTaskGuide();
  ledgerTab=tab;ledgerPage=0;let item=desk.items.get('ledger');if(!item){mount('ledger','','ledger',1158,382,406,418,'ledger');item=desk.items.get('ledger')!;}
  item.el.hidden=false;renderLedger();desk.focus('ledger');sound.play('page');
  if(training?.lesson===1&&training.step===4&&tab==='stock'){training.step=5;renderTraining();}
}
function logEntries(entries:Resolution[],page:number){return entries.slice(page*4,page*4+4).map(r=>`<div class="log-entry"><span class="log-kind">${r.kind==='return'?'RETURNED':r.kind==='mission'?(r.success?'RETURNED SAFELY':'MISSION STOPPED'):r.kind==='emergency'?'INCIDENT':'BASE ORDER'}</span><strong>${esc(nameOf(r.destination)||r.title)}</strong><span>${r.kind==='return'?'No resources spent':r.kind==='mission'?(r.success?'Crew back on the Moon':r.explanation):r.explanation}</span></div>`).join('')||'<div class="empty-log">A quiet desk.<br>Your decisions will appear here.</div>';}
function renderLedger(){const item=desk.items.get('ledger');if(!item)return;const history=[...visible.history].reverse();const pages=Math.max(1,Math.ceil(history.length/4));ledgerPage=Math.min(ledgerPage,pages-1);
  preserveControlFocus(item.el,()=>{item.el.innerHTML=`<header class="ledger-header"><div><span class="eyebrow">LUNAR SUPPLY OFFICE</span><h2>${ledgerTab==='stock'?'Stock ledger':'Turn record'}</h2></div><span class="ledger-insignia" aria-hidden="true">▤</span></header><nav class="ledger-tabs">${button('Inventory','inventory',ledgerTab==='stock'?'active':'')}${button('Record','record',ledgerTab==='record'?'active':'')}</nav><div class="ledger-content" data-no-drag tabindex="0" aria-label="Ledger entries">${ledgerTab==='stock'?'<div class="ledger-column-labels"><span>RESOURCE</span><span>AVAILABLE</span></div>':''}${ledgerTab==='stock'?resourceRows(visible.stock,RESOURCES,true):logEntries(history,ledgerPage)}</div><footer class="ledger-footer">${ledgerTab==='record'?`${button('‹','log-prev')}<span>${ledgerPage+1} / ${pages}</span>${button('›','log-next')}`:'<span>One store. No resupplies.</span>'}${button('Close','close-ledger')}</footer>`;
  item.el.querySelector('[data-action="inventory"]')?.setAttribute('aria-pressed',String(ledgerTab==='stock'));item.el.querySelector('[data-action="record"]')?.setAttribute('aria-pressed',String(ledgerTab==='record'));
  const prev=item.el.querySelector<HTMLButtonElement>('[data-action="log-prev"]'),next=item.el.querySelector<HTMLButtonElement>('[data-action="log-next"]');
  if(prev){prev.disabled=ledgerPage===0;prev.setAttribute('aria-label','Previous record page');}if(next){next.disabled=ledgerPage===pages-1;next.setAttribute('aria-label','Next record page');}});
}

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
  setStampAvailability();sound.play('stamp');
  const el=desk.items.get(target)?.el;if(el){const ink=el.querySelector('.ink-mark')??el.appendChild(Object.assign(document.createElement('div'),{className:'ink-mark'}));ink.textContent=stamp==='approve'?'AUTHORIZED':'RETURNED';ink.classList.add('visible',stamp);}
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
function showEmergency(id:string){
  camera.set('desk');
  phase='emergency';busy=false;emergencyId=id;remaining=30000;contribution=0;alarmSecond=-1;protocolSelection=null;desk.remove('order');desk.remove('worksheet');stage.dataset.incident=id;
  const e=EVENTS.find(e=>e.id===id)!;const max=Math.min(100,Math.floor(campaign.stock[e.resource]*100/e.cost));
  showVisitor('victor');$('#speech').textContent='An incident needs your attention. Choose a contribution, then confirm.';
  const practice=training?.lesson===3&&training.practice!=='timed';
  mount('emergency',`<header class="emergency-header"><span class="emergency-light"></span><span>PRIORITY TRANSMISSION / ${id}</span><span class="grab-caption">DRAG TO MOVE</span></header><div class="emergency-body"><div class="emergency-heading"><div><span class="eyebrow">LUNAR BASE / RESPONSE REQUIRED</span><h2>${e.title}</h2></div><div class="timer" role="timer" aria-label="Emergency time remaining"><strong id="seconds">${practice?'—':'30'}</strong><span>${practice?'PRACTICE':'SECONDS'}</span></div></div><p>${e.description}</p><div class="emergency-cost"><span>Full intervention</span><strong>${format(e.cost)} ${RESOURCE_LABELS[e.resource].unit} ${RESOURCE_LABELS[e.resource].label.toLowerCase()}</strong></div><label class="contribution-label" for="contribution">Your contribution <strong id="contribution-percent">0%</strong></label><input id="contribution" type="range" min="0" max="${max}" value="0" step="1" aria-describedby="contribution-help"><div class="contribution-scale"><span>0%</span><span>${max}% available</span></div><div class="contribution-summary"><span id="contribution-amount">0 ${RESOURCE_LABELS[e.resource].unit}</span><span><strong id="probability">0%</strong> chance of recovery</span></div><p id="contribution-help" class="fine-print">Only confirming spends stock. Zero contribution always fails.</p><div class="emergency-actions">${button('Stock ledger','inventory')}${PROTOCOLS[id]?button('Inspect report','inspect-incident'):''}${button(practice?'Test this amount':'Confirm contribution','confirm-emergency','primary')}</div></div>`,'emergency',220,245,800,460,'emergency');
  sound.play('alert');setStampAvailability();renderTraining();desk.focus('emergency');announce(practice?'Emergency practice. No time limit.':'Emergency. Thirty seconds. Contribution starts at zero.');
}
function openWorksheet(){
  if(phase!=='emergency'||!PROTOCOLS[emergencyId])return;
  const existing=desk.items.get('worksheet');if(existing){desk.focus('worksheet');return;}
  mount('worksheet',protocolMarkup(emergencyId,protocolSelection),'paper protocol-sheet',1050,275,500,535,'book');
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
  if(training?.lesson===3&&training.practice!=='timed'){
    const required=training.practice==='half'?50:100;
    if(contribution!==required){toast(`For this practice step, select ${required}%.`);return;}
    if(training.practice==='half'){training.practice='full';toast('500 kg gives a 50% chance. Now try a guaranteed recovery.');}
    else{training.practice='timed';toast('Full support guarantees recovery. Now try the real 30-second response.');}
    showEmergency('E02');return;
  }
  busy=true;setStampAvailability();const tx=resolveEmergency(campaign,emergencyId,expired?0:contribution,`incident-${++serial}`);campaign=tx.state;pending=tx.resolution;
  sound.play('confirm');desk.remove('emergency');desk.remove('worksheet');delete stage.dataset.incident;startCinema(tx.resolution);
}
function showOperation(id:string){
  camera.set('desk');
  phase='operation';busy=false;operationId=id;operationChoice=null;desk.remove('emergency');
  const op=OPERATIONS.find(o=>o.id===id)!;showVisitor('adan');$('#speech').textContent='A decision for the base. Compare the costs, choose one option, then approve this order.';
  mount('order',`<header class="order-header"><span>INTERNAL ORDER / ${id}</span><span>SHARED STOCK</span></header><h2>${op.title}</h2><p class="order-intro">Choose one plan. Stamp this order to authorize its cost.</p><div class="order-choices">${op.choices.map(c=>`<button class="order-choice" data-action="choice-${c.id}" aria-pressed="false"><span class="choice-letter">${c.id}</span><div><strong>${c.name}</strong><p>${c.description}</p><span class="choice-cost">${costText(c.cost)}</span></div></button>`).join('')}</div><div id="message-status" class="message-status">${id==='B02'?'↗ Consulting Earth… ideal signal round trip: 2.6 seconds.':'Resources are spent once. No mission approval is counted.'}</div><p class="fine-print">Fictional operation packages. Compare costs with the stock ledger. Insufficient stock ends your shift.</p><div class="order-bottom">${button('Stock ledger','inventory')}${button('NASA field notes','operation-science')}<span id="order-selected">SELECT A OR B</span></div><div class="ink-mark" aria-hidden="true"></div>`,'order paper',385,325,740,455,'order');
  if(id==='B02'){communication=2600;messageSent=true;}else{communication=0;messageSent=false;}
  setStampAvailability();renderTraining();desk.focus('order');
}
function chooseOperation(choice:'A'|'B'){
  if(phase!=='operation'||busy)return;operationChoice=choice;
  document.querySelectorAll<HTMLElement>('.order-choice').forEach(el=>{const active=el.dataset.action===`choice-${choice}`;el.classList.toggle('chosen',active);el.setAttribute('aria-pressed',String(active));});
  $('#order-selected').textContent=`OPTION ${choice} · READY TO STAMP`;setStampAvailability();sound.play('confirm');announce(`Option ${choice} selected. Apply the Approve stamp to this order.`);
}

function makeSteps(r:Resolution){
  if(r.kind!=='mission')return [{label:r.kind==='emergency'?'Intervention in progress':'Preparing the base operation',visual:'base',phase:'base'}];
  const d=DESTINATIONS.find(d=>d.id===r.destination)!;
  const steps=[{label:'Preparing the lunar module',visual:'launch',phase:'launch'},{label:'Ascending from the Moon',visual:'ascent',phase:'outbound'},{label:'Transfer to the orbital transport',visual:'transfer',phase:'outbound'},{label:`Outbound to ${d.name}`,visual:'outbound',phase:'outbound'},{label:d.mode==='orbit'?`Orbital operations at ${d.name}`:`Local module operations on ${d.name}`,visual:d.mode==='orbit'?'orbit':'surface',phase:'destination'},{label:'Returning to the Moon',visual:'return',phase:'return'},{label:'Lunar module descent',visual:'landing',phase:'return'},{label:'Touchdown on the Moon',visual:'home',phase:'return'}];
  if(r.success)return steps;
  const stop=r.stage==='launch'?0:r.stage==='outbound'?3:r.stage==='destination'?4:5;
  return steps.slice(0,stop+1);
}
function startCinema(r:Resolution){
  phase='cinema';busy=true;desk.cancel();setStampAvailability();$('#training-guide').hidden=true;
  for(const item of desk.items.values())item.el.hidden=true;
  cine={steps:makeSteps(r),index:0,elapsed:0,speed:1,revealed:false};pending=r;
  $('#cinema').hidden=false;$('#objects').inert=true;renderCinema();const next=$('#cinema [data-action="skip"]');next.focus({preventScroll:true});if(document.body.classList.contains('compact-ui'))next.scrollIntoView({block:'nearest',inline:'nearest',behavior:'instant'});
}
function renderCinema(){
  if(!cine||!pending)return;const c=cine,r=pending,s=c.steps[c.index],reveal=c.revealed;
  const label=reveal?(r.kind==='mission'?(r.success?'Home, safe.':'Mission stopped.'):r.kind==='operation'?(r.success?'Operation complete.':'Operation stopped.'):r.success?'Base stabilized.':'Base lost.'):s.label;
  const visual=reveal&&!r.success&&r.kind!=='mission'?'base-lost':s.visual;
  const world=['launch','ascent','transfer','landing','home'].includes(visual)?'moon':r.destination??'moon';
  const surface=['launch','ascent','surface','landing','home'].includes(visual);
  const baseStates={lifeSupport:visible.operationChoices.B01==='A'?'regenerative':'pending',refuge:visible.operationChoices.B02?'ready':'pending',food:visible.operationChoices.B03==='A'?'growing':'pending'};
  const art=visual.startsWith('base')?`<div class="cinema-base">${baseView(baseStates,reveal?(r.success?'stable':'lost'):'intervention')}</div>`:`<div class="cinema-world ${surface?'surface-world':''}">${planet(world)}</div><div class="cinema-stars" aria-hidden="true">✦<span>·</span>✧<span>·</span>✦</div>${surface?'<div class="cinema-ground"></div><div class="landing-pad"></div>':''}<div class="cinema-ship ${visual} ${reveal&&!r.success?'stopped':''}">${ship(surface?'module':'transport')}</div>${visual==='transfer'?`<div class="transfer-module">${ship('module')}</div>`:''}`;
  preserveControlFocus($('#cinema'),()=>{$('#cinema').innerHTML=`<div class="projection-frame"><header><span>MISSION PROJECTION</span><span>${r.kind==='mission'?`${nameOf(r.destination).toUpperCase()} / CREW OF 04`:'LUNAR BASE / OPERATIONS'}</span></header><div class="projection-view ${visual} ${reveal?'revealed':''}">${art}${reveal?`<div class="consequence-mark ${r.success?'positive':'negative'}">${r.success?'✓':'!'}</div>`:''}</div><div class="cine-sequence" aria-label="${reveal?'Outcome revealed':`Sequence ${c.index+1} of ${c.steps.length}`}">${c.steps.map((_,i)=>`<i class="${i<c.index||reveal?'complete':i===c.index?'current':''}" aria-hidden="true"></i>`).join('')}</div><div class="cine-caption"><span class="eyebrow">${reveal?'CONSEQUENCE':`SEQUENCE ${c.index+1} / ${c.steps.length}`}</span><h2>${label}</h2><p>${reveal?esc(r.explanation):'Observe the mission. The report follows the outcome.'}</p></div><footer>${button('Ⅱ Pause','pause')}${button(c.speed===1?'Speed ×1':'Speed ×4','speed')}${button(reveal?'Open report':'See outcome','skip','primary')}</footer></div>`;});
  $('#cinema [data-action="speed"]').setAttribute('aria-pressed',String(c.speed===4));
  $('#cinema').dataset.speed=String(c.speed);
  if(prefs.reduced)$('#cinema').classList.add('static');else $('#cinema').classList.remove('static');
}
function reveal(){if(!cine||!pending||cine.revealed)return;cine.revealed=true;cine.elapsed=0;visible=campaign;updateStatus();sound.play(pending.success?'success':'failure');renderCinema();announce(pending.explanation);}
function showReport(){
  if(!pending)return;const r=pending;phase='report';cine=null;$('#cinema').hidden=true;visible=campaign;busy=false;setStampAvailability();
  const title=r.kind==='mission'?(r.success?'A safe return.':'A mission interrupted.'):r.kind==='operation'?(r.success?'Order carried out.':'Order could not be supplied.'):r.success?'The base is stable.':'The base was lost.';
  const rows=RESOURCES.filter(k=>r.kind==='mission'||r.minimum[k]||r.spent[k]);
  showModal('report',`<div class="report-paper"><header><span>AFTER-ACTION REPORT</span><span>${r.destination?nameOf(r.destination):r.event??r.operation}</span></header><span class="report-symbol ${r.success?'positive':'negative'}">${r.success?'✓':'!'}</span><h1>${title}</h1><p>${esc(r.explanation)}${r.fatal?' Your shift ends after this report.':''}</p><div class="report-table-scroll" tabindex="0" role="region" aria-label="Resource accounting, scroll horizontally on small screens"><table class="report-table"><caption class="sr-only">Resources required, requested, spent and remaining after this decision</caption><thead><tr><th scope="col">Resource</th><th scope="col">Minimum</th><th scope="col">Requested</th><th scope="col">Spent</th><th scope="col">Stock left</th></tr></thead><tbody>${rows.map(k=>`<tr><th scope="row">${RESOURCE_LABELS[k].label}<span>${RESOURCE_LABELS[k].unit}</span></th><td>${format(r.minimum[k])}</td><td>${format(r.requested[k])}</td><td>${format(r.spent[k])}</td><td>${format(r.balance[k])}</td></tr>`).join('')}</tbody></table></div><div class="report-explanation">${r.kind==='mission'?rows.filter(k=>r.spent[k]<r.minimum[k]||r.spent[k]<r.requested[k]).map(k=>`<p><strong>${RESOURCE_LABELS[k].label}:</strong> ${r.spent[k]<r.minimum[k]?`${format(r.spent[k])} supplied; ${format(r.minimum[k])} needed.`:'The minimum was covered, but the full request was unavailable.'}</p>`).join('')||'<p>Every minimum and the complete request were covered.</p>':r.kind==='emergency'?`<p>Actual contribution: ${Math.round((r.probability??0)*100)}%. Partial support is a chance, not a guarantee.</p>`:'<p>This operation uses the shared store. It does not change mission success rate.</p>'}</div><footer><span>No refunds. Every resource has its own purpose.</span>${button(training?.error||training&&r.fatal?'Try lesson again':'File report →','archive','primary')}</footer></div>`);
}
function archive(){
  closeModal();for(const id of ['manual','ledger']){const item=desk.items.get(id);if(item)item.el.hidden=false;}
  if(training){const lesson=training.lesson;if(training.error||pending?.fatal){setupTraining(lesson);return;}if(lesson===1){setupTraining(2);return;}if(lesson===3){setupTraining(4);return;}if(lesson===4){trainingFinished();return;}}
  advance();
}
function showFinal(grade:'certificate'|'office'|'dismissal'){
  phase='final';busy=false;training=null;setStampAvailability();const title=grade==='certificate'?'Clear skies, officer.':grade==='office'?'A new assignment.':'Your shift has ended.';
  const sub=grade==='certificate'?'CERTIFICATE OF LUNAR SERVICE':grade==='office'?'TRANSFER TO OPERATIONS OFFICE':'NOTICE OF DISMISSAL';
  showModal('final',`<section class="final-paper ${grade}"><div class="final-insignia">✦</div><span class="eyebrow">${sub}</span><h1>${title}</h1><p>${grade==='certificate'?'Five destinations. Two emergencies. Every approved mission returned safely.':grade==='office'?'The expeditions are complete. Your experience will help the operations office.':campaign.terminal==='emergency'?'The base could not recover from the incident.':campaign.terminal==='stock'?'A request exceeded the shared stock.':'Too many approved missions could not complete their journeys.'}</p><div class="final-stats"><div><strong>${campaign.completed.length}/5</strong><span>successful destinations</span></div><div><strong>${campaign.approvals?`${Math.round(campaign.completed.length/campaign.approvals*100)}%`:'—'}</strong><span>mission success rate</span></div><div><strong>${campaign.events.filter(e=>e.resolved).length}/2</strong><span>incidents encountered</span></div></div><div class="final-log" id="final-log"></div><div class="final-log-controls">${button('‹ Previous','final-prev')}<span id="final-page"></span>${button('Next ›','final-next')}</div><p class="seed-line">REPLAY SEED: <code>${esc(campaign.seed)}</code></p><footer>${button('Menu','menu')}${button('Another shift →','new-shift','primary')}</footer></section>`);ledgerPage=0;renderFinalLog();
}
function renderFinalLog(){const entries=[...campaign.history].reverse(),pages=Math.max(1,Math.ceil(entries.length/4));ledgerPage=Math.max(0,Math.min(ledgerPage,pages-1));$('#final-log').innerHTML=logEntries(entries,ledgerPage);$('#final-page').textContent=`${ledgerPage+1} / ${pages}`;$<HTMLButtonElement>('[data-action="final-prev"]').disabled=ledgerPage===0;$<HTMLButtonElement>('[data-action="final-next"]').disabled=ledgerPage===pages-1;}

function setupTraining(lesson:number){
  clock.clear();desk.cancel();closeModal();$('#cinema').hidden=true;cine=null;pending=null;busy=false;paused=false;clock.setPaused(false);sound.pause(false);
  stage.classList.remove('paused');camera.set('desk');training={lesson,step:0,practice:'half',error:false};stage.classList.remove('menu-mode');
  for(const id of ['flight','life','power','order','emergency','worksheet'])desk.remove(id);
  campaign=createCampaign(`training-${lesson}`);campaign.stock=vector(200000,400000,100000,20000000,20000000);campaign.initial={...campaign.stock};campaign.events.forEach(e=>e.resolved=true);
  if(lesson===1||lesson===2){const d=DESTINATIONS.find(d=>d.id===(lesson===1?'earth':'mars'))!;campaign.proposal={id:`practice-${lesson}`,destinationId:d.id,engineerId:lesson===1?'adan':'leo',minimum:{...d.minimum},requested:{...d.minimum,...(lesson===2?{food:units(6900)}:{})}};visible=campaign;renderProposal();}
  if(lesson===3){campaign.events=[{id:'E02',afterSuccess:0,resolved:false}];visible=campaign;showEmergency('E02');}
  if(lesson===4){campaign.completed=['earth'];visible=campaign;showOperation('B01');}
  updateStatus();renderTraining();setStampAvailability();scale();if(lesson<3)$('[data-action="recover-flight"]').focus({preventScroll:true});
}
function progressTraining(){
  if(!training)return;
  if(training.lesson===1){
    if(training.step===0&&!desk.items.get('flight')?.stored){training.step=1;renderTraining();}
    if(training.step===3&&['flight','life','power'].every(id=>desk.items.get(id)?.stored===false)){training.step=4;renderTraining();}
  }
}
function renderTraining(){
  const guide=$('#training-guide');guide.hidden=!training||['cinema','report'].includes(phase);if(!training)return;
  const first=['Take the flight plan from the tray. Hold and drag it onto the desk.','Open the Mission Manual. Press B or use the book at the left.','Open Routes and find Earth yourself. The book will never choose for you.','Take both resource sheets. Compare all five requests with Earth’s minimums.','Open the stock ledger with I. The stock must cover the entire request.','Take APPROVE and release it on a sheet. Every request equals its minimum.'];
  const instruction=training.lesson===1?first[training.step]:training.lesson===2?'The next route is Mars. Food requested: 6,900 kg. Find its minimum in the manual. Return the proposal if something is missing.':training.lesson===3?(training.practice==='half'?'Practice without a clock: select 50% and test the amount. How many kilograms is that?':training.practice==='full'?'Now select 100%. Full support guarantees recovery. Test it, then try with the clock.':'The clock is running. Contribution starts at zero. Choose your amount and confirm within 30 seconds.'):'The base also needs resources. Read both options, check the stock and stamp the chosen internal order.';
  guide.innerHTML=`<div class="training-heading"><span>TRAINING / ${training.lesson} OF 4</span>${button('Repeat','repeat-lesson')}${button('Exit','exit-training')}</div><p>${instruction}</p><div class="training-progress" role="img" aria-label="Lesson ${training.lesson} of 4">${[1,2,3,4].map(n=>`<i class="${n<=training!.lesson?'active':''}"></i>`).join('')}</div>`;
}
function trainingFinished(){training=null;phase='menu';$('#training-guide').hidden=true;setStampAvailability();showModal('training-finished',`<section class="small-panel"><span class="eyebrow">TRAINING COMPLETE</span><h1>You know the desk.</h1><p>You compared a request, returned an unsafe plan, handled an emergency and paid for a base operation.</p><p>Your real shift starts with a new seed and its own inventory.</p>${button('Begin a new shift →','new-shift','primary')}${button('Back to menu','menu')}</section>`);}

function modalFocusables(){return Array.from($('#modal-layer').querySelectorAll<HTMLElement>('button:not(:disabled),input:not(:disabled),a[href],summary,[tabindex="0"]')).filter(el=>el.checkVisibility()&&!el.closest('[hidden],[inert]')&&(!el.closest('details:not([open])')||el.matches('summary')));}
function showModal(name:string,html:string){
  if(!modal)modalReturnFocus=document.activeElement as HTMLElement;
  modal=name;const layer=$('#modal-layer');stage.append($('#toast'));layer.innerHTML=html;layer.hidden=false;layer.scrollTop=0;layer.dataset.modal=name;
  layer.setAttribute('role','dialog');layer.setAttribute('aria-modal','true');layer.tabIndex=-1;
  const heading=layer.querySelector('h1');if(heading){heading.id='modal-title';layer.setAttribute('aria-labelledby','modal-title');}
  else{layer.removeAttribute('aria-labelledby');layer.setAttribute('aria-label','Space Papers');}
  stage.inert=true;desk.enabled=false;$('#small-screen').hidden=true;
  queueMicrotask(()=>{const first=modalFocusables()[0];(first??layer).focus({preventScroll:true});});
}
function closeModal(){
  modal='';const layer=$('#modal-layer');stage.append($('#toast'));layer.hidden=true;layer.innerHTML='';stage.inert=false;$('#small-screen').hidden=!document.body.classList.contains('compact-ui')||phase==='menu'||screenHintDismissed;
  $('#objects').inert=camera.position==='room'||phase==='cinema';
  const target=modalReturnFocus;modalReturnFocus=null;
  if(target?.isConnected&&!target.closest('[hidden],[inert]'))target.focus({preventScroll:true});
}
function menu(){resetSession();camera.set('room');training=null;phase='menu';stage.classList.add('menu-mode');setStampAvailability();
  scale();showModal('menu',`<section class="menu"><div class="menu-copy"><div class="edition">LUNAR OPERATIONS BUREAU <span>SECTOR 04</span></div><h1>Space<br><em>Papers.</em></h1><p class="menu-lead">A small desk. A very big responsibility.</p><p class="menu-description">Read the mission. Compare the supplies.<br>Stamp a safe journey home.</p><div class="menu-buttons">${button('Begin shift <span aria-hidden="true">↗</span>','new-shift','primary')}<button type="button" data-action="training" class="secondary" aria-label="Training">Training <span>4 GUIDED LESSONS</span></button></div><div class="menu-links">${button('Options','options')}${button('Credits & science','credits')}</div><details class="seed-picker"><summary>Replay a seed</summary><label for="seed-input">Seed</label><input id="seed-input" maxlength="80" autocomplete="off" placeholder="e.g. lunar-morning">${button('Start replay','replay')}</details><div class="menu-footer"><span class="connection-dot" aria-hidden="true"></span>OFFLINE READY <span class="menu-footer-separator">/</span> LOS VALAR</div></div><aside class="assignment-card" aria-label="Your assignment"><div class="assignment-station"><span class="eyebrow">LUNAR OPERATIONS / OFFICER BRIEF</span><span aria-hidden="true">✦</span></div><h2>Every journey<br>starts at your desk.</h2><ol class="assignment-steps"><li><span aria-hidden="true">01</span><div><strong>Read the route</strong><p>Three papers. One expedition.</p></div></li><li><span aria-hidden="true">02</span><div><strong>Compare the supplies</strong><p>Your manual and stock tell the story.</p></div></li><li><span aria-hidden="true">03</span><div><strong>Make your mark</strong><p>Approve a safe request. Return a shortage.</p></div></li></ol><div class="assignment-goal"><strong>5 destinations</strong><span>2 incidents · one shared stock</span></div><footer>FIELD ASSIGNMENT <span>SP—04 / LUNAR SECTOR</span></footer></aside></section>`);
}
function pause(){if(phase==='menu'||paused)return;paused=true;lastFocus=document.activeElement as HTMLElement;desk.cancel();clock.setPaused(true);sound.pause(true);stage.classList.add('paused');setStampAvailability();showPause();}
function showPause(){showModal('pause',`<section class="small-panel"><span class="eyebrow">LUNAR OPERATIONS / ON HOLD</span><h1>Take a breath.</h1><p>Your papers, the mission and the emergency clock are paused.</p>${button('Continue shift →','resume','primary')}${button('Options','options')}${button('Return to menu','leave')}<p class="fine-print">Your shift is not saved when you leave.</p></section>`);}
function resume(){closeModal();paused=false;stage.classList.remove('paused');clock.setPaused(false);sound.pause(false);setStampAvailability();if(phase==='report')showReport();else if(phase==='final')showFinal(finalGrade(campaign.completed.length,campaign.approvals,!!campaign.terminal));else lastFocus?.isConnected&&lastFocus.focus({preventScroll:true});}
function options(){showModal('options',`<section class="small-panel options-panel"><span class="eyebrow">PERSONAL EQUIPMENT SETTINGS</span><h1>Make it yours.</h1><label class="setting"><span>Sound volume <output id="volume-value">${Math.round(prefs.volume*100)}%</output></span><input type="range" id="volume" min="0" max="100" value="${Math.round(prefs.volume*100)}"></label><label class="setting"><span>Mute sound</span><input type="checkbox" id="muted" ${prefs.muted?'checked':''}></label><label class="setting"><span>Reduce motion<small>Keep animation and camera movement still</small></span><input type="checkbox" id="reduced" ${prefs.reduced?'checked':''}></label><label class="setting"><span>Place objects with two clicks<small>Select an object, then choose a spot. No dragging needed.</small></span><input type="checkbox" id="click-placement" ${prefs.clickPlacement?'checked':''}></label><p class="fine-print">You can always use the keyboard. English edition. Campaigns are not saved; these preferences are.</p>${button('Full screen','fullscreen')}${button('Done','settings-done','primary')}</section>`);}
function credits(){showModal('credits',`<section class="credits-panel"><span class="eyebrow">SPACE PAPERS / LOS VALAR</span><h1>Science behind<br>the paperwork.</h1><div class="credits-columns"><div><h3>An original lunar desk</h3><p>Game concept and direction: Los valar. Implementation and original vector stand-ins: assisted by OpenAI Codex and Terra agents.</p><p>Room, desk and door: original Blender renders supplied by Los valar, integrated as layered WebP images. The nine engineers use the team’s supplied transparent renders for idle, speech and stamp reactions; the original rigged walking cycle is re-rendered in consecutive frames. Remaining procedural illustrations are provisional.</p><p>Interaction research references Papers, Please by Lucas Pope. No art, text, audio or code from that game is used.</p><p>Sound cues are synthesized locally. System fonts. No player analytics, account or live API connection.</p></div><div><h3>NASA field references</h3><ul><li><a href="https://ccmc.gsfc.nasa.gov/DONKI/events/30666/2/" target="_blank" rel="noopener">DONKI · May 10, 2024 · X3.9</a></li><li><a href="https://www.nasa.gov/missions/station/nasa-achieves-water-recovery-milestone-on-international-space-station/" target="_blank" rel="noopener">ISS water-recovery milestone</a></li><li><a href="https://www.nasa.gov/missions/station/veggie-plant-growth-system-activated-on-international-space-station/" target="_blank" rel="noopener">Veg-01 growing experiment</a></li><li><a href="https://science.nasa.gov/science-research/heliophysics/how-nasa-will-protect-astronauts-from-space-radiation-at-the-moon/" target="_blank" rel="noopener">Radiation protection at the Moon</a></li><li><a href="https://science.nasa.gov/mission/webb/science-overview/science-explainers/how-does-webb-see-back-in-time/" target="_blank" rel="noopener">Light travel time</a></li></ul><p>All economic costs and survival probabilities are fictional game balance. Scientific observations remain separate. NASA does not endorse this game.</p></div></div>${button('Back','settings-done','primary')}</section>`);}
function help(){if(phase!=='menu'&&!paused)pause();showModal('help',`<section class="small-panel"><span class="eyebrow">YOUR DESK / QUICK REFERENCE</span><h1>Every paper<br>has a place.</h1><dl class="controls-list"><dt>Hold + drag</dt><dd>Move a sheet, book or stamp</dd><dt>Click stamp, then sheet</dt><dd>Stamp without dragging</dd><dt>B / I / R</dt><dd>Manual / inventory / record</dd><dt>1 / 2 / 3</dt><dd>Find a covered sheet</dd><dt>Tab · Enter · arrows</dt><dd>Focus, take, move and place</dd><dt>Escape / F</dt><dd>Pause / full screen</dd></dl><p>Store sheets by dropping them into the tray. Use the document buttons to recover a covered sheet. Escape first cancels a held object or stamp; press again to pause. Options includes two-click placement.</p>${button('Back to desk','resume','primary')}</section>`);}

document.addEventListener('click',event=>{
  const target=(event.target as HTMLElement).closest<HTMLElement>('[data-action],[data-stamp-target]');if(!target)return;
  if(target.dataset.stampTarget){desk.applySelectedStamp(target.dataset.stampTarget);return;}
  const action=target.dataset.action!;if((target as HTMLButtonElement).disabled)return;
  if(action==='camera-desk'||action==='camera-room'){if(!paused&&!busy&&phase==='desk'){camera.set(action==='camera-desk'?'desk':'room', true);updateTaskGuide();announce(action==='camera-desk'?'Desk view. Read the route, compare the manual and check inventory.':'Room view.');}return;}
  if(action==='new-shift'){start();return;}if(action==='training'){resetSession();setupTraining(1);return;}
  if(action==='replay'){start($<HTMLInputElement>('#seed-input')?.value);return;}
  if(action==='menu'){menu();return;}if(action==='pause'){pause();return;}if(action==='resume'){resume();return;}
  if(action==='options'){options();return;}if(action==='credits'){credits();return;}if(action==='settings-done'){if(paused)showPause();else menu();return;}
  if(action==='dismiss-screen-hint'){screenHintDismissed=true;$('#small-screen').hidden=true;return;}
  if(action==='fullscreen'){if(!document.documentElement.requestFullscreen){toast('Full screen is unavailable in this browser.');return;}if(document.fullscreenElement)void document.exitFullscreen().catch(()=>toast('Full screen is unavailable.'));else void document.documentElement.requestFullscreen().catch(()=>toast('Full screen is unavailable. Enlarge the browser window instead.'));return;}
  if(action==='leave'||action==='exit-training'){if(!paused&&phase!=='menu')pause();showModal('leave',`<section class="small-panel"><h1>Leave this shift?</h1><p>Your current campaign will end. Only preferences are saved.</p>${button('Keep playing','resume','primary')}${button('End shift and leave','menu')}</section>`);return;}
  if(action==='help'){help();return;}if(action==='repeat-lesson'&&training){setupTraining(training.lesson);return;}
  if(paused)return;
  if(action==='archive'){archive();return;}if(action==='speed'&&cine){cine.speed=cine.speed===1?4:1;renderCinema();return;}
  if(action==='skip'&&cine){if(cine.revealed)showReport();else{cine.index=cine.steps.length-1;reveal();}return;}
  if(action==='final-prev'){ledgerPage--;renderFinalLog();return;}if(action==='final-next'){ledgerPage++;renderFinalLog();return;}
  if(!['desk','emergency','operation'].includes(phase)||busy)return;
  if(action.startsWith('recover-')){camera.set('desk');desk.focus(action.slice(8));updateTaskGuide();return;}
  if(action==='manual'){openManual();return;}if(action==='inventory'){openLedger('stock');return;}if(action==='record'){openLedger('record');return;}
  if(action==='close-manual'){desk.items.get('manual')!.el.hidden=true;$('.book-tool').focus();return;}if(action==='close-ledger'){desk.items.get('ledger')!.el.hidden=true;$('.ledger-tool').focus();return;}
  if(action==='pin'){const item=desk.items.get('manual')!;desk.setPinned('manual',!item.pinned);renderManual();return;}
  if(action==='store'){desk.storeAll();return;}if(action==='compare'){desk.beside(desk.selected);progressTraining();return;}if(action==='cancel-stamp'){desk.cancel();announce('Stamp cancelled.');return;}
  if(action==='log-prev'){ledgerPage=Math.max(0,ledgerPage-1);renderLedger();return;}if(action==='log-next'){ledgerPage++;renderLedger();return;}
  if(action==='book-prev'){bookPage=(bookPage+(bookTab==='rules'?3:bookTab==='science'?4:1))%(bookTab==='rules'?4:bookTab==='science'?5:2);renderManual();return;}
  if(action==='book-next'){bookPage=(bookPage+1)%(bookTab==='rules'?4:bookTab==='science'?5:2);renderManual();return;}
  if(action.startsWith('book-')){bookTab=action.slice(5);bookPage=0;renderManual();sound.play('page');return;}
  if(action.startsWith('destination-')){bookDestination=action.slice(12);bookTab='destinations';renderManual();sound.play('page');if(training?.lesson===1&&training.step===2&&bookDestination==='earth'){training.step=3;renderTraining();progressTraining();}return;}
  if(action==='inspect-incident'){openWorksheet();return;}
  if(action.startsWith('protocol-')&&phase==='emergency'){protocolSelection=Number(action.slice(9));const sheet=desk.items.get('worksheet');if(sheet){sheet.el.innerHTML=protocolMarkup(emergencyId,protocolSelection);sheet.el.querySelector<HTMLElement>(`[data-action="${action}"]`)?.focus();}sound.play('confirm');return;}
  if(action==='confirm-emergency'){confirmEmergency();return;}
  if(action==='choice-A'||action==='choice-B'){chooseOperation(action.at(-1) as 'A'|'B');return;}
  if(action==='operation-science'){bookTab='science';bookPage=operationId==='B01'?1:operationId==='B02'?3:2;openManual();return;}
});
document.addEventListener('click',event=>{const tool=(event.target as HTMLElement).closest<HTMLElement>('[data-stamp-tool]');if(tool&&!(tool as HTMLButtonElement).disabled&&!desk.stamp)desk.selectStamp(tool.dataset.stampTool as 'approve'|'return');});
document.addEventListener('input',event=>{
  const input=event.target as HTMLInputElement;if(input.id==='contribution'){updateContribution();return;}
  if(input.id==='inspection-dial'&&phase==='emergency'){protocolSelection=Number(input.value);const p=PROTOCOLS[emergencyId];const feedback=document.querySelector('.protocol-feedback');if(p&&feedback)feedback.textContent=p.feedback[protocolSelection];document.querySelectorAll<HTMLElement>('.protocol-options [data-action]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.action===`protocol-${protocolSelection}`)));return;}
  if(input.id==='volume'){prefs.volume=Number(input.value)/100;$('#volume-value').textContent=`${input.value}%`;input.setAttribute('aria-valuetext',`${input.value}%`);}
  if(input.id==='muted')prefs.muted=input.checked;
  if(input.id==='reduced')prefs.reduced=input.checked;
  if(input.id==='click-placement')prefs.clickPlacement=input.checked;
  applyPreferences();
});
document.addEventListener('keydown',event=>{
  if(event.key==='Tab'&&modal){const focusables=modalFocusables(),first=focusables[0],last=focusables.at(-1);if(!first){event.preventDefault();$('#modal-layer').focus();}else if(!$('#modal-layer').contains(document.activeElement)||event.shiftKey&&document.activeElement===first){event.preventDefault();(event.shiftKey?last:first)?.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}return;}
  if(event.key==='Tab'&&phase==='cinema'&&!paused){const controls=Array.from($('#cinema').querySelectorAll<HTMLButtonElement>('button:not(:disabled)'));const first=controls[0],last=controls.at(-1);if(!$('#cinema').contains(document.activeElement)||event.shiftKey&&document.activeElement===first){event.preventDefault();(event.shiftKey?last:first)?.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}return;}
  if(event.key==='Escape'){event.preventDefault();if(paused){if(modal==='pause')resume();else showPause();}else if(phase!=='menu')pause();else menu();return;}
  if(modal)return;
  if((event.target as HTMLElement).matches('input,textarea,select')||event.ctrlKey||event.metaKey||event.altKey)return;
  if(event.repeat&&['Enter',' '].includes(event.key)){event.preventDefault();return;}
  if(event.key.toLowerCase()==='f'){event.preventDefault();if(document.fullscreenElement)void document.exitFullscreen().catch(()=>{});else if(document.documentElement.requestFullscreen)void document.documentElement.requestFullscreen().catch(()=>toast('Full screen is unavailable.'));return;}
  if(paused||!['desk','emergency','operation'].includes(phase))return;
  const key=event.key.toLowerCase();if(key==='b'){event.preventDefault();openManual();}if(key==='i'){event.preventDefault();openLedger('stock');}if(key==='r'){event.preventDefault();openLedger('record');}
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
  if(phase==='emergency'&&!(training?.lesson===3&&training.practice!=='timed')){
    remaining=Math.max(0,remaining-phaseTime);const sec=Math.ceil(remaining/1000);const counter=$('#seconds');if(counter)counter.textContent=String(sec);
    desk.items.get('emergency')?.el.classList.toggle('urgent',remaining<=10000);
    if(sec<=10&&sec!==alarmSecond){alarmSecond=sec;sound.play('alert');if([10,5].includes(sec))announce(`${sec} seconds remaining.`);}
    if(remaining===0)confirmEmergency(true);
  }
  if(communication>0){communication=Math.max(0,communication-dt);if(communication===0&&messageSent){const status=$('#message-status');if(status)status.textContent='↙ Earth received the message. Local protocol remains your responsibility.';announce('Earth received the message. No additional resources.');}}
  if(cine&&phase==='cinema'){
    cine.elapsed+=phaseTime*cine.speed;
    if(cine.revealed){if(cine.elapsed>=2400)showReport();}
    else if(cine.elapsed>=(prefs.reduced?800:1800)){cine.elapsed=0;if(cine.index<cine.steps.length-1){cine.index++;renderCinema();}else reveal();}
  }
});
scale();menu();clock.start();

// Development-only inspection and fixtures. Vite removes this branch in production.
if(import.meta.env.DEV){
  Object.assign(window,{__SPACE_PAPERS__:{
    state:()=>structuredClone(campaign),view:()=>({phase,paused,cinemaElapsed:cine?.elapsed??null,camera:camera.position,remaining,contribution,bookDestination,training:training&&{...training},pending:pending&&{...pending}}),
    visitor:()=>visitorSequence.snapshot(),manualTime:()=>clock.stop(),advanceTime:(ms:number)=>clock.step(ms),
    start,training:setupTraining,engineer:(id:string)=>{if(ENGINEERS.some(e=>e.id===id)){showVisitor(id);camera.set('room');}},
    scenario:(kind:string)=>{start('qa-scenario');campaign.events.forEach(e=>e.resolved=true);campaign.stock=vector(200000,400000,100000,30000000,30000000);
      if(kind.startsWith('emergency')){const eventId=kind.split(':')[1]||'E02';campaign.events=[{id:eventId,afterSuccess:0,resolved:false}];visible=campaign;for(const id of ['flight','life','power'])desk.remove(id);showEmergency(eventId);}
      else if(kind==='operation'){campaign.completed=['earth'];visible=campaign;for(const id of ['flight','life','power'])desk.remove(id);showOperation('B01');}
      else{const d=DESTINATIONS.find(d=>d.id==='earth')!;campaign.proposal={id:'qa',destinationId:d.id,engineerId:'adan',minimum:{...d.minimum},requested:{...d.minimum}};if(kind==='short')campaign.proposal.requested.food=units(6900);if(kind==='stock')campaign.stock.energy=0;visible=campaign;renderProposal();}updateStatus();},
  }});
}
