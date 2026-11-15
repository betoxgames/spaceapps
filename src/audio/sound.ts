import { assetUrl } from '../core/assets';

export type Cue = 'paper' | 'page' | 'stamp' | 'alert' | 'confirm' | 'success' | 'failure' | 'transmission' | 'door';
export class Sound {
  private context?: AudioContext;
  private master?: GainNode;
  private voices = new Set<AudioScheduledSourceNode>();
  private buffers: Partial<Record<'stamp' | 'door' | 'ambient' | 'engine', AudioBuffer>> = {};
  private loading = new Map<string, Promise<void>>();
  private failed = new Set<string>();
  private doorVoice?: AudioBufferSourceNode;
  private ambient?: AudioBufferSourceNode;
  private ambientGain?: GainNode;
  private engine?: AudioBufferSourceNode;
  private engineGain?: GainNode;
  private engineKind: 'module' | 'transport' | null = null;
  private _musicVolume = .5;
  private hidden = false;
  private _muted = false;
  private _volume = 0.35;
  paused = false;

  get muted() { return this._muted; }
  set muted(value: boolean) { this._muted = value; this.updateVolume(); }
  get volume() { return this._volume; }
  set volume(value: number) { this._volume = value; this.updateVolume(); }

  get musicVolume() { return this._musicVolume; }
  set musicVolume(value: number) {
    this._musicVolume = Math.max(0, Math.min(1, value));
    if (this.ambientGain && this.context) this.ambientGain.gain.setValueAtTime(.36 * this._musicVolume, this.context.currentTime);
  }

  private updateVolume() {
    if (this.master && this.context) this.master.gain.setValueAtTime(this._muted ? 0 : this._volume, this.context.currentTime);
  }
  unlock() {
    try {
      if (!this.context) {
        this.context = new AudioContext();
        this.master = this.context.createGain();
        this.master.connect(this.context.destination);
        this.updateVolume();
      }
      this.syncPlayback();
      this.loadAudio(this.context, 'stamp', 'assets/audio/stamp.mp3');
      this.loadAudio(this.context, 'door', 'assets/audio/door.mp3');
      this.loadAudio(this.context, 'ambient', 'assets/audio/ambient-music.mp3');
      this.loadAudio(this.context, 'engine', 'assets/audio/ship-engine.mp3');
    } catch { /* Visual equivalents remain available. */ }
  }
  private loadAudio(ctx: AudioContext, name: 'stamp' | 'door' | 'ambient' | 'engine', path: string) {
    if (this.buffers[name] || this.failed.has(name)) return Promise.resolve();
    const pending = this.loading.get(name);
    if (pending) return pending;
    const controller = new AbortController();
    let timeout: ReturnType<typeof setTimeout> | undefined;
    const request = fetch(assetUrl(path), { signal: controller.signal })
      .then(response => { if (!response.ok) throw new Error('Sound unavailable'); return response.arrayBuffer(); })
      .then(bytes => ctx.decodeAudioData(bytes));
    // A stalled effect must not hold the visitor in the loading phase forever.
    const decoded = name === 'ambient' ? request : Promise.race([request, new Promise<never>((_, reject) => {
      timeout = setTimeout(() => { controller.abort(); reject(new Error('Sound timed out')); }, 5000);
    })]);
    const loading = decoded
      .then(buffer => { this.buffers[name] = buffer; if (name === 'ambient') this.startAmbient(); if (name === 'engine') this.startEngine(); })
      .catch(() => { this.failed.add(name); })
      .finally(() => { if (timeout !== undefined) clearTimeout(timeout); this.loading.delete(name); });
    this.loading.set(name, loading);
    return loading;
  }
  /** Wait only for effects that must start in sync with the scene. */
  ready(): Promise<void> {
    return Promise.all(['stamp', 'door'].map(name => this.loading.get(name))).then(() => {});
  }
  private startAmbient() {
    const ctx = this.context, master = this.master, buffer = this.buffers.ambient;
    if (!ctx || !master || !buffer || this.ambient || this.paused || this.hidden || ctx.state !== 'running') return;
    let source: AudioBufferSourceNode | undefined;
    try {
      source = ctx.createBufferSource();
      const gain = ctx.createGain();
      source.buffer = buffer;
      source.loop = true;
      gain.gain.setValueAtTime(.36 * this._musicVolume, ctx.currentTime);
      this.ambientGain = gain;
      source.connect(gain); gain.connect(master);
      this.ambient = source;
      source.onended = () => { if (this.ambient === source) this.ambient = undefined; this.ambientGain = undefined; source?.disconnect(); gain.disconnect(); };
      source.start();
    } catch {
      if (this.ambient === source) this.ambient = undefined;
      source?.disconnect();
    }
  }
  /** Engine beds follow the active flight beat and retain position while paused. */
  setEngine(kind: 'module' | 'transport' | null) {
    this.engineKind = kind;
    const ctx = this.context;
    if (!kind) {
      const source = this.engine;
      this.engine = undefined; this.engineGain = undefined;
      try { source?.stop(); } catch { /* Already ended. */ }
    } else if (this.engineGain && ctx) {
      this.engineGain.gain.setValueAtTime(kind === 'module' ? .16 : .12, ctx.currentTime);
    } else this.startEngine();
  }
  private startEngine() {
    const ctx = this.context, master = this.master, buffer = this.buffers.engine, kind = this.engineKind;
    if (!ctx || !master || !buffer || !kind || this.engine || this.paused || this.hidden || ctx.state !== 'running') return;
    let source: AudioBufferSourceNode | undefined;
    let gain: GainNode | undefined;
    try {
      source = ctx.createBufferSource(); gain = ctx.createGain();
      source.buffer = buffer; source.loop = true;
      const at = ctx.currentTime;
      // Attenuate the supplied roar by 16–18 dB before master volume.
      gain.gain.setValueAtTime(0, at);
      gain.gain.linearRampToValueAtTime(kind === 'module' ? .16 : .12, at + .08);
      source.connect(gain); gain.connect(master);
      this.engine = source; this.engineGain = gain;
      const active = source, level = gain;
      source.onended = () => { if (this.engine === active) { this.engine = undefined; this.engineGain = undefined; } active.disconnect(); level.disconnect(); };
      source.start();
    } catch {
      if (this.engine === source) { this.engine = undefined; this.engineGain = undefined; }
      source?.disconnect(); gain?.disconnect();
    }
  }
  private syncPlayback() {
    const ctx = this.context;
    if (!ctx) return;
    if (this.paused || this.hidden) {
      void ctx.suspend().catch(() => {});
    } else {
      void ctx.resume().then(() => {
        if (this.paused || this.hidden) void ctx.suspend().catch(() => {});
        else { this.startAmbient(); this.startEngine(); }
      }).catch(() => {});
    }
  }
  setHidden(value: boolean) { this.hidden = value; this.syncPlayback(); }
  pause(value: boolean) {
    this.paused = value;
    if (value) { for (const o of this.voices) { try { o.stop(); } catch {} } this.voices.clear(); }
    this.syncPlayback();
  }
  play(cue: Cue, durationMs?: number) {
    const ctx = this.context, master = this.master;
    if (!ctx || !master || this.muted || this.paused || this.hidden || ctx.state !== 'running') return;
    if ((cue === 'stamp' || cue === 'door') && this.buffers[cue]) {
      let source: AudioBufferSourceNode | undefined;
      let gain: GainNode | undefined;
      try {
        if (cue === 'door' && this.doorVoice) { try { this.doorVoice.stop(); } catch {} }
        source = ctx.createBufferSource();
        if (cue === 'door') this.doorVoice = source;
        source.buffer = this.buffers[cue]!;
        // Skip the recordings' leading silence and unrelated late sounds.
        const offset = cue === 'stamp' ? .535 : .13;
        const length = cue === 'stamp' ? .28 : 1.33;
        const rate = cue === 'stamp' ? 1.15 : durationMs && durationMs > 0 ? length / (durationMs / 1000) : 1;
        source.playbackRate.value = rate;
        gain = ctx.createGain();
        const at = ctx.currentTime, end = at + length / rate;
        gain.gain.setValueAtTime(0, at);
        gain.gain.linearRampToValueAtTime(1, at + .003);
        gain.gain.setValueAtTime(1, Math.max(at + .003, end - .008));
        gain.gain.linearRampToValueAtTime(0, end);
        source.connect(gain); gain.connect(master);
        this.voices.add(source);
        const active = source;
        source.onended = () => { this.voices.delete(active); if (this.doorVoice === active) this.doorVoice = undefined; active.disconnect(); gain?.disconnect(); };
        source.start(at, offset, length);
        return;
      } catch {
        if (source) { this.voices.delete(source); if (this.doorVoice === source) this.doorVoice = undefined; source.disconnect(); }
        gain?.disconnect();
        /* Use the synthesized cue if playback cannot start. */
      }
    }
    if (cue === 'door') return;
    const notes: Record<Exclude<Cue, 'door'>, number[]> = { paper: [540, 360], page: [410], stamp: [110, 65], alert: [660, 440, 660], confirm: [490], success: [440, 554, 660], failure: [260, 196], transmission: [330, 494, 659] };
    notes[cue].forEach((frequency, i) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      const at = ctx.currentTime + i * (cue === 'stamp' ? .035 : .09);
      o.type = cue === 'stamp' ? 'triangle' : 'sine'; o.frequency.setValueAtTime(frequency, at);
      g.gain.setValueAtTime(0, at); g.gain.linearRampToValueAtTime(.16, at + .008); g.gain.exponentialRampToValueAtTime(.001, at + .12);
      o.connect(g); g.connect(master); o.start(at); o.stop(at + .14);
      this.voices.add(o); o.onended = () => { this.voices.delete(o); o.disconnect(); g.disconnect(); };
    });
  }
}
