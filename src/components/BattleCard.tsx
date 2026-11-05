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
export function BattleChain({chain,label}:{chain:readonly CardInstance[];label:string}) {
  const score=lineScore(chain);
  return <div className="battle-chain">
    <div className="chain-heading"><span>{label}</span><small>⚔ {score.swords} · ⬟ {score.shields} · ▤ {score.walls}</small></div>
    {chain.length===0?<div className="empty-chain">Sin cartas</div>:
      <div className="chain-scroll"><div className="chain-stack">
        {chain.map((card,i)=><div key={card.instanceId} className="chain-layer" style={{zIndex:i+1}}>
          <BattleCard card={card} compact first={i===0}/>
        </div>)}
      </div></div>}
  </div>;
}
