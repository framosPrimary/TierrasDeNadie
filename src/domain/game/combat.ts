import type { ElementType } from "../types";
import type { CardInstance, TerrainLine, GameState } from "./state";
import { visibleElements } from "./overlay";

export type LineScore = { swords: number; shields: number; walls: number };
export type LineDamage = { toP1: number; toP2: number };
export type CombatResult = { lines: [LineDamage, LineDamage, LineDamage]; total: LineDamage };

export function componentValue(card: CardInstance, element: ElementType): number {
  const amount = card.definition.values?.[element] ?? 0;
  return Number.isFinite(amount) && amount >= 0 ? amount : 0;
}
export function lineScore(chain: readonly CardInstance[]): LineScore {
  const score: LineScore = { swords: 0, shields: 0, walls: 0 };
  for (const face of visibleElements(chain)) {
    const card = chain.find(c => c.instanceId === face.instanceId);
    if (!card) continue;
    const value = componentValue(card, face.element);
    if (face.element === "SWORD") score.swords += value;
    if (face.element === "SHIELD") score.shields += value;
    if (face.element === "WALL") score.walls += value;
  }
  return score;
}
export function resolveLine(line: TerrainLine): LineDamage {
  const a = lineScore(line.P1), b = lineScore(line.P2);
  return { toP1: Math.max(0, b.swords - a.shields), toP2: Math.max(0, a.swords - b.shields) };
}
export function resolveCombat(state: GameState): CombatResult {
  const lines = state.terrains.map(resolveLine) as CombatResult["lines"];
  return { lines, total: lines.reduce((sum, line) => ({
    toP1: sum.toP1 + line.toP1, toP2: sum.toP2 + line.toP2,
  }), { toP1: 0, toP2: 0 }) };
}
