import { esc } from './helpers';
import { resourceIcon } from './art';
import type { Resource } from '../data/catalog';
import { preloadStationImages, stationAlertLight, stationImage } from '../scenes/lunar-station';

export interface DispatchBrief {
  kind: 'emergency' | 'operation'; code: string; title: string; description: string;
  resource: Resource; system: string; practice?: boolean;
}

/** Incoming messages share the game clock. The response timer starts after delivery. */
export class Dispatch {
  private delivery?: { elapsed:number; duration:number; ready:()=>void };
  get active() { return !!this.delivery; }
  constructor(private host:HTMLElement, private stage:HTMLElement) {}
  show(brief:DispatchBrief, reduced:boolean, ready:()=>void) {
    this.cancel();
    const emergency=brief.kind==='emergency';
    const stationLight=stationAlertLight(brief.code);
    preloadStationImages();
    this.delivery={elapsed:0,duration:emergency?3200:2800,ready};
    this.stage.dataset.dispatch=brief.kind;
    this.host.dataset.kind=brief.kind;
    this.host.classList.toggle('reduced-motion',reduced);
    this.host.style.setProperty('--dispatch-progress','0');
    this.host.innerHTML=`<article class="dispatch-card">
      <header class="dispatch-channel"><span><i aria-hidden="true"></i> INCOMING TRANSMISSION</span><span>LUNAR BASE <span aria-hidden="true">/</span> ${esc(brief.code)}</span></header>
      <div class="dispatch-content"><div class="dispatch-visual dispatch-station lunar-station" data-light="${stationLight}" data-event="${esc(brief.code)}" aria-hidden="true">
        ${stationImage(stationLight)}
        <span class="dispatch-coordinates">SECTOR 04<br>LOCAL UPLINK</span>
        <div class="dispatch-system">${resourceIcon(brief.resource)}<span>${esc(brief.system)}</span><i></i><i></i><i></i></div>
      </div><div class="dispatch-copy"><span class="dispatch-type">${emergency?'SURVIVAL ALERT':'BASE OPERATIONS'}</span>
        <h1 id="dispatch-title">${emergency?'The base needs you.':'A plan for life<br>on the Moon.'}</h1>
        <h2>${esc(brief.title)}</h2><p>${esc(brief.description)}</p>
        <div class="dispatch-instruction"><span aria-hidden="true">${emergency?'◷':'A / B'}</span><span>${emergency?(brief.practice?'Practice at your own pace. No countdown.':'You have 30 seconds once the response panel opens.'):'Compare two plans. Check your stock, then authorize one.'}</span></div>
      </div></div>
      <footer class="dispatch-footer"><div class="dispatch-delivery"><span>01 <strong>Signal received</strong></span><span>02 <strong>${emergency?'Response':'Work order'} arriving</strong></span><div class="dispatch-progress" aria-hidden="true"><i></i></div></div><div class="dispatch-actions"><button type="button" data-action="pause" aria-label="Pause incoming transmission">Ⅱ</button><button type="button" data-action="open-dispatch">${emergency?'Open response':'Review plans'} <span aria-hidden="true">→</span></button></div></footer>
    </article>`;
    this.host.hidden=false;
    this.host.querySelector<HTMLElement>('[data-action="open-dispatch"]')?.focus({preventScroll:true});
  }
  /** Returns only the active time left after the introduction finishes. */
  tick(dt:number):number {
    const delivery=this.delivery;if(!delivery)return dt;
    const consumed=Math.min(dt,delivery.duration-delivery.elapsed);
    delivery.elapsed+=consumed;
    this.host.style.setProperty('--dispatch-progress',String(delivery.elapsed/delivery.duration));
    if(delivery.elapsed>=delivery.duration)this.open();
    return dt-consumed;
  }
  open() {
    const delivery=this.delivery;if(!delivery)return;
    this.cancel();delivery.ready();
  }
  cancel() {
    this.delivery=undefined;this.host.hidden=true;this.host.inert=false;
    delete this.stage.dataset.dispatch;
  }
  snapshot() {return this.delivery?{elapsed:this.delivery.elapsed,duration:this.delivery.duration}:null;}
}
