#!/usr/bin/env python3
"""Export a continuous cycle from the team's original ``caminar`` action.

The new Drive PNG delivery contains no walking sequence. This uses the original
character .blend files and animation template already recorded by export-engineers,
without modifying their geometry, materials, poses or source files. All consecutive
frames are retained at the template's 24 fps. Defaults select frames 86–125: the
40-frame repeated cycle whose boundary poses and velocities match most closely.

Run with Python 3. BLENDER may override the installed Blender executable. Output
PNGs and their reproducible source/foot audit remain in ignored asset-sources;
scripts/import-team-renders.mjs packs the runtime atlases separately.
"""
import argparse
import hashlib
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'asset-sources' / 'engineers'
OUTPUT = ROOT / 'asset-sources' / 'walk-renders'
CHARACTERS = ('nico', 'adan', 'leo', 'max', 'saul', 'dante', 'victor', 'teo', 'ren')
BLENDER = os.environ.get('BLENDER') or shutil.which('blender') or '/Applications/Blender.app/Contents/MacOS/Blender'


def digest(file):
    return hashlib.sha256(file.read_bytes()).hexdigest()


def alpha_metrics(file):
    import bpy
    import numpy as np
    image = bpy.data.images.load(str(file), check_existing=False)
    try:
        width, height = image.size
        data = np.empty(width * height * 4, dtype=np.float32)
        image.pixels.foreach_get(data)
        # Blender's pixel origin is bottom-left; record the PNG's top-left origin.
        alpha = data.reshape(height, width, 4)[::-1, :, 3]
        ys, xs = np.nonzero(alpha > 16 / 255)
        if not len(xs):
            raise RuntimeError(f'Empty walking render: {file}')
        bottom = int(ys.max())
        foot_ys, foot_xs = np.nonzero((alpha > 16 / 255) & (np.arange(height)[:, None] >= bottom - 16))
        return {'alphaBounds': {'left': int(xs.min()), 'top': int(ys.min()), 'right': int(xs.max()), 'bottom': bottom},
                'lowestVisibleFootSpan': [int(foot_xs.min()), int(foot_xs.max())],
                'threshold': 16, 'hasTransparentPixels': bool(np.any(alpha == 0))}
    finally:
        bpy.data.images.remove(image)


def worker(args):
    import bpy
    source = SOURCE / f'{args.character}.blend'
    template_file = SOURCE / 'animations.blend'
    bpy.ops.wm.open_mainfile(filepath=str(source))
    if bpy.context.object and bpy.context.object.mode != 'OBJECT':
        bpy.ops.object.mode_set(mode='OBJECT')
    arm = bpy.data.objects['Armature']
    with bpy.data.libraries.load(str(template_file)) as (_, imported):
        imported.actions = ['caminar', 'idle']
        imported.armatures = ['Armature']
    actions = {a.name.split('.')[0]: a for a in imported.actions if a}
    if not {'caminar', 'idle'} <= actions.keys() or not imported.armatures:
        raise RuntimeError('Original walking/idle actions or template armature missing')
    expected = imported.armatures[0]
    actual_bones = {(b.name, b.parent.name if b.parent else None) for b in arm.data.bones}
    expected_bones = {(b.name, b.parent.name if b.parent else None) for b in expected.bones}
    if actual_bones != expected_bones:
        raise RuntimeError('Character and template bone topology differ')
    rest_error = max(abs(b.matrix_local[i][j] - expected.bones[b.name].matrix_local[i][j])
                     for b in arm.data.bones for i in range(4) for j in range(4))
    if rest_error > 1e-5:
        raise RuntimeError('Character and template rest poses differ')
    scene = bpy.context.scene
    scene.render.engine = 'BLENDER_EEVEE'
    scene.eevee.taa_render_samples = args.samples
    scene.render.resolution_x = scene.render.resolution_y = args.size
    scene.render.resolution_percentage = 100
    scene.render.film_transparent = True
    scene.render.image_settings.file_format = 'PNG'
    scene.render.image_settings.color_mode = 'RGBA'
    scene.camera.data.lens *= 1.5
    fps = scene.render.fps / scene.render.fps_base
    if fps != 24:
        raise RuntimeError(f'Unexpected original timeline rate: {fps}')
    if args.start < actions['caminar'].frame_range[0] or args.start + args.count - 1 > actions['caminar'].frame_range[1]:
        raise RuntimeError('Requested walk cycle exceeds source action')
    destination = OUTPUT / args.character
    destination.mkdir(parents=True, exist_ok=True)
    arm.animation_data_create()

    def render(action, frame, file):
        arm.animation_data.action = action
        arm.animation_data.action_slot = action.slots[0]
        scene.frame_set(frame)
        scene.render.filepath = str(file)
        bpy.ops.render.render(write_still=True)
        return {'file': file.name, 'sourceFrame': frame, 'sha256': digest(file), 'bytes': file.stat().st_size,
                **alpha_metrics(file)}

    reference = render(actions['idle'], 1, destination / 'reference.png')
    frames = [render(actions['caminar'], args.start + i, destination / f'{i + 1:04}.png') for i in range(args.count)]
    manifest = {
        'character': args.character,
        'source': {'file': str(source.relative_to(ROOT)), 'sha256': digest(source)},
        'template': {'file': str(template_file.relative_to(ROOT)), 'sha256': digest(template_file), 'action': 'caminar'},
        'sourceFrameRange': [args.start, args.start + args.count - 1],
        'sourceActionRange': list(actions['caminar'].frame_range),
        'fps': fps, 'durationMs': args.count / fps * 1000, 'loop': True,
        'selection': ('Consecutive 40-frame repeated source cycle; boundary pose/velocity comparison selected 86→126; terminal duplicate omitted.'
                      if args.start == 86 and args.count == 40 else 'Custom consecutive source frames; verify the loop boundary visually.'),
        'export': {'blender': bpy.app.version_string, 'engine': 'EEVEE', 'samples': args.samples,
                   'canvas': [args.size, args.size], 'cameraLensMultiplier': 1.5, 'cameraLens': scene.camera.data.lens},
        'bones': len(actual_bones), 'maxBoneRestMatrixDifference': rest_error,
        'reference': reference, 'frames': frames,
        'limitations': ['Re-export from original repository Blender sources; not a newly supplied Drive walking PNG sequence.',
                        'Authored stylized body/foot movement is preserved; no per-frame scale, pose or geometry correction.']
    }
    (destination / 'manifest.json').write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + '\n')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--character', choices=CHARACTERS)
    parser.add_argument('--start', type=int, default=86)
    parser.add_argument('--count', type=int, default=40)
    parser.add_argument('--size', type=int, default=512)
    parser.add_argument('--samples', type=int, default=32)
    parser.add_argument('--worker', action='store_true')
    args = parser.parse_args(sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else None)
    if args.worker:
        worker(args)
        return
    if args.count <= 0 or args.size <= 0 or args.samples <= 0:
        parser.error('Count, size and samples must be positive')
    for character in ((args.character,) if args.character else CHARACTERS):
        result = subprocess.run([BLENDER, '-b', '--python', str(Path(__file__).resolve()), '--', '--worker',
                                 '--character', character, '--start', str(args.start), '--count', str(args.count),
                                 '--size', str(args.size), '--samples', str(args.samples)], capture_output=True, text=True)
        destination = OUTPUT / character
        destination.mkdir(parents=True, exist_ok=True)
        (destination / 'blender.log').write_text(result.stdout + result.stderr)
        if result.returncode:
            raise RuntimeError(f'{character}: Blender failed ({result.returncode}); see {destination / "blender.log"}')
        print(f'{character}: {args.count} transparent frames at 24 fps; {destination / "manifest.json"}')


if __name__ == '__main__':
    main()
