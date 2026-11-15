# Recursos publicados

El script de compilación copia este árbol a `dist/public/`; durante el desarrollo, Vite lo sirve desde la raíz. Mantener rutas relativas a esta carpeta en los manifiestos y conservar los nombres de archivo al regenerar exportaciones.

- `assets/images/`: imágenes WebP listas para ejecución, divididas en `scene`, `engineers` y `ui`.
- `assets/audio/`: grabaciones y música MP3; su manifiesto conserva procedencia y hashes. El sello se documenta en `assets/images/ui/manifest.json`.
Las referencias científicas están en `src/data/science.json`: se importan al compilar, al igual que el catálogo y los metadatos de animación.

Los modelos Blender, texturas maestras, PNG originales y grabaciones de producción permanecen en `asset-sources/`, ignorado por Git. No se distribuyen ni se necesitan al abrir el juego; los scripts de importación y exportación producen los recursos publicados. No crear carpetas vacías de modelos o texturas: añadirlas aquí únicamente cuando el juego consuma esos archivos en ejecución.

Los README y manifiestos junto a cada familia explican composición, formatos y procedencia. `docs/assets/` conserva el inventario y los registros de integración.
