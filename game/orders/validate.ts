/**
 * Kiểm tra và thực thi lệnh.
 *
 * Lệnh chia hai nhóm:
 *   - *tức thời* (kinh tế, thế trận, chuyển quân) — chạy tuần tự ngay khi giải
 *     quyết lượt, nên kiểm tra bằng cách chạy thử trên bản sao trạng thái;
 *   - *trì hoãn* (di chuyển, tấn công) — mọi phe cùng lúc, nên chỉ kiểm tra
 *     tĩnh ở đây rồi để `game/resolve.ts` xử lý đồng thời.
 *
 * Console GM hiển thị ✓/✗ bằng đúng hàm mà lượt thật sẽ chạy, nên kết quả xem
 * trước không thể lệch với kết quả thật.
 */

import { manhattanDistance } from "../coordinates";
import { canMove, movementCapacity } from "../commander";
import {
  convertDan,
  convertLua,
  Outcome,
  recruit,
  upgradeBuilding,
} from "../economy";
import {
  addUnits,
  cloneState,
  commandersAt,
  subtractUnits,
  tileById,
  totalUnits,
} from "../helpers";
import { ARMY_LIMITS } from "../rulebook";
import { CommanderState, GameCommand, GameState, UnitType } from "../types";
import { ParsedLine } from "./parse";

const UNIT_LABEL: Record<UnitType, string> = {
  infantry: "Bộ Binh",
  archers: "Cung Thủ",
  cavalry: "Kỵ Mã",
};

export interface CommandResult {
  line: number;
  raw: string;
  command?: GameCommand;
  ok: boolean;
  /** Mô tả điều sẽ xảy ra khi lệnh hợp lệ. */
  detail?: string;
  error?: string;
}

const fail = (error: string): Outcome => ({ ok: false, error });
const pass = (detail: string): Outcome => ({ ok: true, detail });

export const DEFERRED_TYPES = new Set<GameCommand["type"]>(["MOVE", "ATTACK"]);

/** Lệnh chỉ ra được ở lượt Go, trừ đổi thế trận (làm được cả hai lượt). */
const GO_ONLY = new Set<GameCommand["type"]>([
  "MOVE",
  "ATTACK",
  "RECRUIT",
  "TRANSFER",
  "CONVERT_DAN",
  "CONVERT_LUA",
  "UPGRADE",
]);

/** §9 — mùa Đông đóng băng mọi hoạt động quân sự. */
const WINTER_BLOCKED = new Set<GameCommand["type"]>([
  "MOVE",
  "ATTACK",
  "RECRUIT",
  "TRANSFER",
  "STANCE",
]);

function commanderOf(
  state: GameState,
  command: GameCommand,
): CommanderState | undefined {
  return state.commanders[command.actor];
}

/** Điều kiện chung: người còn sống, nước còn tồn tại, đúng lượt, đúng mùa. */
export function checkPreconditions(
  state: GameState,
  command: GameCommand,
): Outcome | null {
  if (state.game.status === "FINISHED") return fail("Ván đấu đã kết thúc.");

  const player = state.players[command.actor];
  if (!player?.alive) return fail("Người chơi này không còn trong ván.");
  if (state.kingdoms[command.kingdom].eliminated) {
    return fail(`${state.kingdoms[command.kingdom].name} đã sụp đổ.`);
  }
  if (state.game.phase !== "GO" && GO_ONLY.has(command.type)) {
    return fail("Lệnh này chỉ ra được ở lượt Go.");
  }
  if (state.game.season === "WINTER" && WINTER_BLOCKED.has(command.type)) {
    return fail("Mùa Đông đóng băng mọi hoạt động quân sự.");
  }
  return null;
}

/** Lệnh cấp quốc gia chỉ Chủ Công hoặc Quân Sư mới chốt được (§2). */
function checkNationalAuthority(
  state: GameState,
  command: GameCommand,
): Outcome | null {
  const role = state.players[command.actor].role;
  if (role === "LORD" || role === "STRATEGIST") return null;
  return fail("Chỉ Chủ Công hoặc Quân Sư mới chốt được lệnh cấp quốc gia.");
}

function requireFieldCommander(
  state: GameState,
  command: GameCommand,
): { commander: CommanderState } | Outcome {
  const commander = commanderOf(state, command);
  if (!commander) {
    const role = state.players[command.actor].role;
    const label = role === "CIVIL" ? "Quan Văn" : "Quân Sư";
    return fail(`${label} không cầm quân ra trận được.`);
  }
  if (commander.status === "RECOVERING") {
    return fail(
      `${commander.name} đang dưỡng thương, Turn ${commander.readyOnTurn} mới ra trận lại.`,
    );
  }
  if (commander.status === "DEFEATED") {
    return fail(`${commander.name} đã bại trận hoàn toàn.`);
  }
  return { commander };
}

/* ---------- Di chuyển & tấn công (kiểm tra tĩnh) ---------- */

export function checkMovement(state: GameState, command: GameCommand): Outcome {
  const found = requireFieldCommander(state, command);
  if ("ok" in found) return found;
  const { commander } = found;

  const target = tileById(state, command.to!);
  if (!target) return fail(`Không có ô ${command.to} trên bản đồ.`);

  const distance = manhattanDistance(commander.tileId, target.id);
  if (command.type === "MOVE" && distance !== 1) {
    return fail(
      distance === 0
        ? `${commander.name} đã đứng ở ${target.id}.`
        : `${commander.name} chỉ đi được 1 ô theo cạnh vuông (${commander.tileId} → ${target.id} là ${distance} ô).`,
    );
  }
  if (command.type === "ATTACK" && distance > 1) {
    return fail(
      `${commander.name} chỉ đánh được ô mình đang đứng hoặc ô kề cạnh vuông.`,
    );
  }

  if (!canMove(commander)) {
    return fail(
      `${commander.name} cần tối thiểu ${ARMY_LIMITS.minToMove.toLocaleString("vi-VN")} lính mới di chuyển được (đang có ${totalUnits(commander.units).toLocaleString("vi-VN")}).`,
    );
  }

  const capacity = movementCapacity(commander);
  if (totalUnits(commander.units) > capacity) {
    return fail(
      `${commander.name} vượt biên chế hành quân ${capacity.toLocaleString("vi-VN")} lính (đang cầm ${totalUnits(commander.units).toLocaleString("vi-VN")}).`,
    );
  }

  if (target.terrain === "river") {
    return fail(`Cần thuyền mới vào được ô sông ${target.id}.`);
  }

  if (command.type === "ATTACK") {
    const enemies = commandersAt(state, target.id).filter(
      (c) => c.kingdom !== commander.kingdom,
    );
    const isEnemyFort =
      (target.terrain === "city" || target.terrain === "capital") &&
      target.owner !== commander.kingdom;
    if (enemies.length === 0 && !isEnemyFort) {
      return fail(`${target.id} không có quân địch hay thành địch để đánh.`);
    }
    return pass(`đánh ${target.id}`);
  }

  return pass(`${commander.tileId} → ${target.id}`);
}

/* ---------- Lệnh tức thời ---------- */

export function applyImmediate(
  state: GameState,
  command: GameCommand,
): Outcome {
  switch (command.type) {
    case "STANCE": {
      const found = requireFieldCommander(state, command);
      if ("ok" in found) return found;
      found.commander.stance = command.stance!;
      return pass(
        `${found.commander.name} chuyển sang thế ${command.stance === "CONG" ? "Công" : "Thủ"}`,
      );
    }

    case "RECRUIT": {
      const found = requireFieldCommander(state, command);
      if ("ok" in found) return found;
      return recruit(state, found.commander, command.unitType!, command.amount!);
    }

    case "TRANSFER": {
      const found = requireFieldCommander(state, command);
      if ("ok" in found) return found;
      const from = found.commander;
      const to = state.commanders[command.target!];
      if (!to || to.status !== "FIELD") {
        return fail("Người nhận không có mặt trên bàn cờ.");
      }
      if (to.kingdom !== from.kingdom) {
        return fail("Không chuyển quân sang nước khác được.");
      }
      if (to.tileId !== from.tileId) {
        return fail(
          `${from.name} (${from.tileId}) và ${to.name} (${to.tileId}) không đứng cùng ô.`,
        );
      }
      if (to.id === from.id) {
        return fail("Không thể chuyển quân cho chính mình.");
      }
      const unitType = command.unitType!;
      const amount = command.amount!;
      if (amount <= 0) return fail("Số quân chuyển phải lớn hơn 0.");
      if (from.units[unitType] < amount) {
        return fail(
          `${from.name} chỉ có ${from.units[unitType].toLocaleString("vi-VN")} ${UNIT_LABEL[unitType]}.`,
        );
      }
      // §7 — gửi/rút quân phải để lại tối thiểu 1000 lính.
      if (totalUnits(from.units) - amount < ARMY_LIMITS.leaveAtLeast) {
        return fail(
          `Phải để lại tối thiểu ${ARMY_LIMITS.leaveAtLeast.toLocaleString("vi-VN")} lính cho ${from.name}.`,
        );
      }
      from.units = subtractUnits(from.units, { [unitType]: amount });
      to.units = addUnits(to.units, { [unitType]: amount });
      return pass(
        `chuyển ${amount.toLocaleString("vi-VN")} ${UNIT_LABEL[unitType]} sang ${to.name}`,
      );
    }

    case "CONVERT_DAN": {
      const authority = checkNationalAuthority(state, command);
      if (authority) return authority;
      return convertDan(state, command.kingdom, command.amount!);
    }

    case "CONVERT_LUA": {
      const authority = checkNationalAuthority(state, command);
      if (authority) return authority;
      return convertLua(state, command.kingdom, command.amount!);
    }

    case "UPGRADE": {
      const authority = checkNationalAuthority(state, command);
      if (authority) return authority;
      return upgradeBuilding(state, command.kingdom, command.building!);
    }

    default:
      return fail(`Lệnh ${command.type} không xử lý ở bước này.`);
  }
}

/* ---------- Kiểm tra cả khối lệnh ---------- */

/**
 * Chạy thử toàn bộ khối lệnh trên bản sao trạng thái và trả về kết quả từng
 * dòng. Không đụng vào `state` gốc.
 */
export function validateOrders(
  state: GameState,
  parsed: ParsedLine[],
): CommandResult[] {
  const draft = cloneState(state);
  const results: CommandResult[] = [];
  const deferred: ParsedLine[] = [];

  // Lượt thật chạy hết mọi lệnh tức thời của mọi phe trước, rồi mới xử lý
  // hành quân/tấn công gộp (xem game/resolve.ts: applyImmediates + collectIntents).
  // Xem trước phải theo đúng hai đợt này, không thì thứ tự dòng GM dán vào có
  // thể làm preview lệch với kết quả thật.
  for (const entry of parsed) {
    if (!entry.command) {
      results.push({
        line: entry.line,
        raw: entry.raw,
        ok: false,
        error: entry.error,
      });
      continue;
    }

    const command = entry.command;
    const pre = checkPreconditions(draft, command);
    if (pre) {
      results.push({
        line: entry.line,
        raw: entry.raw,
        command,
        ok: false,
        error: (pre as { error: string }).error,
      });
      continue;
    }

    if (DEFERRED_TYPES.has(command.type)) {
      deferred.push(entry);
      continue;
    }

    const outcome = applyImmediate(draft, command);
    results.push({
      line: entry.line,
      raw: entry.raw,
      command,
      ok: outcome.ok,
      detail: outcome.ok ? outcome.detail : undefined,
      error: outcome.ok ? undefined : outcome.error,
    });
  }

  const movers = new Set<string>();
  for (const entry of deferred) {
    const command = entry.command!;
    const outcome = movers.has(command.actor)
      ? fail("Mỗi Tướng chỉ ra được 1 lệnh hành quân mỗi lượt.")
      : checkMovement(draft, command);
    if (outcome.ok) movers.add(command.actor);

    results.push({
      line: entry.line,
      raw: entry.raw,
      command,
      ok: outcome.ok,
      detail: outcome.ok ? outcome.detail : undefined,
      error: outcome.ok ? undefined : outcome.error,
    });
  }

  results.sort((a, b) => a.line - b.line);
  return results;
}
