"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";
import { GameMap } from "@/components/GameMap";
import { GridLabels } from "@/components/GridLabels";
import { MAP_COLS, MAP_ROWS } from "@/game/state";

export default function Home() {
  return (
    <main className="w-screen h-screen">
      <Canvas shadows camera={{ position: [6, 10, 30], fov: 45 }}>
        <Grid
          args={[MAP_COLS, MAP_ROWS]}
          cellSize={1}
          sectionSize={1}
          position={[7, 0, 7]}
        />
        <GridLabels rows={MAP_ROWS} cols={MAP_COLS} />

        <ambientLight intensity={2} />
        <directionalLight castShadow position={[20, 30, 20]} />

        <GameMap />

        <OrbitControls
          target={[6, 0, 6]}
          enableRotate={false}
          minDistance={5}
          maxDistance={50}
        />
      </Canvas>
    </main>
  );
}
