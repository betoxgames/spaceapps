# Space Papers — engineering handoff

Phase 1 baseline was published in commits `124e233` and `ccabe9d`; Phase 2 integrates all nine delivered engineers. The current priority is a self-contained offline build that players open directly after pulling the repository. Updated room artwork/font and the planet monitor are deferred, not complete. Preserve gameplay and accounting while improving presentation. Repository: https://github.com/betoxgames/spaceapps, branch `main`. Store original Blender sources in the team’s shared drive and commit only optimized runtime assets directly to Git; Git LFS is not needed for the current repository.

## Product and architecture

A lunar-base document-review game for children aged 7–12: inspect an engineer's proposal, compare its five resources against the manual and inventory, then stamp approve or return. Use clear language, readable controls, accessible focus and keyboard operation, reduced motion and age-appropriate feedback. Never reveal a mission result before its consequence, or future emergency identities/costs. No changes to costs, balances or probabilities without explicit authorization.

The tracked root `index.html` is generated as a single self-contained offline game with embedded runtime assets. Players open it directly after a pull; no server, installation, login, APIs or network are required. Do not edit that file manually: `pnpm build` runs `scripts/build-offline.mjs` and regenerates the root file and `dist/index.html`. `dev.html` is the Vite source entry. Development uses Node 24 and pnpm 11.25.0. Verification of direct file opening must be reported from actual test results.

Vite/TypeScript static application: `src/catalog.ts` is the game data; `src/domain.ts` owns seeded campaign state and transitions; `src/main.ts` coordinates presentation; `src/desk.ts` handles movable desk objects; `src/camera.ts`, `src/art.ts`, `src/audio.ts`, and `src/clock.ts` handle presentation, sound and timing. `public/art/scene/` contains supplied Blender scene renders layered as 2.5D, including sampled door frames; retain registration across room and desk camera positions. Preferences persist locally; campaigns do not survive reload. `public/science.json` archives NASA educational sources and limitations. Runtime must work without network calls; NASA observations are not endorsements or validation of fictional game numbers. See README for setup and verification.

## Rules contract (current implementation)

Five resources in order: food kg, water L, oxygen kg, propellant kg, energy kWh. Internally values are integer thousandths. The four-person crew seeks five distinct successful destinations; Jupiter, Saturn, Uranus and Neptune are orbital. Destination minimums below are in displayed units, ordered as above:

| Destination | Food | Water | Oxygen | Propellant | Energy |
|---|---:|---:|---:|---:|---:|
| Mercury | 9,200 | 21,120 | 3,960 | 1,980,000 | 1,760,000 |
| Venus | 10,350 | 23,040 | 4,840 | 1,760,000 | 1,980,000 |
| Earth | 11,500 | 19,200 | 4,400 | 1,100,000 | 1,100,000 |
| Mars | 11,500 | 19,200 | 4,400 | 1,100,000 | 1,100,000 |
| Jupiter | 17,250 | 30,720 | 7,480 | 2,420,000 | 2,640,000 |
| Saturn | 20,700 | 36,480 | 8,800 | 2,750,000 | 3,080,000 |
| Uranus | 25,300 | 44,160 | 11,000 | 3,300,000 | 3,740,000 |
| Neptune | 29,900 | 53,760 | 13,200 | 3,850,000 | 4,400,000 |

At campaign creation, randomly choose five reference destinations and two distinct emergencies, schedule those emergencies at different success counts from 1–4, and add the base budget (500 food, 3,000 water, 400 oxygen, 0 propellant, 50,000 energy). Initial stock is each resource's subtotal plus its rounded-up 10% margin in internal units. Reference destinations do not bind later choices. There is no replenishment or refund. Seeded independent random streams provide reproducibility.

A proposal is randomly sufficient or deficient with equal probability. Each sufficient resource is an integer 100–105% of minimum; a deficient proposal picks one or two resources at 10–95%, others at 100–105%; displayed quantities round upward to whole units. Consecutive proposals avoid the previous destination and engineer; completed destinations are excluded. Return spends nothing and is not an approval. Approval spends the lesser of requested and available for each resource. Success requires all requested amounts delivered and all minimums requested. Insufficient stock ends the campaign even when minimums were met. Otherwise a shortage stops the mission: propellant below 25% is launch, any ratio below 50% outbound, below 75% destination, otherwise return. Earliest stage wins; ties follow resource order. Commands are idempotent.

Emergencies: E01 airlock 20,000 energy; E02 oxygen reserve 1,000 oxygen; E03 water recovery 40,000 water; E04 solar alert 60,000 energy; E05 air system 40,000 energy; E06 rations 10,000 food; E07 greenhouse cooling 20,000 water; E08 storehouse 60,000 energy. The 30-second window accepts an integer 0–100%, limited by stock; expiration commits zero. Success probability is the fraction actually supplied; zero fails and full supply succeeds. A failure ends the campaign. Pause and hidden tab freeze the timer; moving or consulting objects does not restart it. Show a neutral intervention before the outcome.

Operations follow successes 1, 2 and 3, after any emergency scheduled at the same milestone. B01: 20,000 energy or 2,000 water + 400 oxygen. B02: expanded preparation 20,000 energy (lab active) or compact 5,000 energy (lab suspended); consultation takes approximately 2.6 seconds. E04 remains separate. B03: grow local food for after success four at 1,000 water + 10,000 energy, or immediate stored rations at 500 food + 2,000 energy. Local food does not replenish mission stock. The base budget is included once at initialization, not deducted again. A stock shortfall consumes what is available and ends the campaign. Operations do not count as approvals.

After five successes and both emergencies, grade uses exact successes/approvals: 100% certificate, above 40% but below 100% office, 40% or lower dismissal. Forced termination is dismissal. Returns and training do not count.

## Remaining work

The nine supplied engineers have been integrated; preserve the original Blender Grease Pencil drawings, 18-bone rig and idle/caminar/Hablar actions. See the Phase 2 checkpoint below for rendering and source details. Characters are Nico, Adán, Leo, Max, Saúl, Dante, Víctor, Teo and Ren.

The updated supplied room/door artwork, tunnel-top fix and `StickleBoldItalic.ttf` display font remain deferred. Verify font rights and legibility before use, preserve camera alignment and readable body text. The textured rotating planet in the distant back monitor is also deferred: verify Solar System Scope licenses and attribution first; selection should start empty with Moon only in the menu, with no live APIs. Sound assets remain deferred; see [sound priorities](SOUND_EFFECTS.md).

## Verification and delivery

The Phase 1 checkpoint passed 10 unit tests and four browser suites; re-run after subsequent changes and report direct-file verification separately. Browser suites exercise development-only fixtures. Test the build and keyboard/focus, pause, reduced motion, both cameras, gameplay reveals, emergency accounting, and readability at 1280×720 and 1366×768. No human child-usability result is claimed. Confirm asset and font licenses, attribution and redistribution permissions before public release; do not claim competition eligibility without independent confirmation. Keep machine-specific paths and private coordination links out of public-facing documentation.

## Phase 2 checkpoint

Nine delivered engineers are now integrated: Nico, Adán, Leo, Max, Saúl, Dante, Víctor, Teo and Ren. Stable IDs are nico/adan/leo/max/saul/dante/victor/teo/ren. Source artwork is Blender Grease Pencil bound to an 18-bone armature, not a mesh; converting it to meshes would change strokes and fills. The actual source drawings and original idle/caminar/Hablar actions were rendered to transparent 256px, 8-column, 3-row WebP atlases. `src/characters.ts` displays them on the shared active-time clock with no independent animation timer. Reduced motion is static; missing assets keep a fallback. Walk playback is compressed for the departure transition. There is no dedicated greeting action; Hablar is used once when the visitor appears.

`public/art/engineers/manifest.json` records source IDs, hashes, timings, rig compatibility and render settings. `scripts/export-engineers.py` reproduces exports with Blender 5.3, Node and the declared sharp dependency after downloading originals into ignored `asset-sources/engineers/`. The supplied appearance takes precedence over recoloring artist assets to match a textual palette: Saúl's source suit is blue with a yellow accent. All 216 exported frames were checked for empty/clipped artwork. Viewer browser tests cover all nine loads, stale-load protection, clock freeze, reduced motion and missing-asset fallback. No original drawing was reconstructed.

## Latest delivery verification

The user reprioritized a pull-and-play build before the remaining visual phases. The tracked root `index.html` is generated and fully self-contained: inline IIFE JavaScript, inline CSS, embedded NASA reference content and 16 data-URL image assets, including all nine engineer atlases. It opens directly with no installation, HTTP server, login or network connection. `dev.html` remains the source entry; Vite maps development `/` to it, preserving fixtures and developer tests. `src/assets.ts` resolves embedded assets in the player build and public paths during development. `pnpm build` regenerates both root `index.html` and ignored `dist/index.html`; do not hand-edit the generated player file.

Verified in Chromium at 1280×720 with network disabled and a real file:// URL: start shift, engineer load, manual selection, keyboard document pickup/placement, return, tutorial approval, outcome and report; no external requests and no page errors. Ten unit tests pass. Character and camera suites pass after engineer integration. Updated wall/door tunnel fix, Stickle typography and planetary monitor remain deliberately deferred by the latest user instruction. Next recommended Copilot task: integrate and validate the updated wall/door exports, preserving direct-file/offline play and re-running offline and desk regressions. No new sound recordings were added.

## Latest wall and render correction

Updated the room and five door frames from the new team Drive files. Full 1920×1080 registration is preserved. A documented foreground-header occlusion mask removes door pixels above y=160, fixing the tunnel protrusion while retaining the supplied wall image. This is a compositing correction, not a claim of remodeling the source geometry. The new door action is open at frame 0016, so opening now holds there. The engineer entrance path remains the next task, not completed.

All nine original engineer atlases were rerendered at actual 512×512 resolution per frame (4096×1536 atlas), 32 render samples and lossless WebP. All 216 frames were checked. The viewer uses the higher resolution, high-quality resampling and a two-atlas cache to limit decoded memory. The generated standalone player includes these changes and still requires no installation.
