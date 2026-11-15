# Prompts y mensajes del proyecto Space Papers

Recopilación de mensajes del usuario y prompts redactados en los historiales disponibles de Codex y ChatGPT, junto con el prompt de planificación conservado en el proyecto. 

Los archivos adjuntos y su contenido no están transcritos: cuando el historial los identifica se indica su presencia. Esta recopilación depende del historial accesible y no garantiza incluir conversaciones eliminadas, otros servicios o prompts que no hayan quedado registrados. Las fechas están en hora de Ciudad de México cuando están disponibles.

## Mensajes de Codex

### Prototipar el juego desde Notion
ID del chat: `01a1c186-8b90-7491-9914-e43714914ab5`

#### Mensaje 1

Quiero hacer un prompt para estos apuntes que tengo en mente
ELIMINAR TODO LO QUE PARESCS PÁGINA WEB

Pedir que los assets no escenciales, las personas, la nave, y escenarios sean solo un texto diciendo que asset va para luego agregarlo nosotros

Entrenar a la IA con algun gameplay de papers please para que vea ESPECIFICAMENTE como se mueven las hojas y como se abre la información

NO HUBO NINGUNA EMERGENCIA, pedir que las agrege con las provicionales

Mejorar cinematicas, mas fluidas, mas cool, mejores transiciones entre accion del jugador y la animacion, mejorar hojas

Aunque el jugador se haya equipocado, hacer la cinematica completa y no spoilear que el jugador se equivoco hasta el paso en el que fallo.

En caso de rechazar una idea, hacer mas fluido el pasar a la siguiente idea, no una animacion ni nada, solo como que se deslicen el ingeniero y los documentos para que entre el sigueinte

### Subir prototipo aparte a GitHub
ID del chat: `01a1c29a-ac50-7ba2-acae-52523711d7c2`

#### Mensaje 1

Sube este prototipo a [@GitHub](plugin://github@openai-curated-remote) en Test2 Nasa, subelo como un prototipo aparte al que ya esta

#### Mensaje 2

Puedes cambiar el prototipo viejo de Test2-Nasa a la fecha de este viernes que paso y el prototipo de hoy a la fecha de hoy?

#### Mensaje 3

Nombra a ambos como Prototipo

### Sube la actualización a GitHub
ID del chat: `01a1c2aa-de70-7251-9298-4f6549469c62`

#### Mensaje 1

Sube a [@GitHub](plugin://github@openai-curated-remote) esta actualizacion que acaba de hacer codex

#### Mensaje 2

Vuelvelo a subir

### Sube la actualización a GitHub
ID del chat: `01a1c3cd-2651-71e1-8dac-30f2475485c2`

#### Mensaje 1

Sube esta actualizacion a [@GitHub](plugin://github@openai-curated-remote)

### Space Papers (Astra)
ID del chat: `01a1daeb-8cda-7733-88ab-c75c7c51f24b`

#### Mensaje 1

# Space Papers — Planificación integral

Actúa como **arquitecto de software y diseñador de videojuegos**. Trabaja en **Plan Mode** para planificar desde cero **Space Papers**, un videojuego de navegador para NASA Space Apps 2026.

### 1. Investigación

Analiza completamente el proyecto anterior y los tres documentos adjuntos. Integra sus mecánicas, reglas, cálculos, assets y decisiones en un único plan coherente. Detecta contradicciones y respeta los valores acordados.

### 2. Experiencia de juego

Quiero un videojuego inmersivo inspirado en *Papers, Please*, con identidad y arte originales, **no una página web con un minijuego ni un dashboard**.

**PRIORIDAD FUNDAMENTAL:** Investiga cómo funciona la manipulación física de documentos en *Papers, Please* y planifica replicar fielmente su comportamiento: tomar hojas y libros, arrastrarlos libremente, superponerlos, apilarlos, cambiar cuál queda delante, abrir y consultar el manual, comparar documentos y devolverlos a su lugar. Debe sentirse igual de fluido, natural y preciso, adaptado a nuestro escritorio lunar.

### 3. Premio UX/UI — Máxima prioridad

Estamos compitiendo por **Best User Experience (UX/UI)**:

*“Awarded to the project with the most intuitive, accessible, and effective user interface and experience.”*

Toda la experiencia debe diseñarse pensando en ganar este reconocimiento. Prioriza **interacciones intuitivas, accesibilidad, claridad visual, facilidad de aprendizaje, retroalimentación inmediata y fluidez**.

Cada elemento debe sentirse natural y consistente. Define criterios verificables y pruebas de usabilidad que permitan evaluar y mejorar la experiencia. **Una interfaz bonita no es suficiente: debe ser excepcionalmente fácil y agradable de utilizar.**

### 4. Plan maestro

Incluye arquitectura técnica, mecánicas, interfaz, animaciones, sonido, inventario completo de assets, integración educativa de NASA, pruebas y publicación.

Organiza el desarrollo por horas, dependencias y prioridades **P0/P1/P2**, considerando la entrega local del **15 de noviembre de 2026 a las 15:30**.

### 5. Subagentes

Utiliza subagentes **Terra** para investigaciones y revisiones específicas cuando estén disponibles. Integra y verifica sus conclusiones.

### Resultado

Entrega **un plan maestro completo, realista y ejecutable**, con especial atención a la excelencia en UX/UI, listo para guiar el desarrollo.

**No programes ni modifiques nada todavía. Investiga, unifica y planifica.**

#### Mensaje 2

Ignora el anterior proyecto, quiero "borron y cuenta nueva" para eliminar errores pasados

#### Mensaje 3

PLEASE IMPLEMENT THIS PLAN:
# Space Papers — Plan maestro de desarrollo

## 1. Dirección, alcance y condiciones de partida

**Construir desde cero un videojuego de escritorio lunar cuya interacción principal sea tomar, mover, comparar y sellar documentos.** La prioridad de producción será la facilidad de uso: el arte se integrará sobre una interacción comprobada, legible y fluida.

### Decisiones cerradas contigo

| Aspecto | Decisión |
|---|---|
| Proyecto anterior | Excluido: no reutilizar código, arquitectura, assets ni pruebas anteriores. |
| Especificación | Conservar las reglas y cantidades de los tres documentos adjuntos, con los cambios explícitos de este plan. |
| Nombre | **Space Papers**. |
| Plataforma P0 | Computadora: ratón, trackpad y teclado. |
| Arte | Diseños originales, simplificados y caricaturescos, producidos por ustedes. |
| Documentos | Arrastre libre, superposición, cambio de profundidad, lectura y guardado físico. |
| Sellos | Arrastrables; alternativas equivalentes mediante clics y teclado. |
| Idioma | Inglés completo P0; español P1. |
| Equipo | Tres frentes: programación, arte, ciencia/pruebas/entrega. |
| Base lunar | Tres despachos nuevos que consumen el inventario común. |
| Financiación | Añadir la previsión operativa definida abajo antes del margen del 10%. |
| Déficit en operaciones | Consumir lo disponible, mostrar consecuencia y terminar con despido; no alterar la tasa de misiones. |
| Entrega | **15 de noviembre de 2026, 15:30, America/Mexico_City**. Objetivo de envío: 15:00. |

Fuentes documentales: [reglas y encargo](/Users/beto/Desktop/ChatGPT/NASA/PROMPT_PLAN_MODE_CODEX.md), [cantidades acordadas](/Users/beto/Desktop/ChatGPT/NASA/DATOS_ESENCIALES_NAVE_Y_MISIONES.md) e [inventario de producción](/Users/beto/Desktop/ChatGPT/NASA/ROADMAP_E_INVENTARIO_ASSETS.md). La revisión se apoyó en tres subagentes Terra; sus recomendaciones se contrastaron antes de incorporarlas.

### Elegibilidad: primera dependencia

El GO Team advierte que comenzar el proyecto antes del hackathon puede causar descalificación y distingue ese trabajo de investigar recursos o formar equipo. [Aclaración del GO Team](https://github.com/nasa/spaceapps/discussions/1827)

El responsable de ciencia y entrega deberá:

1. Informar al Local Lead de la existencia y fechas del prototipo y los tres documentos.
2. Explicar que Space Papers tendrá implementación y arte nuevos.
3. Obtener una respuesta sobre qué reglas, cálculos y materiales se pueden trasladar al entregable.
4. Conservar la respuesta y documentar la procedencia real.

**Puerta G0:** no declarar elegible la reconstrucción ni incorporar materiales previos al entregable competitivo sin aclarar su autorización. Si se permiten parcialmente, aplicar exactamente ese alcance. Si se rechazan, no presentar una reescritura equivalente como trabajo independiente; acordar con la organización una participación no competitiva o un alcance diferente.

La página oficial confirma el evento del 14–15 de noviembre y el cierre de plataforma a las 23:59 locales del domingo. Ese cierre no sustituye la entrega local de las 15:30 indicada por ti. [Calendario oficial](https://www.spaceappschallenge.org/2026/)

La página de Puebla y varias guías devolvieron errores de acceso. Queda por reconfirmar con la sede la rúbrica vigente de **Best User Experience**, el horario local y las instrucciones específicas sobre IA. El criterio UX/UI que proporcionaste será, en cualquier caso, el criterio principal de diseño.

---

## 2. Experiencia e interacción: el escritorio es el juego

### Referencia investigada

Lucas Pope describe la versión de computadora de *Papers, Please* como tres regiones visibles: entorno, ventanilla y escritorio. Los documentos llegan al mostrador y se arrastran al escritorio para examinarlos. También explica que la versión de teléfono necesitó otra interacción por las restricciones de espacio. Esto respalda priorizar computadora para conservar la manipulación física. [Devlog oficial](https://dukope.com/devlogs/papers-please/mobile/)

Sus primeros diarios documentan la importancia de ver el contenido durante el arrastre y poder comparar documentos simultáneamente. Son referencias del proceso de diseño, no una especificación completa del producto final. [Diario del prototipo](https://dukope.com/devlogs/papers-please/tig-00/)

**Objetivo verificable:** reproducir la respuesta directa, la continuidad espacial y la libertad de colocación. Las ayudas de accesibilidad, la recogida automática y los límites de recuperación serán adaptaciones propias. No se afirmará equivalencia exacta con el juego original sin una comparación práctica posterior.

### Composición inicial

Escena lógica de **1600 × 900**, sin desplazamiento de página:

| Zona | Composición |
|---|---|
| Parte superior | Oficina lunar, ventanilla, personaje y vista pequeña de la base. |
| Mostrador | Bandeja con tres hojas pequeñas distinguibles y alcanzables. |
| Escritorio | Superficie libre para documentos, manual y libreta. |
| Borde inferior | Soporte de sellos y controles físicos de consulta. |
| Consecuencias | Proyección integrada en el mundo; controles accesibles de reproducción. |

Boceto inicial de comparación:

- Manual abierto: **740 × 430**, posición inicial `(40, 360)`.
- Hoja de lectura: **300 × 400**, posición inicial `(810, 360)`.
- Inventario/registro: **410 × 420**, posición inicial `(1150, 360)`.
- Emergencia: **800 × 460**, desplazable también sobre la parte superior.
- Miniaturas de hojas: aproximadamente **72 × 96**, separadas en la bandeja.

Estas posiciones son puntos iniciales, **no columnas fijas ni ranuras obligatorias**. Abrir otro objeto no reorganiza los existentes.

El tamaño de hoja sustituye la referencia anterior de 270 × 355 para favorecer lectura. Antes de ilustrar marcos definitivos se probarán los textos reales. A 1280 × 720, una fuente de 20 unidades lógicas equivale a 16 píxeles CSS; controles de 55 equivalen a 44. Se medirá el área útil del navegador, no la resolución nominal del monitor.

El manual mostrará los ocho destinos en una cuadrícula de dos columnas por cuatro filas; así mantiene objetivos grandes sin una lista vertical excesiva.

### Contrato de manipulación

| Acción | Comportamiento obligatorio |
|---|---|
| Tomar una hoja | Respuesta inmediata; pasa al frente y conserva el punto relativo de agarre. |
| Sacarla de la bandeja | Adopta el tamaño fijo de lectura durante el gesto, sin esperar a soltar. |
| Arrastrar | Sigue directamente al puntero; sin inercia, rebotes, rotación aleatoria ni ajuste a cuadrícula. |
| Soltar en escritorio | Permanece en esa posición y conserva su profundidad. |
| Superponer | Las hojas pueden cubrirse; recibe interacción solamente el objeto visible superior. |
| Traer al frente | Pulsar una parte visible o enfocar mediante teclado eleva el objeto. |
| Guardar en bandeja | Soltar el punto de agarre dentro de su zona marcada devuelve la hoja a miniatura. |
| Recuperar | Tomarla de nuevo restaura tamaño de lectura; nunca crea una copia. |
| Abrir manual | Se abre desde su lugar físico; inicialmente muestra índice sin destino seleccionado. |
| Mover manual | Se arrastra desde cubierta, márgenes o zonas sin controles; pestañas y botones no inician arrastre. |
| Fijar manual | Inmoviliza su posición, pero permite consultar páginas y cambiar destino. |
| Cerrar manual | Vuelve a su soporte conservando página, destino y última posición abierta. |
| Comparar | El jugador coloca manual y hoja; “Poner al lado” mueve únicamente la hoja elegida, por petición explícita. |
| Guardar hojas | Recoge las tres hojas de la propuesta, sin mover manual ni libreta. |

No habrá ampliación por doble clic ni selección automática del planeta correcto, tampoco en tutorial.

Las hojas totalmente cubiertas se recuperarán mediante Tab o accesos `1/2/3`. `B`, `I` y `R` abrirán o traerán al frente manual, inventario y registro. El orden de Tab será estable aunque cambie la profundidad visual.

### Sellos físicos

1. Tomar **APROBAR** o **DEVOLVER** del soporte.
2. Moverlo libremente por encima del escritorio.
3. Mostrar una marca neutral de contacto sobre las zonas válidas del expediente.
4. Soltar sobre una parte visible de cualquiera de sus tres hojas.
5. Estampar, bloquear una segunda decisión y recoger las tres hojas.

La zona válida puede pertenecer a una hoja en lectura o en bandeja. **El resaltado solo indica dónde se puede estampar; jamás si la propuesta es correcta.**

El contacto se calcula con el punto de estampado del sello, excluyendo el propio sello del detector de objetos. Un manual o libreta que cubra la hoja bloquea el contacto.

Soltar sobre escritorio vacío, manual o inventario devuelve el sello al soporte sin efectos. Cancelar tampoco decide ni consume. Después de una estampación válida, el sello regresa y la resolución permanece comprometida aunque cambie el tamaño de ventana.

Alternativas P0:

- Clic en sello → clic en hoja.
- Seleccionar sello → elegir una hoja mediante control con nombre.
- Teclado: enfocar sello, Enter; enfocar hoja, Enter.
- Cancelación visible y Escape.

Seleccionar no equivale a confirmar. Mantener Enter o recibir el clic posterior a un arrastre no puede producir una segunda decisión.

### Recuperación y accesibilidad

- Captura del puntero durante arrastre; transformación única entre coordenadas de pantalla y escena. [Pointer capture](https://developer.mozilla.org/en-US/docs/Web/API/Element/setPointerCapture)
- Ningún objeto puede perder su zona de agarre o sus controles esenciales fuera de pantalla.
- `pointercancel`, pérdida de captura, cambio de tamaño y pausa cancelan el gesto pendiente sin sellar.
- Escape cancela el gesto y abre pausa; reanudar restaura el foco.
- Pestaña oculta congela reloj, personajes, documentos, cine y audio. Volver muestra pausa hasta continuar. [Page Visibility](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API)
- Modo opcional de colocación por dos clics para todos los objetos móviles, incluida la emergencia.
- Flechas mueven el objeto tomado; Shift aumenta el paso.
- Etiquetas, unidades y símbolos acompañan al color.
- Texto real, foco visible, nombres accesibles y anuncios breves de acciones.
- Contraste objetivo: 4.5:1 en texto normal y 3:1 en controles.
- Movimiento reducido elimina desplazamientos decorativos y destellos, conservando la información.

La alternativa sin arrastre cubre una necesidad diferente del teclado; se incluirán ambas. [WCAG 2.2: movimientos de arrastre](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements)

La mesa tendrá como mínimo probado un área útil de 1280 × 720. Ventanas menores ofrecerán pantalla completa y explicación del límite; no se prometerá compatibilidad móvil ni conformidad completa con WCAG sin comprobarla.

---

## 3. Reglas, economía y ciencia

### Campaña conservada

- Base lunar; cuatro personas por expedición.
- Ocho destinos; salida y retorno a Luna.
- Cinco éxitos en destinos distintos y dos emergencias resueltas.
- Sin días de campaña, medallas ni número fijo de visitantes.
- Cinco recursos independientes, sin intercambios, reembolsos ni reposiciones.
- Nueva semilla por partida; misma semilla y mismas acciones reproducen resultados.
- Sin guardado de campaña; preferencias locales sí.
- Nueve ingenieros: Nico, Ada, Leo, Max, Sol, Dante, Vera, Teo y Ren, con las personalidades documentadas.
- Personalidad, retrato y saludo no predicen suficiencia.

**Catálogo obligatorio.** Las comas siguientes separan miles:

| Destino | Comida kg | Agua L | O₂ kg | Propelente kg | Energía kWh |
|---|---:|---:|---:|---:|---:|
| Mercurio | 9,200 | 21,120 | 3,960 | 1,980,000 | 1,760,000 |
| Venus | 10,350 | 23,040 | 4,840 | 1,760,000 | 1,980,000 |
| Tierra | 11,500 | 19,200 | 4,400 | 1,100,000 | 1,100,000 |
| Marte | 11,500 | 19,200 | 4,400 | 1,100,000 | 1,100,000 |
| Júpiter | 17,250 | 30,720 | 7,480 | 2,420,000 | 2,640,000 |
| Saturno | 20,700 | 36,480 | 8,800 | 2,750,000 | 3,080,000 |
| Urano | 25,300 | 44,160 | 11,000 | 3,300,000 | 3,740,000 |
| Neptuno | 29,900 | 53,760 | 13,200 | 3,850,000 | 4,400,000 |

Los cuatro primeros usan módulo local; los gigantes, únicamente operación orbital. Venus superficial y las expediciones humanas ampliadas se presentan como ficción.

Estos valores incluyen ida, operación, retorno, apoyos y reserva. No añadir otros márgenes a las misiones ni aplicar capacidades V3 como filtros. El O₂ respirable no es oxidante; kWh no es kW ni capacidad de batería. No inventar duraciones de los circuitos.

### Generación y decisión

Cada propuesta:

- Excluye destinos completados y el destino inmediatamente anterior.
- Excluye al ingeniero inmediatamente anterior.
- Tiene probabilidad 50% de ser suficiente.
- Suficiente: porcentajes enteros uniformes 100–105%, redondeados hacia arriba.
- Deficiente: uno o dos recursos elegidos sin repetición, con porcentajes enteros 10–95%; los demás, 100–105%.

Tres documentos: plan de vuelo, soporte vital e impulso/energía.

**DEVOLVER:** cero consumo, aprobaciones y éxitos. Recogida y siguiente visitante directamente, sin informe ni botón Continuar.

**APROBAR:**

```text
gastado[r] = mínimo(saldo[r], pedido[r])
saldo_nuevo[r] = saldo[r] − gastado[r]

éxito =
  todos los pedidos alcanzan su mínimo
  Y el almacén cubre todos los pedidos
```

Se consume una sola vez, incluso si sobra o fracasa. La igualdad cumple. Una propuesta insuficiente con stock suficiente falla y permite continuar. Un déficit de stock termina con despido después de mostrar su consecuencia.

### Consecuencias y finales

Secuencia normal: preparación → ascenso del módulo → transferencia orbital → ida → operación → regreso → descenso lunar → cierre.

La carencia más temprana determina la interrupción:

| Cantidad efectivamente entregada | Fase de fallo |
|---|---|
| Propelente <25% del mínimo | Antes del despegue |
| Cualquier recurso <50% | Ida |
| Cualquier recurso <75% | Destino |
| Cualquier otro recurso por debajo del mínimo | Regreso |

Empates: comida, agua, O₂, propelente, energía. Si falta stock para cubrir lo pedido pero lo entregado alcanza los mínimos, se cancela el despegue y termina la campaña por déficit.

El resultado queda privado hasta la consecuencia: sin cambios anticipados de saldo, contador, color, título, sonido o anuncios accesibles.

Después se presenta el informe con mínimo, pedido, gasto, saldo y explicación. Archivar continúa la secuencia. El registro muestra cuatro entradas por página.

Finales:

- Cinco éxitos, dos emergencias resueltas y tasa 100%: certificado.
- Mismas condiciones y tasa >40% y <100%: traslado.
- Tasa ≤40%: despido.
- Déficit de stock o emergencia fallida: despido anticipado.

Tasa exacta: éxitos/aprobaciones de expediciones; excluye devoluciones, tutorial y despachos de base. Antes de aprobar: “Sin evaluar”.

### Emergencias

| ID | Incidente | Costo completo |
|---|---|---:|
| E01 | Esclusa | 20,000 kWh |
| E02 | Reserva de oxígeno | 1,000 kg O₂ |
| E03 | Agua contaminada | 40,000 L |
| E04 | Activar refugio solar | 60,000 kWh |
| E05 | Ventilación y depurador | 40,000 kWh |
| E06 | Raciones perdidas | 10,000 kg |
| E07 | Enfriamiento | 20,000 L |
| E08 | Alimentación del almacén | 60,000 kWh |

Se sortean dos eventos distintos y dos posiciones distintas después de los éxitos 1–4. Identidades y momentos futuros permanecen ocultos.

- Aviso único arrastrable por cabecera; inventario accesible.
- Reloj automático de 30 segundos desde su aparición operable.
- Aporte inicial cero; porcentaje entero limitado por el saldo.
- Mover el deslizador no gasta; confirmar sí.
- Probabilidad = aporte real/costo completo.
- Cero siempre falla; 100% siempre funciona.
- Expirar sin confirmar aporta cero.
- Pausa y ocultación congelan; consultar o arrastrar no.
- Intervención neutral antes de revelar estabilización o pérdida.
- Fallar termina la campaña.

Máximo seleccionable: `min(100, floor(100 × saldo / costo))`. No se ofrecerán porcentajes fraccionarios ocultos. Contabilidad interna en milésimas enteras; probabilidad calculada con lo realmente descontado.

### Ampliación acordada: tres despachos de base

La investigación Terra encontró datos científicos útiles, pero no un modelo aplicable para calcular nuestros costos sin definir duración, infraestructura y cultivo. Por ello se usa la previsión aceptada, identificada como **balance ficticio nuevo**.

| Despacho | Momento | Alternativa A | Alternativa B | Consecuencia persistente |
|---|---|---|---|---|
| B01 · Soporte vital | Después del primer éxito | Operar sistema regenerativo: **20,000 kWh** | Usar reservas: **2,000 L + 400 kg O₂** | Sistema activo o suministro desde reservas; cambia gasto y estado del hábitat. |
| B02 · Preparación del refugio | Después del segundo éxito | Preparación ampliada: **20,000 kWh** | Preparación compacta: **5,000 kWh** | Mantener actividad interior disponible o suspender laboratorio para concentrar operación. |
| B03 · Alimentación | Después del tercer éxito | Cultivo: **1,000 L + 10,000 kWh** | Raciones: **500 kg comida + 2,000 kWh** | Cultivo en proceso hasta el cuarto éxito o raciones disponibles inmediatamente. |

Son paquetes administrativos para un bloque simulado, no consumos físicos por segundo. El cultivo representa producción para alimentación local y se consume allí: **nunca aumenta el almacén de expediciones**. No se asigna una duración astronómica a ese crecimiento.

B02 prepara sistemas y espacios con blindaje existente. Su costo no representa fabricar protección radiológica mediante electricidad. Si aparece E04, se paga su intervención completa de 60,000 kWh: preparación y respuesta son operaciones diferentes, explicadas en el manual.

Cada despacho:

- Es un papel del mismo escritorio, con dos alternativas y costos visibles.
- No tiene reloj.
- Requiere elegir alternativa y aplicar APROBAR; no se habilita según suficiencia del stock.
- Mantiene DEVOLVER inactivo con explicación “Orden interna: selecciona una alternativa”.
- Permite cambiar de alternativa antes de estampar.
- Se cobra una sola vez, registra el resultado y actualiza la escena.
- No incrementa aprobaciones ni éxitos.
- Si falta stock, consume lo disponible y aplica la derrota acordada.

Cuando coincidan eventos, el orden será: informe de expedición → emergencia programada → despacho pendiente → siguiente visitante. Una derrota cancela lo pendiente.

**Comunicación:** B02 enviará una consulta a Tierra. La respuesta llegará tras aproximadamente 2.6 segundos activos, representando el viaje ideal de ida y vuelta de la señal; el jugador puede seguir leyendo. No resuelve la decisión ni entrega recursos. La Luna está aproximadamente a 1.3 segundos luz, no a minutos de comunicación. [NASA: tiempo de viaje de la luz](https://science.nasa.gov/mission/webb/science-overview/science-explainers/how-does-webb-see-back-in-time/)

### Cambio explícito de inventario

Previsión por recurso, suma de los máximos de cada despacho:

```text
B = {
  comida: 500 kg,
  agua: 3,000 L,
  O₂: 400 kg,
  propelente: 0 kg,
  energía: 50,000 kWh
}

subtotal[r] =
  mínimos de cinco destinos de referencia
  + costos completos de dos emergencias
  + B[r]

inicial[r] = subtotal[r] + techo(subtotal[r] × 0.10)
```

Todo entra una sola vez en **el mismo almacén**, sin subcuenta protegida ni futuras reposiciones. Elegir una alternativa barata conserva recursos disponibles para otras decisiones.

El aumento frente a la fórmula anterior es exactamente: **550 kg comida, 3,300 L agua, 440 kg O₂, 0 kg propelente y 55,000 kWh**.

Los destinos de referencia siguen sin garantizar cualquier itinerario posterior. El manual explicará que se debe comprobar tanto el mínimo como el saldo; no revelará los eventos sorteados ni prometerá recursos suficientes para cualquier recorrido.

### Integración NASA visible y trazable

El desafío plantea gestionar un puesto lunar o marciano y experimentar compromisos entre soporte vital, protección, energía y alimentos. Los despachos cubren esa brecha respecto a limitarse a aprobar expediciones. [Enunciado oficial](https://www.spaceappschallenge.org/2026/challenges/junior-astronaut-mission-trainer/)

| Fuente elegida | Uso dentro del juego | Límite |
|---|---|---|
| DONKI, evento **2024-05-10T06:27:00-FLR-001**, versión 2, clase X3.9 | Registro histórico en el despacho de preparación y manual; contextualiza la vigilancia solar. | No predice una emergencia de la partida ni una dosis lunar. |
| NASA: recuperación de agua del 98% | Ficha asociada a B01 sobre sistemas regenerativos y dependencia de equipos. | No aplica automáticamente ese porcentaje al almacén lunar. |
| NASA: experimento Veg-01, ciclo de 28 días | B03 explica que cultivar requiere agua, iluminación y tiempo. | El avance abreviado de la simulación no equivale a una duración de misión. |
| NASA: protección radiológica lunar | Manual explica refugio, materiales y suspensión de actividades. | No simular espesor, dosis ni protección universal. |

Fuentes: [registro DONKI](https://ccmc.gsfc.nasa.gov/DONKI/events/30666/2/), [recuperación de agua](https://www.nasa.gov/missions/station/nasa-achieves-water-recovery-milestone-on-international-space-station/), [Veg-01](https://www.nasa.gov/missions/station/veggie-plant-growth-system-activated-on-international-space-station/) y [protección lunar](https://science.nasa.gov/science-research/heliophysics/how-nasa-will-protect-astronauts-from-space-radiation-at-the-moon/).

Cada recurso incorporado tendrá título, organismo/autor, URL, identificador, fecha, unidades o clasificación, extracto utilizado y transformación. Se distribuirán copias curadas locales; la partida no dependerá de APIs ni claves.

El manual distinguirá **dato científico, cálculo propio y balance ficticio**. La atribución aparecerá junto al contenido, no únicamente en créditos. El responsable verificará además la presencia del recurso NASA elegido en Resources del desafío, conforme a la aclaración del GO Team.

---

## 4. Arquitectura técnica y comportamiento audiovisual

### Arquitectura nueva

**TypeScript + Vite, HTML semántico, CSS y SVG**, sin servidor ni motor físico. Los papeles serán elementos posicionados, no formularios de una aplicación. Texto HTML permite lectura nítida, localización y accesibilidad; las ilustraciones forman la escena.

| Subsistema | Responsabilidad |
|---|---|
| Catálogo | Valores de misiones, eventos, despachos y referencias científicas; única fuente para manual y documentos. |
| Dominio | Generación, inventario, aprobaciones, emergencias, operaciones y finales; funciones puras. |
| Estado de partida | Fase, semilla, propuesta, saldos, historial, eventos consumidos y estados de base. |
| Escritorio | Posiciones, profundidad, objeto tomado, libro abierto/fijado y entrada de puntero/teclado. |
| Presentación | Personajes, documentos, escenas, informes, tutorial y menús. |
| Reloj | Tiempo activo de emergencia, animaciones y comunicación; pausas centralizadas. |
| Audio | Canales, volumen, silencio, interrupción y reproducción tras interacción del usuario. |
| Contenido | Textos ingleses, futura traducción española, créditos y metadatos de assets. |

Interfaces internas principales:

- `ResourceAmounts`: cinco cantidades enteras en milésimas.
- `CampaignState`: estado de dominio, sin posiciones visuales.
- `DeskState`: geometría y manipulación, sin resolver resultados.
- `Command`: aprobar, devolver, confirmar emergencia, autorizar operación y archivar.
- `Resolution`: resultado privado, consumos y fase de consecuencia.
- `PublicView`: únicamente la información que puede revelarse en ese momento.
- `AssetManifest` y `ScienceReference`: contratos de producción y procedencia.

No habrá API pública, cuentas, sincronización, migración del proyecto anterior ni guardado de partidas.

### Reglas de implementación

- Una decisión recibe un ID; repetir el comando devuelve el mismo resultado sin gastar otra vez.
- La máquina de estados rechaza acciones incompatibles con la fase actual.
- Animaciones y callbacks no modifican inventario.
- Fuentes aleatorias separadas para presupuesto, propuestas, emergencias y decoración.
- La semilla no depende del número de fotogramas ni de la velocidad de cine.
- Los movimientos actualizan transformaciones, sin reconstruir todo el escritorio.
- No utilizar HTML Drag and Drop nativo para los objetos del juego.
- El DOM y las regiones accesibles no contienen resultados futuros presentados prematuramente.
- Preferencias versionadas en almacenamiento local; corrupción o bloqueo restablecen valores seguros.
- Recargar comienza sin una campaña restaurada; salir al menú advierte que termina la sesión.

### Tutorial

Conservar las tres lecciones documentadas:

1. **Tierra al mínimo:** encontrar ficha, comparar cinco recursos y saldo, aprobar y ver consecuencia.
2. **Marte insuficiente:** 6,900 kg de comida frente a 11,500; detectar, devolver, equivocarse y repetir.
3. **E02:** demostrar 50%=500 kg y 50% de probabilidad; después 100%; ensayo final desde cero con 30 segundos.

Añadir una práctica breve de operación de base, con inventario independiente del de campaña.

Una instrucción por paso; pistas y objetivos que no tapen el objeto. Los 29 pasos son referencia de contenido, no obligación de crear 29 pantallas. Incluir primero tomar, colocar, recuperar y estampar. Nunca buscar automáticamente el destino.

Tutorial repetible y abandonable. El primer inicio recomendará aprender sin impedir comenzar una partida.

### Animación y sonido

Presupuestos iniciales de ritmo:

- Respuesta al agarre: siguiente fotograma.
- Cambio visual bandeja/lectura: 80–120 ms, sin retrasar el movimiento.
- Presión y retorno del sello: 200–300 ms.
- Recogida del expediente: 300–450 ms.
- Devolución y siguiente visitante: objetivo ≤1.5 s.
- Fases normales de viaje: aproximadamente 1.5–2 s.
- Consecuencia: 2–3 s antes del parte.

Cinemáticas con pausa, ×1/×4 y “Ver desenlace”. El salto muestra la consecuencia correspondiente y después el informe; nunca vuelve a cobrar ni representa fases posteriores a un fallo.

Audio activado mediante interacción del usuario. Papel, páginas, sello, alerta y consecuencias tienen equivalentes visuales. Pausar detiene alarmas y evita sonidos acumulados al reanudar. Sin voces P0; música y ambiente P1.

---

## 5. Inventario completo de producción

**Responsables:** A = arte del equipo; P = programación; C = ciencia, contenido y entrega.

**Formatos:** SVG para piezas simples; PNG transparente para personajes y objetos; WebP para fondos. Editables por capas. Raster a 2× del tamaño visible después de validar composición. Texto y cifras siempre mediante código.

**Tamaños de referencia:** escenario 1600×900; proyección 1600×760; personaje 240×300; hoja 300×400; manual 740×430; libreta 410×420; emergencia 800×460. Naves, planetas y efectos se dimensionarán dentro de la proyección, con pivotes documentados.

### Arte que necesitan dibujar

Los IDs mantienen la cobertura del inventario adjunto; todos los diseños serán nuevos.

| ID | Pieza y estados necesarios | Tamaño/formato | Prioridad |
|---|---|---|---|
| A01 | Identidad Space Papers y emblema propio; claro/oscuro | SVG | P0 |
| A02 | Menú lunar; reutilizar capas de oficina/base | Escenario | P0 |
| A03 | Oficina, ventanilla y mostrador; capas delante/detrás del personaje | Fondo por capas | P0 |
| A04 | Escritorio, borde frontal y sombra separada | Recorte de escenario | P0 |
| A05 | Bandeja y labio frontal; vacía/con hojas mediante composición | SVG/PNG | P0 |
| A06 | Soporte de sellos, soporte de manual y placa de desempeño | SVG/PNG | P0 |
| A07 | **Nueve ingenieros**, una pose neutral cada uno | Personaje transparente | P0 |
| A08 | Expresiones y gestos adicionales | Mismo encuadre de A07 | P1 |
| A09 | Técnico de base/emergencias; pose neutral | Personaje | P0; poses P1 |
| A10 | Figura de evaluación; reutilizar Ada | Personaje | P0; personaje nuevo P2 |
| A11 | Tres papeles: vuelo, soporte vital, impulso/energía | Hoja, sin texto esencial | P0 |
| A12 | Carpeta o sobre del expediente | SVG/PNG | P1 |
| A13 | Manual: tapa, lomo, páginas y separadores | Manual por piezas | P0 |
| A14 | Ilustraciones de fichas y arquitectura de nave | Reusar planetas/naves | P1 |
| A15 | Marco de inventario | Libreta | P0 |
| A16 | Separadores de registro; compartir A15 | Libreta | P0 |
| A17 | **Dos sellos:** reposo, agarre y presión; mangos y bases distinguibles | SVG/PNG, pivote de contacto | P0 |
| A18 | Dos huellas de tinta; texto dinámico | SVG/transparencia | P0 |
| A19 | Cinco símbolos de recursos | SVG 24/32 de referencia | P0 |
| A20 | Controles: libro, inventario, registro, guardar, comparar, fijar, cerrar, páginas, pausa, audio, ayuda, repetir, menú y pantalla completa | Familia SVG coherente | P0 |
| A21 | Cursores propios | 32/64; respaldo nativo | P1 |
| A22 | Aviso y dispositivo de emergencia; cabecera y depósito separados | Emergencia | P0 |
| A23 | Ocho pictogramas E01–E08 | SVG; texto P0 | P1 |
| A24 | Marco de informe, con espacio para tabla | Piezas escalables | P0 |
| A25 | Espacio y estrellas | Proyección; fondo compartido | P0 |
| A26 | **Luna y ocho planetas**; anillos separados cuando sea necesario | SVG/PNG transparente | P0 |
| A27 | **Cinco superficies:** Luna, Mercurio, Venus, Tierra y Marte | Bandas reutilizables | P0 |
| A28 | Plataforma lunar y primer plano | Capas transparentes | P0 |
| A29 | Transporte orbital | Sprite independiente | P0 |
| A30 | Módulo local, patas y motores | Sprite independiente | P0 |
| A31 | Base: normal, intervención, estable y perdida | Una base con capas de estado | P0 |
| A32 | Consola y herramientas de reparación | SVG/PNG | P0 |
| A33 | Variantes específicas de los ocho incidentes | Capas sobre base | P1 |
| A34 | Pluma de motor | Forma simple por código P0 | Arte detallado P1 |
| A35 | Cinco señales de carencia | Reusar símbolos de recursos | P0 |
| A36 | Pérdida simbólica de base; daño sin personas heridas | Capas, sin flash obligatorio | P0; partículas P2 |
| A37 | Oficina/ventanal de evaluación | Reusar oficina con composición propia | P0 |
| A38 | Certificado, traslado y despido | Tres soportes de documento | P0 |
| A39 | Marcos de menú, pausa, opciones y créditos | Un sistema de piezas | P0 |
| A40 | Tablilla de instructor y realce | SVG/PNG | P0; mano ilustrada P1 |
| A41 | Ficha científica y marca editorial propia | Reusar hoja/manual | P0 |
| A42 | Hábitat, refugio, invernadero y antena | Cuatro módulos de base | P0 |
| A43 | Estados: regeneración/reservas; refugio ampliado/compacto; cultivo pendiente/listo; mensaje pendiente/recibido | Capas A42 | P0 |
| A44 | Tres órdenes internas y telegrama | Reusar papeles; encabezados por código | P0 |
| A45 | Tipografía de lectura con números tabulares y O₂ | WOFF2 con licencia; respaldo de sistema | P0; título extra P1 |
| A46 | Tornillos, polvo, desgaste y decoración | Texturas pequeñas | P2 |
| A47 | Captura principal del proyecto | PNG | P0; favicon/social P1 |
| A48 | Capturas y diagrama para siete diapositivas | 16:9 | P0 |

**Todo A01–A46: responsable A**, con integración P. A41/A44 requieren revisión C. A47/A48: C con apoyo A/P.

La producción no exige un archivo por estado: base, personajes, superficies y naves se resolverán con piezas reutilizables. El mínimo artístico conserva nueve identidades, dos naves diferenciadas y materiales claros; no requiere nueve animaciones completas por personaje.

### Contenido y funciones que no deben dibujarse

| IDs | Entregable | Responsable / prioridad |
|---|---|---|
| C01–C03 | Escena, datos de las tres hojas y manipulación completa | P / P0 |
| C04–C05 | Manual: índice, ocho destinos, reglas, emergencias, ciencia y operaciones | P+C / P0 |
| C06–C07 | Inventario, registro vacío/paginado y bitácora | P / P0 |
| C08–C10 | Sellos, consultas, ayudas de colocación e indicador físico | P / P0 |
| C11–C12 | Emergencia, reloj, aporte, probabilidad y partes | P / P0 |
| C13–C14 | Tutorial, controles, menú, pausa y preferencias | P+C / P0 |
| C15–C16 | Créditos, licencias, tres finales y semilla | P+C / P0 |
| C17–C18 | Despachos, estado de base y recursos NASA locales | P+C / P0 |
| C19–C20 | Inglés, accesibilidad, carga, errores y respaldo legible | P+C / P0; español P1 |

Todos los botones tendrán normal, hover, foco, pulsado y deshabilitado. Números grandes no se truncarán ni reducirán silenciosamente.

### Animaciones

| IDs | Secuencias | Prioridad |
|---|---|---|
| M01–M04 | Entrada/salida, hojas, libro, sello y recogida | P0 |
| M05–M08 | Preparación, ascenso, transferencia, ida, operación, regreso y cuatro fases de fallo | P0 |
| M09–M10 | Aviso, urgencia, confirmación, intervención y desenlace | P0 |
| M11–M13 | Archivo, siguiente visitante, finales y tutorial | P0 |
| M14–M15 | Estados de base, mensaje, pausa y movimiento reducido | P0 |
| M16 | Ambiente, parpadeos y gestos adicionales | P2 |

Responsable P, utilizando capas de A. No producir veinte películas distintas para las combinaciones de fase y carencia.

### Audio

| IDs | Sonidos | Prioridad |
|---|---|---|
| S01–S03 | Tomar/soltar/recoger papel, libro/página y sello | P0 |
| S04–S05 | Confirmación, alerta y urgencia | P0 |
| S06 | Motores, acoplamiento y aterrizaje | P1 |
| S07–S08 | Consecuencias y tres cierres; compartir motivos | P0 |
| S09–S11 | Ambiente, música y señales particulares de base | P1 |
| S12 | Voces | P2 |

Síntesis original mediante Web Audio es respaldo P0. Si se producen grabaciones: maestro WAV 48 kHz, distribución comprimida con formato compatible alternativo. Responsable P; C verifica autoría y licencias.

**Manifiesto obligatorio por asset:** ID, autor, fecha, licencia, origen, uso de IA, estado de revisión, tamaño visible/exportado, transparencia, pivote, fotogramas y estados consumidores.

---

## 6. Pruebas y criterios para competir en UX/UI

### Puertas de aceptación

| Área | Criterio verificable |
|---|---|
| Primera interacción | Al menos 4 de 5 participantes nuevos toman y colocan una hoja en ≤20 s sin explicación verbal. |
| Manual | Al menos 4 de 5 encuentran el destino y comparan un recurso en ≤60 s después de la introducción. |
| Comprensión | Al menos 4 de 5 distinguen pedido, mínimo y saldo, y explican el costo de una decisión de base. |
| Sellado | Ninguna decisión involuntaria en el recorrido observado; se entiende cómo cancelar. |
| Recuperación | Todos pueden recuperar una hoja cubierta y guardar el expediente. |
| Legibilidad | Manual + hoja legibles a 1280×720 y 1366×768 útiles; cifras y unidades completas. |
| Fluidez | Objetivo 60 FPS durante arrastre en el equipo de referencia; percentil 95 de fotogramas ≤20 ms y respuesta perceptible ≤50 ms. |
| Accesibilidad | Recorrido completo con ratón, solo clics y solo teclado; ninguna información indispensable depende de color o audio. |
| Robustez | Cero dobles cobros, objetos perdidos, clics atravesados o bloqueos después de pausa/resize. |
| Publicación | Inicio y partida sin registro, errores de carga ni servicios externos obligatorios. |

Son objetivos de aceptación, no resultados ya obtenidos ni garantía de premio.

### Pruebas de usabilidad

Dos rondas:

- **Sábado:** tres personas nuevas, 10–15 minutos cada una; corregir interacción y lectura antes de integrar todo el arte.
- **Domingo:** cinco participantes, preferentemente de 7–12 años con acompañamiento apropiado. Si solo hay adultos, declarar la limitación.

Tareas: abrir y comparar hojas, recuperar una cubierta, cambiar manual, devolver, aprobar, atender emergencia y explicar una operación de base.

Registrar de forma anónima: tarea, tiempo, errores, ayuda requerida y explicación del participante. No grabar imágenes o voces de menores para la entrega. No ayudar hasta registrar dónde se atasca.

Si falla una tarea central, corregir y repetir con observadores nuevos cuando sea posible. La muestra pequeña sirve para detectar problemas; no demuestra eficacia educativa general.

### Pruebas técnicas

**Dominio, con pruebas unitarias nuevas:**

- Catálogo exacto; redondeos; igualdad de mínimos.
- Cinco éxitos distintos y dos eventos sin repetición.
- Generación válida y exclusiones de destinos/personajes.
- Consumos, sobrantes, falta de stock y ausencia de saldos negativos.
- Umbrales 25/50/75/100 y desempates.
- Emergencias 0/50/100%, límite de saldo, expiración y confirmación duplicada.
- Tasa exacta: 5/5 certificado; 5/12 traslado; 5/13 despido.
- Operaciones sin incrementar aprobaciones; presupuesto nuevo y cobro único.
- Reproducibilidad independiente de animaciones.

Caso numérico de referencia: Mercurio, Venus, Tierra, Marte y Júpiter; eventos E02/E04; previsión nueva incluida:

```text
Inventario inicial:
comida       66,330 kg
agua        127,908 L
O₂           29,128 kg
propelente 9,196,000 kg
energía    9,559,000 kWh
```

**Navegador, con Playwright y revisión manual:**

- Arrastre, profundidad, libro persistente, fijación y recuperación.
- Sello en hoja visible, hoja tapada, miniatura y superficie inválida.
- Clics, teclado, repetición de Enter y cancelaciones.
- Pausa durante cada gesto, sellado, salida, cine y emergencia.
- Cambiar pestaña durante 10 s no consume tiempo del juego.
- ×4 y salto conservan saldo, resultado y secuencia.
- No anticipación visual, sonora ni accesible.
- Tutorial independiente y repetible.
- Chrome/Chromium y Safari real; WebKit automatizado complementa, no sustituye esa revisión.
- Fuentes/arte faltantes, audio bloqueado, pantalla completa y conexión interrumpida después de cargar.

Evaluar por simulación diversas semillas y estrategias sin conocimiento de eventos futuros. Reportar tasas observadas; no “corregir” la economía ni garantizar itinerarios sin una nueva decisión explícita.

---

## 7. Desarrollo por horas, cortes y publicación

Los bloques siguientes son planificación de trabajo, **no horarios oficiales adicionales**. Inicio propuesto: sábado 14 a las 11:00. Tiempo total aproximado: 18.5 horas por frente, incluidas integración y entrega.

### Plan de trabajo

| Hora local | Programación | Arte | Ciencia, pruebas y entrega | Dependencia / puerta |
|---|---|---|---|---|
| **Sáb. 11:00–12:00** | Proyecto nuevo, catálogo y boceto de escritorio | Estilo, paleta, encuadres y primera hoja | Elegibilidad, fuentes y revisión del inglés | G0; contrato visual |
| **12:00–14:00** | Arrastre, profundidad, bandeja, manual y sello físico | Escritorio, bandeja, papeles, libro y sellos | Prueba temprana de lectura y gestos | **G1: interacción central funciona** |
| **14:00–16:00** | Motor, semilla, generación, consumo y finales; pruebas | Nueve retratos modulares y recursos | Verificar cantidades y textos del manual | G1 → dominio estable |
| **16:00–18:00** | Expediente completo, devoluciones, aprobación, consecuencias e informe | Transporte, módulo, planetas y superficies | Primera ronda de usabilidad; preparar referencias NASA | **G2: ciclo completo** |
| **18:00–20:00** | Emergencias, pausa global y despachos | Base, técnico, estados y marcos | Cerrar fichas NASA, costos y consecuencias | G2 → campaña completa |
| **20:00–22:00** | Tutorial, teclado/clics, audio e integración | Finales y piezas faltantes P0 | Inglés completo y borrador de siete diapositivas | **G3: versión pública de prueba** |
| **22:00–23:00** | Corregir bloqueos y probar partidas/finales | Revisión visual conjunta | Comprobar acceso público y registrar pendientes | Versión estable para mañana |
| **23:00–08:30** | Descanso; sin trabajo crítico planificado | Descanso | Descanso | Evitar depender de una noche en vela |
| **Dom. 08:30–10:00** | Observar y corregir fallos críticos | Ajustes de lectura y contraste | Segunda ronda de usabilidad | Evidencia UX |
| **10:00–12:00** | Regresión, Safari, rendimiento y accesibilidad | Cierre de P0 | Créditos, referencias y versión final de contenido | **G4: congelar funciones a las 12:00** |
| **12:00–13:00** | Compilación candidata y publicación | Capturas definitivas | Terminar demo y formulario Project | Todo P0 aprobado |
| **13:00–14:00** | Prueba externa y correcciones de entrega | Apoyo a demo | Revisar enlaces, miembros, IA y licencias | **G5: candidato entregable** |
| **14:00–15:00** | Solo correcciones bloqueantes | Sin nuevos assets | Revisión humana y Submit for Judging | Confirmación de envío |
| **15:00–15:30** | Reserva para incidencias | Apoyo | Verificar versión y conservar comprobante | Margen local |

Dependencia principal:

**Elegibilidad → escritorio y sellos → motor → ciclo completo → emergencia/base/tutorial → pruebas → congelación → entrega.**

El arte se produce en paralelo después de fijar encuadres; no debe bloquear la validación temprana de interacción.

### Prioridades y recortes

**P0 indispensable:** interacción documental, sellos arrastrables y alternativas, reglas completas, tres despachos, cantidades correctas, tutorial, legibilidad, pausa, inglés, ciencia trazable, consecuencias, finales, audio básico y publicación.

**P1:** español, música, ambiente, poses adicionales, iconos propios de cada emergencia, ilustraciones extra del manual, carpeta, cursor y metadatos sociales.

**P2:** voces, partículas, decoración extensa, personaje evaluador adicional y gestos ambientales.

Cortes automáticos:

- Si G1 se retrasa: congelar decoración y dedicar todo apoyo a la interacción.
- Si G2 no está listo a las 18:00: retirar P1/P2 y usar animación por capas simples.
- Si G3 no está listo a las 22:00: no comenzar nuevas variantes artísticas; cerrar un recorrido completo.
- Después del domingo a las 12:00: solo correcciones de P0 y entrega.

No recortar silenciosamente recursos, destinos, emergencias, reglas de fracaso o controles accesibles para declarar que el alcance está terminado. Si falta un requisito, registrarlo como limitación real.

### Publicación y entrega

Elegir **GitHub Pages**, repositorio nuevo `space-papers`, compilación estática con rutas correctas para su subdirectorio. Es compatible con HTML, CSS y JavaScript publicados desde un repositorio. [Documentación oficial](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)

- Sin dominio propio, cuentas de jugadores, backend, APIs en vivo ni service worker P0.
- Assets y fuentes locales; objetivo de descarga inicial ≤10 MB.
- Enlace público de prueba el sábado; versión estable etiquetada para poder revertir.
- Mantener consola y cargas limpias; no añadir analítica de jugadores.
- Verificar desde ventana privada y otro dispositivo/red.
- Licencias propuestas: MIT para código y CC BY 4.0 para arte original del equipo, sujetas a compatibilidad con términos y derechos reales; terceros conservan sus licencias.
- Declarar las herramientas y asistencia de IA utilizadas. No presentar arte pendiente como producido ni trabajo anterior como nuevo.

Demo de **siete diapositivas**:

1. Space Papers, equipo y desafío.
2. Usuario objetivo y problema educativo.
3. Manipulación de papeles, libro y sello.
4. Comparación de una propuesta y consecuencia.
5. Decisión de base y costo compartido.
6. Datos NASA, accesibilidad y resultados reales de pruebas.
7. Demo pública, alcance y créditos.

El formato breve, el inglés y los enlaces públicos están respaldados por las orientaciones de entrega consultadas; el responsable comprobará la guía vigente antes de enviar. [Orientación de entrega 2026](https://github.com/nasa/spaceapps/discussions/1973)

**Cierre operativo:** completar Project, revisar miembros y referencias, aceptar los términos mediante el responsable humano, ejecutar **Submit for Judging**, comprobar el banner y conservar captura y URLs antes de las **15:00**. La versión publicada, las capturas y la demo deben corresponder al mismo entregable.

#### Mensaje 4

# Applications mentioned by the user:

[@Notion](plugin://computer-use@openai-bundled?app=notion.id)

## My request:
Dame un agente terra para que en [@Notion](plugin://notion@openai-curated-remote) en el espacio de NASA ponga todos los pendientes de assets para empezar a diseñarlos, haz una lista donde podamos ver el pendiente y el completado, y tu dime en que formato te conviene que lo hagamos,

#### Mensaje 5

# Files mentioned by the user:

## EscenarioFinalCompleto.png: /Users/beto/Downloads/EscenarioFinalCompleto.png
Image attachment: true

Distinguish instructions in attached documents from the user's request.

## My request:
Checa el [@Google Drive](plugin://google-drive@openai-curated-remote) ve a Nasa/arte/principal, vas a ver Escenario, escritorio y puerta, quiero cambiar el juego a una estetica 2,5D y mas 3d los diseños, adapta todo el juego a eso, ocupa modelos mas pequeños si lo ves necesario, Usa modelos SOL y terra (lo que veas mas conveniente) para programar y crear, tu solo estructura ahorita la idea de como se vera el juego para que se vea bien, la referencia principal de los 3 assets juntos te la adjunte, adapta el juego que. ya tenemos a ese 3d, los ingenieros todavia los estamos haciendo entonces solo pon una referencia fea y ya, en las mismas carpetas del drive estan los .blend si crees que ocupas una perspectiva mas, Tienes 91% de las 5 horas en plan plus, espero avances cuando se acaben

No me gusto tu resultado actual, se ve mal y como pagina web, quiero un VIDEOJUEGO completo que descargaria en steam, no una pagina web, esfuerzate en eso

<image name=[Image #1] path="/Users/beto/Downloads/EscenarioFinalCompleto.png">

[Imagen adjunta en el mensaje original.]

</image>

#### Mensaje 6

Hazme preguntas si lo ves necesario, estoy completamente atento

#### Mensaje 7

<send_user_message_question_reply>
[{"questionItemId":"[\"request_user_input_async\",\"call_977b012935aa4d0eb07c193b1a751cb4\",0]","question":"En la referencia, la mesa ocupa poco espacio para leer. Recomiendo que al inspeccionar documentos la cámara se incline y acerque suavemente al escritorio, y vuelva a la habitación al atender al ingeniero. ¿Prefieres esa cámara con dos posiciones o una cámara fija con la mesa más grande desde el inicio?","answer":"Dos posiciones: habitación y escritorio"},{"questionItemId":"[\"request_user_input_async\",\"call_977b012935aa4d0eb07c193b1a751cb4\",1]","question":"¿Qué tono quieres para la iluminación, materiales, sonidos y animaciones de esta versión?","answer":"Ciencia ficción más cálida y amable"}]
</send_user_message_question_reply>

#### Mensaje 8

Usa mas subagentes por ti, creo que tu como astra deberias de solo pensar y comandar, no desarrollar

#### Mensaje 9

Te queda 5% empieza a cerrar todo para continuarlo despues

### Buscar HDRI espaciales de la NASA
ID del chat: `01a1db0d-2cac-7a20-b2c0-4e2950566ab9`

#### Mensaje 1

Busca rapido si la nasa tiene HDRI´s o equivalentes del espacio, y dame fuentes

### Planear trabajo para dos horas
ID del chat: `01a1db0e-8349-7f51-bee0-cf68066336ec`

#### Mensaje 1

Estan por acabarse los tokens, dime que podemos hacer en las 2 horas sin ti programando y pensando

#### Mensaje 2

# Applications mentioned by the user:

[@Notion](plugin://computer-use@openai-bundled?app=notion.id)

## My request:
Anotalo en [@Notion](plugin://notion@openai-curated-remote) en el espacio de NASA, en un apartedo aparte de la lista de mega assets

### Recomienda esfuerzo de Astra o Sol
ID del chat: `01a1db84-3136-7543-9da1-b3b5d19ae92d`

#### Mensaje 1

Gastando pocos tokens, revisa y recomiendame que esfuerzo de astra utilizar, Astra medio o Astra alto, o me paso a sol?

### Space Papers (Sol)
ID del chat: `01a1db85-f9c6-7a52-88e2-e1f6492ead11`

#### Mensaje 1

Retomemos el desarrollo

Primero, revisa la página de Notion [**Apuntes para agregar a Codex**](https://app.notion.com/p/Apuntes-para-agregar-a-codex-41888b30c751804da919c4198603f629?pvs=21) y lee todas sus subpáginas. Contienen nuevas decisiones creativas, pendientes e indicaciones que debes incorporar al desarrollo.

Además, ten en cuenta lo siguiente:

1. **Escenario principal:** Estamos terminando de desarrollarlo y ya está casi listo. Continúa trabajando en las demás funcionalidades; te lo entregaremos en cuanto esté terminado para integrarlo.
2. **Interacciones estilo Papers, Please:** Asegúrate de que los documentos, libros y manuales puedan arrastrarse, apilarse, superponerse y manipularse naturalmente, como en *Papers, Please*.
3. **Premio UX/UI:** Nuestro objetivo es competir por **Best User Experience (UX/UI)**. Prioriza especialmente una experiencia intuitiva, accesible y visualmente coherente para niños de 7 a 12 años.
4. **Emergencias:** Antes de incorporar las propuestas de Notion, compáralas con las emergencias ya implementadas o planeadas para evitar duplicaciones. Prioriza variedad de interacciones.

#### Mensaje 2

Recuerda usar modelos Terra para trabajos especificos o donde tu consideres que sean adecuados

#### Mensaje 3

Ve donde dejo astra el trabajo y cierralo para subir a Github el avance, antes de subirlo enseñamelo, Usa agentes (Sol) para cerrar, no avances mas de lo minimo necesario para no moverle nada, y vamos a poner varias cosas nuevas

#### Mensaje 4

Sube SOLO lo escencial a [@GitHub](plugin://github@openai-curated-remote) a el fork que tenemos de "Spaceapps"

#### Mensaje 5

Continúa el desarrollo de **Space Papers**. Usa agentes y modelos como terra para delegar trabajos, no dudes en usarlos

Lee primero todos los apuntes y recursos de esta página de Notion:

[https://app.notion.com/p/41888b30c75180a0a5ebdd43685c36cd](https://app.notion.com/p/41888b30c75180a0a5ebdd43685c36cd)

Trabaja con autonomía y sigue **estrictamente este orden de prioridades**:

### FASE 1 — Preparar GitHub para Copilot (PRIMERO)

Repositorio: [https://github.com/betoxgames/spaceapps](https://github.com/betoxgames/spaceapps)

Antes de implementar nuevas funcionalidades:

1. Revisa y organiza el repositorio completo sin perder trabajo existente.
2. Comprueba que el proyecto tenga todos los archivos, configuraciones y dependencias necesarias para clonarlo y ejecutarlo.
3. Configura correctamente `.gitignore`, Git LFS si hace falta y la estructura del proyecto.
4. Actualiza `README.md` con instrucciones de instalación, ejecución, compilación y pruebas.
5. Crea `HANDOFF_COPILOT.md` con todo el contexto: arquitectura, mecánicas, decisiones creativas, objetivos UX/UI, recursos, estado actual, problemas y siguientes pasos.
6. Prepara instrucciones para GitHub Copilot, incluyendo las reglas del proyecto y las convenciones necesarias.
7. Crea un commit y haz **push**, verificando que GitHub contiene una versión completa y ejecutable.

Esta fase debe quedar terminada antes de continuar. Copilot debe poder entender y ejecutar el proyecto aunque no tenga acceso a nuestras conversaciones.

### FASE 2 — Ingenieros

Revisa la página actualizada de ingenieros:

[https://app.notion.com/p/41888b30c7518020a63fdf5efe137168](https://app.notion.com/p/41888b30c7518020a63fdf5efe137168)

En Google Drive, `Space papers/Arte/ingenieros`, encontrarás los diseños 3D, rigs y animaciones plantilla en `.blend`.

- Integra los personajes con sus apariencias, colores y personalidades actualizadas.
- Utiliza los modelos y animaciones existentes, sin reconstruir innecesariamente los recursos.
- Adapta y optimiza los archivos para el motor del juego.
- Comprueba las animaciones, el posicionamiento y las interacciones.
- Identifica y documenta los recursos que todavía estén incompletos.

### FASE 3 — Escenario y tipografía

- Revisa los modelos actualizados de la pared y puerta en Google Drive.
- Sustituye los modelos anteriores y corrige el problema del túnel de la puerta que sobresalía por encima de la pared.
- Comprueba la geometría, perspectiva, iluminación e integración del escenario.
- Incorpora la fuente `StickleBoldItalic.ttf` adjunta en Notion y verifica su legibilidad.
- Conserva y perfecciona las interacciones de libros, documentos y hojas inspiradas en *Papers, Please*.

### FASE 4 — Visor planetario (AL FINAL)

Comienza a desarrollar el visor espacial mediante la ventana/monitor del fondo.

- Debe percibirse ligeramente alejado, integrado naturalmente en el escenario.
- Evita que el planeta parezca estar directamente enfrente del jugador.
- Respeta las decisiones previas sobre los planetas, la Luna y los recursos de Solar System Scope.
- Prioriza la composición visual, perspectiva, escala y rendimiento.

### FASE 5 — Build jugable, pruebas y entrega

Después de implementar las fases anteriores:

1. Genera una **versión jugable y funcional** con todos los cambios.
2. Prueba las mecánicas principales, ingenieros, animaciones, escenario y visor.
3. Corrige los errores detectados y verifica la compilación.
4. Deja los sonidos para después de probar esta primera build. Entrega únicamente una lista priorizada de efectos necesarios para buscar en repositorios públicos o gratuitos.
5. Actualiza `HANDOFF_COPILOT.md` con el estado FINAL del proyecto, incluyendo todos los avances realizados durante estas fases.
6. Realiza los commits y el **push final a GitHub**. Verifica que el repositorio contiene todo lo necesario para ejecutar la versión jugable.

### Entrega obligatoria

Al terminar, proporciona:

- Resumen de cambios por fase.
- Instrucciones exactas para jugar la build.
- Pruebas realizadas y problemas pendientes.
- Lista de sonidos necesarios.
- Rama, último commit y confirmación del push.
- Ruta del documento de transferencia.
- Siguiente tarea recomendada para GitHub Copilot.

**Prioridad absoluta: Best User Experience (UX/UI).** Estamos compitiendo por una experiencia intuitiva, accesible y efectiva.

No te quedes únicamente en la planificación. **Primero prepara GitHub para Copilot; después ingenieros, escenario y visor planetario, en ese orden.** Realiza commits por fase para preservar el progreso. Al final, asegúrate de que Copilot pueda continuar inmediatamente desde el repositorio sin perder contexto ni funcionalidades.

#### Mensaje 6

Saul si esta terminado

#### Mensaje 7

Te queda 30% Mejor usalo para reparar tu git publicado, quiero poder hacer el pull y correr el html de una, no  tener que descargar ninguna cosa

#### Mensaje 8

Continua trabajando, se te van a acabar los tokens en muy poco, ten eso en cuenta, continua con los ingenieros, usa agentes terras para delegar tareas

#### Mensaje 9

Se ven muy feos los ingenieros, quiero que primero arregles la pared que te dije con los nuevos assets, y quiero que por la puerta lleguen los ingenieros y se acomoden ahi

#### Mensaje 10

Y renderizalos con mejor calidad, estan muy comprimidos

#### Mensaje 11

Sube este nuevo cambio a git, con la puerta reparada

### Notion
ID del chat: `01a1dbb0-df43-7d91-9f52-078b9891b6ab`

#### Mensaje 1

# Applications mentioned by the user:

[@Notion](plugin://computer-use@openai-bundled?app=notion.id)

## My request:
En [@Notion](plugin://notion@openai-curated-remote) en el espacio de NASA anota todo lo que ya este o ponlo como "completo"

#### Mensaje 2

Considera que acabo de subirle algo a Astra, checa el otro chat en curso actual

#### Mensaje 3

# Applications mentioned by the user:

[@Notion](plugin://computer-use@openai-bundled?app=notion.id)

## My request:
En [@Notion](plugin://notion@openai-curated-remote) en el espacio de NASA en Beto hasme un To do List, una plantilla buena, con incompleto en proceso y completo, espacio para poner la tarea y breve descripcion

#### Mensaje 4

Agrega TODO lo que falte del proyecto, y sobre assets solo agrega "assets"

#### Mensaje 5

# Applications mentioned by the user:

[@Notion](plugin://computer-use@openai-bundled?app=notion.id)

## My request:
Anota en [@Notion](plugin://notion@openai-curated-remote) todo el progreso

### Verificar requisitos del git público
ID del chat: `01a1dcb5-bd88-7d80-81b1-d31032cbb750`

#### Mensaje 1

El git publico tiene todo lo necesario para descargarlo y jugarlo en cualquier compu?

#### Mensaje 2

Resuelve eso, quiero descargar el git y que funcione

#### Mensaje 3

Subelo a Git, y acomoda todo lo necesario para que sirva

#### Mensaje 4

NO, QUIERO QUE SOLUCIONES EL MAIN, NO PUEDES DEJARLO SIN SERVIR

### Terra
ID del chat: `01a1dd44-a587-7731-8140-11b0f1d75ecd`

#### Mensaje 1

Revisa el proyecto que tenemos y dame una lsita en este chat de cosas que falten, incluyendo lo mio que seria:
Arreglar la puerta, le falta todo el trozo de arriba
arreglar a los ingenieros con los nuevos renders que hicimos y acomodarlos de manera correcta

#### Mensaje 2

Desarrolla el plan para el siguiente paso, es este apartado de notion [https://app.notion.com/p/Notas-para-Codex-3-41988b30c75181a18df6fc86399684e5?source=copy_link](https://app.notion.com/p/Notas-para-Codex-3-41988b30c75181a18df6fc86399684e5?source=copy_link)

#### Mensaje 3

Dame el prompt para darle a Sol que haga esa tarea

### Ingenieros
ID del chat: `01a1ddad-98d0-72e3-8f40-5275f0d021e5`

#### Mensaje 1

Trabaja directamente en el proyecto Space Papers ubicado en:\
\
/Users/beto/Desktop/ChatGPT/NASA/space-papers\
\
Implementa el siguiente paso descrito en esta página de Notion:\
https\://app.notion.com/p/Notas-para-Codex-3-41988b30c75181a18df6fc86399684e5?source=copy_link\
\
El objetivo es integrar los nuevos renders de los nueve ingenieros y hacer que su entrada al escenario se vea natural y convincente.\
\
Recursos del equipo:\
Google Drive → Arte / Personajes / Ingenieros / animaciones\
https\://drive.google.com/drive/folders/18ary3tO44csa7YWqPtnE2IqQTt2BXYRN\
\
Requisitos:\
\
1\. Revisa las carpetas de los nueve ingenieros y utiliza los nuevos renders proporcionados por el equipo. Comprueba dimensiones, transparencia, secuencia, duración y punto de apoyo de los pies. Optimiza los archivos para el juego sin alterar la apariencia de los personajes.\
\
2\. Haz que cada ingeniero:\
&#x20;  \- Entre físicamente por la puerta, con un recorrido visible.\
&#x20;  \- Termine de atravesarla antes de que esta se cierre.\
&#x20;  \- Camine hasta su posición detrás del escritorio.\
&#x20;  \- Tenga una escala creíble de persona adulta respecto a la puerta, la mesa y la habitación.\
&#x20;  \- Quede correctamente integrado mediante la trayectoria y el orden de profundidad de las capas.\
\
3\. Integra las animaciones de reacción cuando se aprueba o se devuelve su proyecto. Localiza los renders correspondientes y úsalos. Si no están disponibles, deja documentado qué falta y dónde buscaste; no afirmes que quedaron integrados ni inventes los assets.\
\
4\. Coordina puerta, desplazamiento y animaciones con el reloj del juego. Deben respetar pausa, pestaña oculta y movimiento reducido. Revisa el comportamiento al cambiar entre las cámaras.\
\
5\. La reacción a aprobar una propuesta no debe revelar si la misión tendrá éxito antes de que se muestre su consecuencia. Conserva las reglas, los recursos y el balance actuales.\
\
6\. Ten en cuenta que a la puerta todavía le falta el trozo superior. No presentes una máscara o ajuste de capas como una reparación definitiva del modelo. Avanza con la secuencia usando los recursos disponibles y señala cualquier dependencia visual que quede pendiente.\
\
7\. Conserva el juego autocontenido y funcional sin conexión. Regenera el archivo jugable mediante el proceso de compilación del repositorio; no edites a mano el index.html generado.\
\
Verificación:\
\
\- Comprueba la secuencia completa para los nueve personajes: apertura → entrada → cierre → caminata → posición detrás de la mesa → reacción → salida.\
\- Revisa escala, trayectoria, pies, oclusiones y transiciones visualmente en ambas cámaras.\
\- Prueba pausa durante la secuencia, movimiento reducido, cambio de cámara y carga de assets.\
\- Ejecuta las pruebas pertinentes y comprueba la versión sin conexión. Si Node no está disponible en el PATH, busca el runtime instalado o documenta el impedimento con precisión.\
\- Al terminar, informa qué cambiaste, qué pruebas ejecutaste y qué recursos o problemas siguen pendientes.\
\
Antes de modificar archivos, revisa las instrucciones y el estado actual del repositorio. Preserva cualquier cambio existente que no pertenezca a esta tarea.

Durante todo el proceso utiliza agentes que te apoyen, desde Sol si lo vez necesario hasta terra y luna dependiendo del trabajo

#### Mensaje 2

Excelente, solo un pequeño error, el ingeniero pasa por a lado de la puerta en lugar de atravez, me imagino es por como renderizamos la puerta, propongo que enseñes al personaje aparecer adelante de la puerta en cuanto se abre o hacer que aparezca pequeño y vaya creciendo mientras mas grande la puerta

### Sube los cambios a GitHub
ID del chat: `01a1ddd3-b2d8-7700-b388-0c284ae69c83`

#### Mensaje 1

Sube lo nuevo a [@GitHub](plugin://github@openai-curated-remote) en Spaceapps

#### Mensaje 2

Sube a [@GitHub](plugin://github@openai-curated-remote)

### Mejorar la experiencia de Space Papers
ID del chat: `01a1dde9-43cc-7b72-b578-3511b16d298a`

#### Mensaje 1

Revisa exhaustivamente toda la **UI y UX de Space Papers**, incluyendo menús, pantallas, botones, ventanas, documentos, animaciones, transiciones, interacciones y flujo de juego.

Tu objetivo es **mejorar significativamente la experiencia del usuario**, buscando un resultado profesional, intuitivo, visualmente atractivo, accesible y consistente.

Ten en cuenta que competimos por el premio **Best User Experience (UX/UI)** de NASA Space Apps, por lo que este aspecto es una prioridad absoluta.

**Instrucciones:**

- Analiza todo el proyecto e identifica problemas de diseño, navegación, claridad visual, accesibilidad y usabilidad.
- Mejora la jerarquía visual, distribución de elementos, tipografía, colores, animaciones y retroalimentación de las interacciones.
- Asegúrate de que cualquier jugador pueda entender qué hacer sin necesitar explicaciones excesivas.
- Mantén la identidad visual de Space Papers y su inspiración en *Papers, Please*, especialmente las interacciones físicas con documentos y objetos.
- Optimiza la experiencia para diferentes tamaños de pantalla y evita elementos superpuestos, confusos o difíciles de utilizar.
- Añade pequeños detalles de pulido visual y funcional que hagan que el juego se sienta profesional.
- **No elimines funcionalidades ni cambies mecánicas importantes** sin una justificación clara.
- Comprueba que todas las mejoras funcionen correctamente y no introduzcan errores.

**Trabaja de forma autónoma:** no te limites a sugerir cambios; implementa las mejoras necesarias, pruébalas y corrige cualquier problema detectado.

Al finalizar, sube todos los avances a GitHub mediante commits organizados y entrega un resumen de los cambios realizados, problemas corregidos y posibles mejoras pendientes.

**Prioriza la calidad de la experiencia por encima de añadir nuevas funcionalidades.**



Utiliza subagentes y otros modelos en caso de verlo oportuno

#### Mensaje 2

prioriza el commit, olvida las pruebas

#### Mensaje 3

Mejora el Ux/ui nuevamente, pulelo y mejora diseños, me gusto el actual, sobre el ingeniero, ve si puedes dejar un mini agente trabajando en que los inenieros cuando entren sean mas fluidos, toman como una pausa cuadno llegan y tambien quiero que cuando los apruebas, festejen y se queden en el cuarto, y luego inicia la animación

#### Mensaje 4

# Files mentioned by the user:

## Captura de pantalla 2026-11-15 a la(s) 5.31.53 am.png: /var/folders/24/c5x5rgj51qvbg6x1nnrkkp0h0000gn/T/TemporaryItems/NSIRD_screencaptureui_Y3UhOf/Captura de pantalla 2026-11-15 a la(s) 5.31.53 am.png
Image attachment: true

Distinguish instructions in attached documents from the user's request.

## My request:
Mejora bastante esta ventana, centra y pon tantito arriba las hojas de propuesta del ingeniero para que parezca que te las esta dejando en la parte superior de la mesa, mejora mucho como se ven las hojas y como se ven el manual y el stock, actualiza los diseños para ser mas agradables de usar y a la vista, y revisa que el texto si entre en las hojas, hay apartados donde se sale

<image name=[Image #1] path="/var/folders/24/c5x5rgj51qvbg6x1nnrkkp0h0000gn/T/TemporaryItems/NSIRD_screencaptureui_Y3UhOf/Captura de pantalla 2026-11-15 a la(s) 5.31.53 am.png">

[Imagen adjunta en el mensaje original.]

</image>

#### Mensaje 5

# Files mentioned by the user:

## Captura de pantalla 2026-11-15 a la(s) 5.44.46 am.png: /var/folders/24/c5x5rgj51qvbg6x1nnrkkp0h0000gn/T/TemporaryItems/NSIRD_screencaptureui_wCAqov/Captura de pantalla 2026-11-15 a la(s) 5.44.46 am.png
Image attachment: true

Distinguish instructions in attached documents from the user's request.

## My request:
Hay muchas cosas en pantalla, soluciona eso, mejora como se ve el manual, haz que cuando lo habra, desaparezca el manual cerrado de atras, tambien haz que si yo le pico a donde originalmente iban las propuestas se regresen a su lugar, elimina en la parte superior izquierda los  01 floghtplan, 02 life support 03 propulssion, siento que estan de mas, elimina el "your shift, 0/5 y 0/2 incidents" y mejor mejora mucho el monitor que esta de fondo atras del ingeniero,

<image name=[Image #1] path="/var/folders/24/c5x5rgj51qvbg6x1nnrkkp0h0000gn/T/TemporaryItems/NSIRD_screencaptureui_wCAqov/Captura de pantalla 2026-11-15 a la(s) 5.44.46 am.png">

[Imagen adjunta en el mensaje original.]

</image>

#### Mensaje 6

Mejora el reporte despues de cada mision, piensa en un mejor diseño, considero que no es necesario reportar cuanto fue el gasto ni el total restante, para que el jugador si tenga una razon de ver el inventario

#### Mensaje 7

Borra las menciones de incidentes previas a un incidente, tienen que ser sorprendidos los jugadores

### Reestructura GitHub y agrega carpeta
ID del chat: `01a1df1b-dab9-7352-970e-cccab4234f32`

#### Mensaje 1

Considero que el GitHub esta horriblemente estructurado, Arreglalo para ya empezar a subir versiones finales, y deja una carpeta donde vamos a poner todas nuestras evidencias/fuentes/prompts del proyecto

#### Mensaje 2

No me abre el juego en el commit actual, resuelve eso

### Busca referencias a trabajo anterior
ID del chat: `01a1df28-24d8-7591-a059-d1192522925c`

#### Mensaje 1

[Referencia a trabajo anterior al 14 de noviembre retirada a petición del usuario.]

#### Mensaje 2

Borra todas esas evidencias tan obvias

#### Mensaje 3

Solamente las menciones

### Amplía el espacio de juego
ID del chat: `01a1df5b-09f2-7ea1-9cb4-554a29b0cdd4`

#### Mensaje 1

Siento que falta espacio en la zona de juego, podras hacer todo lo que se pone en el escritorio mas pequeño o ve como lo adaptas para sentir que falta espacio, tambien has mas intuitivo el que se pueden arrastrar las hojas de propuesta de vuelta a su lugar correspondiente

#### Mensaje 2

Haz un poco más visual y bonito cuando es un plan de emergencia y cuando es una emergencia de supervivencia, mi tester considero que aparece de la nada y se ve feo todo ese proceso, hazlo llamativo y que no solo aparezca

#### Mensaje 3

Mejorar BASTANTE el manual, todos mis tester lo sintieron feo, entonces restructuralo desde 0 y hazlo tanto funcional como llamativo

#### Mensaje 4

Mejora los menos de resgistro post aprobar algo, haz que use la paleta de colores y una interfaz mas amigable con el usuario, tambien un poco mas legible

#### Mensaje 5

# Files mentioned by the user:

## Captura de pantalla 2026-11-15 a la(s) 8.27.37 am.png: /var/folders/24/c5x5rgj51qvbg6x1nnrkkp0h0000gn/T/TemporaryItems/NSIRD_screencaptureui_ApUHE9/Captura de pantalla 2026-11-15 a la(s) 8.27.37 am.png
Image attachment: true

Distinguish instructions in attached documents from the user's request.

## My request:
Dale sentido a estos botones, hay algunos que no sirven, y elimina el libro de checar inventario que esta afuera, hagamos que solo se pueda acceder por el manual, para dar mas espacio al usuario y no llenar tanto su pantalla

<image name=[Image #1] path="/var/folders/24/c5x5rgj51qvbg6x1nnrkkp0h0000gn/T/TemporaryItems/NSIRD_screencaptureui_ApUHE9/Captura de pantalla 2026-11-15 a la(s) 8.27.37 am.png">

[Imagen adjunta en el mensaje original.]

</image>

#### Mensaje 6

Cierra tu trabajo y empieza a subirlo a git, no tengo tokens

### Sellos
ID del chat: `01a1e013-dd90-7832-a639-02c43d5c1c3a`

#### Mensaje 1

**Vamos a mejorar los sellos con assets que hicimos, utiliza agentes luna y terra donde veas correspondiente**

- Localiza los nuevos assets gráficos y sonoros en `Spacepapers/arte/ui/` en [@Google Drive](plugin://google-drive@openai-curated-remote)&#x20;
- Reemplaza los gráficos antiguos por los nuevos
- Integra los efectos de sonido correspondientes
- Conserva intacta la mecánica de arrastrar y seleccionar los sellos

### Sonidos
ID del chat: `01a1e016-57e5-7293-8a48-42ead4cc7628`

#### Mensaje 1

**Vamos a poner efectos de sonido que conseguimos, utiliza modelos Luna y terra donde veas correspondiente**

- Revisa el sonido de puerta incluido en el apartado correspondiente e intégralo si todavía no está conectado, se encuentra en el mismo lugar donde estan los assets de la puerta en [@Google Drive](plugin://google-drive@openai-curated-remote)&#x20;
- Localiza `ambient music` dentro de `Spacepapers/arte/escenarioprincipal/` en [@Google Drive](plugin://google-drive@openai-curated-remote)&#x20;
- Utilízalo como música ambiental en bucle, con volumen discreto
- Respeta las restricciones de reproducción automática de los navegadores
- Evita audios duplicados y conserva la compatibilidad offline

#### Mensaje 2

Suenan terriblemente desfazados los sonidos de sellar y ligeramente el de la puerta, recorta y cambia velocidades si hace falta, usa modelos luna y terra donde veas conveninete

### Manual final (ojala)
ID del chat: `01a1e019-04a8-7a22-846a-1b7134757fbe`

#### Mensaje 1

**Vamos a arreglar un poco el manual actual, usa modelos Luna y Terra donde veas correspondiente**

- Elimina completamente la sección "Before you stamp".
- Sustitúyela por un único renglón horizontal amplio para acceder al inventario.
- Aumenta el tamaño y protagonismo de "A good journey starts with a good check."
- Agranda ligeramente los títulos de las categorías.
- Revisa contraste, espaciado y legibilidad en distintas resoluciones.

#### Mensaje 2

En el manual, extiende un poco el espacio de la frase princpial y baja un poco el inventario, para que se vea mas llamativo

#### Mensaje 3

De que trata ese error ajeno?

#### Mensaje 4

Haz mas grande los textos del manual, es muy dificil de leer

### Refactorizar estructura del juego
ID del chat: `01a1e023-9539-7b22-964f-c14d278887f7`

#### Mensaje 1

Revisa y **refactoriza la estructura completa del proyecto**. Actualmente, gran parte del juego está concentrada en un único archivo HTML enorme, lo cual dificulta su mantenimiento, organización y desarrollo.

Quiero que lo reorganices siguiendo las buenas prácticas de un repositorio profesional de videojuegos web:

- **Modulariza el código:** separa HTML, CSS y JavaScript. Divide la lógica en módulos según sus responsabilidades (interfaz, mecánicas, escenas, personajes, animaciones, datos, etc.).
- **Organiza los recursos:** crea una estructura clara de carpetas para modelos 3D, texturas, sonidos, imágenes y demás assets.
- **Evita duplicaciones:** elimina código redundante, archivos obsoletos y dependencias innecesarias, sin perder funcionalidades.
- **Mantén el juego intacto:** no cambies su apariencia, mecánicas, comportamiento ni contenido. Esta tarea es exclusivamente una refactorización estructural.
- **Documenta la arquitectura:** actualiza el README con la estructura del proyecto y las instrucciones para desarrollarlo.

### REQUISITO FUNDAMENTAL

**Al clonar o descargar el repositorio, debe ser posible abrir `index.html` con doble clic y jugar inmediatamente**, sin instalar dependencias, ejecutar servidores locales ni utilizar la terminal.

#### Mensaje 2

Utiliza los agentes luna terra o sol cuando lo creas conveninete o adecuado

### Sube el prototipo a GitHub
ID del chat: `01a1e032-6c54-7a13-a5ce-6450a8228209`

#### Mensaje 1

Sube el prototipo actual a [@GitHub](plugin://github@openai-curated-remote)

### Aprovecha el 4% de ChatGPT Plus
ID del chat: `01a1e035-6e8a-7800-b794-eafb800c284a`

#### Mensaje 1

Que hago con 4% restante de mis 5 horas de chatgpt plus que apoye al proyecto?

### Corrige sprites y animación de puerta
ID del chat: `01a1e03a-eb24-70a2-b867-2b1d6116b038`

#### Mensaje 1

Hubo una refactorización completa del proyecto y se rompio la ubicación y sprites de la puerta, podras acomodarla para que este centrada y bien animada? usa [@Google Drive](plugin://google-drive@openai-curated-remote) y algun modelo Luna/terra para ayudarte a economizar

### Integrar renders de estaciones lunares
ID del chat: `01a1e04d-2591-7f73-a1b2-be53f81d9a69`

#### Mensaje 1

Vamos a cambiar el asset de animaciones en algunas de las emergencias, en mi [@Google Drive](plugin://google-drive@openai-curated-remote) en Space papers/Arte/stacion espacial te deje unos renders de estaciones lunares, quiero que las veas e integres, hazme preguntas de ser necesario, usa modelos luna y terra donde veas conveniente

#### Mensaje 2

<send_user_message_question_reply>
[{"questionItemId":"[\"request_user_input_async\",\"call_4adb82f898ef4a7bb2ab6468d9af5826\",0]","question":"Propongo usar la estación en esas cinco emergencias, con luces rojas o apagadas durante la alerta, amarillas durante la intervención y blancas al recuperarse. ¿Prefieres ese alcance o aplicarla a las ocho emergencias?","answer":"Esas cinco emergencias"}]
</send_user_message_question_reply>

#### Mensaje 3

# Files mentioned by the user:

## Captura de pantalla 2026-11-15 a la(s) 11.53.02 am.png: /Users/beto/Desktop/Captura de pantalla 2026-11-15 a la(s) 11.53.02 am.png
Image attachment: true

Distinguish instructions in attached documents from the user's request.

## My request:
Todavia hay misiones sin el nuevo render, repara eso, usa modelos como luna y terra donde veas conveniente

<image name=[Image #1] path="/Users/beto/Desktop/Captura de pantalla 2026-11-15 a la(s) 11.53.02 am.png">

[Imagen adjunta en el mensaje original.]

</image>

### Adapta naves a cinemáticas
ID del chat: `01a1e04f-ce9f-7092-9970-18275e62dc64`

#### Mensaje 1

Vamos a hacer un cambio bastante grande, quiero que veas las carpetas de Google Drive y encuentres en Spacepapers/Arte/ el modulo de nave pequeña y la nave interplanetaria y sus sonidos respectivos (a los cuales creo les tendras que bajar volumen), esas iran en las animaciones, quiero que las adaptes en las cinematicas al aceptar misiones, usa modelos Luna y terra donde veas conveniente y haz preguntas si tienes dudas, estoy atento

#### Mensaje 2

# Files mentioned by the user:

## Foto 1.jpg: /tmp/codex-remote-attachments/01a1e04f-ce9f-7092-9970-18275e62dc64/9B9F7C45-D9F4-4FAE-9E8C-6F597C740530/1-Foto-1.jpg

## My request:
Ignora que estoy en medio de la foto, me encantó la idea de que la cinemática sea completamente oscura y con estrellas de fondo, sin todos los menús que lo rodean, ve que puedes crear

[Imagen adjunta en el mensaje original.]

### Mejora el tutorial guiado
ID del chat: `01a1e069-a1fa-7813-9ea9-878b6d49e5af`

#### Mensaje 1

Mejora el tutorial MUCHO, oscurese la pantalla y solo deja luz en las partes que el usuario deba de tocar y reduce mucho el texto, recuerda que es un juego para niños de 12 años

### Renueva el menú 3D de Space Papers
ID del chat: `01a1e075-0d87-71a1-8642-2849a517e797`

#### Mensaje 1

Renueva **completamente el menú principal de Space Papers**, creando una experiencia **3D interactiva, espectacular y visualmente impactante** desde el primer segundo. Prioriza la calidad visual, la fluidez y una UX/UI sobresaliente.

**Asset principal:** Busca `moonmenufinal.glb` en `asset-sources`, inspecciona su estructura y conviértelo en el protagonista del menú.

**Información del modelo (Blender):**

- `Empty.001` es el objeto padre que agrupa la Luna, sus componentes y luces. Úsalo como referencia para permitir que el jugador **gire libremente la Luna** con mouse o touch.
- Contiene animaciones de luces mediante keyframes hasta el **frame 48**. Comprueba si se exportaron al GLB; si existen, reprodúcelas correctamente. Si no, recréalas respetando su intención original.
- Examina jerarquías, pivotes, materiales, texturas, iluminación y animaciones antes de modificarlo.

**Implementación:**

1. Diseña un menú 3D inmersivo con animaciones de entrada, transiciones cinematográficas, iluminación atractiva e interacciones satisfactorias.
2. Integra elegantemente las opciones existentes del juego (jugar, continuar, configuración, etc.) sin sacrificar funcionalidad ni legibilidad.
3. Implementa rotación intuitiva, animaciones fluidas y detalles visuales que hagan que el menú se sienta profesional.
4. Optimiza rendimiento, tiempos de carga, adaptación a diferentes pantallas, controles táctiles y accesibilidad.
5. Respeta la arquitectura modular del proyecto. **El juego debe seguir funcionando al abrir directamente el HTML, sin instalar dependencias ni iniciar servidores.** Resuelve cualquier incompatibilidad de carga del GLB con `file://`.
6. Comprueba el funcionamiento real del menú, navegación, animaciones y transición al juego. Evita regresiones y documenta los cambios relevantes.

**Autonomía:** Tienes libertad creativa y técnica para lograr el mejor resultado posible. Puedes apoyarte en los modelos **Terra y Luna** para tareas específicas, análisis o implementación; tú (Sol en esfuerzo alto) coordinas, integras y validas el resultado final.

**Importante:** Estoy disponible para responder preguntas sobre el GLB, Blender, las animaciones o las decisiones de diseño. **Pregúntame cualquier detalle que pueda mejorar significativamente el resultado**, especialmente antes de tomar decisiones difíciles de revertir. No improvises aspectos esenciales si puedes consultármelos.

**Objetivo final:** Un menú memorable, técnicamente sólido, visualmente impresionante y digno de competir por el premio **Best User Experience (UX/UI)**.

#### Mensaje 2

Ya lo coloque, continua con el mismo prompt

#### Mensaje 3

<send_user_message_question_reply>
[{"questionItemId":"[\"request_user_input_async\",\"call_c6192b293bb049918f4e0bf055319d63\",0]","question":"El GLB no contiene luces ni animaciones exportadas. Para recrear el ciclo hasta el frame 48: ¿qué luces cambian (color, intensidad o posición), cómo se ve el inicio y el final, y a cuántos FPS está la escena? Si tienes el .blend original, también puedes indicar su ruta.","answer":"Pausa lo que estes haciendo, te paso la luz en un minuto"}]
</send_user_message_question_reply>

#### Mensaje 4

vuelve a ver la carpeta, ya te subi el .blend

#### Mensaje 5

<send_user_message_question_reply>
[{"questionItemId":"[\"request_user_input_async\",\"call_5f64897d7a0641898c3482c253ea89d9\",0]","question":"Ahora aparece `space-papers/asset-sources/MoonMenuFinal.blend`, pero es una carpeta vacía, no un archivo de Blender. ¿El archivo todavía se está copiando o lo guardaste en otra ruta? Continuaré con la interfaz mientras queda disponible.","answer":"Dame un momento, creo lo descaargue mal, pausalo"}]
</send_user_message_question_reply>

#### Mensaje 6

Listo, en la carpeta estan los .blend

#### Mensaje 7

No quiero un observatorio oscuro, iluminalo

#### Mensaje 8

Y no olvides poner estrellas de fondo, con figuras geometricas basta

#### Mensaje 9

Acomoda mas la estacion lunar, se ve terriblemente acomodada

#### Mensaje 10

Olvidate de los telefonos, termina esto, ya casi no tengo tokens

### Sube todas las actualizaciones a GitHub
ID del chat: `01a1e092-0bfa-7813-a154-7e80c29cded8`

#### Mensaje 1

sube a [@GitHub](plugin://github@openai-curated-remote) todas las actualizaciones

### Analiza y agrega al plan
ID del chat: `01a1e098-70bd-70d2-90dc-b85825950740`

#### Mensaje 1

# Files mentioned by the user:

## 0D283A5B-467E-4AEF-B189-B96838CE9183_1_102_o.jpeg: /Users/beto/Pictures/Photos Library.photoslibrary/resources/derivatives/0/0D283A5B-467E-4AEF-B189-B96838CE9183_1_102_o.jpeg
Image attachment: true

Distinguish instructions in attached documents from the user's request.

## My request:
Analiza y agrega esto a lo que debemos de hacer, vamos a empezar a trabajar esto

<image name=[Image #1] path="/Users/beto/Pictures/Photos Library.photoslibrary/resources/derivatives/0/0D283A5B-467E-4AEF-B189-B96838CE9183_1_102_o.jpeg">

[Imagen adjunta en el mensaje original.]

</image>

#### Mensaje 2

# Applications mentioned by the user:

[@Notion](plugin://computer-use@openai-bundled?app=notion.id)

## My request:
Haz un apartado nuevo en el espacio de NASA de [@Notion](plugin://notion@openai-curated-remote) donde pongamos TODO los requisitos y con un apartado de en proceso y completado para hacerlo en orden

#### Mensaje 3

# Applications mentioned by the user:

[@Notion](plugin://computer-use@openai-bundled?app=notion.id)

## My request:
ve [@Notion](plugin://notion@openai-curated-remote) actualiza dependiendo a nuestor aportes y dime que falta

### Revisar resumen del proyecto en inglés
ID del chat: `01a1e0a1-8209-73a0-be2e-334dc4a40904`

#### Mensaje 1

Redactar en inglés qué desarrollamos, cómo responde al desafío y por qué importa. Hay borrador de 117 palabras en la hoja de trabajo local; revisar que describa la versión final y vuelva a contar palabras tras editar.

#### Mensaje 2

Explicar qué hace el juego, cómo funciona, sus beneficios y objetivo, y qué herramientas, lenguajes, hardware y software se usaron. Confirmar herramientas de arte/audio y no atribuir usos no comprobados.

Usamos blender, git, Chatgpt, notion para apuntes y ya, busca lo demas tu, dame solo la respuesta a la pregunta

#### Mensaje 3

Declarar asistencia de código/documentación con precisión. La hoja pide indicar el uso mediante marca de agua o en la descripción del proyecto. Confirmar si se generaron imágenes/video; colocar marca de agua en esos materiales cuando aplique.


Esta es mi repsuesta hasta el momento:
No se genero ningun asset con IA, todos hechos a mano en blender o descargados de internet, solo algunas figuras geometricas fueron programadas por ia\
\
El codigo fue mayormente programado con IA

#### Mensaje 4

Para optar a premios globales, la hoja exige al menos un recurso NASA de la pestaña Resources del desafío. Revisar el recurso elegido y demostrar que Space Papers lo usa como parte sustantiva de la solución educativa.

### Definir rúbrica de evaluación 1–5
ID del chat: `01a1e0b0-90e0-7720-b385-1259aa5d8a49`

#### Mensaje 1

Rúbrica 1–5: explicar el problema y quién se beneficia; mostrar el aprendizaje que produce el juego. No afirmar alcance ni métricas que no se hayan medido.

#### Mensaje 2

Respondelo tu con este proyecto

### Documentar fuentes NASA y datos
ID del chat: `01a1e0b1-26db-7060-ac5b-599c648d779d`

#### Mensaje 1

Indicar qué recurso NASA se usó y añadir enlaces a todos. Registrar ID/fecha/unidades/transformación y límites cuando aplique. Separar datos observados de los costos y probabilidades ficticios del juego.

Ya pusimos los assets, nos toca la info

### Confirma uso de Space Agency Partner
ID del chat: `01a1e0c5-9ff7-7b80-b7e9-e2324643eb5d`

#### Mensaje 1

Los datos de Space Agency Partner son opcionales pero alentados. Confirmar si se usó alguno; incluir enlace y uso o indicar que no se usaron.

### Crear guion para video del juego
ID del chat: `01a1e0c6-fd04-7ec3-ad4e-505aa4aac99a`

#### Mensaje 1

Vamos a hacer un video en vez de una presentación, planeo que sea gran parte video del juego, pero entiendo que al inicio tenemos que presentarnos, danos un guion, nos grabamos en las partes necesarias y ahorita te paso todo para que te encargues tu del video

#### Mensaje 2

Prefiero que solo aparezcamos y hablamos al inicio y digamos algo como "Aqui el trailer"

#### Mensaje 3

Estoy viendo que en ningun lado pide que salgamos, entonces haremos un trailer de videojuego dinamico y feroz, aqui tienes algunas referencias, sigue los requisitos del video
[https://www.youtube.com/watch?v=9lvPkYAf9fo](https://www.youtube.com/watch?v=9lvPkYAf9fo)
[https://www.youtube.com/watch?v=\_68sdPWhIFo](https://www.youtube.com/watch?v=_68sdPWhIFo)

#### Mensaje 4

DAME UN PROMPT PARA HACER EL VIDEO, Hare que chatgpt work lo haga de manera nativa

### Crear tráiler de Space Papers
ID del chat: `01a1e0ce-7820-7d50-aba1-2a0ddec39e88`

#### Mensaje 1

Crea un **tráiler de videojuego de máximo 30 segundos** para **Space Papers**, del equipo Los valar. Usa principalmente **grabación real del juego** disponible en `/Users/beto/Desktop/ChatGPT/NASA/space-papers`. No queremos aparecer ni hablar.

Referencias de energía y ritmo: [Zwaard](https://www.youtube.com/watch?v=9lvPkYAf9fo) y [Pluto](https://www.youtube.com/watch?v=_68sdPWhIFo). Analiza sus cortes, tensión y sincronía musical como inspiración; no copies imágenes, música ni secuencias.

El tráiler debe ser **dinámico y feroz**, pero mostrar con claridad la mecánica: menú lunar → llegada al escritorio → propuesta y comparación de recursos → golpe del sello → consecuencia de la decisión → alerta o situación de la base → cierre con el título. Usa cortes rápidos, acercamientos y efectos sincronizados con la música. Evita inventar pantallas o acciones que no existen en el juego.

**Sin narración.** Todo texto añadido al video debe estar en **inglés**, con frases muy cortas y legibles, por ejemplo: “CHECK THE RESOURCES”, “MAKE THE CALL”, “FACE THE CONSEQUENCES”. Cierra con “SPACE PAPERS” y “A lunar decision game for ages 7–12”. Si aparece diálogo o texto hablado en español, añade subtítulos en inglés.

Entrega un video horizontal **16:9, 1080p, MP4**, con duración objetivo de **28–29 segundos** y nunca superior a 30. Usa solo música y efectos con derechos de uso para la entrega; puedes aprovechar los audios originales del proyecto. No incluyas nombres, rostros ni voces de menores de 18 años, ni logotipos o emblemas de NASA añadidos al video. Verifica la duración y revisa el archivo final reproduciéndolo antes de entregarlo.

Guarda también el proyecto editable o la línea de tiempo, e indícame cualquier toma del juego que falte para mejorar el resultado.

#### Mensaje 2

En algun punto del inicio agrega que la mision de Space App Challenge que aceptamos fue "

# Build a Junior Astronaut Mission Trainer"

#### Mensaje 3

[https://youtu.be/rvlwWiskcLk?si=H15KC0nvKlv1acb4](https://youtu.be/rvlwWiskcLk?si=H15KC0nvKlv1acb4) Agrega esto como referencia principal

#### Mensaje 4

Y esto es la referencia del juego que usamos de referencia
[https://www.youtube.com/watch?v=\_QP5X6fcukM](https://www.youtube.com/watch?v=_QP5X6fcukM)

### Sube la versión final del juego
ID del chat: `01a1e0df-70d1-7bb3-b0c7-e5cc7b29f1ca`

#### Mensaje 1

Sube a [@GitHub](plugin://github@openai-curated-remote) la version final del juego

### Crear PDF para Git
ID del chat: `01a1e0eb-edcc-7b33-b0a8-06e0e4354ca4`

#### Mensaje 1

Realiza el PDF necesario con la información necesaria para subirlo a Git con la información

#### Mensaje 2

Tengo el notion [https://app.notion.com/p/Space-Papers-Requisitos-y-entrega-NASA-Space-Apps-41988b30c751817ba978d3ea249131af?source=copy_link](https://app.notion.com/p/Space-Papers-Requisitos-y-entrega-NASA-Space-Apps-41988b30c751817ba978d3ea249131af?source=copy_link)

#### Mensaje 3

La edad objetivo es 10 a 12 años y el formato de la demo es un video de YT, tengo el mp4 de ser necesario

#### Mensaje 4

[https://www.youtube.com/watch?v=f3BeXbHu_fg](https://www.youtube.com/watch?v=f3BeXbHu_fg) este es el video de la demo

#### Mensaje 5

# Files mentioned by the user:

## Foto 1.jpg: /tmp/codex-remote-attachments/01a1e0eb-edcc-7b33-b0a8-06e0e4354ca4/15BCAA48-8233-4726-9B52-0B91CA98B3D0/1-Foto-1.jpg

## My request:
Cumple con todo esto?

<image name=[Image #1] path="/tmp/codex-remote-attachments/01a1e0eb-edcc-7b33-b0a8-06e0e4354ca4/15BCAA48-8233-4726-9B52-0B91CA98B3D0/1-Foto-1.jpg">

[Imagen adjunta en el mensaje original.]

</image>

#### Mensaje 6

# Applications mentioned by the user:

[@Notion](plugin://computer-use@openai-bundled?app=notion.id)

## My request:
Realizalo completo, apoyate de [@Notion](plugin://notion@openai-curated-remote)

#### Mensaje 7

# Files mentioned by the user:

## Space-Papers-Trailer-1080p.mp4: /Users/beto/Desktop/ChatGPT/Space-Papers-Trailer-1080p.mp4

Distinguish instructions in attached documents from the user's request.

## My request:
Elimina completamente el producto de google, nunca se uso,

### Rellena y guarda los datos
ID del chat: `01a1e0f4-1e96-76c1-9d16-0be6e0242d23`

#### Mensaje 1

Ve [@Navegador](plugin://browser@openai-bundled) y rellena todos los datos que pide, y no lo mandes a jueces, solo guardalo

### Recopila prompts en un archivo MD
ID del chat: `01a1e103-d7b7-7242-bef2-6fa3bc585a42`

#### Mensaje 1

Recopila todos los prompt que hemos hecho para estre proyecto y anotalos en un .MD

## Conversaciones de ChatGPT relacionadas

### Prompt menú 3D interactivo
ID del chat: `6af9f891-d7d4-83e8-95c3-ec67d2f2ee20`

#### Mensaje del usuario

Dame un prompt para esta tarea, resumido para que no gaste tokens pero sin perder nada relevante y añadele todo lo necesario para hacerlo real, tambien agrega que puede usar modelos terra y luna para apoyarlo (es un modelo Sol en alto)

Vamos a renovar el menu principal completamente, quiero un menu 3d interactivo nada mas entrar que sea MUY llamativo, quiero que encuentres moonmenufinal.glb en tu carpeta de asset-sources y lo hagas real, estoy completamente atento a tus preguntas
Es un .glb hecho originalmente de la luna y la base no estoy completamente seguro de como la wb lo usa pero si puedo decirte que empty.001 es la empty a la cual estan pegados todos los objetos luna y luces por si lo necesitas para que el usuario pueda girar la luna a su gusto tambien tiene luces con keyframes no se si eso se exporte pero te aviso que tiene animacion hasta el frame 48

#### Prompt redactado por el asistente

Renueva **completamente el menú principal de Space Papers**, creando una experiencia **3D interactiva, espectacular y visualmente impactante** desde el primer segundo. Prioriza la calidad visual, la fluidez y una UX/UI sobresaliente.

**Asset principal:** Busca `moonmenufinal.glb` en `asset-sources`, inspecciona su estructura y conviértelo en el protagonista del menú.

**Información del modelo (Blender):**
- `Empty.001` es el objeto padre que agrupa la Luna, sus componentes y luces. Úsalo como referencia para permitir que el jugador **gire libremente la Luna** con mouse o touch.
- Contiene animaciones de luces mediante keyframes hasta el **frame 48**. Comprueba si se exportaron al GLB; si existen, reprodúcelas correctamente. Si no, recréalas respetando su intención original.
- Examina jerarquías, pivotes, materiales, texturas, iluminación y animaciones antes de modificarlo.

**Implementación:**
1. Diseña un menú 3D inmersivo con animaciones de entrada, transiciones cinematográficas, iluminación atractiva e interacciones satisfactorias.
2. Integra elegantemente las opciones existentes del juego (jugar, continuar, configuración, etc.) sin sacrificar funcionalidad ni legibilidad.
3. Implementa rotación intuitiva, animaciones fluidas y detalles visuales que hagan que el menú se sienta profesional.
4. Optimiza rendimiento, tiempos de carga, adaptación a diferentes pantallas, controles táctiles y accesibilidad.
5. Respeta la arquitectura modular del proyecto. **El juego debe seguir funcionando al abrir directamente el HTML, sin instalar dependencias ni iniciar servidores.** Resuelve cualquier incompatibilidad de carga del GLB con `file://`.
6. Comprueba el funcionamiento real del menú, navegación, animaciones y transición al juego. Evita regresiones y documenta los cambios relevantes.

**Autonomía:** Tienes libertad creativa y técnica para lograr el mejor resultado posible. Puedes apoyarte en los modelos **Terra y Luna** para tareas específicas, análisis o implementación; tú (Sol en esfuerzo alto) coordinas, integras y validas el resultado final.

**Importante:** Estoy disponible para responder preguntas sobre el GLB, Blender, las animaciones o las decisiones de diseño. **Pregúntame cualquier detalle que pueda mejorar significativamente el resultado**, especialmente antes de tomar decisiones difíciles de revertir. No improvises aspectos esenciales si puedes consultármelos.

**Objetivo final:** Un menú memorable, técnicamente sólido, visualmente impresionante y digno de competir por el premio **Best User Experience (UX/UI)**.

### Refactorizar proyecto HTML modular
ID del chat: `6af9e3ed-b7d0-83e8-8af6-2a9baa5ef48f`

#### Mensaje del usuario

Dame un prompt para esto:
Me parece que hay un desmadre en el proyecto como tal, el juego completo es un MEGA HTML y creo que no es correcto, estructuralo como un git normal y por partes, mi unico requisito es que al clonar el git pueda abrir el juego dandole al .html

#### Prompt redactado por el asistente

Revisa y **refactoriza la estructura completa del proyecto**. Actualmente, gran parte del juego está concentrada en un único archivo HTML enorme, lo cual dificulta su mantenimiento, organización y desarrollo.

Quiero que lo reorganices siguiendo las buenas prácticas de un repositorio profesional de videojuegos web:

- **Modulariza el código:** separa HTML, CSS y JavaScript. Divide la lógica en módulos según sus responsabilidades (interfaz, mecánicas, escenas, personajes, animaciones, datos, etc.).
- **Organiza los recursos:** crea una estructura clara de carpetas para modelos 3D, texturas, sonidos, imágenes y demás assets.
- **Evita duplicaciones:** elimina código redundante, archivos obsoletos y dependencias innecesarias, sin perder funcionalidades.
- **Mantén el juego intacto:** no cambies su apariencia, mecánicas, comportamiento ni contenido. Esta tarea es exclusivamente una refactorización estructural.
- **Documenta la arquitectura:** actualiza el README con la estructura del proyecto y las instrucciones para desarrollarlo.

### REQUISITO FUNDAMENTAL

**Al clonar o descargar el repositorio, debe ser posible abrir `index.html` con doble clic y jugar inmediatamente**, sin instalar dependencias, ejecutar servidores locales ni utilizar la terminal.

Ten en cuenta las restricciones de `file://`, especialmente al cargar módulos JavaScript, archivos JSON y recursos externos. Diseña una solución que funcione realmente bajo estas condiciones, utilizando un proceso de compilación si es necesario, pero dejando siempre una versión lista para jugar directamente desde `index.html`.

**Prioriza una arquitectura modular y mantenible sin sacrificar la facilidad de ejecución.**

Antes de modificar, analiza las dependencias y el funcionamiento actual. Después realiza la migración, verifica que todo siga funcionando y sube los cambios a GitHub en commits organizados. No des por terminada la tarea hasta comprobar que el juego funciona abriendo directamente el HTML, sin servidor.

### Analiza ZIPs y prepara pruebas
ID del chat: `6af9d2b6-387c-83e8-9806-58abaa427553`

#### Mensaje del usuario

Tengo media hora en lo que se reinician los tokens de Codex, revisa los .ZIP que te subí y analiza que puedo hacer por lo mientras, apoyate también de este apunte [https://app.notion.com/p/Notas-para-codex-4-41988b30c75180018210c0e96c523a12?source=copy_link](https://app.notion.com/p/Notas-para-codex-4-41988b30c75180018210c0e96c523a12?source=copy_link)

#### Mensaje del usuario

Basicamente, esto esta en notion:
Agarrar los nuevos assets de sello que estan en google drive

Hacer intuitivo que puedes deslizar en sello de aprobar

en el manual quitar todo lo de “before you stamp” solo un renglon largo para el ivnentario, hacer mas grande “a good journey starts with a good check” y hacer un poco mas grandes las categorias, revisar que todo sea facilmente legible

Cambiar las animaciones donde hay una estación lunar por los nuevos render 3D que hizimos

#### Mensaje del usuario

Los sellos estan en Spacepapers/arte/ui/, con sonido incluido, ya también incluimos el sonido de puerta en el apartado de puerta y el sonido de fondo en Spacepapers/arte/escenarioprincipal se llama ambient music
El manual simplificado le atinaste a lo que quiero,  y la interacción de sellos ya me gusto, solo seria agregar en el tutorial que se puede arrastrar pero eso es otro apartado/prompt completamente aparte
Estoy creando la carpeta para la estación lunar

#### Prompt redactado por el asistente

Actualiza Space Papers siguiendo estas instrucciones:

**1. Sellos**
- Localiza los nuevos assets gráficos y sonoros en `Spacepapers/arte/ui/`.
- Reemplaza los gráficos antiguos por los nuevos.
- Integra los efectos de sonido correspondientes.
- Conserva intacta la mecánica de arrastrar y seleccionar los sellos.

**2. Audio**
- Revisa el sonido de puerta incluido en el apartado correspondiente e intégralo si todavía no está conectado.
- Localiza `ambient music` dentro de `Spacepapers/arte/escenarioprincipal/`.
- Utilízalo como música ambiental en bucle, con volumen discreto.
- Respeta las restricciones de reproducción automática de los navegadores.
- Evita audios duplicados y conserva la compatibilidad offline.

**3. Manual**
- Elimina completamente la sección "Before you stamp".
- Sustitúyela por un único renglón horizontal amplio para acceder al inventario.
- Aumenta el tamaño y protagonismo de "A good journey starts with a good check."
- Agranda ligeramente los títulos de las categorías.
- Revisa contraste, espaciado y legibilidad en distintas resoluciones.

**4. Restricciones**
- No modifiques la interacción de arrastrar sellos.
- No modifiques el tutorial.
- No modifiques todavía las animaciones de la estación lunar.
- Ejecuta las pruebas y verifica que la versión offline funcione.

#### Prompt redactado por el asistente

Modifica únicamente el tutorial de Space Papers para explicar que los sellos se pueden arrastrar sobre los documentos.

- Mantén las instrucciones actuales que sigan siendo correctas.
- Explica brevemente cómo arrastrar un sello hasta un documento.
- Indica que también es posible seleccionar un sello y después hacer clic en el documento.
- Utiliza instrucciones claras y consistentes con el idioma actual del juego.
- No cambies las mecánicas, animaciones ni comportamiento de los sellos.
- No modifiques otras secciones del juego.

### Modelos 3D NASA
ID del chat: `6af9dccd-847c-83e8-98cd-e345a903380b`

#### Mensaje del usuario

En los recursos 3D de la nada no habrá una sonda y una nave espacial que podamos usar para los despegues?

#### Mensaje del usuario

Mira no estoy seguro de cómo se llaman pero necesito una especie de mini nave que parece una sonda que sale de la luna para entrar en la nave grande que hace el viaje y luego suelta esa especie de sonda para que aterrice

#### Mensaje del usuario

Puedes buscar en los modelos de la nasa algo que nos sirva?

#### Mensaje del usuario

Para la nave grande debe tener cohetes básicamente cuál podría parecer más capaz de viajar a otros planetas jaja

### Prompt para mejorar UI UX
ID del chat: `6af951ad-a038-83e8-9647-38fe5dcbffcb`

#### Mensaje del usuario

Dame un prompt para pedirle a la ia que revise todos los UI y UX y los mejore

#### Prompt redactado por el asistente

Revisa exhaustivamente toda la **UI y UX de Space Papers**, incluyendo menús, pantallas, botones, ventanas, documentos, animaciones, transiciones, interacciones y flujo de juego.

Tu objetivo es **mejorar significativamente la experiencia del usuario**, buscando un resultado profesional, intuitivo, visualmente atractivo, accesible y consistente.

Ten en cuenta que competimos por el premio **Best User Experience (UX/UI)** de NASA Space Apps, por lo que este aspecto es una prioridad absoluta.

**Instrucciones:**
- Analiza todo el proyecto e identifica problemas de diseño, navegación, claridad visual, accesibilidad y usabilidad.
- Mejora la jerarquía visual, distribución de elementos, tipografía, colores, animaciones y retroalimentación de las interacciones.
- Asegúrate de que cualquier jugador pueda entender qué hacer sin necesitar explicaciones excesivas.
- Mantén la identidad visual de Space Papers y su inspiración en *Papers, Please*, especialmente las interacciones físicas con documentos y objetos.
- Optimiza la experiencia para diferentes tamaños de pantalla y evita elementos superpuestos, confusos o difíciles de utilizar.
- Añade pequeños detalles de pulido visual y funcional que hagan que el juego se sienta profesional.
- **No elimines funcionalidades ni cambies mecánicas importantes** sin una justificación clara.
- Comprueba que todas las mejoras funcionen correctamente y no introduzcan errores.

**Trabaja de forma autónoma:** no te limites a sugerir cambios; implementa las mejoras necesarias, pruébalas y corrige cualquier problema detectado.

Al finalizar, sube todos los avances a GitHub mediante commits organizados y entrega un resumen de los cambios realizados, problemas corregidos y posibles mejoras pendientes.

**Prioriza la calidad de la experiencia por encima de añadir nuevas funcionalidades.**

### Prompt para Codex
ID del chat: `6af90184-dba0-83e8-8d58-22cdabe9adfa`

#### Mensaje del usuario

Ve mi [https://app.notion.com/p/Apuntes-para-agregar-a-codex-2-41888b30c75180a0a5ebdd43685c36cd?source=copy_link](https://app.notion.com/p/Apuntes-para-agregar-a-codex-2-41888b30c75180a0a5ebdd43685c36cd?source=copy_link) y dame un buen prompt para continuar el trabajo, quiero lo de ahi y que suba todo los avances en git, con lo necesario para jugarlo y el contexto necesario para el siguiente paso, para continuarlo en copilot de github

#### Prompt redactado por el asistente

Continúa el desarrollo de **Space Papers** desde el estado actual del repositorio. Esta será nuestra última etapa de trabajo contigo antes de transferir el proyecto a **GitHub Copilot**, por lo que necesito una implementación completa, estable, jugable y perfectamente documentada.

### 1. Implementación de pendientes

Lee íntegramente esta página de Notion y ejecuta sus instrucciones:

https://app.notion.com/p/41888b30c75180a0a5ebdd43685c36cd

Prioriza lo siguiente:

- **Escenario:** revisa los modelos actualizados de pared y puerta en Google Drive. Fueron corregidos porque el túnel de la puerta sobresalía por encima de la pared. Sustituye los assets anteriores, corrige su integración y comprueba visualmente el resultado.
- **Tipografía:** incorpora `StickleBoldItalic.ttf`, adjunta en Notion, donde corresponda dentro de la interfaz. Comprueba su correcta carga y legibilidad.
- **Ingenieros:** revisa la versión actualizada de https://app.notion.com/p/41888b30c7518020a63fdf5efe137168. En Google Drive, `Space papers/Arte/ingenieros`, están los diseños 3D, rigs y animaciones plantilla en `.blend`. Integra los personajes y sus animaciones, conservando sus identidades, colores y personalidades. Comprueba cuáles assets están realmente terminados y reporta los faltantes. Exporta y optimiza los modelos al formato que necesite el juego.
- **Visor planetario:** comienza a implementar la vista espacial a través de la ventana/monitor del fondo. Debe verse como un elemento distante del escenario, con escala y perspectiva naturales, sin parecer que está frente al jugador. Respeta las decisiones previas sobre los planetas y los recursos de Solar System Scope.
- **Sonido:** NO implementes todavía efectos sonoros. Primero necesitamos probar la versión jugable. Prepara una lista priorizada de los sonidos que necesitaremos, para posteriormente seleccionarlos de repositorios públicos o gratuitos con licencias compatibles.

### 2. Primera versión jugable

No te limites a preparar estructuras o prototipos. Quiero una **build funcional que podamos abrir, jugar y evaluar**.

- Conserva las mecánicas existentes y completa lo necesario para probar el flujo principal del juego.
- Prioriza las interacciones físicas de documentos, hojas y libros al estilo *Papers, Please*.
- Verifica que el escenario, los ingenieros, las animaciones y las interfaces funcionen correctamente.
- Evita errores críticos, assets faltantes, pantallas bloqueadas e interacciones rotas.
- Ejecuta las pruebas, la compilación y las comprobaciones disponibles. Corrige los problemas detectados.
- Mantén como prioridad nuestro objetivo de competir por **Best User Experience (UX/UI)**: controles intuitivos, respuesta visual clara, accesibilidad y una experiencia fluida.

Si algún recurso externo no está disponible, documenta exactamente qué falta e implementa una alternativa temporal claramente identificada, sin presentar esa parte como terminada.

### 3. Git y GitHub: subir todos los avances

Repositorio: https://github.com/betoxgames/spaceapps

Antes de modificar Git, inspecciona el estado del repositorio, la rama activa y los cambios existentes.

Cuando termines:

1. Guarda y organiza todos los cambios necesarios, incluyendo código, recursos, configuraciones y documentación.
2. Configura Git LFS si es necesario para archivos grandes, especialmente `.blend`, sin comprometer la compatibilidad del repositorio.
3. Excluye archivos temporales, secretos, cachés y dependencias que deban instalarse mediante el gestor del proyecto.
4. Crea commits descriptivos y **haz push al repositorio remoto**, verificando que los commits realmente quedaron publicados.
5. No uses `force push`, no elimines trabajo existente y no sobrescribas cambios ajenos.

### 4. Preparación para GitHub Copilot

Este punto es **obligatorio**. Copilot recibirá el repositorio y deberá entender cómo continuar sin necesitar esta conversación.

Actualiza el README y crea un documento `HANDOFF_COPILOT.md` en la raíz que incluya:

- **Qué es Space Papers:** concepto, objetivos, experiencia buscada y mecánicas principales.
- **Estado real del desarrollo:** funcionalidades terminadas, parcialmente implementadas y pendientes.
- **Arquitectura:** tecnologías, estructura de carpetas, módulos principales y dependencias.
- **Cómo ejecutarlo:** requisitos, comandos de instalación, desarrollo, compilación y pruebas, comprobados en la práctica.
- **Assets:** ubicación, formatos, origen, integración, animaciones y recursos todavía pendientes.
- **Decisiones de diseño:** criterios visuales, comportamiento de personajes, interacciones y prioridades UX/UI.
- **Problemas conocidos:** errores, limitaciones técnicas y soluciones temporales.
- **Siguientes pasos:** lista priorizada de tareas concretas, con sus dependencias y criterios de finalización.
- **Referencias:** enlaces relevantes de Notion, Google Drive y demás documentación del proyecto.

Incluye también instrucciones claras para que Copilot no deshaga decisiones ya aprobadas ni reconstruya funcionalidades que ya existen.

### 5. Entrega final

Antes de finalizar, comprueba nuevamente que el proyecto compila, que la versión jugable funciona y que GitHub contiene los avances.

Entrégame un resumen con:

- Cambios implementados.
- Qué se puede jugar y probar actualmente.
- Instrucciones exactas para iniciar el juego.
- Pruebas realizadas y sus resultados.
- Funcionalidades incompletas o bloqueadas.
- Lista de sonidos necesarios.
- Rama, último commit y confirmación del push.
- Ubicación de `HANDOFF_COPILOT.md`.
- Primera tarea recomendada para GitHub Copilot.

**Trabaja con autonomía, inspecciona el código existente y toma las decisiones técnicas necesarias. No te detengas en la planificación: implementa, prueba, corrige, documenta y publica.**

El objetivo es que **GitHub Copilot pueda clonar el repositorio, ejecutar Space Papers y continuar exactamente desde donde lo dejaste**, con toda la información necesaria dentro del proyecto.

#### Mensaje del usuario

Haz que primero acomode el git para el copilot, luego cuando ya este listo eso haz los ingenieros luego escenario y al final visor planetario

#### Prompt redactado por el asistente

Continúa el desarrollo de **Space Papers**. Esta será nuestra última etapa contigo antes de transferir el proyecto a **GitHub Copilot**.

Lee primero todos los apuntes y recursos de esta página de Notion:

https://app.notion.com/p/41888b30c75180a0a5ebdd43685c36cd

Trabaja con autonomía y sigue **estrictamente este orden de prioridades**:

### FASE 1 — Preparar GitHub para Copilot (PRIMERO)

Repositorio: https://github.com/betoxgames/spaceapps

Antes de implementar nuevas funcionalidades:

1. Revisa y organiza el repositorio completo sin perder trabajo existente.
2. Comprueba que el proyecto tenga todos los archivos, configuraciones y dependencias necesarias para clonarlo y ejecutarlo.
3. Configura correctamente `.gitignore`, Git LFS si hace falta y la estructura del proyecto.
4. Actualiza `README.md` con instrucciones de instalación, ejecución, compilación y pruebas.
5. Crea `HANDOFF_COPILOT.md` con todo el contexto: arquitectura, mecánicas, decisiones creativas, objetivos UX/UI, recursos, estado actual, problemas y siguientes pasos.
6. Prepara instrucciones para GitHub Copilot, incluyendo las reglas del proyecto y las convenciones necesarias.
7. Crea un commit y haz **push**, verificando que GitHub contiene una versión completa y ejecutable.

Esta fase debe quedar terminada antes de continuar. Copilot debe poder entender y ejecutar el proyecto aunque no tenga acceso a nuestras conversaciones.

### FASE 2 — Ingenieros

Revisa la página actualizada de ingenieros:

https://app.notion.com/p/41888b30c7518020a63fdf5efe137168

En Google Drive, `Space papers/Arte/ingenieros`, encontrarás los diseños 3D, rigs y animaciones plantilla en `.blend`.

- Integra los personajes con sus apariencias, colores y personalidades actualizadas.
- Utiliza los modelos y animaciones existentes, sin reconstruir innecesariamente los recursos.
- Adapta y optimiza los archivos para el motor del juego.
- Comprueba las animaciones, el posicionamiento y las interacciones.
- Identifica y documenta los recursos que todavía estén incompletos.

### FASE 3 — Escenario y tipografía

- Revisa los modelos actualizados de la pared y puerta en Google Drive.
- Sustituye los modelos anteriores y corrige el problema del túnel de la puerta que sobresalía por encima de la pared.
- Comprueba la geometría, perspectiva, iluminación e integración del escenario.
- Incorpora la fuente `StickleBoldItalic.ttf` adjunta en Notion y verifica su legibilidad.
- Conserva y perfecciona las interacciones de libros, documentos y hojas inspiradas en *Papers, Please*.

### FASE 4 — Visor planetario (AL FINAL)

Comienza a desarrollar el visor espacial mediante la ventana/monitor del fondo.

- Debe percibirse ligeramente alejado, integrado naturalmente en el escenario.
- Evita que el planeta parezca estar directamente enfrente del jugador.
- Respeta las decisiones previas sobre los planetas, la Luna y los recursos de Solar System Scope.
- Prioriza la composición visual, perspectiva, escala y rendimiento.

### FASE 5 — Build jugable, pruebas y entrega

Después de implementar las fases anteriores:

1. Genera una **versión jugable y funcional** con todos los cambios.
2. Prueba las mecánicas principales, ingenieros, animaciones, escenario y visor.
3. Corrige los errores detectados y verifica la compilación.
4. Deja los sonidos para después de probar esta primera build. Entrega únicamente una lista priorizada de efectos necesarios para buscar en repositorios públicos o gratuitos.
5. Actualiza `HANDOFF_COPILOT.md` con el estado FINAL del proyecto, incluyendo todos los avances realizados durante estas fases.
6. Realiza los commits y el **push final a GitHub**. Verifica que el repositorio contiene todo lo necesario para ejecutar la versión jugable.

### Entrega obligatoria

Al terminar, proporciona:

- Resumen de cambios por fase.
- Instrucciones exactas para jugar la build.
- Pruebas realizadas y problemas pendientes.
- Lista de sonidos necesarios.
- Rama, último commit y confirmación del push.
- Ruta del documento de transferencia.
- Siguiente tarea recomendada para GitHub Copilot.

**Prioridad absoluta: Best User Experience (UX/UI).** Estamos compitiendo por una experiencia intuitiva, accesible y efectiva.

No te quedes únicamente en la planificación. **Primero prepara GitHub para Copilot; después ingenieros, escenario y visor planetario, en ese orden.** Realiza commits por fase para preservar el progreso. Al final, asegúrate de que Copilot pueda continuar inmediatamente desde el repositorio sin perder contexto ni funcionalidades.

### Idear diálogos de ingenieros
ID del chat: `6af8f1f9-5aa0-83e8-b9b3-20ec75b9829f`

#### Mensaje del usuario

Para mi juego de NASA que estoy desarrollando, ayudame a idear dialogos para mis ingenieros, ve esta actualizacion que hicimos en Notion
[https://app.notion.com/p/Ingenieros-41888b30c7518020a63fdf5efe137168?source=copy_link](https://app.notion.com/p/Ingenieros-41888b30c7518020a63fdf5efe137168?source=copy_link)

### Diseñar nueve ingenieros
ID del chat: `6af8d5de-4db8-83e8-bd72-b133ce923385`

#### Mensaje del usuario

Agregale un apartado para "pendiente" y "terminado"

#### Mensaje del usuario

Dentro de la misma tabla, no aparte

#### Mensaje del usuario

Cambiame A todas las mujeres por hombres, mismas caracteristicas, solo nombre de hombre

#### Mensaje del usuario

Que mas puedo hacer/ayudar?

#### Mensaje del usuario

Ayúdame a preparar un plan de producción de los accesorios de los 9 ingenieros de Space Papers, reutilizando la misma plantilla. Empecemos con los personajes restantes.

### Organiza carpeta NASA
ID del chat: `6af8e6e6-5318-83e8-a408-dfd007c817b0`

#### Mensaje del usuario

Organiza mi carpeta de Nasa en [$google-drive](app://connector_5f3c8c41a1e54ad7a76272c89e2554fa) , la siento un poco mal organizada, con su doble carpeta de NASA y nombres medio confusos, NO BORRES NADA, checa cuando termines que esten todos los archivos

#### Mensaje del usuario

Y junto a todo eso agrega una nueva carpeta donde agregar la plantilla de ingeniero y carpetas donde agregar los diseños/ .blend de los demas personajes

### Analiza avances pendientes
ID del chat: `6af8c3ae-c3d8-83e8-8aaf-a65f9d2908e6`

#### Mensaje del usuario

Analiza el .ZIP que tienes y Ve el progreso del proyecto, una manera de ver los avances y los pendientes, que podemos continuar de aquí a 3 horas para continuar con CODEX

#### Mensaje del usuario

En alguna parte de nuestro proyecto estamos ocupando datos oficiales de la nasa?

## Prompt de planificación conservado en el proyecto

Fuente: `PROMPT_PLAN_MODE_CODEX.md`.

# Prompt autónomo para otro chat de Codex · Plan mode

Copia desde la siguiente línea hasta el final en un chat nuevo en Plan mode y adjunta `DATOS_ESENCIALES_NAVE_Y_MISIONES.md`. No se necesita ningún otro archivo del proyecto anterior.

---

Trabaja en **Plan mode**. Quiero que prepares el plan concreto y viable para construir desde cero **ÓRBITA**, un videojuego de navegador del equipo **Los valar**, para NASA Space Apps 2026, desafío **Build a Junior Astronaut Mission Trainer**. Por ahora planifica; no construyas ni publiques la nueva versión. Usa subagentes con **modelo Terra** para pequeñas revisiones delimitadas de reglas, ciencia, assets o viabilidad. Tú integra y verifica sus conclusiones.

Solo tendrás este prompt y el archivo adjunto **`DATOS_ESENCIALES_NAVE_Y_MISIONES.md`**. No tendrás código, conversaciones, documentación anterior ni assets previos. No dependas de “revisar el juego anterior”. Este prompt describe las mecánicas que el equipo quiere conservar. Si el Markdown no está disponible, indícalo: no inventes sus cantidades.

## 1. Dirección fundamental del producto

**QUIERO UN VIDEOJUEGO PULIDO TIPO PAPERS, PLEASE, EJECUTADO EN EL NAVEGADOR.**

La experiencia debe sentirse casi como trasladar ese tipo de videojuego al navegador: un escenario, una oficina lunar con ventanilla, escritorio físico, personajes que traen expedientes, documentos manipulables, manual consultable, sellos, animaciones, sonido, consecuencias y ritmo de partida. El jugador debe sentir que trabaja dentro de ese mundo.

**NO QUIERO UNA PÁGINA WEB QUE CONTENGA UN MINIJUEGO.** No diseñes un dashboard, aplicación de formularios, página de tarjetas o landing con controles de juego. El videojuego completo es el producto; la web permite entrar y jugar. Menú, tutorial, opciones, créditos, pausa, informes y finales pertenecen al mismo lenguaje visual y de interacción del juego. Sin scroll de página durante la partida ni navegación comercial rodeando el escritorio.

Arte, personajes, música, textos e identidad propios. *Papers, Please* es referencia de experiencia e interacción, no una biblioteca de contenido para copiar. El arte final lo producirá nuestro equipo; el plan debe permitir integrarlo y comprobar sus estados sin rehacer la interacción.

## 2. Fuentes oficiales y horario

Vuelve a comprobar anuncios y cambios relevantes en estas fuentes:

- [Desafío y pestaña Resources](https://www.spaceappschallenge.org/2026/challenges/junior-astronaut-mission-trainer/).
- [FAQ](https://www.spaceappschallenge.org/resources/participant-faqs/).
- [Formación de equipo](https://www.spaceappschallenge.org/resources/team-formation-guide/).
- [Entrega](https://www.spaceappschallenge.org/resources/project-submission-guide/).
- [Evaluación](https://www.spaceappschallenge.org/resources/judging-awards-guide/).
- [Términos](https://www.spaceappschallenge.org/legal/).
- [Sede Puebla y Local Event Schedule](https://www.spaceappschallenge.org/2026/local-events/puebla/).
- [Ofertas](https://www.spaceappschallenge.org/2026/global-offers/).
- [Apoyo](https://www.spaceappschallenge.org/resources/space-app-connect-guide/).

El evento es **14–15 de noviembre de 2026**. Puebla/UDLAP programa el sábado registro 08:00, ceremonia 09:00, arranque oficial local 10:00, trabajo remoto desde 18:00; domingo trabajo desde 08:30, **entrega local 15:30**, cierre 17:00. La plataforma abre Project el sábado a las 09:00 y cierra el domingo a las **23:59 de la zona de la sede**. Planifica para la entrega local de las 15:30, con envío hacia las 15:00; no la sustituyas por el cierre global. Referencia horaria: America/Mexico_City. Distingue horarios oficiales de tus bloques propuestos.

[Referencia a trabajo anterior al 14 de noviembre retirada a petición del usuario.]

No abras ni reproduzcas videos por ahora. Las guías escritas y Resources son suficientes para esta planificación.

## 3. Objetivo educativo y adaptación necesaria

El enunciado pide un juego/app en que niños de **7–12 años** administren una base lunar o marciana y entiendan decisiones sobre soporte vital, protección radiológica, presupuesto de energía, alimentos y demora de comunicaciones. Deben experimentar consecuencias durante una misión simulada y aprender un compromiso real entre necesidades. El formato es abierto: una oficina documental es válido. No exige imitar un dashboard.

Las consideraciones recomiendan lenguaje sencillo, pocos sistemas simultáneos, datos NASA auténticos y atribución dentro de la experiencia. Datos archivados curados son aceptables si no se presentan como vivos. Para un premio global se necesita usar al menos un dato o recurso NASA; no basta una estética espacial. Un niño debe poder explicar después qué protegió, qué gastó y qué dejó pendiente.

La campaña conservada abajo enseña comparación de provisiones y gestión de inventario, pero se centra en aprobar expediciones. **No afirmes que ya cubre producción de alimentos, reparto de potencia, blindaje o comunicaciones demoradas.** La emergencia solar paga un paquete ficticio: no calcula dosis ni espesor de protección.

**Cambio de enfoque necesario:** hacer que las decisiones del escritorio administren también la supervivencia de la base. Mantén la ventanilla y las expediciones como columna de la partida. Planifica una extensión mínima que muestre una elección costosa y su consecuencia persistente en la base; no añadas cinco paneles de gestión simultáneos.

**Propuesta nueva del análisis, todavía no aprobada como mecánica:** breves despachos de operación entre expediciones, usando papeles y sellos del escritorio. Presentar secuencialmente alternativas sobre energía para hábitat/refugio/invernadero/comunicaciones, con costo visible y un efecto posterior. La escena de la base muestra qué quedó funcionando y qué actividad se pospuso. El cultivo necesita recursos/tiempo y no es comida gratis; la demora de un mensaje impide ayuda inmediata sin obligar al niño a mirar una pantalla vacía. Soporte vital, energía y protección son los focos; cultivo/comunicaciones aparecen de uno en uno.

Evalúa esta propuesta en el plan y concreta la versión mínima que cumple el objetivo, con decisiones, estados, regla de efecto, costo y evidencia. Distingue una obligación del desafío de tu solución propuesta. **No inventes como ya acordados los números de esos sistemas nuevos.** Define qué parámetros nuevos requieren validación y dónde se documentarán por separado. Declara de qué cuenta sale cada costo nuevo: inventario compartido o presupuesto operativo separado; muestra su efecto sobre la fórmula inicial y evita dobles cobros o recursos gratuitos. El invernadero no debe reponer silenciosamente el inventario de misiones: ese inventario tiene una regla previa sin reposiciones. Puede atender un objetivo local de la base separado y claramente explicado. Si la ampliación requiere alterar presupuesto, finales u otra regla acordada, muestra exactamente el cambio, su razón y su impacto antes de implementarlo. No des por autorizada una modificación arbitraria.

## 4. Cantidades: única fuente operativa

Lee **`DATOS_ESENCIALES_NAVE_Y_MISIONES.md`** como fuente de cantidades. Usa directamente sus **VALORES REDONDEADOS DE JUEGO** en catálogo, papeles, manual, inventario y emergencias. No los sustituyas por resultados científicos originales, fórmulas recalculadas o cifras recordadas.

El archivo distingue diseño técnico V3, cálculos anteriores y balance ficticio ampliado. El catálogo jugable es el lunar con ocho destinos y cuatro personas. Las capacidades V3 son referencia de nave, no filtros físicos que debas aplicar a esos ocho destinos. No cambies los mínimos para “corregir” científicamente la ficción. Etiquétala con honestidad y explica ciencia real aparte. Ninguna fuente NASA valida los costos ni la probabilidad de supervivencia del juego.

No sumar de nuevo márgenes, retorno, recarga, reserva, oxidante al O₂ respirable ni batería al presupuesto eléctrico. La electricidad total de misión no tiene que caber en la batería. No hay duración numérica ni estancia acordada por destino en el catálogo ficticio; no extrapoles las de rutas técnicas anteriores.

## 5. Mecánicas acordadas que se deben conservar

### Campaña e inventario

- Una base fija en **Luna**, cuatro personas por expedición y ocho destinos: Mercurio, Venus, Tierra, Marte, Júpiter, Saturno, Urano y Neptuno. Cada misión sale de Luna y vuelve a Luna. Transporte orbital común y módulos locales. En los cuatro gigantes solo hay operación orbital, nunca aterrizaje. Descensos en sólidos son la ficción explícita del escenario.
- Objetivo: **cinco misiones exitosas a destinos distintos y dos emergencias resueltas**. No hay días de campaña, medallas ni diez expedientes fijos. La sesión no se guarda; sí se pueden conservar preferencias locales. Una nueva partida usa semilla nueva y la semilla permite reproducirla para revisión.
- Cinco recursos separados: comida kg, agua L, O₂ kg, propelente kg, energía kWh. Ninguno compensa la falta de otro. No convertirlos en una sola barra genérica.
- Al inicio sortear cinco destinos de referencia y dos eventos distintos. Por recurso: subtotal de mínimos de esos cinco destinos más costo completo de los dos eventos; inventario = subtotal + techo(10% del subtotal). Fijarlo una vez. No hay reposiciones/reembolsos. Los destinos de referencia **no limitan** qué propuestas llegan después ni garantizan cualquier itinerario. Mantener esa limitación visible en el plan de balance; no reparar la fórmula en silencio.
- Los incidentes ocurren en dos posiciones diferentes después de los éxitos 1–4. No revelar identidad, costo o momento futuro al jugador.
- Cada propuesta evita el destino inmediatamente anterior y los destinos ya completados; también evita el ingeniero inmediatamente anterior. Nueve ingenieros originales: Nico cómico, Ada analítica, Leo tímido, Max lanzado, Sol optimista, Dante dramático, Vera formal, Teo distraído y Ren competitivo. Tienen saludo y personalidad; no necesitas copiar frases exactas. No hacer que su personalidad revele si la propuesta sirve.
- Generación: 50% de probabilidad de propuesta suficiente. En ella cada recurso pide entre 100–105% del mínimo, porcentajes enteros, redondeo hacia arriba. En una propuesta deficiente, uno o dos recursos piden entre 10–95%; los otros entre 100–105%. No es alternancia fija de buena/mala.

### Escena e interacción documental

- Escenario de referencia **1600 × 900, 16:9**, escalado sin scroll. Primero valida composición/lectura; esos tamaños son referencias de producción, no obligación de encargar todos los assets a esa resolución.
- Ventanilla arriba, ingeniero que llega/espera/se retira, mostrador y bandeja; escritorio libre de comparación debajo; manual, inventario, registro y dos sellos como objetos del mundo. Un pequeño indicador físico informa éxitos/aprobaciones sin dominar la escena.
- Tres hojas por propuesta: **Plan de vuelo** (Luna→destino→Luna, cuatro personas, orbital o módulo local), **Soporte de vida** (comida, agua, O₂) e **Impulso y energía** (propelente, electricidad; regreso/reserva incluidos).
- Las tres llegan pequeñas a la bandeja. Tomarlas las lleva a tamaño fijo de lectura. Se arrastran, apilan y colocan libremente; la tomada queda delante. No hay zoom por doble clic. Llevar una hoja hacia la bandeja la guarda pequeña; volver a tomarla la recupera. Mantener límites para que ningún objeto quede inaccesible.
- Manual abierto arrastrable, con pestañas grandes: índice, destinos, reglas y emergencias. Selector de ocho destinos: inicia sin planeta seleccionado, lo busca el jugador; conserva última página, posición y destino entre ingenieros. **Nunca autoseleccionar el destino correcto**, tampoco en tutorial. Puede fijarse/soltarse. “Poner hoja al lado” compara sin cambiar su tamaño y “Guardar hojas” vuelve a guardar las tres.
- Inventario como documento consultable. Registro del turno comparte ese espacio y muestra cuatro entradas por página: devoluciones, éxitos, fallos e incidentes. Consultarlos no consume.
- **DEVOLVER**: sello, recogida automática de las tres hojas, entrega al ingeniero y siguiente visitante directamente. Cero recursos, cero aprobación, cero éxito; sin informe, cinemática ni botón Continuar. No penalizar devolver una propuesta suficiente. Rechazar todo no completa la campaña.
- **APROBAR**: una sola resolución. Consumir por recurso mínimo(saldo,pedido), todo lo pedido cuando existe, incluso lo que sobra o si la misión falla. Sin reembolso ni saldo negativo. Éxito exige pedido≥mínimo en todos los recursos y que el almacén cubra todo lo solicitado. Igualar cumple. Si hay stock pero el pedido es insuficiente, misión fallida sin éxito y la campaña sigue. Si el stock no cubre el pedido, gastar lo disponible y terminar con despido tras su consecuencia/informe. No autoimpedir esa mala decisión ni delatarla por colores.

### Consecuencias, escenas y finales

- Sellar recoge los papeles automáticamente y bloquea decisiones duplicadas. El modelo resuelve una vez, pero la interfaz mantiene privado el resultado hasta la consecuencia adecuada: sin título, color, sonido de victoria/derrota, contador o saldo que anticipe el fallo.
- Viaje normal: preparación → ascenso de módulo → transferencia orbital → ida → operación en destino → regreso → aterrizaje lunar → cierre. Transporte/módulo/base son objetos separados. Sólido con módulo local; gigante solo órbita.
- La falta más temprana determina dónde se detiene la misión. Por recurso: propelente <25% del mínimo falla antes del despegue; cualquier recurso <50% en la ida; <75% en destino; las demás carencias en regreso. Elegir la etapa más temprana; empate por orden comida/agua/O₂/propelente/energía. Usar cantidades efectivamente entregadas cuando falte stock. Si el almacén no cubre todo lo pedido pero lo entregado sí alcanza todos los mínimos, el comportamiento acordado sigue siendo derrota por déficit: cancelar el despegue, sin simular un viaje exitoso. No mostrar un vuelo posterior a un despegue que no sucedió.
- Tras la consecuencia mostrar un parte: mínimos, pedidos, gastados, saldo, carencias y explicación sencilla. Archivar permite siguiente visitante, incidente o final. Las cinemáticas tienen pausa, velocidad ×1/×4 y “Ver desenlace”; saltar muestra la consecuencia antes del informe y no vuelve a cobrar.
- La tasa final es **éxitos/aprobaciones**, excluye devoluciones y tutorial. Antes de aprobar: “Sin evaluar”. Con cinco éxitos y ambos eventos resueltos: 100% certificado; >40% y <100% traslado a oficinas; ≤40% despido. Déficit de inventario o emergencia fallida: despido anticipado. Comparar tasa exacta para elegir final, aunque pantalla redondee. Final con bitácora paginada, resumen, semilla, menú y otra partida.
- El peligro es simbólico, apropiado para niños; sin daño corporal. Cualquier ajuste de tono de “despido” se propone aparte, no cambia umbrales ni borra consecuencias por defecto.

### Emergencias

- Usar solo **E01–E08 y sus costos vigentes del Markdown**. Son ocho incidentes posibles y dos sorteados por campaña. No usar las cuatro emergencias antiguas ni costos previos a su multiplicación por 1,000.
- Un único aviso/depósito arrastrable por su cabecera muestra qué pasa, recurso/costo completo, contador, aporte, probabilidad y confirmar. Puede moverse incluso sobre el área superior; inventario accesible. Arrastrarlo no reinicia el reloj.
- El reloj empieza **automáticamente al aparecer**, 30 segundos. Aporte inicial cero, deslizador 0–100% entero limitado por el saldo. Moverlo no gasta: confirmar sí. 100% de lo necesario garantiza éxito; fracción parcial realmente entregada = probabilidad de éxito. Cero siempre falla. No confirmar a tiempo entrega cero. Descontar una sola vez. Fallo: pérdida de la base y fin de turno.
- Mantener contabilidad en milésimas enteras y calcular probabilidad efectiva con lo entregado, conforme al Markdown. Pausa y pestaña oculta congelan el reloj, escenas y movimientos. Consultar o mover objetos no congela la emergencia. Una escena neutral de intervención precede a estabilización o pérdida, sin spoilers.

### Tutorial, controles y preferencias

- Tutorial separado de la campaña, con tres lecciones y ayuda paso a paso. Primera: Tierra al mínimo, buscar ficha, comparar cinco recursos/inventario, aprobar y ver consecuencia. Segunda: Marte pide 6,900 kg de comida frente a 11,500; el niño detecta falta, puede equivocarse/reintentar y devuelve. Tercera: E02 pide 1,000 kg O₂; aprende 50%=500 kg y 50% de probabilidad, luego 100%, primero sin reloj; ensayo final reinicia a cero con 30 segundos y exige confirmar. Si expira se puede repetir. Son 29 pasos de referencia, no 29 pantallas diferentes.
- Señalar una acción a la vez; pista, repetir lección y salir. No resolver automáticamente la búsqueda del manual. Extender el tutorial si se adopta la operación de base, sin inundarlo de sistemas simultáneos. Mantener resumen de lo aprendido e inicio de partida nueva con inventario propio.
- Ratón y teclado: Tab/Enter/Espacio, flechas para mover objeto enfocado, B manual, I inventario, R registro, Escape pausa, F pantalla completa. Foco visible y controles con nombre; estado no comunicado solo por color/sonido. Pausar también congela arrastre, entrega de hojas y salidas de personajes.
- Menú: iniciar turno, aprender, opciones, créditos. Pausa: continuar, opciones y volver al menú indicando que termina la sesión. Preferencias locales de volumen, silencio y movimiento reducido. No prometer guardado de campaña. Activar audio después de interacción del usuario y manejar recarga sin estado corrupto.

## 6. Inventario de producción que el plan debe revisar

Antes de pedir imágenes definitivas, aprueba un boceto con papel/manual legibles al lado, controles alcanzables y espacio para la emergencia. Referencias lógicas actuales: retrato 240×300, papel 270×355, manual 740×430, inventario/registro 410×420, emergencia 800×460, proyección 1600×760 y escenario 1600×900. Verificar a 1280×720 y 1366×768; si no se lee, reacomodar en lugar de reducirlo todo. Tras cerrar composición, exportar raster a 2× de la caja visible; vector si resulta mejor. No son dimensiones finales decididas de antemano.

Incluye en el plan un inventario exhaustivo con función, variantes/estados, formato, tamaño condicionado a la composición, responsable y prioridad P0 imprescindible / P1 deseable / P2 opcional. Marca los elementos nuevos. Este es el mínimo a recorrer:

**Arte del equipo:** identidad original, fondo de menú; interior lunar, ventanilla, mostrador y escritorio por capas; bandeja/labio delantero y soporte de sellos; nueve ingenieros neutrales, técnico y figura de evaluación, con poses/expresiones adicionales solo donde se utilicen; tres familias de papel, manual/tapa/lomo/separadores, libreta de inventario/registro; dos sellos y tinta autorizada/devuelta; iconos de cinco recursos, ocho incidentes y todos los controles; cursor normal/agarrar/agarrando opcional; marco de emergencia y depósito; marco del informe; espacio/estrellas, Luna y ocho planetas, superficies Luna/Mercurio/Venus/Tierra/Marte, plataforma, transporte y módulo separados; base exterior normal/intervención/estable/perdida y equipo técnico; propulsión, carencias por recurso y pérdida simbólica; oficina/ventanal de finales y certificado/traslado/despido; soportes visuales de tutorial, pausa, opciones, créditos y ciencia. Añadir hábitat/refugio/invernadero/antena y papeles de operación si se adopta la ampliación. Fuentes con licencia, acentos/O₂/números tabulares; favicon, captura principal y materiales de demo. Decoración adicional es P2. El arte no debe contener cifras o párrafos esenciales horneados.

**Construir mediante código para lectura/interacción:** contenido e IDs de tres documentos; manual completo (índice, selector y ocho fichas, reglas, emergencias, páginas nuevas de ciencia/operación); inventario y registro vacío/paginado; texto de sello; arrastrar, apilar, fijar, comparar, guardar y entregar; botones con normal/hover/foco/presionado/deshabilitado; indicador físico de desempeño; reloj, barra y confirmación de emergencia; partes y tablas; guías/resaltados/reintentos del tutorial; opciones, créditos/licencias/SI, pausa; tres finales, bitácora y semilla; nuevos despachos/estados de base si se acuerdan; datos NASA curados con metadatos; inglés completo, alternativa española opcional; carga, error de asset y respaldo legible. No encargar una imagen por cada número ni convertir esas funciones en tarjetas de una web.

**Animaciones:** llegada/espera/salida de personas; hojas bandeja→lectura→arrastre→apilado→guardado; manual abrir/cambiar/cerrar/fijar y paginación; sello presión/tinta/retorno y recogida de las tres hojas; preparación/ascenso/acoplamiento/ida/órbita o descenso/regreso/aterrizaje; fallo por fase y recurso; aviso/urgencia/confirmación/expiración; intervención→estabilización o pérdida; archivo→siguiente/final; tres finales; progreso de tutorial; estados persistentes de la base nueva. Toda secuencia tendrá pausa y equivalente con movimiento reducido. Gestos extra, partículas y escenas particulares para cada incidente son P1/P2; reutiliza capas y combinaciones.

**Audio:** papel tomado/soltado/recogido, manual y páginas, sello, controles, alerta/urgencia/confirmación, motores/acoplamiento/aterrizaje si cabe, resultado favorable/fallo, recuperación/pérdida y tres cierres. Sonidos de radio/sistemas para nueva base, ambiente y música de menú/turno/tensión/cierre como mejoras según tiempo. Voces opcionales. Hoy la referencia solo tenía cinco señales sintetizadas: papel, sello, alarma, bueno y malo; no asumas música entregada. Maestro WAV 48 kHz, distribución comprimida con respaldo compatible; bucles sin saltos. Silencio/volumen funcionan siempre, sin audio acumulado al reanudar. Si se añade música, proponer control separado; no darlo por existente.

Cada asset debe tener ID, autor/origen/licencia, fecha, estado, tamaño visible/exportado, transparencia, pivote, fotogramas y estados consumidos. Mantener editables por capas y PNG/WebP/SVG según uso, atlas con metadatos si hace falta.

## 7. Ciencia trazable, con ficción transparente

Resources enlaza [NASA Open APIs](https://api.nasa.gov/), [DONKI](https://ccmc.gsfc.nasa.gov/tools/DONKI/), [OSDR](https://osdr.nasa.gov/bio/repo/), [búsqueda OSDR](https://osdr.nasa.gov/osdr/data/search?term=KEYWORD), [RadLab](https://visualization.osdr.nasa.gov/radlab/gui/data-api/), [Mars Trek](https://trek.nasa.gov/mars/) y [recursos CSA para alimentos](https://www.asc-csa.gc.ca/eng/youth-educators/toolkits/food-production/).

Propuesta técnica recomendada: un registro DONKI archivado para contextualizar la alerta/refugio y un hallazgo NASA concreto de salud/soporte vital o cultivo que fundamente una decisión. **Todavía no hay registro o estudio seleccionado**: el plan debe incluir elegirlo/verificarlo durante el trabajo permitido, documentar ID, fecha, unidades, enlace y transformación. DONKI anunció migración al dominio `ccmc.gsfc.nasa.gov`; verifica la [documentación actual](https://ccmc.gsfc.nasa.gov/DONKI/api/). No exijas servicio en vivo: un conjunto curado local hace la partida estable.

No deduzcas una dosis lunar de la clase de llamarada ni traslades dosis de ISS/RadLab a superficie lunar sin modelo. No conviertas resultados biológicos en producción o consumos inventados de NASA. El dato real orienta una decisión trazable; costos, probabilidades y tiempos didácticos se identifican aparte como balance. Mantén fuente visible en manual/parte/créditos, no solo en la página de entrega. CSA complementa, no reemplaza el requisito NASA. Marte como otra base es opcional y fuera del alcance mínimo.

## 8. Qué significa “pulido” y cómo comprobarlo

El plan debe definir criterios observables y pruebas útiles, sin prometer resultados aún no ejecutados:

- Una partida completa, todos los caminos de informe y los tres finales; igualdad de mínimos, insuficiencia por recurso y falta de stock; cinco destinos distintos y exactamente dos incidentes; presupuesto reproducible sin saldos negativos ni doble cobro.
- Ratón/teclado equivalentes; ningún objeto perdido, clic atravesando hojas, doble decisión, foco invisible o interacción bloqueada después de pausa, cambio de tamaño, pestaña oculta o arrastre interrumpido.
- Emergencia desde aparición, 0/50/100%, aporte limitado, confirmación única, expiración, mover ventana y consultar saldo; pausa real y reanudación sin consumir tiempo oculto. Tutorial independiente con reintentos.
- Sin filtración visual/sonora/estadística del resultado antes de la consecuencia; salto/velocidad no resuelven dos veces ni inventan fases posteriores a un fallo.
- Datos legibles sobre el arte, contraste y unidades consistentes, números largos que no desbordan, manual/propuesta comparables; textos en inglés probados y español si se ofrece. Menús/pausa/finales se sienten parte del juego.
- Animaciones coherentes con pivotes, capas, pausas y movimiento reducido; sonido sin solapamientos/picos ni dependencia de reproducción automática. Transiciones con ritmo y controles claros.
- Probar comprensión con público objetivo de forma apropiada: explicar cinco recursos por pasos, diferencias entre pedido/mínimo/saldo y una decisión de base con costo/consecuencia. No usar grabaciones, fotos o voces de menores en la entrega. Registrar observaciones sin afirmar que una muestra pequeña valida todo el aprendizaje.
- Verificar publicación en navegadores objetivo y una sesión privada sin cuenta, errores de consola/cargas, recursos perdidos y funcionamiento sin llamadas externas durante la partida si se elige dataset local. Planificar pruebas de Chrome/Chromium y Safari/WebKit según disponibilidad real.

## 9. Publicación y entrega

Prioriza juego estático completo sin login ni instalación, con URL pública y assets locales. Elegir una sola vía de hosting que soporte los archivos del juego. Las ofertas son opcionales: GoDaddy/Porkbun anuncia dominio no premium/hosting/SSL un año; verificar compatibilidad real antes de elegirlo. Google Cloud anuncia crédito USD 300/90 días y Azure USD 200/30 días para elegibles, con posibles verificaciones; Miro/Teams/Copilot no son dependencias necesarias. No canjear ni contratar durante la planificación.

La entrega requiere nombre, resumen, descripción, demo, enlace final, explicación del uso NASA, referencias y declaración de SI. Demo obligatoria: **hasta siete diapositivas contando portada/introducción o video de hasta 30 segundos**. Preferencia de producción propuesta: siete diapositivas con capturas reales, decisión y consecuencia, fuente NASA y alcance. No hacer el video ahora.

La página, materiales vinculados y versión del juego para evaluación deben estar en **inglés**; español adicional si hay tiempo. Video hablado en otro idioma requiere subtítulos ingleses. Enlaces públicos sin permisos/cuenta; imágenes de Project JPG/PNG/GIF hasta 10 MB; documentos/videos alojados fuera. Guardar progreso no equivale a enviar: prever revisión humana, aceptación de términos/originalidad, **Submit for Judging** y comprobación de banner de confirmación antes de las 15:30 locales. Máximo seis miembros confirmados en la misma sede y en Members; local admite desde una persona, Universal exige al menos dos para global.

Documentar derechos y licencias de código/arte/audio/fuentes/datos, también si son abiertos, conforme a términos de Space Apps. No incluir semejanza/voz de menores reales. Declarar usos de IA/SI con precisión: la idea central es del equipo; las recomendaciones asistidas se identifican como tales. La guía permite asistencia y restringe usarla para originar la solución. Imágenes/videos SI requieren marca visible; audio/código/datos, reconocimiento en descripción y metadatos. Contenido generado no puede incorporar/modificar marcas o elementos de diseño NASA. Mantener atribución científica textual clara sin sugerir aval oficial.

Evaluación: impacto, creatividad, validez, relevancia y presentación. Que el jurado pueda jugar, ver una decisión educativa y rastrear su fuente sin leer todo el código.

## 10. Salida que espero de este Plan mode

Devuelve un plan breve y ejecutable por horas hasta la entrega local, con dependencias, responsables por función y cortes de alcance. Incluye composición del escenario; mecánicas conservadas; adaptación mínima para el desafío marcada como propuesta nueva; decisiones pendientes que de verdad condicionan la implementación; inventario completo de assets con estados/prioridad/formatos; datos NASA y límites; pruebas de aceptación; publicación y checklist de envío.

Concreta qué entra en P0 y qué se descarta si no hay tiempo. No conviertas opcionales como música extensa, voces, más bases, otros motores o servicios en obligaciones. No alteres arbitrariamente mis mecánicas ni valores acordados para simplificar tu trabajo. No presentes el plan ni la reescritura como garantía de elegibilidad. Termina con un plan revisable, **sin construir la nueva versión**.
