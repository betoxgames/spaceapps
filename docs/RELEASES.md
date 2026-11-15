# Versiones finales

El repositorio incluye el juego listo para abrir en `index.html` de la raíz. `dev.html` es la entrada de desarrollo. `pnpm build` regenera el HTML autocontenido en `index.html` y `dist/index.html`; incluye el archivo de la raíz en cada commit que cambie el juego. Los paquetes versionados también se distribuyen en [GitHub Releases](https://github.com/betoxgames/spaceapps/releases).

## Preparar una entrega

1. Termina y revisa los cambios en `main`. El registro `CHANGELOG.md` debe describir lo que realmente incluye la entrega.
2. Actualiza `version` en `package.json`: `X.Y.Z` para una versión final o `X.Y.Z-rc.1` para una candidata. La versión del tag debe coincidir exactamente.
3. Ejecuta las pruebas indicadas en el README y revisa interfaz, accesibilidad, créditos y permisos de los recursos. Guarda evidencia seleccionada en `proyecto/evidencias/`, asociada al commit o tag.
4. Ejecuta `pnpm build`, incorpora el `index.html` regenerado, confirma y sube los cambios. Empaqueta desde ese commit:

```sh
pnpm release:package
```

El comando recompila y crea `release/vX.Y.Z/` con:

- `Space-Papers-vX.Y.Z.html`: juego completo para descargar y abrir.
- `SHA256SUMS`: huella SHA-256 del HTML.
- `release.json`: versión, commit de origen, tamaño y huella.

Estas carpetas generadas están ignoradas. No las añadas al repositorio.

## Crear el borrador en GitHub

Desde el commit validado de `main`, crea el tag correspondiente. Ejemplo para `version: 1.0.0`:

```sh
git tag -a v1.0.0 -m "Space Papers v1.0.0"
git push origin v1.0.0
```

El workflow **Release** vuelve a ejecutar la misma verificación de CI, recupera el HTML comprobado y crea un **borrador de GitHub Release** con los tres archivos. Las candidatas con sufijo se marcan como prerelease. Si falla la verificación o el tag no coincide con `package.json`, la entrega no se crea.

Abre el borrador en Releases, revisa las notas y descarga el HTML para comprobarlo. Publica el borrador cuando el equipo considere que esa versión está lista. En Actions también queda un artefacto `offline-build` por cada CI satisfactorio, útil para revisar cambios antes de crear el tag.

## Verificar una descarga

Descarga el HTML y `SHA256SUMS` en la misma carpeta. En macOS ejecuta `shasum -a 256 -c SHA256SUMS`; en Linux usa `sha256sum -c SHA256SUMS`. Después abre el HTML con la conexión desactivada.

No reutilices un tag publicado para otro contenido: corrige la versión y crea un tag nuevo. El HTML jugable de la raíz se mantiene en Git para conservar la apertura directa después de descargar o actualizar el repositorio. Los paquetes de `release/` y la copia de `dist/` permanecen ignorados.
