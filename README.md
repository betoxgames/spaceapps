# Space Papers

Videojuego de operaciones lunares para niñas y niños de 7–12 años, desarrollado por **Los valar**. Revisa propuestas de expedición, consulta el manual y decide con un sello. La oficina combina una escena 2.5D de Blender con nueve ingenieros animados.

## Jugar con doble clic

**Descarga o clona el repositorio y abre `index.html` de la raíz en tu navegador.** Si descargas un ZIP, extráelo primero. No necesitas instalar dependencias, compilar, ejecutar una terminal, iniciar un servidor ni conectarte a Internet.

Conserva `index.html`, `runtime/` y `public/` juntos, con sus nombres y estructura. El HTML carga los estilos, scripts clásicos e imágenes de esas carpetas. Las partidas se reinician al recargar; las preferencias se guardan localmente.

Las entregas versionadas se empaquetan como `Space-Papers-vX.Y.Z.zip` para [GitHub Releases](https://github.com/betoxgames/spaceapps/releases): extrae la carpeta y abre su `index.html`.

## Arquitectura

```text
space-papers/
├── index.html                 Entrada jugable generada, pequeña y sin código incrustado
├── runtime/                   JavaScript y CSS generados y versionados
├── public/
│   └── assets/
│       ├── images/
│       │   ├── scene/         Capas del escenario y fotogramas de la puerta
│       │   ├── engineers/     Atlas de animación de los nueve ingenieros
│       │   └── ui/            Imágenes de sellos
│       └── audio/            Música y efectos MP3, con manifiesto de procedencia
├── src/
│   ├── main.ts               Entrada de fuentes: estilos e inicio del juego
│   ├── app/                  Coordinación de sesión, estados y acciones
│   ├── core/                 Reloj, rutas de recursos y preferencias
│   ├── game/                 Reglas y transiciones puras de la campaña
│   ├── data/                 Catálogo, metadatos de animación y referencias científicas
│   ├── scenes/               Cámara, secuencia de visitantes y proyección
│   ├── characters/           Carga y reproducción de atlas de ingenieros
│   ├── audio/                Mezcla, reproducción, pausa y señales sintetizadas
│   ├── ui/                   Escritorio, manual, informes y plantillas de interfaz
│   └── styles/               Estilos base y por componente, en orden explícito
├── tests/                    Pruebas de reglas, navegador y apertura file://
├── scripts/                  Compilación, empaquetado e importación de recursos
├── docs/                     Arquitectura, diseño, verificaciones y entregas
├── proyecto/                 Evidencias, fuentes y prompts históricos
├── .github/                  Integración continua y publicación de versiones
├── dev.html                  Entrada de desarrollo con Vite
└── package.json              Herramientas de desarrollo y comandos
```

Las reglas de `src/game/` dependen del catálogo, no del DOM. `src/app/` coordina el estado y conecta reglas, reloj, escenas y componentes. Las plantillas de `src/ui/` reciben los datos que presentan; el manual, los informes, el escritorio y las transmisiones tienen módulos propios. Los estilos conservan su orden de carga para mantener la apariencia.

Los modelos 3D, texturas de producción y renders originales se conservan en `asset-sources/` (ignorado) y en el almacenamiento del equipo. El juego utiliza sus exportaciones 2.5D optimizadas; no necesita modelos ni un motor 3D en tiempo de ejecución. La organización y las convenciones de recursos se describen en [public/assets/README.md](public/assets/README.md).

### Por qué funciona sin servidor

El código fuente usa módulos TypeScript. La compilación los transforma en un script clásico IIFE, cargado mediante `<script src>`, y un CSS externo. El navegador puede abrir ambos desde `file://`; no se utilizan módulos ES, importaciones dinámicas ni consultas de JSON durante la ejecución distribuida.

Las imágenes usan rutas relativas. Los datos de juego y metadatos se compilan con el código. Los tres MP3 también generan `runtime/audio-data-*.js`: este adaptador entrega sus bytes a Web Audio sin `fetch(file://)`, bloqueado por los navegadores, y conserva la reproducción y mezcla existentes. Es una copia generada para compatibilidad; los originales editables están en `public/assets/audio/`.

`index.html` y `runtime/` **se incluyen en Git** para que la descarga funcione inmediatamente. No los edites a mano. `dist/`, `release/`, `test-results/`, `node_modules/` y `asset-sources/` son carpetas locales ignoradas.

## Desarrollar

Solo para modificar y verificar las fuentes: **Node.js 24** y **pnpm 11.25.0**.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Abre [localhost:4173](http://127.0.0.1:4173/). Vite sirve `dev.html` en `/` y actualiza los módulos al guardar. Edita `src/` y los recursos de `public/`; conserva identificadores de DOM, orden de estilos y datos de balance cuando el cambio sea estructural.

```sh
pnpm test
pnpm build
pnpm exec playwright install chromium
pnpm test:offline
pnpm test:audio-offline
pnpm test:distribution
```

`pnpm build` comprueba los tipos y regenera `index.html` y `runtime/`, además de una copia jugable completa en `dist/`. Incluye las fuentes, los recursos modificados, `index.html` y todos los cambios de `runtime/` en el mismo commit, también las eliminaciones de archivos generados anteriores. CI comprueba la apertura directa antes de compilar y que la regeneración coincida con lo versionado. `pnpm preview` sirve `dist/` para revisar la distribución por HTTP; no es necesario para jugar.

Con `pnpm dev` activo en otra terminal, ejecuta las pruebas de interacción:

```sh
pnpm test:browser
pnpm test:dispatch
pnpm test:manual
pnpm test:manual-actions
pnpm test:reports
pnpm test:desk
pnpm test:stamps
pnpm test:desk-layout
pnpm test:camera
pnpm test:training
pnpm test:characters
pnpm test:visitors
pnpm test:ux
pnpm test:accessibility
pnpm test:audio
```

Las suites de desarrollo usan datos de prueba que se eliminan de la distribución. `PREVIEW_URL` permite cambiar el servidor; `PLAY_HTML` selecciona otro `index.html` con sus carpetas adyacentes para las pruebas offline. Las capturas se generan en `test-results/`.

## Documentación y entregas

- [Índice técnico](docs/README.md): arquitectura, diseño, arte e historial.
- [Versiones finales](docs/RELEASES.md): validación, empaquetado y publicación.
- [Evidencias, fuentes y prompts](proyecto/README.md): archivo del proceso del proyecto.
- [Revisión de experiencia de usuario](docs/reviews/UX_REVIEW_2026-11-15.md): cobertura y comprobaciones humanas pendientes.

## Controles

Arrastra papeles, manual y sellos. Selecciona un sello y pulsa sobre una hoja; también puedes usar el foco y Enter. `B` abre el manual, `I` su sección de inventario, `R` su registro del turno y `1`–`3` recuperan hojas cubiertas. Tab, Enter y las flechas permiten manipular objetos; Escape pausa y `F` activa pantalla completa. Las opciones incluyen movimiento reducido, colocación con dos clics, volumen general, volumen de música y silencio. El audio se activa tras una interacción; la música ambiental se repite y se suspende con la pausa o al ocultar la pestaña.

## Fuentes y estado

[src/data/science.json](src/data/science.json) contiene las referencias educativas NASA. Los costos y probabilidades son ficción de balance, no predicciones de NASA. El arte y los archivos de sello, puerta y música ambiental fueron suministrados por el equipo; las demás señales sintetizadas son provisionales. La procedencia de los nuevos audios está en [public/assets/audio/manifest.json](public/assets/audio/manifest.json). El código y la documentación se desarrollaron con asistencia de OpenAI Codex. La evaluación con usuarios y la revisión final de licencias siguen pendientes; consulta la documentación antes de marcar una entrega como final.
