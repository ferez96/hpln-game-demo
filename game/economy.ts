/**
 * Kinh tế & hậu cần — §3 (Mỏ / Nhà Dân / Ruộng), §6 (tuyển quân) và §5 (luật
 * lương thực). Mọi con số lấy từ `game/rulebook.ts`.
 *
 * Chuỗi tài nguyên là `Tài Nguyên → Dân → Lúa`; hai bước đổi đều là lệnh GM
 * nhập tay, không tự chạy. Bản đồ gốc không định giá "mua lúa" bằng Tài Nguyên
 * nên engine không có đường tắt đó — muốn có lúa thì phải qua Ruộng.
 */

import { retreatToCapital } from "./commander";
import {
  addUnits,
  addEvent,
  killUnits,
  subtractUnits,
  tileById,
  totalUnits,
} from "./helpers";
import {
  BUILDINGS,
  CIVIL_OUTPUT_BOOST,
  GRAIN_UPKEEP_PER_SOLDIER,
  RECRUITMENT,
  ROLE_INCOME,
  TERRITORY_INCOME,
} from "./rulebook";
import { buildSupplyNetwork, reachDistance } from "./supply";
import {
  BuildingKind,
  CityId,
  CommanderState,
  GameState,
  KINGDOMS,
  KingdomState,
  Owner,
  UnitType,
} from "./types";

export type Outcome = { ok: true; detail: string } | { ok: false; error: string };

const ok = (detail: string): Outcome => ({ ok: true, detail });
const fail = (error: string): Outcome => ({ ok: false, error });

const UNIT_LABEL: Record<UnitType, string> = {
  infantry: "Bộ Binh",
  archers: "Cung Thủ",
  cavalry: "Kỵ Mã",
};

export const BUILDING_LABEL: Record<BuildingKind, string> = {
  mine: BUILDINGS.mine.label,
  farm: BUILDINGS.farm.label,
  populationHouse: BUILDINGS.populationHouse.label,
  barracks: BUILDINGS.barracks.label,
  archery: BUILDINGS.archery.label,
  stable: BUILDINGS.stable.label,
};

const RECRUIT_BUILDING: Record<UnitType, "barracks" | "archery" | "stable"> = {
  infantry: "barracks",
  archers: "archery",
  cavalry: "stable",
};

/* ---------- Nâng cấp (§18) ---------- */

/** Nâng ở Turn N thì đầu Turn N+1 mới có hiệu lực; mỗi loại 1 lần/Turn. */
export function upgradeBuilding(
  state: GameState,
  owner: Owner,
  building: BuildingKind,
): Outcome {
  const kingdom = state.kingdoms[owner];
  const spec = BUILDINGS[building];
  const label = BUILDING_LABEL[building];
  const current = kingdom.buildings[building];

  if (current >= spec.maxLevel) {
    return fail(`${label} đã ở cấp tối đa (${spec.maxLevel}).`);
  }
  if (kingdom.pendingUpgrades.some((u) => u.building === building)) {
    return fail(`${label} đang nâng cấp dở, mỗi loại 1 lần mỗi Turn.`);
  }

  const cost = spec.upgradeCost[current - 1];
  if (kingdom.resources.taiNguyen < cost) {
    return fail(
      `Nâng ${label} cần ${cost} Tài Nguyên, ${kingdom.name} chỉ còn ${kingdom.resources.taiNguyen}.`,
    );
  }

  kingdom.resources.taiNguyen -= cost;
  kingdom.pendingUpgrades.push({
    building,
    completesOnTurn: state.game.turn + spec.upgradeDelay,
  });
  return ok(`nâng ${label} lên cấp ${current + 1} (-${cost} TN, xong Turn ${state.game.turn + spec.upgradeDelay})`);
}

/** Đầu Turn: hoàn tất các công trình đã đặt nâng cấp từ Turn trước. */
export function completePendingUpgrades(state: GameState): void {
  for (const kingdom of Object.values(state.kingdoms)) {
    const done = kingdom.pendingUpgrades.filter(
      (u) => u.completesOnTurn <= state.game.turn,
    );
    if (done.length === 0) continue;
    kingdom.pendingUpgrades = kingdom.pendingUpgrades.filter(
      (u) => u.completesOnTurn > state.game.turn,
    );
    for (const upgrade of done) {
      kingdom.buildings[upgrade.building] += 1;
      addEvent(
        state,
        "ECONOMY",
        `${kingdom.name}: ${BUILDING_LABEL[upgrade.building]} lên cấp ${kingdom.buildings[upgrade.building]}.`,
      );
    }
  }
}

/* ---------- Thu nhập (§2, §3, §4) ---------- */

function civilOutput(turn: number): number {
  return turn >= CIVIL_OUTPUT_BOOST.fromTurn
    ? CIVIL_OUTPUT_BOOST.taiNguyen
    : ROLE_INCOME.CIVIL.taiNguyen;
}

export function applyTurnIncome(state: GameState): void {
  for (const owner of KINGDOMS) {
    const kingdom = state.kingdoms[owner];
    if (kingdom.eliminated) continue;

    const mine =
      BUILDINGS.mine.taiNguyenByLevel[kingdom.buildings.mine - 1] ?? 0;

    let territory = 0;
    for (const tile of state.tiles) {
      if (tile.owner !== owner) continue;
      if (tile.terrain === "plains") territory += TERRITORY_INCOME.plains;
      else if (tile.terrain === "city") territory += TERRITORY_INCOME.city;
    }

    let roleTaiNguyen = 0;
    let danTam = 0;
    let uyDanh = 0;
    let deKhi = 0;
    for (const player of Object.values(state.players)) {
      if (player.kingdom !== owner || !player.alive) continue;
      switch (player.role) {
        case "CIVIL":
          roleTaiNguyen += civilOutput(state.game.turn);
          danTam += ROLE_INCOME.CIVIL.danTam;
          break;
        case "GENERAL":
          uyDanh += ROLE_INCOME.GENERAL.uyDanh;
          break;
        case "LORD":
          deKhi += ROLE_INCOME.LORD.deKhi;
          break;
      }
    }

    kingdom.resources.taiNguyen += mine + territory + roleTaiNguyen;
    kingdom.resources.danTam += danTam;
    kingdom.resources.uyDanh += uyDanh;
    kingdom.resources.deKhi += deKhi;

    addEvent(
      state,
      "ECONOMY",
      `${kingdom.name} thu ${mine + territory + roleTaiNguyen} Tài Nguyên ` +
        `(mỏ ${mine}, đất ${territory}, quan văn ${roleTaiNguyen}).`,
    );
  }
}

/* ---------- Quy đổi (§3) ---------- */

/** Nhà Dân: Tài Nguyên → Dân. */
export function convertDan(
  state: GameState,
  owner: Owner,
  taiNguyen: number,
): Outcome {
  const kingdom = state.kingdoms[owner];
  if (taiNguyen <= 0) return fail("Số Tài Nguyên đổi phải lớn hơn 0.");
  if (kingdom.resources.taiNguyen < taiNguyen) {
    return fail(
      `Cần ${taiNguyen} Tài Nguyên, ${kingdom.name} chỉ còn ${kingdom.resources.taiNguyen}.`,
    );
  }
  const rate =
    BUILDINGS.populationHouse.danPerTaiNguyenByLevel[
      kingdom.buildings.populationHouse - 1
    ];
  const dan = taiNguyen * rate;
  kingdom.resources.taiNguyen -= taiNguyen;
  kingdom.resources.dan += dan;
  return ok(`đổi ${taiNguyen} TN lấy ${dan.toLocaleString("vi-VN")} Dân`);
}

/** Ruộng: Dân → Lúa. Đổi là mất Dân. Mùa Thu x2, mùa Đông ruộng đóng băng. */
export function convertLua(
  state: GameState,
  owner: Owner,
  dan: number,
): Outcome {
  const kingdom = state.kingdoms[owner];
  const { danPerBatch, luaPer1000DanByLevel } = BUILDINGS.farm;

  if (state.game.season === "WINTER") {
    return fail("Mùa Đông ruộng đóng băng, không làm ra Lúa.");
  }
  if (dan <= 0 || dan % danPerBatch !== 0) {
    return fail(`Số Dân đổi phải là bội của ${danPerBatch}.`);
  }
  if (kingdom.resources.dan < dan) {
    return fail(
      `Cần ${dan.toLocaleString("vi-VN")} Dân, ${kingdom.name} chỉ còn ${kingdom.resources.dan.toLocaleString("vi-VN")}.`,
    );
  }

  const perBatch = luaPer1000DanByLevel[kingdom.buildings.farm - 1];
  const seasonMultiplier = state.game.season === "AUTUMN" ? 2 : 1;
  const lua = (dan / danPerBatch) * perBatch * seasonMultiplier;

  kingdom.resources.dan -= dan;
  kingdom.resources.lua += lua;
  return ok(
    `đổi ${dan.toLocaleString("vi-VN")} Dân lấy ${lua.toLocaleString("vi-VN")} Lúa` +
      (seasonMultiplier > 1 ? " (mùa Thu x2)" : ""),
  );
}

/* ---------- Tuyển quân (§6) ---------- */

/**
 * Bộ Binh tuyển từ Dân; Cung Thủ và Kỵ Mã quy đổi từ Bộ Binh của chính tướng
 * đó. Quân mới xuất phát từ Thành Trì (§4) nên tướng phải đang đứng trên Trì.
 */
export function recruit(
  state: GameState,
  commander: CommanderState,
  unitType: UnitType,
  amount: number,
): Outcome {
  const kingdom = state.kingdoms[commander.kingdom];
  const tile = tileById(state, commander.tileId);
  const label = UNIT_LABEL[unitType];

  if (amount <= 0) return fail("Số quân phải lớn hơn 0.");
  if (tile?.terrain !== "capital" || tile.owner !== commander.kingdom) {
    return fail(
      `${commander.name} phải đứng trên Ô Thành Trì của nước mình mới tuyển quân được.`,
    );
  }

  const building = RECRUIT_BUILDING[unitType];
  const spec = BUILDINGS[building];
  const level = kingdom.buildings[building];
  const perBatch = spec.troopsByLevel[level - 1];
  const batches = Math.ceil(amount / perBatch);
  const delivered = batches * perBatch;
  const taiNguyenCost = batches * RECRUITMENT.taiNguyenPerBatch;

  if (kingdom.resources.taiNguyen < taiNguyenCost) {
    return fail(
      `Tuyển ${delivered.toLocaleString("vi-VN")} ${label} cần ${taiNguyenCost} Tài Nguyên, ${kingdom.name} chỉ còn ${kingdom.resources.taiNguyen}.`,
    );
  }

  if (unitType === "infantry") {
    const danCost =
      batches * BUILDINGS.barracks.danCostByLevel[level - 1];
    if (kingdom.resources.dan < danCost) {
      return fail(
        `Tuyển ${delivered.toLocaleString("vi-VN")} ${label} cần ${danCost.toLocaleString("vi-VN")} Dân, ${kingdom.name} chỉ còn ${kingdom.resources.dan.toLocaleString("vi-VN")}.`,
      );
    }
    kingdom.resources.taiNguyen -= taiNguyenCost;
    kingdom.resources.dan -= danCost;
    commander.units = addUnits(commander.units, { infantry: delivered });
    return ok(
      `tuyển ${delivered.toLocaleString("vi-VN")} ${label} (-${taiNguyenCost} TN, -${danCost.toLocaleString("vi-VN")} Dân)`,
    );
  }

  const spec2 = unitType === "archers" ? BUILDINGS.archery : BUILDINGS.stable;
  const infantryCost = batches * spec2.infantryCostByLevel[level - 1];
  if (commander.units.infantry < infantryCost) {
    return fail(
      `Đổi ${delivered.toLocaleString("vi-VN")} ${label} cần ${infantryCost.toLocaleString("vi-VN")} Bộ Binh, ${commander.name} chỉ có ${commander.units.infantry.toLocaleString("vi-VN")}.`,
    );
  }

  kingdom.resources.taiNguyen -= taiNguyenCost;
  commander.units = addUnits(
    subtractUnits(commander.units, { infantry: infantryCost }),
    unitType === "archers" ? { archers: delivered } : { cavalry: delivered },
  );
  return ok(
    `đổi ${infantryCost.toLocaleString("vi-VN")} Bộ lấy ${delivered.toLocaleString("vi-VN")} ${label} (-${taiNguyenCost} TN)`,
  );
}

/* ---------- Luật lương thực (§5) ---------- */

export interface StarvationRecord {
  commanderId: string;
  kingdom: Owner;
  tileId: string;
  fed: number;
  starved: number;
  /** Chỉ nối được vựa Châu (không nối kho quốc gia) — ô sẽ mất chủ nếu đói. */
  chauOnly: boolean;
  wipedOut: boolean;
  tileLost: boolean;
}

interface Granary {
  /** `null` = kho quốc gia; ngược lại là Châu Thành. */
  city: CityId | null;
  distance: number;
  take: (amount: number) => number;
}

/**
 * Đầu Go, sau khi mua bán: mỗi lính ăn 1 Lúa. Lính gần vựa ăn trước; kho quốc
 * gia (qua Trì) được ưu tiên trước các vựa Châu.
 *
 * §5 phân biệt hai kiểu cạn lúa: ô chỉ nối vựa Châu mà vựa hết thì lính chết
 * *và* ô mất chủ; ô nối được kho quốc gia thì lính vẫn chết đói nhưng ô giữ
 * nguyên màu.
 */
export function applyGrainUpkeep(state: GameState): StarvationRecord[] {
  const records: StarvationRecord[] = [];

  for (const owner of KINGDOMS) {
    const kingdom = state.kingdoms[owner];
    if (kingdom.eliminated) continue;

    const network = buildSupplyNetwork(state, owner);
    const commanders = Object.values(state.commanders).filter(
      (c) => c.kingdom === owner && c.status === "FIELD",
    );

    const plans = commanders.map((commander) => {
      const nationalDistance = reachDistance(
        state,
        network.national,
        commander.tileId,
      );
      const granaries: Granary[] = [];

      if (nationalDistance !== undefined) {
        granaries.push({
          city: null,
          distance: nationalDistance,
          take: (amount) => drawFromPool(kingdom, amount),
        });
      }
      for (const [cityId, distances] of network.chau) {
        const distance = reachDistance(state, distances, commander.tileId);
        if (distance === undefined) continue;
        granaries.push({
          city: cityId,
          distance,
          take: (amount) => drawFromChau(state, cityId, amount),
        });
      }
      // Kho quốc gia trước, rồi tới vựa Châu theo khoảng cách tăng dần.
      granaries.sort((a, b) => {
        if ((a.city === null) !== (b.city === null)) return a.city === null ? -1 : 1;
        return a.distance - b.distance;
      });

      const nearest = granaries.length
        ? Math.min(...granaries.map((g) => g.distance))
        : Number.POSITIVE_INFINITY;

      return {
        commander,
        granaries,
        nearest,
        chauOnly: nationalDistance === undefined,
      };
    });

    plans.sort((a, b) => a.nearest - b.nearest);

    for (const plan of plans) {
      const need = totalUnits(plan.commander.units) * GRAIN_UPKEEP_PER_SOLDIER;
      if (need === 0) continue;

      let fed = 0;
      for (const granary of plan.granaries) {
        if (fed >= need) break;
        fed += granary.take(need - fed);
      }

      const starved = need - fed;
      const record: StarvationRecord = {
        commanderId: plan.commander.id,
        kingdom: owner,
        tileId: plan.commander.tileId,
        fed,
        starved,
        chauOnly: plan.chauOnly,
        wipedOut: false,
        tileLost: false,
      };

      if (starved > 0) {
        const losses = killUnits(plan.commander.units, starved);
        plan.commander.units = subtractUnits(plan.commander.units, losses);
        addEvent(
          state,
          "STARVATION",
          `${plan.commander.name} thiếu ${starved.toLocaleString("vi-VN")} Lúa tại ${plan.commander.tileId}, chết đói ${starved.toLocaleString("vi-VN")} lính.`,
        );

        // Chỉ nối vựa Châu mà vựa cạn: ô mất chủ ngay (§5).
        if (plan.chauOnly) {
          const tile = tileById(state, plan.commander.tileId);
          if (tile && tile.terrain === "plains" && tile.owner === owner) {
            tile.owner = undefined;
            tile.supplyOwner = undefined;
            record.tileLost = true;
          }
        }

        if (totalUnits(plan.commander.units) === 0) {
          record.wipedOut = true;
          retreatToCapital(state, plan.commander);
          addEvent(
            state,
            "STARVATION",
            `${plan.commander.name} mất sạch quân vì đói, lui về Thành Trì dưỡng thương.`,
          );
        }
      }

      records.push(record);
    }
  }

  return records;
}

function drawFromPool(kingdom: KingdomState, amount: number): number {
  const taken = Math.min(kingdom.resources.lua, amount);
  kingdom.resources.lua -= taken;
  return taken;
}

function drawFromChau(
  state: GameState,
  cityId: CityId,
  amount: number,
): number {
  const city = state.cities[cityId];
  if (!city) return 0;
  const taken = Math.min(city.grainReserve, amount);
  city.grainReserve -= taken;
  return taken;
}
