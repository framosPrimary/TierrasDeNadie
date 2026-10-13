# Tierras de Nadie — MVP Scope

> Objetivo: obtener una partida web jugable de principio a fin con el mínimo contenido necesario para validar el motor.

## 1. Definición de MVP

El MVP debe validar:
- reglas;
- flujo;
- arquitectura;
- legibilidad del tablero;
- posibilidad de añadir cartas y héroes sin reescribir el motor.

La primera versión se ejecutará como web estática y no requerirá login.

Debe incluir dos formas de prueba:

1. **1 vs 1 local** en el mismo navegador para validar el duelo real.
2. **Jugador vs bot básico** para que una sola persona pueda recorrer una partida completa sin depender de otro jugador.

El bot del MVP no es una IA estratégica: solo debe elegir jugadas legales de forma determinista o pseudoaleatoria.

## 2. Incluido en MVP

### Partida

- 2 jugadores lógicos.
- 3 terrenos.
- 3 rondas.
- desempate a 5 cartas.
- contador de daño recibido.
- alternancia de turnos.
- modo 1 vs 1 local.
- modo jugador vs bot básico.

### Cartas

No son necesarias inicialmente las 50 cartas finales.

Crear un set de prueba que cubra:
- espada;
- escudo;
- arquería;
- muralla;
- oro;
- curación;
- catapulta;
- distintas combinaciones superior/inferior.

Objetivo recomendado: 12 a 16 definiciones dummy, duplicadas según sea necesario.

### Encadenamiento

- TOP;
- BOTTOM;
- validación visual de posiciones posibles;
- rechazo de jugadas inválidas.

### Efectos

- espada;
- escudo;
- arquería;
- muralla;
- oro;
- curación;
- catapulta.

### Héroes

Primera implementación:
- infraestructura completa;
- 2 a 4 héroes dummy sencillos.

### Mercado

Implementar las cinco acciones cuando se resuelvan las reglas abiertas que las afectan.

### Fin de ronda y partida

- cálculo por cada línea;
- daño simultáneo;
- limpieza;
- reshuffle;
- nueva mano;
- nuevo mulligan de héroes;
- comparación de daño;
- ganador;
- empate;
- ronda de desempate.

## 3. Fuera del MVP

- IA estratégica;
- matchmaking;
- backend;
- cuentas;
- login;
- ranking;
- multijugador online;
- chat;
- espectador;
- reconexión;
- monetización;
- Android/iOS;
- Godot;
- animaciones complejas;
- partículas;
- audio final;
- arte final;
- tutorial interactivo;
- deck building;
- editor de cartas.

## 4. Interfaz mínima

Debe mostrar:
- 3 líneas;
- cartas del rival;
- cartas propias;
- mano;
- oro;
- daño recibido;
- héroes activos;
- ronda;
- jugador activo;
- feedback de jugada válida/inválida;
- log básico de eventos.

La interacción inicial será:

```text
Seleccionar carta
    ↓
Seleccionar línea
    ↓
Seleccionar TOP o BOTTOM
    ↓
Confirmar
```

No se requiere drag-and-drop en esta etapa.

## 5. Fases

### M0 — Harness
- repo ejecuta;
- lint;
- tests;
- build;
- estructura;
- documentación;
- CI.

### M1 — Domain core
- GameState;
- Player;
- Card;
- TerrainLine;
- turnos;
- encadenamiento;
- tests.

### M2 — Combat core
- espada;
- escudo;
- arquería;
- muralla;
- oro;
- curación;
- catapulta;
- fin de ronda.

### M3 — Game lifecycle
- 3 rondas;
- reshuffle;
- nuevas manos;
- héroes;
- puntuación;
- desempate.

### M4 — Web UI
- tablero;
- mano;
- selección;
- estados;
- historial;
- resultado.

### M5 — Bot de pruebas
- consultar acciones legales;
- elegir una acción válida;
- ejecutar turno automáticamente;
- sin estrategia avanzada.

### M6 — Mercado y héroes reales
- cerrar reglas abiertas;
- Mercado completo;
- catálogo inicial de héroes;
- tests.

### M7 — Content pass
- cargar 50 cartas reales;
- cargar héroes finales;
- balance;
- QA.

## 6. Definition of Done del vertical slice

1. una partida puede iniciarse desde cero;
2. se reparten manos correctamente;
3. se eligen héroes;
4. se juegan cartas solo en posiciones legales;
5. funcionan los efectos básicos;
6. las tres líneas son independientes;
7. el final de ronda produce daño correcto;
8. se juegan 3 rondas;
9. se determina correctamente el ganador;
10. un empate crea la ronda de 5 cartas;
11. todos los casos anteriores tienen tests;
12. la UI no contiene reglas de negocio;
13. una persona puede completar una partida contra el bot básico;
14. dos personas pueden completar una partida local.

## 7. Despliegue inicial

La build web debe poder desplegarse como sitio estático.

Destino inicial recomendado: **GitHub Pages**.

Así el primer prototipo puede abrirse desde una URL sin instalar nada y sin requerir backend.

## 8. Próximas entradas del Director Creativo

- momento exacto de uso del Mercado;
- reglas de compra múltiple de cartas extra;
- comportamiento exacto de la catapulta contratada;
- comportamiento al destruir cartas con efectos previos/pasivos.

Después:
- catálogo de las 50 cartas;
- catálogo de héroes;
- nombres/textos definitivos;
- iconografía/arte.
