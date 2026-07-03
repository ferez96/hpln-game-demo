# Kinh Tế & Hậu Cần

Cần biết [Khung Sườn & Tổng Quan](00-tong-quan.md) (Quan Văn sinh Tài Nguyên) và [Địa Lý & Bản Đồ](01-dia-ly.md) (Ô Trắng/Châu Thành/Thành Trì sinh Tài Nguyên hoặc trữ Lúa).

Chuỗi tài nguyên: **Tài Nguyên → Dân → Lúa**. Lúa dùng để nuôi lính (xem [Quân Sự Cơ Bản](04-quan-su-co-ban.md)).

## Mỏ

*Cơ bản*
- Sinh Tài Nguyên mỗi Turn theo cấp: Cấp 1 = 3 (mặc định), Cấp 2 = 5, Cấp 3 = 7.
- Nâng cấp tuần tự: lên Cấp 2 tốn 4 Tài Nguyên, lên Cấp 3 tốn 5 Tài Nguyên (nâng đầu Go, xong ở Turn kế tiếp — xem quy tắc nâng cấp chung ở [Phụ Lục — Luật Bổ Sung](09-phu-luc.md)).

## Nhà Dân

*Cơ bản*
- Đổi Tài Nguyên lấy Dân theo tỉ giá tăng dần theo cấp: Cấp 1 = 1 Tài Nguyên đổi 2000 Dân (mặc định), Cấp 2 = 1 Tài Nguyên đổi 3000 Dân, Cấp 3 = 1 Tài Nguyên đổi 4000 Dân.
- Nâng cấp: Cấp 2 tốn 4 Tài Nguyên, Cấp 3 tốn 5 Tài Nguyên.

## Ruộng

*Cơ bản*
- Đổi Dân lấy Lúa theo tỉ giá tăng dần theo cấp: Cấp 1 = 1000 Dân đổi 1000 Lúa (mặc định, tỉ lệ 1:1), Cấp 2 = 1000 Dân đổi 2000 Lúa (1:2), Cấp 3 = 1000 Dân đổi 3000 Lúa (1:3).
- Nâng cấp: Cấp 2 tốn 4 Tài Nguyên, Cấp 3 tốn 5 Tài Nguyên.

<details>
<summary>Cơ chế phụ</summary>

- Đổi Dân lấy Lúa sẽ tiêu hao (mất) đúng số Dân đã đem đổi.

</details>

## Luật Lương Thực (Nuôi Quân)

*Cơ bản*
- Chỉ lính tốn Lúa để ăn mỗi Turn — Dân không tốn Lúa.
- Thứ tự ăn Lúa khi thiếu: lính có nối lương ăn theo khoảng cách gần trước xa sau, tính bằng số ô di chuyển nối thông lương tới vựa lúa gần nhất; hết lúa ở vựa gần thì mới tới lượt lính xa hơn; lính bằng khoảng cách được chọn ai ăn tùy ý. Lính đang được miễn nối lương (VD: trong Turn chờ gia nhập nước mới sau khi phản bội — xem [Quân Sự Nâng Cao](06-quan-su-nang-cao.md)) được ưu tiên ăn lúa nước mình trước, không xét khoảng cách.
- Việc mua lính và mua/rút/gửi lúa diễn ra đầu Go; ngay sau đó GM tính lính hiện có để trừ lúa tương ứng ngay — tức đầu Go bắt buộc lính phải ăn lúa ngay, không đủ lúa thì lính chết đói ngay lập tức.

<details>
<summary>Cơ chế phụ</summary>

- Tướng ra trận mà đầu Go bị chết đói hết quân (còn 0 lính) thì coi như thua trận, về thành ngay từ đầu Go đó.
- Lính đã ăn đủ đầu Go nhưng bị cắt lương ở cuối Go/Atc cùng Turn đó (mất kết nối — xem [Quân Sự Cơ Bản](04-quan-su-co-ban.md)) thì tiếp tục xét theo luật chết đói do cắt lương.
- `[GHI CHÚ]` Có 1 khác biệt đáng chú ý theo nguồn lương: nếu Ô A chỉ nối được với vựa lúa của 1 Châu Thành và vựa đó hết lúa, toàn bộ lính ở Ô A chết đói và Ô A biến thành Ô Trắng ngay. Nhưng nếu Ô A nối với kho lúa chung của quốc gia (qua Thành Trì) và kho đó hết lúa, lính vẫn chết đói hết — nhưng Ô A vẫn giữ màu thuộc quốc gia cũ (không tự động thành Ô Trắng). Đây là sự bất đối xứng có chủ đích trong luật gốc, không phải lỗi chuẩn hóa.

</details>

---

*Tiếp theo: [Quân Sự Cơ Bản](04-quan-su-co-ban.md) →*
