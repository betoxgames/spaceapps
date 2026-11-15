import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const base = process.env.BASE_URL || 'http://127.0.0.1:4173/';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
try {
  await page.goto(base);
  const result = await page.evaluate(async () => {
    const { EngineerViewer } = await import('/src/characters/engineer-viewer.ts');
    const host = document.createElement('div');
    Object.assign(host.style, { position: 'fixed', width: '290px', height: '495px' });
    host.innerHTML = '<svg viewBox="0 0 10 10"><circle cx="5" cy="5" r="4"/></svg>';
    document.body.appendChild(host);
    const statuses = [];
    const viewer = new EngineerViewer(host, state => statuses.push(state));
    const ids = ['nico', 'adan', 'leo', 'max', 'saul', 'dante', 'victor', 'teo', 'ren'];
    const loaded = [];
    for (const id of ids) {
      await viewer.show(id);
      loaded.push(statuses.at(-1));
    }
    const canvas = host.querySelector('canvas');
    viewer.setAnimation('idle');
    const first = canvas.toDataURL();
    // With no tick the image stays frozen; active time advances animation.
    await new Promise(resolve => setTimeout(resolve, 180));
    const frozen = first === canvas.toDataURL();
    viewer.tick(300);
    const advanced = first !== canvas.toDataURL();
    viewer.setReducedMotion(true);
    const reduced = canvas.toDataURL();
    viewer.tick(500);
    const reducedFrozen = reduced === canvas.toDataURL();
    const firstRequest = viewer.show('nico');
    const lastRequest = viewer.show('ren');
    await Promise.all([firstRequest, lastRequest]);
    const latest = statuses.at(-1);
    await viewer.show('missing-character');
    const fallback = statuses.at(-1) === 'fallback' && host.querySelector('svg').style.visibility !== 'hidden';
    viewer.dispose(); host.remove();
    return { loaded, frozen, advanced, reducedFrozen, latest, fallback };
  });
  assert.deepEqual(result.loaded, Array(9).fill('ready'));
  assert.equal(result.frozen, true);
  assert.equal(result.advanced, true);
  assert.equal(result.reducedFrozen, true);
  assert.equal(result.latest, 'ready');
  assert.equal(result.fallback, true);
  console.log('All nine engineers load; active-time animation, reduced motion, cancellation, and fallback pass.');
} finally {
  await browser.close();
}
