declare global { interface Window { __SPACE_PAPERS_ASSETS__?: Record<string,string> } }
/** Offline builds embed assets; development uses the same local public paths. */
export function assetUrl(path:string):string {
  const key=path.replace(/^\.\//,'').replace(/^\//,'');
  return window.__SPACE_PAPERS_ASSETS__?.[key] ?? new URL(`${import.meta.env.BASE_URL}${key}`,document.baseURI).href;
}
