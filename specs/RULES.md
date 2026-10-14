# Rules Index

Este archivo es el índice normativo de reglas para desarrollo.

## Fuente principal
Leer `docs/game-design/RULES.md`.

## Regla de trabajo
No inventar reglas, balance, héroes ni cartas. Si una implementación necesita una decisión no documentada, registrar el bloqueo en `tasks/BACKLOG.md`.

## Reglas confirmadas necesarias para M1

### Terrenos
Existen exactamente 3 líneas.

### Turnos
Los jugadores alternan turnos y juegan exactamente 1 carta por turno.

### Encadenamiento
Una carta posee un elemento superior y uno inferior.

- Al colocar **por encima**, el elemento inferior de la nueva carta debe coincidir con el elemento superior de la carta que está arriba.
- Al colocar **por debajo**, el elemento superior de la nueva carta debe coincidir con el elemento inferior de la carta que está abajo.
- Una cadena vacía acepta la primera carta.

## Pendientes abiertos
Ver los identificadores `OPEN-RULE-*` en `docs/game-design/RULES.md`.
