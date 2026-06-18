import { TileData } from "./types";

export const MAP_COLS = 13;
export const MAP_ROWS = 13;

const overrides: Record<string, Partial<TileData>> = {};

function over(col: number, row: number, data: Partial<TileData>) {
  const key = `${col},${row}`;
  overrides[key] = { ...overrides[key], ...data };
}

function region(
  colRange: [number, number],
  rowRange: [number, number],
  data: Partial<TileData>
) {
  for (let c = colRange[0]; c <= colRange[1]; c++)
    for (let r = rowRange[0]; r <= rowRange[1]; r++)
      over(c, r, data);
}

// ── Plains ───────────────────────────────────────────────────────────────────
for (let c = 0; c <= 13; c++)
  for (let r = 0; r <= 13; r++)
    over(c, r, { terrain: "plains" });

// ── Owner territories ────────────────────────────────────────────────────────
region([6, 9], [0, 3], { owner: "wei" });   // Ngụy Quốc
region([0, 2], [7, 9], { owner: "shu" });   // Thục Quốc
region([9, 12], [10, 12], { owner: "wu" }); // Ngô Quốc

// ── Kingdom capitals (3×3) ───────────────────────────────────────────────────
// Lạc Dương (Wei): cols 7–9, rows 1–3
region([7, 9], [1, 3], { terrain: "capital" });
over(8, 2, { label: "Lạc Dương" });

// Thành Đô (Shu): cols 0–2, rows 7–9
region([0, 2], [7, 9], { terrain: "capital" });
over(1, 8, { label: "Thành Đô" });

// Kiến Nghiệp (Wu): cols 10–12, rows 10–12
region([10, 12], [10, 12], { terrain: "capital" });
over(11, 11, { label: "Kiến Nghiệp" });

// ── Cities (2×2) ─────────────────────────────────────────────────────────────
region([1, 2], [1, 2], { terrain: "city" });
over(1, 1, { label: "Lương Châu" });

region([6, 7], [4, 5], { terrain: "city" });
over(6, 4, { label: "Duyện Châu" });

region([10, 11], [5, 6], { terrain: "city" });
over(10, 5, { label: "Từ Châu" });

region([3, 4], [6, 7], { terrain: "city" });
over(3, 6, { label: "Ung Châu" });

region([7, 8], [7, 8], { terrain: "city" });
over(7, 7, { label: "Dự Châu" });

region([4, 5], [11, 12], { terrain: "city" });
over(4, 11, { label: "Kinh Châu" });

// ── Forests ──────────────────────────────────────────────────────────────────
const forests: [number, number][] = [
  [0, 0], [4, 0], [7, 0],
  [12, 2],
  [0, 4],
  [4, 5],
  [7, 6],
  [11, 7],
  [4, 9],
  [2, 10],
];
forests.forEach(([c, r]) => over(c, r, { terrain: "forest" }));

// ── Mountains ────────────────────────────────────────────────────────────────
const mountains: [number, number][] = [
  [4, 1],
  [4, 3],
  [8, 5],
  [5, 6], // moved off Ung Châu footprint
  [7, 10],
  [3, 12],
];
mountains.forEach(([c, r]) => over(c, r, { terrain: "mountain" }));

// ── Build tile array ─────────────────────────────────────────────────────────
export const tiles: TileData[] = [];
for (let col = 0; col < MAP_COLS; col++) {
  for (let row = 0; row < MAP_ROWS; row++) {
    const key = `${col},${row}`;
    tiles.push({
      x: col,
      y: row,
      terrain: "grass",
      ...overrides[key],
    });
  }
}
