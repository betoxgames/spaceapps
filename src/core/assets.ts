declare global { interface Window { __SPACE_PAPERS_ASSETS__?: Record<string,string> } }
/** Classic-script audio data supports Web Audio on file://; images stay external. */
export function assetUrl(path:string):string {
  const key=path.replace(/^\.\//,'').replace(/^\//,'');
  const base = import.meta.env.DEV ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}public/`;
  return window.__SPACE_PAPERS_ASSETS__?.[key] ?? new URL(`${base}${key}`,document.baseURI).href;
}
