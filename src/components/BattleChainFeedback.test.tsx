import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { BattleChain, chainForViewer } from "./BattleCard";
import { overlay } from "../domain/game/overlay";
import type { CardInstance } from "../domain/game/state";

const card=(id:string):CardInstance=>({
  instanceId:id,definition:{id,name:id,topElement:"SHIELD",bottomElement:"SWORD",values:{SWORD:1,SHIELD:1}}
});

describe("Feedback Profe 11/11: cadenas largas y perspectiva",()=>{
  it("la tercera y cuarta cartas se unen al extremo de la última, no reinician la cadena en el terreno",()=>{
    const a=overlay([],card("primera"),"BOTTOM","NEW_OVER_OLD");
    const b=overlay(a.chain,card("segunda"),"BOTTOM","NEW_OVER_OLD");
    const c=overlay(b.chain,card("tercera"),"BOTTOM","NEW_OVER_OLD");
    const d=overlay(c.chain,card("cuarta"),"BOTTOM","NEW_OVER_OLD");
    expect(d.chain.map(x=>x.instanceId)).toEqual(["primera","segunda","tercera","cuarta"]);
    expect(d.chain[0].visibility?.top.covered).toBe(true);
    expect(d.chain[1].visibility?.bottom.covered).toBe(true);
    expect(d.chain[2].visibility?.bottom.covered).toBe(true);
    expect(d.chain[3].visibility?.bottom.covered).toBe(false);
    expect(d.chain.every(x=>x.instanceId.startsWith("GUIDE"))).toBe(false);
    const markup=renderToStaticMarkup(createElement(BattleChain,{chain:d.chain,label:"P1",side:"propio"}));
    expect(markup.match(/class="chain-layer"/g) ?? []).toHaveLength(4);
    expect(markup.indexOf('data-card-id="primera"')).toBeLessThan(markup.indexOf('data-card-id="segunda"'));
    expect(markup.indexOf('data-card-id="tercera"')).toBeLessThan(markup.indexOf('data-card-id="cuarta"'));
  });
  it("puede encadenar una nueva carta arriba de una cadena de tres",()=>{
    const a=overlay([],card("a"),"BOTTOM","NEW_OVER_OLD");
    const b=overlay(a.chain,card("b"),"BOTTOM","NEW_OVER_OLD");
    const c=overlay(b.chain,card("c"),"BOTTOM","NEW_OVER_OLD");
    const d=overlay(c.chain,card("d"),"TOP","NEW_OVER_OLD");
    expect(d.chain.map(x=>x.instanceId)).toEqual(["d","a","b","c"]);
    expect(d.chain[1].visibility?.top.covered).toBe(true);
  });
  it("invierte el orden visual del rival en el cambio de perspectiva sin mutar estado ni poner textos invertidos",()=>{
    const chain=["a","b","c","d"].map(card);
    const original=chain.map(c=>c.instanceId);
    expect(chainForViewer(chain,"propio").map(c=>c.instanceId)).toEqual(original);
    expect(chainForViewer(chain,"rival").map(c=>c.instanceId)).toEqual(["d","c","b","a"]);
    expect(chain.map(c=>c.instanceId)).toEqual(original);
    const ownMarkup=renderToStaticMarkup(createElement(BattleChain,{chain,label:"P1",side:"propio"}));
    const otherMarkup=renderToStaticMarkup(createElement(BattleChain,{chain,label:"P1",side:"rival"}));
    expect(ownMarkup).toContain('data-chain-side="propio"');
    expect(otherMarkup).toContain('data-chain-side="rival"');
    expect(otherMarkup.indexOf('data-card-id="d"')).toBeLessThan(otherMarkup.indexOf('data-card-id="a"'));
  });
});
