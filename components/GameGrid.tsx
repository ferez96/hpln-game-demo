import { MAP_COLS, MAP_ROWS } from "@/game/state";
import { Billboard, Grid, Text } from "@react-three/drei";

const LABEL_GOLD = "#e8c040";
const LABEL_OUTLINE = "#12100c";

function GridLabels({ rows, cols }: { rows: number; cols: number }) {
  return (
    <group>
      {/* Column letters */}
      {Array.from({ length: cols })
        .map((_, x) => String.fromCharCode(65 + x))
        .map((label, x) => (
          <Billboard key={`col-${x}`} position={[x + 0.5, 0.4, -0.5]}>
            <Text
              fontSize={0.32}
              color={LABEL_GOLD}
              outlineWidth={0.02}
              outlineColor={LABEL_OUTLINE}
              anchorX="center"
              anchorY="middle"
            >
              {label}
            </Text>
          </Billboard>
        ))}

      {/* Row numbers */}
      {Array.from({ length: rows }).map((_, y) => (
        <Billboard key={`row-${y}`} position={[-0.5, 0.4, y + 0.5]}>
          <Text
            fontSize={0.32}
            color={LABEL_GOLD}
            outlineWidth={0.02}
            outlineColor={LABEL_OUTLINE}
            anchorX="center"
            anchorY="middle"
          >
            {y + 1}
          </Text>
        </Billboard>
      ))}
    </group>
  );
}

export default function GameGrid() {
  return (
    <>
      <Grid
        args={[MAP_COLS, MAP_ROWS]}
        cellSize={1}
        sectionSize={1}
        position={[7, 0, 7]}
      />
      <GridLabels rows={MAP_ROWS} cols={MAP_COLS} />
    </>
  );
}
