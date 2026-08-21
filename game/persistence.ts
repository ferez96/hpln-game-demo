/**
 * Đọc/ghi ván đấu qua `/api/game`, đích cuối là `data/game-save.json` trong
 * repo — file này được git theo dõi nên mỗi lượt là một commit, muốn lùi lượt
 * thì `git revert` là xong.
 */

import type { GameState } from "./types";

export class SaveError extends Error {}

async function readError(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { error?: string };
    return body.error ?? `Lỗi ${response.status}.`;
  } catch {
    return `Lỗi ${response.status}.`;
  }
}

/** Trả về `null` khi chưa có ván nào được lưu. */
export async function loadSavedGame(): Promise<GameState | null> {
  const response = await fetch("/api/game", { cache: "no-store" });
  if (response.status === 404) return null;
  if (!response.ok) throw new SaveError(await readError(response));
  return (await response.json()) as GameState;
}

export async function saveGame(state: GameState): Promise<void> {
  const response = await fetch("/api/game", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(state),
  });
  if (!response.ok) throw new SaveError(await readError(response));
}

export async function clearSave(): Promise<void> {
  const response = await fetch("/api/game", { method: "DELETE" });
  if (!response.ok) throw new SaveError(await readError(response));
}
