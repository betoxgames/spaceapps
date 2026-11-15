import test from 'node:test';
import assert from 'node:assert/strict';
import { BASE_BUDGET, DESTINATIONS, EVENTS, OPERATIONS, RESOURCES, units, vector } from '../src/data/catalog';
import { approve, authorizeOperation, createCampaign, finalGrade, nextInterlude, nextProposal, resolveEmergency, returnProposal, type Campaign } from '../src/game/campaign';
const clone=<T>(v:T):T=>structuredClone(v);
function ready():Campaign {let s=nextProposal(createCampaign('fixture'));s.proposal!.destinationId='earth';s.proposal!.minimum=clone(DESTINATIONS.find(d=>d.id==='earth')!.minimum);s.proposal!.requested=clone(s.proposal!.minimum);return s;}
function dueEvent():Campaign {const s=createCampaign('emergency');s.completed=['earth'];s.approvals=1;s.events=[{id:'E02',afterSuccess:1,resolved:false},{id:'E04',afterSuccess:4,resolved:false}];return s;}
test('catalog, event and operation budgets preserve the agreed values',()=>{
 assert.equal(DESTINATIONS.length,8);assert.equal(EVENTS.length,8);assert.deepEqual(BASE_BUDGET,vector(500,3000,400,0,50000));
 assert.deepEqual(DESTINATIONS.find(d=>d.id==='earth')!.minimum,vector(11500,19200,4400,1100000,1100000));
 assert.deepEqual(OPERATIONS.flatMap(o=>o.choices.map(c=>c.cost)),[vector(0,0,0,0,20000),vector(0,2000,400),vector(0,0,0,0,20000),vector(0,0,0,0,5000),vector(0,1000,0,0,10000),vector(500,0,0,0,2000)]);
 const refs=['mercury','venus','earth','mars','jupiter'], events=['E02','E04'];
 const init=Object.fromEntries(RESOURCES.map(r=>{const subtotal=refs.reduce((x,id)=>x+DESTINATIONS.find(d=>d.id===id)!.minimum[r],BASE_BUDGET[r])+events.reduce((x,id)=>{const e=EVENTS.find(a=>a.id===id)!;return x+(e.resource===r?e.cost:0)},0);return [r,subtotal+Math.ceil(subtotal/10)];}));
 assert.deepEqual(init,vector(66330,127908,29128,9196000,9559000));
});
test('seed reproducible, separate draws, fixed budget, distinct positions and proposals',()=>{
 for(let i=0;i<100;i++){let s=createCampaign(String(i));assert.deepEqual(s,createCampaign(String(i)));assert.equal(new Set(s.references).size,5);assert.equal(new Set(s.events.map(e=>e.id)).size,2);assert.equal(new Set(s.events.map(e=>e.afterSuccess)).size,2);const initial=clone(s.initial);let previous=s;for(let j=0;j<20;j++){s=nextProposal(s);assert.notEqual(s.proposal!.destinationId,previous.lastDestination);assert.notEqual(s.proposal!.engineerId,previous.lastEngineer);const p=s.proposal!;const deficient=RESOURCES.filter(r=>p.requested[r]<p.minimum[r]);assert.ok(deficient.length<=2);for(const r of RESOURCES){const ratio=p.requested[r]/p.minimum[r];assert.ok(ratio>=.1&&ratio<=1.05+.001)}previous=s;s=returnProposal(s,`return-${j}`).state;}assert.deepEqual(s.stock,initial);assert.equal(s.approvals,0);}
});
test('approval spends once, exact minima succeed, return is free',()=>{
 let s=ready();const before=clone(s), t=approve(s,'one');assert.equal(t.resolution.success,true);assert.equal(t.state.completed.length,1);assert.equal(t.state.approvals,1);for(const r of RESOURCES)assert.equal(t.state.stock[r],before.stock[r]-before.proposal!.requested[r]);assert.deepEqual(approve(t.state,'one'),{state:t.state,resolution:t.resolution});assert.deepEqual(s,before);
 s=ready();const returned=returnProposal(s,'return');assert.deepEqual(returned.state.stock,s.stock);assert.equal(returned.state.approvals,0);assert.deepEqual(returnProposal(returned.state,'return'),returned);
});
test('shortage stage boundaries, order, and stock deficit use delivered quantities',()=>{
 for(const [resource,ratio,stage] of [['propellant',.24,'launch'],['propellant',.25,'outbound'],['food',.5,'destination'],['water',.75,'return']] as const){const s=ready();s.proposal!.requested[resource]=s.proposal!.minimum[resource]*ratio;const t=approve(s,`${resource}-${ratio}`);assert.equal(t.resolution.stage,stage);assert.equal(t.resolution.fatal,false);assert.equal(t.state.completed.length,0)}
 const tie=ready();tie.proposal!.requested.food=tie.proposal!.minimum.food/10;tie.proposal!.requested.water=tie.proposal!.minimum.water/10;assert.equal(approve(tie,'tie').resolution.resource,'food');
 const deficit=ready();deficit.stock.propellant=deficit.proposal!.minimum.propellant/5;const result=approve(deficit,'deficit');assert.equal(result.resolution.stage,'launch');assert.equal(result.state.stock.propellant,0);assert.equal(result.resolution.fatal,true);assert.equal(nextInterlude(result.state).kind,'final');
 const above=ready();above.proposal!.requested.water=above.proposal!.minimum.water*1.05;above.stock.water=above.proposal!.minimum.water;const cancel=approve(above,'cancel');assert.equal(cancel.resolution.stage,'launch');assert.equal(cancel.resolution.fatal,true);
});
test('emergency integer selection, timeout zero, probability and single debit',()=>{
 const s=dueEvent();assert.throws(()=>resolveEmergency(s,'E02',50.5,'fraction'));const half=resolveEmergency(s,'E02',50,'half');assert.equal(half.resolution.spent.oxygen,units(500));assert.equal(half.resolution.probability,.5);assert.deepEqual(resolveEmergency(half.state,'E02',100,'half'),half);
 assert.equal(resolveEmergency(s,'E02',0,'timeout').resolution.success,false);assert.equal(resolveEmergency(s,'E02',100,'full').resolution.success,true);
 const small=clone(s);small.stock.oxygen=units(.333);const limited=resolveEmergency(small,'E02',100,'limited');assert.equal(limited.resolution.spent.oxygen,0);assert.equal(limited.resolution.probability,0);
});
test('operations cost shared inventory exactly once and never affect approvals',()=>{
 for(const operation of OPERATIONS)for(const choice of operation.choices){const s=createCampaign(`operation-${operation.id}-${choice.id}`);s.completed=DESTINATIONS.slice(0,operation.afterSuccess).map(d=>d.id);s.approvals=s.completed.length;s.events.forEach(e=>e.resolved=true);s.operationsResolved=OPERATIONS.filter(x=>x.afterSuccess<operation.afterSuccess).map(x=>x.id);const t=authorizeOperation(s,operation.id,choice.id,'op');assert.equal(t.state.approvals,s.approvals);assert.equal(t.state.operationChoices[operation.id],choice.id);for(const r of RESOURCES)assert.equal(t.state.stock[r],s.stock[r]-choice.cost[r]);assert.deepEqual(authorizeOperation(t.state,operation.id,choice.id,'op'),t);}
 const s=createCampaign('operation-deficit');s.completed=['earth'];s.events.forEach(e=>e.resolved=true);s.stock.energy=1;const t=authorizeOperation(s,'B01','A','deficit');assert.equal(t.resolution.fatal,true);assert.equal(t.state.stock.energy,0);assert.equal(nextInterlude(t.state).kind,'final');
});
test('final classification uses exact ratio and rejects accounting changes',()=>{assert.equal(finalGrade(5,5,false),'certificate');assert.equal(finalGrade(5,12,false),'office');assert.equal(finalGrade(5,13,false),'dismissal');assert.equal(finalGrade(2,5,false),'dismissal');assert.equal(finalGrade(5,5,true),'dismissal');const s=ready();s.stock.water=-1;assert.throws(()=>approve(s,'invalid'));});
test('complete seeded campaigns conserve each resource with both events and all three operations',()=>{
 for(let seed=0;seed<30;seed++){let s=createCampaign(`complete-${seed}`), steps=0;while(nextInterlude(s).kind!=='final'&&steps++<1500){const next=nextInterlude(s);if(next.kind==='emergency'){s=resolveEmergency(s,next.eventId,100,`event-${steps}`).state;continue;}if(next.kind==='operation'){s=authorizeOperation(s,next.operationId,'A',`op-${steps}`).state;continue;}s=nextProposal(s);const p=s.proposal!;const valid=RESOURCES.every(r=>p.requested[r]>=p.minimum[r]);s=(s.references.includes(p.destinationId)&&valid?approve(s,`approve-${steps}`):returnProposal(s,`return-${steps}`)).state;}assert.ok(steps<1500);assert.equal(s.completed.length,5);assert.equal(s.events.filter(e=>e.resolved).length,2);assert.equal(s.operationsResolved.length,3);assert.equal(s.terminal,null);for(const r of RESOURCES)assert.equal(s.stock[r]+s.history.reduce((sum,h)=>sum+h.spent[r],0),s.initial[r]);}
});
