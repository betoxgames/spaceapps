# Sonidos y música

- `door.mp3`: grabación de puerta del equipo.
- `ambient-music.mp3`: música ambiental del equipo.
- `stamp.mp3`: grabación de sello compartida por ambas decisiones.
- `ship-engine.mp3`: propulsor compartido por módulo y transporte; las dos grabaciones de Drive son idénticas. Se reproduce a ganancia 0,16 / 0,12 antes del volumen general.

`manifest.json` registra los originales, IDs de Drive y hashes de puerta y ambiente. La procedencia del sello está en `../images/ui/manifest.json` y la del propulsor en `../images/ships/manifest.json`. `scripts/import-audio.mjs`, `scripts/import-stamps.mjs` y `scripts/update-ships.mjs` copian los MP3 sin recodificación desde `asset-sources/`. Los demás efectos se sintetizan en el código.
