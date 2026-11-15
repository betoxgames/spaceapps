# Atlas de ingenieros

Nueve atlas WebP transparentes conservan el registro entre poses y fotogramas. `manifest.json` guarda dimensiones, límites alfa, fuentes, IDs de Drive y hashes. Los metadatos de clips consumidos por el juego se mantienen en el código fuente.

`scripts/import-team-renders.mjs` integra los renders suministrados; `scripts/export-walk.py` y `scripts/export-engineers.py` reproducen la caminata desde Blender y empaquetan los atlas. Los modelos, texturas y renders originales permanecen en `asset-sources/`, ignorado por Git. No recortar poses de forma independiente ni eliminar los datos de procedencia.
