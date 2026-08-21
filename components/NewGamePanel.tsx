"use client";

/**
 * Màn dựng ván mới: GM khai bàn cờ và danh sách người chơi bằng văn bản, xem
 * trước ngay bên cạnh.
 *
 * Bản xem trước chính là bản kiểm tra — nó dựng thật một `GameState` bằng đúng
 * `createGame` mà nút "Bắt đầu ván" sẽ gọi, rồi vẽ ra. Hễ xem trước hiện được
 * thì ván chắc chắn dựng được.
 */

import { useMemo, useState } from "react";
import { renderBoardSvg } from "@/game/board-svg";
import { DEFAULT_BOARD } from "@/game/board";
import { formatBoard, parseBoard } from "@/game/board-text";
import { formatRoster, parseRoster } from "@/game/roster-text";
import { createGame, DEFAULT_SETUP } from "@/game/setup";
import { GameState, KINGDOMS } from "@/game/types";
import { FACTION_LABEL } from "@/game/theme";

const PANEL =
  "rounded-md border border-line bg-panel/95 shadow-lg shadow-black/40 backdrop-blur";
const BTN =
  "rounded border border-line px-2.5 py-1 text-xs text-secondary transition-colors hover:border-gold/60 hover:text-gold";
const BTN_PRIMARY =
  "rounded border border-gold/70 bg-chu-sa px-4 py-1.5 text-xs font-bold tracking-wide text-gold transition-[filter] hover:brightness-125 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:brightness-100";
const FIELD =
  "w-full rounded border border-line bg-ink px-2 py-1.5 font-mono text-[12px] leading-relaxed text-primary outline-none focus:border-gold/60";

interface Props {
  onStart: (state: GameState) => void;
  onCancel?: () => void;
}

export function NewGamePanel({ onStart, onCancel }: Props) {
  const [boardText, setBoardText] = useState(() => formatBoard(DEFAULT_BOARD));
  const [rosterText, setRosterText] = useState(() =>
    formatRoster(DEFAULT_SETUP.players),
  );

  const preview = useMemo(() => {
    try {
      const board = parseBoard(boardText);
      const players = parseRoster(rosterText);
      const state = createGame({ board, players });
      return { state, board, players, error: null as string | null };
    } catch (error) {
      return {
        state: null,
        board: null,
        players: null,
        error: (error as Error).message,
      };
    }
  }, [boardText, rosterText]);

  const counts = preview.players
    ? KINGDOMS.map((k) => ({
        kingdom: k,
        total: preview.players!.filter((p) => p.kingdom === k).length,
        generals: preview.players!.filter(
          (p) => p.kingdom === k && (p.role === "GENERAL" || p.role === "LORD"),
        ).length,
      }))
    : [];

  return (
    <div className="flex h-full w-full gap-3 overflow-y-auto p-4">
      {/* ── Khai báo ── */}
      <div className="flex w-[520px] shrink-0 flex-col gap-2">
        <section className={`${PANEL} p-3`}>
          <div className="font-display text-lg text-gold">Dựng ván mới</div>
          <p className="mt-1 text-[11px] leading-relaxed text-secondary">
            Sửa trực tiếp hai ô bên dưới. Bàn cờ và số người chơi đều tùy GM —
            kích thước bàn suy ra từ chính khối địa hình.
          </p>
        </section>

        <section className={`${PANEL} p-2.5`}>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-secondary">
              Người chơi
            </span>
            <button
              className={BTN}
              onClick={() => setRosterText(formatRoster(DEFAULT_SETUP.players))}
            >
              Danh sách mặc định
            </button>
          </div>
          <textarea
            value={rosterText}
            onChange={(e) => setRosterText(e.target.value)}
            spellCheck={false}
            rows={12}
            className={FIELD}
          />
          <div className="mt-1 text-[10px] leading-relaxed text-disabled">
            Mỗi dòng: <code>nước chức-vụ tên</code>. Nước:{" "}
            <code>nguy</code> / <code>thuc</code> / <code>ngo</code>. Chức vụ:{" "}
            <code>chu-cong</code> / <code>quan-su</code> / <code>van</code> /{" "}
            <code>tuong</code>.
          </div>
        </section>

        <section className={`${PANEL} p-2.5`}>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-secondary">
              Bàn cờ
            </span>
            <button
              className={BTN}
              onClick={() => setBoardText(formatBoard(DEFAULT_BOARD))}
            >
              Bàn cờ chính thức
            </button>
          </div>
          <textarea
            value={boardText}
            onChange={(e) => setBoardText(e.target.value)}
            spellCheck={false}
            rows={22}
            className={FIELD}
          />
          <div className="mt-1 text-[10px] leading-relaxed text-disabled">
            Địa hình: <code>.</code> Ô Trắng · <code>f</code> Rừng ·{" "}
            <code>m</code> Núi · <code>r</code> Sông. Vùng thành:{" "}
            <code>tri nguy &quot;Tên&quot; A8 3x3</code> hoặc{" "}
            <code>chau &quot;Tên&quot; B2 2x2</code> — ô neo là góc trên-trái.
          </div>
        </section>
      </div>

      {/* ── Xem trước ── */}
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <section className={`${PANEL} p-3`}>
          {preview.error ? (
            <div className="rounded border border-danger/50 bg-danger/10 px-2.5 py-2 text-xs leading-relaxed text-danger">
              {preview.error}
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-3">
              <button
                className={BTN_PRIMARY}
                onClick={() => preview.state && onStart(preview.state)}
              >
                Bắt đầu ván →
              </button>
              {onCancel && (
                <button className={BTN} onClick={onCancel}>
                  Quay lại
                </button>
              )}
              <span className="font-mono text-[11px] text-secondary">
                {preview.board!.name} · {preview.board!.rows}×
                {preview.board!.cols} · {preview.players!.length} người chơi
              </span>
              <span className="flex gap-2 font-mono text-[11px]">
                {counts.map(({ kingdom, total, generals }) => (
                  <span key={kingdom} style={{ color: `var(--${kingdom})` }}>
                    {FACTION_LABEL[kingdom]} {total}
                    <span className="opacity-60"> ({generals} cầm quân)</span>
                  </span>
                ))}
              </span>
            </div>
          )}
        </section>

        {preview.state && (
          <section className={`${PANEL} flex-1 overflow-auto p-3`}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-secondary">
              Xem trước bàn cờ
            </div>
            <div
              className="inline-block rounded bg-white p-2"
              dangerouslySetInnerHTML={{
                __html: renderBoardSvg(preview.state),
              }}
            />
          </section>
        )}
      </div>
    </div>
  );
}
