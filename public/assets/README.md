# Recursos de ejecución

`images/` contiene las capas de escena, atlas de ingenieros y sellos optimizados. `audio/` contiene los MP3 originales integrados. Las imágenes se cargan como archivos locales. Los MP3 también se convierten en `runtime/audio-data-*.js` durante la compilación para que Web Audio funcione con doble clic sin conexión.

Los maestros editables, modelos 3D y texturas de producción se conservan fuera de este árbol, en `asset-sources/` (ignorado). No sustituir originales ni borrar referencias de procedencia al regenerar un recurso. Los scripts `import-*`, `update-scene.mjs` y `export-engineers.py` actualizan las exportaciones y sus manifiestos.
