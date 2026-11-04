import { describe, expect, it } from "vitest";
import type { CardDefinition, PlayerId } from "../types";
import { startMatch, nextRound } from "./match";
import { offerHeroes, chooseHeroes } from "./heroes";
import { playCard } from "./playCard";
import { closeMarket } from "./market";
import { finishRound } from "./finishRound";
import type { GameState } from "./state";

const cards: CardDefinition[] = Array.from({ length: 50 }, (_, i) => ({
  id: "SIM-" + i,
  name: "Sim " + i,
  topElement: "SHIELD",
  bottomElement: "SWORD",
  values: { SWORD: 1 + (i % 3), SHIELD: 1 },
}));
const roster = ["Cleptan", "Hero2", "Hero3", "Hero4", "Hero5", "Hero6", "Hero7", "Hero8"];
const prepare = (s: GameState): GameState => {
  let state = offerHeroes(s, roster.slice(0, 4), roster.slice(4));
  state = chooseHeroes(state, "P1", ["Cleptan", "Hero2"], "Hero2");
  state = chooseHeroes(state, "P2", ["Hero5", "Hero6"], "Hero5");
  return state;
};
const playRound = (initial: GameState): GameState => {
  let s = initial;
  const target = s.round >= 4 ? 5 : 10;
  for (let n = 0; n < target * 2; n++) {
    const player: PlayerId = s.currentPlayer;
    const next = s.players[player].hand[0];
    expect(next).toBeDefined();
    const result = playCard(s, {
      playerId: player,
      instanceId: next.instanceId,
      terrainIndex: (s.players[player].played % 3) as 0 | 1 | 2,
      placement: "BOTTOM",
      overlayOrder: "NEW_OVER_OLD",
    });
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error(result.reason);
    s = result.state;
    if (s.players[player].marketOpen) s = closeMarket(s, player);
  }
  expect(s.players.P1.played).toBe(target);
  expect(s.players.P2.played).toBe(target);
  expect(s.terrains.every(t => t.P1.length > 0 && t.P2.length > 0)).toBe(true);
  return finishRound(s);
};

describe("partida local completa de demostración", () => {
  it("permite jugar y cerrar tres rondas sin editar estado manualmente", () => {
    let state = prepare(startMatch(cards, () => 0.61));
    state = playRound(state);
    expect(state.round).toBe(1);
    expect(state.phase).toBe("ROUND_FINISHED");
    state = prepare(nextRound(state, () => 0.43));
    state = playRound(state);
    expect(state.round).toBe(2);
    state = prepare(nextRound(state, () => 0.37));
    state = playRound(state);
    expect(state.round).toBe(3);
    expect(["GAME_FINISHED", "ROUND_FINISHED"]).toContain(state.phase);
    if (state.phase === "ROUND_FINISHED") {
      state = prepare(nextRound(state, () => 0.29));
      state = playRound(state);
      expect(state.round).toBe(4);
      expect(state.phase).toBe("GAME_FINISHED");
    }
    expect(state.roundCombatResolved).toBe(true);
    expect(state.log.some(x => x.includes("Fin ronda"))).toBe(true);
  });
});
