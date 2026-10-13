# Tierras de Nadie — Game Engine Spec

> Estado: arquitectura inicial para MVP web.  
> Objetivo principal: construir un motor de reglas determinista e independiente de la interfaz, preparado para ser reimplementado posteriormente en Godot.

## 1. Decisión arquitectónica

La primera versión será una aplicación web.

Stack propuesto:
- TypeScript;
- React para la interfaz;
- Vite para build/dev;
- Vitest para tests;
- CSS normal o CSS Modules inicialmente;
- sin backend en el primer vertical slice;
- sin multijugador online inicialmente.

El motor de juego NO dependerá de React, DOM, navegador, animaciones ni almacenamiento local.

La UI consumirá al motor como una librería.

## 2. Objetivo de portabilidad

El futuro port a Godot no debe depender de traducir componentes React.

Lo que debe sobrevivir al port es:

1. reglas documentadas;
2. modelo de datos;
3. catálogo de cartas/héroes;
4. contratos de acciones;
5. casos de test;
6. secuencia de eventos;
7. estados válidos del juego.

La implementación TypeScript será una referencia ejecutable de esas reglas.

## 3. Capas

```text
src/
├── domain/
│   ├── game/
│   ├── cards/
│   ├── heroes/
│   ├── market/
│   ├── combat/
│   └── rules/
├── application/
│   ├── commands/
│   ├── queries/
│   └── game-controller/
├── data/
│   ├── cards/
│   └── heroes/
├── ui/
│   ├── components/
│   ├── screens/
│   └── adapters/
└── main.tsx
```

### domain
Contiene reglas puras. No importa React. No accede a APIs web. No tiene side effects.

### application
Orquesta acciones del usuario:
- iniciar partida;
- jugar carta;
- elegir héroe;
- usar Mercado;
- finalizar turno;
- avanzar ronda.

### data
Define contenido declarativo:
- cartas;
- héroes;
- costes;
- efectos configurables.

### ui
Renderiza el estado y traduce interacciones del usuario en comandos.

## 4. Estado principal

```ts
type GameState = {
  phase: GamePhase;
  round: number;
  currentPlayerId: PlayerId;
  players: Record<PlayerId, PlayerState>;
  deck: CardId[];
  discardPile: CardId[];
  terrainLines: [TerrainLineState, TerrainLineState, TerrainLineState];
  pendingEvents: GameEvent[];
};
```

## 5. Jugador

```ts
type PlayerState = {
  id: PlayerId;
  damageReceived: number;
  gold: number;
  hand: CardId[];
  offeredHeroes: HeroId[];
  activeHeroes: HeroId[];
  playedCardsThisRound: number;
  extraCardsPurchased: number;
};
```

## 6. Línea de terreno

No conviene guardar únicamente totales calculados porque una catapulta elimina cartas y puede obligar a recalcular efectos persistentes.

```ts
type TerrainLineState = {
  chains: Record<PlayerId, CardInstance[]>;
};
```

Los agregados como espadas, escudos y murallas deben calcularse desde el estado de cartas cuando sea posible.

## 7. Carta

Separar definición estática de instancia.

```ts
type CardDefinition = {
  id: CardId;
  name: string;
  topElement: ElementType;
  bottomElement: ElementType;
  effects: EffectDefinition[];
};
```

```ts
type CardInstance = {
  instanceId: string;
  cardId: CardId;
  ownerId: PlayerId;
  playedAt: number;
};
```

## 8. Acciones del juego

Las acciones deben ser objetos serializables.

```ts
type GameAction =
  | PlayCardAction
  | SelectHeroesAction
  | UseMarketAction
  | EndTurnAction;
```

Ejemplo:

```ts
type PlayCardAction = {
  type: "PLAY_CARD";
  playerId: PlayerId;
  cardInstanceId: string;
  terrainIndex: 0 | 1 | 2;
  placement: "TOP" | "BOTTOM";
};
```

## 9. Flujo de una acción

```text
Action
  ↓
Validate
  ↓
Apply state change
  ↓
Emit events
  ↓
Resolve immediate effects
  ↓
Produce new GameState
```

Nunca debe modificarse el estado directamente desde la UI.

## 10. Eventos

```text
CARD_PLAYED
CARD_CHAINED
ARCHERY_TRIGGERED
GOLD_GAINED
HEAL_TRIGGERED
CATAPULT_TRIGGERED
CARD_DESTROYED
MARKET_ACTION_USED
TURN_ENDED
ROUND_ENDED
SWORD_DAMAGE_RESOLVED
```

## 11. Encadenamiento

Debe existir una función pura central:

```ts
canChain(
  newCard,
  targetCard,
  placement
): boolean
```

Antes de implementar se escribirán tests de ejemplos válidos e inválidos para evitar ambigüedad semántica.

## 12. Resolución inmediata

Al producirse `CARD_CHAINED`, el motor resuelve:
- arquería;
- oro;
- curación;
- catapulta.

Muralla permanece como efecto pasivo.

Espada/escudo esperan a fin de ronda.

## 13. Resolución de ronda

```text
finishRound()
    ↓
resolveTerrain(0)
    ↓
resolveTerrain(1)
    ↓
resolveTerrain(2)
    ↓
applyDamage()
    ↓
checkRoundNumber()
```

Por cada línea:

```text
damageToB = max(0, swordsA - shieldsB)
damageToA = max(0, swordsB - shieldsA)
```

Ambos resultados deben calcularse contra el mismo snapshot de fin de ronda antes de aplicar daño.

## 14. Determinismo

Misma entrada + mismo estado + mismo seed = mismo resultado.

Toda aleatoriedad debe pasar por una abstracción:

```ts
interface RandomSource {
  shuffle<T>(items: readonly T[]): T[];
}
```

Esto permite:
- tests reproducibles;
- replays futuros;
- debug;
- eventualmente multijugador sincronizado.

## 15. Datos declarativos

Preferir definiciones de datos sobre clases específicas por carta.

Cuando un efecto no pueda expresarse declarativamente, podrá utilizar un handler especializado.

## 16. UI web

Para el MVP:

```text
GameScreen
├── OpponentArea
├── TerrainBoard
│   ├── TerrainLine x3
│   ├── PlayerChains
│   └── OpponentChains
├── PlayerHand
├── PlayerStatus
├── OpponentStatus
└── ActionPanel
```

Primera interacción recomendada:
1. click carta;
2. click línea;
3. elegir TOP/BOTTOM si ambas son legales;
4. confirmar.

No se requiere drag-and-drop en esta primera etapa.

## 17. Tests mínimos obligatorios

- encadenamiento válido;
- encadenamiento inválido;
- alternancia de turno;
- máximo normal de cartas jugadas;
- arquería sin muralla;
- arquería con muralla;
- curación sin bajar daño de 0;
- acumulación de oro;
- catapulta sobre última carta rival;
- espada vs escudo en cada línea;
- tres líneas independientes;
- transición de ronda;
- mezcla/reparto nuevo;
- selección de héroes;
- ganador tras ronda 3;
- empate y transición a desempate.

## 18. Persistencia

No se requiere para el primer vertical slice.

Más adelante podrá serializarse `GameState` como JSON para:
- guardar partida;
- reanudar;
- replay;
- debugging.

## 19. Backend y online

Fuera de alcance inicial.

Cuando llegue el multijugador online, el motor ya debe ser capaz de recibir acciones serializables. Eso facilitará mover la autoridad de la partida a un servidor.

## 20. Godot futuro

El port recomendado será:
- conservar archivos de reglas/datos en JSON;
- reimplementar GameState y reducers/handlers en GDScript o C#;
- portar los tests de comportamiento;
- reconstruir UI/animaciones en Godot;
- comparar resultados de escenarios entre motor TypeScript y motor Godot.

La prioridad actual no es compartir código binario entre web y Godot, sino compartir **modelo, datos, contratos y comportamiento**.
