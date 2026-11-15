"""Build a continuous runtime Moon from the source radius field and UV map.
Run: /Applications/Blender.app/Contents/MacOS/Blender -b --python scripts/optimize-menu-moon.py
The source Moon is disconnected triangle soup; ordinary decimation creates holes.
"""
import bpy
import numpy as np
from pathlib import Path
root = Path(__file__).resolve().parents[1]
source = root / 'asset-sources' / 'MoonMenuFinal..blend' / 'MoonMenuFinal.blend'
target = root / 'public' / 'assets' / 'models' / 'moon-menu.glb'
bpy.ops.wm.open_mainfile(filepath=str(source))
sphere = bpy.data.objects['Sphere']
source_mesh = sphere.data
print('Sampling source vertices:', len(source_mesh.vertices), flush=True)
coords = np.empty(len(source_mesh.vertices) * 3, dtype=np.float32)
source_mesh.vertices.foreach_get('co', coords)
coords = coords.reshape(-1, 3)
radii = np.linalg.norm(coords, axis=1)
valid = radii > 1e-8
coords, radii = coords[valid], radii[valid]
segments, rings = 256, 160
u = (np.arctan2(coords[:, 1], coords[:, 0]) / (2 * np.pi) + .5) % 1
v = np.arcsin(np.clip(coords[:, 2] / radii, -1, 1)) / np.pi + .5
col = np.rint(u * segments).astype(np.int32) % segments
row = np.clip(np.rint(v * rings).astype(np.int32), 0, rings)
idx = row * segments + col
counts = np.bincount(idx, minlength=(rings + 1) * segments)
sums = np.bincount(idx, weights=radii, minlength=(rings + 1) * segments)
field = np.full_like(sums, float(np.mean(radii)))
np.divide(sums, counts, out=field, where=counts > 0)
field = field.reshape(rings + 1, segments)
print('Missing sample bins:', int((counts == 0).sum()), flush=True)
# A pole is a single surface point; averaging its radius avoids a seam.
field[0, :] = np.mean(field[0, :]); field[-1, :] = np.mean(field[-1, :])
verts = []
for j in range(rings + 1):
    lat = np.pi * (j / rings - .5)
    for i in range(segments + 1):
        lon = 2 * np.pi * (i / segments - .5)
        r = field[j, i % segments]
        verts.append((r * np.cos(lat) * np.cos(lon), r * np.cos(lat) * np.sin(lon), r * np.sin(lat)))
faces, uv = [], []
for j in range(rings):
    for i in range(segments):
        a = j * (segments + 1) + i; b = a + 1; c = a + segments + 2; d = a + segments + 1
        faces.extend(((a, b, c), (a, c, d)))
        x0, x1, y0, y1 = i / segments, (i + 1) / segments, j / rings, (j + 1) / rings
        uv.extend(((x0,y0),(x1,y0),(x1,y1),(x0,y0),(x1,y1),(x0,y1)))
mesh = bpy.data.meshes.new('Moon runtime surface')
mesh.from_pydata(verts, [], faces)
mesh.update()
mesh.uv_layers.new(name='UVMap').data.foreach_set('uv', np.asarray(uv, dtype=np.float32).ravel())
for p in mesh.polygons: p.use_smooth = True
for mat in source_mesh.materials: mesh.materials.append(mat)
sphere.data = mesh
print('Runtime surface triangles:', len(mesh.polygons), flush=True)
for image in bpy.data.images:
    if image.size[0] > 2048 or image.size[1] > 2048:
        scale = min(2048 / image.size[0], 2048 / image.size[1])
        image.scale(max(1, round(image.size[0] * scale)), max(1, round(image.size[1] * scale)))
        image.pack()
target.parent.mkdir(parents=True, exist_ok=True)
bpy.ops.export_scene.gltf(filepath=str(target), export_format='GLB', export_image_format='JPEG', export_jpeg_quality=85)
print('Wrote', target, flush=True)
