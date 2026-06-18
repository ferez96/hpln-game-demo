"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";
import { GameMap } from "@/components/GameMap";

export default function Home() {
  return (
    <main className="w-screen h-screen">
      <Canvas
        shadows
        camera={{ position: [6, 28, 22] }}
      >
        <Grid args={[14, 14]} position={[6, 0, 6]} />

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
