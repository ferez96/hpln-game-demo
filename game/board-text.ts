/**
 * Định dạng văn bản để GM khai báo bàn cờ — dán vào console như dán lệnh.
 *
 *   ten: Tam Quốc 13×13
 *
 *   dia-hinh:
 *   ffppfpppppppp
 *   ppppmmppppppp
 *   ...
 *
 *   vung:
 *   tri nguy "Lạc Dương" A8 3x3
 *   chau "Lương Châu" B2 2x2
 *
 * Kích thước suy ra từ chính khối địa hình, khỏi phải khai hai lần rồi lệch
 * nhau. Ký tự địa hình: `.` hoặc `p` Ô Trắng, `f` Rừng, `m` Núi, `r` Sông.
 * Dòng trống và dòng bắt đầu bằng `#` bị bỏ qua.
 */

import {
  BoardDefinition,
  BoardError,
  boardRowLetters,
  CHAR_FOR_TERRAIN,
  RegionDefinition,
  TERRAIN_CHARS,
  validateBoard,
} from "./board";
import { fromTileId } from "./coordinates";
import { normalize } from "./orders/parse";
import { CityId, Owner, TileData, TileId } from "./types";

const KINGDOM_WORDS: Record<string, Owner> = {
  nguy: "wei",
  wei: "wei",
  thuc: "shu",
  shu: "shu",
  ngo: "wu",
  wu: "wu",
};

const SECTION_WORDS: Record<string, "terrain" | "regions"> = {
  "dia-hinh": "terrain",
  diahinh: "terrain",
  terrain: "terrain",
  vung: "regions",
  "vung-thanh": "regions",
  regions: "regions",
};

/** `3x3`, `3X3`, `3×3`. */
function parseSize(token: string): { width: number; height: number } | null {
  const match = /^(\d+)\s*[x×]\s*(\d+)$/i.exec(token);
  if (!match) return null;
  return { width: Number(match[1]), height: Number(match[2]) };
}

/** Tách `"Lạc Dương"` ra khỏi phần còn lại của dòng. */
function takeQuoted(text: string): { value: string; rest: string } | null {
  const match = /^"([^"]*)"\s*(.*)$/.exec(text.trim());
  if (!match) return null;
  return { value: match[1], rest: match[2] };
}

/** Sinh mã vùng từ nhãn: "Lương Châu" → LUONG-CHAU. */
function slugId(label: string, taken: Set<CityId>): CityId {
  const base =
    normalize(label).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").toUpperCase() ||
    "VUNG";
  let id = base;
  let n = 2;
  while (taken.has(id)) id = `${base}-${n++}`;
  taken.add(id);
  return id;
}

function parseRegionLine(
  line: string,
  lineNo: number,
  taken: Set<CityId>,
): RegionDefinition {
  const where = `dòng ${lineNo}`;
  const tokens = line.trim().split(/\s+/);
  const kind = normalize(tokens[0]);

  if (kind !== "tri" && kind !== "chau") {
    throw new BoardError(
      `${where}: vùng phải bắt đầu bằng "tri" hoặc "chau", không phải "${tokens[0]}".`,
    );
  }
  const isCapital = kind === "tri";

  let rest = line.trim().slice(tokens[0].length).trim();
  let owner: Owner | null = null;

  if (isCapital) {
    const ownerToken = rest.split(/\s+/)[0] ?? "";
    owner = KINGDOM_WORDS[normalize(ownerToken)] ?? null;
    if (!owner) {
      throw new BoardError(
        `${where}: Thành Trì cần tên nước (nguy / thuc / ngo), không phải "${ownerToken}".`,
      );
    }
    rest = rest.slice(ownerToken.length).trim();
  }

  const quoted = takeQuoted(rest);
  if (!quoted) {
    throw new BoardError(`${where}: thiếu tên vùng trong dấu ngoặc kép.`);
  }
  const label = quoted.value.trim();
  if (!label) throw new BoardError(`${where}: tên vùng để trống.`);

  const tail = quoted.rest.trim().split(/\s+/).filter(Boolean);
  const anchor = (tail[0] ?? "").toUpperCase();
  if (!/^[A-Z]\d+$/.test(anchor)) {
    throw new BoardError(
      `${where}: thiếu hoặc sai ô góc trên-trái (ví dụ A8), nhận được "${tail[0] ?? ""}".`,
    );
  }
  const size = parseSize(tail[1] ?? "");
  if (!size) {
    throw new BoardError(
      `${where}: thiếu hoặc sai kích thước (ví dụ 3x3), nhận được "${tail[1] ?? ""}".`,
    );
  }

  return {
    id: slugId(label, taken),
    label,
    isCapital,
    owner,
    anchor: anchor as TileId,
    width: size.width,
    height: size.height,
  };
}

export function parseBoard(text: string): BoardDefinition {
  let name = "Bàn cờ tự khai";
  const terrain: string[] = [];
  const regions: RegionDefinition[] = [];
  const takenIds = new Set<CityId>();
  let section: "terrain" | "regions" | null = null;

  const lines = text.split(/\r?\n/);
  lines.forEach((rawLine, index) => {
    const lineNo = index + 1;
    const line = rawLine.split("#")[0].trimEnd();
    if (!line.trim()) return;

    const header = /^([a-zA-ZÀ-ỹ-]+)\s*:\s*(.*)$/.exec(line.trim());
    if (header) {
      const key = normalize(header[1]);
      if (key === "ten" || key === "name") {
        name = header[2].trim() || name;
        return;
      }
      const next = SECTION_WORDS[key];
      if (next) {
        section = next;
        const inline = header[2].trim();
        if (inline && next === "terrain") terrain.push(inline);
        return;
      }
      throw new BoardError(`dòng ${lineNo}: không hiểu mục "${header[1]}".`);
    }

    if (section === "terrain") {
      terrain.push(line.trim());
      return;
    }
    if (section === "regions") {
      regions.push(parseRegionLine(line, lineNo, takenIds));
      return;
    }
    throw new BoardError(
      `dòng ${lineNo}: nội dung nằm ngoài mục "dia-hinh:" hay "vung:".`,
    );
  });

  if (terrain.length === 0) {
    throw new BoardError('Thiếu mục "dia-hinh:" — bàn cờ chưa có ô nào.');
  }

  const board: BoardDefinition = {
    name,
    rows: terrain.length,
    cols: terrain[0].length,
    terrain,
    regions,
  };

  validateBoard(board);
  return board;
}

/** Xuất bàn cờ ngược lại thành văn bản — GM sửa bàn mặc định thì bắt đầu từ đây. */
export function formatBoard(board: BoardDefinition): string {
  const lines = [`ten: ${board.name}`, "", "dia-hinh:"];
  lines.push(...board.terrain);
  lines.push("", "vung:");

  const letters = boardRowLetters(board);
  for (const region of board.regions) {
    const owner =
      region.owner === "wei"
        ? "nguy"
        : region.owner === "shu"
          ? "thuc"
          : region.owner === "wu"
            ? "ngo"
            : "";
    const head = region.isCapital ? `tri ${owner}` : "chau";
    lines.push(
      `${head} "${region.label}" ${region.anchor} ${region.width}x${region.height}`,
    );
  }

  // Chú thích cột để GM dễ đếm khi sửa tay.
  const ruler = Array.from({ length: board.cols }, (_, i) =>
    String((i + 1) % 10),
  ).join("");
  lines.push("", `# cột: ${ruler}`, `# hàng: ${letters}`);
  return lines.join("\n");
}

/** Dựng lại định nghĩa bàn cờ từ trạng thái ván đang chạy (để xem/sửa lại). */
export function boardFromTiles(
  tiles: TileData[],
  size: { rows: number; cols: number },
  name: string,
  regions: RegionDefinition[],
): BoardDefinition {
  const terrain: string[] = [];
  for (let y = 0; y < size.rows; y++) {
    let row = "";
    for (let x = 0; x < size.cols; x++) {
      const tile = tiles.find((t) => t.x === x && t.y === y);
      // Ô thành in ra theo địa hình nền, vì vùng thành khai riêng ở mục "vung:".
      const under =
        tile && tile.terrain !== "city" && tile.terrain !== "capital"
          ? CHAR_FOR_TERRAIN[tile.terrain]
          : ".";
      row += under ?? ".";
    }
    terrain.push(row);
  }
  return { name, rows: size.rows, cols: size.cols, terrain, regions };
}

/** Ô neo của một vùng, suy từ danh sách ô của nó. */
export function anchorOf(tiles: TileId[]): TileId {
  const points = tiles.map(fromTileId);
  const minX = Math.min(...points.map((p) => p.x));
  const minY = Math.min(...points.map((p) => p.y));
  return tiles.find((id) => {
    const p = fromTileId(id);
    return p.x === minX && p.y === minY;
  })!;
}

export { TERRAIN_CHARS };
