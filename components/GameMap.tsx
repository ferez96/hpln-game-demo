"use client";

import { GameState, Owner } from "@/game/types";
import { tileCenter } from "@/game/state";
import { Tile } from "./Tile";
import { Capital } from "@/game/models/Capital";
import { City } from "@/game/models/City";
import { Html } from "@react-three/drei";

interface Props {
  state: GameState;
  selectedTile: string | null;
  activeArmyId: string | null;
  onSelectTile: (tileId: string) => void;
  onSelectArmy: (armyId: string) => void;
}

const ARMY_COLORS: Record<Owner, string> = {
  wei: "#1565C0",
  shu: "#C62828",
  wu: "#D4880A",
};

function ArmyMarker({
  owner,
  label,
  active,
  onClick,
}: {
  owner: Owner;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <group
      position={[0, 0.35, 0]}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
    >
      <mesh castShadow>
        <cylinderGeometry args={[0.16, 0.22, 0.28, 6]} />
        <meshStandardMaterial
          color={ARMY_COLORS[owner]}
          emissive={active ? "#ffffff" : "#000000"}
          emissiveIntensity={active ? 0.25 : 0}
        />
      </mesh>
      <mesh position={[0, 0.25, 0]} castShadow>
        <coneGeometry args={[0.18, 0.32, 6]} />
        <meshStandardMaterial color={ARMY_COLORS[owner]} />
      </mesh>
      <Html position={[0, 0.55, 0]} center distanceFactor={14}>
        <div
          style={{
            background: active ? "#111" : "rgba(255,255,255,0.92)",
            color: active ? "#fff" : "#111",
            border: `1px solid ${ARMY_COLORS[owner]}`,
            borderRadius: 4,
            fontSize: 10,
            fontWeight: 700,
            lineHeight: 1,
            padding: "3px 5px",
            pointerEvents: "none",
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </div>
      </Html>
    </group>
  );
}

export function GameMap({
  state,
  selectedTile,
  activeArmyId,
  onSelectTile,
  onSelectArmy,
}: Props) {
  const armyOffsets = new Map<string, number>();

  return (
    <>
      {state.tiles.map((tile) => {
        return (
          <Tile
            key={tile.id}
            tile={tile}
            selected={selectedTile}
            onSelect={onSelectTile}
          />
        );
      })}
      {Object.values(state.cities)
        .filter((city) => city.isCapital)
        .map((city) => {
          return (
            <Capital key={city.label} position={tileCenter(city.tiles[4])} />
          );
        })}
      {Object.values(state.cities)
        .filter((city) => !city.isCapital)
        .map((city) => {
          return <City key={city.label} position={tileCenter(city.tiles[0])} />;
        })}
      {Object.values(state.armies)
        .filter((army) => army.status !== "DEFEATED")
        .map((army) => {
          const base = tileCenter(army.tileId);
          const count = armyOffsets.get(army.tileId) ?? 0;
          armyOffsets.set(army.tileId, count + 1);
          const offset = (count - 0.5) * 0.28;
          return (
            <group
              key={army.id}
              position={[base[0] + offset, 0, base[2] + offset]}
            >
              <ArmyMarker
                owner={army.kingdom}
                label={army.id.replace("army-", "")}
                active={activeArmyId === army.id}
                onClick={() => onSelectArmy(army.id)}
              />
            </group>
          );
        })}
    </>
  );
}
