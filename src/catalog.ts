export const RESOURCES = ['food', 'water', 'oxygen', 'propellant', 'energy'] as const;
export type Resource = typeof RESOURCES[number];
export type Resources = Record<Resource, number>;
export const units = (n: number): number => Math.round(n * 1000);
export const format = (n: number): string => (n / 1000).toLocaleString('en-US', { maximumFractionDigits: 3 });
export const vector = (food = 0, water = 0, oxygen = 0, propellant = 0, energy = 0): Resources => ({food: units(food), water: units(water), oxygen: units(oxygen), propellant: units(propellant), energy: units(energy)});
export const RESOURCE_LABELS: Record<Resource, {label: string; unit: string}> = {food:{label:'Food',unit:'kg'},water:{label:'Water',unit:'L'},oxygen:{label:'Oxygen',unit:'kg'},propellant:{label:'Propellant',unit:'kg'},energy:{label:'Energy',unit:'kWh'}};
export interface Destination { id: string; name: string; mode: 'surface'|'orbit'; minimum: Resources; color: string }
export const DESTINATIONS: Destination[] = [
 {id:'mercury',name:'Mercury',mode:'surface',minimum:vector(9200,21120,3960,1980000,1760000),color:'#a99c8d'},
 {id:'venus',name:'Venus',mode:'surface',minimum:vector(10350,23040,4840,1760000,1980000),color:'#dfb673'},
 {id:'earth',name:'Earth',mode:'surface',minimum:vector(11500,19200,4400,1100000,1100000),color:'#77bad0'},
 {id:'mars',name:'Mars',mode:'surface',minimum:vector(11500,19200,4400,1100000,1100000),color:'#c7826c'},
 {id:'jupiter',name:'Jupiter',mode:'orbit',minimum:vector(17250,30720,7480,2420000,2640000),color:'#c7a184'},
 {id:'saturn',name:'Saturn',mode:'orbit',minimum:vector(20700,36480,8800,2750000,3080000),color:'#dcc99d'},
 {id:'uranus',name:'Uranus',mode:'orbit',minimum:vector(25300,44160,11000,3300000,3740000),color:'#8bcace'},
 {id:'neptune',name:'Neptune',mode:'orbit',minimum:vector(29900,53760,13200,3850000,4400000),color:'#8098d8'}
];
export interface Event {id:string; title:string; description:string; resource:Resource; cost:number}
export const EVENTS: Event[] = [
 {id:'E01',title:'Airlock stuck',description:'Supply power to finish closing and checking the airlock.',resource:'energy',cost:units(20000)},
 {id:'E02',title:'Oxygen reserve lost',description:'Restore the oxygen reserve after a sealed leak.',resource:'oxygen',cost:units(1000)},
 {id:'E03',title:'Water recovery interrupted',description:'Keep contaminated water isolated while the recovery filter is checked. Supply clean reserves.',resource:'water',cost:units(40000)},
 {id:'E04',title:'Solar alert',description:'Power the shelter systems while the crew takes refuge.',resource:'energy',cost:units(60000)},
 {id:'E05',title:'Air system stopped',description:'Restart and check the ventilation and scrubber.',resource:'energy',cost:units(40000)},
 {id:'E06',title:'Rations lost',description:'Replace a contaminated box of food.',resource:'food',cost:units(10000)},
 {id:'E07',title:'Greenhouse cooling leak',description:'The greenhouse is getting too warm. Repair its cooling loop and replace the water lost.',resource:'water',cost:units(20000)},
 {id:'E08',title:'Storehouse power lost',description:'Power refrigeration until the supply is restored.',resource:'energy',cost:units(60000)}
];
export interface OperationChoice {id:'A'|'B'; name:string; description:string; cost:Resources; effect:string}
export interface Operation {id:string; title:string; afterSuccess:number; choices:[OperationChoice,OperationChoice]}
export const BASE_BUDGET = vector(500,3000,400,0,50000);
export const OPERATIONS: Operation[] = [
 {id:'B01',title:'Life support',afterSuccess:1,choices:[{id:'A',name:'Run regenerative system',description:'Run the life-support regeneration system using power.',cost:vector(0,0,0,0,20000),effect:'Regenerative life support is operating.'},{id:'B',name:'Use reserves',description:'Use water and oxygen reserves while the regenerative system waits.',cost:vector(0,2000,400),effect:'Life support is using reserves.'}]},
 {id:'B02',title:'Shelter preparation',afterSuccess:2,choices:[{id:'A',name:'Expanded preparation',description:'Prepare the shelter and preserve indoor laboratory activity.',cost:vector(0,0,0,0,20000),effect:'Expanded shelter preparation; the laboratory stays active.'},{id:'B',name:'Compact preparation',description:'Prepare the shelter and suspend the laboratory to concentrate activity.',cost:vector(0,0,0,0,5000),effect:'Compact shelter preparation; laboratory activity is suspended.'}]},
 {id:'B03',title:'Food supply',afterSuccess:3,choices:[{id:'A',name:'Grow local food',description:'Use water and energy to grow food for local use after the fourth success.',cost:vector(0,1000,0,0,10000),effect:'Food is growing for local use, without replenishing mission stock.'},{id:'B',name:'Use stored rations',description:'Use stored food and energy immediately; local growing waits.',cost:vector(500,0,0,0,2000),effect:'Stored rations used locally; growing waits.'}]}

];
export interface Engineer {id:string;name:string;trait:string;greeting:string}
export const ENGINEERS: Engineer[] = [
 {id:'nico',name:'Nico',trait:'funny',greeting:'I brought a plan and an emergency joke.'}, {id:'ada',name:'Ada',trait:'analytical',greeting:'The figures are ready for your review.'}, {id:'leo',name:'Leo',trait:'shy',greeting:'I think this route could work.'}, {id:'max',name:'Max',trait:'bold',greeting:'A planet is waiting!'}, {id:'sol',name:'Sol',trait:'optimistic',greeting:'One step closer today.'}, {id:'dante',name:'Dante',trait:'dramatic',greeting:'The crew’s plan is in this folder.'}, {id:'vera',name:'Vera',trait:'formal',greeting:'The request is ready for inspection.'}, {id:'teo',name:'Teo',trait:'absent-minded',greeting:'Here is the plan. This is the right folder.'}, {id:'ren',name:'Ren',trait:'competitive',greeting:'Let’s aim for a careful mission.'}
];
