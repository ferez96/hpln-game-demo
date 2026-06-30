import { Box } from "@react-three/drei";

const STONE = "#C9C2B5";
const STONE_DARK = "#A79F93";

type Props = {
  axis: "x" | "z";
  position: [number, number, number];
  wallHeight: number;
  thickness: number;
};

export function Wall({ axis, position, wallHeight, thickness }: Props) {
  const horizontal = axis === "x";

  return (
    <group position={position}>
      {/* Foundation */}
      <Box
        args={
          horizontal
            ? [1.08, 0.08, thickness + 0.04]
            : [thickness + 0.04, 0.08, 1.08]
        }
        position={[0, 0.04 - wallHeight / 2, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color={STONE_DARK} />
      </Box>

      {/* Main wall */}
      <Box
        args={
          horizontal ? [1, wallHeight, thickness] : [thickness, wallHeight, 1]
        }
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color={STONE} />
      </Box>

      {/* End pillars */}
      {[-0.5, 0.5].map((offset) => (
        <Box
          key={offset}
          args={
            horizontal
              ? [0.14, wallHeight + 0.18, thickness + 0.05]
              : [thickness + 0.05, wallHeight + 0.18, 0.14]
          }
          position={horizontal ? [offset, 0.09, 0] : [0, 0.09, offset]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color={STONE_DARK} />
        </Box>
      ))}

      {/* Battlements */}
      {[-0.32, 0, 0.32].map((offset) => (
        <Box
          key={offset}
          args={
            horizontal
              ? [0.18, 0.12, thickness + 0.03]
              : [thickness + 0.03, 0.12, 0.18]
          }
          position={
            horizontal
              ? [offset, wallHeight / 2 + 0.06, 0]
              : [0, wallHeight / 2 + 0.06, offset]
          }
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color={STONE_DARK} />
        </Box>
      ))}
    </group>
  );
}
