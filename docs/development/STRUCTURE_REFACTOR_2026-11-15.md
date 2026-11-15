# Refactorización estructural — 2026-11-15

La entrada anterior era una distribución generada de aproximadamente 98 MiB que incrustaba imágenes, audio, CSS y JavaScript. Las fuentes TypeScript ya existían; se reorganizaron por responsabilidad y se separaron las plantillas de interfaz del controlador de sesión. El alcance conserva reglas, textos, estilos, imágenes y reproducción de audio.

La arquitectura vigente está en el [README](../../README.md#arquitectura). La distribución incluye una entrada HTML de menos de 1 KiB, `runtime/` y `public/`, tanto en la raíz como en `dist/`. Las entregas versionadas se empaquetan en ZIP. Los scripts clásicos permiten `file://`; únicamente los audios necesitan un adaptador de datos generado para la decodificación Web Audio.

## Limpieza

- Eliminado `scripts/build-portable.mjs`, un alias sin consumidores del compilador offline.
- Eliminados los generadores SVG de retratos y paisaje lunar que no tenían consumidores; se conservan las ilustraciones utilizadas.
- Unificada la función de escape HTML compartida por interfaz, manual, informes y transmisiones.
- Los estilos y recursos se movieron conservando sus contenidos y el orden de estilos. Se preservaron los cambios locales existentes antes de la refactorización.
- La compilación limpia `dist/` y los archivos obsoletos de `runtime/` que coinciden con su patrón de generación. Los originales de producción y la evidencia histórica se conservan.
- No se agregaron dependencias; todas las declaradas siguen siendo herramientas de desarrollo, pruebas o importación de recursos.

## Verificación

Comprobado en Chromium mediante Playwright:

- TypeScript y 10 pruebas unitarias de reloj, reglas, contabilidad y campañas completas.
- 15 suites de interacción: audio, transmisiones, manual, acciones del manual, informes, sellos, distribución del escritorio, incidentes, manipulación del escritorio, cámara, entrenamiento, personajes, visitantes, experiencia de usuario y accesibilidad.
- `test:offline`: juego desde `file://`, red deshabilitada, nueve ingenieros, manual, sellos, teclado, entrenamiento y resolución de incidentes.
- `test:audio-offline`: decodificación MP3 real, desbloqueo por interacción, bucle musical, volúmenes, silencio y pausa.
- `test:distribution`: copia independiente a una ruta con espacios, sin fuentes ni `node_modules`; sin errores de navegador, solicitudes externas ni archivos solicitados faltantes.
- Comparación visual a 1280 × 720, con movimiento reducido: menú, opciones, créditos y manual coinciden píxel por píxel con la distribución existente al comenzar. Capturas locales en `test-results/refactor/` (ignoradas por Git).
- Empaquetado ZIP y comprobación de integridad del archivo.

Las pruebas no sustituyen una evaluación humana ni afirman cobertura de otros motores de navegador. No se publicaron cambios ni versiones remotas.
