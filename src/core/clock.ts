/** One monotonic active-time clock for timers, scenes and transitions. */
export class GameClock {
  paused = false;
  private previous: number | undefined;
  private tasks = new Map<number, { remaining: number; callback: () => void }>();
  private nextId = 1;
  private subscribers = new Set<(dt: number) => void>();
  private frame = 0;
  start() {
    const tick = (now: number) => { this.advance(now); this.frame = requestAnimationFrame(tick); };
    this.frame = requestAnimationFrame(tick);
  }
  stop() { cancelAnimationFrame(this.frame); this.previous = undefined; }
  setPaused(value: boolean) { this.paused = value; this.previous = undefined; }
  advance(now: number) {
    if (this.previous === undefined) { this.previous = now; return; }
    const dt = Math.max(0, now - this.previous); this.previous = now;
    this.step(dt);
  }
  /** Deterministic active-time step, also used by scene verification. */
  step(dt: number) {
    if (this.paused || !Number.isFinite(dt) || dt <= 0) return;
    const due: Array<() => void> = [];
    for (const [id, task] of this.tasks) {
      task.remaining -= dt;
      if (task.remaining <= 0) { this.tasks.delete(id); due.push(task.callback); }
    }
    for (const fn of this.subscribers) fn(dt);
    for (const fn of due) fn();
  }
  after(ms: number, callback: () => void) { const id = this.nextId++; this.tasks.set(id, { remaining: ms, callback }); return id; }
  cancel(id: number) { this.tasks.delete(id); }
  clear() { this.tasks.clear(); }
  subscribe(fn: (dt: number) => void) { this.subscribers.add(fn); return () => this.subscribers.delete(fn); }
}
