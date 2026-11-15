import { DESTINATIONS } from '../data/catalog';
import type { Campaign, Resolution } from '../game/campaign';
import { planet } from '../ui/art';
import { assetUrl } from '../core/assets';
import '../styles/cinema-ships.css';
import { button, esc } from '../ui/helpers';
import { stationImage, stationSequenceLight } from './lunar-station';

type ShipKind = 'module' | 'transport';
type CinemaState = {steps:Array<{label:string;visual:string;phase:string}>;index:number;elapsed:number;speed:number;revealed:boolean};

function shipFrameUrl(kind:ShipKind, frame:number):string {
  return assetUrl(`assets/images/ships/${kind}-${String(frame).padStart(4,'0')}.webp`);
}

let shipsPreloaded = false;
function preloadShips():void {
  if (shipsPreloaded) return;
  shipsPreloaded = true;
  for (const kind of ['module', 'transport'] as const) for (let frame = 1; frame <= 24; frame++) {
    const image = new Image();
    image.src = shipFrameUrl(kind, frame);
  }
}

function shipImage(kind:ShipKind, powered:boolean):string {
  return `<img class="cinema-ship-image" data-ship="${kind}" data-powered="${powered}" data-frame="1" src="${shipFrameUrl(kind, 1)}" alt="" draggable="false">`;
}

/** Keep ship movement and ignition in step with the sequence clock. */
export function updateCinemaFrame(root:HTMLElement, c:CinemaState, reduced:boolean):void {
  const frame = !reduced && !c.revealed ? Math.min(24, Math.floor(c.elapsed / 75) + 1) : 1;
  const vessel = root.querySelector<HTMLElement>('.cinema-ship');
  if (vessel) {
    const progress = c.revealed ? 1 : Math.min(1, c.elapsed / 1800);
    const visual = c.steps[c.index].visual;
    const xScale = Math.min(1, root.clientWidth / 1000);
    const yScale = Math.min(1, root.clientHeight / 900);
    const transforms:Record<string, string> = {
      ascent: `translateY(${-150 * progress * yScale}px)`,
      landing: `translateY(${(-150 + 150 * progress) * yScale}px)`,
      outbound: `translateX(${(-60 + 190 * progress) * xScale}px)`,
      return: `translateX(${(130 - 210 * progress) * xScale}px)`,
    };
    vessel.style.transform = reduced ? '' : transforms[visual] ?? '';
  }
  root.querySelectorAll<HTMLImageElement>('.cinema-ship-image').forEach(image => {
    const next = image.dataset.powered === 'true' ? frame : 1;
    if (image.dataset.frame === String(next)) return;
    image.dataset.frame = String(next);
    image.src = shipFrameUrl(image.dataset.ship as ShipKind, next);
  });
}

export function makeSteps(r:Resolution){
  if(r.kind!=='mission')return (r.kind==='emergency'?['Response transmitted to the base','Intervention team at work','Checking habitat systems']:['Preparing the selected plan','Base team carrying out the order','Checking habitat systems']).map(label=>({label,visual:'base',phase:'base'}));
  const d=DESTINATIONS.find(d=>d.id===r.destination)!;
  const steps=[{label:'Preparing the lunar module',visual:'launch',phase:'launch'},{label:'Ascending from the Moon',visual:'ascent',phase:'outbound'},{label:'Transfer to the orbital transport',visual:'transfer',phase:'outbound'},{label:`Outbound to ${d.name}`,visual:'outbound',phase:'outbound'},{label:d.mode==='orbit'?`Orbital operations at ${d.name}`:`Local module operations on ${d.name}`,visual:d.mode==='orbit'?'orbit':'surface',phase:'destination'},{label:'Returning to the Moon',visual:'return',phase:'return'},{label:'Lunar module descent',visual:'landing',phase:'return'},{label:'Touchdown on the Moon',visual:'home',phase:'return'}];
  if(r.success)return steps;
  const stop=r.stage==='launch'?0:r.stage==='outbound'?3:r.stage==='destination'?4:5;
  return steps.slice(0,stop+1);
}

export function cinemaMarkup(c:CinemaState, r:Resolution, _visible:Campaign) {
  const s=c.steps[c.index],reveal=c.revealed;
  const label=reveal?(r.kind==='mission'?(r.success?'Home, safe.':'Mission stopped.'):r.kind==='operation'?(r.success?'Operation complete.':'Operation stopped.'):r.success?'Base stabilized.':'Base lost.'):s.label;
  const visual=reveal&&!r.success&&r.kind!=='mission'?'base-lost':s.visual;
  const world=['launch','ascent','transfer','landing','home'].includes(visual)?'moon':r.destination??'moon';
  const surface=['launch','ascent','surface','landing','home'].includes(visual);
  const baseCode=r.kind==='operation'?r.operation:r.event;
  const stationLight=r.kind!=='mission'?stationSequenceLight(baseCode,c.index,reveal,r.success):undefined;
  if (r.kind === 'mission') preloadShips();
  const kind:ShipKind = surface ? 'module' : 'transport';
  const powered = ['ascent', 'landing', 'outbound', 'return'].includes(visual);
  const art=stationLight?`<div class="cinema-base lunar-station lunar-station-cinema" data-light="${stationLight}" data-event="${esc(baseCode ?? '')}" aria-hidden="true">${stationImage(stationLight)}</div>`:`<div class="cinema-world ${surface?'surface-world':''}">${planet(world)}</div><div class="cinema-stars" aria-hidden="true"></div>${surface?'<div class="cinema-ground"></div><div class="landing-pad"></div>':''}<div class="cinema-ship ${visual} ${reveal&&!r.success?'stopped':''}">${shipImage(kind,powered)}</div>${visual==='transfer'?`<div class="transfer-module">${shipImage('module',false)}</div>`:''}`;
  return `<div class="projection-frame"><div class="projection-view ${visual} ${reveal?'revealed':''}">${art}${reveal?`<div class="consequence-mark ${r.success?'positive':'negative'}">${r.success?'✓':'!'}</div>`:''}</div><div class="cine-sequence" aria-label="${reveal?'Outcome revealed':`Sequence ${c.index+1} of ${c.steps.length}`}">${c.steps.map((_,i)=>`<i class="${i<c.index||reveal?'complete':i===c.index?'current':''}" aria-hidden="true"></i>`).join('')}</div><div class="cine-caption"><span class="eyebrow">${reveal?'CONSEQUENCE':`SEQUENCE ${c.index+1} / ${c.steps.length}`}</span><h2>${label}</h2>${reveal?`<p>${esc(r.explanation)}</p>`:''}</div><footer>${button('Ⅱ Pause','pause')}${button(c.speed===1?'Speed ×1':'Speed ×4','speed')}${button(reveal?'Open report':'See outcome','skip','primary')}</footer></div>`;
}
