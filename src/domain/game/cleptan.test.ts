import { describe, expect, it } from "vitest";
import { createGame, type CardInstance } from "./state";
import { playCard } from "./playCard";
import { buyMarket, closeMarket } from "./market";

const card = (id: string, gold: number): CardInstance => ({
  instanceId: id,
  definition: { id, name: id, topElement: "SWORD", bottomElement: "GOLD", values: { GOLD: gold } },
});

function cleptanState() {
  const state = createGame([card("a", 3), card("b", 2)], []);
  state.players.P1.hero = {
    offered: ["Cleptan", "Otro", "Tercero", "Cuarto"],
    selected: ["Cleptan", "Otro"],
    initial: "Cleptan",
    active: "Cleptan",
    reserve: "Otro",
    revealed: true,
    swapUsed: false,
    reserveSuspended: false,
  };
  state.deck = [card("extra", 1)];
  return state;
}

describe("Cleptan (confirmación del Profe 04/11/2026)", () => {
  it("causa 2 daños cuando una carta con oro abre Mercado, sin comprar", () => {
    const first = playCard(cleptanState(), {
      playerId: "P1", instanceId: "a", terrainIndex: 0, placement: "TOP",
    });
    expect(first.ok).toBe(true);
    if (!first.ok) return;
    expect(first.state.players.P2.damageReceived).toBe(2);
    expect(first.state.players.P1.marketOpen).toBe(true);
  });

  it("solo dispara una vez en el turno aunque la carta extra reactive oro", () => {
    const first = playCard(cleptanState(), {
      playerId: "P1", instanceId: "a", terrainIndex: 0, placement: "TOP",
    });
    expect(first.ok).toBe(true);
    if (!first.ok) return;
    const extra = buyMarket(first.state, {
      playerId: "P1", kind: "EXTRA_CARD", terrainIndex: 1, placement: "TOP",
    });
    expect(extra.ok).toBe(true);
    if (!extra.ok) return;
    expect(extra.state.players.P2.damageReceived).toBe(2);
    expect(extra.state.players.P1.played).toBe(1);
    expect(extra.state.players.P1.marketOpen).toBe(true);
  });

  it("puede volver a dispararse en su siguiente turno", () => {
    const first = playCard(cleptanState(), {
      playerId: "P1", instanceId: "a", terrainIndex: 0, placement: "TOP",
    });
    expect(first.ok).toBe(true);
    if (!first.ok) return;
    const closed = closeMarket(first.state, "P1");
    // En un encuentro real, el oponente juega antes del siguiente turno de P1.
    const nextTurn = { ...closed, currentPlayer: "P1" as const };
    const second = playCard(nextTurn, {
      playerId: "P1", instanceId: "b", terrainIndex: 1, placement: "TOP",
    });
    expect(second.ok).toBe(true);
    if (!second.ok) return;
    expect(second.state.players.P2.damageReceived).toBe(4);
  });

  it("no aplica el daño si el héroe activo no es Cleptan", () => {
    const state = cleptanState();
    state.players.P1.hero!.active = "Otro";
    const first = playCard(state, {
      playerId: "P1", instanceId: "a", terrainIndex: 0, placement: "TOP",
    });
    expect(first.ok).toBe(true);
    if (first.ok) expect(first.state.players.P2.damageReceived).toBe(0);
  });
});
