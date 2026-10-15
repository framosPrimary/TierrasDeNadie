import { resolveCombat } from "./combat";
import type { GameState } from "./state";

/** Resolves ordinary ten-card round once; reset/redeal is a separate future phase. */
export function finishRound(state: GameState): GameState {
  if (state.roundCombatResolved) throw new Error("La ronda ya fue resuelta");
  if (state.players.P1.played !== 10 || state.players.P2.played !== 10)
    throw new Error("Ambos jugadores deben completar sus 10 cartas");
  const damage = resolveCombat(state);
  return {
    ...state,
    roundCombatResolved: true,
    players: {
      P1: { ...state.players.P1, damageReceived: state.players.P1.damageReceived + damage.total.toP1 },
      P2: { ...state.players.P2, damageReceived: state.players.P2.damageReceived + damage.total.toP2 },
    },
    log: [...state.log, `Fin de ronda: P1 recibe ${damage.total.toP1}; P2 recibe ${damage.total.toP2}`],
  };
}
