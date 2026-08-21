"use client";

import { CommanderState, GameState, Owner } from "@/game/types";
import { tileCenter } from "@/game/board";
import { Tile } from "./Tile";
import { Capital } from "@/game/models/Capital";
import { City } from "@/game/models/City";
import { Html } from "@react-three/drei";
import { FACTION_COLOR } from "@/game/theme";
import { isCommanderVisible, VisionMode } from "@/game/vision";

interface Props {
  state: GameState;
  selectedTile: string | null;
  activeCommanderId: string | null;
  visionMode: VisionMode;
  onSelectTile: (tileId: string) => void;
  onSelectCommander: (commanderId: string) => void;
}

function CommanderMarker({
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
          color={FACTION_COLOR[owner]}
          emissive={active ? "#e8c040" : "#000000"}
          emissiveIntensity={active ? 0.3 : 0}
        />
      </mesh>
      <mesh position={[0, 0.25, 0]} castShadow>
        <coneGeometry args={[0.18, 0.32, 6]} />
        <meshStandardMaterial color={FACTION_COLOR[owner]} />
      </mesh>
      <Html position={[0, 0.55, 0]} center distanceFactor={14}>
        <div
          style={{
            background: active ? "var(--chu-sa, #8b1a1a)" : "var(--panel, #1e1608)",
            color: active ? "var(--gold, #e8c040)" : "var(--primary, #f0e8c0)",
            border: `1px solid ${active ? "var(--gold, #e8c040)" : FACTION_COLOR[owner]}`,
            borderRadius: 4,
            fontFamily: "var(--font-serif)",
            fontSize: 11,
            fontWeight: 700,
            lineHeight: 1,
            padding: "3px 6px",
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
  activeCommanderId,
  visionMode,
  onSelectTile,
  onSelectCommander,
}: Props) {
  const tileById = new Map(state.tiles.map((t) => [t.id, t]));

  // Ô Thành Trì bị phá sập đổi terrain thành `plains`, nên chỉ dựng mô hình
  // thành trên những ô còn đứng.
  const standingRegions = Object.values(state.cities)
    .map((city) => ({
      city,
      tiles: city.tiles.filter((id) => {
        const tile = tileById.get(id);
        return tile?.terrain === (city.isCapital ? "capital" : "city");
      }),
    }))
    .filter((region) => region.tiles.length > 0);

  const visible: CommanderState[] = Object.values(state.commanders).filter(
    (c) => c.status === "FIELD" && isCommanderVisible(state, c, visionMode),
  );

  const byTile = new Map<string, CommanderState[]>();
  for (const commander of visible) {
    const list = byTile.get(commander.tileId) ?? [];
    list.push(commander);
    byTile.set(commander.tileId, list);
  }

  return (
    <>
      {state.tiles.map((tile) => (
        <Tile
          key={tile.id}
          tile={tile}
          selected={selectedTile}
          visionMode={visionMode}
          onSelect={onSelectTile}
        />
      ))}

      {standingRegions.map(({ city, tiles }) =>
        city.isCapital ? (
          <Capital
            key={city.id}
            position={tileCenter(tiles[Math.floor(tiles.length / 2)])}
          />
        ) : (
          <City key={city.id} position={tileCenter(tiles[0])} />
        ),
      )}

      {visible.map((commander) => {
        const group = byTile.get(commander.tileId)!;
        const index = group.indexOf(commander);
        const offset = (index - (group.length - 1) / 2) * 0.3;
        const base = tileCenter(commander.tileId);
        return (
          <group
            key={commander.id}
            position={[base[0] + offset, 0, base[2] + offset]}
          >
            <CommanderMarker
              owner={commander.kingdom}
              label={commander.name}
              active={activeCommanderId === commander.id}
              onClick={() => onSelectCommander(commander.id)}
            />
          </group>
        );
      })}
    </>
  );
}
