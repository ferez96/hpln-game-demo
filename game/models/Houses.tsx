import House from "./House";

export default function Houses() {
  return (
    <>
      <group position={[-0.22, 0, -0.18]} scale={0.55}>
        <House />
      </group>

      <group position={[0.22, 0, -0.18]} scale={0.55}>
        <House />
      </group>

      <group position={[0, 0, 0.22]} scale={0.55}>
        <House />
      </group>
    </>
  );
}
