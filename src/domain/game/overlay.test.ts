import { describe, expect, it } from "vitest";
import { overlay, visibleElements } from "./overlay";
import type { CardInstance } from "./state";
const make = (id: string, top: "SWORD" | "SHIELD" | "GOLD" | "HEAL", bottom: "SWORD" | "SHIELD" | "GOLD" | "HEAL"): CardInstance => ({
  instanceId: id, definition: { id, name: id, topElement: top, bottomElement: bottom },
});
describe("overlay", () => {
  it("deja ambos componentes visibles en la primera carta", () => {
    const r = overlay([], make("a", "SWORD", "GOLD"), "TOP", "NEW_OVER_OLD");
    expect(visibleElements(r.chain)).toHaveLength(2);
    expect(r.newlyEnabled.map(e => e.element)).toEqual(["GOLD"]);
  });
  it("nueva carta tapa escudo existente cuando se coloca arriba", () => {
    const initial = overlay([], make("a", "SHIELD", "HEAL"), "TOP", "NEW_OVER_OLD");
    const r = overlay(initial.chain, make("b", "SWORD", "GOLD"), "TOP", "NEW_OVER_OLD");
    expect(visibleElements(r.chain).map(e => e.element)).toEqual(["SWORD", "GOLD", "HEAL"]);
    expect(r.newlyEnabled.map(e => e.element)).toEqual(["GOLD"]);
  });
  it("el oro queda tapado y el escudo visible al colocarlo debajo del escudo", () => {
    const initial = overlay([], make("a", "SHIELD", "HEAL"), "TOP", "NEW_OVER_OLD");
    const r = overlay(initial.chain, make("b", "SWORD", "GOLD"), "TOP", "OLD_OVER_NEW");
    expect(visibleElements(r.chain).map(e => e.element)).toEqual(["SWORD", "SHIELD", "HEAL"]);
    expect(r.newlyEnabled).toEqual([]);
  });
  it("un elemento activado no se reactiva cuando queda visible otra vez", () => {
    const initial = overlay([], make("a", "SHIELD", "GOLD"), "TOP", "NEW_OVER_OLD");
    const r = overlay(initial.chain, make("b", "SWORD", "HEAL"), "BOTTOM", "NEW_OVER_OLD");
    expect(r.chain[0].visibility?.bottom.activated).toBe(true);
  });
});
