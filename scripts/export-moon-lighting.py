"""Sample original Blender light data. Run Blender headless with this script."""
import bpy, json, math
from pathlib import Path
root = Path(__file__).resolve().parents[1]
bpy.ops.wm.open_mainfile(filepath=str(root / 'asset-sources/MoonMenuFinal..blend/MoonMenuFinal.blend'))
scene = bpy.context.scene
lights = [o for o in scene.objects if o.type == 'LIGHT']
result = {'source': 'MoonMenuFinal.blend', 'coordinateSystem': 'glTF Y-up; Blender (x,y,z) -> (x,z,-y)', 'fps': scene.render.fps / scene.render.fps_base, 'startFrame': scene.frame_start, 'endFrame': scene.frame_end, 'colorSpace': 'linear', 'energyUnit': 'Blender watts', 'moon': {'worldPivot': [0, 0, 0], 'worldBoundsMin': [-4.374, -4.404, -4.346], 'worldBoundsMax': [4.349, 4.400, 4.369], 'approximateRadius': 4.404}, 'lights': []}
for o in lights:
    light = {'name': o.name, 'type': o.data.type, 'parent': o.parent.name if o.parent else None, 'radius': o.data.shadow_soft_size, 'samples': []}
    for frame in range(scene.frame_start, scene.frame_end + 1):
        scene.frame_set(frame)
        p = o.matrix_world.translation
        power = o.data.energy
        light['samples'].append({'frame': frame, 'position': [p.x, p.z, -p.y], 'color': list(o.data.color), 'power': power, 'intensity': power / (4 * math.pi)})
    result['lights'].append(light)
target = root / 'public/assets/models/moon-lighting.json'
target.parent.mkdir(parents=True, exist_ok=True)
target.write_text(json.dumps(result, separators=(',', ':')) + '\n')
print('Wrote', target)
for o in scene.objects:
 if o.type=='MESH': print('MESH',o.name, len(o.data.polygons),len(o.data.vertices), 'modifiers',[(m.name,m.type) for m in o.modifiers],flush=True)
