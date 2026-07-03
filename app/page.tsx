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
import { FACTION_LABEL } from "@/game/theme";
import { VisionMode } from "@/game/vision";
import { IconTrophy } from "@/components/icons";
import { useState } from "react";

export default function Home() {
  const [gameState, setGameState] = useState(
    () => loadSavedGame() ?? initialGameState,
  );
  const [selectedTile, setSelectedTile] = useState<string | null>("B8");
  const [activeArmyId, setActiveArmyId] = useState<string | null>("army-wei-1");
  const [savedExists, setSavedExists] = useState(() => hasSave());
  const [visionMode, setVisionMode] = useState<VisionMode>("spectator");

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

  return (
    <main className="w-screen h-screen bg-ink">
      {winner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="rounded-xl border-2 border-gold bg-panel px-12 py-10 text-center shadow-2xl shadow-black/60">
            <IconTrophy size={48} className="mx-auto mb-2" />
            <div
              className="font-display text-6xl font-bold text-gold"
              style={{ textShadow: "0 0 30px rgba(232,192,64,0.4)" }}
            >
              {FACTION_LABEL[winner]}
            </div>
            <div className="mt-2 text-lg text-primary">thống nhất thiên hạ!</div>
            <button
              className="mt-6 rounded border border-gold/70 bg-chu-sa px-6 py-2 font-semibold text-gold hover:brightness-125"
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
        visionMode={visionMode}
        onSetVisionMode={setVisionMode}
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
      <Canvas shadows="percentage" camera={{ position: [21, 19, 21], fov: 45 }}>
        <GameGrid />
        <ambientLight intensity={2} />
        <directionalLight castShadow position={[20, 30, 20]} />
        <GameMap
          state={gameState}
          selectedTile={selectedTile}
          activeArmyId={activeArmyId}
          visionMode={visionMode}
          onSelectTile={setSelectedTile}
          onSelectArmy={setActiveArmyId}
        />
        <OrbitControls
          target={[7, 0, 7]}
          enableRotate={true}
          minDistance={5}
          maxDistance={50}
        />
      </Canvas>
    </main>
  );
}
