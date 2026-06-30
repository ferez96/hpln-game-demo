"use client";

import { Box, Cone, Cylinder } from "@react-three/drei";
import { Walls } from "./Walls";
import Houses from "./Houses";
import House from "./House";
import Tower from "./Tower";
import Market from "./Market";

interface Props {
  position: [number, number, number];
}

const COLORS = {
  roof: "#8D6E63",
  wall: "#E8DFD2",
  wood: "#6D4C41",
  stone: "#BDB6A8",
  cloth: "#1976D2",
};

const layout = [
  { x: 0, z: 0, type: "tower" },
  { x: 1, z: 0, type: "house" },
  { x: 0, z: 1, type: "market" },
  { x: 1, z: 1, type: "tower" },
];

function Building({ type }: { type: string }) {
  switch (type) {
    case "tower":
      return (
        <>
          <Tower />

          <group position={[-0.22, 0, 0.22]} scale={0.35}>
            <House />
          </group>

          <group position={[0.22, 0, 0.22]} scale={0.35}>
            <House />
          </group>
        </>
      );
    case "house":
      return <Houses />;
    case "market":
      return <Market />;
    default:
      return null;
  }
}

export function City({ position }: Props) {
  return (
    <group position={position}>
      {layout.map(({ x, z, type }) => (
        <group key={`${x}-${z}`} position={[x, 0, z]}>
          <Building type={type} />

          <Walls
            width={1}
            height={1}
            wallHeight={0.35}
            visibleWalls={{
              top: z === 0,
              bottom: z === 1,
              left: x === 0,
              right: x === 1,
            }}
          />
        </group>
      ))}
    </group>
  );
}
