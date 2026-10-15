import type { PlayerId } from "../types";
import type { GameState } from "./state";

export type MarketAction = { playerId: PlayerId; kind: "HEAL_TWO" } | { playerId: PlayerId; kind: "CATAPULT"; terrainIndex: 0 | 1 | 2 };
export type MarketResult = { ok: true; state: GameState } | { ok: false; reason: string };

/** Only fully specified operations are enabled; other purchases remain pending. */
export function buyMarket(state: GameState, action: MarketAction): MarketResult {
  const player = state.players[action.playerId];
  const cost = action.kind === "HEAL_TWO" ? 2 : 3;
  if (state.phase !== "PLAYING" || !player.marketOpen) return { ok: false, reason: "El Mercado no está abierto" };
  if (player.gold < cost) return { ok: false, reason: "Oro insuficiente" };
  if (action.kind === "CATAPULT" && ![0, 1, 2].includes(action.terrainIndex)) return { ok: false, reason: "Terreno inválido" };
  const players = { ...state.players, [action.playerId]: { ...player, gold: player.gold - cost } };
  if (action.kind === "HEAL_TWO") {
    players[action.playerId] = { ...players[action.playerId], damageReceived: Math.max(0, player.damageReceived - 2) };
    return { ok: true, state: { ...state, players, log: [...state.log, `${action.playerId} compró curación por 2 oro`] } };
  }
  const rival: PlayerId = action.playerId === "P1" ? "P2" : "P1";
  const line = state.terrains[action.terrainIndex], enemy = line[rival];
  if (enemy.length === 0) return { ok: false, reason: "No hay carta rival para destruir" };
  const removed = enemy[enemy.length - 1];
  const terrains = state.terrains.map((t, i) => i === action.terrainIndex ? { ...t, [rival]: enemy.slice(0, -1) } : t) as GameState["terrains"];
  return { ok: true, state: { ...state, players, terrains, discard: [...state.discard, removed], log: [...state.log, `${action.playerId} compró catapulta por 3 oro en terreno ${action.terrainIndex + 1}`] } };
}
export function closeMarket(state: GameState, playerId: PlayerId): GameState {
  return { ...state, players: { ...state.players, [playerId]: { ...state.players[playerId], marketOpen: false } } };
}
