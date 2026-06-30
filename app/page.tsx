"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { GameMap } from "@/components/GameMap";
import GameGrid from "@/components/GameGrid";
import { GameHud } from "@/components/GameHud";
import { initialGameState } from "@/game/state";
import {
  advancePhase,
  applyTileEffect,
  armiesAt,
  buyUnits,
  moveArmy,
  resolveBattle,
  setFormation,
  updateSupply,
} from "@/game/rules";
import {
  clearSave,
  hasSave,
  loadSavedGame,
  saveGame,
} from "@/game/persistence";
import { Formation, Units } from "@/game/types";
import { useState } from "react";

export default function Home() {
  const [gameState, setGameState] = useState(
    () => loadSavedGame() ?? initialGameState,
  );
  const [selectedTile, setSelectedTile] = useState<string | null>("B8");
  const [activeArmyId, setActiveArmyId] = useState<string | null>("army-wei-1");
  const [savedExists, setSavedExists] = useState(() => hasSave());

  function moveActiveArmy() {
    if (!activeArmyId || !selectedTile) return;
    setGameState((s) => moveArmy(s, activeArmyId, selectedTile));
  }

  function resolveSelectedBattle() {
    if (!selectedTile) return;
    setGameState((s) => {
      const armies = armiesAt(s, selectedTile);
      const active = activeArmyId ? s.armies[activeArmyId] : undefined;
      const attacker =
        active && active.tileId === selectedTile ? active : armies[0];
      const defender = armies.find((a) => a.kingdom !== attacker?.kingdom);
      if (!attacker || !defender) return s;
      return resolveBattle(s, attacker.id, defender.id);
    });
  }

  function handleSave() {
    saveGame(gameState);
    setSavedExists(true);
  }

  function handleLoad() {
    const saved = loadSavedGame();
    if (saved) setGameState(saved);
  }

  function handleClear() {
    clearSave();
    setGameState(initialGameState);
    setSelectedTile(null);
    setActiveArmyId(null);
    setSavedExists(false);
  }

  function handleSetFormation(armyId: string, formation: Formation) {
    setGameState((s) => setFormation(s, armyId, formation));
  }

  function handleBuyUnits(armyId: string, units: Partial<Units>) {
    setGameState((s) => {
      const army = s.armies[armyId];
      if (!army) return s;
      return buyUnits(s, army.kingdom, armyId, units);
    });
  }

  const winner = gameState.victory.winner;
  const KD_LABEL: Record<string, string> = { wei: "Ngụy", shu: "Thục", wu: "Ngô" };

  return (
    <main className="w-screen h-screen">
      {winner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="rounded-xl border border-yellow-400 bg-slate-900 px-12 py-10 text-center shadow-2xl">
            <div className="text-4xl font-bold text-yellow-400">
              {KD_LABEL[winner]}
            </div>
            <div className="mt-2 text-lg text-white">thống nhất thiên hạ!</div>
            <button
              className="mt-6 rounded bg-yellow-400 px-6 py-2 font-semibold text-slate-900"
              onClick={() => { setGameState(initialGameState); setSavedExists(false); }}
            >
              Chơi lại
            </button>
          </div>
        </div>
      )}
      <GameHud
        state={gameState}
        selectedTile={selectedTile}
        activeArmyId={activeArmyId}
        hasSave={savedExists}
        onSelectArmy={setActiveArmyId}
        onMove={moveActiveArmy}
        onBattle={resolveSelectedBattle}
        onFire={() =>
          selectedTile &&
          setGameState((s) => applyTileEffect(s, selectedTile, "fire"))
        }
        onFlood={() =>
          selectedTile &&
          setGameState((s) => applyTileEffect(s, selectedTile, "flood"))
        }
        onSupply={() => setGameState(updateSupply)}
        onNextPhase={() => setGameState(advancePhase)}
        onSave={handleSave}
        onLoad={handleLoad}
        onClear={handleClear}
        onSetFormation={handleSetFormation}
        onBuyUnits={handleBuyUnits}
      />
      <Canvas shadows="percentage" camera={{ position: [6, 10, 30], fov: 45 }}>
        <GameGrid />
        <ambientLight intensity={2} />
        <directionalLight castShadow position={[20, 30, 20]} />
        <GameMap
          state={gameState}
          selectedTile={selectedTile}
          activeArmyId={activeArmyId}
          onSelectTile={setSelectedTile}
          onSelectArmy={setActiveArmyId}
        />
        <OrbitControls
          target={[6, 0, 6]}
          enableRotate={true}
          minDistance={5}
          maxDistance={50}
        />
      </Canvas>
    </main>
  );
}
