# Space Papers scene assets

The scene uses the team's Blender PNGs from [Escenario principal on Drive](https://drive.google.com/drive/folders/1JuziOtiKwVmEtsiEWtuEM44Av8ZNCX4V). Runtime WebP layers retain a transparent 1920 × 1080 canvas, displayed on the common 1600 × 900 game canvas.

## Layering and registration

1. `door-0001.webp` through `door-0032.webp`: animated door behind the wall.
2. `scene-base.webp`: room and floor; its transparent aperture masks the door's header and jambs.
3. The visitor emerges at foot position (310, 610) in game coordinates, in front of the doorway.
4. `desk.webp`: foreground tabletop and pedestal, occluding the visitor's legs.

All layers and the visitor share the room camera. Preserve each full canvas: independent cropping or CSS scaling breaks registration. `scripts/update-scene.mjs` applies the same affine mapping `[.78, 0, -.08, .806, 184, 93]` to every original door PNG to register its trapezoid with the wall aperture. This is a compositing adjustment; the supplied Blender geometry is unchanged. The previous top-only cut at y=160 is no longer needed.

`combined-reference.webp` preserves the older team composite for historical comparison; it is not the registration reference for the current wall and door exports.

## Door motion

All 32 original frames are retained. `0001` is closed, `0016` is open, and `0032` is closed again. Opening plays frames 1–16 over 640 ms, holds frame 16 throughout crossing, then closing plays frames 17–32 over 640 ms. The same cycle runs during departure. Assets are decoded before opening; pause freezes both the door and visitor. Reduced motion uses stationary open/closed poses with the same logical timing.

## Provenance and rebuilding

The complete door source IDs and modification times are in `scripts/door-sources.json`; `manifest.json` records original PNG hashes, bytes, the registration matrix and cycle metadata. Sources are the numbered PNGs in [Puerta on Drive](https://drive.google.com/drive/folders/1JHvyyZUXpQs9XLnJr9HPmqhPC_eAbGgG).

| Local file | Drive ID |
| --- | --- |
| `scene-base.webp` | `1xKYoHYxRwfZlNIR9yEecu5izHVjL6O7u` |
| `desk.webp` | `1iDfzVvmkRlyIh10EIsE-fkwhCQfAIU5l` |
| `combined-reference.webp` | `1pDVEpJT1YPYNC1K09wtf6nsoUqu9rtg8` |

Place the original `0001.png`–`0032.png` and `wall-final.png` in ignored `asset-sources/scene/`, then run `node scripts/update-scene.mjs` and `pnpm build`. No new artwork is generated. The source Blender file is `Escenario principal.blend`, Drive ID `1uVmM2TVs2fSxydHLeVM1ueOaF4OvUgy7`.
