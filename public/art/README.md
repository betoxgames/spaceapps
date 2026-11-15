# Space Papers: arte provisional

Los SVG generados por `src/art.ts` son marcadores originales y editables por código. No son el arte final del equipo ni representan recursos aportados por NASA. Sustituirlos después de aprobar composición, lectura y estados; el juego no debe depender de cifras ni texto horneados en imágenes.

## Contrato actual

- `portrait(id)`: retrato con caja 240 × 300; identificadores `nico`, `ada`, `leo`, `max`, `sol`, `dante`, `vera`, `teo`, `ren`. Origen arriba a la izquierda; base del personaje en el borde inferior. Exportar con transparencia y mantener el mismo encuadre para intercambiar personajes.
- `lunarView()`: escenario de ventana 1600 × 320, origen arriba a la izquierda; horizonte y base son decorativos.
- `ship('transport' | 'module')`: transporte 360 × 150 orientado hacia la derecha; módulo 240 × 180, patas hacia abajo. Conservar cajas transparentes y definir pivote de animación en el centro visual.
- `planet(id)`: caja cuadrada 240 × 240, centrado; `mercury`, `venus`, `earth`, `mars`, `jupiter`, `saturn`, `uranus`, `neptune`, `moon`/`luna`. La silueta de Saturno incluye anillos.
- `baseView(state, condition)`: escenario 700 × 260. `state` admite `lifeSupport`, `refuge`, `food`; `condition` admite `normal`, `intervention`, `stable`, `lost`. Las señales provisionales son visuales; la interfaz debe comunicar también el estado con texto.
- `resourceIcon(key)`: 24 × 24, sin texto, para `food`, `water`, `oxygen`, `propellant`, `energy`. La interfaz proporciona nombres y unidades accesibles.

Las medidas son cajas lógicas de referencia, no especificaciones de entrega definitivas. Una hoja de referencia ocupa 300 × 400 unidades lógicas; manual 740 × 430; inventario 410 × 420. Confirmar tamaños con el boceto y con contenido real en inglés antes de encargar raster. Para raster, empezar con 2× la caja visible aprobada y conservar archivos maestros editables por capas; SVG es preferible cuando el equipo lo considere adecuado. No dibujar texto esencial dentro del arte.

Para reemplazar, mantener el contrato de exportaciones o adaptar sus llamadas de forma explícita. Registrar por recurso ID, autor, licencia, procedencia, fecha, dimensiones, pivote, variantes y estado de aprobación. Probar transparencias, contraste y recortes en el juego; no marcar estos sustitutos como arte final.
