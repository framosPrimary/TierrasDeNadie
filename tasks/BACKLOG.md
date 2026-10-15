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
