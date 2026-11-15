# Versiones finales

El repositorio incluye el juego listo para abrir en `index.html` de la raíz. `dev.html` es la entrada de desarrollo. `pnpm build` regenera `index.html` y `runtime/`, y copia la distribución completa a `dist/`; incluye `index.html`, `runtime/` y los recursos de `public/` en cada commit que cambie el juego. Los paquetes versionados también se distribuyen en [GitHub Releases](https://github.com/betoxgames/spaceapps/releases).

## Preparar una entrega

1. Termina y revisa los cambios en `main`. El registro `CHANGELOG.md` debe describir lo que realmente incluye la entrega.
2. Actualiza `version` en `package.json`: `X.Y.Z` para una versión final o `X.Y.Z-rc.1` para una candidata. La versión del tag debe coincidir exactamente.
3. Ejecuta las pruebas indicadas en el README y revisa interfaz, accesibilidad, créditos y permisos de los recursos. Guarda evidencia seleccionada en `proyecto/evidencias/`, asociada al commit o tag.
4. Ejecuta `pnpm build`, incorpora `index.html` y `runtime/` regenerados, confirma y sube los cambios. Empaqueta desde ese commit:

```sh
pnpm release:package
```

El comando recompila y crea `release/vX.Y.Z/` con:

- `Space-Papers-vX.Y.Z.zip`: juego completo para extraer y abrir mediante `index.html`.
- `SHA256SUMS`: huella SHA-256 del ZIP.
- `release.json`: versión, commit de origen, tamaño y huella.

Estas carpetas generadas están ignoradas. No las añadas al repositorio.

## Crear el borrador en GitHub

Desde el commit validado de `main`, crea el tag correspondiente. Ejemplo para `version: 1.0.0`:

```sh
git tag -a v1.0.0 -m "Space Papers v1.0.0"
git push origin v1.0.0
```

El workflow **Release** vuelve a ejecutar la misma verificación de CI, recupera la distribución comprobada y crea un **borrador de GitHub Release** con los tres archivos. Las candidatas con sufijo se marcan como prerelease. Si falla la verificación o el tag no coincide con `package.json`, la entrega no se crea.

Abre el borrador en Releases, revisa las notas y descarga y extrae el ZIP para comprobarlo. Publica el borrador cuando el equipo considere que esa versión está lista. En Actions también queda un artefacto `offline-build` por cada CI satisfactorio, útil para revisar cambios antes de crear el tag.

## Verificar una descarga

Descarga el ZIP y `SHA256SUMS` en la misma carpeta. En macOS ejecuta `shasum -a 256 -c SHA256SUMS`; en Linux usa `sha256sum -c SHA256SUMS`. Después extrae el ZIP y abre `index.html` con la conexión desactivada. Conserva sus carpetas `runtime/` y `public/`.

No reutilices un tag publicado para otro contenido: corrige la versión y crea un tag nuevo. La entrada HTML y `runtime/` de la raíz se mantienen en Git junto con `public/` para conservar la apertura directa después de descargar o actualizar el repositorio. Los paquetes de `release/` y la copia de `dist/` permanecen ignorados.
