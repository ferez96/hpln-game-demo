"use client";

import { armiesAt, totalUnits } from "@/game/rules";
import { GameState } from "@/game/types";

interface Props {
  state: GameState;
  selectedTile: string | null;
  activeArmyId: string | null;
  onSelectArmy: (armyId: string) => void;
  onMove: () => void;
  onBattle: () => void;
  onFire: () => void;
  onFlood: () => void;
  onSupply: () => void;
  onNextPhase: () => void;
}

const KINGDOM_LABEL = {
  wei: "Ngụy",
  shu: "Thục",
  wu: "Ngô",
};

export function GameHud({
  state,
  selectedTile,
  activeArmyId,
  onSelectArmy,
  onMove,
  onBattle,
  onFire,
  onFlood,
  onSupply,
  onNextPhase,
}: Props) {
  const tile = selectedTile
    ? state.tiles.find((candidate) => candidate.id === selectedTile)
    : undefined;
  const activeArmy = activeArmyId ? state.armies[activeArmyId] : undefined;
  const selectedArmies = selectedTile ? armiesAt(state, selectedTile) : [];
  const latestEvents = state.events.slice(0, 5);

  return (
    <aside className="pointer-events-auto fixed left-4 top-4 z-10 grid w-[360px] max-w-[calc(100vw-2rem)] gap-3 text-sm text-slate-950">
      <section className="rounded-md border border-slate-300 bg-white/90 p-3 shadow-lg backdrop-blur">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-wide text-slate-500">
              Turn {state.game.turn} / {state.game.season}
            </div>
            <div className="text-lg font-semibold">{state.game.phase}</div>
          </div>
          <button
            className="rounded bg-slate-950 px-3 py-2 text-sm font-semibold text-white"
            onClick={onNextPhase}
          >
            Next Phase
          </button>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {Object.values(state.kingdoms).map((kingdom) => (
            <div key={kingdom.id} className="rounded border border-slate-200 p-2">
              <div className="font-semibold">{KINGDOM_LABEL[kingdom.id]}</div>
              <div className="text-xs text-slate-600">Gold {kingdom.resources.gold}</div>
              <div className="text-xs text-slate-600">Grain {kingdom.resources.grain}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-md border border-slate-300 bg-white/90 p-3 shadow-lg backdrop-blur">
        <div className="mb-2 font-semibold">Armies</div>
        <div className="grid gap-2">
          {Object.values(state.armies).map((army) => (
            <button
              key={army.id}
              className={`rounded border px-2 py-2 text-left ${
                activeArmyId === army.id
                  ? "border-slate-950 bg-slate-950 text-white"
                  : "border-slate-200 bg-white"
              }`}
              onClick={() => onSelectArmy(army.id)}
            >
              <span className="font-semibold">{army.id}</span>
              <span className="ml-2 text-xs">
                {army.tileId} / {totalUnits(army.units)} / {army.supplied ? "fed" : "starving"}
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-md border border-slate-300 bg-white/90 p-3 shadow-lg backdrop-blur">
        <div className="font-semibold">{tile ? tile.id : "No tile selected"}</div>
        {tile && (
          <>
            <div className="mt-1 text-xs text-slate-600">
              {tile.label ? `${tile.label} / ` : ""}
              {tile.terrain} / {tile.owner ?? "neutral"}
              {tile.supplyOwner ? " / supplied" : ""}
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              <button className="rounded bg-slate-900 px-2 py-1 text-xs font-semibold text-white" onClick={onMove}>
                Move
              </button>
              <button className="rounded bg-red-700 px-2 py-1 text-xs font-semibold text-white" onClick={onBattle}>
                Battle
              </button>
              <button className="rounded bg-orange-600 px-2 py-1 text-xs font-semibold text-white" onClick={onFire}>
                Fire
              </button>
              <button className="rounded bg-blue-700 px-2 py-1 text-xs font-semibold text-white" onClick={onFlood}>
                Flood
              </button>
              <button className="rounded bg-emerald-700 px-2 py-1 text-xs font-semibold text-white" onClick={onSupply}>
                Supply
              </button>
            </div>
          </>
        )}
        {activeArmy && (
          <div className="mt-3 rounded border border-slate-200 p-2 text-xs text-slate-700">
            Active: {activeArmy.id} at {activeArmy.tileId}
          </div>
        )}
        {selectedArmies.length > 0 && (
          <div className="mt-3 text-xs text-slate-700">
            On tile: {selectedArmies.map((army) => army.id).join(", ")}
          </div>
        )}
      </section>

      <section className="rounded-md border border-slate-300 bg-white/90 p-3 shadow-lg backdrop-blur">
        <div className="mb-2 font-semibold">Log</div>
        <div className="grid gap-1 text-xs text-slate-700">
          {latestEvents.map((event) => (
            <div key={event.id}>
              <span className="font-semibold">{event.phase}{event.turn}</span> {event.message}
            </div>
          ))}
        </div>
      </section>
    </aside>
  );
}
