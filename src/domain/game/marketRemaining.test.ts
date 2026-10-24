import { expect, it } from "vitest";
import { startMatch } from "./match";
import { buyMarket, closeMarket } from "./market";
import { finishRound } from "./finishRound";
import type { CardDefinition } from "../types";
const definitions: CardDefinition[] = Array.from({length:50},(_,i)=>({id:String(i),name:String(i),topElement:"SWORD",bottomElement:"GOLD"}));
function setup() {
  const s = startMatch(definitions,()=>0.5);
  s.players.P1.gold = 12; s.players.P1.marketOpen = true;
  return s;
}
it("exchanges one hand card for one shared deck card and discards the old card",()=>{
  const s=setup(), id=s.players.P1.hand[0].instanceId, drawn=s.deck[0].instanceId;
  const r=buyMarket(s,{playerId:"P1",kind:"EXCHANGE",discardId:id});
  expect(r.ok).toBe(true);
  if(!r.ok)return;
  expect(r.state.players.P1.hand).toHaveLength(10);
  expect(r.state.players.P1.hand.some(c=>c.instanceId===drawn)).toBe(true);
  expect(r.state.discard.map(c=>c.instanceId)).toContain(id);
  expect(r.state.deck).toHaveLength(29);
  expect(s.players.P1.hand[0].instanceId).toBe(id);
});
it("takes two rival cards and returns two, preserving both hand sizes",()=>{
  const s=setup(),[a,b]=s.players.P2.hand.slice(0,2);
  const r=buyMarket(s,{playerId:"P1",kind:"STEAL",candidates:[a.instanceId,b.instanceId],returnIds:[s.players.P1.hand[0].instanceId,s.players.P1.hand[1].instanceId]});
  expect(r.ok).toBe(true);
  if(!r.ok)return;
  expect(r.state.players.P1.hand).toHaveLength(10);
  expect(r.state.players.P2.hand).toHaveLength(10);
  expect(r.state.players.P1.hand.some(c=>c.instanceId===a.instanceId)).toBe(true);
});
it("plays an extra card immediately without consuming a normal turn",()=>{
  const s=setup(),r=buyMarket(s,{playerId:"P1",kind:"EXTRA_CARD",terrainIndex:0,placement:"TOP"});
  expect(r.ok).toBe(true);
  if(!r.ok)return;
  expect(r.state.terrains[0].P1).toHaveLength(1);
  expect(r.state.players.P1.hand).toHaveLength(10);
  expect(r.state.players.P1.played).toBe(0);
  const closed=closeMarket(r.state,"P1");
  const ready={...closed,players:{...closed.players,P1:{...closed.players.P1,played:10},P2:{...closed.players.P2,played:10}}};
  expect(()=>finishRound(ready)).not.toThrow();
});
it("refuses absent rival targets without spending gold",()=>{
  const s=setup();
  const r=buyMarket(s,{playerId:"P1",kind:"STEAL",candidates:["fake","x"],returnIds:["fake","x"]});
  expect(r.ok).toBe(false); expect(s.players.P1.gold).toBe(12);
});
