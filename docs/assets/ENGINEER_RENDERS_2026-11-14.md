# Integración de renders y recorrido de ingenieros

Especificación: [Notas para Codex 3](https://app.notion.com/p/41988b30c75181a18df6fc86399684e5).
Recursos revisados: [Arte / Personajes / Ingenieros / animaciones](https://drive.google.com/drive/folders/18ary3tO44csa7YWqPtnE2IqQTt2BXYRN).
Trabajo del 14 de noviembre de 2026, hora de Ciudad de México.

## Recursos encontrados

Se revisaron las nueve carpetas y sus cuatro subcarpetas. Se descargaron y comprobaron **1.164 PNG**, todos de **1920 × 1080**, RGBA con fondo transparente y numeración consecutiva sin huecos.

| Ingeniero | Reposo | Habla | Aprobado | No aprobado |
| --- | ---: | ---: | ---: | ---: |
| Nico | 29 | 23 | 36 | 36 |
| Adán | 29 | 29 | 36 | 36 |
| Leo | 29 | 29 | 36 | 36 |
| Max | 29 | 29 | 36 | 36 |
| Saúl | 29 | 29 | 36 | 36 |
| Dante | 29 | 29 | 36 | 36 |
| Víctor | 29 | 29 | 36 | 36 |
| Teo | 29 | 29 | 36 | 36 |
| Ren | 29 | 29 | 36 | 36 |

Se conservan todos los fotogramas de estas secuencias. Los PNG no contienen una frecuencia de reproducción inequívoca: se usa **24 fps**, por coherencia con la plantilla Blender original. Esto produce 1.208,33 ms para 29 imágenes, 958,33 ms para las 23 de Nico y 1.500 ms para las reacciones de 36. **El equipo de arte debe confirmar la cadencia de las cuatro secuencias PNG.**

No se encontraron renders nuevos de caminata en ninguna de las nueve carpetas: solo `idle`/`Idle`, `hablar`, `aprobado` y `no aprobado`. No faltan renders de reacción. La marcha procede de los `.blend` originales que ya tenía el proyecto y de `Animaciones.blend`, acción `caminar`. Se reexportaron los fotogramas consecutivos **86–125**, ciclo repetido de 40 imágenes a los 24 fps originales (1.666,67 ms), con topología y pose de reposo compatibles. Reemplazan las ocho muestras dispersas de toda la acción. La marcha conserva la elevación de pies y el estilo de la fuente; el cierre del ciclo tiene una pequeña discontinuidad autoral. No se inventaron animaciones ni se modificaron los modelos.

## Preparación y registro

`public/assets/images/engineers/manifest.json` registra por imagen su ID de Drive, hash SHA-256, tamaño, límites alfa y procedencia. Incluye los hashes de las fuentes Blender, cámara, muestreo, frecuencia y registro del ciclo de marcha. `src/data/engineer-clips.json` contiene solo los metadatos que necesita el juego.

Los fotogramas se recortan por sus límites alfa y se ajustan a la resolución de uso con proporción conservada. No se cambian colores, trazos, ropa ni rasgos (se conserva, por ejemplo, el traje azul de Saúl). WebP usa compresión sin pérdida **después del remuestreo de resolución**. Los rectángulos se empaquetan con margen transparente para reducir la memoria de decodificación; no se rasterizan grandes celdas vacías repetidas.

Cada ingeniero conserva un único eje horizontal de apoyo obtenido de su referencia de reposo. El registro vertical es común entre los renders del equipo; se conserva su movimiento interno, no se reajusta el tamaño en cada imagen. La marcha usa una escala constante calibrada contra la referencia de reposo de la misma fuente. La celda virtual añade espacio bajo los pies para conservar la oscilación original sin cortar zapatos o cabeza. El visor alinea `footY` con el suelo del host, independientemente del rectángulo empaquetado.

## Secuencia e integración

`VisitorSequence` controla la entrada `loading → opening → entering → closing → walking → settling → ready`. Después del sello, `reacting → approved` mantiene al ingeniero aprobado en el cuarto hasta la proyección; `reacting → leaving → exit-opening → exiting → exit-closing → hidden` conserva la salida de solicitudes devueltas.

- Espera carga y decodificación del personaje y de las cinco poses de puerta.
- La puerta suministrada representa un ciclo completo: `0001` cerrada, `0016` abierta y `0032` cerrada de nuevo.
- Coordenadas de pies en el mundo 1600 × 900: umbral `(245,650)`, despeje `(630,680)`, mesa `(800,740)`. Escalas `.85`, `.95`, `1`.
- Actualización solicitada el 15 de noviembre: el personaje aparece delante del centro aparente de la puerta al terminar de abrirse. Desde allí avanza de escala adulta `.85` a `.95` y después a `1` detrás de la mesa. Se mantiene delante de la hoja durante entrada y salida, evitando que parezca rodear su diagonal. El cierre comienza después de despejar la puerta y se solapa con la marcha; una curva continua desacelera hasta el escritorio sin detenerse para esperar el cierre. Es una puesta en escena provisional aprobada por el usuario, no una reparación del modelo ni una simulación de atravesar su geometría.
- Fondo, personaje, puerta y escritorio comparten cámara. El escritorio ocluye las piernas en la posición final. La vista de mesa acerca el mismo mundo y recorta al personaje según el encuadre; no reinicia la animación.
- Al sellar se muestra la vista de habitación para poder ver la reacción; la cámara permanece en el cuarto durante la reacción y salida para que el gesto se vea completo. La marcha de regreso se refleja horizontalmente para mirar hacia la puerta; no hay render nuevo de giro.
- La reacción recibe exclusivamente `approve` o `return`, nunca el éxito de la misión. El estado público, recursos y resultado siguen revelándose en el momento original de la consecuencia. No cambian reglas ni balance.
- Puerta, recorrido y clips avanzan con `GameClock`. Pausa, pérdida de foco y pestaña oculta conservan el punto exacto hasta reanudar. Movimiento reducido mantiene el orden causal con posiciones discretas, reposo fijo y una pose estática representativa de la reacción.
- La carga fallida conserva el sustituto vectorial y permite completar la visita; las solicitudes antiguas no pueden sustituir a un ingeniero más reciente.

## Dependencias visuales pendientes

**La puerta sigue careciendo del trozo superior en el modelo suministrado.** El enmascarado de pared preexistente y el orden de capas son adaptaciones provisionales de composición; no reparan la geometría. No se modificó el modelo ni se presenta esa adaptación como una reparación definitiva.

Para sustituir la marcha reexportada y el giro reflejado, entregar secuencias de caminar/entrada/salida/giro con la misma cámara, escala y punto de apoyo que los PNG nuevos. Confirmar 24 fps para reposo/habla/reacciones y, si corresponde, entregar un cierre de ciclo de marcha más suave. La presentación delante de la puerta abierta sustituye la oclusión inicial del montaje anterior, a petición del usuario. La geometría definitiva sigue pendiente.

## Reproducir y verificar

Node instalado, aunque no estaba en PATH:

```sh
export PATH=/Users/beto/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH
```

1. Recuperar mediante el conector autenticado el inventario y las descargas de las cuatro subcarpetas por ingeniero en `asset-sources/team-renders/downloads.json` (ignorado por Git). No publicar URLs firmadas. `download-team-renders.py` valida tamaño y firma PNG de cada descarga; al caducar enlaces, volver a obtenerlos con el conector.
2. Mantener los originales `.blend` en `asset-sources/engineers/`, con IDs de Drive en `scripts/export-engineers.py` y hashes registrados en el manifiesto. Ejecutar `python3 scripts/export-walk.py` para obtener `asset-sources/walk-renders/` sin modificar originales.
3. Ejecutar `python3 scripts/download-team-renders.py` y `node scripts/import-team-renders.mjs`. El importador comprueba dimensiones, transparencia, continuidad, límites de recorte y registro, y regenera atlas/manifiestos.
4. Ejecutar `pnpm test`, `pnpm build`, y las suites `test:browser`, `test:desk`, `test:camera`, `test:training`, `test:characters`, `test:visitors` con el servidor de desarrollo en el puerto 4173. `test:offline` abre el archivo generado con `file://` y red desactivada.

`pnpm build` es el único procedimiento usado para regenerar `dist/index.html`. No se edita el HTML generado a mano. Las fuentes, descargas, credenciales temporales y capturas permanecen fuera de Git; el juego distribuido contiene sus propios assets y no depende de Drive ni de servicios externos.

La suite de visitantes recorre las nueve entradas y las dieciocho reacciones/salidas, compara la aprobación de propuestas suficientes e insuficientes antes de la consecuencia, prueba pausa/visibilidad/movimiento reducido/cámaras/carga lenta/fallida y genera hojas de contacto en `test-results/visitors/`. Resultados: `pnpm test` 10/10; TypeScript, `test:browser`, `test:desk`, `test:camera`, `test:training`, `test:characters` y `test:visitors` correctos. Se revisaron las 14 hojas de contacto finales; se añadió una comprobación de que la entrada empieza visible delante de la puerta, sobre el suelo y solo al terminar su apertura. La suite incluye un fotograma largo que cruza salida/cine, para comprobar que el tiempo de la salida no se contabilice de nuevo en la siguiente escena y que un callback tardío de recogida no oculte los papeles de la propuesta siguiente.

Los 1.164 PNG originales ocupan 953.221.281 bytes; los nueve atlas de juego, incluidos los 360 fotogramas nuevos de marcha, ocupan 66.154.094 bytes (reducción de 14,4 veces frente a esos PNG, aun incorporando la marcha). El empaquetado reduce en un 49,3 % los píxeles que se decodifican frente a celdas uniformes del mismo tamaño. El HTML autocontenido generado ocupa aproximadamente 88,5 MiB. `dist/index.html` es el entregable generado; no se versiona en Git.

La verificación `test:offline` pasó abriendo `file://` con red desactivada, decodificando los nueve atlas embebidos, usando manual/papeles/sellos y completando aprobación, devolución y reporte de entrenamiento: ninguna solicitud externa ni error de página. Las fuentes del repositorio, el build y los tests son la referencia reproducible; las capturas permanecen en `test-results/` (ignorado).

## Pulido del 15 de noviembre · segunda revisión

La entrada tarda 3.400 ms desde el inicio del cruce hasta estar listo, además de 640 ms de apertura. Las fases de entrada comparten una curva continua y mantienen el clip de caminata; la aproximación final baja de 1.250 a 160 ms. No hay una espera inmóvil mientras se cierra la puerta.

La aprobación reproduce los 1.500 ms del gesto suministrado y conserva su pose final en el escritorio (`approved`), sin marcha de salida ni nueva apertura de puerta. Solo entonces empieza la proyección. Las órdenes internas usan el mismo gesto. La devolución conserva su reacción y salida por la puerta. La celebración expresa autorización; no adelanta si la misión tendrá éxito.

Se actualizó el contrato de la suite de visitantes. En esta revisión se hizo compilación TypeScript y revisión visual breve de comparación, aprobación, permanencia y comienzo de cine, sin ejecutar las suites extensas por la prioridad del usuario de publicar los commits.
