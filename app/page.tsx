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
import { Formation } from "@/game/types";
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

  function handleSetFormation(armyId: string, formation: Formation) {
    setGameState((s) => setFormation(s, armyId, formation));
  }

  return (
    <main className="w-screen h-screen">
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
        onSetFormation={handleSetFormation}
      />
      <Canvas shadows camera={{ position: [6, 10, 30], fov: 45 }}>
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
