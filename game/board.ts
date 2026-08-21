/**
 * Bàn cờ là *dữ liệu*, không phải hằng số biên dịch sẵn.
 *
 * `DEFAULT_BOARD` là bàn cờ chính thức 13×13 chép từ `reference/3kd-map.jpg`,
 * nhưng GM dựng ván với bàn cờ nào cũng được: kích thước, địa hình, vị trí và
 * kích cỡ Thành Trì / Châu Thành đều khai báo được (xem `game/board-text.ts`
 * cho định dạng văn bản GM dán vào console).
 */

import {
  fromTileId,
  isInsideMap,
  MAX_ROWS,
  rowLetters,
  tileIdsInBlock,
  toTileId,
} from "./coordinates";
import {
  CityId,
  KINGDOMS,
  MapSize,
  Owner,
  Terrain,
  TileData,
  TileId,
} from "./types";

/** Một vùng thành: khối chữ nhật neo ở ô góc trên-trái. */
export interface RegionDefinition {
  id: CityId;
  label: string;
  isCapital: boolean;
  /** Thành Trì luôn thuộc một nước; Châu Thành khởi đầu vô chủ. */
  owner: Owner | null;
  anchor: TileId;
  width: number;
  height: number;
}

export interface BoardDefinition {
  name: string;
  rows: number;
  cols: number;
  /** Mỗi phần tử là một hàng; ký tự: `.`/`p` Ô Trắng, `f` Rừng, `m` Núi, `r` Sông. */
  terrain: string[];
  regions: RegionDefinition[];
}

export const TERRAIN_CHARS: Record<string, Terrain> = {
  ".": "plains",
  p: "plains",
  f: "forest",
  m: "mountain",
  r: "river",
};

export const CHAR_FOR_TERRAIN: Partial<Record<Terrain, string>> = {
  plains: ".",
  forest: "f",
  mountain: "m",
  river: "r",
};

export class BoardError extends Error {}

/* ---------- Bàn cờ mặc định ---------- */

/**
 * Bàn cờ chính thức: 13×13, hàng A–M × cột 1–13. Ba khối Thành Trì 3×3 và sáu
 * Châu Thành 2×2 đè lên lưới địa hình bên dưới.
 */
export const DEFAULT_BOARD: BoardDefinition = {
  name: "Tam Quốc 13×13",
  rows: 13,
  cols: 13,
  terrain: [
    "ffppfpppppppp", // A
    "ppppmmppppppp", // B
    "ppppppppppppf", // C
    "ppppmpppppppf", // D
    "fpppppppppppp", // E
    "ppppffppmmppp", // F
    "ppppppmffpppp", // G
    "ppppppmppppfp", // H
    "ppppppppppppp", // I
    "ppppffppppppp", // J
    "ppfppppmppppp", // K
    "ppfpppppppppp", // L
    "pppmmpppppppp", // M
  ],
  regions: [
    { id: "LUOYANG", label: "Lạc Dương", isCapital: true, owner: "wei", anchor: "A8", width: 3, height: 3 },
    { id: "CHENGDU", label: "Thành Đô", isCapital: true, owner: "shu", anchor: "H1", width: 3, height: 3 },
    { id: "JIANYE", label: "Kiến Nghiệp", isCapital: true, owner: "wu", anchor: "J11", width: 3, height: 3 },
    { id: "LIANGZHOU", label: "Lương Châu", isCapital: false, owner: null, anchor: "B2", width: 2, height: 2 },
    { id: "YANZHOU", label: "Duyện Châu", isCapital: false, owner: null, anchor: "E7", width: 2, height: 2 },
    { id: "XUZHOU", label: "Từ Châu", isCapital: false, owner: null, anchor: "E12", width: 2, height: 2 },
    { id: "YONGZHOU", label: "Ung Châu", isCapital: false, owner: null, anchor: "G5", width: 2, height: 2 },
    { id: "YUZHOU", label: "Dự Châu", isCapital: false, owner: null, anchor: "H8", width: 2, height: 2 },
    { id: "JINGZHOU", label: "Kinh Châu", isCapital: false, owner: null, anchor: "L6", width: 2, height: 2 },
  ],
};

/* ---------- Suy ra từ bàn cờ ---------- */

export function boardSize(board: BoardDefinition): MapSize {
  return { rows: board.rows, cols: board.cols };
}

export function boardRowLetters(board: BoardDefinition): string {
  return rowLetters(board.rows);
}

export interface CityRegion extends RegionDefinition {
  tiles: TileId[];
}

export function regionsOf(board: BoardDefinition): CityRegion[] {
  return board.regions.map((region) => ({
    ...region,
    tiles: tileIdsInBlock(region.anchor, region.width, region.height),
  }));
}

/** Ô giữa khối Thành Trì của một nước — nơi tướng/lính mới xuất phát. */
export function capitalCenter(
  board: BoardDefinition,
  owner: Owner,
): TileId | undefined {
  const blocks = regionsOf(board).filter(
    (region) => region.isCapital && region.owner === owner,
  );
  if (blocks.length === 0) return undefined;
  const tiles = blocks.flatMap((block) => block.tiles);
  return centerTile(tiles);
}

/** Ô gần tâm nhất trong một tập ô (dùng cho cả khối đã bị phá dở). */
export function centerTile(tiles: TileId[]): TileId | undefined {
  if (tiles.length === 0) return undefined;
  const points = tiles.map((id) => ({ id, ...fromTileId(id) }));
  const cx = points.reduce((s, p) => s + p.x, 0) / points.length;
  const cy = points.reduce((s, p) => s + p.y, 0) / points.length;
  return points.reduce((best, p) => {
    const d = (p.x - cx) ** 2 + (p.y - cy) ** 2;
    const bd = (best.x - cx) ** 2 + (best.y - cy) ** 2;
    return d < bd ? p : best;
  }).id;
}

/** Tâm ô trong không gian 3D của scene. */
export function tileCenter(tileId: TileId): [number, number, number] {
  const { x, y } = fromTileId(tileId);
  return [x + 0.5, 0, y + 0.5];
}

export function makeTiles(board: BoardDefinition): TileData[] {
  const regionByTile = new Map<TileId, CityRegion>();
  for (const region of regionsOf(board)) {
    for (const tileId of region.tiles) regionByTile.set(tileId, region);
  }

  const tiles: TileData[] = [];
  for (let y = 0; y < board.rows; y++) {
    for (let x = 0; x < board.cols; x++) {
      const id = toTileId({ x, y });
      const region = regionByTile.get(id);
      const terrain: Terrain = region
        ? region.isCapital
          ? "capital"
          : "city"
        : TERRAIN_CHARS[board.terrain[y][x]];

      tiles.push({
        id,
        x,
        y,
        terrain,
        owner: region?.owner ?? undefined,
        label: region?.label,
        cityId: region?.id,
        effects: [],
        supplyOwner: region?.owner ?? undefined,
      });
    }
  }
  return tiles;
}

/* ---------- Kiểm tra ---------- */

/**
 * Ném `BoardError` với thông báo tiếng Việt ngay ở lỗi đầu tiên — console GM
 * hiển thị thẳng thông báo này khi GM dán bàn cờ vào.
 */
export function validateBoard(board: BoardDefinition): void {
  if (!Number.isInteger(board.rows) || board.rows < 2) {
    throw new BoardError("Số hàng phải là số nguyên từ 2 trở lên.");
  }
  if (board.rows > MAX_ROWS) {
    throw new BoardError(
      `Tối đa ${MAX_ROWS} hàng (A–Z), bàn cờ này khai ${board.rows}.`,
    );
  }
  if (!Number.isInteger(board.cols) || board.cols < 2) {
    throw new BoardError("Số cột phải là số nguyên từ 2 trở lên.");
  }

  if (board.terrain.length !== board.rows) {
    throw new BoardError(
      `Địa hình có ${board.terrain.length} hàng nhưng bàn cờ khai ${board.rows} hàng.`,
    );
  }
  board.terrain.forEach((row, y) => {
    if (row.length !== board.cols) {
      throw new BoardError(
        `Hàng ${rowLetters(board.rows)[y]} dài ${row.length} ký tự, cần đúng ${board.cols}.`,
      );
    }
    for (const char of row) {
      if (!(char in TERRAIN_CHARS)) {
        throw new BoardError(
          `Ký tự địa hình lạ "${char}" ở hàng ${rowLetters(board.rows)[y]} (chỉ dùng . f m r).`,
        );
      }
    }
  });

  const size = boardSize(board);
  const seenId = new Set<CityId>();
  const claimed = new Map<TileId, string>();

  for (const region of regionsOf(board)) {
    if (seenId.has(region.id)) {
      throw new BoardError(`Trùng mã vùng thành: ${region.id}.`);
    }
    seenId.add(region.id);

    if (region.width < 1 || region.height < 1) {
      throw new BoardError(`${region.label}: kích thước phải từ 1x1 trở lên.`);
    }
    if (region.isCapital && !region.owner) {
      throw new BoardError(`${region.label}: Thành Trì phải thuộc về một nước.`);
    }
    if (!region.isCapital && region.owner) {
      throw new BoardError(
        `${region.label}: Châu Thành khởi đầu phải vô chủ.`,
      );
    }

    for (const tileId of region.tiles) {
      if (!isInsideMap(fromTileId(tileId), size)) {
        throw new BoardError(
          `${region.label} tràn ra ngoài bàn cờ (ô ${tileId} không tồn tại).`,
        );
      }
      const other = claimed.get(tileId);
      if (other) {
        throw new BoardError(
          `Ô ${tileId} bị cả ${other} lẫn ${region.label} chiếm chỗ.`,
        );
      }
      claimed.set(tileId, region.label);
    }
  }

  for (const kingdom of KINGDOMS) {
    const has = board.regions.some((r) => r.isCapital && r.owner === kingdom);
    if (!has) {
      throw new BoardError(
        `Chưa khai Thành Trì cho nước ${KINGDOM_LABEL[kingdom]} — nước không có Trì là sụp đổ ngay từ đầu.`,
      );
    }
  }
}

const KINGDOM_LABEL: Record<Owner, string> = {
  wei: "Ngụy",
  shu: "Thục",
  wu: "Ngô",
};
