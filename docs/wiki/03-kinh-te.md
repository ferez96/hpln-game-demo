# Kinh Tế & Hậu Cần

*Đọc trước: [Tổng Quan](wiki/00-tong-quan.md), [Địa Lý](wiki/01-dia-ly.md).*

**Chuỗi tài nguyên:** `Tài Nguyên → Dân → Lúa`. Lúa nuôi lính (xem [Quân Sự Cơ Bản](wiki/04-quan-su-co-ban.md)).

## Ba khu nhà hậu cần

Mua/khai thác/đổi ngay **đầu Go**. Nâng cấp tuần tự 1→2→3 (không nhảy cóc), nâng Turn N thì Turn N+1 xong — xem [quy tắc nâng cấp chung](wiki/09-phu-luc.md).

| Khu nhà | Cấp 1 (mặc định) | Cấp 2 | Cấp 3 | Chi phí nâng |
|---|---|---|---|---|
| **Mỏ** → Tài Nguyên | 3 / Turn | 5 / Turn | 7 / Turn | 4 → 5 TN |
| **Nhà Dân** (TN → Dân) | 1 TN = 2000 Dân | 1 TN = 3000 | 1 TN = 4000 | 4 → 5 TN |
| **Ruộng** (Dân → Lúa) | 1000 Dân = 1000 Lúa | 1000 = 2000 | 1000 = 3000 | 4 → 5 TN |

*Cột "Chi phí nâng" = tốn để lên Cấp 2, rồi lên Cấp 3.*

> Đổi Dân lấy Lúa **tiêu hao** đúng số Dân đem đổi. Mùa Thu: lúa làm ra **x2**; Mùa Đông: ruộng đóng băng, **0 lúa** (xem [Môi Trường](wiki/08-moi-truong.md)).

## Nguồn Tài Nguyên khác

| Nguồn | Tài Nguyên / Turn |
|---|---|
| Quan Văn | 1 (từ Turn 5: 2; nếu Bát Kỳ: **x5** — xem [Huyền Bí](wiki/07-huyen-bi.md)) |
| Mỏ | 3 / 5 / 7 theo cấp |
| Châu Thành | 3 |
| Ô Trắng | 1 |
| Thuyền Đánh Cá | 4 / 5 / 6 theo cấp (xem [Quân Sự Nâng Cao](wiki/06-quan-su-nang-cao.md)) |

## Luật Lương Thực (nuôi quân)

- **Chỉ lính tốn Lúa** để ăn mỗi Turn — Dân không tốn. Mỗi Turn: 1 Lúa nuôi 1 lính khỏi chết đói.
- Mua lính & mua/rút/gửi lúa diễn ra **đầu Go**; ngay sau đó GM tính lính hiện có để trừ lúa → **đầu Go lính phải ăn ngay, thiếu là chết đói ngay**.
- **Thứ tự ăn khi thiếu lúa:** lính có nối lương ăn theo khoảng cách gần-trước-xa-sau (tính bằng số ô nối thông lương tới vựa gần nhất); hết vựa gần mới tới lính xa hơn; lính bằng khoảng cách thì chọn ai ăn tùy ý. Lính **miễn nối lương** (VD Turn chờ sau khi phản bội) ưu tiên ăn lúa nước mình trước, khỏi xét khoảng cách.

<details>
<summary>Cơ chế phụ</summary>

- Tướng ra trận mà đầu Go còn 0 lính do chết đói → coi như thua, về thành ngay đầu Go.
- Lính đã ăn đủ đầu Go nhưng bị **cắt lương** cuối Go/Atc (mất kết nối) → xét tiếp luật chết đói do cắt lương (xem [Nối Lương](wiki/04-quan-su-co-ban.md)).
- **Bất đối xứng theo nguồn lương (có chủ đích):** Ô A chỉ nối vựa **Châu** mà vựa cạn lúa → toàn lính chết & Ô A **thành Ô Trắng** ngay. Nhưng Ô A nối kho chung quốc gia (qua **Trì**) mà kho cạn → lính vẫn chết đói, nhưng Ô A **vẫn giữ màu** nước cũ.

</details>

---

*Tiếp theo: [Quân Sự Cơ Bản](wiki/04-quan-su-co-ban.md) →*
