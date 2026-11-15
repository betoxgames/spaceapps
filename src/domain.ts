import { BASE_BUDGET, DESTINATIONS, ENGINEERS, EVENTS, OPERATIONS, RESOURCES, vector, type Resource, type Resources } from './catalog';

export interface Proposal { id:string; destinationId:string; engineerId:string; minimum:Resources; requested:Resources }
export type Stage = 'launch'|'outbound'|'destination'|'return'|'base';
export interface Resolution { id:string; kind:'mission'|'return'|'emergency'|'operation'; success:boolean; fatal:boolean; stage?:Stage; resource?:Resource; minimum:Resources; requested:Resources; spent:Resources; beforeBalance:Resources; balance:Resources; title:string; explanation:string; destination?:string; event?:string; operation?:string; choice?:string; effect?:string; probability?:number }
export interface CampaignEvent {id:string; afterSuccess:number; resolved:boolean}
export interface Campaign {seed:string; rng:{schedule:number;proposals:number;emergencies:number}; initial:Resources; stock:Resources; references:string[]; completed:string[]; approvals:number; returns:number; proposal:Proposal|null; events:CampaignEvent[]; operationsResolved:string[]; operationChoices:Record<string,string>; history:Resolution[]; terminal:string|null; serial:number; lastDestination:string|null; lastEngineer:string|null; commands:Record<string,Resolution>}
export type Interlude = {kind:'mission'} | {kind:'emergency';eventId:string} | {kind:'operation';operationId:string} | {kind:'final';grade:Grade};
export type Grade = 'certificate'|'office'|'dismissal';
const copy = <T>(x:T):T => structuredClone(x);
const map = (f:(r:Resource)=>number):Resources => Object.fromEntries(RESOURCES.map(r=>[r,f(r)])) as Resources;
const empty = ():Resources => vector();
function hash(s:string):number { let h=2166136261; for (const c of s) { h ^= c.codePointAt(0)!; h=Math.imul(h,16777619); } return h>>>0; }
function random(s:Campaign, stream:keyof Campaign['rng']):number { let x=s.rng[stream]; x=(Math.imul(x,1664525)+1013904223)>>>0; s.rng[stream]=x; return x/4294967296; }
function pick<T>(s:Campaign,stream:keyof Campaign['rng'],a:T[]):T { return a[Math.floor(random(s,stream)*a.length)]; }
function shuffled<T>(s:Campaign,stream:keyof Campaign['rng'],a:readonly T[]):T[] { const b=[...a]; for(let i=b.length-1;i>0;i--){const j=Math.floor(random(s,stream)*(i+1)); [b[i],b[j]]=[b[j],b[i]];} return b; }
const assertVector=(v:Resources)=>{for(const r of RESOURCES)if(!Number.isSafeInteger(v[r])||v[r]<0)throw new TypeError('Invalid resource amount');};
function requireCommand(id:string){if(typeof id!=='string'||!id.trim())throw new TypeError('A command ID is required');}
function prior(s:Campaign,id:string):{state:Campaign;resolution:Resolution}|null { requireCommand(id); const x=Object.hasOwn(s.commands,id)?s.commands[id]:undefined; return x?{state:s,resolution:x}:null; }
function record(s:Campaign,id:string,resolution:Resolution){s.commands[id]=resolution;s.history.push(resolution);return {state:s,resolution};}
function spend(s:Campaign,requested:Resources){assertVector(requested);assertVector(s.stock);const beforeBalance=copy(s.stock);const spent=map(r=>Math.min(s.stock[r],requested[r]));s.stock=map(r=>s.stock[r]-spent[r]);return {spent,beforeBalance,balance:copy(s.stock),deficit:RESOURCES.some(r=>spent[r]<requested[r])};}
export function createCampaign(seed:string):Campaign {
 if(typeof seed!=='string'||!seed)throw new TypeError('Seed is required');
 const s:Campaign={seed,rng:{schedule:hash(seed+':schedule'),proposals:hash(seed+':proposals'),emergencies:hash(seed+':emergencies')},initial:empty(),stock:empty(),references:[],completed:[],approvals:0,returns:0,proposal:null,events:[],operationsResolved:[],operationChoices:{},history:[],terminal:null,serial:0,lastDestination:null,lastEngineer:null,commands:{}};
 s.references=shuffled(s,'schedule',DESTINATIONS.map(d=>d.id)).slice(0,5);
 const chosen=shuffled(s,'schedule',EVENTS).slice(0,2), positions=shuffled(s,'schedule',[1,2,3,4]).slice(0,2).sort((a,b)=>a-b);
 s.events=chosen.map((e,i)=>({id:e.id,afterSuccess:positions[i],resolved:false}));
 s.initial=map(r=>{const subtotal=s.references.reduce((sum,id)=>sum+DESTINATIONS.find(d=>d.id===id)!.minimum[r],0)+chosen.reduce((sum,e)=>sum+(e.resource===r?e.cost:0),0)+BASE_BUDGET[r];return subtotal+Math.ceil(subtotal/10);});
 s.stock=copy(s.initial); return s;
}
export function finalGrade(successes:number,approvals:number,forced:boolean):Grade {if(forced)return 'dismissal'; if(successes===approvals&&approvals>0)return 'certificate';return successes*5>approvals*2?'office':'dismissal';}
export function nextInterlude(s:Campaign):Interlude {
 if(s.terminal)return {kind:'final',grade:finalGrade(s.completed.length,s.approvals,true)};
 const e=s.events.find(x=>!x.resolved&&x.afterSuccess<=s.completed.length);if(e)return {kind:'emergency',eventId:e.id};
 const op=OPERATIONS.find(x=>!s.operationsResolved.includes(x.id)&&x.afterSuccess<=s.completed.length);if(op)return {kind:'operation',operationId:op.id};
 if(s.completed.length>=5 && s.events.every(x=>x.resolved))return {kind:'final',grade:finalGrade(s.completed.length,s.approvals,false)};
 return {kind:'mission'};
}
export function nextProposal(state:Campaign):Campaign {
 if(state.proposal||nextInterlude(state).kind!=='mission')return state;
 const s=copy(state), destination=pick(s,'proposals',DESTINATIONS.filter(d=>!s.completed.includes(d.id)&&d.id!==s.lastDestination)), engineer=pick(s,'proposals',ENGINEERS.filter(e=>e.id!==s.lastEngineer));
 const sufficient=random(s,'proposals')<0.5, deficient=sufficient?[]:shuffled(s,'proposals',RESOURCES).slice(0,random(s,'proposals')<0.5?1:2);
 const requested=map(r=>{const p=deficient.includes(r)?10+Math.floor(random(s,'proposals')*86):100+Math.floor(random(s,'proposals')*6);return Math.ceil(destination.minimum[r]/1000*p/100)*1000;});
 s.serial++;s.proposal={id:`proposal-${s.serial}`,destinationId:destination.id,engineerId:engineer.id,minimum:copy(destination.minimum),requested};s.lastDestination=destination.id;s.lastEngineer=engineer.id;return s;
}
function failure(minimum:Resources,delivered:Resources):{stage:Stage;resource:Resource}|null {
 let best:{stage:Stage;resource:Resource;rank:number}|null=null;
 for(const r of RESOURCES){if(delivered[r]>=minimum[r])continue;const ratio=delivered[r]/minimum[r];const rank=r==='propellant'&&ratio<.25?0:ratio<.5?1:ratio<.75?2:3;if(!best||rank<best.rank)best={rank,resource:r,stage:(['launch','outbound','destination','return'] as Stage[])[rank]};}
 return best;
}
export function approve(state:Campaign,commandId:string):{state:Campaign;resolution:Resolution}{
 const existing=prior(state,commandId);if(existing)return existing;if(!state.proposal||nextInterlude(state).kind!=='mission')throw new Error('No mission ready');
 const s=copy(state),p=s.proposal!, tx=spend(s,p.requested);s.approvals++;const shortages=RESOURCES.some(r=>p.requested[r]<p.minimum[r]);const success=!shortages&&!tx.deficit;if(success)s.completed.push(p.destinationId);if(tx.deficit)s.terminal='stock';
 const fail=success?null:failure(p.minimum,tx.spent);const fallback=tx.deficit?RESOURCES.find(r=>tx.spent[r]<p.requested[r]):undefined;
 const resolution:Resolution={id:commandId,kind:'mission',success,fatal:tx.deficit,stage:fail?.stage??(tx.deficit?'launch':undefined),resource:fail?.resource??fallback,minimum:copy(p.minimum),requested:copy(p.requested),spent:tx.spent,beforeBalance:tx.beforeBalance,balance:tx.balance,title:success?'Mission complete':'Mission stopped',explanation:success?'The crew returned to the Moon.':tx.deficit&&!fail?'The full request was unavailable, so launch was cancelled.':'The mission stopped at the first shortage.',destination:p.destinationId};s.proposal=null;return record(s,commandId,resolution);
}
export function returnProposal(state:Campaign,commandId:string):{state:Campaign;resolution:Resolution}{
 const existing=prior(state,commandId);if(existing)return existing;if(!state.proposal||nextInterlude(state).kind!=='mission')throw new Error('No mission ready');const s=copy(state),p=s.proposal!;s.returns++;s.proposal=null;const resolution:Resolution={id:commandId,kind:'return',success:false,fatal:false,minimum:copy(p.minimum),requested:copy(p.requested),spent:empty(),beforeBalance:copy(s.stock),balance:copy(s.stock),title:'Returned',explanation:'The proposal was returned without spending resources.',destination:p.destinationId};return record(s,commandId,resolution);
}
export function resolveEmergency(state:Campaign,eventId:string,percent:number,commandId:string):{state:Campaign;resolution:Resolution}{
 const existing=prior(state,commandId);if(existing)return existing;if(!Number.isInteger(percent)||percent<0||percent>100)throw new RangeError('Percent must be an integer from 0 to 100');const interlude=nextInterlude(state);if(interlude.kind!=='emergency'||interlude.eventId!==eventId)throw new Error('Emergency is not pending');const event=EVENTS.find(e=>e.id===eventId)!;const s=copy(state);const actualPercent=Math.min(percent,Math.floor(s.stock[event.resource]*100/event.cost));const requested=empty();requested[event.resource]=Math.floor(event.cost*actualPercent/100);const tx=spend(s,requested);const probability=tx.spent[event.resource]/event.cost, success=probability===1||random(s,'emergencies')<probability;s.events.find(e=>e.id===eventId)!.resolved=true;if(!success)s.terminal='emergency';const resolution:Resolution={id:commandId,kind:'emergency',success,fatal:!success,stage:'base',resource:event.resource,minimum:{...empty(),[event.resource]:event.cost},requested,spent:tx.spent,beforeBalance:tx.beforeBalance,balance:tx.balance,title:event.title,explanation:success?'The base was stabilized.':'The intervention failed and the base was lost.',event:eventId,probability};return record(s,commandId,resolution);
}
export function authorizeOperation(state:Campaign,operationId:string,choiceId:string,commandId:string):{state:Campaign;resolution:Resolution}{
 const existing=prior(state,commandId);if(existing)return existing;const interlude=nextInterlude(state);if(interlude.kind!=='operation'||interlude.operationId!==operationId)throw new Error('Operation is not pending');const operation=OPERATIONS.find(o=>o.id===operationId)!,choice=operation.choices.find(c=>c.id===choiceId);if(!choice)throw new Error('Unknown choice');const s=copy(state),tx=spend(s,choice.cost);s.operationsResolved.push(operationId);if(!tx.deficit)s.operationChoices[operationId]=choiceId;if(tx.deficit)s.terminal='stock';const resolution:Resolution={id:commandId,kind:'operation',success:!tx.deficit,fatal:tx.deficit,stage:'base',resource:RESOURCES.find(r=>tx.spent[r]<choice.cost[r]),minimum:copy(choice.cost),requested:copy(choice.cost),spent:tx.spent,beforeBalance:tx.beforeBalance,balance:tx.balance,title:operation.title,explanation:tx.deficit?'The base could not supply the full operation.':choice.effect,operation:operationId,choice:choiceId,effect:choice.effect};return record(s,commandId,resolution);
}
