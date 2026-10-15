import { expect, it } from "vitest";
import { createGame, type CardInstance } from "./state";
import { chooseHeroes, offerHeroes, swapHero, updateHeroThreshold } from "./heroes";
import { buyMarket, closeMarket } from "./market";
it("keeps choices secret until both hero selections complete", () => {
  const hand: CardInstance[] = Array.from({ length: 4 }, (_, i) => ({ instanceId: `H${i}`, definition: { id: `H${i}`, name: `Carta ${i}`, topElement: "SWORD", bottomElement: "SHIELD" } }));
  const offered = offerHeroes(createGame(hand, []), ["a","b","c","d"], ["e","f","g","h"]);
  const one = chooseHeroes(offered, "P1", ["a", "b"], "a");
  expect(one.players.P1.hero?.revealed).toBe(false);
  expect(one.players.P2.hero?.revealed).toBe(false);
  const both = chooseHeroes(one, "P2", ["e", "f"], "f");
  expect(both.players.P1.hero?.revealed).toBe(true);
  expect(both.players.P2.hero?.initial).toBe("f");
  const swapped = swapHero(both, "P1");
  expect(swapped.players.P1.hero?.active).toBe("b");
  expect(() => swapHero(swapped, "P1")).toThrow();
});
it("locks reserve permanently after hand reaches three", () => {
  const s = chooseHeroes(chooseHeroes(offerHeroes(createGame([], []), ["a","b","c","d"], ["e","f","g","h"]), "P1", ["a","b"], "a"), "P2", ["e","f"], "e");
  const locked = updateHeroThreshold(s, "P1");
  expect(locked.players.P1.hero?.reserveSuspended).toBe(true);
  expect(() => swapHero(locked, "P1")).toThrow();
});
it("allows heal only in an active gold market window", () => {
  const s = createGame([], []);
  expect(buyMarket(s, {playerId:"P1",kind:"HEAL_TWO"}).ok).toBe(false);
  const opened = { ...s, players: { ...s.players, P1: { ...s.players.P1, marketOpen:true, gold:2, damageReceived:5 } } };
  const result = buyMarket(opened, {playerId:"P1",kind:"HEAL_TWO"});
  expect(result.ok).toBe(true);
  if (result.ok) {
    expect(result.state.players.P1.damageReceived).toBe(3);
    expect(closeMarket(result.state, "P1").players.P1.marketOpen).toBe(false);
  }
});
it("market catapult discards last enemy card from selected line", () => {
  const s = createGame([], []);
  const enemy = { instanceId:"x", definition:{ id:"x", name:"X", topElement:"SWORD" as const, bottomElement:"SHIELD" as const } };
  s.terrains[2].P2.push(enemy);
  s.players.P1.gold = 3; s.players.P1.marketOpen = true;
  const result = buyMarket(s, { playerId:"P1", kind:"CATAPULT", terrainIndex:2 });
  expect(result.ok).toBe(true);
  if (result.ok) {
    expect(result.state.terrains[2].P2).toHaveLength(0);
    expect(result.state.discard[0].instanceId).toBe("x");
  }
});
