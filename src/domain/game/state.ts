import type { CardDefinition, PlayerId } from "../types";

export type CardInstance = { instanceId: string; definition: CardDefinition };
export type PlayerState = { id: PlayerId; hand: CardInstance[]; played: number };
export type TerrainLine = { P1: CardInstance[]; P2: CardInstance[] };
export type GameState = {
  currentPlayer: PlayerId;
  players: Record<PlayerId, PlayerState>;
  terrains: [TerrainLine, TerrainLine, TerrainLine];
  log: string[];
};
export function createGame(p1: CardInstance[], p2: CardInstance[]): GameState {
  if (p1.length > 10 || p2.length > 10) throw new Error("Máximo 10 cartas por mano");
  return {
    currentPlayer: "P1",
    players: { P1: { id: "P1", hand: [...p1], played: 0 }, P2: { id: "P2", hand: [...p2], played: 0 } },
    terrains: [0, 1, 2].map(() => ({ P1: [], P2: [] })) as GameState["terrains"],
    log: [],
  };
}
