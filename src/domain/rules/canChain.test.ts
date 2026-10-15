import { describe, expect, it } from "vitest";
import { canChain } from "./canChain";
import type { CardDefinition } from "../types";
const base: CardDefinition = { id: "a", name: "A", topElement: "SWORD", bottomElement: "GOLD" };
describe("canChain", () => {
  it("permite la primera carta", () => expect(canChain([], base, "TOP")).toBe(true));
  it("permite símbolos distintos en TOP", () => expect(canChain([base], { ...base, bottomElement: "HEAL" }, "TOP")).toBe(true));
  it("permite símbolos distintos en BOTTOM", () => expect(canChain([base], { ...base, topElement: "WALL" }, "BOTTOM")).toBe(true));
  it("rechaza extremo desconocido", () => expect(canChain([base], base, "CENTER" as never)).toBe(false));
});
