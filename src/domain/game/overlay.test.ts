import { describe, expect, it } from "vitest";
import { overlay, visibleElements } from "./overlay";
import type { CardInstance } from "./state";

const make = (id: string, top: "SWORD" | "SHIELD" | "GOLD" | "HEAL", bottom: "SWORD" | "SHIELD" | "GOLD" | "HEAL"): CardInstance => ({
  instanceId: id, definition: { id, name: id, topElement: top, bottomElement: bottom },
});

describe("overlay (reglas del Profe)", () => {
  it("primera carta se encadena bajo terreno: solo cara inferior visible y activable", () => {
    const r = overlay([], make("a", "GOLD", "HEAL"), "TOP", "NEW_OVER_OLD");
    expect(visibleElements(r.chain).map(e => e.element)).toEqual(["HEAL"]);
    expect(r.newlyEnabled.map(e => e.element)).toEqual(["HEAL"]);
    expect(r.chain[0].visibility?.top.activated).toBe(false);
  });
  it("la colocación inicial no permite activar oro en cara superior", () => {
    const r = overlay([], make("a", "GOLD", "SWORD"), "BOTTOM", "OLD_OVER_NEW");
    expect(r.newlyEnabled).toEqual([]);
    expect(visibleElements(r.chain).map(e => e.element)).toEqual(["SWORD"]);
  });
  it("permite superponer una segunda carta en ambos órdenes", () => {
    const first = overlay([], make("a", "SHIELD", "HEAL"), "TOP", "NEW_OVER_OLD");
    const over = overlay(first.chain, make("b", "SWORD", "GOLD"), "TOP", "NEW_OVER_OLD");
    expect(visibleElements(over.chain).map(e => e.element)).toEqual(["SWORD", "GOLD", "HEAL"]);
    expect(over.newlyEnabled.map(e => e.element)).toEqual(["GOLD"]);
    const under = overlay(first.chain, make("b", "SWORD", "GOLD"), "TOP", "OLD_OVER_NEW");
    expect(visibleElements(under.chain).map(e => e.element)).toEqual(["SWORD", "HEAL"]);
    expect(under.newlyEnabled).toEqual([]);
  });
  it("un elemento activado mantiene memoria aunque otra carta lo cubra", () => {
    const initial = overlay([], make("a", "SHIELD", "GOLD"), "TOP", "NEW_OVER_OLD");
    const result = overlay(initial.chain, make("b", "SWORD", "HEAL"), "BOTTOM", "NEW_OVER_OLD");
    expect(result.chain[0].visibility?.bottom.activated).toBe(true);
    expect(result.chain[0].visibility?.bottom.covered).toBe(true);
  });
});
