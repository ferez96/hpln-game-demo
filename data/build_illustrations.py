#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Sinh 4 hình minh họa (SVG, tự chứa, không cần build step) cho docs/wiki/.

Nguồn sự thật cho nội dung minh họa: reference/Tam Quoc Chi - full text.txt
(đặc biệt các đoạn "Bước 1/Bước 2" mô tả ví dụ Nối Lương và Hỏa/Thủy Phù —
bản gốc từng có hình vẽ ở đây, đã mất khi chuyển sang văn bản thuần; script
này dựng lại đúng tọa độ/luật đã nêu, không thêm chi tiết không có trong luật).

Xuất ra docs/wiki/assets/*.svg. Chạy: python3 data/build_illustrations.py
"""
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "docs" / "wiki" / "assets"

FONT = "Segoe UI, Helvetica, Arial, sans-serif"
TITLE_COLOR = "#a83c3c"
TEXT_COLOR = "#222222"
MUTED = "#666666"
CARD_BG = "#ffffff"
CARD_BORDER = "#d8d8d8"

THUC = "#a9d18e"      # xanh lá — khớp màu nước Thục trên bản đồ gốc
NGUY = "#f4b183"      # cam — khớp màu nước Ngụy trên bản đồ gốc
OPEN = "#f7f6f2"       # Ô Trắng chưa chiếm
GRID_STROKE = "#999999"

# Style B — "Hoàng Kim Imperial" (design/Tam Quoc Style Guide.dc.html), điều chỉnh
# độ sáng/tương phản cho nền sáng của wiki (bảng gốc thiết kế cho nền tối).
CHU_SA = "#8b1a1a"     # ★ đỏ son — vai trò chính / hiệu ứng nổi bật nhất
HOANG_KIM = "#c8941a"  # ★ vàng kim (đã tối hơn bản gốc #d4a020 để đủ tương phản chữ trắng)
NGOC_BICH = "#1a5c3a"  # ★ ngọc bích
LAM_THAM = "#1e2a4a"   # lam thẫm — vai trò phụ / thứ hai
DONG_CU = "#a8622e"    # đồng cũ (đã tối hơn bản gốc #c87840 để đủ tương phản chữ trắng)
NGA_VOI = "#f7f2e2"    # ngà voi — nền panel


def esc(s: str) -> str:
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def svg_header(width, height, title):
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" '
        f'width="100%" style="max-width:{width}px" font-family="{FONT}">\n'
        f'<title>{esc(title)}</title>\n'
        f'<rect x="0" y="0" width="{width}" height="{height}" rx="10" '
        f'fill="{CARD_BG}" stroke="{CARD_BORDER}"/>\n'
    )


def svg_footer():
    return "</svg>\n"


def text(x, y, s, size=14, color=TEXT_COLOR, weight="normal", anchor="start", style=""):
    return (
        f'<text x="{x}" y="{y}" font-size="{size}" fill="{color}" '
        f'font-weight="{weight}" text-anchor="{anchor}" {style}>{esc(s)}</text>\n'
    )


def rect(x, y, w, h, fill, stroke=GRID_STROKE, sw=1, dash=None, rx=0, opacity=None):
    d = f' stroke-dasharray="{dash}"' if dash else ""
    o = f' fill-opacity="{opacity}"' if opacity is not None else ""
    return (
        f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" '
        f'fill="{fill}" stroke="{stroke}" stroke-width="{sw}"{d}{o}/>\n'
    )


def line(x1, y1, x2, y2, stroke="#333333", sw=1.5, dash=None, marker=False):
    d = f' stroke-dasharray="{dash}"' if dash else ""
    m = ' marker-end="url(#arrow)"' if marker else ""
    return f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{stroke}" stroke-width="{sw}"{d}{m}/>\n'


def circle(cx, cy, r, fill, stroke="#333333", sw=1.5):
    return f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>\n'


def arrow_marker():
    return (
        '<defs><marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" '
        'markerWidth="6" markerHeight="6" orient="auto-start-reverse">'
        '<path d="M0,0 L10,5 L0,10 z" fill="#333333"/></marker></defs>\n'
    )


def hatch_pattern(pid, color="#c0392b"):
    return (
        f'<defs><pattern id="{pid}" width="8" height="8" patternTransform="rotate(45)" '
        f'patternUnits="userSpaceOnUse"><line x1="0" y1="0" x2="0" y2="8" '
        f'stroke="{color}" stroke-width="3"/></pattern></defs>\n'
    )


# ─────────────────────────────────────────────────────────────────────────────
# 1) Địa Lý — bonus kề núi & quy tắc "cạnh vuông" vs "đường chéo"
# ─────────────────────────────────────────────────────────────────────────────
def build_dia_ly_ke_can():
    W, H = 760, 420
    s = svg_header(W, H, "Kề Núi & Quy tắc kết nối cạnh vuông")
    s += text(30, 34, "Bonus kề Núi, và “cạnh vuông” vs “đường chéo”",
              size=18, color=TITLE_COLOR, weight="700")

    # Panel 1: Núi adjacency
    ox, oy, cell = 40, 90, 78
    s += text(ox, oy - 16, "Đứng cạnh Núi được cộng Thủ", size=13, color=MUTED, weight="600")
    labels = [
        ["", "+10%\nThủ", ""],
        ["+10%\nThủ", "NÚI\n+50% Công\n(Cung đứng trên)", "+10%\nThủ"],
        ["", "+10%\nThủ", ""],
    ]
    for r in range(3):
        for c in range(3):
            x, y = ox + c * cell, oy + r * cell
            is_center = (r == 1 and c == 1)
            is_ortho = (r, c) in [(0, 1), (1, 0), (1, 2), (2, 1)]
            fill = "#c98a4a" if is_center else ("#ecf7ee" if is_ortho else "#ffffff")
            dash = None if is_center else ("4,3" if is_ortho else None)
            s += rect(x, y, cell, cell, fill, dash=dash)
            lbl = labels[r][c]
            if lbl:
                lines = lbl.split("\n")
                for i, ln in enumerate(lines):
                    sz = 12 if not is_center else 11
                    col = "#ffffff" if is_center else "#2a7a3c"
                    s += text(x + cell / 2, y + cell / 2 - (len(lines) - 1) * 7 + i * 14, ln,
                              size=sz, color=col, weight="600", anchor="middle")
    s += text(ox, oy + 3 * cell + 20, "Kề 2 mặt núi cùng lúc: +20% Thủ (cộng dồn).",
              size=12, color=MUTED)

    # Panel 2: orthogonal vs diagonal connectivity
    ox2 = 430
    s += text(ox2, oy - 34, "Nối Lương / Di chuyển / Cung bắn:",
              size=13, color=MUTED, weight="600")
    s += text(ox2, oy - 16, "chỉ tính cạnh vuông", size=13, color=MUTED, weight="600")
    s += arrow_marker()
    for r in range(3):
        for c in range(3):
            x, y = ox2 + c * cell, oy + r * cell
            is_center = (r == 1 and c == 1)
            fill = "#dfe9f5" if is_center else "#ffffff"
            s += rect(x, y, cell, cell, fill)
            if is_center:
                s += text(x + cell / 2, y + cell / 2 + 4, "Ô gốc", size=12, anchor="middle", weight="600")
    cx, cy = ox2 + 1.5 * cell, oy + 1.5 * cell
    ortho = [(0, 1), (1, 0), (1, 2), (2, 1)]
    diag = [(0, 0), (0, 2), (2, 0), (2, 2)]
    for (r, c) in ortho:
        tx, ty = ox2 + (c + 0.5) * cell, oy + (r + 0.5) * cell
        s += line(cx, cy, tx, ty, stroke="#2a8f4a", sw=2.5)
        s += text(tx, ty + 4, "✓", size=16, color="#2a8f4a", anchor="middle", weight="700")
    for (r, c) in diag:
        tx, ty = ox2 + (c + 0.5) * cell, oy + (r + 0.5) * cell
        s += line(cx, cy, tx, ty, stroke="#c0392b", sw=1.5, dash="5,4")
        s += text(tx, ty + 4, "✗", size=16, color="#c0392b", anchor="middle", weight="700")
    s += text(ox2, oy + 3 * cell + 20, "Xanh = cạnh vuông (nối được).", size=12, color=MUTED)
    s += text(ox2, oy + 3 * cell + 38, "Đỏ = đường chéo (KHÔNG tính kết nối).", size=12, color=MUTED)

    s += svg_footer()
    return s


# ─────────────────────────────────────────────────────────────────────────────
# 2) Ví dụ Nối Lương — Thục B4→B9, Ngụy chiếm C7+B7
# ─────────────────────────────────────────────────────────────────────────────
def build_vi_du_noi_luong():
    W, H = 620, 700
    s = svg_header(W, H, "Ví dụ Nối Lương: Thục B4→B9 bị Ngụy cắt tại B7")
    s += text(30, 34, "Ví dụ: Thục chiếm B4→B9, Ngụy cắt tại B7",
              size=18, color=TITLE_COLOR, weight="700")
    s += hatch_pattern("cutoff")

    cols = ["A", "B", "C"]
    rows = list(range(3, 10))  # 3..9
    cell = 64
    ox, oy = 140, 70

    # column headers
    for c, name in enumerate(cols):
        s += text(ox + c * cell + cell / 2, oy - 12, name, size=14, anchor="middle", weight="700", color=MUTED)
    # row headers
    for r, rn in enumerate(rows):
        s += text(ox - 16, oy + r * cell + cell / 2 + 5, str(rn), size=14, anchor="end", weight="700", color=MUTED)

    state = {
        (3, "B"): ("home", "Trì"),
        (4, "B"): ("thuc", ""),
        (5, "B"): ("thuc", ""),
        (6, "B"): ("thuc", ""),
        (7, "B"): ("nguy", ""),
        (7, "C"): ("nguy", ""),
        (8, "B"): ("cutoff", ""),
        (9, "B"): ("cutoff", ""),
    }
    for r, rn in enumerate(rows):
        for c, cn in enumerate(cols):
            x, y = ox + c * cell, oy + r * cell
            kind, lbl = state.get((rn, cn), ("open", ""))
            fill = {"thuc": THUC, "nguy": NGUY, "open": OPEN, "cutoff": THUC, "home": "#e8e2d0"}[kind]
            s += rect(x, y, cell, cell, fill)
            if kind == "cutoff":
                s += rect(x, y, cell, cell, "url(#cutoff)", stroke="#c0392b", sw=2)
            if kind == "home":
                s += rect(x, y, cell, cell, fill, stroke="#8a6d3b", sw=2, dash="4,3")
            if lbl:
                s += text(x + cell / 2, y + cell / 2 + 5, lbl, size=12, anchor="middle", weight="700", color="#5a4726")
            else:
                s += text(x + cell / 2, y + cell / 2 + 5, f"{cn}{rn}", size=10, anchor="middle", color="#00000099")

    # supply line: B4 up to Trì (B3) unbroken; B4 down towards B7 where it is cut
    bx = ox + 1 * cell + cell / 2
    b3_cy = oy + 0 * cell + cell / 2
    b4_cy = oy + 1 * cell + cell / 2
    b7_top = oy + 4 * cell
    s += arrow_marker()
    s += line(bx, b4_cy, bx, b3_cy, stroke="#2a7a3c", sw=3, marker=True)
    s += line(bx, b4_cy, bx, b7_top, stroke="#2a7a3c", sw=3)
    # break mark at B7 (row index 4)
    s += text(bx + 14, oy + 4 * cell + cell / 2 + 5, "✗ đường lương bị cắt", size=13, color="#c0392b", weight="700")

    legend_y = oy + len(rows) * cell + 30
    items = [
        (THUC, "Thục đang chiếm (B4–B6, còn nối Trì)"),
        (NGUY, "Ngụy chiếm (B7, C7) — cắt đường"),
        ("cutoff", "Thục mất kết nối (B8, B9) — chết đói cuối Go, đất hóa Ô Trắng"),
    ]
    ly = legend_y
    for fill, label in items:
        if fill == "cutoff":
            s += rect(30, ly - 14, 20, 20, THUC)
            s += rect(30, ly - 14, 20, 20, "url(#cutoff)", stroke="#c0392b", sw=2)
        else:
            s += rect(30, ly - 14, 20, 20, fill)
        s += text(58, ly + 1, label, size=13, color=TEXT_COLOR)
        ly += 26

    s += text(30, ly + 10,
              "Dù B8/B9 thắng hay thua trận trong Turn đó, mất kết nối về Trì là chết đói sạch + mất màu.",
              size=12, color=MUTED)
    s += svg_footer()
    return s


# ─────────────────────────────────────────────────────────────────────────────
# 3) Trận Pháp — 7 hình thế
# ─────────────────────────────────────────────────────────────────────────────
def build_tran_phap():
    # Hình thế dựng lại theo đúng sơ đồ lưới ô của tài liệu gốc (bản gốc có hình vẽ
    # cho cả 7 trận — bản text thuần đã làm mất hình, chỉ còn lại mô tả bằng lời cho
    # 4/7 trận). Bảng màu: Style B "Hoàng Kim Imperial" (design/Tam Quoc Style Guide.dc.html),
    # đã hạ độ sáng 2 màu (Hoàng Kim, Đồng Cũ) để chữ trắng trên chấm đủ tương phản.
    W, H = 940, 560
    s = svg_header(W, H, "7 Trận Pháp — hình thế")
    s += text(30, 34, "Trận Pháp — hình thế (theo đúng sơ đồ luật gốc)",
              size=18, color=CHU_SA, weight="700")

    panel_w, panel_h = 215, 200
    grid_size = 130
    cols = 4
    positions = [(i % cols, i // cols) for i in range(7)]
    ox0, oy0 = 30, 55
    gap_x, gap_y = 10, 20

    def panel_origin(i):
        col, row = positions[i]
        return ox0 + col * (panel_w + gap_x), oy0 + row * (panel_h + gap_y)

    def dot(x, y, label, fill, r=13, text_color="#ffffff"):
        out = circle(x, y, r, fill, stroke="#00000030", sw=1.5)
        out += text(x, y + 4, label, size=11, color=text_color, anchor="middle", weight="700")
        return out

    def grid_bg(px, py, gw, gh, nrows, ncols, fill=NGA_VOI):
        out = rect(px, py, gw, gh, fill)
        for i in range(1, ncols):
            x = px + i * gw / ncols
            out += line(x, py, x, py + gh, stroke="#e0d8c0", sw=1)
        for i in range(1, nrows):
            y = py + i * gh / nrows
            out += line(px, y, px + gw, y, stroke="#e0d8c0", sw=1)
        return out

    def cell_xy(px, py, gw, gh, nrows, ncols, row, col):
        return px + (col + 0.5) * gw / ncols, py + (row + 0.5) * gh / nrows

    def ox_marker(px, py, gw, gh, nrows, ncols, row, col):
        """Ô X — ô bị mai phục (Thiên La Địa Võng), không phải vị trí Tướng."""
        cw, ch = gw / ncols, gh / nrows
        x, y = px + col * cw, py + row * ch
        out = rect(x + 3, y + 3, cw - 6, ch - 6, "none", stroke=NGOC_BICH, sw=1.5, dash="3,3")
        out += text(x + cw / 2, y + ch / 2 + 4, "Ô X", size=10, color=NGOC_BICH, anchor="middle", weight="700")
        return out

    # 1. Ngư Lân — lưới 2×2, 4 Tướng lấp đầy (tối thiểu 2, đủ 1 hàng chéo)
    def f_nguLan(px, py):
        g, nr, nc = grid_size, 2, 2
        out = grid_bg(px, py, g, g, nr, nc)
        cells = {"T1": (0, 0), "T2": (1, 1), "T3": (1, 0), "T4": (0, 1)}
        c1 = cell_xy(px, py, g, g, nr, nc, *cells["T1"])
        c2 = cell_xy(px, py, g, g, nr, nc, *cells["T2"])
        c3 = cell_xy(px, py, g, g, nr, nc, *cells["T3"])
        c4 = cell_xy(px, py, g, g, nr, nc, *cells["T4"])
        out += line(*c1, *c2, stroke=HOANG_KIM, sw=2)
        out += line(*c3, *c4, stroke=HOANG_KIM, sw=2)
        for label, rc in cells.items():
            cx, cy = cell_xy(px, py, g, g, nr, nc, *rc)
            out += dot(cx, cy, label, HOANG_KIM)
        return out, "Ngư Lân", ["2–4 Tướng · lưới 2×2,", "tối thiểu 1 hàng chéo"]

    # 2. Trường Xà — chữ T: 1 trước (T1) + 2 sau (T2,T3 cùng công thức), Ô X ở giữa 2 tướng sau
    def f_truongXa(px, py):
        g, nr, nc = grid_size, 2, 3
        out = grid_bg(px, py, g, g, nr, nc)
        p1 = cell_xy(px, py, g, g, nr, nc, 0, 1)
        p2 = cell_xy(px, py, g, g, nr, nc, 1, 0)
        p3 = cell_xy(px, py, g, g, nr, nc, 1, 2)
        out += line(*p2, *p1, stroke=LAM_THAM, sw=2)
        out += line(*p1, *p3, stroke=LAM_THAM, sw=2)
        out += ox_marker(px, py, g, g, nr, nc, 1, 1)
        out += dot(*p1, "T1", CHU_SA)
        out += dot(*p2, "T2", LAM_THAM)
        out += dot(*p3, "T3", LAM_THAM)
        return out, "Trường Xà", ["3 Tướng · hình chữ T", "(1 trước + 2 sau)"]

    # 3. Thất Tinh — hình nêm: 1 (T1) + 2 (T2,T3) + 2 (T4,T5), Ô X ở hàng giữa
    def f_thatTinh(px, py):
        g, nr, nc = grid_size, 4, 3
        out = grid_bg(px, py, g, g, nr, nc)
        p1 = cell_xy(px, py, g, g, nr, nc, 1, 1)
        p2 = cell_xy(px, py, g, g, nr, nc, 2, 0)
        p3 = cell_xy(px, py, g, g, nr, nc, 2, 2)
        p4 = cell_xy(px, py, g, g, nr, nc, 3, 0)
        p5 = cell_xy(px, py, g, g, nr, nc, 3, 2)
        out += line(*p1, *p2, stroke=LAM_THAM, sw=2)
        out += line(*p1, *p3, stroke=LAM_THAM, sw=2)
        out += line(*p2, *p4, stroke=DONG_CU, sw=2)
        out += line(*p3, *p5, stroke=DONG_CU, sw=2)
        out += ox_marker(px, py, g, g, nr, nc, 2, 1)
        out += dot(*p1, "T1", CHU_SA)
        out += dot(*p2, "T2", LAM_THAM)
        out += dot(*p3, "T3", LAM_THAM)
        out += dot(*p4, "T4", DONG_CU)
        out += dot(*p5, "T5", DONG_CU)
        return out, "Thất Tinh", ["5 Tướng · hình nêm", "(1 + 2 + 2)"]

    # 4/5. Nhạn Hành / Yển Nguyệt — thẳng hàng ngang hoặc dọc
    def f_nhanHanh(px, py):
        g, nr, nc = grid_size, 3, 3
        out = grid_bg(px, py, g, g, nr, nc)
        p1 = cell_xy(px, py, g, g, nr, nc, 1, 0)
        p2 = cell_xy(px, py, g, g, nr, nc, 1, 1)
        p3 = cell_xy(px, py, g, g, nr, nc, 1, 2)
        out += line(*p1, *p3, stroke=LAM_THAM, sw=2)
        out += dot(*p1, "T1", CHU_SA)
        out += dot(*p2, "T2", LAM_THAM)
        out += dot(*p3, "T3", CHU_SA)
        return out, "Nhạn Hành", ["3 Tướng · thẳng hàng", "(ngang/dọc) — 2 cánh cùng vai trò"]

    def f_yenNguyet(px, py):
        g, nr, nc = grid_size, 3, 3
        out = grid_bg(px, py, g, g, nr, nc)
        p1 = cell_xy(px, py, g, g, nr, nc, 0, 1)
        p2 = cell_xy(px, py, g, g, nr, nc, 1, 1)
        p3 = cell_xy(px, py, g, g, nr, nc, 2, 1)
        out += line(*p1, *p3, stroke=NGOC_BICH, sw=2)
        out += dot(*p1, "T1", CHU_SA)
        out += dot(*p2, "T2", LAM_THAM)
        out += dot(*p3, "T3", DONG_CU)
        return out, "Yển Nguyệt", ["3 Tướng · thẳng hàng", "(ngang/dọc)"]

    # 6. Phong Sát — chữ thập: 1 giữa (T1) + 4 quanh (T2..T5 cùng công thức)
    def f_phongSat(px, py):
        g, nr, nc = grid_size, 3, 3
        out = grid_bg(px, py, g, g, nr, nc)
        center = cell_xy(px, py, g, g, nr, nc, 1, 1)
        arms = [cell_xy(px, py, g, g, nr, nc, r, c) for (r, c) in [(0, 1), (1, 0), (1, 2), (2, 1)]]
        for a in arms:
            out += line(*center, *a, stroke=LAM_THAM, sw=2)
        out += dot(*center, "T1", CHU_SA)
        for i, a in enumerate(arms):
            out += dot(*a, f"T{i+2}", LAM_THAM)
        return out, "Phong Sát", ["5 Tướng · hình chữ thập", "(1 giữa + 4 quanh)"]

    # 7. Trùy Hình — 3 Tướng hàng chéo trên đúng lưới 3×3 = vùng ảnh hưởng
    def f_truyHinh(px, py):
        g, nr, nc = grid_size, 3, 3
        out = grid_bg(px, py, g, g, nr, nc, fill="#f3e6d8")
        out += rect(px, py, g, g, "none", stroke=DONG_CU, sw=2, dash="4,3")
        coords = [cell_xy(px, py, g, g, nr, nc, i, i) for i in range(3)]
        out += line(*coords[0], *coords[-1], stroke=DONG_CU, sw=2)
        for i, (cx, cy) in enumerate(coords):
            out += dot(cx, cy, f"T{i+1}", DONG_CU)
        return out, "Trùy Hình", ["3 Tướng · 1 hàng chéo,", "vùng 3×3 dập Thủy/Hỏa"]

    order = [
        f_nguLan(*panel_origin(0)),
        f_truongXa(*panel_origin(1)),
        f_thatTinh(*panel_origin(2)),
        f_nhanHanh(*panel_origin(3)),
        f_yenNguyet(*panel_origin(4)),
        f_phongSat(*panel_origin(5)),
        f_truyHinh(*panel_origin(6)),
    ]

    for i, (svg_part, name, cond_lines) in enumerate(order):
        px, py = panel_origin(i)
        s += rect(px, py, panel_w, panel_h + 6, "#ffffff", stroke="#e8e0cc")
        s += text(px + panel_w / 2, py + 16, name, size=14, color=CHU_SA, weight="700", anchor="middle")
        gx = px + (panel_w - grid_size) / 2
        gy = py + 26
        # shift svg_part coordinates: parts were built assuming origin at panel_origin;
        # re-origin here by wrapping in a <g transform>
        dx = gx - px
        dy = gy - py
        s += f'<g transform="translate({dx},{dy})">' + svg_part + "</g>\n"
        cap_y0 = py + grid_size + 26 + 14
        for li, ln in enumerate(cond_lines):
            s += text(px + panel_w / 2, cap_y0 + li * 13, ln, size=10.5, color=MUTED, anchor="middle")

    s += text(30, H - 48,
              "Cùng màu chấm = cùng công thức hiệu ứng (VD 2 tướng cùng −10% Công). Ô viền chấm “Ô X” = ô bị mai phục (Thiên La Địa Võng), không phải vị trí Tướng.",
              size=12, color=MUTED)
    s += text(30, H - 30,
              "Hình dựng lại theo đúng sơ đồ lưới của tài liệu gốc — bản rút gọn dạng văn bản đã làm mất các hình vẽ này.",
              size=12, color=MUTED)
    s += svg_footer()
    return s


# ─────────────────────────────────────────────────────────────────────────────
# 4) Phù — vùng ảnh hưởng Hỏa Phù / Thủy Phù
# ─────────────────────────────────────────────────────────────────────────────
def build_phu_vung_anh_huong():
    W, H = 780, 500
    s = svg_header(W, H, "Vùng ảnh hưởng Hỏa Phù & Thủy Phù")
    s += text(30, 34, "Vùng ảnh hưởng: Hỏa Phù & Thủy Phù", size=18, color=TITLE_COLOR, weight="700")
    s += arrow_marker()

    cell = 56
    grid_n = 5

    # ---- LEFT: Hỏa Phù ----
    ox, oy = 40, 80
    s += text(ox, oy - 18, "Hỏa Phù — Atc", size=14, color=MUTED, weight="700")
    caster = (2, 4)  # col,row (0-indexed) bottom middle
    o1 = (2, 3)
    center = (2, 2)
    for r in range(grid_n):
        for c in range(grid_n):
            x, y = ox + c * cell, oy + r * cell
            in_zone = (center[0] - 1 <= c <= center[0] + 1) and (center[1] - 1 <= r <= center[1] + 1)
            fill = "#fdece0" if in_zone else "#ffffff"
            s += rect(x, y, cell, cell, fill, dash="4,3" if in_zone else None,
                      stroke="#d98a4a" if in_zone else GRID_STROKE)
    # caster
    cx, cy = ox + (caster[0] + 0.5) * cell, oy + (caster[1] + 0.5) * cell
    s += circle(cx, cy, 14, "#2a78d6", stroke="#1a4d80", sw=1.5)
    s += text(cx, cy + 4, "T", size=12, color="#ffffff", anchor="middle", weight="700")
    # 4 direction dashed arrows from caster
    for (dc, dr) in [(0, -1), (0, 1), (-1, 0), (1, 0)]:
        tx = ox + (caster[0] + dc + 0.5) * cell
        ty = oy + (caster[1] + dr + 0.5) * cell
        if (dc, dr) != (0, -1):
            s += line(cx, cy, tx, ty, stroke="#bbbbbb", sw=1.5, dash="3,3")
    # chosen direction solid: up
    o1x, o1y = ox + (o1[0] + 0.5) * cell, oy + (o1[1] + 0.5) * cell
    s += line(cx, cy, o1x, o1y, stroke="#c0392b", sw=2.5, marker=True)
    s += text(o1x + cell * 0.42, o1y, "Ô1", size=12, color="#c0392b", weight="700", anchor="middle")
    ctx, cty = ox + (center[0] + 0.5) * cell, oy + (center[1] + 0.5) * cell
    s += line(o1x, o1y, ctx, cty, stroke="#c0392b", sw=2.5, marker=True)
    s += text(ctx + cell * 0.52, cty, "Ô Trung Tâm", size=11.5, color="#c0392b", weight="700", anchor="start")
    hoa_caption = [
        "Chọn 1 trong 4 hướng.",
        "Vùng cháy = Ô Trung Tâm + 8 ô quanh (3×3).",
        "Châu/Trì làm tâm: miễn nhiễm (ô quanh vẫn cháy).",
        "Hiệu lực: cuối Atc ném → hết Atc kế tiếp.",
    ]
    for li, ln in enumerate(hoa_caption):
        s += text(ox, oy + grid_n * cell + 22 + li * 17, ln, size=12, color=MUTED)

    # ---- RIGHT: Thủy Phù ----
    ox2 = 430
    s += text(ox2, oy - 18, "Thủy Phù — Atc", size=14, color=MUTED, weight="700")
    caster2 = (2, 4)
    o1_2 = (2, 3)
    for r in range(grid_n):
        for c in range(grid_n):
            x, y = ox2 + c * cell, oy + r * cell
            s += rect(x, y, cell, cell, "#ffffff")
    cx2, cy2 = ox2 + (caster2[0] + 0.5) * cell, oy + (caster2[1] + 0.5) * cell
    s += circle(cx2, cy2, 14, "#2a78d6", stroke="#1a4d80", sw=1.5)
    s += text(cx2, cy2 + 4, "T", size=12, color="#ffffff", anchor="middle", weight="700")
    for (dc, dr) in [(0, -1), (0, 1), (-1, 0), (1, 0)]:
        tx = ox2 + (caster2[0] + dc + 0.5) * cell
        ty = oy + (caster2[1] + dr + 0.5) * cell
        if (dc, dr) != (0, -1):
            s += line(cx2, cy2, tx, ty, stroke="#bbbbbb", sw=1.5, dash="3,3")
    o1x2, o1y2 = ox2 + (o1_2[0] + 0.5) * cell, oy + (o1_2[1] + 0.5) * cell
    s += line(cx2, cy2, o1x2, o1y2, stroke="#2a6fb3", sw=2.5, marker=True)
    s += text(o1x2 + cell * 0.42, o1y2, "Ô1", size=12, color="#2a6fb3", weight="700", anchor="middle")
    # vùng nước 2×2: Ô1 + 1 ô cùng hàng + 2 ô hàng trên (khối vuông kề hướng ném)
    zx, zy = ox2 + o1_2[0] * cell, oy + (o1_2[1] - 1) * cell
    zw, zh = cell * 2, cell * 2
    s += rect(zx, zy, zw, zh, "#dceafc", stroke="#2a6fb3", sw=2, dash="4,3")
    s += text(zx + zw / 2, zy + zh / 2 + 4, "vùng nước (2×2)", size=11.5, color="#2a6fb3", anchor="middle", weight="700")
    thuy_caption = [
        "Ném vào 1 trong 4 ô kề → tạo vùng nước 2×2.",
        "Giữ chân quân — chủ động đi vào cũng bị kẹt.",
        "Không ô nào miễn nhiễm (kể cả Châu/Trì).",
        "Hiệu lực: cuối Atc ném → hết Atc kế tiếp.",
    ]
    for li, ln in enumerate(thuy_caption):
        s += text(ox2, oy + grid_n * cell + 22 + li * 17, ln, size=12, color=MUTED)

    s += svg_footer()
    return s


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    files = {
        "dia-ly-ke-can.svg": build_dia_ly_ke_can(),
        "vi-du-noi-luong.svg": build_vi_du_noi_luong(),
        "tran-phap.svg": build_tran_phap(),
        "phu-vung-anh-huong.svg": build_phu_vung_anh_huong(),
    }
    for name, content in files.items():
        (OUT / name).write_text(content, encoding="utf-8")
        print(f"wrote {OUT / name}")


if __name__ == "__main__":
    main()
