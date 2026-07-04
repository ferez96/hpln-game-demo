# Lộ Trình Học

Trang này khác với các trang domain còn lại: thay vì gom theo **chủ đề**, đây là thứ tự đọc theo **quan hệ phụ thuộc thật sự** giữa các khái niệm — khái niệm nào cần biết trước khái niệm nào. Dùng trang này khi mới học chơi lần đầu; dùng menu domain bên trái khi đã biết luật và cần tra lại 1 chi tiết.

## Sơ đồ phụ thuộc (chẩn đoán trước khi tái cấu trúc)

Sơ đồ dưới đây được dựng **trước khi** wiki này tồn tại, để tìm ra những chỗ tài liệu gốc (`Rulebook Chuẩn Hóa.md`, xếp theo §1–§18 tuần tự) tham chiếu tới 1 khái niệm *trước khi* khái niệm đó được định nghĩa — nói cách khác, đọc theo đúng thứ tự trang sẽ gặp khái niệm bị "tham chiếu ngược". Đồ thị này giữ nguyên như lúc chẩn đoán (không cập nhật theo cấu trúc domain mới) để làm bằng chứng cho các quyết định tái cấu trúc bên dưới.

<div style="border:1px solid #a83c3c33;border-radius:8px;overflow:hidden;margin:1em 0;">
<iframe src="wiki/assets/dependency-graph.html" style="width:100%;height:900px;border:0;display:block;" title="Sơ đồ phụ thuộc giữa các khái niệm"></iframe>
</div>

*Nếu iframe không hiển thị: [mở sơ đồ trong tab riêng](wiki/assets/dependency-graph.html ':ignore').*

Đồ thị tìm ra đúng **6 cạnh lệch thứ tự**. Sau khi tách tài liệu thành domain, 5/6 đã được xử lý:

| Cạnh lệch | Xử lý trong wiki domain |
|---|---|
| Địa Hình → Sa Trường | **Đã sửa.** Sa Trường dời hẳn về [Địa Lý & Bản Đồ](01-dia-ly.md), định nghĩa ngay cùng chỗ với các loại ô khác. |
| Dân Tâm/Uy Danh (sinh ra) → thăng Đại Tướng Quân | **Đã sửa.** Cả 2 nay cùng nằm trong [Danh Vọng & Thăng Tiến](05-danh-vong.md), đúng thứ tự sinh ra trước khi tiêu. |
| Quân Đội → Phản Bội | **Đã sửa.** Phản Bội dời sang [Quân Sự Nâng Cao](06-quan-su-nang-cao.md), đọc sau khi đã biết Quân Đội + Di Chuyển. |
| Di Chuyển → Phản Bội | **Đã sửa** (lý do như trên). |
| Bát Kỳ (mystics) → Chiến Tướng | **Đã sửa.** Cả 2 nay cùng nằm trong [Huyền Bí & Đặc Dị](07-huyen-bi.md), xếp lại theo đúng thứ tự Thủy Kính (dạy Bát Kỳ) trước Chiến Tướng. |
| Bát Kỳ (mystics) → Trận Pháp | **Chưa sửa theo vị trí trang** — đây là 1 trong số ít trường hợp domain-hoá và topo-hoá xung đột nhau: Bát Kỳ thuộc chủ đề Huyền Bí (đọc sau), nhưng Trận Pháp (chủ đề Quân Sự) lại cần nó. Xử lý bằng cách khác: [Trận Pháp](06-quan-su-nang-cao.md) có ghi chú tham chiếu tới thẳng phần Bát Kỳ, và thứ tự đúng được nêu rõ ở bảng bên dưới. |

## Thứ Tự Đọc Đề Xuất

| # | Khái niệm | Nằm ở trang |
|---|---|---|
| 1 | Mục Tiêu & Phe | [Khung Sườn & Tổng Quan](00-tong-quan.md) |
| 1 | Nhịp Thời Gian (Turn/Go/Atc) | [Khung Sườn & Tổng Quan](00-tong-quan.md) |
| 2 | Chức Vụ | [Khung Sườn & Tổng Quan](00-tong-quan.md) |
| 2 | Địa Hình (6 loại ô + Sa Trường) | [Địa Lý & Bản Đồ](01-dia-ly.md) |
| 3 | Kinh Tế (Mỏ/Nhà Dân/Ruộng/Lương) | [Kinh Tế & Hậu Cần](03-kinh-te.md) |
| 3 | Dân Tâm & Uy Danh — sinh ra | [Danh Vọng & Thăng Tiến](05-danh-vong.md) |
| 3 | Trục Xuất & Trảm Đầu | [Chính Trị Nội Bộ](02-chinh-tri.md) |
| 4 | Quân Đội Cơ Bản | [Quân Sự Cơ Bản](04-quan-su-co-ban.md) |
| 4 | Uy Danh → thăng Đại Tướng Quân | [Danh Vọng & Thăng Tiến](05-danh-vong.md) |
| 4 | Hoa Đà / Tả Từ / Thủy Kính (Bát Quái, Bát Kỳ) | [Huyền Bí & Đặc Dị](07-huyen-bi.md) |
| 5 | Di Chuyển & Nối Lương | [Quân Sự Cơ Bản](04-quan-su-co-ban.md) |
| 5 | Kỹ Năng Tác Chiến | [Quân Sự Nâng Cao](06-quan-su-nang-cao.md) |
| 5 | Lò Rèn & Cơ Giới | [Quân Sự Nâng Cao](06-quan-su-nang-cao.md) |
| 6 | Binh Pháp — Công Thức Chiến Đấu | [Quân Sự Cơ Bản](04-quan-su-co-ban.md) |
| 6 | Phản Bội | [Quân Sự Nâng Cao](06-quan-su-nang-cao.md) |
| 6 | Thuyền & Thủy Chiến | [Quân Sự Nâng Cao](06-quan-su-nang-cao.md) |
| 7 | Thời Tiết — hiệu ứng mùa | [Môi Trường — Thời Tiết](08-moi-truong.md) |
| 7 | Phù Chú | [Huyền Bí & Đặc Dị](07-huyen-bi.md) |
| 7 | Tinh Binh (mốc giết địch) | [Quân Sự Nâng Cao](06-quan-su-nang-cao.md) |
| 8 | Trận Pháp `[cần đọc Bát Kỳ ở bậc 4 trước]` | [Quân Sự Nâng Cao](06-quan-su-nang-cao.md) |
| 8 | Chiến Tướng | [Huyền Bí & Đặc Dị](07-huyen-bi.md) |
| 9 | Luật Bổ Sung / Ví dụ | [Phụ Lục](09-phu-luc.md) |

## Vì sao domain-hoá và topo-hoá không phải lúc nào cũng khớp nhau

Domain gom theo **chủ đề** (để tra cứu nhanh khi đã biết luật); lộ trình học gom theo **quan hệ phụ thuộc** (để học đúng thứ tự lần đầu). Đa số trường hợp 2 tiêu chí này khớp nhau, nhưng không phải luôn luôn — trường hợp Bát Kỳ/Trận Pháp ở trên là ví dụ rõ nhất: Bát Kỳ thuộc về chủ đề Huyền Bí một cách tự nhiên, nhưng về mặt phụ thuộc nó lại cần được học sớm hơn Trận Pháp (chủ đề Quân Sự). Không có cách sắp xếp tuyến tính nào thỏa mãn được cả 2 tiêu chí cùng lúc trong trường hợp này — đây là lý do wiki cần **2 cách điều hướng song song** thay vì ép mọi thứ vào 1 thứ tự duy nhất.
