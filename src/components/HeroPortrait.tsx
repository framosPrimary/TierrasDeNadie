/** Sprint 01: retratos artísticos de prueba.
 * Cleptan está identificado; la matriarca es un CONCEPTO visual, no una identidad
 * ni habilidad del catálogo final del Profe.
 */
export function portraitForHero(heroId:string|null|undefined):{src:string;title:string;provisional:boolean} {
  if (heroId === "Cleptan") return {
    src:"/art/cleptan-pilot.svg",
    title:"Cleptan · retrato artístico piloto",
    provisional:true,
  };
  return {
    src:"/art/matriarch-pilot.svg",
    title:"Personaje conceptual · retrato provisional, no representa al héroe seleccionado",
    provisional:true,
  };
}
export function HeroPortrait({heroId,side}:{heroId:string|null|undefined;side:"rival"|"propio"}){
  const portrait=portraitForHero(heroId);
  return <div className={"hero-portrait hero-portrait-"+side}>
    <div className="hero-avatar">
      <img src={portrait.src} alt={portrait.title}/>
    </div>
    <span className="portrait-ribbon" aria-hidden="true">ARTE PILOTO</span>
  </div>;
}
