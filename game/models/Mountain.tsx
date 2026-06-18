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

const TALL_ROCKS = [
  "/models/rock_tallA.glb",
  "/models/rock_tallB.glb",
  "/models/rock_tallC.glb",
  "/models/rock_tallD.glb",
  "/models/rock_tallE.glb",
];

const BASE_ROCKS = [
  "/models/rock_largeA.glb",
  "/models/rock_largeB.glb",
  "/models/rock_largeC.glb",
];

export function Mountain({ position, tileX, tileY }: Props) {
  const { scene: t0 } = useGLTF(TALL_ROCKS[0]);
  const { scene: t1 } = useGLTF(TALL_ROCKS[1]);
  const { scene: t2 } = useGLTF(TALL_ROCKS[2]);
  const { scene: t3 } = useGLTF(TALL_ROCKS[3]);
  const { scene: t4 } = useGLTF(TALL_ROCKS[4]);
  const { scene: b0 } = useGLTF(BASE_ROCKS[0]);
  const { scene: b1 } = useGLTF(BASE_ROCKS[1]);
  const { scene: b2 } = useGLTF(BASE_ROCKS[2]);

  const tall = [t0, t1, t2, t3, t4];
  const base = [b0, b1, b2];

  const rocks = [
    // dominant tall peak in center
    { sx:  0.00, sz:  0.00, scl: 0.70, rot: h(tileX, tileY, 0) * Math.PI * 2, scenes: tall, idx: Math.floor(h(tileX, tileY, 1) * 5) },
    // secondary tall rock left-back
    { sx: -0.22, sz: -0.16, scl: 0.55, rot: h(tileX, tileY, 2) * Math.PI * 2, scenes: tall, idx: Math.floor(h(tileX, tileY, 3) * 5) },
    // secondary tall rock right-back
    { sx:  0.20, sz: -0.18, scl: 0.50, rot: h(tileX, tileY, 4) * Math.PI * 2, scenes: tall, idx: Math.floor(h(tileX, tileY, 5) * 5) },
    // base boulder front-left
    { sx: -0.24, sz:  0.20, scl: 0.40, rot: h(tileX, tileY, 6) * Math.PI * 2, scenes: base, idx: Math.floor(h(tileX, tileY, 7) * 3) },
    // base boulder front-right
    { sx:  0.22, sz:  0.18, scl: 0.38, rot: h(tileX, tileY, 8) * Math.PI * 2, scenes: base, idx: Math.floor(h(tileX, tileY, 9) * 3) },
  ];

  return (
    <group position={position}>
      {rocks.map((r, i) => (
        <primitive
          key={i}
          object={r.scenes[r.idx].clone()}
          scale={r.scl}
          position={[r.sx, 0, r.sz]}
          rotation={[0, r.rot, 0]}
        />
      ))}
    </group>
  );
}

[...TALL_ROCKS, ...BASE_ROCKS].forEach((m) => useGLTF.preload(m));
