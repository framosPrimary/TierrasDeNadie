import type { CardDefinition } from "../types";
import type { CardInstance, GameState } from "./state";
import { createGame } from "./state";

/** No Math.random inside reducers: caller injects shuffle for reproducibility. */
export function shuffled<T>(items: readonly T[], random: () => number = Math.random): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
export function startMatch(cards: readonly CardDefinition[], random: () => number = Math.random): GameState {
  if (cards.length !== 50) throw new Error("La partida requiere 50 cartas del mazo compartido");
  const instances: CardInstance[] = cards.map((definition, i) => ({ instanceId: "C" + i, definition }));
  const deal = shuffled(instances, random);
  return {
    ...createGame(deal.slice(0, 10), deal.slice(10, 20)),
    deck: deal.slice(20),
    log: ["Ronda 1: 10 cartas repartidas por jugador"],
  };
}
/** Cards on board and discarded cards return to the shared deck between rounds. */
export function nextRound(state: GameState, random: () => number = Math.random): GameState {
  if (state.phase !== "ROUND_FINISHED") throw new Error("La ronda actual no terminó");
  const count = state.round >= 3 ? 5 : 10;
  const all = [
    ...state.deck, ...state.discard,
    ...state.players.P1.hand, ...state.players.P2.hand,
    ...(state.players.P1.extraCards ?? []), ...(state.players.P2.extraCards ?? []),
    ...state.terrains.flatMap(t => [...t.P1, ...t.P2]),
  ].map(({ instanceId, definition }) => ({ instanceId, definition }));
  if (all.length !== 50 || new Set(all.map(c => c.instanceId)).size !== 50)
    throw new Error("Mazo inconsistente: deben existir 50 instancias únicas");
  const deal = shuffled(all, random);
  return {
    ...state,
    round: state.round + 1,
    phase: "PLAYING",
    roundCombatResolved: false,
    winner: null,
    currentPlayer: "P1",
    deck: deal.slice(count * 2),
    discard: [],
    terrains: [{ P1: [], P2: [] }, { P1: [], P2: [] }, { P1: [], P2: [] }],
    players: {
      P1: { ...state.players.P1, hand: deal.slice(0, count), played: 0, gold: 0, marketOpen: false, extraCards: [], hero: undefined },
      P2: { ...state.players.P2, hand: deal.slice(count, count * 2), played: 0, gold: 0 },
    },
    log: [...state.log, `Ronda ${state.round + 1}: ${count} cartas repartidas por jugador`],
  };
}
