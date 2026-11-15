// Rebuild runtime assets from the unmodified team exports in asset-sources/ui.
import sharp from 'sharp';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'public/assets/images/ui');
await mkdir(output, { recursive: true });
await mkdir(path.join(root, 'public/assets/audio'), { recursive: true });
const sources = [
  ['APROBADOidle.png', 'approve-idle.webp', '1Smh56cD877wP8We6s6wx7q4m3yD-Qzmi'],
  ['CANCELADOidle.png', 'return-idle.webp', '1lXrSpXViWwzgLKS1oDCRnsmc_ghr1Vpu'],
  ['APROBADO.png', 'approve-held.webp', '1UUWLGMdSj9EGqxmpkYfxcIKL08WK6qRB'],
  ['cancelado.png', 'return-held.webp', '1tkIVYpSE6LlDaBux8VxbT6wALa2sXi03'],
  ['Sello.mp3', '../../audio/stamp.mp3', '1lGgMNnQ4bVHVMySbrfNRXn6LlIhpnmnm'],
];
const manifest = {
  sourceFolder: 'https://drive.google.com/drive/folders/1HGmsCmLKqGfNKUZX8IJ8vGxLojD-DRnc',
  attribution: 'Original graphics and stamp recording supplied by Los valar for Space Papers.',
  sourceCanvas: [600, 720], runtimeCanvas: [300, 360],
  registration: 'Preserve the full transparent canvas across both poses; no independent trimming.',
  sources: [],
};
for (const [original, filename, driveId] of sources) {
  const bytes = await readFile(path.join(root, 'asset-sources/ui', original));
  if (original.endsWith('.png')) {
    const metadata = await sharp(bytes).metadata();
    if (metadata.width !== 600 || metadata.height !== 720 || !metadata.hasAlpha) throw Error(`Unexpected stamp canvas: ${original}`);
    await sharp(bytes).resize(300, 360).webp({ lossless: true, effort: 6 }).toFile(path.join(output, filename));
  } else await writeFile(path.join(output, filename), bytes);
  manifest.sources.push({ original, output: path.relative(path.join(root, 'public'), path.join(output, filename)), driveId, bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex') });
}
await writeFile(path.join(output, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log('Imported four stamp poses and the original stamp recording.');
