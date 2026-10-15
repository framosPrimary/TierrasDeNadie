import { describe, expect, it } from "vitest";
import { nextRound, startMatch } from "./match";
import { finishRound } from "./finishRound";
import type { CardDefinition } from "../types";

const cards: CardDefinition[] = Array.from({ length: 50 }, (_, i) => ({
  id: String(i), name: String(i), topElement: "SWORD", bottomElement: "SHIELD",
  values: { SWORD: 1, SHIELD: 1 },
}));
const fresh = () => startMatch(cards, () => 0.5);
const completed = (round: number, p1Damage = 0, p2Damage = 0) => {
  const s = fresh();
  return {
    ...s, round,
    players: {
      P1: { ...s.players.P1, played: round >= 4 ? 5 : 10, damageReceived: p1Damage },
      P2: { ...s.players.P2, played: round >= 4 ? 5 : 10, damageReceived: p2Damage },
    },
  };
};
describe("match lifecycle", () => {
  it("deals distinct cards from one fifty-card deck", () => {
    const s = fresh();
    expect(s.players.P1.hand).toHaveLength(10);
    expect(s.players.P2.hand).toHaveLength(10);
    expect(s.deck).toHaveLength(30);
    expect(new Set([...s.deck, ...s.players.P1.hand, ...s.players.P2.hand].map(c => c.instanceId)).size).toBe(50);
  });
  it("resets board, preserves damage, and draws ten for rounds two and three", () => {
    const state = completed(1, 2, 7);
    const resolved = finishRound(state);
    expect(resolved.phase).toBe("ROUND_FINISHED");
    const next = nextRound(resolved, () => 0.5);
    expect(next.round).toBe(2);
    expect(next.players.P1.damageReceived).toBe(2);
    expect(next.players.P2.damageReceived).toBe(7);
    expect(next.players.P1.hand).toHaveLength(10);
    expect(next.terrains[0].P1).toHaveLength(0);
  });
  it("finds the winner after round three", () => {
    const r = finishRound(completed(3, 2, 7));
    expect(r.phase).toBe("GAME_FINISHED");
    expect(r.winner).toBe("P1");
  });
  it("deals five each for a tied tiebreak round", () => {
    const tie = finishRound(completed(3, 4, 4));
    expect(tie.phase).toBe("ROUND_FINISHED");
    const next = nextRound(tie, () => 0.5);
    expect(next.round).toBe(4);
    expect(next.players.P1.hand).toHaveLength(5);
    expect(next.players.P2.hand).toHaveLength(5);
  });
  it("does not decide further rules for a second tie", () => {
    const r = finishRound(completed(4, 2, 2));
    expect(r.phase).toBe("GAME_FINISHED");
    expect(r.winner).toBe(null);
  });
});
