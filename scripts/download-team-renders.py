#!/usr/bin/env python3
"""Materialize connector downloads locally; signed URLs stay in ignored asset-sources.

Input: asset-sources/team-renders/downloads.json, produced from the authenticated
Drive connector (slug, clip, name, size, id, download). Never commit that file.
"""
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
import json
import time
import urllib.request

ROOT = Path(__file__).resolve().parents[1] / 'asset-sources' / 'team-renders'
jobs = json.loads((ROOT / 'downloads.json').read_text())

def download(job):
    target = ROOT / job['slug'] / job['clip'] / job['name']
    target.parent.mkdir(parents=True, exist_ok=True)
    size = int(job['size'])
    if target.exists() and target.stat().st_size == size:
        return
    for attempt in range(3):
        try:
            with urllib.request.urlopen(job['download'], timeout=90) as response:
                data = response.read()
            if len(data) != size or data[:8] != b'\x89PNG\r\n\x1a\n':
                raise ValueError('Unexpected file contents or truncated download')
            target.write_bytes(data)
            return
        except Exception:
            if attempt == 2:
                raise RuntimeError(f"Download failed: {job['slug']}/{job['clip']}/{job['name']}") from None
            time.sleep(attempt + 1)

with ThreadPoolExecutor(max_workers=12) as pool:
    for index, _ in enumerate(pool.map(download, jobs), 1):
        if index % 100 == 0:
            print(f'{index}/{len(jobs)} PNG files downloaded', flush=True)
print(f'Complete: {len(jobs)} PNG files')
