import { describe, expect, it } from "vitest";

import {
  BoardError,
  capitalCenter,
  DEFAULT_BOARD,
  makeTiles,
  regionsOf,
  validateBoard,
} from "./board";
import { parseBoard, formatBoard } from "./board-text";
import { parseRoster, RosterError } from "./roster-text";
import { resolveTileBattle, checkVictory, defensePower, stoneDefense } from "./combat";
import { fromTileId, neighbors, toTileId } from "./coordinates";
import { applyGrainUpkeep, convertLua, recruit } from "./economy";
import { commandersAt, tileById, totalUnits } from "./helpers";
import { parseOrders } from "./orders/parse";
import { renderChienBao } from "./report";
import { validateOrders } from "./orders/validate";
import { beginTurn, resolvePhase, startGame } from "./resolve";
import { calculateScore } from "./scoring";
import { createGame, createDefaultGame, SetupError, validateSetup } from "./setup";
import { buildSupplyNetwork } from "./supply";
import { CommanderState, GameState, Owner, Units } from "./types";

/* ---------- Tiện ích cho test ---------- */

function game(): GameState {
  return startGame(createDefaultGame());
}

function commanderOf(state: GameState, kingdom: Owner, index = 0): CommanderState {
  return Object.values(state.commanders).filter((c) => c.kingdom === kingdom)[
    index
  ];
}

function place(
  state: GameState,
  commander: CommanderState,
  tileId: string,
  units: Partial<Units> = {},
) {
  commander.tileId = tileId;
  commander.enteredTileOnTurn = state.game.turn;
  commander.units = { infantry: 0, archers: 0, cavalry: 0, ...units };
}

function run(state: GameState, orders: string) {
  return resolvePhase(state, parseOrders(state, orders));
}

/**
 * Chiếm sẵn một hành lang ô nối từ Thành Trì ra chiến trường, và tự kiểm tra
 * rằng hành lang đó thật sự nối lương — nếu không thì quân sẽ chết đói ngay
 * đầu Go và bài test đang đo nhầm thứ.
 */
function corridor(state: GameState, kingdom: Owner, tiles: string[]) {
  for (const id of tiles) tileById(state, id)!.owner = kingdom;
  const network = buildSupplyNetwork(state, kingdom);
  for (const id of tiles) {
    if (!network.national.has(id)) {
      throw new Error(`Hành lang test hỏng: ${id} không nối được về Trì.`);
    }
  }
}

/** C9 (Trì Ngụy) → D9 → E9. */
const WEI_TO_E9 = ["D9", "E9"];
/** J3 (Trì Thục) → J4 → I4 → H4 → G4 → F4 → E4 → E5 → E6 → E7 → E8. */
const SHU_TO_E8 = ["J4", "I4", "H4", "G4", "F4", "E4", "E5", "E6", "E7", "E8"];
const SIZE = { rows: DEFAULT_BOARD.rows, cols: DEFAULT_BOARD.cols };
const WEI_HOME = capitalCenter(DEFAULT_BOARD, "wei")!;

/** A8 (Trì Ngụy) → A7 → A6; ô Rừng A5 nằm kề A6. */
const WEI_TO_A6 = ["A7", "A6"];

/* ---------- Bàn cờ & tọa độ ---------- */

describe("bàn cờ", () => {
  it("id ô là chữ hàng + số cột, khớp bản đồ in", () => {
    expect(toTileId({ x: 8, y: 1 })).toBe("B9");
    expect(fromTileId("B9")).toEqual({ x: 8, y: 1 });
    expect(fromTileId(toTileId({ x: 12, y: 12 }))).toEqual({ x: 12, y: 12 });
  });

  it("có 169 ô, mỗi nước đúng 9 Ô Thành Trì và 6 Châu Thành 2x2", () => {
    const tiles = makeTiles(DEFAULT_BOARD);
    expect(tiles).toHaveLength(169);
    for (const kingdom of ["wei", "shu", "wu"] as Owner[]) {
      const capitals = tiles.filter(
        (t) => t.terrain === "capital" && t.owner === kingdom,
      );
      expect(capitals).toHaveLength(9);
    }
    const chau = regionsOf(DEFAULT_BOARD).filter((r) => !r.isCapital);
    expect(chau).toHaveLength(6);
    for (const region of chau) expect(region.tiles).toHaveLength(4);
  });

  it("ô kề chỉ tính cạnh vuông, không tính chéo", () => {
    expect(neighbors("B9", SIZE).sort()).toEqual(["A9", "B10", "B8", "C9"].sort());
    expect(neighbors("A1", SIZE).sort()).toEqual(["A2", "B1"].sort());
  });
});

/* ---------- Bàn cờ tự khai ---------- */

/**
 * Bàn cờ 6x6 tối giản, đủ 3 nước, dùng để kiểm tra engine không dính 13x13.
 * Rừng và Núi đặt ngoài các vùng thành để đếm được rạch ròi.
 *
 *        cột 123456
 *   A        ......   Trì Ngụy A1-B2, Trì Thục A5-B6
 *   B        ..ff..
 *   C        .....m   Châu Giữa C3-D4
 *   D        .....m
 *   E        ......   Trì Ngô E1-F2
 *   F        ......
 */
const TINY_BOARD_TEXT = `
ten: Bàn nhỏ 6x6

dia-hinh:
......
..ff..
.....m
.....m
......
......

vung:
tri nguy "Trại Ngụy" A1 2x2
tri thuc "Trại Thục" A5 2x2
tri ngo  "Trại Ngô" E1 2x2
chau "Châu Giữa" C3 2x2
`;

describe("bàn cờ tự khai", () => {
  it("đọc được bàn cờ từ văn bản, kích thước suy từ khối địa hình", () => {
    const board = parseBoard(TINY_BOARD_TEXT);
    expect(board.name).toBe("Bàn nhỏ 6x6");
    expect(board.rows).toBe(6);
    expect(board.cols).toBe(6);
    expect(board.regions).toHaveLength(4);

    const tiles = makeTiles(board);
    expect(tiles).toHaveLength(36);
    expect(tiles.filter((t) => t.terrain === "forest").map((t) => t.id)).toEqual([
      "B3",
      "B4",
    ]);
    expect(tiles.filter((t) => t.terrain === "mountain").map((t) => t.id)).toEqual([
      "C6",
      "D6",
    ]);
    expect(
      tiles.filter((t) => t.terrain === "capital" && t.owner === "wei"),
    ).toHaveLength(4);
    expect(tiles.filter((t) => t.terrain === "city")).toHaveLength(4);
  });

  it("chạy được cả ván trên bàn cờ nhỏ", () => {
    const board = parseBoard(TINY_BOARD_TEXT);
    let state = startGame(
      createGame({
        board,
        players: [
          { name: "Tào Tháo", kingdom: "wei", role: "LORD" },
          { name: "Trương Liêu", kingdom: "wei", role: "GENERAL" },
          { name: "Lưu Bị", kingdom: "shu", role: "LORD" },
          { name: "Tôn Quyền", kingdom: "wu", role: "LORD" },
        ],
      }),
    );

    expect(state.map.size).toEqual({ rows: 6, cols: 6 });
    expect(state.map.name).toBe("Bàn nhỏ 6x6");

    // Tướng Ngụy xuất phát trong khối Trì A1–B2.
    const liao = Object.values(state.commanders).find(
      (c) => c.name === "Trương Liêu",
    )!;
    expect(["A1", "A2", "B1", "B2"]).toContain(liao.tileId);

    // Hành quân ra khỏi khối Trì: tướng khởi đầu ở góc A1 nên phải đi qua một
    // ô Trì nữa mới ra tới Ô Trắng — đúng hai lượt Go.
    const step = (from: string) =>
      neighbors(from, state.map.size).find(
        (id) => tileById(state, id)!.terrain === "plains",
      );

    let guard = 0;
    while (!step(state.commanders[liao.id].tileId) && guard++ < 4) {
      const inside = neighbors(state.commanders[liao.id].tileId, state.map.size)[0];
      state = run(state, `${liao.id}: di ${inside}`).state; // Go
      state = run(state, "").state; // Atc
    }

    const target = step(state.commanders[liao.id].tileId)!;
    expect(target).toBeDefined();

    const result = run(state, `${liao.id}: di ${target}`);
    state = result.state;

    expect(result.report.orders[0].ok).toBe(true);
    expect(state.commanders[liao.id].tileId).toBe(target);
    expect(tileById(state, target)!.owner).toBe("wei");
  });

  it("chiến báo đếm Thành Trì theo bàn cờ, không cứng số 9", () => {
    const state = startGame(
      createGame({
        board: parseBoard(TINY_BOARD_TEXT),
        players: [
          { name: "Tào Tháo", kingdom: "wei", role: "LORD" },
          { name: "Lưu Bị", kingdom: "shu", role: "LORD" },
          { name: "Tôn Quyền", kingdom: "wu", role: "LORD" },
        ],
      }),
    );
    const { report } = run(state, "");
    const chienBao = renderChienBao({ state, report });
    // Bàn nhỏ cho mỗi nước khối Trì 2x2 = 4 ô.
    expect(chienBao).toContain("4/4");
    expect(chienBao).not.toContain("/9");
  });

  it("ô ngoài bàn cờ nhỏ bị bác khi soát lệnh", () => {
    const state = startGame(
      createGame({
        board: parseBoard(TINY_BOARD_TEXT),
        players: [
          { name: "Tào Tháo", kingdom: "wei", role: "LORD" },
          { name: "Lưu Bị", kingdom: "shu", role: "LORD" },
          { name: "Tôn Quyền", kingdom: "wu", role: "LORD" },
        ],
      }),
    );
    // M13 tồn tại trên bàn 13x13 nhưng không tồn tại trên bàn 6x6.
    const parsed = parseOrders(state, "Tào Tháo: di M13");
    expect(parsed[0].error).toMatch(/sai ô đích/);
  });

  it("xuất bàn cờ ra văn bản rồi đọc lại thì không đổi", () => {
    const again = parseBoard(formatBoard(DEFAULT_BOARD));
    expect(again.rows).toBe(DEFAULT_BOARD.rows);
    expect(again.cols).toBe(DEFAULT_BOARD.cols);
    expect(again.terrain).toEqual(DEFAULT_BOARD.terrain);
    expect(again.regions.map((r) => `${r.anchor} ${r.width}x${r.height}`)).toEqual(
      DEFAULT_BOARD.regions.map((r) => `${r.anchor} ${r.width}x${r.height}`),
    );
  });

  it("bắt lỗi bàn cờ hỏng bằng thông báo cụ thể", () => {
    const cases: [string, RegExp][] = [
      ["dia-hinh:\n....\n...\n", /dài 3 ký tự/],
      ["dia-hinh:\n..\n..\n", /Thành Trì cho nước/],
      ["dia-hinh:\n..x.\n....\n", /Ký tự địa hình lạ/],
      ['dia-hinh:\n....\n....\n\nvung:\nchau "X" A1 9x9', /tràn ra ngoài/],
    ];
    for (const [text, pattern] of cases) {
      expect(() => parseBoard(text), text).toThrow(pattern);
    }
  });

  it("bắt hai vùng thành chồng lên nhau", () => {
    expect(() =>
      validateBoard({
        name: "x",
        rows: 4,
        cols: 4,
        terrain: ["....", "....", "....", "...."],
        regions: [
          { id: "A", label: "Vùng A", isCapital: true, owner: "wei", anchor: "A1", width: 2, height: 2 },
          { id: "B", label: "Vùng B", isCapital: true, owner: "shu", anchor: "B2", width: 2, height: 2 },
        ],
      }),
    ).toThrow(BoardError);
  });
});

/* ---------- Danh sách người chơi dạng văn bản ---------- */

describe("danh sách người chơi dạng văn bản", () => {
  it("đọc được nước, chức vụ và tên nhiều chữ", () => {
    const roster = parseRoster(
      [
        "# ghi chú",
        "nguy chu-cong Tào Tháo",
        "thuc tuong    Trương Phi",
        "ngo  van      Trương Chiêu",
      ].join("\n"),
    );
    expect(roster).toEqual([
      { name: "Tào Tháo", kingdom: "wei", role: "LORD" },
      { name: "Trương Phi", kingdom: "shu", role: "GENERAL" },
      { name: "Trương Chiêu", kingdom: "wu", role: "CIVIL" },
    ]);
  });

  it("báo lỗi có số dòng khi sai", () => {
    expect(() => parseRoster("nguy chu-cong Tào Tháo\nxxx tuong A")).toThrow(
      /dòng 2/,
    );
    expect(() => parseRoster("nguy quan-truong A")).toThrow(RosterError);
  });
});

/* ---------- Danh sách người chơi ---------- */

describe("danh sách người chơi", () => {
  it("nhận số người tùy ý", () => {
    const state = createGame({
      players: [
        { name: "A", kingdom: "wei", role: "LORD" },
        { name: "B", kingdom: "wei", role: "GENERAL" },
        { name: "C", kingdom: "shu", role: "GENERAL" },
      ],
    });
    expect(Object.keys(state.players)).toHaveLength(3);
    // Chủ Công và Tướng lên bàn cờ, Quan Văn/Quân Sư thì không.
    expect(Object.keys(state.commanders)).toHaveLength(3);
  });

  it("chặn 2 Chủ Công cùng một nước", () => {
    expect(() =>
      validateSetup({
        players: [
          { name: "A", kingdom: "wei", role: "LORD" },
          { name: "B", kingdom: "wei", role: "LORD" },
        ],
      }),
    ).toThrow(SetupError);
  });

  it("chỉ Tướng Quân có sẵn 1000 Bộ Binh, Chủ Công không", () => {
    const state = createDefaultGame();
    const lord = Object.values(state.commanders).find((c) => c.role === "LORD")!;
    const general = Object.values(state.commanders).find(
      (c) => c.role === "GENERAL",
    )!;
    expect(totalUnits(lord.units)).toBe(0);
    expect(general.units.infantry).toBe(1000);
  });
});

/* ---------- Cú pháp lệnh ---------- */

describe("cú pháp lệnh", () => {
  it("đọc nhiều lệnh trên một dòng, bỏ qua ghi chú", () => {
    const state = game();
    const parsed = parseOrders(
      state,
      "# ghi chú\nplayer05: di C9; chieu 2000 bo\n\n",
    );
    expect(parsed).toHaveLength(2);
    expect(parsed[0].command?.type).toBe("MOVE");
    expect(parsed[0].command?.to).toBe("C9");
    expect(parsed[1].command?.type).toBe("RECRUIT");
    expect(parsed[1].command?.amount).toBe(2000);
  });

  it("nhận tên người chơi có dấu lẫn không dấu", () => {
    const state = game();
    expect(parseOrders(state, "Trương Liêu: thu")[0].command?.type).toBe("STANCE");
    expect(parseOrders(state, "truong lieu: thu")[0].command?.type).toBe("STANCE");
  });

  it("báo lỗi rõ ràng cho dòng hỏng", () => {
    const state = game();
    const parsed = parseOrders(
      state,
      [
        "player05 di C9",
        "khong-ai: di C9",
        "player05: bay len troi",
        "player05: di Z99",
      ].join("\n"),
    );
    expect(parsed[0].error).toMatch(/Thiếu dấu/);
    expect(parsed[1].error).toMatch(/Không tìm ra người chơi/);
    expect(parsed[2].error).toMatch(/Không hiểu lệnh/);
    expect(parsed[3].error).toMatch(/sai ô đích/);
  });

  it("hiểu số có dấu phân cách nghìn", () => {
    const state = game();
    expect(parseOrders(state, "player05: chieu 2.000 bo")[0].command?.amount).toBe(
      2000,
    );
  });
});

/* ---------- Soát lệnh ---------- */

describe("soát lệnh", () => {
  it("Quan Văn không cầm quân ra trận", () => {
    const state = game();
    const civil = Object.values(state.players).find((p) => p.role === "CIVIL")!;
    const [result] = validateOrders(state, parseOrders(state, `${civil.id}: di B9`));
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/không cầm quân/);
  });

  it("chặn chuyển quân giữa hai tướng khác ô", () => {
    const state = game();
    const [a, b] = Object.values(state.commanders).filter(
      (c) => c.kingdom === "wei" && c.role === "GENERAL",
    );
    place(state, a, "B9", { infantry: 5000 });
    place(state, b, "A9", { infantry: 5000 });
    const [result] = validateOrders(
      state,
      parseOrders(state, `${a.id}: gui 1000 bo -> ${b.id}`),
    );
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/không đứng cùng ô/);
  });

  it("chặn tuyển quân khi kho không đủ Tài Nguyên", () => {
    const state = game();
    state.kingdoms.wei.resources.taiNguyen = 1;
    const general = Object.values(state.commanders).find(
      (c) => c.kingdom === "wei" && c.role === "GENERAL",
    )!;
    const [result] = validateOrders(
      state,
      parseOrders(state, `${general.id}: chieu 9000 bo`),
    );
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/Tài Nguyên/);
  });

  it("chặn đi quá 1 ô", () => {
    const state = game();
    const general = commanderOf(state, "wei", 4);
    const [result] = validateOrders(
      state,
      parseOrders(state, `${general.id}: di M13`),
    );
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/1 ô theo cạnh vuông/);
  });

  it("lệnh cấp quốc gia chỉ Chủ Công hoặc Quân Sư ra được", () => {
    const state = game();
    const general = Object.values(state.players).find(
      (p) => p.kingdom === "wei" && p.role === "GENERAL",
    )!;
    const lord = Object.values(state.players).find(
      (p) => p.kingdom === "wei" && p.role === "LORD",
    )!;
    expect(
      validateOrders(state, parseOrders(state, `${general.id}: nang mo`))[0].ok,
    ).toBe(false);
    expect(
      validateOrders(state, parseOrders(state, `${lord.id}: nang mo`))[0].ok,
    ).toBe(true);
  });

  it("mùa Đông đóng băng hoạt động quân sự", () => {
    const state = game();
    state.game.season = "WINTER";
    const general = commanderOf(state, "wei", 4);
    const [result] = validateOrders(
      state,
      parseOrders(state, `${general.id}: di B8`),
    );
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/Mùa Đông/);
  });

  it("soát lệnh không đụng vào trạng thái gốc", () => {
    const state = game();
    const before = state.kingdoms.wei.resources.taiNguyen;
    const lord = Object.values(state.players).find(
      (p) => p.kingdom === "wei" && p.role === "LORD",
    )!;
    validateOrders(state, parseOrders(state, `${lord.id}: doi dan 5`));
    expect(state.kingdoms.wei.resources.taiNguyen).toBe(before);
  });
});

/* ---------- Nối lương & lương thực ---------- */

describe("nối lương và lương thực", () => {
  it("đường lương chỉ chạy trên ô của mình, không xuyên Rừng/Núi", () => {
    const state = game();
    const network = buildSupplyNetwork(state, "wei");
    // Ô Thành Trì của Ngụy nối được nhau.
    expect(network.national.get(WEI_HOME)).toBe(0);
    // Ô chưa chiếm thì chưa nối.
    expect(network.national.has("D9")).toBe(false);
  });

  it("mỗi lính ăn 1 Lúa mỗi Turn", () => {
    const state = game();
    const troops = Object.values(state.commanders)
      .filter((c) => c.kingdom === "wei")
      .reduce((sum, c) => sum + totalUnits(c.units), 0);
    const before = state.kingdoms.wei.resources.lua;
    applyGrainUpkeep(state);
    expect(state.kingdoms.wei.resources.lua).toBe(before - troops);
  });

  it("thiếu lúa thì lính chết đói đúng phần thiếu", () => {
    const state = game();
    const general = commanderOf(state, "wei", 4);
    place(state, general, WEI_HOME, { infantry: 10_000 });
    for (const other of Object.values(state.commanders)) {
      if (other.id !== general.id) other.units = { infantry: 0, archers: 0, cavalry: 0 };
    }
    state.kingdoms.wei.resources.lua = 6_000;

    applyGrainUpkeep(state);

    expect(state.kingdoms.wei.resources.lua).toBe(0);
    expect(totalUnits(general.units)).toBe(6_000);
  });

  it("ô chỉ nối vựa Châu đã cạn thì mất chủ; nối kho quốc gia thì giữ màu", () => {
    // Ngụy chiếm Lương Châu (B2-C3) và ô D3 nối vào đó, nhưng cụm này KHÔNG nối
    // về Thành Trì — đúng tình huống §5 mô tả.
    const state = game();
    for (const id of ["B2", "B3", "C2", "C3", "D3"]) {
      tileById(state, id)!.owner = "wei";
    }
    state.cities.LIANGZHOU.owner = "wei";
    state.cities.LIANGZHOU.grainReserve = 0;

    const general = commanderOf(state, "wei", 4);
    place(state, general, "D3", { infantry: 3_000 });
    for (const other of Object.values(state.commanders)) {
      if (other.id !== general.id) other.units = { infantry: 0, archers: 0, cavalry: 0 };
    }

    const [record] = applyGrainUpkeep(state).filter((r) => r.starved > 0);
    expect(record.chauOnly).toBe(true);
    expect(record.tileLost).toBe(true);
    expect(tileById(state, "D3")!.owner).toBeUndefined();
  });
});

/* ---------- Binh pháp ---------- */

describe("binh pháp", () => {
  function duel(
    setup: (state: GameState, atk: CommanderState, def: CommanderState) => void,
  ) {
    const state = game();
    const atk = commanderOf(state, "wei", 4);
    const def = commanderOf(state, "shu", 4);
    for (const other of Object.values(state.commanders)) {
      other.units = { infantry: 0, archers: 0, cavalry: 0 };
    }
    setup(state, atk, def);
    return { state, atk, def };
  }

  /** J3 (Trì Thục) → J4 → I4 → H4 → G4 → F4 → E4 → E5 → E6. */
  const SHU_TO_E6 = ["J4", "I4", "H4", "G4", "F4", "E4", "E5", "E6"];

  /**
   * Dựng một Tướng Thục (`def`) đứng cuối hành lang nối lương về Trì, rồi cho
   * một Tướng Ngụy — đóng ở Châu Ung (G5), tự túc lương Châu nên không cần
   * hành lang riêng — chiếm đúng ô G4 giữa hành lang đó, qua một lượt Go thật
   * (`resolvePhase`, không set tay field `supplied`).
   *
   * Lúa đầu Go đã phát cho `def` trước khi hành lang bị cắt (trừ lúa chạy
   * trước hành quân trong cùng lượt — §5), nên `def` sống nguyên quân; chỉ có
   * `updateSupply` cuối lượt mới đánh dấu `supplied = false`. Đúng kịch bản
   * PQ-06 "sống hết lượt, chết ở đầu Go kế" — nên bài test không cần chờ tới
   * lúc chết đói mới đánh giá sức đánh.
   */
  function cutSupplyLine() {
    const state = game();
    corridor(state, "shu", SHU_TO_E6);
    const def = commanderOf(state, "shu", 4);
    place(state, def, "E6", { infantry: 4_000 });

    tileById(state, "G5")!.owner = "wei";
    state.cities["YONGZHOU"].owner = "wei";
    const raider = commanderOf(state, "wei", 4);
    place(state, raider, "G5", { infantry: 1_000 });

    const go = run(state, `${raider.id}: di G4`);
    const order = go.report.orders[0];
    if (!order.ok) {
      throw new Error(`Cắt hành lang test hỏng: ${order.error}`);
    }

    return { state: go.state, defId: def.id };
  }

  it("đối công: bên thua mất ½, bên thắng chết 50% số đó", () => {
    const { state, atk, def } = duel((s, a, d) => {
      place(s, a, "E5", { infantry: 10_000 });
      place(s, d, "E5", { infantry: 4_000 });
      a.stance = "CONG";
      d.stance = "CONG";
    });

    const { report } = resolveTileBattle(
      state,
      "E5",
      { kingdom: "wei", commanders: [atk], moved: true },
      { kingdom: "shu", commanders: [def], moved: false },
    );

    expect(report.result).toBe("ATTACKER_WIN");
    // Bên thua mất ½ trong 4000 = 2000, bên thắng chết 50% của 2000 = 1000.
    expect(def.units.infantry).toBe(2_000);
    expect(atk.units.infantry).toBe(9_000);
  });

  it("đánh vào bên thủ mà thắng: địch mất ¼, ta chết 50% số đó", () => {
    const { state, atk, def } = duel((s, a, d) => {
      place(s, a, "E5", { infantry: 20_000 });
      place(s, d, "E5", { infantry: 4_000 });
      a.stance = "CONG";
      d.stance = "THU";
    });

    const { report } = resolveTileBattle(
      state,
      "E5",
      { kingdom: "wei", commanders: [atk], moved: true },
      { kingdom: "shu", commanders: [def], moved: false },
    );

    expect(report.result).toBe("ATTACKER_WIN");
    expect(def.units.infantry).toBe(3_000); // mất ¼ của 4000
    expect(atk.units.infantry).toBe(19_500); // chết 50% của 1000
  });

  it("đánh vào bên thủ mà thua: ta mất ½, địch chết 20% số đó", () => {
    const { state, atk, def } = duel((s, a, d) => {
      place(s, a, "E5", { infantry: 2_000 });
      place(s, d, "E5", { infantry: 10_000 });
      a.stance = "CONG";
      d.stance = "THU";
    });

    const { report } = resolveTileBattle(
      state,
      "E5",
      { kingdom: "wei", commanders: [atk], moved: true },
      { kingdom: "shu", commanders: [def], moved: false },
    );

    expect(report.result).toBe("DEFENDER_WIN");
    expect(atk.units.infantry).toBe(1_000); // mất ½ của 2000
    expect(def.units.infantry).toBe(9_800); // chết 20% của 1000
  });

  it("Kỵ bên thắng truy sát tàn binh", () => {
    const { state, atk, def } = duel((s, a, d) => {
      place(s, a, "E5", { infantry: 10_000, cavalry: 2_000 });
      place(s, d, "E5", { infantry: 4_000 });
      a.stance = "CONG";
      d.stance = "CONG";
    });

    resolveTileBattle(
      state,
      "E5",
      { kingdom: "wei", commanders: [atk], moved: true },
      { kingdom: "shu", commanders: [def], moved: false },
    );

    // Bên thua mất ½ = 2000, còn 2000 tàn binh. Bên thắng chết 1000 chia đều
    // theo tỉ lệ quân (833 Bộ + 166 Kỵ) nên còn 1834 Kỵ — và luật truy sát tính
    // trên số Kỵ *còn lại*, nên tàn binh chết thêm đúng 1834.
    expect(atk.units.cavalry).toBe(1_834);
    expect(totalUnits(def.units)).toBe(166);
  });

  it("mùa Hạ nhân đôi số lính chết", () => {
    const { state, atk, def } = duel((s, a, d) => {
      s.game.season = "SUMMER";
      place(s, a, "E5", { infantry: 10_000 });
      place(s, d, "E5", { infantry: 4_000 });
      a.stance = "CONG";
      d.stance = "CONG";
    });

    resolveTileBattle(
      state,
      "E5",
      { kingdom: "wei", commanders: [atk], moved: true },
      { kingdom: "shu", commanders: [def], moved: false },
    );

    expect(def.units.infantry).toBe(0); // ½ x2 = toàn bộ
  });

  it("mất nối lương (cắt hành lang qua resolvePhase thật) không trừ sức tấn công: quân số bằng nhau thì trận vẫn cân", () => {
    const { state, defId } = cutSupplyLine();
    const def = state.commanders[defId];
    expect(def.supplied).toBe(false);
    expect(totalUnits(def.units)).toBe(4_000); // còn nguyên quân — chưa tới lượt chết đói (PQ-06)

    const atk = commanderOf(state, "wei", 3);
    place(state, atk, "E6", { infantry: 4_000 });
    atk.stance = "CONG";
    def.stance = "CONG";

    const { report } = resolveTileBattle(
      state,
      "E6",
      { kingdom: "wei", commanders: [atk], moved: false },
      { kingdom: "shu", commanders: [def], moved: false },
    );

    expect(report.attackerPower).toBe(report.defenderPower);
    expect(report.result).toBe("STALEMATE");
  });

  it("mất nối lương (cắt hành lang qua resolvePhase thật) không trừ sức thủ ở thế Thủ", () => {
    const { state, defId } = cutSupplyLine();
    const def = state.commanders[defId];
    expect(def.supplied).toBe(false);
    def.stance = "THU";

    const side = { kingdom: "shu" as Owner, commanders: [def], moved: false };
    // E6 là Ô Trắng: không Thủ Đá, không mặt Núi kề — đúng công thức gốc
    // 1 lính = 1 Thủ, không bị trừ vì mất nối lương.
    expect(defensePower(state, side, tileById(state, "E6")!)).toBe(4_000);
  });

  it("tile.effects luôn rỗng khi mới dựng ván — lửa/lụt trong conditionModifier là hook §10 chưa cài trong §1-9", () => {
    const state = game();
    for (const tile of state.tiles) {
      expect(tile.effects).toHaveLength(0);
    }
  });

  it("Châu Thành vô chủ có 6000 Thủ Đá, Thành Trì có 8000", () => {
    const state = game();
    expect(stoneDefense(tileById(state, "B2")!)).toBe(6_000);
    expect(stoneDefense(tileById(state, "B9")!)).toBe(8_000);
    expect(stoneDefense(tileById(state, "E5")!)).toBe(0);
  });

  it("bonus Núi cộng 10% Thủ mỗi mặt núi kề", () => {
    const state = game();
    const def = commanderOf(state, "wei", 4);
    // B4 kề đúng một ô núi (B5).
    place(state, def, "B4", { infantry: 1_000 });
    const side = { kingdom: "wei" as Owner, commanders: [def], moved: false };
    expect(defensePower(state, side, tileById(state, "B4")!)).toBeCloseTo(1_100);
  });

  it("Châu Thành vô chủ cần Công trên 6000 mới chiếm được", () => {
    const state = game();
    const weak = commanderOf(state, "wei", 4);
    place(state, weak, "B2", { infantry: 5_000 });

    const outcome = resolveTileBattle(
      state,
      "B2",
      { kingdom: "wei", commanders: [weak], moved: true },
      { kingdom: "wei", commanders: [], moved: false },
    );
    expect(outcome.report.result).toBe("DEFENDER_WIN");
    expect(tileById(state, "B2")!.owner).toBeUndefined();
  });

  it("Ô Thành Trì bị phá thì thành Ô Trắng vĩnh viễn, không phải bị chiếm", () => {
    const state = game();
    const atk = commanderOf(state, "shu", 4);
    place(state, atk, "A8", { infantry: 40_000 });
    atk.stance = "CONG";

    const outcome = resolveTileBattle(
      state,
      "A8",
      { kingdom: "shu", commanders: [atk], moved: true },
      { kingdom: "wei", commanders: [], moved: false },
    );

    expect(outcome.destroyed).toBe(true);
    const tile = tileById(state, "A8")!;
    expect(tile.terrain).toBe("plains");
    expect(tile.owner).toBe("shu");
  });

  it("mất sạch 9 Ô Thành Trì thì nước sụp đổ", () => {
    let state = game();
    for (const tile of state.tiles) {
      if (tile.terrain === "capital" && tile.owner === "wei") {
        tile.terrain = "plains";
        tile.owner = "shu";
      }
    }
    state = checkVictory(state);
    expect(state.kingdoms.wei.eliminated).toBe(true);
    expect(state.game.status).toBe("RUNNING"); // còn 2 nước
  });
});

/* ---------- Tính điểm ---------- */

describe("tính điểm", () => {
  it("Trì 5 điểm, Châu 3 điểm, Ô Trắng 1 điểm", () => {
    const state = game();
    // Khởi đầu mỗi nước giữ 9 Ô Thành Trì.
    expect(calculateScore(state, "wei")).toBe(45);
    tileById(state, "D9")!.owner = "wei";
    expect(calculateScore(state, "wei")).toBe(46);
    for (const id of ["B2", "B3", "C2", "C3"]) tileById(state, id)!.owner = "wei";
    expect(calculateScore(state, "wei")).toBe(58);
  });

  it("chỉ cộng điểm vào Turn Xuân và Thu", () => {
    let state = game(); // Turn 1 = Xuân
    expect(state.kingdoms.wei.score).toBe(0);

    state = run(state, "").state; // hết Go 1
    state = run(state, "").state; // hết Atc 1 → cộng điểm, sang Turn 2 (Hạ)
    expect(state.kingdoms.wei.score).toBe(45);
    expect(state.game.season).toBe("SUMMER");

    state = run(state, "").state;
    state = run(state, "").state; // hết Turn 2 (Hạ) → không cộng
    expect(state.kingdoms.wei.score).toBe(45);
    expect(state.game.season).toBe("AUTUMN");
  });
});

/* ---------- Kinh tế ---------- */

describe("kinh tế", () => {
  it("thu nhập gồm mỏ, đất và sản lượng Quan Văn", () => {
    const state = createDefaultGame();
    const before = state.kingdoms.wei.resources.taiNguyen;
    const after = beginTurn(state).kingdoms.wei.resources.taiNguyen;
    // Mỏ cấp 1 = 3, khởi đầu chưa có Ô Trắng/Châu, 2 Quan Văn = 2.
    expect(after - before).toBe(5);
  });

  it("nâng cấp tốn Tài Nguyên và chỉ có hiệu lực từ Turn sau", () => {
    let state = game();
    const lord = Object.values(state.players).find(
      (p) => p.kingdom === "wei" && p.role === "LORD",
    )!;
    const before = state.kingdoms.wei.resources.taiNguyen;

    state = run(state, `${lord.id}: nang mo`).state;
    expect(state.kingdoms.wei.resources.taiNguyen).toBe(before - 4);
    expect(state.kingdoms.wei.buildings.mine).toBe(1); // chưa xong

    state = run(state, "").state; // hết Atc → sang Turn 2
    expect(state.kingdoms.wei.buildings.mine).toBe(2);
  });

  it("Ruộng đổi Dân lấy Lúa: 1000 Dân = 1000 Lúa ở cấp 1, mùa Thu x2", () => {
    const state = game();
    const before = state.kingdoms.wei.resources.lua;

    expect(convertLua(state, "wei", 1_000).ok).toBe(true);
    expect(state.kingdoms.wei.resources.lua - before).toBe(1_000);

    state.game.season = "AUTUMN";
    expect(convertLua(state, "wei", 1_000).ok).toBe(true);
    expect(state.kingdoms.wei.resources.lua - before).toBe(3_000);

    state.game.season = "WINTER";
    const frozen = convertLua(state, "wei", 1_000);
    expect(frozen.ok).toBe(false);
    if (!frozen.ok) expect(frozen.error).toMatch(/Mùa Đông/);
  });

  it("tuyển quân phải đứng trên Ô Thành Trì", () => {
    const state = game();
    const general = commanderOf(state, "wei", 4);
    place(state, general, "D9", { infantry: 1_000 });
    const outcome = recruit(state, general, "infantry", 1_000);
    expect(outcome.ok).toBe(false);
    if (!outcome.ok) expect(outcome.error).toMatch(/Thành Trì/);
  });

  it("Cung Thủ quy đổi từ Bộ Binh chứ không phải từ Dân", () => {
    const state = game();
    const general = commanderOf(state, "wei", 4);
    place(state, general, WEI_HOME, { infantry: 5_000 });
    const danBefore = state.kingdoms.wei.resources.dan;

    const outcome = recruit(state, general, "archers", 1_000);
    expect(outcome.ok).toBe(true);
    expect(general.units.archers).toBe(1_000);
    expect(general.units.infantry).toBe(3_000); // -2000 Bộ
    expect(state.kingdoms.wei.resources.dan).toBe(danBefore);
  });
});

/* ---------- Giải quyết lượt ---------- */

describe("giải quyết lượt", () => {
  it("hành quân 1 ô vào Ô Trắng vô chủ là chiếm được, đi 2 ô thì bị bác", () => {
    let state = game();
    const general = commanderOf(state, "wei", 4);
    place(state, general, "C9", { infantry: 2_000 }); // ô Thành Trì, có nối lương

    const tooFar = run(state, `${general.id}: di E9`);
    expect(tooFar.report.orders[0].ok).toBe(false);
    expect(tooFar.report.orders[0].error).toMatch(/1 ô theo cạnh vuông/);
    expect(tooFar.state.commanders[general.id].tileId).toBe("C9");

    state = run(state, `${general.id}: di D9`).state;
    expect(state.commanders[general.id].tileId).toBe("D9");
    expect(tileById(state, "D9")!.owner).toBe("wei");
  });

  it("hai tướng đổi chỗ cho nhau thì không giao chiến (§7)", () => {
    let state = game();
    const wei = commanderOf(state, "wei", 4);
    const shu = commanderOf(state, "shu", 4);
    corridor(state, "wei", WEI_TO_E9);
    corridor(state, "shu", SHU_TO_E8);
    place(state, wei, "E9", { infantry: 3_000 });
    place(state, shu, "E8", { infantry: 3_000 });

    const result = run(state, `${wei.id}: di E8\n${shu.id}: di E9`);
    state = result.state;

    expect(result.report.battles).toHaveLength(0);
    expect(state.commanders[wei.id].tileId).toBe("E8");
    expect(state.commanders[shu.id].tileId).toBe("E9");
  });

  it("hai nước cùng tiến vào một ô thì đánh nhau ở đó", () => {
    let state = game();
    const wei = commanderOf(state, "wei", 4);
    const shu = commanderOf(state, "shu", 4);
    corridor(state, "wei", WEI_TO_E9);
    corridor(state, "shu", SHU_TO_E8);
    place(state, wei, "D9", { infantry: 8_000 });
    place(state, shu, "E8", { infantry: 2_000 });
    wei.stance = "CONG";
    shu.stance = "CONG";

    const result = run(state, `${wei.id}: di E9\n${shu.id}: di E9`);
    state = result.state;

    expect(result.report.battles).toHaveLength(1);
    expect(commandersAt(state, "E9").map((c) => c.kingdom)).toEqual(["wei"]);
  });

  it("quân trên Rừng kề đất đã nối vẫn nhận được lương", () => {
    const state = game();
    corridor(state, "wei", WEI_TO_A6);
    const general = commanderOf(state, "wei", 4);
    place(state, general, "A5", { infantry: 3_000 }); // A5 là Rừng, kề A6

    const starved = applyGrainUpkeep(state).filter((r) => r.starved > 0);
    expect(starved).toHaveLength(0);
    expect(totalUnits(general.units)).toBe(3_000);
  });

  it("ở Rừng: sống qua Turn sau để còn kịp rút, sang Turn kế nữa mới chết bệnh", () => {
    let state = game();
    corridor(state, "wei", WEI_TO_A6);
    const general = commanderOf(state, "wei", 4);
    place(state, general, "A5", { infantry: 3_000 });

    state = run(state, "").state; // Go 1
    state = run(state, "").state; // Atc 1 → sang Turn 2
    expect(state.commanders[general.id].status).toBe("FIELD");

    state = run(state, "").state; // Go 2
    state = run(state, "").state; // Atc 2 → sang Turn 3, quá hạn
    expect(state.commanders[general.id].status).toBe("RECOVERING");
    expect(totalUnits(state.commanders[general.id].units)).toBe(0);
  });

  it("rút khỏi Rừng đúng hạn thì không sao", () => {
    let state = game();
    corridor(state, "wei", WEI_TO_A6);
    const general = commanderOf(state, "wei", 4);
    place(state, general, "A5", { infantry: 3_000 });

    state = run(state, "").state; // Go 1
    state = run(state, "").state; // Atc 1 → Turn 2
    state = run(state, `${general.id}: di A6`).state; // rút ra Ô Trắng
    expect(state.commanders[general.id].tileId).toBe("A6");

    state = run(state, "").state; // Atc 2 → Turn 3
    expect(state.commanders[general.id].status).toBe("FIELD");
    expect(totalUnits(state.commanders[general.id].units)).toBeGreaterThan(0);
  });

  it("lượt Atc không nhận lệnh hành quân", () => {
    let state = game();
    state = run(state, "").state;
    expect(state.game.phase).toBe("ATC");

    const general = commanderOf(state, "wei", 4);
    const result = run(state, `${general.id}: di B8`);
    expect(result.report.orders[0].ok).toBe(false);
    expect(result.report.orders[0].error).toMatch(/lượt Go/);
  });

  it("chạy hết 20 Turn thì phân thắng bại theo điểm", () => {
    let state = game();
    for (let i = 0; i < 40 && state.game.status === "RUNNING"; i++) {
      state = run(state, "").state;
    }
    expect(state.game.status).toBe("FINISHED");
    expect(state.victory.reason).toBe("SCORE");
    expect(state.victory.winner).not.toBeNull();
  });
});
