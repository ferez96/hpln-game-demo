"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { GameMap } from "@/components/GameMap";
import GameGrid from "@/components/GameGrid";
import { GameState } from "@/game/types";
import { VisionMode } from "@/game/vision";

interface Props {
  state: GameState;
  selectedTile: string | null;
  activeCommanderId: string | null;
  visionMode: VisionMode;
  onSelectTile: (tileId: string) => void;
  onSelectCommander: (commanderId: string) => void;
}

export function BoardCanvas(props: Props) {
  const size = props.state.map.size;
  const center: [number, number, number] = [size.cols / 2, 0, size.rows / 2];
  // Kéo camera ra theo cạnh dài để bàn cờ cỡ nào cũng lọt khung.
  const span = Math.max(size.cols, size.rows);

  return (
    <Canvas
      shadows="percentage"
      camera={{ position: [span * 1.55, span * 1.4, span * 1.55], fov: 45 }}
    >
      <GameGrid size={size} />
      <ambientLight intensity={2} />
      <directionalLight castShadow position={[span * 1.5, span * 2.3, span * 1.5]} />
      <GameMap {...props} />
      <OrbitControls
        target={center}
        enableRotate
        minDistance={5}
        maxDistance={span * 4.5}
      />
    </Canvas>
  );
}
