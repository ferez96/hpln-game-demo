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

// Now the rocks types are A through F for both tall and base rocks
const TALL_ROCKS = [
  "/models/rock_tallA.glb",
  "/models/rock_tallB.glb",
  "/models/rock_tallC.glb",
  "/models/rock_tallD.glb",
  "/models/rock_tallE.glb",
  "/models/rock_tallF.glb",
];

const BASE_ROCKS = [
  "/models/rock_largeA.glb",
  "/models/rock_largeB.glb",
  "/models/rock_largeC.glb",
  "/models/rock_largeD.glb",
  "/models/rock_largeE.glb",
  "/models/rock_largeF.glb",
];

export function Mountain({ position, tileX, tileY }: Props) {
  const tallScenes = [
    useGLTF(TALL_ROCKS[0]).scene,
    useGLTF(TALL_ROCKS[1]).scene,
    useGLTF(TALL_ROCKS[2]).scene,
    useGLTF(TALL_ROCKS[3]).scene,
    useGLTF(TALL_ROCKS[4]).scene,
    useGLTF(TALL_ROCKS[5]).scene,
  ];
  const baseScenes = [
    useGLTF(BASE_ROCKS[0]).scene,
    useGLTF(BASE_ROCKS[1]).scene,
    useGLTF(BASE_ROCKS[2]).scene,
    useGLTF(BASE_ROCKS[3]).scene,
    useGLTF(BASE_ROCKS[4]).scene,
    useGLTF(BASE_ROCKS[5]).scene,
  ];

  const rocks = [
    // dominant tall peak in center
    {
      sx: 0.0,
      sz: 0.0,
      scl: 0.7,
      rot: h(tileX, tileY, 0) * Math.PI * 2,
      scenes: tallScenes,
      idx: Math.floor(h(tileX, tileY, 1) * 6),
    },
    // secondary tall rock left-back
    {
      sx: -0.22,
      sz: -0.16,
      scl: 0.55,
      rot: h(tileX, tileY, 2) * Math.PI * 2,
      scenes: tallScenes,
      idx: Math.floor(h(tileX, tileY, 3) * 6),
    },
    // secondary tall rock right-back
    {
      sx: 0.2,
      sz: -0.18,
      scl: 0.5,
      rot: h(tileX, tileY, 4) * Math.PI * 2,
      scenes: tallScenes,
      idx: Math.floor(h(tileX, tileY, 5) * 6),
    },
    // base boulder front-left
    {
      sx: -0.24,
      sz: 0.2,
      scl: 0.4,
      rot: h(tileX, tileY, 6) * Math.PI * 2,
      scenes: baseScenes,
      idx: Math.floor(h(tileX, tileY, 7) * 6),
    },
    // base boulder front-right
    {
      sx: 0.22,
      sz: 0.18,
      scl: 0.38,
      rot: h(tileX, tileY, 8) * Math.PI * 2,
      scenes: baseScenes,
      idx: Math.floor(h(tileX, tileY, 9) * 6),
    },
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

// Preload all tall and base rock GLBs
[...TALL_ROCKS, ...BASE_ROCKS].forEach((m) => useGLTF.preload(m));
