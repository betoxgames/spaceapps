# Space Papers — engineering handoff

This is the Phase 1 baseline. The playable prototype exists; the following phases are planned, not completed. The team has delivered all nine engineer models, including Saúl; verify the actual supplied asset files and their integration status separately. The existing on-screen engineers are temporary. Preserve gameplay and accounting while improving presentation. Repository: https://github.com/betoxgames/spaceapps, branch `main`. Store original Blender sources in the team’s shared drive and commit only optimized runtime assets directly to Git; Git LFS is not needed for the current repository.

## Product and architecture

A lunar-base document-review game for children aged 7–12: inspect an engineer's proposal, compare its five resources against the manual and inventory, then stamp approve or return. Use clear language, readable controls, accessible focus and keyboard operation, reduced motion and age-appropriate feedback. Never reveal a mission result before its consequence, or future emergency identities/costs. No changes to costs, balances or probabilities without explicit authorization.

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

## Planned phases, in order

1. Establish and push this baseline and handoff; keep this status honest.
2. Integrate the nine delivered engineers using the existing Blender rigs and animations, without rebuilding them. Shared body, individual accessories: Nico `#E98662`, star cap; Adán (replaces Ada), analytical, `#79ADA5`, rectangular glasses; Leo `#DFAC65`, headphones around neck; Max `#DB765F`, goggles on forehead; Saúl (replaces Sol) `#E3B34F`, sun vest; Dante `#7C9EAB`, dramatic scarf; Víctor (replaces Vera) `#C98678`, service cap; Teo `#8FB49A`, pencil behind ear and tools; Ren `#D99952`, chest emblem. Validate source files, names, materials, rigging and animation before integration. Current catalog still says Ada, Sol and Vera; those are current code, not the approved final identities.
3. Integrate the updated supplied room/door artwork, fix the tunnel top, and use `StickleBoldItalic.ttf` only for display typography after verifying rights and legibility at target sizes. Preserve camera alignment and readable body text.
4. Put a textured, rotating planet in the distant back monitor, using Solar System Scope material only after verifying the applicable licenses and attribution. Manual selection: no initial selection; Moon appears only in the menu. Do not introduce APIs or live data.
5. Verify the playable build and record actual outcomes. Sound assets are deferred; provide a prioritized list rather than presenting them as completed.

## Verification and delivery

At this baseline, the reported automated checkpoint is 10 unit tests and four browser suites; re-run rather than assuming that later edits remain green. Browser suites exercise development-only fixtures. Test the build and keyboard/focus, pause, reduced motion, both cameras, gameplay reveals, emergency accounting, and readability at 1280×720 and 1366×768. No human child-usability result is claimed. Confirm asset and font licenses, attribution and redistribution permissions before public release; do not claim competition eligibility without independent confirmation. Keep machine-specific paths and private coordination links out of public-facing documentation.
