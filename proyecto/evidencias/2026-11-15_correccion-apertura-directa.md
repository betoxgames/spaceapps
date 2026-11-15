# Corrección de apertura directa · 15 de noviembre de 2026

La reorganización de `b94a8c2` sustituyó el HTML autocontenido de la raíz por una entrada TypeScript que requería Vite. Esto rompió la apertura directa de `index.html`. La prueba anterior verificaba `dist/index.html` después de compilar y no detectaba el problema del archivo entregado en Git.

Se restauró el juego autocontenido en `index.html`, con `dev.html` como entrada de desarrollo. `pnpm build` genera copias idénticas en la raíz y `dist/`. La organización de documentación y `proyecto/` se conserva.

Verificación local por OpenAI Codex: diez pruebas unitarias correctas, TypeScript y compilación correctos, y prueba de `index.html` por `file://` con la red desactivada. Se decodificaron los nueve personajes y se completaron manual, manipulación de documentos, devolución, aprobación de entrenamiento y reporte, sin solicitudes externas ni errores de página. El HTML generado coincide byte por byte con la última versión jugable previa a la reorganización (`99bd8a9`).

CI ahora prueba el `index.html` del commit antes de compilar y comprueba después que la compilación no cambia ese archivo. La documentación explica que el juego se abre directamente desde la raíz y que el HTML debe acompañar los cambios de código.
