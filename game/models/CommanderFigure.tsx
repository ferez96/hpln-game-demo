"use client";

import { Commander } from "@/game/types";

const FACTION_COLOR: Record<string, string> = {
  wei: "#C62828",
  shu: "#2E7D32",
  wu: "#1565C0",
};

const ARMOR_DARK: Record<string, string> = {
  wei: "#4A0000",
  shu: "#003300",
  wu: "#002060",
};

interface Props {
  commander: Commander;
  position: [number, number, number];
  index: number;
}

function Horse({ color, dark }: { color: string; dark: string }) {
  return (
    <group>
      {/* Body */}
      <mesh position={[0, 0.13, 0]}>
        <boxGeometry args={[0.28, 0.10, 0.10]} />
        <meshStandardMaterial color="#8B6914" />
      </mesh>
      {/* Neck */}
      <mesh position={[0.14, 0.19, 0]} rotation={[0, 0, -0.5]}>
        <boxGeometry args={[0.06, 0.10, 0.07]} />
        <meshStandardMaterial color="#8B6914" />
      </mesh>
      {/* Head */}
      <mesh position={[0.21, 0.23, 0]}>
        <boxGeometry args={[0.10, 0.06, 0.06]} />
        <meshStandardMaterial color="#7A5C10" />
      </mesh>
      {/* 4 Legs */}
      {([-0.09, 0.09] as number[]).flatMap((x) =>
        ([-0.038, 0.038] as number[]).map((z) => (
          <mesh key={`${x}-${z}`} position={[x, 0.045, z]}>
            <boxGeometry args={[0.04, 0.09, 0.035]} />
            <meshStandardMaterial color="#7A5C10" />
          </mesh>
        ))
      )}
      {/* Saddle */}
      <mesh position={[0, 0.19, 0]}>
        <boxGeometry args={[0.10, 0.025, 0.095]} />
        <meshStandardMaterial color={dark} />
      </mesh>
    </group>
  );
}

function Rider({ color, dark, isDTQ }: { color: string; dark: string; isDTQ: boolean }) {
  const y = isDTQ ? 0.21 : 0;
  return (
    <group position={[0, y, 0]}>
      {/* Body */}
      <mesh position={[0, 0.19, 0]}>
        <cylinderGeometry args={[0.055, 0.065, 0.16, 7]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.31, 0]}>
        <sphereGeometry args={[0.055, 8, 8]} />
        <meshStandardMaterial color="#E8C49A" />
      </mesh>
      {/* Helmet */}
      <mesh position={[0, 0.34, 0]}>
        <cylinderGeometry args={[0.057, 0.062, 0.04, 8]} />
        <meshStandardMaterial color={dark} metalness={0.5} />
      </mesh>
      {/* Helmet top */}
      <mesh position={[0, 0.38, 0]}>
        <coneGeometry args={[0.028, 0.055, 7]} />
        <meshStandardMaterial color={dark} metalness={0.5} />
      </mesh>
      {/* Plume */}
      <mesh position={[0, 0.44, 0]}>
        <cylinderGeometry args={[0.006, 0.014, 0.06, 5]} />
        <meshStandardMaterial color="#FFD600" />
      </mesh>
      {/* Spear */}
      <mesh position={[0.085, 0.26, 0]} rotation={[0, 0, 0.1]}>
        <cylinderGeometry args={[0.005, 0.005, 0.38, 5]} />
        <meshStandardMaterial color="#795548" />
      </mesh>
      <mesh position={[0.097, 0.46, 0]}>
        <coneGeometry args={[0.012, 0.04, 5]} />
        <meshStandardMaterial color="#CFD8DC" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Battle flag for DTQ */}
      {isDTQ && (
        <group position={[-0.085, 0.22, 0]}>
          <mesh>
            <cylinderGeometry args={[0.005, 0.005, 0.36, 5]} />
            <meshStandardMaterial color="#795548" />
          </mesh>
          <mesh position={[0, 0.20, 0.002]}>
            <boxGeometry args={[0.08, 0.07, 0.005]} />
            <meshStandardMaterial color={color} />
          </mesh>
        </group>
      )}
    </group>
  );
}

export function CommanderFigure({ commander, position, index }: Props) {
  const color = FACTION_COLOR[commander.owner];
  const dark = ARMOR_DARK[commander.owner];
  const isDTQ = commander.rank === "dai_tuong_quan";

  const ox = (index % 2) * 0.32 - 0.16;
  const oz = Math.floor(index / 2) * 0.32 - 0.16;

  return (
    <group position={[position[0] + ox, position[1], position[2] + oz]} scale={isDTQ ? 1.15 : 1.0}>
      {isDTQ && <Horse color={color} dark={dark} />}
      <Rider color={color} dark={dark} isDTQ={isDTQ} />
    </group>
  );
}
