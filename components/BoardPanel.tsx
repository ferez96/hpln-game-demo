"use client";

import { commandersAt } from "@/game/helpers";
import { calculateScore } from "@/game/scoring";
import { SEASON_LABEL } from "@/game/resolve";
import { CommanderState, GameState, Owner, KINGDOMS } from "@/game/types";
import { FACTION_HAN, FACTION_LABEL } from "@/game/theme";
import { isCommanderVisible, VisionMode } from "@/game/vision";
import {
  IconGrain,
  IconPrestigeStar,
  IconResourceGold,
  IconTroops,
  IconTrophy,
} from "@/components/icons";

interface Props {
  state: GameState;
  selectedTile: string | null;
  activeCommanderId: string | null;
  visionMode: VisionMode;
  onSetVisionMode: (mode: VisionMode) => void;
  onSelectCommander: (commanderId: string) => void;
  /** Nội dung phụ do trang chủ quản chèn thêm (ví dụ bảng lệnh của GM). */
  children?: React.ReactNode;
}

function n(v: number) {
  if (v >= 1000) return (v / 1000).toFixed(v % 1000 === 0 ? 0 : 1) + "k";
  return String(v);
}

const PANEL =
  "rounded-md border border-line bg-panel/95 shadow-lg shadow-black/40 backdrop-blur";

export function BoardPanel({
  state,
  selectedTile,
  activeCommanderId,
  visionMode,
  onSetVisionMode,
  onSelectCommander,
  children,
}: Props) {
  const tile = selectedTile
    ? state.tiles.find((t) => t.id === selectedTile)
    : undefined;
  const onTile = selectedTile ? commandersAt(state, selectedTile) : [];
  const visibleOnTile = onTile.filter((c) =>
    isCommanderVisible(state, c, visionMode),
  );

  const viewedKingdomId: Owner | null =
    visionMode === "spectator" ? null : visionMode;
  const viewedKingdom = viewedKingdomId ? state.kingdoms[viewedKingdomId] : null;
  const viewedCommanders: CommanderState[] = viewedKingdomId
    ? Object.values(state.commanders).filter(
        (c) => c.kingdom === viewedKingdomId && c.status !== "DEFEATED",
      )
    : [];

  const scores = Object.fromEntries(
    KINGDOMS.map((k) => [k, calculateScore(state, k)]),
  ) as Record<Owner, number>;
  const leader = KINGDOMS.slice().sort(
    (a, b) => state.kingdoms[b].score - state.kingdoms[a].score,
  )[0];

  const isWinter = state.game.season === "WINTER";

  return (
    <aside className="pointer-events-auto flex w-[340px] max-w-full flex-col gap-2 text-sm text-primary">
      {/* ── Đồng hồ ── */}
      <section className={`${PANEL} p-3`}>
        <div
          className="font-display text-xl tracking-wide text-gold"
          style={{ textShadow: "0 0 16px rgba(232,192,64,0.35)" }}
        >
          Tam Quốc Tranh Hùng
        </div>
        <div className="mt-2 text-xs uppercase tracking-wide text-secondary">
          Năm {state.game.year} · {SEASON_LABEL[state.game.season]} · Turn{" "}
          {state.game.turn}
        </div>
        <div className="mt-0.5 flex items-center gap-2">
          <span className="text-lg font-bold text-primary">
            Lượt {state.game.phase === "GO" ? "Go" : "Atc"}
          </span>
          {isWinter && (
            <span className="rounded border border-wei/50 bg-wei/15 px-1.5 py-0.5 text-xs font-semibold text-wei">
              Đóng băng
            </span>
          )}
        </div>
      </section>

      {/* ── Góc nhìn ── */}
      <section className={`${PANEL} p-2`}>
        <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-secondary">
          Góc nhìn
        </div>
        <div className="grid grid-cols-4 gap-1">
          {KINGDOMS.map((k) => (
            <button
              key={k}
              onClick={() => onSetVisionMode(k)}
              className={`rounded border py-1 text-[11px] font-semibold transition-colors ${
                visionMode === k
                  ? "border-gold bg-chu-sa text-gold"
                  : "border-line bg-panel-strong/60 hover:border-gold/50"
              }`}
              style={{ color: visionMode === k ? undefined : `var(--${k})` }}
            >
              {FACTION_LABEL[k]}
            </button>
          ))}
          <button
            onClick={() => onSetVisionMode("spectator")}
            className={`rounded border py-1 text-[11px] font-semibold transition-colors ${
              visionMode === "spectator"
                ? "border-gold bg-chu-sa text-gold"
                : "border-line bg-panel-strong/60 text-secondary hover:border-gold/50 hover:text-gold"
            }`}
          >
            Khán giả
          </button>
        </div>
      </section>

      {/* ── Điểm ── */}
      <section className={`${PANEL} p-2.5`}>
        <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-secondary">
          Điểm lãnh thổ
          {(state.game.season === "SPRING" ||
            state.game.season === "AUTUMN") && (
            <span className="ml-1 text-gold">· tính điểm</span>
          )}
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {KINGDOMS.map((k) => {
            const kd = state.kingdoms[k];
            const isLeading = k === leader;
            return (
              <div
                key={k}
                className="rounded border p-1.5 text-center"
                style={{
                  borderColor: `color-mix(in srgb, var(--${k}) ${isLeading ? 80 : 35}%, transparent)`,
                  background: `color-mix(in srgb, var(--${k}) ${isLeading ? 16 : 7}%, transparent)`,
                  opacity: kd.eliminated ? 0.45 : 1,
                }}
              >
                <div
                  className="flex items-center justify-center gap-1 text-xs font-semibold"
                  style={{ color: `var(--${k})` }}
                >
                  <span>
                    {FACTION_HAN[k]} {FACTION_LABEL[k]}
                  </span>
                  {isLeading && !kd.eliminated && <IconTrophy size={12} />}
                </div>
                <div
                  className="font-mono text-lg font-bold leading-none"
                  style={{ color: `var(--${k})` }}
                >
                  {kd.score}
                </div>
                <div className="font-mono text-[10px] text-secondary">
                  +{scores[k]} / mùa
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Chi tiết một nước ── */}
      {viewedKingdomId && viewedKingdom && (
        <section
          className={`${PANEL} overflow-hidden`}
          style={{
            borderColor: `color-mix(in srgb, var(--${viewedKingdomId}) 45%, transparent)`,
          }}
        >
          <div className="flex w-full items-center justify-between px-2.5 py-2">
            <span
              className="font-serif text-sm font-bold"
              style={{ color: `var(--${viewedKingdomId})` }}
            >
              {FACTION_HAN[viewedKingdomId]} {FACTION_LABEL[viewedKingdomId]}
            </span>
            <span className="flex items-center gap-2 font-mono text-xs text-secondary">
              <span className="flex items-center gap-0.5">
                <IconResourceGold size={12} />
                {n(viewedKingdom.resources.taiNguyen)}
              </span>
              <span className="flex items-center gap-0.5">
                <IconGrain size={12} />
                {n(viewedKingdom.resources.lua)}
              </span>
              <span className="flex items-center gap-0.5">
                <IconTroops size={12} />
                {n(viewedKingdom.resources.dan)}
              </span>
              <span className="flex items-center gap-0.5">
                <IconPrestigeStar size={12} />
                {n(viewedKingdom.resources.uyDanh)}
              </span>
            </span>
          </div>

          <div
            className="flex flex-col gap-1 border-t px-2.5 pb-2.5 pt-1.5"
            style={{
              borderColor: `color-mix(in srgb, var(--${viewedKingdomId}) 30%, transparent)`,
            }}
          >
            {viewedCommanders.map((commander) => {
              const isActive = activeCommanderId === commander.id;
              const recovering = commander.status === "RECOVERING";
              return (
                <button
                  key={commander.id}
                  onClick={() => onSelectCommander(commander.id)}
                  className={`w-full rounded border px-2 py-1.5 text-left text-xs transition-colors ${
                    recovering
                      ? "border-line/50 bg-ink/40 text-disabled"
                      : isActive
                        ? "border-gold bg-chu-sa/80 text-gold"
                        : "border-line bg-panel-strong/60 text-primary hover:border-gold/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-semibold">
                      {commander.name}
                    </span>
                    <span
                      className={`font-mono text-[10px] ${isActive ? "text-gold/80" : "text-secondary"}`}
                    >
                      {recovering
                        ? `dưỡng → T${commander.readyOnTurn}`
                        : `${commander.tileId}${commander.supplied ? "" : " · mất lương"}`}
                    </span>
                  </div>
                  {!recovering && (
                    <div
                      className={`mt-0.5 font-mono text-[10px] ${isActive ? "text-gold/80" : "text-secondary"}`}
                    >
                      Bộ {n(commander.units.infantry)} · Cung{" "}
                      {n(commander.units.archers)} · Kỵ{" "}
                      {n(commander.units.cavalry)}
                      <span className="ml-1 opacity-70">
                        · thế {commander.stance === "CONG" ? "Công" : "Thủ"}
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Ô đang chọn ── */}
      <section className={`${PANEL} p-2.5`}>
        {tile ? (
          <>
            <div className="flex items-center justify-between">
              <span className="font-serif font-semibold text-primary">
                {tile.id}
                {tile.label && (
                  <span className="ml-1 font-normal text-secondary">
                    — {tile.label}
                  </span>
                )}
              </span>
              <span className="text-xs text-secondary">
                {TERRAIN_LABEL[tile.terrain]} /{" "}
                {tile.owner ? FACTION_LABEL[tile.owner] : "vô chủ"}
              </span>
            </div>
            {visibleOnTile.length > 0 && (
              <div className="mt-1 text-[10px] text-secondary">
                Trên ô: {visibleOnTile.map((c) => c.name).join(", ")}
              </div>
            )}
            {tile.effects.length > 0 && (
              <div className="mt-1 text-[10px] text-danger">
                Hiệu ứng: {tile.effects.join(", ")}
              </div>
            )}
          </>
        ) : (
          <div className="text-xs text-disabled">Chưa chọn ô nào</div>
        )}
      </section>

      {children}

      {/* ── Nhật ký ── */}
      <section className={`${PANEL} p-2.5`}>
        <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-secondary">
          Nhật ký
        </div>
        <div className="flex flex-col gap-0.5">
          {state.events.slice(0, 8).map((ev) => (
            <div
              key={ev.id}
              className="text-[10px] leading-relaxed text-secondary"
            >
              <span className="font-semibold text-primary">
                {ev.phase === "GO" ? "Go" : "Atc"}
                {ev.turn}
              </span>{" "}
              {ev.message}
            </div>
          ))}
        </div>
      </section>
    </aside>
  );
}

const TERRAIN_LABEL: Record<string, string> = {
  plains: "Ô Trắng",
  forest: "Rừng",
  mountain: "Núi",
  river: "Sông",
  city: "Châu Thành",
  capital: "Thành Trì",
};
