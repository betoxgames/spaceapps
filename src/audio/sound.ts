import { assetUrl } from '../core/assets';

export type Cue = 'paper' | 'page' | 'stamp' | 'alert' | 'confirm' | 'success' | 'failure' | 'transmission' | 'door';
export class Sound {
  private context?: AudioContext;
  private master?: GainNode;
  private voices = new Set<AudioScheduledSourceNode>();
  private buffers: Partial<Record<'stamp' | 'door' | 'ambient', AudioBuffer>> = {};
  private loading = new Set<string>();
  private failed = new Set<string>();
  private doorVoice?: AudioBufferSourceNode;
  private ambient?: AudioBufferSourceNode;
  private ambientGain?: GainNode;
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
    } catch { /* Visual equivalents remain available. */ }
  }
  private loadAudio(ctx: AudioContext, name: 'stamp' | 'door' | 'ambient', path: string) {
    if (this.buffers[name] || this.loading.has(name) || this.failed.has(name)) return;
    this.loading.add(name);
    void fetch(assetUrl(path))
      .then(response => { if (!response.ok) throw new Error('Sound unavailable'); return response.arrayBuffer(); })
      .then(bytes => ctx.decodeAudioData(bytes))
      .then(buffer => { this.buffers[name] = buffer; if (name === 'ambient') this.startAmbient(); })
      .catch(() => { this.failed.add(name); })
      .finally(() => { this.loading.delete(name); });
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
  private syncPlayback() {
    const ctx = this.context;
    if (!ctx) return;
    if (this.paused || this.hidden) {
      void ctx.suspend().catch(() => {});
    } else {
      void ctx.resume().then(() => {
        if (this.paused || this.hidden) void ctx.suspend().catch(() => {});
        else this.startAmbient();
      }).catch(() => {});
    }
  }
  setHidden(value: boolean) { this.hidden = value; this.syncPlayback(); }
  pause(value: boolean) {
    this.paused = value;
    if (value) { for (const o of this.voices) { try { o.stop(); } catch {} } this.voices.clear(); }
    this.syncPlayback();
  }
  play(cue: Cue) {
    const ctx = this.context, master = this.master;
    if (!ctx || !master || this.muted || this.paused || this.hidden || ctx.state !== 'running') return;
    if ((cue === 'stamp' || cue === 'door') && this.buffers[cue]) {
      let source: AudioBufferSourceNode | undefined;
      try {
        if (cue === 'door' && this.doorVoice) { try { this.doorVoice.stop(); } catch {} }
        source = ctx.createBufferSource();
        if (cue === 'door') this.doorVoice = source;
        source.buffer = this.buffers[cue]!;
        source.connect(master);
        this.voices.add(source);
        const active = source;
        source.onended = () => { this.voices.delete(active); if (this.doorVoice === active) this.doorVoice = undefined; active.disconnect(); };
        source.start();
        return;
      } catch {
        if (source) { this.voices.delete(source); if (this.doorVoice === source) this.doorVoice = undefined; source.disconnect(); }
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
