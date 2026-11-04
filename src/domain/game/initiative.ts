import type { GameState } from "./state";
import type { PlayerId } from "../types";

/** Rondas 2 y 3: el perdedor elige. Desempate: decide quien perdió el sorteo inicial. */
export function chooseStarter(state: GameState, chooser: PlayerId, starter: PlayerId): GameState {
  if (state.phase !== "PLAYING" || state.starterPicker !== chooser ||
      state.players.P1.played !== 0 || state.players.P2.played !== 0)
    throw new Error("No está habilitada la elección de inicio");
  return { ...state, currentPlayer: starter, starterPicker: undefined,
    log: [...state.log, `${chooser} elige quién comienza: ${starter}`] };
}
