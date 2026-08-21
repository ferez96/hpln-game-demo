/** Vòng đời của một Tướng trên bàn cờ: biên chế, bại trận, dưỡng thương. */

import { centerTile } from "./board";
import { totalUnits } from "./helpers";
import { ARMY_LIMITS, GENERAL_RANKS } from "./rulebook";
import { CommanderState, GameState, Owner, TileId } from "./types";

/** §2 (cơ chế phụ) — bại trận thì về Thành Trì dưỡng 2 Turn. */
export const RECOVERY_TURNS = 2;

/** §6 — Tướng cần tối thiểu 1000 lính mới di chuyển được. */
export function canMove(commander: CommanderState): boolean {
  return totalUnits(commander.units) >= ARMY_LIMITS.minToMove;
}

/** §6 Biên Chế — số lính tối đa mang theo khi di chuyển. */
export function movementCapacity(commander: CommanderState): number {
  return commander.rank === "WAR_GOD"
    ? GENERAL_RANKS.WAR_GOD.maxTroopsMoving
    : GENERAL_RANKS.GENERAL.maxTroopsMoving;
}

/**
 * Ô Thành Trì còn đứng của một nước — nơi tướng bại trận quay về. Tính từ các
 * ô còn lại chứ không từ bàn cờ gốc, vì Trì bị phá sập là mất vĩnh viễn (§4).
 */
export function homeTile(
  state: GameState,
  kingdom: Owner,
): TileId | undefined {
  const standing = state.tiles
    .filter((t) => t.terrain === "capital" && t.owner === kingdom)
    .map((t) => t.id);
  return centerTile(standing);
}

/**
 * Đưa tướng về Trì dưỡng thương. Nước đã mất sạch Trì thì tướng không còn chỗ
 * về — coi như bại trận hoàn toàn.
 */
export function retreatToCapital(
  state: GameState,
  commander: CommanderState,
): void {
  const home = homeTile(state, commander.kingdom);
  if (!home) {
    commander.status = "DEFEATED";
    return;
  }
  commander.status = "RECOVERING";
  commander.readyOnTurn = state.game.turn + RECOVERY_TURNS;
  commander.tileId = home;
  commander.enteredTileOnTurn = state.game.turn;
  commander.stance = "THU";
  commander.debuffs = [];
}

/** Đầu Turn: ai đã dưỡng đủ thì ra trận lại. */
export function tickRecovery(state: GameState): CommanderState[] {
  const returned: CommanderState[] = [];
  for (const commander of Object.values(state.commanders)) {
    if (commander.status !== "RECOVERING") continue;
    if (commander.readyOnTurn > state.game.turn) continue;
    const home = homeTile(state, commander.kingdom);
    if (!home) {
      commander.status = "DEFEATED";
      continue;
    }
    commander.status = "FIELD";
    commander.tileId = home;
    commander.enteredTileOnTurn = state.game.turn;
    returned.push(commander);
  }
  return returned;
}
