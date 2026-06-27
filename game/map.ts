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

function toRegion(code: string): { colRange: [number, number], rowRange: [number, number] } {
  // Expects code in the format "A1:C3"
  const [start, end] = code.split(":");
  const rowStart = start.charCodeAt(0) - 65; // 'A'→0, 'B'→1, etc.
  const colStart = parseInt(start.slice(1), 10) - 1; // '1'→0, '2'→1, etc.
  const rowEnd = end.charCodeAt(0) - 65;
  const colEnd = parseInt(end.slice(1), 10) - 1;
  return {
    colRange: [colStart, colEnd],
    rowRange: [rowStart, rowEnd],
  };
}

{
  // Shu capital: center at I2 (col 8, row 1)
  let { colRange, rowRange } = toRegion("H1:J3");
  for (let c = colRange[0]; c <= colRange[1]; c++) {
    for (let r = rowRange[0]; r <= rowRange[1]; r++) {
      over(c, r, { 
        terrain: "capital", 
        owner: "shu",
        relativePos: [c - 1, r - 8] // [col - centerCol, row - centerRow]
      });
    }
  }
}
{
  // Wei capital: center at B9 (col 1, row 8)
  let { colRange, rowRange } = toRegion("A8:C10");
  for (let c = colRange[0]; c <= colRange[1]; c++) {
    for (let r = rowRange[0]; r <= rowRange[1]; r++) {
      over(c, r, { 
        terrain: "capital", 
        owner: "wei",
        relativePos: [c - 8, r - 1]
      });
    }
  }
}
{
  // Wu capital: center at K12 (col 10, row 11)
  let { colRange, rowRange } = toRegion("J11:L13");
  for (let c = colRange[0]; c <= colRange[1]; c++) {
    for (let r = rowRange[0]; r <= rowRange[1]; r++) {
      over(c, r, { 
        terrain: "capital", 
        owner: "wu",
        relativePos: [c - 11, r - 10]
      });
    }
  }
}

// ── Build tile array ─────────────────────────────────────────────────────────
export const tiles: TileData[] = [];
for (let col = 0; col < MAP_COLS; col++) {
  for (let row = 0; row < MAP_ROWS; row++) {
    const key = `${col},${row}`;
    tiles.push({
      x: col,
      y: row,
      terrain: "plains",
      ...overrides[key],
    });
  }
}
