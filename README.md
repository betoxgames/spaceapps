# Space Papers

Lunar operations game by Los valar. A layered 2.5D room, two camera views, freely movable documents, mission manual and physical stamps.

## Run

Use Node.js 24 LTS and pnpm:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open the Local URL printed by Vite. Campaigns are not saved; preferences are stored locally.

## Build and checks

```sh
pnpm test
pnpm build
pnpm exec playwright install chromium
```

With the development server running:

```sh
pnpm test:browser
pnpm test:desk
pnpm test:camera
pnpm test:training
```

Browser tests require the development-only fixtures; use `PREVIEW_URL` for another development URL. To inspect the production build, run `pnpm preview`. The generated `dist/` directory is not committed.

## Controls

Hold and drag documents, manual and stamps. Click a stamp then a sheet for an alternative. `B` opens the manual, `I` the inventory, `R` the record, and `1/2/3` recovers a covered sheet. Tab, Enter and arrows provide keyboard control. Escape pauses; F toggles full screen. Options includes reduced motion, mute and two-click placement.

## Credits and current status

Concept, direction, and supplied Blender room/desk/door renders: Los valar. Implementation, documentation and original procedural stand-ins were assisted by OpenAI Codex agents (Astra, Sol and Terra). Engineer figures and other procedural graphics remain provisional. Sound is synthesized locally; fonts use system families. Room images are compressed WebP derivatives of the team's aligned PNG renders, with sampled door poses. Their source camera registration is preserved.

NASA references, observations and interpretation limits are in [public/science.json](public/science.json) and in the game manual and credits. All mission costs and recovery probabilities are fictional game balance. No NASA endorsement is implied. Interaction research references Papers, Please by Lucas Pope; no assets or code from that game are included.

This is a work-in-progress checkpoint. Final engineers, human usability testing, project licensing and competition eligibility remain pending. Uploading code does not constitute a competition submission or eligibility determination.
