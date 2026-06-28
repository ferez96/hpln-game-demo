"use client";

import { Box, Cone, Cylinder } from "@react-three/drei";
import { Walls } from "./Walls";
import House from "./House";
import Houses from "./Houses";
import Tower from "./Tower";

interface Props {
  position: [number, number, number];
}

const COLORS = {
  roof: "#37474F",
  wood: "#5D4037",
  flag: "#C62828",
  wall: "#EEE5D8",
  wallLight: "#F5EEE5",
  stone: "#B8B0A2",
};

function Keep() {
  return (
    <group>
      <Box
        args={[0.82, 0.12, 0.82]}
        position={[0, 0.06, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color={COLORS.stone} />
      </Box>
      <Box
        args={[0.6, 0.32, 0.6]}
        position={[0, 0.28, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color={COLORS.wall} />
      </Box>
      <Box
        args={[0.42, 0.22, 0.42]}
        position={[0, 0.56, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color={COLORS.wallLight} />
      </Box>
      {[0.5, 0.73].map((y, i) => (
        <Cone
          key={i}
          args={[i === 0 ? 0.5 : 0.34, 0.16, 4]}
          position={[0, y, 0]}
          rotation={[0, Math.PI / 4, 0]}
          castShadow
        >
          <meshStandardMaterial color={COLORS.roof} />
        </Cone>
      ))}
      <Box args={[0.12, 0.18, 0.04]} position={[0, 0.18, 0.32]}>
        <meshStandardMaterial color={COLORS.wood} />
      </Box>
      {[
        [-0.2, 0.18, 0.22],
        [0.2, 0.18, 0.22],
        [-0.2, 0.18, -0.22],
        [0.2, 0.18, -0.22],
      ].map((p, i) => (
        <Cylinder
          key={i}
          args={[0.025, 0.025, 0.28]}
          position={p as [number, number, number]}
        >
          <meshStandardMaterial color={COLORS.wood} />
        </Cylinder>
      ))}
      <Cylinder args={[0.01, 0.01, 0.28]} position={[0, 0.98, 0]}>
        <meshStandardMaterial color={COLORS.wood} />
      </Cylinder>
      <Box args={[0.14, 0.08, 0.01]} position={[0.08, 1.07, 0]}>
        <meshStandardMaterial color={COLORS.flag} />
      </Box>
    </group>
  );
}

const capitalLayout = [
  { x: -1, z: -1, type: "tower" },
  { x: 0, z: -1, type: null },
  { x: 1, z: -1, type: "tower" },
  { x: -1, z: 0, type: null },
  { x: 0, z: 0, type: "keep" },
  { x: 1, z: 0, type: null },
  { x: -1, z: 1, type: "tower" },
  { x: 0, z: 1, type: null },
  { x: 1, z: 1, type: "tower" },
  { x: -1, z: 0, type: "house" },
  { x: 1, z: 0, type: "house" },
  { x: 0, z: -1, type: "house" },
  { x: 0, z: 1, type: "house" },
  { x: -1, z: -1, type: null },
  { x: 1, z: -1, type: null },
  { x: 1, z: 1, type: null },
  { x: -1, z: 1, type: null },
];

function isCornerWall(x: number, z: number, type: string | null) {
  return (
    type === null &&
    ((x === -1 && z === -1) ||
      (x === 1 && z === -1) ||
      (x === 1 && z === 1) ||
      (x === -1 && z === 1))
  );
}

function getVisibleWalls(x: number, z: number, type: string | null) {
  if (isCornerWall(x, z, type)) {
    if (x === -1 && z === -1)
      return { top: true, left: true, bottom: false, right: false };
    if (x === 1 && z === -1)
      return { top: true, right: true, bottom: false, left: false };
    if (x === 1 && z === 1)
      return { bottom: true, right: true, top: false, left: false };
    if (x === -1 && z === 1)
      return { bottom: true, left: true, top: false, right: false };
  }
  return {
    top: z === -1 && type === null,
    bottom: z === 1 && type === null,
    left: x === -1 && type === null,
    right: x === 1 && type === null,
  };
}

function CapitalCell({
  type,
  x,
  z,
}: {
  type: string | null;
  x: number;
  z: number;
}) {
  const visibleWalls = getVisibleWalls(x, z, type);

  return (
    <group position={[x, 0, z]}>
      {type === "tower" && (
        <>
          <Tower />

          <group position={[-0.22, 0, 0.22]} scale={0.35}>
            <House />
          </group>

          <group position={[0.22, 0, 0.22]} scale={0.35}>
            <House />
          </group>
        </>
      )}
      {type === "keep" && <Keep />}
      {type === "house" && <Houses />}
      {type === null && (
        <Walls
          width={1}
          height={1}
          wallHeight={0.4}
          visibleWalls={visibleWalls}
        />
      )}
    </group>
  );
}

export function Capital({ position }: Props) {
  return (
    <group position={position}>
      {capitalLayout.map(({ x, z, type }, i) => (
        <CapitalCell
          key={`${x}-${z}-${type === null ? "wall" : type}-${i}`}
          x={x}
          z={z}
          type={type}
        />
      ))}
    </group>
  );
}
