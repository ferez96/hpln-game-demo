import { Box, Cylinder, Plane } from "@react-three/drei";

type Props = {
  tileX: number;
  tileY: number;
  position?: [number, number, number];
};

export function River({ tileX, tileY, position = [0, 0.1, 0] }: Props) {
  return (
    <group position={position}>
      {/* Water */}
      <Plane
        args={[0.72, 0.72]}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.06, 0]}
      >
        <meshPhysicalMaterial
          color="#4fc3f7"
          transparent
          opacity={0.85}
          transmission={0.6}
          roughness={0.15}
          thickness={0.2}
        />
      </Plane>

      {/* Small rock */}
      <mesh position={[-0.22, 0.07, 0.18]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshStandardMaterial color="#8a8a8a" />
      </mesh>

      {/* Large rock */}
      <mesh position={[0.25, 0.07, -0.12]} scale={[1.2, 0.8, 1]}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshStandardMaterial color="#6f6f6f" />
      </mesh>

      {/* Reeds */}
      {[
        [-0.32, -0.3],
        [-0.28, -0.26],
        [0.3, 0.28],
        [0.34, 0.24],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.11, z]}>
          <cylinderGeometry args={[0.008, 0.008, 0.14, 6]} />
          <meshStandardMaterial color="#3d8b37" />
        </mesh>
      ))}
    </group>
  );
}
