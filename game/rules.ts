import { manhattanDistance, neighbors } from "./coordinates";
import {
  ArmyState,
  BattleReport,
  GameEvent,
  GameState,
  Owner,
  TileData,
  TileEffect,
  TileId,
  Units,
} from "./types";

const SEASONS = ["SPRING", "SUMMER", "AUTUMN", "WINTER"] as const;

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

export function emptyUnits(): Units {
  return { infantry: 0, archers: 0, cavalry: 0 };
}

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

export function tileById(state: GameState, tileId: TileId): TileData | undefined {
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

export function isSupplyPassable(tile: TileData, owner: Owner): boolean {
  if (tile.owner !== owner) return false;
  return tile.terrain === "plains" || tile.terrain === "city" || tile.terrain === "capital";
}

export function hasSupplyLine(state: GameState, owner: Owner, from: TileId): boolean {
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
      ? army.debuffs.filter((debuff) => debuff !== "STARVING")
      : Array.from(new Set([...army.debuffs, "STARVING"]));
  }

  for (const tile of next.tiles) {
    tile.supplyOwner =
      tile.owner && isSupplyPassable(tile, tile.owner) && hasSupplyLine(next, tile.owner, tile.id)
        ? tile.owner
        : undefined;
  }

  addEvent(next, "SUPPLY", "Đã cập nhật đường lương và trạng thái đói của các đạo quân.");
  return next;
}

export function collectTurnIncome(state: GameState): GameState {
  const next = cloneState(state);

  for (const kingdom of Object.values(next.kingdoms)) {
    if (kingdom.eliminated) continue;

    const ownedCities = Object.values(next.cities).filter(
      (city) => city.owner === kingdom.id,
    ).length;
    const ownedLand = next.tiles.filter(
      (tile) => tile.owner === kingdom.id && tile.terrain === "plains",
    ).length;
    const mineIncome = kingdom.buildings.mine * 3;
    const farmIncome = kingdom.buildings.farm * 3000;
    const peopleIncome = kingdom.buildings.populationHouse * 2000;

    kingdom.resources.gold += mineIncome + ownedCities * 3 + ownedLand;
    kingdom.resources.grain += farmIncome;
    kingdom.resources.population += peopleIncome;
    kingdom.resources.prestige += 1;
  }

  addEvent(next, "RESOURCE", "Đầu lượt GO: khai mỏ, làm ruộng, tăng dân và cộng uy danh cơ bản.");
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
  const batches = Math.ceil(requested / 1000);
  const populationCost = requested * 2;

  if (kingdom.resources.gold < batches || kingdom.resources.population < populationCost) {
    addEvent(next, "RESOURCE", `${kingdom.name} không đủ tài nguyên hoặc dân để mua quân.`);
    return next;
  }

  kingdom.resources.gold -= batches;
  kingdom.resources.population -= populationCost;
  army.units = addUnits(army.units, units);
  addEvent(next, "RESOURCE", `${kingdom.name} chiêu mộ ${requested} quân cho ${army.id}.`);
  return next;
}

export function moveArmy(state: GameState, armyId: string, to: TileId): GameState {
  const next = cloneState(state);
  const army = next.armies[armyId];
  const target = tileById(next, to);
  if (!army || !target || army.status === "DEFEATED") return state;

  if (manhattanDistance(army.tileId, to) !== 1) {
    addEvent(next, "MOVE", `${army.id} không thể di chuyển quá 1 ô trong lượt thường.`);
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

function terrainModifier(tile: TileData, army: ArmyState): number {
  let modifier = 1;
  if (tile.terrain === "mountain" && army.units.archers > 0) modifier += 0.3;
  if (tile.terrain === "forest" && army.units.cavalry > 0) modifier -= 0.2;
  if (tile.effects.includes("fire")) modifier -= 0.4;
  if (tile.effects.includes("flood")) modifier -= 0.3;
  if (army.debuffs.includes("STARVING")) modifier -= 0.5;
  if (army.buffs.includes("GREAT_GENERAL")) modifier += 0.2;
  return Math.max(0.1, modifier);
}

function armyPower(tile: TileData, army: ArmyState): number {
  const unitPower =
    army.units.infantry + army.units.archers * 1.15 + army.units.cavalry * 1.25;
  const morale = Math.max(1, army.morale) / 10;
  const formation =
    army.formation === "OFFENSIVE" ? 1.15 : army.formation === "DEFENSIVE" ? 0.9 : 1;
  return unitPower * morale * formation * terrainModifier(tile, army);
}

function losses(units: Units, ratio: number): Units {
  return {
    infantry: Math.min(units.infantry, Math.ceil(units.infantry * ratio)),
    archers: Math.min(units.archers, Math.ceil(units.archers * ratio)),
    cavalry: Math.min(units.cavalry, Math.ceil(units.cavalry * ratio)),
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
  if (!attacker || !defender || attacker.kingdom === defender.kingdom) return state;

  const tile = tileById(next, defender.tileId);
  if (!tile || attacker.tileId !== defender.tileId) {
    addEvent(next, "BATTLE", "Không thể giao chiến vì hai đạo quân không cùng ô.");
    return next;
  }

  const attackPower = armyPower(tile, attacker);
  const defendPower = armyPower(tile, defender) * (tile.owner === defender.kingdom ? 1.15 : 1);
  const result =
    attackPower > defendPower * 1.05
      ? "ATTACKER_WIN"
      : defendPower > attackPower * 1.05
        ? "DEFENDER_WIN"
        : "DRAW";

  const attackerLosses = losses(attacker.units, result === "ATTACKER_WIN" ? 0.2 : 0.45);
  const defenderLosses = losses(defender.units, result === "DEFENDER_WIN" ? 0.2 : 0.45);
  attacker.units = subtractUnits(attacker.units, attackerLosses);
  defender.units = subtractUnits(defender.units, defenderLosses);

  if (totalUnits(attacker.units) === 0) attacker.status = "DEFEATED";
  if (totalUnits(defender.units) === 0) defender.status = "DEFEATED";

  if (result === "ATTACKER_WIN") {
    tile.owner = attacker.kingdom;
    attacker.status = "IDLE";
    defender.status = totalUnits(defender.units) === 0 ? "DEFEATED" : "RECOVERING";
    next.generals[attacker.generalId].kills += 1;
  } else if (result === "DEFENDER_WIN") {
    attacker.status = totalUnits(attacker.units) === 0 ? "DEFEATED" : "RECOVERING";
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
      `Công ${Math.round(attackPower)} vs thủ ${Math.round(defendPower)}.`,
      tile.effects.length ? `Hiệu ứng ô: ${tile.effects.join(", ")}.` : "Không có hiệu ứng ô.",
    ],
  };

  next.battles.unshift(report);
  addEvent(next, "BATTLE", `${attacker.id} giao chiến ${defender.id} tại ${tile.id}: ${result}.`);
  return next;
}

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

export function advancePhase(state: GameState): GameState {
  const next = cloneState(state);

  if (next.game.phase === "GO") {
    next.game.phase = "ATC";
    addEvent(next, "TURN_END", `Kết thúc GO ${next.game.turn}, chuyển sang ATC.`);
    return updateSupply(next);
  }

  next.game.phase = "GO";
  next.game.turn += 1;

  const seasonIndex = (next.game.turn - 1) % SEASONS.length;
  next.game.season = SEASONS[seasonIndex];
  next.game.year = Math.floor((next.game.turn - 1) / SEASONS.length) + 1;

  for (const army of Object.values(next.armies)) {
    if (army.status === "MOVING" || army.status === "BATTLE") army.status = "IDLE";
    if (army.status === "RECOVERING") army.status = "IDLE";
  }

  for (const general of Object.values(next.generals)) {
    general.cooldowns.greatGeneral = Math.max(0, general.cooldowns.greatGeneral - 1);
    general.cooldowns.heal = Math.max(0, general.cooldowns.heal - 1);
    general.woundedTurns = Math.max(0, general.woundedTurns - 1);
  }

  addEvent(next, "TURN_END", `Bắt đầu GO ${next.game.turn}, mùa ${next.game.season}.`);
  return collectTurnIncome(updateSupply(next));
}

export function checkVictory(state: GameState): GameState {
  const next = cloneState(state);
  const alive = Object.values(next.kingdoms).filter((kingdom) => !kingdom.eliminated);

  for (const kingdom of Object.values(next.kingdoms)) {
    const hasCapital = kingdom.castles.some((castleId) =>
      next.castles[castleId]?.tiles.some(
        (tileId) => tileById(next, tileId)?.owner === kingdom.id,
      ),
    );
    if (!hasCapital) kingdom.eliminated = true;
  }

  const remaining = alive.filter((kingdom) => !kingdom.eliminated);
  if (remaining.length === 1) {
    next.game.status = "FINISHED";
    next.victory = {
      winner: remaining[0].id,
      reason: "CONQUEST",
    };
    addEvent(next, "VICTORY", `${remaining[0].name} thống nhất thiên hạ.`);
  }

  return next;
}
