type Kind = 'paper' | 'book' | 'ledger' | 'emergency' | 'order';
export interface DeskItem {
  id: string; el: HTMLElement; x: number; y: number; width: number; height: number;
  kind: Kind; tray?: { x: number; y: number }; stored?: boolean; pinned?: boolean;
}
interface Gesture { item: DeskItem; pointer: number; start: {x:number;y:number}; before: {x:number;y:number;stored?:boolean}; offset: {x:number;y:number}; moved: boolean }
export interface DeskOptions {
  announce: (message:string) => void;
  onPaper: () => void;
  onStamp: (stamp: 'approve'|'return', target: string) => void;
  canStamp: (stamp:'approve'|'return', target:string) => boolean;
  onSelect: (id:string) => void;
  presentation?: { tray:{x:number;y:number;width:number;height:number}; previewScale:number; previewHeight:number; reading:{x:number;y:number}; objectScale?:number };
}
/** Spatial presentation only: never reads stock or decides mission correctness. */
export class Desk {
  items = new Map<string, DeskItem>();
  selected = 'flight';
  clickPlacement = false;
  enabled = true;
  stamp: 'approve'|'return'|null = null;
  private top = 10;
  private gesture?: Gesture;
  private placing?: { item: DeskItem; before: {x:number;y:number;stored?:boolean} };
  private sealGesture?: { pointer:number; start:{x:number;y:number}; moved:boolean; stamp:'approve'|'return' };
  private ghost: HTMLElement;
  private suppressClick = false;
  private suppressTimer?: ReturnType<typeof setTimeout>;
  constructor(private stage:HTMLElement, private options:DeskOptions) {
    this.ghost = document.createElement('div'); this.ghost.className = 'stamp-ghost'; this.ghost.hidden = true; this.ghost.setAttribute('aria-hidden','true'); stage.append(this.ghost);this.syncStampTools();
    stage.addEventListener('pointerdown', e => this.down(e));
    stage.addEventListener('pointermove', e => this.move(e));
    stage.addEventListener('pointerup', e => this.up(e));
    stage.addEventListener('pointercancel', e => this.cancelPointer(e.pointerId));
    stage.addEventListener('lostpointercapture', e => this.cancelPointer(e.pointerId));
    stage.addEventListener('click', e => this.click(e), true);
    stage.addEventListener('keydown', e => this.key(e));
    stage.addEventListener('focusin', e => {
      const id = (e.target as HTMLElement).closest<HTMLElement>('[data-desk-id]')?.dataset.deskId;
      if (id && this.items.has(id)) {
        this.raise(id);
        if (this.stamp) this.highlightTarget(id);
      }
    });
  }
  register(item: DeskItem) {
    this.items.set(item.id, item); item.el.dataset.deskId = item.id;
    item.el.classList.add('desk-object'); item.el.tabIndex = 0;
    item.el.setAttribute('aria-keyshortcuts','Enter Space ArrowUp ArrowDown ArrowLeft ArrowRight Escape');
    item.el.setAttribute('aria-roledescription', item.kind === 'paper' ? 'movable document' : 'desk object');
    this.render(item); this.raise(item.id);
  }
  remove(id: string) { const item = this.items.get(id); if (item) { if (this.gesture?.item === item || this.placing?.item === item) this.cancel(); item.el.remove(); this.items.delete(id); } }
  clear() { this.cancel(); for (const item of this.items.values()) item.el.remove(); this.items.clear(); }
  point(clientX: number, clientY: number) { const r = this.stage.getBoundingClientRect(); return { x:(clientX-r.left)*1600/r.width, y:(clientY-r.top)*900/r.height }; }
  private itemScale(item:DeskItem) { return item.stored ? this.options.presentation?.previewScale??.24 : this.options.presentation?.objectScale??1; }
  private clamp(item: DeskItem) {
    const scale = this.itemScale(item);
    const height=item.stored ? this.options.presentation?.previewHeight??item.height : item.height;
    item.x = Math.max(0, Math.min(1600-item.width*scale,item.x));
    item.y = Math.max(0, Math.min(815-height*scale,item.y));
  }
  render(item: DeskItem) {
    item.el.style.width = `${item.width}px`; item.el.style.height = `${item.stored?this.options.presentation?.previewHeight??item.height:item.height}px`;
    item.el.style.transform = `translate3d(${item.x}px,${item.y}px,0) scale(${this.itemScale(item)})`;
    item.el.classList.toggle('stored',!!item.stored); item.el.classList.toggle('pinned',!!item.pinned);
    item.el.dataset.stored = String(!!item.stored);
    item.el.setAttribute('aria-description', item.pinned
      ? 'Pinned to the desk. Unpin to move.'
      : `${item.stored ? 'In the document tray. ' : ''}Press Enter or Space to pick up, arrow keys to move, Shift and arrows for larger steps, and Enter to place. Escape cancels.${item.kind==='paper'?' Drag back to the matching numbered tray slot, or click that slot to return this sheet.':''}${item.kind==='paper'||item.kind==='order'?' With a stamp selected, Enter stamps this document.':''}`);
  }
  raise(id: string) {
    const item = this.items.get(id); if (!item) return;
    item.el.style.zIndex = String(++this.top);
    if (item.kind === 'paper') { this.selected = id; this.options.onSelect(id); }
  }
  focus(id: string) {
    const item=this.items.get(id); if (!item) return;
    item.el.hidden=false;
    if(item.stored){this.moveTo(id,this.options.presentation?.reading.x??810,this.options.presentation?.reading.y??360);this.options.onPaper();this.options.announce(`${this.label(item)} taken from the tray.`);}
    this.raise(id); item.el.focus({preventScroll:true});
    if(document.body.classList.contains('compact-ui'))item.el.scrollIntoView({block:'nearest',inline:'nearest',behavior:'instant'});
  }
  setPinned(id:string, value:boolean) { const item=this.items.get(id); if(item) {item.pinned=value;this.render(item);} }
  moveTo(id:string,x:number,y:number) {const item=this.items.get(id); if(!item)return;item.stored=false;item.x=x;item.y=y;this.clamp(item);this.render(item);this.raise(id);}
  store(id: string) {const item=this.items.get(id);if(!item?.tray)return;item.stored=true;item.x=item.tray.x;item.y=item.tray.y;this.render(item);}
  storeAll() {this.cancel();let count=0;for(const item of this.items.values())if(item.kind==='paper'&&item.tray){this.store(item.id);count++;}if(count)this.options.onPaper();this.options.announce(count ? `${count} ${count===1?'sheet is':'sheets are'} back in the tray.` : 'There are no mission sheets to store.');}
  beside(id:string) {
    const item=this.items.get(id),book=this.items.get('manual'); if(!item)return;
    const width=item.width*(this.options.presentation?.objectScale??1);
    const bookWidth=book?book.width*this.itemScale(book):0;
    const x=book && !book.el.hidden ? (book.x+bookWidth+30+width<=1600?book.x+bookWidth+30:Math.max(0,book.x-width-30)):this.options.presentation?.reading.x??810;
    const y=book?.y??this.options.presentation?.reading.y??360;
    this.moveTo(id,x,this.options.presentation?Math.max(y,this.options.presentation.reading.y):y);this.options.announce('Selected sheet placed beside the manual.');
  }
  selectStamp(stamp:'approve'|'return') {
    this.cancel(); this.stamp=stamp;
    this.stage.dataset.stamp=stamp;this.syncStampTools();this.markStampReady();
    this.highlightTarget((document.activeElement as HTMLElement|null)?.closest<HTMLElement>('[data-desk-id]')?.dataset.deskId??null);
    this.options.announce(`${stamp==='approve'?'Approve':'Return'} stamp selected. Choose a sheet, or cancel.`);
  }
  private stampTarget(clientX:number,clientY:number):string|null {
    // The ghost is pointer-events:none. Only the topmost visible DOM object can accept ink.
    const hit=document.elementFromPoint(clientX,clientY) as HTMLElement|null;
    if(!hit || hit.closest('button,a,input,select,[data-no-stamp]'))return null;
    const element=hit.closest<HTMLElement>('[data-desk-id]'); const id=element?.dataset.deskId;
    if(!id)return null; const item=this.items.get(id);
    return item && !item.el.hidden && (item.kind==='paper'||item.kind==='order') ? id : null;
  }
  private commit(target:string) {
    const stamp=this.stamp;
    if(!stamp || !this.enabled || !this.options.canStamp(stamp,target)) { this.options.announce('Choose a mission sheet, or select an option on the internal order.');this.cancel();return; }
    this.cancel(); this.options.onStamp(stamp,target);
  }
  private blockClick() { this.suppressClick=true;clearTimeout(this.suppressTimer);this.suppressTimer=setTimeout(()=>this.suppressClick=false,700); }
  private down(e:PointerEvent) {
    // Touch browsers can synthesize click after a delay. A new press is a new action.
    if(e.isPrimary&&e.button===0){this.suppressClick=false;clearTimeout(this.suppressTimer);}
    if(!this.enabled||e.button!==0||!e.isPrimary||this.gesture||this.sealGesture)return;
    const target=e.target as HTMLElement;
    const seal=target.closest<HTMLElement>('[data-stamp-tool]');
    if(seal && !(seal as HTMLButtonElement).disabled) {
      const stamp=seal.dataset.stampTool as 'approve'|'return';this.cancel();this.stamp=stamp;this.stage.dataset.stamp=stamp;this.syncStampTools();this.markStampReady();
      this.sealGesture={pointer:e.pointerId,start:this.point(e.clientX,e.clientY),moved:false,stamp};
      this.stage.setPointerCapture(e.pointerId);e.preventDefault();return;
    }
    if(this.stamp||this.placing)return;
    if(target.closest('button,a,input,select,textarea,[data-no-drag]'))return;
    if(target.closest('.protocol-sheet')&&!target.closest('.protocol-heading'))return;
    const element=target.closest<HTMLElement>('[data-desk-id]');const item=element&&this.items.get(element.dataset.deskId!);
    if(!item||item.el.hidden)return;
    this.raise(item.id);item.el.focus({preventScroll:true});
    if(item.pinned)return;
    const p=this.point(e.clientX,e.clientY);
    const before={x:item.x,y:item.y,stored:item.stored};
    // Keep the same desk-space point under the pointer when a tray sheet expands.
    const offset={x:p.x-item.x,y:p.y-item.y};
    if(item.stored){item.stored=false;this.render(item);}
    this.gesture={item,pointer:e.pointerId,start:p,before,offset,moved:false};
    this.showReturnTarget(item);
    this.stage.setPointerCapture(e.pointerId);item.el.classList.add('held');e.preventDefault();this.options.onPaper();
  }
  private move(e:PointerEvent) {
    if(!this.enabled)return;
    const p=this.point(e.clientX,e.clientY);
    if(this.sealGesture?.pointer===e.pointerId){
      const g=this.sealGesture;g.moved ||= Math.hypot(p.x-g.start.x,p.y-g.start.y)>5;
      if(g.moved){this.ghost.hidden=false;this.ghost.className=`stamp-ghost ${g.stamp}`;this.ghost.innerHTML=`<span>${g.stamp==='approve'?'APPROVE':'RETURN'}</span>`;this.ghost.style.transform=`translate(${p.x-75}px,${p.y-90}px)`;
        this.clearTargets();const id=this.stampTarget(e.clientX,e.clientY);if(id&&this.options.canStamp(g.stamp,id))this.items.get(id)?.el.classList.add('stamp-target');
      }return;
    }
    if(this.stamp&&!this.sealGesture){this.highlightTarget(this.stampTarget(e.clientX,e.clientY));}
    if(this.placing)this.showReturnTarget(this.placing.item,p,false);
    const g=this.gesture;if(!g||g.pointer!==e.pointerId)return;
    g.moved ||= Math.hypot(p.x-g.start.x,p.y-g.start.y)>4;
    g.item.x=p.x-g.offset.x;g.item.y=p.y-g.offset.y;this.clamp(g.item);this.render(g.item);
    this.showReturnTarget(g.item,p);
  }
  private returnSlot(item:DeskItem) {return Array.from(this.stage.querySelectorAll<HTMLElement>('.tray-slot')).find(slot=>slot.dataset.action===`restore-${item.id}`);}
  private inTray(p:{x:number;y:number},item?:DeskItem) {
    const tray=this.options.presentation?.tray??{x:1120,y:220,width:450,height:128};
    if(p.x>=tray.x&&p.x<=tray.x+tray.width&&p.y>=tray.y&&p.y<=tray.y+tray.height)return true;
    // A sheet covering its own slot can be dropped even when held by a lower corner.
    const slot=item&&this.returnSlot(item);if(!slot)return false;
    const r=slot.getBoundingClientRect(),start=this.point(r.left,r.top),end=this.point(r.right,r.bottom),scale=this.itemScale(item);
    const overlapX=Math.max(0,Math.min(item.x+item.width*scale,end.x)-Math.max(item.x,start.x));
    const overlapY=Math.max(0,Math.min(item.y+item.height*scale,end.y)-Math.max(item.y,start.y));
    const slotArea=(end.x-start.x)*(end.y-start.y);
    return slotArea>0&&overlapX*overlapY>=slotArea*.3;
  }
  private showReturnTarget(item:DeskItem,p?:{x:number;y:number},includeSheet=true) {
    if(item.kind!=='paper'||!item.tray){this.clearReturnTarget();return;}
    if(this.stage.dataset.returningPaper!==item.id){
      this.clearReturnTarget();this.stage.dataset.returningPaper=item.id;
      this.stage.dataset.returningMode=this.gesture?'drag':'place';
    }
    const slot=this.returnSlot(item);slot?.classList.add('return-target');
    const ready=!!p&&this.inTray(p,includeSheet?item:undefined);
    slot?.classList.toggle('drop-ready',ready);
    const hint=slot?.querySelector('small'),message=ready?(this.gesture?'↓ Release to return':'↵ Place to return'):'↓ Drag this sheet here';
    if(hint&&hint.textContent!==message)hint.textContent=message;
    this.stage.querySelector('.document-tray')?.classList.toggle('drop-ready',ready);
  }
  private clearReturnTarget() {
    delete this.stage.dataset.returningPaper;
    delete this.stage.dataset.returningMode;
    this.stage.querySelectorAll('.return-target,.drop-ready').forEach(el=>el.classList.remove('return-target','drop-ready'));
    this.stage.querySelectorAll('.tray-slot small').forEach(el=>el.textContent='↓ Drag back or click');
  }
  private up(e:PointerEvent) {
    if(this.sealGesture?.pointer===e.pointerId){
      const g=this.sealGesture;this.sealGesture=undefined;this.release(e.pointerId);
      this.blockClick();
      const p=this.point(e.clientX,e.clientY);
      g.moved ||= Math.hypot(p.x-g.start.x,p.y-g.start.y)>5;
      if(g.moved){const id=this.stampTarget(e.clientX,e.clientY);if(id)this.commit(id);else{this.cancel();this.options.announce('Stamp returned. No decision made.');}}
      else{this.ghost.hidden=true;this.options.announce(`${g.stamp==='approve'?'Approve':'Return'} selected. Click a sheet to stamp it.`);}
      return;
    }
    const g=this.gesture;if(!g||g.pointer!==e.pointerId)return;
    this.gesture=undefined;this.release(e.pointerId);g.item.el.classList.remove('held');this.blockClick();
    this.clearReturnTarget();
    const p=this.point(e.clientX,e.clientY);
    g.moved ||= Math.hypot(p.x-g.start.x,p.y-g.start.y)>4;
    if(!g.moved&&this.clickPlacement){this.placing={item:g.item,before:g.before};g.item.el.classList.add('placing');this.showReturnTarget(g.item);this.options.announce('Choose a spot on the desk, or use arrow keys and Enter. Escape cancels.');return;}
    if(!g.moved&&g.before.stored&&this.options.presentation){
      const {reading}=this.options.presentation;
      this.moveTo(g.item.id,reading.x,reading.y);this.focus(g.item.id);
      this.options.onPaper();this.options.announce(`${this.label(g.item)} placed in the reading area.`);return;
    }
    if(g.moved&&g.item.kind==='paper'&&this.inTray(p,g.item)){this.store(g.item.id);this.options.announce(`${this.label(g.item)} returned to its numbered slot.`);}
    else{if(g.moved){g.item.x=p.x-g.offset.x;g.item.y=p.y-g.offset.y;}this.clamp(g.item);this.render(g.item);}
    this.options.onPaper();
  }
  private click(e:MouseEvent) {
    if(this.suppressClick&&e.detail!==0){e.preventDefault();e.stopImmediatePropagation();this.suppressClick=false;return;}
    if(!this.enabled)return;
    const target=e.target as HTMLElement;
    if(this.stamp && !target.closest('[data-stamp-tool],[data-cancel-stamp]')){
      if(target.closest('[data-stamp-target]'))return;
      const id=this.stampTarget(e.clientX,e.clientY);e.preventDefault();e.stopImmediatePropagation();
      if(id)this.commit(id);else{this.cancel();this.options.announce('Stamp returned. No decision made.');}return;
    }
    if(this.placing && !target.closest('button,input,a,[data-no-drag]')){
      e.preventDefault();e.stopImmediatePropagation();const {item}=this.placing;const p=this.point(e.clientX,e.clientY);
      this.placing=undefined;item.el.classList.remove('placing');
      this.clearReturnTarget();
      if(item.kind==='paper'&&this.inTray(p))this.store(item.id);else{item.stored=false;item.x=p.x-item.width*this.itemScale(item)/2;item.y=p.y-35;this.clamp(item);this.render(item);}
      this.options.onPaper();this.options.announce('Object placed.');
    }
  }
  private key(e:KeyboardEvent) {
    if(e.key==='Escape'&&(this.stamp||this.placing||this.gesture||this.sealGesture)){
      e.preventDefault();e.stopPropagation();this.cancel();this.options.announce('Action cancelled. Your documents and resources are unchanged.');return;
    }
    if(e.ctrlKey||e.metaKey||e.altKey)return;
    if(!this.enabled||e.repeat&&['Enter',' '].includes(e.key)) {if(e.repeat&&['Enter',' '].includes(e.key))e.preventDefault();return;}
    const target=e.target as HTMLElement;
    if(target.matches('button,input,a,select,textarea'))return;
    if(target.closest('[data-no-drag]'))return;
    const id=target.closest<HTMLElement>('[data-desk-id]')?.dataset.deskId;
    const item=id&&this.items.get(id);if(!item)return;
    if(['Enter',' '].includes(e.key)){
      e.preventDefault();
      if(this.stamp){this.commit(item.id);return;}
      if(item.pinned){this.options.announce('Manual is pinned. Unpin it to move.');return;}
      if(this.placing?.item===item){this.placing=undefined;item.el.classList.remove('placing');this.clearReturnTarget();if(item.kind==='paper'&&this.inTray({x:item.x,y:item.y},item)){this.store(item.id);this.options.announce(`${this.label(item)} returned to its numbered slot.`);}else this.options.announce('Object placed.');this.options.onPaper();return;}
      this.cancel();const before={x:item.x,y:item.y,stored:item.stored};
      if(item.stored)this.moveTo(item.id,this.options.presentation?.reading.x??810,this.options.presentation?.reading.y??360);this.placing={item,before};item.el.classList.add('placing');this.showReturnTarget(item);this.options.onPaper();this.options.announce(`${this.label(item)} picked up. Move with arrows; Shift and arrows moves farther. Enter places it, Escape cancels.`);
    } else if(e.key.startsWith('Arrow')&&this.placing?.item===item){
      e.preventDefault();const n=e.shiftKey?40:10;
      item.x += e.key==='ArrowRight'?n:e.key==='ArrowLeft'?-n:0;item.y += e.key==='ArrowDown'?n:e.key==='ArrowUp'?-n:0;
      this.clamp(item);this.render(item);
      this.showReturnTarget(item,{x:item.x,y:item.y});
      const direction=e.key.slice(5).toLowerCase();this.options.announce(`${this.label(item)} moved ${direction}. Enter places it.`);
    }
  }
  applySelectedStamp(target:string) {this.commit(target);}
  private release(id:number) {if(this.stage.hasPointerCapture(id))this.stage.releasePointerCapture(id);}
  private cancelPointer(id:number) {if(this.gesture?.pointer===id||this.sealGesture?.pointer===id)this.cancel();}
  private label(item:DeskItem){return item.el.getAttribute('aria-label') || item.id;}
  private syncStampTools(){
    this.stage.querySelectorAll<HTMLElement>('[data-stamp-tool]').forEach(tool=>tool.setAttribute('aria-pressed',String(tool.dataset.stampTool===this.stamp)));
  }
  private markStampReady(){
    for(const item of this.items.values())item.el.classList.toggle('stamp-ready',!!this.stamp&&!item.el.hidden&&this.options.canStamp(this.stamp,item.id));
  }
  private highlightTarget(id:string|null){
    this.clearTargets();if(id&&this.stamp&&this.options.canStamp(this.stamp,id))this.items.get(id)?.el.classList.add('stamp-target');
  }
  private clearTargets(){for(const item of this.items.values())item.el.classList.remove('stamp-target');}
  cancel() {
    this.clearReturnTarget();
    const gesture=this.gesture;this.gesture=undefined;
    if(gesture){Object.assign(gesture.item,gesture.before);gesture.item.el.classList.remove('held');this.render(gesture.item);this.release(gesture.pointer);}
    const seal=this.sealGesture;this.sealGesture=undefined;if(seal)this.release(seal.pointer);
    if(this.placing){const {item,before}=this.placing;Object.assign(item,before);item.el.classList.remove('placing');this.render(item);this.placing=undefined;}
    this.stamp=null;delete this.stage.dataset.stamp;this.ghost.hidden=true;this.clearTargets();this.syncStampTools();for(const item of this.items.values())item.el.classList.remove('stamp-ready');
  }
}
