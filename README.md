# Space Papers

A work-in-progress lunar operations game for children ages 7–12. Review expedition papers, compare them with a manual, and stamp a decision. The supplied Blender room is rendered as a layered 2.5D scene with room and desk views. The current engineers are temporary; final integration is planned.


## Jugar sin instalar herramientas

1. Descarga el repositorio con **Code → Download ZIP** y descomprímelo.
2. Abre **Space-Papers.html** con doble clic en Chrome, Edge o Safari actualizado.
3. Selecciona **Begin shift** o **Training**. Usa una pantalla de computadora, preferiblemente de al menos 1280 × 720.

El archivo funciona sin Node.js, pnpm ni servidor. Es una versión generada del juego en este repositorio; la campaña no se guarda al cerrar. Los enlaces externos de las fuentes científicas requieren internet.

Para regenerar el archivo después de modificar el juego: ejecuta `pnpm install --frozen-lockfile`, `pnpm build` y `node scripts/build-portable.mjs`; luego comprueba que `Space-Papers.html` abre mediante doble clic y confirma el archivo actualizado junto al código.

## Run locally

Install Node.js 24 and pnpm 11.25.0, then:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open the local address printed by Vite (normally http://127.0.0.1:4173/). Campaigns reset on reload; preferences are stored locally. `pnpm preview` serves a production build after `pnpm build`.

## Verify

```sh
pnpm test
pnpm build
pnpm exec playwright install chromium
```

Start `pnpm dev` in another terminal, then run:

```sh
pnpm test:browser
pnpm test:desk
pnpm test:camera
pnpm test:training
```

Browser suites use development-only fixtures and default to port 4173. Set `PREVIEW_URL` for another development URL. Screenshots are written to ignored `test-results/`.

## Controls

Drag sheets, manual and stamps. Select a stamp then click a sheet; keyboard focus and Enter also work. `B` opens the manual, `I` inventory, `R` the turn record, and `1`–`3` recover covered sheets. Use Tab, Enter and arrows to move objects, Escape to pause and F for full screen. Options include reduced motion and two-click placement. Camera buttons switch room and desk views.

## Handoff and sources

[Engineering handoff](HANDOFF_COPILOT.md) records current rules, architecture and planned work. [NASA reference metadata](public/science.json) archives sources and their limits. Resource costs and probabilities are fictional game balance, not NASA predictions. The game has no runtime network dependency. Scene art was supplied by the team; other graphics and synthesized sound are provisional. Human usability testing and final asset/license verification remain pending. Code and documentation were assisted by OpenAI Codex.

Original Blender source files remain in the team’s shared drive; commit only optimized runtime assets directly to Git. Git LFS is not needed for the current repository.
