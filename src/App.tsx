import { useState } from "react";
import { type GameState } from "./domain/game/state";
import { playCard } from "./domain/game/playCard";
import { finishRound } from "./domain/game/finishRound";
import { nextRound, startMatch } from "./domain/game/match";
import type { OverlayOrder } from "./domain/game/overlay";
import type { ElementType, Placement } from "./domain/types";

const symbols: Record<ElementType, string> = { SWORD: "⚔️", SHIELD: "🛡️", ARCHERY: "🏹", WALL: "🧱", GOLD: "🪙", HEAL: "💚", CATAPULT: "💥" };
const demoDeck = () => {
  const elements: ElementType[] = ["SWORD", "GOLD", "SHIELD", "ARCHERY", "WALL", "HEAL", "CATAPULT"];
  return Array.from({ length: 50 }, (_, i) => ({
    id: "DEMO-" + i, name: "Carta " + (i + 1),
    topElement: elements[i % 7], bottomElement: elements[(i + 1) % 7],
    values: { [elements[i % 7]]: 1 + (i % 3), [elements[(i + 1) % 7]]: 1 },
  }));
};
const fresh = () => startMatch(demoDeck());

export function App() {
  const [game, setGame] = useState<GameState>(fresh);
  const [selected, setSelected] = useState<string | null>(null);
  const [terrain, setTerrain] = useState<0 | 1 | 2>(0);
  const [placement, setPlacement] = useState<Placement>("TOP");
  const [overlayOrder, setOverlayOrder] = useState<OverlayOrder>("NEW_OVER_OLD");
  const [message, setMessage] = useState("Elegí una carta y una línea para jugar.");
  const player = game.currentPlayer;
  const hand = game.players[player].hand;
  const selectedCard = hand.find(c => c.instanceId === selected);

  function submit() {
    if (!selected) return setMessage("Primero seleccioná una carta.");
    const result = playCard(game, { playerId: player, instanceId: selected, terrainIndex: terrain, placement, overlayOrder });
    if (!result.ok) return setMessage(result.reason);
    setGame(result.state);
    setSelected(null);
    setMessage("Carta jugada. Turno de " + result.state.currentPlayer);
  }

  function closeRound() {
    try {
      setGame(finishRound(game));
      setSelected(null);
      setMessage("Ronda resuelta.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "No se pudo cerrar la ronda"); }
  }
  function advanceRound() {
    try {
      setGame(nextRound(game));
      setSelected(null);
      setMessage("Nueva ronda: cartas repartidas.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "No se pudo repartir"); }
  }
  const totalCards = game.round >= 4 ? 5 : 10;
  return <main className="shell">
    <header><p className="eyebrow">Prototipo técnico · M1</p><h1>Tierras de Nadie</h1><p>Prueba local 1 vs 1 · mazo ficticio de 50 cartas · ciclo de rondas experimental</p></header>
    <section className="status"><strong>Ronda {game.round} · {game.phase === "PLAYING" ? "Turno: " + player : game.phase === "GAME_FINISHED" ? "Ganador: " + (game.winner ?? "empate") : "Ronda terminada"}</strong><span>Daño recibido P1: {game.players.P1.damageReceived} · P2: {game.players.P2.damageReceived} · Oro P1: {game.players.P1.gold} · P2: {game.players.P2.gold}</span><button onClick={() => { setGame(fresh()); setSelected(null); setMessage("Nueva prueba iniciada."); }}>Reiniciar</button></section>
    <section className="board">
      {game.terrains.map((line, index) => <button key={index} className={"terrain " + (terrain === index ? "active" : "")} onClick={() => setTerrain(index as 0 | 1 | 2)}>
        <strong>Terreno {index + 1}</strong>
        <div>Rival: {line[player === "P1" ? "P2" : "P1"].map(c => <span className="played" key={c.instanceId}>{c.visibility?.top.covered ? "✕" : symbols[c.definition.topElement]} / {c.visibility?.bottom.covered ? "✕" : symbols[c.definition.bottomElement]}</span>)}</div>
        <div>Propio: {line[player].map(c => <span className="played" key={c.instanceId}>{c.visibility?.top.covered ? "✕" : symbols[c.definition.topElement]} / {c.visibility?.bottom.covered ? "✕" : symbols[c.definition.bottomElement]}</span>)}</div>
      </button>)}
    </section>
    <section><h2>Mano de {player} ({hand.length})</h2><div className="hand">
      {hand.map(c => <button key={c.instanceId} className={"card " + (selected === c.instanceId ? "active" : "")} onClick={() => setSelected(c.instanceId)}>
        <span>{symbols[c.definition.topElement]}</span><small>{c.definition.name}</small><span>{symbols[c.definition.bottomElement]}</span>
      </button>)}
    </div></section>
    <section className="actions"><p>Seleccionada: {selectedCard?.definition.name ?? "ninguna"} · Terreno {terrain + 1}</p>
      <div className="controls"><button className={placement === "TOP" ? "active" : ""} onClick={() => setPlacement("TOP")}>Arriba</button><button className={placement === "BOTTOM" ? "active" : ""} onClick={() => setPlacement("BOTTOM")}>Abajo</button><button className={overlayOrder === "NEW_OVER_OLD" ? "active" : ""} onClick={() => setOverlayOrder("NEW_OVER_OLD")}>Nueva tapa</button><button className={overlayOrder === "OLD_OVER_NEW" ? "active" : ""} onClick={() => setOverlayOrder("OLD_OVER_NEW")}>Anterior tapa</button><button disabled={game.phase !== "PLAYING"} onClick={submit}>Jugar carta</button></div>
      <p role="status">{message}</p><div className="controls"><button disabled={game.phase !== "PLAYING" || game.players.P1.played !== totalCards || game.players.P2.played !== totalCards} onClick={closeRound}>Resolver ronda</button><button disabled={game.phase !== "ROUND_FINISHED"} onClick={advanceRound}>Siguiente ronda</button></div>
    </section>
    <section><h2>Historial</h2><ol>{game.log.slice(-8).map((entry, i) => <li key={i}>{entry}</li>)}</ol></section>
  </main>;
}
