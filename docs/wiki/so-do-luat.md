# Đồ Thị Luật Game

Trang này mô hình hoá **toàn bộ luật** thành một đồ thị: mỗi **ô** (node) là một thực thể luật, mỗi **đường** (edge) là một quan hệ *có kiểu* giữa hai thực thể. Khác với [Lộ Trình Học](lo-trinh-hoc.md) (chỉ trả lời "học khái niệm nào trước"), đồ thị này trả lời **"thứ này liên quan tới những thứ nào, theo cách nào"** — chuỗi sản xuất, nơi tiêu tài nguyên, điều kiện tiền đề, khắc chế, ai chở/buff ai.

Nguồn: `reference/Tam Quoc Chi - full text.txt` (luật đầy đủ). Mô hình dữ liệu: `data/rules-graph.json`.

<div style="border:1px solid #2a78d633;border-radius:8px;overflow:hidden;margin:1em 0;">
<iframe src="wiki/assets/rules-graph.html" style="width:100%;height:1500px;border:0;display:block;" title="Đồ thị quan hệ giữa các thực thể luật"></iframe>
</div>

*Nếu iframe không hiển thị: [mở đồ thị trong tab riêng](wiki/assets/rules-graph.html ':ignore').*

## Đọc đồ thị thế nào

- **Kéo** một ô để xoay cụm, **lăn chuột** để phóng to/thu nhỏ, **kéo nền** để di chuyển khung nhìn.
- **Rê chuột** lên một ô → nổi bật ô đó + hàng xóm, làm mờ phần còn lại, hiện mô tả ngắn.
- **Bấm** một ô → bảng chi tiết bên dưới liệt kê **mọi quan hệ vào/ra** của nó (bấm tiếp tên thực thể trong bảng để nhảy sang ô đó).
- Bấm **chip domain** để soi riêng một nhóm; bấm **chip kiểu quan hệ** để ẩn/hiện một loại đường; gõ ô **tìm** để lọc theo tên.

> Màu chỉ **gợi ý nhóm** (domain). Vì có 8 nhóm, màu không đủ tách bạch cho mọi cặp khi bị mù màu — nên danh tính thật luôn đọc từ **nhãn + bộ lọc + bảng chi tiết**, không dựa vào màu một mình.

## 8 Domain (trục màu)

| Domain | Gồm |
|---|---|
| **Chức vụ** | Chủ Công, Quân Sư, Quan Văn, Tướng Quân, Đại Tướng Quân, Chiến Tướng |
| **Tài nguyên & Điểm** | Tài Nguyên, Dân, Lúa, Dân Tâm, Uy Danh, Đế Khí, Điểm Lãnh Thổ |
| **Quân sự** | Bộ/Cung/Kỵ & tinh binh, cơ giới, thuyền, tên & đá |
| **Hậu cần & Công trình** | Mỏ, Nhà Dân, Ruộng, Khu Quân Sự, Lò Rèn, Doanh Trại, Thao Trường |
| **Địa hình** | Ô Thành Trì, Châu Thành, Ô Trắng, Rừng, Núi, Sông |
| **Huyền bí** | Phù các loại, Hoa Đà, Tả Từ, Thủy Kính, Bát Quái, Bát Kỳ |
| **Chiến thuật** | Ẩn Thân, Đặt Bẫy, Trinh Sát, Truy Cùng Giết Tận, 7 Trận Pháp |
| **Cơ chế & Thời gian** | Turn/Go/Atc, 4 mùa, nối lương, phản bội, nhập hồn, tinh binh, binh pháp… |

## 14 Kiểu quan hệ (trục đường)

Chỉ hai kiểu kinh tế mang màu status (được/mất) để nhìn thấy ngay bộ khung kinh tế; các kiểu còn lại trung tính, phân biệt bằng nét đứt và bộ lọc.

| Kiểu | Nghĩa (nguồn → đích) |
|---|---|
| <span style="color:#0ca30c">**sản xuất**</span> | A sinh ra B mỗi turn / khi chiếm |
| <span style="color:#d03b3b">**tốn / nguyên liệu**</span> | Tạo/mua/duy trì A phải tiêu B |
| **tiến hóa thành** | A nâng cấp / tiến hóa thành B |
| **cần trước** | Phải có B mới có/dùng được A |
| **mở khóa / dạy thành** | A mở khóa hoặc biến ai đó thành B |
| **tăng chỉ số** | A buff / khuếch đại B |
| **chở / mang** | Cơ giới / thuyền chở B |
| **trữ tại** | B là kho chứa của A (lúa…) |
| **biến thành** | Khi bị phá/mất, A biến thành B |
| **trị / hồi** | A hồi phục cho B |
| **khắc chế / miễn nhiễm** | A khắc chế hoặc miễn nhiễm B (hai chiều) |
| **tác động** | Thời tiết / cơ chế tác động lên B |
| **diễn ra ở** | A chỉ dùng / xảy ra trong pha B |
| **gồm** | A bao gồm B |

## Cập nhật đồ thị

Cả `data/rules-graph.json` (mô hình) lẫn trang HTML này đều được sinh từ một nguồn duy nhất. Sửa danh sách node/edge trong `data/build_rules_graph.py` rồi chạy:

```bash
python3 data/build_rules_graph.py
```

Script kiểm tra trùng id, cạnh trỏ tới node lạ, và kiểu quan hệ lạ trước khi ghi file.
