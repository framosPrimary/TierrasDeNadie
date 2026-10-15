import type { GameState } from "./state";
import type { PlayerId } from "../types";

export function offerHeroes(state: GameState, p1: string[], p2: string[]): GameState {
  if (state.phase !== "PLAYING" || state.players.P1.played || state.players.P2.played) throw new Error("La selección debe ser antes de jugar");
  if (p1.length !== 4 || p2.length !== 4 || new Set(p1).size !== 4 || new Set(p2).size !== 4) throw new Error("Se ofrecen cuatro héroes distintos");
  const make = (offered: string[]) => ({ offered: [...offered], selected: null as [string, string] | null, initial: null as string | null, active: null as string | null, reserve: null as string | null, revealed: false, swapUsed: false, reserveSuspended: false });
  return { ...state, heroSelectionRequired: true, players: { P1: { ...state.players.P1, hero: make(p1) }, P2: { ...state.players.P2, hero: make(p2) } } };
}
export function chooseHeroes(state: GameState, playerId: PlayerId, selected: [string, string], initial: string): GameState {
  const hero = state.players[playerId].hero;
  if (!state.heroSelectionRequired || !hero || hero.selected || state.phase !== "PLAYING") throw new Error("Selección no habilitada");
  if (selected[0] === selected[1] || !selected.every(id => hero.offered.includes(id)) || !selected.includes(initial)) throw new Error("Selección inválida");
  const chosen = { ...hero, selected: [...selected] as [string, string], initial, active: initial, reserve: selected.find(x => x !== initial)! };
  const players = { ...state.players, [playerId]: { ...state.players[playerId], hero: chosen } };
  if (players.P1.hero?.selected && players.P2.hero?.selected) {
    return { ...state, players: {
      P1: { ...players.P1, hero: { ...players.P1.hero!, revealed: true } },
      P2: { ...players.P2, hero: { ...players.P2.hero!, revealed: true } },
    }, log: [...state.log, "Héroes iniciales revelados simultáneamente"] };
  }
  return { ...state, players };
}
export function swapHero(state: GameState, playerId: PlayerId): GameState {
  const player = state.players[playerId], hero = player.hero;
  if (state.phase !== "PLAYING" || !hero?.revealed || hero.swapUsed || hero.reserveSuspended || player.hand.length <= 3) throw new Error("Enroque no habilitado");
  return { ...state, players: { ...state.players, [playerId]: { ...player, hero: { ...hero, active: hero.reserve, reserve: hero.active, swapUsed: true } } }, log: [...state.log, `${playerId} realizó su único enroque`] };
}
export function updateHeroThreshold(state: GameState, playerId: PlayerId): GameState {
  const player = state.players[playerId];
  if (!player.hero || player.hand.length > 3 || player.hero.reserveSuspended) return state;
  return { ...state, players: { ...state.players, [playerId]: { ...player, hero: { ...player.hero, reserveSuspended: true } } } };
}
