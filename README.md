# Space Papers

Videojuego de operaciones lunares para niñas y niños de 7–12 años, desarrollado por **Los valar**. Revisa propuestas de expedición, consulta el manual y decide con un sello. La oficina combina una escena 2.5D de Blender con nueve ingenieros animados.

## Jugar

Descarga el archivo `Space-Papers-vX.Y.Z.html` de una versión publicada en [GitHub Releases](https://github.com/betoxgames/spaceapps/releases) y ábrelo en tu navegador. Incluye el juego y sus recursos: funciona sin instalación, servidor, cuenta ni conexión. Las partidas se reinician al recargar; las preferencias se guardan localmente.

Mientras se prepara la primera versión final, puedes generar el mismo archivo con `pnpm build` y abrir `dist/index.html`. El `index.html` de la raíz es la entrada del código fuente y se usa con el servidor de desarrollo.

## Estructura

```text
spaceapps/
├── src/                Código TypeScript y estilos del juego
├── public/             Arte optimizado y referencias utilizadas por el juego
├── tests/              Pruebas unitarias y de navegador
├── scripts/            Compilación, empaquetado e importación de arte
├── docs/               Documentación técnica, diseño y revisiones
├── proyecto/           Evidencias, fuentes y prompts del proyecto
├── .github/            Integración continua y publicación de versiones
├── index.html          Entrada de desarrollo
└── package.json        Dependencias y comandos
```

`dist/`, `release/`, `test-results/` y `asset-sources/` son carpetas locales ignoradas por Git. Los originales pesados de Blender y renders se conservan en el almacenamiento compartido; en Git se guardan los recursos optimizados.

## Desarrollar

Requiere **Node.js 24** y **pnpm 11.25.0**.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Abre [localhost:4173](http://127.0.0.1:4173/). Para generar el juego autocontenido y comprobarlo:

```sh
pnpm test
pnpm build
pnpm exec playwright install chromium
pnpm test:offline
```

Con `pnpm dev` activo en otra terminal, ejecuta las pruebas de interacción:

```sh
pnpm test:browser
pnpm test:desk
pnpm test:camera
pnpm test:training
pnpm test:characters
pnpm test:visitors
pnpm test:ux
pnpm test:accessibility
```

Las suites usan datos de prueba disponibles solo en desarrollo. `PREVIEW_URL` permite cambiar el servidor; `PLAY_HTML` permite probar otro HTML de distribución. Las capturas se generan en `test-results/`.

## Documentación y entregas

- [Índice técnico](docs/README.md): arquitectura, diseño, arte e historial.
- [Versiones finales](docs/RELEASES.md): validación, empaquetado y publicación.
- [Evidencias, fuentes y prompts](proyecto/README.md): archivo del proceso del proyecto.
- [Revisión de experiencia de usuario](docs/reviews/UX_REVIEW_2026-11-15.md): cobertura y comprobaciones humanas pendientes.

## Controles

Arrastra papeles, manual y sellos. Selecciona un sello y pulsa sobre una hoja; también puedes usar el foco y Enter. `B` abre el manual, `I` el inventario, `R` el registro y `1`–`3` recuperan hojas cubiertas. Tab, Enter y las flechas permiten manipular objetos; Escape pausa y `F` activa pantalla completa. Las opciones incluyen movimiento reducido y colocación con dos clics.

## Fuentes y estado

[public/science.json](public/science.json) contiene las referencias educativas NASA. Los costos y probabilidades son ficción de balance, no predicciones de NASA. El arte fue suministrado por el equipo; el sonido sintetizado es provisional. El código y la documentación se desarrollaron con asistencia de OpenAI Codex. La evaluación con usuarios y la revisión final de licencias siguen pendientes; consulta la documentación antes de marcar una entrega como final.
