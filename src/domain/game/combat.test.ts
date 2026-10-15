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
