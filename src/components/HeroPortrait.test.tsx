import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { HeroPortrait, portraitForHero } from "./HeroPortrait";

describe("Sprint visual: portraits do not change hero identity",()=>{
  it("usa el retrato del ladrón únicamente para Cleptan",()=>{
    const portrait=portraitForHero("Cleptan");
    expect(portrait.src).toContain("cleptan-pilot.svg");
    const markup=renderToStaticMarkup(createElement(HeroPortrait,{heroId:"Cleptan",side:"propio"}));
    expect(markup).toContain("Cleptan");
    expect(markup).toContain("ARTE PILOTO");
  });
  it("no asigna identidad inventada al resto de héroes del Profe",()=>{
    const portrait=portraitForHero("Héroe demo 3");
    expect(portrait.src).toContain("matriarch-pilot.svg");
    const markup=renderToStaticMarkup(createElement(HeroPortrait,{heroId:"Héroe demo 3",side:"rival"}));
    expect(markup).toContain("no representa al héroe seleccionado");
    expect(markup).toContain("hero-portrait-rival");
  });
});
