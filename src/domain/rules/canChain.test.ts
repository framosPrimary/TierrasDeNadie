import { describe, expect, it } from "vitest";
import { canChain } from "./canChain";
import type { CardDefinition } from "../types";
const base: CardDefinition = { id:"a",name:"A",topElement:"SWORD",bottomElement:"GOLD" };
describe("canChain",()=>{
 it("accepts first card",()=>expect(canChain([],base,"TOP")).toBe(true));
 it("matches top",()=>expect(canChain([base],{...base,id:"b",bottomElement:"SWORD"},"TOP")).toBe(true));
 it("rejects invalid top",()=>expect(canChain([base],{...base,bottomElement:"HEAL"},"TOP")).toBe(false));
 it("matches bottom",()=>expect(canChain([base],{...base,topElement:"GOLD"},"BOTTOM")).toBe(true));
 it("rejects invalid bottom",()=>expect(canChain([base],{...base,topElement:"WALL"},"BOTTOM")).toBe(false));
});
