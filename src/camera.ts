export type CameraPosition = 'room' | 'desk';

/** Switches only the room presentation; the desk's logical coordinates stay fixed. */
export class Camera {
  position: CameraPosition = 'room';
  private returnFocus: HTMLElement | null = null;
  constructor(private stage: HTMLElement, private cancelGesture: () => void) {
    this.stage.addEventListener('focusin', event => {
      const target = event.target as HTMLElement;
      if (this.stage.querySelector('#objects')?.contains(target)) this.returnFocus = target;
    });
    this.set('room');
  }
  set(position: CameraPosition, restoreFocus = false) {
    if (this.position !== position) {
      this.cancelGesture();
      const active = document.activeElement as HTMLElement | null;
      if (position === 'room' && active && this.stage.querySelector('#objects')?.contains(active)) {
        this.returnFocus = active;
        this.stage.querySelector<HTMLButtonElement>('[data-action="camera-desk"]')?.focus({preventScroll:true});
      } else if (position === 'desk' && restoreFocus && this.returnFocus?.isConnected) {
        const target = this.returnFocus;
        this.returnFocus = null;
        queueMicrotask(() => { if (target.isConnected && target.getClientRects().length && !target.closest('[hidden], [inert]')) target.focus({preventScroll:true}); });
      }
    }
    this.position = position;
    this.stage.dataset.camera = position;
    const objects = this.stage.querySelector<HTMLElement>('#objects');
    if (objects) objects.inert = position === 'room';
    this.stage.querySelectorAll<HTMLButtonElement>('[data-action="camera-desk"], [data-action="camera-room"]').forEach(button => {
      const selected = button.dataset.action === `camera-${position}`;
      button.setAttribute('aria-pressed', String(selected));
    });
  }
}
