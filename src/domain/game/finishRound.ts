import { resolveCombat } from "./combat";
import type { GameState } from "./state";

export function finishRound(state: GameState): GameState {
  if (state.phase !== "PLAYING" || state.roundCombatResolved) throw new Error("Ronda ya resuelta");
  const target = state.round >= 4 ? 5 : 10;
  if (state.players.P1.played !== target || state.players.P2.played !== target)
    throw new Error("Ambos jugadores deben completar sus cartas normales");
  const damage = resolveCombat(state);
  const players = {
    P1: { ...state.players.P1, damageReceived: state.players.P1.damageReceived + damage.total.toP1 },
    P2: { ...state.players.P2, damageReceived: state.players.P2.damageReceived + damage.total.toP2 },
  };
  const finishedMatch = state.round >= 3 && (players.P1.damageReceived !== players.P2.damageReceived || state.round >= 4);
  const winner = finishedMatch
    ? players.P1.damageReceived < players.P2.damageReceived ? "P1" : players.P2.damageReceived < players.P1.damageReceived ? "P2" : null
    : null;
  return {
    ...state, players, winner,
    phase: finishedMatch ? "GAME_FINISHED" : "ROUND_FINISHED",
    roundCombatResolved: true,
    log: [...state.log, `Fin ronda ${state.round}: P1 recibe ${damage.total.toP1}; P2 recibe ${damage.total.toP2}`,
      finishedMatch ? `Partida finalizada: ${winner ?? "empate sin desempate adicional definido"}` : "Preparar siguiente ronda"],
  };
}
