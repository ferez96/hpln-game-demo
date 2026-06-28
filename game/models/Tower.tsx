import { Box, Cylinder } from "@react-three/drei";

const COLORS = {
  roof: "#37474F",
  wood: "#5D4037",
  flag: "#C62828",
  wall: "#EEE5D8",
  wallLight: "#F5EEE5",
  stone: "#B8B0A2",
};

export default function Tower() {
  return (
    <group>
      <Box
        args={[0.2, 0.8, 0.2]}
        position={[0, 0.4, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color={COLORS.wall} />
      </Box>
      <Box
        args={[0.34, 0.04, 0.34]}
        position={[0, 0.86, 0]}
        rotation={[0, Math.PI / 4, 0]}
        castShadow
      >
        <meshStandardMaterial color={COLORS.roof} />
      </Box>
      <Box
        args={[0.14, 0.16, 0.14]}
        position={[0, 1.0, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color={COLORS.wall} />
      </Box>
      <Box
        args={[0.24, 0.03, 0.24]}
        position={[0, 1.12, 0]}
        rotation={[0, Math.PI / 4, 0]}
        castShadow
      >
        <meshStandardMaterial color={COLORS.roof} />
      </Box>
      <Cylinder args={[0.008, 0.008, 0.22]} position={[0, 1.28, 0]}>
        <meshStandardMaterial color={COLORS.wood} />
      </Cylinder>
      <Box args={[0.1, 0.06, 0.01]} position={[0.05, 1.36, 0]}>
        <meshStandardMaterial color={COLORS.flag} />
      </Box>
    </group>
  );
}
