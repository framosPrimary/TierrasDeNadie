# Backlog

## M0 — Harness
- [x] Proyecto React + TypeScript + Vite definido.
- [x] Script de build definido.
- [x] Script de typecheck definido.
- [x] Vitest configurado.
- [x] CI configurada para instalar, typecheck, test y build.
- [x] CI ejecutada con éxito en GitHub (run 38488860420).
- [ ] Despliegue manual guiado en DigitalOcean (práctica DevOps).

## M1 — Domain Core
- [x] Tipos base de carta, jugador y posición.
- [x] Regla pura de encadenamiento.
- [x] Tests TOP/BOTTOM válidos e inválidos.
- [x] Alternancia P1/P2.
- [x] Test de alternancia.
- [ ] GameState.
- [ ] Tres TerrainLine.
- [ ] Acción PLAY_CARD.
- [ ] Validación de turno.
- [ ] Validación de carta en mano.
- [ ] Inserción TOP/BOTTOM en cadena.
- [ ] Contador de cartas jugadas.

## Bloqueos de diseño
- [x] Timing del Mercado: cada activación de carta de oro.
- [ ] Compra múltiple de cartas extra.
- [x] Contratación de catapulta: 3 oro, efecto inmediato, elegir línea enemiga y destruir última carta.
- [x] Destino de carta destruida: descarte.
- [ ] Recalcular pasivos / permanencia de efectos inmediatos tras destrucción.
- [ ] Límite de compras por activación de oro.
- [ ] Reglas exactas de desempate respecto de héroes y Mercado.

## Avance M1 (implementación inicial)
- [x] GameState y tres TerrainLine.
- [x] Acción PLAY_CARD.
- [x] Validación de turno y carta en mano.
- [x] Inserción TOP/BOTTOM.
- [x] Contador de cartas jugadas.
- [x] Primera UI local con cartas de prueba.
- [x] Verificar build/tests en CI y corregir fallos (run 38488860420).
- [ ] Completar estados de ronda y turnos sin cartas legales.

## Nuevas prioridades — relevamiento 15/10/2026
- [ ] **P0** Eliminar restricción de igualdad de símbolos en `canChain()` / `playCard()` y modelar superposición y visibilidad por componente, con tests.
- [ ] Separar activación única consumida de vigencia/visibilidad del elemento.
- [ ] Implementar combo de arquería en una misma línea usando arcos vigentes.
- [ ] Resolver espadas/escudos visibles y modificadores por línea al cierre.
- [ ] Implementar fases: repartir 10 → ofrecer 4 héroes → elegir 2 → elegir inicial → revelación simultánea.
- [ ] Enroque de héroes una vez por ronda; bloqueo permanente si mano <=3.
- [ ] Diseñar estado autoritativo de sala online 1v1, jugadores invitados y privacidad de manos.
- [ ] Relevar superposición exacta, arco destapado, compra múltiple y catálogo de héroes/báculos.

## DevOps / Operaciones (en pausa tras primer despliegue)
- [x] Primer deploy manual en DigitalOcean + Nginx, acceso público verificado.
- [x] Registrar procedimiento, diagnóstico y comandos en `docs/operations/DEPLOYMENT.md`.
- [ ] Agregar lockfile a Git y usar `npm ci`.
- [ ] Implementar actualización por releases y rollback probado.
- [ ] HTTPS/dominio, seguridad operacional.
- [ ] Automatizar CD cuando el gameplay esté más maduro.

## Etapa 1 — estado de implementación
- [x] Eliminar coincidencia obligatoria de símbolos y adaptar tests.
- [x] Crear modelo provisional de componentes tapados y activaciones consumidas.
- [x] Conectar colocación y UI con elección de orden de superposición.
- [ ] Verificar `typecheck`, tests y build de la última rama en CI.
- [ ] Validar geometría de superposición/destapado con ejemplos visuales del director.
- [ ] Implementar efectos reales en motor (no solo eventos/log).
- [ ] Determinar interacción de arquería visible y activación de nuevos arcos, con tests.

## Desarrollo etapas 1–2 — progreso
- [x] Corrección de tests antiguos del encadenamiento y del turno.
- [x] `combat.ts` calcula daño espada-escudo por línea según componentes visibles.
- [x] Soporte para valores numéricos declarativos de componentes.
- [x] Tests iniciales de combate y componentes tapados.
- [ ] Comprobar CI del commit más reciente y corregir fallos de existir.
- [ ] Integrar resultados de combate al ciclo de fin de ronda y contador de daño.
- [ ] Ejecutar oro/curación/arquería/catapulta al encadenar según reglas.
- [ ] Resolver geometría real de superposición, especialmente tapados de ambos lados y destapados.

## Gameplay — siguiente integración
- [x] Implementar contadores de oro/daño y descarte en estado.
- [x] Ejecutar primeros efectos inmediatos al jugar (oro, curación, arquería y catapulta de carta).
- [x] Agregar cierre explícito de ronda con cálculo de daño una sola vez.
- [ ] Verificar y corregir CI de último commit antes del deploy.
- [ ] Integrar control de fases/reparto/reinicio y desempate.
- [ ] Definir contratación de catapulta en Mercado con elección de línea.
- [ ] Implementar interacción de Mercado habilitada por oro.
- [ ] Resolver casos de arquería con varias activaciones y destapado; testear contra director.

## Cierre de ciclo local / preparación previa al deploy
- [x] Repartir 10 cartas de mazo de 50, rondas 1–3 y daño acumulado.
- [x] Resolver fin de ronda, reiniciar cadenas y remezclar mazo único.
- [x] Determinar ganador después de ronda 3 y reparto de 5 por jugador ante empate.
- [x] Mostrar controles básicos de rondas y marcador en UI de prueba.
- [x] Tests iniciales del ciclo de partida.
- [ ] Ejecutar typecheck, Vitest y build con CI/entorno clonado antes del deploy.
- [ ] Evitar desplegar como partida reglamentaria completa: falta Mercado, compras extra, héroes, geometría definitiva y reglas de segundo empate.
- [ ] Validar primera ronda/5 cartas/robo/selección de héroes, orden de cartas extra y fin de ronda con el Director Creativo.

## Mercado y héroes (implementación parcial)
- [x] Modelo opt-in de oferta de cuatro, elección oculta de dos, revelación conjunta del titular.
- [x] Enroque único y suspensión persistente del suplente con mano <= 3.
- [x] Ventana de Mercado disparada por oro y bloqueo del turno siguiente hasta cerrarla.
- [x] Curación por 2 oro; catapulta de Mercado por 3 oro en línea enemiga elegida.
- [x] Controles básicos de curación/catapulta/cierre en UI local.
- [ ] Catálogo real de héroes y aplicación de habilidades.
- [ ] Pantalla completa de oferta, selección y revelación de héroes.
- [ ] Mercado: descartar 1/robar 1, tomar 2 al rival y elegir 1, comprar cartas extra, reglas de compra múltiple.
- [ ] Asegurar orden de juego para cartas extra al cierre de ronda.
- [ ] Verificar typecheck, test y build en CI; no desplegar antes.

## Mercado — acciones agregadas, cierre pendiente
- [x] Implementar cinco acciones de compra con costes y cambios de estado.
- [x] Pruebas unitarias para intercambio, elección rival y compra de extra.
- [x] Proteger fin de ronda si queda carta extra reservada sin resolver.
- [ ] **Bloqueo reglas:** fijar cantidad de compras en cada activación y persistencia de oro.
- [ ] **Bloqueo reglas:** fijar orden, prioridad y repetibilidad de las cartas extra de final de ronda.
- [ ] Conectar acción de carta extra a tablero cuando se confirme el orden.
- [ ] Evitar exposición de mano rival en modo online; definir selección privada/aleatoria de dos cartas rivales.
- [ ] Confirmar CI/typecheck/tests/build con ejecución real; luego despliegue manual a DigitalOcean.

## Próximo corte: v0.7 Alpha de partida local — plan aprobado 22/10/2026
Documento fuente de alcance y criterios: `docs/development/ROADMAP_NEXT_VERSION.md`.
- [ ] H0: corregir baseline CI (typecheck, tests, build) y cerrar contradicciones documentales.
- [ ] H1: primer encadenamiento bajo terreno, tapados, efectos persistentes y catapultas sin reacomodo.
- [ ] H2: Mercado repetible, intercambio 2↔2, compra/jugada inmediata de extras, mazo sin reciclaje.
- [ ] H3: tres rondas, desempate, iniciativa, secretos y selección/enroque de héroes.
- [ ] H4: partida completa local verificable, revisión de dudas con el Profe, aprobación y CI verde.
- [ ] Actualizar `docs/game-design/DECISIONS_AND_BLOCKERS.md` al encontrar nuevos casos.
- [ ] No iniciar deploy sin versión aprobada; despliegue manual posterior con usuario operador.
- [ ] Corregir deuda técnica histórica: código que reserva cartas extras para el final y Mercado que devuelve una sola carta no refleja la especificación actual.
