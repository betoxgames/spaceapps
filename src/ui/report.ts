import { esc } from './helpers';
import { RESOURCES, RESOURCE_LABELS, OPERATIONS } from '../data/catalog';
import { planet, resourceIcon } from './art';
import type { Resolution } from '../game/campaign';
import { stationImage, stationSequenceLight } from '../scenes/lunar-station';


/** A consequence summary. Exact expenditure and balances belong to the stock ledger. */
export function reportMarkup(r:Resolution, destination:string, retry:boolean):string {
  const mission=r.kind==='mission';
  const title=mission?(r.success?'A safe return.':'A mission interrupted.'):r.kind==='operation'?(r.success?'Order carried out.':'Order could not be supplied.'):r.success?'The base is stable.':'The base was lost.';
  const verdict=mission?(r.success?'MISSION COMPLETE':'MISSION STOPPED'):r.kind==='operation'?(r.success?'ORDER COMPLETE':'ORDER STOPPED'):r.success?'INCIDENT RESOLVED':'RESPONSE FAILED';
  const stageIndex={launch:0,outbound:1,destination:2,return:3,base:0}[r.stage??'launch'];
  const journey=mission?`<section class="debrief-journey" aria-labelledby="journey-title"><div class="debrief-section-heading"><h2 id="journey-title">Your journey</h2><span>MOON → ${esc(destination.toUpperCase())} → MOON</span></div><ol class="debrief-route" aria-label="Mission stages">${['Launch','Outbound',`At ${destination}`,'Return to Moon'].map((label,index)=>{
    const state=r.success||index<stageIndex?'complete':index===stageIndex?'stopped':'upcoming';
    return `<li class="${state}"><span class="route-node" aria-hidden="true">${state==='complete'?'✓':state==='stopped'?'!':'·'}</span><span>${esc(label)}<small>${state==='complete'?'Completed':state==='stopped'?'Mission stopped':'Not reached'}</small></span></li>`;
  }).join('')}</ol></section>`:'';
  let findingTitle='',finding='';
  if(mission){
    const issues=RESOURCES.filter(resource=>r.requested[resource]<r.minimum[resource]||r.spent[resource]<r.requested[resource]);
    if(r.resource&&issues.includes(r.resource))issues.sort((a,b)=>a===r.resource?-1:b===r.resource?1:0);
    findingTitle=r.success?'Ready for the whole journey':'What stopped the mission';
    finding=r.success?'<p>All five resource requirements were met, and the full request could be supplied.</p>':`<ul class="debrief-findings">${issues.map(resource=>`<li><span class="finding-resource">${resourceIcon(resource)}${RESOURCE_LABELS[resource].label}</span><span>${r.requested[resource]<r.minimum[resource]?'The request was below this route’s minimum.':'The stock could not cover the full request.'}</span></li>`).join('')}</ul>`;
  }else if(r.kind==='emergency'){
    findingTitle='Response review';
    finding=`<p>${r.probability===1?'Full support guaranteed recovery.':r.probability===0?'No support was confirmed. Recovery was not possible.':'Partial support offered a chance of recovery, not a guarantee.'}</p>`;
  }else{
    findingTitle='Base operations';
    const choice=OPERATIONS.find(operation=>operation.id===r.operation)?.choices.find(choice=>choice.id===r.choice);
    finding=`${choice?`<div class="debrief-choice"><span>YOUR SELECTED PLAN</span><strong>${esc(choice.name)}</strong></div>`:''}<p>${r.success?'This plan supports life at the base. Base orders do not count toward mission success rate.':'The stock could not cover the selected plan.'}</p>`;
  }
  const next=retry?'Repeat the lesson to practice this decision again.':r.fatal?'Your shift ends here. File this report to read your evaluation.':'Open Inventory in the manual before authorizing the next request.';
  const summary=mission?(r.success?`The crew returned safely from the ${destination} expedition.`:r.explanation):r.explanation;
  const kind=mission?'MISSION REPORT':r.kind==='operation'?'BASE OPERATIONS':'SURVIVAL RESPONSE';
  const baseCode=r.kind==='operation'?r.operation:r.event;
  const stationLight=stationSequenceLight(baseCode,0,true,r.success);
  const illustration=mission?planet(r.destination??'moon'):`<div class="lunar-station" data-light="${stationLight}" data-event="${esc(baseCode ?? '')}">${stationImage(stationLight)}</div>`;
  return `<article class="report-paper mission-debrief ${r.success?'debrief-success':'debrief-failure'}" data-report-kind="${r.kind}">
    <header class="debrief-header"><div><span class="debrief-bureau" aria-hidden="true">✦</span><span>${kind}<small>LUNAR OPERATIONS / TURN RECORD</small></span></div><span class="debrief-record-id">${esc(r.id.toUpperCase())}</span></header>
    <div class="debrief-body" tabindex="0" aria-label="Report details">
      <div class="debrief-hero"><div><span class="debrief-verdict"><span aria-hidden="true">${r.success?'✓':'!'}</span>${verdict}</span><h1>${title}</h1><p>${esc(summary)}</p><span class="debrief-location">${mission?`EXPEDITION / ${esc(destination.toUpperCase())}`:esc(r.title.toUpperCase())}</span></div><div class="debrief-emblem" aria-hidden="true"><span class="debrief-orbit"></span>${illustration}<span class="debrief-art-label">${mission?'CREW OF 04 / LUNAR RETURN':'LUNAR BASE / FIELD REPORT'}</span></div></div>
      ${journey}<section class="debrief-review" aria-labelledby="finding-title"><span class="debrief-review-icon" aria-hidden="true">${r.success?'✓':'!'}</span><div><span class="eyebrow">${r.success?'WHAT WENT WELL':'WHAT NEEDS ATTENTION'}</span><h2 id="finding-title">${findingTitle}</h2>${finding}</div></section>
      <aside class="debrief-next"><span aria-hidden="true">${r.fatal?'!':'↗'}</span><div><strong>${retry?'Let’s try that again':r.fatal?'Your shift has ended':'Before your next approval'}</strong><p>${next}</p></div></aside>
    </div>
    <footer><div class="debrief-saved"><span aria-hidden="true">▤</span><div><strong>Added to your turn log</strong><small>Open Stock & log in the manual, or press <kbd>R</kbd>.</small></div></div><button type="button" class="primary" data-action="archive">${retry?'Try lesson again':r.fatal?'View evaluation →':'Continue shift →'}</button></footer>
  </article>`;
}

/** Reports and the desk log use the same outcome language and colors. */
export function historyMarkup(entries:Resolution[],page:number,nameOf:(id?:string)=>string):string {
  return entries.slice(page*4,page*4+4).map(r=>{
    const returned=r.kind==='return',tone=returned?'returned':r.success?'success':'failure';
    const kind=returned?'Proposal':r.kind==='mission'?'Expedition':r.kind==='operation'?'Base plan':'Survival response';
    const status=returned?'Returned':r.success?(r.kind==='mission'?'Safe return':r.kind==='operation'?'Completed':'Resolved'):'Stopped';
    const detail=returned?'Sent back for revision. No resources spent.':r.kind==='mission'?(r.success?'The crew is back on the Moon.':r.explanation):r.explanation;
    return `<div class="log-entry record-entry record-${tone}"><span class="record-icon" aria-hidden="true">${returned?'↩':r.success?'✓':'!'}</span><div class="record-content"><div class="record-meta"><span>${kind}</span><span class="record-status">${status}</span></div><strong>${esc(nameOf(r.destination)||r.title)}</strong><p>${esc(detail)}</p></div></div>`;
  }).join('')||'<div class="empty-log"><span aria-hidden="true">▤</span><strong>A fresh page.</strong><p>Your decisions will appear here as your shift unfolds.</p></div>';
}
