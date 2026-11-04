import { describe, expect, it } from "vitest";
import { createGame, type CardInstance } from "./state";
import { playCard } from "./playCard";
import { closeMarket } from "./market";

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
  it("permite encadenamiento sin coincidencia de elementos", () => {
    const state = createGame([card("a", "SWORD", "GOLD"), card("b", "GOLD", "GOLD")], []);
    const first = playCard(state, { playerId: "P1", instanceId: "a", terrainIndex: 0, placement: "TOP" });
    expect(first.ok).toBe(true);
    if (!first.ok) return;
    // GOLD abrió Mercado: cerrar esa ventana antes de validar el encadenamiento.
    const second = { ...closeMarket(first.state, "P1"), currentPlayer: "P1" as const };
    expect(playCard(second, { playerId: "P1", instanceId: "b", terrainIndex: 0, placement: "TOP" }).ok).toBe(true);
  });
  it("permite continuar al jugador que aún tiene jugadas cuando el rival terminó", () => {
    const state = createGame([card("a", "SWORD", "SWORD"), card("b", "SWORD", "SWORD")], []);
    state.players.P2.played = 10;
    const first = playCard(state, { playerId: "P1", instanceId: "a", terrainIndex: 0, placement: "TOP" });
    expect(first.ok).toBe(true);
    if (!first.ok) return;
    expect(first.state.currentPlayer).toBe("P1");
    const second = playCard(first.state, { playerId: "P1", instanceId: "b", terrainIndex: 1, placement: "BOTTOM" });
    expect(second.ok).toBe(true);
    if (second.ok) expect(second.state.players.P1.played).toBe(2);
  });

  it("obliga a visitar los tres terrenos antes de agotar las jugadas", () => {
    const s = createGame([card("last", "SWORD", "SWORD")], []);
    s.players.P1.played = 9;
    s.players.P1.visitedTerrains = [0, 1];
    const blocked = playCard(s, { playerId: "P1", instanceId: "last", terrainIndex: 0, placement: "TOP" });
    expect(blocked.ok).toBe(false);
    const allowed = playCard(s, { playerId: "P1", instanceId: "last", terrainIndex: 2, placement: "TOP" });
    expect(allowed.ok).toBe(true);
    if (allowed.ok) expect(allowed.state.players.P1.visitedTerrains).toEqual([0, 1, 2]);
  });
});
