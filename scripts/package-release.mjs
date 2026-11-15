import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const pkg = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));
const tag = process.env.RELEASE_TAG || `v${pkg.version}`;
const versionPattern = /^v(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-(?:[A-Za-z0-9-]+\.)*[A-Za-z0-9-]+)?$/;
if (!versionPattern.test(tag) || tag !== `v${pkg.version}`) {
  throw new Error(`Release tag ${tag} must match package.json version v${pkg.version}.`);
}

const html = await readFile(path.join(root, 'dist/index.html'));
if (!html.includes(Buffer.from('window.__SPACE_PAPERS_ASSETS__='))) {
  throw new Error('dist/index.html is not the standalone offline game. Run pnpm build first.');
}
const commit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
const filename = `Space-Papers-${tag}.html`;
const sha256 = createHash('sha256').update(html).digest('hex');
// Each version has its own directory so earlier local packages cannot leak into a release.
const output = path.join(root, 'release', tag);
await mkdir(output, { recursive: true });
await writeFile(path.join(output, filename), html);
await writeFile(path.join(output, 'SHA256SUMS'), `${sha256}  ${filename}\n`);
await writeFile(path.join(output, 'release.json'), JSON.stringify({
  name: pkg.name, version: pkg.version, tag, commit, filename, bytes: html.length, sha256,
}, null, 2) + '\n');
console.log(`Release package: release/${tag}/${filename} (${html.length} bytes)\nSHA-256: ${sha256}`);
