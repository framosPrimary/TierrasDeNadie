import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MarketPanel } from "./MarketPanel";
import type { CardInstance } from "../domain/game/state";

const own:CardInstance[]=["a","b","c"].map(id=>({instanceId:id,definition:{id,name:"Carta "+id,topElement:"SWORD",bottomElement:"GOLD"}}));
const rival:CardInstance[]=["x","y"].map(id=>({instanceId:id,definition:{id,name:"Rival "+id,topElement:"SHIELD",bottomElement:"SWORD"}}));
const noop=()=>{};
function render(gold:number,discardId="",returnIds:string[]=[]){
  return renderToStaticMarkup(createElement(MarketPanel,{
    playerId:"P1",gold,terrainIndex:2,ownHand:own,rivalHandCount:2,rivalCandidates:rival,
    discardId,returnIds,
    onDiscardChange:noop,onReturnsChange:noop,onHeal:noop,onCatapult:noop,
    onExtraCard:noop,onExchange:noop,onSteal:noop,onClose:noop,
  }));
}
describe("Sprint visual 01: Mercado",()=>{
  it("muestra compras y oro legibles con coste",()=>{
    const html=render(3);
    expect(html).toContain("Mercado");
    expect(html).toContain('aria-label="3 oro disponible"');
    expect(html).toContain("Curar 2 puntos de daño");
    expect(html).toContain("terreno 3");
    expect(html).toContain("Cerrar Mercado");
  });
  it("deshabilita las compras si no alcanza el saldo",()=>{
    const html=render(0);
    expect((html.match(/disabled=""/g)||[]).length).toBeGreaterThanOrEqual(5);
  });
  it("muestra la carta a descartar y permite devolver cartas rivales entre las dos seleccionadas",()=>{
    const html=render(2,"a",["a","x"]);
    expect(html).toContain("Esta carta irá al descarte");
    expect(html).toContain("Rival x");
    expect(html).toContain("(tomada del rival)");
    expect(html).toContain("2 de 2 seleccionadas");
  });
});
