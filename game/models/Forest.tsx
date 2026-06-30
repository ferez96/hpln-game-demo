"use client";

import { useGLTF } from "@react-three/drei";

interface Props {
  position: [number, number, number];
  tileX: number;
  tileY: number;
}

function h(x: number, y: number, salt: number) {
  return ((x * 73 + y * 31 + salt * 17) % 100) / 100;
}

const TREE_MODELS = [
  "/models/tree_default.glb",
  "/models/tree_tall.glb",
  "/models/tree_cone.glb",
  "/models/tree_oak.glb",
  "/models/tree_simple.glb",
];

export function Forest({ position, tileX, tileY }: Props) {
  const { scene: t0 } = useGLTF(TREE_MODELS[0]);
  const { scene: t1 } = useGLTF(TREE_MODELS[1]);
  const { scene: t2 } = useGLTF(TREE_MODELS[2]);
  const { scene: t3 } = useGLTF(TREE_MODELS[3]);
  const { scene: t4 } = useGLTF(TREE_MODELS[4]);
  const scenes = [t0, t1, t2, t3, t4];

  const trees = [
    {
      sx: 0.0,
      sz: 0.0,
      scl: 0.44,
      rot: h(tileX, tileY, 0) * Math.PI * 2,
      idx: Math.floor(h(tileX, tileY, 1) * 5),
    },
    {
      sx: -0.26,
      sz: 0.18,
      scl: 0.36,
      rot: h(tileX, tileY, 2) * Math.PI * 2,
      idx: Math.floor(h(tileX, tileY, 3) * 5),
    },
    {
      sx: 0.24,
      sz: -0.2,
      scl: 0.34,
      rot: h(tileX, tileY, 4) * Math.PI * 2,
      idx: Math.floor(h(tileX, tileY, 5) * 5),
    },
    {
      sx: 0.26,
      sz: 0.22,
      scl: 0.3,
      rot: h(tileX, tileY, 6) * Math.PI * 2,
      idx: Math.floor(h(tileX, tileY, 7) * 5),
    },
    {
      sx: -0.22,
      sz: -0.24,
      scl: 0.28,
      rot: h(tileX, tileY, 8) * Math.PI * 2,
      idx: Math.floor(h(tileX, tileY, 9) * 5),
    },
  ];

  return (
    <group position={position}>
      {trees.map((t, i) => (
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

TREE_MODELS.forEach((m) => useGLTF.preload(m));
