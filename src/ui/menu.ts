/** Native viewport menu; the game desk keeps its own spatial coordinate system. */
export function orbitalMenuMarkup() {
  return `<section class="orbital-menu" data-scene-state="loading" aria-label="Space Papers main menu">
    <div class="orbital-backdrop" aria-hidden="true"></div>
    <div class="orbital-scene" id="moon-scene" aria-hidden="true"></div>
    <div class="orbital-vignette" aria-hidden="true"></div>
    <header class="orbital-header">
      <a class="orbital-brand" href="#" aria-label="Space Papers home" data-menu-control="home"><svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><circle cx="24" cy="24" r="14" stroke="currentColor"/><ellipse cx="24" cy="24" rx="24" ry="8" transform="rotate(-40 24 24)" stroke="currentColor"/><circle cx="36" cy="10" r="3" fill="currentColor"/></svg><span>LUNAR OPERATIONS<br><strong>BUREAU</strong></span></a>
      <div class="orbital-header-right"><span class="orbital-sector">SECTOR 04 <i></i> SYSTEMS ONLINE</span><button type="button" class="orbital-icon-button" data-menu-control="sound" aria-label="Mute audio" aria-pressed="false"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4V5Z"/><path class="sound-waves" d="M15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/><path class="sound-muted" d="m15 9 6 6m0-6-6 6"/></svg></button></div>
    </header>
    <div class="orbital-copy">
      <p class="orbital-eyebrow"><span></span> YOUR NEXT SHIFT IS A WORLD AWAY</p>
      <h1>SPACE<br><span>PAPERS</span><b aria-hidden="true">.</b></h1>
      <p class="orbital-tagline">A small desk.<br>A very big responsibility.</p>
      <p class="orbital-description">Every mission needs a safe return.<br>Yours begins with a signature.</p>
      <nav class="orbital-navigation" aria-label="Main navigation">
        <button type="button" class="orbital-start" data-action="new-shift"><span><small>01 / LUNAR OPERATIONS</small>Begin shift</span><span class="orbital-start-arrow" aria-hidden="true">↗</span></button>
        <button type="button" class="orbital-training" data-action="training" aria-label="Training"><span>Training</span><small>4 GUIDED LESSONS <span aria-hidden="true">↗</span></small></button>
        <div class="orbital-links"><button type="button" data-action="options">Options</button><span aria-hidden="true">/</span><button type="button" data-action="credits">Credits & science</button><span aria-hidden="true">/</span><button type="button" data-menu-control="replay" aria-expanded="false" aria-controls="orbital-replay">Replay a seed</button></div>
      </nav>
      <form class="orbital-replay" id="orbital-replay" hidden><label for="seed-input">REPLAY SEED</label><div><input id="seed-input" maxlength="80" autocomplete="off" placeholder="e.g. lunar-morning" aria-label="Replay seed"><button type="submit" aria-label="Start replay">↗</button></div><p>Same seed. A new chance to make your mark.</p></form>
    </div>
    <div class="orbital-target" aria-hidden="true"><span>01 — HOME BASE</span><strong>THE MOON</strong><p>384,400 KM FROM EARTH</p></div>
    <div class="orbital-explore" role="group" aria-label="Interactive Moon controls">
      <button type="button" class="orbital-drag-zone" data-menu-control="orbit" aria-label="Rotate the Moon. Drag or use arrow keys. Plus and minus zoom. Home resets." aria-describedby="moon-instructions"></button>
      <div class="orbital-orbit-tools"><span id="moon-instructions"><i aria-hidden="true">✥</i> DRAG TO EXPLORE</span><button type="button" data-menu-control="rotate" aria-label="Pause Moon rotation" aria-pressed="false">Ⅱ</button><button type="button" data-menu-control="reset" aria-label="Reset Moon view">↺</button><button type="button" data-menu-control="lights" aria-label="Replay original light sequence">✧</button></div>
    </div>
    <p class="orbital-loading" role="status" aria-live="polite"><span></span><span id="moon-status">ESTABLISHING LUNAR LINK</span></p>
    <footer class="orbital-footer"><span class="orbital-signature">LOS VALAR <span>INDEPENDENT LUNAR DIVISION</span></span><span class="orbital-manifest">5 DESTINATIONS <i></i> ONE SHARED STOCK</span><span class="orbital-offline"><i></i> OFFLINE READY <span>SP—04 / 1.0</span></span></footer>
    <div class="orbital-departure" aria-hidden="true"><span>SHIFT AUTHORIZED</span><strong>Welcome to lunar operations.</strong><i></i></div>
  </section>`;
}
