export type PlayerId = "P1" | "P2";
export type Placement = "TOP" | "BOTTOM";
export type ElementType = "SWORD" | "SHIELD" | "ARCHERY" | "WALL" | "GOLD" | "HEAL" | "CATAPULT";
export type CardDefinition = { id: string; name: string; topElement: ElementType; bottomElement: ElementType; values?: Partial<Record<ElementType, number>> };
