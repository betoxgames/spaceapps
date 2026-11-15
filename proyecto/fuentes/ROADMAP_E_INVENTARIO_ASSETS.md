# Roadmap del evento e inventario de producción

Equipo: Los valar. Se revisaron las dos pestañas autenticadas, el correo completo, Details y Resources del desafío, guías oficiales y archivos del proyecto. No se reprodujeron videos. Este documento planifica

## Primero: elegibilidad y hora de entrega

La [guía de formación de equipos](https://www.spaceappschallenge.org/resources/team-formation-guide/) fija el comienzo general el **14 de noviembre de 2026 a las 09:00, hora local**. y programa el arranque local a las **10:00**. Son dos referencias diferentes: apertura general de plataforma y comienzo local de trabajo. Para Puebla, planificar la construcción desde el arranque local de las 10:00 salvo aclaración del organizador.

La interfaz autenticada identifica **Puebla / Los valar**. El programa local anuncia **entrega de soluciones el domingo 15 a las 15:30** y cierre a las 17:00. La [guía de entrega](https://www.spaceappschallenge.org/resources/project-submission-guide/) abre la pestaña Project el sábado 14 a las 09:00 y cierra la plataforma el domingo 15 a las **23:59**, según la zona de la sede. **Trabajar para entregar antes de las 15:30; no usar las 23:59 como prórroga local.** La zona de referencia de este plan es America/Mexico_City. Cualquier cambio anunciado por la sede debe confirmarse allí.

## Roadmap breve

Los bloques intermedios son una propuesta del equipo; las horas oficiales están identificadas arriba.

| Momento | Paso concreto | Resultado comprobable |
|---|---|---|
| Sáb. 14, 10:00–11:30 | Cerrar una composición 16:9, reglas conservadas y ampliación educativa mínima; repartir programación, arte, ciencia y entrega. Elegir demo de hasta 7 diapositivas. | Un boceto del escenario con zonas de lectura y lista P0 de assets; una decisión completa con costo y consecuencia de base. |
| Sáb. 14, 11:30–18:00 | Construir un recorrido completo: menú → tutorial → documentos/manual/inventario → sello → consecuencia/informe → emergencia → final. Arte produce primero escritorio, personajes y objetos. | Se puede jugar de principio a fin con cantidades del Markdown; una prueba de cada regla crítica y de cada final. |
| Sáb. 14, desde 18:00, trabajo remoto | Integrar arte por capas, audio básico, fuente NASA y ampliación de base. Publicar una primera versión de prueba con acceso público. | Una partida verificable con dos incidentes, lectura clara y decisiones educativas; enlace externo que funciona sin cuenta. |
| Dom. 15, 08:30–12:00 | Probar comprensión con jugadores, corregir bloqueos, tamaños, pausas, sonido y balance. Congelar funciones al mediodía. | El jugador explica qué pidió el ingeniero, qué exige el manual, qué tiene la base y qué sacrificó. Todos los estados P0 cubiertos. |
| Dom. 15, 12:00–15:00 | Cerrar assets, capturas, inglés, créditos y referencias; completar demo y Project; probar enlaces en sesión privada y enviar. | Confirmación visible de envío; versión publicada idéntica a la demostrada. Margen de 30 min antes de las 15:30 locales. |

Si falta tiempo, retirar P1/P2 y variantes decorativas. Conservar el recorrido completo, los cinco recursos, las dos emergencias, la consecuencia de una decisión real sobre la base y la entrega oficial. No ampliar a Marte como segunda base, Godot, cuentas o multijugador.

## Qué necesita el desafío

**Dirección fijada por el usuario:** videojuego de navegador pulido tipo *Papers, Please*: ventanilla, personajes, escritorio físico y documentos que se toman, apilan, consultan y sellan, investiga como se mueven en el juego, deben de poder manipularse igual. Menús, tutorial, opciones, pausas, créditos y finales pertenecen a ese mundo. Sin landing promocional, dashboard ni página con tarjetas que rodea un minijuego. Arte, música, textos y personajes

**Reglas vigentes que se conservan:** base lunar, cuatro tripulantes por expedición, ocho destinos ficticios, cinco éxitos distintos, dos eventos E01–E08, cinco recursos separados, inventario único sin reposición/reembolso, tres documentos, manual persistente, devolución gratuita sin informe, aprobación con gasto, revelación del resultado en su fase y tres finales por éxitos/aprobaciones. Cantidades y fórmulas en `DATOS_ESENCIALES_NAVE_Y_MISIONES.md`.

El [enunciado completo](https://www.spaceappschallenge.org/2026/challenges/junior-astronaut-mission-trainer/) pide que niños de **7–12 años** gestionen una base lunar o marciana y experimenten consecuencias de soporte vital, protección radiológica, energía, alimentos y demora de comunicaciones. Permite distintos formatos y adaptaciones creativas; no obliga a un dashboard. Recomienda dos o tres focos simultáneos y datos NASA reales, incluso un conjunto archivado honesto. La elegibilidad global exige usar al menos un dato o recurso NASA, según la guía de entrega.

**Brecha comprobada:** la campaña actual administra expediciones, no desarrolla producción alimentaria, reparto de potencia o demora de comunicaciones como decisiones de operación sostenida. E04 menciona refugio solar, pero pagar energía no calcula blindaje ni dosis. Los costos ficticios por planeta y una lista de enlaces no bastan para afirmar que ya existe una simulación científica de supervivencia.

**Propuesta nueva necesaria para cubrir esa brecha, pendiente de cerrar en Plan mode:** añadir pequeños despachos de operación de la base en el mismo escritorio entre expediciones. Presentar de uno en uno, con dos alternativas comprensibles: mantener energía en hábitat, refugio, invernadero o enlace de comunicaciones; sacrificar tiempo/ciencia/producción disponible a cambio de seguridad. Mostrar en la escena el efecto que persiste hasta el despacho siguiente. El soporte vital, la energía y la protección son los focos principales; alimentos y comunicaciones aparecen secuencialmente. Un invernadero no repone automáticamente el inventario de misiones: su producción puede alimentar un objetivo local separado; el efecto debe quedar definido y visible. El retraso de mensajes impide obtener ayuda instantánea, sin convertir la espera en tiempo muerto para el niño.

No son reglas ya aprobadas ni una exigencia oficial de usar exactamente estos despachos. Son la adaptación propuesta para cumplir el objetivo sin perder la inspección documental. **No cambiar en silencio los cinco éxitos, los dos incidentes, sus probabilidades, la fórmula de inventario ni los mínimos existentes.** El plan debe especificar los nuevos estados/costos por separado y cómo evitan doble cobro. Si necesita modificar una regla acordada, presentar el cambio y su motivo antes de implementarlo. No hay cantidades acordadas para esos sistemas nuevos.

## Inventario exhaustivo de assets

### Composición y tamaños: contrato antes de ilustrar

La versión revisada trabaja en un escenario lógico **1600 × 900**, escalado uniformemente y sin desplazamiento de página. Lo tomamos como **boceto de referencia**, no como resolución definitiva de todos los archivos. Primero aprobar la composición con un documento y el manual legibles al lado, y un aviso de emergencia que pueda moverse sin ocultar su confirmación. Verificarla también a 1280 × 720 y 1366 × 768; si el texto resulta pequeño, reacomodar el escenario o su modo de lectura antes de reducirlo todo.

Zonas de referencia: ventanilla y personaje en la parte superior (~360 px), mostrador/bandeja en el límite superior del escritorio, área libre de comparación en el centro y objetos de acción abajo. Las cinemáticas usan proyección 1600 × 760 más controles/subtítulos. Las siguientes medidas **R** describen el tamaño lógico visible de los objetos actuales y sirven para presupuestar; confirmar recortes y densidad después del boceto:

| Código de tamaño | Referencia lógica | Exportación recomendada después de validar composición |
|---|---|---|
| BG | 1600 × 900, 16:9 | Raster 3200 × 1800 si se requiere 2×; ajustar encuadre seguro |
| F | 1600 × 760 | Capas al tamaño de proyección; raster 3200 × 1520 a 2× |
| R | Interior actual 1200 × 360 | 2400 × 720 a 2×; no hornear escritorio ni controles dentro |
| P | Retrato 240 × 300 | 480 × 600 transparente a 2×, mismo encuadre y pivote |
| D | Hoja 270 × 355 | Marco/textura 540 × 710 a 2×; cifras y texto mediante código |
| M | Manual abierto 740 × 430 | Marco 1480 × 860 a 2× o piezas escalables; huecos libres para texto |
| L | Consulta 410 × 420 | Marco 820 × 840 a 2×; inventario y registro comparten base |
| E | Aviso y depósito 800 × 460 | Marco 1600 × 920 a 2×, con barra de agarre y contenidos separados |
| UI | Controles por concretar en boceto | SVG escalable; iconos sobre cuadrícula 24/32 px y blancos táctiles ≥44 px cuando proceda |
| S | Sprite dentro de F | Caja según encuadre aprobado; exportar 2×, pivote, escala y espacio de movimiento comunes |

Para estilo pixel art, elegir una cuadrícula menor que divida la composición y escalar por enteros; no mezclar píxeles con ilustración filtrada por accidente. Es una opción estética, **no una decisión previa**. Entregar editables por capas (SVG/PSD/Krita/Aseprite según herramienta) y exportaciones PNG transparentes o WebP para fondos. Un atlas debe incluir metadatos de fotograma/pivote. Evitar texto esencial dentro de las imágenes.

**Prioridades:** P0 = indispensable para entregar la experiencia definida; P1 = mejora importante si P0 ya funciona; P2 = opcional. **V** = elemento existente cuya mecánica se conserva, pero su arte final sigue pendiente. **N** = propuesta nueva; N/P0 es imprescindible si se adopta esa ampliación, no una mecánica antigua. Una pieza puede reutilizarse en varias escenas; no encargar imágenes duplicadas.

### Arte que debe entregar el equipo

| ID | Asset o conjunto y función | Variantes / estados que cubrir | Formato y tamaño recomendado | Origen / prioridad |
|---|---|---|---|---|
| A01 | Identidad ÓRBITA y emblema propio Los valar | Claro/oscuro, horizontal, monocromo; título accesible aparte | SVG; tamaño según BG/UI | V/P0 |
| A02 | Fondo de menú dentro del mundo lunar | Quieto; capas de cielo/base para movimiento suave opcional | WebP/PNG por capas, BG | V/P0 |
| A03 | Interior de la oficina, ventanilla y mostrador | Ventanilla ocupada/vacía; capas detrás y delante del personaje | PNG/WebP, R más recortes del boceto | V/P0 |
| A04 | Superficie de escritorio y borde frontal | Área despejada para leer; sombra y borde como piezas separadas | PNG/WebP, recorte de BG; 2× tras boceto | V/P0 |
| A05 | Bandeja de llegada/devolución y labio del mostrador | Vacía, hojas presentes; delante/detrás de papeles | PNG transparente o SVG; ancho de tres D en miniatura | V/P0 |
| A06 | Utilería mínima del escritorio | Base de sellos, zona de manual, indicador de sector | SVG/PNG; UI y recortes del boceto | V/P0 |
| A07 | Retratos de los nueve ingenieros | Nico cómico, Ada analítica, Leo tímido, Max lanzado, Sol optimista, Dante dramático, Vera formal, Teo distraído, Ren competitivo; neutral de los nueve | PNG transparente, P; diseño original adulto ficticio | V/P0 |
| A08 | Expresiones y poses de ingenieros | Hablar/esperar/retirar documentos; alegría, preocupación y tristeza donde se usen. El código actual no exige nueve expresiones para cada uno | PNG/atlas, P; cuadro y pivote compartidos | N/P1; neutral P0 en A07 |
| A09 | Técnico de emergencias | Figura reutilizable; poses de aviso, trabajo y estabilización son mejoras nuevas, no arte existente | PNG/atlas transparente; P o S según escena | Figura V/P0; poses N/P1 |
| A10 | Personaje para escena de evaluación/oficina | Neutral, contento, triste; reutilizar Ada si no se diseña supervisor nuevo | PNG, P ampliable dentro de F | V/P0; supervisor distinto N/P2 |
| A11 | Tres familias de papel | Plan de vuelo, soporte de vida, impulso/energía; borde, firma ornamental y distintivo sin datos impresos | PNG transparente o SVG, D; tres tintes accesibles | V/P0 |
| A12 | Carpeta/sobre de expediente | Entrada, abierta, retirada; agrupa visualmente la propuesta | PNG/SVG, caja según D/bandeja | N/P1; no añadir pasos obligatorios |
| A13 | Manual físico | Tapa/lomo, doble página, bordes, separadores; hoja de cambio opcional | PNG por piezas o SVG, M | V/P0 para abierto; tapa/cierre ilustrado P1 |
| A14 | Ilustraciones del manual | Ocho destinos, Luna de referencia y esquema transporte/módulo; misma iconografía de escenas. El manual actual usa nombres y cifras | SVG o PNG; miniaturas del espacio aprobado de M | N/P1; se pueden reutilizar A26/A29/A30 |
| A15 | Libreta/hoja de inventario | Abierta y marco; reutilizable para registro | PNG/SVG, L | V/P0 |
| A16 | Libreta/hoja de registro | Un marco reutilizado; vacío/con entradas y páginas son contenido por código | Reutiliza A15, L; marcas SVG | V/P0 |
| A17 | Dos sellos físicos y soporte | Aprobar y devolver: reposo, tomado/seleccionado, contacto/presión y regreso | PNG por piezas o SVG; UI según boceto | V/P0 |
| A18 | Tinta de sello | Autorizado/devuelto; fresca, asentada; marca legible más gesto opcional | SVG/PNG transparente, ancho dentro de D; texto por código | V/P0 |
| A19 | Iconografía de cinco recursos | Comida, agua, O₂, propelente, energía; claro/oscuro, pequeño/grande | SVG, UI 24/32; palabra/unidad siempre presentes | V/P0 |
| A20 | Iconos funcionales | Manual, inventario, registro, guardar hojas, fijar/soltar, cerrar, anterior/siguiente, pausa, sonido/silencio, pantalla completa, ayuda, repetir y volver | SVG, UI; estados visibles por código | V/P0 |
| A21 | Cursor temático | Normal, agarrar, agarrando, acción no disponible; hotspot por estado | SVG/PNG 32/64 px si se aprueba; cursores nativos de respaldo | N/P1 |
| A22 | Dispositivo de emergencia y marco de aviso | Reposo, aviso, urgencia, aporte elegido, confirmado/bloqueado; piezas sin números horneados | PNG/SVG por capas, E | V/P0 |
| A23 | Pictogramas de los ocho incidentes | Esclusa, O₂, depósito agua, refugio solar, ventilación/depurador, raciones, enfriamiento, alimentación almacén; nombre y explicación textual siempre disponibles | SVG, UI 32/64; uno por E01–E08 | N/P1; texto identificador P0 por código |
| A24 | Marco del parte de operaciones | Éxito, carencia y emergencia; sin color/texto de resultado antes de tiempo | SVG/PNG por piezas; hoja lógica actual 800 × 730 | V/P0 |
| A25 | Cielo/espacio de cinemáticas | Fondo neutro reutilizable, estrellas en capa opcional | WebP/PNG, F | V/P0 |
| A26 | Luna y ocho planetas vistos desde espacio | Mercurio, Venus, Tierra, Marte, Júpiter, Saturno, Urano, Neptuno, Luna; anillos de Saturno separados si pasan detrás de nave | PNG transparente/SVG, cajas S dentro de F | V/P0 |
| A27 | Superficies de operaciones | Luna, Mercurio, Venus, Tierra y Marte; Venus explícitamente ficticia. Ninguna superficie de gigantes | WebP/PNG por capas, banda/suelo de F | V/P0 |
| A28 | Plataforma lunar | Base, estructura y primer plano separado de nave | PNG transparente/SVG, S | V/P0 |
| A29 | Transporte orbital común | Perfil/vista que permita viaje ida/regreso, acoplamiento, detenido | PNG/SVG transparente, S; evitar espejar texto/piezas asimétricas | V/P0 |
| A30 | Módulo local de tripulación | En plataforma, ascenso, acoplamiento, descenso y aterrizado; patas/motores en capas si hace falta | PNG/SVG/atlas, S | V/P0 |
| A31 | Base lunar exterior | Normal, intervención, estabilizada, pérdida; piezas para daño sin personas heridas | PNG por capas, S/F | V/P0 |
| A32 | Equipo de reparación | Consola/herramientas para intervención genérica, activo/estable | PNG/SVG, S | V/P0 |
| A33 | Variantes visuales de incidente | Esclusa atascada/cerrada, reserva O₂, agua aislada/limpia, refugio abierto/activo, depurador detenido/activo, raciones separadas, enfriamiento reparado, almacén sin/con luz | PNG por capas/atlas, S | N/P1; aportan causa/efecto específico |
| A34 | Efectos de propulsión | Encendido, pluma, apagado; ascenso y maniobra | Atlas PNG transparente o vector animable, S | N/P1 arte específico; efecto simple por código P0 |
| A35 | Efectos de fallo por recurso | Cinco símbolos/estados de carencia; pérdida de empuje/energía o señal según fase | SVG/PNG, UI/S; se combinan con lugar real de fallo | V/P0 |
| A36 | Pérdida de la base | Destello contenido, humo/fragmentos simbólicos y base dañada; alternativa sin flash | Capas PNG/atlas, F/S; movimiento reducido equivalente | V/P0 sencillo; partículas P2 |
| A37 | Oficina de evaluación y ventanal | Una escena reutilizada para tres finales, con clima por luz/pose | WebP/PNG, F y recortes | V/P0 |
| A38 | Props de finales | Certificado, orden de traslado/documentos, aviso de despido; áreas para texto dinámico | SVG/PNG, D o recorte F | V/P0 |
| A39 | Marcos de menú, pausa, opciones y créditos | Placa/panel del mundo del juego; misma gramática y materiales | Piezas SVG/PNG escalables; UI según composición | V/P0 |
| A40 | Tutorial: soporte visual | Hoja/tablilla de instructor, flecha/mano ilustrada si se adopta | SVG/PNG; panel actual 590 px de ancho como referencia | V/P0 marco; mano N/P1 |
| A41 | Ficha de ciencia y fuentes dentro del mundo | Sello editorial propio, ilustración pequeña, separación ciencia/cálculo/balance | SVG/PNG, M/D; contenido legible mediante código | N/P0 |
| A42 | Hábitat/refugio/invernadero/antena | Pequeña vista de base que muestre el resultado de despachos; no otro tablero web | PNG/SVG por capas, espacio de escena a fijar | N/P0 si se adopta la ampliación educativa |
| A43 | Estados de operación de base | Hábitat operativo/restringido; refugio activo; cultivo con luz/en espera; antena enviando/mensaje pendiente/recibido | SVG/atlas, mismas cajas A42 | N/P0 si se adopta; vegetación detallada P1 |
| A44 | Papeles de operación nueva | Orden de potencia, protocolo refugio, parte de cultivo, telegrama con demora y parte de consecuencia | Reutilizar D/M/L; encabezados por código, pictogramas SVG | N/P0 si se adopta; no ampliar el HUD |
| A45 | Tipografías | Una familia de lectura y números tabulares; una de título opcional; español/inglés, acentos, O₂, flechas y unidades | WOFF2 con licencia redistribuible; tamaños desde boceto | P0 lectura; P1 título |
| A46 | Materiales decorativos | Desgaste, tornillos, lámparas, polvo, grano y utilería adicional | PNG/SVG pequeños y repetibles, UI/BG | N/P2; nunca detrás de cifras |
| A47 | Imagen de acceso/publicación | Favicon, imagen social, miniatura del proyecto e imagen principal; identidad propia | SVG/PNG; 32/48 px favicon, social 1200 × 630 propuesta | Captura N/P0; favicon/social N/P1 |
| A48 | Assets de demo oficial | Hasta siete diapositivas con capturas reales del juego y un diagrama de costo→consecuencia; alternativa video ≤30 s | PPTX/PDF o video externo; 16:9 propuesto, imágenes ≤10 MB para Project | N/P0; crear durante evento según elegibilidad |

### Elementos que conviene construir mediante código

El equipo entrega marcos, ilustraciones y textura; el código mantiene texto, números, foco, eventos y límites de interacción. No pedir un PNG distinto por cada cifra, pantalla o combinación de recursos.

| ID | Elemento / función | Estados, variantes y contenido que debe cubrir | Formato / dimensiones de referencia | Prioridad |
|---|---|---|---|---|
| C01 | Escenario y cámaras | Menú, escritorio, cine, informe, tutorial, final; escalado, márgenes seguros y pantalla completa | Composición BG/F con capas; HTML/CSS/SVG/canvas según plan | P0 |
| C02 | Texto de tres documentos | IDs, autor, ruta ida/retorno, 4 personas, tipo de operación, cinco pedidos y unidades; suficiente/insuficiente sin delatar respuesta | Texto real en D; miniatura en bandeja y tamaño fijo de lectura | P0 |
| C03 | Manipulación de objetos | Tomar, frente, arrastrar, soltar, superponer, guardar, recoger y entregar; límites para no perder objetos | Coordenadas lógicas, puntero y teclado; D/M/L/E | P0 |
| C04 | Manual completo | Índice; selector vacío de 8 destinos y 8 fichas con 5 mínimos/tipo de operación; reglas; instrucciones de emergencias. Conserva selección/posición entre visitantes | Texto y pestañas en M; páginas dinámicas | P0 |
| C05 | Páginas educativas nuevas | Fuentes/ciencia frente a ficción; soporte vital, energía/protección, cultivo, comunicaciones; procedimiento E01–E08 si se incorpora al manual | Texto real M; diagramas SVG reutilizables, sin párrafos largos | N/P0 para ciencia y ampliación; catálogo ilustrado P1 |
| C06 | Inventario | Cinco saldos y unidades, normal/cero; sin indicar validez de propuesta ni revelar presupuesto futuro | Texto real L; números tabulares | P0 |
| C07 | Registro y bitácora final | Vacío, 4 entradas por página, devuelta/éxito/fallo/emergencia, página anterior/siguiente deshabilitada donde corresponda | Texto L y panel final; historial inmutable | P0 |
| C08 | Sellos y tinta | Reposo, hover, foco, presionado, bloqueado, estampado y retorno; dos decisiones, cobro único | Dos objetos UI y tinta dentro de D | P0 |
| C09 | Consultas del escritorio | Manual B, inventario I, registro R, guardar hojas, poner hoja al lado, fijar/soltar, cerrar | Controles UI con etiqueta, foco y estado activo/ocupado | P0 |
| C10 | Desempeño visible | 0–5 éxitos, aprobaciones, “Sin evaluar”, porcentaje mostrado; actualizar después de consecuencia | Rótulo físico/placa; sin spoilers | P0 |
| C11 | Emergencia completa | Aviso dragueable, identificación, requisito, 30 s, barra 0–máximo permitido, cantidad, probabilidad efectiva y confirmar; normal/urgente/bloqueado/expirado | Texto/controles E; reloj y barra sin rasterizar | P0 |
| C12 | Informe de operaciones | Tras consecuencia: mínimo/pedido/gastado/saldo, carencias y explicación; misión exitosa, fallida, stock insuficiente, incidente resuelto/fallido | Texto/tabla en hoja 800 × 730 de referencia | P0 |
| C13 | Tutorial de 3 lecciones | 29 pasos actuales: aprobar al mínimo, detectar falta de comida y devolver, aportar en emergencia; sin reloj primero, luego 30 s. Pista/reintento/reiniciar/salir y resumen | Guía diegética más foco/resaltado que no tape objetivo | P0; adaptar al nuevo contenido si se adopta |
| C14 | Controles generales | Iniciar, aprender, opciones, créditos; pausa/continuar/salir; volumen/silencio/movimiento reducido; F pantalla completa | UI con normal/hover/foco/presionado/deshabilitado; paneles A39 | P0 |
| C15 | Créditos y atribuciones | Integrantes reales pendientes; fuentes NASA, licencias, agradecimientos y uso de IA/SI; EN y ES si hay cambio de idioma | Texto real en panel; enlaces externos opcionales | P0 |
| C16 | Finales | Certificado 100%, oficinas >40% y <100%, despido ≤40% o derrota; resumen, bitácora, semilla, menú y otro turno | Texto/cifras sobre A37/A38 | P0 |
| C17 | Despachos educativos nuevos | Dos alternativas, costo/beneficio, decisión sellada, estado de base visible y consecuencia persistente; sin responder por el jugador | D/M más A42–A44; costos nuevos separados | N/P0 si se adopta |
| C18 | Ciencia trazable | Dato archivado con ID, fecha, unidad, enlace y regla de uso; distinguir dato, cálculo y balance; sin API obligatoria | JSON legible con procedencia más página M/ficha D | N/P0 |
| C19 | Accesibilidad e idioma | Foco visible, navegación ordenada, controles por teclado, nombres accesibles, texto de alertas y equivalentes sin sonido/color; inglés completo para entrega | Texto real; fuentes WOFF2/sistema; sin PNG de párrafos | N/P0 inglés; demás controles V/P0 |
| C20 | Carga y problemas de acceso | Cargando/listo, fallo de asset con respaldo legible, JS desactivado, orientación/ventana pequeña si resulta necesaria; reintento sin cobrar otra vez | Panel del mundo, UI; no landing extra | N/P0 respaldo básico; aviso adaptable P1 |

### Animaciones y transiciones: entregar piezas, programar secuencias

| ID | Secuencia necesaria y variantes | Arte / ejecución y tamaño | Prioridad |
|---|---|---|---|
| M01 | Menú→turno, llegada/espera/salida de ingeniero | Personaje P y oficina R; posición/ritmo por código | V/P0 |
| M02 | Tres hojas: llegada pequeña→tomar→arrastre/frente→reposo; guardar y recoger al sellar | D, sombras y escala por código; no ampliar por doble clic | V/P0 |
| M03 | Manual abrir/cerrar, cambio de sección/página, fijar; consulta inventario/registro y paginar | M/L; persistir estado, no reiniciar al cambiar visitante | V/P0 |
| M04 | Sello: selección/presión/tinta/levantada; entregar papeles e ingeniero retira | A17/A18 + D; bloqueo contra doble decisión. Actualmente se pulsa un sello y aparece tinta; el movimiento físico es objetivo nuevo de pulido | Sellado/entrega V/P0; movimiento del sello N/P0 sencillo; mano adicional N/P1 |
| M05 | Preparación, ascenso, transferencia, viaje de ida | F+S: módulo/transporte/fondo independientes | V/P0 |
| M06 | Destino sólido: órbita y descenso de módulo; gigante: solo órbita | F+S, 4 sólidos/4 gigantes y retorno lunar | V/P0 |
| M07 | Regreso, descenso lunar, cierre de misión | F+S; reusar A27/A30/A31. Mejorar continuidad visual entre cortes; el storyboard actual cambia de escena | Secuencia V/P0; continuidad nueva N/P0 sencilla |
| M08 | Fallos en despegue/ida/destino/regreso por recurso | Combinar fase con icono de A35; no 20 películas distintas | V/P0 |
| M09 | Aparición de emergencia, urgencia y confirmación/expiración | E/UI; cuenta automática, reloj no depende de animación | V/P0 |
| M10 | Intervención neutral→estabilización o explosión/pérdida | F+S; no revelar resultado en intervención previa | V/P0 |
| M11 | Parte de operaciones→archivo→siguiente visitante/incidente/final | Hoja y escena coherente; devolución omite este informe | V/P0 |
| M12 | Certificado/oficinas/despido y nueva partida | A37/A38; contenido y cambios por código | V/P0 |
| M13 | Progreso tutorial, foco/ayuda/error y resumen | UI; realce sin animación obligatorio como respaldo | V/P0 |
| M14 | Estado nuevo de base y entrega diferida de telegrama | Capas A42/A43, actualización al momento definido | N/P0 si se adopta |
| M15 | Pausa/reanudar y pestaña oculta; movimiento reducido | Congelar TODOS los movimientos, reloj, salidas y fases; variante estática equivalente | V/P0 |
| M16 | Microanimaciones ambientales, parpadeo y gestos extra | Capas separadas, nunca sobre datos | N/P2 |

Las escenas actuales duran aproximadamente 1.68–2.16 s por fase normal, más cierre breve; fallo 2.88 s. Son referencia de ritmo, no duración obligatoria. Conservar control de velocidad ×1/×4 y “Ver desenlace”: saltar muestra primero la consecuencia y después el informe, sin resolver ni cobrar otra vez. No reproducir un vuelo posterior a un despegue imposible. Movimiento reducido conserva información y no cambia las reglas del reloj.

### Sonido y música

Hoy hay cinco señales sintetizadas mediante Web Audio: papel, sello, alarma, resultado favorable y desfavorable. No hay banda sonora ni voz entregada. La siguiente es la lista de producción, con sustituciones posibles por síntesis propia.

| ID | Sonido / función | Variantes y estados | Formato / duración orientativa | Prioridad |
|---|---|---|---|---|
| S01 | Papel tomado, dejado, recogido y entregado | 2–3 tomas suaves para no repetir una muestra idéntica | Maestro WAV 48 kHz, mono; entrega OGG + MP3/AAC; 0.1–0.8 s | P0 |
| S02 | Manual/registro | Abrir/cerrar y página; distinguir de sello | Mismo formato, 0.2–0.8 s | P0, puede reutilizar S01 |
| S03 | Sello físico | Golpe y retirada; ambas decisiones, sin anticipar éxito de misión | WAV/OGG, 0.1–0.5 s | P0 |
| S04 | Controles | Selección/confirmación/foco opcional; error de acción disponible | WAV/OGG o síntesis, <0.3 s | P0 confirmación; hover P2 |
| S05 | Emergencia | Aviso, urgencia discreta, aporte confirmado; detener al pausar/resolver | WAV/OGG o síntesis; alarma corta/bucle sin corte | P0 |
| S06 | Nave y operaciones | Encendido, ascenso, acoplamiento, motor/maniobra, aterrizaje | WAV/OGG, 0.5–3 s; mono espacializable | N/P1; mezcla sencilla P0 si cabe |
| S07 | Consecuencias | Éxito, misión fallida, sistemas recuperados, pérdida de base | WAV/OGG o síntesis, 0.3–2 s; solo tras revelación | P0 |
| S08 | Finales | Certificado, oficinas, despido; tres cierres breves | WAV/OGG, 1–4 s o variantes de S07 | P0 sencillo |
| S09 | Ambiente de base | Ventilación y equipos en bucle; versión alerta opcional | Maestro WAV estéreo 48 kHz, OGG/MP3; 15–45 s sin costura | N/P1 |
| S10 | Música | Menú/turno, tensión y cierre; temas o capas reutilizables | WAV maestro, OGG/MP3 estéreo; bucles 30–90 s con entradas/salidas | N/P1; tema extra P2 |
| S11 | Nuevos sistemas de base | Radio/enlace, mensaje pendiente/recibido, refugio, cultivo; equivalente visual obligatorio | WAV/OGG/síntesis, 0.2–1.5 s | N/P1; señal visual P0 |
| S12 | Voces | Balbuceo estilizado o locución EN/ES, solo si equipo decide | WAV/OGG por línea, transcripción y permisos | N/P2; no necesarias |

Habilitar audio tras la primera interacción del jugador; volumen/silencio efectivos en todos los estados, sin picos ni muestras acumuladas. Para música añadir canal separado solo si se implementa: no es ajuste existente. Silenciar o reducir movimiento nunca impide comprender una emergencia. Comprobar licencias de fuentes y audio, no solo imágenes.

### Paquete y revisión del inventario

Durante el evento, cada pieza tendrá ID, autor, fecha de creación, origen/licencia, estado (pendiente/aprobada/integrada/verificada), tamaño lógico, tamaño exportado, transparencia, pivote, fotogramas y estados usados. Registrar también usos de IA/SI. Esta relación puede ser un manifiesto simple; no hace falta otra aplicación.

Antes de cerrar: recorrer inicio, cada lección, todas las consultas del libro, registro vacío y paginado, ambos sellos, las cuatro etapas de fallo, los ocho incidentes, pausa durante arrastre, las tres salidas y las opciones. Verificar cada ID de estas tablas o marcarlo explícitamente como descartado P1/P2. Un slot en código antiguo o un estilo CSS sin uso no prueba que exista una pantalla activa. La escena antigua de rechazo y las cuatro emergencias E1–E4 no entran al inventario vigente.

## Fuentes y datos que incorporar

Se leyó la pestaña Resources completa. Para la opción lunar:

| Recurso oficial | Qué aporta / decisión de uso |
|---|---|
| [NASA Open APIs](https://api.nasa.gov/) | Puerta de acceso. Una API en vivo no es obligatoria; no exponer claves ni hacer depender la partida de conexión externa. |
| [DONKI](https://ccmc.gsfc.nasa.gov/tools/DONKI/) | Alerta solar basada en un registro archivado identificable. La página actual anuncia migración a `ccmc.gsfc.nasa.gov`; revisar sus [API docs](https://ccmc.gsfc.nasa.gov/DONKI/api/). Registrar ID, fecha, tipo y qué campo usa la escena. No convertir una llamarada en una dosis lunar inventada. |
| [OSDR](https://osdr.nasa.gov/bio/repo/) y su [búsqueda](https://osdr.nasa.gov/osdr/data/search?term=KEYWORD) | Hallazgos reales sobre salud/biología para dar fundamento al soporte vital o cultivos. Seleccionar un estudio concreto y describir su alcance. |
| [RadLab](https://visualization.osdr.nasa.gov/radlab/gui/data-api/) | Dosis medidas en ISS. Útil como comparación educativa; no trasladar una dosis ISS a Luna sin modelo justificado. |
| [Mars Trek](https://trek.nasa.gov/mars/) | Relieve/imagen marciana: opcional para este juego de base lunar; no es razón para ampliar el alcance a otra base. |
| [CSA: recursos STEM](https://www.asc-csa.gc.ca/eng/youth-educators/resources-stem-and-youth-organizations.asp) y [producción alimentaria](https://www.asc-csa.gc.ca/eng/youth-educators/toolkits/food-production/) | Lenguaje/actividades de alimentación y cultivo. Recurso de agencia socia; no reemplaza por sí solo el requisito de un recurso NASA. Se revisó la página de la guía alimentaria sin abrir sus videos. |

No se descargó un registro DONKI ni se eligió un estudio OSDR concreto en esta preparación: no hay que afirmar que ya están integrados. Incorporarlos durante el evento según el alcance permitido. Un archivo curado con ID, enlace, fecha/unidades y transformación documentada es suficiente como estrategia técnica; declararlo archivado. Mantener los números del juego como balance, separados de datos reales. Una probabilidad de emergencia del 50% es regla didáctica, no predicción de NASA.

## Correo, ofertas y apoyo

Se leyó íntegro el correo **“The Hackathon is Kicking off! Plus, Global Offers are Live!”**, de NASA Space Apps. Remite a entrega, evaluación, FAQ, Connect y ofertas; también enlaza una lista de videos que no se abrió. Las [Global Offers](https://www.spaceappschallenge.org/2026/global-offers/) son opcionales y no requieren comprar para participar; algunas sí solicitan verificación o pruebas con posible renovación.

| Oferta revisada | Utilidad y límite para ÓRBITA |
|---|---|
| GoDaddy Registry / Porkbun | Dominio no premium, hosting y SSL un año según la oferta. Antes de elegirlo, comprobar que el hosting permite publicar los archivos del videojuego y sus tipos de archivo; la página no demuestra esa compatibilidad. No bloquear la entrega por obtener dominio propio. |
| Google Cloud | La oferta anuncia USD 300 durante 90 días y verificación con tarjeta, sin cargo automático salvo actualización manual. Firebase puede servir; para un juego estático no se necesita montar infraestructura adicional. |
| Microsoft Azure | Hasta USD 200 por 30 días para nuevos clientes elegibles; puede pedir tarjeta/teléfono y cuenta. Alternativa de publicación si el equipo ya lo maneja. |
| GitHub Copilot / Microsoft Copilot | Asistencia opcional de desarrollo/contenido, no nueva mecánica del juego. Copilot Free se describe sin tarjeta y con cuotas. Registrar el uso de SI. |
| Miro | Plantillas para coordinación; Education sujeto a elegibilidad. Business es prueba de 14 días con datos de pago y cancelación para evitar cargos; no hace falta para llevar el inventario. |
| Microsoft Teams | Coordinación remota opcional; Free anuncia reuniones hasta 60 min/100 personas y 5 GB por usuario. |
| Meteomatics / Planetary Computer | Meteorología/ambiente terrestre no necesarios para el alcance lunar. No añaden cumplimiento NASA por estar en las ofertas. Meteomatics anuncia 1,000 consultas/día durante el hackathon. |

No se canjeó ninguna oferta ni se registró cuenta alguna, pero si crees que nos sirva alguna, avisanos. La [guía Connect](https://www.spaceappschallenge.org/resources/space-app-connect-guide/) confirma GitHub Discussions como canal de apoyo; buscar antes de publicar preguntas. No se envió ningún mensaje. Para la ciencia, consultar Challenges; para entrega, Project Submission Help.

## Publicación y entrega oficial

Según la [guía de entrega](https://www.spaceappschallenge.org/resources/project-submission-guide/), preparar nombre, resumen, enlace a demo, enlace al proyecto final, descripción de funcionamiento/herramientas, uso de SI, uso de datos NASA y referencias. Demo **video de hasta 30 segundos o hasta siete diapositivas incluyendo portada/introducción**; elegimos planear diapositivas para evitar depender de producción audiovisual. Es una propuesta de producción, no un requisito de usar slides.

Página, materiales vinculados y juego para jurados disponibles en **inglés**; español adicional si se implementa. Un video puede hablar otro idioma con subtítulos ingleses. Enlaces públicos sin registro ni permisos. Project admite JPG/PNG/GIF de hasta 10 MB, pero los documentos/videos se alojan fuera. Clasificación FortiGuard es recomendación opcional, no requisito de envío. Preparar una publicación estática sin cuentas y probar desde sesión privada.

Registrar todas las fuentes, licencias y herramientas, incluso las abiertas. Los [términos](https://www.spaceappschallenge.org/legal/) requieren disponibilidad pública y derechos de redistribución del contenido, con licencia compatible con sus condiciones; elegir licencia del proyecto y documentar la de cada recurso.

La guía permite SI como asistencia, pide describir dónde/cómo se utilizó y restringe su uso para originar la solución. La idea central aquí procede del equipo; las ampliaciones sugeridas por Codex se deben identificar y revisar humanamente. Imágenes/videos generados con SI: marca visible; audio/código/datos: reconocimiento en texto descriptivo y metadatos. No generar, modificar ni incorporar marcas/diseños de NASA en contenido generado. Esto no equivale a prohibir toda atribución textual a NASA.

Todos los integrantes deben estar confirmados en la misma sede y en Members; máximo seis. Puebla/local admite desde una persona; Universal exige al menos dos para evaluación global. Guardar progreso no sustituye **Submit for Judging**. El responsable humano revisará originalidad y aceptará los términos al enviar, y verificará el banner de confirmación. Conservar captura del envío y enlaces finales. La [rúbrica](https://www.spaceappschallenge.org/resources/judging-awards-guide/) valora impacto, creatividad, validez, relevancia y presentación.

## Registro breve de la revisión y contradicciones resueltas

Se repartió la revisión en tres tareas Terra: cantidades, mecánicas y assets. La integración principal contrastó las conclusiones con `data.js`, `domain.js`, `game.js`, `story.js`, las fichas de nave/superficie y el registro posterior; también abrió el juego en navegador y comprobó menú, escritorio y manual. No se ejecutaron de nuevo los tests ni los generadores. Se leyeron sus contenidos; las pruebas históricas no se presentan como nuevas ejecuciones. Los CSV/JSON raíz fueron parseados completos y comparados en los campos de sus tablas correspondientes. Los archivos `.DS_Store` son metadatos del sistema, no fuentes del diseño.

| Fuente anterior / aparente contradicción | Resolución comprobada |
|---|---|
| V3 orbital vs fichas con aterrizaje vs catálogo de ocho destinos | Arquitectura de referencia → extensión superficial técnica → balance ficticio ampliado. No mezclar cantidades ni heredar validación física. |
| Tabla V3 con 11,520 kg comida y electricidad calculada | La referencia redondeada y balanceada conserva 11,500 y 1,100,000 para Luna–Marte. El catálogo actual manda. |
| Inventario anterior garantiza recorrido, tres dificultades, E1–E4 | Motor actual solo modo normal/lunar: cinco destinos de referencia, 10%, dos E01–E08; no garantiza itinerarios distintos. |
| Apuntes de Notion: reloj manual/20 s, zoom o escena al devolver | Registro posterior y código fijan 30 s automáticos, hoja de lectura fija y devolución continua sin informe/cinemática. |
| Arte descrito como colorido o slots disponibles | El juego sigue usando rectángulos provisionales. No hay paquete de arte final que se pueda dar por entregado. |

La preparación se entrega fuera de la carpeta del proyecto, en tres Markdown portables. Para reconstruir sin historial basta llevar el prompt y `DATOS_ESENCIALES_NAVE_Y_MISIONES.md`: el prompt incluye su propio inventario resumido y las reglas necesarias. Este roadmap amplía el encargo de producción y las fuentes; no es dependencia oculta.
