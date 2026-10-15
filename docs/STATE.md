# Estado del proyecto

## Estado actual
**Fase:** M0 Harness / inicio de M1 Domain Core.

## Decisiones confirmadas
- Primera implementación: web.
- Stack: React + TypeScript + Vite.
- Tests: Vitest.
- Sin backend ni login para el primer vertical slice.
- UI minimalista y sin drag-and-drop inicialmente.
- Motor de reglas desacoplado de React.
- Futuro port a Godot.
- Producción prevista: Steam y Android primero.
- Prototipo desplegable en servidor Linux propio.

## Implementado en esta rama
- scaffold Vite/React;
- configuración TypeScript;
- CI básica;
- modelo mínimo de carta y jugador;
- validación pura de encadenamiento TOP/BOTTOM;
- alternancia de turno;
- tests unitarios.

## Siguiente acción
Completar M1 con GameState, tres líneas de terreno y acción `PLAY_CARD` validada.

## Actualización M1
- GameState con dos jugadores y tres terrenos.
- PLAY_CARD puro con validación de turno, mano, encadenamiento y límite.
- UI de prueba local 1 vs 1 con cartas dummy, selección, colocación y registro de jugadas.
- Tests añadidos para PLAY_CARD.
- CI verificada exitosa: GitHub Actions run 38488860420 (typecheck, test y build).

## Decisiones del Director Creativo (14/10/2026)
- Mercado habilitado cada vez que se activa una carta de oro.
- Carta extra cuesta 3 de oro.
- Catapulta contratada en Mercado cuesta 3 de oro y destruye inmediatamente la última carta de la línea enemiga elegida.
- Toda carta destruida va al descarte.
- Pendiente detallar compras múltiples, orden de cartas extra y efectos pasivos tras destrucción.

## Despliegue
- DigitalOcean se configura manualmente por el propietario, guiado paso a paso como laboratorio DevOps.
- No se automatiza el despliegue en esta fase.

## Relevamiento de reglas (15/10/2026) — incorporado a RULES v0.5
- Encadenar **nunca** exige símbolos iguales; superposición decide componentes habilitados/tapados.
- Componentes tapados no cuentan; carta con ambos tapados queda desactivada hasta destaparse o fin de ronda.
- Oro, catapulta, curación y báculo se activan una vez; no se reactivan al destaparse.
- Arquería combina valores de arcos visibles por línea al encadenarse otro arco.
- Espadas/escudos visibles se resuelven por línea al fin de ronda, con modificadores de héroes/báculos.
- Se reparten 10 cartas **antes** del mulligan de 4 héroes; se eligen 2 y un inicial, revelado simultáneamente con el rival.
- Enroque único con suplente; al llegar a 3 cartas o menos en mano queda suspendido irrevocablemente esa ronda, aun si compra cartas.
- Objetivo actualizado: duelo 1v1 online por invitación sin cuenta obligatoria; cuentas opcionales más adelante. Estado autoritativo en servidor.
- **Deuda técnica:** `canChain()` y `playCard()` actualmente rechazan superposiciones sin símbolos coincidentes; corregir motor y tests antes de implementar combate.

## Primer despliegue web — realizado (15/10/2026)
- Prototipo React/Vite desplegado manualmente en DigitalOcean Ubuntu 24.04.4 LTS mediante Nginx; acceso web confirmado por propietario.
- SSH desde Termux con usuario `fede`; UFW permite HTTP 80 conservando SSH 22 y puerto 8080 de prácticas previas.
- Node 24 por NVM, build correcta y 11 tests en verde en el servidor.
- Documentación paso a paso y próximos cuidados: `docs/operations/DEPLOYMENT.md`.
- DevOps en **stand by**; prioridad: motor y partida completa 1v1.

## Etapa 1 — superposición (trabajo iniciado 15/10/2026)
- `canChain()` ya no requiere que símbolos de cartas coincidan.
- Agregado `overlay.ts`: estado de tapado y activación por componente, posibilidad de elegir si tapa la nueva o la anterior, y consulta de elementos visibles.
- `playCard` invoca overlay; UI minimalista incorpora orden de superposición y muestra un indicador para componentes tapados.
- Nuevos tests de superposición y corrección de tests antiguos.
- **IMPORTANTE:** no se ha verificado aún CI para el último commit. Los efectos se registran pero **no se ejecutan todavía**. El modelo de geometría es provisional y sujeto a validación con el director.

## Avance de desarrollo — etapas 1 y 2 (15/10/2026)
- Superposición con tapado por componente ya conectada al flujo PLAY_CARD y UI de prueba.
- Corregidas expectativas de dos tests históricos que contradecían su descripción.
- Agregado `src/domain/game/combat.ts`: cómputo puro de espadas/escudos visibles y defensa por línea; resultados para ambos jugadores a partir de snapshot.
- Definiciones de cartas admiten valores explícitos `values` para los componentes. Cartas dummy sin valores se computan como cero deliberadamente.
- Nuevos tests iniciales de cálculo; **CI del último commit pendiente de confirmar**.
- Este cálculo aún **no se aplica a un contador de daño** ni dispara efectos: no es partida completa.
- Pendientes: arquería, oro, curación, catapultas, báculos, efectos de héroes, final de ronda y sincronización online.

## Gameplay: efectos inmediatos y resolución de ronda (15/10/2026)
- Estado guarda oro, daño recibido, descarte y bandera de combate de ronda resuelto.
- `immediate.ts` aplica oro y curación al jugar; arquería combina valores visibles de la línea y enfrenta murallas; catapulta elimina última carta rival de la misma línea enviándola al descarte.
- `playCard` conecta disparadores de superposición con efectos; `finishRound` aplica combate tras 10 cartas por jugador e impide duplicarlo.
- Se incorporaron tests de oro, curación y fin de ronda.
- **No confirmado aún CI verde de estos commits.** Sigue siendo una implementación parcial: no hay transición automática entre rondas, catálogo real, Mercado interactivo, selección de blancos de Mercado, héroes ni red.
- Geometría exacta de tapado/destapado y cálculo fino del combo de arquería deben contrastarse con juego físico antes de afirmar fidelidad total.
