import type { CardDefinition, PlayerId } from "../types";
import type { Visibility } from "./overlay";

export type CardInstance = { instanceId: string; definition: CardDefinition; visibility?: Visibility };
export type PlayerState = { id: PlayerId; hand: CardInstance[]; played: number; damageReceived: number; gold: number };
export type TerrainLine = { P1: CardInstance[]; P2: CardInstance[] };
export type GameState = {
  currentPlayer: PlayerId;
  players: Record<PlayerId, PlayerState>;
  terrains: [TerrainLine, TerrainLine, TerrainLine];
  log: string[];
  discard: CardInstance[];
  roundCombatResolved: boolean;
};
export function createGame(p1: CardInstance[], p2: CardInstance[]): GameState {
  if (p1.length > 10 || p2.length > 10) throw new Error("Máximo 10 cartas por mano");
  return {
    currentPlayer: "P1",
    players: { P1: { id: "P1", hand: [...p1], played: 0, damageReceived: 0, gold: 0 }, P2: { id: "P2", hand: [...p2], played: 0 } },
    terrains: [{ P1: [], P2: [] }, { P1: [], P2: [] }, { P1: [], P2: [] }],
    log: [],
    discard: [],
    roundCombatResolved: false,
  };
}
