import { assetUrl } from './assets';
export type EngineerViewerStatus = 'loading' | 'ready' | 'fallback';
export type EngineerAnimation = 'arrive' | 'idle' | 'depart';

const FRAME_SIZE = 256;
const COLUMNS = 8;
// The source actions were sampled uniformly from their original 24 fps timelines.
// The walk is compressed to fit the room’s short departure transition.
const CLIPS: Record<EngineerAnimation, { row: number; duration: number; loop: boolean }> = {
  idle: { row: 0, duration: 1167, loop: true },
  arrive: { row: 2, duration: 917, loop: false },
  depart: { row: 1, duration: 700, loop: true },
};

/** Renders the original artists' animated characters on the game's active clock. */
export class EngineerViewer {
  private readonly canvas: HTMLCanvasElement;
  private readonly context: CanvasRenderingContext2D | null;
  private readonly fallback: HTMLElement | SVGElement | null;
  private readonly cache = new Map<string, Promise<HTMLImageElement>>();
  private readonly observer?: ResizeObserver;
  private image?: HTMLImageElement;
  private serial = 0;
  private disposed = false;
  private visible = true;
  private reduced = false;
  private animation: EngineerAnimation = 'idle';
  private requestedAnimation: EngineerAnimation = 'idle';
  private elapsed = 0;
  private renderedFrame = -1;
  private width = 0;
  private height = 0;

  constructor(private readonly host: HTMLElement, private readonly onStatus?: (state: EngineerViewerStatus) => void) {
    this.fallback = host.querySelector('svg');
    this.canvas = document.createElement('canvas');
    this.canvas.setAttribute('aria-hidden', 'true');
    Object.assign(this.canvas.style, { position: 'absolute', inset: '0', width: '100%', height: '100%', pointerEvents: 'none', display: 'none' });
    this.host.appendChild(this.canvas);
    this.context = this.canvas.getContext('2d');
    if (typeof ResizeObserver !== 'undefined') {
      this.observer = new ResizeObserver(() => this.draw(true));
      this.observer.observe(host);
    }
    if (!this.context) this.report('fallback');
  }

  async show(id: string): Promise<void> {
    const serial = ++this.serial;
    this.image = undefined;
    this.requestedAnimation = 'arrive';
    this.showFallback();
    const slug = id.toLowerCase();
    if (!this.context || this.disposed || !/^[a-z0-9_-]+$/.test(slug)) { this.report('fallback'); return; }
    this.report('loading');
    try {
      let promise = this.cache.get(slug);
      if (!promise) {
        promise = new Promise<HTMLImageElement>((resolve, reject) => {
          const image = new Image();
          image.onload = () => image.naturalWidth === FRAME_SIZE * COLUMNS && image.naturalHeight === FRAME_SIZE * 3
            ? resolve(image) : reject(new Error('Invalid character atlas'));
          image.onerror = () => reject(new Error('Character atlas unavailable'));
          image.src = assetUrl(`art/engineers/${slug}.webp`);
        });
        this.cache.set(slug, promise);
        promise.catch(() => { if (this.cache.get(slug) === promise) this.cache.delete(slug); });
      }
      const image = await promise;
      if (this.disposed || serial !== this.serial) return;
      this.image = image;
      this.animation = this.reduced ? 'idle' : this.requestedAnimation;
      this.elapsed = 0;
      this.renderedFrame = -1;
      if (this.fallback) this.fallback.style.visibility = 'hidden';
      this.canvas.style.display = this.visible ? 'block' : 'none';
      this.draw(true);
      this.report('ready');
    } catch {
      if (serial !== this.serial || this.disposed) return;
      this.showFallback();
      this.report('fallback');
    }
  }

  /** The caller supplies active game time; there is no independent animation loop. */
  tick(dtMs: number): void {
    if (!this.visible || this.disposed || !this.image || this.reduced) return;
    if (Number.isFinite(dtMs) && dtMs > 0) this.elapsed += dtMs;
    const clip = CLIPS[this.animation];
    if (!clip.loop && this.elapsed >= clip.duration) {
      this.animation = 'idle';
      this.requestedAnimation = 'idle';
      this.elapsed = 0;
      this.renderedFrame = -1;
    }
    this.draw();
  }

  setAnimation(state: EngineerAnimation): void {
    this.requestedAnimation = state;
    this.animation = this.reduced ? 'idle' : state;
    this.elapsed = 0;
    this.renderedFrame = -1;
    this.draw(true);
  }

  setReducedMotion(reduced: boolean): void {
    this.reduced = reduced;
    this.animation = reduced ? 'idle' : this.requestedAnimation;
    this.elapsed = 0;
    this.renderedFrame = -1;
    this.draw(true);
  }

  setVisible(visible: boolean): void {
    if (this.visible === visible) return;
    this.visible = visible;
    this.canvas.style.display = visible && this.image ? 'block' : 'none';
    if (visible) this.draw(true);
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    ++this.serial;
    this.observer?.disconnect();
    this.cache.clear();
    this.image = undefined;
    this.canvas.remove();
    if (this.fallback) this.fallback.style.visibility = '';
  }

  private report(state: EngineerViewerStatus): void { this.onStatus?.(state); }

  private showFallback(): void {
    this.canvas.style.display = 'none';
    if (this.fallback) this.fallback.style.visibility = '';
  }

  private draw(force = false): void {
    if (!this.visible || !this.image || !this.context || this.disposed) return;
    const width = this.host.clientWidth, height = this.host.clientHeight;
    if (width <= 0 || height <= 0) return;
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    if (width !== this.width || height !== this.height) {
      this.width = width; this.height = height;
      this.canvas.width = Math.round(width * ratio);
      this.canvas.height = Math.round(height * ratio);
      force = true;
    }
    const clip = CLIPS[this.animation];
    const progress = clip.loop ? (this.elapsed % clip.duration) / clip.duration : Math.min(this.elapsed / clip.duration, 0.9999);
    const frame = Math.min(COLUMNS - 1, Math.floor(progress * COLUMNS));
    if (!force && frame === this.renderedFrame) return;
    this.renderedFrame = frame;
    const context = this.context;
    context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // Preserve the square source and anchor its feet at the floor of the host.
    // The shared source camera leaves at least 27 transparent pixels under the feet.
    const side = this.canvas.height;
    context.drawImage(this.image, frame * FRAME_SIZE, clip.row * FRAME_SIZE, FRAME_SIZE, FRAME_SIZE,
      (this.canvas.width - side) / 2, this.canvas.height - side + side * 27 / FRAME_SIZE, side, side);
  }
}
