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
- Pendiente ejecutar tests y build en CI; no se afirma validación exitosa.
