# Sellos del equipo

Importados desde `Space Papers/Arte/UI` en Drive. `manifest.json` conserva IDs, nombres y SHA-256 de los originales; los PNG y las referencias temporales de descarga permanecen en `asset-sources/ui` (ignorado por Git).

- `approve-idle.webp` y `return-idle.webp`: reposo en el soporte.
- `approve-held.webp` y `return-held.webp`: selección y fantasma durante el arrastre.
- `public/assets/audio/stamp.mp3`: `Sonido/Sello.mp3`, bytes originales; suena una vez al aceptar cualquiera de las dos decisiones. No anticipa el resultado de una misión.

`node scripts/import-stamps.mjs` regenera las cuatro imágenes WebP sin pérdida de codificación desde una reducción a 300 × 360. Conserva el lienzo transparente completo y el mismo registro entre poses. Las etiquetas, estados accesibles y la tinta siguen siendo texto de la interfaz. `src/ui/desk.ts` conserva la mecánica de arrastre, selección, cancelación y teclado.

`pnpm build` mantiene las imágenes como archivos locales y genera un script con los datos MP3, junto con el JavaScript y CSS externos. `pnpm test:stamps` comprueba el arte real, la precarga de poses, la decodificación y reproducción del MP3, los dos tamaños de escritorio y las interacciones sin decisiones duplicadas. `pnpm test:offline` verifica además los cuatro WebP incrustados y una sola reproducción del MP3 al devolver una propuesta mediante teclado, con la red deshabilitada.

Validación de la integración: compilación y TypeScript; 10 pruebas unitarias; `test:stamps`, `test:desk`, `test:desk-layout`, `test:accessibility` y el recorrido completo `test:offline`. Dos compilaciones simultáneas también produjeron HTML idéntico con los 23 assets incrustados iguales a sus archivos de origen locales.
