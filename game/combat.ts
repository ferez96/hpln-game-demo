/**
 * Binh Pháp — công thức chiến đấu (§8).
 *
 * Nguồn công thức là `reference/Tam Quoc Chi - full text.txt` dòng 96, đã mã
 * hóa sẵn trong `COMBAT` của `game/rulebook.ts`:
 *
 *   Địch không phòng thủ (so Công vs Công)
 *     bên thua mất ½ quân; bên thắng chết = 50% số quân bên thua mất.
 *
 *   Địch có phòng thủ (so Công ta vs Thủ địch)
 *     Thủ địch cao hơn  → ta mất ½ quân, địch chết 20% số ta mất.
 *     Thủ địch thấp hơn → địch mất ¼ quân, ta chết 50% số địch mất.
 *
 * Sau đó Kỵ bên thắng truy sát: tàn binh bên thua chết thêm đúng bằng số Kỵ
 * còn lại của bên thắng. Mùa Hạ nhân đôi mọi con số chết (§9).
 */

import { neighbors } from "./coordinates";
import { retreatToCapital } from "./commander";
import {
  addEvent,
  cloneState,
  emptyUnits,
  killUnits,
  subtractUnits,
  tileById,
  totalUnits,
} from "./helpers";
import { COMBAT, GENERAL_RANKS, TERRAIN_RULES, UNIT_STATS } from "./rulebook";
import {
  BattleReport,
  BattleResult,
  CommanderState,
  GameState,
  Owner,
  Stance,
  TileData,
  TileId,
  Units,
} from "./types";

/** Một phe trong trận đánh tại một ô. */
export interface BattleSide {
  kingdom: Owner;
  commanders: CommanderState[];
  /** Phe này vừa hành quân vào ô (dùng cho luật hòa "đi xa hơn thua"). */
  moved: boolean;
}

/* ---------- Chỉ số ---------- */

function sideUnits(side: BattleSide): Units {
  return side.commanders.reduce<Units>(
    (acc, c) => ({
      infantry: acc.infantry + c.units.infantry,
      archers: acc.archers + c.units.archers,
      cavalry: acc.cavalry + c.units.cavalry,
    }),
    emptyUnits(),
  );
}

/** Đói thì còn nửa sức; lửa/lụt trên ô cũng bào chỉ số (§10 — giữ sẵn hook). */
function conditionModifier(commander: CommanderState, tile: TileData): number {
  let mod = 1;
  if (commander.debuffs.includes("STARVING")) mod -= 0.5;
  if (tile.effects.includes("fire")) mod -= 0.4;
  if (tile.effects.includes("flood")) mod -= 0.3;
  return Math.max(0.1, mod);
}

/** Số mặt núi kề ô — mỗi mặt +10% Thủ (§4). */
export function mountainFaces(state: GameState, tileId: TileId): number {
  return neighbors(tileId, state.map.size).filter(
    (id) => tileById(state, id)?.terrain === "mountain",
  ).length;
}

/** Thủ Đá của ô thành (§8). Ô thường không có. */
export function stoneDefense(tile: TileData): number {
  if (tile.terrain === "city") return TERRAIN_RULES.city.stoneDefense;
  if (tile.terrain === "capital") return TERRAIN_RULES.capital.stoneDefense;
  return 0;
}

/**
 * Công: Bộ 1, Cung 2 (giả định luôn có Tên thường — Lò Rèn §14 chưa nằm trong
 * MVP), Kỵ 1. Cung đứng trên núi bắn xuống +50%.
 */
export function attackPower(
  side: BattleSide,
  tile: TileData,
): number {
  let total = 0;
  for (const commander of side.commanders) {
    const { infantry, archers, cavalry } = commander.units;
    let base =
      infantry * UNIT_STATS.infantry.attack +
      archers * UNIT_STATS.archers.arrowAttack +
      cavalry * UNIT_STATS.cavalry.attack;
    if (tile.terrain === "mountain") {
      base += archers * TERRAIN_RULES.mountain.archerAttackBonusFromTop;
    }
    total += base * conditionModifier(commander, tile);
  }
  return total;
}

/**
 * Thủ: mỗi lính 1, cộng Thủ Đá của ô thành, rồi nhân bonus Núi cho cả cụm —
 * đúng cách đọc "6000 Thủ Đá + chỉ số lính ô đó + Thủ Núi".
 */
export function defensePower(
  state: GameState,
  side: BattleSide,
  tile: TileData,
  /** Thủ Đá chỉ tính khi ô thành không thuộc về bên đang công. */
  includeStone = true,
): number {
  let troops = 0;
  for (const commander of side.commanders) {
    troops +=
      totalUnits(commander.units) *
      UNIT_STATS.infantry.defense *
      conditionModifier(commander, tile);
  }
  const stone = includeStone ? stoneDefense(tile) : 0;
  const bonus = 1 + mountainFaces(state, tile.id) * TERRAIN_RULES.mountain.adjacentDefenseBonus;
  return (troops + stone) * bonus;
}

/** §8 — cả ô Công nếu có bất kỳ Tướng nào bật Công, ngược lại cả ô Thủ. */
export function sideStance(side: BattleSide): Stance {
  return side.commanders.some((c) => c.stance === "CONG") ? "CONG" : "THU";
}

/* ---------- Phân bổ thiệt hại ---------- */

/** Trừ `count` lính khỏi cả phe, chia theo tỉ lệ quân mỗi tướng đang cầm. */
function applyLossesToSide(side: BattleSide, count: number): Units {
  const total = totalUnits(sideUnits(side));
  if (count <= 0 || total === 0) return emptyUnits();

  const applied = emptyUnits();
  let remaining = Math.min(count, total);

  side.commanders.forEach((commander, index) => {
    if (remaining <= 0) return;
    const own = totalUnits(commander.units);
    if (own === 0) return;
    const isLast = index === side.commanders.length - 1;
    const share = isLast
      ? remaining
      : Math.min(own, Math.round((own / total) * count));
    const losses = killUnits(commander.units, Math.min(share, remaining));
    commander.units = subtractUnits(commander.units, losses);
    applied.infantry += losses.infantry;
    applied.archers += losses.archers;
    applied.cavalry += losses.cavalry;
    remaining -= totalUnits(losses);
  });

  return applied;
}

function sideCavalry(side: BattleSide): number {
  return side.commanders.reduce((sum, c) => sum + c.units.cavalry, 0);
}

/* ---------- Luật hòa (§8) ---------- */

function breakTie(
  attacker: BattleSide,
  defender: BattleSide,
): { result: BattleResult; note: string } {
  if (attacker.commanders.length !== defender.commanders.length) {
    return attacker.commanders.length > defender.commanders.length
      ? { result: "ATTACKER_WIN", note: "Hòa chỉ số, bên công nhiều Tướng hơn." }
      : { result: "DEFENDER_WIN", note: "Hòa chỉ số, bên thủ nhiều Tướng hơn." };
  }

  // Bằng số Tướng: bên đi xa hơn thua.
  if (attacker.moved !== defender.moved) {
    return attacker.moved
      ? { result: "DEFENDER_WIN", note: "Hòa chỉ số, bên công đi xa hơn nên thua." }
      : { result: "ATTACKER_WIN", note: "Hòa chỉ số, bên thủ đi xa hơn nên thua." };
  }

  const attackerKills = attacker.commanders.reduce((s, c) => s + c.kills, 0);
  const defenderKills = defender.commanders.reduce((s, c) => s + c.kills, 0);
  if (attackerKills !== defenderKills) {
    return attackerKills > defenderKills
      ? { result: "ATTACKER_WIN", note: "Hòa chỉ số, bên công nhiều Liên Trảm hơn." }
      : { result: "DEFENDER_WIN", note: "Hòa chỉ số, bên thủ nhiều Liên Trảm hơn." };
  }

  const attackerCavalry = sideCavalry(attacker);
  const defenderCavalry = sideCavalry(defender);
  if (attackerCavalry !== defenderCavalry) {
    return attackerCavalry > defenderCavalry
      ? { result: "ATTACKER_WIN", note: "Hòa chỉ số, bên công nhiều Kỵ Mã hơn." }
      : { result: "DEFENDER_WIN", note: "Hòa chỉ số, bên thủ nhiều Kỵ Mã hơn." };
  }

  return { result: "STALEMATE", note: "Hòa hoàn toàn — đình chiến, bên công lùi lại." };
}

/* ---------- Giải quyết một trận ---------- */

export interface BattleOutcome {
  report: BattleReport;
  /** Ô đổi chủ về tay bên công. */
  captured: boolean;
  /** Ô Thành Trì bị phá sập, thành Ô Trắng vĩnh viễn (§4). */
  destroyed: boolean;
}

export function resolveTileBattle(
  state: GameState,
  tileId: TileId,
  attacker: BattleSide,
  defender: BattleSide,
): BattleOutcome {
  const tile = tileById(state, tileId)!;
  const summer = state.game.season === "SUMMER";
  const deathMultiplier = summer ? COMBAT.summerMultiplier : 1;

  const defenderStance = sideStance(defender);
  const defending = defenderStance === "THU";
  // Thành của chính bên đang công thì không chống lại họ.
  const stoneApplies = tile.owner !== attacker.kingdom;

  const atkPower = attackPower(attacker, tile);
  const defPower = defending
    ? defensePower(state, defender, tile, stoneApplies)
    : attackPower(defender, tile);

  const notes: string[] = [
    `${defending ? "Bên thủ phòng ngự" : "Đối công"}: Công ${Math.round(atkPower).toLocaleString("vi-VN")} vs ` +
      `${defending ? "Thủ" : "Công"} ${Math.round(defPower).toLocaleString("vi-VN")}.`,
  ];
  const stone = stoneApplies ? stoneDefense(tile) : 0;
  if (defending && stone > 0) {
    notes.push(
      `${tile.label ?? tile.id}: ${stone.toLocaleString("vi-VN")} Thủ Đá` +
        (mountainFaces(state, tileId) > 0
          ? `, +${mountainFaces(state, tileId) * 10}% bonus Núi.`
          : "."),
    );
  }

  let result: BattleResult;
  if (atkPower > defPower) result = "ATTACKER_WIN";
  else if (defPower > atkPower) result = "DEFENDER_WIN";
  else {
    const tie = breakTie(attacker, defender);
    result = tie.result;
    notes.push(tie.note);
  }

  const attackerBefore = totalUnits(sideUnits(attacker));
  const defenderBefore = totalUnits(sideUnits(defender));

  let attackerLosses = emptyUnits();
  let defenderLosses = emptyUnits();

  if (result === "ATTACKER_WIN") {
    const ratio = defending
      ? COMBAT.vsDefender.attackerWins.defenderTroopLoss
      : COMBAT.noDefense.loserTroopLoss;
    const defenderDeaths = Math.min(
      defenderBefore,
      Math.ceil(defenderBefore * ratio * deathMultiplier),
    );
    defenderLosses = applyLossesToSide(defender, defenderDeaths);

    const winnerRatio = defending
      ? COMBAT.vsDefender.attackerWins.attackerLossRatio
      : COMBAT.noDefense.winnerLossRatio;
    attackerLosses = applyLossesToSide(
      attacker,
      Math.ceil(defenderDeaths * winnerRatio),
    );
  } else if (result === "DEFENDER_WIN") {
    const ratio = defending
      ? COMBAT.vsDefender.defenderWins.attackerTroopLoss
      : COMBAT.noDefense.loserTroopLoss;
    const attackerDeaths = Math.min(
      attackerBefore,
      Math.ceil(attackerBefore * ratio * deathMultiplier),
    );
    attackerLosses = applyLossesToSide(attacker, attackerDeaths);

    const winnerRatio = defending
      ? COMBAT.vsDefender.defenderWins.defenderLossRatio
      : COMBAT.noDefense.winnerLossRatio;
    defenderLosses = applyLossesToSide(
      defender,
      Math.ceil(attackerDeaths * winnerRatio),
    );
  }

  // Kỵ Mã Truy Cùng Giết Tận — chỉ khi có bên thắng, tắt khi đánh trên sông.
  if (result !== "STALEMATE" && tile.terrain !== "river") {
    const winner = result === "ATTACKER_WIN" ? attacker : defender;
    const loser = result === "ATTACKER_WIN" ? defender : attacker;
    const cavalry = sideCavalry(winner);
    if (cavalry >= UNIT_STATS.cavalry.minForChase) {
      const pursued = applyLossesToSide(loser, cavalry * deathMultiplier);
      const pursuedTotal = totalUnits(pursued);
      if (pursuedTotal > 0) {
        notes.push(
          `Kỵ truy sát: tàn binh chết thêm ${pursuedTotal.toLocaleString("vi-VN")}.`,
        );
        const bucket =
          result === "ATTACKER_WIN" ? defenderLosses : attackerLosses;
        bucket.infantry += pursued.infantry;
        bucket.archers += pursued.archers;
        bucket.cavalry += pursued.cavalry;
      }
    }
  }

  if (summer) notes.push("Mùa Hạ: số lính chết nhân đôi.");

  // Tướng mất sạch quân thì bại trận, về Trì dưỡng thương.
  const routed: CommanderState[] = [];
  for (const commander of [...attacker.commanders, ...defender.commanders]) {
    if (totalUnits(commander.units) === 0 && commander.status === "FIELD") {
      routed.push(commander);
    }
  }

  // §Cấp bậc — Liên Trảm 3 tướng liên tiếp thì thăng Đại Tướng Quân; Đại Tướng
  // Quân thua dù chỉ 1 trận thì giáng lại Tướng Quân; về Trì dưỡng thương thì
  // mất sạch Liên Trảm (Kill tích lũy trở về 0).
  const winners =
    result === "ATTACKER_WIN"
      ? attacker.commanders
      : result === "DEFENDER_WIN"
        ? defender.commanders
        : [];
  const losers =
    result === "ATTACKER_WIN"
      ? defender.commanders
      : result === "DEFENDER_WIN"
        ? attacker.commanders
        : [];

  for (const c of winners) {
    c.kills += 1;
    if (c.rank === "GENERAL" && c.kills >= GENERAL_RANKS.GENERAL.killStreakToPromote) {
      c.rank = "GREAT_GENERAL";
      addEvent(
        state,
        "BATTLE",
        `${c.name} liên trảm ${c.kills} tướng địch, thăng Đại Tướng Quân.`,
      );
    }
  }
  for (const c of losers) {
    if (c.rank === "GREAT_GENERAL") {
      c.rank = "GENERAL";
      addEvent(state, "BATTLE", `${c.name} bại trận, giáng về Tướng Quân.`);
    }
  }

  for (const commander of routed) {
    commander.kills = 0;
    retreatToCapital(state, commander);
  }

  let captured = false;
  let destroyed = false;

  if (result === "ATTACKER_WIN") {
    if (tile.terrain === "capital") {
      // §4 — Thành Trì không bị "chiếm", nó bị phá sập thành Ô Trắng vĩnh viễn.
      tile.terrain = "plains";
      tile.owner = attacker.kingdom;
      tile.label = undefined;
      tile.cityId = undefined;
      destroyed = true;
      addEvent(
        state,
        "SIEGE",
        `Ô Thành Trì ${tile.id} bị phá sập, vĩnh viễn thành Ô Trắng.`,
      );
    } else {
      tile.owner = attacker.kingdom;
      captured = true;
    }
  }

  const report: BattleReport = {
    id: `battle-${String(state.battles.length + 1).padStart(3, "0")}`,
    turn: state.game.turn,
    phase: state.game.phase,
    tileId,
    attackers: attacker.commanders.map((c) => c.id),
    defenders: defender.commanders.map((c) => c.id),
    attackerPower: Math.round(atkPower),
    defenderPower: Math.round(defPower),
    defenderStance,
    result,
    attackerLosses,
    defenderLosses,
    notes,
  };

  state.battles.unshift(report);
  return { report, captured, destroyed };
}

/**
 * Đánh vào ô thành không có quân trấn giữ — vẫn phải phá Thủ Đá (§8: "Ô không
 * địch tính như đất trống", nhưng Châu/Trì luôn có Thủ Đá).
 */
export function resolveEmptyFortAssault(
  state: GameState,
  tileId: TileId,
  attacker: BattleSide,
): BattleOutcome {
  const emptySide: BattleSide = {
    kingdom: tileById(state, tileId)?.owner ?? attacker.kingdom,
    commanders: [],
    moved: false,
  };
  return resolveTileBattle(state, tileId, attacker, emptySide);
}

/** Điều kiện thua: mất sạch 9 Ô Thành Trì (§4). */
export function checkVictory(state: GameState): GameState {
  const next = cloneState(state);

  for (const kingdom of Object.values(next.kingdoms)) {
    if (kingdom.eliminated) continue;
    const standing = next.tiles.filter(
      (t) => t.terrain === "capital" && t.owner === kingdom.id,
    ).length;
    if (standing === 0) {
      kingdom.eliminated = true;
      addEvent(next, "VICTORY", `${kingdom.name} bị phá hết Thành Trì và sụp đổ.`);
    }
  }

  const alive = Object.values(next.kingdoms).filter((k) => !k.eliminated);
  if (alive.length === 1 && next.game.status === "RUNNING") {
    next.game.status = "FINISHED";
    next.victory = { winner: alive[0].id, reason: "CONQUEST" };
    addEvent(next, "VICTORY", `${alive[0].name} thống nhất thiên hạ.`);
  }

  return next;
}
