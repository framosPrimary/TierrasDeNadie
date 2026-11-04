import { describe, expect, it } from "vitest";
import { startMatch, nextRound } from "./match";
import { chooseStarter } from "./initiative";
import type { CardDefinition } from "../types";
const defs: CardDefinition[] = Array.from({length: 50},(_,i)=>({
  id: String(i), name: "demo " + i, topElement:"SHIELD",bottomElement:"SWORD",
}));
describe("iniciativa de rondas", () => {
  it("registra quién perdió el sorteo inicial", () => {
    const first = startMatch(defs,()=>0.25);
    expect(first.currentPlayer).toBe("P1");
    expect(first.coinLoser).toBe("P2");
  });
  it("quien va perdiendo decide quién empieza en la segunda ronda", () => {
    const first = startMatch(defs,()=>0.25);
    first.phase = "ROUND_FINISHED";
    first.players.P1.damageReceived = 10;
    first.players.P2.damageReceived = 3;
    const second = nextRound(first,()=>0.5);
    expect(second.starterPicker).toBe("P1");
    expect(() => chooseStarter(second, "P2", "P2")).toThrow();
    const selected = chooseStarter(second, "P1", "P2");
    expect(selected.currentPlayer).toBe("P2");
    expect(selected.starterPicker).toBeUndefined();
    expect(() => chooseStarter(selected, "P1", "P1")).toThrow();
  });
  it("el perdedor del sorteo decide inicio del desempate", () => {
    const first = startMatch(defs,()=>0.25);
    first.round=3;
    first.phase="ROUND_FINISHED";
    const fourth = nextRound(first,()=>0.5);
    expect(fourth.round).toBe(4);
    expect(fourth.starterPicker).toBe("P2");
  });
});
