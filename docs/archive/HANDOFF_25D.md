# Space Papers 2.5D handoff — 2026-11-14

## Intent and current shape

The user asked SOL and Terra to redesign Space Papers directly, using their Blender room assets. The requested presentation has two camera positions: a whole-room view and a close desk view. The mood should be warm, friendly science fiction. The root agent coordinates user communication; implementation agents should not contact the user directly. The visual direction is recorded in [`ART_DIRECTION_25D.md`](../design/ART_DIRECTION_25D.md).

The runtime scene is layered from the team's original renders: room, door, desk. Five sampled door poses permit a real opening transition. Source and Drive IDs are documented in [`public/art/scene/README.md`](../../public/art/scene/README.md). The WebP images are 1920 × 1080 and share exact registration. The door overlays are transparent outside the model, and the desk is transparent outside the tabletop and pedestal. The room has a transparent doorway. Correct layer order is room → door → desk. Browser paths are `/art/scene/scene-base.webp`, `/art/scene/door-0001.webp` through `door-0032.webp` (sampled poses 0001, 0008, 0016, 0024, 0032), and `/art/scene/desk.webp`.

The original combined PNG remains at `/Users/beto/Downloads/EscenarioFinalCompleto.png` and in the supplied Drive folder `Principal` (`1JuziOtiKwVmEtsiEWtuEM44Av8ZNCX4V`). The Blender file is `Completp.blend` (Drive ID `1uVmM2TVs2fSxydHLeVM1ueOaF4OvUgy7`), but Blender is not installed in this workspace. The WebPs are compressed from the user's PNG renders; they are not newly generated imagery. Asset ownership or licensing was not independently verified. Redundant public PNG copies were removed. All runtime scene assets together are about 240 KB.

## Verification completed

- TypeScript check and Vite production build passed.
- Ten existing domain and clock tests passed.
- Browser emergency-flow test passed: five incident worksheets, accounting, pause behavior, recovery, cleanup, 1280 × 720 fit, and no page errors.
- Desk browser interaction test passed: drag, placement, stamp, and keyboard interaction.
- WebP composite quality against the original combined PNG: mean absolute channel difference 0.81/255 and PSNR 39.1 dB. Visual inspection found room lighting and grain retained.
- Whole-room and desk screenshots were inspected at 1600 × 900 and 1280 × 720. The room geometry registers correctly, the monitor status is legible, and the desk view retains usable controls.

The existing user preview is on `http://127.0.0.1:4173/` and should remain available. A separate development server was started on `http://127.0.0.1:4200/` for isolated browser tests. Production preview tests cannot use the existing browser scripts because their fixtures and direct `src/desk.ts` import require a development server. The scripts passed against 4200.

## Remaining work and visible limitations

- The engineer silhouettes are still flat placeholder art. Replace or restyle them to fit the supplied 3D room if additional character assets become available.
- In desk view, the “INCOMING DOCUMENTS” header is partly covered by paper cards. The “YOUR DESK. YOUR DECISION.” caption is faint. These are small visual polish items; the papers and controls remained usable at both inspected sizes.
- Human usability review is still needed for whether the two camera positions, arriving visitors, paper tray, and desk controls feel intuitive over a full shift.
- Confirm final eligibility and attribution for the team's Blender renders before any external publication.

## Resume point

Review the live preview and [`ART_DIRECTION_25D.md`](../design/ART_DIRECTION_25D.md), then address the listed polish and replace the remaining placeholder engineer figures when approved assets exist. Preserve the original asset registration and camera behavior when editing the scene.
