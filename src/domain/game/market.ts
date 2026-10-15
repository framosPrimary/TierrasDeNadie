import type { PlayerId } from "../types";
import type { GameState } from "./state";
import { updateHeroThreshold } from "./heroes";

export type MarketAction =
  | { playerId: PlayerId; kind: "HEAL_TWO" }
  | { playerId: PlayerId; kind: "CATAPULT"; terrainIndex: 0 | 1 | 2 }
  | { playerId: PlayerId; kind: "EXCHANGE"; discardId: string }
  | { playerId: PlayerId; kind: "STEAL"; candidates: [string, string]; keepId: string }
  | { playerId: PlayerId; kind: "EXTRA_CARD" };
export type MarketResult = { ok: true; state: GameState } | { ok: false; reason: string };

export function buyMarket(state: GameState, action: MarketAction): MarketResult {
  const player = state.players[action.playerId];
  const cost = action.kind === "EXCHANGE" ? 1 : action.kind === "HEAL_TWO" || action.kind === "STEAL" ? 2 : 3;
  if (state.phase !== "PLAYING" || !player.marketOpen) return { ok: false, reason: "El Mercado no está abierto" };
  if (player.gold < cost) return { ok: false, reason: "Oro insuficiente" };
  const rival: PlayerId = action.playerId === "P1" ? "P2" : "P1";
  let players = { P1: { ...state.players.P1 }, P2: { ...state.players.P2 } };
  let terrains = state.terrains;
  let deck = state.deck;
  let discard = state.discard;
  const log = [...state.log];
  switch (action.kind) {
    case "HEAL_TWO":
      players[action.playerId].damageReceived = Math.max(0, player.damageReceived - 2);
      break;
    case "CATAPULT": {
      if (![0, 1, 2].includes(action.terrainIndex)) return { ok: false, reason: "Terreno inválido" };
      const enemy = state.terrains[action.terrainIndex][rival];
      if (enemy.length === 0) return { ok: false, reason: "No hay carta rival para destruir" };
      discard = [...discard, enemy[enemy.length - 1]];
      terrains = state.terrains.map((line, i) => i === action.terrainIndex ? { ...line, [rival]: enemy.slice(0, -1) } : line) as GameState["terrains"];
      break;
    }
    case "EXCHANGE": {
      const old = player.hand.find(c => c.instanceId === action.discardId);
      if (!old || !deck.length) return { ok: false, reason: "Carta o mazo no disponible" };
      players[action.playerId].hand = [...player.hand.filter(c => c.instanceId !== action.discardId), deck[0]];
      deck = deck.slice(1);
      discard = [...discard, old];
      break;
    }
    case "STEAL": {
      const [a, b] = action.candidates;
      if (a === b || !action.candidates.includes(action.keepId)) return { ok: false, reason: "Elección inválida" };
      const stolen = state.players[rival].hand.find(c => c.instanceId === action.keepId);
      if (!stolen || !state.players[rival].hand.some(c => c.instanceId === a) || !state.players[rival].hand.some(c => c.instanceId === b))
        return { ok: false, reason: "Cartas rivales no disponibles" };
      players[rival].hand = state.players[rival].hand.filter(c => c.instanceId !== stolen.instanceId);
      players[action.playerId].hand = [...player.hand, stolen];
      break;
    }
    case "EXTRA_CARD": {
      if (!deck.length) return { ok: false, reason: "Mazo agotado" };
      players[action.playerId].extraCards = [...(player.extraCards ?? []), deck[0]];
      deck = deck.slice(1);
      break;
    }
  }
  players[action.playerId].gold -= cost;
  log.push(`${action.playerId}: compra ${action.kind} (${cost} oro)`);
  let updated = { ...state, players, deck, discard, terrains, log };
  updated = updateHeroThreshold(updated, rival);
  updated = updateHeroThreshold(updated, action.playerId);
  return { ok: true, state: updated };
}
export function closeMarket(state: GameState, playerId: PlayerId): GameState {
  if (!state.players[playerId].marketOpen) return state;
  return { ...state, players: { ...state.players, [playerId]: { ...state.players[playerId], marketOpen: false } } };
}
