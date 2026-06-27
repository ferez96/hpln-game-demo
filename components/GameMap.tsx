"use client";

import { useState } from "react";
import { GameState, Commander, ArmyStack } from "@/game/types";
import { initialGameState } from "@/game/state";
import { Tile } from "./Tile";


export function GameMap() {
  const [gs] = useState<GameState>(initialGameState);
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <>
      {gs.tiles.map((tile) => {
        const key = `${tile.x}-${tile.y}`;
        
        return (
          <Tile
            key={key}
            tile={tile}
            selected={selected}
            onSelect={setSelected}
          />
        );
      })}
    </>
  );
}
