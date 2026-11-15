import { DESTINATIONS } from '../data/catalog';
import type { Campaign, Resolution } from '../game/campaign';
import { planet, ship, baseView } from '../ui/art';
import { button, esc, nameOf } from '../ui/helpers';

export function makeSteps(r:Resolution){
  if(r.kind!=='mission')return (r.kind==='emergency'?['Response transmitted to the base','Intervention team at work','Checking habitat systems']:['Preparing the selected plan','Base team carrying out the order','Checking habitat systems']).map(label=>({label,visual:'base',phase:'base'}));
  const d=DESTINATIONS.find(d=>d.id===r.destination)!;
  const steps=[{label:'Preparing the lunar module',visual:'launch',phase:'launch'},{label:'Ascending from the Moon',visual:'ascent',phase:'outbound'},{label:'Transfer to the orbital transport',visual:'transfer',phase:'outbound'},{label:`Outbound to ${d.name}`,visual:'outbound',phase:'outbound'},{label:d.mode==='orbit'?`Orbital operations at ${d.name}`:`Local module operations on ${d.name}`,visual:d.mode==='orbit'?'orbit':'surface',phase:'destination'},{label:'Returning to the Moon',visual:'return',phase:'return'},{label:'Lunar module descent',visual:'landing',phase:'return'},{label:'Touchdown on the Moon',visual:'home',phase:'return'}];
  if(r.success)return steps;
  const stop=r.stage==='launch'?0:r.stage==='outbound'?3:r.stage==='destination'?4:5;
  return steps.slice(0,stop+1);
}

export function cinemaMarkup(c:{steps:Array<{label:string;visual:string;phase:string}>;index:number;elapsed:number;speed:number;revealed:boolean}, r:Resolution, visible:Campaign) {
  const s=c.steps[c.index],reveal=c.revealed;
  const label=reveal?(r.kind==='mission'?(r.success?'Home, safe.':'Mission stopped.'):r.kind==='operation'?(r.success?'Operation complete.':'Operation stopped.'):r.success?'Base stabilized.':'Base lost.'):s.label;
  const visual=reveal&&!r.success&&r.kind!=='mission'?'base-lost':s.visual;
  const world=['launch','ascent','transfer','landing','home'].includes(visual)?'moon':r.destination??'moon';
  const surface=['launch','ascent','surface','landing','home'].includes(visual);
  const baseStates={lifeSupport:visible.operationChoices.B01==='A'?'regenerative':'pending',refuge:visible.operationChoices.B02?'ready':'pending',food:visible.operationChoices.B03==='A'?'growing':'pending'};
  const art=visual.startsWith('base')?`<div class="cinema-base">${baseView(baseStates,reveal?(r.success?'stable':'lost'):r.kind==='emergency'?'intervention':'normal')}</div>`:`<div class="cinema-world ${surface?'surface-world':''}">${planet(world)}</div><div class="cinema-stars" aria-hidden="true">✦<span>·</span>✧<span>·</span>✦</div>${surface?'<div class="cinema-ground"></div><div class="landing-pad"></div>':''}<div class="cinema-ship ${visual} ${reveal&&!r.success?'stopped':''}">${ship(surface?'module':'transport')}</div>${visual==='transfer'?`<div class="transfer-module">${ship('module')}</div>`:''}`;
  return `<div class="projection-frame"><header><span>MISSION PROJECTION</span><span>${r.kind==='mission'?`${nameOf(r.destination).toUpperCase()} / CREW OF 04`:'LUNAR BASE / OPERATIONS'}</span></header><div class="projection-view ${visual} ${reveal?'revealed':''}">${art}${reveal?`<div class="consequence-mark ${r.success?'positive':'negative'}">${r.success?'✓':'!'}</div>`:''}</div><div class="cine-sequence" aria-label="${reveal?'Outcome revealed':`Sequence ${c.index+1} of ${c.steps.length}`}">${c.steps.map((_,i)=>`<i class="${i<c.index||reveal?'complete':i===c.index?'current':''}" aria-hidden="true"></i>`).join('')}</div><div class="cine-caption"><span class="eyebrow">${reveal?'CONSEQUENCE':`SEQUENCE ${c.index+1} / ${c.steps.length}`}</span><h2>${label}</h2><p>${reveal?esc(r.explanation):'Observe the mission. The report follows the outcome.'}</p></div><footer>${button('Ⅱ Pause','pause')}${button(c.speed===1?'Speed ×1':'Speed ×4','speed')}${button(reveal?'Open report':'See outcome','skip','primary')}</footer></div>`;
}
