import { MapSize, Position, TileId } from "./types";

/** Bàn cờ dùng chữ cái làm hàng nên tối đa 26 hàng (A–Z). */
export const MAX_ROWS = 26;

export function rowLetter(y: number): string {
  return String.fromCharCode(65 + y);
}

export function rowLetters(rows: number): string {
  return Array.from({ length: rows }, (_, y) => rowLetter(y)).join("");
}

/**
 * Id ô theo đúng bản đồ in: chữ hàng A–Z rồi số cột bắt đầu từ 1, nên "B9" là
 * hàng B cột 9. Bên trong vẫn giữ (x = cột, y = hàng).
 */
export function toTileId({ x, y }: Position): TileId {
  return `${rowLetter(y)}${x + 1}`;
}

export function fromTileId(id: TileId): Position {
  const row = id.charCodeAt(0) - 65;
  const col = Number(id.slice(1)) - 1;
  return { x: col, y: row };
}

/** Kiểm tra id có đúng dạng chữ-hàng + số-cột và nằm trong bàn cờ hay không. */
export function isTileId(id: string, size: MapSize): boolean {
  if (!/^[A-Z]\d+$/.test(id)) return false;
  return isInsideMap(fromTileId(id), size);
}

export function isInsideMap({ x, y }: Position, size: MapSize): boolean {
  return x >= 0 && x < size.cols && y >= 0 && y < size.rows;
}

/** 4 ô kề theo cạnh vuông; ô chéo không tính là kề (§7). */
export function neighbors(id: TileId, size: MapSize): TileId[] {
  const { x, y } = fromTileId(id);
  return [
    { x: x + 1, y },
    { x: x - 1, y },
    { x, y: y + 1 },
    { x, y: y - 1 },
  ]
    .filter((position) => isInsideMap(position, size))
    .map(toTileId);
}

export function manhattanDistance(a: TileId, b: TileId): number {
  const pa = fromTileId(a);
  const pb = fromTileId(b);
  return Math.abs(pa.x - pb.x) + Math.abs(pa.y - pb.y);
}

/** Các ô trong một khối chữ nhật, tính từ ô góc trên-trái. */
export function tileIdsInRect(
  startX: number,
  startY: number,
  width: number,
  height: number,
): TileId[] {
  const ids: TileId[] = [];
  for (let y = startY; y < startY + height; y++) {
    for (let x = startX; x < startX + width; x++) {
      ids.push(toTileId({ x, y }));
    }
  }
  return ids;
}

/** Khối chữ nhật neo ở một ô, ví dụ ("A8", 3, 3) → 9 ô của Lạc Dương. */
export function tileIdsInBlock(
  anchor: TileId,
  width: number,
  height: number,
): TileId[] {
  const { x, y } = fromTileId(anchor);
  return tileIdsInRect(x, y, width, height);
}
