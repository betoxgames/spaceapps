# Space Papers scene assets

These WebP files are compressed copies of the team's PNG Blender renders from the shared **Principal** Drive folder. Every image uses the same 1920 × 1080 canvas, so preserve the entire canvas when layering them. Each layer contains transparency.

## Layering

1. `scene-base.webp`: room and floor, with a transparent doorway on the left.
2. `door-0032.webp`: left doorway in the position shown by the supplied combined reference.
3. `desk.webp`: foreground tabletop and pedestal.

`combined-reference.webp` is a compressed copy of the team's composite render for visual comparison. Layering the three images above recreates its composition. Use the same `object-fit` and position on all layers; independent cropping will break their alignment. The canvas has useful visual targets: doorway at x 0–884, desk at x 263–1697 and y 720–1079, monitor at roughly x 1130–1725 and y 260–555.

## Door motion

`door-0001.webp`, `door-0008.webp`, `door-0016.webp`, `door-0024.webp`, and `door-0032.webp` are five sampled poses from the 32-frame Blender render. All are full-canvas transparent overlays. Switch a single door layer's image source between these files to show motion. `door-0001.webp` is the more closed pose; `door-0032.webp` is the open pose used in the combined reference. A reduced-motion mode can use the final static pose.

## Provenance

| Local file | Original | Drive ID |
| --- | --- | --- |
| `combined-reference.webp` | `Principal/EscenarioFinalCompleto.png` | `1pDVEpJT1YPYNC1K09wtf6nsoUqu9rtg8` |
| `scene-base.webp` | `Principal/Escenario/EscenarioFinal.png` | `1xKYoHYxRwfZlNIR9yEecu5izHVjL6O7u` |
| `desk.webp` | `Principal/Esctritorio/Escritorio.png` | `1iDfzVvmkRlyIh10EIsE-fkwhCQfAIU5l` |
| `door-0001.webp` | `Principal/Puerta/0001.png` | `1MGWa1nRzbg3JfuHfyaeJpLh-dUYo5Ru_` |
| `door-0008.webp` | `Principal/Puerta/0008.png` | `1N4ex8t5dCK_wA1FeZzZ8wDmSGfeJjXzE` |
| `door-0016.webp` | `Principal/Puerta/0016.png` | `1Bj86ED9izAyhtj-GiXNbnPOKX1mjPEVd` |
| `door-0024.webp` | `Principal/Puerta/0024.png` | `1g1vaJnZnuWFGJq8LJq5BRekP1t0tbGCB` |
| `door-0032.webp` | `Principal/Puerta/0032.png` | `1R_aOxtA4Ru-CMwD7Te4QBYkbA3eb6kC2` |

The source Blender file is `Principal/Completp.blend` (Drive ID `1uVmM2TVs2fSxydHLeVM1ueOaF4OvUgy7`). Blender is unavailable in this workspace, so the supplied renders are used directly. These are user-provided assets; ownership and licensing are not separately verified here.
