export interface MoonMenuScene {
  setReducedMotion(reduced: boolean): void;
  setPaused(paused: boolean): void;
  replayLights(): void;
  reset(): void;
  depart(): void;
  dispose(): void;
}
export function mountMenuMoon(root: HTMLElement, reduced: boolean): MoonMenuScene;
