"use client";

import { useState } from "react";
import { armiesAt, calculateScore } from "@/game/rules";
import { Formation, GameState, Owner, Units } from "@/game/types";
import { FACTION_HAN, FACTION_LABEL } from "@/game/theme";
import { isArmyVisible, VisionMode } from "@/game/vision";
import {
  IconAttack,
  IconAttackPower,
  IconBow,
  IconCavalrySpear,
  IconDefensePower,
  IconFireAttack,
  IconFloodAttack,
  IconGrain,
  IconMove,
  IconPrestigeStar,
  IconResourceGold,
  IconSupply,
  IconSword,
  IconTroops,
  IconTrophy,
} from "@/components/icons";

interface Props {
  state: GameState;
  selectedTile: string | null;
  activeArmyId: string | null;
  hasSave: boolean;
  visionMode: VisionMode;
  onSetVisionMode: (mode: VisionMode) => void;
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

const BTN_UTILITY =
  "rounded border border-line px-2 py-1 text-xs text-secondary hover:border-gold/60 hover:text-gold transition-colors";
const BTN_UTILITY_DISABLED = "rounded border border-line/60 px-2 py-1 text-xs text-disabled cursor-not-allowed";

export function GameHud({
  state,
  selectedTile,
  activeArmyId,
  hasSave,
  visionMode,
  onSetVisionMode,
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

  const tile = selectedTile
    ? state.tiles.find((t) => t.id === selectedTile)
    : undefined;
  const activeArmy = activeArmyId ? state.armies[activeArmyId] : undefined;
  const armiesOnTile = selectedTile ? armiesAt(state, selectedTile) : [];
  const visibleArmiesOnTile = armiesOnTile.filter((a) => isArmyVisible(state, a, visionMode));
  const isWinter = state.game.season === "WINTER";

  const viewedKingdomId: Owner | null = visionMode === "spectator" ? null : visionMode;
  const viewedKingdom = viewedKingdomId ? state.kingdoms[viewedKingdomId] : null;
  const viewedArmies = viewedKingdomId
    ? Object.values(state.armies).filter((a) => a.kingdom === viewedKingdomId)
    : [];

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
    <aside className="pointer-events-auto fixed left-4 top-4 z-10 flex w-[340px] max-w-[calc(100vw-2rem)] flex-col gap-2 text-sm text-primary">

      {/* ── Header ── */}
      <section className="rounded-md border border-line bg-panel/95 p-3 shadow-lg shadow-black/40 backdrop-blur">
        <div className="font-display text-xl tracking-wide text-gold" style={{ textShadow: "0 0 16px rgba(232,192,64,0.35)" }}>
          Tam Quốc Tranh Hùng
        </div>
        <div className="mt-2 flex items-start justify-between gap-2">
          <div>
            <div className="text-xs uppercase tracking-wide text-secondary">
              Năm {state.game.year} · {SEASON_VI[state.game.season]} · Lượt {state.game.turn}
            </div>
            <div className="mt-0.5 flex items-center gap-2">
              <span className="text-lg font-bold text-primary">Phase {state.game.phase}</span>
              {isWinter && (
                <span className="rounded border border-wei/50 bg-wei/15 px-1.5 py-0.5 text-xs font-semibold text-wei">
                  ❄ Đóng băng
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <button
              className="rounded border border-gold/70 bg-chu-sa px-3 py-1.5 text-xs font-bold tracking-wide text-gold hover:brightness-125"
              onClick={onNextPhase}
            >
              Next Phase →
            </button>
            <div className="flex gap-1">
              <button className={BTN_UTILITY} onClick={onSave}>
                Lưu
              </button>
              <button
                className={hasSave ? BTN_UTILITY : BTN_UTILITY_DISABLED}
                onClick={onLoad}
                disabled={!hasSave}
              >
                Tải
              </button>
              <button
                className="rounded border border-danger/40 px-2 py-1 text-xs text-danger hover:bg-danger/10"
                onClick={onClear}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Perspective selector ── */}
      <section className="rounded-md border border-line bg-panel/95 p-2 shadow-lg shadow-black/40 backdrop-blur">
        <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-secondary">
          Góc nhìn
        </div>
        <div className="grid grid-cols-4 gap-1">
          {(["wei", "shu", "wu"] as Owner[]).map((k) => (
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

      {/* ── Scoreboard ── */}
      <section className="rounded-md border border-line bg-panel/95 p-2.5 shadow-lg shadow-black/40 backdrop-blur">
        <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-secondary">
          Điểm lãnh thổ
          {(state.game.season === "SPRING" || state.game.season === "AUTUMN") && (
            <span className="ml-1 text-gold">● tính điểm</span>
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
                  borderColor: `color-mix(in srgb, var(--${k}) ${isLeading ? 80 : 35}%, transparent)`,
                  background: `color-mix(in srgb, var(--${k}) ${isLeading ? 16 : 7}%, transparent)`,
                }}
              >
                <div
                  className="flex items-center justify-center gap-1 text-xs font-semibold"
                  style={{ color: `var(--${k})` }}
                >
                  <span>{FACTION_HAN[k]} {FACTION_LABEL[k]}</span>
                  {isLeading && <IconTrophy size={12} />}
                </div>
                <div className="font-mono text-lg font-bold leading-none" style={{ color: `var(--${k})` }}>
                  {live}
                </div>
                <div className="font-mono text-[10px] text-secondary">+{kd.score} tích</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Kingdom detail (only visible for the selected perspective) ── */}
      {viewedKingdomId && viewedKingdom && !viewedKingdom.eliminated && (() => {
        const kId = viewedKingdomId;
        const k = viewedKingdom;
        return (
          <section
            key={kId}
            className="rounded-md border bg-panel/95 shadow-lg shadow-black/40 backdrop-blur overflow-hidden"
            style={{ borderColor: `color-mix(in srgb, var(--${kId}) 45%, transparent)` }}
          >
            {/* Kingdom header row */}
            <div className="flex w-full items-center justify-between px-2.5 py-2">
              <span className="font-serif text-sm font-bold" style={{ color: `var(--${kId})` }}>
                {FACTION_HAN[kId]} {FACTION_LABEL[kId]}
              </span>
              <span className="flex items-center gap-2 font-mono text-xs text-secondary">
                <span className="flex items-center gap-0.5"><IconResourceGold size={12} />{n(k.resources.gold)}</span>
                <span className="flex items-center gap-0.5"><IconPrestigeStar size={12} />{n(k.resources.prestige)}</span>
                <span className="flex items-center gap-0.5"><IconGrain size={12} />{n(k.resources.grain)}</span>
                <span className="flex items-center gap-0.5"><IconTroops size={12} />{n(k.resources.population)}</span>
              </span>
            </div>

            <div
              className="border-t px-2.5 pb-2.5 pt-1.5 flex flex-col gap-1"
              style={{ borderColor: `color-mix(in srgb, var(--${kId}) 30%, transparent)` }}
            >
              {viewedArmies.map((army) => {
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
                            ? "border-line/50 bg-ink/40 text-disabled"
                            : isActive
                              ? "border-gold bg-chu-sa/80 text-gold"
                              : "border-line bg-panel-strong/60 text-primary hover:border-gold/50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-serif font-semibold">{generalName}</span>
                          <span className={`font-mono text-[10px] ${isActive ? "text-gold/80" : "text-secondary"}`}>
                            {army.tileId} {army.supplied ? "✓" : "✗đói"}
                          </span>
                        </div>
                        {!isDefeated && (
                          <div className={`mt-0.5 text-[10px] ${isActive ? "text-gold/80" : "text-secondary"}`}>
                            {general && <span className="mr-1">{RANK_LABEL[general.rank]}</span>}
                            <span className="font-mono">
                              Bộ {n(army.units.infantry)} · Cung {n(army.units.archers)} · Kỵ {n(army.units.cavalry)}
                            </span>
                            <span className="ml-1 opacity-70">· {FORMATION_LABEL[army.formation]}</span>
                          </div>
                        )}
                      </button>

                      {/* Controls — only for active non-defeated army */}
                      {isActive && !isDefeated && (
                        <div className="mt-1 flex flex-col gap-1.5 rounded border border-line bg-ink/50 p-2">
                          {/* Formation */}
                          <div className="flex gap-1">
                            {(["NORMAL", "OFFENSIVE", "DEFENSIVE"] as Formation[]).map((f) => (
                              <button
                                key={f}
                                onClick={() => onSetFormation(army.id, f)}
                                className={`flex flex-1 items-center justify-center gap-1 rounded border py-0.5 text-[10px] font-semibold transition-colors ${
                                  army.formation === f
                                    ? "border-gold bg-chu-sa text-gold"
                                    : "border-line bg-panel text-secondary hover:border-gold/50 hover:text-gold"
                                }`}
                              >
                                {f === "OFFENSIVE" && <IconAttackPower size={11} />}
                                {f === "DEFENSIVE" && <IconDefensePower size={11} />}
                                {FORMATION_LABEL[f]}
                              </button>
                            ))}
                          </div>

                          {/* Recruit */}
                          <div className="grid grid-cols-3 gap-1">
                            {(["infantry", "archers", "cavalry"] as const).map((type) => (
                              <div key={type} className="flex flex-col gap-0.5">
                                <span className="flex items-center justify-center gap-1 text-center text-[9px] text-secondary">
                                  {type === "infantry" && <IconSword size={11} />}
                                  {type === "archers" && <IconBow size={11} />}
                                  {type === "cavalry" && <IconCavalrySpear size={11} />}
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
                                  className="w-full rounded border border-line bg-ink px-1 py-0.5 text-center font-mono text-[10px] text-primary"
                                />
                              </div>
                            ))}
                          </div>
                          <button
                            onClick={handleBuy}
                            disabled={recruit.infantry + recruit.archers + recruit.cavalry === 0}
                            className="w-full rounded border border-success/50 bg-success/15 py-0.5 text-[10px] font-semibold text-success disabled:opacity-40"
                          >
                            Chiêu binh
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
          </section>
        );
      })()}

      {/* ── Selected tile ── */}
      <section className="rounded-md border border-line bg-panel/95 p-2.5 shadow-lg shadow-black/40 backdrop-blur">
        {tile ? (
          <>
            <div className="flex items-center justify-between">
              <span className="font-serif font-semibold text-primary">
                {tile.id}
                {tile.label && <span className="ml-1 font-normal text-secondary">— {tile.label}</span>}
              </span>
              <span className="text-xs text-secondary">
                {tile.terrain} / {tile.owner ? FACTION_LABEL[tile.owner] : "trống"}
              </span>
            </div>
            {visibleArmiesOnTile.length > 0 && (
              <div className="mt-1 text-[10px] text-secondary">
                Trên ô: {visibleArmiesOnTile.map((a) => {
                  const g = state.generals[a.generalId];
                  return g?.name ?? a.id;
                }).join(", ")}
              </div>
            )}
            {tile.effects.length > 0 && (
              <div className="mt-1 text-[10px] text-danger">
                Hiệu ứng: {tile.effects.join(", ")}
              </div>
            )}
            <div className="mt-2 flex flex-wrap gap-1">
              <button
                className="flex items-center gap-1 rounded border border-gold/60 bg-panel-strong px-2 py-1 text-xs font-semibold text-gold hover:brightness-125 disabled:opacity-40 disabled:hover:brightness-100"
                onClick={onMove}
                disabled={isWinter || !activeArmy}
              >
                <IconMove size={13} /> Di chuyển
              </button>
              <button
                className="flex items-center gap-1 rounded border border-danger/60 bg-danger/20 px-2 py-1 text-xs font-semibold text-danger hover:brightness-125 disabled:opacity-40 disabled:hover:brightness-100"
                onClick={onBattle}
                disabled={isWinter || armiesOnTile.length < 2}
              >
                <IconAttack size={13} /> Giao chiến
              </button>
              <button
                className="flex items-center gap-1 rounded border border-wu/60 bg-wu/20 px-2 py-1 text-xs font-semibold text-wu hover:brightness-125 disabled:opacity-40 disabled:hover:brightness-100"
                onClick={onFire}
                disabled={isWinter}
              >
                <IconFireAttack size={13} /> Hỏa
              </button>
              <button
                className="flex items-center gap-1 rounded border border-wei/60 bg-wei/20 px-2 py-1 text-xs font-semibold text-wei hover:brightness-125 disabled:opacity-40 disabled:hover:brightness-100"
                onClick={onFlood}
                disabled={isWinter}
              >
                <IconFloodAttack size={13} /> Thủy
              </button>
              <button
                className="flex items-center gap-1 rounded border border-success/60 bg-success/20 px-2 py-1 text-xs font-semibold text-success hover:brightness-125"
                onClick={onSupply}
              >
                <IconSupply size={13} /> Nối lương
              </button>
            </div>
          </>
        ) : (
          <div className="text-xs text-disabled">Chưa chọn ô nào</div>
        )}
      </section>

      {/* ── Event log ── */}
      <section className="rounded-md border border-line bg-panel/95 p-2.5 shadow-lg shadow-black/40 backdrop-blur">
        <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-secondary">
          Nhật ký
        </div>
        <div className="flex flex-col gap-0.5">
          {state.events.slice(0, 6).map((ev) => (
            <div key={ev.id} className="text-[10px] leading-relaxed text-secondary">
              <span className="font-semibold text-primary">
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
