import { describe, expect, it } from "vitest";
import { createGame, type CardInstance } from "./state";
import { playCard } from "./playCard";

const card = (id: string, top: "SWORD" | "GOLD", bottom: "SWORD" | "GOLD"): CardInstance => ({
  instanceId: id, definition: { id, name: id, topElement: top, bottomElement: bottom },
});
describe("playCard", () => {
  it("crea exactamente tres terrenos independientes", () => {
    const state = createGame([], []);
    expect(state.terrains).toHaveLength(3);
    expect(state.terrains[0]).not.toBe(state.terrains[1]);
  });
  it("coloca una carta, la quita de la mano y alterna el turno", () => {
    const state = createGame([card("a", "SWORD", "GOLD")], [card("b", "GOLD", "SWORD")]);
    const result = playCard(state, { playerId: "P1", instanceId: "a", terrainIndex: 0, placement: "TOP" });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.state.terrains[0].P1).toHaveLength(1);
    expect(result.state.players.P1.hand).toHaveLength(0);
    expect(result.state.currentPlayer).toBe("P2");
    expect(state.players.P1.hand).toHaveLength(1);
  });
  it("rechaza jugar fuera de turno sin alterar estado", () => {
    const state = createGame([card("a", "SWORD", "GOLD")], [card("b", "GOLD", "SWORD")]);
    expect(playCard(state, { playerId: "P2", instanceId: "b", terrainIndex: 0, placement: "TOP" }).ok).toBe(false);
    expect(state.terrains[0].P2).toHaveLength(0);
  });
  it("rechaza cartas que no están en la mano", () => {
    expect(playCard(createGame([], []), { playerId: "P1", instanceId: "missing", terrainIndex: 0, placement: "TOP" }).ok).toBe(false);
  });
  it("rechaza encadenamiento incorrecto", () => {
    const state = createGame([card("a", "SWORD", "GOLD"), card("b", "GOLD", "GOLD")], []);
    const first = playCard(state, { playerId: "P1", instanceId: "a", terrainIndex: 0, placement: "TOP" });
    expect(first.ok).toBe(true);
    if (!first.ok) return;
    const second = { ...first.state, currentPlayer: "P1" as const };
    expect(playCard(second, { playerId: "P1", instanceId: "b", terrainIndex: 0, placement: "TOP" }).ok).toBe(false);
  });
});
