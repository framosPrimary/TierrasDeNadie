import type { ElementType, Placement } from "../types";
import type { CardInstance } from "./state";

export type OverlayOrder = "NEW_OVER_OLD" | "OLD_OVER_NEW";
export type Face = "top" | "bottom";
export type FaceState = { covered: boolean; activated: boolean };
export type Visibility = { top: FaceState; bottom: FaceState };
export type ActiveFace = { instanceId: string; face: Face; element: ElementType };

/** Estado por componente; activated evita reactivaciones aun si se destapa. */
export function visibilityOf(card: CardInstance): Visibility {
  return card.visibility ?? {
    top: { covered: false, activated: false },
    bottom: { covered: false, activated: false },
  };
}

export const immediateElements: readonly ElementType[] = ["ARCHERY", "GOLD", "HEAL", "CATAPULT"];

export function isVisible(card: CardInstance, face: Face): boolean {
  return !visibilityOf(card)[face].covered;
}

/** Esta función no ejecuta efectos: registra solamente nuevos disparadores. */
export function overlay(
  chain: readonly CardInstance[],
  card: CardInstance,
  placement: Placement,
  order: OverlayOrder,
): { chain: CardInstance[]; newlyEnabled: ActiveFace[] } {
  if (placement !== "TOP" && placement !== "BOTTOM") throw new Error("Extremo inválido");
  if (order !== "NEW_OVER_OLD" && order !== "OLD_OVER_NEW") throw new Error("Superposición inválida");
  const fresh = { ...card, visibility: visibilityOf(card) };
  if (chain.length === 0) {
    // La primera carta se encadena por debajo del terreno: solo su cara inferior
    // queda habilitada. La muralla impresa requiere modelado independiente
    // cuando recibamos el catálogo gráfico del Profe.
    const visibility: Visibility = {
      top: { covered: true, activated: false },
      bottom: { ...fresh.visibility.bottom },
    };
    const element = fresh.definition.bottomElement;
    const newlyEnabled: ActiveFace[] =
      immediateElements.includes(element)
        ? [{ instanceId: fresh.instanceId, face: "bottom", element }]
        : [];
    if (newlyEnabled.length > 0) visibility.bottom.activated = true;
    return { chain: [{ ...fresh, visibility }], newlyEnabled };
  }
  const neighborIndex = placement === "TOP" ? 0 : chain.length - 1;
  const neighborFace: Face = placement === "TOP" ? "top" : "bottom";
  const newFace: Face = placement === "TOP" ? "bottom" : "top";
  const neighbor = chain[neighborIndex];
  const neighborVisibility = visibilityOf(neighbor);
  const visibility = {
    top: { ...fresh.visibility.top },
    bottom: { ...fresh.visibility.bottom },
  };
  const existingVisibility = {
    top: { ...neighborVisibility.top },
    bottom: { ...neighborVisibility.bottom },
  };
  if (order === "NEW_OVER_OLD") existingVisibility[neighborFace].covered = true;
  else visibility[newFace].covered = true;

  const newlyEnabled: ActiveFace[] = [];
  for (const face of ["top", "bottom"] as const) {
    const element = fresh.definition[face === "top" ? "topElement" : "bottomElement"];
    if (!visibility[face].covered && !visibility[face].activated && immediateElements.includes(element)) {
      newlyEnabled.push({ instanceId: fresh.instanceId, face, element });
      visibility[face].activated = true;
    }
  }
  const updatedNeighbor = { ...neighbor, visibility: existingVisibility };
  const updated = chain.map((item, idx) => idx === neighborIndex ? updatedNeighbor : item);
  const result = { ...fresh, visibility };
  return { chain: placement === "TOP" ? [result, ...updated] : [...updated, result], newlyEnabled };
}

export function visibleElements(chain: readonly CardInstance[]): ActiveFace[] {
  return chain.flatMap(card => (["top", "bottom"] as const).flatMap(face =>
    isVisible(card, face)
      ? [{ instanceId: card.instanceId, face, element: card.definition[face === "top" ? "topElement" : "bottomElement"] }]
      : []
  ));
}
