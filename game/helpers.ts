/** Tiện ích dùng chung cho toàn bộ engine — không chứa luật chơi. */

import {
  CommanderState,
  GameEvent,
  GameState,
  Owner,
  TileData,
  TileId,
  Units,
} from "./types";

/* ---------- Units ---------- */

export const EMPTY_UNITS: Units = { infantry: 0, archers: 0, cavalry: 0 };

export function emptyUnits(): Units {
  return { ...EMPTY_UNITS };
}

export function totalUnits(units: Units): number {
  return units.infantry + units.archers + units.cavalry;
}

export function addUnits(a: Units, b: Partial<Units>): Units {
  return {
    infantry: a.infantry + (b.infantry ?? 0),
    archers: a.archers + (b.archers ?? 0),
    cavalry: a.cavalry + (b.cavalry ?? 0),
  };
}

export function subtractUnits(a: Units, b: Partial<Units>): Units {
  return {
    infantry: Math.max(0, a.infantry - (b.infantry ?? 0)),
    archers: Math.max(0, a.archers - (b.archers ?? 0)),
    cavalry: Math.max(0, a.cavalry - (b.cavalry ?? 0)),
  };
}

/** Cắt `ratio` phần quân, làm tròn lên nhưng không vượt quá quân hiện có. */
export function scaleUnits(units: Units, ratio: number): Units {
  return {
    infantry: Math.min(units.infantry, Math.ceil(units.infantry * ratio)),
    archers: Math.min(units.archers, Math.ceil(units.archers * ratio)),
    cavalry: Math.min(units.cavalry, Math.ceil(units.cavalry * ratio)),
  };
}

/**
 * Giết `count` lính, chia theo tỉ lệ hiện có rồi bù phần dư — dùng khi số lính
 * chết được tính ra trước (chết đói, truy sát) chứ không phải theo tỉ lệ.
 */
export function killUnits(units: Units, count: number): Units {
  const total = totalUnits(units);
  if (count <= 0 || total === 0) return emptyUnits();
  if (count >= total) return { ...units };

  const kinds = ["infantry", "archers", "cavalry"] as const;
  const losses = emptyUnits();
  let assigned = 0;
  for (const kind of kinds) {
    const share = Math.floor((units[kind] / total) * count);
    losses[kind] = share;
    assigned += share;
  }
  // Phần dư do làm tròn: rải tiếp vào loại còn quân.
  let remainder = count - assigned;
  for (const kind of kinds) {
    if (remainder <= 0) break;
    const room = units[kind] - losses[kind];
    const take = Math.min(room, remainder);
    losses[kind] += take;
    remainder -= take;
  }
  return losses;
}

/* ---------- State ---------- */

export function cloneState(state: GameState): GameState {
  return structuredClone(state);
}

export function addEvent(
  state: GameState,
  type: GameEvent["type"],
  message: string,
): void {
  state.events.unshift({
    id: `event-${String(state.events.length + 1).padStart(3, "0")}`,
    turn: state.game.turn,
    phase: state.game.phase,
    type,
    message,
  });
}

export function tileById(
  state: GameState,
  tileId: TileId,
): TileData | undefined {
  return state.tiles.find((tile) => tile.id === tileId);
}

/** Tướng còn trên bàn cờ (đã loại người đang dưỡng thương / bại trận). */
export function fieldCommanders(state: GameState): CommanderState[] {
  return Object.values(state.commanders).filter((c) => c.status === "FIELD");
}

export function commandersAt(state: GameState, tileId: TileId): CommanderState[] {
  return fieldCommanders(state).filter((c) => c.tileId === tileId);
}

export function controlledTiles(state: GameState, owner: Owner): TileId[] {
  return state.tiles
    .filter((tile) => tile.owner === owner)
    .map((tile) => tile.id);
}

/**
 * Số Ô Thành Trì một nước có lúc khởi đầu — lấy từ vùng thành đã khai, không
 * phải hằng số 9, vì bàn cờ do GM khai báo (§4 nói 9 ô nhưng bàn khác thì khác).
 */
export function totalCapitalTiles(state: GameState, owner: Owner): number {
  return Object.values(state.cities)
    .filter((city) => city.isCapital && city.owner === owner)
    .reduce((sum, city) => sum + city.tiles.length, 0);
}

/** Số Ô Thành Trì còn đứng (chưa bị phá sập thành Ô Trắng). */
export function standingCapitalTiles(state: GameState, owner: Owner): number {
  return state.tiles.filter(
    (tile) => tile.terrain === "capital" && tile.owner === owner,
  ).length;
}

export function kingdomTroops(state: GameState, owner: Owner): number {
  return fieldCommanders(state)
    .filter((c) => c.kingdom === owner)
    .reduce((sum, c) => sum + totalUnits(c.units), 0);
}
