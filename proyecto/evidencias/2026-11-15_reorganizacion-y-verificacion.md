# Verificación de la reorganización · 15 de noviembre de 2026

Responsable de ejecución: OpenAI Codex, por solicitud del equipo. Base de código: `99bd8a9d49df9901a72f19cf0374af3ea3e2dc20`; la reorganización y este registro se incorporan en el mismo commit posterior a esa base. No se declara una versión final publicada.

## Cambios comprobados

- Documentación ordenada en `docs/` y archivo de proceso en `proyecto/`.
- Entrada de desarrollo `index.html` de 605 bytes; el HTML autocontenido de aproximadamente 88.54 MiB se genera en `dist/` y deja de guardarse como código fuente.
- Empaquetado local con HTML versionado, metadatos de commit y SHA-256.
- Flujo de tags preparado para verificar y crear borradores de GitHub Releases.

## Resultados locales

Entorno: macOS ARM64, Node.js 24.11.1, pnpm 11.25.0 y Chromium de Playwright. Suites de desarrollo ejecutadas contra un servidor aislado; el test offline abrió un archivo real con la red desactivada.

| Comprobación | Resultado |
|---|---|
| `pnpm install --frozen-lockfile --ignore-scripts` | Correcto con las dependencias ya instaladas |
| `pnpm test` | 10 pruebas correctas |
| `pnpm build` | TypeScript y compilación correctos, 16 recursos embebidos |
| `pnpm test:offline` | Juego directo por `file://`, nueve atlas decodificados, manual, papeles, devolución, entrenamiento y reporte; sin solicitudes externas ni errores de página |
| `pnpm test:browser` | Correcto |
| `pnpm test:desk` | Correcto |
| `pnpm test:camera` | Correcto |
| `pnpm test:training` | Correcto |
| `pnpm test:characters` | Correcto |
| `pnpm test:visitors` | Correcto para los nueve visitantes y sus transiciones |
| `pnpm test:ux` | Correcto en siete tamaños de pantalla |
| `pnpm test:accessibility` | Correcto |
| Empaquetado y verificación de `SHA256SUMS` | Correctos |
| Tag distinto de `package.json` | Rechazado correctamente |
| Enlaces Markdown locales y sintaxis YAML de workflows | Correctos |
| `git diff --check` | Correcto |

[Captura del juego ejecutado sin conexión](2026-11-15_verificacion-offline.png).

La sintaxis de los workflows se verificó localmente; su ejecución remota se consulta en [GitHub Actions](https://github.com/betoxgames/spaceapps/actions). No se creó un tag ni se publicó una versión final como parte de esta reorganización. Las pruebas automatizadas no sustituyen la evaluación con usuarios ni la revisión de permisos del arte.
