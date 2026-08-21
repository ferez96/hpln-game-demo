/**
 * Giải quyết một lượt (Go hoặc Atc).
 *
 * Lệnh của cả ba nước được xử lý *đồng thời*: phần kinh tế chạy tuần tự theo
 * thứ tự GM dán vào, còn hành quân và giao chiến thì gom lại rồi phân xử theo
 * từng ô, đúng như GM làm tay.
 *
 * Thứ tự trong một lượt Go bám theo §5/§7/§8:
 *   mua bán & đổi tài nguyên → trừ lúa → hành quân → giao chiến → nối lương.
 *
 * Thu nhập và các việc đầu Turn (hoàn tất nâng cấp, tướng dưỡng xong, chết
 * bệnh ở Rừng/Núi) chạy ở `beginTurn`, tức cuối lượt Atc trước đó — nhờ vậy
 * trạng thái GM nhìn thấy khi soát lệnh đúng bằng trạng thái lệnh sẽ chạy trên.
 */

import { resolveTileBattle, checkVictory, BattleSide } from "./combat";
import { retreatToCapital, tickRecovery } from "./commander";
import {
  applyGrainUpkeep,
  applyTurnIncome,
  completePendingUpgrades,
  StarvationRecord,
} from "./economy";
import {
  addEvent,
  cloneState,
  commandersAt,
  fieldCommanders,
  tileById,
  totalUnits,
} from "./helpers";
import {
  applyImmediate,
  checkMovement,
  checkPreconditions,
  CommandResult,
  DEFERRED_TYPES,
} from "./orders/validate";
import { ParsedLine } from "./orders/parse";
import { applyTurnScoring, calculateScore, rankKingdoms } from "./scoring";
import { GAME_STRUCTURE } from "./rulebook";
import { updateSupply } from "./supply";
import {
  BattleReport,
  CommanderState,
  GameEvent,
  GamePhase,
  GameState,
  KINGDOMS,
  Owner,
  Season,
  TileId,
} from "./types";

const SEASON_CYCLE: Season[] = ["SPRING", "SUMMER", "AUTUMN", "WINTER"];

export const SEASON_LABEL: Record<Season, string> = {
  SPRING: "Xuân",
  SUMMER: "Hạ",
  AUTUMN: "Thu",
  WINTER: "Đông",
};

export interface MovementRecord {
  commanderId: string;
  name: string;
  kingdom: Owner;
  from: TileId;
  to: TileId;
  captured: boolean;
  bounced: boolean;
}

export interface TurnReport {
  year: number;
  turn: number;
  season: Season;
  phase: GamePhase;
  orders: CommandResult[];
  movements: MovementRecord[];
  battles: BattleReport[];
  starvation: StarvationRecord[];
  events: GameEvent[];
  scores: Record<Owner, { live: number; total: number }>;
  victory: GameState["victory"];
}

export interface ResolveResult {
  state: GameState;
  report: TurnReport;
}

/* ---------- Việc đầu Turn ---------- */

/**
 * Chạy khi một Turn mới bắt đầu: hoàn tất nâng cấp, tướng dưỡng xong ra trận,
 * quân ở Rừng/Núi quá hạn chết bệnh, rồi thu nhập.
 */
export function beginTurn(state: GameState): GameState {
  const next = cloneState(state);

  completePendingUpgrades(next);

  for (const commander of tickRecovery(next)) {
    addEvent(
      next,
      "TURN",
      `${commander.name} dưỡng xong, trở lại ${commander.tileId}.`,
    );
  }

  applyIllness(next);
  applyTurnIncome(next);
  updateSupply(next);

  return next;
}

/**
 * §4 — ở Rừng hoặc Núi quá 1 Turn thì chết bệnh hết.
 *
 * Vào ô ở Turn N thì Turn N là lượt được phép ở; Turn N+1 vẫn sống để còn kịp
 * ra lệnh rút, sang đầu Turn N+2 mới chết. Nếu tính chết ngay đầu Turn N+1 thì
 * bước lên núi là án tử không có đường gỡ — beginTurn chạy trước khi GM nhập
 * lệnh Go, nên tướng không bao giờ có cơ hội đi khỏi.
 */
function applyIllness(state: GameState): void {
  for (const commander of fieldCommanders(state)) {
    const tile = tileById(state, commander.tileId);
    if (!tile) continue;
    if (tile.terrain !== "forest" && tile.terrain !== "mountain") continue;
    if (commander.enteredTileOnTurn >= state.game.turn - 1) continue;

    const lost = totalUnits(commander.units);
    commander.units = { infantry: 0, archers: 0, cavalry: 0 };
    addEvent(
      state,
      "STARVATION",
      `${commander.name} ở ${tile.terrain === "forest" ? "Rừng" : "Núi"} ${tile.id} quá hạn, ` +
        `${lost.toLocaleString("vi-VN")} lính chết bệnh.`,
    );
    retreatToCapital(state, commander);
  }
}

/** Ván mới: dựng trạng thái rồi chạy luôn việc đầu Turn 1. */
export function startGame(state: GameState): GameState {
  return beginTurn(state);
}

/* ---------- Hành quân & giao chiến ---------- */

interface Intent {
  commander: CommanderState;
  from: TileId;
  to: TileId;
  attack: boolean;
}

function collectIntents(
  state: GameState,
  entries: ParsedLine[],
): { intents: Intent[]; results: CommandResult[] } {
  const intents: Intent[] = [];
  const results: CommandResult[] = [];
  const claimed = new Set<string>();

  for (const entry of entries) {
    const command = entry.command!;
    const base = { line: entry.line, raw: entry.raw, command };

    const pre = checkPreconditions(state, command);
    if (pre) {
      results.push({ ...base, ok: false, error: (pre as { error: string }).error });
      continue;
    }

    if (claimed.has(command.actor)) {
      results.push({
        ...base,
        ok: false,
        error: "Mỗi Tướng chỉ ra được 1 lệnh hành quân mỗi lượt.",
      });
      continue;
    }

    const outcome = checkMovement(state, command);
    if (!outcome.ok) {
      results.push({ ...base, ok: false, error: outcome.error });
      continue;
    }

    const commander = state.commanders[command.actor];
    claimed.add(command.actor);
    results.push({ ...base, ok: true, detail: outcome.detail });
    intents.push({
      commander,
      from: commander.tileId,
      to: command.to!,
      attack: command.type === "ATTACK",
    });
  }

  return { intents, results };
}

/** §7 Đi Xuyên Nhau — hai Tướng đổi chỗ cho nhau thì không tính là giao chiến. */
function findSwaps(intents: Intent[]): Set<string> {
  const byCommander = new Map(intents.map((i) => [i.commander.id, i]));
  const swapped = new Set<string>();

  for (const intent of intents) {
    if (intent.attack) continue;
    for (const other of byCommander.values()) {
      if (other.commander.id === intent.commander.id) continue;
      if (other.attack) continue;
      if (other.from === intent.to && other.to === intent.from) {
        swapped.add(intent.commander.id);
        swapped.add(other.commander.id);
      }
    }
  }

  return swapped;
}

function moveCommander(
  state: GameState,
  commander: CommanderState,
  to: TileId,
): boolean {
  commander.tileId = to;
  commander.enteredTileOnTurn = state.game.turn;

  const tile = tileById(state, to);
  if (!tile) return false;
  // §4 — chỉ Ô Trắng, Châu Thành và Thành Trì mới thuộc về ai được.
  if (tile.terrain === "plains" && tile.owner !== commander.kingdom) {
    tile.owner = commander.kingdom;
    return true;
  }
  return false;
}

function resolveMovement(
  state: GameState,
  intents: Intent[],
): { movements: MovementRecord[]; battles: BattleReport[] } {
  const movements: MovementRecord[] = [];
  const battles: BattleReport[] = [];
  const swaps = findSwaps(intents);

  // Đổi chỗ xuyên nhau: đi thẳng, không đụng độ.
  for (const intent of intents) {
    if (!swaps.has(intent.commander.id)) continue;
    const captured = moveCommander(state, intent.commander, intent.to);
    movements.push({
      commanderId: intent.commander.id,
      name: intent.commander.name,
      kingdom: intent.commander.kingdom,
      from: intent.from,
      to: intent.to,
      captured,
      bounced: false,
    });
  }

  const pending = intents.filter((i) => !swaps.has(i.commander.id));

  // Gom theo ô đích để phân xử từng ô một.
  const byTarget = new Map<TileId, Intent[]>();
  for (const intent of pending) {
    const list = byTarget.get(intent.to) ?? [];
    list.push(intent);
    byTarget.set(intent.to, list);
  }

  for (const [tileId, arrivals] of byTarget) {
    const tile = tileById(state, tileId);
    if (!tile) continue;

    const leaving = new Set(
      pending.filter((i) => i.to !== i.from).map((i) => i.commander.id),
    );
    const arrivalIds = new Set(arrivals.map((a) => a.commander.id));
    // Quân giữ ô: đang đứng đây, không rời đi, và không phải bên chủ động đánh
    // (Tướng ra lệnh `danh` ngay trên ô mình đứng vẫn tính là bên công).
    const holders = commandersAt(state, tileId).filter(
      (c) => !leaving.has(c.id) && !arrivalIds.has(c.id),
    );

    const kingdomsInvolved = new Set<Owner>([
      ...holders.map((c) => c.kingdom),
      ...arrivals.map((a) => a.commander.kingdom),
    ]);

    const isEnemyFort =
      (tile.terrain === "city" || tile.terrain === "capital") &&
      arrivals.some((a) => tile.owner !== a.commander.kingdom);

    // Không có địch và không phải thành địch: vào thẳng.
    if (kingdomsInvolved.size <= 1 && !isEnemyFort) {
      for (const intent of arrivals) {
        const captured = moveCommander(state, intent.commander, tileId);
        movements.push({
          commanderId: intent.commander.id,
          name: intent.commander.name,
          kingdom: intent.commander.kingdom,
          from: intent.from,
          to: tileId,
          captured,
          bounced: false,
        });
      }
      continue;
    }

    const arrivingKingdoms = [...new Set(arrivals.map((a) => a.commander.kingdom))];

    // Bên thủ: ưu tiên quân đang giữ ô. Ô trống mà nhiều nước cùng tiến vào thì
    // chúng đánh nhau — chủ ô (nếu có mặt) là bên giữ nhà, không thì lấy nước
    // đầu theo thứ tự cố định cho kết quả ổn định. Ô trống chỉ một nước tiến
    // vào thì bên thủ là chủ ô (đánh thành bỏ không).
    let defenderKingdom: Owner | undefined = holders[0]?.kingdom;
    if (!defenderKingdom) {
      if (arrivingKingdoms.length > 1) {
        defenderKingdom =
          tile.owner && arrivingKingdoms.includes(tile.owner)
            ? tile.owner
            : arrivingKingdoms[0];
      } else if (tile.owner && !arrivingKingdoms.includes(tile.owner)) {
        defenderKingdom = tile.owner;
      }
    }

    // Bên thủ tiến vào ô này thì cũng là quân trấn ở đó khi trận nổ ra.
    const defendingArrivals = arrivals.filter(
      (a) => a.commander.kingdom === defenderKingdom,
    );
    for (const intent of defendingArrivals) {
      intent.commander.tileId = tileId;
      intent.commander.enteredTileOnTurn = state.game.turn;
    }

    const originOf = new Map(
      arrivals.map((a) => [a.commander.id, a.from] as const),
    );

    const attackerKingdoms = [...kingdomsInvolved].filter(
      (k) => k !== defenderKingdom,
    );

    for (const attackerKingdom of attackerKingdoms) {
      const attackingIntents = arrivals.filter(
        (a) =>
          a.commander.kingdom === attackerKingdom &&
          a.commander.status === "FIELD",
      );
      if (attackingIntents.length === 0) continue;

      const attackerSide: BattleSide = {
        kingdom: attackerKingdom,
        commanders: attackingIntents.map((a) => a.commander),
        moved: attackingIntents.some((a) => a.to !== a.from),
      };

      // Tính lại bên thủ mỗi vòng: nước thứ ba đánh vào sẽ gặp kẻ vừa chiếm ô.
      const defenders = commandersAt(state, tileId).filter(
        (c) => c.kingdom !== attackerKingdom,
      );
      const currentDefenderKingdom = defenders[0]?.kingdom ?? defenderKingdom;
      const defenderSide: BattleSide = {
        kingdom: currentDefenderKingdom ?? attackerKingdom,
        commanders: defenders.filter(
          (c) => c.kingdom === currentDefenderKingdom,
        ),
        // Bên thủ chỉ tính là "đi xa" khi toàn bộ quân của nó vừa hành quân tới.
        moved:
          defenders.length > 0 &&
          defenders.every((c) => originOf.has(c.id)),
      };

      const outcome = resolveTileBattle(
        state,
        tileId,
        attackerSide,
        defenderSide,
      );
      battles.push(outcome.report);

      const won = outcome.report.result === "ATTACKER_WIN";

      // Bên thủ thua mà vừa hành quân tới thì bị đẩy về ô xuất phát.
      if (won) {
        for (const commander of defenderSide.commanders) {
          if (commander.status !== "FIELD") continue;
          const origin = originOf.get(commander.id);
          if (origin && origin !== tileId) {
            commander.tileId = origin;
            movements.push({
              commanderId: commander.id,
              name: commander.name,
              kingdom: commander.kingdom,
              from: origin,
              to: origin,
              captured: false,
              bounced: true,
            });
          }
        }
      }

      for (const intent of attackingIntents) {
        const commander = intent.commander;
        if (commander.status !== "FIELD") {
          movements.push({
            commanderId: commander.id,
            name: commander.name,
            kingdom: commander.kingdom,
            from: intent.from,
            to: commander.tileId,
            captured: false,
            bounced: true,
          });
          continue;
        }
        if (won) {
          commander.tileId = tileId;
          commander.enteredTileOnTurn = state.game.turn;
        }
        movements.push({
          commanderId: commander.id,
          name: commander.name,
          kingdom: commander.kingdom,
          from: intent.from,
          to: won ? tileId : intent.from,
          captured: won && outcome.captured,
          bounced: !won,
        });
      }
    }

    // Bên thủ giữ được ô và vừa hành quân tới thì ghi nhận là đã tới nơi.
    for (const intent of defendingArrivals) {
      if (intent.commander.tileId !== tileId) continue;
      const tileNow = tileById(state, tileId);
      const captured =
        tileNow?.terrain === "plains" && tileNow.owner !== intent.commander.kingdom;
      if (captured && tileNow) tileNow.owner = intent.commander.kingdom;
      movements.push({
        commanderId: intent.commander.id,
        name: intent.commander.name,
        kingdom: intent.commander.kingdom,
        from: intent.from,
        to: tileId,
        captured,
        bounced: false,
      });
    }
  }

  return { movements, battles };
}

/* ---------- Giải quyết lượt ---------- */

function snapshotScores(state: GameState): TurnReport["scores"] {
  return Object.fromEntries(
    KINGDOMS.map((owner) => [
      owner,
      { live: calculateScore(state, owner), total: state.kingdoms[owner].score },
    ]),
  ) as TurnReport["scores"];
}

function applyImmediates(
  state: GameState,
  parsed: ParsedLine[],
): { results: CommandResult[]; deferred: ParsedLine[] } {
  const results: CommandResult[] = [];
  const deferred: ParsedLine[] = [];

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
    if (DEFERRED_TYPES.has(entry.command.type)) {
      deferred.push(entry);
      continue;
    }
    const pre = checkPreconditions(state, entry.command);
    if (pre) {
      results.push({
        line: entry.line,
        raw: entry.raw,
        command: entry.command,
        ok: false,
        error: (pre as { error: string }).error,
      });
      continue;
    }
    const outcome = applyImmediate(state, entry.command);
    results.push({
      line: entry.line,
      raw: entry.raw,
      command: entry.command,
      ok: outcome.ok,
      detail: outcome.ok ? outcome.detail : undefined,
      error: outcome.ok ? undefined : outcome.error,
    });
  }

  return { results, deferred };
}

function advanceClock(state: GameState): void {
  state.game.turn += 1;
  state.game.season = SEASON_CYCLE[(state.game.turn - 1) % SEASON_CYCLE.length];
  state.game.year =
    Math.floor((state.game.turn - 1) / SEASON_CYCLE.length) + 1;
  state.game.phase = "GO";
}

/** Hết 20 Turn mà chưa ai thống nhất: nước điểm cao nhất thắng (§1). */
function applyTimeLimit(state: GameState): void {
  if (state.game.status !== "RUNNING") return;
  if (state.game.turn < GAME_STRUCTURE.maxTurns) return;

  const ranked = rankKingdoms(state);
  const winner = ranked[0];
  if (!winner) return;
  state.game.status = "FINISHED";
  state.victory = { winner, reason: "SCORE" };
  addEvent(
    state,
    "VICTORY",
    `Hết ${GAME_STRUCTURE.maxTurns} Turn — ${state.kingdoms[winner].name} thắng theo điểm ` +
      `(${state.kingdoms[winner].score} điểm).`,
  );
}

export function resolvePhase(
  state: GameState,
  parsed: ParsedLine[],
): ResolveResult {
  const next = cloneState(state);
  const eventsBefore = next.events.length;
  const battlesBefore = next.battles.length;

  const { results, deferred } = applyImmediates(next, parsed);

  let starvation: StarvationRecord[] = [];
  let movements: MovementRecord[] = [];

  if (next.game.phase === "GO") {
    // §5 — đầu Go, ngay sau khi mua bán, lính phải ăn.
    starvation = applyGrainUpkeep(next);

    const collected = collectIntents(next, deferred);
    results.push(...collected.results);
    movements = resolveMovement(next, collected.intents).movements;
  } else {
    for (const entry of deferred) {
      results.push({
        line: entry.line,
        raw: entry.raw,
        command: entry.command,
        ok: false,
        error: "Lệnh này chỉ ra được ở lượt Go.",
      });
    }
  }

  // Trả về đúng thứ tự GM đã dán vào, để đối chiếu cho dễ.
  results.sort((a, b) => a.line - b.line);

  updateSupply(next);
  for (const commander of fieldCommanders(next)) {
    commander.debuffs = commander.supplied
      ? commander.debuffs.filter((d) => d !== "STARVING")
      : [...new Set([...commander.debuffs, "STARVING" as const])];
  }

  const phaseResolved = next.game.phase;

  if (phaseResolved === "GO") {
    next.game.phase = "ATC";
    addEvent(next, "TURN", `Kết thúc Go ${next.game.turn}, chuyển sang Atc.`);
  } else {
    applyTurnScoring(next);
    addEvent(next, "TURN", `Kết thúc Turn ${next.game.turn}.`);
  }

  let settled = checkVictory(next);
  if (phaseResolved === "ATC" && settled.game.status === "RUNNING") {
    applyTimeLimit(settled);
    if (settled.game.status === "RUNNING") {
      advanceClock(settled);
      settled = beginTurn(settled);
      addEvent(
        settled,
        "TURN",
        `Bắt đầu Turn ${settled.game.turn} — Năm ${settled.game.year}, mùa ${SEASON_LABEL[settled.game.season]}.`,
      );
    }
  }

  const report: TurnReport = {
    year: state.game.year,
    turn: state.game.turn,
    season: state.game.season,
    phase: phaseResolved,
    orders: results,
    movements,
    battles: settled.battles.slice(0, settled.battles.length - battlesBefore),
    starvation,
    events: settled.events.slice(0, settled.events.length - eventsBefore),
    scores: snapshotScores(settled),
    victory: settled.victory,
  };

  return { state: settled, report };
}
