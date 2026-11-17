import type { CardInstance } from "../domain/game/state";
import type { PlayerId } from "../domain/types";
import { BattleCard } from "./BattleCard";

type MarketPanelProps = {
  playerId: PlayerId;
  gold: number;
  terrainIndex: number;
  ownHand: CardInstance[];
  rivalHandCount: number;
  discardId: string;
  returnIds: string[];
  onDiscardChange: (id: string) => void;
  onReturnsChange: (ids: string[]) => void;
  onHeal: () => void;
  onCatapult: () => void;
  onExtraCard: () => void;
  onExchange: () => void;
  onSteal: () => void;
  onClose: () => void;
};

/** Presentación de Mercado para el Sprint 01. Las reglas se mantienen en buyMarket. */
export function MarketPanel({
  playerId, gold, terrainIndex, ownHand, rivalHandCount, discardId,
  returnIds, onDiscardChange, onReturnsChange, onHeal, onCatapult,
  onExtraCard, onExchange, onSteal, onClose,
}: MarketPanelProps) {
  const discardCard = ownHand.find(card => card.instanceId === discardId);
  const affordable = (cost: number) => gold >= cost;
  const tradesAvailable = ownHand.length >= 2 && rivalHandCount >= 2;
  return <section className="market-area market-stall" aria-label={"Mercado de "+playerId}>
    <header className="market-title">
      <div><p className="overline">PLAZA DE LOS TRATOS · {playerId}</p><h2>Mercado</h2>
        <p>El mercado queda abierto hasta que decidas cerrarlo. Cada compra descuenta oro.</p></div>
      <div className="market-purse" aria-label={gold+" oro disponible"}><span aria-hidden="true">●</span><strong>{gold}</strong><small>ORO</small></div>
    </header>
    <div className="market-offers">
      <button className="market-offer" onClick={onHeal} disabled={!affordable(2)}>
        <span className="offer-symbol" aria-hidden="true">✚</span><strong>Curandera</strong><span>Curar 2 puntos de daño</span><b>● 2</b>
      </button>
      <button className="market-offer" onClick={onCatapult} disabled={!affordable(3)}>
        <span className="offer-symbol" aria-hidden="true">✹</span><strong>Alquilar catapulta</strong><span>Ataca la última carta rival del terreno {terrainIndex+1}</span><b>● 3</b>
      </button>
      <button className="market-offer" onClick={onExtraCard} disabled={!affordable(3)}>
        <span className="offer-symbol" aria-hidden="true">▣</span><strong>Una carta más</strong><span>Roba y encadena inmediatamente en terreno {terrainIndex+1} (provisional)</span><b>● 3</b>
      </button>
    </div>
    <div className="market-trades">
      <div className="trade-booth">
        <div className="trade-heading"><div><h3>Trueque de cartas</h3><p>Elegís una carta para descartar y recibís una nueva del mazo.</p></div><strong>● 1</strong></div>
        <label>La carta que entregás
          <select value={discardId} onChange={e=>onDiscardChange(e.target.value)}>
            <option value="">Seleccionar carta</option>
            {ownHand.map(card=><option key={card.instanceId} value={card.instanceId}>{card.definition.name}</option>)}
          </select>
        </label>
        {discardCard ? <div className="trade-preview"><BattleCard card={discardCard} compact/><p>Esta carta irá al descarte. La nueva carta aparecerá en tu mano.</p></div>:null}
        <button onClick={onExchange} disabled={!affordable(1)||!discardCard}>Descartar y robar</button>
      </div>
      <div className="trade-booth">
        <div className="trade-heading"><div><h3>Trato con el rival</h3><p>Intercambio de dos por dos. La selección rival sigue siendo provisional.</p></div><strong>● 2</strong></div>
        <label>Elegí dos cartas para devolver
          <select aria-label="Elegí dos cartas para devolver" multiple value={returnIds} onChange={e=>onReturnsChange(Array.from(e.target.selectedOptions).map(o=>o.value).slice(0,2))}>
            {ownHand.map(card=><option key={card.instanceId} value={card.instanceId}>{card.definition.name}</option>)}
          </select>
        </label>
        <p className="trade-counter">{returnIds.length} de 2 seleccionadas · El rival tiene {rivalHandCount} cartas</p>
        <button disabled={!affordable(2)||!tradesAvailable||returnIds.length!==2} onClick={onSteal}>Confirmar trato</button>
      </div>
    </div>
    <footer className="market-footer"><p>El Mercado no consume tu siguiente jugada normal. Cerralo cuando termines tus compras.</p>
      <button className="primary" onClick={onClose}>Cerrar Mercado · pasar dispositivo</button>
    </footer>
  </section>;
}
