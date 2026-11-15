import sharp from 'sharp';
import { mkdir, readFile, writeFile, copyFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

// Download originals from the authenticated Drive references in ship-sources.json.
const root = new URL('../', import.meta.url);
const sources = JSON.parse(await readFile(new URL('ship-sources.json', import.meta.url), 'utf8'));
const outputDir = new URL('public/assets/images/ships/', root);
await mkdir(outputDir, { recursive: true });
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const manifest = { frames: 24, frameRate: 24, encoding: 'WebP quality 90, original transparent canvas', sources: [] };
const encoded = new Map();
for (const source of sources.filter(source => source.kind.endsWith('Frames')).sort((a, b) => a.kind.localeCompare(b.kind) || a.original.localeCompare(b.original))) {
  const kind = source.kind === 'moduleFrames' ? 'module' : 'transport';
  const input = await readFile(new URL(`asset-sources/ships/${kind}/${source.original}`, root));
  const metadata = await sharp(input).metadata();
  const [width, height] = kind === 'module' ? [529, 1080] : [1920, 883];
  if (metadata.width !== width || metadata.height !== height || !metadata.hasAlpha) throw new Error(`Unexpected ship canvas: ${kind}/${source.original}`);
  const sha256 = hash(input);
  const output = encoded.get(sha256) ?? await sharp(input).webp({ quality: 90, alphaQuality: 100, effort: 6 }).toBuffer();
  encoded.set(sha256, output);
  const name = `${kind}-${source.original.replace('.png', '.webp')}`;
  await writeFile(new URL(name, outputDir), output);
  manifest.sources.push({ ...source, output: name, width, height, sha256, outputBytes: output.length, outputSha256: hash(output) });
}
const moduleSound = await readFile(new URL('asset-sources/ships/audio/module.mp3', root));
const transportSound = await readFile(new URL('asset-sources/ships/audio/transport.mp3', root));
if (hash(moduleSound) !== hash(transportSound)) throw new Error('Ship sounds differ: review audio mapping before updating.');
await copyFile(new URL('asset-sources/ships/audio/module.mp3', root), new URL('public/assets/audio/ship-engine.mp3', root));
manifest.audio = { output: 'assets/audio/ship-engine.mp3', sha256: hash(moduleSound), sources: sources.filter(source => source.kind.endsWith('Audio')), gain: { module: .16, transport: .12 } };
await writeFile(new URL('manifest.json', outputDir), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Ships: ${manifest.sources.length} transparent frames; shared engine recording ${moduleSound.length} bytes.`);
