"use client";

import { Box, Cone, Cylinder } from "@react-three/drei";

const COLORS = {
  roof: "#6D4C41",
  roofDark: "#5D4037",
  wall: "#F2E8DA",
  stone: "#B8B0A2",
  wood: "#6D4C41",
  window: "#90CAF9",
};

export default function House() {
  return (
    <group>
      {/* Stone foundation */}
      <Box
        args={[0.72, 0.08, 0.72]}
        position={[0, 0.04, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color={COLORS.stone} />
      </Box>

      {/* Main house */}
      <Box
        args={[0.56, 0.34, 0.56]}
        position={[0, 0.25, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color={COLORS.wall} />
      </Box>

      {/* Roof */}
      <Cone
        args={[0.5, 0.24, 4]}
        position={[0, 0.54, 0]}
        rotation={[0, Math.PI / 4, 0]}
        castShadow
      >
        <meshStandardMaterial color={COLORS.roof} />
      </Cone>

      {/* Roof cap */}
      <Cone
        args={[0.42, 0.08, 4]}
        position={[0, 0.66, 0]}
        rotation={[0, Math.PI / 4, 0]}
        castShadow
      >
        <meshStandardMaterial color={COLORS.roofDark} />
      </Cone>

      {/* Door */}
      <Box args={[0.12, 0.18, 0.04]} position={[0, 0.14, 0.3]}>
        <meshStandardMaterial color={COLORS.wood} />
      </Box>

      {/* Windows */}
      <Box args={[0.08, 0.08, 0.02]} position={[-0.16, 0.28, 0.29]}>
        <meshStandardMaterial color={COLORS.window} />
      </Box>

      <Box args={[0.08, 0.08, 0.02]} position={[0.16, 0.28, 0.29]}>
        <meshStandardMaterial color={COLORS.window} />
      </Box>

      {/* Chimney */}
      <Box args={[0.08, 0.22, 0.08]} position={[0.18, 0.67, -0.05]} castShadow>
        <meshStandardMaterial color={COLORS.stone} />
      </Box>

      {/* Timber frame */}
      <Box args={[0.03, 0.34, 0.03]} position={[-0.22, 0.25, 0.29]}>
        <meshStandardMaterial color={COLORS.wood} />
      </Box>

      <Box args={[0.03, 0.34, 0.03]} position={[0.22, 0.25, 0.29]}>
        <meshStandardMaterial color={COLORS.wood} />
      </Box>

      <Box args={[0.46, 0.03, 0.03]} position={[0, 0.38, 0.29]}>
        <meshStandardMaterial color={COLORS.wood} />
      </Box>

      {/* Porch posts */}
      <Cylinder args={[0.015, 0.015, 0.18]} position={[-0.08, 0.17, 0.33]}>
        <meshStandardMaterial color={COLORS.wood} />
      </Cylinder>

      <Cylinder args={[0.015, 0.015, 0.18]} position={[0.08, 0.17, 0.33]}>
        <meshStandardMaterial color={COLORS.wood} />
      </Cylinder>

      {/* Small porch roof */}
      <Box
        args={[0.26, 0.03, 0.16]}
        position={[0, 0.28, 0.36]}
        rotation={[0.15, 0, 0]}
      >
        <meshStandardMaterial color={COLORS.roofDark} />
      </Box>
    </group>
  );
}
