/* ---------- Primitive IDs ---------- */

export type PlayerId = string;
export type KingdomId = Owner;
export type GeneralId = string;
export type ArmyId = string;
export type TileId = string;
export type CityId = string;
export type CastleId = string;
export type BattleId = string;
export type EventId = string;

/* ---------- Game ---------- */

export type GameStatus = "WAITING" | "RUNNING" | "FINISHED";
export type GamePhase = "GO" | "ATC";
export type Season = "SPRING" | "SUMMER" | "AUTUMN" | "WINTER";
export type VictoryReason = "CONQUEST" | "SCORE" | "ABDICATION";

/* ---------- Kingdom ---------- */

export type Owner = "wei" | "shu" | "wu";
export type Kingdom = Owner;

export interface Resources {
  gold: number;
  grain: number;
  population: number;
  morale: number;
  prestige: number;
  imperialToken: number;
}

export interface BuildingLevels {
  mine: number;
  farm: number;
  populationHouse: number;
  barracks: number;
  archery: number;
  stable: number;
  forgeWeapon: number;
  forgeArmor: number;
  shipyard: number;
  siegeWorkshop: number;
}

export interface KingdomState {
  id: Owner;
  name: string;
  leader: PlayerId;
  strategist: PlayerId;
  resources: Resources;
  buildings: BuildingLevels;
  territory: TileId[];
  cities: CityId[];
  castles: CastleId[];
  score: number;
  eliminated: boolean;
}

/* ---------- Player & role rules ---------- */

export type Role = "LORD" | "STRATEGIST" | "CIVIL" | "GENERAL";
export type GeneralRank = "GENERAL" | "GREAT_GENERAL" | "WAR_GOD";

export interface PlayerState {
  id: PlayerId;
  name: string;
  kingdom: Owner;
  role: Role;
  alive: boolean;
  connected: boolean;
  banished: boolean;
}

/* ---------- Map ---------- */

export type Terrain =
  | "plains"
  | "forest"
  | "mountain"
  | "river"
  | "city"
  | "capital";

export type TileType =
  | "PLAIN"
  | "CASTLE"
  | "CITY"
  | "FOREST"
  | "MOUNTAIN"
  | "RIVER";

export type TileEffect = "fire" | "flood" | "fog" | "trap";

export interface Position {
  x: number;
  y: number;
}

export interface MapData {
  size: {
    rows: number;
    cols: number;
  };
}

export interface TileData {
  id: TileId;
  x: number;
  y: number;
  terrain: Terrain;
  owner?: Owner;
  label?: string;
  cityId?: CityId;
  castleId?: CastleId;
  effects: TileEffect[];
  supplyOwner?: Owner;
}

export interface CityState {
  id: CityId;
  label: string;
  owner: Owner | null;
  isCapital: boolean;
  tiles: TileId[];
  grainReserve: number;
  localMilitia: Units;
  defense: number;
  damaged: boolean;
}

export interface CastleState {
  id: CastleId;
  label: string;
  owner: Owner;
  tiles: TileId[];
  grainReserve: number;
  defense: number;
  damaged: boolean;
}

/* ---------- Units & armies ---------- */

export type UnitType = "infantry" | "archers" | "cavalry";
export type ShipType = "fishing" | "supply" | "training";
export type SiegeType = "ram";
export type Buff = "GREAT_GENERAL" | "MORALE" | "WEAPON" | "ARMOR" | "FORMATION";
export type Debuff = "STARVING" | "BURNING" | "FLOODED";
export type ArmyStatus = "IDLE" | "MOVING" | "BATTLE" | "RECOVERING" | "DEFEATED";
export type Formation = "NORMAL" | "OFFENSIVE" | "DEFENSIVE" | "ARROW" | "CRANE";

export interface Units {
  infantry: number;
  archers: number;
  cavalry: number;
}

export interface Cooldowns {
  greatGeneral: number;
  heal: number;
}

export interface Inventory {
  arrows: number;
  fireArrows: number;
  ships: ShipType[];
  siege?: SiegeType;
}

export interface GeneralState {
  id: GeneralId;
  player: PlayerId;
  kingdom: Owner;
  rank: GeneralRank;
  location: TileId;
  kills: number;
  woundedTurns: number;
  cooldowns: Cooldowns;
  inventory: Inventory;
  loyal: boolean;
}

export interface ArmyState {
  id: ArmyId;
  kingdom: Owner;
  generalId: GeneralId;
  tileId: TileId;
  units: Units;
  morale: number;
  formation: Formation;
  status: ArmyStatus;
  buffs: Buff[];
  debuffs: Debuff[];
  supplied: boolean;
}

/* ---------- Commands, battle, events ---------- */

export type CommandType =
  | "MOVE"
  | "ATTACK"
  | "SHOOT"
  | "BUY_UNIT"
  | "BUY_FOOD"
  | "BUILD"
  | "UPGRADE"
  | "TRANSFER"
  | "PROMOTE"
  | "REBEL"
  | "EXECUTE"
  | "RECRUIT"
  | "HEAL"
  | "END_PHASE";

export interface GameCommand {
  id: string;
  type: CommandType;
  kingdom: Owner;
  actorId?: PlayerId | GeneralId;
  targetId?: string;
  from?: TileId;
  to?: TileId;
  units?: Partial<Units>;
  payload?: Record<string, string | number | boolean | null>;
}

export type BattleResult = "ATTACKER_WIN" | "DEFENDER_WIN" | "DRAW";

export interface BattleReport {
  id: BattleId;
  tileId: TileId;
  attacker: ArmyId;
  defender: ArmyId;
  result: BattleResult;
  attackerLosses: Units;
  defenderLosses: Units;
  notes: string[];
}

export type EventType =
  | "MOVE"
  | "BATTLE"
  | "BUILD"
  | "UPGRADE"
  | "PROMOTION"
  | "DEATH"
  | "RESOURCE"
  | "TURN_END"
  | "SUPPLY"
  | "VICTORY";

export interface GameEvent {
  id: EventId;
  turn: number;
  phase: GamePhase;
  type: EventType;
  message: string;
}

export interface GameClock {
  id: string;
  status: GameStatus;
  year: number;
  season: Season;
  turn: number;
  phase: GamePhase;
  seed: number;
}

export interface VictoryState {
  winner: Owner | null;
  reason: VictoryReason | null;
}

export interface GameState {
  version: number;
  game: GameClock;
  map: MapData;
  tiles: TileData[];
  cities: Record<CityId, CityState>;
  castles: Record<CastleId, CastleState>;
  kingdoms: Record<Owner, KingdomState>;
  players: Record<PlayerId, PlayerState>;
  generals: Record<GeneralId, GeneralState>;
  armies: Record<ArmyId, ArmyState>;
  commands: GameCommand[];
  battles: BattleReport[];
  events: GameEvent[];
  victory: VictoryState;
}

export const NGUY: Owner = "wei";
export const THUC: Owner = "shu";
export const NGO: Owner = "wu";
