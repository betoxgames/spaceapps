# Naves de las cinemáticas

Secuencias transparentes de 24 fotogramas de `Space Papers/Arte/Modulo(Nave pequeña)/despegue` y `Space Papers/Arte/naveInterplanetaria(NaveGrande)/propulsor` en Google Drive.

`module-0001.webp`–`module-0024.webp`: lienzo original 529 × 1080, con módulo vertical y escape inferior. `transport-0001.webp`–`transport-0024.webp`: lienzo original 1920 × 883, proa a la derecha y escape a la izquierda. Se conservan las dimensiones y el canal alfa para evitar saltos durante el encendido.

`manifest.json` conserva IDs de Drive, fechas, tamaños y SHA-256 originales y optimizados. `scripts/ship-sources.json` registra el inventario de origen; `scripts/update-ships.mjs` reconstruye las exportaciones WebP y el MP3 desde `asset-sources/ships/` (ignorados por Git).

Los sonidos de las dos carpetas tienen el mismo SHA-256; se distribuye una sola copia de `assets/audio/ship-engine.mp3`. El mezclador reduce su amplitud a 0,16 para el módulo y 0,12 para el transporte, antes del volumen general. El sonido solo acompaña ascenso, viaje, regreso y descenso; termina al abandonar esas escenas. Pausar suspende el contexto conservando la posición. Los fotogramas y el desplazamiento usan el mismo reloj lógico, y movimiento reducido presenta imágenes estáticas.
