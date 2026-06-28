import { Box } from "@react-three/drei";
import { Wall } from "./Wall";

type VisibleWalls = {
  top?: boolean;
  bottom?: boolean;
  left?: boolean;
  right?: boolean;
};

type Props = {
  width: number;
  height: number;
  wallHeight?: number;
  thickness?: number;
  visibleWalls?: VisibleWalls;
};

const WALL_COLOR = "#BDB6A8";

export function Walls({
  width,
  height,
  wallHeight = 1,
  thickness = 0.15,
  visibleWalls = {
    top: true,
    bottom: true,
    left: true,
    right: true,
  },
}: Props) {
  return (
    <group>
      {visibleWalls.top &&
        [...Array(width)].map((_, x) => (
          <Wall
            key={`top-${x}`}

            axis="x"
            position={[x, wallHeight / 2, -0.5]}
            wallHeight={wallHeight}
            thickness={thickness}
          />
        ))}

      {visibleWalls.bottom &&
        [...Array(width)].map((_, x) => (
          <Wall
            key={`bottom-${x}`}
            axis="x"
            position={[x, wallHeight / 2, height - 0.5]}
            wallHeight={wallHeight}
            thickness={thickness}
          />
        ))}

      {visibleWalls.left &&
        [...Array(height)].map((_, z) => (
          <Wall
            key={`left-${z}`}
            axis="z"
            position={[-0.5, wallHeight / 2, z]}
            wallHeight={wallHeight}
            thickness={thickness}
          />
        ))}

      {visibleWalls.right &&
        [...Array(height)].map((_, z) => (
          <Wall
            key={`right-${z}`}
            axis="z"
            position={[width - 0.5, wallHeight / 2, z]}
            wallHeight={wallHeight}
            thickness={thickness}
          />
        ))}
    </group>
  );
}
