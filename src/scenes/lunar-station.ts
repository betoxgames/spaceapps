import { assetUrl } from '../core/assets';

type StationLight = 'white' | 'red' | 'amber' | 'off';

// Emergencies begin under alert lighting; base operations begin under normal lighting.
const initialLights: Record<string, StationLight> = {
  E01: 'red', E02: 'red', E03: 'red', E04: 'red',
  E05: 'red', E06: 'red', E07: 'red', E08: 'off',
  B01: 'white', B02: 'white', B03: 'white',
};

export function stationAlertLight(event?:string): StationLight {
  return (event && initialLights[event]) || 'white';
}

export function stationSequenceLight(event:string | undefined, index:number, revealed:boolean, success:boolean): StationLight {
  const alert = stationAlertLight(event);
  return revealed ? (success ? 'white' : 'off') : index === 0 ? alert : 'amber';
}

export function stationImage(light:StationLight):string {
  return `<img class="lunar-station-image" src="${assetUrl(`assets/images/lunar-station/${light}.webp`)}" width="1920" height="1080" alt="">`;
}

let preloaded = false;
export function preloadStationImages():void {
  if (preloaded) return;
  preloaded = true;
  for (const light of ['white', 'red', 'amber', 'off'] as const) {
    const image = new Image();
    image.src = assetUrl(`assets/images/lunar-station/${light}.webp`);
  }
}
