"use client";

/**
 * Console GM — nơi điều hành một ván thật.
 *
 * Vòng làm việc mỗi lượt: dán lệnh người chơi PM tới → soát ✓/✗ → giải quyết
 * lượt → copy chiến báo đi đăng → lưu vào `data/game-save.json`.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BoardCanvas } from "@/components/BoardCanvas";
import { BoardPanel } from "@/components/BoardPanel";
import { NewGamePanel } from "@/components/NewGamePanel";
import { renderBoardLegend, renderBoardSvg } from "@/game/board-svg";
import { clearSave, loadSavedGame, saveGame } from "@/game/persistence";
import { parseOrders } from "@/game/orders/parse";
import { CommandResult, validateOrders } from "@/game/orders/validate";
import {
  renderChienBao,
  renderKingdomBriefing,
  reportSlug,
  reportSummary,
  reportTitle,
} from "@/game/report";
import { resolvePhase, SEASON_LABEL, startGame, TurnReport } from "@/game/resolve";
import { createDefaultGame, DEFAULT_SETUP } from "@/game/setup";
import { FACTION_LABEL } from "@/game/theme";
import { GameState, KINGDOMS, Owner } from "@/game/types";
import { VisionMode } from "@/game/vision";

const PANEL =
  "rounded-md border border-line bg-panel/95 shadow-lg shadow-black/40 backdrop-blur";
const BTN =
  "rounded border border-line px-2.5 py-1 text-xs text-secondary transition-colors hover:border-gold/60 hover:text-gold disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-line disabled:hover:text-secondary";
const BTN_PRIMARY =
  "rounded border border-gold/70 bg-chu-sa px-4 py-1.5 text-xs font-bold tracking-wide text-gold transition-[filter] hover:brightness-125 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:brightness-100";

const SAMPLE = `# Mỗi dòng: <người chơi>: <lệnh>; <lệnh>
# Xem bảng lệnh bên dưới. Dòng bắt đầu bằng # là ghi chú.
`;

type Tab = "orders" | "report" | "briefing";

export default function GmConsole() {
  const [state, setState] = useState<GameState | null>(null);
  const [orders, setOrders] = useState(SAMPLE);
  const [report, setReport] = useState<TurnReport | null>(null);
  const [reportState, setReportState] = useState<GameState | null>(null);
  const [tab, setTab] = useState<Tab>("orders");
  const [briefingFor, setBriefingFor] = useState<Owner>("wei");
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [setupOpen, setSetupOpen] = useState(false);
  const [selectedTile, setSelectedTile] = useState<string | null>(null);
  const [activeCommanderId, setActiveCommanderId] = useState<string | null>(null);
  const [visionMode, setVisionMode] = useState<VisionMode>("spectator");

  useEffect(() => {
    let cancelled = false;
    loadSavedGame()
      .then((saved) => {
        if (cancelled) return;
        if (saved) {
          setState(saved);
          setStatus("Đã nạp ván từ data/game-save.json.");
        } else {
          setState(startGame(createDefaultGame()));
          setStatus(
            `Ván mới với danh sách mặc định (${DEFAULT_SETUP.players.length} người). Bấm Lưu để ghi ra data/game-save.json.`,
          );
        }
      })
      .catch((error: Error) => {
        if (cancelled) return;
        setState(startGame(createDefaultGame()));
        setStatus(error.message);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  /** Soát lệnh chạy trên bản sao trạng thái, đúng code đường giải quyết dùng. */
  const validation: CommandResult[] = useMemo(() => {
    if (!state) return [];
    return validateOrders(state, parseOrders(state, orders));
  }, [state, orders]);

  const problems = validation.filter((r) => !r.ok).length;

  const persist = useCallback(async (next: GameState, message: string) => {
    setBusy(true);
    try {
      await saveGame(next);
      setStatus(message);
    } catch (error) {
      setStatus((error as Error).message);
    } finally {
      setBusy(false);
    }
  }, []);

  function handleResolve() {
    if (!state) return;
    const parsed = parseOrders(state, orders);
    const result = resolvePhase(state, parsed);
    setState(result.state);
    setReport(result.report);
    setReportState(result.state);
    setOrders(SAMPLE);
    setTab("report");
    void persist(result.state, "Đã giải quyết lượt và lưu ván.");
  }

  async function handleStartGame(fresh: GameState) {
    setState(startGame(fresh));
    setReport(null);
    setReportState(null);
    setOrders(SAMPLE);
    setTab("orders");
    setSetupOpen(false);
    try {
      await clearSave();
    } catch {
      /* chưa có file lưu thì thôi */
    }
    setStatus(
      `Đã dựng ván mới trên bàn cờ "${fresh.map.name}" (${fresh.map.size.rows}×${fresh.map.size.cols}). Bấm Lưu để ghi ra data/game-save.json.`,
    );
  }

  async function handlePublish() {
    if (!report || !reportState) return;
    setBusy(true);
    try {
      const response = await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: reportSlug(report),
          title: reportTitle(report),
          summary: reportSummary(report),
          markdown: renderChienBao({ state: reportState, report }),
          svg: renderBoardSvg(reportState),
          legend: renderBoardLegend(reportState),
        }),
      });
      const body = (await response.json()) as { path?: string; error?: string };
      setStatus(
        response.ok
          ? `Đã ghi ${body.path}. Commit và push để lên ferez96.com.`
          : (body.error ?? "Xuất bản thất bại."),
      );
    } catch (error) {
      setStatus((error as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function copy(text: string, label: string) {
    try {
      await navigator.clipboard.writeText(text);
      setStatus(`Đã copy ${label}.`);
    } catch {
      setStatus("Trình duyệt chặn clipboard — hãy bôi đen rồi copy tay.");
    }
  }

  if (!state) {
    return (
      <main className="flex h-screen w-screen items-center justify-center bg-ink text-secondary">
        Đang nạp ván…
      </main>
    );
  }

  const chienBao =
    report && reportState
      ? renderChienBao({ state: reportState, report })
      : "";
  const briefing = renderKingdomBriefing(state, briefingFor);
  const finished = state.game.status === "FINISHED";

  if (setupOpen) {
    return (
      <main className="h-screen w-screen bg-ink text-primary">
        <NewGamePanel
          onStart={(fresh) => void handleStartGame(fresh)}
          onCancel={() => setSetupOpen(false)}
        />
      </main>
    );
  }

  return (
    <main className="flex h-screen w-screen bg-ink text-primary">
      {/* ── Cột trái: thế trận ── */}
      <div className="flex w-[360px] shrink-0 flex-col gap-2 overflow-y-auto border-r border-line p-3">
        <BoardPanel
          state={state}
          selectedTile={selectedTile}
          activeCommanderId={activeCommanderId}
          visionMode={visionMode}
          onSetVisionMode={setVisionMode}
          onSelectCommander={setActiveCommanderId}
        />
      </div>

      {/* ── Cột giữa: bàn cờ ── */}
      <div className="relative min-w-0 flex-1">
        <BoardCanvas
          state={state}
          selectedTile={selectedTile}
          activeCommanderId={activeCommanderId}
          visionMode={visionMode}
          onSelectTile={setSelectedTile}
          onSelectCommander={setActiveCommanderId}
        />
        <Link
          href="/"
          className="absolute left-3 top-3 rounded border border-line bg-panel/95 px-3 py-1.5 text-xs text-secondary transition-colors hover:border-gold/60 hover:text-gold"
        >
          ← Bản đồ công khai
        </Link>
      </div>

      {/* ── Cột phải: điều hành ── */}
      <div className="flex w-[460px] shrink-0 flex-col gap-2 overflow-y-auto border-l border-line p-3">
        <section className={`${PANEL} p-3`}>
          <div className="flex items-baseline justify-between">
            <span className="font-display text-lg text-gold">Console GM</span>
            <span className="font-mono text-xs text-secondary">
              Năm {state.game.year} · {SEASON_LABEL[state.game.season]} · Turn{" "}
              {state.game.turn} · {state.game.phase === "GO" ? "Go" : "Atc"}
            </span>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <button
              className={BTN_PRIMARY}
              onClick={handleResolve}
              disabled={busy || finished}
            >
              Giải quyết lượt {state.game.phase === "GO" ? "Go" : "Atc"} →
            </button>
            <button
              className={BTN}
              onClick={() => void persist(state, "Đã lưu ván.")}
              disabled={busy}
            >
              Lưu
            </button>
            <button
              className={BTN}
              onClick={() => setSetupOpen(true)}
              disabled={busy}
            >
              Ván mới
            </button>
          </div>
          {finished && (
            <div className="mt-2 rounded border border-gold/60 bg-chu-sa/40 px-2 py-1 text-xs text-gold">
              Ván đã kết thúc —{" "}
              {state.victory.winner
                ? `${FACTION_LABEL[state.victory.winner]} thắng`
                : "chưa rõ người thắng"}
              .
            </div>
          )}
          {status && (
            <div className="mt-2 text-[11px] text-secondary">{status}</div>
          )}
        </section>

        {/* ── Tabs ── */}
        <div className="flex gap-1">
          {(
            [
              ["orders", "Lệnh"],
              ["report", "Chiến báo"],
              ["briefing", "Bảng nước"],
            ] as [Tab, string][]
          ).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex-1 rounded border px-2 py-1 text-xs font-semibold transition-colors ${
                tab === id
                  ? "border-gold bg-chu-sa text-gold"
                  : "border-line bg-panel-strong/60 text-secondary hover:border-gold/50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "orders" && (
          <>
            <section className={`${PANEL} p-2.5`}>
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-secondary">
                  Dán lệnh người chơi
                </span>
                <span
                  className={`font-mono text-[11px] ${problems ? "text-danger" : "text-success"}`}
                >
                  {validation.length} lệnh · {problems} lỗi
                </span>
              </div>
              <textarea
                value={orders}
                onChange={(e) => setOrders(e.target.value)}
                spellCheck={false}
                rows={10}
                className="w-full rounded border border-line bg-ink px-2 py-1.5 font-mono text-[12px] leading-relaxed text-primary outline-none focus:border-gold/60"
              />
            </section>

            {validation.length > 0 && (
              <section className={`${PANEL} p-2.5`}>
                <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-secondary">
                  Soát lệnh
                </div>
                <div className="flex flex-col gap-1">
                  {validation.map((result, index) => (
                    <div
                      key={`${result.line}-${index}`}
                      className={`rounded border px-2 py-1 text-[11px] leading-relaxed ${
                        result.ok
                          ? "border-success/40 bg-success/10"
                          : "border-danger/40 bg-danger/10"
                      }`}
                    >
                      <div className="font-mono text-primary">
                        <span
                          className={result.ok ? "text-success" : "text-danger"}
                        >
                          {result.ok ? "✓" : "✗"}
                        </span>{" "}
                        {result.raw}
                      </div>
                      <div
                        className={`mt-0.5 ${result.ok ? "text-secondary" : "text-danger"}`}
                      >
                        {result.ok ? result.detail : result.error}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <OrderCheatSheet />
          </>
        )}

        {tab === "report" && (
          <section className={`${PANEL} p-2.5`}>
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-secondary">
                Chiến báo
              </span>
              <div className="flex gap-1.5">
                <button
                  className={BTN}
                  onClick={() => void copy(chienBao, "chiến báo")}
                  disabled={!chienBao}
                >
                  Copy markdown
                </button>
                <button
                  className={BTN}
                  onClick={() => void handlePublish()}
                  disabled={!chienBao || busy}
                >
                  Xuất bản
                </button>
              </div>
            </div>
            {chienBao ? (
              <pre className="max-h-[60vh] overflow-auto whitespace-pre-wrap rounded border border-line bg-ink px-2 py-1.5 font-mono text-[11px] leading-relaxed text-secondary">
                {chienBao}
              </pre>
            ) : (
              <div className="text-xs text-disabled">
                Chưa giải quyết lượt nào trong phiên này.
              </div>
            )}
          </section>
        )}

        {tab === "briefing" && (
          <section className={`${PANEL} p-2.5`}>
            <div className="mb-1.5 flex items-center justify-between">
              <div className="flex gap-1">
                {KINGDOMS.map((k) => (
                  <button
                    key={k}
                    onClick={() => setBriefingFor(k)}
                    className={`rounded border px-2 py-0.5 text-[11px] font-semibold transition-colors ${
                      briefingFor === k
                        ? "border-gold bg-chu-sa text-gold"
                        : "border-line bg-panel-strong/60 hover:border-gold/50"
                    }`}
                    style={{ color: briefingFor === k ? undefined : `var(--${k})` }}
                  >
                    {FACTION_LABEL[k]}
                  </button>
                ))}
              </div>
              <button
                className={BTN}
                onClick={() => void copy(briefing, `bảng ${FACTION_LABEL[briefingFor]}`)}
              >
                Copy
              </button>
            </div>
            <div className="mb-1 text-[11px] text-secondary">
              Bảng riêng từng nước — PM cho Chủ Công, không đăng công khai.
            </div>
            <pre className="max-h-[60vh] overflow-auto whitespace-pre-wrap rounded border border-line bg-ink px-2 py-1.5 font-mono text-[11px] leading-relaxed text-secondary">
              {briefing}
            </pre>
          </section>
        )}
      </div>
    </main>
  );
}

function OrderCheatSheet() {
  const rows: [string, string][] = [
    ["di C9", "đi 1 ô theo cạnh vuông"],
    ["danh C9", "đánh ô kề hoặc ô đang đứng"],
    ["thu / cong", "đổi thế trận"],
    ["chieu 2000 bo", "tuyển Bộ Binh (phải đứng trên Trì)"],
    ["chieu 2000 cung", "đổi Bộ sang Cung; ky cũng vậy"],
    ["gui 1000 bo -> player11", "chuyển quân, cùng ô, chừa 1000"],
    ["doi dan 3", "Nhà Dân: 3 Tài Nguyên → Dân"],
    ["doi lua 2000", "Ruộng: 2000 Dân → Lúa"],
    ["nang mo", "nâng cấp: mo/ruong/nhadan/bo/cung/ky"],
  ];

  return (
    <section className={`${PANEL} p-2.5`}>
      <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-secondary">
        Bảng lệnh
      </div>
      <div className="flex flex-col gap-0.5">
        {rows.map(([syntax, meaning]) => (
          <div key={syntax} className="flex gap-2 text-[11px]">
            <code className="w-[190px] shrink-0 font-mono text-gold">
              {syntax}
            </code>
            <span className="text-secondary">{meaning}</span>
          </div>
        ))}
      </div>
      <div className="mt-2 text-[10px] leading-relaxed text-disabled">
        Nhiều lệnh trên một dòng thì cách nhau bằng <code>;</code>. Nhận diện
        người chơi bằng mã (<code>player05</code>) hoặc tên, có dấu hay không
        đều được. Lệnh cấp quốc gia (<code>doi</code>, <code>nang</code>) chỉ
        Chủ Công hoặc Quân Sư ra được.
      </div>
    </section>
  );
}
