# Sonidos y música

- `door.mp3`: grabación de puerta del equipo.
- `ambient-music.mp3`: música ambiental del equipo.
- `stamp.mp3`: grabación de sello compartida por ambas decisiones.

`manifest.json` registra los originales, IDs de Drive y hashes de puerta y ambiente. La procedencia del sello está en `../images/ui/manifest.json`. `scripts/import-audio.mjs` y `scripts/import-stamps.mjs` copian los MP3 sin recodificación desde `asset-sources/`. Los demás efectos se sintetizan en el código.
