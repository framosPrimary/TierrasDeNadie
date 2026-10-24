import type { PlayerId } from "../types";
import type { GameState } from "./state";
import { updateHeroThreshold } from "./heroes";
import { overlay, type OverlayOrder } from "./overlay";
import { resolveImmediate } from "./immediate";
import type { Placement } from "../types";

export type MarketAction =
  | { playerId: PlayerId; kind: "HEAL_TWO" }
  | { playerId: PlayerId; kind: "CATAPULT"; terrainIndex: 0 | 1 | 2 }
  | { playerId: PlayerId; kind: "EXCHANGE"; discardId: string }
  | { playerId: PlayerId; kind: "STEAL"; candidates: [string, string]; returnIds: [string, string] }
  | { playerId: PlayerId; kind: "EXTRA_CARD"; terrainIndex: 0 | 1 | 2; placement: Placement; overlayOrder?: OverlayOrder };
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
      if (enemy.length > 0) {
        discard = [...discard, enemy[enemy.length - 1]];
        terrains = state.terrains.map((line, i) => i === action.terrainIndex ? { ...line, [rival]: enemy.slice(0, -1) } : line) as GameState["terrains"];
      }
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
      const [returnA, returnB] = action.returnIds;
      if (a === b || returnA === returnB) return { ok: false, reason: "Elección inválida" };
      const rivalCards = state.players[rival].hand.filter(c => c.instanceId === a || c.instanceId === b);
      if (rivalCards.length !== 2) return { ok: false, reason: "Cartas rivales no disponibles" };
      const pool = [...player.hand, ...rivalCards];
      const returnCards = pool.filter(c => c.instanceId === returnA || c.instanceId === returnB);
      if (returnCards.length !== 2) return { ok: false, reason: "Devolución inválida" };
      players[rival].hand = [...state.players[rival].hand.filter(c => c.instanceId !== a && c.instanceId !== b), ...returnCards];
      players[action.playerId].hand = pool.filter(c => c.instanceId !== returnA && c.instanceId !== returnB);
      break;
    }
    case "EXTRA_CARD": {
      if (!deck.length) return { ok: false, reason: "Mazo agotado" };
      if (![0, 1, 2].includes(action.terrainIndex) || !["TOP", "BOTTOM"].includes(action.placement))
        return { ok: false, reason: "Terreno o posición inválidos" };
      const chain = state.terrains[action.terrainIndex][action.playerId];
      const applied = overlay(chain, deck[0], action.placement, action.overlayOrder ?? "NEW_OVER_OLD");
      terrains = state.terrains.map((line, i) => i === action.terrainIndex
        ? { ...line, [action.playerId]: applied.chain } : line) as GameState["terrains"];
      deck = deck.slice(1);
      log.push(`${action.playerId}: carta extra jugada en terreno ${action.terrainIndex + 1}`);
      break;
    }
  }
  players[action.playerId].gold -= cost;
  log.push(`${action.playerId}: compra ${action.kind} (${cost} oro)`);
  let updated: GameState = { ...state, players, deck, discard, terrains, log };
  if (action.kind === "EXTRA_CARD") {
    const placed = terrains[action.terrainIndex][action.playerId];
    const triggerCard = placed.find(c => c.instanceId === state.deck[0].instanceId);
    if (triggerCard) {
      const triggers = (["top", "bottom"] as const).flatMap(face => {
        const status = triggerCard.visibility?.[face];
        const element = triggerCard.definition[face === "top" ? "topElement" : "bottomElement"];
        return status?.activated && !status.covered && ["GOLD", "HEAL", "CATAPULT", "ARCHERY"].includes(element)
          ? [{ instanceId: triggerCard.instanceId, face, element }] : [];
      });
      updated = resolveImmediate(updated, action.playerId, action.terrainIndex, triggers);
    }
  }
  updated = updateHeroThreshold(updated, rival);
  updated = updateHeroThreshold(updated, action.playerId);
  return { ok: true, state: updated };
}
export function closeMarket(state: GameState, playerId: PlayerId): GameState {
  if (!state.players[playerId].marketOpen) return state;
  return { ...state, players: { ...state.players, [playerId]: { ...state.players[playerId], marketOpen: false } } };
}
