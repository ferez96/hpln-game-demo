import { ArmyState, GameState, Owner, TileData } from "./types";

/**
 * The perspective the board is currently rendered from. "spectator" is an
 * omniscient observer (sees everything, e.g. when handing the screen off
 * between players); a kingdom id renders the board as that kingdom would
 * see it — its own units always visible, other kingdoms' stealthed units
 * hidden per TERRAIN_RULES.forest.hidesUnits (docs/rulebook.ts).
 */
export type VisionMode = Owner | "spectator";

export function isArmyVisible(
  state: GameState,
  army: ArmyState,
  mode: VisionMode,
): boolean {
  if (mode === "spectator") return true;
  if (army.kingdom === mode) return true;
  const tile = state.tiles.find((t) => t.id === army.tileId);
  return tile?.terrain !== "forest";
}

export function isOwnTerritory(tile: TileData, mode: VisionMode): boolean {
  return mode !== "spectator" && tile.owner === mode;
}
