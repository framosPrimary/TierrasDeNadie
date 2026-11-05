import { useState } from "react";
import { type GameState } from "./domain/game/state";
import { playCard } from "./domain/game/playCard";
import { finishRound } from "./domain/game/finishRound";
import { nextRound, startMatch } from "./domain/game/match";
import { buyMarket, closeMarket } from "./domain/game/market";
import { offerHeroes, chooseHeroes, swapHero } from "./domain/game/heroes";
import { chooseStarter } from "./domain/game/initiative";
import type { OverlayOrder } from "./domain/game/overlay";
import type { ElementType, Placement } from "./domain/types";
import { BattleCard, BattleChain, marks, names } from "./components/BattleCard";
import { ChainTutorial } from "./components/ChainTutorial";

const demoDeck = () => {
  const elements: ElementType[] = ["SWORD", "GOLD", "SHIELD", "ARCHERY", "WALL", "HEAL", "CATAPULT"];
  return Array.from({ length: 50 }, (_, i) => ({
    id: "DEMO-" + i, name: "Nº " + (i + 1),
    topElement: elements[i % 7], bottomElement: elements[(i + 1) % 7],
    values: { [elements[i % 7]]: 1 + (i % 3), [elements[(i + 1) % 7]]: 1 }, printedWalls: i % 11 === 0 ? 1 : 0,
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
  const [handoff, setHandoff] = useState(false);
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
  const handOwner = marketPlayer ?? player;
  const hand = game.players[handOwner].hand;
  const selectedCard = hand.find(c => c.instanceId === selected);
  const selectionPlayer = !game.players.P1.hero?.selected ? "P1" : !game.players.P2.hero?.selected ? "P2" : null;
  const heroesReady = Boolean(game.players.P1.hero?.revealed && game.players.P2.hero?.revealed);
  function confirmHeroes() {
    if (!selectionPlayer || !heroFirst || !heroSecond || !heroActive) return setMessage("Elegí dos héroes y el titular.");
    try {
      const updated = chooseHeroes(game, selectionPlayer, [heroFirst, heroSecond], heroActive);
      setGame(updated);
      setHandoff(true);
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
    setHandoff(!result.state.players[player].marketOpen);
    setSelected(null);
    setMessage(result.state.players[player].marketOpen ? "Carta jugada. Terminá tus compras de Mercado antes de pasar el turno." : "Carta jugada. Turno de " + result.state.currentPlayer);
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
      setHandoff(true);
      setSelected(null);
      setHeroFirst(""); setHeroSecond(""); setHeroActive("");
      setMessage("Nueva ronda: cartas repartidas, deben seleccionar héroes.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "No se pudo repartir"); }
  }
  const totalCards = game.round >= 4 ? 5 : 10;
  function beginRound(starter: "P1" | "P2") {
    try {
      if (!game.starterPicker) return;
      setGame(chooseStarter(game, game.starterPicker, starter));
      setHandoff(true);
      setMessage("Iniciativa definida. Pasá el dispositivo al jugador que comienza.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "No se pudo elegir inicio."); }
  }
  const rival = handOwner === "P1" ? "P2" : "P1";
  const terrainNames = ["Ruinas del Vado", "Páramo Rojo", "Paso Helado"];
  const phases = ["Elegí una carta de tu mano", "Elegí el terreno", "Indicá extremo y superposición", "Encadená la carta"];
  const activeTotal = game.players.P1.played + game.players.P2.played;
  if (handoff) return <main className="pixel-app handoff-page">
    <div className="handoff-card">
      <div className="seal">T · N</div>
      <p className="overline">TIERRAS DE NADIE · MODO LOCAL</p>
      <h1>Pasá el dispositivo</h1>
      <p>Para proteger las cartas del otro jugador, la mano y el tablero se mantienen ocultos.</p>
      <button className="primary" onClick={() => setHandoff(false)}>Estoy listo · mostrar partida</button>
    </div>
  </main>;
  return <main className="pixel-app">
    <header className="game-header">
      <div className="brand"><span className="brand-mark">✥</span><div><p className="overline">EDICIÓN DE PRUEBA · MOTOR Y ENCADENAMIENTO</p><h1>Tierras de Nadie</h1></div></div>
      <div className="game-header-meta"><span>RONDA <strong>{game.round}</strong></span><span>JUGADAS <strong>{game.players.P1.played}/{totalCards} · {game.players.P2.played}/{totalCards}</strong></span><button className="secondary reset" onClick={() => {setGame(fresh());setHandoff(false);setSelected(null);setMessage("Comienza una nueva partida.");}}>↺ Reiniciar</button></div>
    </header>
    <div className="prototype-banner">PROTOTIPO DE REGLAS CON INTERFAZ VISUAL PROVISIONAL · Las cartas reales y los báculos todavía están pendientes</div>
    <ChainTutorial/>
    {game.phase === "PLAYING" && selectionPlayer && <section className="selection-panel">
      <div><p className="overline">PREPARACIÓN</p><h2>Elegir héroes · {selectionPlayer}</h2><p>Cada jugador elige dos de cuatro héroes ofrecidos. Solo Cleptan tiene habilidad implementada en esta demo.</p></div>
      <div className="selection-fields">
        <label>Primer héroe<select value={heroFirst} onChange={e=>setHeroFirst(e.target.value)}><option value="">Elegir</option>{game.players[selectionPlayer].hero?.offered.map(id=><option key={id} value={id}>{id}</option>)}</select></label>
        <label>Segundo héroe<select value={heroSecond} onChange={e=>setHeroSecond(e.target.value)}><option value="">Elegir</option>{game.players[selectionPlayer].hero?.offered.map(id=><option key={id} value={id}>{id}</option>)}</select></label>
        <label>Titular<select value={heroActive} onChange={e=>setHeroActive(e.target.value)}><option value="">Elegir</option>{[heroFirst,heroSecond].filter(Boolean).map(id=><option key={id} value={id}>{id}</option>)}</select></label>
        <button className="primary" onClick={confirmHeroes}>Guardar y pasar dispositivo</button>
      </div>
    </section>}
    {heroesReady && game.starterPicker && game.phase === "PLAYING" && <section className="selection-panel"><div><h2>¿Quién comienza?</h2><p>El jugador {game.starterPicker} elige la iniciativa para esta ronda.</p></div><div className="selection-fields"><button onClick={()=>beginRound("P1")}>Empieza P1</button><button onClick={()=>beginRound("P2")}>Empieza P2</button></div></section>}
    {heroesReady && !game.starterPicker && <>
      <section className="duel-bar">
        <div className="duelist opponent"><div className="hero-avatar"><img src="/art/hero-rival.svg" alt="Retrato provisional del rival"/></div><div><small>RIVAL · {rival}</small><strong>{game.players[rival].hero?.active ?? "Sin héroe"}</strong><span>Daño recibido: {game.players[rival].damageReceived} · Mano: {game.players[rival].hand.length}</span></div></div>
        <div className="turn-banner">{game.phase === "PLAYING" ? (marketPlayer ? "MERCADO ABIERTO" : "TURNO DE "+player) : game.phase==="GAME_FINISHED" ? ("FIN · "+(game.winner??"EMPATE")):"RONDA RESUELTA"}</div>
        <div className="duelist yours"><div className="hero-avatar"><img src="/art/hero-player.svg" alt="Retrato provisional del jugador"/></div><div><small>VISTA ACTUAL · {handOwner}</small><strong>{game.players[handOwner].hero?.active ?? "Sin héroe"}</strong><span>Daño recibido: {game.players[handOwner].damageReceived} · Oro: {game.players[handOwner].gold}</span></div></div>
      </section>
      <section className="battle-layout">
        <div className="board-wrap">
          <div className="board-heading"><div><p className="overline">CAMPO DE BATALLA</p><h2>Tres terrenos</h2></div><p>Arriba: rival · Abajo: jugador actual<br/>Cada carta muestra sus dos elementos. <b>TAPADO</b> no aporta.</p></div>
          <div className="terrain-grid">
            {game.terrains.map((line,index)=><div key={index} className={"terrain-panel terrain-"+index+(terrain===index?" terrain-picked":"")}>
              <div className="terrain-name"><span>0{index+1}</span><strong>{terrainNames[index]}</strong></div>
              <BattleChain chain={line[rival]} label={"Rival · "+rival}/>
              <button className="terrain-center" type="button" aria-label={"Seleccionar terreno "+(index+1)} onClick={()=>setTerrain(index as 0|1|2)}><span>TERRENO {index+1}</span><small>{terrain===index?"✓ SELECCIONADO":"ELEGIR ESTE TERRENO"}</small></button>
              <BattleChain chain={line[handOwner]} label={"Propio · "+handOwner}/>
            </div>)}
          </div>
          <p className="board-footnote">Las cartas se muestran en cadena, con la mitad superior e inferior y el estado de visibilidad calculado por el motor. La geometría exacta del destapado sigue pendiente de validación.</p>
        </div>
        <aside className="game-sidebar">
          <div className="side-panel">
            <p className="overline">COMBATE</p><h3>Resumen</h3>
            <div className="score-row"><span>{rival} · daño</span><strong>{game.players[rival].damageReceived}</strong></div>
            <div className="score-row"><span>{handOwner} · daño</span><strong>{game.players[handOwner].damageReceived}</strong></div>
            <div className="score-row"><span>Oro disponible</span><strong>● {game.players[handOwner].gold}</strong></div>
          </div>
          {game.phase==="PLAYING" && !marketPlayer && <div className="side-panel"><p className="overline">HÉROE ACTIVO</p><h3>{game.players[player].hero?.active}</h3><p>Suplente: {game.players[player].hero?.reserve}</p><button className="secondary" onClick={useSwap} disabled={!game.players[player].hero||game.players[player].hero!.swapUsed||game.players[player].hero!.reserveSuspended}>↔ Cambiar héroe</button></div>}
          <div className="side-panel legend"><p className="overline">REFERENCIA DE SÍMBOLOS</p><h3>Elementos</h3><div className="legend-grid">{(Object.keys(marks) as ElementType[]).map(element=><span key={element}><b>{marks[element]}</b> {names[element]}</span>)}</div></div>
        </aside>
      </section>
      {game.phase==="PLAYING" && !marketPlayer && <section className="play-area">
        <div className="hand-heading"><div><p className="overline">TU MANO · {handOwner}</p><h2>Elegí una carta</h2></div><p>{hand.length} restantes · Tocá una carta para seleccionarla</p></div>
        <div className="hand">{hand.map(card=><button type="button" key={card.instanceId} aria-pressed={selected===card.instanceId} className={"hand-card"+(selected===card.instanceId?" selected":"")} onClick={()=>setSelected(card.instanceId)}><BattleCard card={card}/></button>)}</div>
        <div className="placement-desk">
          <div className="placement-caption"><p className="overline">ENCADENAMIENTO</p><strong>{selectedCard?selectedCard.definition.name:"Seleccioná una carta de tu mano"}</strong><small>{phases[selectedCard?2:0]}</small></div>
          <fieldset className="choice-group"><legend>Extremo de cadena</legend><button className={placement==="TOP"?"is-on":""} onClick={()=>setPlacement("TOP")}>↑ Arriba</button><button className={placement==="BOTTOM"?"is-on":""} onClick={()=>setPlacement("BOTTOM")}>↓ Abajo</button></fieldset>
          <fieldset className="choice-group"><legend>Superposición</legend><button className={overlayOrder==="NEW_OVER_OLD"?"is-on":""} onClick={()=>setOverlayOrder("NEW_OVER_OLD")}>Nueva tapa</button><button className={overlayOrder==="OLD_OVER_NEW"?"is-on":""} onClick={()=>setOverlayOrder("OLD_OVER_NEW")}>Anterior tapa</button></fieldset>
          <button className="primary play-now" disabled={!selectedCard || game.phase!=="PLAYING"} onClick={submit}>Encadenar en terreno {terrain+1}</button>
        </div>
      </section>}
      {marketPlayer && <section className="market-area"><div><p className="overline">MERCADO · {marketPlayer}</p><h2>Gastá tu oro</h2><p>Comprá varias veces si tenés saldo. Para catapulta y carta extra se usa el terreno seleccionado ({terrain+1}).</p></div>
        <div className="market-actions"><button onClick={buyHeal}>● 2 · Curar dos</button><button onClick={buyCatapult}>● 3 · Catapulta</button><button onClick={buyExtra}>● 3 · Carta extra inmediata</button><label>Descartar y robar · ● 1<select value={marketDiscard} onChange={e=>setMarketDiscard(e.target.value)}><option value="">Elegir carta</option>{game.players[marketPlayer].hand.map(card=><option key={card.instanceId} value={card.instanceId}>{card.definition.name}</option>)}</select><button onClick={buyExchange}>Intercambiar</button></label><label>Devolver dos cartas · ● 2<select multiple value={tradeReturns} onChange={e=>setTradeReturns(Array.from(e.target.selectedOptions).map(o=>o.value))}>{[...game.players[marketPlayer].hand,...game.players[marketPlayer==="P1"?"P2":"P1"].hand.slice(0,2)].map(card=><option key={card.instanceId} value={card.instanceId}>{card.definition.name}</option>)}</select><button onClick={buySteal}>Intercambio rival</button></label></div>
        <button className="primary" onClick={()=>{setGame(closeMarket(game,marketPlayer));setHandoff(true);}}>Cerrar Mercado · pasar dispositivo</button>
      </section>}
      {(game.phase==="ROUND_FINISHED"||game.phase==="GAME_FINISHED"||game.players.P1.played===totalCards&&game.players.P2.played===totalCards) && <section className="round-actions"><h2>{game.phase==="GAME_FINISHED"?"Partida finalizada":game.phase==="ROUND_FINISHED"?"Ronda terminada":"Los dos jugadores terminaron"}</h2>{game.phase==="PLAYING"?<button className="primary" onClick={closeRound}>Resolver combate de ronda</button>:game.phase==="ROUND_FINISHED"?<button className="primary" onClick={advanceRound}>Repartir siguiente ronda</button>:<button className="primary" onClick={()=>{setGame(fresh());setHandoff(false);}}>Nueva partida</button>}</section>}
    </>}
    <section className="game-feedback" aria-live="polite"><div className="feedback-title">REGISTRO DE ACCIONES <span>{activeTotal} cartas jugadas</span></div><p role="status">{message}</p><ol>{game.log.slice(-5).map((entry,i)=><li key={i}>{entry}</li>)}</ol></section>
  </main>;
}
