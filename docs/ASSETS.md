# Space Papers — inventario de producción

Vinculación de trabajo: [proyecto del equipo en Notion](https://app.notion.com/p/41888b30c7518133a4d7c02aee475e0c?pvs=204). Lista derivada del inventario aceptado, adaptada a Space Papers y sus tres operaciones de base; los ejemplos son alcance de producción, no prueba de que el equipo ya haya entregado arte. Las cifras, prioridades y variantes aún deben cotejarse en ejecución. Los SVG geométricos actuales son provisionales y originales generados por código; el arte final lo produce el equipo. Los elementos dinámicos no llevan cifras, texto esencial ni instrucciones horneadas.

**Estados:** el arte final A y audio S están **pendientes** salvo que el equipo registre una entrega; la funcionalidad C/M es **provisional / por verificar** hasta su integración y prueba. No se afirma que cada entrada esté implementada. Las propuestas P1/P2 pueden descartarse. P0 es la experiencia mínima exigida, no una promesa de ilustración separada para cada variante. Responsable por función: **arte** (A), **desarrollo** (C/M), **sonido** (S); cada función requiere asignación nominal por el equipo. Integración y licencias: responsable de entrega.

**Contrato de composición:** espacio lógico inicial 1600 × 900, sin scroll de página; documento 300 × 400 en lectura; ventanilla superior, escritorio libre, manual y hoja simultáneamente legibles, alerta movible y sus controles accesibles. Probar a 1280 × 720 y 1366 × 768 y reacomodar cuando haga falta. Las referencias restantes son retrato 240 × 300, manual 740 × 430, inventario/registro 410 × 420, emergencia 800 × 460, proyección 1600 × 760: no son encargos de tamaño fijo. Tras aprobar boceto, raster transparente PNG/WebP a 2× de la caja visible; SVG para geometría escalable. Conservar editables, capas y pivotes. M = manual; D = papel 300 × 400; L = libreta; E = emergencia; F = escena; BG = fondo; P = retrato; S = sprite; UI = controles. Garantizar inglés completo, acentos, O₂ y cifras tabulares.

Cada entrega debe registrar ID, autor, origen y licencia, fecha, estado (pendiente/aprobado/integrado/verificado), tamaño visible/exportado, transparencia, pivote, fotogramas y estados consumidos; añadir atribución de IA cuando corresponda. Prioridades mixtas se aplican a variantes dentro de la fila. **Nuevo** identifica la ampliación de base y su documentación, no algo ya producido.


## Arte: equipo de arte; estado final pendiente

| ID | Función | Variantes / estados | Formato / referencia | Prioridad / condiciones |
|---|---|---|---|---|
| A01 | Identidad Space Papers y emblema propio Los valar | Claro/oscuro, horizontal, monocromo; título accesible aparte | SVG; tamaño según BG/UI | P0 |
| A02 | Fondo de menú dentro del mundo lunar | Quieto; capas de cielo/base para movimiento suave opcional | WebP/PNG por capas, BG | P0 |
| A03 | Interior de la oficina, ventanilla y mostrador | Ventanilla ocupada/vacía; capas detrás y delante del personaje | PNG/WebP, R más recortes del boceto | P0 |
| A04 | Superficie de escritorio y borde frontal | Área despejada para leer; sombra y borde como piezas separadas | PNG/WebP, recorte de BG; 2× tras boceto | P0 |
| A05 | Bandeja de llegada/devolución y labio del mostrador | Vacía, hojas presentes; delante/detrás de papeles | PNG transparente o SVG; ancho de tres D en miniatura | P0 |
| A06 | Utilería mínima del escritorio | Base de sellos, zona de manual, indicador de sector | SVG/PNG; UI y recortes del boceto | P0 |
| A07 | Retratos de los nueve ingenieros | Nico cómico, Ada analítica, Leo tímido, Max lanzado, Sol optimista, Dante dramático, Vera formal, Teo distraído, Ren competitivo; neutral de los nueve | PNG transparente, P; diseño original adulto ficticio | P0 |
| A08 | Expresiones y poses de ingenieros | Hablar/esperar/retirar documentos; alegría, preocupación y tristeza donde se usen. El contrato no exige nueve expresiones para cada uno | PNG/atlas, P; cuadro y pivote compartidos | nuevo/P1; neutral P0 en A07 |
| A09 | Técnico de emergencias | Figura reutilizable; poses de aviso, trabajo y estabilización son mejoras nuevas, no arte existente | PNG/atlas transparente; P o S según escena | Figura P0; poses nuevo/P1 |
| A10 | Personaje para escena de evaluación/oficina | Neutral, contento, triste; reutilizar Ada si no se diseña supervisor nuevo | PNG, P ampliable dentro de F | P0; supervisor distinto nuevo/P2 |
| A11 | Tres familias de papel | Plan de vuelo, soporte de vida, impulso/energía; borde, firma ornamental y distintivo sin datos impresos | PNG transparente o SVG, D; tres tintes accesibles | P0 |
| A12 | Carpeta/sobre de expediente | Entrada, abierta, retirada; agrupa visualmente la propuesta | PNG/SVG, caja según D/bandeja | nuevo/P1; no añadir pasos obligatorios |
| A13 | Manual físico | Tapa/lomo, doble página, bordes, separadores; hoja de cambio opcional | PNG por piezas o SVG, M | P0 para abierto; tapa/cierre ilustrado P1 |
| A14 | Ilustraciones del manual | Ocho destinos, Luna de referencia y esquema transporte/módulo; misma iconografía de escenas. usar nombres y cifras como texto | SVG o PNG; miniaturas del espacio aprobado de M | nuevo/P1; se pueden reutilizar A26/A29/A30 |
| A15 | Libreta/hoja de inventario | Abierta y marco; reutilizable para registro | PNG/SVG, L | P0 |
| A16 | Libreta/hoja de registro | Un marco reutilizado; vacío/con entradas y páginas son contenido por código | Reutiliza A15, L; marcas SVG | P0 |
| A17 | Dos sellos físicos y soporte | Aprobar y devolver: reposo, tomado/seleccionado, contacto/presión y regreso | PNG por piezas o SVG; UI según boceto | P0 |
| A18 | Tinta de sello | Autorizado/devuelto; fresca, asentada; marca legible más gesto opcional | SVG/PNG transparente, ancho dentro de D; texto por código | P0 |
| A19 | Iconografía de cinco recursos | Comida, agua, O₂, propelente, energía; claro/oscuro, pequeño/grande | SVG, UI 24/32; palabra/unidad siempre presentes | P0 |
| A20 | Iconos funcionales | Manual, inventario, registro, guardar hojas, fijar/soltar, cerrar, anterior/siguiente, pausa, sonido/silencio, pantalla completa, ayuda, repetir y volver | SVG, UI; estados visibles por código | P0 |
| A21 | Cursor temático | Normal, agarrar, agarrando, acción no disponible; hotspot por estado | SVG/PNG 32/64 px si se aprueba; cursores nativos de respaldo | nuevo/P1 |
| A22 | Dispositivo de emergencia y marco de aviso | Reposo, aviso, urgencia, aporte elegido, confirmado/bloqueado; piezas sin números horneados | PNG/SVG por capas, E | P0 |
| A23 | Pictogramas de los ocho incidentes | Esclusa, O₂, depósito agua, refugio solar, ventilación/depurador, raciones, enfriamiento, alimentación almacén; nombre y explicación textual siempre disponibles | SVG, UI 32/64; uno por E01–E08 | nuevo/P1; texto identificador P0 por código |
| A24 | Marco del parte de operaciones | Éxito, carencia y emergencia; sin color/texto de resultado antes de tiempo | SVG/PNG por piezas; hoja lógica de referencia 800 × 730 | P0 |
| A25 | Cielo/espacio de cinemáticas | Fondo neutro reutilizable, estrellas en capa opcional | WebP/PNG, F | P0 |
| A26 | Luna y ocho planetas vistos desde espacio | Mercurio, Venus, Tierra, Marte, Júpiter, Saturno, Urano, Neptuno, Luna; anillos de Saturno separados si pasan detrás de nave | PNG transparente/SVG, cajas S dentro de F | P0 |
| A27 | Superficies de operaciones | Luna, Mercurio, Venus, Tierra y Marte; Venus explícitamente ficticia. Ninguna superficie de gigantes | WebP/PNG por capas, banda/suelo de F | P0 |
| A28 | Plataforma lunar | Base, estructura y primer plano separado de nave | PNG transparente/SVG, S | P0 |
| A29 | Transporte orbital común | Perfil/vista que permita viaje ida/regreso, acoplamiento, detenido | PNG/SVG transparente, S; evitar espejar texto/piezas asimétricas | P0 |
| A30 | Módulo local de tripulación | En plataforma, ascenso, acoplamiento, descenso y aterrizado; patas/motores en capas si hace falta | PNG/SVG/atlas, S | P0 |
| A31 | Base lunar exterior | Normal, intervención, estabilizada, pérdida; piezas para daño sin personas heridas | PNG por capas, S/F | P0 |
| A32 | Equipo de reparación | Consola/herramientas para intervención genérica, activo/estable | PNG/SVG, S | P0 |
| A33 | Variantes visuales de incidente | Esclusa atascada/cerrada, reserva O₂, agua aislada/limpia, refugio abierto/activo, depurador detenido/activo, raciones separadas, enfriamiento reparado, almacén sin/con luz | PNG por capas/atlas, S | nuevo/P1; aportan causa/efecto específico |
| A34 | Efectos de propulsión | Encendido, pluma, apagado; ascenso y maniobra | Atlas PNG transparente o vector animable, S | nuevo/P1 arte específico; efecto simple por código P0 |
| A35 | Efectos de fallo por recurso | Cinco símbolos/estados de carencia; pérdida de empuje/energía o señal según fase | SVG/PNG, UI/S; se combinan con lugar real de fallo | P0 |
| A36 | Pérdida de la base | Destello contenido, humo/fragmentos simbólicos y base dañada; alternativa sin flash | Capas PNG/atlas, F/S; movimiento reducido equivalente | P0 sencillo; partículas P2 |
| A37 | Oficina de evaluación y ventanal | Una escena reutilizada para tres finales, con clima por luz/pose | WebP/PNG, F y recortes | P0 |
| A38 | Props de finales | Certificado, orden de traslado/documentos, aviso de despido; áreas para texto dinámico | SVG/PNG, D o recorte F | P0 |
| A39 | Marcos de menú, pausa, opciones y créditos | Placa/panel del mundo del juego; misma gramática y materiales | Piezas SVG/PNG escalables; UI según composición | P0 |
| A40 | Tutorial: soporte visual | Hoja/tablilla de instructor, flecha/mano ilustrada si se adopta | SVG/PNG; panel de 590 px de ancho como referencia | P0 marco; mano nuevo/P1 |
| A41 | Ficha de ciencia y fuentes dentro del mundo | Sello editorial propio, ilustración pequeña, separación ciencia/cálculo/balance | SVG/PNG, M/D; contenido legible mediante código | nuevo/P0 |
| A42 | Vista de base y subsistemas | Soporte vital regenerativo/reservas; preparación de refugio y laboratorio; cultivo o raciones; comunicación | PNG/SVG por capas, composición por validar | nuevo/P0 |
| A43 | Estados de operación de base | B01 regeneración/reservas; B02 refugio ampliado con laboratorio o compacto con laboratorio suspendido; B03 cultivo hasta cuarto éxito y consumo local / raciones inmediatas; mensaje en tránsito | Capas SVG/atlas; sin reposición de inventario | nuevo/P0; detalle P1 |
| A44 | Papeles de operación nueva | Tres órdenes B01–B03; dos elecciones y costo cada una; consulta con demora tras B02 y parte de consecuencia | Reutilizar D/M/L; texto por código | nuevo/P0 |
| A45 | Tipografías | Una familia de lectura y números tabulares; una de título opcional; español/inglés, acentos, O₂, flechas y unidades | WOFF2 con licencia redistribuible; tamaños desde boceto | P0 lectura; P1 título |
| A46 | Materiales decorativos | Desgaste, tornillos, lámparas, polvo, grano y utilería adicional | PNG/SVG pequeños y repetibles, UI/BG | nuevo/P2; nunca detrás de cifras |
| A47 | Imagen de acceso/publicación | Favicon, imagen social, miniatura del proyecto e imagen principal; identidad propia | SVG/PNG; 32/48 px favicon, social 1200 × 630 propuesta | Captura nuevo/P0; favicon/social nuevo/P1 |
| A48 | Assets de demo oficial | Hasta siete diapositivas con capturas reales del juego y un diagrama de costo→consecuencia; alternativa video ≤30 s | PPTX/PDF o video externo; 16:9 propuesto, imágenes ≤10 MB para Project | nuevo/P0; crear durante evento según elegibilidad |

## Código: desarrollo; provisional o por verificar

| ID | Función | Variantes / estados | Formato / referencia | Prioridad / condiciones |
|---|---|---|---|---|
| C01 | Escenario y cámaras | Menú, escritorio, cine, informe, tutorial, final; escalado, márgenes seguros y pantalla completa | Composición BG/F con capas; HTML/CSS/SVG/canvas según plan | P0 |
| C02 | Texto de tres documentos | IDs, autor, ruta ida/retorno, 4 personas, tipo de operación, cinco pedidos y unidades; suficiente/insuficiente sin delatar respuesta | Texto real en D; miniatura en bandeja y tamaño fijo de lectura | P0 |
| C03 | Manipulación de objetos | Tomar, frente, arrastrar, soltar, superponer, guardar, recoger y entregar; límites para no perder objetos | Coordenadas lógicas, puntero y teclado; D/M/L/E | P0 |
| C04 | Manual completo | Índice; selector vacío de 8 destinos y 8 fichas con 5 mínimos/tipo de operación; reglas; instrucciones de emergencias. Conserva selección/posición entre visitantes | Texto y pestañas en M; páginas dinámicas | P0 |
| C05 | Páginas educativas nuevas | Fuentes/ciencia frente a ficción; soporte vital, energía/protección, cultivo, comunicaciones; procedimiento E01–E08 si se incorpora al manual | Texto real M; diagramas SVG reutilizables, sin párrafos largos | nuevo/P0 para ciencia y ampliación; catálogo ilustrado P1 |
| C06 | Inventario | Cinco saldos y unidades, normal/cero; sin indicar validez de propuesta ni revelar presupuesto futuro | Texto real L; números tabulares | P0 |
| C07 | Registro y bitácora final | Vacío, 4 entradas por página, devuelta/éxito/fallo/emergencia, página anterior/siguiente deshabilitada donde corresponda | Texto L y panel final; historial inmutable | P0 |
| C08 | Sellos y tinta | Reposo, hover, foco, presionado, bloqueado, estampado y retorno; dos decisiones, cobro único | Dos objetos UI y tinta dentro de D | P0 |
| C09 | Consultas del escritorio | Manual B, inventario I, registro R, guardar hojas, poner hoja al lado, fijar/soltar, cerrar | Controles UI con etiqueta, foco y estado activo/ocupado | P0 |
| C10 | Desempeño visible | 0–5 éxitos, aprobaciones, “Sin evaluar”, porcentaje mostrado; actualizar después de consecuencia | Rótulo físico/placa; sin spoilers | P0 |
| C11 | Emergencia completa | Aviso dragueable, identificación, requisito, 30 s, barra 0–máximo permitido, cantidad, probabilidad efectiva y confirmar; normal/urgente/bloqueado/expirado | Texto/controles E; reloj y barra sin rasterizar | P0 |
| C12 | Informe de operaciones | Tras consecuencia: mínimo/pedido/gastado/saldo, carencias y explicación; misión exitosa, fallida, stock insuficiente, incidente resuelto/fallido | Texto/tabla en hoja 800 × 730 de referencia | P0 |
| C13 | Tutorial de 3 lecciones | 29 pasos de referencia: aprobar al mínimo, detectar falta de comida y devolver, aportar en emergencia; sin reloj primero, luego 30 s. Pista/reintento/reiniciar/salir y resumen | Guía diegética más foco/resaltado que no tape objetivo | P0; añadir las operaciones de base |
| C14 | Controles generales | Iniciar, aprender, opciones, créditos; pausa/continuar/salir; volumen/silencio/movimiento reducido; F pantalla completa | UI con normal/hover/foco/presionado/deshabilitado; paneles A39 | P0 |
| C15 | Créditos y atribuciones | Integrantes reales pendientes; fuentes NASA, licencias, agradecimientos y uso de IA/SI; EN y ES si hay cambio de idioma | Texto real en panel; enlaces externos opcionales | P0 |
| C16 | Finales | Certificado 100%, oficinas >40% y <100%, despido ≤40% o derrota; resumen, bitácora, semilla, menú y otro turno | Texto/cifras sobre A37/A38 | P0 |
| C17 | Despachos educativos nuevos | B01, B02 y B03 tras éxitos 1, 2, 3; una elección, costo compartido, efecto persistente y déficit terminal; sin aprobación de misión | D/M más A42–A44 | nuevo/P0 |
| C18 | Ciencia trazable | Dato archivado con ID, fecha, unidad, enlace y regla de uso; distinguir dato, cálculo y balance; sin API obligatoria | JSON legible con procedencia más página M/ficha D | nuevo/P0 |
| C19 | Accesibilidad e idioma | Foco visible, navegación ordenada, controles por teclado, nombres accesibles, texto de alertas y equivalentes sin sonido/color; inglés completo para entrega | Texto real; fuentes WOFF2/sistema; sin PNG de párrafos | nuevo/P0 inglés; demás controles P0 |
| C20 | Carga y problemas de acceso | Cargando/listo, fallo de asset con respaldo legible, JS desactivado, orientación/ventana pequeña si resulta necesaria; reintento sin cobrar otra vez | Panel del mundo, UI; no landing extra | nuevo/P0 respaldo básico; aviso adaptable P1 |

## Movimiento: desarrollo y arte; provisional o por verificar

| ID | Secuencia / estados | Ejecución / referencia | Prioridad / condiciones |
|---|---|---|---|
| M01 | Menú→turno, llegada/espera/salida de ingeniero | Personaje P y oficina R; posición/ritmo por código | P0 |
| M02 | Tres hojas: llegada pequeña→tomar→arrastre/frente→reposo; guardar y recoger al sellar | D, sombras y escala por código; no ampliar por doble clic | P0 |
| M03 | Manual abrir/cerrar, cambio de sección/página, fijar; consulta inventario/registro y paginar | M/L; persistir estado, no reiniciar al cambiar visitante | P0 |
| M04 | Sello: selección/presión/tinta/levantada; entregar papeles e ingeniero retira | A17/A18 + D; bloqueo contra doble decisión. el movimiento físico sencillo se construye por código | Sellado/entrega P0; movimiento del sello nuevo/P0 sencillo; mano adicional nuevo/P1 |
| M05 | Preparación, ascenso, transferencia, viaje de ida | F+S: módulo/transporte/fondo independientes | P0 |
| M06 | Destino sólido: órbita y descenso de módulo; gigante: solo órbita | F+S, 4 sólidos/4 gigantes y retorno lunar | P0 |
| M07 | Regreso, descenso lunar, cierre de misión | F+S; reusar A27/A30/A31. Mantener continuidad visual entre cortes | Secuencia P0; continuidad sencilla nuevo/P0 |
| M08 | Fallos en despegue/ida/destino/regreso por recurso | Combinar fase con icono de A35; no 20 películas distintas | P0 |
| M09 | Aparición de emergencia, urgencia y confirmación/expiración | E/UI; cuenta automática, reloj no depende de animación | P0 |
| M10 | Intervención neutral→estabilización o explosión/pérdida | F+S; no revelar resultado en intervención previa | P0 |
| M11 | Parte de operaciones→archivo→siguiente visitante/incidente/final | Hoja y escena coherente; devolución omite este informe | P0 |
| M12 | Certificado/oficinas/despido y nueva partida | A37/A38; contenido y cambios por código | P0 |
| M13 | Progreso tutorial, foco/ayuda/error y resumen | UI; realce sin animación obligatorio como respaldo | P0 |
| M14 | Estado de base y consulta diferida | Estado persistente B01–B03; consulta B02 2.6 segundos sin costo adicional; cultivo B03 consumido localmente tras cuarto éxito sin reponer inventario ; A42/A43 y controles temporales | nuevo/P0 |
| M15 | Pausa/reanudar y pestaña oculta; movimiento reducido | Congelar TODOS los movimientos, reloj, salidas y fases; variante estática equivalente | P0 |
| M16 | Microanimaciones ambientales, parpadeo y gestos extra | Capas separadas, nunca sobre datos | nuevo/P2 |

## Sonido: responsable de sonido; pendiente

| ID | Función | Variantes / estados | Formato / referencia | Prioridad / condiciones |
|---|---|---|---|---|
| S01 | Papel tomado, dejado, recogido y entregado | 2–3 tomas suaves para no repetir una muestra idéntica | Maestro WAV 48 kHz, mono; entrega OGG + MP3/AAC; 0.1–0.8 s | P0 |
| S02 | Manual/registro | Abrir/cerrar y página; distinguir de sello | Mismo formato, 0.2–0.8 s | P0, puede reutilizar S01 |
| S03 | Sello físico | Golpe y retirada; ambas decisiones, sin anticipar éxito de misión | WAV/OGG, 0.1–0.5 s | P0 |
| S04 | Controles | Selección/confirmación/foco opcional; error de acción disponible | WAV/OGG o síntesis, <0.3 s | P0 confirmación; hover P2 |
| S05 | Emergencia | Aviso, urgencia discreta, aporte confirmado; detener al pausar/resolver | WAV/OGG o síntesis; alarma corta/bucle sin corte | P0 |
| S06 | Nave y operaciones | Encendido, ascenso, acoplamiento, motor/maniobra, aterrizaje | WAV/OGG, 0.5–3 s; mono espacializable | nuevo/P1; mezcla sencilla P0 si cabe |
| S07 | Consecuencias | Éxito, misión fallida, sistemas recuperados, pérdida de base | WAV/OGG o síntesis, 0.3–2 s; solo tras revelación | P0 |
| S08 | Finales | Certificado, oficinas, despido; tres cierres breves | WAV/OGG, 1–4 s o variantes de S07 | P0 sencillo |
| S09 | Ambiente de base | Ventilación y equipos en bucle; versión alerta opcional | Maestro WAV estéreo 48 kHz, OGG/MP3; 15–45 s sin costura | nuevo/P1 |
| S10 | Música | Menú/turno, tensión y cierre; temas o capas reutilizables | WAV maestro, OGG/MP3 estéreo; bucles 30–90 s con entradas/salidas | nuevo/P1; tema extra P2 |
| S11 | Nuevos sistemas de base | Radio/enlace, mensaje pendiente/recibido, refugio, cultivo; equivalente visual obligatorio | WAV/OGG/síntesis, 0.2–1.5 s | nuevo/P1; señal visual P0 |
| S12 | Voces | Balbuceo estilizado o locución EN/ES, solo si equipo decide | WAV/OGG por línea, transcripción y permisos | nuevo/P2; no necesarias |

## Operaciones y cobertura

Las operaciones son ficción didáctica y su costo sale del mismo inventario, una vez. Antes del 10% se suma al subtotal B = 500 kg comida, 3,000 L agua, 400 kg O₂, 0 kg propelente y 50,000 kWh. B01: A 20,000 kWh (regeneración) o B 2,000 L y 400 kg O₂ (reservas). B02: A 20,000 kWh (preparación ampliada y laboratorio activo) o B 5,000 kWh (compacta y laboratorio suspendido). Ambas consultas viajan 2.6 s sin costo extra; E04 es una emergencia independiente de 60,000 kWh. B03: A 1,000 L y 10,000 kWh (cultivo para consumo local tras cuarto éxito) o B 500 kg y 2,000 kWh (raciones inmediatas). No reponer el inventario de misiones; un déficit consume lo disponible y termina la campaña. No sumar operaciones a aprobaciones.

Verificar la lectura y cada variante P0 realmente utilizada; al sustituir un placeholder, mantener texto, unidades, foco, contraste y movimiento reducido. Probar sonido activado solo tras interacción, volumen/silencio, sin anuncios que revelen el resultado antes de la consecuencia. Los tamaños o estados que no se usen se documentan como descartados, no como entregados.
