import { assetUrl } from './assets';
import atlasMetadata from './engineer-clips.json';

export type EngineerViewerStatus = 'loading' | 'ready' | 'fallback';
export type EngineerAnimation = 'arrive' | 'idle' | 'depart' | 'approve' | 'return';

type Clip = { offset: number; frames: number; duration: number; loop: boolean };
type PackedFrame = { x: number; y: number; width: number; height: number; left: number; top: number };
type Atlas = {
  file: string;
  width: number;
  height: number;
  cellWidth: number;
  cellHeight: number;
  footY?: number;
  packedFrames?: Record<number, PackedFrame>;
  columns: number;
  clips: Record<EngineerAnimation, Clip>;
};
const ATLASES = atlasMetadata as Record<string, Atlas>;

/** Draws the team's registered, transparent renders using active game time only. */
export class EngineerViewer {
  private readonly canvas: HTMLCanvasElement;
  private readonly context: CanvasRenderingContext2D | null;
  private readonly fallback: HTMLElement | SVGElement | null;
  private readonly cache = new Map<string, Promise<HTMLImageElement>>();
  private readonly observer?: ResizeObserver;
  private image?: HTMLImageElement;
  private atlas?: Atlas;
  private serial = 0;
  private disposed = false;
  private visible = true;
  private reduced = false;
  private animation: EngineerAnimation = 'idle';
  private elapsed = 0;
  private renderedFrame = -1;
  private width = 0;
  private height = 0;
  private ratio = 0;

  constructor(private readonly host: HTMLElement, private readonly onStatus?: (state: EngineerViewerStatus) => void) {
    this.fallback = host.querySelector('svg');
    this.canvas = document.createElement('canvas');
    this.canvas.setAttribute('aria-hidden', 'true');
    Object.assign(this.canvas.style, { position: 'absolute', top: '0', pointerEvents: 'none', display: 'none' });
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
    const slug = id.toLowerCase();
    this.image = undefined;
    this.atlas = undefined;
    this.animation = 'idle';
    this.elapsed = 0;
    this.renderedFrame = -1;
    this.showFallback();
    const atlas = Object.hasOwn(ATLASES, slug) ? ATLASES[slug] : undefined;
    if (!this.context || this.disposed || !atlas) { this.report('fallback'); return; }
    this.report('loading');
    try {
      let promise = this.cache.get(slug);
      if (!promise) {
        promise = new Promise<HTMLImageElement>((resolve, reject) => {
          const image = new Image();
          image.onload = async () => {
            try {
              if (image.naturalWidth !== atlas.width || image.naturalHeight !== atlas.height) throw new Error('Invalid character atlas dimensions');
              // Do not start the doorway sequence until decoding has also finished.
              await image.decode();
              resolve(image);
            } catch (error) { reject(error); }
          };
          image.onerror = () => reject(new Error('Character atlas unavailable'));
          image.src = assetUrl(`art/engineers/${atlas.file}`);
        });
        this.cache.set(slug, promise);
        promise.catch(() => { if (this.cache.get(slug) === promise) this.cache.delete(slug); });
      }
      this.cache.delete(slug);
      this.cache.set(slug, promise);
      while (this.cache.size > 2) {
        const oldest = this.cache.keys().next().value;
        if (oldest !== undefined) this.cache.delete(oldest);
      }
      const image = await promise;
      if (this.disposed || serial !== this.serial) return;
      this.image = image;
      this.atlas = atlas;
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

  /** Camera visibility and reduced motion affect drawing, never the active timeline. */
  tick(dtMs: number): void {
    if (this.disposed) return;
    if (Number.isFinite(dtMs) && dtMs > 0) this.elapsed += dtMs;
    this.draw();
  }

  setAnimation(state: EngineerAnimation): void {
    if (this.animation === state) return;
    this.animation = state;
    this.elapsed = 0;
    this.renderedFrame = -1;
    this.draw(true);
  }

  setReducedMotion(reduced: boolean): void {
    if (this.reduced === reduced) return;
    this.reduced = reduced;
    this.renderedFrame = -1;
    this.draw(true);
  }

  setVisible(visible: boolean): void {
    if (this.visible === visible) return;
    this.visible = visible;
    this.canvas.style.display = visible && this.image ? 'block' : 'none';
    if (this.fallback) this.fallback.style.visibility = this.image || !visible ? 'hidden' : '';
    if (visible) this.draw(true);
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    ++this.serial;
    this.observer?.disconnect();
    this.cache.clear();
    this.image = undefined;
    this.atlas = undefined;
    this.canvas.remove();
    if (this.fallback) this.fallback.style.visibility = '';
  }

  private report(state: EngineerViewerStatus): void { this.onStatus?.(state); }

  private showFallback(): void {
    this.canvas.style.display = 'none';
    if (this.fallback) this.fallback.style.visibility = this.visible ? '' : 'hidden';
  }

  private draw(force = false): void {
    if (!this.visible || !this.image || !this.atlas || !this.context || this.disposed) return;
    const hostWidth = this.host.clientWidth, height = this.host.clientHeight;
    if (hostWidth <= 0 || height <= 0) return;
    // The host ends at the registered floor pivot. Extra source padding below
    // that pivot preserves authored foot motion without changing person scale.
    const renderHeight = height * this.atlas.cellHeight / (this.atlas.footY ?? this.atlas.cellHeight);
    const width = Math.max(hostWidth, renderHeight * this.atlas.cellWidth / this.atlas.cellHeight);
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    this.canvas.style.left = `${(hostWidth - width) / 2}px`;
    if (width !== this.width || renderHeight !== this.height || ratio !== this.ratio) {
      this.width = width; this.height = renderHeight; this.ratio = ratio;
      this.canvas.width = Math.round(width * ratio);
      this.canvas.height = Math.round(renderHeight * ratio);
      this.canvas.style.width = `${width}px`;
      this.canvas.style.height = `${renderHeight}px`;
      force = true;
    }
    const isReaction = this.animation === 'approve' || this.animation === 'return';
    const displayedAnimation = this.reduced && !isReaction ? 'idle' : this.animation;
    const clip = this.atlas.clips[displayedAnimation];
    // A single authored reaction pose acknowledges the stamp without playing motion.
    const progress = this.reduced ? (isReaction ? 0.6 : 0) : clip.loop ? (this.elapsed % clip.duration) / clip.duration : Math.min(this.elapsed / clip.duration, 1);
    const frame = clip.offset + Math.min(clip.frames - 1, Math.floor(progress * clip.frames));
    if (!force && frame === this.renderedFrame) return;
    this.renderedFrame = frame;
    this.host.dataset.engineerAnimation = displayedAnimation;
    this.host.dataset.engineerFrame = String(frame);
    const context = this.context;
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
    context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const drawHeight = this.canvas.height;
    const drawWidth = drawHeight * this.atlas.cellWidth / this.atlas.cellHeight;
    const packed = this.atlas.packedFrames?.[frame];
    if (packed) {
      // Packing removes transparent storage only; left/top restore the original
      // virtual cell and foot pivot at exactly the same display scale.
      const scale = drawHeight / this.atlas.cellHeight;
      context.drawImage(this.image, packed.x, packed.y, packed.width, packed.height,
        (this.canvas.width - drawWidth) / 2 + packed.left * scale,
        packed.top * scale, packed.width * scale, packed.height * scale);
    } else {
      context.drawImage(this.image,
        (frame % this.atlas.columns) * this.atlas.cellWidth,
        Math.floor(frame / this.atlas.columns) * this.atlas.cellHeight,
        this.atlas.cellWidth, this.atlas.cellHeight,
        (this.canvas.width - drawWidth) / 2, 0, drawWidth, drawHeight);
    }
  }
}
