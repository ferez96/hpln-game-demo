import { Box } from "@react-three/drei";

type Props = {
  width: number;
  height: number;
  wallHeight?: number;
  thickness?: number;
  visibleWalls?: VisibleWalls;
};

type VisibleWalls = {
  top: boolean;
  bottom: boolean;
  left: boolean;
  right: boolean;
};

export function Walls({
  width,
  height,
  wallHeight = 1,
  thickness = 0.15,
  visibleWalls = { top: true, bottom: true, left: true, right: true },
}: Props) {
  return (
    <group>
      {/* Top */}
      {visibleWalls.top &&
        Array.from({ length: width }).map((_, x) => (
          <WallX
            key={`top-${x}`}
            position={[x, wallHeight / 2, -0.5]}
            thickness={thickness}
            wallHeight={wallHeight}
          />
        ))}

      {/* Bottom */}
      {visibleWalls.bottom &&
        Array.from({ length: width }).map((_, x) => (
          <WallX
            key={`bottom-${x}`}
            position={[x, wallHeight / 2, height - 0.5]}
            thickness={thickness}
            wallHeight={wallHeight}
          />
        ))}

      {/* Left */}
      {visibleWalls.left &&
        Array.from({ length: height }).map((_, y) => (
          <WallZ
            key={`left-${y}`}
            position={[-0.5, wallHeight / 2, y]}
            thickness={thickness}
            wallHeight={wallHeight}
          />
        ))}

      {/* Right */}
      {visibleWalls.right &&
        Array.from({ length: height }).map((_, y) => (
          <WallZ
            key={`right-${y}`}
            position={[width - 0.5, wallHeight / 2, y]}
            thickness={thickness}
            wallHeight={wallHeight}
          />
        ))}
    </group>
  );
}

function WallX({
  position,
  wallHeight,
  thickness,
}: {
  position: [number, number, number];
  wallHeight: number;
  thickness: number;
}) {
  return (
    <Box
      args={[1, wallHeight, thickness]}
      position={position}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial color="#BDB6A8" />
    </Box>
  );
}

function WallZ({
  position,
  wallHeight,
  thickness,
}: {
  position: [number, number, number];
  wallHeight: number;
  thickness: number;
}) {
  return (
    <Box
      args={[thickness, wallHeight, 1]}
      position={position}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial color="#BDB6A8" />
    </Box>
  );
}
