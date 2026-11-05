import { expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { ChainTutorial } from "./ChainTutorial";
import { overlay, visibleElements } from "../domain/game/overlay";
import { lineScore } from "../domain/game/combat";
import type { CardInstance } from "../domain/game/state";

const first: CardInstance={instanceId:"first",definition:{id:"first",name:"Espada",topElement:"SHIELD",bottomElement:"SWORD",values:{SHIELD:2,SWORD:3},printedWalls:1}};
const second: CardInstance={instanceId:"second",definition:{id:"second",name:"Arco",topElement:"SWORD",bottomElement:"ARCHERY",values:{SWORD:1,ARCHERY:2}}};

it("muestra la guia visual antes de que haya cartas en el tablero",()=>{
  const html=renderToStaticMarkup(createElement(ChainTutorial));
  expect(html).toContain("¿Cómo se encadenan las cartas?");
  expect(html).toContain("PASO");
  expect(html).toContain("TERRENO CENTRAL");
});

it("el ejemplo del Profe conserva espada 3 + muralla 1 y activa arco 2 al encadenar por debajo",()=>{
  const bottom=overlay([],first,"BOTTOM","NEW_OVER_OLD");
  expect(bottom.chain[0].visibility?.top.covered).toBe(true);
  expect(lineScore(bottom.chain)).toEqual({swords:3,shields:0,walls:1});
  const after=overlay(bottom.chain,second,"BOTTOM","OLD_OVER_NEW");
  expect(after.chain[1].visibility?.top.covered).toBe(true);
  expect(after.chain[1].visibility?.bottom.covered).toBe(false);
  expect(after.newlyEnabled.map(v=>v.element)).toEqual(["ARCHERY"]);
  expect(visibleElements(after.chain).map(v=>v.element)).toEqual(["SWORD","ARCHERY"]);
  expect(lineScore(after.chain)).toEqual({swords:3,shields:0,walls:1});
});
