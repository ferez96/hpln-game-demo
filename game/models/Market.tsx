"use client";

import { Box, Cylinder } from "@react-three/drei";

const COLORS = {
  wood: "#6D4C41",
  woodDark: "#5D4037",
  stone: "#B8B0A2",
  cloth: "#1976D2",
  cloth2: "#C62828",
  sack: "#C9B28A",
};

function Barrel({ position }: { position: [number, number, number] }) {
  return (
    <Cylinder args={[0.045, 0.045, 0.08]} position={position} castShadow>
      <meshStandardMaterial color={COLORS.woodDark} />
    </Cylinder>
  );
}

function Sack({ position }: { position: [number, number, number] }) {
  return (
    <Box args={[0.06, 0.08, 0.06]} position={position} castShadow>
      <meshStandardMaterial color={COLORS.sack} />
    </Box>
  );
}

export default function Market() {
  return (
    <group>
      {/* Stone plaza */}
      <Box args={[0.82, 0.04, 0.82]} position={[0, 0.02, 0]} receiveShadow>
        <meshStandardMaterial color={COLORS.stone} />
      </Box>

      {/* Main stall */}
      <Box args={[0.46, 0.08, 0.28]} position={[0, 0.08, 0]} castShadow>
        <meshStandardMaterial color={COLORS.wood} />
      </Box>

      {/* Posts */}
      {[
        [-0.18, 0.22, -0.1],
        [0.18, 0.22, -0.1],
        [-0.18, 0.22, 0.1],
        [0.18, 0.22, 0.1],
      ].map((p, i) => (
        <Cylinder
          key={i}
          args={[0.015, 0.015, 0.28]}
          position={p as [number, number, number]}
        >
          <meshStandardMaterial color={COLORS.wood} />
        </Cylinder>
      ))}

      {/* Roof */}
      <Box
        args={[0.56, 0.03, 0.38]}
        position={[0, 0.37, 0]}
        rotation={[0.08, 0, 0]}
        castShadow
      >
        <meshStandardMaterial color={COLORS.cloth} />
      </Box>

      {/* Side stall */}
      <Box args={[0.18, 0.06, 0.18]} position={[-0.28, 0.06, 0.28]}>
        <meshStandardMaterial color={COLORS.wood} />
      </Box>

      <Box args={[0.22, 0.025, 0.22]} position={[-0.28, 0.22, 0.28]}>
        <meshStandardMaterial color={COLORS.cloth2} />
      </Box>

      {/* Barrels */}
      <Barrel position={[0.3, 0.04, -0.24]} />
      <Barrel position={[0.22, 0.04, -0.28]} />
      <Barrel position={[-0.3, 0.04, -0.22]} />

      {/* Sacks */}
      <Sack position={[0.3, 0.04, 0.22]} />
      <Sack position={[0.22, 0.04, 0.3]} />

      {/* Crates */}
      <Box args={[0.08, 0.06, 0.08]} position={[-0.26, 0.03, -0.28]}>
        <meshStandardMaterial color={COLORS.woodDark} />
      </Box>

      <Box args={[0.08, 0.06, 0.08]} position={[-0.18, 0.03, -0.24]}>
        <meshStandardMaterial color={COLORS.woodDark} />
      </Box>

      {/* Sign */}
      <Cylinder
        args={[0.01, 0.01, 0.16]}
        rotation={[0, 0, Math.PI / 2]}
        position={[0, 0.42, -0.2]}
      >
        <meshStandardMaterial color={COLORS.wood} />
      </Cylinder>

      <Box args={[0.12, 0.06, 0.01]} position={[0, 0.42, -0.15]}>
        <meshStandardMaterial color="#F5E6A3" />
      </Box>
    </group>
  );
}
