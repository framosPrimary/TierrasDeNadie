# Tierras de Nadie — Rules

> Estado: v0.6 — consolidación del Profe (22/10/2026); ver addenda §21–§23  
> Fuente: video de reglas + validaciones del Director Creativo del 13/10/2026 y definiciones del 14/10/2026.  
> Este archivo es la fuente de verdad del comportamiento jugable. Si una regla no está definida aquí, no debe inventarse en código.

## 1. Objetivo de la partida

Tierras de Nadie es un juego de cartas de enfrentamiento directo para dos jugadores.

No existe una cantidad de vida inicial. Cada jugador acumula daño recibido.

La partida normal dura 3 rondas. Al finalizar la tercera ronda gana el jugador que haya infligido más daño total al oponente.

Si ambos jugadores terminan empatados, se juega una ronda adicional de desempate con 5 cartas por jugador.

## 2. Componentes

- 3 cartas de Terreno.
- 1 mazo compartido de 50 cartas de doble componente.
- Héroes y componentes adicionales hasta aproximadamente 65 cartas físicas.
- Cada jugador utiliza 2 héroes por ronda, seleccionados entre 4.

## 3. Preparación de ronda

1. Se mezclan las 50 cartas del mazo.
2. Cada jugador recibe 10 cartas.
3. Cada jugador recibe 4 héroes.
4. Cada jugador elige 2 héroes para utilizar durante esa ronda.
5. Comienza el primer turno.

La mano puede contener hasta 10 cartas, salvo efectos pendientes de definición que alteren temporalmente esta regla.

Al finalizar la ronda:
- todas las cartas vuelven al mazo;
- se mezcla nuevamente;
- cada jugador vuelve a recibir 10 cartas;
- cada jugador vuelve a recibir 4 héroes y elige 2.

## 4. Terrenos y líneas

Existen exactamente 3 líneas de terreno.

Cada línea contiene una cadena independiente de cartas de cada jugador.

Los siguientes valores se calculan por línea:
- espadas;
- escudos;
- murallas;
- objetivos de catapulta.

## 5. Encadenamiento

Cada carta posee:
- un elemento superior;
- un elemento inferior.

Una carta puede encadenarse por superposición sin exigir coincidencia (ver §16).

La nueva carta puede colocarse:
- por encima de una carta ya jugada;
- por debajo de una carta ya jugada;

La superposición determina qué elemento queda tapado o habilitado; no hay incompatibilidad por símbolos (ver §16).

## 6. Turno

Los jugadores alternan turnos.

En un turno normal:
1. el jugador activo juega exactamente 1 carta;
2. elige una de las 3 líneas;
3. elige la posición y superposición de componentes;
4. determina cuáles quedan tapados y cuáles habilitados;
5. coloca la carta;
6. resuelve los efectos inmediatos de esa carta;
7. termina el turno;
8. juega el rival.

## 7. Elementos

### 7.1 Espadas
Las espadas representan ataque convencional. Se acumulan por línea y se resuelven al final de la ronda.

### 7.2 Escudos
Los escudos defienden contra espadas. Se acumulan por línea y se restan del ataque de espadas del rival en esa misma línea.

### 7.3 Arquería
La arquería se activa inmediatamente cuando la carta se encadena.

Solo puede ser defendida mediante:
- murallas acumuladas en esa misma línea;
- habilidades de héroe que explícitamente permitan defenderla.

Los escudos no defienden contra arquería.

### 7.4 Murallas
Las murallas son una defensa pasiva acumulativa por línea contra arquería.

### 7.5 Oro
El oro se activa inmediatamente al encadenarse la carta.

Al activarse una carta de oro, el jugador tiene una oportunidad de utilizar el Mercado. El oro puede gastarse en acciones de Mercado y puede interactuar con habilidades de héroe.

### 7.6 Curación
La curación se activa inmediatamente al encadenarse la carta.

Curarse reduce el daño acumulado recibido.

El daño recibido no puede quedar por debajo de 0.

### 7.7 Catapulta
La catapulta se activa inmediatamente al encadenarse.

Elimina la última carta del oponente de la misma línea de terreno en la que fue encadenada.

## 8. Mercado

**Momento de uso confirmado (14/10/2026):** el Mercado puede utilizarse cada vez que se activa una carta de oro. No se habilita por defecto en cualquier otro momento del turno.

### Coste 1 — Cambiar carta
- pagar 1 oro;
- descartar 1 carta de la mano;
- robar 1 carta del mazo.

### Coste 2 — Tomar carta del rival
- pagar 2 de oro;
- tomar 2 cartas de la mano rival;
- devolver al rival 2 cartas elegidas entre las que tiene el comprador en su mano (incluidas las recién tomadas); el rival no pierde tamaño de mano.

### Coste 2 — Curación
- pagar 2 de oro;
- reducir el daño recibido en 2.

### Coste 3 — Contratar catapulta
- pagar 3 de oro;
- el jugador elige una de las líneas del enemigo;
- se elimina automáticamente la última carta de esa línea;
- la carta destruida va al descarte.

**Confirmado (14/10/2026):** el efecto de la catapulta contratada es inmediato al comprarla. **OPEN-RULE-01 (resuelta).**

### Coste 3 — Carta extra
- pagar 3 de oro;
- robar una carta del mazo y jugarla inmediatamente, como jugada adicional (no reemplaza una de las 10 normales).

**OPEN-RULE-02:** coste de 3 de oro confirmado el 14/10/2026. Sigue pendiente definir si la compra puede repetirse y cómo se ordenan las cartas extra de ambos jugadores.

**OPEN-RULE-03 (resuelta):** el Mercado puede utilizarse cada vez que se activa una carta de oro. **Pendiente de detalle:** cantidad de compras permitidas durante una misma activación de oro y si se permite acumular oro de activaciones anteriores.

## 9. Resolución de fin de ronda

Después de que ambos jugadores hayan jugado sus cartas normales y las cartas extra que correspondan, se resuelven las espadas línea por línea.

Para cada línea y para cada jugador:

```text
dañoDeEspada = max(0, espadasPropias - escudosRivales)
```

El daño resultante se suma al daño recibido por el rival.

Cada línea se resuelve de manera independiente.

## 10. Daño

Cada jugador mantiene:

```text
damageReceived >= 0
```

Fuentes conocidas:
- arquería;
- espadas;
- habilidades de héroe;
- otros efectos explícitos.

La curación reduce `damageReceived`, nunca por debajo de 0.

## 11. Héroes

Cada héroe posee una habilidad propia y define su propio timing.

El motor no debe asumir un único momento universal para las habilidades de héroe.

Pendiente incorporar:
- lista de héroes;
- habilidades;
- condiciones;
- prioridades;
- targets.

## 12. Desempate

Si existe empate después de las 3 rondas:
- se juega una ronda adicional;
- cada jugador recibe 5 cartas.

**OPEN-RULE-04:** confirmar si el desempate usa el mismo mulligan de héroes, Mercado y reglas de cartas extra.

## 13. Regla pendiente sobre destrucción

**Confirmado (14/10/2026):** toda carta destruida va al descarte. **OPEN-RULE-05 (parcialmente resuelta):** sigue pendiente definir si se recalculan los efectos pasivos de la carta retirada y si un efecto inmediato ya aplicado permanece sin reversión.

## 14. Descarte

Toda carta destruida pasa al descarte. Esto incluye las cartas eliminadas por catapultas contratadas en el Mercado. No se ha confirmado todavía si el descarte se mezcla nuevamente durante una ronda ni cómo se recalculan efectos pasivos al destruir una carta.

## 15. Principio de implementación

El código debe distinguir entre:

- **estado**: daño, oro, mano, cadenas;
- **acción**: jugar carta, usar Mercado, seleccionar héroes;
- **validación**: si una acción está permitida;
- **efecto**: cambios generados por una acción;
- **evento**: algo que ocurrió y puede disparar otros efectos.

No debe codificarse comportamiento no documentado en este archivo.


## 16. Encadenamiento por superposición — corrección confirmada

**Esta sección sustituye la restricción de coincidencia de elementos descrita anteriormente en §5.** Una carta siempre puede encadenarse; no es necesario que los símbolos enfrentados coincidan. El jugador decide la superposición: qué componente tapa al otro y cuál queda descubierto. La táctica depende de qué elemento permanece habilitado, no de una incompatibilidad que prohíba jugar.

Ejemplo confirmado: carta nueva con espada arriba y oro abajo, sobre una carta con escudo arriba y arquería abajo:
- Si el oro tapa al escudo, el oro queda habilitado y puede abrir una oportunidad de Mercado; el escudo queda inactivo.
- Si el oro queda debajo del escudo, el escudo conserva su contribución defensiva y la espada de la carta nueva puede aportar ataque.

**Elementos tapados:** un componente tapado deja de contar para su acción. Si ambos componentes de una carta quedan tapados, la carta queda desactivada mientras continúe así; puede recuperar componentes vigentes si se destapan (por ejemplo tras destruir otras cartas). El fin de ronda resetea el tablero.

### Activaciones y visibilidad
- **De activación única por ronda y por componente:** oro, catapultas, curación y efectos de báculos mágicos. Se disparan solo cuando quedan habilitados al encadenarse; si posteriormente se tapan y destapan, **no vuelven a dispararse**.
- **Arquería:** excepción de combo. Si se encadena un nuevo arco en una línea con otro arco vigente, se suma su valor al del arco ya presente: arco 1 + arco 2 = 3 de daño de arquería en esa acción. Los arcos tapados dejan de contar en la suma. No se debe tratar el mero destapado como repetición automática de oro, curación, catapulta o báculo.
- **Espadas y escudos:** su contribución vigente se calcula al cierre de la ronda, considerando únicamente componentes destapados.

**Punto de implementación a precisar:** geometría exacta de las superposiciones y disparadores de arquería al destapar un arco sin encadenar uno nuevo; no inventar esta regla.

## 17. Resolución de espada de fin de ronda — ratificada

En cada una de las 3 líneas, para ambos jugadores de manera independiente:
```text
dañoDeA_a_B = max(0, espadasVisiblesA + modificadoresAplicablesA - escudosVisiblesB)
dañoDeB_a_A = max(0, espadasVisiblesB + modificadoresAplicablesB - escudosVisiblesA)
```
Las habilidades de héroes y báculos pueden modificar el ataque; sus fórmulas y orden particular requieren catálogo detallado. Calcular el combate al final de la ronda, no cada vez que se encadena una espada.

## 18. Selección, revelación y enroque de héroes — confirmadas

1. Primero se reparten **10 cartas** a cada jugador desde el mazo común.
2. Cada jugador conoce su mano antes de seleccionar sus héroes. De **4 héroes ofrecidos**, elige **2**.
3. Entre esos 2, elige un **héroe inicial** y deja el otro como **suplente**.
4. La elección inicial se mantiene oculta hasta que ambos jugadores eligen; entonces los héroes iniciales se **revelan simultáneamente**, sin que nadie aproveche conocer primero la selección rival.
5. Cada jugador puede realizar **un solo enroque** durante la ronda entre héroe activo y suplente, mientras siga habilitado.
6. En cuanto la mano del jugador llega a **3 cartas o menos**, su suplente queda **suspendido para lo que reste de la ronda**; ya no puede realizar el enroque, incluso si más tarde compra cartas extra en Mercado.
7. Si ya utilizó su único enroque, no puede repetirlo. Si al llegar al umbral ya había intercambiado, el héroe que esté activo en ese momento permanece activo.

Para el servidor online, las selecciones se guardan de forma privada y solo se publican juntas al completar ambas confirmaciones. Contar el tamaño de la mano y mantener un indicador persistente de suspensión; **no** inferir disponibilidad únicamente de la cantidad de cartas jugadas.

## 19. Objetivo de modalidad online

La experiencia objetivo es **duelo 1 contra 1 online** desde dispositivos separados, con posibilidad de jugar **como invitado sin cuenta** y, a futuro, cuenta opcional. La validación del estado y las jugadas debe ser autoritativa en servidor y no enviar la mano privada de un jugador al rival. El prototipo web local sigue sirviendo de banco de pruebas. Un bot básico podrá ser un controlador alternativo para testear partidas completas.

## 20. Pendientes que aún requieren precisión

- Qué geometrías exactas de superposición se ofrecen en cada extremo/interior de la cadena.
- Qué ocurre si se destapa un arco sin encadenar un nuevo arco; distinguir valoración visible de daño inmediato ya ejecutado.
- Catálogo completo de cartas, héroes y efectos de báculos; timings y modificadores precisos.
- Cómo se combinan límites de mano y compras de cartas extras; cantidad de compras por activación de oro.
- Desempate (héroes, Mercado, cartas extra), orden de cartas extra y reglas de primer jugador.

Estas dudas **no** autorizan al código a imponer coincidencia de símbolos para encadenar.


## 21. Addenda del Profe — respuestas 01–20 (22/10/2026)

Fuente primaria: cuestionario de 34 preguntas respondidas por el Profe. Sus respuestas prevalecen sobre formulaciones anteriores en conflicto.

### Colocación, tapado y destrucción
- (01) La primera carta de cada terreno se encadena obligatoriamente **por debajo** del terreno: queda habilitado solamente su **elemento inferior** y, cuando corresponda, la muralla que incluya la carta. Las cartas siguientes se encadenan respecto del elemento inferior de otra carta ya jugada.
- (02) En los encadenamientos posteriores, el jugador decide si superpone la carta nueva por arriba o por debajo de la carta ya jugada.
- (03) Cuando un elemento tapado se destapa por destrucción, vuelve a aportar su valor persistente. Los efectos inmediatos ya ejecutados nunca se repiten.
- (04) Una catapulta de carta elimina la **última carta enemiga jugada en su misma línea**, sin reacomodar físicamente las demás. Los elementos destapados recuperan su vigencia.
- (05) No hay máximo de cartas por terreno, pero cada jugador debe encadenar al menos una carta en **cada uno de los tres terrenos**.
- (06) Murallas y arcos se acumulan por línea; las murallas defienden contra el total de arquería aplicable.
- (07) Un arco tapado deja de participar en combos posteriores. La respuesta no explicita reversión de daño histórico: NO descontar daño ya ocurrido sin nueva decisión del Profe.
- (08) Curación a daño cero se pierde, no se almacena.
- (09) Los efectos se resuelven al encadenar, y luego se habilita Mercado si se activó oro.
- (10) Si se habilitan dos elementos de activación inmediata de una carta, se ejecuta primero el de **arriba** y después el de **abajo**.

### Turnos, Mercado y cierre
- (11) El enroque puede hacerse antes o después de jugar la carta normal, sujeto al bloqueo irrevocable del suplente cuando la mano llega a tres o menos. La frase «siempre y cuando tenga 3 cartas» del cuestionario contradice esa regla preexistente y se registra para aclaración en DECISIONS.
- (12) Mercado se cierra al pulsar **Finalizar compra**, incluso si sobra oro.
- (13–14) La carta extra comprada (3 oro) sale del mazo, se juega inmediatamente y no consume una de las 10 jugadas normales. Varias compras producen varias jugadas adicionales inmediatas. Una activación posterior de oro puede abrir otra oportunidad de Mercado.
- (15) Si el mazo no permite completar el robo de Mercado, se cancela esa compra; no se mezcla el descarte durante la ronda.
- (16) El intercambio de 2 oro toma dos cartas rivales y devuelve **dos** cartas al rival desde la mano del comprador (no una).
- (17–18) La ronda espera que ambos jugadores agoten sus cartas normales; quien terminó aguarda al otro.
- (19) Si el desempate a cinco cartas también empata, gana quien acumule mayor cantidad de **espadas + arcos + báculos** presentes de su lado. Su valoración exacta sigue pendiente.
- (20) Primera ronda: sorteo con moneda. Rondas 2 y 3: el jugador que está perdiendo elige quién empieza. Desempate: empieza quien perdió el sorteo original.

## 22. Addenda del Profe — respuestas 21–34

### Héroes
- (21) Catálogo de 10 héroes y habilidades en JPG: **aún no recibido**.
- (22) El héroe titular aplica sus habilidades mientras permanezca activo.
- (23–24) Tras el enroque, el héroe retirado deja de influir. Está pendiente clasificar beneficios inmediatos irreversibles ya aplicados versus bonificaciones persistentes.
- (25) El suplente y los héroes descartados permanecen **secretos** hasta que se revele el suplente mediante enroque; no enviar esa información al adversario en el modo online.
- (26) Los 10 héroes son un mazo compartido; se reparten 4 a cada jugador sin duplicados.

### Báculos
- (27–28) Son efectos diversos, incluidos elementos alternativos y bonificaciones de espadas. Catálogo específico **pendiente**.
- (29) Un báculo tapado no aplica un bonificador persistente al final de ronda.
- (30) Los báculos admiten sinergias con héroes; ejemplo: elegir catapulta, curación u oro de un báculo, según conveniencia.

### Mercado
- (31) Puede repetirse una acción tantas veces como se quiera mientras haya oro suficiente en la oportunidad de Mercado.
- (32) La compra de intercambio toma 2 cartas de la mano rival y devuelve 2 cartas de la mano del comprador, sin reducir la mano del rival.
- (33) Descarte de reemplazo va al descarte común.
- (34) Una acción comprada puede activarse incluso sin blanco; si no hay blanco, no produce ese efecto, pero **sí puede activar habilidades de héroe** (ej. Ingeniero: 4 de daño por activación de catapulta, sujeto a confirmar texto final de carta).

## 23. Otras reglas confirmadas en conversación y alcance

- El oro puede guardarse dentro de la ronda, no entre rondas.
- Durante una oportunidad de Mercado se permiten compras múltiples, incluso repetidas; el jugador confirma cuándo cierra.
- Las compras de cartas extra pueden encadenar nuevas activaciones de oro y nuevas oportunidades de Mercado. No hay límite artificial.
- Entre rondas se reinician el oro, manos, mazo, descarte, líneas, efectos temporales y héroes; se conservan los tres terrenos y el daño acumulado.
- El motor completo deberá separar acciones normales de jugadas extra, y registrar qué revelaciones y efectos son privados.
- **Este documento describe decisiones de diseño, no garantiza que el código actual las cumpla.** No desplegar como reglamentario hasta cumplir criterios de ROADMAP_NEXT_VERSION.md.
