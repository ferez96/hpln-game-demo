import { Text } from "@react-three/drei";

export function GridLabels({ rows, cols }: { rows: number; cols: number }) {
  return (
    <group>
      {/* Column numbers */}
      {Array.from({ length: cols })
        .map((_, x) => String.fromCharCode(65 + x))
        .map((label, x) => (
          <Text
            key={`col-${x}`}
            position={[x + 0.5, 0.02, -0.5]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.3}
            color="black"
            anchorX="center"
            anchorY="middle"
          >
            {label}
          </Text>
        ))}

      {/* Row numbers */}
      {Array.from({ length: rows }).map((_, y) => (
        <Text
          key={`row-${y}`}
          position={[-0.5, 0.02, y + 0.5]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.3}
          color="black"
          anchorX="center"
          anchorY="middle"
        >
          {y + 1}
        </Text>
      ))}
    </group>
  );
}
