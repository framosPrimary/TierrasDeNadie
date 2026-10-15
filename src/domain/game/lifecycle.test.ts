import { expect, it } from "vitest";
import { createGame } from "./state";
import { playCard } from "./playCard";
import { finishRound } from "./finishRound";

const card = (id: string, top: "GOLD" | "HEAL" | "SWORD" | "SHIELD", bottom: "GOLD" | "HEAL" | "SWORD" | "SHIELD", amount: number) => ({
  instanceId: id,
  definition: { id, name: id, topElement: top, bottomElement: bottom, values: { [top]: amount } },
});
it("gains gold once on play", () => {
  const s = createGame([card("g", "GOLD", "SWORD", 2)], []);
  const r = playCard(s, { playerId: "P1", instanceId: "g", terrainIndex: 0, placement: "TOP" });
  expect(r.ok).toBe(true);
  if (r.ok) expect(r.state.players.P1.gold).toBe(2);
});
it("healing cannot take received damage below zero", () => {
  const s = createGame([card("h", "HEAL", "SHIELD", 4)], []);
  const r = playCard(s, { playerId: "P1", instanceId: "h", terrainIndex: 0, placement: "TOP" });
  expect(r.ok).toBe(true);
  if (r.ok) expect(r.state.players.P1.damageReceived).toBe(0);
});
it("resolves sword damage once after ten cards each", () => {
  const s = createGame([], []);
  s.players.P1.played = 10;
  s.players.P2.played = 10;
  s.terrains[0].P1.push(card("a", "SWORD", "SHIELD", 5));
  const resolved = finishRound(s);
  expect(resolved.players.P2.damageReceived).toBe(5);
  expect(() => finishRound(resolved)).toThrow();
});
