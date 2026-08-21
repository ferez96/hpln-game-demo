import { rowLetters } from "@/game/coordinates";
import { MapSize } from "@/game/types";
import { Billboard, Grid, Text } from "@react-three/drei";

const LABEL_GOLD = "#e8c040";
const LABEL_OUTLINE = "#12100c";

function AxisLabel({
  position,
  children,
}: {
  position: [number, number, number];
  children: string;
}) {
  return (
    <Billboard position={position}>
      <Text
        fontSize={0.32}
        color={LABEL_GOLD}
        outlineWidth={0.02}
        outlineColor={LABEL_OUTLINE}
        anchorX="center"
        anchorY="middle"
      >
        {children}
      </Text>
    </Billboard>
  );
}

/** Nhãn theo đúng bản đồ in: cột là số 1–N, hàng là chữ A–Z. */
function GridLabels({ size }: { size: MapSize }) {
  const letters = rowLetters(size.rows);
  return (
    <group>
      {Array.from({ length: size.cols }).map((_, x) => (
        <AxisLabel key={`col-${x}`} position={[x + 0.5, 0.4, -0.5]}>
          {String(x + 1)}
        </AxisLabel>
      ))}
      {Array.from({ length: size.rows }).map((_, y) => (
        <AxisLabel key={`row-${y}`} position={[-0.5, 0.4, y + 0.5]}>
          {letters[y]}
        </AxisLabel>
      ))}
    </group>
  );
}

export default function GameGrid({ size }: { size: MapSize }) {
  return (
    <>
      <Grid
        args={[size.cols, size.rows]}
        cellSize={1}
        sectionSize={1}
        position={[size.cols / 2, 0, size.rows / 2]}
      />
      <GridLabels size={size} />
    </>
  );
}
