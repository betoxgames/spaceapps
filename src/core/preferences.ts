export interface Preferences {volume:number; musicVolume:number; muted:boolean; reduced:boolean; clickPlacement:boolean}

export function loadPreferences():Preferences {
  let prefs:Preferences={volume:.35,musicVolume:.5,muted:false,reduced:matchMedia('(prefers-reduced-motion: reduce)').matches,clickPlacement:false};
  try {const saved=JSON.parse(localStorage.getItem('space-papers-preferences-v1')??'{}');prefs={volume:Number.isFinite(saved.volume)?Math.max(0,Math.min(1,saved.volume)):.35,musicVolume:Number.isFinite(saved.musicVolume)?Math.max(0,Math.min(1,saved.musicVolume)):.5,muted:saved.muted===true,reduced:typeof saved.reduced==='boolean'?saved.reduced:prefs.reduced,clickPlacement:saved.clickPlacement===true};}catch{}
  return prefs;
}
export function savePreferences(prefs:Preferences) {try{localStorage.setItem('space-papers-preferences-v1',JSON.stringify(prefs));}catch{}}
