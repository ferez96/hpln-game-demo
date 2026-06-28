"use client";

import { useState } from "react";
import { Html } from "@react-three/drei";
import { TileData } from "@/game/types";
import { Plains } from "@/game/models/Plains";
import { Edges } from "@react-three/drei";
import { Forest } from "@/game/models/Forest";
import { Mountain } from "@/game/models/Mountain";

interface Props {
  tile: TileData;
  selected: string | null;
  onSelect: (id: string) => void;
}

const OWNER_STYLE = {
  neutral: {
    bg: "#F5F5F5",
    border: "#CCCCCC",
  },
  wei: {
    bg: "#90CAF9",
    border: "#5B9BD5",
  },
  shu: {
    bg: "#EF9A9A",
    border: "#C0392B",
  },
  wu: {
    bg: "#FFD54F",
    border: "#D4880A",
  },
};

function tileColor(tile: TileData, isSelected: boolean, isHovered: boolean) {
  if (isHovered) return "#FFF176";
  if (tile.owner) return OWNER_STYLE[tile.owner].bg;
  return OWNER_STYLE["neutral"].bg;
}

function borderColor(tile: TileData, isSelected: boolean, isHovered: boolean) {
  if (isSelected) return "#000";
  if (isHovered) return "#FFF176";
  if (tile.owner) return OWNER_STYLE[tile.owner].border;
  return OWNER_STYLE["neutral"].border;
}

export function Tile({ tile, selected, onSelect }: Props) {
  const [hovered, setHovered] = useState(false);
  const id = `${tile.x}-${tile.y}`;
  const isSelected = selected === id;
  const color = tileColor(tile, isSelected, hovered);
  const border = borderColor(tile, isSelected, hovered);

  return (
    <group position={[tile.x + 0.5, 0, tile.y + 0.5]}>
      <mesh
        castShadow
        receiveShadow
        position={[0, 0.05, 0]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => onSelect(id)}
      >
        <boxGeometry args={[0.97, 0.1, 0.97]} />
        <meshStandardMaterial color={color} />

        <Edges color={border} lineWidth={2} threshold={15} />
      </mesh>

      {isSelected && (
        <Html position={[0, 1.5, 0]} center distanceFactor={12}>
          <pre
            style={{
              background: "#222",
              color: "#0f0",
              padding: 10,
              borderRadius: 6,
              maxWidth: 320,
              fontSize: 11,
              pointerEvents: "none",
            }}
          >
            {JSON.stringify(
              {
                tile,
              },
              null,
              2,
            )}
          </pre>
        </Html>
      )}

      {tile.terrain === "plains" && (
        <Plains position={[0, 0.1, 0]} tileX={tile.x} tileY={tile.y} />
      )}
      {tile.terrain === "forest" && (
        <Forest position={[0, 0.1, 0]} tileX={tile.x} tileY={tile.y} />
      )}
      {tile.terrain === "mountain" && (
        <Mountain position={[0, 0.1, 0]} tileX={tile.x} tileY={tile.y} />
      )}
    </group>
  );
}
