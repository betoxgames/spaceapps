# Lunar station renders

Original artwork supplied in Google Drive: **Space Papers / Arte / stacion espacial**.
The four 1920 × 1080 renders share the same camera and differ in illumination.
They retain their original framing and are encoded as WebP (quality 90).
`manifest.json` records Drive IDs, modification dates and source/output hashes.

Scope: every emergency, E01–E08, and all three operations, B01–B03. The render appears in dispatch, cinema projections and reports; B01 uses the station render in place of its former vector scene.

For emergencies, incoming alerts use red lights, except E08 which starts with lights off. Intervention uses amber; after the result is revealed, recovery uses white and failure uses lights off. For operations, the initial scene is white, intervention uses amber, and the revealed outcome is white on success or off on failure.

To rebuild, place the unmodified `lucesBlancas.png`, `lucesRojas.png`,
`lucesAmarillas.png` and `lucesApagadas.png` files in
`asset-sources/lunar-station/`, then run `node scripts/update-lunar-station.mjs`.
The PNG sources stay local; the optimized exports ship with the offline game.
