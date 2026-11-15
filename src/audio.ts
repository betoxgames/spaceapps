export type Cue = 'paper' | 'page' | 'stamp' | 'alert' | 'confirm' | 'success' | 'failure';
export class Sound {
  private context?: AudioContext;
  private voices = new Set<OscillatorNode>();
  muted = false;
  volume = 0.35;
  paused = false;
  unlock() {
    try { this.context ??= new AudioContext(); if (!this.paused) void this.context.resume().catch(() => {}); } catch { /* Visual equivalents remain available. */ }
  }
  pause(value: boolean) {
    this.paused = value;
    if (value) { for (const o of this.voices) { try { o.stop(); } catch {} } this.voices.clear(); void this.context?.suspend().catch(() => {}); }
    else void this.context?.resume().catch(() => {});
  }
  play(cue: Cue) {
    const ctx = this.context;
    if (!ctx || this.muted || this.paused || ctx.state !== 'running') return;
    const notes: Record<Cue, number[]> = { paper: [540, 360], page: [410], stamp: [110, 65], alert: [660, 440, 660], confirm: [490], success: [440, 554, 660], failure: [260, 196] };
    notes[cue].forEach((frequency, i) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      const at = ctx.currentTime + i * (cue === 'stamp' ? .035 : .09);
      o.type = cue === 'stamp' ? 'triangle' : 'sine'; o.frequency.setValueAtTime(frequency, at);
      g.gain.setValueAtTime(0, at); g.gain.linearRampToValueAtTime(this.volume * .16, at + .008); g.gain.exponentialRampToValueAtTime(.001, at + .12);
      o.connect(g); g.connect(ctx.destination); o.start(at); o.stop(at + .14);
      this.voices.add(o); o.onended = () => { this.voices.delete(o); o.disconnect(); g.disconnect(); };
    });
  }
}
