export const NGUY = "wei";
export const THUC = "shu";
export const NGO = "wu";

export type Terrain = "plains" | "forest" | "mountain" | "city" | "capital";
export type Owner = "wei" | "shu" | "wu";

export interface TileData {
  x: number;
  y: number;
  terrain: Terrain;
  owner?: Owner;
  label?: string;
}

// ── Buildings & Cities ────────────────────────────────────────────────────────

export interface CityState {
  label: string;
  owner: Owner | null;
  isCapital: boolean;
  tiles: Array<[number, number]>;
}

// ── Game State ────────────────────────────────────────────────────────────────

export type TurnPhase = "communicate" | "plan" | "move" | "act";

export interface GameState {
  turn: number;
  phase: TurnPhase;

  tiles: TileData[];
  cities: Record<string, CityState>;
}
