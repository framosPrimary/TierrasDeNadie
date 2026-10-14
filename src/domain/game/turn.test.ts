import { describe, expect, it } from "vitest";
import { nextPlayer } from "./turn";
describe("nextPlayer",()=>it("alternates players",()=>{expect(nextPlayer("P1")).toBe("P2");expect(nextPlayer("P2")).toBe("P1");}));
