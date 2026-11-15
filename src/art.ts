/** Original, replaceable vector stand-ins. No game data or UI text is baked in. */
const ink = '#173c40';
const ivory = '#f4ead3';
const coral = '#e77758';
const gold = '#e8b75e';
const teal = '#70aaa2';
const svg = (viewBox: string, body: string, extra = '') => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" ${extra}>${body}</svg>`;

const people: Record<string, [string,string,string,string]> = {
  nico:['#d59872','#283d3d','#e98662','short'], ada:['#b87b5b','#212e37','#79ada5','bob'],
  leo:['#e6b995','#624a3d','#dfac65','curl'], max:['#a56e51','#272f32','#db765f','spike'],
  sol:['#c98262','#412e31','#e3b34f','bun'], dante:['#d5a07f','#292e37','#7c9eab','wave'],
  vera:['#9d684f','#263b3b','#c98678','bob'], teo:['#ebbd96','#704e38','#8fb49a','curl'],
  ren:['#ca906f','#25373b','#d99952','spike']
};
export function portrait(id: string): string {
  const [skin,hair,suit,style] = people[id.toLowerCase()] || people.nico;
  const hairTop: Record<string,string> = {
    short:`<path d="M76 97Q74 48 120 48q45 0 44 49l-12-20-22-8-32 14-22 14" fill="${hair}"/>`,
    bob:`<path d="M68 126V95q0-48 52-48t52 48v32l-21-10-3-35-25-13-31 15-4 35z" fill="${hair}"/>`,
    curl:`<path d="M75 96Q64 77 78 67q2-18 19-16 12-15 26-6 17-8 26 7 20 0 20 20 8 10-5 25l-12-16-31-10-33 16z" fill="${hair}"/>`,
    spike:`<path d="M76 98l-3-33 16 5 4-23 23 10 15-15 9 18 17-6 6 43-14-17-28-8-34 16z" fill="${hair}"/>`,
    bun:`<circle cx="159" cy="57" r="18" fill="${hair}"/><path d="M76 96Q73 49 120 48q45 0 44 48l-15-15-24-13-34 16z" fill="${hair}"/>`,
    wave:`<path d="M70 126Q64 82 78 62q15-22 43-15 31-7 43 19 11 20 5 61l-22-8 5-32q-20 1-33-18-8 15-31 18l2 32z" fill="${hair}"/>`
  };
  return svg('0 0 240 300', `<path d="M34 300v-58q0-50 49-59l18-5h38l18 5q49 9 49 59v58" fill="${suit}" stroke="${ink}" stroke-width="5"/><path d="M95 176v19q25 24 50 0v-19" fill="${skin}" stroke="${ink}" stroke-width="4"/><path d="M76 91q0-40 44-40t44 40v34q0 53-44 60-44-7-44-60z" fill="${skin}" stroke="${ink}" stroke-width="4"/>${hairTop[style]}<path d="M94 111h13m26 0h13" stroke="${ink}" stroke-width="4" stroke-linecap="round"/><circle cx="101" cy="121" r="3" fill="${ink}"/><circle cx="139" cy="121" r="3" fill="${ink}"/><path d="M111 145q9 7 18 0" fill="none" stroke="${ink}" stroke-width="3" stroke-linecap="round"/><path d="M88 187l32 34 32-34 15 12-14 33-33-11-33 11-14-33z" fill="${ivory}" stroke="${ink}" stroke-width="4"/><path d="M67 300v-45m106 45v-45" stroke="${ink}" stroke-width="4"/><circle cx="153" cy="251" r="10" fill="${gold}" stroke="${ink}" stroke-width="3"/>`);
}

export function lunarView(): string {
  return svg('0 0 1600 320', `<rect width="1600" height="320" fill="#234e55"/><circle cx="1270" cy="79" r="46" fill="#a9d3c2"/><path d="M1234 66q20-22 37-11l10 13-12 10-19-3-6 15-15-4zm50 14 15-6 11 12-9 20-16 4-7-12z" fill="#4e938a"/><g fill="${ivory}" opacity=".8"><circle cx="120" cy="46" r="2"/><circle cx="275" cy="96" r="3"/><circle cx="411" cy="39" r="2"/><circle cx="597" cy="112" r="2"/><circle cx="810" cy="39" r="3"/><circle cx="1040" cy="85" r="2"/><circle cx="1454" cy="40" r="3"/><circle cx="1504" cy="132" r="2"/></g><path d="M0 235q200-77 420-14t405-6q200-66 375-16t400-13v134H0z" fill="#97b7ab"/><path d="M0 258q200-47 405-6t420 2q220-45 411-8t364-11v85H0z" fill="#d1d5be"/><g stroke="${ink}" stroke-width="5"><path d="M508 260v-41q0-60 71-60t71 60v41z" fill="${ivory}"/><path d="M530 219q4-40 49-40t49 40z" fill="#86bdb1"/><path d="M650 228h90v32h-90z" fill="${ivory}"/><path d="M738 260v-33q0-41 50-41t50 41v33z" fill="${ivory}"/><path d="M1043 259v-84m-25 84h50m-25-66 33-29m-33 42-23-23" fill="none"/><circle cx="1077" cy="163" r="6" fill="${coral}"/></g><path d="M78 288q40-11 81 0m742 8q38-11 76 0m355-9q55-12 105 0" fill="none" stroke="#aab7a6" stroke-width="4" stroke-linecap="round"/>`);
}

export function ship(kind: 'transport' | 'module'): string {
  if (kind === 'module') return svg('0 0 240 180', `<g stroke="${ink}" stroke-width="5" stroke-linejoin="round"><path d="M68 125l-24 32m128-32 24 32M31 158h29m120 0h29" fill="none" stroke-linecap="round"/><path d="M71 124l10-55 39-36 39 36 10 55-20 15H91z" fill="${ivory}"/><path d="M87 76h66l7 42H80z" fill="${teal}"/><circle cx="120" cy="94" r="14" fill="#254d55"/><path d="M96 139h48l-8 15h-32z" fill="${coral}"/><path d="M120 33V17m-11 0h22" fill="none"/></g>`);
  return svg('0 0 360 150', `<g stroke="${ink}" stroke-width="5" stroke-linejoin="round"><path d="M69 60 31 48v54l38-12z" fill="${coral}"/><path d="M63 54h198q41 0 65 21-24 21-65 21H63z" fill="${ivory}"/><path d="M233 54q35 0 62 21h-62z" fill="${teal}"/><circle cx="114" cy="75" r="10" fill="${gold}"/><circle cx="151" cy="75" r="10" fill="${gold}"/><path d="M182 54V29h57v25m-57 42v25h57V96" fill="#77a7a1"/><path d="M190 29v25m20-25v25m19-25v25m-39 71V96m20 25V96m19 25V96" fill="none"/><path d="M30 59 9 66v18l21 7" fill="${gold}"/></g>`);
}

const worlds: Record<string,[string,string]> = { mercury:['#aaa69a','#827e77'], venus:['#dbac72','#efcb91'], earth:['#64aaa5','#b6d4a5'], mars:['#d78362','#b96050'], jupiter:['#d9b78b','#ad8064'], saturn:['#e0c794','#bd9b6f'], uranus:['#a4d3cc','#7cb7b4'], neptune:['#608fb1','#3e729c'], moon:['#d6d6c4','#a8b7a9'], luna:['#d6d6c4','#a8b7a9'] };
export function planet(id: string): string {
  const key = id.toLowerCase(); const [color,detail] = worlds[key] || worlds.moon;
  const ring = key === 'saturn' ? `<ellipse cx="120" cy="120" rx="108" ry="30" fill="none" stroke="#b89c76" stroke-width="13" transform="rotate(-15 120 120)"/>` : '';
  const marks = ['jupiter','saturn','uranus','neptune','venus'].includes(key)
    ? `<path d="M45 95q75 20 150-4M42 125q80 15 156-4M50 154q71 14 140-7" fill="none" stroke="${detail}" stroke-width="12" opacity=".8"/>`
    : `<circle cx="85" cy="92" r="14" fill="${detail}" opacity=".65"/><circle cx="149" cy="140" r="21" fill="${detail}" opacity=".65"/><circle cx="111" cy="164" r="8" fill="${detail}" opacity=".65"/>`;
  // Paths stay inside the circular face without clip IDs, so repeated SVGs are safe.
  return svg('0 0 240 240', `${ring}<circle cx="120" cy="120" r="78" fill="${color}" stroke="${ink}" stroke-width="5"/>${marks}`);
}

export function baseView(state: {lifeSupport?: string; refuge?: string; food?: string} = {}, condition: 'normal'|'intervention'|'stable'|'lost' = 'normal'): string {
  const active = (v?: string) => v && !['off','inactive','paused','pending','deferred'].includes(v.toLowerCase());
  const life = active(state.lifeSupport) ? '#9ed0aa' : '#b6c7bc';
  const refuge = active(state.refuge) ? gold : '#b6c7bc';
  const food = active(state.food) ? '#85bb87' : '#b6c7bc';
  const sky = condition === 'lost' ? '#4b5660' : '#305d62';
  return svg('0 0 700 260', `<rect width="700" height="260" fill="${sky}"/><circle cx="590" cy="57" r="26" fill="#aacfc3"/><g fill="${ivory}"><circle cx="75" cy="40" r="2"/><circle cx="241" cy="55" r="2"/><circle cx="430" cy="24" r="2"/><circle cx="515" cy="95" r="2"/></g><path d="M0 200q130-40 266 0t250-8q95-30 184-6v74H0z" fill="#c9d2bd"/><g stroke="${ink}" stroke-width="5" stroke-linejoin="round"><path d="M65 205v-45q0-65 78-65t78 65v45z" fill="${ivory}"/><path d="M91 158q3-37 52-37t52 37z" fill="${life}"/><path d="M221 181h45v24h-45zm175 0h42v24h-42z" fill="${ivory}"/><path d="M265 205v-59l65-38 65 38v59z" fill="${ivory}"/><path d="M300 160h60v45h-60z" fill="${refuge}"/><path d="M439 205v-42q0-55 65-55t65 55v42z" fill="${ivory}"/><path d="M459 163q0-35 45-35t45 35z" fill="${food}"/><path d="M609 205v-94m-23 94h46m-23-70 29-25m-29 41-23-20" fill="none"/><circle cx="640" cy="108" r="6" fill="${coral}"/></g>${condition === 'intervention' ? `<circle cx="332" cy="67" r="17" fill="${coral}"/><path d="M332 56v15m0 5v2" stroke="${ivory}" stroke-width="4" stroke-linecap="round"/>` : ''}${condition === 'stable' ? `<circle cx="332" cy="67" r="17" fill="#84be99"/><path d="m324 67 6 6 11-13" fill="none" stroke="${ink}" stroke-width="4" stroke-linecap="round"/>` : ''}${condition === 'lost' ? `<path d="M0 0h700v260H0z" fill="#203d40" opacity=".25"/>` : ''}`);
}

export function resourceIcon(key: string): string {
  const icons: Record<string,string> = {
    food:`<path d="M4 13q8-2 16 0l-2 7H6z" fill="${gold}"/><path d="M7 10q0-5 5-6 5 1 5 6" fill="none"/>`,
    water:`<path d="M12 3C9 8 6 11 6 15a6 6 0 0 0 12 0c0-4-3-7-6-12z" fill="#82c5cf"/>`,
    oxygen:`<rect x="7" y="5" width="10" height="16" rx="3" fill="#a6d2c4"/><path d="M10 5V3h4v2m-5 8h6m-3-3v6" fill="none"/>`,
    propellant:`<path d="M7 20h10l-1-8-4-8-4 8z" fill="${coral}"/><path d="M10 16h4m-2-8v4" fill="none"/>`,
    energy:`<path d="M13 2 5 14h6l-1 8 9-13h-6z" fill="${gold}"/>`
  };
  return svg('0 0 24 24', `<g stroke="${ink}" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round">${icons[key.toLowerCase()] || icons.energy}</g>`, 'aria-hidden="true"');
}
