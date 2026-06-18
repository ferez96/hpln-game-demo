import {
  GameState,
  Commander,
  ArmyStack,
  CityState,
  Resources,
} from "./types";
import { tiles } from "./map";

const BASE_RESOURCES: Resources = {
  gold: 1000,
  food: 500,
  population: 50000,
  manpower: 10000,
};

// ── Commanders ────────────────────────────────────────────────────────────────

const weiCommanders: Commander[] = [
  {
    id: "cao-cao",
    name: "Tào Tháo",
    owner: "wei",
    rank: "dai_tuong_quan",
    leadership: 95,
    strategy: 90,
    bravery: 85,
    tileX: 8, tileY: 2,
    movesLeft: 4,
  },
  {
    id: "xiahou-dun",
    name: "Hạ Hầu Đôn",
    owner: "wei",
    rank: "tuong_quan",
    leadership: 80,
    strategy: 65,
    bravery: 95,
    tileX: 7, tileY: 1,
    movesLeft: 3,
  },
];

const shuCommanders: Commander[] = [
  {
    id: "liu-bei",
    name: "Lưu Bị",
    owner: "shu",
    rank: "dai_tuong_quan",
    leadership: 88,
    strategy: 82,
    bravery: 80,
    tileX: 1, tileY: 8,
    movesLeft: 4,
  },
  {
    id: "guan-yu",
    name: "Quan Vũ",
    owner: "shu",
    rank: "tuong_quan",
    leadership: 92,
    strategy: 70,
    bravery: 98,
    tileX: 0, tileY: 7,
    movesLeft: 3,
  },
];

const wuCommanders: Commander[] = [
  {
    id: "sun-quan",
    name: "Tôn Quyền",
    owner: "wu",
    rank: "dai_tuong_quan",
    leadership: 85,
    strategy: 88,
    bravery: 78,
    tileX: 11, tileY: 11,
    movesLeft: 4,
  },
  {
    id: "zhou-yu",
    name: "Chu Du",
    owner: "wu",
    rank: "tuong_quan",
    leadership: 90,
    strategy: 95,
    bravery: 82,
    tileX: 10, tileY: 10,
    movesLeft: 3,
  },
];

// ── Army stacks ───────────────────────────────────────────────────────────────

const weiStacks: ArmyStack[] = [
  {
    id: "wei-army-1",
    owner: "wei",
    commanderId: "cao-cao",
    units: { infantry: 200, cavalry: 100, archer: 100 }, // 400 ≤ 5000
    tileX: 8, tileY: 2,
    morale: 90,
  },
  {
    id: "wei-army-2",
    owner: "wei",
    commanderId: "xiahou-dun",
    units: { infantry: 300, cavalry: 150 },              // 450 ≤ 500
    tileX: 7, tileY: 1,
    morale: 85,
  },
];

const shuStacks: ArmyStack[] = [
  {
    id: "shu-army-1",
    owner: "shu",
    commanderId: "liu-bei",
    units: { infantry: 150, cavalry: 80, archer: 120 },  // 350 ≤ 5000
    tileX: 1, tileY: 8,
    morale: 88,
  },
  {
    id: "shu-army-2",
    owner: "shu",
    commanderId: "guan-yu",
    units: { infantry: 350, cavalry: 120 },              // 470 ≤ 500
    tileX: 0, tileY: 7,
    morale: 92,
  },
];

const wuStacks: ArmyStack[] = [
  {
    id: "wu-army-1",
    owner: "wu",
    commanderId: "sun-quan",
    units: { infantry: 200, archer: 150, cavalry: 50 },  // 400 ≤ 5000
    tileX: 11, tileY: 11,
    morale: 85,
  },
  {
    id: "wu-army-2",
    owner: "wu",
    commanderId: "zhou-yu",
    units: { infantry: 280, archer: 200 },               // 480 ≤ 500
    tileX: 10, tileY: 10,
    morale: 90,
  },
];

// ── Cities ────────────────────────────────────────────────────────────────────

const cities: Record<string, CityState> = {
  "Lạc Dương":  { label: "Lạc Dương",  owner: "wei", isCapital: true,  population: 100000, defense: 80, buildings: [{ type: "wall", level: 3 }, { type: "barracks", level: 2 }] },
  "Thành Đô":   { label: "Thành Đô",   owner: "shu", isCapital: true,  population: 80000,  defense: 75, buildings: [{ type: "wall", level: 3 }, { type: "farm",     level: 2 }] },
  "Kiến Nghiệp":{ label: "Kiến Nghiệp",owner: "wu",  isCapital: true,  population: 90000,  defense: 78, buildings: [{ type: "wall", level: 3 }, { type: "market",   level: 2 }] },
  "Lương Châu": { label: "Lương Châu", owner: null,  isCapital: false, population: 30000,  defense: 40, buildings: [{ type: "wall", level: 1 }] },
  "Duyện Châu": { label: "Duyện Châu", owner: null,  isCapital: false, population: 25000,  defense: 35, buildings: [{ type: "farm", level: 1 }] },
  "Từ Châu":    { label: "Từ Châu",    owner: null,  isCapital: false, population: 28000,  defense: 38, buildings: [{ type: "wall", level: 1 }] },
  "Ung Châu":   { label: "Ung Châu",   owner: null,  isCapital: false, population: 22000,  defense: 30, buildings: [] },
  "Dự Châu":    { label: "Dự Châu",    owner: null,  isCapital: false, population: 20000,  defense: 32, buildings: [] },
  "Kinh Châu":  { label: "Kinh Châu",  owner: null,  isCapital: false, population: 35000,  defense: 45, buildings: [{ type: "wall", level: 2 }] },
};

// ── Initial state ─────────────────────────────────────────────────────────────

export const initialGameState: GameState = {
  turn: 1,
  currentFaction: "wei",
  phase: "move",

  factions: {
    wei: { resources: { ...BASE_RESOURCES, gold: 2000 }, commanders: weiCommanders, stacks: weiStacks },
    shu: { resources: { ...BASE_RESOURCES, gold: 1500 }, commanders: shuCommanders, stacks: shuStacks },
    wu:  { resources: { ...BASE_RESOURCES, gold: 1800 }, commanders: wuCommanders,  stacks: wuStacks  },
  },

  cities,
  tiles,

  diplomacy: {
    wei_shu: "war",
    wei_wu:  "war",
    shu_wu:  "alliance",
  },
};
