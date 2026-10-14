# Backlog

## M0 — Harness
- [x] Proyecto React + TypeScript + Vite definido.
- [x] Script de build definido.
- [x] Script de typecheck definido.
- [x] Vitest configurado.
- [x] CI configurada para instalar, typecheck, test y build.
- [ ] CI ejecutada con éxito en GitHub.
- [ ] Deploy automatizado al servidor Linux.

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
- [ ] Timing exacto del Mercado.
- [ ] Compra múltiple de cartas extra.
- [ ] Contratación de catapulta en Mercado.
- [ ] Destrucción de cartas con efectos previos/pasivos.
- [ ] Reglas exactas de desempate respecto de héroes y Mercado.

## Avance M1 (implementación inicial)
- [x] GameState y tres TerrainLine.
- [x] Acción PLAY_CARD.
- [x] Validación de turno y carta en mano.
- [x] Inserción TOP/BOTTOM.
- [x] Contador de cartas jugadas.
- [x] Primera UI local con cartas de prueba.
- [ ] Verificar build/tests en CI y corregir fallos.
- [ ] Completar estados de ronda y turnos sin cartas legales.
