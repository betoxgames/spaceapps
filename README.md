# Space Papers

A work-in-progress lunar operations game for children ages 7–12. Review expedition papers, compare them with a manual, and stamp a decision. The supplied Blender room is rendered as a layered 2.5D scene with room and desk views. Nine engineers use the team’s supplied idle, speech and stamp-reaction PNG sequences, plus a continuous walk re-rendered from their original rig.

## Play

Pull the latest repository changes, then open `index.html` directly in a browser. The game is contained in this one file and needs no installation, server, account or network connection. Campaigns reset on reload; preferences are stored locally.

## Develop

For source changes, install Node.js 24 and pnpm 11.25.0:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open the local address printed by Vite (normally http://127.0.0.1:4173/). `dev.html` is the source entry. The tracked root `index.html` is generated: do not edit it by hand. Run `pnpm build` after changes to regenerate it and `dist/index.html` using `scripts/build-offline.mjs`.

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
pnpm test:characters
pnpm test:visitors
pnpm test:ux
pnpm test:accessibility
pnpm test:offline # after pnpm build
```

Browser suites use development-only fixtures and default to port 4173. Set `PREVIEW_URL` for another development URL. Screenshots are written to ignored `test-results/`.

The [15 November UX review](docs/UX_REVIEW_2026-11-15.md) records the interface findings, verification coverage and remaining human-usability checks. Menus and dialogs adapt to compact screens; the physical desk preserves readable paper sizes through scrolling. A desktop or landscape tablet is recommended for comparing several documents at once.

## Controls

Drag sheets, manual and stamps. Select a stamp then click a sheet; keyboard focus and Enter also work. `B` opens the manual, `I` inventory, `R` the turn record, and `1`–`3` recover covered sheets. Use Tab, Enter and arrows to move objects, Escape to pause and F for full screen. Options include reduced motion and two-click placement. Camera buttons switch room and desk views.

## Handoff and sources

[Engineering handoff](HANDOFF_COPILOT.md) records current rules, architecture and planned work. [NASA reference metadata](public/science.json) archives sources and their limits. Resource costs and probabilities are fictional game balance, not NASA predictions. The game has no runtime network dependency. Scene art and engineer artwork were supplied by the team; synthesized sound is provisional. The updated room and font, and the planet monitor, are deferred. See [sound priorities](SOUND_EFFECTS.md). Human usability testing and final asset/license verification remain pending. Code and documentation were assisted by OpenAI Codex.

The render inventory, timing assumptions, visual dependencies and reproducible import steps are in [engineer integration](docs/ENGINEER_RENDERS_2026-11-14.md).

Original Blender source files remain in the team’s shared drive; commit only optimized runtime assets directly to Git. Git LFS is not needed for the current repository.
