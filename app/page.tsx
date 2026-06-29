"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";
import { GameMap } from "@/components/GameMap";
import GameGrid from "@/components/GameGrid";

export default function Home() {
  return (
    <main className="w-screen h-screen">
      <Canvas shadows camera={{ position: [6, 10, 30], fov: 45 }}>
        <GameGrid />

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
