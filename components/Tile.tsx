"use client";

import { useState } from "react";
import { Html } from "@react-three/drei";
import { TileData, Commander, ArmyStack, stackSize } from "@/game/types";
import { Forest } from "@/game/models/Forest";
import { Mountain } from "@/game/models/Mountain";
import { Plains } from "@/game/models/Plains";
import { CommanderFigure } from "@/game/models/CommanderFigure";

interface Props {
  tile: TileData;
  selected: string | null;
  onSelect: (id: string) => void;
  commanders?: Commander[];
  stacks?: ArmyStack[];
}

const OWNER_COLOR: Record<string, string> = {
  wei: "#FFAB91",
  shu: "#C8E6C9",
  wu: "#90CAF9",
};

const RANK_LABEL: Record<string, string> = {
  tuong_quan:     "TQ",
  dai_tuong_quan: "ĐTQ",
};

const FACTION_COLOR: Record<string, string> = {
  wei: "#E64A19",
  shu: "#2E7D32",
  wu: "#1565C0",
};

function tileColor(tile: TileData, isSelected: boolean, isHovered: boolean) {
  if (isSelected) return "#FFCC00";
  if (isHovered) return "#FFF176";
  if (tile.terrain === "capital") return "#78909C";
  if (tile.terrain === "city") return "#B0BEC5";
  if (tile.terrain === "plains") return "#C5E1A5";
  if (tile.terrain === "forest") return "#2E7D32";
  if (tile.terrain === "mountain") return "#6D4C41";
  if (tile.owner) return OWNER_COLOR[tile.owner];
  return "#66BB6A";
}

export function Tile({ tile, selected, onSelect, commanders = [], stacks = [] }: Props) {
  const [hovered, setHovered] = useState(false);
  const id = `${tile.x}-${tile.y}`;
  const isSelected = selected === id;
  const color = tileColor(tile, isSelected, hovered);

  const totalTroops = stacks.reduce((sum, s) => sum + stackSize(s), 0);

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
      </mesh>

      {tile.terrain === "forest" && (
        <Forest position={[0, 0.1, 0]} tileX={tile.x} tileY={tile.y} />
      )}
      {tile.terrain === "mountain" && (
        <Mountain position={[0, 0.1, 0]} tileX={tile.x} tileY={tile.y} />
      )}
      {tile.terrain === "plains" && (
        <Plains position={[0, 0.1, 0]} tileX={tile.x} tileY={tile.y} />
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

      {/* Commander figures + name badges */}
      {commanders.map((c, i) => (
        <group key={c.id}>
          <CommanderFigure commander={c} position={[0, 0.1, 0]} index={i} />
          <Html position={[0, 0.85 + i * 0.18, 0]} center>
            <div style={{
              background: FACTION_COLOR[c.owner],
              color: "white",
              fontSize: "8px",
              fontWeight: "bold",
              padding: "1px 4px",
              borderRadius: "3px",
              whiteSpace: "nowrap",
              textShadow: "0 0 2px black",
              pointerEvents: "none",
              userSelect: "none",
              border: "1px solid rgba(255,255,255,0.4)",
            }}>
              {RANK_LABEL[c.rank]} {c.name}
            </div>
          </Html>
        </group>
      ))}

      {/* Troop count */}
      {totalTroops > 0 && (
        <Html position={[0.38, 0.35, 0.38]} center>
          <div style={{
            background: "rgba(0,0,0,0.65)",
            color: "white",
            fontSize: "7px",
            fontWeight: "bold",
            padding: "1px 3px",
            borderRadius: "2px",
            pointerEvents: "none",
            userSelect: "none",
          }}>
            ⚔ {totalTroops}
          </div>
        </Html>
      )}
    </group>
  );
}
