"use client";

import { useGLTF } from "@react-three/drei";

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

  const scenes = [grass, grassL, leafs, leafsL];

  const tufts: { sx: number; sz: number; rot: number; scl: number; idx: number }[] = [
    { sx: -0.28, sz: -0.22, rot: h(tileX, tileY, 0) * Math.PI * 2, scl: 0.45 + h(tileX, tileY, 1) * 0.2, idx: Math.floor(h(tileX, tileY, 2) * 4) },
    { sx:  0.25, sz:  0.20, rot: h(tileX, tileY, 3) * Math.PI * 2, scl: 0.40 + h(tileX, tileY, 4) * 0.2, idx: Math.floor(h(tileX, tileY, 5) * 4) },
    { sx: -0.10, sz:  0.28, rot: h(tileX, tileY, 6) * Math.PI * 2, scl: 0.35 + h(tileX, tileY, 7) * 0.2, idx: Math.floor(h(tileX, tileY, 8) * 4) },
  ];

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
