/**
 * Cú pháp lệnh GM dán vào console.
 *
 * Mỗi dòng là lệnh của một người chơi, nhiều lệnh cách nhau bằng `;`:
 *
 *   player05: di C9; chieu 2000 bo
 *   Trương Liêu: danh C9
 *   player01: nang mo; doi dan 3
 *
 * Người chơi nhận diện bằng mã (`player05`) hoặc tên (có dấu hay không đều
 * được). Động từ chấp nhận cả bản có dấu lẫn không dấu. Dòng trống và dòng bắt
 * đầu bằng `#` bị bỏ qua.
 */

import { isTileId } from "../coordinates";
import {
  BuildingKind,
  GameCommand,
  GameState,
  MapSize,
  PlayerId,
  Stance,
  UnitType,
} from "../types";

export interface ParsedLine {
  /** Số dòng trong khối GM dán (1-based). */
  line: number;
  raw: string;
  command?: GameCommand;
  error?: string;
}

/** Bỏ dấu tiếng Việt + hạ chữ thường, để so khớp lệnh và tên người chơi. */
export function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();
}

const UNIT_WORDS: Record<string, UnitType> = {
  bo: "infantry",
  bobinh: "infantry",
  infantry: "infantry",
  cung: "archers",
  cungthu: "archers",
  archers: "archers",
  ky: "cavalry",
  kyma: "cavalry",
  cavalry: "cavalry",
};

const BUILDING_WORDS: Record<string, BuildingKind> = {
  mo: "mine",
  ruong: "farm",
  nhadan: "populationHouse",
  nha: "populationHouse",
  bo: "barracks",
  bobinh: "barracks",
  cung: "archery",
  cungthu: "archery",
  ky: "stable",
  kyma: "stable",
};

/** Ô hợp lệ tính theo bàn cờ của ván này, không theo kích thước cố định. */
function parseTile(token: string, size: MapSize): string | undefined {
  const id = normalize(token).toUpperCase();
  return isTileId(id, size) ? id : undefined;
}

/** Chấp nhận `2000`, `2.000` và `2,000`. */
function parseAmount(token: string): number | undefined {
  const digits = token.replace(/[.,\s]/g, "");
  if (!/^\d+$/.test(digits)) return undefined;
  return Number(digits);
}

/** Tra người chơi theo mã hoặc theo tên (không phân biệt dấu/hoa thường). */
export function findPlayer(
  state: GameState,
  token: string,
): PlayerId | undefined {
  const needle = normalize(token);
  for (const player of Object.values(state.players)) {
    if (normalize(player.id) === needle) return player.id;
  }
  const byName = Object.values(state.players).filter(
    (player) => normalize(player.name) === needle,
  );
  return byName.length === 1 ? byName[0].id : undefined;
}

function parseClause(
  clause: string,
  actor: PlayerId,
  state: GameState,
  raw: string,
): GameCommand | string {
  const tokens = clause.trim().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return "Lệnh trống.";

  const kingdom = state.players[actor].kingdom;
  const verb = normalize(tokens[0]);
  const base = { actor, kingdom, raw } as const;

  switch (verb) {
    case "di":
    case "dichuyen":
    case "move": {
      const tile = tokens[1] ? parseTile(tokens[1], state.map.size) : undefined;
      if (!tile) return `Thiếu hoặc sai ô đích: "${tokens[1] ?? ""}".`;
      return { ...base, type: "MOVE", to: tile };
    }

    case "danh":
    case "tancong":
    case "attack": {
      const tile = tokens[1] ? parseTile(tokens[1], state.map.size) : undefined;
      if (!tile) return `Thiếu hoặc sai ô tấn công: "${tokens[1] ?? ""}".`;
      return { ...base, type: "ATTACK", to: tile };
    }

    case "thu":
    case "phongthu":
    case "cong":
    case "tancongthe": {
      const stance: Stance = verb === "thu" || verb === "phongthu" ? "THU" : "CONG";
      return { ...base, type: "STANCE", stance };
    }

    case "chieu":
    case "chieubinh":
    case "tuyen": {
      const amount = tokens[1] ? parseAmount(tokens[1]) : undefined;
      const unitType = tokens[2] ? UNIT_WORDS[normalize(tokens[2])] : undefined;
      if (amount === undefined) return `Thiếu hoặc sai số quân: "${tokens[1] ?? ""}".`;
      if (!unitType) return `Không rõ loại quân: "${tokens[2] ?? ""}" (bo / cung / ky).`;
      return { ...base, type: "RECRUIT", amount, unitType };
    }

    case "gui":
    case "chuyen":
    case "transfer": {
      // gui 1000 bo -> player11
      const arrowIndex = tokens.findIndex((t) => t === "->" || t === "=>");
      if (arrowIndex === -1) return 'Thiếu "->" trỏ tới người nhận.';
      const amount = tokens[1] ? parseAmount(tokens[1]) : undefined;
      const unitType = tokens[2] ? UNIT_WORDS[normalize(tokens[2])] : undefined;
      const targetToken = tokens.slice(arrowIndex + 1).join(" ");
      if (amount === undefined) return `Thiếu hoặc sai số quân: "${tokens[1] ?? ""}".`;
      if (!unitType) return `Không rõ loại quân: "${tokens[2] ?? ""}" (bo / cung / ky).`;
      if (!targetToken) return "Thiếu người nhận quân.";
      const target = findPlayer(state, targetToken);
      if (!target) return `Không tìm ra người nhận: "${targetToken}".`;
      return { ...base, type: "TRANSFER", amount, unitType, target };
    }

    case "doi": {
      const what = tokens[1] ? normalize(tokens[1]) : "";
      const amount = tokens[2] ? parseAmount(tokens[2]) : undefined;
      if (amount === undefined) return `Thiếu hoặc sai số lượng: "${tokens[2] ?? ""}".`;
      if (what === "dan") return { ...base, type: "CONVERT_DAN", amount };
      if (what === "lua") return { ...base, type: "CONVERT_LUA", amount };
      return `Chỉ đổi được "dan" hoặc "lua", không phải "${tokens[1] ?? ""}".`;
    }

    case "nang":
    case "nangcap":
    case "upgrade": {
      const building = tokens[1] ? BUILDING_WORDS[normalize(tokens[1])] : undefined;
      if (!building) {
        return `Không rõ công trình: "${tokens[1] ?? ""}" (mo / ruong / nhadan / bo / cung / ky).`;
      }
      return { ...base, type: "UPGRADE", building };
    }

    default:
      return `Không hiểu lệnh "${tokens[0]}".`;
  }
}

export function parseOrders(state: GameState, text: string): ParsedLine[] {
  const out: ParsedLine[] = [];

  text.split(/\r?\n/).forEach((rawLine, index) => {
    const line = index + 1;
    // Cắt chú thích: mọi thứ sau "#" hoặc "//" trên cùng dòng.
    const stripped = rawLine.split(/#|\/\//)[0].trim();
    if (!stripped) return;

    const colon = stripped.indexOf(":");
    if (colon === -1) {
      out.push({
        line,
        raw: rawLine.trim(),
        error: 'Thiếu dấu ":" giữa người chơi và lệnh.',
      });
      return;
    }

    const who = stripped.slice(0, colon).trim();
    const actor = findPlayer(state, who);
    if (!actor) {
      out.push({
        line,
        raw: rawLine.trim(),
        error: `Không tìm ra người chơi "${who}".`,
      });
      return;
    }

    const clauses = stripped
      .slice(colon + 1)
      .split(";")
      .map((c) => c.trim())
      .filter(Boolean);

    if (clauses.length === 0) {
      out.push({ line, raw: rawLine.trim(), error: "Không có lệnh nào sau dấu \":\"." });
      return;
    }

    for (const clause of clauses) {
      const parsed = parseClause(clause, actor, state, `${who}: ${clause}`);
      if (typeof parsed === "string") {
        out.push({ line, raw: `${who}: ${clause}`, error: parsed });
      } else {
        out.push({ line, raw: `${who}: ${clause}`, command: parsed });
      }
    }
  });

  return out;
}
