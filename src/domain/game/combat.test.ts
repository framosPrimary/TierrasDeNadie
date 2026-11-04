import { it, expect } from "vitest";
import { createGame } from "./state";
import { resolveCombat } from "./combat";
it("initial combat is zero", () => { expect(resolveCombat(createGame([], [])).total).toEqual({ toP1: 0, toP2: 0 }); });

it("resolves opposing swords and shields", () => {
  const s = createGame([], []);
  s.terrains[0].P1.push({instanceId:"a",definition:{id:"a",name:"A",topElement:"SWORD",bottomElement:"SHIELD",values:{SWORD:8,SHIELD:3}}});
  s.terrains[0].P2.push({instanceId:"b",definition:{id:"b",name:"B",topElement:"SWORD",bottomElement:"SHIELD",values:{SWORD:5,SHIELD:2}}});
  expect(resolveCombat(s).total).toEqual({toP1:2,toP2:6});
});
it("does not count covered swords or shields from other lines", () => {
  const s = createGame([], []);
  s.terrains[0].P1.push({instanceId:"a",definition:{id:"a",name:"A",topElement:"SWORD",bottomElement:"GOLD",values:{SWORD:8}},visibility:{top:{covered:true,activated:false},bottom:{covered:false,activated:false}}});
  s.terrains[1].P2.push({instanceId:"b",definition:{id:"b",name:"B",topElement:"SHIELD",bottomElement:"GOLD",values:{SHIELD:9}}});
  expect(resolveCombat(s).total.toP2).toBe(0);
});

import { lineScore } from "./combat";
import { overlay } from "./overlay";
it("printed wall and first bottom sword coexist below terrain", () => {
  const first = { instanceId: "first", definition: {id:"first", name:"First",topElement:"SHIELD" as const,bottomElement:"SWORD" as const,values:{SWORD:3},printedWalls:1} };
  const placed = overlay([],first,"BOTTOM","NEW_OVER_OLD");
  expect(lineScore(placed.chain)).toEqual({swords:3, shields:0, walls:1});
});
it("printed walls disappear when their card is destroyed from the chain", () => {
  const card = {instanceId:"wall",definition:{id:"wall",name:"Wall",topElement:"SHIELD" as const,bottomElement:"SWORD" as const, values:{SWORD:3},printedWalls:1}};
  expect(lineScore([card]).walls).toBe(1);
  expect(lineScore([]).walls).toBe(0);
});
