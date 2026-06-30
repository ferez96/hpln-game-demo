"use client";

import { useState } from "react";
import { armiesAt, calculateScore } from "@/game/rules";
import { Formation, GameState, Owner, Units } from "@/game/types";

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
  onClear: () => void;
  onSetFormation: (armyId: string, formation: Formation) => void;
  onBuyUnits: (armyId: string, units: Partial<Units>) => void;
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
const RANK_LABEL: Record<string, string> = {
  GENERAL: "Tướng",
  GREAT_GENERAL: "Đại Tướng",
  WAR_GOD: "Chiến Tướng",
};

function n(v: number) {
  if (v >= 1000) return (v / 1000).toFixed(v % 1000 === 0 ? 0 : 1) + "k";
  return String(v);
}

const EMPTY_RECRUIT = { infantry: 0, archers: 0, cavalry: 0 };

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
  onClear,
  onSetFormation,
  onBuyUnits,
}: Props) {
  const [recruit, setRecruit] = useState(EMPTY_RECRUIT);
  const [expanded, setExpanded] = useState<Record<Owner, boolean>>({
    wei: true,
    shu: true,
    wu: true,
  });

  const tile = selectedTile
    ? state.tiles.find((t) => t.id === selectedTile)
    : undefined;
  const activeArmy = activeArmyId ? state.armies[activeArmyId] : undefined;
  const armiesOnTile = selectedTile ? armiesAt(state, selectedTile) : [];
  const isWinter = state.game.season === "WINTER";

  function toggleKingdom(k: Owner) {
    setExpanded((prev) => ({ ...prev, [k]: !prev[k] }));
  }

  function handleBuy() {
    if (!activeArmy) return;
    onBuyUnits(activeArmy.id, recruit);
    setRecruit(EMPTY_RECRUIT);
  }

  const scores = Object.fromEntries(
    (["wei", "shu", "wu"] as Owner[]).map((k) => [k, calculateScore(state, k)])
  ) as Record<Owner, number>;

  const leader = Object.entries(scores).sort(([, a], [, b]) => b - a)[0]?.[0] as Owner | undefined;

  return (
    <aside className="pointer-events-auto fixed left-4 top-4 z-10 flex w-[340px] max-w-[calc(100vw-2rem)] flex-col gap-2 text-sm">

      {/* ── Header ── */}
      <section className="rounded-md border border-slate-300 bg-white/92 p-3 shadow backdrop-blur">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="text-[11px] uppercase tracking-wide text-slate-500">
              Năm {state.game.year} · {SEASON_VI[state.game.season]} · Lượt {state.game.turn}
            </div>
            <div className="mt-0.5 flex items-center gap-2">
              <span className="text-lg font-bold">Phase {state.game.phase}</span>
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
              <button
                className="rounded border border-red-200 px-2 py-1 text-[11px] text-red-600 hover:bg-red-50"
                onClick={onClear}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Scoreboard ── */}
      <section className="rounded-md border border-slate-300 bg-white/92 p-2.5 shadow backdrop-blur">
        <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
          Điểm lãnh thổ
          {(state.game.season === "SPRING" || state.game.season === "AUTUMN") && (
            <span className="ml-1 text-amber-600">● tính điểm</span>
          )}
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {(["wei", "shu", "wu"] as Owner[]).map((k) => {
            const kd = state.kingdoms[k];
            const live = scores[k];
            const isLeading = k === leader;
            return (
              <div
                key={k}
                className="rounded border p-1.5 text-center"
                style={{
                  borderColor: KD_COLOR[k] + (isLeading ? "cc" : "44"),
                  background: KD_COLOR[k] + (isLeading ? "18" : "0a"),
                }}
              >
                <div className="text-[10px] font-semibold" style={{ color: KD_COLOR[k] }}>
                  {KD[k]}{isLeading ? " 🏆" : ""}
                </div>
                <div className="text-lg font-bold leading-none" style={{ color: KD_COLOR[k] }}>
                  {live}
                </div>
                <div className="text-[9px] text-slate-400">+{kd.score} tích</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Per-kingdom sections ── */}
      {(["wei", "shu", "wu"] as Owner[]).map((kId) => {
        const k = state.kingdoms[kId];
        if (k.eliminated) return null;
        const kArmies = Object.values(state.armies).filter((a) => a.kingdom === kId);
        const isOpen = expanded[kId];

        return (
          <section
            key={kId}
            className="rounded-md border bg-white/92 shadow backdrop-blur overflow-hidden"
            style={{ borderColor: KD_COLOR[kId] + "55" }}
          >
            {/* Kingdom header row */}
            <button
              className="flex w-full items-center justify-between px-2.5 py-2 text-left"
              onClick={() => toggleKingdom(kId)}
            >
              <span className="font-bold text-sm" style={{ color: KD_COLOR[kId] }}>
                {isOpen ? "▼" : "▶"} {KD[kId]}
              </span>
              <span className="text-[11px] text-slate-500">
                🪙{n(k.resources.gold)} ⭐{n(k.resources.prestige)} 🌾{n(k.resources.grain)} 👥{n(k.resources.population)}
              </span>
            </button>

            {isOpen && (
              <div className="border-t px-2.5 pb-2.5 pt-1.5 flex flex-col gap-1" style={{ borderColor: KD_COLOR[kId] + "33" }}>
                {kArmies.map((army) => {
                  const isActive = activeArmyId === army.id;
                  const isDefeated = army.status === "DEFEATED";
                  const general = state.generals[army.generalId];
                  const generalName = general?.name ?? army.generalId;

                  return (
                    <div key={army.id}>
                      <button
                        onClick={() => !isDefeated && onSelectArmy(army.id)}
                        disabled={isDefeated}
                        className={`w-full rounded border px-2 py-1.5 text-left text-xs transition-colors ${
                          isDefeated
                            ? "border-slate-100 bg-slate-50 text-slate-400"
                            : isActive
                              ? "border-slate-700 bg-slate-900 text-white"
                              : "border-slate-200 bg-white hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">{generalName}</span>
                          <span className={`text-[10px] ${isActive ? "text-slate-300" : "text-slate-500"}`}>
                            {army.tileId} {army.supplied ? "✓" : "✗đói"}
                          </span>
                        </div>
                        {!isDefeated && (
                          <div className={`mt-0.5 text-[10px] ${isActive ? "text-slate-300" : "text-slate-500"}`}>
                            {general && <span className="mr-1">{RANK_LABEL[general.rank]}</span>}
                            Bộ {n(army.units.infantry)} · Cung {n(army.units.archers)} · Kỵ {n(army.units.cavalry)}
                            <span className="ml-1 opacity-70">· {FORMATION_LABEL[army.formation]}</span>
                          </div>
                        )}
                      </button>

                      {/* Controls — only for active non-defeated army */}
                      {isActive && !isDefeated && (
                        <div className="mt-1 flex flex-col gap-1.5 rounded border border-slate-200 bg-slate-50 p-2">
                          {/* Formation */}
                          <div className="flex gap-1">
                            {(["NORMAL", "OFFENSIVE", "DEFENSIVE"] as Formation[]).map((f) => (
                              <button
                                key={f}
                                onClick={() => onSetFormation(army.id, f)}
                                className={`flex-1 rounded border py-0.5 text-[10px] font-semibold transition-colors ${
                                  army.formation === f
                                    ? "border-slate-800 bg-slate-900 text-white"
                                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                                }`}
                              >
                                {FORMATION_LABEL[f]}
                              </button>
                            ))}
                          </div>

                          {/* Recruit */}
                          <div className="grid grid-cols-3 gap-1">
                            {(["infantry", "archers", "cavalry"] as const).map((type) => (
                              <div key={type} className="flex flex-col gap-0.5">
                                <span className="text-center text-[9px] text-slate-400">
                                  {type === "infantry" ? "Bộ" : type === "archers" ? "Cung" : "Kỵ"}
                                </span>
                                <input
                                  type="number"
                                  min={0}
                                  step={1000}
                                  value={recruit[type]}
                                  onChange={(e) =>
                                    setRecruit((r) => ({ ...r, [type]: Number(e.target.value) }))
                                  }
                                  className="w-full rounded border border-slate-200 px-1 py-0.5 text-center text-[10px]"
                                />
                              </div>
                            ))}
                          </div>
                          <button
                            onClick={handleBuy}
                            disabled={recruit.infantry + recruit.archers + recruit.cavalry === 0}
                            className="w-full rounded bg-emerald-700 py-0.5 text-[10px] font-semibold text-white disabled:opacity-40"
                          >
                            Chiêu binh
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        );
      })}

      {/* ── Selected tile ── */}
      <section className="rounded-md border border-slate-300 bg-white/92 p-2.5 shadow backdrop-blur">
        {tile ? (
          <>
            <div className="flex items-center justify-between">
              <span className="font-semibold">
                {tile.id}
                {tile.label && <span className="ml-1 font-normal text-slate-500">— {tile.label}</span>}
              </span>
              <span className="text-[11px] text-slate-500">
                {tile.terrain} / {tile.owner ?? "trống"}
              </span>
            </div>
            {armiesOnTile.length > 0 && (
              <div className="mt-1 text-[10px] text-slate-500">
                Trên ô: {armiesOnTile.map((a) => {
                  const g = state.generals[a.generalId];
                  return g?.name ?? a.id;
                }).join(", ")}
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
        <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
          Nhật ký
        </div>
        <div className="flex flex-col gap-0.5">
          {state.events.slice(0, 6).map((ev) => (
            <div key={ev.id} className="text-[10px] leading-snug text-slate-600">
              <span className="font-semibold text-slate-800">
                {ev.phase}{ev.turn}
              </span>{" "}
              {ev.message}
            </div>
          ))}
        </div>
      </section>
    </aside>
  );
}
