export type Terrain = "plains" | "forest" | "mountain" | "city" | "capital";
export type Owner = "wei" | "shu" | "wu";

export interface TileData {
  x: number;
  y: number;
  terrain: Terrain;
  relativePos?: [number,number];
  owner?: Owner;
  label?: string;
}

// ── Commanders ────────────────────────────────────────────────────────────────

export type CommanderRank = "tuong_quan" | "dai_tuong_quan";

export const COMMANDER_CAPACITY: Record<CommanderRank, number> = {
  tuong_quan:     500,
  dai_tuong_quan: 5000,
};

export interface Commander {
  id: string;
  name: string;
  owner: Owner;
  rank: CommanderRank;

  // Stats (1–100)
  leadership: number;   // tăng combat strength của quân dưới trướng
  strategy: number;     // tăng movement range
  bravery: number;      // ảnh hưởng morale quân

  tileX: number;
  tileY: number;
  movesLeft: number;    // reset mỗi lượt; base = 2 + floor(strategy / 40)
}

// ── Units ─────────────────────────────────────────────────────────────────────

export type UnitType = "infantry" | "cavalry" | "archer" | "siege";

export interface ArmyStack {
  id: string;
  owner: Owner;
  commanderId: string;  // phải có tướng chỉ huy

  units: Partial<Record<UnitType, number>>;  // số lính theo loại

  tileX: number;
  tileY: number;
  morale: number;       // 0–100
}

// Tổng quân trong stack, không được vượt capacity của commander
export function stackSize(stack: ArmyStack): number {
  return Object.values(stack.units).reduce((s, n) => s + (n ?? 0), 0);
}

export function commanderCapacity(commander: Commander): number {
  return COMMANDER_CAPACITY[commander.rank];
}

// ── Resources & Factions ──────────────────────────────────────────────────────

export interface Resources {
  gold: number;
  food: number;
  population: number;
  manpower: number;     // dân có thể tuyển quân
}

export type DiplomacyStatus = "war" | "neutral" | "alliance" | "vassal";

export interface FactionState {
  resources: Resources;
  commanders: Commander[];
  stacks: ArmyStack[];
}

// ── Buildings & Cities ────────────────────────────────────────────────────────

export type BuildingType = "farm" | "market" | "barracks" | "wall";

export interface Building {
  type: BuildingType;
  level: 1 | 2 | 3;
}

export interface CityState {
  label: string;
  owner: Owner | null;
  isCapital: boolean;
}

// ── Game State ────────────────────────────────────────────────────────────────

export type TurnPhase = "communicate" | "plan" | "move" | "act";

export interface GameState {
  turn: number;
  phase: TurnPhase;

  tiles: TileData[];
}
