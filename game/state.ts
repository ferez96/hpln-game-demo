import {
  GameState,
  CityState,
} from "./types";
import { tiles } from "./map";

// ── Cities ────────────────────────────────────────────────────────────────────

const cities: Record<string, CityState> = {
  "Lạc Dương":  { label: "Lạc Dương",  owner: "wei", isCapital: true},
  "Thành Đô":   { label: "Thành Đô",   owner: "shu", isCapital: true},
  "Kiến Nghiệp":{ label: "Kiến Nghiệp",owner: "wu",  isCapital: true},
  "Lương Châu": { label: "Lương Châu", owner: null,  isCapital: false},
  "Duyện Châu": { label: "Duyện Châu", owner: null,  isCapital: false},
  "Từ Châu":    { label: "Từ Châu",    owner: null,  isCapital: false},
  "Ung Châu":   { label: "Ung Châu",   owner: null,  isCapital: false},
  "Dự Châu":    { label: "Dự Châu",    owner: null,  isCapital: false},
  "Kinh Châu":  { label: "Kinh Châu",  owner: null,  isCapital: false},
};

// ── Initial state ─────────────────────────────────────────────────────────────

export const initialGameState: GameState = {
  turn: 1,
  phase: "move",
  tiles,
};

export function deserializeGameState(gameState: object): GameState {
  return initialGameState
}