"use client";

import { useState } from "react";
import { DoubleSide } from "three";
import { Html } from "@react-three/drei";
import { TileData } from "@/game/types";
import { Plains } from "@/game/models/Plains";
import { Edges } from "@react-three/drei";
import { Forest } from "@/game/models/Forest";
import { Mountain } from "@/game/models/Mountain";
import { River } from "@/game/models/River";
import {
  FACTION_COLOR,
  FACTION_TILE_TINT,
  NEUTRAL_TILE_BORDER,
  NEUTRAL_TILE_COLOR,
} from "@/game/theme";
import { isOwnTerritory, VisionMode } from "@/game/vision";

interface Props {
  tile: TileData;
  selected: string | null;
  visionMode: VisionMode;
  onSelect: (id: string) => void;
}

const GOLD = "#E8C040";

function tileColor(tile: TileData, isSelected: boolean, isHovered: boolean) {
  if (isHovered) return GOLD;
  if (isSelected) return "#F0E8C0";
  if (tile.owner) return FACTION_TILE_TINT[tile.owner];
  return NEUTRAL_TILE_COLOR;
}

function borderColor(tile: TileData, isSelected: boolean, isHovered: boolean) {
  if (isSelected) return GOLD;
  if (isHovered) return GOLD;
  if (tile.owner) return FACTION_COLOR[tile.owner];
  return NEUTRAL_TILE_BORDER;
}

export function Tile({ tile, selected, visionMode, onSelect }: Props) {
  const [hovered, setHovered] = useState(false);
  const id = tile.id;
  const isSelected = selected === id;
  const color = tileColor(tile, isSelected, hovered);
  const border = borderColor(tile, isSelected, hovered);
  const isOwn = isOwnTerritory(tile, visionMode);

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
        <meshStandardMaterial
          color={color}
          emissive={isOwn ? "#e8c040" : "#000000"}
          emissiveIntensity={isOwn ? 0.18 : 0}
        />

        <Edges color={border} lineWidth={isOwn ? 3 : 2} threshold={15} />
      </mesh>

      {/* Own-territory marker for the current vision mode — floats above any
          terrain model so it stays visible regardless of tile decoration. */}
      {isOwn && (
        <mesh position={[0, 1.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.3, 0.4, 24]} />
          <meshBasicMaterial color="#e8c040" transparent opacity={0.85} side={DoubleSide} />
        </mesh>
      )}

      {isSelected && (
        <Html position={[0, 1.5, 0]} center distanceFactor={12}>
          <div
            style={{
              background: "var(--panel, #1e1608)",
              border: "1px solid var(--gold, #e8c040)",
              color: "var(--primary, #f0e8c0)",
              fontFamily: "var(--font-sans)",
              padding: "8px 10px",
              borderRadius: 6,
              maxWidth: 320,
              fontSize: 12,
              lineHeight: 1.6,
              pointerEvents: "none",
              whiteSpace: "nowrap",
            }}
          >
            <strong style={{ color: "var(--gold, #e8c040)" }}>{tile.id}</strong>{" "}
            {tile.label ? `- ${tile.label}` : ""}
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
        <River position={[0, 0.1, 0]} tileX={tile.x} tileY={tile.y} />
      )}
    </group>
  );
}
