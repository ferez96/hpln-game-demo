import { manhattanDistance, neighbors } from "./coordinates";
import {
  BUILDINGS,
  COMBAT,
  RECRUITMENT,
  SUPPLY,
  TERRAIN_RULES,
} from "./rulebook";
import {
  ArmyState,
  BattleReport,
  Formation,
  GameEvent,
  GameState,
  Owner,
  TileData,
  TileEffect,
  TileId,
  Units,
} from "./types";

// ─── Unit helpers ───────────────────────────────────────────────────────────

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

function scaleUnits(units: Units, ratio: number): Units {
  return {
    infantry: Math.ceil(units.infantry * ratio),
    archers: Math.ceil(units.archers * ratio),
    cavalry: Math.ceil(units.cavalry * ratio),
  };
}

export function emptyUnits(): Units {
  return { infantry: 0, archers: 0, cavalry: 0 };
}

// ─── State helpers ──────────────────────────────────────────────────────────

function cloneState(state: GameState): GameState {
  return structuredClone(state) as GameState;
}

function eventId(state: GameState): string {
  return `event-${String(state.events.length + 1).padStart(3, "0")}`;
}

function battleId(state: GameState): string {
  return `battle-${String(state.battles.length + 1).padStart(3, "0")}`;
}

function addEvent(state: GameState, type: GameEvent["type"], message: string) {
  state.events.unshift({
    id: eventId(state),
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

export function armiesAt(state: GameState, tileId: TileId): ArmyState[] {
  return Object.values(state.armies).filter(
    (army) => army.tileId === tileId && army.status !== "DEFEATED",
  );
}

export function controlledTiles(state: GameState, owner: Owner): TileId[] {
  return state.tiles
    .filter((tile) => tile.owner === owner)
    .map((tile) => tile.id);
}

// ─── Supply ─────────────────────────────────────────────────────────────────

export function isSupplyPassable(tile: TileData, owner: Owner): boolean {
  if (tile.owner !== owner) return false;
  return (SUPPLY.passableTerrain as readonly string[]).includes(tile.terrain);
}

export function hasSupplyLine(
  state: GameState,
  owner: Owner,
  from: TileId,
): boolean {
  const starts = state.kingdoms[owner].castles
    .flatMap((castleId) => state.castles[castleId]?.tiles ?? [])
    .filter((tileId) => tileById(state, tileId)?.owner === owner);
  const frontier = [...starts];
  const visited = new Set<TileId>(frontier);

  while (frontier.length > 0) {
    const current = frontier.shift();
    if (!current) continue;
    if (current === from) return true;

    for (const next of neighbors(current)) {
      if (visited.has(next)) continue;
      const tile = tileById(state, next);
      if (!tile || !isSupplyPassable(tile, owner)) continue;
      visited.add(next);
      frontier.push(next);
    }
  }

  return false;
}

export function updateSupply(state: GameState): GameState {
  const next = cloneState(state);

  for (const army of Object.values(next.armies)) {
    const supplied = hasSupplyLine(next, army.kingdom, army.tileId);
    army.supplied = supplied;
    army.debuffs = supplied
      ? army.debuffs.filter((d) => d !== "STARVING")
      : Array.from(new Set([...army.debuffs, "STARVING"]));
  }

  for (const tile of next.tiles) {
    tile.supplyOwner =
      tile.owner &&
      isSupplyPassable(tile, tile.owner) &&
      hasSupplyLine(next, tile.owner, tile.id)
        ? tile.owner
        : undefined;
  }

  addEvent(
    next,
    "SUPPLY",
    "Đã cập nhật đường lương và trạng thái đói của các đạo quân.",
  );
  return next;
}

// ─── Economy ────────────────────────────────────────────────────────────────

export function collectTurnIncome(state: GameState): GameState {
  const next = cloneState(state);
  const isSummer = next.game.season === "SUMMER";
  const isAutumn = next.game.season === "AUTUMN";
  const grainMultiplier = isAutumn ? 2 : isSummer ? 1 : 1;

  for (const kingdom of Object.values(next.kingdoms)) {
    if (kingdom.eliminated) continue;

    const ownedCities = Object.values(next.cities).filter(
      (city) => city.owner === kingdom.id,
    ).length;
    const ownedPlains = next.tiles.filter(
      (tile) => tile.owner === kingdom.id && tile.terrain === "plains",
    ).length;

    const mineIncome = kingdom.buildings.mine * BUILDINGS.mine.goldPerLevel;
    const farmIncome =
      kingdom.buildings.farm * BUILDINGS.farm.grainPerLevel * grainMultiplier;
    const peopleIncome =
      kingdom.buildings.populationHouse * BUILDINGS.populationHouse.popPerLevel;

    kingdom.resources.gold += mineIncome + ownedCities * 3 + ownedPlains;
    kingdom.resources.grain += farmIncome;
    kingdom.resources.population += peopleIncome;
    kingdom.resources.prestige += 1;
  }

  addEvent(
    next,
    "RESOURCE",
    "Đầu lượt GO: khai mỏ, làm ruộng, tăng dân và cộng uy danh cơ bản.",
  );
  return next;
}

export function buyUnits(
  state: GameState,
  owner: Owner,
  armyId: string,
  units: Partial<Units>,
): GameState {
  const next = cloneState(state);
  const kingdom = next.kingdoms[owner];
  const army = next.armies[armyId];
  if (!kingdom || !army || army.kingdom !== owner) return state;

  const requested = totalUnits({
    infantry: units.infantry ?? 0,
    archers: units.archers ?? 0,
    cavalry: units.cavalry ?? 0,
  });
  const batches = Math.ceil(requested / RECRUITMENT.batchSize);
  const populationCost = requested * RECRUITMENT.populationCostPer1;

  if (
    kingdom.resources.gold < batches ||
    kingdom.resources.population < populationCost
  ) {
    addEvent(
      next,
      "RESOURCE",
      `${kingdom.name} không đủ tài nguyên hoặc dân để mua quân.`,
    );
    return next;
  }

  kingdom.resources.gold -= batches;
  kingdom.resources.population -= populationCost;
  army.units = addUnits(army.units, units);
  addEvent(
    next,
    "RESOURCE",
    `${kingdom.name} chiêu mộ ${requested} quân cho ${army.id}.`,
  );
  return next;
}

// ─── Movement ───────────────────────────────────────────────────────────────

export function moveArmy(
  state: GameState,
  armyId: string,
  to: TileId,
): GameState {
  const next = cloneState(state);
  const army = next.armies[armyId];
  const target = tileById(next, to);
  if (!army || !target || army.status === "DEFEATED") return state;

  if (manhattanDistance(army.tileId, to) !== 1) {
    addEvent(
      next,
      "MOVE",
      `${army.id} không thể di chuyển quá 1 ô trong lượt thường.`,
    );
    return next;
  }

  if (target.terrain === "river" && army.buffs.includes("FORMATION")) {
    addEvent(next, "MOVE", `${army.id} đang khóa trận, không thể xuống sông.`);
    return next;
  }

  if (target.terrain === "river") {
    const general = next.generals[army.generalId];
    if (!general?.inventory.ships.length) {
      addEvent(next, "MOVE", `${army.id} cần thuyền để đi vào ô sông ${to}.`);
      return next;
    }
  }

  army.tileId = to;
  army.status = "MOVING";
  next.generals[army.generalId].location = to;

  if (!target.owner && target.terrain === "plains") {
    target.owner = army.kingdom;
    next.kingdoms[army.kingdom].territory.push(to);
    addEvent(next, "MOVE", `${army.id} chiếm ô trống ${to}.`);
  } else {
    addEvent(next, "MOVE", `${army.id} di chuyển đến ${to}.`);
  }

  return next;
}

// ─── Combat power ──────────────────────────────────────────────────────────
//
// Tách riêng công và thủ theo PDF:
//   Bộ Binh  → 1 công, 1 thủ
//   Cung Thủ → 2 công (có tên) / 3 công (hỏa tiễn) / 1 công (không tên), 1 thủ
//   Kỵ Mã   → 1 công, 1 thủ  (+ Truy Cùng Giết Tận khi thắng)
//
// Các modifier từ địa hình và debuff được nhân vào sau.

function terrainModifier(tile: TileData, army: ArmyState): number {
  let mod = 1.0;
  if (tile.effects.includes("fire")) mod -= 0.4;
  if (tile.effects.includes("flood")) mod -= 0.3;
  if (army.debuffs.includes("STARVING")) mod -= 0.5;
  if (army.buffs.includes("GREAT_GENERAL")) mod += 0.2;
  return Math.max(0.1, mod);
}

function computeAttack(army: ArmyState, tile: TileData): number {
  const { infantry, archers, cavalry } = army.units;
  // Cung: giả sử có tên thường (đơn giản hóa — inventory nằm ở GeneralState)
  const archerAttack = archers * 2;

  let base = infantry * 1 + archerAttack + cavalry * 1;

  // Cung đứng trên núi bắn xuống: +50%
  if (tile.terrain === "mountain" && archers > 0) {
    base += archers * TERRAIN_RULES.mountain.archerAttackBonusFromTop;
  }

  return base * terrainModifier(tile, army);
}

function computeDefense(army: ArmyState, tile: TileData): number {
  const { infantry, archers, cavalry } = army.units;
  const troopDefense = (infantry + archers + cavalry) * 1;

  // Thủ đá của Châu/Trì
  const stoneDefense =
    tile.terrain === "city"
      ? TERRAIN_RULES.city.stoneDefense
      : tile.terrain === "capital"
        ? TERRAIN_RULES.capital.stoneDefense
        : 0;

  // Kề núi: +10% thủ
  const mountainAdj = 0; // cần check 4 ô kề, đơn giản hóa = 0

  return (
    (troopDefense + mountainAdj) * terrainModifier(tile, army) + stoneDefense
  );
}

// ─── Battle resolution ──────────────────────────────────────────────────────
//
// Công thức từ PDF:
//
// Không phòng thủ (cả 2 phe công):
//   Loser mất 50%, Winner mất 50% × số quân loser mất.
//   Kỵ bên thắng còn bao nhiêu, tàn binh bên thua chết thêm bấy nhiêu.
//
// Có phòng thủ (bên thủ dùng DEFENSIVE formation):
//   Attacker wins: Defender mất 25%, Attacker mất 50% × số defender mất.
//   Defender wins: Attacker mất 50%, Defender mất 20% × số attacker mất.

function applyBattleLosses(
  attacker: ArmyState,
  defender: ArmyState,
  result: "ATTACKER_WIN" | "DEFENDER_WIN" | "DRAW",
  defenderIsDefending: boolean,
): { attackerLosses: Units; defenderLosses: Units } {
  if (result === "ATTACKER_WIN") {
    const defLossRatio = defenderIsDefending
      ? COMBAT.vsDefender.attackerWins.defenderTroopLoss // 0.25
      : COMBAT.noDefense.loserTroopLoss; // 0.50
    const defLosses = scaleUnits(defender.units, defLossRatio);
    const atkLosses = scaleUnits(
      defLosses,
      COMBAT.vsDefender.attackerWins.attackerLossRatio,
    );
    return { attackerLosses: atkLosses, defenderLosses: defLosses };
  }

  if (result === "DEFENDER_WIN") {
    const atkLossRatio = defenderIsDefending
      ? COMBAT.vsDefender.defenderWins.attackerTroopLoss // 0.50
      : COMBAT.noDefense.loserTroopLoss; // 0.50
    const atkLosses = scaleUnits(attacker.units, atkLossRatio);
    const defLossRatio = defenderIsDefending
      ? COMBAT.vsDefender.defenderWins.defenderLossRatio // 0.20
      : COMBAT.noDefense.winnerLossRatio; // 0.50
    const defLosses = scaleUnits(atkLosses, defLossRatio);
    return { attackerLosses: atkLosses, defenderLosses: defLosses };
  }

  // DRAW: nhỏ và đối xứng
  return {
    attackerLosses: scaleUnits(attacker.units, 0.1),
    defenderLosses: scaleUnits(defender.units, 0.1),
  };
}

export function resolveBattle(
  state: GameState,
  attackerId: string,
  defenderId: string,
): GameState {
  const next = cloneState(state);
  const attacker = next.armies[attackerId];
  const defender = next.armies[defenderId];
  if (!attacker || !defender || attacker.kingdom === defender.kingdom)
    return state;

  const tile = tileById(next, defender.tileId);
  if (!tile || attacker.tileId !== defender.tileId) {
    addEvent(
      next,
      "BATTLE",
      "Không thể giao chiến vì hai đạo quân không cùng ô.",
    );
    return next;
  }

  const defenderIsDefending = defender.formation === "DEFENSIVE";
  const atkPower = computeAttack(attacker, tile);
  const defPower = defenderIsDefending
    ? computeDefense(defender, tile)
    : computeAttack(defender, tile); // cả 2 phe công → so công vs công

  const result: "ATTACKER_WIN" | "DEFENDER_WIN" | "DRAW" =
    atkPower > defPower * 1.05
      ? "ATTACKER_WIN"
      : defPower > atkPower * 1.05
        ? "DEFENDER_WIN"
        : "DRAW";

  const { attackerLosses, defenderLosses } = applyBattleLosses(
    attacker,
    defender,
    result,
    defenderIsDefending,
  );

  attacker.units = subtractUnits(attacker.units, attackerLosses);
  defender.units = subtractUnits(defender.units, defenderLosses);

  // Kỵ Mã Truy Cùng Giết Tận: bên thắng truy sát tàn binh
  if (result === "ATTACKER_WIN" && attacker.units.cavalry > 0) {
    const pursuit = Math.min(defender.units.infantry, attacker.units.cavalry);
    defender.units.infantry = Math.max(0, defender.units.infantry - pursuit);
  } else if (result === "DEFENDER_WIN" && defender.units.cavalry > 0) {
    const pursuit = Math.min(attacker.units.infantry, defender.units.cavalry);
    attacker.units.infantry = Math.max(0, attacker.units.infantry - pursuit);
  }

  if (totalUnits(attacker.units) === 0) attacker.status = "DEFEATED";
  if (totalUnits(defender.units) === 0) defender.status = "DEFEATED";

  if (result === "ATTACKER_WIN") {
    tile.owner = attacker.kingdom;
    attacker.status = "IDLE";
    defender.status =
      totalUnits(defender.units) === 0 ? "DEFEATED" : "RECOVERING";
    next.generals[attacker.generalId].kills += 1;
  } else if (result === "DEFENDER_WIN") {
    attacker.status =
      totalUnits(attacker.units) === 0 ? "DEFEATED" : "RECOVERING";
    defender.status = "IDLE";
    next.generals[defender.generalId].kills += 1;
  } else {
    attacker.status = "RECOVERING";
    defender.status = "RECOVERING";
  }

  const report: BattleReport = {
    id: battleId(next),
    tileId: tile.id,
    attacker: attacker.id,
    defender: defender.id,
    result,
    attackerLosses,
    defenderLosses,
    notes: [
      `${defenderIsDefending ? "Phòng thủ" : "Đối công"}: ${Math.round(atkPower)} vs ${Math.round(defPower)}.`,
      tile.effects.length
        ? `Hiệu ứng ô: ${tile.effects.join(", ")}.`
        : "Không có hiệu ứng ô.",
    ],
  };

  next.battles.unshift(report);
  addEvent(
    next,
    "BATTLE",
    `${attacker.id} giao chiến ${defender.id} tại ${tile.id}: ${result}.`,
  );
  return next;
}

// ─── Tile effects ───────────────────────────────────────────────────────────

export function applyTileEffect(
  state: GameState,
  tileId: TileId,
  effect: TileEffect,
): GameState {
  const next = cloneState(state);
  const tile = tileById(next, tileId);
  if (!tile) return state;
  tile.effects = Array.from(new Set([...tile.effects, effect]));
  addEvent(next, "BATTLE", `${tileId} bị ảnh hưởng bởi ${effect}.`);
  return next;
}

// ─── Phase / turn ───────────────────────────────────────────────────────────

const SEASON_CYCLE = ["SPRING", "SUMMER", "AUTUMN", "WINTER"] as const;

export function advancePhase(state: GameState): GameState {
  const next = cloneState(state);

  if (next.game.phase === "GO") {
    next.game.phase = "ATC";
    addEvent(
      next,
      "TURN_END",
      `Kết thúc GO ${next.game.turn}, chuyển sang ATC.`,
    );
    return updateSupply(next);
  }

  next.game.phase = "GO";
  next.game.turn += 1;

  const seasonIndex = (next.game.turn - 1) % SEASON_CYCLE.length;
  next.game.season = SEASON_CYCLE[seasonIndex];
  next.game.year = Math.floor((next.game.turn - 1) / SEASON_CYCLE.length) + 1;

  // Mùa Đông: đóng băng mọi hành động quân sự — đây chỉ đặt flag, UI / rules engine tự check
  if (next.game.season === "WINTER") {
    addEvent(
      next,
      "TURN_END",
      `Mùa Đông: ruộng đóng băng, cấm mọi hành động quân sự.`,
    );
  }

  for (const army of Object.values(next.armies)) {
    if (army.status === "MOVING" || army.status === "BATTLE")
      army.status = "IDLE";
    if (army.status === "RECOVERING") army.status = "IDLE";
  }

  for (const general of Object.values(next.generals)) {
    general.cooldowns.greatGeneral = Math.max(
      0,
      general.cooldowns.greatGeneral - 1,
    );
    general.cooldowns.heal = Math.max(0, general.cooldowns.heal - 1);
    general.woundedTurns = Math.max(0, general.woundedTurns - 1);
  }

  addEvent(
    next,
    "TURN_END",
    `Bắt đầu GO ${next.game.turn}, mùa ${next.game.season}.`,
  );
  return collectTurnIncome(updateSupply(next));
}

// ─── Formation ──────────────────────────────────────────────────────────────

export function setFormation(
  state: GameState,
  armyId: string,
  formation: Formation,
): GameState {
  const next = cloneState(state);
  const army = next.armies[armyId];
  if (!army || army.status === "DEFEATED") return state;
  army.formation = formation;
  addEvent(next, "MOVE", `${army.id} chuyển sang thế trận ${formation}.`);
  return next;
}

// ─── Victory ────────────────────────────────────────────────────────────────

export function checkVictory(state: GameState): GameState {
  const next = cloneState(state);

  for (const kingdom of Object.values(next.kingdoms)) {
    // Bị loại khi không còn giữ được bất kỳ ô Thành Trì nào
    const hasAnyFort = kingdom.castles.some((castleId) =>
      next.castles[castleId]?.tiles.some(
        (tileId) => tileById(next, tileId)?.owner === kingdom.id,
      ),
    );
    if (!hasAnyFort) kingdom.eliminated = true;
  }

  const alive = Object.values(next.kingdoms).filter((k) => !k.eliminated);
  if (alive.length === 1) {
    next.game.status = "FINISHED";
    next.victory = { winner: alive[0].id, reason: "CONQUEST" };
    addEvent(next, "VICTORY", `${alive[0].name} thống nhất thiên hạ.`);
  }

  return next;
}
