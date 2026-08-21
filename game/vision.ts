import { CommanderState, GameState, Owner, TileData } from "./types";

/**
 * Góc nhìn đang dựng bản đồ. `spectator` là người quan sát toàn tri (GM);
 * chọn một quốc gia thì bản đồ hiện đúng những gì nước đó thấy — quân mình
 * luôn hiện, quân địch đứng trong Rừng thì ẩn (§4, TERRAIN_RULES.forest).
 */
export type VisionMode = Owner | "spectator";

export function isCommanderVisible(
  state: GameState,
  commander: CommanderState,
  mode: VisionMode,
): boolean {
  if (mode === "spectator") return true;
  if (commander.kingdom === mode) return true;
  const tile = state.tiles.find((t) => t.id === commander.tileId);
  return tile?.terrain !== "forest";
}

export function isOwnTerritory(tile: TileData, mode: VisionMode): boolean {
  return mode !== "spectator" && tile.owner === mode;
}
