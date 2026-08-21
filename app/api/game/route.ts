/**
 * Lưu ván đấu ra `data/game-save.json`.
 *
 * Đây là công cụ chạy trên máy GM (`npm run dev`), không phải dịch vụ công
 * khai: route này ghi thẳng vào thư mục làm việc và không có xác thực, nên nó
 * từ chối chạy khi build production.
 */

import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { SAVE_VERSION, type GameState } from "@/game/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SAVE_PATH = join(process.cwd(), "data", "game-save.json");

function guard(): Response | null {
  if (process.env.NODE_ENV === "production") {
    return Response.json(
      { error: "Console GM chỉ chạy ở chế độ dev trên máy GM." },
      { status: 403 },
    );
  }
  return null;
}

export async function GET() {
  const blocked = guard();
  if (blocked) return blocked;

  try {
    const raw = await readFile(SAVE_PATH, "utf8");
    const state = JSON.parse(raw) as GameState;
    if (state.version !== SAVE_VERSION) {
      return Response.json(
        {
          error: `File lưu là phiên bản ${state.version}, engine đang dùng phiên bản ${SAVE_VERSION}.`,
        },
        { status: 409 },
      );
    }
    return Response.json(state);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return Response.json({ error: "Chưa có ván nào được lưu." }, { status: 404 });
    }
    throw error;
  }
}

export async function PUT(request: Request) {
  const blocked = guard();
  if (blocked) return blocked;

  const state = (await request.json()) as GameState;
  if (state?.version !== SAVE_VERSION) {
    return Response.json(
      { error: "Trạng thái gửi lên không đúng phiên bản." },
      { status: 400 },
    );
  }

  await mkdir(dirname(SAVE_PATH), { recursive: true });
  await writeFile(SAVE_PATH, JSON.stringify(state, null, 2), "utf8");
  return Response.json({ ok: true, path: "data/game-save.json" });
}

export async function DELETE() {
  const blocked = guard();
  if (blocked) return blocked;

  try {
    await unlink(SAVE_PATH);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
  return Response.json({ ok: true });
}
