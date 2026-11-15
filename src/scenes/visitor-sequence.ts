import { assetUrl } from '../core/assets';
import type { EngineerViewer, EngineerAnimation } from '../characters/engineer-viewer';

export type VisitorPhase = 'loading' | 'opening' | 'entering' | 'closing' | 'walking' | 'settling' | 'ready'
  | 'reacting' | 'approved' | 'leaving' | 'exit-opening' | 'exiting' | 'exit-closing' | 'hidden';

export const VISITOR_DURATIONS = {
  opening: 640, entering: 2000, closing: 640, walking: 600, settling: 160,
  reacting: 1500, leaving: 1100, 'exit-opening': 640, exiting: 2000, 'exit-closing': 640,
} as const;

interface Position { x: number; y: number; scale: number }
// Coordinates refer to the common 1600 × 900 room canvas. Each position is the
// centre between the planted feet, not the top-left corner of the image.
const THRESHOLD: Position = { x: 245, y: 650, scale: .85 };
const CLEAR: Position = { x: 630, y: 680, scale: .95 };
const DESK: Position = { x: 800, y: 740, scale: 1 };
const DOOR_POSES = ['0001', '0008', '0016', '0024', '0032'] as const;
type DoorPose = typeof DOOR_POSES[number];
const NEXT: Partial<Record<VisitorPhase, VisitorPhase>> = {
  opening: 'entering', entering: 'closing', closing: 'walking', walking: 'settling', settling: 'ready',
  reacting: 'leaving', leaving: 'exit-opening', 'exit-opening': 'exiting', exiting: 'exit-closing', 'exit-closing': 'hidden',
};

export interface VisitorSnapshot extends Position {
  phase: VisitorPhase;
  elapsed: number;
  door: DoorPose;
  animation: EngineerAnimation;
  visible: boolean;
}

/** A scene sequence driven exclusively by the caller's active game clock. */
export class VisitorSequence {
  private phase: VisitorPhase = 'hidden';
  private elapsed = 0;
  private generation = 0;
  private reduced = false;
  private position = { ...THRESHOLD };
  private doorPose: DoorPose = '0001';
  private animation: EngineerAnimation = 'idle';
  private visible = false;
  private reaction: 'approve' | 'return' = 'approve';
  private completion?: () => void;
  private queuedReaction?: { stamp: 'approve' | 'return'; done: () => void };
  private doorLoading?: Promise<void>;
  private readonly availableDoors = new Set<DoorPose>();

  constructor(
    private readonly host: HTMLElement,
    private readonly door: HTMLElement,
    private readonly viewer: EngineerViewer,
    private readonly onReady?: () => void,
    private readonly onDoorMove?: () => void,
  ) { this.render(); }

  /** Resolves when local assets have loaded and opening can begin. */
  async show(id: string): Promise<void> {
    this.reset();
    const generation = this.generation;
    this.host.dataset.engineer = id;
    this.enter('loading');
    await Promise.all([this.viewer.show(id), this.preloadDoors()]);
    if (generation !== this.generation) return;
    this.enter('opening');
  }

  /** Returns unused active time after celebration or exit, for the following scene. */
  tick(dt: number): number {
    if (!Number.isFinite(dt) || dt <= 0) return 0;
    if (this.phase === 'loading' || this.phase === 'hidden' || this.phase === 'approved') return dt;
    let remaining = dt;
    const generation = this.generation;
    // Split large frames at every boundary. Door, feet and clip never disagree
    // because a delayed frame cannot run independent timer callbacks out of order.
    while (remaining > 0 && generation === this.generation) {
      const duration = VISITOR_DURATIONS[this.phase as keyof typeof VISITOR_DURATIONS];
      const step = duration === undefined ? remaining : Math.min(remaining, duration - this.elapsed);
      this.elapsed += step;
      this.viewer.tick(step);
      remaining -= step;
      this.render();
      if (duration === undefined || this.elapsed < duration) break;
      const next = this.phase === 'reacting' && this.reaction === 'approve' ? 'approved' : NEXT[this.phase];
      if (!next) break;
      this.enter(next);
      if (next === 'ready') {
        this.onReady?.();
        if (generation !== this.generation) break;
        const queued = this.queuedReaction;
        if (queued) { this.queuedReaction = undefined; this.react(queued.stamp, queued.done); }
      } else if (next === 'hidden' || next === 'approved') {
        const done = this.completion;
        this.completion = undefined;
        done?.();
        break;
      }
    }
    return remaining;
  }

  /** Acknowledges the stamp alone; mission outcomes are deliberately unavailable. */
  react(stamp: 'approve' | 'return', done: () => void): void {
    if (this.phase === 'hidden') { done(); return; }
    if (this.phase !== 'ready') {
      if (['loading', 'opening', 'entering', 'closing', 'walking', 'settling'].includes(this.phase)) {
        this.queuedReaction = { stamp, done };
      }
      return;
    }
    this.reaction = stamp;
    this.completion = done;
    this.enter('reacting');
  }

  reset(): void {
    this.generation++;
    this.completion = undefined;
    this.queuedReaction = undefined;
    this.enter('hidden');
  }

  setReducedMotion(reduced: boolean): void {
    this.reduced = reduced;
    this.viewer.setReducedMotion(reduced);
    this.render();
  }

  snapshot(): VisitorSnapshot {
    return { phase: this.phase, elapsed: this.elapsed, ...this.position, door: this.doorPose,
      animation: this.animation, visible: this.visible };
  }

  private enter(phase: VisitorPhase): void {
    this.phase = phase;
    this.elapsed = 0;
    if (['opening', 'closing', 'exit-opening', 'exit-closing'].includes(phase)) this.onDoorMove?.();
    const animation: EngineerAnimation = phase === 'approved' ? 'approve' : phase === 'reacting' ? this.reaction
      : ['entering', 'closing', 'walking', 'settling', 'leaving', 'exiting'].includes(phase) ? 'depart' : 'idle';
    this.animation = animation;
    this.viewer.setAnimation(animation);
    this.render();
  }

  private render(): void {
    const phase = this.phase;
    const duration = VISITOR_DURATIONS[phase as keyof typeof VISITOR_DURATIONS] ?? 1;
    const progress = Math.min(1, this.elapsed / duration);
    // Reduced motion retains the same causal phases and timing, with discrete
    // stationary poses instead of camera-independent sliding or animated walking.
    const movement = this.reduced ? (progress < .5 ? 0 : 1) : progress;
    const between = (from: Position, to: Position): Position => ({
      x: from.x + (to.x - from.x) * movement,
      y: from.y + (to.y - from.y) * movement,
      scale: from.scale + (to.scale - from.scale) * movement,
    });
    if (['entering', 'closing', 'walking', 'settling'].includes(phase)) {
      // Door closure is an overlapping action, not a reason to stop walking.
      // A single curve gives every phase boundary the same position and velocity,
      // then eases the approach naturally to rest at the desk.
      const offsets = { entering: 0, closing: VISITOR_DURATIONS.entering,
        walking: VISITOR_DURATIONS.entering + VISITOR_DURATIONS.closing,
        settling: VISITOR_DURATIONS.entering + VISITOR_DURATIONS.closing + VISITOR_DURATIONS.walking };
      const total = VISITOR_DURATIONS.entering + VISITOR_DURATIONS.closing + VISITOR_DURATIONS.walking + VISITOR_DURATIONS.settling;
      const t = (offsets[phase as keyof typeof offsets] + movement * duration) / total;
      const u = 1 - t;
      const curve = (start:number, control1:number, end:number) => u*u*u*start + 3*u*u*t*control1 + 3*u*t*t*end + t*t*t*end;
      this.position = { x: curve(THRESHOLD.x, 535, DESK.x), y: curve(THRESHOLD.y, 656, DESK.y), scale: curve(THRESHOLD.scale, .9, DESK.scale) };
    } else {
      this.position = phase === 'leaving' ? between(DESK, CLEAR)
        : phase === 'exiting' ? between(CLEAR, THRESHOLD)
        : ['ready', 'reacting', 'approved'].includes(phase) ? { ...DESK }
        : phase === 'exit-opening' ? { ...CLEAR } : { ...THRESHOLD };
    }
    this.visible = !['hidden', 'loading', 'opening', 'exit-closing'].includes(phase);
    // The supplied open leaf obscures the apparent opening. Present the visitor
    // in front of it once fully open, as the agreed temporary staging; the desk
    // still occludes the person. This does not repair the incomplete door model.
    Object.assign(this.host.style, {
      left: `${this.position.x}px`, top: `${this.position.y}px`,
      transform: `translate(-50%, -100%) scale(${this.position.scale}) scaleX(${['leaving', 'exit-opening', 'exiting', 'exit-closing'].includes(phase) ? -1 : 1})`,
      transformOrigin: '50% 100%', zIndex: '4',
      visibility: this.visible ? 'visible' : 'hidden',
    });
    this.host.dataset.visitorPhase = phase;
    this.host.dataset.visitorVisible = String(this.visible);
    this.viewer.setVisible(this.visible);
    let pose: DoorPose = '0032';
    if (phase === 'opening' || phase === 'exit-opening') {
      pose = this.reduced ? '0016' : progress < 1 / 3 ? '0001' : progress < 2 / 3 ? '0008' : '0016';
    } else if (phase === 'closing' || phase === 'exit-closing') {
      pose = this.reduced ? '0032' : progress < 1 / 3 ? '0016' : progress < 2 / 3 ? '0024' : '0032';
    } else if (phase === 'entering' || phase === 'exiting') pose = '0016';
    else if (phase === 'loading' || phase === 'hidden') pose = '0001';
    this.setDoor(pose);
  }

  private setDoor(pose: DoorPose): void {
    // The supplied render is a complete cycle: 0001 closed, 0016 open,
    // 0032 closed again. Missing poses fall back to an actually decoded image.
    if (this.availableDoors.size && !this.availableDoors.has(pose)) {
      pose = [...this.availableDoors].sort((a, b) => Math.abs(Number(a) - Number(pose)) - Math.abs(Number(b) - Number(pose)))[0];
    }
    if (this.doorPose === pose && this.door.style.getPropertyValue('--door-frame')) return;
    this.doorPose = pose;
    this.door.dataset.doorPose = pose;
    this.door.style.setProperty('--door-frame', `url("${assetUrl(`assets/images/scene/door-${pose}.webp`)}")`);
  }

  private preloadDoors(): Promise<void> {
    if (!this.doorLoading) {
      this.doorLoading = Promise.all(DOOR_POSES.map(pose => new Promise<void>(resolve => {
        const image = new Image();
        image.onload = async () => {
          try {
            if (image.naturalWidth !== 1920 || image.naturalHeight !== 1080) throw new Error('Invalid door canvas');
            if (image.decode) await image.decode();
            this.availableDoors.add(pose);
          } catch { /* Keep gameplay usable with the remaining local poses. */ }
          resolve();
        };
        image.onerror = () => resolve();
        image.src = assetUrl(`assets/images/scene/door-${pose}.webp`);
      }))).then(() => {
        this.door.dataset.assetState = this.availableDoors.size === DOOR_POSES.length ? 'ready' : 'fallback';
      });
    }
    return this.doorLoading;
  }
}
