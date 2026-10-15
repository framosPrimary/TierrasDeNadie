import { expect, it } from "vitest";
import { startMatch, nextRound } from "./match";
import { buyMarket } from "./market";
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
it("takes one of two opponent cards and returns the other",()=>{
  const s=setup(),[a,b]=s.players.P2.hand.slice(0,2);
  const r=buyMarket(s,{playerId:"P1",kind:"STEAL",candidates:[a.instanceId,b.instanceId],keepId:a.instanceId});
  expect(r.ok).toBe(true);
  if(!r.ok)return;
  expect(r.state.players.P1.hand).toHaveLength(11);
  expect(r.state.players.P2.hand).toHaveLength(9);
  expect(r.state.players.P2.hand.some(c=>c.instanceId===b.instanceId)).toBe(true);
});
it("reserves an extra card without playing it ahead of its end-of-round phase",()=>{
  const s=setup(),r=buyMarket(s,{playerId:"P1",kind:"EXTRA_CARD"});
  expect(r.ok).toBe(true);
  if(!r.ok)return;
  expect(r.state.players.P1.extraCards).toHaveLength(1);
  expect(r.state.players.P1.hand).toHaveLength(10);
  expect(r.state.players.P1.played).toBe(0);
  const ready={...r.state,players:{...r.state.players,P1:{...r.state.players.P1,played:10},P2:{...r.state.players.P2,played:10}}};
  const resolved=finishRound(ready);
  const next=nextRound(resolved,()=>0.5);
  expect(next.players.P1.extraCards).toHaveLength(0);
  expect(next.deck).toHaveLength(30);
});
it("refuses absent rival targets without spending gold",()=>{
  const s=setup();
  const r=buyMarket(s,{playerId:"P1",kind:"STEAL",candidates:["fake","x"],keepId:"fake"});
  expect(r.ok).toBe(false); expect(s.players.P1.gold).toBe(12);
});
