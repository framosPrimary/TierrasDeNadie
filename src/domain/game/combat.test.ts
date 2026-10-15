import { it, expect } from "vitest";
import { createGame } from "./state";
import { resolveCombat } from "./combat";
it("initial combat is zero", () => { expect(resolveCombat(createGame([], [])).total).toEqual({ toP1: 0, toP2: 0 }); });
