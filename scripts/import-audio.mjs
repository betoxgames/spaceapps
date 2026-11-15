// Copy the team's original Drive recordings without transcoding.
// Downloads stay in ignored asset-sources/audio; runtime audio is embedded offline.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'public/assets/audio');
const sources = [
  { original: 'Puerta.mp3', output: 'door.mp3', driveId: '19Z4Mtag-pQwZYBQ5kbbryTGbHL133YJ2', sourcePath: 'Space Papers/Arte/Escenario principal/Puerta/sonido/Puerta.mp3', bytes: 58514 },
  { original: 'ambinetMusic.mp3', output: 'ambient-music.mp3', driveId: '1r4KKRr8lzEp28bJd29-_t9jNUPDZyQm0', sourcePath: 'Space Papers/Arte/Escenario principal/ambinetMusic.mp3', bytes: 7189733 },
];
const manifest = {
  sourceFolder: 'https://drive.google.com/drive/folders/1JuziOtiKwVmEtsiEWtuEM44Av8ZNCX4V',
  provenance: 'Audio files supplied by Los valar through the project Drive. Authorship and license are not established by this import.',
  encoding: 'Original audio/mpeg bytes; no transcoding.',
  sources: [],
};
await mkdir(output, { recursive: true });
for (const source of sources) {
  const bytes = await readFile(path.join(root, 'asset-sources/audio', source.output));
  if (bytes.length !== source.bytes) throw new Error(`Unexpected size: ${source.original}`);
  await writeFile(path.join(output, source.output), bytes);
  manifest.sources.push({ ...source, sha256: createHash('sha256').update(bytes).digest('hex') });
}
await writeFile(path.join(output, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log('Imported the supplied door recording and ambient music.');
