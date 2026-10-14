import type { PlayerId } from "../types";
export function nextPlayer(player: PlayerId): PlayerId { return player === "P1" ? "P2" : "P1"; }
