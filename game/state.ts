import { GameState, CityState } from "./types";
import { Owner } from "./types";
import { TileData } from "./types";

export const MAP_COLS = 14;
export const MAP_ROWS = 14;

const tiles: TileData[] = [];

// Generate tiles for the entire map
function randomTerrain(): TileData["terrain"] {
  const r = Math.random();
  if (r < 0.05) return "forest";
  if (r < 0.1) return "mountain";
  return "plains";
}
for (let col = 0; col < MAP_COLS; col++) {
  for (let row = 0; row < MAP_ROWS; row++) {
    const terrain = randomTerrain();
    const tile: TileData = { x: col, y: row, terrain };
    tiles.push(tile);
  }
}

// ── Cities ────────────────────────────────────────────────────────────────────

const cities: Record<string, CityState> = {
  "Lạc Dương": {
    label: "Lạc Dương",
    owner: "wei",
    isCapital: true,
    tiles: [
      // A8:C10
      [0, 7],
      [1, 7],
      [2, 7],
      [0, 8],
      [1, 8],
      [2, 8],
      [0, 9],
      [1, 9],
      [2, 9],
    ],
  },
  "Thành Đô": {
    label: "Thành Đô",
    owner: "shu",
    isCapital: true,
    tiles: [
      // H1:J3
      [7, 0],
      [8, 0],
      [9, 0],
      [7, 1],
      [8, 1],
      [9, 1],
      [7, 2],
      [8, 2],
      [9, 2],
    ],
  },
  "Kiến Nghiệp": {
    label: "Kiến Nghiệp",
    owner: "wu",
    isCapital: true,
    tiles: [
      // J11:L13
      [9, 10],
      [10, 10],
      [11, 10],
      [9, 11],
      [10, 11],
      [11, 11],
      [9, 12],
      [10, 12],
      [11, 12],
    ],
  },
  "Lương Châu": {
    label: "Lương Châu",
    owner: null,
    isCapital: false,
    tiles: [
      // B2:C3 (col 1-2, row 1-2)
      [1, 1],
      [2, 1],
      [1, 2],
      [2, 2],
    ],
  },
  "Duyện Châu": {
    label: "Duyện Châu",
    owner: null,
    isCapital: false,
    tiles: [
      // E7:F8 (col 4-5, row 6-7)
      [4, 6],
      [5, 6],
      [4, 7],
      [5, 7],
    ],
  },
  "Từ Châu": {
    label: "Từ Châu",
    owner: null,
    isCapital: false,
    tiles: [
      // E12:F13 (col 4-5, row 11-12)
      [4, 11],
      [5, 11],
      [4, 12],
      [5, 12],
    ],
  },
  "Ung Châu": {
    label: "Ung Châu",
    owner: null,
    isCapital: false,
    tiles: [
      // G5:H6 (col 6-7, row 4-5)
      [6, 4],
      [7, 4],
      [6, 5],
      [7, 5],
    ],
  },
  "Dự Châu": {
    label: "Dự Châu",
    owner: null,
    isCapital: false,
    tiles: [
      // H8:I9 (col 7-8, row 7-8)
      [7, 7],
      [8, 7],
      [7, 8],
      [8, 8],
    ],
  },
  "Kinh Châu": {
    label: "Kinh Châu",
    owner: null,
    isCapital: false,
    tiles: [
      // L6:M7 (col 11-12, row 5-6)
      [11, 5],
      [12, 5],
      [11, 6],
      [12, 6],
    ],
  },
};

// Build a map from position to tile for efficient lookup (avoid N+1)
const tileMap = new Map<string, TileData>();
for (const tile of tiles) {
  tileMap.set(`${tile.x},${tile.y}`, tile);
}

for (const city of Object.values(cities)) {
  for (const [x, y] of city.tiles) {
    const key = `${x},${y}`;
    const tile = tileMap.get(key);
    if (tile) {
      tile.label = city.label;
      tile.terrain = city.isCapital ? "capital" : "city";
      tile.owner = city.owner ?? undefined;
    }
  }
}

// ── Initial state ─────────────────────────────────────────────────────────────

export const initialGameState: GameState = {
  turn: 1,
  phase: "move",
  tiles,
  cities,
};
