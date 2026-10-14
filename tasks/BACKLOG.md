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
