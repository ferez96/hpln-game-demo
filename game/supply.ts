/**
 * Nối lương (§7) — đường tiếp lương chỉ chạy trên ô đã chiếm của chính nước
 * mình, theo cạnh vuông, không xuyên Rừng/Núi/Sông và không nối chéo.
 *
 * Có hai loại vựa: kho quốc gia (nằm ở Thành Trì, chính là `resources.lua`) và
 * vựa riêng của từng Châu Thành (`CityState.grainReserve`). Phân biệt hai loại
 * là cần thiết vì §5 xử lý chúng khác nhau khi cạn lúa.
 */

import { neighbors } from "./coordinates";
import { tileById } from "./helpers";
import { SUPPLY } from "./rulebook";
import { CityId, GameState, Owner, TileData, TileId } from "./types";

export function isSupplyPassable(tile: TileData, owner: Owner): boolean {
  if (tile.owner !== owner) return false;
  return (SUPPLY.passableTerrain as readonly string[]).includes(tile.terrain);
}

/** BFS đa nguồn theo cạnh vuông; trả về khoảng cách (số ô) tới vựa gần nhất. */
export function supplyDistances(
  state: GameState,
  owner: Owner,
  sources: TileId[],
): Map<TileId, number> {
  const distance = new Map<TileId, number>();
  const queue: TileId[] = [];

  for (const tileId of sources) {
    const tile = tileById(state, tileId);
    if (!tile || !isSupplyPassable(tile, owner)) continue;
    if (distance.has(tileId)) continue;
    distance.set(tileId, 0);
    queue.push(tileId);
  }

  for (let head = 0; head < queue.length; head++) {
    const current = queue[head];
    const step = distance.get(current)! + 1;
    for (const next of neighbors(current, state.map.size)) {
      if (distance.has(next)) continue;
      const tile = tileById(state, next);
      if (!tile || !isSupplyPassable(tile, owner)) continue;
      distance.set(next, step);
      queue.push(next);
    }
  }

  return distance;
}

/** Ô Thành Trì còn đứng của một nước — nguồn của kho lúa quốc gia. */
export function capitalTiles(state: GameState, owner: Owner): TileId[] {
  return state.tiles
    .filter((t) => t.terrain === "capital" && t.owner === owner)
    .map((t) => t.id);
}

/** Châu Thành đang thuộc về một nước, kèm ô của nó. */
export function ownedChau(
  state: GameState,
  owner: Owner,
): { id: CityId; tiles: TileId[] }[] {
  return Object.values(state.cities)
    .filter((city) => !city.isCapital && city.owner === owner)
    .map((city) => ({
      id: city.id,
      tiles: city.tiles.filter(
        (tileId) => tileById(state, tileId)?.owner === owner,
      ),
    }))
    .filter((city) => city.tiles.length > 0);
}

export interface SupplyNetwork {
  /** Khoảng cách tới kho quốc gia (qua Thành Trì). */
  national: Map<TileId, number>;
  /** Khoảng cách tới vựa của từng Châu Thành. */
  chau: Map<CityId, Map<TileId, number>>;
}

export function buildSupplyNetwork(
  state: GameState,
  owner: Owner,
): SupplyNetwork {
  return {
    national: supplyDistances(state, owner, capitalTiles(state, owner)),
    chau: new Map(
      ownedChau(state, owner).map((city) => [
        city.id,
        supplyDistances(state, owner, city.tiles),
      ]),
    ),
  };
}

/**
 * Khoảng cách từ một ô tới vựa, cho phép đúng một bước cuối đặt chân lên Rừng
 * hoặc Núi.
 *
 * §7 nói "Rừng/Núi/Sông không cho nối **xuyên**" — cấm *đi xuyên qua*, nên BFS
 * ở trên không bao giờ mở rộng qua các ô đó. Nhưng quân đang *đứng* trên Rừng
 * hoặc Núi mà kề đất đã nối thì vẫn nhận được lương.
 *
 * Đây là chỗ luật gốc chưa nói dứt khoát, và hai cách hiểu cho kết quả rất
 * khác nhau. Nếu quân đứng trên Rừng/Núi cũng bị coi là mất lương thì đầu Go
 * kế tiếp là chết đói sạch, không có cách nào cứu — lúc đó luật §4 "ở tối đa 1
 * Turn" lẫn công dụng "giữ quân trên núi nhiều lượt" của Mộc Ngưu Lưu Mã đều
 * thành vô nghĩa, và Rừng mất hẳn vai trò chỗ ẩn quân mà §4 mô tả. Bản này
 * chọn cách hiểu giữ cho cả ba luật đó còn tác dụng.
 */
export function reachDistance(
  state: GameState,
  distances: Map<TileId, number>,
  tileId: TileId,
): number | undefined {
  const direct = distances.get(tileId);
  if (direct !== undefined) return direct;

  const tile = tileById(state, tileId);
  if (!tile) return undefined;
  if (tile.terrain !== "forest" && tile.terrain !== "mountain") return undefined;

  let best: number | undefined;
  for (const next of neighbors(tileId, state.map.size)) {
    const distance = distances.get(next);
    if (distance === undefined) continue;
    if (best === undefined || distance + 1 < best) best = distance + 1;
  }
  return best;
}

/** Ô có nối được tới ít nhất một vựa (Trì hoặc Châu) hay không. */
export function isConnected(
  state: GameState,
  network: SupplyNetwork,
  tileId: TileId,
): boolean {
  if (reachDistance(state, network.national, tileId) !== undefined) return true;
  for (const distances of network.chau.values()) {
    if (reachDistance(state, distances, tileId) !== undefined) return true;
  }
  return false;
}

export function hasSupplyLine(
  state: GameState,
  owner: Owner,
  tileId: TileId,
): boolean {
  return isConnected(state, buildSupplyNetwork(state, owner), tileId);
}

/**
 * Cập nhật `supplied` cho từng tướng và `supplyOwner` cho từng ô. Mutate tại
 * chỗ — người gọi tự lo việc clone.
 */
export function updateSupply(state: GameState): void {
  const networks = new Map<Owner, SupplyNetwork>();
  const networkFor = (owner: Owner) => {
    let network = networks.get(owner);
    if (!network) {
      network = buildSupplyNetwork(state, owner);
      networks.set(owner, network);
    }
    return network;
  };

  for (const commander of Object.values(state.commanders)) {
    if (commander.status !== "FIELD") {
      commander.supplied = true;
      continue;
    }
    commander.supplied = isConnected(
      state,
      networkFor(commander.kingdom),
      commander.tileId,
    );
  }

  for (const tile of state.tiles) {
    tile.supplyOwner =
      tile.owner && isConnected(state, networkFor(tile.owner), tile.id)
        ? tile.owner
        : undefined;
  }
}
