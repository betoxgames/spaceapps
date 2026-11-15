import sharp from 'sharp';
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

// Rebuild the scene from the unmodified Drive PNGs in asset-sources/scene.
const sources = [
  ['wall-final', 'scene-base', '1xKYoHYxRwfZlNIR9yEecu5izHVjL6O7u', '2026-11-14T23:01:33.996Z'],
  ...JSON.parse(await readFile(new URL('./door-sources.json', import.meta.url), 'utf8'))
    .map(({ name, driveId, modifiedTime }) => [name.slice(0, -4), `door-${name.slice(0, -4)}`, driveId, modifiedTime]),
];
// Register the supplied door trapezoid with the wall aperture. The same affine
// mapping applies to every frame, so jambs and feet do not drift during motion.
// Source (86,120), (450,120), (0,790), (655,790) map approximately to
// wall (241,190), (525,190), (121,730), (632,730), on the 1920×1080 canvas.
const doorTransform = [.78, 0, -.08, .806, 184, 93];
const manifest = { canvas: [1920, 1080], encoding: 'WebP lossless after registration resampling',
  doorTransform, doorOcclusion: 'Door behind the transparent wall aperture; the original wall naturally masks the header and jambs.',
  doorCycle: { frames: 32, closed: ['0001', '0032'], open: '0016', phaseDurationMs: 640 }, sources: [] };
for (const [input, output, driveId, modifiedTime] of sources) {
  const original = await readFile(`asset-sources/scene/${input}.png`);
  const metadata = await sharp(original).metadata();
  if (metadata.width !== 1920 || metadata.height !== 1080) throw new Error(`Unexpected canvas: ${input}`);
  const registered = output.startsWith('door-')
    ? Buffer.from(`<svg width="1920" height="1080" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><image width="1920" height="1080" transform="matrix(${doorTransform.join(' ')})" xlink:href="data:image/png;base64,${original.toString('base64')}"/></svg>`)
    : original;
  const image = sharp(registered);
  await image.webp({ lossless: true, effort: 6 }).toFile(`public/assets/images/scene/${output}.webp`);
  manifest.sources.push({ output: `${output}.webp`, original: input === 'wall-final' ? 'Escenario Final.png' : `${input}.png`, driveId, modifiedTime, bytes: original.length, sha256: createHash('sha256').update(original).digest('hex') });
}
await writeFile('public/assets/images/scene/manifest.json', `${JSON.stringify(manifest, null, 2)}\n`);
