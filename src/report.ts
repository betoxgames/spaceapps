import { RESOURCES, RESOURCE_LABELS, OPERATIONS } from './catalog';
import { planet, resourceIcon } from './art';
import type { Resolution } from './domain';

const esc = (value:unknown) => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));

/** A consequence summary. Exact expenditure and balances belong to the stock ledger. */
export function reportMarkup(r:Resolution, destination:string, retry:boolean):string {
  const mission=r.kind==='mission';
  const title=mission?(r.success?'A safe return.':'A mission interrupted.'):r.kind==='operation'?(r.success?'Order carried out.':'Order could not be supplied.'):r.success?'The base is stable.':'The base was lost.';
  const verdict=mission?(r.success?'MISSION COMPLETE':'MISSION STOPPED'):r.kind==='operation'?(r.success?'ORDER COMPLETE':'ORDER STOPPED'):r.success?'INCIDENT RESOLVED':'RESPONSE FAILED';
  const stageIndex={launch:0,outbound:1,destination:2,return:3,base:0}[r.stage??'launch'];
  const journey=mission?`<ol class="debrief-route" aria-label="Mission stages">${['Launch','Outbound',`At ${destination}`,'Return to Moon'].map((label,index)=>{
    const state=r.success||index<stageIndex?'complete':index===stageIndex?'stopped':'upcoming';
    return `<li class="${state}"><span class="route-node" aria-hidden="true">${state==='complete'?'✓':state==='stopped'?'!':'·'}</span><span>${esc(label)}<small>${state==='complete'?'Completed':state==='stopped'?'Mission stopped':'Not reached'}</small></span></li>`;
  }).join('')}</ol>`:'';
  let findingTitle='',finding='';
  if(mission){
    const issues=RESOURCES.filter(resource=>r.requested[resource]<r.minimum[resource]||r.spent[resource]<r.requested[resource]);
    if(r.resource&&issues.includes(r.resource))issues.sort((a,b)=>a===r.resource?-1:b===r.resource?1:0);
    findingTitle=r.success?'Prepared for the whole journey':'What stopped the mission';
    finding=r.success?'<p>All five resource requirements were met, and the full request could be supplied.</p>':`<ul class="debrief-findings">${issues.map(resource=>`<li><span class="finding-resource">${resourceIcon(resource)}${RESOURCE_LABELS[resource].label}</span><span>${r.requested[resource]<r.minimum[resource]?'The request was below this route’s minimum.':'The stock could not cover the full request.'}</span></li>`).join('')}</ul>`;
  }else if(r.kind==='emergency'){
    findingTitle='Response review';
    finding=`<p>${r.probability===1?'Full support guaranteed recovery.':r.probability===0?'No support was confirmed. Recovery was not possible.':'Partial support offered a chance of recovery, not a guarantee.'}</p>`;
  }else{
    findingTitle='Base operations';
    const choice=OPERATIONS.find(operation=>operation.id===r.operation)?.choices.find(choice=>choice.id===r.choice);
    finding=`${choice?`<p class="debrief-choice">Selected plan <strong>${esc(choice.name)}</strong></p>`:''}<p>${r.success?'This authorization supports the base. It does not count toward mission success rate.':'The stock could not cover the selected plan.'}</p>`;
  }
  const next=retry?'Repeat the lesson to practice this decision again.':r.fatal?'Your shift ends here. File this report to read your evaluation.':'Open the Stock ledger at your desk before authorizing the next request.';
  return `<article class="report-paper mission-debrief ${r.success?'debrief-success':'debrief-failure'}"><header><span>SP / AFTER-ACTION REPORT</span><span>${esc(r.id.toUpperCase())}</span></header><div class="debrief-hero"><div><span class="debrief-verdict"><span aria-hidden="true">${r.success?'✓':'!'}</span>${verdict}</span><h1>${title}</h1><p>${esc(r.explanation)}</p><span class="debrief-location">${mission?`MOON → ${esc(destination.toUpperCase())} → MOON`:esc(r.title.toUpperCase())}</span></div><div class="debrief-emblem" aria-hidden="true">${mission?planet(r.destination??'moon'):'✦'}</div></div>${journey}<section class="debrief-review" aria-labelledby="finding-title"><span class="eyebrow">${r.success?'REVIEW FINDING':'DECISION REVIEW'}</span><h2 id="finding-title">${findingTitle}</h2>${finding}</section><aside class="debrief-next"><span aria-hidden="true">${r.fatal?'!':'↗'}</span><div><strong>${retry?'YOUR NEXT STEP':r.fatal?'END OF SHIFT':'BEFORE YOUR NEXT DECISION'}</strong><p>${next}</p></div></aside><footer><span>LUNAR OPERATIONS <span aria-hidden="true">/</span> RECORD COPY</span><button type="button" class="primary" data-action="archive">${retry?'Try lesson again':r.fatal?'View evaluation →':'File report →'}</button></footer></article>`;
}
