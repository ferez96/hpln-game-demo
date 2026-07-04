#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Trình dựng "graph-based model" cho luật Tam Quốc Tranh Hùng.

Nguồn sự thật:  reference/Tam Quoc Chi - full text.txt (luật đầy đủ).
Đầu ra:
  - data/rules-graph.json           (mô hình đồ thị: nodes + edges có kiểu)
  - docs/wiki/assets/rules-graph.html (viz tương tác, dữ liệu nhúng inline)

Chạy:  python3 data/build_rules_graph.py
Không cần thư viện ngoài (chỉ dùng stdlib json).
"""
import sys, json, pathlib
sys.stdout.reconfigure(encoding="utf-8")

ROOT = pathlib.Path(__file__).resolve().parent.parent

# ─────────────────────────────────────────────────────────────────────────────
# DOMAINS — trục màu (categorical). Mỗi domain 1 slot trong bảng màu dataviz đã
# được validate (light: adjacent ΔE 24.2 / all-pairs 11.2 floor; dark: violet đã
# chỉnh #6f56c9 để thoát va chạm blue↔violet). Màu là gợi ý nhóm; danh tính thật
# do NHÃN + BỘ LỌC + BẢNG CHI TIẾT gánh (secondary encoding bắt buộc cho CVD).
# ─────────────────────────────────────────────────────────────────────────────
DOMAINS = {
    "role":     {"label": "Chức vụ",            "light": "#2a78d6", "dark": "#3987e5"},
    "resource": {"label": "Tài nguyên & Điểm",  "light": "#1baf7a", "dark": "#199e70"},
    "military": {"label": "Quân sự",            "light": "#eda100", "dark": "#c98500"},
    "economy":  {"label": "Hậu cần & Công trình","light": "#008300", "dark": "#008300"},
    "terrain":  {"label": "Địa hình",           "light": "#4a3aa7", "dark": "#6f56c9"},
    "mystic":   {"label": "Huyền bí",           "light": "#e34948", "dark": "#e66767"},
    "tactics":  {"label": "Chiến thuật",        "light": "#e87ba4", "dark": "#d55181"},
    "system":   {"label": "Cơ chế & Thời gian", "light": "#eb6834", "dark": "#d95926"},
}

# ─────────────────────────────────────────────────────────────────────────────
# EDGE TYPES — trục quan hệ. Chỉ 2 loại "kinh tế" (produces/costs) mang màu status
# (được/mất); còn lại trung tính, phân biệt bằng nét + bộ lọc + nhãn khi hover.
# `dir`: 1 chiều (source→target) hay 2 chiều (khắc chế / kề nhau).
# ─────────────────────────────────────────────────────────────────────────────
EDGE_TYPES = {
    "produces":   {"label": "sản xuất",   "hint": "A sinh ra B mỗi turn / khi chiếm", "style": "produces", "dir": "one"},
    "costs":      {"label": "tốn / nguyên liệu", "hint": "Tạo/mua/duy trì A phải tiêu B", "style": "costs", "dir": "one"},
    "upgrades":   {"label": "tiến hóa thành", "hint": "A nâng cấp / tiến hóa thành B", "style": "upgrades", "dir": "one"},
    "requires":   {"label": "cần trước",   "hint": "Phải có B mới có/mới dùng được A", "style": "requires", "dir": "one"},
    "enables":    {"label": "mở khóa / dạy thành", "hint": "A mở khóa hoặc biến ai đó thành B", "style": "enables", "dir": "one"},
    "boosts":     {"label": "tăng chỉ số", "hint": "A buff/khuếch đại B", "style": "boosts", "dir": "one"},
    "carries":    {"label": "chở / mang",  "hint": "Cơ giới/thuyền chở B", "style": "carries", "dir": "one"},
    "stores":     {"label": "trữ tại",     "hint": "B là kho chứa của A (lúa…)", "style": "stores", "dir": "one"},
    "transforms": {"label": "biến thành",  "hint": "Khi bị phá/mất, A biến thành B", "style": "transforms", "dir": "one"},
    "heals":      {"label": "trị / hồi",   "hint": "A hồi phục cho B", "style": "heals", "dir": "one"},
    "counters":   {"label": "khắc chế / miễn nhiễm", "hint": "A khắc chế hoặc miễn nhiễm B", "style": "counters", "dir": "both"},
    "affects":    {"label": "tác động",    "hint": "Thời tiết/cơ chế tác động lên B", "style": "affects", "dir": "one"},
    "timing":     {"label": "diễn ra ở",   "hint": "A chỉ dùng/xảy ra trong pha B", "style": "timing", "dir": "one"},
    "contains":   {"label": "gồm",         "hint": "A bao gồm B", "style": "contains", "dir": "one"},
}

# ─────────────────────────────────────────────────────────────────────────────
# NODES — (id, label, domain, category, desc)
# ─────────────────────────────────────────────────────────────────────────────
N = [
    # ── Chức vụ ────────────────────────────────────────────────────────────
    ("lord", "Chủ Công", "role", "Chức vụ", "Lãnh đạo 1 nước. Mỗi turn ra 1 Đế Khí. Xét duyệt/chiêu nạp/trảm/trục. Có skill Đại Tướng, không bị giáng cấp, không thể phản bội."),
    ("strategist", "Quân Sư", "role", "Chức vụ", "Chốt lệnh hậu cần & chiến sự cho GM theo đa số Quan Văn. Không lên bản đồ. Có thể bị Chủ Công trảm bất cứ lúc nào."),
    ("civil", "Quan Văn", "role", "Chức vụ", "Mỗi turn ra 1 Tài Nguyên + 1 Dân Tâm (từ năm 2: 2 TN). Lo hậu cần & phát triển. Ra Sa Trường như kỵ nhưng không cầm Phù/Cơ giới/cung công."),
    ("general", "Tướng Quân", "role", "Chức vụ", "Mỗi turn ra 1 Uy Danh. Cầm quân đánh trận (mặc định 1000 bộ đầu game). Biên chế 10.000 lính khi di chuyển."),
    ("grand-general", "Đại Tướng Quân", "role", "Chức vụ", "Nâng từ Tướng Quân. Skill Đại Tướng: +1 Công +1 Thủ mỗi lính (1 turn, delay 1 turn). Thua 1 lần bị giáng lại."),
    ("war-general", "Chiến Tướng", "role", "Chức vụ", "Nhập hồn từ Tướng có tư chất. Biên chế 50.000 lính/cung. Trung thành tuyệt đối: không phản, không bị trảm/trục. Tối đa 5/nước."),

    # ── Tài nguyên & Điểm ──────────────────────────────────────────────────
    ("resource", "Tài Nguyên", "resource", "Tài nguyên", "Đơn vị kinh tế chính. Mua lính, đồ, phù, nâng cấp. Về không gian ảo dù không kết nối."),
    ("population", "Dân", "resource", "Tài nguyên", "Mua từ Nhà Dân bằng Tài Nguyên. Nguyên liệu đổi ra Lúa (mất dân) và tuyển Bộ Binh."),
    ("grain", "Lúa", "resource", "Tài nguyên", "Nuôi lính mỗi turn; thiếu là chết đói. Ăn theo khoảng cách vựa. Không nuôi dân."),
    ("morale", "Dân Tâm", "resource", "Điểm quốc gia", "Quan Văn sinh ra. Chủ Công tiêu: mời Hoa Đà (5), Tả Từ (7), Thủy Kính (10)."),
    ("prestige", "Uy Danh", "resource", "Điểm quốc gia", "Tướng sinh ra. Tiêu để thăng Đại Tướng (10), Nhập Hồn (10), lập Trận (X), nâng cấp Tinh Binh."),
    ("imperial", "Đế Khí", "resource", "Điểm quốc gia", "Chủ Công ra 1/turn. Có thể đổi ra 1 Dân Tâm hoặc 1 Uy Danh."),
    ("score", "Điểm Lãnh Thổ", "resource", "Điểm thắng", "Cuối Xuân/Thu: Trì +5, Châu +3, Ô Trắng +1. Cộng dồn 5 năm để xét thắng."),

    # ── Quân sự: lính ──────────────────────────────────────────────────────
    ("infantry", "Bộ Binh", "military", "Lính", "1 Công / 1 Thủ. Nền tảng; là nguyên liệu cho Cung & Kỵ. Không cầm tên."),
    ("archer", "Cung Thủ", "military", "Lính", "Bắn khác ô (1 trong 4 ô). Cầm tên = 2 Công, hỏa tiễn = 3 Công. Tấn công chủ yếu ban đêm (Atc)."),
    ("cavalry", "Kỵ Mã", "military", "Lính", "Chỉ số như bộ. Nội tại Truy Cùng Giết Tận. Kết hợp Tốc Phù. Cần ≥1000 kỵ để kích truy sát."),
    ("xiliang", "Kỵ Tây Lương", "military", "Lính (Tinh Binh)", "Nâng từ Kỵ Mã (mốc 24k kill). +1 Công/kỵ trên bờ; Tốc Phù chỉ còn delay 1 turn."),
    ("mounted-archer", "Mã Cung Thủ", "military", "Lính (Tinh Binh)", "Nâng từ Cung Thủ (mốc 36k). Cung có ngựa, dùng được Tốc Phù. Không có truy sát, không +1 công Tây Lương."),

    # ── Quân sự: cơ giới ───────────────────────────────────────────────────
    ("ram", "Xe Đục Thành", "military", "Cơ giới", "Chở bộ; mỗi bộ +2..4 Công khi đục Châu/Trì địch. 1 tướng 1 xe. Bỏ ở ô lạ thì cuối Go hủy."),
    ("chariot", "Chiến Xa Mã", "military", "Cơ giới (Tinh Binh)", "Chở Kỵ Mã, được Tốc Phù. Kỵ trên xa 'ngự hỏa' không bị cháy. Mốc 48k kill."),
    ("arrow-tower", "Tháp Bắn Tên", "military", "Cơ giới (Tinh Binh)", "Chở Cung; giúp bắn xa 2 ô, Trinh Sát 2x3. Mốc 48k kill."),
    ("catapult", "Máy Bắn Đá", "military", "Cơ giới (Tinh Binh)", "Bắn Atc; mỗi 100 bộ +300 Công khi phá Châu/Trì/công trình. Trên núi +30%. 1 TN = 10.000 đá."),
    ("wooden-ox", "Mộc Ngưu Lưu Mã", "military", "Cơ giới (Tinh Binh)", "Trâu gỗ. Văn cầm để khai thông lương trên Núi/Rừng. Mốc 12k kill."),
    ("crossbow", "Nỏ Liên Châu", "military", "Cơ giới (Tinh Binh)", "Cung chủ động bắn 2 ô/turn. Giảm giá tên. Mốc 60k kill."),

    # ── Quân sự: thuyền & đạn ──────────────────────────────────────────────
    ("fishing-boat", "Thuyền Đánh Cá", "military", "Thuyền", "Trên sông mỗi turn về 4..6 Tài Nguyên. 1 ô sông 1 thuyền khai thác."),
    ("grain-boat", "Thuyền Kho Lương", "military", "Thuyền", "Vựa lúa di động, chứa 100.000 lúa; tiếp lương cho quân qua sông."),
    ("training-boat", "Thuyền Huấn Luyện", "military", "Thuyền", "Giữ 75..130% sức mạnh khi lên bờ / trên sông (tránh say sóng)."),
    ("arrows", "Tên Thường", "military", "Đạn", "1 TN = 2000..4000 tên. Mỗi cung cầm ≤100. Cung cầm tên = 2 Công."),
    ("fire-arrows", "Hỏa Tiễn", "military", "Đạn", "1 TN = 1000..2000. Cung = 3 Công (ưu tiên). Xuyên/đáp ô Thủy, đốt khi bắn (≠ Hỏa Phù)."),
    ("stones", "Đá", "military", "Đạn", "Đạn cho Máy Bắn Đá. 1 TN = 10.000 đá, mua tại chỗ đầu Atc, dư thì hủy."),

    # ── Hậu cần & Công trình ───────────────────────────────────────────────
    ("mine", "Mỏ", "economy", "Khai thác", "Ra 3/5/7 Tài Nguyên/turn theo cấp. Nâng cấp tốn 4..5 TN."),
    ("pop-house", "Nhà Dân", "economy", "Khai thác", "1 Tài Nguyên đổi 2000..4000 Dân theo cấp."),
    ("farm", "Ruộng", "economy", "Khai thác", "Đổi 1000 Dân = 1000..3000 Lúa. Mùa Đông đóng băng, 0 lúa."),
    ("barracks", "Khu Quân Sự", "economy", "Đào tạo", "Trại lính: Tài Nguyên + Dân/Bộ → Bộ/Cung/Kỵ theo biên chế cấp."),
    ("forge-weapon", "Lò Rèn Vũ Khí", "economy", "Rèn", "Đồng/Sắt/Thép: +1..3 Công cho toàn bộ quân trong nước."),
    ("forge-armor", "Lò Rèn Khiên", "economy", "Rèn", "Khiên Đồng/Sắt/Thép: +1..3 Thủ cho toàn bộ quân trong nước."),
    ("camp", "Doanh Trại", "economy", "Công trình dã chiến", "Văn xây/coi trên Ô Trắng. Vựa lúa + nơi dưỡng thương. Miễn nhiễm Hỏa như thành."),
    ("drill", "Thao Trường", "economy", "Công trình dã chiến", "Văn xây/coi trên Ô Trắng. Mua dân/tên/thuyền/cơ giới & đào tạo lính tại chỗ (không mua lúa)."),

    # ── Địa hình ───────────────────────────────────────────────────────────
    ("citadel", "Ô Thành Trì", "terrain", "Ô chủ lực", "9 ô/nước, 8000 Thủ đá. Vựa lúa, nơi xuất quân. Phá hết 9 → nước sụp đổ. Không xây lại."),
    ("province", "Châu Thành", "terrain", "Ô đặc biệt", "6000 Thủ địa phương, +3 Tài Nguyên & +3 Điểm/turn. Vựa lúa (chỉ chứa, không tạo)."),
    ("white-tile", "Ô Trắng", "terrain", "Ô thường", "Chiếm được: +1 Tài Nguyên/turn, +1 Điểm. Nơi xây Doanh/Thao & đặt Bẫy."),
    ("forest", "Rừng", "terrain", "Ô không chiếm", "Ẩn map + miễn Trinh Sát. Ở >1 turn chết bệnh. Cháy thì hiện & chết. Cấm nối lương (trừ Trâu)."),
    ("mountain", "Núi", "terrain", "Ô không chiếm", "Ở cạnh +10% Thủ; Cung trên núi +50% Công; Máy Bắn Đá +30%. Ở >1..2 turn chết bệnh."),
    ("river", "Sông", "terrain", "Ô không chiếm", "Ở nhiều turn nếu có thuyền. Cần thuyền để vào. Kỵ tắt truy sát trên sông."),

    # ── Huyền bí: Phù ──────────────────────────────────────────────────────
    ("fire-talisman", "Hỏa Phù", "mystic", "Phù", "Dùng Atc. Tạo vùng lửa 5 ô; -1 Thủ/lính, miễn nối lương 1 turn. Châu/Trì miễn nhiễm."),
    ("water-talisman", "Thủy Phù", "mystic", "Phù", "Dùng Atc. Vùng mưa giữ chân quân, chặn gửi/rút. Không ô nào miễn nhiễm. Hỏa gặp Thủy → Thủy."),
    ("speed-talisman", "Tốc Phù", "mystic", "Phù", "Dùng Go, chỉ Kỵ. Đi 2..4 ô liên tiếp. Miễn nối lương Go đó. Delay 2 turn (Tây Lương: 1)."),
    ("wind-talisman", "Phong Phù", "mystic", "Phù", "Dùng Atc. Cung bắn xa +1 ô (Ô1→Ô3). Địch dính -1 Thủ (cộng dồn với Hỏa tối đa -2)."),
    ("rally-talisman", "Cổ Vũ", "mystic", "Phù", "Dùng Go/Atc. +1 Công mỗi lính thuộc tướng chỉ huy (1 turn)."),
    ("super-talisman", "Siêu Phù", "mystic", "Phù", "Bát Quái chế miễn phí: Siêu Tốc (+1 ô), Siêu Phong (+1 ô), Siêu Cổ Vũ (+2 Công)."),
    ("huatuo", "Thần Y Hoa Đà", "mystic", "Danh nhân", "Đổi Dân Tâm/Uy Danh: trị thương, giảm turn dưỡng cho người nước mình. Cả 3 nước mời chung 1 turn."),
    ("zuoci", "Pháp Sư Tả Từ", "mystic", "Danh nhân", "Đổi 7 Dân Tâm dạy 1 người thành Bát Quái. Không dạy Chủ Công."),
    ("shuijing", "Thủy Kính Tiên Sinh", "mystic", "Danh nhân", "Đổi 10 Dân Tâm dạy 1 người thành Bát Kỳ. Không dạy Chủ Công."),
    ("bagua", "Bát Quái", "mystic", "Trạng thái", "Do Tả Từ dạy. Võ: xài 2 phù khác loại/turn. Văn: chế 1 Siêu Phù/turn."),
    ("baqi", "Bát Kỳ", "mystic", "Trạng thái", "Do Thủy Kính dạy. Văn: X5 Tài Nguyên đến hết game. Tướng: tư chất hóa Chiến Tướng."),

    # ── Chiến thuật: kỹ năng & trận ────────────────────────────────────────
    ("stealth", "Ẩn Thân", "tactics", "Kỹ năng", "Go, 2 TN. Ẩn map 2 turn (kể cả đồ mang theo). Bị hiện nếu bắn/dính hỏa/bị trinh sát. Delay 2 turn."),
    ("trap", "Đặt Bẫy", "tactics", "Kỹ năng", "Atc, 2 TN, trên Ô Trắng của mình. Địch đạp: -1/3 lính tướng đặt bẫy. Kỵ tốc đạp thì lùi ô."),
    ("scout", "Trinh Sát", "tactics", "Kỹ năng", "Atc, 2 TN. Soi vùng 2x2: số & loại quân/thuyền/cơ giới/trận/ẩn/bẫy. Không thấy Rừng."),
    ("pursuit", "Truy Cùng Giết Tận", "tactics", "Kỹ năng nội tại", "Kỵ Mã (≥1000): thắng thì giết thêm tàn binh bằng số kỵ còn lại. Tắt khi trên sông."),
    ("formation", "Trận Pháp", "tactics", "Hệ thống", "Nối nhóm tướng đúng vị trí để buff %. Tốn X Uy Danh (X người). Lập Go, giữ hết Atc."),
    ("yulin", "Ngư Lân Trận", "tactics", "Trận", "2..4 tướng, bật Thủ. Mỗi tướng thêm +100% Thủ (riêng lính từng tướng)."),
    ("changshe", "Trường Xà Trận", "tactics", "Trận", "3 tướng. Lính tướng 1 +100% Công, tướng 2 -10%. Kèm Thiên La Địa Võng."),
    ("qixing", "Thất Tinh Trận", "tactics", "Trận", "5 tướng. Lính tướng 1 +235% Công. Kèm Thiên La + 'Trấn Áp' (khóa ẩn thân)."),
    ("yanhang", "Nhạn Hành Trận", "tactics", "Trận", "3 tướng thẳng hàng. Cung tướng 1 bắn 2 bên +100%. Bộ/Kỵ +100% khi đánh trên/dưới."),
    ("yanyue", "Yển Nguyệt Trận", "tactics", "Trận", "3 tướng thẳng hàng. Kỵ tướng 1 +135% Công; tướng 2 phải đứng yên 1 turn sau."),
    ("fengsha", "Phong Sát Trận", "tactics", "Trận", "5 tướng. Cung tướng 1 +300% Công, được bắn chéo (Tháp/Phong). Chuyên cung."),
    ("chuixing", "Trùy Hình Trận", "tactics", "Trận", "3 tướng hàng chéo. Dập Thủy/Hỏa trên vùng 3x3. Toàn quân trong 9 ô -10% Công & Thủ."),
    ("tianluo", "Thiên La Địa Võng", "tactics", "Hiệu ứng trận", "Mai phục: địch tại ô không đạt gấp đôi 3 tướng trận thì bị giảm tiếp 50% sức mạnh."),

    # ── Cơ chế & Thời gian ─────────────────────────────────────────────────
    ("turn", "Turn (1 Ngày)", "system", "Thời gian", "1 ngày = hết Go + Atc. Game 20 turn (5 năm). GM có thể rút ngắn thời gian chờ."),
    ("go", "Lượt Go (Ngày)", "system", "Pha", "9h–20h. Mua/nâng cấp/hành quân/di chuyển/Tốc Phù/Cổ Vũ, giao chiến cận."),
    ("atc", "Lượt Atc (Đêm)", "system", "Pha", "20h–9h. Cung tấn công, Hỏa/Thủy/Phong Phù, Đặt Bẫy, Trinh Sát, Máy Bắn Đá, chốt phản/nạp."),
    ("spring", "Mùa Xuân", "system", "Thời tiết", "Bình thường. Turn 1,5,9,13,17. Cuối Xuân tính Điểm Lãnh Thổ."),
    ("summer", "Mùa Hạ", "system", "Thời tiết", "Lính dễ ốm: sau giao chiến, số lính chết X2 (trừ chết bẫy)."),
    ("autumn", "Mùa Thu", "system", "Thời tiết", "Bội thu: Lúa làm ra X2. Cuối Thu tính Điểm Lãnh Thổ."),
    ("winter", "Mùa Đông", "system", "Thời tiết", "Ruộng đóng băng (0 lúa). Cấm mọi quân sự: không công/di chuyển/phù/xây/chuyển đồ."),
    ("supply-line", "Nối Lương", "system", "Cơ chế", "Đường lương các ô mình chiếm (không chéo góc) nối về Trì. Mất nối = chết đói + mất màu đất."),
    ("starvation", "Chết Đói / Cắt Lương", "system", "Cơ chế", "Thiếu lúa hoặc bị cắt đường về Trì: lính bại chết đói cuối Go/Atc, đất thành Ô Trắng."),
    ("betrayal", "Phản Bội", "system", "Cơ chế", "Chốt cuối Atc. Võ cần ≥2000 quân, ngoài Sa Trường; Văn không cần 2000. Mang quân+đất theo."),
    ("expel", "Trục Xuất", "system", "Cơ chế", "Chủ Công đuổi (Atc), thu hết tài sản/quân. Turn sau không thờ ai thì bị loại."),
    ("execute", "Trảm Đầu", "system", "Cơ chế", "Chủ Công chém (Go). Trảm kẻ phản: thu ½ lính, kẻ phản + ½ lính bị loại."),
    ("recruit", "Chiêu Nạp Hiền Tài", "system", "Cơ chế", "Chủ Công xét duyệt & thu nhận nhân tài mới (cuối Atc). Đầu Go1 xin thì cuối Atc1 mới được duyệt."),
    ("soul-infusion", "Nhập Hồn Chiến Tướng", "system", "Cơ chế", "20 Tài Nguyên + 10 Uy Danh + tư chất (Bát Kỳ) → Chiến Tướng. Tối đa 5/nước, gọi đầu Go."),
    ("elite", "Tinh Binh (Mốc Kill)", "system", "Cơ chế", "Quốc gia đạt mốc giết địch (12k/24k/36k/48k/60k, chia đều 2 nước) để mở cơ giới/binh chủng."),
    ("kill-streak", "Liên Trảm", "system", "Cơ chế", "Giết trực tiếp 3 tướng địch liên tiếp → Đại Tướng. Thua 1 lần về thành mất tích lũy."),
    ("combat", "Binh Pháp (Công/Thủ)", "system", "Cơ chế", "So Công vs Thủ. Thua mất ½ quân; thắng chết = 50% quân địch mất. Kỵ truy sát sau cùng."),
    ("victory", "Thắng Lợi", "system", "Kết cục", "Phá hết Trì 2 nước, hoặc điểm cao nhất sau 20 turn. Hòa xét Trì > Châu > Ô Trắng."),
]

# ─────────────────────────────────────────────────────────────────────────────
# EDGES — (source, target, type, label)
# ─────────────────────────────────────────────────────────────────────────────
E = [
    # ── produces: nguồn sinh tài nguyên/điểm ──
    ("civil", "resource", "produces", "1–2 / turn"),
    ("civil", "morale", "produces", "1 / turn"),
    ("general", "prestige", "produces", "1 / turn"),
    ("grand-general", "prestige", "produces", "1 / turn"),
    ("war-general", "prestige", "produces", "1 / turn"),
    ("lord", "imperial", "produces", "1 / turn"),
    ("mine", "resource", "produces", "3 / 5 / 7"),
    ("pop-house", "population", "produces", "2000–4000 / TN"),
    ("farm", "grain", "produces", "1000–3000 / 1000 dân"),
    ("fishing-boat", "resource", "produces", "4–6 / turn"),
    ("province", "resource", "produces", "3 / turn"),
    ("white-tile", "resource", "produces", "1 / turn"),
    ("citadel", "score", "produces", "+5 / mùa"),
    ("province", "score", "produces", "+3 / mùa"),
    ("white-tile", "score", "produces", "+1 / mùa"),
    ("barracks", "infantry", "produces", "1000–3000"),
    ("barracks", "archer", "produces", "1000–3000"),
    ("barracks", "cavalry", "produces", "1000–3000"),

    # ── costs / nguyên liệu ──
    ("population", "resource", "costs", "mua dân"),
    ("grain", "population", "costs", "đổi lúa mất dân"),
    ("infantry", "resource", "costs", "1 TN"),
    ("infantry", "population", "costs", "2000–4000 dân"),
    ("archer", "resource", "costs", "1 TN"),
    ("archer", "infantry", "costs", "2000 bộ"),
    ("cavalry", "resource", "costs", "1 TN"),
    ("cavalry", "infantry", "costs", "2000 bộ"),
    ("infantry", "grain", "costs", "ăn / turn"),
    ("archer", "grain", "costs", "ăn / turn"),
    ("cavalry", "grain", "costs", "ăn / turn"),
    ("huatuo", "morale", "costs", "5 Dân Tâm"),
    ("huatuo", "prestige", "costs", "5–10 Uy Danh"),
    ("zuoci", "morale", "costs", "7 Dân Tâm"),
    ("shuijing", "morale", "costs", "10 Dân Tâm"),
    ("grand-general", "prestige", "costs", "10 (thay 3 kill)"),
    ("soul-infusion", "prestige", "costs", "10 Uy Danh"),
    ("soul-infusion", "resource", "costs", "20 TN"),
    ("formation", "prestige", "costs", "X = số người"),
    ("fire-talisman", "resource", "costs", "3 TN"),
    ("water-talisman", "resource", "costs", "3 TN"),
    ("speed-talisman", "resource", "costs", "3 TN"),
    ("wind-talisman", "resource", "costs", "3 TN"),
    ("rally-talisman", "resource", "costs", "3 TN"),
    ("stealth", "resource", "costs", "2 TN"),
    ("trap", "resource", "costs", "2 TN"),
    ("scout", "resource", "costs", "2 TN"),
    ("ram", "resource", "costs", "1 TN"),
    ("catapult", "resource", "costs", "2 TN"),
    ("catapult", "stones", "costs", "1 TN = 10k"),
    ("arrows", "resource", "costs", "1 TN = 2–4k"),
    ("fire-arrows", "resource", "costs", "1 TN = 1–2k"),
    ("camp", "resource", "costs", "1 TN"),
    ("drill", "resource", "costs", "1 TN"),

    # ── upgrades: tiến hóa / thăng cấp ──
    ("cavalry", "xiliang", "upgrades", "Tinh Binh"),
    ("archer", "mounted-archer", "upgrades", "Tinh Binh"),
    ("general", "grand-general", "upgrades", "10 UD / 3 kill"),
    ("general", "war-general", "upgrades", "nhập hồn"),

    # ── requires: tiền đề ──
    ("grand-general", "kill-streak", "requires", "giết 3 tướng"),
    ("soul-infusion", "baqi", "requires", "tư chất"),
    ("war-general", "soul-infusion", "requires", ""),
    ("speed-talisman", "cavalry", "requires", "chỉ kỵ dùng"),
    ("super-talisman", "bagua", "requires", ""),
    ("xiliang", "elite", "requires", "mốc 24k"),
    ("mounted-archer", "elite", "requires", "mốc 36k"),
    ("chariot", "elite", "requires", "mốc 48k"),
    ("arrow-tower", "elite", "requires", "mốc 48k"),
    ("crossbow", "elite", "requires", "mốc 60k"),
    ("wooden-ox", "elite", "requires", "mốc 12k"),
    ("camp", "white-tile", "requires", "xây trên"),
    ("drill", "white-tile", "requires", "xây trên"),
    ("trap", "white-tile", "requires", "đặt trên"),
    ("river", "training-boat", "requires", "cần thuyền"),
    ("river", "fishing-boat", "requires", "cần thuyền"),
    ("river", "grain-boat", "requires", "cần thuyền"),

    # ── enables / dạy thành ──
    ("zuoci", "bagua", "enables", "dạy"),
    ("shuijing", "baqi", "enables", "dạy"),
    ("bagua", "super-talisman", "enables", "chế miễn phí"),
    ("baqi", "war-general", "enables", "tư chất"),
    ("kill-streak", "grand-general", "enables", ""),
    ("lord", "recruit", "enables", "xét duyệt"),
    ("lord", "expel", "enables", ""),
    ("lord", "execute", "enables", ""),
    ("wooden-ox", "supply-line", "enables", "thông lương núi/rừng"),
    ("grain-boat", "supply-line", "enables", "tiếp lương qua sông"),

    # ── boosts: buff chỉ số ──
    ("forge-weapon", "combat", "boosts", "+1..3 Công"),
    ("forge-armor", "combat", "boosts", "+1..3 Thủ"),
    ("rally-talisman", "combat", "boosts", "+1 Công/lính"),
    ("super-talisman", "combat", "boosts", "Siêu Cổ Vũ +2"),
    ("grand-general", "combat", "boosts", "+1 Công +1 Thủ"),
    ("mountain", "combat", "boosts", "+10% Thủ / cung +50%"),
    ("wind-talisman", "archer", "boosts", "bắn xa +1 ô"),
    ("fire-arrows", "archer", "boosts", "3 Công"),
    ("arrows", "archer", "boosts", "2 Công"),
    ("training-boat", "combat", "boosts", "% thủy chiến"),
    ("cavalry", "pursuit", "boosts", "nội tại"),
    ("pursuit", "combat", "boosts", "giết thêm tàn binh"),
    ("xiliang", "combat", "boosts", "+1 Công kỵ"),
    ("arrow-tower", "archer", "boosts", "bắn xa 2 ô"),
    ("catapult", "combat", "boosts", "+300/100 bộ phá thành"),
    ("crossbow", "archer", "boosts", "bắn 2 ô / turn"),
    ("yulin", "combat", "boosts", "+100% Thủ/tướng"),
    ("changshe", "combat", "boosts", "+100% Công (T1)"),
    ("qixing", "combat", "boosts", "+235% Công (T1)"),
    ("yanhang", "combat", "boosts", "+100% Công hướng"),
    ("yanyue", "combat", "boosts", "+135% Công kỵ"),
    ("fengsha", "combat", "boosts", "+300% Công cung"),
    ("chuixing", "combat", "boosts", "-10% cả vùng 9 ô"),
    ("tianluo", "combat", "boosts", "mai phục -50% địch"),
    ("baqi", "civil", "boosts", "X5 Tài Nguyên"),
    ("bagua", "general", "boosts", "2 phù / turn"),

    # ── carries: chở / mang ──
    ("ram", "infantry", "carries", ""),
    ("chariot", "cavalry", "carries", ""),
    ("arrow-tower", "archer", "carries", ""),
    ("catapult", "infantry", "carries", ""),
    ("wooden-ox", "grain", "carries", "trên núi/rừng"),
    ("training-boat", "cavalry", "carries", "qua sông"),
    ("fishing-boat", "infantry", "carries", "qua sông"),

    # ── stores: kho lúa ──
    ("citadel", "grain", "stores", "vựa lúa"),
    ("province", "grain", "stores", "vựa lúa"),
    ("grain-boat", "grain", "stores", "100.000"),
    ("camp", "grain", "stores", "vựa lúa"),

    # ── transforms: biến thành khi bị phá/mất ──
    ("citadel", "white-tile", "transforms", "bị phá"),
    ("province", "white-tile", "transforms", "sập"),
    ("starvation", "white-tile", "transforms", "mất nối"),

    # ── heals: Hoa Đà ──
    ("huatuo", "general", "heals", "trị thương"),
    ("huatuo", "civil", "heals", "trị thương"),
    ("huatuo", "lord", "heals", "trị thương"),

    # ── counters: khắc chế / miễn nhiễm (2 chiều) ──
    ("fire-talisman", "water-talisman", "counters", "Hỏa gặp Thủy → Thủy"),
    ("water-talisman", "speed-talisman", "counters", "kẹt ô nước"),
    ("cavalry", "water-talisman", "counters", "móng ngựa miễn"),
    ("citadel", "fire-talisman", "counters", "miễn nhiễm"),
    ("province", "fire-talisman", "counters", "miễn nhiễm"),
    ("camp", "fire-talisman", "counters", "miễn nhiễm"),
    ("drill", "fire-talisman", "counters", "miễn nhiễm"),
    ("chuixing", "fire-talisman", "counters", "dập"),
    ("chuixing", "water-talisman", "counters", "dập"),
    ("chariot", "fire-talisman", "counters", "ngự hỏa"),
    ("trap", "cavalry", "counters", "kỵ tốc đạp → lùi"),
    ("execute", "betrayal", "counters", "ưu tiên trảm phản"),
    ("forest", "scout", "counters", "không soi được"),

    # ── affects: thời tiết & cơ chế ──
    ("summer", "combat", "affects", "lính chết X2"),
    ("autumn", "grain", "affects", "lúa X2"),
    ("winter", "farm", "affects", "0 lúa"),
    ("winter", "combat", "affects", "cấm quân sự"),
    ("supply-line", "starvation", "counters", "nối lương chống đói"),
    ("starvation", "infantry", "affects", "chết đói"),
    ("forest", "supply-line", "counters", "cấm nối (trừ Trâu)"),
    ("mountain", "supply-line", "counters", "cấm nối (trừ Trâu)"),
    ("river", "supply-line", "counters", "cấm nối (trừ thông)"),

    # ── combat feeds ──
    ("combat", "kill-streak", "affects", "giết tướng"),
    ("combat", "elite", "affects", "giết lính → mốc"),
    ("score", "victory", "affects", "xét điểm"),
    ("combat", "victory", "affects", "phá 9 Trì"),

    # ── betrayal / roles ──
    ("general", "betrayal", "enables", "≥2000 quân"),
    ("civil", "betrayal", "enables", "không cần 2000"),

    # ── timing: pha Go / Atc & cấu trúc turn ──
    ("turn", "go", "contains", ""),
    ("turn", "atc", "contains", ""),
    ("fire-talisman", "atc", "timing", ""),
    ("water-talisman", "atc", "timing", ""),
    ("wind-talisman", "atc", "timing", ""),
    ("speed-talisman", "go", "timing", ""),
    ("trap", "atc", "timing", ""),
    ("scout", "atc", "timing", ""),
    ("stealth", "go", "timing", ""),
    ("catapult", "atc", "timing", ""),
    ("recruit", "atc", "timing", "cuối Atc"),
    ("betrayal", "atc", "timing", "cuối Atc"),
    ("execute", "go", "timing", ""),
    ("archer", "atc", "timing", "tấn công đêm"),
    ("soul-infusion", "go", "timing", "gọi đầu Go"),
]


def build():
    ids = [n[0] for n in N]
    dup = {i for i in ids if ids.count(i) > 1}
    assert not dup, f"Node id trùng: {dup}"
    idset = set(ids)

    nodes = [{"id": i, "label": l, "domain": d, "category": c, "desc": desc}
             for (i, l, d, c, desc) in N]

    edges = []
    for (s, t, ty, lab) in E:
        assert s in idset, f"Edge source lạ: {s}"
        assert t in idset, f"Edge target lạ: {t}"
        assert ty in EDGE_TYPES, f"Edge type lạ: {ty}"
        edges.append({"source": s, "target": t, "type": ty, "label": lab})

    graph = {
        "meta": {
            "title": "Tam Quốc Tranh Hùng — Đồ Thị Luật Game",
            "source": "reference/Tam Quoc Chi - full text.txt",
            "note": "Node = thực thể luật; edge = quan hệ có kiểu. Màu = domain (gợi ý nhóm); "
                    "danh tính do nhãn + bộ lọc + bảng chi tiết gánh.",
            "domains": DOMAINS,
            "edgeTypes": EDGE_TYPES,
            "counts": {"nodes": len(nodes), "edges": len(edges)},
        },
        "nodes": nodes,
        "edges": edges,
    }

    json_path = ROOT / "data" / "rules-graph.json"
    json_path.write_text(json.dumps(graph, ensure_ascii=False, indent=2), encoding="utf-8")

    tpl_path = ROOT / "data" / "rules-graph.template.html"
    html_path = ROOT / "docs" / "wiki" / "assets" / "rules-graph.html"
    tpl = tpl_path.read_text(encoding="utf-8")
    payload = json.dumps(graph, ensure_ascii=False, separators=(",", ":"))
    html = tpl.replace("/*__GRAPH_DATA__*/null", payload)
    html_path.write_text(html, encoding="utf-8")

    print(f"✓ {json_path.relative_to(ROOT)}  ({len(nodes)} nodes, {len(edges)} edges)")
    print(f"✓ {html_path.relative_to(ROOT)}")


if __name__ == "__main__":
    build()
