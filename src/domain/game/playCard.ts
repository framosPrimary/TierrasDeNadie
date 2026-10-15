import { canChain } from "../rules/canChain";
import { overlay, type OverlayOrder } from "./overlay";
import type { Placement, PlayerId } from "../types";
import { nextPlayer } from "./turn";
import { resolveImmediate } from "./immediate";
import type { GameState } from "./state";

export type PlayCardAction = { playerId: PlayerId; instanceId: string; terrainIndex: 0 | 1 | 2; placement: Placement; overlayOrder?: OverlayOrder };
export type PlayResult = { ok: true; state: GameState } | { ok: false; reason: string };

export function playCard(state: GameState, action: PlayCardAction): PlayResult {
  if (state.phase !== "PLAYING") return { ok: false, reason: "La ronda no está activa" };
  if (action.playerId !== state.currentPlayer) return { ok: false, reason: "No es tu turno" };
  if (![0, 1, 2].includes(action.terrainIndex)) return { ok: false, reason: "Terreno inválido" };
  if (action.placement !== "TOP" && action.placement !== "BOTTOM") return { ok: false, reason: "Posición inválida" };
  const player = state.players[action.playerId];
  if (player.played >= (state.round >= 4 ? 5 : 10)) return { ok: false, reason: "Límite de cartas de la ronda" };
  const card = player.hand.find((c) => c.instanceId === action.instanceId);
  if (!card) return { ok: false, reason: "Carta no disponible en la mano" };
  const chain = state.terrains[action.terrainIndex][action.playerId];
  if (!canChain(chain.map((c) => c.definition), card.definition, action.placement))
    return { ok: false, reason: "Encadenamiento inválido" };
  const applied = overlay(chain, card, action.placement, action.overlayOrder ?? "NEW_OVER_OLD");
  const terrains = state.terrains.map((t, index) => {
    if (index !== action.terrainIndex) return t;
    const updated = applied.chain;
    return { ...t, [action.playerId]: updated };
  }) as GameState["terrains"];
  const placed: GameState = {
      ...state,
      terrains,
      currentPlayer: nextPlayer(state.currentPlayer),
      players: {
        ...state.players,
        [action.playerId]: { ...player, played: player.played + 1, hand: player.hand.filter((c) => c.instanceId !== action.instanceId) },
      },
      log: [...state.log, `${action.playerId} jugó ${card.definition.name} en terreno ${action.terrainIndex + 1}`, ...applied.newlyEnabled.map(e => `${e.element} habilitado (${e.instanceId}:${e.face})`)],
    };
  return { ok: true, state: resolveImmediate(placed, action.playerId, action.terrainIndex, applied.newlyEnabled) };
}
