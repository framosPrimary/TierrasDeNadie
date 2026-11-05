import { useState } from "react";
import { overlay, visibleElements } from "../domain/game/overlay";
import { componentValue, lineScore } from "../domain/game/combat";
import type { CardInstance } from "../domain/game/state";
import { BattleCard, names } from "./BattleCard";
const sword:CardInstance = {instanceId:"GUIDE-SWORD",definition:{id:"GUIDE-SWORD",name:"Espada y muralla",topElement:"SHIELD",bottomElement:"SWORD",values:{SHIELD:2,SWORD:3},printedWalls:1}};
const bow:CardInstance = {instanceId:"GUIDE-BOW",definition:{id:"GUIDE-BOW",name:"Arco inferior",topElement:"SWORD",bottomElement:"ARCHERY",values:{SWORD:1,ARCHERY:2}}};
const descriptions = [
  "Seleccioná el terreno. Todavía no hay cartas encadenadas.",
  "Primera carta por debajo del terreno: se activa espada 3 y conserva la muralla impresa.",
  "Segunda carta por debajo: la espada de la primera permanece visible; la parte superior de la nueva queda tapada y el arco 2 se activa.",
];
export function ChainTutorial(){
  const [step,setStep]=useState(0);
  const first=overlay([],sword,"BOTTOM","NEW_OVER_OLD").chain;
  const second=overlay(first,bow,"BOTTOM","OLD_OVER_NEW").chain;
  const chain=step===0?[]:step===1?first:second;
  const score=lineScore(chain);
  const visible=visibleElements(chain).map(face=>{
    const card=chain.find(c=>c.instanceId===face.instanceId)!;
    return names[face.element]+" "+componentValue(card,face.element);
  });
  return <section className="tutorial-panel" aria-label="Demostración guiada del encadenamiento">
    <div className="tutorial-top"><div><p className="overline">MODO PROFE · EJEMPLO INTERACTIVO</p><h2>¿Cómo se encadenan las cartas?</h2><p>Este ejemplo simplificado utiliza el mismo motor de superposición que las jugadas reales.</p></div><div className="tutorial-step">PASO {step+1} DE 3</div></div>
    <div className="tutorial-content">
      <div className="tutorial-chain">
        <div className="demo-terrain">TERRENO CENTRAL</div>
        {chain.length===0?<p className="demo-empty">Elegí «Siguiente» para colocar la primera carta.</p>:<div className="tutorial-stack">{chain.map((card,i)=><div className="tutorial-card" key={card.instanceId}><BattleCard card={card} first={i===0}/></div>)}</div>}
      </div>
      <div className="tutorial-explanation"><h3>{step===0?"Terreno vacío":step===1?"Espada y muralla":"Espada + arco"}</h3><p>{descriptions[step]}</p>
        <div className="tutorial-stats"><span>⚔ {score.swords} espadas</span><span>▤ {score.walls} murallas</span>{step===2?<span>➶ 2 arco activado</span>:null}</div>
        <p className="overline">ELEMENTOS VISIBLES</p>
        <div className="tutorial-elements">{visible.length?visible.map((v,i)=><span key={i}>◆ {v}</span>):"Ninguno"}</div>
        <p className="tutorial-warning">El arco genera daño inmediato al activarse. Los efectos ya ocurridos no vuelven a dispararse por mirar o destapar una carta.</p>
        <div className="tutorial-buttons"><button onClick={()=>setStep(Math.max(0,step-1))} disabled={step===0}>← Anterior</button><button className="primary" onClick={()=>setStep(step===2?0:step+1)}>{step===2?"↺ Repetir":"Siguiente →"}</button></div>
      </div>
    </div>
  </section>;
}
