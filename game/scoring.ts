/** Điểm lãnh thổ (§1) — chỉ cộng vào Turn mùa Xuân và mùa Thu. */

import { addEvent } from "./helpers";
import { SCORING } from "./rulebook";
import { GameState, KINGDOMS, Owner, Season } from "./types";

export function isScoringSeason(season: Season): boolean {
  return (SCORING.scoredInSeasons as readonly string[]).includes(season);
}

/** Điểm một nước sẽ nhận nếu Turn này có tính điểm. */
export function calculateScore(state: GameState, owner: Owner): number {
  let score = 0;
  for (const tile of state.tiles) {
    if (tile.owner !== owner) continue;
    if (tile.terrain === "capital") score += SCORING.capitalPerTile;
    else if (tile.terrain === "city") score += SCORING.cityPerTile;
    else if (tile.terrain === "plains") score += SCORING.plainsTile;
  }
  return score;
}

/** Cộng điểm cuối Turn Xuân/Thu. */
export function applyTurnScoring(state: GameState): void {
  if (!isScoringSeason(state.game.season)) return;
  for (const owner of KINGDOMS) {
    const kingdom = state.kingdoms[owner];
    if (kingdom.eliminated) continue;
    const gained = calculateScore(state, owner);
    kingdom.score += gained;
    addEvent(
      state,
      "ECONOMY",
      `${kingdom.name} được ${gained} điểm lãnh thổ (tổng ${kingdom.score}).`,
    );
  }
}

/**
 * Xếp hạng cuối game (§1): điểm cao nhất thắng; hòa thì xét lần lượt số ô
 * Thành Trì → Châu Thành → Ô Trắng ở Turn cuối.
 */
export function rankKingdoms(state: GameState): Owner[] {
  const count = (owner: Owner, terrain: string) =>
    state.tiles.filter((t) => t.owner === owner && t.terrain === terrain).length;

  return [...KINGDOMS]
    .filter((owner) => !state.kingdoms[owner].eliminated)
    .sort((a, b) => {
      const byScore = state.kingdoms[b].score - state.kingdoms[a].score;
      if (byScore !== 0) return byScore;
      const byCapital = count(b, "capital") - count(a, "capital");
      if (byCapital !== 0) return byCapital;
      const byCity = count(b, "city") - count(a, "city");
      if (byCity !== 0) return byCity;
      return count(b, "plains") - count(a, "plains");
    });
}
