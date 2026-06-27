"use client";

import { Box, Cone, Cylinder } from "@react-three/drei";

interface Props {
  position: [number, number, number];
  tileX: number;
  tileY: number;

  // [-1,-1] [-1,0] ... [1,1]
  relativePos?: [number, number];
}

const WALL = "#C9C2B5";
const STONE = "#BDB6A8";
const ROOF = "#37474F";
const WOOD = "#6D4C41";
const FLOOR = "#8D8A7C";
const FLAG = "#C62828";

function Ground() {
  return (
    <Box
      args={[0.98, 0.04, 0.98]}
      position={[0, 0.02, 0]}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial color={FLOOR} />
    </Box>
  );
}

function Tower() {
    return (
      <group>
        {/* Circular fortress base */}
        <Cylinder
          args={[0.34, 0.34, 0.46, 24]}
          position={[0, 0.23, 0]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color={WALL} />
        </Cylinder>
  
        {/* Battlements around tower */}
        <Cylinder
          args={[0.38, 0.38, 0.08, 24]}
          position={[0, 0.46, 0]}
          castShadow
        >
          <meshStandardMaterial color={WALL} />
        </Cylinder>
  
        {/* Tower body */}
        <Box
          args={[0.20, 0.34, 0.20]}
          position={[0, 0.66, 0]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color="#EEE5D8" />
        </Box>
  
        {/* Roof */}
        <Box
          args={[0.34, 0.04, 0.34]}
          position={[0, 0.86, 0]}
          rotation={[0, Math.PI / 4, 0]}
          castShadow
        >
          <meshStandardMaterial color={ROOF} />
        </Box>
  
        {/* Upper room */}
        <Box
          args={[0.14, 0.16, 0.14]}
          position={[0, 1.00, 0]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color="#EEE5D8" />
        </Box>
  
        {/* Roof */}
        <Box
          args={[0.24, 0.03, 0.24]}
          position={[0, 1.12, 0]}
          rotation={[0, Math.PI / 4, 0]}
          castShadow
        >
          <meshStandardMaterial color={ROOF} />
        </Box>
  
        {/* Flag */}
        <Cylinder
          args={[0.008, 0.008, 0.22]}
          position={[0, 1.28, 0]}
        >
          <meshStandardMaterial color={WOOD} />
        </Cylinder>
  
        <Box
          args={[0.10, 0.06, 0.01]}
          position={[0.05, 1.36, 0]}
        >
          <meshStandardMaterial color={FLAG} />
        </Box>
      </group>
    );
  }

  function WallHorizontal() {
  // Raise the wall's height: y-positions and wall height increased
  const baseHeight = 0.08;
  const wallHeight = 0.40;
  const battlementY = baseHeight + wallHeight + 0.06;
  return (
    <group>
      {/* Base */}
      <Box
        args={[0.96, baseHeight, 0.22]}
        position={[0, baseHeight / 2, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#B0A89C" />
      </Box>

      {/* Wall */}
      <Box
        args={[0.96, wallHeight, 0.16]}
        position={[0, baseHeight + wallHeight / 2, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color={WALL} />
      </Box>

      {/* Battlements */}
      {[-0.36, -0.12, 0.12, 0.36].map((x) => (
        <Box
          key={x}
          args={[0.12, 0.12, 0.18]}
          position={[x, battlementY, 0]}
          castShadow
        >
          <meshStandardMaterial color={WALL} />
        </Box>
      ))}
    </group>
  );
}

function WallVertical() {
  // Raise the wall's height: y-positions and wall height increased
  const baseHeight = 0.08;
  const wallHeight = 0.40;
  const battlementY = baseHeight + wallHeight + 0.06;
  return (
    <group>
      {/* Base */}
      <Box
        args={[0.22, baseHeight, 0.96]}
        position={[0, baseHeight / 2, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#B0A89C" />
      </Box>

      {/* Wall */}
      <Box
        args={[0.16, wallHeight, 0.96]}
        position={[0, baseHeight + wallHeight / 2, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color={WALL} />
      </Box>

      {/* Battlements */}
      {[-0.36, -0.12, 0.12, 0.36].map((z) => (
        <Box
          key={z}
          args={[0.18, 0.12, 0.12]}
          position={[0, battlementY, z]}
          castShadow
        >
          <meshStandardMaterial color={WALL} />
        </Box>
      ))}
    </group>
  );
}

function Gate() {
  // Adjust gate wall height to match raised wall
  const wallYAdj = 0.24;
  return (
    <>
      <WallHorizontal />
      <Box
        args={[0.32, 0.18, 0.22]}
        position={[0, wallYAdj, 0]}
        castShadow
      >
        <meshStandardMaterial color={WOOD} />
      </Box>
    </>
  );
}

function Keep() {
  return (
    <group>
      {/* Stone base */}
      <Box
        args={[0.82, 0.12, 0.82]}
        position={[0, 0.06, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#B8B0A2" />
      </Box>

      {/* Main building */}
      <Box
        args={[0.6, 0.32, 0.6]}
        position={[0, 0.28, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#E8DFD2" />
      </Box>

      {/* Upper floor */}
      <Box
        args={[0.42, 0.22, 0.42]}
        position={[0, 0.56, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#F5EEE5" />
      </Box>

      {/* Lower roof */}
      <Cone
        args={[0.5, 0.16, 4]}
        position={[0, 0.5, 0]}
        rotation={[0, Math.PI / 4, 0]}
        castShadow
      >
        <meshStandardMaterial color="#3B3F4B" />
      </Cone>

      {/* Upper roof */}
      <Cone
        args={[0.34, 0.16, 4]}
        position={[0, 0.73, 0]}
        rotation={[0, Math.PI / 4, 0]}
        castShadow
      >
        <meshStandardMaterial color="#3B3F4B" />
      </Cone>

      {/* Entrance */}
      <Box args={[0.12, 0.18, 0.04]} position={[0, 0.18, 0.32]}>
        <meshStandardMaterial color="#5D4037" />
      </Box>

      {/* Columns */}
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
          <meshStandardMaterial color="#8D6E63" />
        </Cylinder>
      ))}

      {/* Flag pole */}
      <Cylinder args={[0.01, 0.01, 0.28]} position={[0, 0.98, 0]}>
        <meshStandardMaterial color="#5D4037" />
      </Cylinder>

      {/* Flag */}
      <Box args={[0.14, 0.08, 0.01]} position={[0.08, 1.07, 0]}>
        <meshStandardMaterial color="#C62828" />
      </Box>
    </group>
  );
}

export function Capital({ position, relativePos = [0, 0] }: Props) {
  const [dx, dz] = relativePos;

  return (
    <group position={position}>
      {/* <Ground /> */}

      {/* Center */}
      {dx === 0 && dz === 0 && <Keep />}

      {/* Corners */}
      {dx === -1 && dz === -1 && <Tower />}
      {dx === 1 && dz === -1 && <Tower />}
      {dx === -1 && dz === 1 && <Tower />}
      {dx === 1 && dz === 1 && <Tower />}

      {/* Top */}
      {dx === 0 && dz === -1 && <WallHorizontal />}

      {/* Bottom */}
      {dx === 0 && dz === 1 && <Gate />}

      {/* Left */}
      {dx === -1 && dz === 0 && <WallVertical />}

      {/* Right */}
      {dx === 1 && dz === 0 && <WallVertical />}
    </group>
  );
}