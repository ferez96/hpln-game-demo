/**
 * Xuất bản chiến báo một lượt vào `docs/tran-bao/` để đẩy lên GitHub Pages.
 *
 * Cùng lý do như `/api/game`: đây là công cụ chạy trên máy GM, ghi thẳng vào
 * repo, nên chỉ hoạt động ở chế độ dev.
 */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import {
  buildReportIndex,
  buildReportPage,
  ensureSidebarEntry,
  parseReportIndex,
  REPORT_DIR,
  upsertEntry,
} from "@/game/publish";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DOCS = join(process.cwd(), "docs");
const REPORTS = join(DOCS, REPORT_DIR);

interface PublishBody {
  slug: string;
  title: string;
  summary: string;
  markdown: string;
  svg: string;
  legend: string;
}

async function readIfExists(path: string): Promise<string | null> {
  try {
    return await readFile(path, "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}

export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return Response.json(
      { error: "Xuất bản chỉ chạy ở chế độ dev trên máy GM." },
      { status: 403 },
    );
  }

  const body = (await request.json()) as PublishBody;
  if (!body?.slug || !body?.markdown) {
    return Response.json({ error: "Thiếu slug hoặc nội dung." }, { status: 400 });
  }
  if (!/^[a-z0-9-]+$/.test(body.slug)) {
    return Response.json({ error: "Slug không hợp lệ." }, { status: 400 });
  }

  await mkdir(REPORTS, { recursive: true });

  const pagePath = join(REPORTS, `${body.slug}.md`);
  await writeFile(pagePath, buildReportPage(body), "utf8");

  const indexPath = join(REPORTS, "README.md");
  const existing = (await readIfExists(indexPath)) ?? "";
  const entries = upsertEntry(parseReportIndex(existing), {
    slug: body.slug,
    title: body.title,
    summary: body.summary,
  });
  await writeFile(indexPath, buildReportIndex(entries), "utf8");

  const sidebarPath = join(DOCS, "_sidebar.md");
  const sidebar = await readIfExists(sidebarPath);
  if (sidebar) {
    const updated = ensureSidebarEntry(sidebar);
    if (updated !== sidebar) await writeFile(sidebarPath, updated, "utf8");
  }

  return Response.json({
    ok: true,
    path: `docs/${REPORT_DIR}/${body.slug}.md`,
    published: entries.length,
  });
}
