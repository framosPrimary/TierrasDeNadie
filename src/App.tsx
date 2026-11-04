import { useState } from "react";
import { type GameState } from "./domain/game/state";
import { playCard } from "./domain/game/playCard";
import { finishRound } from "./domain/game/finishRound";
import { nextRound, startMatch } from "./domain/game/match";
import { buyMarket, closeMarket } from "./domain/game/market";
import { offerHeroes, chooseHeroes, swapHero } from "./domain/game/heroes";
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
// Selección hotseat de demostración. Solo Cleptan tiene efecto de héroe implementado.
const demoHeroes = ["Cleptan", ...Array.from({length:9}, (_,i) => "Héroe demo " + (i+2))];
const offerDemo = (state: GameState) => {
  const pool = [...demoHeroes].sort(() => Math.random() - 0.5);
  return offerHeroes(state, pool.slice(0,4), pool.slice(4,8));
};
const fresh = () => offerDemo(startMatch(demoDeck()));

export function App() {
  const [game, setGame] = useState<GameState>(fresh);
  const [selected, setSelected] = useState<string | null>(null);
  const [heroFirst, setHeroFirst] = useState("");
  const [heroSecond, setHeroSecond] = useState("");
  const [heroActive, setHeroActive] = useState("");
  const [marketDiscard, setMarketDiscard] = useState("");
  const [tradeReturns, setTradeReturns] = useState<string[]>([]);
  const [terrain, setTerrain] = useState<0 | 1 | 2>(0);
  const [placement, setPlacement] = useState<Placement>("TOP");
  const [overlayOrder, setOverlayOrder] = useState<OverlayOrder>("NEW_OVER_OLD");
  const [message, setMessage] = useState("Elegí una carta y una línea para jugar.");
  const marketPlayer = game.players.P1.marketOpen ? "P1" : game.players.P2.marketOpen ? "P2" : null;
  const player = game.currentPlayer;
  const hand = game.players[player].hand;
  const selectedCard = hand.find(c => c.instanceId === selected);
  const selectionPlayer = !game.players.P1.hero?.selected ? "P1" : !game.players.P2.hero?.selected ? "P2" : null;
  const heroesReady = Boolean(game.players.P1.hero?.revealed && game.players.P2.hero?.revealed);
  function confirmHeroes() {
    if (!selectionPlayer || !heroFirst || !heroSecond || !heroActive) return setMessage("Elegí dos héroes y el titular.");
    try {
      const updated = chooseHeroes(game, selectionPlayer, [heroFirst, heroSecond], heroActive);
      setGame(updated);
      setHeroFirst(""); setHeroSecond(""); setHeroActive("");
      setMessage(updated.players.P1.hero?.revealed ? "Héroes titulares revelados; comienza el duelo." : "Selección guardada. Pasá el dispositivo al otro jugador.");
    } catch (e) { setMessage(e instanceof Error ? e.message : "Selección inválida"); }
  }
  function useSwap() {
    try { setGame(swapHero(game, player)); setMessage(player + " utilizó su enroque."); }
    catch (e) { setMessage(e instanceof Error ? e.message : "No se puede enrocar"); }
  }

  function submit() {
    if (!selected) return setMessage("Primero seleccioná una carta.");
    const result = playCard(game, { playerId: player, instanceId: selected, terrainIndex: terrain, placement, overlayOrder });
    if (!result.ok) return setMessage(result.reason);
    setGame(result.state);
    setSelected(null);
    setMessage("Carta jugada. Turno de " + result.state.currentPlayer);
  }

  function buyHeal() {
    if (!marketPlayer) return;
    const r = buyMarket(game, { playerId: marketPlayer, kind: "HEAL_TWO" });
    if (r.ok) { setGame(r.state); setMessage("Curación comprada."); }
    else setMessage(r.reason);
  }
  function buyCatapult() {
    if (!marketPlayer) return;
    const r = buyMarket(game, { playerId: marketPlayer, kind: "CATAPULT", terrainIndex: terrain });
    if (r.ok) { setGame(r.state); setMessage("Catapulta contratada."); }
    else setMessage(r.reason);
  }
  function buyExchange() {
    if (!marketPlayer) return;
    const r = buyMarket(game, { playerId: marketPlayer, kind: "EXCHANGE", discardId: marketDiscard });
    if (r.ok) { setGame(r.state); setMessage("Intercambio realizado."); }
    else setMessage(r.reason);
  }
  function buySteal() {
    if (!marketPlayer) return;
    const rival = marketPlayer === "P1" ? "P2" : "P1";
    const ids = game.players[rival].hand.slice(0, 2).map(card => card.instanceId);
    if (ids.length !== 2) return setMessage("El rival necesita dos cartas en mano.");
    const r = buyMarket(game, { playerId: marketPlayer, kind: "STEAL", candidates: [ids[0], ids[1]], returnIds: [tradeReturns[0], tradeReturns[1]] });
    if (r.ok) { setGame(r.state); setMessage("Carta obtenida."); }
    else setMessage(r.reason);
  }
  function buyExtra() {
    if (!marketPlayer) return;
    const r = buyMarket(game, { playerId: marketPlayer, kind: "EXTRA_CARD", terrainIndex: terrain, placement, overlayOrder });
    if (r.ok) { setGame(r.state); setMessage("Carta extra jugada inmediatamente."); }
    else setMessage(r.reason);
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
      setGame(offerDemo(nextRound(game)));
      setSelected(null);
      setHeroFirst(""); setHeroSecond(""); setHeroActive("");
      setMessage("Nueva ronda: cartas repartidas, deben seleccionar héroes.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "No se pudo repartir"); }
  }
  const totalCards = game.round >= 4 ? 5 : 10;
  return <main className="shell">
    <header><p className="eyebrow">Prototipo jugable local · alpha experimental</p><h1>Tierras de Nadie</h1><p>Prueba local 1 vs 1 · mazo ficticio de 50 cartas · ciclo de rondas experimental</p></header>
    <section className="status"><strong>Ronda {game.round} · {game.phase === "PLAYING" ? "Turno: " + player : game.phase === "GAME_FINISHED" ? "Ganador: " + (game.winner ?? "empate") : "Ronda terminada"}</strong><span>Daño recibido P1: {game.players.P1.damageReceived} · P2: {game.players.P2.damageReceived} · Oro P1: {game.players.P1.gold} · P2: {game.players.P2.gold}</span><button onClick={() => { setGame(fresh()); setSelected(null); setMessage("Nueva prueba iniciada."); }}>Reiniciar</button></section>
    {game.phase === "PLAYING" && selectionPlayer && <section className="actions">
      <h2>Selección de héroes · {selectionPlayer}</h2>
      <p>Modo local por turnos: solo el jugador indicado debe mirar la pantalla durante su selección. Los héroes demo no tienen habilidades programadas, salvo Cleptan.</p>
      <div className="controls">
        <label>Primer héroe <select value={heroFirst} onChange={e => setHeroFirst(e.target.value)}><option value="">Elegir</option>{game.players[selectionPlayer].hero?.offered.map(id => <option key={id} value={id}>{id}</option>)}</select></label>
        <label>Segundo héroe <select value={heroSecond} onChange={e => setHeroSecond(e.target.value)}><option value="">Elegir</option>{game.players[selectionPlayer].hero?.offered.map(id => <option key={id} value={id}>{id}</option>)}</select></label>
        <label>Titular <select value={heroActive} onChange={e => setHeroActive(e.target.value)}><option value="">Elegir</option>{[heroFirst,heroSecond].filter(Boolean).map(id => <option key={id} value={id}>{id}</option>)}</select></label>
        <button onClick={confirmHeroes}>Confirmar selección</button>
      </div>
    </section>}
    {heroesReady && game.phase === "PLAYING" && <section className="actions">
      <p>Héroe titular P1: {game.players.P1.hero?.active} · P2: {game.players.P2.hero?.active}</p>
      <button onClick={useSwap} disabled={!game.players[player].hero || game.players[player].hero!.swapUsed || game.players[player].hero!.reserveSuspended}>Enroque de {player}</button>
    </section>}
    {heroesReady && <section className="board">
      {game.terrains.map((line, index) => <button key={index} className={"terrain " + (terrain === index ? "active" : "")} onClick={() => setTerrain(index as 0 | 1 | 2)}>
        <strong>Terreno {index + 1}</strong>
        <div>Rival: {line[player === "P1" ? "P2" : "P1"].map(c => <span className="played" key={c.instanceId}>{c.visibility?.top.covered ? "✕" : symbols[c.definition.topElement]} / {c.visibility?.bottom.covered ? "✕" : symbols[c.definition.bottomElement]}</span>)}</div>
        <div>Propio: {line[player].map(c => <span className="played" key={c.instanceId}>{c.visibility?.top.covered ? "✕" : symbols[c.definition.topElement]} / {c.visibility?.bottom.covered ? "✕" : symbols[c.definition.bottomElement]}</span>)}</div>
      </button>)}
    </section>}
    {heroesReady && <section><h2>Mano de {player} ({hand.length})</h2><div className="hand">
      {hand.map(c => <button key={c.instanceId} className={"card " + (selected === c.instanceId ? "active" : "")} onClick={() => setSelected(c.instanceId)}>
        <span>{symbols[c.definition.topElement]}</span><small>{c.definition.name}</small><span>{symbols[c.definition.bottomElement]}</span>
      </button>)}
    </div></section>}
    {heroesReady && <section className="actions"><p>Seleccionada: {selectedCard?.definition.name ?? "ninguna"} · Terreno {terrain + 1}</p>
      <div className="controls"><button className={placement === "TOP" ? "active" : ""} onClick={() => setPlacement("TOP")}>Arriba</button><button className={placement === "BOTTOM" ? "active" : ""} onClick={() => setPlacement("BOTTOM")}>Abajo</button><button className={overlayOrder === "NEW_OVER_OLD" ? "active" : ""} onClick={() => setOverlayOrder("NEW_OVER_OLD")}>Nueva tapa</button><button className={overlayOrder === "OLD_OVER_NEW" ? "active" : ""} onClick={() => setOverlayOrder("OLD_OVER_NEW")}>Anterior tapa</button><button disabled={game.phase !== "PLAYING" || !heroesReady} onClick={submit}>Jugar carta</button></div>
      <p role="status">{message}</p><div className="controls"><button disabled={game.phase !== "PLAYING" || game.players.P1.played !== totalCards || game.players.P2.played !== totalCards} onClick={closeRound}>Resolver ronda</button><button disabled={game.phase !== "ROUND_FINISHED"} onClick={advanceRound}>Siguiente ronda</button></div>
    </section>}
    {marketPlayer && <section className="actions"><h2>Mercado · {marketPlayer}</h2><p>Se habilitó al activar oro. Elegí una compra o cerrá el Mercado.</p><div className="controls"><button onClick={buyHeal}>Curar 2 (2 oro)</button><button onClick={buyCatapult}>Catapulta en terreno {terrain + 1} (3 oro)</button><label>Carta a descartar <select value={marketDiscard} onChange={e => setMarketDiscard(e.target.value)}><option value="">Elegir</option>{game.players[marketPlayer].hand.map(card => <option key={card.instanceId} value={card.instanceId}>{card.definition.name}</option>)}</select></label><button onClick={buyExchange}>Cambiar carta (1 oro)</button><label>Devolver 2 cartas al rival (seleccionar 2) <select multiple value={tradeReturns} onChange={e => setTradeReturns(Array.from(e.target.selectedOptions).map(o => o.value))}>{[...game.players[marketPlayer].hand, ...game.players[marketPlayer === "P1" ? "P2" : "P1"].hand.slice(0, 2)].map(card => <option key={card.instanceId} value={card.instanceId}>{card.definition.name}</option>)}</select></label><button onClick={buySteal}>Tomar carta rival (2 oro)</button><button onClick={buyExtra}>Comprar carta extra (3 oro)</button><button onClick={() => setGame(closeMarket(game, marketPlayer))}>Cerrar Mercado</button></div></section>}
    <section><h2>Historial</h2><ol>{game.log.slice(-8).map((entry, i) => <li key={i}>{entry}</li>)}</ol></section>
  </main>;
}
