import sharp from 'sharp';
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

// Rebuild the scene from the unmodified Drive PNGs in asset-sources/scene.
const sources = [
  ['wall-final', 'scene-base', '1xKYoHYxRwfZlNIR9yEecu5izHVjL6O7u', '2026-11-14T23:01:33.996Z'],
  ['0001', 'door-0001', '1TYnXcPZFv4XHsiI9HOm33i8BRmpHKS5R', '2026-11-14T20:47:56.215Z'],
  ['0008', 'door-0008', '18_ADQabDAERnAEB7uNn_k5H5Nymw2vQ5', '2026-11-14T20:48:02.476Z'],
  ['0016', 'door-0016', '1zDSqM26oURhFngFtAFb0oqoyD4ds3tnQ', '2026-11-14T20:48:09.611Z'],
  ['0024', 'door-0024', '1B50djWHVkVGhlGmz1aTOjPNe4-nG58HQ', '2026-11-14T20:48:16.900Z'],
  ['0032', 'door-0032', '11AAuL2dCu2wL06_Pqzy_5J8HiVgynGA0', '2026-11-14T20:48:24.157Z'],
];
const manifest = { canvas: [1920, 1080], encoding: 'WebP lossless', doorOcclusion: 'The wall header masks door pixels above y=160 on the original canvas. This is a compositing correction, not a change to the supplied geometry.', sources: [] };
const wallOcclusion = Buffer.from('<svg width="1920" height="1080" xmlns="http://www.w3.org/2000/svg"><path fill="white" d="M 0 160 L 1920 160 L 1920 1080 L 0 1080 Z"/></svg>');
for (const [input, output, driveId, modifiedTime] of sources) {
  const original = await readFile(`asset-sources/scene/${input}.png`);
  const metadata = await sharp(original).metadata();
  if (metadata.width !== 1920 || metadata.height !== 1080) throw new Error(`Unexpected canvas: ${input}`);
  const image = sharp(original);
  if (output.startsWith('door-')) image.composite([{ input: wallOcclusion, blend: 'dest-in' }]);
  await image.webp({ lossless: true, effort: 6 }).toFile(`public/assets/images/scene/${output}.webp`);
  manifest.sources.push({ output: `${output}.webp`, original: input === 'wall-final' ? 'Escenario Final.png' : `${input}.png`, driveId, modifiedTime, bytes: original.length, sha256: createHash('sha256').update(original).digest('hex') });
}
await writeFile('public/assets/images/scene/manifest.json', `${JSON.stringify(manifest, null, 2)}\n`);
