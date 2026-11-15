import { DESTINATIONS, RESOURCES, RESOURCE_LABELS, format, type Resource, type Resources } from '../data/catalog';
import { resourceIcon } from './art';

export const esc = (value:unknown) => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
export const button = (label:string,action:string,classes='') => `<button type="button" class="${classes}" data-action="${action}">${label}</button>`;
export function resourceRows(amounts:Resources,keys:readonly Resource[]=RESOURCES,compact=false){return keys.map(r=>`<div class="resource-row ${compact?'compact':''}"><span class="resource-label">${resourceIcon(r)}${RESOURCE_LABELS[r].label}</span><span class="resource-value">${format(amounts[r])} <span>${RESOURCE_LABELS[r].unit}</span></span></div>`).join('');}
export function costText(amounts:Resources){return RESOURCES.filter(r=>amounts[r]>0).map(r=>`${format(amounts[r])} ${RESOURCE_LABELS[r].unit} ${RESOURCE_LABELS[r].label.toLowerCase()}`).join(' + ');}
export function nameOf(id?:string){return DESTINATIONS.find(d=>d.id===id)?.name??id??'';}
