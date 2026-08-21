/**
 * Dựng trạng thái khởi đầu của một ván game từ danh sách người chơi.
 *
 * Số người chơi tùy GM: luật gốc là 3 nước × 8 người (§1) nhưng engine chỉ
 * ràng buộc mỗi nước tối đa 1 Chủ Công và 1 Quân Sư — còn lại bao nhiêu Quan
 * Văn / Tướng Quân là quyền của GM.
 */

import {
  BoardDefinition,
  boardSize,
  capitalCenter,
  DEFAULT_BOARD,
  makeTiles,
  regionsOf,
  validateBoard,
} from "./board";
import {
  BuildingLevels,
  CityState,
  CommanderState,
  GameState,
  KINGDOMS,
  KingdomState,
  Owner,
  PlayerId,
  PlayerState,
  Resources,
  Role,
  SAVE_VERSION,
} from "./types";

export interface RosterEntry {
  /** Bỏ trống thì tự sinh `player01`, `player02`, … theo thứ tự khai báo. */
  id?: PlayerId;
  name: string;
  kingdom: Owner;
  role: Role;
}

export interface GameSetup {
  id?: string;
  players: RosterEntry[];
  /** Bỏ trống thì dùng bàn cờ chính thức 13×13 (`DEFAULT_BOARD`). */
  board?: BoardDefinition;
  resources?: Partial<Resources>;
  buildings?: Partial<BuildingLevels>;
  /** Số Bộ Binh mỗi Tướng Quân có sẵn từ đầu game (§2). */
  startingInfantry?: number;
}

export const KINGDOM_NAMES: Record<Owner, string> = {
  wei: "Ngụy",
  shu: "Thục",
  wu: "Ngô",
};

export const DEFAULT_RESOURCES: Resources = {
  taiNguyen: 20,
  lua: 50_000,
  dan: 120_000,
  danTam: 0,
  uyDanh: 0,
  deKhi: 0,
};

export const DEFAULT_BUILDINGS: BuildingLevels = {
  mine: 1,
  farm: 1,
  populationHouse: 1,
  barracks: 1,
  archery: 1,
  stable: 1,
};

const DEFAULT_STARTING_INFANTRY = 1_000;

/** Kho lúa ban đầu của một Châu Thành còn vô chủ (§4 — Châu là vựa lúa). */
const CHAU_GRAIN_RESERVE = 5_000;

export class SetupError extends Error {}

export function validateSetup(setup: GameSetup): void {
  validateBoard(setup.board ?? DEFAULT_BOARD);

  if (setup.players.length === 0) {
    throw new SetupError("Danh sách người chơi trống.");
  }

  const seen = new Set<PlayerId>();
  for (const entry of setup.players) {
    if (!entry.name.trim()) {
      throw new SetupError("Có người chơi chưa đặt tên.");
    }
    if (entry.id) {
      if (seen.has(entry.id)) {
        throw new SetupError(`Trùng mã người chơi: ${entry.id}.`);
      }
      seen.add(entry.id);
    }
  }

  for (const kingdom of KINGDOMS) {
    const roster = setup.players.filter((p) => p.kingdom === kingdom);
    if (roster.length === 0) continue;
    for (const role of ["LORD", "STRATEGIST"] as Role[]) {
      const count = roster.filter((p) => p.role === role).length;
      if (count > 1) {
        const label = role === "LORD" ? "Chủ Công" : "Quân Sư";
        throw new SetupError(
          `${KINGDOM_NAMES[kingdom]} có ${count} ${label}; mỗi nước chỉ được 1.`,
        );
      }
    }
  }
}

function makePlayers(setup: GameSetup): Record<PlayerId, PlayerState> {
  const players: Record<PlayerId, PlayerState> = {};
  setup.players.forEach((entry, index) => {
    const id = entry.id ?? `player${String(index + 1).padStart(2, "0")}`;
    players[id] = {
      id,
      name: entry.name.trim(),
      kingdom: entry.kingdom,
      role: entry.role,
      alive: true,
    };
  });
  return players;
}

/** Chủ Công và Tướng Quân lên bàn cờ; Quân Sư và Quan Văn thì không (§2). */
function makeCommanders(
  board: BoardDefinition,
  players: Record<PlayerId, PlayerState>,
  startingInfantry: number,
): Record<PlayerId, CommanderState> {
  const commanders: Record<PlayerId, CommanderState> = {};
  for (const player of Object.values(players)) {
    if (player.role !== "LORD" && player.role !== "GENERAL") continue;
    const start = capitalCenter(board, player.kingdom);
    if (!start) {
      throw new SetupError(
        `${KINGDOM_NAMES[player.kingdom]} chưa có Thành Trì trên bàn cờ nên ${player.name} không biết xuất phát từ đâu.`,
      );
    }
    commanders[player.id] = {
      id: player.id,
      name: player.name,
      kingdom: player.kingdom,
      role: player.role,
      // Chủ Công mặc định có sẵn Skill Đại Tướng (§2).
      rank: player.role === "LORD" ? "GREAT_GENERAL" : "GENERAL",
      tileId: start,
      units: {
        // Chỉ Tướng có mặt từ đầu game mới sẵn 1000 Bộ Binh; Chủ Công không.
        infantry: player.role === "GENERAL" ? startingInfantry : 0,
        archers: 0,
        cavalry: 0,
      },
      stance: "THU",
      kills: 0,
      status: "FIELD",
      readyOnTurn: 1,
      enteredTileOnTurn: 1,
      supplied: true,
      debuffs: [],
    };
  }
  return commanders;
}

function makeCities(board: BoardDefinition): Record<string, CityState> {
  return Object.fromEntries(
    regionsOf(board).map((region) => [
      region.id,
      {
        id: region.id,
        label: region.label,
        owner: region.owner,
        isCapital: region.isCapital,
        tiles: region.tiles,
        // Kho lúa quốc gia nằm ở Thành Trì và được đếm trong resources.lua,
        // nên vựa riêng của Trì luôn bằng 0 để khỏi tính hai lần.
        grainReserve: region.isCapital ? 0 : CHAU_GRAIN_RESERVE,
      } satisfies CityState,
    ]),
  );
}

function makeKingdoms(setup: GameSetup): Record<Owner, KingdomState> {
  const resources = { ...DEFAULT_RESOURCES, ...setup.resources };
  const buildings = { ...DEFAULT_BUILDINGS, ...setup.buildings };
  const make = (id: Owner): KingdomState => ({
    id,
    name: KINGDOM_NAMES[id],
    resources: { ...resources },
    buildings: { ...buildings },
    pendingUpgrades: [],
    score: 0,
    eliminated: false,
  });

  return { wei: make("wei"), shu: make("shu"), wu: make("wu") };
}

export function createGame(setup: GameSetup): GameState {
  validateSetup(setup);

  const board = setup.board ?? DEFAULT_BOARD;
  const players = makePlayers(setup);
  const commanders = makeCommanders(
    board,
    players,
    setup.startingInfantry ?? DEFAULT_STARTING_INFANTRY,
  );

  return {
    version: SAVE_VERSION,
    game: {
      id: setup.id ?? `tqth-${Date.now()}`,
      status: "RUNNING",
      year: 1,
      season: "SPRING",
      turn: 1,
      phase: "GO",
    },
    map: { size: boardSize(board), name: board.name },
    tiles: makeTiles(board),
    cities: makeCities(board),
    kingdoms: makeKingdoms(setup),
    players,
    commanders,
    battles: [],
    events: [
      {
        id: "event-001",
        turn: 1,
        phase: "GO",
        type: "TURN",
        message: "Tam Quốc khởi chiến — Năm 1, mùa Xuân, lượt Go.",
      },
    ],
    victory: { winner: null, reason: null },
  };
}

/* ---------- Danh sách mặc định: 3 nước × 8 người (§1) ---------- */

const DEFAULT_NAMES: Record<Owner, string[]> = {
  wei: [
    "Tào Tháo",
    "Tuân Úc",
    "Trình Dục",
    "Giả Hủ",
    "Tào Nhân",
    "Hứa Chử",
    "Trương Liêu",
    "Trương Cáp",
  ],
  shu: [
    "Lưu Bị",
    "Gia Cát Lượng",
    "Mã Lương",
    "Giản Ung",
    "Quan Vũ",
    "Trương Phi",
    "Triệu Vân",
    "Mã Siêu",
  ],
  wu: [
    "Tôn Quyền",
    "Chu Du",
    "Trương Chiêu",
    "Cố Ung",
    "Lã Mông",
    "Lục Tốn",
    "Cam Ninh",
    "Thái Sử Từ",
  ],
};

/** Thứ tự chức vụ chuẩn của 8 người một nước. */
const DEFAULT_ROLES: Role[] = [
  "LORD",
  "STRATEGIST",
  "CIVIL",
  "CIVIL",
  "GENERAL",
  "GENERAL",
  "GENERAL",
  "GENERAL",
];

export const DEFAULT_SETUP: GameSetup = {
  players: KINGDOMS.flatMap((kingdom) =>
    DEFAULT_ROLES.map((role, index) => ({
      name: DEFAULT_NAMES[kingdom][index],
      kingdom,
      role,
    })),
  ),
};

export function createDefaultGame(): GameState {
  return createGame(DEFAULT_SETUP);
}
