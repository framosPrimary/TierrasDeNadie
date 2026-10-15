import type { PlayerId } from "../types";
import type { ActiveFace } from "./overlay";
import { visibleElements } from "./overlay";
import { componentValue, lineScore } from "./combat";
import type { CardInstance, GameState } from "./state";

const rivalOf = (id: PlayerId): PlayerId => id === "P1" ? "P2" : "P1";

export function resolveImmediate(
  state: GameState,
  playerId: PlayerId,
  terrainIndex: 0 | 1 | 2,
  triggers: readonly ActiveFace[],
): GameState {
  const rivalId = rivalOf(playerId);
  const players = {
    P1: { ...state.players.P1 },
    P2: { ...state.players.P2 },
  };
  const terrains = state.terrains.map(line => ({ ...line })) as GameState["terrains"];
  const discard = [...state.discard];
  const log = [...state.log];
  for (const trigger of triggers) {
    const ownChain = terrains[terrainIndex][playerId];
    const card = ownChain.find(c => c.instanceId === trigger.instanceId);
    if (!card) continue;
    const value = componentValue(card, trigger.element);
    switch (trigger.element) {
      case "GOLD":
        players[playerId].gold += value;
        log.push(`${playerId}: +${value} oro; oportunidad de Mercado (interfaz pendiente)`);
        break;
      case "HEAL":
        players[playerId].damageReceived = Math.max(0, players[playerId].damageReceived - value);
        log.push(`${playerId}: cura ${value}`);
        break;
      case "CATAPULT": {
        const enemy = terrains[terrainIndex][rivalId];
        if (enemy.length > 0) {
          const removed: CardInstance = enemy[enemy.length - 1];
          terrains[terrainIndex] = { ...terrains[terrainIndex], [rivalId]: enemy.slice(0, -1) };
          discard.push(removed);
          log.push(`${playerId}: catapulta destruye ${removed.instanceId}`);
        }
        break;
      }
      case "ARCHERY": {
        // A new arc combines with every other currently visible arc in this lane.
        const total = visibleElements(ownChain).filter(face => face.element === "ARCHERY")
          .reduce((sum, face) => {
            const source = ownChain.find(c => c.instanceId === face.instanceId);
            return sum + (source ? componentValue(source, "ARCHERY") : 0);
          }, 0);
        const walls = lineScore(terrains[terrainIndex][rivalId]).walls;
        const damage = Math.max(0, total - walls);
        players[rivalId].damageReceived += damage;
        log.push(`${playerId}: arquería ${total} - murallas ${walls} = ${damage}`);
        break;
      }
    }
  }
  return { ...state, players, terrains, discard, log };
}
