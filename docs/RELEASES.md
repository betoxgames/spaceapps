# Versiones finales

El código vive en Git; los archivos jugables se distribuyen en [GitHub Releases](https://github.com/betoxgames/spaceapps/releases). `pnpm build` genera `dist/index.html`, autocontenido y utilizable sin conexión. El `index.html` de la raíz es código fuente.

## Preparar una entrega

1. Termina y revisa los cambios en `main`. El registro `CHANGELOG.md` debe describir lo que realmente incluye la entrega.
2. Actualiza `version` en `package.json`: `X.Y.Z` para una versión final o `X.Y.Z-rc.1` para una candidata. La versión del tag debe coincidir exactamente.
3. Ejecuta las pruebas indicadas en el README y revisa interfaz, accesibilidad, créditos y permisos de los recursos. Guarda evidencia seleccionada en `proyecto/evidencias/`, asociada al commit o tag.
4. Confirma y sube los cambios de código. Empaqueta desde ese commit:

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

No reutilices un tag publicado para otro contenido: corrige la versión y crea un tag nuevo. La reorganización conserva el historial existente; los HTML grandes de commits anteriores siguen en ese historial, pero las nuevas compilaciones dejan de incorporarlos.
