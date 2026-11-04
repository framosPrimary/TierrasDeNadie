# Casos oficiales del Profe — 04/11/2026

**Fuentes primarias:** imágenes adjuntas «SECUENCIA 1–4» (dos diagramas), lámina de efectos de báculos, y video `VID-20261104-WA0025.mp4` (duración aproximada 01:35) acompañado por transcripción proporcionada por el usuario. Estos materiales son **ejemplos visuales del Profe**, no equivalen todavía a todas las interacciones posibles. La transcripción del video corresponde a un ejemplo **distinto** del diagrama de cuatro secuencias; no mezclarlos.

## A. Ejemplo de cuatro encadenamientos (diagrama de 4 paneles)

1. **Primera carta en terreno central**: se coloca debajo del terreno; queda activa espada de **valor 3**, más **una muralla** de la carta. El elemento superior de esa carta no se activa.
2. **Siguiente turno del mismo jugador**: encadena por debajo del elemento espada una carta cuyo elemento inferior es **arco 2**. Ese arco produce **2 de daño inmediato** al rival en ausencia de murallas defensivas u otros modificadores.
3. **Tercer turno**: encadena por arriba del arco una carta con **oro 2 superior** y un **báculo inferior**. En el diagrama se especifica que el oro se activa y habilita Mercado; el báculo suma **+1 espada en cada línea** en el fin de ronda si su efecto continúa vigente. El arco ya activado no vuelve a infligir daño simplemente porque se ponga otra carta.
4. **Resultado ilustrado**: terreno central con **4 de espada** y **2 de oro** activados, y terrenos externos con **1 espada** cada uno por el báculo. Los 2 puntos de oro son recurso/evento, **no daño de espada**.

**Caso de aceptación A:** primera carta activa cara inferior y muralla independiente; arco en combinación activa daño al colocarse; báculo persistente distribuye valores por líneas; oro permite Mercado. Verificar valores con el Profe si se cubre el componente del báculo posteriormente.

## B. Ejemplo de destrucción por catapulta (diagrama de 3 paneles)

1. Un rival tiene dos cartas de espada encadenadas hacia su extremo, dejando visible la última; el jugador de abajo conserva una primera carta con espada 3 y luego otra con efecto de báculo.
2. El jugador de abajo encadena una carta con catapulta por debajo de su báculo; se dispara y destruye **la última carta encadenada del enemigo en esa misma línea**.
3. La cadena enemiga **no se desplaza**. Queda la carta anterior, con **espada 3 y muralla** activas. El atacante mantiene su espada, báculo y la carta de catapulta; un efecto inmediato de catapulta **no se vuelve a activar** al destaparse.

**Caso de aceptación B:** eliminar última carta enemiga; conservar las restantes y sus estados persistentes; no reactivar efectos instantáneos. **No extrapolar todavía** un algoritmo de destapado para destruir una carta interior, puesto que esta secuencia destruye expresamente la última.

## C. Video del Profe: báculo lateral y Cleptan

La transcripción del usuario fija las siguientes marcas:
- **00:13–00:21**: primera carta central debajo de terreno, **espada 3 y muralla**.
- **00:21–00:35**: báculo en terreno derecho que agrega **+1 espada a cada terreno lateral**.
- **00:35–00:46**: carta debajo de otro terreno con **espada 3** activa para fin de ronda.
- **00:46–00:55**: otra carta activa **oro 1**.
- **00:55–01:03**: ese oro permite **descartar una carta y robar otra** mediante Mercado.
- **01:03–01:12**: la habilidad de **Cleptan**, ligada a la **activación de oro**, daña **2** al adversario.
- **01:12–01:34**: recuento de combo entre espadas persistentes, báculo lateral, oro/Mercado y habilidad de Cleptan.

**Caso de aceptación C:** distinguir `GOLD_ACTIVATED` de `MARKET_PURCHASED`: Cleptan dispara **por activación de oro** y la compra es una acción posterior; no atribuir los 2 daños a la compra si se activó oro. No convertir en regla general de todos los héroes antes de catalogarlos.

## D. Báculos de la lámina (texto remitido por el usuario)

Catálogo *provisional* de ocho descripciones de efectos (cada descripción puede corresponder a una o más cartas físicas):
1. Prohibir encadenar cartas con **oro** en esa línea mientras la carta exista; al destruirla pierde efecto.
2. Cada muralla de esa línea aporta **+1 de defensa** adicional contra ataque de arco.
3. Elegir una opción inmediata: **curación 2** o **oro 2**; carta con muralla.
4. Al final de ronda: **+2 espada en cada línea exterior**; carta con muralla.
5. Al activarse: descartar **hasta tres** cartas de mano y robar **tres** del mazo (transcripción literal de lámina; el tratamiento de menos de tres descartadas requiere precisión).
6. Al final de ronda: **+1 espada en cada línea**.
7. Elegir opción inmediata: **curación 1**, **catapulta 1** u **oro 1**; carta con muralla.
8. Al final de ronda: **+1 espada en cada línea exterior**.

Estas descripciones deben modelarse como habilidades configurables y con selección de alternativas cuando corresponda. **No se deduce** que una carta de báculo visible siempre se active inmediatamente: unas habilidades son continuas, otras se disparan al encadenar y otras en cierre de ronda.

## E. Decisiones de arquitectura derivadas (propuestas técnicas, NO reglas inventadas)

- Representar una carta mediante **caras superior/inferior** más **propiedades independientes** (p. ej., `hasWall`), y efectos con momentos `ON_PLAY`, `WHILE_VISIBLE`, `END_ROUND`.
- Procesar habilidades por **eventos**, como `ELEMENT_ACTIVATED`, `GOLD_ACTIVATED`, `CATAPULT_ACTIVATED` y `ROUND_END`.
- Preservar fuente de cada daño y evento para verificar combos.
- Añadir pruebas por cada caso A, B y C cuando la geometría de tapado pueda representarse adecuadamente.
- Mantener los ejemplos visuales como **fixtures de aceptación** y texto de referencia antes de codificar.

## F. Dudas que permanecen abiertas

1. **Geometría de destapado**: el ejemplo B enseña destrucción de la **última** carta, pero no demuestra eliminar una carta interior ni recuperar sus dos lados sin reposicionar físicamente cartas. Sigue pendiente un ejemplo interior o confirmación de que solo pueden destruirse cartas finales.
2. **Muralla independiente**: confirmar si una muralla impresa en una carta sigue defendiendo siempre que la carta exista o si puede quedar tapada por otra, y en qué condiciones.
3. **Báculo de prohibición de oro**: si impide colocar una carta con oro aunque el elemento oro vaya a quedar cubierto, o solo si se activaría al encadenarla.
4. **Báculo de robar 3**: aclarar si se roban exactamente 3 aun descartando menos y qué ocurre con mazo insuficiente.
5. **Báculo +1 cada línea / laterales**: confirmar si se aplica una única vez por carta al cierre, sin importar dónde esté colocada.
6. **Daños pasados**: los ataques inmediatos ya aplicados no se revierten al tapar o destruir su fuente (compatible con regla previa, pero aquí no se ilustra reversión).
