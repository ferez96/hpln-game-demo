/**
 * Tam Quốc Tranh Hùng — Rulebook
 * Nguồn: [Text Game] - Tam Quốc Chí.pdf
 *
 * File này là nguồn sự thật duy nhất cho mọi con số, tỉ lệ, giới hạn trong game.
 * Rules engine (rules.ts) phải import từ đây thay vì hardcode.
 */

// ─── Cấu trúc game ─────────────────────────────────────────────────────────

export const GAME_STRUCTURE = {
  players: 24,
  playersPerKingdom: 8,
  turnsPerYear: 4, // Xuân / Hạ / Thu / Đông
  maxYears: 5,
  maxTurns: 20,
  phases: ["GO", "ATC"] as const, // GO = 9h–20h, ATC = 20h–9h

  // Điều kiện chiến thắng
  victoryCondition:
    "Phá hết 9 Thành Trì của 2 nước địch, hoặc điểm cao nhất sau 20 lượt.",
} as const;

// ─── Chức vụ người chơi ────────────────────────────────────────────────────

export const ROLES = {
  LORD: {
    label: "Chủ Công",
    note: "Lãnh đạo vương quốc. Được xài Phù như Tướng.",
  },
  STRATEGIST: {
    label: "Quân Sư",
    note: "Hỗ trợ chiến lược. Không lên bản đồ chiến đấu.",
  },
  CIVIL: {
    label: "Quan Văn",
    note: "Lên bản đồ như tướng. Tự cưỡi ngựa như kỵ. Được chỉ huy + xét như lính kỵ. Không dùng Phù, Cơ Giới, Cung Bắn Công, Kỹ Năng Chiến.",
  },
  GENERAL: {
    label: "Tướng Quân",
    note: "Đơn vị chiến đấu chính. Chỉ huy tối đa 10.000 lính khi di chuyển.",
  },
} as const;

// ─── Cấp bậc tướng ─────────────────────────────────────────────────────────

export const GENERAL_RANKS = {
  GENERAL: {
    label: "Tướng Quân",
    maxTroopsMoving: 10_000, // biên chế khi di chuyển
    maxTroopsStanding: Infinity, // đứng yên chỉ huy vô hạn lính tại ô
    promotionCondition:
      "Giết 3 tướng địch liên tiếp, hoặc tốn 10 điểm Uy Danh.",
  },
  GREAT_GENERAL: {
    label: "Đại Tướng Quân",
    maxTroopsMoving: 10_000,
    maxTroopsStanding: Infinity,
    skillEffect: "+1 công và +1 thủ mỗi lính khi kích hoạt kỹ năng",
    skillCooldownTurns: 1, // delay 1 lượt
    demotedOnDefeat: true, // thua 1 lần → bị giáng về Tướng Quân
    promotionCondition:
      "Từ Chiến Tướng: giết 3 tướng địch liên tiếp → thành Đại Chiến Tướng.",
  },
  WAR_GOD: {
    label: "Chiến Tướng",
    maxTroopsMoving: 50_000,
    maxTroopsStanding: Infinity,
    cost: { resources: 20, prestige: 10 },
    activationDelay: 1, // gọi hồn đầu Turn 1, Turn 2 mới hóa thành
    maxPerKingdom: 5,
    absolutelyLoyal: true, // không phản bội, không trục xuất, không trảm đầu
    namedHeroes: [
      "TRƯƠNG PHI",
      "QUAN VŨ",
      "TRIỆU VÂN",
      "MÃ SIÊU",
      "HOÀNG TRUNG",
      "HỨA CHỬ",
      "TRƯƠNG CÁP",
      "TRƯƠNG LIÊU",
      "NHẠC TIẾN",
      "TỪ HOẢNG",
      "CAM NINH",
      "LỮ MÔNG",
      "CHU DU",
      "LỤC TỐN",
      "THÁI SỬ TỪ",
    ],
  },
} as const;

// ─── Giới hạn quân sự ──────────────────────────────────────────────────────

export const ARMY_LIMITS = {
  minToMove: 1_000, // cần ít nhất 1000 lính để di chuyển
  minToSendAlone: 1_000, // bộ binh tự đi không tướng dắt cần ≥1000
  leaveAtLeast: 1_000, // rút/gửi quân phải để lại ít nhất 1000
  maxArcherShoot: 10_000, // tối đa 10.000 cung bắn 1 lần
  maxMoveWithGeneral: 10_000,
  maxMoveWithWarGod: 50_000,
} as const;

// ─── Chỉ số đơn vị ─────────────────────────────────────────────────────────

export const UNIT_STATS = {
  infantry: {
    attack: 1,
    defense: 1,
    armorDefense: 1, // "thủ giáp"
    canCarryArrows: false,
    movementType: "normal",
  },
  archers: {
    baseAttack: 1, // không có tên
    arrowAttack: 2, // 1 cung giữ 1 tên = 2 công
    fireArrowAttack: 3, // 1 cung giữ 1 hỏa tiễn = 3 công (ưu tiên)
    defense: 1,
    armorDefense: 1,
    maxArrowsPerSoldier: 100,
    canShootDiagonal: false, // trừ trận Phong Sát
    shootRange: 1, // bắn sang 1 ô kế bên (khác ô)
    meleeStats: { attack: 1, defense: 1 }, // gặp địch cùng ô
    note: "1 tướng chỉ huy cung chỉ chọn bắn 1 trong 4 ô xung quanh mình.",
  },
  cavalry: {
    attack: 1,
    defense: 1,
    armorDefense: 1,
    canCarryArrows: false,
    hasChase: true, // Truy Cùng Giết Tận
    minForChase: 1_000, // cần ≥1000 kỵ để kích hoạt
    riverDisablesChase: true,
    canUseSpeedTalisman: true,
  },
} as const;

// ─── Địa hình ──────────────────────────────────────────────────────────────

export const TERRAIN_RULES = {
  plains: {
    label: "Ô Trắng",
    supplyPassable: true,
    capturedByEntering: true,
    note: "Đất trống kéo quân vào là chiếm được.",
  },
  forest: {
    label: "Rừng",
    supplyPassable: false, // cần Mộc Ngưu Lưu Mã
    hidesUnits: true, // ẩn đơn vị khỏi bản đồ đối thủ
    scoutCannotSee: true, // Trinh Sát không thấy được ô rừng
    note: "Cung bắn vào rừng không báo số lượng nếu chưa đủ 80%.",
  },
  mountain: {
    label: "Núi",
    supplyPassable: false,
    archerAttackBonusFromTop: 0.5, // +50% công cung đứng trên núi bắn xuống
    adjacentDefenseBonus: 0.1, // +10% thủ cho ô kề núi
    catapultAttackBonus: 0.3, // máy bắn đá trên núi +30% tổng công
    speedTalismanBonus: true, // từ núi tốc được đi 2/3 ô (siêu tốc 2/3/4)
    note: "Cần vật thông lương (Mộc Ngưu) để giữ quân trên núi nhiều lượt.",
  },
  river: {
    label: "Sông",
    supplyPassable: false,
    requiresShip: true,
    disablesCavalryChase: true,
    note: "Kỵ mã tắt kỹ năng Truy Cùng Giết Tận khi ở sông.",
  },
  city: {
    label: "Châu Thành",
    supplyPassable: true,
    stoneDefense: 6_000, // 1 ô Châu Thành = 6000 thủ đá + chỉ số lính ô đó
    immuneToFireCenter: true, // ô trung tâm miễn nhiễm hỏa phù
    grainBuffer: true, // có kho lương dự trữ cục bộ
    note: "Châu Thành ta bị cắt đường về nước nhưng còn lúa dự trữ: quân không chết đói.",
  },
  capital: {
    label: "Thành Trì",
    supplyPassable: true,
    stoneDefense: 8_000, // 1 ô Thành Trì = 8000 thủ đá + chỉ số lính ô đó
    immuneToFireCenter: true,
    isObjective: true, // phá hết 9 Thành Trì của 2 nước địch = chiến thắng
    totalPerKingdom: 9,
    note: "Tướng lính ở Thành Trì xuất phát từ đây mà không cần nối lương turn 1.",
  },
} as const;

// ─── Công thức chiến đấu ───────────────────────────────────────────────────

export const COMBAT = {
  // Địch không phòng thủ (cả 2 phe đều công)
  noDefense: {
    rule: "So xem bên nào công cao hơn, bên đó thắng.",
    loserTroopLoss: 0.5, // bên thua mất ½ số quân
    winnerLossRatio: 0.5, // bên thắng chết = 50% số quân bên thua mất
    cavalryPursuit: true, // kỵ bên thắng còn bao nhiêu, tàn binh bên thua chết thêm bấy nhiêu
  },
  // Địch phòng thủ
  vsDefender: {
    attackerWins: {
      rule: "Công ta > Thủ địch",
      defenderTroopLoss: 0.25, // địch mất ¼ quân
      attackerLossRatio: 0.5, // ta chết = 50% số quân địch mất
      cavalryPursuit: true,
    },
    defenderWins: {
      rule: "Thủ địch > Công ta",
      attackerTroopLoss: 0.5, // ta mất ½ quân chiếm đất
      defenderLossRatio: 0.2, // địch chết = 20% số quân ta mất
    },
  },
  // Cung bắn sang ô khác
  archerShoot: {
    rule: "Cung bắn ô khác — thắng hay thua, cung ta không mất quân.",
    partialDamageThreshold: 0.8, // công cung >= 80% chỉ số địch: địch vẫn mất 1/5 quân
    note: "So với tổng toàn địch 1 nước. Các nước cùng bắn → cộng dồn.",
  },
  // Mùa hạ nhân đôi thiệt hại
  summerMultiplier: 2, // Turn mùa Hạ: số lính chết mỗi phe x2
  // Thứ tự ưu tiên khi hòa điểm
  tiebreakers: [
    "Phe nhiều tướng hơn trong ô giao tranh thắng",
    "Bằng số tướng → phe đi xa hơn thua",
    "So tổng Liên Trảm (kills tích lũy)",
    "Phe có nhiều kỵ mã hơn thắng",
    "Vẫn hòa → đình chiến, tướng lính hòa tự lùi 1 ô",
  ],
} as const;

// ─── Mùa ───────────────────────────────────────────────────────────────────

export const SEASONS = {
  SPRING: {
    label: "Mùa Xuân",
    turnIndex: 1, // Turn 1, 5, 9, 13, 17
    grainMultiplier: 1,
    combatDeathMultiplier: 1,
    scored: true,
    note: "Thời tiết dễ chịu. Mọi thứ diễn ra bình thường.",
  },
  SUMMER: {
    label: "Mùa Hạ",
    turnIndex: 2, // Turn 2, 6, 10, 14, 18
    grainMultiplier: 1,
    combatDeathMultiplier: 2, // số lính chết sau giao chiến x2 (không áp cho bẫy)
    scored: false,
    note: "Lính chết thêm do Mùa Hạ vẫn xét vào mốc Tinh Binh.",
  },
  AUTUMN: {
    label: "Mùa Thu",
    turnIndex: 3, // Turn 3, 7, 11, 15, 19
    grainMultiplier: 2, // x2 số lúa làm ra trong lượt này
    combatDeathMultiplier: 1,
    scored: true,
    note: "Mùa thu hoạch bội thu.",
  },
  WINTER: {
    label: "Mùa Đông",
    turnIndex: 4, // Turn 4, 8, 12, 16, 20
    grainMultiplier: 0, // ruộng đóng băng, không làm ra lúa
    combatDeathMultiplier: 1,
    militaryFrozen: true,
    scored: false,
    frozenActions: [
      "Không công, chỉ huy, gửi-rút-đi-dời-xuất lính tướng",
      "Không dùng Phù, kỹ năng tác chiến",
      "Không xây Thao Trường và Doanh Trại",
      "Không chuyển văn/đồ/cơ giới/thuyền/lúa qua lại",
    ],
  },
} as const;

// ─── Tính điểm ─────────────────────────────────────────────────────────────

export const SCORING = {
  capitalPerTile: 5, // Thành Trì = 5 điểm mỗi ô
  cityPerTile: 3, // Châu Thành = 3 điểm mỗi ô
  plainsTile: 1, // Ô Trắng thường = 1 điểm
  scoredInSeasons: ["SPRING", "AUTUMN"] as const,
  note: "Chỉ tính điểm vào mùa Xuân và mùa Thu.",
} as const;

// ─── Đường lương ───────────────────────────────────────────────────────────

export const SUPPLY = {
  passableTerrain: ["plains", "city", "capital"] as const,
  blockedByDefault: ["forest", "mountain", "river"] as const,
  onlyOwnedTiles: true, // chỉ ô chiếm của nước mình nối lương
  diagonalDoesNotConnect: true, // ô chéo không tính là kết nối
  starvationTiming: {
    infantry: "Cuối GO (bộ, kỵ xử)",
    archers: "Cuối ATC (cung xử, tướng ẩn hiện lại)",
  },
  cityGrainBuffer: {
    rule: "Châu Thành bị cắt đường về nước nhưng còn lúa dự trữ: quân và vùng xung quanh không chết đói.",
    whenEmpty:
      "Khi lúa dự trữ Châu = 0: Châu + vùng xung quanh bại đói thành ô trắng.",
  },
  woodenOxUnlocks: ["forest", "mountain"] as const, // Mộc Ngưu thông lương qua rừng/núi
} as const;

// ─── Phù chú ───────────────────────────────────────────────────────────────

export const SPELLS = {
  cost: 3, // tất cả phù đều mua bằng 3 Tài Nguyên
  usableFrom: 2, // dùng từ Turn 2
  userRoles: ["LORD", "GENERAL"] as const,
  maxPerPersonPerTurn: 1, // 1 người 1 Turn (GO + ATC = 1 Turn) chỉ dùng 1 Phù
  purchasedAtStart: "Đầu Turn GO",

  FIRE: {
    label: "Hỏa Phù",
    usedIn: "ATC" as const,
    target: "1 trong 4 ô xung quanh",
    centerOff: "Ô ném là Ô1, Ô2 (cách 1 ô) là Ô Trung Tâm",
    area: "Ô Trung Tâm + 8 ô xung quanh (3x3)",
    immuneTiles: ["city", "capital"] as const, // trung tâm châu/trì miễn nhiễm
    duration: "Cuối Turn ATC 1 đến hết Turn ATC 2",
    burningEffect: "-1 thủ mỗi lính bị cháy trong 1 turn",
    burningRestrictions: [
      "Cháy không đánh cháy",
      "Không được di chuyển",
      "Không được tấn công",
      "Không được dùng phù",
      "Không bị tấn công trực tiếp (chỉ bị cung từ bên ngoài bắn vào)",
    ],
    note: "Hỏa gặp Thủy → ô đó ưu tiên thành Thủy.",
  },

  SPEED: {
    label: "Tốc Phù",
    usedIn: "GO" as const,
    cavalryOnly: true,
    movementBonus: 2, // đi 2 ô liên tiếp (bắt buộc 2 ô nếu có thể)
    mountainBonus: "đi 2/3 ô (Siêu Tốc 2/3/4 ô)",
    cooldownTurns: 2, // Turn 1 dùng → Turn 4 mới dùng tiếp
    restrictions: [
      "Phải bỏ Bộ, Cung, Cơ Giới, Thuyền ở lại",
      "Tướng chỉ dẫn Kỵ Mã đi theo",
      "Tốc từ Ô1 → Ô3 thì chiếm Ô3, Ô2 không chiếm",
    ],
    note: "Tốc không vượt qua Hỏa hoặc Thủy Phù. Đi xuyên qua địch, châu, trì, rừng, núi.",
  },

  WIND: {
    label: "Phong Phù",
    usedIn: "ATC" as const,
    archerRangeBonus: 1, // cung bắn xa hơn 1 ô (ô1 → ô3, ô2 không ảnh hưởng)
    fireEffect: "Nếu công >= 50% chỉ số địch: mỗi lính địch -1 thủ lần bắn đó",
    note: "Không bắn chéo. Không chọn Ô2.",
  },

  CHEER: {
    label: "Cổ Vũ",
    usedIn: "GO or ATC" as const,
    duration: "Dùng GO1 → ATC1 còn. ATC1 → GO2 mất.",
    effect: "+1 công mỗi lính đang thuộc tướng chỉ huy (1 turn)",
  },

  WATER: {
    label: "Thủy Phù",
    usedIn: "ATC" as const,
    target: "1 trong 4 ô xung quanh",
    area: "Vùng nước nầy nội (khu vực chọn)",
    duration: "Cuối Turn ATC 1 đến hết Turn ATC 2",
    immuneTiles: [] as const, // không ô nào miễn nhiễm
    immobilizes: true, // quân không thể di chuyển
    note: "Thủy Phù gặp Thủy Phù → gộp lại. Thủy không bị Hỏa ảnh hưởng.",
  },
} as const;

// ─── Kỹ năng tác chiến ─────────────────────────────────────────────────────

export const BATTLE_SKILLS = {
  cost: 2, // tất cả kỹ năng đều tốn 2 Tài Nguyên

  STEALTH: {
    label: "Kỳ Binh Ẩn Thân",
    usedIn: "GO" as const,
    durationTurns: 2,
    cooldownTurns: 2,
    conditions: [
      "Chỉ ẩn thân khi ô không có lính/tướng địch khỏe",
      "Nhiều kẻ cùng ẩn thân một ô nhưng là địch của nhau → không thể ẩn thân",
    ],
    revealedBy: [
      "Tự bắn cung/đá",
      "Dính hỏa/bẫy",
      "Bị trinh sát",
      "Địch đi vào ô",
      "Địch bắn đạt ≥50% chỉ số",
    ],
    stillCanDo: ["Đặt bẫy", "Dùng phù", "Đổi lính (nếu hợp luật)"],
  },

  TRAP: {
    label: "Đặt Bẫy",
    usedIn: "ATC" as const,
    placement: "Tại ô tướng đang đứng (ô trắng nước mình đã chiếm)",
    maxPerTile: 1,
    damage: "Địch bị giảm 1/3 số lính của ta A đang chỉ huy khi đặt bẫy",
    multipleEnemies: "Thêm kẻ dính bẫy → chia đều 1/3 đó",
    damageFirst: true, // giảm lính trước, giao chiến sau
    caveat: "Kỵ Mã dùng Tốc Phù đạp bẫy → chết lính và tự lùi lại ô trước",
    destroyedBy: ["Thủy/Hỏa Phù ném vào ô bẫy", "Cung bắn làm ô thành vô chủ"],
  },

  SCOUT: {
    label: "Trinh Sát",
    usedIn: "ATC" as const,
    area: "1 vùng 2x2 (chọn 1 trong 4 ô xung quanh làm tâm)",
    reveals: [
      "Số lượng địch",
      "Từng loại quân lính",
      "Thuyền",
      "Cơ giới",
      "Trận pháp",
      "Địch ẩn thân",
      "Bẫy đã đặt (không thấy chỉ số bẫy)",
    ],
    cannotSee: [
      "Ô rừng",
      "Lúa",
      "Tên/đạn",
      "Bát quái/kỳ",
      "Phù",
      "Văn ngủ",
      "Không gian ảo",
      "Cấp công nghệ",
    ],
    note: "PM GM trong giữa Turn ATC, GM trả kết quả ngay trong Turn ATC đó.",
  },
} as const;

// ─── Trận pháp ─────────────────────────────────────────────────────────────

export const FORMATIONS = {
  activationCost: "X điểm Uy Danh (X = số tướng tham gia trận)",
  maxOneFormationPerCommander: true,
  duration: "Kích hoạt GO 1, duy trì ATC 1, hết ATC 1 hết trận",

  NGU_LAN: {
    label: "Ngư Lân Trận",
    minGenerals: 2,
    maxGenerals: 4,
    arrangement: "Ít nhất 1 hàng chéo",
    defenseBonus: {
      2: 1.0, // tổng thủ riêng lính 2 kẻ tăng 100%
      3: 2.0, // tổng thủ riêng lính 3 kẻ tăng 200%
      4: 3.0, // tổng thủ riêng lính 4 kẻ tăng 300%
    },
    note: "Tướng trong trận bật thủ. Nếu có tướng công → lính đó và lính không ai chỉ huy bật công.",
  },

  TRUONG_XA: {
    label: "Trường Xà Trận",
    minGenerals: 3,
    general1AttackBonus: 1.0, // tổng công riêng lính tướng 1 tăng 100%
    general2AttackPenalty: -0.1, // tổng công riêng lính tướng 2 giảm 10%
    ambush: {
      label: "Thiên La Địa Võng",
      trigger: "Địch tại ô X không đạt gấp đôi tổng chỉ số 3 tướng trận ta",
      effect:
        "Địch bị giảm thêm 50% sức mạnh cuối còn lại (xét lại lần 2 ở ATC)",
    },
  },

  THAT_TINH: {
    label: "Thất Tinh Trận",
    minGenerals: 5,
    general1AttackBonus: 2.35, // tăng 235%
    general2AttackPenalty: -0.1,
    general3AttackPenalty: -0.25,
    ambush: "Thiên La Địa Võng (xét 3 tướng như Trường Xà)",
    special: {
      label: "Trấn Áp",
      effect:
        "Tướng địch đi vào vùng 3x3 không thể ẩn thân. Tướng đang ẩn → lập tức hiện thân.",
    },
  },

  NHAN_HANH: {
    label: "Nhạn Hành Trận",
    minGenerals: 3,
    arrangement: "3 tướng thẳng hàng (ngang hoặc dọc)",
    general1ArcherBonus: 1.0, // cung tướng 1 bắn trái-phải tăng 100%
    cavalryVsAboveBelow: +1.0, // bộ, kỵ đánh địch từ trên/dưới tăng 100%
    cavalryVsLeftRight: -0.25, // bộ, kỵ đánh địch từ trái/phải giảm 25%
    note: "Chỉ áp Turn GO. Xét hướng theo ô kế đích và ô đích tướng đi.",
  },

  YEN_NGUYET: {
    label: "Yển Nguyệt Trận",
    minGenerals: 3,
    arrangement: "3 tướng thẳng hàng (ngang hoặc dọc)",
    general1CavalryBonus: 1.35, // tổng công riêng kỵ tướng 1 tăng 135%
    general2Effect: "Lính tướng 2: GO sau đứng yên 1 turn",
    general3AttackPenalty: -0.2,
  },

  PHONG_SAT: {
    label: "Phong Sát Trận",
    minGenerals: 5,
    general1ArcherBonus: 3.0, // tổng công cung tướng 1 tăng 300%
    general1CanShootDiagonal: true, // với tháp hoặc phong phù
    general2ArcherPenalty: -0.25,
    note: "Tướng 1 chọn bắn thẳng hoặc chéo. Tướng 2 chỉ bắn thẳng.",
  },

  TRUY_HINH: {
    label: "Trùy Hình Trận",
    minGenerals: 3,
    arrangement: "3 tướng thành 1 hàng chéo",
    condition: "Không dùng được nếu trong 9 ô có thủy/hỏa",
    antiSpell: {
      effect: "Dập Thủy và Hỏa Phù trong vùng 3x3 (9 ô)",
      note: "Dập ô trung tâm hỏa → toàn bộ hỏa phù bị dập",
    },
    selfPenalty: -0.1, // toàn bộ ta trong 9 ô: -10% công và thủ
  },
} as const;

// ─── Mốc Tinh Binh (Elite unlock) ──────────────────────────────────────────

export const ELITE_UNLOCKS = {
  note: "Kill milestone phải chia đều 2 nước địch (VD: 12k kills = mỗi nước địch 6k).",

  MOC_NGUU: {
    label: "Mộc Ngưu Lưu Mã",
    killMilestone: 12_000,
    eachEnemyKills: 6_000,
    buyCost: 1,
    effect:
      "Khai thông lương trên Núi và Rừng. Văn cầm mới tác dụng. 1 văn cầm 1 cái.",
    note: "Văn + Trâu ở Núi/Rừng thì khai thông lương. Bại hủy như Xe.",
  },

  DOANH_TRAI: {
    label: "Doanh Trại",
    killMilestone: 12_000, // cùng mốc Mộc Ngưu
    eachEnemyKills: 6_000,
    buyCost: 1,
    immuneToFire: true,
    buildDelay: 1, // xây cuối GO 1, đầu ATC 1 xong, đầu GO 2 dùng được
    effect:
      "Tướng/lính/văn bại trong 5 ô xung quanh có thể chọn dưỡng tại đây (không về Trì).",
  },

  THAO_TRUONG: {
    label: "Thao Trường",
    killMilestone: 12_000,
    buyCost: 1,
    immuneToFire: true,
    buildDelay: 1,
    canBuy: ["Bộ", "Cung", "Kỵ", "Dân", "Tiễn", "Thuyền", "Cơ giới", "Trâu gỗ"],
    note: "Không mua lúa tại Thao Trường.",
  },

  KY_TAY_LUONG: {
    label: "Kỵ Tây Lương",
    killMilestone: 24_000,
    eachEnemyKills: 12_000,
    upgradeCost: 10, // điểm Uy Danh
    effects: [
      "Kỵ mã +1 công trên bờ",
      "Tốc Phù delay giảm còn 1 turn (Turn 1 dùng → Turn 3 dùng tiếp)",
    ],
  },

  MA_CUNG_THU: {
    label: "Mã Cung Thủ",
    killMilestone: 36_000,
    eachEnemyKills: 18_000,
    upgradeCost: 10,
    effects: [
      "Cung thủ có ngựa riêng",
      "Dùng Tốc Phù như kỵ mã",
      "Giữ 3 hiệu ứng ngựa: Sức Chạy, Móng Ngựa, Kỵ Tây Lương (nếu đã nâng cấp)",
      "Không có Truy Cùng Giết Tận",
      "Không được +1 công Kỵ Tây Lương",
    ],
  },

  CHIEN_XA: {
    label: "Chiến Xa Mã",
    killMilestone: 48_000,
    eachEnemyKills: 24_000,
    upgradeCost: 5,
    buyCost: 2,
    maxPerCommander: 1,
    effects: [
      "Chở Kỵ Mã tối đa theo biên chế tướng",
      "Kỵ trên xa 'Ngự Hỏa': không bị lửa cháy, dời, cản; thế công như thường",
      "Được Tốc Phù",
    ],
  },

  THAP_BAN_TEN: {
    label: "Tháp Bắn Tên",
    killMilestone: 48_000,
    eachEnemyKills: 24_000,
    upgradeCost: 5,
    buyCost: 2,
    maxPerCommander: 1,
    effects: [
      "Giúp cung trên tháp bắn xa 2 ô",
      "Phong Phù (cả Siêu Phù) bắn xa 3 ô",
      "Trinh Sát thấy vùng 2x3 (ngang hoặc dọc)",
    ],
  },

  MAY_BAN_DA: {
    label: "Máy Bắn Đá",
    killMilestone: 48_000,
    eachEnemyKills: 24_000,
    upgradeCost: 5,
    buyCost: 3,
    maxPerCommander: 1,
    boDamageRatio: 300, // mỗi 100 bộ trên máy = +300 công khi bắn Châu/Trì/Công trình
    mountainBonus: 0.3, // +30% tổng công khi máy trên núi
    rockCost: { resources: 1, amount: 10_000 }, // 1 TN = 10.000 đá
    note: "Phong Phù bắn xa 2 ô. Thủ không bắn trả. 1 tướng 1 ATC chỉ chọn 1: bắn đá hoặc bắn cung.",
  },

  NO_LIEN_CHAU: {
    label: "Nỏ Liên Châu",
    killMilestone: 60_000,
    eachEnemyKills: 30_000,
    upgradeCost: 10,
    effects: [
      "Cung bắn 2 lần trong 1 Turn ATC (2 ô khác nhau, kể cả khác hướng)",
      "1 TN = 4.000 tên thường",
      "1 TN = 2.000 hỏa tiễn",
    ],
  },
} as const;

// ─── Thuyền ────────────────────────────────────────────────────────────────

export const SHIPS = {
  maxTypesPerCommander: 3, // cầm cùng lúc cả 3 loại, mỗi loại 1 cái
  buyCost: 1,
  cannotCarry: ["Xe Đục Thành", "Chiến Xa Mã", "Tháp Bắn Tên", "Máy Bắn Đá"],
  canCarry: ["Mộc Ngưu Lưu Mã"],

  FISHING: {
    label: "Thuyền Đánh Cá",
    effect: "Thu hoạch cá (tài nguyên) khi ở sông",
    levels: {
      1: { desc: "Mặc định, chỉ cần mua", upgradeCost: 0 },
      2: { desc: "", upgradeCost: 2 },
      3: { desc: "", upgradeCost: 3 },
    },
  },
  SUPPLY: {
    label: "Thuyền Kho Lương",
    effect: "Vận chuyển lúa trên sông",
    levels: {
      1: { desc: "Mặc định", upgradeCost: 0 },
      2: { desc: "", upgradeCost: 2 },
      3: { desc: "", upgradeCost: 3 },
    },
  },
  TRAINING: {
    label: "Thuyền Huấn Luyện",
    levels: {
      1: { shoreStrength: 0.5, riverStrength: 0.7, upgradeCost: 0 },
      2: { shoreStrength: 0.75, riverStrength: 1.0, upgradeCost: 2 },
      3: { shoreStrength: 1.0, riverStrength: 1.3, upgradeCost: 3 },
    },
    note: "Không có thuyền huấn luyện: giữ 0% sức mạnh trên sông, 25% khi lên bờ.",
  },
} as const;

// ─── Công trình — thu nhập ─────────────────────────────────────────────────

export const BUILDINGS = {
  mine: {
    label: "Mỏ",
    goldPerLevel: 3, // cấp X → +3X vàng/lượt
    maxLevel: 3,
    upgradeCost: 2, // mất 2 Tài Nguyên mỗi lần nâng cấp
    upgradeDelay: 1, // nâng Turn 1 → Turn 2 mới dùng được
  },
  farm: {
    label: "Ruộng",
    grainPerLevel: 3_000, // cấp X → +3000X lúa/lượt (x2 mùa Thu, 0 mùa Đông)
    maxLevel: 3,
    upgradeCost: 2,
    upgradeDelay: 1,
  },
  populationHouse: {
    label: "Nhà Dân",
    popPerLevel: 2_000, // cấp X → +2000X dân/lượt
    maxLevel: 3,
    upgradeCost: 2,
    upgradeDelay: 1,
  },
  barracks: {
    label: "Bộ Binh",
    unitType: "infantry" as const,
    levels: 3,
  },
  archery: {
    label: "Cung Thủ",
    unitType: "archers" as const,
    levels: 3,
  },
  stable: {
    label: "Kỵ Mã",
    unitType: "cavalry" as const,
    levels: 3,
  },
  forgeWeapon: {
    label: "Rèn Vũ Khí",
    effect: "Nâng công cho đơn vị tương ứng",
    levels: 3,
  },
  forgeArmor: {
    label: "Rèn Khiên",
    effect: "Nâng thủ cho đơn vị tương ứng",
    levels: 3,
  },
  shipyard: {
    label: "Xưởng Thuyền",
    levels: 3,
  },
  siegeWorkshop: {
    label: "Xưởng Cơ Giới",
    levels: 3,
  },
} as const;

// ─── Chi phí mua quân ──────────────────────────────────────────────────────

export const RECRUITMENT = {
  batchSize: 1_000,
  goldCostPerBatch: 1, // 1 Tài Nguyên vàng / 1000 lính
  populationCostPer1: 2, // 1 lính tiêu tốn 2 dân
} as const;

// ─── Nhân vật đặc biệt ─────────────────────────────────────────────────────

export const SPECIAL_CHARACTERS = {
  HUA_DA: {
    label: "Hoa Đà",
    cost: 5, // 5 Dân Tâm
    effect: "Chữa thương cho tướng",
  },
  TA_TU: {
    label: "Tả Từ",
    cost: 7,
    effect: "Phép thuật đặc biệt",
  },
  THUY_KINH: {
    label: "Thủy Kính",
    cost: 10,
    effect: "Cố vấn / dạy nghề",
  },
} as const;
