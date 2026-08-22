/**
 * Tam Quốc Tranh Hùng — kiểu dữ liệu lõi.
 *
 * Phạm vi MVP: §1–9 của Luật Tối Giản (bản đồ, kinh tế, quân đội, di chuyển,
 * nối lương, binh pháp, thời tiết, tính điểm). Phù chú, trận pháp, thuyền,
 * cơ giới, Tinh Binh và Chiến Tướng chưa nằm trong mô hình này.
 */

/* ---------- Primitive IDs ---------- */

export type PlayerId = string;
export type CommanderId = PlayerId;
export type TileId = string;
export type CityId = string;
export type BattleId = string;
export type EventId = string;

/* ---------- Game ---------- */

export type GameStatus = "WAITING" | "RUNNING" | "FINISHED";
export type GamePhase = "GO" | "ATC";
export type Season = "SPRING" | "SUMMER" | "AUTUMN" | "WINTER";
export type VictoryReason = "CONQUEST" | "SCORE";

/* ---------- Kingdom ---------- */

export type Owner = "wei" | "shu" | "wu";
export type Kingdom = Owner;

export const KINGDOMS: Owner[] = ["wei", "shu", "wu"];

/**
 * Tên tài nguyên theo đúng luật (§3, §5, §17) — GM đọc thẳng các con số này
 * cho người chơi nên không dùng tên khác.
 */
export interface Resources {
  /** Tài Nguyên — đơn vị chi tiêu chính. */
  taiNguyen: number;
  /** Lúa — nuôi lính, 1 Lúa/lính/Turn. */
  lua: number;
  /** Dân — nguyên liệu tuyển lính và làm lúa. */
  dan: number;
  /** Dân Tâm — do Quan Văn sinh ra. Chưa có nơi tiêu trong MVP. */
  danTam: number;
  /** Uy Danh — do Tướng Quân sinh ra. Chưa có nơi tiêu trong MVP. */
  uyDanh: number;
  /** Đế Khí — do Chủ Công sinh ra, quy đổi 1:1 sang Dân Tâm hoặc Uy Danh. */
  deKhi: number;
}

/** Công trình có cấp trong phạm vi §3/§6. */
export type BuildingKind =
  | "mine"
  | "farm"
  | "populationHouse"
  | "barracks"
  | "archery"
  | "stable";

export type BuildingLevels = Record<BuildingKind, number>;

export interface PendingUpgrade {
  building: BuildingKind;
  /** Nâng ở Turn N thì đầu Turn N+1 mới có hiệu lực (§18). */
  completesOnTurn: number;
}

export interface KingdomState {
  id: Owner;
  name: string;
  resources: Resources;
  buildings: BuildingLevels;
  pendingUpgrades: PendingUpgrade[];
  /** Điểm lãnh thổ cộng dồn qua các Turn Xuân/Thu (§1). */
  score: number;
  eliminated: boolean;
}

/* ---------- Player ---------- */

export type Role = "LORD" | "STRATEGIST" | "CIVIL" | "GENERAL";
export type GeneralRank = "GENERAL" | "GREAT_GENERAL" | "WAR_GOD";

export interface PlayerState {
  id: PlayerId;
  name: string;
  kingdom: Owner;
  role: Role;
  alive: boolean;
}

/* ---------- Map ---------- */

export type Terrain =
  | "plains"
  | "forest"
  | "mountain"
  | "river"
  | "city"
  | "capital";

export type TileEffect = "fire" | "flood" | "trap";

export interface Position {
  x: number;
  y: number;
}

export interface MapSize {
  rows: number;
  cols: number;
}

export interface MapData {
  size: MapSize;
  /** Tên bàn cờ đang dùng — bàn cờ do GM khai báo khi dựng ván. */
  name: string;
}

export interface TileData {
  id: TileId;
  x: number;
  y: number;
  terrain: Terrain;
  owner?: Owner;
  label?: string;
  cityId?: CityId;
  effects: TileEffect[];
  /** Quốc gia đang nối được lương tới ô này (tính lại mỗi lượt). */
  supplyOwner?: Owner;
}

export interface CityState {
  id: CityId;
  label: string;
  owner: Owner | null;
  isCapital: boolean;
  /** Ô gốc của vùng thành. Ô Trì bị phá sẽ đổi terrain thành `plains` (§4). */
  tiles: TileId[];
  /** Vựa lúa cục bộ (§4) — Châu/Trì chứa lúa, không tự sinh lúa. */
  grainReserve: number;
}

/* ---------- Units & commanders ---------- */

export type UnitType = "infantry" | "archers" | "cavalry";

export interface Units {
  infantry: number;
  archers: number;
  cavalry: number;
}

/** §8 — mỗi Tướng bật Công hoặc Thủ; cả ô theo trạng thái đó. */
export type Stance = "CONG" | "THU";

export type CommanderStatus = "FIELD" | "RECOVERING" | "DEFEATED";

/**
 * Một Tướng trên bàn cờ cùng đạo quân mình chỉ huy. Tướng và quân là một thực
 * thể: mọi luật §6/§7 ("cần ≥1000 lính mới di chuyển", biên chế 10.000) đều
 * đọc cả hai nửa, nên tách ra chỉ tạo cơ hội lệch trạng thái.
 */
export interface CommanderState {
  /** Trùng với PlayerId — lệnh gửi tới người chơi nào là tới tướng đó. */
  id: CommanderId;
  name: string;
  kingdom: Owner;
  role: Extract<Role, "LORD" | "GENERAL">;
  rank: GeneralRank;
  tileId: TileId;
  units: Units;
  stance: Stance;
  kills: number;
  status: CommanderStatus;
  /** Bại trận thì dưỡng ở Trì, đầu Turn này mới ra trận lại được. */
  readyOnTurn: number;
  /** Turn đặt chân lên ô hiện tại — dùng cho luật ở Rừng/Núi tối đa 1 Turn (§4). */
  enteredTileOnTurn: number;
  supplied: boolean;
}

/* ---------- Commands ---------- */

export type CommandType =
  | "MOVE"
  | "ATTACK"
  | "STANCE"
  | "RECRUIT"
  | "TRANSFER"
  | "CONVERT_DAN"
  | "CONVERT_LUA"
  | "BUY_LUA"
  | "UPGRADE";

export interface GameCommand {
  type: CommandType;
  /** Người chơi ra lệnh. */
  actor: PlayerId;
  kingdom: Owner;
  to?: TileId;
  target?: PlayerId;
  unitType?: UnitType;
  amount?: number;
  stance?: Stance;
  building?: BuildingKind;
  /** Dòng lệnh gốc GM dán vào, giữ lại để đối chiếu. */
  raw: string;
}

/* ---------- Battle, events ---------- */

export type BattleResult = "ATTACKER_WIN" | "DEFENDER_WIN" | "STALEMATE";

export interface BattleReport {
  id: BattleId;
  turn: number;
  phase: GamePhase;
  tileId: TileId;
  attackers: CommanderId[];
  defenders: CommanderId[];
  attackerPower: number;
  defenderPower: number;
  defenderStance: Stance;
  result: BattleResult;
  attackerLosses: Units;
  defenderLosses: Units;
  notes: string[];
}

export type EventType =
  | "MOVE"
  | "BATTLE"
  | "ECONOMY"
  | "SUPPLY"
  | "STARVATION"
  | "SIEGE"
  | "TURN"
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
}

export interface VictoryState {
  winner: Owner | null;
  reason: VictoryReason | null;
}

export const SAVE_VERSION = 4;

export interface GameState {
  version: number;
  game: GameClock;
  map: MapData;
  tiles: TileData[];
  cities: Record<CityId, CityState>;
  kingdoms: Record<Owner, KingdomState>;
  players: Record<PlayerId, PlayerState>;
  commanders: Record<CommanderId, CommanderState>;
  battles: BattleReport[];
  events: GameEvent[];
  victory: VictoryState;
}

export const NGUY: Owner = "wei";
export const THUC: Owner = "shu";
export const NGO: Owner = "wu";
