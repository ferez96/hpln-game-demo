import { fromTileId, tileIdsInRect, toTileId } from "./coordinates";
import { MAP_COLS, MAP_ROWS } from "./mapConfig";
import {
  ArmyState,
  BuildingLevels,
  CastleState,
  CityState,
  GameState,
  GeneralState,
  Owner,
  PlayerState,
  Resources,
  Terrain,
  TileData,
  TileId,
  Units,
} from "./types";

export { MAP_COLS, MAP_ROWS };

const STARTING_RESOURCES: Resources = {
  gold: 20,
  grain: 50000,
  population: 120000,
  morale: 10,
  prestige: 5,
  imperialToken: 1,
};

const STARTING_BUILDINGS: BuildingLevels = {
  mine: 1,
  farm: 1,
  populationHouse: 1,
  barracks: 1,
  archery: 1,
  stable: 1,
  forgeWeapon: 1,
  forgeArmor: 1,
  shipyard: 1,
  siegeWorkshop: 1,
};

const EMPTY_UNITS: Units = {
  infantry: 0,
  archers: 0,
  cavalry: 0,
};

const TERRAIN_ROWS: string[] = [
  "pppfffpppppmmm",
  "pccfffpppppmmm",
  "pccpppppprrppp",
  "pppmmmppprrppp",
  "pppmmmccprrppp",
  "ppppppccpprrcc",
  "ppppccpppprrcc",
  "CCCpccpccpprrp",
  "CCCppppccpprrp",
  "CCCfffpppprrpp",
  "pppfffpppCCCpp",
  "ppppccpppCCCpp",
  "ppppccpppCCCpp",
  "mmmppppppppppp",
];

const TERRAIN_LOOKUP: Record<string, Terrain> = {
  p: "plains",
  f: "forest",
  m: "mountain",
  r: "river",
  c: "city",
  C: "capital",
};

type CityDraft = {
  id: string;
  label: string;
  owner: Owner | null;
  isCapital: boolean;
  tiles: TileId[];
};

const cityDrafts: CityDraft[] = [
  {
    id: "LUOYANG",
    label: "Lạc Dương",
    owner: "wei",
    isCapital: true,
    tiles: tileIdsInRect(0, 7, 3, 3),
  },
  {
    id: "CHENGDU",
    label: "Thành Đô",
    owner: "shu",
    isCapital: true,
    tiles: tileIdsInRect(7, 0, 3, 3),
  },
  {
    id: "JIANYE",
    label: "Kiến Nghiệp",
    owner: "wu",
    isCapital: true,
    tiles: tileIdsInRect(9, 10, 3, 3),
  },
  {
    id: "LIANGZHOU",
    label: "Lương Châu",
    owner: null,
    isCapital: false,
    tiles: tileIdsInRect(1, 1, 2, 2),
  },
  {
    id: "YUZHOU",
    label: "Dự Châu",
    owner: null,
    isCapital: false,
    tiles: tileIdsInRect(7, 7, 2, 2),
  },
  {
    id: "YONGZHOU",
    label: "Ung Châu",
    owner: null,
    isCapital: false,
    tiles: tileIdsInRect(6, 4, 2, 2),
  },
  {
    id: "YANZHOU",
    label: "Duyện Châu",
    owner: null,
    isCapital: false,
    tiles: tileIdsInRect(4, 6, 2, 2),
  },
  {
    id: "XUZHOU",
    label: "Từ Châu",
    owner: null,
    isCapital: false,
    tiles: tileIdsInRect(4, 11, 2, 2),
  },
  {
    id: "JINGZHOU",
    label: "Kinh Châu",
    owner: null,
    isCapital: false,
    tiles: tileIdsInRect(11, 5, 2, 2),
  },
];

function makeTiles(): TileData[] {
  const cityByTile = new Map<TileId, CityDraft>();
  for (const city of cityDrafts) {
    for (const tileId of city.tiles) {
      cityByTile.set(tileId, city);
    }
  }

  const tiles: TileData[] = [];
  for (let y = 0; y < MAP_ROWS; y++) {
    for (let x = 0; x < MAP_COLS; x++) {
      const id = toTileId({ x, y });
      const city = cityByTile.get(id);
      const terrain = city
        ? city.isCapital
          ? "capital"
          : "city"
        : TERRAIN_LOOKUP[TERRAIN_ROWS[y][x]];

      tiles.push({
        id,
        x,
        y,
        terrain,
        owner: city?.owner ?? undefined,
        label: city?.label,
        cityId: city?.id,
        effects: [],
        supplyOwner: city?.owner ?? undefined,
      });
    }
  }
  return tiles;
}

function makeCities(): Record<string, CityState> {
  return Object.fromEntries(
    cityDrafts.map((city) => [
      city.id,
      {
        id: city.id,
        label: city.label,
        owner: city.owner,
        isCapital: city.isCapital,
        tiles: city.tiles,
        grainReserve: city.isCapital ? 20000 : 5000,
        localMilitia: city.owner
          ? { infantry: 3000, archers: 1000, cavalry: 1000 }
          : { infantry: 4000, archers: 1000, cavalry: 0 },
        defense: city.isCapital ? 4 : 2,
        damaged: false,
      },
    ]),
  );
}

function makeCastles(): Record<string, CastleState> {
  return {
    "WEI-1": {
      id: "WEI-1",
      label: "Ngụy Trại",
      owner: "wei",
      tiles: ["A8", "B8", "C8"],
      grainReserve: 30000,
      defense: 5,
      damaged: false,
    },
    "SHU-1": {
      id: "SHU-1",
      label: "Thục Trại",
      owner: "shu",
      tiles: ["H1", "I1", "J1"],
      grainReserve: 30000,
      defense: 5,
      damaged: false,
    },
    "WU-1": {
      id: "WU-1",
      label: "Ngô Trại",
      owner: "wu",
      tiles: ["J11", "K11", "L11"],
      grainReserve: 30000,
      defense: 5,
      damaged: false,
    },
  };
}

function makePlayers(): Record<string, PlayerState> {
  const roles = ["LORD", "STRATEGIST", "GENERAL", "GENERAL", "GENERAL", "GENERAL", "GENERAL", "GENERAL"] as const;
  const kingdoms: Owner[] = ["wei", "shu", "wu"];
  const players: Record<string, PlayerState> = {};

  kingdoms.forEach((kingdom, kingdomIndex) => {
    roles.forEach((role, roleIndex) => {
      const n = kingdomIndex * roles.length + roleIndex + 1;
      const id = `player${String(n).padStart(2, "0")}`;
      players[id] = {
        id,
        name: `Player ${n}`,
        kingdom,
        role,
        alive: true,
        connected: true,
        banished: false,
      };
    });
  });

  return players;
}

function makeGeneral(
  id: string,
  player: string,
  kingdom: Owner,
  location: TileId,
): GeneralState {
  return {
    id,
    player,
    kingdom,
    rank: "GENERAL",
    location,
    kills: 0,
    woundedTurns: 0,
    cooldowns: {
      greatGeneral: 0,
      heal: 0,
    },
    inventory: {
      arrows: 1000,
      fireArrows: 0,
      ships: [],
    },
    loyal: true,
  };
}

function makeGenerals(): Record<string, GeneralState> {
  const generals: Record<string, GeneralState> = {};
  const starts: Record<Owner, TileId> = {
    wei: "B8",
    shu: "I2",
    wu: "K11",
  };

  (["wei", "shu", "wu"] as Owner[]).forEach((kingdom, kingdomIndex) => {
    for (let i = 3; i <= 8; i++) {
      const playerNumber = kingdomIndex * 8 + i;
      const player = `player${String(playerNumber).padStart(2, "0")}`;
      const id = `general${String(playerNumber).padStart(2, "0")}`;
      generals[id] = makeGeneral(id, player, kingdom, starts[kingdom]);
    }
  });

  return generals;
}

function makeArmy(
  id: string,
  kingdom: Owner,
  generalId: string,
  tileId: TileId,
  units: Units,
): ArmyState {
  return {
    id,
    kingdom,
    generalId,
    tileId,
    units,
    morale: 10,
    formation: "NORMAL",
    status: "IDLE",
    buffs: [],
    debuffs: [],
    supplied: true,
  };
}

function makeArmies(): Record<string, ArmyState> {
  return {
    "army-wei-1": makeArmy("army-wei-1", "wei", "general03", "B8", {
      infantry: 3000,
      archers: 1000,
      cavalry: 1000,
    }),
    "army-shu-1": makeArmy("army-shu-1", "shu", "general11", "I2", {
      infantry: 3000,
      archers: 1000,
      cavalry: 1000,
    }),
    "army-wu-1": makeArmy("army-wu-1", "wu", "general19", "K11", {
      infantry: 3000,
      archers: 1000,
      cavalry: 1000,
    }),
  };
}

function makeKingdoms(): GameState["kingdoms"] {
  return {
    wei: {
      id: "wei",
      name: "Ngụy",
      leader: "player01",
      strategist: "player02",
      resources: { ...STARTING_RESOURCES },
      buildings: { ...STARTING_BUILDINGS },
      territory: ["A8", "B8", "C8", "A9", "B9", "C9", "A10", "B10", "C10"],
      castles: ["WEI-1"],
      cities: ["LUOYANG"],
      score: 0,
      eliminated: false,
    },
    shu: {
      id: "shu",
      name: "Thục",
      leader: "player09",
      strategist: "player10",
      resources: { ...STARTING_RESOURCES },
      buildings: { ...STARTING_BUILDINGS },
      territory: ["H1", "I1", "J1", "H2", "I2", "J2", "H3", "I3", "J3"],
      castles: ["SHU-1"],
      cities: ["CHENGDU"],
      score: 0,
      eliminated: false,
    },
    wu: {
      id: "wu",
      name: "Ngô",
      leader: "player17",
      strategist: "player18",
      resources: { ...STARTING_RESOURCES },
      buildings: { ...STARTING_BUILDINGS },
      territory: ["J11", "K11", "L11", "J12", "K12", "L12", "J13", "K13", "L13"],
      castles: ["WU-1"],
      cities: ["JIANYE"],
      score: 0,
      eliminated: false,
    },
  };
}

export function tileCenter(tileId: TileId): [number, number, number] {
  const { x, y } = fromTileId(tileId);
  return [x + 0.5, 0, y + 0.5];
}

export const initialGameState: GameState = {
  version: 2,
  game: {
    id: "demo-three-kingdoms-001",
    status: "RUNNING",
    year: 1,
    season: "SPRING",
    turn: 1,
    phase: "GO",
    seed: 123456789,
  },
  map: {
    size: {
      rows: MAP_ROWS,
      cols: MAP_COLS,
    },
  },
  tiles: makeTiles(),
  cities: makeCities(),
  castles: makeCastles(),
  kingdoms: makeKingdoms(),
  players: makePlayers(),
  generals: makeGenerals(),
  armies: makeArmies(),
  commands: [],
  battles: [],
  events: [
    {
      id: "event-001",
      turn: 1,
      phase: "GO",
      type: "RESOURCE",
      message: "Tam Quốc bắt đầu: Ngụy, Thục, Ngô chuẩn bị lượt GO đầu tiên.",
    },
  ],
  victory: {
    winner: null,
    reason: null,
  },
};

export const emptyUnits = EMPTY_UNITS;
