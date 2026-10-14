# Tierras de Nadie

Proyecto de videojuego basado en el juego de cartas **Tierras de Nadie**.

## Objetivo actual
Construir un prototipo web minimalista que permita validar las reglas y el flujo completo de una partida 1 vs 1 antes de portar el juego a Godot.

## Destino previsto
- Web: entorno de pruebas.
- Steam: objetivo de producción de escritorio.
- Android: objetivo de producción móvil prioritario.
- iOS: etapa posterior.

## Arquitectura
La lógica de juego debe permanecer desacoplada de React y del navegador. El motor de reglas se implementa como dominio TypeScript puro.

## Fuentes
- `specs/RULES.md`: índice normativo.
- `docs/game-design/RULES.md`: reglas confirmadas y pendientes.
- `docs/architecture/GAME_ENGINE_SPEC.md`: arquitectura.
- `docs/development/MVP_SCOPE.md`: alcance del MVP.
