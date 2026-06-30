"use client";

import { armiesAt, totalUnits } from "@/game/rules";
import { Formation, GameState, Owner } from "@/game/types";

interface Props {
  state: GameState;
  selectedTile: string | null;
  activeArmyId: string | null;
  hasSave: boolean;
  onSelectArmy: (armyId: string) => void;
  onMove: () => void;
  onBattle: () => void;
  onFire: () => void;
  onFlood: () => void;
  onSupply: () => void;
  onNextPhase: () => void;
  onSave: () => void;
  onLoad: () => void;
  onSetFormation: (armyId: string, formation: Formation) => void;
}

const KD: Record<Owner, string> = { wei: "Ngụy", shu: "Thục", wu: "Ngô" };
const KD_COLOR: Record<Owner, string> = {
  wei: "#1565C0",
  shu: "#C62828",
  wu: "#D4880A",
};
const SEASON_VI: Record<string, string> = {
  SPRING: "Xuân",
  SUMMER: "Hạ",
  AUTUMN: "Thu",
  WINTER: "Đông",
};
const FORMATION_LABEL: Record<Formation, string> = {
  NORMAL: "Thường",
  OFFENSIVE: "Công",
  DEFENSIVE: "Thủ",
  ARROW: "Tên",
  CRANE: "Hạc",
};

function n(v: number) {
  return v.toLocaleString("vi-VN");
}

export function GameHud({
  state,
  selectedTile,
  activeArmyId,
  hasSave,
  onSelectArmy,
  onMove,
  onBattle,
  onFire,
  onFlood,
  onSupply,
  onNextPhase,
  onSave,
  onLoad,
  onSetFormation,
}: Props) {
  const tile = selectedTile
    ? state.tiles.find((t) => t.id === selectedTile)
    : undefined;
  const activeArmy = activeArmyId ? state.armies[activeArmyId] : undefined;
  const armiesOnTile = selectedTile ? armiesAt(state, selectedTile) : [];
  const isWinter = state.game.season === "WINTER";

  return (
    <aside className="pointer-events-auto fixed left-4 top-4 z-10 flex w-[340px] max-w-[calc(100vw-2rem)] flex-col gap-2 text-sm">
      {/* ── Header: turn / phase / save ── */}
      <section className="rounded-md border border-slate-300 bg-white/92 p-3 shadow backdrop-blur">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="text-[11px] uppercase tracking-wide text-slate-500">
              Năm {state.game.year} · {SEASON_VI[state.game.season]} · Lượt{" "}
              {state.game.turn}
            </div>
            <div className="mt-0.5 flex items-center gap-2">
              <span className="text-lg font-bold">
                Phase {state.game.phase}
              </span>
              {isWinter && (
                <span className="rounded bg-sky-100 px-1.5 py-0.5 text-[10px] font-semibold text-sky-700">
                  ❄ Đóng băng
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <button
              className="rounded bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white"
              onClick={onNextPhase}
            >
              Next Phase →
            </button>
            <div className="flex gap-1">
              <button
                className="rounded border border-slate-300 px-2 py-1 text-[11px] text-slate-700 hover:bg-slate-100"
                onClick={onSave}
              >
                Lưu
              </button>
              <button
                className={`rounded border px-2 py-1 text-[11px] ${hasSave ? "border-slate-300 text-slate-700 hover:bg-slate-100" : "border-slate-200 text-slate-400 cursor-not-allowed"}`}
                onClick={onLoad}
                disabled={!hasSave}
              >
                Tải
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Kingdom resources ── */}
      <section className="rounded-md border border-slate-300 bg-white/92 p-2.5 shadow backdrop-blur">
        <div className="grid grid-cols-3 gap-1.5">
          {Object.values(state.kingdoms).map((k) => (
            <div
              key={k.id}
              className="rounded border p-1.5"
              style={{
                borderColor: KD_COLOR[k.id] + "55",
                background: KD_COLOR[k.id] + "0d",
              }}
            >
              <div
                className="font-semibold text-xs"
                style={{ color: KD_COLOR[k.id] }}
              >
                {KD[k.id]}
              </div>
              <div className="mt-0.5 grid grid-cols-2 gap-x-1 text-[10px] text-slate-600">
                <span>🪙 {n(k.resources.gold)}</span>
                <span>⭐ {n(k.resources.prestige)}</span>
                <span>🌾 {n(k.resources.grain)}</span>
                <span>👥 {n(k.resources.population)}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Army list ── */}
      <section className="rounded-md border border-slate-300 bg-white/92 p-2.5 shadow backdrop-blur">
        <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          Đạo Quân
        </div>
        <div className="flex flex-col gap-1">
          {Object.values(state.armies).map((army) => {
            const isActive = activeArmyId === army.id;
            const isDefeated = army.status === "DEFEATED";
            return (
              <button
                key={army.id}
                onClick={() => onSelectArmy(army.id)}
                disabled={isDefeated}
                className={`rounded border px-2 py-1.5 text-left text-xs transition-colors ${
                  isDefeated
                    ? "border-slate-100 bg-slate-50 text-slate-400"
                    : isActive
                      ? "border-slate-800 bg-slate-900 text-white"
                      : "border-slate-200 bg-white hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold">
                    <span
                      className="mr-1 inline-block h-2 w-2 rounded-full"
                      style={{
                        background: isDefeated
                          ? "#ccc"
                          : KD_COLOR[army.kingdom],
                      }}
                    />
                    {army.id}
                  </span>
                  <span
                    className={isActive ? "text-slate-300" : "text-slate-500"}
                  >
                    {army.tileId} · {army.supplied ? "✓ lương" : "✗ đói"}
                  </span>
                </div>
                {!isDefeated && (
                  <div
                    className={`mt-0.5 text-[10px] ${isActive ? "text-slate-300" : "text-slate-500"}`}
                  >
                    Bộ {n(army.units.infantry)} · Cung {n(army.units.archers)} ·
                    Kỵ {n(army.units.cavalry)} ·{" "}
                    {FORMATION_LABEL[army.formation]}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Formation toggle for active army */}
        {activeArmy && activeArmy.status !== "DEFEATED" && (
          <div className="mt-2 border-t border-slate-100 pt-2">
            <div className="mb-1 text-[10px] text-slate-500">
              Thế trận — {activeArmy.id}
            </div>
            <div className="flex gap-1">
              {(["NORMAL", "OFFENSIVE", "DEFENSIVE"] as Formation[]).map(
                (f) => (
                  <button
                    key={f}
                    onClick={() => onSetFormation(activeArmy.id, f)}
                    className={`flex-1 rounded border py-1 text-[10px] font-semibold transition-colors ${
                      activeArmy.formation === f
                        ? "border-slate-800 bg-slate-900 text-white"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {FORMATION_LABEL[f]}
                  </button>
                ),
              )}
            </div>
          </div>
        )}
      </section>

      {/* ── Selected tile ── */}
      <section className="rounded-md border border-slate-300 bg-white/92 p-2.5 shadow backdrop-blur">
        {tile ? (
          <>
            <div className="flex items-center justify-between">
              <span className="font-semibold">
                {tile.id}
                {tile.label && (
                  <span className="ml-1 font-normal text-slate-500">
                    — {tile.label}
                  </span>
                )}
              </span>
              <span className="text-[11px] text-slate-500">
                {tile.terrain} / {tile.owner ?? "trống"}
              </span>
            </div>
            {armiesOnTile.length > 0 && (
              <div className="mt-1 text-[10px] text-slate-500">
                Trên ô: {armiesOnTile.map((a) => a.id).join(", ")}
              </div>
            )}
            {tile.effects.length > 0 && (
              <div className="mt-1 text-[10px] text-orange-600">
                Hiệu ứng: {tile.effects.join(", ")}
              </div>
            )}
            <div className="mt-2 flex flex-wrap gap-1">
              <button
                className="rounded bg-slate-800 px-2 py-1 text-[11px] font-semibold text-white disabled:opacity-40"
                onClick={onMove}
                disabled={isWinter || !activeArmy}
              >
                Di chuyển
              </button>
              <button
                className="rounded bg-red-700 px-2 py-1 text-[11px] font-semibold text-white disabled:opacity-40"
                onClick={onBattle}
                disabled={isWinter || armiesOnTile.length < 2}
              >
                Giao chiến
              </button>
              <button
                className="rounded bg-orange-600 px-2 py-1 text-[11px] font-semibold text-white disabled:opacity-40"
                onClick={onFire}
                disabled={isWinter}
              >
                Hỏa
              </button>
              <button
                className="rounded bg-sky-600 px-2 py-1 text-[11px] font-semibold text-white disabled:opacity-40"
                onClick={onFlood}
                disabled={isWinter}
              >
                Thủy
              </button>
              <button
                className="rounded bg-emerald-600 px-2 py-1 text-[11px] font-semibold text-white"
                onClick={onSupply}
              >
                Nối lương
              </button>
            </div>
          </>
        ) : (
          <div className="text-[11px] text-slate-400">Chưa chọn ô nào</div>
        )}
      </section>

      {/* ── Event log ── */}
      <section className="rounded-md border border-slate-300 bg-white/92 p-2.5 shadow backdrop-blur">
        <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          Nhật ký
        </div>
        <div className="flex flex-col gap-0.5">
          {state.events.slice(0, 6).map((ev) => (
            <div
              key={ev.id}
              className="text-[10px] leading-snug text-slate-600"
            >
              <span className="font-semibold text-slate-800">
                {ev.phase}
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
