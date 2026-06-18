"use client";

import { useState } from "react";
import { GameState, Commander, ArmyStack } from "@/game/types";
import { initialGameState } from "@/game/state";
import { Tile } from "./Tile";

function allCommanders(gs: GameState): Commander[] {
  return Object.values(gs.factions).flatMap((f) => f.commanders);
}

function allStacks(gs: GameState): ArmyStack[] {
  return Object.values(gs.factions).flatMap((f) => f.stacks);
}

export function GameMap() {
  const [gs] = useState<GameState>(initialGameState);
  const [selected, setSelected] = useState<string | null>(null);

  const commanders = allCommanders(gs);
  const stacks = allStacks(gs);

  return (
    <>
      {gs.tiles.map((tile) => {
        const key = `${tile.x}-${tile.y}`;
        const tileCommanders = commanders.filter(
          (c) => c.tileX === tile.x && c.tileY === tile.y
        );
        const tileStacks = stacks.filter(
          (s) => s.tileX === tile.x && s.tileY === tile.y
        );

        return (
          <Tile
            key={key}
            tile={tile}
            selected={selected}
            onSelect={setSelected}
            commanders={tileCommanders}
            stacks={tileStacks}
          />
        );
      })}
    </>
  );
}
