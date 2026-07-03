import { Owner } from "./types";

/**
 * Direction B — Hoàng Kim Imperial palette, per docs/Tam Quoc Style Guide.dc.html
 * and docs/Typography Spec.dc.html. Single source of truth for faction colors
 * shared between DOM (Tailwind/CSS vars) and WebGL (three.js material colors,
 * which cannot read CSS custom properties).
 */
export const FACTION_LABEL: Record<Owner, string> = {
  wei: "Ngụy",
  shu: "Thục",
  wu: "Ngô",
};

export const FACTION_HAN: Record<Owner, string> = {
  wei: "魏",
  shu: "蜀",
  wu: "吳",
};

export const FACTION_COLOR: Record<Owner, string> = {
  wei: "#5B9BD5",
  shu: "#C0392B",
  wu: "#D4880A",
};

export const FACTION_TILE_TINT: Record<Owner, string> = {
  wei: "#90CAF9",
  shu: "#EF9A9A",
  wu: "#FFD54F",
};

export const NEUTRAL_TILE_COLOR = "#C8A870";
export const NEUTRAL_TILE_BORDER = "#D4A020";
