"use client";

import { useState } from "react";
import { Html } from "@react-three/drei";
import { TileData, Commander, ArmyStack, stackSize } from "@/game/types";
import { Forest } from "@/game/models/Forest";
import { Mountain } from "@/game/models/Mountain";
import { Plains } from "@/game/models/Plains";
import { Capital } from "@/game/models/Capital";
import { Edges } from "@react-three/drei";


interface Props {
  tile: TileData;
  selected: string | null;
  onSelect: (id: string) => void;
  commanders?: Commander[];
  stacks?: ArmyStack[];
}

const OWNER_STYLE = {
  neutral: {
    bg: "#E0E0E0",
    border: "#FFFFFF",
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
  if (isSelected) return "#FFCC00";
  if (isHovered) return "#FFF176";
  // if (tile.terrain === "capital") return "#78909C";
  // if (tile.terrain === "city") return "#B0BEC5";
  // if (tile.terrain === "plains") return "#C5E1A5";
  // if (tile.terrain === "forest") return "#2E7D32";
  // if (tile.terrain === "mountain") return "#6D4C41";
  if (tile.owner) return OWNER_STYLE[tile.owner].bg;
  return OWNER_STYLE["neutral"].bg;
}

function borderColor(tile: TileData, isSelected: boolean, isHovered: boolean) {
  if (isSelected) return "#FFCC00";
  if (isHovered) return "#FFF176";
  if (tile.owner) return OWNER_STYLE[tile.owner].border;
  return OWNER_STYLE["neutral"].border;
}

export function Tile({ tile, selected, onSelect, commanders = [], stacks = [] }: Props) {
  const [hovered, setHovered] = useState(false);
  const id = `${tile.x}-${tile.y}`;
  const isSelected = selected === id;
  const color = tileColor(tile, isSelected, hovered);
  const border = borderColor(tile, isSelected, hovered);

  return (
    <group position={[tile.x, 0, tile.y]}>
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

        <Edges
          color={border}
          lineWidth={2}
          threshold={15}
        />
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
                commanders,
                stacks,
              },
              null,
              2
            )}
          </pre>
        </Html>
      )}

      {tile.terrain === "forest" && (
        <Forest position={[0, 0.1, 0]} tileX={tile.x} tileY={tile.y} />
      )}
      {tile.terrain === "mountain" && (
        <Mountain position={[0, 0.1, 0]} tileX={tile.x} tileY={tile.y} />
      )}
      {tile.terrain === "plains" && (
        <Plains position={[0, 0.1, 0]} tileX={tile.x} tileY={tile.y} />
      )}
      {tile.terrain === "capital" && (
        <Capital
          position={[0, 0.1, 0]}
          tileX={tile.x}
          tileY={tile.y}
          relativePos={tile.relativePos}
        />
      )}


      {/* City / capital label */}
      {tile.label && commanders.length === 0 && (
        <Html position={[0, 0.6, 0]} center>
          <div style={{
            color: "white", fontSize: "9px", fontWeight: "bold",
            textAlign: "center", whiteSpace: "nowrap",
            textShadow: "0 0 3px black, 0 0 3px black",
            pointerEvents: "none", userSelect: "none",
          }}>
            {tile.label}
          </div>
        </Html>
      )}
    </group>
  );
}
