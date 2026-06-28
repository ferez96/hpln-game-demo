"use client";

import { useState } from "react";
import { GameState } from "@/game/types";
import { initialGameState } from "@/game/state";
import { Tile } from "./Tile";
import { Capital } from "@/game/models/Capital";
import { City } from "@/game/models/City";

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
      {Object.values(gs.cities)
        .filter((city) => city.isCapital)
        .map((city) => {
          const [x, y] = city.tiles[0];
          return <Capital key={city.label} position={[x + 1.5, 0, y + 1.5]} />;
        })}
      {Object.values(gs.cities)
        .filter((city) => !city.isCapital)
        .map((city) => {
          const [x, y] = city.tiles[0];
          return <City key={city.label} position={[x + 0.5, 0, y + 0.5]} />;
        })}
    </>
  );
}
