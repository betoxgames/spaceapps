import sharp from 'sharp';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

// Original PNGs downloaded from Space Papers/Arte/stacion espacial in Drive.
const sources = [
  ['white', 'lucesBlancas.png', '10SJGh7XDmZd7Ha2hzFc1R19ymboZkZv-', '2026-11-15T15:54:28.633Z'],
  ['red', 'lucesRojas.png', '1EFLnNgHn6yc1N3DDoD2dzs1u4NXxpm_K', '2026-11-15T15:54:06.550Z'],
  ['amber', 'lucesAmarillas.png', '18hRpSwoZ8uh0nsRUdZlwJ11xxGtPbM6r', '2026-11-15T15:53:50.487Z'],
  ['off', 'lucesApagadas.png', '1y38-J2FG5GeonUD-O0jQvv95WjqO2kCb', '2026-11-15T15:53:35.382Z'],
];
const root = new URL('../', import.meta.url);
const destination = new URL('public/assets/images/lunar-station/', root);
await mkdir(destination, { recursive: true });
const manifest = {
  canvas: [1920, 1080], encoding: 'WebP quality 90, original dimensions and framing',
  driveFolder: 'https://drive.google.com/drive/folders/1lPdXajkKAfJkofogh_aV64dBDZaFe1TX',
  emergencies: ['E01', 'E02', 'E03', 'E04', 'E05', 'E06', 'E07', 'E08'],
  operations: ['B01', 'B02', 'B03'],
  lighting: {
    emergencies: { initial: 'red', initialExceptions: { E08: 'off' }, intervention: 'amber', success: 'white', failure: 'off' },
    operations: { initial: 'white', intervention: 'amber', success: 'white', failure: 'off' },
  },
  surfaces: ['dispatch', 'cinema', 'report'], sources: [],
};
for (const [state, original, driveId, modifiedTime] of sources) {
  const input = await readFile(new URL(`asset-sources/lunar-station/${original}`, root));
  const metadata = await sharp(input).metadata();
  if (metadata.width !== 1920 || metadata.height !== 1080) throw new Error(`Unexpected canvas: ${original}`);
  const output = await sharp(input).webp({ quality: 90, effort: 6 }).toBuffer();
  await writeFile(new URL(`${state}.webp`, destination), output);
  manifest.sources.push({ state, original, output: `${state}.webp`, driveId, modifiedTime,
    bytes: input.length, sha256: createHash('sha256').update(input).digest('hex'),
    outputBytes: output.length, outputSha256: createHash('sha256').update(output).digest('hex') });
}
await writeFile(new URL('manifest.json', destination), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Lunar station: ${manifest.sources.length} renders, ${manifest.sources.reduce((total, source) => total + source.outputBytes, 0)} bytes.`);
