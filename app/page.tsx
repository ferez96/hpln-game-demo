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
  updateSupply,
} from "@/game/rules";
import { useState } from "react";

export default function Home() {
  const [gameState, setGameState] = useState(initialGameState);
  const [selectedTile, setSelectedTile] = useState<string | null>("B8");
  const [activeArmyId, setActiveArmyId] = useState<string | null>("army-wei-1");

  function moveActiveArmy() {
    if (!activeArmyId || !selectedTile) return;
    setGameState((state) => moveArmy(state, activeArmyId, selectedTile));
  }

  function resolveSelectedBattle() {
    if (!selectedTile) return;
    setGameState((state) => {
      const armies = armiesAt(state, selectedTile);
      const activeArmy = activeArmyId ? state.armies[activeArmyId] : undefined;
      const attacker = activeArmy && activeArmy.tileId === selectedTile ? activeArmy : armies[0];
      const defender = armies.find((army) => army.kingdom !== attacker?.kingdom);
      if (!attacker || !defender) return state;
      return resolveBattle(state, attacker.id, defender.id);
    });
  }

  return (
    <main className="w-screen h-screen">
      <GameHud
        state={gameState}
        selectedTile={selectedTile}
        activeArmyId={activeArmyId}
        onSelectArmy={setActiveArmyId}
        onMove={moveActiveArmy}
        onBattle={resolveSelectedBattle}
        onFire={() => selectedTile && setGameState((state) => applyTileEffect(state, selectedTile, "fire"))}
        onFlood={() => selectedTile && setGameState((state) => applyTileEffect(state, selectedTile, "flood"))}
        onSupply={() => setGameState(updateSupply)}
        onNextPhase={() => setGameState(advancePhase)}
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
