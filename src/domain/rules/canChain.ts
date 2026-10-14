import type { CardDefinition, Placement } from "../types";
export function canChain(chain: readonly CardDefinition[], card: CardDefinition, placement: Placement): boolean {
  if (chain.length === 0) return true;
  if (placement === "TOP") return card.bottomElement === chain[0].topElement;
  return card.topElement === chain[chain.length - 1].bottomElement;
}
