import type { CardDefinition, Placement } from "../types";

/** Cualquier par de elementos puede encadenarse. TOP/BOTTOM indica el extremo. */
export function canChain(_chain: readonly CardDefinition[], _card: CardDefinition, placement: Placement): boolean {
  return placement === "TOP" || placement === "BOTTOM";
}
