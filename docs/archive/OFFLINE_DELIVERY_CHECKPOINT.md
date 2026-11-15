# Offline delivery checkpoint before repository reorganization

Historical record: generated HTML now lives in `dist/index.html` and is distributed through GitHub Releases. See [current delivery instructions](../RELEASES.md).

## Historical delivery verification (before repository reorganization)

The user reprioritized a pull-and-play build before the remaining visual phases. The tracked root `index.html` is generated and fully self-contained: inline IIFE JavaScript, inline CSS, embedded NASA reference content and 16 data-URL image assets, including all nine engineer atlases. It opens directly with no installation, HTTP server, login or network connection. `dev.html` remains the source entry; Vite maps development `/` to it, preserving fixtures and developer tests. `src/assets.ts` resolves embedded assets in the player build and public paths during development. `pnpm build` regenerates both root `index.html` and ignored `dist/index.html`; do not hand-edit the generated player file.

Verified in Chromium at 1280×720 with network disabled and a real file:// URL: start shift, engineer load, manual selection, keyboard document pickup/placement, return, tutorial approval, outcome and report; no external requests and no page errors. Ten unit tests pass. Character and camera suites pass after engineer integration. Updated wall/door tunnel fix, Stickle typography and planetary monitor remain deliberately deferred by the latest user instruction. Next recommended Copilot task: integrate and validate the updated wall/door exports, preserving direct-file/offline play and re-running offline and desk regressions. No new sound recordings were added.
