# Datos esenciales de nave y misiones

Archivo autónomo: se puede mover sin sus fuentes locales. Las comas separan miles; el punto indica decimales.

## Fuente de cantidades para reconstruir el juego

**Usar directamente la tabla siguiente. Son los valores redondeados acordados. No regenerarlos con ecuaciones científicas, añadirles otro margen ni sustituirlos por tablas orbitales anteriores.**

Escenario activo: base en la **Luna**, **4 personas por expedición**, ocho destinos. Los cinco recursos son independientes: comida en kg, agua en L, oxígeno respirable en kg, propelente en kg y electricidad en kWh.

### Tabla principal · mínimos de juego por expedición completa

| Destino desde Luna, con retorno a Luna | Comida (kg) | Agua (L) | O₂ (kg) | Propelente (kg) | Electricidad (kWh) | Operación en destino |
|---|---:|---:|---:|---:|---:|---|
| Mercurio | 9,200 | 21,120 | 3,960 | 1,980,000 | 1,760,000 | Descenso y visita mediante módulo local ficticio |
| Venus | 10,350 | 23,040 | 4,840 | 1,760,000 | 1,980,000 | Descenso y visita mediante módulo local ficticio |
| Tierra | 11,500 | 19,200 | 4,400 | 1,100,000 | 1,100,000 | Descenso y visita mediante módulo local |
| Marte | 11,500 | 19,200 | 4,400 | 1,100,000 | 1,100,000 | Descenso y visita mediante módulo local |
| Júpiter | 17,250 | 30,720 | 7,480 | 2,420,000 | 2,640,000 | Solo órbita; sin aterrizaje |
| Saturno | 20,700 | 36,480 | 8,800 | 2,750,000 | 3,080,000 | Solo órbita; sin aterrizaje |
| Urano | 25,300 | 44,160 | 11,000 | 3,300,000 | 3,740,000 | Solo órbita; sin aterrizaje |
| Neptuno | 29,900 | 53,760 | 13,200 | 3,850,000 | 4,400,000 | Solo órbita; sin aterrizaje |

Cada fila incluye **ida, operación/visita en destino, regreso a la superficie lunar, apoyos y reserva**, como asignación administrativa de toda la expedición. El transporte principal permanece en órbita; los módulos locales realizan ascensos y descensos. No sumar otra recarga, reserva, regreso ni una segunda tripulación.

**No hay duración numérica ni estancia confirmada para cada uno de estos ocho circuitos ficticios.** No trasladar a ellos los 20/1,000/1,200 días o los dos días de visita de las seis fichas técnicas Tierra/Luna/Marte. No se ha definido una espera orbital numérica para los ocho destinos. Los costos no representan distancias ni tiempos reales. Venus superficial y los viajes humanos a los gigantes son ficción explícita del escenario.

## Nave y arquitectura esenciales

Un transporte reutilizable común, un módulo local de tripulación y bases/depósitos ya disponibles. Se contabiliza lo asignado a la expedición; construir la infraestructura o llevar previamente suministros a los depósitos queda fuera.

| Característica de referencia V3 | Valor acordado | Cómo utilizarla |
|---|---:|---|
| Tripulación del juego activo | 4 personas | Fija; la V3 técnica admite 1–4 |
| Masa vacía del transporte | 100,000 kg | Referencia de diseño, no otro recurso que descontar |
| Módulo local, masa vacía | 12,000 kg | Para representar salida/regreso a superficie; no es el transporte principal |
| Carga auxiliar | 10,000 kg | Equipos y reservas auxiliares; ya considerada en el antecedente |
| Capacidad simultánea de propelente V3 | 1,500,000 kg | Tanque de referencia, distinto al gasto de toda la expedición |
| Residuo de propelente V3 | 15,000 kg | Incluido dentro del tanque; no sumarlo al presupuesto |
| Provisiones V3: comida / agua / O₂ | 20,000 kg / 30,000 L / 7,000 kg | Capacidades de referencia de la arquitectura técnica |
| Solar a 1 UA | 400 kW | Potencia; no electricidad almacenada |
| Batería nominal / útil | 400 / 280 kWh | Los 280 kWh ya son útiles; no descontar eficiencias otra vez |
| Consumo de referencia, 4 personas y apoyos | 38 kW | Hipótesis del modelo, no fórmula para reemplazar la tabla principal |
| Base de apoyo superficial de referencia | 60 kW continuos asignados | Hipótesis de infraestructura de las fichas técnicas |

**Las capacidades V3 son referencia del concepto de nave, no validación de los ocho circuitos ampliados.** El catálogo ficticio no aplica sus límites de tanque, autonomía, potencia o provisiones como reglas de rechazo. Por ejemplo, el propelente de misión puede exceder un tanque porque el total abarca consumos y suministros distribuidos; las extensiones a otros planetas tampoco quedan físicamente demostradas por ello. No rechazar automáticamente Júpiter por exceder la bodega V3: el modo actual usa los cinco mínimos de la tabla y el inventario de campaña.

El O₂ respirable está separado del oxidante contenido en el propelente. El presupuesto eléctrico de millones de kWh representa energía generada y usada durante operaciones, **no una batería de ese tamaño**. Tampoco son intercambiables kg, L, kWh y kW.

## Emergencias lunares vigentes · costo de un aporte completo

| ID | Incidente | Recurso y costo del 100% |
|---|---|---:|
| E01 | La esclusa no completa el cierre | 20,000 kWh de energía |
| E02 | Se perdió parte de la reserva de oxígeno | 1,000 kg de O₂ |
| E03 | Un depósito de agua quedó contaminado | 40,000 L de agua |
| E04 | Alerta solar: activar el refugio | 60,000 kWh de energía |
| E05 | Se detuvo la ventilación y el depurador | 40,000 kWh de energía |
| E06 | Se perdió una caja de raciones | 10,000 kg de comida |
| E07 | Fuga en el circuito de enfriamiento | 20,000 L de agua |
| E08 | El almacén se quedó sin alimentación | 60,000 kWh de energía |

Cada evento usa un solo recurso; los demás cuestan cero. Son paquetes ficticios provisionales de balance. **Estas son las cantidades vigentes, ya multiplicadas por 1,000 respecto a los apuntes iniciales.** No volver a multiplicarlas. No combinar con el catálogo antiguo E1–E4 ni añadir sus pérdidas extra.

## Reglas y fórmulas mínimas

1. **Inventario inicial variable, una sola vez.** Sortear cinco destinos distintos de los ocho y dos eventos distintos de los ocho. Para cada recurso `r`:

   ```text
   subtotal[r] = suma(mínimo[r] de los cinco destinos de referencia)
               + suma(costo completo[r] de los dos eventos)
   inicial[r] = subtotal[r] + techo(subtotal[r] × 0.10)
   saldo[r] = inicial[r]
   ```

   Los cinco destinos de referencia sirven para presupuestar; **no son un itinerario obligatorio ni garantizan que alcance cualquier otro recorrido posterior**. No mostrar identidades o momentos de eventos futuros. No hay reposiciones, premios ni reembolsos. El 10% de campaña es adicional a los márgenes ya contenidos en los mínimos; no modificar los mínimos.

2. **Propuesta.** Por recurso suficiente: `pedido = techo(mínimo × porcentaje / 100)`, con porcentaje entero sorteado entre 100 y 105. La mitad de propuestas se genera suficiente; la otra mitad tiene uno o dos recursos con porcentaje entero entre 10 y 95 y el resto suficiente. Esta mitad es una regla probabilística, no alternancia exacta. Evitar destino inmediatamente anterior, destinos ya completados e ingeniero inmediatamente anterior.

3. **Aprobar.** Para cada recurso: `gastado = min(saldo, pedido)`; `déficit_de_entrega = pedido − gastado`; `saldo_nuevo = saldo − gastado`. Una misión exitosa exige `pedido ≥ mínimo` en los cinco recursos y ausencia de déficit de entrega. La igualdad cumple. Se consume lo pedido aunque sobre o el viaje falle, una sola vez. Si el almacén no cubre el pedido, se consume lo disponible y termina el turno sin saldo negativo. Si cubre el pedido pero este está por debajo de un mínimo, falla la misión y la campaña continúa sin sumar éxito.

4. **Devolver.** Cero consumo, cero aprobación y cero éxito. No se puntúa como acierto/error, incluso si la propuesta era suficiente. Entregar automáticamente las hojas y recibir otro ingeniero.

5. **Dos emergencias.** Asignarlas a dos posiciones distintas después de los éxitos 1–4. El reloj comienza al aparecer el aviso: 30 segundos. Elegir un porcentaje entero de 0–100 limitado al inventario. Confirmar entrega `costo × porcentaje / 100`, sin exceder el saldo. El 100% garantiza éxito; un aporte parcial tiene probabilidad igual a la **fracción efectivamente entregada**, no al deseo del jugador. Con un aporte de cero la emergencia falla y termina la campaña. Expirar sin confirmar entrega cero. Cobro único; fallar destruye la base y termina el turno. Pausa o pestaña oculta congelan el reloj; arrastrar el aviso o consultar el inventario no lo reinicia.

6. **Precisión contable.** Mantener cantidades en milésimas enteras internamente: `unidades = redondear(cantidad × 1000)`. En emergencia truncar el aporte calculado hacia abajo a esa precisión y calcular la probabilidad con lo realmente entregado. Presentar unidades originales con hasta tres decimales cuando hagan falta.

7. **Cierre.** Completar cinco destinos diferentes y resolver ambas emergencias. Tasa `100 × éxitos / aprobaciones`, sin devoluciones ni tutorial. Sin aprobaciones: “Sin evaluar”. Final: 100% certificado; más de 40% y menos de 100% traslado a oficinas; 40% o menos despido. Déficit de entrega o emergencia fallida: despido anticipado. Usar el cociente exacto para elegir final, no el porcentaje redondeado de pantalla.

## Procedencia y límites

**D = dato científico publicado; C = cálculo propio; J = decisión ficticia de juego.** La tabla principal y las emergencias son **J**; ninguna fuente NASA publica esas ocho asignaciones ni esas probabilidades de supervivencia.

La referencia de partida del modo lunar es la ficha redondeada Luna–Marte–Luna: **11,500 kg comida; 19,200 L agua; 4,400 kg O₂; 1,100,000 kg propelente; 1,100,000 kWh**. Los demás destinos se obtuvieron mediante factores ficticios; Tierra comparte esa referencia deliberadamente. No reemplazar su propelente por los 1,900,000 kg de otra ficha técnica Luna–Tierra con aterrizaje. Comida y energía contienen ajustes de balance; no son mínimos físicos garantizados.

Procedencia local consultada, sin necesidad de llevar estos archivos: `orbita-lunar/data.js` (catálogo y E01–E08), `orbita-lunar/domain.js` (consumo/inventario/finales), `orbita-lunar/docs/REGISTRO_CHAT_2026-11-09.md` (decisiones posteriores), `MISIONES_SUPERFICIE_CALCULO.md` (referencia redondeada), `NAVE_V3_CERRADA_2026.md` (arquitectura). `INVENTARIO_INICIAL_COMPARTIDO_2026.md` aporta factores y procedencia, pero su garantía de itinerario y E1–E4 fueron sustituidos por el motor vigente.

Referencias científicas de origen: [NASA, Logistics Rates and Assumptions](https://ntrs.nasa.gov/citations/20230012635), para soporte vital; [NASA, estudio de ascenso lunar/marciano](https://ntrs.nasa.gov/citations/20205007701), para maniobras de referencia; [NASA, recuperación de agua en ISS](https://www.nasa.gov/missions/station/iss-research/nasa-achieves-water-recovery-milestone-on-international-space-station/), para distinguir investigación real de supuestos. Los cálculos anteriores **C** combinaban estos conceptos con diseño **J**. No se requieren para jugar ni deben recalcular esta tabla. La V3 no descuenta automáticamente agua u oxígeno por reciclaje.

No se han encontrado dos cantidades vigentes incompatibles tras distinguir catálogo ficticio y fichas técnicas. Lo no definido permanece explícito: duración/estancia de los ocho circuitos y cantidades para nuevas decisiones de operación de base. Cualquier sistema nuevo necesitará parámetros separados, identificados como nuevos y aprobados; no sustituirá silenciosamente estas cifras.
