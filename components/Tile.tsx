"use client";

import { useState } from "react";
import { Html } from "@react-three/drei";
import { TileData } from "@/game/types";
import { Plains } from "@/game/models/Plains";
import { Edges } from "@react-three/drei";
import { Forest } from "@/game/models/Forest";
import { Mountain } from "@/game/models/Mountain";
import { River } from "@/game/models/River";

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
  if (isSelected) return "#FFFFFF";
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
  const id = tile.id;
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
          <div
            style={{
              background: "rgba(17, 24, 39, 0.94)",
              color: "#fff",
              padding: "8px 10px",
              borderRadius: 6,
              maxWidth: 320,
              fontSize: 12,
              pointerEvents: "none",
              whiteSpace: "nowrap",
            }}
          >
            <strong>{tile.id}</strong> {tile.label ? `- ${tile.label}` : ""}
            <br />
            {tile.terrain}
            {tile.owner ? ` / ${tile.owner}` : " / neutral"}
            {tile.supplyOwner ? ` / supplied` : ""}
          </div>
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
      {tile.terrain === "river" && (
        <River position={[0, 0.1, 0]} tileX={tile.x} tileY={tile.y}  />
      )}

    </group>
  );
}
