#!/usr/bin/env python3
"""Render the supplied Grease Pencil engineers and their real template actions.

Run with Python 3 from any directory. Requires Blender 5.3, Node, and sharp;
set BLENDER, NODE, or SHARP_PATH if installed elsewhere. Source .blend files belong in
asset-sources/engineers and are intentionally not committed.
"""
import hashlib
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile

ROOT = Path(__file__).resolve().parents[1]
SOURCES = ROOT / 'asset-sources' / 'engineers'
OUTPUT = ROOT / 'public' / 'art' / 'engineers'
BLENDER = os.environ.get('BLENDER') or shutil.which('blender') or '/Applications/Blender.app/Contents/MacOS/Blender'
SHARP = os.environ.get('SHARP_PATH') or str(ROOT / 'node_modules' / 'sharp')
NODE = os.environ.get('NODE') or shutil.which('node') or 'node'
SOURCES_META = {
    'nico': ('1344RIPD0aik-uknekHI8SuXkpBauk5Cp', 'Igeniero Nico.blend', '2026-11-14T23:10:29.373Z'),
    'adan': ('1LsUR9eI35UP8J4hEpyZZyVZ1MdFlxuNW', 'IngenieroAdan.blend', '2026-11-14T23:23:21.454Z'),
    'leo': ('1mu7fzrmalcMDL53_k-3mhldHz5Vbgst9', 'IngenieroLeo.blend', '2026-11-14T23:28:05.174Z'),
    'max': ('1o0H1-5tGHQ5KaIyCx7s4OTHXIMedbSZf', 'IngenieroMax.blend', '2026-11-14T23:34:47.670Z'),
    'saul': ('1SY0UhHmMlINGXlj5hTDHIB3rDrLUH7pN', 'IngenieroSaul.blend', '2026-11-15T00:28:02.222Z'),
    'dante': ('1NK0qrMFWYGz3SamIzzzM9diBgYZtFKNH', 'IngenieroDante.blend', '2026-11-14T23:43:29.335Z'),
    'victor': ('1QUyWjp0QjxbHEZffndZf5vrZle7Jbjd6', 'IngenieroVíctor.blend', '2026-11-15T00:12:52.599Z'),
    'teo': ('1ZrjDtsq99TEtMuQWkoE7jidFEIR_SdOa', 'IngenieroTeo.blend', '2026-11-15T00:22:00.689Z'),
    'ren': ('1b7waEkFyGxbVxa3ExwNsdqpSpXBpeER8', 'IngenieroRen.blend', '2026-11-15T00:26:19.255Z'),
}
CLIPS = [('idle', 1, 29), ('caminar', 1, 213), ('Hablar', 1, 23)]
SIZE = 512
SAMPLES = 32

def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def worker(slug, directory):
    import bpy
    bpy.ops.wm.open_mainfile(filepath=str(SOURCES / (slug + '.blend')))
    if bpy.context.object and bpy.context.object.mode != 'OBJECT':
        bpy.ops.object.mode_set(mode='OBJECT')
    arm = bpy.data.objects['Armature']
    with bpy.data.libraries.load(str(SOURCES / 'animations.blend')) as (src, dest):
        dest.actions = [n for n in src.actions if n in {c[0] for c in CLIPS}]
        dest.armatures = ['Armature'] if 'Armature' in src.armatures else []
    if len(dest.actions) != len(CLIPS) or not dest.armatures:
        raise RuntimeError('Template actions or armature missing')
    template = dest.armatures[0]
    actual = {(b.name, b.parent.name if b.parent else None) for b in arm.data.bones}
    expected = {(b.name, b.parent.name if b.parent else None) for b in template.bones}
    if actual != expected:
        raise RuntimeError('Character and animation template bone topology differ')
    rest_error = max(abs(b.matrix_local[i][j] - template.bones[b.name].matrix_local[i][j])
                     for b in arm.data.bones for i in range(4) for j in range(4))
    if rest_error > 1e-5:
        raise RuntimeError('Character and animation template bone rest poses differ')
    scene = bpy.context.scene
    scene.render.engine = 'BLENDER_EEVEE'
    scene.eevee.taa_render_samples = SAMPLES
    scene.render.resolution_x = scene.render.resolution_y = SIZE
    scene.render.resolution_percentage = 100
    scene.render.film_transparent = True
    scene.render.image_settings.file_format = 'PNG'
    scene.render.image_settings.color_mode = 'RGBA'
    scene.camera.data.lens *= 1.5
    arm.animation_data_create()
    for row, (name, start, end) in enumerate(CLIPS):
        action = next(a for a in dest.actions if a.name == name)
        arm.animation_data.action = action
        arm.animation_data.action_slot = action.slots[0]
        for col in range(8):
            frame = start + (end - start) * col / 8
            scene.frame_set(int(frame), subframe=frame % 1)
            scene.render.filepath = str(Path(directory) / f'{row}-{col}.png')
            bpy.ops.render.render(write_still=True)
    info = {'bones': len(actual), 'maxBoneRestMatrixDifference': rest_error,
            'greasePencilObjects': sum(o.type == 'GREASEPENCIL' for o in scene.objects),
            'camera': {'type': scene.camera.data.type, 'lens': scene.camera.data.lens},
            'sourceFps': scene.render.fps / scene.render.fps_base}
    (Path(directory) / 'info.json').write_text(json.dumps(info))

def main():
    OUTPUT.mkdir(parents=True, exist_ok=True)
    for slug in SOURCES_META:
        if not (SOURCES / (slug + '.blend')).is_file():
            raise SystemExit(f'Missing source: {slug}.blend')
    template = SOURCES / 'animations.blend'
    if not template.is_file():
        raise SystemExit('Missing animation template: animations.blend')
    entries = {}
    with tempfile.TemporaryDirectory(prefix='engineers-') as temp:
        for slug, (file_id, name, modified) in SOURCES_META.items():
            folder = Path(temp) / slug
            folder.mkdir()
            subprocess.run([BLENDER, '-b', '--python', str(Path(__file__).resolve()), '--', '--worker', slug, str(folder)], check=True)
            node = '''const sharp=require(process.argv[1]); const path=require('path'); const dir=process.argv[2]; const out=process.argv[3]; const size=Number(process.argv[4]); const items=[]; for(let r=0;r<3;r++)for(let c=0;c<8;c++)items.push({input:path.join(dir,`${r}-${c}.png`),left:c*size,top:r*size}); sharp({create:{width:8*size,height:3*size,channels:4,background:{r:0,g:0,b:0,alpha:0}}}).composite(items).webp({lossless:true,effort:3}).toFile(out).catch(e=>{console.error(e);process.exit(1)});'''
            subprocess.run([NODE, '-e', node, SHARP, str(folder), str(OUTPUT / (slug + '.webp')), str(SIZE)], check=True)
            entries[slug] = {'file': slug + '.webp', 'source': {'fileId': file_id, 'name': name, 'modifiedTime': modified, 'sha256': sha(SOURCES / (slug + '.blend'))}, **json.loads((folder / 'info.json').read_text()), 'bytes': (OUTPUT / (slug + '.webp')).stat().st_size}
    manifest = {'format': 'transparent-webp-atlas', 'frameWidth': SIZE, 'frameHeight': SIZE, 'columns': 8, 'rows': 3,
                'clips': {name: {'row': row, 'frames': 8, 'sourceFrames': [start, end], 'durationSeconds': (end-start)/24} for row,(name,start,end) in enumerate(CLIPS)},
                'aliases': {'idle': 'idle', 'walk': 'caminar', 'talk': 'Hablar', 'greet': None},
                'template': {'fileId': '158IHHPwkFcrW6acZPBDNuOX0OsIZYAHm', 'name': 'Animaciones.blend', 'modifiedTime': '2026-11-15T00:48:46.976Z', 'sha256': sha(template)},
                'export': {'blender': '5.3', 'engine': 'EEVEE', 'samples': SAMPLES, 'cameraLensMultiplier': 1.5, 'sampling': '8 evenly spaced frames per action, excluding endpoint', 'webpLossless': True},
                'warnings': ['Source is Grease Pencil; transparent images preserve its strokes and fills.', 'No greeting action is present in the template.', 'Saul’s source has a blue suit; the Notion reference describes a yellow badge. The supplied artwork was retained.'], 'engineers': entries}
    (OUTPUT / 'manifest.json').write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + '\n')

if __name__ == '__main__':
    if '--worker' in sys.argv:
        index = sys.argv.index('--worker')
        worker(sys.argv[index + 1], sys.argv[index + 2])
    else:
        main()
