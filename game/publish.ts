/**
 * Dựng trang chiến báo cho wiki Docsify trong `docs/`.
 *
 * Thuần hàm — không đụng hệ thống file, để cả route API (console GM bấm "Xuất
 * bản") lẫn script CLI dùng chung một khuôn.
 *
 * Lưu ý Docsify: mọi link nội bộ tới trang trong `docs/` phải tính từ gốc site
 * chứ không phải từ thư mục của file hiện tại, nên link luôn có tiền tố
 * `tran-bao/`.
 */

export const REPORT_DIR = "tran-bao";

export interface ReportPage {
  slug: string;
  title: string;
  /** Nội dung chiến báo dạng markdown. */
  markdown: string;
  /** SVG bàn cờ, nhúng thẳng vào trang. */
  svg: string;
  legend: string;
}

export function buildReportPage(page: ReportPage): string {
  return [
    page.markdown.trimEnd(),
    "",
    "## Bàn cờ",
    "",
    `<div style="overflow-x:auto">${page.svg}</div>`,
    "",
    page.legend,
    "",
    `*[← Danh sách chiến báo](${REPORT_DIR}/README.md)*`,
    "",
  ].join("\n");
}

export interface IndexEntry {
  slug: string;
  title: string;
  summary: string;
}

export function buildReportIndex(entries: IndexEntry[]): string {
  const lines = [
    "# Chiến Báo",
    "",
    "Toàn bộ diễn biến từng lượt của ván đang chạy, mới nhất ở trên.",
    "",
  ];

  if (entries.length === 0) {
    lines.push("*Chưa có lượt nào được xuất bản.*", "");
    return lines.join("\n");
  }

  lines.push("| Lượt | Tóm tắt |", "|---|---|");
  for (const entry of entries) {
    lines.push(
      `| [${entry.title}](${REPORT_DIR}/${entry.slug}.md) | ${entry.summary} |`,
    );
  }
  lines.push("");
  return lines.join("\n");
}

const SIDEBAR_ENTRY = `- **Ván đang chạy**\n  - [Chiến Báo](${REPORT_DIR}/README.md)\n`;

/** Thêm mục "Ván đang chạy" vào sidebar nếu chưa có; giữ nguyên phần còn lại. */
export function ensureSidebarEntry(sidebar: string): string {
  if (sidebar.includes(`${REPORT_DIR}/README.md`)) return sidebar;
  const trimmed = sidebar.trimEnd();
  return `${trimmed}\n\n${SIDEBAR_ENTRY}`;
}

/** Đọc mục lục cũ để giữ lại các lượt đã xuất bản trước đó. */
export function parseReportIndex(markdown: string): IndexEntry[] {
  const entries: IndexEntry[] = [];
  const row = new RegExp(
    `\\|\\s*\\[([^\\]]+)\\]\\(${REPORT_DIR}/([^)]+)\\.md\\)\\s*\\|([^|]*)\\|`,
    "g",
  );
  let match: RegExpExecArray | null;
  while ((match = row.exec(markdown)) !== null) {
    entries.push({
      title: match[1].trim(),
      slug: match[2].trim(),
      summary: match[3].trim(),
    });
  }
  return entries;
}

/** Chèn lượt mới lên đầu, thay thế nếu xuất bản lại cùng một lượt. */
export function upsertEntry(
  entries: IndexEntry[],
  entry: IndexEntry,
): IndexEntry[] {
  return [entry, ...entries.filter((e) => e.slug !== entry.slug)];
}
