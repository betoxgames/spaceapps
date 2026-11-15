# Datos archivados

`science.json` conserva las referencias científicas usadas por el manual, incluidas sus fuentes. Se integra al compilar para mantener la consulta disponible sin conexión. Los costos, probabilidades y reglas de balance se definen en el código del juego.

`catalog.ts` define destinos, recursos, ingenieros, incidentes y operaciones. `engineer-clips.json` contiene los metadatos de los atlas; se genera con los scripts de importación de personajes. Estos datos se importan desde TypeScript y se incluyen en el script distribuido, sin cargar JSON mediante la red.
