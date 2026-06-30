import type { GameState } from "./types";

const SAVE_KEY = "tamquoc-save-v2";

export function saveGame(state: GameState): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}

export function loadSavedGame(): GameState | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as GameState;
    if (parsed.version !== 2) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearSave(): void {
  if (typeof localStorage === "undefined") return;
  localStorage.removeItem(SAVE_KEY);
}

export function hasSave(): boolean {
  if (typeof localStorage === "undefined") return false;
  return localStorage.getItem(SAVE_KEY) !== null;
}
