"use client";

import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";

interface Props {
  position: [number, number, number];
  tileX: number;
  tileY: number;
}

// Deterministic pseudo-random from tile coords
function h(x: number, y: number, salt: number) {
  return ((x * 73 + y * 31 + salt * 17) % 100) / 100;
}

export function Plains({ position, tileX, tileY }: Props) {
  const { scene: grass } = useGLTF("/models/grass.glb");
  const { scene: grassL } = useGLTF("/models/grass_large.glb");
  const { scene: leafs } = useGLTF("/models/grass_leafs.glb");
  const { scene: leafsL } = useGLTF("/models/grass_leafsLarge.glb");

  const scenes = useMemo(() => [grass, grassL, leafs, leafsL], [grass, grassL, leafs, leafsL]);

  const tufts = useMemo(() => [
    {
      sx: -0.28 + h(tileX, tileY, 10) * 0.18,
      sz: -0.22 + h(tileX, tileY, 11) * 0.18,
      rot: h(tileX, tileY, 12) * Math.PI * 2,
      scl: 0.18 + h(tileX, tileY, 13) * 0.08, // 0.18 - 0.26
      idx: Math.floor(h(tileX, tileY, 14) * 4),
    },
    {
      sx: 0.25 + h(tileX, tileY, 20) * 0.18,
      sz: 0.20 + h(tileX, tileY, 21) * 0.18,
      rot: h(tileX, tileY, 22) * Math.PI * 2,
      scl: 0.17 + h(tileX, tileY, 23) * 0.08, // 0.17 - 0.25
      idx: Math.floor(h(tileX, tileY, 24) * 4),
    },
    {
      sx: -0.10 + h(tileX, tileY, 30) * 0.18,
      sz: 0.28 + h(tileX, tileY, 31) * 0.18,
      rot: h(tileX, tileY, 32) * Math.PI * 2,
      scl: 0.16 + h(tileX, tileY, 33) * 0.08, // 0.16 - 0.24
      idx: Math.floor(h(tileX, tileY, 34) * 4),
    },
  ], [tileX, tileY]);
  return (
    <group position={position}>
      {tufts.map((t, i) => (
        <primitive
          key={i}
          object={scenes[t.idx].clone()}
          scale={t.scl}
          position={[t.sx, 0, t.sz]}
          rotation={[0, t.rot, 0]}
        />
      ))}
    </group>
  );
}

useGLTF.preload("/models/grass.glb");
useGLTF.preload("/models/grass_large.glb");
useGLTF.preload("/models/grass_leafs.glb");
useGLTF.preload("/models/grass_leafsLarge.glb");
