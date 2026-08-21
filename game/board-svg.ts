/**
 * Dựng bàn cờ thành một SVG độc lập để nhúng thẳng vào trang chiến báo.
 *
 * Không phụ thuộc DOM hay thư viện ngoài — chạy được cả trong script Node lẫn
 * trên trình duyệt, và nhúng vào Docsify thì không cần tải thêm gì.
 */

import { rowLetters } from "./coordinates";
import { commandersAt } from "./helpers";
import { GameState, Owner, TileData } from "./types";

const CELL = 44;
const GUTTER = 26;

const TERRAIN_FILL: Record<string, string> = {
  plains: "#ffffff",
  forest: "#3c8438",
  mountain: "#c25424",
  river: "#7fb7dd",
  city: "#cccccc",
  capital: "#cccccc",
};

/** Cùng bảng màu với bản đồ in trong `reference/3kd-map.jpg`. */
const OWNER_FILL: Record<Owner, string> = {
  wei: "#f7b78a",
  shu: "#b4e49c",
  wu: "#9cccfc",
};

const OWNER_LABEL: Record<Owner, string> = {
  wei: "Ngụy",
  shu: "Thục",
  wu: "Ngô",
};

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function tileFill(tile: TileData): string {
  if (tile.terrain === "forest" || tile.terrain === "mountain") {
    return TERRAIN_FILL[tile.terrain];
  }
  if (tile.owner) return OWNER_FILL[tile.owner];
  return TERRAIN_FILL[tile.terrain] ?? "#ffffff";
}

export interface BoardSvgOptions {
  /** Vẽ chấm đánh dấu vị trí Tướng. */
  showCommanders?: boolean;
}

export function renderBoardSvg(
  state: GameState,
  options: BoardSvgOptions = {},
): string {
  const { showCommanders = true } = options;
  const rows = state.map.size.rows;
  const cols = state.map.size.cols;
  const letters = rowLetters(rows);
  const width = GUTTER + cols * CELL + 8;
  const height = GUTTER + rows * CELL + 8;

  const parts: string[] = [];
  parts.push(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" ` +
      `width="${width}" height="${height}" role="img" aria-label="Bàn cờ Tam Quốc Tranh Hùng">`,
  );
  parts.push(
    `<style>` +
      `.lbl{font:600 12px system-ui,sans-serif;fill:#5a5a5a}` +
      `.tid{font:9px ui-monospace,monospace;fill:#8a8a8a}` +
      `.cty{font:600 9px system-ui,sans-serif;fill:#333}` +
      `.cmd{font:700 9px system-ui,sans-serif;fill:#fff}` +
      `</style>`,
  );
  parts.push(`<rect width="${width}" height="${height}" fill="#fdfdfb"/>`);

  // Nhãn trục: cột là số, hàng là chữ — khớp bản đồ in.
  for (let x = 0; x < cols; x++) {
    parts.push(
      `<text class="lbl" x="${GUTTER + x * CELL + CELL / 2}" y="${GUTTER - 8}" ` +
        `text-anchor="middle">${x + 1}</text>`,
    );
  }
  for (let y = 0; y < rows; y++) {
    parts.push(
      `<text class="lbl" x="${GUTTER - 10}" y="${GUTTER + y * CELL + CELL / 2 + 4}" ` +
        `text-anchor="middle">${letters[y]}</text>`,
    );
  }

  for (const tile of state.tiles) {
    const px = GUTTER + tile.x * CELL;
    const py = GUTTER + tile.y * CELL;
    parts.push(
      `<rect x="${px}" y="${py}" width="${CELL}" height="${CELL}" ` +
        `fill="${tileFill(tile)}" stroke="#333" stroke-width="1"/>`,
    );
    parts.push(
      `<text class="tid" x="${px + 3}" y="${py + 11}">${tile.id}</text>`,
    );
  }

  // Nhãn thành vẽ sau, căn giữa cả vùng thay vì nhét vào một ô — tên như
  // "Kiến Nghiệp" dài hơn bề ngang một ô nên đặt trong ô là bị cắt mất.
  for (const city of Object.values(state.cities)) {
    const standing = city.tiles
      .map((id) => state.tiles.find((t) => t.id === id))
      .filter((t): t is TileData => Boolean(t))
      .filter((t) => t.terrain === (city.isCapital ? "capital" : "city"));
    if (standing.length === 0) continue;

    const xs = standing.map((t) => t.x);
    const ys = standing.map((t) => t.y);
    // Căn ngang giữa vùng, nhưng đặt sát mép dưới để không đè lên chấm Tướng
    // vẽ ở giữa ô.
    const cx =
      GUTTER + ((Math.min(...xs) + Math.max(...xs) + 1) / 2) * CELL;
    const cy = GUTTER + (Math.max(...ys) + 1) * CELL - 6;

    parts.push(
      `<text class="cty" x="${cx}" y="${cy}" text-anchor="middle" ` +
        `stroke="#ffffff" stroke-width="3" paint-order="stroke">` +
        `${escapeXml(city.label)}</text>`,
    );
  }

  if (showCommanders) {
    const seen = new Set<string>();
    for (const tile of state.tiles) {
      if (seen.has(tile.id)) continue;
      seen.add(tile.id);
      const here = commandersAt(state, tile.id);
      if (here.length === 0) continue;

      const px = GUTTER + tile.x * CELL;
      const py = GUTTER + tile.y * CELL;
      const byKingdom = new Map<Owner, number>();
      for (const commander of here) {
        byKingdom.set(
          commander.kingdom,
          (byKingdom.get(commander.kingdom) ?? 0) + 1,
        );
      }
      let index = 0;
      for (const [kingdom, count] of byKingdom) {
        const cx = px + 12 + index * 15;
        const cy = py + CELL / 2 + 4;
        parts.push(
          `<circle cx="${cx}" cy="${cy - 3}" r="8" fill="${OWNER_FILL[kingdom]}" ` +
            `stroke="#222" stroke-width="1.5"/>`,
        );
        parts.push(
          `<text class="cmd" x="${cx}" y="${cy}" text-anchor="middle" fill="#222">${count}</text>`,
        );
        index += 1;
      }
    }
  }

  parts.push("</svg>");
  return parts.join("");
}

/** Chú giải màu, đặt ngay dưới bàn cờ trong trang chiến báo. */
export function renderBoardLegend(state: GameState): string {
  const swatches = (["wei", "shu", "wu"] as Owner[]).map((owner) => {
    const kingdom = state.kingdoms[owner];
    const suffix = kingdom.eliminated ? " (sụp đổ)" : "";
    return (
      `<span style="display:inline-flex;align-items:center;gap:6px;margin-right:14px">` +
      `<span style="width:14px;height:14px;background:${OWNER_FILL[owner]};` +
      `border:1px solid #333;display:inline-block"></span>${OWNER_LABEL[owner]}${suffix}</span>`
    );
  });

  const terrain = [
    ["Rừng", TERRAIN_FILL.forest],
    ["Núi", TERRAIN_FILL.mountain],
    ["Thành vô chủ", TERRAIN_FILL.city],
  ].map(
    ([label, fill]) =>
      `<span style="display:inline-flex;align-items:center;gap:6px;margin-right:14px">` +
      `<span style="width:14px;height:14px;background:${fill};` +
      `border:1px solid #333;display:inline-block"></span>${label}</span>`,
  );

  return (
    `<p style="font-size:13px;line-height:2">${swatches.join("")}${terrain.join("")}` +
    `<br/><span style="color:#666">Số trong vòng tròn là số Tướng đang đứng ở ô đó.</span></p>`
  );
}
