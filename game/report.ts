/**
 * Chiến báo — bản markdown GM đăng lại cho người chơi sau mỗi lượt.
 *
 * Nội dung bám theo §1 (cơ chế phụ): địa điểm, thắng bại, số tướng, số quân,
 * loại lính, chỉ số hai bên, và các sự kiện khác mà luật cho phép báo.
 */

import { standingCapitalTiles, totalCapitalTiles } from "./helpers";
import { SEASON_LABEL, TurnReport } from "./resolve";
import {
  BattleReport,
  GameState,
  KINGDOMS,
  Owner,
  Units,
} from "./types";

const RESULT_LABEL: Record<BattleReport["result"], string> = {
  ATTACKER_WIN: "bên công thắng",
  DEFENDER_WIN: "bên thủ giữ được ô",
  STALEMATE: "đình chiến",
};

function vi(n: number): string {
  return n.toLocaleString("vi-VN");
}

function unitsLine(units: Units): string {
  const parts: string[] = [];
  if (units.infantry) parts.push(`${vi(units.infantry)} Bộ`);
  if (units.archers) parts.push(`${vi(units.archers)} Cung`);
  if (units.cavalry) parts.push(`${vi(units.cavalry)} Kỵ`);
  return parts.length ? parts.join(", ") : "không đáng kể";
}

function commanderName(state: GameState, id: string): string {
  return state.commanders[id]?.name ?? id;
}

export interface ReportContext {
  /** Trạng thái *sau* khi lượt đã được giải quyết. */
  state: GameState;
  report: TurnReport;
}

export function reportTitle(report: TurnReport): string {
  return `Chiến báo — Năm ${report.year}, mùa ${SEASON_LABEL[report.season]}, Turn ${report.turn} (${report.phase === "GO" ? "Go" : "Atc"})`;
}

/** Tên file/slug cho một lượt: `turn-03-go`. */
export function reportSlug(report: TurnReport): string {
  return `turn-${String(report.turn).padStart(2, "0")}-${report.phase.toLowerCase()}`;
}

export function renderChienBao({ state, report }: ReportContext): string {
  const lines: string[] = [];

  lines.push(`# ${reportTitle(report)}`);
  lines.push("");

  /* ── Hành quân ── */
  const moved = report.movements.filter((m) => m.from !== m.to || m.bounced);
  if (moved.length > 0) {
    lines.push("## Hành quân");
    lines.push("");
    lines.push("| Tướng | Nước | Từ | Đến | Ghi chú |");
    lines.push("|---|---|---|---|---|");
    for (const move of moved) {
      const note = move.bounced
        ? "bị đẩy lui"
        : move.captured
          ? "chiếm được ô"
          : "";
      lines.push(
        `| ${move.name} | ${state.kingdoms[move.kingdom].name} | ${move.from} | ${move.to} | ${note} |`,
      );
    }
    lines.push("");
  }

  /* ── Giao chiến ── */
  if (report.battles.length > 0) {
    lines.push("## Giao chiến");
    lines.push("");
    for (const battle of report.battles) {
      const tile = state.tiles.find((t) => t.id === battle.tileId);
      const where = tile?.label ? `${battle.tileId} (${tile.label})` : battle.tileId;
      lines.push(`### ${where} — ${RESULT_LABEL[battle.result]}`);
      lines.push("");
      const attackerNames = battle.attackers.map((id) => commanderName(state, id));
      const defenderNames = battle.defenders.map((id) => commanderName(state, id));
      lines.push(
        `- **Bên công** (${attackerNames.length} Tướng): ${attackerNames.join(", ") || "—"} — chỉ số ${vi(battle.attackerPower)}`,
      );
      lines.push(
        `- **Bên thủ** (${defenderNames.length} Tướng): ${defenderNames.join(", ") || "quân trấn thành"} — chỉ số ${vi(battle.defenderPower)}` +
          ` (thế ${battle.defenderStance === "THU" ? "Thủ" : "Công"})`,
      );
      lines.push(`- Bên công thiệt hại: ${unitsLine(battle.attackerLosses)}`);
      lines.push(`- Bên thủ thiệt hại: ${unitsLine(battle.defenderLosses)}`);
      for (const note of battle.notes) lines.push(`- ${note}`);
      lines.push("");
    }
  }

  /* ── Lương thực ── */
  const starving = report.starvation.filter((s) => s.starved > 0);
  if (starving.length > 0) {
    lines.push("## Lương thực");
    lines.push("");
    for (const record of starving) {
      const name = commanderName(state, record.commanderId);
      const bits = [
        `thiếu ${vi(record.starved)} Lúa tại ${record.tileId}`,
      ];
      if (record.wipedOut) bits.push("mất sạch quân, lui về Thành Trì");
      if (record.tileLost) bits.push("ô mất chủ vì chỉ nối vựa Châu đã cạn");
      lines.push(`- **${name}** — ${bits.join("; ")}.`);
    }
    lines.push("");
  }

  /* ── Điểm ── */
  lines.push("## Điểm lãnh thổ");
  lines.push("");
  lines.push("| Nước | Điểm tích lũy | Điểm ô đang giữ | Thành Trì còn | Châu Thành |");
  lines.push("|---|---|---|---|---|");
  for (const owner of KINGDOMS) {
    const kingdom = state.kingdoms[owner];
    const capitals = standingCapitalTiles(state, owner);
    const total = totalCapitalTiles(state, owner);
    const cities = state.tiles.filter(
      (t) => t.owner === owner && t.terrain === "city",
    ).length;
    const status = kingdom.eliminated ? " *(sụp đổ)*" : "";
    lines.push(
      `| ${kingdom.name}${status} | ${report.scores[owner].total} | ${report.scores[owner].live} | ${capitals}/${total} | ${cities} |`,
    );
  }
  lines.push("");

  /* ── Lệnh bị bác ── */
  const rejected = report.orders.filter((o) => !o.ok);
  if (rejected.length > 0) {
    lines.push("## Lệnh không hợp lệ");
    lines.push("");
    for (const order of rejected) {
      lines.push(`- \`${order.raw}\` — ${order.error}`);
    }
    lines.push("");
  }

  /* ── Kết thúc ── */
  if (report.victory.winner) {
    const name = state.kingdoms[report.victory.winner].name;
    const how =
      report.victory.reason === "CONQUEST"
        ? "thống nhất thiên hạ"
        : "thắng theo điểm";
    lines.push(`## Kết cục`);
    lines.push("");
    lines.push(`**${name} ${how}.**`);
    lines.push("");
  }

  return lines.join("\n");
}

/** Bản tóm tắt một dòng cho mục lục chiến báo. */
export function reportSummary(report: TurnReport): string {
  const bits: string[] = [];
  if (report.battles.length) bits.push(`${report.battles.length} trận`);
  const moves = report.movements.filter((m) => m.from !== m.to).length;
  if (moves) bits.push(`${moves} lượt hành quân`);
  const starved = report.starvation.filter((s) => s.starved > 0).length;
  if (starved) bits.push(`${starved} đạo quân thiếu lương`);
  return bits.length ? bits.join(", ") : "không có sự kiện đáng kể";
}

/** Bảng tài nguyên riêng cho từng nước — GM gửi PM, không đăng công khai. */
export function renderKingdomBriefing(state: GameState, owner: Owner): string {
  const kingdom = state.kingdoms[owner];
  const r = kingdom.resources;
  const lines: string[] = [
    `## ${kingdom.name} — Turn ${state.game.turn} ${state.game.phase === "GO" ? "Go" : "Atc"}`,
    "",
    `- Tài Nguyên: **${vi(r.taiNguyen)}** · Lúa: **${vi(r.lua)}** · Dân: **${vi(r.dan)}**`,
    `- Dân Tâm: ${vi(r.danTam)} · Uy Danh: ${vi(r.uyDanh)} · Đế Khí: ${vi(r.deKhi)}`,
    `- Công trình: Mỏ ${kingdom.buildings.mine} · Ruộng ${kingdom.buildings.farm} · Nhà Dân ${kingdom.buildings.populationHouse} · Bộ ${kingdom.buildings.barracks} · Cung ${kingdom.buildings.archery} · Kỵ ${kingdom.buildings.stable}`,
    "",
    "| Tướng | Ô | Bộ | Cung | Kỵ | Thế | Nối lương |",
    "|---|---|---|---|---|---|---|",
  ];

  for (const commander of Object.values(state.commanders)) {
    if (commander.kingdom !== owner) continue;
    if (commander.status === "RECOVERING") {
      lines.push(
        `| ${commander.name} | *dưỡng thương tới Turn ${commander.readyOnTurn}* | | | | | |`,
      );
      continue;
    }
    if (commander.status === "DEFEATED") continue;
    lines.push(
      `| ${commander.name} | ${commander.tileId} | ${vi(commander.units.infantry)} | ${vi(commander.units.archers)} | ${vi(commander.units.cavalry)} | ${commander.stance === "CONG" ? "Công" : "Thủ"} | ${commander.supplied ? "có" : "**mất**"} |`,
    );
  }

  return lines.join("\n");
}
