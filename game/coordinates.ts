import { MAP_COLS, MAP_ROWS } from "./mapConfig";
import { Position, TileId } from "./types";

export function toTileId({ x, y }: Position): TileId {
  return `${String.fromCharCode(65 + x)}${y + 1}`;
}

export function fromTileId(id: TileId): Position {
  const col = id.charCodeAt(0) - 65;
  const row = Number(id.slice(1)) - 1;
  return { x: col, y: row };
}

export function isInsideMap({ x, y }: Position): boolean {
  return x >= 0 && x < MAP_COLS && y >= 0 && y < MAP_ROWS;
}

export function neighbors(id: TileId): TileId[] {
  const { x, y } = fromTileId(id);
  return [
    { x: x + 1, y },
    { x: x - 1, y },
    { x, y: y + 1 },
    { x, y: y - 1 },
  ]
    .filter(isInsideMap)
    .map(toTileId);
}

export function manhattanDistance(a: TileId, b: TileId): number {
  const pa = fromTileId(a);
  const pb = fromTileId(b);
  return Math.abs(pa.x - pb.x) + Math.abs(pa.y - pb.y);
}

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
