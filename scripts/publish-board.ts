/**
 * Xuất bản ảnh bàn cờ hiện tại vào `docs/tran-bao/ban-do-hien-tai.md`.
 *
 *   npm run publish-board
 *
 * Console GM đã tự xuất bản chiến báo từng lượt; script này chỉ dùng khi muốn
 * làm mới riêng trang bản đồ (ví dụ sau khi sửa tay file lưu), hoặc để dựng lại
 * trang mà không cần mở trình duyệt.
 */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { renderBoardLegend, renderBoardSvg } from "../game/board-svg";
import {
  buildReportPage,
  ensureSidebarEntry,
  REPORT_DIR,
} from "../game/publish";
import { standingCapitalTiles, totalCapitalTiles } from "../game/helpers";
import { SEASON_LABEL } from "../game/resolve";
import { KINGDOMS, SAVE_VERSION, type GameState } from "../game/types";

const ROOT = process.cwd();
const SAVE_PATH = join(ROOT, "data", "game-save.json");
const DOCS = join(ROOT, "docs");
const REPORTS = join(DOCS, REPORT_DIR);

function standings(state: GameState): string {
  const lines = [
    "| Nước | Điểm | Thành Trì còn | Châu Thành | Ô Trắng |",
    "|---|---|---|---|---|",
  ];
  for (const owner of KINGDOMS) {
    const kingdom = state.kingdoms[owner];
    const count = (terrain: string) =>
      state.tiles.filter((t) => t.owner === owner && t.terrain === terrain)
        .length;
    lines.push(
      `| ${kingdom.name}${kingdom.eliminated ? " *(sụp đổ)*" : ""} | ${kingdom.score} | ` +
        `${standingCapitalTiles(state, owner)}/${totalCapitalTiles(state, owner)} | ` +
        `${count("city")} | ${count("plains")} |`,
    );
  }
  return lines.join("\n");
}

async function main() {
  let raw: string;
  try {
    raw = await readFile(SAVE_PATH, "utf8");
  } catch {
    console.error(
      `Không đọc được ${SAVE_PATH}. Hãy mở /gm và bấm Lưu trước đã.`,
    );
    process.exit(1);
  }

  const state = JSON.parse(raw) as GameState;
  if (state.version !== SAVE_VERSION) {
    console.error(
      `File lưu là phiên bản ${state.version}, engine đang dùng ${SAVE_VERSION}.`,
    );
    process.exit(1);
  }

  const title =
    `Bàn cờ hiện tại — Năm ${state.game.year}, mùa ${SEASON_LABEL[state.game.season]}, ` +
    `Turn ${state.game.turn} (${state.game.phase === "GO" ? "Go" : "Atc"})`;

  const markdown = [`# ${title}`, "", standings(state)].join("\n");

  await mkdir(REPORTS, { recursive: true });
  const target = join(REPORTS, "ban-do-hien-tai.md");
  await writeFile(
    target,
    buildReportPage({
      slug: "ban-do-hien-tai",
      title,
      markdown,
      svg: renderBoardSvg(state),
      legend: renderBoardLegend(state),
    }),
    "utf8",
  );

  const sidebarPath = join(DOCS, "_sidebar.md");
  try {
    const sidebar = await readFile(sidebarPath, "utf8");
    const updated = ensureSidebarEntry(sidebar);
    if (updated !== sidebar) await writeFile(sidebarPath, updated, "utf8");
  } catch {
    /* wiki chưa có sidebar thì bỏ qua */
  }

  console.log(`Đã ghi docs/${REPORT_DIR}/ban-do-hien-tai.md — ${title}`);
}

void main();
