import type { CardInstance } from "../domain/game/state";
import type { ElementType } from "../domain/types";
import { visibilityOf } from "../domain/game/overlay";
import { componentValue, lineScore } from "../domain/game/combat";

export const marks: Record<ElementType,string> = {
  SWORD:"⚔", SHIELD:"⬟", ARCHERY:"➶", WALL:"▤", GOLD:"●", HEAL:"✚", CATAPULT:"✹",
};
export const names: Record<ElementType,string> = {
  SWORD:"Espadas", SHIELD:"Escudo", ARCHERY:"Arco", WALL:"Muralla",
  GOLD:"Oro", HEAL:"Curación", CATAPULT:"Catapulta",
};
const face = (card:CardInstance, position:"top"|"bottom") => {
  const element = position === "top" ? card.definition.topElement : card.definition.bottomElement;
  const covered = visibilityOf(card)[position].covered;
  const activated = visibilityOf(card)[position].activated;
  const value = componentValue(card,element);
  return <div className={"chain-face type-"+element.toLowerCase()+(covered?" is-covered":"")} title={names[element]+": "+value+(covered?" (tapado)":" (visible)")}>
    <span className="face-icon" aria-hidden="true">{marks[element]}</span>
    <strong>{value}</strong>
    <small>{covered?"TAPADO":activated?"ACTIVADO":names[element]}</small>
  </div>;
};
export function BattleCard({card,compact=false,first=false}:{card:CardInstance;compact?:boolean;first?:boolean}) {
  return <div className={"battle-card"+(compact?" compact":"")} aria-label={card.definition.name}>
    <div className="battle-card-title"><span>{card.definition.name}</span>{card.definition.printedWalls ? <span title="Muralla impresa" className="printed-wall">▤ {card.definition.printedWalls}</span>:null}</div>
    {face(card,"top")}
    <div className="card-joint" aria-hidden="true">◆</div>
    {face(card,"bottom")}
    {first?<div className="terrain-under-note">La primera carta queda bajo el terreno</div>:null}
  </div>;
}
/** La cadena es un eje físico, no una fila de fichas paralelas.
 * En la vista del rival se invierte SOLO el orden vertical de dibujo:
 * los textos y símbolos siempre miran al jugador que tiene el turno.
 * El motor conserva el orden original [TOP ... BOTTOM].
 */
export function chainForViewer(chain:readonly CardInstance[], side:"rival"|"propio"):CardInstance[] {
  return side==="rival" ? [...chain].reverse() : [...chain];
}
export function BattleChain({chain,label,side="propio"}:{chain:readonly CardInstance[];label:string;side?:"rival"|"propio"}) {
  const score=lineScore(chain);
  const shown=chainForViewer(chain,side);
  return <div className={"battle-chain chain-"+side} data-chain-side={side}>
    <div className="chain-heading"><span>{label}</span><small>⚔ {score.swords} · ⬟ {score.shields} · ▤ {score.walls}</small></div>
    {chain.length===0?<div className="empty-chain">Sin cartas</div>:
      <div className="chain-scroll"><div className="chain-stack" role="list" aria-label={"Cadena de "+label}>
        {shown.map((card,i)=><div key={card.instanceId} className="chain-layer" role="listitem"
          data-card-id={card.instanceId} data-chain-position={i+1}
          style={{zIndex:i+1}}>
          <BattleCard card={card} compact first={card.instanceId===chain[0].instanceId}/>
        </div>)}
      </div></div>}
    {chain.length>0?<div className="chain-endpoint">
      {side==="rival"?"Extremo rival · cartas orientadas hacia vos":"Extremo propio · encadená arriba o abajo"}
    </div>:null}
  </div>;
}
