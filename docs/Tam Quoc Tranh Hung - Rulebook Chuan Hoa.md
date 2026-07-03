# Tam Quốc Tranh Hùng — Rulebook Chuẩn Hóa

> **Đã có bản kế tiếp:** nội dung file này đã được tách lại theo domain và publish thành wiki tại `docs/index.html` (mở bằng GitHub Pages, hoặc `docs/wiki/*.md` để đọc thô). File này được giữ nguyên làm bản nháp gốc/lịch sử — không xóa, nhưng nên đọc wiki trước.

Nguồn gốc: `reference/[Text Game] - Tam Quốc Chí.pdf` (29 trang).
Mục đích file này: viết lại toàn bộ luật chơi bằng văn phong rõ ràng, nhất quán, sửa lỗi chính tả/diễn đạt, và chỉ ra các chỗ luật gốc mâu thuẫn hoặc thiếu rõ ràng để thống nhất cách hiểu.

File PDF gốc vẫn được giữ nguyên làm tài liệu lịch sử — không chỉnh sửa trực tiếp lên đó.

Có bản rút gọn chỉ gồm phần Cơ Bản (không edge-case, không ghi chú) tại `docs/Tam Quoc Tranh Hung - Luat Toi Gian.md` — dùng để đọc nhanh/chơi thử; file này (đầy đủ Cơ Chế Phụ + Phụ Lục tra cứu/rà soát) vẫn là nguồn tham chiếu chính.

## Cơ Sở Gốc (Bất Biến — Không Bao Giờ Thay Đổi)

- **3 phe.** Mỗi phe đúng 8 người: 1 Vua (Chủ Công) + 1 Quân Sư + 6 Quan (Quan Văn hoặc Tướng Quân) — tổng 24 người chơi.
- **Mục tiêu mỗi phe, theo đúng thứ tự ưu tiên:**
  - **A. Tiêu diệt hoàn toàn 2 phe còn lại.**
  - **B. Nếu không thể tiêu diệt hết cả 2 phe kia:** giành nhiều điểm nhất có thể.

Đây là gốc không đổi của toàn bộ game. Mọi luật khác trong tài liệu này — chức vụ, kinh tế, quân sự, chiến đấu, cơ chế đặc biệt — đều chỉ là cách hiện thực hóa 2 mục tiêu A/B ở trên. Luật nào mâu thuẫn với gốc này thì gốc này luôn được ưu tiên.

## Quy ước ký hiệu dùng trong tài liệu này

- `[CẦN LÀM RÕ]` — luật gốc mâu thuẫn hoặc không đủ thông tin, cần bạn xác nhận cách hiểu đúng.
- `[GIẢ ĐỊNH]` — chỗ mình đã tự chọn 1 cách hiểu hợp lý nhất để luật mạch lạc; cứ phản hồi trực tiếp trong hội thoại nếu ý bạn khác.
- `[GHI CHÚ]` — quan sát thêm, không chặn tiến độ, chỉ để bạn lưu ý.

**Nguyên tắc tách khái niệm:** luật gốc rất dày đặc và nhiều khái niệm dùng chung giữa nhiều đối tượng khác nhau (VD: luật Phản Bội áp dụng cho cả Quan Văn lẫn Tướng Quân, luật Trục Xuất/Trảm Đầu là quyền chung của Chủ Công lên mọi chức vụ dưới mình). Thay vì lặp lại các luật dùng chung ở từng mục, tài liệu này tách chúng thành khối riêng và để các mục liên quan tham chiếu chéo đến khối đó. Trong mỗi khái niệm (dùng chung hoặc riêng), nội dung được chia tiếp thành **Cơ Bản** (luôn đúng, cần biết trước) và **Cơ Chế Phụ** (trường hợp đặc biệt, thủ tục, ngoại lệ).

## Mục lục

Tài liệu này **không theo thứ tự trang của PDF gốc**. Thay vào đó, chia thành 2 phần: Phần A là tập luật tối thiểu để chơi được 1 ván game trọn vẹn (thiết lập, bản đồ, kinh tế, quân đội, di chuyển, chiến đấu, mùa); Phần B mở rộng thêm các cơ chế đặc biệt làm sâu chiến thuật (phù chú, kỹ năng, trận pháp, thủy chiến, cơ giới, mốc mở khóa, hệ thống tướng, nhân vật đặc biệt).

### Phần A — Luật Cơ Bản (đủ để chơi được game)

1. ✅ Thiết Lập & Tổng Quan
2. ✅ Chức Vụ
   - 2.1 Bốn Chức Vụ Cơ Bản (Chủ Công / Quân Sư / Quan Văn / Tướng Quân)
   - 2.2 Đại Tướng Quân
3. ✅ Quản Trị Quốc Gia
   - 3.1 Gián Điệp Cài Cắm (tùy chọn)
   - 3.2 Đảo Chính (tùy chọn)
   - 3.3 Trục Xuất & Trảm Đầu (dùng chung, bắt buộc)
   - 3.4 Phản Bội (dùng chung, bắt buộc)
4. ✅ Bản Đồ & Địa Hình (Ô Trắng, Châu Thành, Thành Trì, Rừng, Núi, Sông)
5. ✅ Kinh Tế & Hậu Cần (Mỏ, Nhà Dân, Ruộng, luật lương thực/đói)
6. ✅ Quân Đội Cơ Bản (Bộ Binh, Cung Thủ, Kỵ Mã — chỉ số, tuyển quân, biên chế)
7. ✅ Di Chuyển, Chiếm Đất & Nối Lương
8. ✅ Binh Pháp Cơ Bản — Công Thức Chiến Đấu
9. ✅ Thời Tiết 4 Mùa

### Phần B — Cơ Chế Đặc Biệt (mở rộng chiều sâu chiến thuật)

10. ✅ Phù Chú (Hỏa / Tốc / Phong / Cổ Vũ / Thủy)
11. ✅ Kỹ Năng Tác Chiến (Ẩn Thân, Đặt Bẫy, Trinh Sát)
12. ✅ Trận Pháp (7 loại trận)
13. ✅ Thuyền & Thủy Chiến
14. ✅ Lò Rèn & Cơ Giới (Vũ Khí, Khiên, Tên, Ngựa Chiến, Xe Đục Thành, Tháp/Máy Bắn Đá...)
15. ✅ Tinh Binh — Mốc Mở Khóa (Mộc Ngưu, Doanh Trại, Thao Trường, Kỵ Tây Lương, Mã Cung Thủ, Chiến Xa Mã, Tháp Bắn Tên, Máy Bắn Đá, Nỏ Liên Châu)
16. ✅ Hệ Thống Nhập Hồn Chiến Tướng
17. ✅ Nhân Vật Đặc Biệt & Dân Tâm/Uy Danh (Hoa Đà, Tả Từ, Thủy Kính)
18. ✅ Luật Bổ Sung / Ví Dụ Minh Họa / FAQ Tổng Hợp

---

## 1. Thiết Lập & Tổng Quan

### 1.1 Cơ Bản

Game có đúng 3 quốc gia. Mỗi quốc gia gồm đúng 8 người: 1 Vua (Chủ Công) + 1 Quân Sư + 6 Quan (Quan Văn hoặc Tướng Quân) — tổng cộng 24 người chơi (xem Cơ Sở Gốc ở đầu tài liệu).

Mỗi ngày thực tế = 1 Turn trong game. Một Turn chỉ được tính là kết thúc khi cả lượt Go và lượt Atc đã diễn ra xong. Khung giờ mặc định: 9h–20h là lượt Go, 20h hôm đó đến 9h hôm sau là lượt Atc.

**Thiết lập vai trò:** GM chọn ra 3 người làm Chủ Công, mỗi người lãnh đạo 1 quốc gia. Mỗi Chủ Công tự chọn 1 người mình tin tưởng nhất để làm Quân Sư (nếu người đó đồng ý nhận).

6 người chơi còn lại của mỗi quốc gia chọn quốc gia mình muốn phò tá — có thể ứng tuyển ở nhiều nước cùng lúc nhưng phải chốt lại đúng 1 lựa chọn cuối cùng. Sau khi Chủ Công đồng ý nhận, Chủ Công sẽ bí mật phân người đó làm Quan Văn hoặc Tướng Quân; GM giữ kín các quyết định này cho đến khi công bố đồng loạt cả 3 quốc gia cùng một lúc. Một khi GM đã công bố, quyết định không thể thay đổi.

**Mục tiêu & điều kiện kết thúc (xem Cơ Sở Gốc):**
- **A.** Game kết thúc ngay khi có 2 quốc gia bị phá hết toàn bộ Thành Trì — quốc gia còn lại duy nhất thống nhất thiên hạ.
- **B.** Nếu hết thời gian chơi mà chưa phân được thắng bại theo (A): quốc gia có điểm cao nhất thắng.

**Thời lượng & tính điểm:** game kéo dài 5 năm (20 Turn). Điểm lãnh thổ chỉ được tính vào 2 Turn mỗi năm: Xuân và Thu. Cuối mỗi Turn Xuân/Thu, mỗi quốc gia được cộng điểm theo lãnh thổ đang sở hữu: 1 Ô Thành Trì = +5 điểm, 1 Ô Châu Thành = +3 điểm, 1 Ô Trắng = +1 điểm. Hết năm thứ 5, cộng dồn toàn bộ điểm của tất cả các Turn Xuân/Thu — quốc gia cao điểm nhất thắng.

Nếu hòa điểm: xét quốc gia nào có nhiều Ô Thành Trì hơn ở Turn cuối cùng; nếu vẫn hòa thì xét Ô Châu Thành; nếu vẫn hòa nữa thì xét Ô Trắng.

### 1.2 Cơ Chế Phụ

**Linh động thời gian:** GM có thể chủ động rút ngắn thời gian chờ giữa các Turn để game diễn ra nhanh hơn.

**Trọng tâm lượt Atc:** lượt Atc chủ yếu được dùng cho các hành động bắn tên của Cung Thủ (ngoài ra một số phù chú và kỹ năng tác chiến khác cũng dùng ở lượt Atc — xem các mục liên quan).

**Cập nhật tình hình:** GM liên tục cập nhật tình hình cho toàn bộ người chơi: chức vụ, quốc gia, ai đã tử trận, ai đã bị loại. Mỗi Turn có 2 chiến báo (cuối lượt Go và cuối lượt Atc), mô tả: địa điểm, thắng/bại, số tướng, số quân, loại lính, bắn phá, cơ giới, trận pháp, chỉ số, có dính bẫy hay không, phù chú đã dùng, và các sự kiện khác nếu luật cho phép báo cáo.

Hai cơ chế chính trị nội bộ — gián điệp cài cắm lúc thiết lập, và đảo chính sau khi thống nhất — được gộp chung với Trục Xuất/Trảm Đầu và Phản Bội vào §3 Quản Trị Quốc Gia, vì tất cả đều xoay quanh chủ đề lòng trung thành/quyền lực chính trị chứ không riêng gì phần thiết lập ban đầu.

---

## 2. Chức Vụ

### 2.1 Bốn Chức Vụ Cơ Bản

**Chủ Công**

*Cơ bản*
- Đứng đầu, lãnh đạo 1 quốc gia. Mặc định có Skill Đại Tướng và không bao giờ bị giáng cấp.
- Là người duy nhất nắm được toàn bộ thông tin cơ mật tổng quan của quốc gia mình.
- Mỗi Turn tạo ra 1 Đế Khí; có thể chọn quy đổi Đế Khí đó thành 1 Dân Tâm hoặc 1 Uy Danh. `[GHI CHÚ]` Tài liệu gốc không nêu công dụng nào khác của Đế Khí ngoài việc quy đổi — xác nhận đây là chủ đích, không phải bị thiếu nội dung.
- Được phép cầm quân ra trận, chức năng như Tướng Quân nếu không có luật nào khác nói thêm.
- Là người duy nhất có quyền xét duyệt/thu nhận nhân tài mới vào quốc gia, và là người duy nhất có quyền Trục Xuất/Trảm Đầu (xem §3.3).
- Không thể phản bội quốc gia của chính mình.

*Cơ chế phụ*
- Bại trận: về thành dưỡng sức 2 Turn (ví dụ bại ở Turn 1 thì khỏe lại vào đầu Turn 4); vẫn tạo Đế Khí bình thường trong lúc dưỡng, nhưng bị trừ 3 điểm Uy Danh (có thể xuống âm).
- Xét duyệt nhân tài thực hiện vào cuối lượt Atc; 1 Turn có thể chiêu nạp nhiều người cùng lúc. Người xin gia nhập ở đầu lượt Go của Turn N phải chờ đến cuối lượt Atc của Turn N mới được xét duyệt.

**Quân Sư**

*Cơ bản*
- Là người tiếp nhận thông tin và sàng lọc tin nhắn gửi cho GM.
- Họp cùng toàn bộ Quan Văn để lấy ý kiến đa số về việc chi tiêu tài nguyên (hậu cần, chiến sự), sau đó chốt lệnh gửi cho GM. Phải tuân theo ý kiến đa số của Quan Văn trong nước; nếu không phương án nào đạt quá bán số phiếu, Quân Sư có quyền tự quyết.
- Cũng phụ trách tổng hợp toàn bộ lệnh chiến sự/giao chiến để gửi cho GM.
- Không thể phản bội quốc gia của chính mình.

*Cơ chế phụ*
- Có thể bị Chủ Công Trảm Đầu bất cứ lúc nào, không bị ràng buộc bởi thời điểm hay thủ tục như khi xử Tướng Quân và Quan Văn (ngoại lệ so với luật chung ở §3.3).

**Quan Văn**

*Cơ bản*
- Mỗi Turn làm ra 1 Tài Nguyên và 1 điểm Dân Tâm cho quốc gia mình. Từ năm thứ 2 (Turn 5) trở đi, mỗi Turn làm ra 2 Tài Nguyên.
- Không được tự mình cầm quân ra trận, ngoại trừ khi đứng trên Châu/Thành Trì tham gia một Trận Pháp — xem `[CẦN LÀM RÕ]` bên dưới.
- Phụ trách hậu cần và phát triển xây dựng lực lượng quốc gia.
- Có thể phản bội quốc gia (xem §3.4 — không cần điều kiện quân số tối thiểu như Tướng Quân).

*Cơ chế phụ*
- Nếu thua trận: về nước dưỡng thương 1 Turn. Trong Turn đó không được làm bất kỳ việc gì: không lập trận, không coi doanh/thao, không thông lương, và cũng không tạo ra tài nguyên, phù, hay dân tâm.
- Có quyền tham ô — giữ lại phần Tài Nguyên do chính mình làm ra thay vì nộp về quốc khố (báo riêng cho GM vào cuối lượt Atc). Nếu sau đó phản bội, sẽ mang theo tài sản tham ô này sang quốc gia mới.

`[CẦN LÀM RÕ]` Ở phần chức vụ (trang 2), luật chung chỉ ghi Quan Văn "chỉ cầm quân khi đứng trên thành tham gia Trận". Nhưng ở phần Trận Pháp (trang 21) lại ghi rõ điều kiện: Văn phải là **Bát Kỳ** (tức đã được Thủy Kính Tiên Sinh dạy riêng) mới được chỉ huy lính vào trận. Bản chuẩn hóa này tạm ưu tiên luật chi tiết hơn: **chỉ Quan Văn đã học thành Bát Kỳ mới được cầm quân trong Trận Pháp; mọi Quan Văn khác tuyệt đối không cầm quân được, kể cả khi đứng trên thành.** Xác nhận giúp cách hiểu này có đúng ý định của bạn không.

**Tướng Quân**

*Cơ bản*
- Mỗi Turn tạo ra 1 điểm Uy Danh cho quốc gia mình. Được cầm quân ra trận. Chỉ các Tướng Quân có mặt từ đầu game mới mặc định có sẵn 1000 lính Bộ Binh (Chủ Công không có lính mặc định).
- Tự nhắn tin (PM) cho GM để ra lệnh hành quân (lượt Go) hoặc ra lệnh tác chiến (lượt Atc). Nếu Tướng bận, Quân Sư có quyền PM thay, miễn là Tướng đó không phản đối việc này.
- Giết trực tiếp liên tiếp từ 3 Tướng địch trở lên (không tính giết Quan Văn) thì được thăng làm Đại Tướng Quân (xem §2.2).
- Có thể phản bội quốc gia (xem §3.4 — cần chỉ huy tối thiểu 2000 quân).

*Cơ chế phụ*
- Nếu bại trận: về Thành Trì dưỡng sức 2 Turn giống Chủ Công (vẫn tiếp tục tạo ra Uy Danh trong lúc dưỡng). Tướng chết, bại trận, hoặc chết đói/bệnh khi đang ở ngoài Sa Trường: tất cả đều được đưa về Thành Trì (ra khỏi bản đồ).
  - Tàn binh (lính mất tướng) sau khi bại trận ở Turn 1: về Thành Trì nghỉ ngay trong Turn đó, và có thể nhận lệnh xuất quân trở lại ngay từ Turn kế tiếp. `[GIẢ ĐỊNH]` Tức là lính hồi phục nhanh hơn vị tướng của mình (chỉ 1 Turn so với 2 Turn) vì bản thân lính không bị thương như tướng.
  - Tàn binh bại trận do chết đói/bệnh thì coi như đã chết hẳn, không hồi phục.
- Một Tướng và quân của mình khi đang ở ngoài Sa Trường có quyền kháng lệnh, chỉ áp dụng cho các lệnh không tiêu tốn tài nguyên trực tiếp; GM sẽ giữ bí mật việc kháng lệnh này cho đến khi tự lộ ra.
- Liên Trảm (điều kiện thăng Đại Tướng Quân): chỉ tính khi giết trực tiếp (cùng ô giao tranh, hoặc bắn cung chết trực tiếp). Nếu 2 Tướng cùng phe cùng giết 4 Tướng địch trong 1 Turn, cả hai đều được tính đủ 4 kill. Chỉ cần thua trận 1 lần là mất hết chuỗi Liên Trảm — số kill tích lũy quay về 0.

### 2.2 Đại Tướng Quân

*Cơ bản*
- Có đầy đủ chức năng của Tướng Quân, cộng thêm Skill Đại Tướng có thể kích hoạt: ngay khi giao chiến, +1 Công và +1 Thủ cho mỗi lính đang thuộc quyền chỉ huy của Tướng đó, hiệu lực trong 1 Turn (cơ chế tương tự Phù Cổ Vũ, và có thể cộng dồn với Phù Cổ Vũ — ví dụ tổng cộng thành +2 Công/+1 Thủ).
- Có thể dùng 10 điểm Uy Danh để thăng thẳng lên Đại Tướng Quân, thay cho điều kiện giết 3 tướng liên tiếp. Nếu dùng Uy Danh để thăng cấp ở Turn N, chính thức lên cấp vào đầu Turn N+1.
- Chỉ cần thua trận 1 lần là bị giáng xuống lại Tướng Quân.
- Chủ Công mặc định có sẵn Skill Đại Tướng (vẫn bị delay như trên) và không bao giờ bị giáng cấp.
- Không thể phản bội quốc gia mình (nhưng vẫn có thể tham gia đảo chính).

*Cơ chế phụ*
- Sau khi dùng Skill Đại Tướng, bị khóa (delay) 1 Turn mới được dùng lại (ví dụ dùng ở Turn 1 thì Turn 3 mới dùng tiếp, cùng lượt Go/Atc tương ứng).
- Mọi trường hợp thăng/giáng cấp đều được GM thông báo cho toàn bộ người chơi (ví dụ: thăng cấp bằng Uy Danh ở Turn 1 thì được báo vào cuối lượt Atc của Turn 1).

---

## 3. Quản Trị Quốc Gia

Bốn cơ chế chính trị/quyền lực nội bộ dùng chung giữa nhiều chức vụ — gián điệp, đảo chính, trục xuất/trảm đầu, phản bội — được gom vào 1 mục riêng thay vì rải rác ở §1 và §2, vì tất cả đều xoay quanh cùng 1 chủ đề: lòng trung thành và quyền lực chính trị trong quốc gia.

**Bắt buộc vs Tùy chọn:** Trục Xuất & Trảm Đầu (§3.3) và Phản Bội (§3.4) là cơ chế bắt buộc, luôn có hiệu lực trong mọi ván game. Gián Điệp Cài Cắm (§3.1) và Đảo Chính (§3.2) là luật **tùy chọn** — GM quyết định trước khi game bắt đầu có bật hay không, không bắt buộc phải dùng để game vận hành được.

### 3.1 Gián Điệp Cài Cắm (Tùy Chọn)

*Cơ bản*
- Khi vào game, mỗi quốc gia được bí mật cài thêm 2 người chơi thực chất thuộc phe địch ngay từ đầu.
- Những người này có thể công khai "trở về" phe địch của mình bất cứ lúc nào, với điều kiện quốc gia địch đó vẫn chưa vong quốc (chưa bị đánh sập hoàn toàn) tại thời điểm họ trở về.

`[GHI CHÚ]` Tài liệu gốc không nói rõ 2 người này đóng vai trò gì ở nước "vỏ bọc" trước khi lộ diện (có làm việc/sản xuất bình thường như Quan Văn hoặc Tướng Quân của nước đó không?), cũng như thủ tục "trở về" cụ thể (PM riêng cho GM? có mất tài sản/quân đang nắm giữ không, giống luật Phản Bội ở §3.4 không?). Đây là chỗ nên bổ sung luật chi tiết khi triển khai thực tế.

### 3.2 Đảo Chính (Tùy Chọn)

*Cơ bản*
- Chỉ có thể xảy ra sau khi 1 quốc gia đã thống nhất thiên hạ (thắng chung cuộc — xem §1).
- Nếu từ 1/2 tổng số Quan Văn và Tướng Quân (kể cả Đại Tướng Quân) trở lên bí mật đồng thuận đảo chính, một Hoàng Đế mới sẽ được lập.
- Dù đảo chính thành công hay không, GM chỉ công bố số phiếu của mỗi bên, không tiết lộ danh tính người đã bỏ phiếu.

*Cơ chế phụ*
- Đại Tướng Quân không thể phản bội quốc gia mình (xem §3.4) nhưng vẫn được tính là có quyền tham gia đảo chính — 2 cơ chế này độc lập với nhau.

### 3.3 Trục Xuất & Trảm Đầu (quyền riêng của Chủ Công)

*Cơ bản*
- Chủ Công có quyền Trục Xuất hoặc Trảm Đầu bất kỳ ai trong quốc gia mình, có thể xử lý nhiều người cùng lúc trong 1 Turn.
- Trảm Đầu thực hiện ở lượt Go; Trục Xuất thực hiện ở lượt Atc.
- Cả 2 đều thu hồi toàn bộ tài sản và quân lính của người bị xử — trừ trường hợp người đó đã phản bội và đã rời khỏi tầm với của Chủ Công (xem §3.4 để biết phần thu hồi khi bắt được kẻ phản bội).

*Cơ chế phụ*
- Kẻ bị Trục Xuất mà sang Turn kế tiếp không phò tá quốc gia nào khác sẽ bị loại khỏi game.
- Quân bị thu hồi do Trục Xuất/Trảm Đầu đứng yên tại chỗ trên bản đồ cho đến khi có lệnh mới: quân của kẻ bị Trục Xuất biến mất khỏi bản đồ (xuất hiện lại tại Thành Trì quốc gia mới nếu được nhận); quân của kẻ phản bội (chưa bị bắt) vẫn hiển thị nguyên vị trí cũ trên bản đồ.
- Ngoại lệ: Quân Sư có thể bị Trảm Đầu bất cứ lúc nào, không theo thủ tục/thời điểm ở trên (xem §2.1).

### 3.4 Phản Bội (áp dụng: Quan Văn, Tướng Quân)

*Cơ bản*
- Chủ Công, Quân Sư, và Chiến Tướng (xem §16) không bao giờ phản bội được quốc gia mình.
- Phản bội thực hiện vào cuối lượt Atc.
- Điều kiện: đang ở ngoài Sa Trường (Sa Trường = mọi ô không phải Ô Thành Trì) và không có Tướng trung thành nào khác đứng cùng ô. Tướng phản bội cần chỉ huy tối thiểu 2000 quân; Quan Văn phản bội không cần điều kiện quân số này.
- Khi phản: Tướng mang theo toàn bộ quân đang chỉ huy; Quan Văn mang theo tài sản tham ô (nếu có).
- Vùng đất kẻ phản bội đang chiếm đóng thuộc quyền sở hữu cá nhân của hắn. Nếu gia nhập quốc gia mới thành công, vùng đất đó sáp nhập vào quốc gia mới; nếu hắn chết trước khi kịp gia nhập, vùng đất đó trở thành vô chủ.

*Cơ chế phụ*
- Turn chờ (từ lúc tuyên bố phản đến lúc chính thức gia nhập nước mới): kẻ phản bội được miễn yêu cầu nối lương. Nếu sang Turn kế tiếp mà không phò tá quốc gia nào, bị loại khỏi game. Nếu bị giết trong giao chiến trong Turn chờ đó, cũng bị loại khỏi game.
- Lệnh Trảm Đầu của Chủ Công nhắm vào kẻ phản bội (thực hiện đầu lượt Go) được ưu tiên xử lý trước các lệnh khác của kẻ đó.
- Nếu Chủ Công Trảm Đầu được kẻ phản bội trước khi kịp gia nhập nước mới: với Tướng Quân — Chủ Công thu hồi được 1/2 số quân, kẻ phản bội và 1/2 quân còn lại bị loại khỏi game; với Quan Văn — kẻ đó bị loại khỏi game, nhưng Chủ Công không thu hồi lại được tài sản nào.
- Nếu có Quan Văn trung thành đứng cùng ô lúc Tướng phản bội: Quan Văn đó trốn thoát về nước cũ vào lượt Atc.
- Lính đi theo kẻ phản bội vẫn giữ nguyên chỉ số của quốc gia cũ cho đến khi chính thức gia nhập quốc gia mới; từ đó áp dụng chỉ số của quốc gia mới.

---

## 4. Bản Đồ & Địa Hình

### 4.0 Luật Chung Toàn Bản Đồ

*Cơ bản*
- Chỉ 3 loại ô có thể thuộc về 1 quốc gia (được "tô màu" sở hữu): Ô Trắng, Châu Thành, Thành Trì. Rừng, Núi, Sông không bao giờ thuộc về quốc gia nào.
- Địa hình bản đồ bất biến trong suốt ván game: không hủy/di dời Châu/Trì, không lấp sông, không đào núi, không chặt/trồng rừng; rừng bị cháy cũng không biến mất vĩnh viễn.
- GM công khai vị trí chính xác của mỗi Tướng lên bản đồ chung cho toàn game thấy (không công khai số lính/thuyền/cơ giới đi kèm), trừ khi Tướng đó đang ở trong Ô Rừng (ẩn khỏi bản đồ) hoặc đang dùng kỹ năng Ẩn Thân (xem §11).
- Tướng chỉ được rút về "không gian ảo" (rời khỏi bản đồ) khi bị thương/bại trận; Tướng khỏe mạnh đứng trên thành vẫn luôn hiện trên bản đồ.

*Cơ chế phụ*
- Di chuyển mà bị Hỏa/Thủy Phù chặn đường dễ khiến Tướng kẹt sang Turn sau và vi phạm luật "tối đa 1 Turn" ở Núi/Rừng — xem cảnh báo cụ thể ở mục Núi/Rừng bên dưới và mục Phù Chú (§10).

### Ô Trắng (đất trống)

*Cơ bản*
- Có thể chiếm: kéo quân vào là chiếm được ngay.
- Mỗi Turn 1 Ô Trắng đưa lại 1 điểm Tài Nguyên cho quốc gia sở hữu.
- Được phép gửi quân/cơ giới ở lại trấn giữ (không hiện lên bản đồ) từ Turn kế tiếp sau khi chiếm — chi tiết gửi/rút quân xem §7.

*Cơ chế phụ*
- Turn 1 chiếm được thì dù Turn 2 Tướng rời đi, ô vẫn tính là đã tô màu thuộc về nước mình.
- Nếu bị nước khác tiến quân vào mà không có Tướng/lính nào của mình trấn giữ tại đó: ô coi như thuộc về bên xâm chiếm (nếu họ chiếm thành công).

### Châu Thành

*Cơ bản*
- Cách chiếm giống Ô Trắng (kéo quân vào), nhưng khi còn vô chủ luôn có 6000 lính địa phương trấn thủ — muốn chiếm phải có Công ≥ 6000 (đánh bại chứ không thu phục được lính địa phương). Khi đã có chủ, phòng thủ chuyển thành 6000 Thủ Đá (giá trị cố định) + lính đồn trú của nước chủ + bonus Núi nếu có (công thức phòng thủ đầy đủ xem §8).
- Mỗi Turn đưa lại 3 điểm Tài Nguyên cho quốc gia sở hữu (khác với Lúa — xem bên dưới).
- Là 1 vựa lúa: có thể vận chuyển lúa từ Thành Trì tới dự trữ ở đây (tối thiểu 1000 lúa/lần, tối đa vô hạn), và các Châu Thành nối nhau trong cùng quốc gia chuyển lúa qua lại được. Châu Thành chỉ chứa lúa — không tự sinh ra lúa như Thành Trì (xem §5).
- Không thể chứa Tướng/Lính/Văn bại trận về dưỡng thương.

*Cơ chế phụ*
- Châu sập thì vô chủ ngay lập tức; nếu Turn kế tiếp không ai chiếm, đến Turn sau nữa sẽ hồi lại 6000 lính trấn thủ mặc định.
- Khi 1 quốc gia chiếm được Châu Thành: kho lúa có sẵn ở đó (nếu có) thuộc về quốc gia mới, chỉ quốc gia đó biết số lượng chính xác. Nếu Châu đang vô chủ, lúa dự trữ vẫn còn nguyên trong kho chờ ai chiếm.

### Thành Trì

*Cơ bản*
- Là lãnh thổ gốc của mỗi quốc gia ngay từ đầu game — không "chiếm" theo kiểu kéo quân vào như Ô Trắng, mà phải bị đánh sập trực tiếp hoặc bắn sập.
- Mỗi quốc gia có 9 Ô Thành Trì. Mỗi ô có 8000 lính trấn thủ đá thành (cộng thêm lính đồn trú tại đó, công thức đầy đủ xem §8).
- Bị phá sập thì lập tức biến thành Ô Trắng (áp dụng toàn bộ luật Ô Trắng từ đó), và không thể xây lại.
- Quốc gia bị phá sập hết cả 9 Thành Trì thì sụp đổ hoàn toàn (xem điều kiện thắng-thua ở §1).
- Mọi Ô Thành Trì đều được xem là vựa lúa và đều mua được lúa tại đó (xem §5). Tướng/Văn/Lính/trang bị mới đều xuất phát ra bản đồ từ không gian ảo gắn với các Ô Thành Trì — có thể xuất phát từ bất kỳ Ô Trì nào, kể cả khi Trì đó đang bị cô lập khỏi phần còn lại của quốc gia.

*Cơ chế phụ*
- Nếu các Thành Trì của 1 quốc gia bị cô lập thành 2 cụm riêng biệt trong 1 Turn: kho lúa dự trữ quốc gia chia đôi cho 2 cụm, từ đó mỗi cụm mua lúa độc lập.
- Các kiến trúc/nơi trú ngụ nội bộ quốc gia (không gian ảo, không hiện trên bản đồ) không thể bị xâm phạm trực tiếp, và tự động biến mất khi quốc gia đó sụp đổ.
- Nếu 2 quốc gia cùng phá Thành Trì của quốc gia thứ 3: quốc gia nào phá được nhiều Trì hơn thì được xem là xâm chiếm thành công, nhận đất của quốc gia sụp đổ.
- Quốc gia có nguy cơ sụp đổ đầu tiên (trong 3 quốc gia) không được đầu hàng — phải chơi tiếp cho đến khi sụp đổ hoàn toàn.
- Toàn bộ đất mà quốc gia thua đang sở hữu ngay lúc sụp đổ sẽ sáp nhập vào quốc gia thắng (phá nhiều Trì hơn). Chỉ đất được sáp nhập — mọi thứ khác, kể cả người chơi của quốc gia cũ, biến mất khỏi game.

### Rừng

*Cơ bản*
- Không thể chiếm.
- Quân trong rừng ẩn khỏi bản đồ, kể cả không bị Trinh Sát nhìn thấy (xem §11).
- Chỉ được ở tối đa 1 Turn: vào rừng ở lượt Go 1 mà đến hết lượt Go 2 vẫn còn đó thì toàn bộ tướng + lính chết bệnh hết (vào ở lượt Atc 1 thì mốc chết là hết lượt Go 3). Tướng bỏ lại lính (dù chỉ 1 lính) ở rừng khi rời đi thì số lính bị bỏ lại đó cũng chết bệnh theo đúng mốc trên.
- Có địch cùng ô thì bắt buộc phải giao chiến.

*Cơ chế phụ*
- 2 ô rừng khác nhau được tính riêng biệt: di chuyển từ Rừng 1 sang Rừng 2 không bị coi là "ở yên 1 rừng 2 Turn", nên không bị chết bệnh.
- Nếu rừng bị lửa thiêu: toàn bộ quân đang ẩn trong đó hiện lên bản đồ và chết hết (riêng quân đứng đúng tại Ô Rừng là tâm lửa thì cháy theo luật Hỏa Phù bình thường, không tự động chết như trên).
- Không nối lương xuyên rừng trừ khi có Mộc Ngưu Lưu Mã thông lương (xem §15 và §7).

### Núi

*Cơ bản*
- Không thể chiếm.
- Đứng cạnh núi (ở 1 trong 4 ô liền kề) được +10% Thủ (cạnh 2 mặt núi cùng lúc thì +20%).
- Cung Thủ đứng trên núi bắn tên xuống được +50% Công.
- Quân thường chỉ được ở trên núi tối đa 1 Turn giống Rừng. Ngoại lệ: nếu trong đội hình có Cung chủ động bắn ngay Turn đầu tiên, toàn bộ quân đi cùng vị Tướng chỉ huy Cung đó được ở lại thêm 1 Turn (kể cả tiếp tục bắn), nhưng chậm nhất đến hết lượt Go của Turn thứ 3 phải rời núi.
- Có địch cùng ô thì bắt buộc phải giao chiến.

*Cơ chế phụ*
- "Được ở lại thêm" chỉ áp dụng cho lính do đúng vị Tướng chỉ huy Cung đó, không áp dụng cho lính của Tướng khác dù đứng chung núi.
- Không nối lương xuyên núi trừ khi có Mộc Ngưu Lưu Mã thông lương (xem §15, §7).

### Sông

*Cơ bản*
- Không thể chiếm. Được ở trên sông nhiều Turn liên tục, không bị giới hạn 1 Turn như Núi/Rừng.
- Cần có ít nhất 1 loại thuyền của mình mới đi vào sông được (hoặc ô sông đó đã có sẵn thuyền nước mình, hoặc được thuyền khác chở/tốc xuống hộ — xem chi tiết thuyền ở §13).
- Có địch cùng ô thì bắt buộc phải giao chiến.

*Cơ chế phụ*
- Từ bờ có thể tốc phù xuống sông nếu có thuyền mình ở đó, hoặc được tốc ngược từ sông lên bờ; nhưng không bao giờ tốc xuyên qua sông được, kể cả Kỵ đã có Móng Ngựa.
- Nếu sông bị Hỏa Phù: toàn bộ quân trên sông cháy đứng yên tại chỗ (áp dụng các hiệu ứng khác của Hỏa Phù bình thường) và bị giảm thêm 50% sức mạnh cuối cùng còn lại ngay trong Turn cháy đó.
- Không nối lương xuyên sông trừ khi có thuyền/thông lương hợp lệ (xem §7, §13).

---

## 5. Kinh Tế & Hậu Cần

### Mỏ

*Cơ bản*
- Sinh Tài Nguyên mỗi Turn theo cấp: Cấp 1 = 3 (mặc định), Cấp 2 = 5, Cấp 3 = 7.
- Nâng cấp tuần tự: lên Cấp 2 tốn 4 Tài Nguyên, lên Cấp 3 tốn 5 Tài Nguyên (nâng đầu Go, xong ở Turn kế tiếp — xem quy tắc nâng cấp chung ở §18).

### Nhà Dân

*Cơ bản*
- Đổi Tài Nguyên lấy Dân theo tỉ giá tăng dần theo cấp: Cấp 1 = 1 Tài Nguyên đổi 2000 Dân (mặc định), Cấp 2 = 1 Tài Nguyên đổi 3000 Dân, Cấp 3 = 1 Tài Nguyên đổi 4000 Dân.
- Nâng cấp: Cấp 2 tốn 4 Tài Nguyên, Cấp 3 tốn 5 Tài Nguyên.

### Ruộng

*Cơ bản*
- Đổi Dân lấy Lúa theo tỉ giá tăng dần theo cấp: Cấp 1 = 1000 Dân đổi 1000 Lúa (mặc định, tỉ lệ 1:1), Cấp 2 = 1000 Dân đổi 2000 Lúa (1:2), Cấp 3 = 1000 Dân đổi 3000 Lúa (1:3).
- Nâng cấp: Cấp 2 tốn 4 Tài Nguyên, Cấp 3 tốn 5 Tài Nguyên.

*Cơ chế phụ*
- Đổi Dân lấy Lúa sẽ tiêu hao (mất) đúng số Dân đã đem đổi.

### Luật Lương Thực (Nuôi Quân)

*Cơ bản*
- Chỉ lính tốn Lúa để ăn mỗi Turn — Dân không tốn Lúa.
- Thứ tự ăn Lúa khi thiếu: lính có nối lương ăn theo khoảng cách gần trước xa sau, tính bằng số ô di chuyển nối thông lương tới vựa lúa gần nhất; hết lúa ở vựa gần thì mới tới lượt lính xa hơn; lính bằng khoảng cách được chọn ai ăn tùy ý. Lính đang được miễn nối lương (VD: trong Turn chờ gia nhập nước mới sau khi phản bội — xem §3.4) được ưu tiên ăn lúa nước mình trước, không xét khoảng cách.
- Việc mua lính và mua/rút/gửi lúa diễn ra đầu Go; ngay sau đó GM tính lính hiện có để trừ lúa tương ứng ngay — tức đầu Go bắt buộc lính phải ăn lúa ngay, không đủ lúa thì lính chết đói ngay lập tức.

*Cơ chế phụ*
- Tướng ra trận mà đầu Go bị chết đói hết quân (còn 0 lính) thì coi như thua trận, về thành ngay từ đầu Go đó.
- Lính đã ăn đủ đầu Go nhưng bị cắt lương ở cuối Go/Atc cùng Turn đó (mất kết nối — xem §7) thì tiếp tục xét theo luật chết đói do cắt lương.
- `[GHI CHÚ]` Có 1 khác biệt đáng chú ý theo nguồn lương: nếu Ô A chỉ nối được với vựa lúa của 1 Châu Thành và vựa đó hết lúa, toàn bộ lính ở Ô A chết đói và Ô A biến thành Ô Trắng ngay. Nhưng nếu Ô A nối với kho lúa chung của quốc gia (qua Thành Trì) và kho đó hết lúa, lính vẫn chết đói hết — nhưng Ô A vẫn giữ màu thuộc quốc gia cũ (không tự động thành Ô Trắng). Đây là sự bất đối xứng có chủ đích trong luật gốc, không phải lỗi chuẩn hóa.

---

## 6. Quân Đội Cơ Bản

### Bộ Binh

*Cơ bản*
- Chỉ số cấp 1 (mặc định, chưa nâng cấp): 1 Công, 1 Thủ (thủ giáp) mỗi lính.
- Tuyển quân: Cấp 1: 1 Tài Nguyên + 2000 Dân = 1000 Bộ (mặc định). Cấp 2: 1 Tài Nguyên + 3000 Dân = 2000 Bộ (nâng cấp tốn 4 Tài Nguyên). Cấp 3: 1 Tài Nguyên + 4000 Dân = 3000 Bộ (nâng cấp tốn 5 Tài Nguyên).
- Không cầm được Tên. Tấn công khi có địch cùng ô.

*Cơ chế phụ*
- Bộ Binh mới mua tự di chuyển (không cần Tướng dắt) trong giai đoạn đầu Go; sang giữa Go, Tướng mới chọn tiếp nhận chỉ huy số Bộ Binh mới và/hoặc Bộ Binh cũ để dắt đi tiếp; toàn bộ quân đó tự động giao chiến ở ô cuối cùng khi hết Go.

### Cung Thủ

*Cơ bản*
- Tuyển quân: quy đổi từ Bộ Binh có sẵn, không phải từ Dân trực tiếp. Cấp 1: 1 Tài Nguyên + 2000 Bộ = 1000 Cung (mặc định). Cấp 2: 1 Tài Nguyên + 3000 Bộ = 2000 Cung (nâng cấp 4 Tài Nguyên). Cấp 3: 1 Tài Nguyên + 4000 Bộ = 3000 Cung (nâng cấp 5 Tài Nguyên).
- Công thức sát thương: 1 Cung giữ 1 Tên thường = 2 Công; giữ 1 Hỏa Tiễn = 3 Công (ưu tiên dùng nếu có cả 2 loại); 1 Cung hết cả Tên lẫn Tên dư = 1 Công (như lính thường).
- Chỉ bắn được sang 1 ô kế bên (khác ô đứng); 1 Tướng chỉ huy Cung chỉ được chọn bắn vào 1 trong 4 ô xung quanh mình.
- Cần có Tướng chỉ huy ra lệnh mới được chủ động bắn; không tự ý bắn nếu không có lệnh.

*Cơ chế phụ*
- Nếu số Tên còn dư nhiều hơn số Cung Thủ, phần dư không cộng thêm Công; Cung tự nạp lại Tên dư sau khi bắn.
- Hỏa Tiễn chỉ có thể bị Thủy Phù dập ngay khi đang bắn ra (không phải lúc đang cầm trong người).
- Khi có địch cùng ô (cận chiến), Cung Thủ chỉ còn 1 Công/1 Thủ như lính thường bất kể đang cầm loại Tên nào.
- Bắn vào ô thuộc nước mình không gây thiệt hại cho quân mình.
- Tướng đứng trong thành muốn bắn Cung ra ngoài phải nói rõ với GM đang đứng ở Ô Thành nào để GM ghi lên bản đồ.
- Quyết định bắn hay không được chốt vào cuối lượt Atc.
- Tối đa 1 lần bắn huy động được 10.000 Cung Thủ (trùng giới hạn Biên Chế bên dưới).

### Kỵ Mã

*Cơ bản*
- Chỉ số như Bộ Binh (chưa nâng cấp): 1 Công, 1 Thủ. Không cầm được Tên.
- Tuyển quân: quy đổi từ Bộ Binh, cùng công thức chi phí như Cung Thủ (Cấp 1: 1 Tài Nguyên + 2000 Bộ = 1000 Kỵ; Cấp 2: 1 Tài Nguyên + 3000 Bộ = 2000 Kỵ, nâng cấp 4 Tài Nguyên; Cấp 3: 1 Tài Nguyên + 4000 Bộ = 3000 Kỵ, nâng cấp 5 Tài Nguyên).
- Có sẵn kỹ năng nội tại **Truy Cùng Giết Tận**: khi giao chiến thắng (kể cả khi đang ở thế thủ), Kỵ Mã tiêu diệt thêm tàn binh bên thua theo công thức ở §8. Cần tối thiểu 1000 Kỵ Mã trong đội hình để kích hoạt; kỹ năng này không cần Tướng chỉ huy riêng.
- Chỉ Kỵ Mã mới kết hợp được với Tốc Phù (xem §10).

*Cơ chế phụ*
- Trên sông, Kỵ Mã tự động tắt Truy Cùng Giết Tận.

### Biên Chế Chỉ Huy

*Cơ bản*
- Tướng chỉ huy ít nhất 1000 lính mới được di chuyển.
- Khi di chuyển, 1 Tướng chỉ huy tối đa 10.000 lính (Biên Chế mặc định) — bao gồm cả quân đang ở trên Xe Đục Thành. Cung Thủ chủ động bắn cũng giới hạn tối đa 10.000 Cung trong 1 lần.
- Khi đứng yên tại 1 ô, Tướng được chỉ huy không giới hạn số lính đang có ở ô đó (có thể chọn chỉ huy toàn bộ hoặc một phần).

*Cơ chế phụ*
- 1 lính chỉ được 1 Tướng chỉ huy tại 1 thời điểm — không thể 2 Tướng cùng chỉ huy chung 1 lính.
- 2 Tướng trở lên cùng 1 nước có thể đứng chung 1 ô, nhưng 1 Tướng không chỉ huy được 1 Tướng khác.
- Chiến Tướng có Biên Chế nâng lên 50.000 (xem §16).

---

## 7. Di Chuyển, Chiếm Đất & Nối Lương

### Di Chuyển

*Cơ bản*
- 1 Tướng di chuyển tối đa 1 ô mỗi Turn theo cạnh vuông; đi chéo tốn tương đương 2 ô di chuyển (nên về cơ bản không đi chéo được trong 1 Turn thường, trừ khi có hỗ trợ đặc biệt).
- Cung Thủ không bắn chéo được (trừ khi dùng trong Trận Phong Sát — xem §12).
- Tướng phải chỉ huy tối thiểu 1000 lính mới được di chuyển.

### Gửi / Rút Quân

*Cơ bản*
- Chỉ thực hiện được tại Ô đã thuộc về nước mình (Ô Trắng đã chiếm, Châu Thành, Thành Trì), vào đầu lượt Go.
- Được rút/gửi số lẻ, nhưng phải để lại tối thiểu 1000 quân tại chỗ; không giới hạn số lượng tối đa.
- Không thể gửi/rút quân, Văn, Xe, Tên, Thuyền xuyên qua Rừng, Núi, Sông (kể cả khi đã có thông lương qua đó), hoặc giữa các vùng đất không kết nối với nhau.

*Cơ chế phụ*
- `[GIẢ ĐỊNH]` Một dòng luật riêng (trang 15) liệt kê thêm rằng ô đang dính Thủy Phù, đang dính Hỏa Phù, đang là ô trung tâm Hỏa, hoặc Ô Trắng, đều không cho gửi/rút. Bản chuẩn hóa hiểu vế "Ô Trắng" ở đây là nói về Ô Trắng **chưa chiếm** (khớp với luật ở §4: "Turn 1 chiếm rồi thì Turn 2 mới được gửi hoặc rút Quân"), chứ không phủ định việc Ô Trắng **đã chiếm** vẫn gửi/rút được bình thường như quy tắc "Cơ bản" ở trên.

### Chiếm Đất

*Cơ bản*
- Đất Trống (Ô Trắng): kéo quân vào là chiếm được, có thể để lại quân trấn giữ.
- Đất có chủ (đã thuộc nước khác): phải kéo quân vào để tấn công hoặc bắn phá (xem công thức chiến đấu ở §8).

### Nối Lương

*Cơ bản*
- Chỉ những Ô đã chiếm được của nước mình mới nối/chuyển lương thực qua lại được.
- Rừng, Núi, Sông không cho nối lương xuyên qua, trừ khi có Mộc Ngưu Lưu Mã thông lương (xem §15).
- 2 ô nối theo đường chéo không được tính là kết nối — chỉ nối theo 4 hướng cạnh vuông.
- Luật miễn nối lương chỉ áp dụng cho Tướng, Lính, và Văn — không áp dụng để giữ chủ quyền cho 1 ô đất không có 3 đối tượng này đứng.
- Tướng/lính/đồ khi xuất chinh phải có đường nối lương tính từ đúng vị trí đang đứng (dù ô đó có chiếm được hay không) vào cuối Go/Atc; không có đường nối thì chết đói bại trận (xem công thức ở §5).

*Cơ chế phụ*
- Nếu 1 vùng đất bị cắt khỏi mạng lưới nối lương của nước mình: quân ở đó áp dụng luật chết đói (§5); vùng đất mất luôn màu sở hữu nếu chỉ nối với vựa Châu Thành đã cạn lúa, nhưng giữ màu nếu nối với kho chung quốc gia (qua Thành Trì) đã cạn lúa (xem ghi chú ở §5).
- Châu Thành bị cắt khỏi mạng lưới nhưng còn lúa dự trữ tại chỗ: quân xung quanh không chết đói cho đến khi kho đó cạn (xem §4 Châu Thành).

### Hành Quân Đầu Game

*Cơ bản*
- Tướng xuất phát từ bất kỳ Ô Thành Trì nào của nước mình (kể cả Trì đang bị cô lập khỏi phần còn lại), không cần Tốc Phù để ra khỏi Trì lần đầu.
- Turn đầu tiên xuất trì: chỉ ra được 1 trong các ô liền kề theo cạnh vuông của Trì (không ra chéo góc).

*Cơ chế phụ*
- Trong lúc còn đứng trong cụm Thành Trì nối liền nhau của nước mình, Tướng có thể chọn đứng ở bất kỳ Ô Trì nào trong cụm đó mà không tính là "di chuyển" (cả cụm Trì nối nhau được xét như 1 khối duy nhất).
- Nếu 1 Ô Trì bị cô lập do các Trì liền kề bị phá, Trì đó không còn xuất/nhập tự do sang các Trì khác được nữa, và tự mua lúa độc lập với phần còn lại của quốc gia (xem §4).

### Đi Xuyên Nhau

*Cơ bản*
- Nếu Tướng A rời Ô1 để đi vào Ô2 trong khi Tướng B rời Ô2 để đi vào Ô1 cùng lúc, 2 bên không tính là giao chiến với nhau — họ "đi xuyên qua nhau". Mỗi bên vẫn phải giao chiến với quân (nếu có) đang đứng lại tại ô mà mình vừa tiến vào.

---

## 8. Binh Pháp Cơ Bản — Công Thức Chiến Đấu

### Tấn Công — Địch Không Phòng Thủ

*Cơ bản*
- So sánh chỉ số Công của 2 bên: bên Công cao hơn thắng.
- Bên thua mất 1/2 số quân. Bên thắng chết bằng 50% số quân mà bên thua đã mất.
- Nếu bên thắng có Kỵ Mã đã kích hoạt Truy Cùng Giết Tận: sau khi tính xong công thức trên, tàn binh bên thua chết thêm đúng bằng số Kỵ Mã còn lại của bên thắng (Kỵ Mã tắt hiệu ứng này khi đang ở trên sông).

### Tấn Công — Địch Có Phòng Thủ

*Cơ bản*
- So sánh Công của bên tấn công với Thủ của bên phòng thủ.
- Nếu Công ta cao hơn Thủ địch: ta mất 1/2 quân đang dùng để chiếm đất; địch chết bằng 20% số quân ta đã mất.
- Nếu Thủ địch cao hơn Công ta: địch mất 1/4 quân; ta chết bằng 50% số quân địch đã mất.
- Công Thức Kỵ Mã Truy Sát áp dụng tương tự như ở mục Địch Không Phòng Thủ.
- Nếu ô đó không có địch: tính như đất trống (chiếm được luôn, không giao chiến). Nếu quân ta thắng nhưng chết sạch lính (kể cả Tướng phải về thành do thua): ô đất vẫn được tô màu thuộc về ta nếu là loại ô chiếm được.

### Liên Quan Phòng Thủ

*Cơ bản*
- 1 ô có Tướng đang bật Trận Pháp Thủ và không có Tướng nào khác bật Công: toàn bộ quân tại ô đó tự động ở thế Thủ.
- Có Tướng Công đứng/đến, hoặc Văn lập trận Công tại ô: toàn bộ quân tại ô đó (kể cả quân không ai chỉ huy) tự động chuyển thành thế Công.
- Ô không có Tướng nào đứng, hoặc Tướng đã rời đi hết: quân còn lại tự động ở thế Thủ và không di chuyển. Lưu ý: không di chuyển không đồng nghĩa với đang phòng thủ — quân đứng yên vẫn có thể đang ở thế Công.

### Phòng Thủ Của Thành

*Cơ bản*
- Công thức: 1 Ô Châu Thành = 6000 Thủ Đá + chỉ số lính đang đóng tại ô đó + bonus Núi nếu ô kề núi (xem §4). 1 Ô Thành Trì = 8000 Thủ Đá + chỉ số lính đang đóng tại ô đó + bonus Núi nếu có.
- Nếu chỉ số các bên hòa nhau (sau khi đã tính hệ số Trận Pháp), xét ưu tiên lần lượt: (1) bên nào có nhiều Tướng hơn trong ô giao tranh thắng — nếu bằng số Tướng thì bên đi xa hơn (tới ô đó) thua; (2) bên nào có nhiều Chiến Tướng hơn thắng — nếu vẫn bằng thì so tổng Liên Trảm cộng dồn của các Tướng dự trận; (3) bên nào đem theo nhiều Kỵ Mã hơn thắng; (4) vẫn hòa: đình chiến, cả 2 bên tự lùi lại 1 ô về phía sau ô vừa hòa.
- Sát thương Cung Thủ nếu bằng đúng chỉ số nhóm địch thì nhóm địch đó thua (không tính là hòa).
- Quân/Tướng cùng 1 nước không thể tấn công/bắn/giết lẫn nhau (nhưng vẫn cùng chịu ảnh hưởng lan của Thủy/Hỏa Phù).

*Cơ chế phụ (edge-case — trích "Tài Liệu Thực Chiến", trang 17)*
- **Cung Thủ Bắn:** bắn tối thiểu 1000 Tên/lượt (tính cả khi bắn vào ô địch không có quân). Nếu Cung ta chủ động bắn nhưng thua, mà chỉ số Công của Cung ta vẫn đạt từ 80% chỉ số của địch trở lên: dù thua, địch vẫn bị thiệt hại 1/5 quân. Dưới ngưỡng 80% đó thì chiến báo không nêu rõ số lượng quân 2 bên (chỉ bên bị bắn biết chính xác số Tên đối phương đã bắn).
- **Địa Hình Thật:** muốn bắn Cung xuyên qua Thành/Núi, phải đứng trên Thành/Núi/Tháp Tiễn (Máy Bắn Đá không cần điều kiện này). Mỗi lần Tốc Phù xuyên qua 1 ô Núi/Rừng/Thành của nước khác: trừ 1 ô tốc (được miễn trừ nếu có Trâu Gỗ/Mộc Ngưu Lưu Mã đi cùng — xem §15).
- **Cung Bắn Vào Ô Hỏa, Ô Hỗn Chiến (chỉ nhắm địch):** cộng dồn chỉ số Cung của 1 nước rồi mới áp vào từng nước địch riêng biệt (VD ta bắn 1000 Công thì mỗi nước địch trong ô đó hứng trọn 1000, không chia nhỏ ra).
- **Cung Các Nước Cùng Bắn Vào 1 Ô:** nếu nhiều nước cùng bắn 1 mục tiêu, cộng dồn tổng Công của các nước bắn lại trước khi áp thiệt hại lên mục tiêu.
- **3 Nước Cùng 1 Ô:** nếu cả 3 nước đều thủ và 0 công thì đứng chung không đánh nhau. Nếu có ít nhất 1 nước công: so chỉ số tổng của cả 3, ai mạnh nhất thắng — thiệt hại của bên thua bị cộng lại thành thiệt hại của bên thắng; không phân được ai mạnh nhất thì đình chiến. Nếu có đúng 2 nước cùng công và 1 nước thủ: 2 nước công đấu nhau trước để tìm ra kẻ thắng/thua, sau đó lấy quân còn lại của kẻ thắng đấu tiếp với nước thủ; không phân được thắng thua giữa 2 nước công thì đình chiến.
- **Hội Đồng Hỗn Chiến Cận:** nếu nhiều người mỗi nước cùng đứng 1 ô, cộng dồn toàn bộ chỉ số quân của mỗi nước rồi so thắng bại theo tổng đó; nếu 1 nước có cả quân công lẫn quân thủ thì gộp thành 1 chỉ số chung (không tính toàn thủ) rồi mới so.
- **Thiệt Hại (chia theo tỉ lệ):** khi 1 Tướng chỉ huy nhiều loại lính, thiệt hại chia theo đúng tỉ lệ số lượng từng loại. VD: Tướng chỉ huy 2000 Bộ + 1000 Kỵ (tổng 3000), tổng thiệt hại trận đó là 600 quân → Bộ mất (2000/3000)×600 = 400, Kỵ mất (1000/3000)×600 = 200. Số lẻ làm tròn: 0,1–0,4 làm tròn xuống (=0), 0,5–0,9 làm tròn lên (=1).

---

## 9. Thời Tiết 4 Mùa

*Cơ bản*
- Turn 1 = Mùa Xuân, Turn 2 = Mùa Hạ, Turn 3 = Mùa Thu, Turn 4 = Mùa Đông, rồi lặp lại tuần hoàn (Turn 5 lại là Xuân...) cho đến hết game.
- **Mùa Xuân:** mọi thứ diễn ra bình thường. Có tính điểm lãnh thổ (xem §1).
- **Mùa Hạ:** binh sĩ dễ ốm yếu — toàn bộ số lính chết sau khi giao chiến trong Turn này bị nhân đôi (x2) cho cả 2 phe. Số lính chết thêm do Mùa Hạ vẫn được tính vào mốc Tinh Binh quốc gia (§15). Không áp dụng x2 cho số lính chết vì đạp bẫy (§11).
- **Mùa Thu:** số lượng Lúa làm ra trong Turn này được nhân đôi (x2). Có tính điểm lãnh thổ (xem §1).
- **Mùa Đông:** ruộng đóng băng, không làm ra Lúa. Toàn bộ hoạt động quân sự bị đóng băng: không tấn công, không chỉ huy, không gửi/rút/di dời/xuất lính-tướng; không dùng Phù hay Kỹ Năng Tác Chiến; không xây Thao Trường/Doanh Trại; không chuyển Văn, đồ đạc, cơ giới, thuyền, hay lúa qua lại.

*Cơ chế phụ*
- Vì Mùa Đông đóng băng toàn bộ di chuyển, cần hành quân xong trước khi Mùa Thu kết thúc — nếu đang di chuyển mà bị vướng lại đúng lúc chuyển sang Mùa Đông, dễ bị kẹt và phạm luật "tối đa 1 Turn" ở Núi/Rừng (xem §4).

---

## 10. Phù Chú

### Luật Chung Về Phù

*Cơ bản*
- 5 loại Phù: Hỏa Phù, Tốc Phù, Phong Phù, Cổ Vũ, Thủy Phù. Tất cả đều mua bằng 3 Tài Nguyên, mua không giới hạn số lượng.
- Chỉ Chủ Công và Tướng Quân (bao gồm Đại Tướng Quân, Chiến Tướng) mới được xài Phù; 1 người trong 1 Turn (Go + Atc gộp lại) chỉ được dùng 1 Phù.
- Mua/gửi/trao đổi Phù thực hiện đầu Turn Go, không giới hạn khoảng cách. Ai đang giữ Phù thì người đó dùng được; 1 người có thể cầm nhiều Phù cùng lúc.
- Chỉ dùng được Phù từ Turn 2 trở đi.
- Khi ai dùng Phù, GM đều báo cho toàn game biết (kể cả dùng thất bại); dùng thất bại vẫn mất Phù đó.
- Hỏa Phù và Thủy Phù bắt buộc chọn 1 trong 4 ô xung quanh vị trí đang đứng để ném.

### Hỏa Phù

*Cơ bản*
- Dùng ở lượt Atc, khi đang đứng trên bản đồ. Ném vào 1 trong 4 ô xung quanh (Ô1); cách Ô1 một ô nữa theo cùng hướng sẽ là Ô Trung Tâm của vùng lửa.
- Vùng ảnh hưởng: Ô Trung Tâm + 8 ô xung quanh (khối 3x3). Châu Thành/Thành Trì luôn miễn nhiễm nếu là Ô Trung Tâm (các ô xung quanh vẫn cháy bình thường nếu cháy được).
- Hiệu lực: từ cuối Turn Atc lúc ném đến hết Turn Atc kế tiếp.
- Toàn bộ Tướng/Văn/lính/cơ giới/thuyền đứng trên bờ trong vùng ảnh hưởng bị lửa sẽ tự dồn về vị trí Ô Trung Tâm (vẫn tính là bị cháy). Quân đang cháy: cấm di chuyển, cấm tấn công (nhưng vẫn có thể bị Cung từ bên ngoài bắn vào), cấm đánh trả, cấm dùng Phù; mỗi lính bị cháy bị -1 Thủ trong Turn đó, và toàn bộ quân bị cháy được miễn nối lương trong Turn lửa cháy đó.
- Sau khi lửa tắt, quân bị dồn tự động lùi về vị trí cũ.

*Cơ chế phụ*
- Nếu Ô Trung Tâm bị dập tắt (bởi Thủy Phù hoặc Trận Trùy Hình): toàn bộ vùng lửa mất hết ngay lập tức. Nếu chỉ 1 ô khác bị dập thì chỉ riêng ô đó hết cháy.
- Trong lúc còn vùng lửa/nước hiện diện (dù chỉ chồng lấn đúng 1 ô), cấm ném thêm Hỏa/Thủy Phù mới đè lên vùng đó.
- Việc vận/nối Lúa không bị ảnh hưởng bởi vùng lửa, nhưng nếu Ô đất có chủ bị mất kết nối do quân phải dồn ra khỏi vị trí thì Ô đó mất chủ.
- Ô Trung Tâm nếu là Sông/Trì/Châu/công trình: quân xung quanh đứng yên cháy tại chỗ, không dồn vào giữa.
- 2 vùng Hỏa Phù chồng nhau thì gộp lại cháy lan chung; Hỏa Phù gặp Thủy Phù thì phần chồng lấn ưu tiên thành Thủy.
- Nếu Ô Trung Tâm trước đó vô chủ thì sau khi lửa tắt vẫn vô chủ; có chủ thì vẫn giữ chủ cũ (trừ khi mất kết nối như trên).
- Không thể ném Hỏa Phù nếu Ô Trung Tâm sẽ rơi ra ngoài rìa bản đồ.
- Rừng bị Hỏa Phù thiêu: quân đang ẩn trong đó hiện hình và chết hết (xem §4); Hỏa Tiễn (mũi tên) không làm cháy rừng.

### Tốc Phù

*Cơ bản*
- Chỉ áp dụng cho Kỵ Mã, dùng ở lượt Go. Tướng dùng Tốc Phù dẫn Kỵ Mã phải để lại toàn bộ Bộ Binh, Cung Thủ, Cơ Giới, Thuyền đang chỉ huy.
- Cho phép đi liên tiếp 2 ô trong 1 lượt Go (bắt buộc đi đủ 2 ô nếu địa hình cho phép); đứng trên Núi thì đi được 2–3 ô.
- Sau khi dùng, bị khóa (delay) 2 Turn mới dùng lại được (VD dùng ở Turn 1 thì Turn 4 mới dùng tiếp).
- Phải nói rõ lộ trình đi qua từng ô khi dùng.
- Nếu Tốc từ Ô1 tới Ô3 (đi qua Ô2): chỉ tính chiếm được Ô3, không chiếm Ô2 dọc đường.

*Cơ chế phụ*
- Tướng dùng Tốc Phù ở Go1 dẫn theo Kỵ Y: Y bị buộc đi theo Tướng đến hết Go2 (kể cả nếu bại trận dọc đường); Tướng vẫn được nhận thêm lính khác ngoài Y nếu hợp luật khác.
- Tướng + Kỵ đang miễn nối lương trong Go dùng Tốc; sang Go kế tiếp bắt buộc phải nối lại lương, nếu không sẽ chết đói cuối Go đó.
- Tốc Phù không vượt qua được vùng đang có Hỏa Phù hoặc Thủy Phù.
- Đi xuyên qua Ô địch/Châu/Trì/Rừng/Núi khi Tốc Phù thì coi như đi xuyên qua (không dừng lại); mỗi lần xuyên 1 ô Núi/Rừng/Thành của nước khác bị trừ 1 ô tốc (miễn trừ nếu có Trâu Gỗ đi cùng — xem §15).
- `[CẦN LÀM RÕ]` Nguồn nâng cấp "Sức Chạy" của Ngựa Chiến Mã (§14) cũng cho phép đứng trên Núi đi 2/3/4 ô và nhắc tới "Siêu Tốc" — chưa rõ đây có phải cùng 1 hiệu ứng với "Siêu Tốc Phù" do Bát Kỳ cấp (§17) hay là 2 nguồn tăng tầm riêng biệt có thể cộng dồn (xem Phụ Lục B mục 4). Cooldown của Tốc Phù và Siêu Tốc dùng chung 1 bộ đếm — dùng cái này thì cái kia cũng bị delay theo và ngược lại.

### Phong Phù

*Cơ bản*
- Dùng ở lượt Atc, khi đang đứng trên bản đồ. Cho phép Cung Thủ do Tướng đó chỉ huy bắn xa thêm 1 ô so với tầm bắn bình thường (VD từ Ô1 bắn thẳng qua Ô2 tới Ô3; Ô2 không bị ảnh hưởng, và không bắn chéo).
- Nếu chỉ số Công cuối cùng của bên bắn (đã cộng Phong Phù) đạt từ 50% chỉ số cuối cùng của địch trở lên: mỗi lính địch bị thêm -1 Thủ ngay trong lần bắn đó.

*Cơ chế phụ*
- Địch dính đồng thời nhiều Hỏa Phù tối đa chỉ -1 Thủ (không cộng dồn nhiều lần), dính nhiều Phong Phù tối đa cũng chỉ -1 Thủ; dính cả 2 loại thì tối đa -2 Thủ tổng cộng.
- Phù của ai thì chỉ người đó tự dùng cho quân mình.

### Cổ Vũ

*Cơ bản*
- Dùng được ở cả lượt Go lẫn Atc. Tăng ngay +1 Công cho mỗi lính đang thuộc quyền chỉ huy của Tướng dùng Phù, hiệu lực trong 1 Turn.
- Nếu dùng ở Go1: hiệu lực còn tới hết Atc1 rồi mất (không kéo dài sang Go2).

*Cơ chế phụ*
- Có thể cộng dồn với Skill của Đại Tướng Quân (+1 Công/+1 Thủ tương tự — xem §2.2), VD cộng lại thành +2 Công/+1 Thủ.

### Thủy Phù

*Cơ bản*
- Dùng ở lượt Atc, khi đang đứng trên bản đồ. Ném vào 1 trong 4 ô xung quanh, tạo 1 vùng nước mưa vây nội. Không có loại ô nào miễn nhiễm Thủy Phù (kể cả Châu Thành/Thành Trì).
- Tướng/lính/cơ giới/thuyền đã và đang ở trong vùng nước không thể di chuyển; nếu chủ động đi vào vùng này thì sau khi vào cũng bị mắc kẹt. Việc vận/nối Lúa không bị ảnh hưởng.
- Hiệu lực: từ cuối Turn Atc lúc ném đến hết Turn Atc kế tiếp.

*Cơ chế phụ*
- Tốc Phù đi từ Ô1 sang Ô3 mà Ô2 (giữa đường) dính nước sẽ bị kẹt lại ở Ô2.
- 2 vùng Thủy Phù chồng nhau thì gộp lại thành 1 vùng nước chung; Thủy Phù không bị Hỏa Phù ảnh hưởng ngược lại.
- Trong lúc còn vùng lửa/nước hiện diện, cấm ném thêm Hỏa/Thủy Phù mới đè lên đúng những ô đang chồng lấn.

---

## 11. Kỹ Năng Tác Chiến

### Kỳ Binh Ẩn Thân

*Cơ bản*
- Dùng ở lượt Go, tốn Tài Nguyên. Khi dùng, Tướng đó (và mọi thứ Tướng đang chỉ huy) ẩn khỏi bản đồ trong 2 Turn.
- Chỉ ẩn thân được nếu ô đang đứng không có lính/Tướng địch còn khỏe; 2 Tướng thuộc phe địch của nhau đứng chung ô đều muốn ẩn thân thì không ai ẩn thân được.
- Trước khi rời khỏi Thành/Rừng, phải ẩn thân xong rồi mới đi (vào Rừng thì tạm tắt ẩn thân, ra khỏi Rừng tự bật lại).
- Đang ẩn thân mà di chuyển vào Ô khác nước mình (kể cả Ô Châu/Trì) thì không tính là đã chiếm; chỉ khi tự Hiện Thân (chỉ làm được vào cuối Atc) mới tính là chiếm ô đó.

*Cơ chế phụ*
- Tự động hiện hình nếu: chủ động bắn Cung/bắn đá, dính Hỏa Phù/Bẫy, bị Trinh Sát phát hiện, có lính/Tướng địch còn khỏe đi vào cùng ô, hoặc bị Cung/Máy Bắn Đá địch bắn trúng đạt từ 50% chỉ số của mình trở lên.
- Đang ẩn thân vẫn được: đặt bẫy, dùng Phù, đổi lính... miễn hợp các luật liên quan.
- Sau khi dùng, bị khóa (delay) 2 Turn mới dùng lại được.
- Đang dính Thủy Phù vẫn ẩn thân được; đang dính Hỏa Phù thì không ẩn thân được.
- Mất 2 Tài Nguyên cho 1 lần dùng.
- Đang ẩn thân mà đã hóa Chiến Tướng: GM vẫn báo có Chiến Tướng xuất hiện nhưng không tiết lộ vị trí.

### Đặt Bẫy

*Cơ bản*
- Dùng ở lượt Atc, tốn Tài Nguyên. Chỉ đặt được tại đúng ô Tướng (phải có lính) đang đứng, và ô đó phải là Ô Trắng nước mình đã chiếm. Mỗi Ô Trắng chỉ đặt được 1 bẫy.
- Địch đạp trúng bẫy: bị giảm ngay 1/3 số lính mà Tướng đặt bẫy đang chỉ huy tại thời điểm đặt bẫy (trừ trước, giao chiến sau). Nhiều kẻ địch cùng đạp trúng 1 bẫy trong 1 Turn thì mức giảm 1/3 đó chia đều cho từng kẻ.

*Cơ chế phụ*
- Kỵ Mã dùng Tốc Phù mà đạp/đi ngang qua ô có bẫy: bị thiệt hại quân và tự lùi lại đúng 1 ô trước ô có bẫy.
- Bẫy không ảnh hưởng đến việc vận lương.
- Ô đặt bẫy bị mất chủ thì bẫy tự hủy theo; bẫy dính Thủy/Hỏa Phù ném cùng lúc hoặc ném đè lên sau đó cũng bị hủy; Cung bắn khiến ô có bẫy thành Ô Trắng vô chủ thì bẫy cũng hủy.
- Bẫy của nước mình thì quân/Tướng nước mình đi vào không bị ảnh hưởng và bẫy vẫn còn; được phép gửi quân mình vào ô có bẫy để trấn giữ. Bẫy chỉ hủy sau khi có 1 kẻ địch đã đạp trúng.
- Mất 2 Tài Nguyên cho 1 lần đặt bẫy. Trinh Sát chỉ phát hiện được bẫy đã tồn tại từ Turn Atc trước đó trở về trước.
- Phá bẫy/đạp bẫy/mất bẫy đều được GM báo cho toàn game.

### Trinh Sát

*Cơ bản*
- Dùng ở lượt Atc, tốn Tài Nguyên. Chọn 1 trong 4 ô xung quanh vị trí đang đứng làm tâm để quét 1 vùng 2x2.
- Cho biết: số lượng quân địch theo từng loại (Bộ/Cung/Kỵ), thuyền, cơ giới, trận pháp, có Tướng địch đang ẩn thân hay không, và có bẫy đã đặt hay không (không biết chỉ số bẫy).
- Không thấy được: số lượng Lúa, số Tên, ai đã học Bát Quái/Bát Kỳ, Phù đang cầm, Văn đang ở không gian ảo, các thứ trong không gian ảo, hoặc cấp công nghệ (Vũ Khí/Khiên...). Không thể Trinh Sát vào Ô Rừng.

*Cơ chế phụ*
- Thực hiện bằng cách nhắn tin riêng (PM) cho GM ngay giữa lượt Atc; GM trả kết quả ngay trong lượt Atc đó.
- Đang dính Thủy Phù vẫn Trinh Sát được; đang dính Hỏa Phù thì không Trinh Sát được.
- Mất 2 Tài Nguyên cho 1 lần dùng.

---

## 12. Trận Pháp

### Luật Chung Trận Pháp

*Cơ bản*
- Kích hoạt vào lượt Go (sau khi các Tướng đã di chuyển tới đúng vị trí quy định — dù gặp địch hay không); trận tự động kích hoạt trước, giao tranh diễn ra sau. Hết Go, trận vẫn tự duy trì sang Atc cùng Turn (trừ khi Tướng trong trận chết thì hủy trận ngay). Hết Atc của Turn đó, trận tự hết hiệu lực — muốn dùng tiếp Turn sau phải đăng ký lại từ đầu.
- 1 Tướng chỉ tham gia liên kết vào đúng 1 trận tại 1 thời điểm. Trận thành công lập được sẽ tốn Uy Danh đúng bằng số người tham gia.
- Muốn lập trận, từng Tướng tham gia phải tự gửi lệnh xác nhận riêng cho GM vào lượt Go: dùng Trận Pháp gì, liên kết với ai, đứng vị trí nào. Không nhận lệnh kiểu "nếu X tự lùi thì lập trận Y". Gửi thiếu hoặc sai thì trận không kích hoạt (vị trí đăng ký ở Go sao thì Atc giữ nguyên).
- Thiếu 1 người, hoặc có người đứng sai vị trí, thì cả trận mất hiệu lực. Tướng đang chỉ huy 0 lính không thể lập trận.

*Cơ chế phụ*
- Nếu 1 trận chỉ cần đúng 3 người kích hoạt (dù cho phép tối đa 4), người thứ 4 đứng gần đó nhưng không đủ điều kiện thì không ảnh hưởng gì đến trận.
- Tướng đạp bẫy khiến toàn quân chết hết, hoặc Kỵ Mã đang Tốc Phù lỡ đạp bẫy, đều sẽ không kích hoạt được trận trong Turn đó.
- Tướng đang dính Hỏa Phù sẽ không tham gia được Trận Pháp (ngoại lệ: Chiến Xa Mã vẫn tham gia được — xem §15).
- GM công khai vẽ sợi dây liên kết trận trên bản đồ chung, nói rõ trận gì/ai với ai/đứng số mấy — trừ khi có ít nhất 1 Tướng trong trận đang ẩn thân, thì sợi dây liên kết đó cũng ẩn theo (hiệu ứng trận vẫn có tác dụng); hết Turn GM mới công bố có trận đó. Tướng ẩn bị hiện hình thì sợi dây liên kết cũng hiện theo. Dù sợi dây đang ẩn, nếu trận có giao tranh thì chiến báo vẫn báo có trận bình thường.
- Quan Văn đã học thành Bát Kỳ (xem §17) mới được tham gia chỉ huy lính vào Trận Pháp — xem điều kiện đã nêu ở §2.1. Văn tham gia trận không được dùng Phù/Cơ Giới/chủ động bắn Cung/Kỹ Năng Tác Chiến; "Văn + lính của Văn" mặc định tính là bên thế Công (trừ khi đứng đúng vị trí của 1 trận Thủ). Trận cỡ 2–3 người: Văn tham gia tối đa 1 suất (tính vào tổng số người của trận, không phải suất cộng thêm). Trận cỡ 4–5 người: Văn tham gia tối đa 2 suất.
- Chiếm được Châu Thành ở Turn N thì Turn N+1 mới gửi Văn ra lập trận được (tương tự nếu Tướng chở Văn ra ở Turn N thì Turn N+1 Văn mới lập trận). Văn bại trận thì rút về nước; Văn đứng ở ô khác không phải Thành Trì/Châu Thành, hoặc đứng trên thành mà không tham gia trận nào, thì không được chỉ huy lính.
- Quy tắc bật Công/Thủ mặc định khi có Trận Thủ: Tướng A trong trận Thủ mà di chuyển/hồi sinh/thức dậy và gặp địch → A tự bật Công đánh trước ở lượt Go, thắng thì tới Atc mới bật lại Thủ; Tướng B đứng yên trong trận Thủ thì bật thẳng Thủ; Văn trong trận Thủ cũng bật thẳng Thủ.
- Tướng Z kích trận tại ô A: chỉ lính đang thuộc quyền chỉ huy của Z tại ô A đó mới tính là tham gia trận.
- Muốn kích trận ở đầu Go, Tướng phải thỏa 1 trong 2 điều kiện: chỉ huy đủ Full Biên Chế (10.000) lính trong trận, hoặc chỉ huy số lính trong trận đạt ít nhất 80% tổng số quân tại ô mình đứng sau khi di chuyển xong.
- Chỉ cần đáp ứng đúng hình dạng vị trí tương đối giữa các Tướng thì Trận Pháp có thể xoay theo bất kỳ hướng nào (360 độ).

### Ngư Lân Trận

*Cơ bản*
- Tối thiểu 2 Tướng, tối đa 4 Tướng, xếp thành ít nhất 1 hàng chéo. Càng nhiều Tướng tham gia càng mạnh.
- Có ít nhất 1 Tướng trong trận đang chủ động thế Công: Tướng đó + lính của Tướng đó, cùng lính không ai chỉ huy tại ô, tự động bật Công. Phần còn lại bật Thủ.
- Tướng đang ở thế Thủ trong trận này thì không được chỉ huy Cung chủ động bắn.
- Buff Thủ riêng cho lính của những Tướng đang Thủ trong trận: 2 người tham gia = +100%; 3 người = +200%; 4 người = +300%.

### Trường Xà Trận

*Cơ bản*
- Cần đúng 3 Tướng. Tổng Công riêng lính Tướng 1 +100%. Tổng Công riêng lính Tướng 2 -10%.
- Có hiệu ứng phụ **Thiên La Địa Võng**: nếu toàn bộ quân địch tại 1 Ô X bị mai phục (gộp 2 nước địch tại ô đó làm 1 để so), mà tổng chỉ số địch tại X không đạt gấp đôi trở lên so với tổng chỉ số 3 Tướng trận ta: quân địch tại X bị giảm thêm 50% sức mạnh cuối cùng còn lại (áp dụng lại phép tính này 1 lần nữa ở lượt Atc).
- Áp dụng Cổ Vũ và % của trận trước, rồi mới so với ngưỡng gấp đôi của Thiên La Địa Võng.

### Thất Tinh Trận

*Cơ bản*
- Cần đúng 5 Tướng. Tổng Công riêng lính Tướng 1 +235%. Tổng Công riêng lính Tướng 2 -10%. Tổng Công riêng lính Tướng 3 -25%.
- Có Thiên La Địa Võng tương tự Trường Xà Trận (xét trên 3 trong 5 Tướng, theo cùng công thức).
- Có thêm hiệu ứng **Trấn Áp**: trong Turn lập trận, Tướng địch nào đang đứng tại vùng trung tâm hình trận rồi di chuyển sang ô khác trong vùng đó, hoặc từ ngoài đi vào vùng đó, đều không thể Ẩn Thân được. Tướng địch đã ẩn thân sẵn hoặc vừa bật Ẩn Thân (kể cả đi ngang qua bằng Tốc Phù) mà lọt vào vùng đó sẽ lập tức bị hiện thân.

### Nhạn Hành Trận

*Cơ bản*
- Cần 3 Tướng đứng thẳng hàng (ngang hoặc dọc).
- Cung của riêng Tướng 1 khi bắn theo hướng trái-phải của hàng: tổng Công +100%.
- Bộ Binh/Kỵ Mã trong trận: +100% tổng Công khi tấn công địch từ hướng trên/dưới hàng (chỉ áp dụng ở lượt Go); -25% khi tấn công địch từ hướng trái/phải hàng (cũng chỉ áp dụng ở lượt Go). Hướng xét theo phe ta di chuyển tới (Tướng đứng yên hoặc Văn không kích hoạt buff/giảm theo hướng này); không xét hướng đi của địch.

### Yển Nguyệt Trận

*Cơ bản*
- Cần 3 Tướng đứng thẳng hàng (ngang hoặc dọc).
- Tổng Công riêng Kỵ Mã của Tướng 1 +135%.
- Lính của Tướng 2: bắt buộc đứng yên đúng 1 Turn ngay lượt Go sau khi trận kích hoạt (kể cả nếu bị thương được Hoa Đà chữa khỏi trong lúc đó, vẫn tính là đứng yên — không lên Trì, không ẩn thân/hiện thân). Đứng yên vẫn có thể chết nếu phạm luật khác (VD chết đói).
- Tổng Công riêng của Tướng 3 -20%.

### Phong Sát Trận

*Cơ bản*
- Cần đúng 5 Tướng. Tổng Công riêng Cung Thủ của Tướng 1 +300%. Tổng Công riêng Cung Thủ của Tướng 2 -25%.
- Tướng 1 được chọn bắn thẳng hoặc bắn chéo (1 trong 4 ô chéo); nếu Tướng 1 có Tháp Bắn Tên hoặc dùng Phong Phù thì bắn chéo được xa hơn 1 ô nữa (Siêu Phong Phù thì xa 2 ô); Tháp + Phong/Siêu Phong Phù cộng lại cũng chỉ xa thêm tối đa như trên. Tướng 2 chỉ được bắn thẳng. Bắn vào đúng 1 ô mục tiêu, không tính xuyên qua ô thứ 2 phía sau.

### Trùy Hình Trận

*Cơ bản*
- Cần 3 Tướng xếp thành 1 hàng chéo. Không dùng được nếu trong 9 ô (vùng 3x3 xung quanh đội hình) đang có sẵn Thủy hoặc Hỏa Phù.
- Hiệu ứng chống Phù: dập tắt Thủy/Hỏa Phù trong toàn vùng 3x3 (mất ô nào thì dập ô đó); nếu Ô Trung Tâm của Hỏa Phù bị dập, toàn bộ vùng Hỏa Phù mất hết theo (thứ tự ưu tiên: bắn phá công trình > còn hiệu lực trận Trùy Hình > chống được Phù).
- Nếu trận vẫn còn hiệu lực đến hết Atc của Turn đó thì Phù ném từ Atc đó không dính được vào 9 ô; sang Go Turn sau nếu trận đã hết hiệu lực thì Phù ném từ Turn trước cũng không dính lại vào 9 ô này nữa.
- Toàn bộ Tướng + lính phe ta đang đứng trong 9 ô này (bất kể có tham gia trận hay không) đều bị giảm 10% tổng Công và 10% tổng Thủ.

---

## 13. Thuyền & Thủy Chiến

### Ba Loại Thuyền

*Cơ bản*
- **Thuyền Đánh Cá**: sinh Tài Nguyên mỗi Turn khi đang khai thác trên sông — Nhỏ (cấp 1, mặc định) = 4, Vừa (cấp 2) = 5, Lớn (cấp 3) = 6. 1 Ô Sông chỉ cho phép 1 Thuyền Đánh Cá khai thác; đầu mùa Xuân của mỗi năm không thu được Tài Nguyên từ thuyền cá.
- **Thuyền Kho Lương**: là 1 vựa lúa di động, chứa được tối đa 100.000 Lúa/chiếc (xem vai trò cấp lương ở §5/§7).
- **Thuyền Huấn Luyện**: quyết định % sức mạnh quân giữ được khi lên bờ / khi còn trên sông — Cấp 1 (mặc định): 50% khi lên bờ, 70% khi trên sông. Cấp 2: 75% khi lên bờ, 100% khi trên sông. Cấp 3: 100% khi lên bờ, 130% khi trên sông.
- Mỗi loại thuyền giá 1 Tài Nguyên/chiếc (mua đầu Go); nâng cấp thì toàn bộ thuyền cùng loại trong nước đều lên cấp theo. 1 Tướng được cầm cùng lúc cả 3 loại thuyền, mỗi loại chỉ 1 chiếc; chỉ cần cầm 1 trong 3 loại là chở được toàn bộ quân qua sông (không chở được Xe/Cơ Giới, trừ Trâu Gỗ).

*Cơ chế phụ*
- Thuyền được đem lên bờ để di chuyển cùng Tướng; chỉ khi xuống sông mới kích hoạt hiệu ứng riêng của từng loại thuyền.
- Thuyền Đánh Cá vừa lên Cấp 2 xong ngay đầu Turn đó thì Turn đó vẫn hưởng theo Cấp 1 (nâng cấp có độ trễ áp dụng — xem §18).

### Huấn Luyện Thủy Chiến

*Cơ bản*
- Không có Thuyền Huấn Luyện: Tướng + lính khi tiến vào/đang ở trên Sông chỉ còn 0% sức mạnh; khi vượt sông lên bờ, bị say sóng còn 25% sức mạnh (duy trì trong 1 Turn kể từ lúc lên bờ). Nếu trong lúc đang say mà đổi/thêm lính mới, số lính mới đó cũng bị say theo Tướng.
- Có mang Thuyền Huấn Luyện: áp dụng % giữ sức mạnh theo cấp của thuyền thay vì 0%/25% mặc định; muốn tránh say sóng khi lên bờ, phải mang thuyền theo trước khi lên bờ.

*Cơ chế phụ*
- Muốn lên thuyền của địch (có Tướng hoặc trống Tướng) đang ở trên sông, phải có thuyền của mình đang ở dưới sông đó hoặc đang cầm trong người.

### Thuyền Trống Tướng

*Cơ bản*
- Sau khi toàn bộ Tướng đã lên bờ, thuyền có thể bị bỏ lại trên sông (Thuyền Trống Tướng) — hiện lên bản đồ vào cuối Go (không nói rõ số lượng/loại), neo sát ô mà Tướng vừa lên bờ.
- Địch hiện thân đi vào ô có Thuyền Trống Tướng của mình: nếu Công của địch đạt gấp 3 lần Thủ của thuyền trở lên, địch cướp được thuyền; nếu địch thắng nhưng Công không đạt gấp 3 lần, thuyền bị phá hủy/nhấn chìm thay vì bị cướp.

*Cơ chế phụ*
- Tướng chỉ có thể tách 1 phần lính mình đang chỉ huy để lại trên Thuyền Trống Tướng khi chính Tướng đó đang lên bờ.
- Tướng đang Ẩn Thân mà lên bờ bỏ lại Thuyền Trống Tướng: thuyền đó vẫn hiện lên bản đồ bình thường.
- Sau khi cướp được thuyền, nếu Tướng đã có sẵn 1 chiếc cùng loại thì chỉ giữ 1 trong 2 (lúa trong thuyền được gộp lại trước khi bỏ chiếc dư).

### Phong Thuyền

*Cơ bản*
- Đầu lượt Go, Tướng đang ở bờ kề sông hoặc trên sông và đang chỉ huy thuyền có thể kích hoạt gió đẩy thuyền đi 2 ô/Turn (Siêu Phong đẩy đi 3 ô/Turn).
- Thuyền dù còn được gió đẩy thêm, nếu đã lên tới bờ kề sông thì tự động dừng.
- 1 Tướng trong 1 lượt Go chỉ được chọn dùng 1 trong 2: Tốc Phù hoặc Phong Thuyền.

*Cơ chế phụ*
- Lính không có thuyền có thể "ké" theo thuyền của Tướng khác đang cùng ô nếu cùng di chuyển; nếu Tướng có thuyền rời ô trước, lính không thuyền sẽ không ké được nữa; khi Phong Thuyền, lính ké theo bắt buộc phải đến đúng nơi Tướng có thuyền đến.

### Trao Đổi, Rút Thuyền

*Cơ bản*
- Thuyền được chuyển qua lại nội bộ giữa các Ô có kết nối với nhau, thực hiện đầu lượt Go.
- Rút thuyền về Ô bờ kề sông thực hiện đầu lượt Atc; riêng lính/Văn được rút về theo (Tướng thì không rút thuyền cùng nếu vẫn đang chỉ huy). Chỉ rút được nếu Ô bờ kề sông thuộc nước mình và nối sát với sông đó.

*Cơ chế phụ*
- Rút thuyền xong ở Atc 1 thì sang Go 2 mới được chuyển thuyền qua lại nội bộ như luật đầu Go bình thường.
- Nếu Chiến Xa Mã dùng Tốc Phù xuống sông: xe bị bỏ lại ở Ô bờ kề sông (nếu ô đó không thuộc nước mình, xe tự hủy vào cuối Go).

### Hủy Thuyền

*Cơ bản*
- Tướng đang ở trên sông mà bị đánh bại: toàn bộ thuyền đang do Tướng đó chỉ huy đều bị hủy.
- Tướng mang thuyền đi rồi bỏ lại ở Ô Rừng/Núi/bờ không thuộc nước mình: thuyền đó bị hủy vào cuối lượt Go.

### Thuyền Dính Thủy, Hỏa

*Cơ bản*
- Thuyền dính Thủy Phù (kể cả Kỵ có Móng Ngựa đang trên thuyền) sẽ không di chuyển được.
- Quân trên thuyền bị cháy tự động chuyển sang thế Thủ (hiệu ứng khác tương tự luật Hỏa Phù); thuyền vẫn đánh cá bình thường dù đang bị các hiệu ứng này.

### Cung Bắn Vào Thuyền

*Cơ bản*
- Áp dụng công thức chiến đấu bình thường: Công của Cung đạt bằng hoặc vượt Thủ của thuyền thì thuyền chìm.
- Hỏa Tiễn bắn xuống Sông (không dính Thủy Phù) vẫn giữ nguyên là Hỏa Tiễn.

---

## 14. Lò Rèn & Cơ Giới

### Vũ Khí & Khiên

*Cơ bản*
- Vũ Khí (tăng Công toàn quân): Đồng (Cấp 2) = +1 Công (1 lính thành 2 Công), tốn 3 Tài Nguyên nâng cấp; Sắt (Cấp 3) = +2 Công (thành 3 Công), tốn 4 Tài Nguyên; Thép (Cấp 4) = +3 Công (thành 4 Công), tốn 5 Tài Nguyên.
- Khiên (tăng Thủ toàn quân) theo đúng cấu trúc tương tự: Đồng = +1 Thủ, Sắt = +2 Thủ, Thép = +3 Thủ, cùng mức giá nâng cấp 3/4/5 Tài Nguyên.
- Cung Thủ không dùng được Vũ Khí/Khiên; thay vào đó Cung nhặt và giữ được tối đa 100 mũi Tên rơi cùng ô của nước mình.

`[GHI CHÚ]` Khác với Mỏ/Nhà Dân/Ruộng (nơi "Cấp 1/2/3" là tên của chính mức đó), ở đây tên mức là Đồng/Sắt/Thép còn "Cấp 2/3/4" chỉ là số thứ tự đi kèm chi phí nâng cấp — xem Phụ Lục B mục 11.

### Tên & Hỏa Tiễn

*Cơ bản*
- Tên thường: 1 Tài Nguyên = 2000 mũi Tên; mỗi lính Cung cầm 1 Tên = 2 Công.
- Hỏa Tiễn: 1 Tài Nguyên = 1000 Hỏa Tiễn (đắt hơn); mỗi lính Cung cầm 1 Hỏa Tiễn = 3 Công (ưu tiên dùng nếu có cả 2 loại).

*Cơ chế phụ*
- Hỏa Tiễn xuyên qua lửa thì không dính hiệu ứng Thủy, hoặc miễn khi đáp xuống Ô đang cháy — nhưng đáp xuống Ô Thủy (Sông/dính Thủy Phù) thì chuyển lại thành hiệu ứng Tên thường. Ngược lại, Tên thường xuyên qua lửa/đáp vào ô lửa sẽ chuyển hiệu ứng thành Hỏa Tiễn.

### Ngựa Chiến Mã

*Cơ bản*
- **Móng Ngựa** (10 Tài Nguyên nâng cấp): Kỵ Mã không còn bị Thủy Phù ảnh hưởng.
- **Sức Chạy** (15 Tài Nguyên nâng cấp): Tốc Phù được chọn đi 2 hoặc 3 ô; đứng trên Núi khi Tốc/Siêu Tốc được đi 2/3/4 ô. `[CẦN LÀM RÕ]` xem §10 và Phụ Lục B mục 4 về khả năng trùng tên với "Siêu Tốc" do Bát Kỳ cấp (§17).

### Xe Đục Thành

*Cơ bản*
- Cấp 1 (mặc định, 1 Tài Nguyên/chiếc): mỗi Bộ Binh trên xe +2 Công. Cấp 2 (1 Tài Nguyên nâng cấp): +3 Công. Cấp 3 (2 Tài Nguyên nâng cấp): +4 Công.
- Chỉ cộng Công khi đang đục vào Châu Thành/Thành Trì của địch. Xe chỉ chở Bộ Binh tối đa theo đúng Biên Chế của Tướng cầm xe; phải có Tướng chỉ huy mới dùng được; 1 Tướng chỉ cầm được 1 Xe.

*Cơ chế phụ*
- Nếu Tướng bỏ Xe lại ở 1 Ô không thuộc nước mình, Xe bị hủy vào cuối lượt Go.

### Cơ Giới (định nghĩa nhóm)

*Cơ bản*
- Gồm: Xe Đục Thành, Chiến Xa Mã, Tháp Bắn Tên, Máy Bắn Đá, Trâu Gỗ (Mộc Ngưu Lưu Mã). Thuyền không được xem là Cơ Giới.
- Mang/rút/gửi/hủy theo cùng 1 bộ quy tắc; 1 Tướng chỉ cầm được 1 cái mỗi loại Cơ Giới.

---

## 15. Tinh Binh — Mốc Mở Khóa

### Luật Chung

*Cơ bản*
- Toàn bộ hạng mục trong nhóm Tinh Binh chỉ cần quốc gia đạt đủ mốc số quân địch đã giết (cộng dồn, không reset) là tự động mở khóa — không cần nâng cấp gì thêm để "có được"; nếu cần chức năng nâng cao hơn thì mới tốn thêm Uy Danh như ghi ở từng mục.
- Số quân địch bị giết phải chia đều cho 2 nước địch (VD mốc 12.000 thì mỗi nước địch đóng góp đúng 6.000).
- Đây là bộ đếm cấp quốc gia, khác với Liên Trảm cá nhân (xem Phụ Lục B mục 1) — không reset khi thua trận.

### Mộc Ngưu Lưu Mã (còn gọi: Trâu Gỗ / Trâu)

*Cơ bản*
- Mốc mở khóa: 12.000 quân địch đã giết (mỗi nước địch 6.000). Giá mua: 1 Tài Nguyên/chiếc.
- Công dụng: thông lương qua Núi và Rừng. Trước khi lên Núi/Rừng, Tướng phải dắt theo 1 Văn cầm Trâu (Trâu nặng nên không Tốc Phù được); 1 Văn chỉ cầm được 1 Trâu, và phải chính Văn đó cầm mới có tác dụng thông lương.
- "Văn + Trâu" X ở Núi/Rừng được ở lại nhiều Turn một mình (không bị luật tối đa 1 Turn); nếu "Tướng + lính" Y ở lại cùng X thì Y cũng được ở nhiều Turn theo (miễn không phạm luật chết bệnh khác).

*Cơ chế phụ*
- Rút/gửi Trâu theo đúng luật như Xe; Trâu bại trận bị hủy như Xe.
- Nếu bị Hỏa Phù làm dời vị trí: "Văn + Trâu" dời đi cùng nhau.

### Doanh Trại

*Cơ bản*
- Mốc mở khóa: 12.000 quân địch đã giết (cùng mốc với Mộc Ngưu Lưu Mã). Giá xây: 1 Tài Nguyên/ô.
- Xây trên Ô Trắng nước mình đã chiếm và chưa dính Thủy/Hỏa; phải gửi Văn ra xây và trông coi liên tục — Văn đang coi mà rời đi thì Doanh sập ngay; 1 Văn chỉ coi 1 Doanh.
- Cho phép Tướng/lính/Văn bại trận trong phạm vi 5 ô di chuyển xuyên địa hình được chọn dưỡng thương tại Doanh thay vì phải về tận Thành Trì (không dặn trước sẽ mặc định về Trì).
- Miễn nhiễm Hỏa Phù giống Thành Trì; được xem như 1 vựa lúa giống Châu Thành.

*Cơ chế phụ*
- Văn ra xây cuối Go 1 thì đầu Atc 1 xây xong; đầu Go 2 mới được gửi Lúa vào Doanh.
- 1 Ô chỉ xây được 1 công trình; Ô bị mất chủ hoặc thua trận thì công trình sập ngay, lúa dự trữ mất theo; ai đang dưỡng thương tại Doanh bị sập sẽ lập tức phải chuyển về Thành Trì.

### Thao Trường

*Cơ bản*
- Mốc mở khóa và cách xây giống Doanh Trại (12.000 kill, 1 Tài Nguyên/ô, cần Văn ra xây và trông coi liên tục).
- Công dụng: mua Dân (không dùng hết trong Turn thì mất phần dư), mua Tên, mua Thuyền, mua các loại Cơ Giới, mua Trâu Gỗ, và đào tạo đổi ra Bộ Binh/Cung Thủ/Kỵ Mã ngay tại chỗ. Không mua được Lúa tại Thao Trường.
- Miễn nhiễm Hỏa Phù giống Thành Trì.

*Cơ chế phụ*
- Văn ra xây cuối Go 1 thì đầu Atc 1 xây xong; đầu Go 2 mới mua đồ tại đây được.

### Kỵ Tây Lương

*Cơ bản*
- Mốc mở khóa: 24.000 quân địch đã giết (mỗi nước địch 12.000). Nâng cấp tốn 10 điểm Uy Danh.
- Hiệu ứng: toàn bộ Kỵ Mã trong nước +1 Công khi đang trên bờ; giảm delay của Tốc Phù xuống còn 1 Turn cho toàn bộ Kỵ Mã trong nước (kể cả Tướng đang bị delay từ trước cũng được giảm theo — VD dùng Turn 1 thì Turn 3 đã dùng lại được, thay vì Turn 4).

### Mã Cung Thủ

*Cơ bản*
- Mốc mở khóa: 36.000 quân địch đã giết (mỗi nước địch 18.000). Nâng cấp tốn 10 điểm Uy Danh.
- Hiệu ứng: toàn bộ Cung Thủ có ngựa riêng, dùng được Tốc Phù như Kỵ Mã; vẫn giữ 3 hiệu ứng ngựa nếu đã có (Sức Chạy, Móng Ngựa — riêng khoản +1 Công của Kỵ Tây Lương thì Mã Cung Thủ KHÔNG được hưởng). Không có Truy Cùng Giết Tận. Móng ngựa giúp Mã Cung Thủ miễn nhiễm Thủy Phù; mỗi lính vẫn mang tối đa 100 Tên như bình thường.

*Cơ chế phụ*
- Mã Cung Thủ không liên quan/không tương tác với Chiến Xa Mã.

### Chiến Xa Mã

*Cơ bản*
- Mốc mở khóa: 48.000 quân địch đã giết (mỗi nước địch 24.000). Nâng cấp tốn 5 Uy Danh; mua 1 chiếc tốn 2 Tài Nguyên.
- Mang/rút/gửi/hủy như Xe Đục Thành; phải có Tướng chỉ huy, 1 Tướng chỉ cầm 1 Chiến Xa Mã; chở Kỵ Mã tối đa theo Biên Chế của Tướng, giữ nguyên các hiệu ứng liên quan tới Kỵ nếu có; được dùng Tốc Phù.
- Kỵ trên Chiến Xa Mã có trạng thái "Ngự Hỏa": không bị lửa thiêu/dời chỗ/cản trở, vẫn tấn công bình thường (chỉ cần đã lên xe trước khi bị cháy); được phép đi vào chính Ô Trung Tâm của vùng Hỏa Phù và tiêu diệt quân địch đang cháy tại đó theo đúng công thức Binh Pháp bình thường. Không được dùng 3 Kỹ Năng Tác Chiến khi đang ở trong Ô Lửa.

### Tháp Bắn Tên

*Cơ bản*
- Mốc mở khóa: 48.000 quân địch đã giết (mỗi nước địch 24.000). Nâng cấp tốn 5 Uy Danh; mua 1 chiếc tốn 2 Tài Nguyên.
- Mang/rút/gửi/hủy như Xe Đục Thành; phải có Tướng chỉ huy, 1 Tướng chỉ cầm 1 Tháp; chở Cung Thủ tối đa theo Biên Chế của Tướng.
- Giúp Cung trên Tháp bắn xa thêm 2 ô; Phong Phù (kể cả Siêu Phong) kết hợp Tháp chỉ bắn xa thêm tối đa 3 ô. Tháp giúp Trinh Sát quét được vùng 2x3 (ngang hoặc dọc) thay vì 2x2 mặc định.

*Cơ chế phụ*
- Mã Cung Thủ không kéo được Tháp Bắn Tên xuyên qua Thủy (Sông).
- Tháp Bắn Tên không liên quan gì đến Máy Bắn Đá.

### Máy Bắn Đá

*Cơ bản*
- Mốc mở khóa: 48.000 quân địch đã giết (mỗi nước địch 24.000). Nâng cấp tốn 5 Uy Danh; mua 1 Đá tốn 1 Tài Nguyên = 10.000 Đá (mua tại chỗ đầu lượt Atc, đá dư sẽ mất).
- Mang/rút/gửi/hủy như Xe Đục Thành; phải có Tướng chỉ huy, 1 Tướng chỉ cầm 1 Máy; chở Bộ Binh tối đa theo Biên Chế của Tướng. Mỗi 100 Bộ Binh trên Máy được +300 Công khi bắn phá Châu Thành/Thành Trì/công trình. Máy đặt trên Núi được +30% tổng Công.
- Bắn vào mục tiêu khác (không phải Châu/Trì/công trình) thì mỗi Bộ Binh chỉ tính 1 Công như bình thường. Phong Phù (kể cả Siêu Phong) kết hợp Máy Bắn Đá chỉ bắn xa thêm tối đa 2 ô.

*Cơ chế phụ*
- Bắn vào Ô có Tháp Bắn Tên của địch: Cung trên Tháp đó có 0 Công khi đỡ đá. Bên bị bắn không bắn trả được bằng Máy, các luật khác xử như Cung Thủ bình thường.
- 1 Tướng trong 1 lượt Atc chỉ được chọn 1 trong 2: bắn Đá hoặc bắn Cung, không làm cả 2. Buff Cung của Trận Pháp không cộng cho Máy Bắn Đá.

### Nỏ Liên Châu

*Cơ bản*
- Mốc mở khóa: 60.000 quân địch đã giết (mỗi nước địch 30.000). Nâng cấp tốn 10 Uy Danh.
- Hiệu ứng: trong 1 lượt Atc, Cung được chọn bắn 2 lần vào 2 Ô khác nhau cùng lúc (kể cả khác hướng). Các luật bắn khác giữ nguyên như cũ.
- Đồng thời giảm chi phí mua Tên: 1 Tài Nguyên = 4000 Tên thường (thay vì 2000), hoặc 1 Tài Nguyên = 2000 Hỏa Tiễn (thay vì 1000).

*Cơ chế phụ*
- 1 lần dùng Phong Phù (kể cả Siêu Phong) chỉ áp dụng cho đúng 1 trong 2 lượt bắn của Nỏ Liên Châu.
- Nỏ Liên Châu không liên quan gì đến Máy Bắn Đá.

---

## 16. Hệ Thống Nhập Hồn Chiến Tướng

*Cơ bản*
- Chỉ Tướng Quân và Đại Tướng Quân được dùng chức năng này (Chủ Công không được).
- Điều kiện chiêu hồn: 1 Tướng đã có tư chất hóa Chiến Tướng (do được Thủy Kính Tiên Sinh dạy thành Bát Kỳ — xem §17) + 20 Tài Nguyên + 10 điểm Uy Danh. Gọi hồn ở đầu Turn Go thì đầu Turn kế tiếp mới chính thức hóa thành Chiến Tướng.
- Khi thành Chiến Tướng: Biên Chế di chuyển tăng lên 50.000 quân; được điều lệnh tối đa 50.000 Cung Thủ cùng bắn Tên trong ô mình chỉ huy. Mọi chức năng khác giữ nguyên như Tướng Quân bình thường.
- Giết trực tiếp liên tiếp 3 Tướng địch trở lên thì thăng thành Đại Chiến Tướng.
- Chiến Tướng mặc định trung thành tuyệt đối với mọi chỉ thị của Chủ Công: không thể bị Trục Xuất hoặc Trảm Đầu, và không thể Phản Bội — nhưng vẫn có thể tham gia Đảo Chính (xem §3).
- 1 quốc gia tối đa có 5 Chiến Tướng, ứng đúng cho tối đa 5 vị Tướng Quân khác nhau của nước mình; 1 người chỉ được đóng vai 1 Chiến Tướng duy nhất suốt game, không tráo đổi vai cho nhau được, và một khi đã Nhập Hồn thì mãi mãi là Chiến Tướng đó đến hết game.
- 15 vị tướng có thể chiêu hồn: Trương Phi, Quan Vũ, Triệu Vân, Mã Siêu, Hoàng Trung, Hứa Chử, Trương Cáp, Trương Liêu, Nhạc Tiến, Từ Hoảng, Cam Ninh, Lữ Mông, Chu Du, Lục Tốn, Thái Sử Từ.

*Cơ chế phụ*
- Có thể gọi hồn cùng lúc nhiều người, bất kể Tướng đang ở ngoài thành, trong thành, hay đang dưỡng thương — các việc khác vẫn tiếp tục diễn ra bình thường song song.
- Khi có 1 Chiến Tướng xuất hiện, GM báo cho toàn game biết vào cuối lượt Atc của Turn chính thức hóa thành công.
- Riêng Chiến Tướng có màu khác biệt trên bản đồ để toàn game dễ phân biệt (xem §4).

---

## 17. Nhân Vật Đặc Biệt & Dân Tâm/Uy Danh

### Hệ Thống Dân Tâm & Uy Danh

*Cơ bản*
- Chỉ Chủ Công được sử dụng hệ thống này. Mỗi quốc gia bắt đầu với 0 điểm; Dân Tâm tích lũy từ sản lượng của Quan Văn, Uy Danh tích lũy từ sản lượng của Tướng Quân (xem §2).
- Việc đổi Dân Tâm/Uy Danh lấy các dịch vụ dưới đây, nếu không quy định rõ là dùng ở Atc, thì mặc định diễn ra ở đầu lượt Go. Các nhân vật đặc biệt có thể được mời tới bất kỳ đâu trên bản đồ.

### Thần Y Hoa Đà

*Cơ bản*
- Đổi 5 điểm Dân Tâm: mời về trị thương cho 1 người trong nước mình (được trị cả Chủ Công lẫn Quan Văn, không chỉ riêng Tướng Quân). Được trị nhiều người trong cùng 1 Turn (mỗi người tốn 5 Dân Tâm riêng); 1 người có thể được trị nhiều lần trong game.
- Trị lành thì ngay Turn kế tiếp sau khi mời, người được trị đã khỏe và có thể ra Sa Trường/tiếp tục sản xuất tài nguyên bình thường.
- Đổi 5 điểm Uy Danh: rút ngắn thời gian dưỡng thương đi 1 Turn; đổi 10 điểm Uy Danh: rút ngắn đi 2 Turn.

*Cơ chế phụ*
- GM giữ bí mật việc đã mời Hoa Đà; người vừa khỏi vẫn có thể tiếp tục dùng các mẹo ẩn Map như bình thường khi ra trận.
- Cả 3 quốc gia đều có thể mời Hoa Đà cùng lúc trong cùng 1 Turn, không giới hạn lẫn nhau.

### Pháp Sư Tả Từ

*Cơ bản*
- Đổi 7 điểm Dân Tâm: mời về dạy 1 người (không dạy được Chủ Công) thành **Bát Quái**. Dạy ở Turn N thì Turn N+1 mới xong và dùng được ngay.
- Bát Quái ở Tướng Quân: mỗi Turn (Go+Atc gộp) được dùng thêm 1 Phù nữa khác chủng loại (tổng cộng 2 Phù khác loại/Turn thay vì 1).
- Bát Quái ở Quan Văn: mỗi Turn đầu Go được chọn chế miễn phí 1 trong 3 loại "Siêu Phù": Siêu Tốc Phù (đi xa hơn hiện tại thêm 1 ô, do Văn "chọn"), Siêu Phong Phù (bắn xa hơn hiện tại thêm 1 ô, "bắt buộc"), hoặc Siêu Cổ Vũ (Cổ Vũ gốc +1 Công thì bản Siêu này thành +2 Công).

*Cơ chế phụ*
- Danh tính người đã học Bát Quái được giữ bí mật, chỉ quốc gia của người đó biết.
- 1 người có thể học cả Bát Quái (Tả Từ) lẫn Bát Kỳ (Thủy Kính) cùng lúc.
- Cả 3 quốc gia đều có thể mời Tả Từ cùng 1 Turn, không giới hạn số người được dạy.

### Thủy Kính Tiên Sinh

**Gốc tích tên gọi:** Bát Kỳ là tên gọi cho 8 đệ tử xuất chúng nhất của Thủy Kính Tiên Sinh (Tư Mã Huy) — ai được ông đích thân dạy sẽ được xem là 1 trong Bát Kỳ đó, không liên quan gì đến chế độ Bát Kỳ nhà Thanh.

*Cơ bản*
- Đổi 10 điểm Dân Tâm: mời về dạy 1 người (không dạy được Chủ Công) thành **Bát Kỳ**. Dạy ở Turn N thì Turn N+1 xong và hiệu lực x5 áp dụng ngay.
- Bát Kỳ ở Quan Văn: sản lượng Tài Nguyên của Văn đó nhân 5 (x5) mỗi Turn, áp dụng đến hết game. Chính điều kiện Bát Kỳ này cũng mở khóa quyền chỉ huy lính vào Trận Pháp cho Văn (xem §12).
- Bát Kỳ ở Tướng Quân: có tư chất để hóa thành Chiến Tướng (điều kiện tiên quyết để dùng Hệ Thống Nhập Hồn Chiến Tướng — xem §16), áp dụng đến hết game.

*Cơ chế phụ*
- Danh tính người đã học Bát Kỳ được giữ bí mật, chỉ quốc gia của người đó biết.
- Cả 3 quốc gia đều có thể mời Thủy Kính cùng 1 Turn, không giới hạn số người được dạy.
- Nếu người đã được dạy (chờ lên Chiến Tướng) phản bội trước khi kịp hóa thành: GM hoàn trả lại Tài Nguyên và Uy Danh đã tốn cho quốc gia cũ.

`[CẦN LÀM RÕ]` Nếu Bát Kỳ đúng nghĩa đen là "8 đệ tử" của Thủy Kính, thì tổng số người có thể mang danh Bát Kỳ trong suốt ván game có giới hạn cứng ở 8 (toàn server, không phải mỗi nước) hay không? Luật hiện tại ghi "không giới hạn số người được dạy" — mâu thuẫn với đúng nghĩa đen của con số 8 trong tên gọi. Xác nhận: (a) giữ đúng nghĩa đen, giới hạn cứng 8 suất Bát Kỳ toàn game (hết suất thì Thủy Kính không dạy thêm được nữa), hay (b) "Bát Kỳ" chỉ là tên gọi/danh hiệu, số 8 mang tính biểu tượng chứ không giới hạn số người học.

---

## 18. Luật Bổ Sung / Ví Dụ Minh Họa / FAQ Tổng Hợp

### Quy Tắc Nâng Cấp Chung

*Cơ bản*
- Mọi loại nâng cấp (Nhà, Binh Khí, Xe, Ngựa, Thuyền...) đều dùng vĩnh viễn sau khi hoàn thành — toàn bộ đơn vị/công trình cùng loại trong nước tự động lên cấp theo.
- Nâng cấp ở Turn N thì xây/hoàn tất xong ở Turn N+1; trong lúc chờ vẫn dùng theo cấp hiện tại. Mỗi loại chỉ nâng được 1 lần trong 1 Turn.
- Phải nâng tuần tự từ Cấp 1 lên Cấp 2 rồi mới lên Cấp 3 — không được nhảy cóc. Việc nâng cấp luôn thực hiện vào đầu lượt Go.

### Cấm Liên Minh Giữa Các Quốc Gia

*Cơ bản*
- 3 quốc gia không được GM chứng thực bất kỳ hình thức liên minh, giao dịch, lập khế ước, cho mượn/cho tặng, hay trợ chiến/trợ trận nào với nhau.

### Không Nhận Lại Người Đã Rời Đi

*Cơ bản*
- Không thể nhận lại kẻ đã bị Trục Xuất, đã Phản Bội, hoặc đã bị Xử Trảm — dù ở quốc gia cũ hay quốc gia khác.
- Trục Xuất nghĩa là đuổi khỏi quốc gia nhưng không chủ đích giết; phân biệt với Trảm Đầu (xử tử) — xem §3.

### Xuất Quân Từ Không Gian Ảo

*Cơ bản*
- Văn/lính/đồ mới mua, hoặc đang ở không gian ảo, được xuất hiện ra bản đồ từ bất kỳ Ô Trì (hoặc Doanh Trại, nếu đã có — xem §15) nào đang nối với không gian ảo đó.

*Cơ chế phụ*
- Ô Trì/Thao Trường đang dính Thủy Phù: không rút được lính/Tướng/đồ ra khỏi đó (trừ Kỵ có Móng Ngựa), nhưng vẫn mua được lính/đồ mới và cho xuất quân đứng tại chỗ đó bình thường.
- Đầu Go 2 trở đi, có thể gửi thêm lính/đồ ra Sa Trường tiếp; Tướng/lính tại cùng ô được gắn/đổi đồ và lính có sẵn hoặc mới nếu hợp luật (cùng ô thì gắn/đổi được cả đầu Go lẫn đầu Atc; khác ô nhưng đều là ô nước mình có nối nhau thì chỉ gắn/đổi được vào đầu Go). Nếu đầu Go 2 rút bớt lính của 1 Tướng đang chinh chiến, phải cấp bù ngay để Tướng đó còn tối thiểu 1000 lính — không đủ thì cấm rút.

### Ví Dụ Minh Họa: Nối Lương & Cắt Lương

*(Ví dụ áp dụng cho khái niệm Nối Lương ở §7, không phải luật riêng)*

Giả sử nước Thục đã chiếm từ Ô B4 đến B9. Nước Ngụy dẫn quân chiếm thành công Ô C7 và B7 — Thục mất B7, khiến B8 và B9 bị cắt đường tiếp tế lúa về Trì.

Kết quả: Tướng, Văn, và gần như toàn bộ lính + đồ của Thục tại B8, B9 sẽ chết đói sạch ngay cuối lượt Go (nếu bị Kỵ/Bộ xử lý) hoặc cuối lượt Atc (nếu bị Cung xử lý, hoặc lính miễn nối lương hết hạn, hoặc Tướng ẩn thân hiện lại) trong đúng Turn đó; B8, B9 sau đó trở thành Ô Trắng vì không còn đường thông về Trì. Trước khi bị giết/chết đói/cắt lương ở cuối Go/Atc, quân vẫn thực hiện đầy đủ giao chiến, lệnh chỉ thị, và lệnh Phù trong đúng lượt Go/Atc tương ứng trước khi bị xử lý.

Dù B8/B9 có lính hay không, thắng hay thua, hễ mất kết nối với Thành Trì của nước mình thì mặc định lính tại đó chết đói hết và đất bị xóa màu sở hữu.

---

*(Đã hoàn tất bản nháp §1–18. Xem Phụ Lục A để tra cứu khái niệm, Phụ Lục B để xem rà soát thuật ngữ.)*

---

## Phụ Lục A — Bảng Tra Cứu Khái Niệm Gốc

Bảng lần trước trộn lẫn 2 loại hàng khác nhau: (a) tên riêng/thuật ngữ thật sự xuất hiện trong PDF gốc, và (b) cụm từ do mình tự đặt ra để tóm tắt 1 đoạn luật không có tên riêng. Việc trộn chung khiến bảng trông như 1 bảng thuật ngữ (glossary) trong khi nhiều dòng chỉ là mô tả nội dung. Chia lại thành 2 bảng riêng để không nhầm lẫn nữa — xem thêm gốc rễ của vấn đề này ở Phụ Lục B, mục 12.

### A.1 — Khái niệm có tên riêng trong PDF gốc

Chỉ liệt kê danh từ/thuật ngữ thật sự được đặt tên trong tài liệu gốc (tên chương, tên hàng trong bảng, hoặc cụm từ được lặp lại nhiều lần như 1 thuật ngữ cố định). Cột "Mục" là nơi khái niệm đó sẽ nằm trong tài liệu chuẩn hóa (có thể khác vị trí trang gốc vì tài liệu này tổ chức lại theo Phần A/B, không theo thứ tự PDF).

| Mục | Khái niệm (tên gốc) | Mô tả ngắn gọn |
|---|---|---|
| §1 | Turn / Go / Atc | 1 ngày = 1 turn, chia lượt Go (9h–20h) và Atc (20h–9h) |
| §1 | Chiến báo | GM báo cáo 2 lần/turn (cuối Go, cuối Atc) |
| §2 | Chủ Công | Đứng đầu quốc gia, xét duyệt/trục xuất/trảm đầu, không phản bội được |
| §2 | Quân Sư | Lọc thông tin, chốt lệnh hậu cần theo đa số Quan Văn |
| §2 | Quan Văn | Sản xuất Tài Nguyên + Dân Tâm, không tự cầm quân |
| §2 | Tướng Quân | Sản xuất Uy Danh, cầm quân ra trận |
| §2 | Đại Tướng Quân | Cấp bậc nâng cao của Tướng Quân, có Skill +Công/+Thủ |
| §2 | Đế Khí | Tài nguyên riêng của Chủ Công, quy đổi Dân Tâm/Uy Danh |
| §2 | Tham Ô | Quan Văn giữ lại tài nguyên tự làm ra thay vì nộp quốc khố |
| §2 | Liên Trảm | Chuỗi giết tướng địch liên tiếp của 1 cá nhân, reset khi thua trận |
| §3 | Đảo Chính | Sau thống nhất, ≥1/2 Văn+Tướng đồng thuận lập Hoàng Đế mới |
| §3 | Trục Xuất | Chủ Công đuổi 1 người khỏi nước, thu hồi tài sản/quân |
| §3 | Trảm Đầu | Chủ Công xử tử 1 người, thu hồi tài sản/quân |
| §3 | Phản Bội | Quan Văn/Tướng Quân rời nước mang theo tài sản/quân |
| §3 *(không có tên gốc)* | ~~"Gián điệp cài cắm"~~ | Đây là tên **mình tự đặt** khi diễn giải 1 câu mơ hồ ở trang 1 ("Vô game được thêm 2 kẻ Nước địch về…"). PDF gốc không dùng từ "gián điệp" — nên xem đây là 1 diễn giải đã thống nhất với bạn, không phải thuật ngữ có sẵn |
| §4 | Ô Trắng | Đất trống, chiếm bằng cách kéo quân vào |
| §4 | Châu Thành | Đất có 6000 lính địa phương trấn thủ, vựa lúa phụ |
| §4 | Thành Trì | Lãnh thổ gốc mỗi nước, 9 ô, phá hết thì nước sụp đổ |
| §4 | Rừng | Ẩn quân khỏi bản đồ, tối đa ở 1 turn |
| §4 | Núi | +Thủ cho ô kề, +Công cho Cung đứng trên, tối đa ở 1 turn |
| §4 | Sông | Cần thuyền mới vào được, ở được nhiều turn |
| §5 | Mỏ | Sinh Tài Nguyên, 3 cấp |
| §5 | Nhà Dân | Đổi Tài Nguyên lấy Dân, 3 cấp |
| §5 | Ruộng | Đổi Dân lấy Lúa, 3 cấp |
| §5 | Chết đói / chết bệnh | Cụm từ lặp lại nhiều lần trong gốc cho hậu quả hết lúa / phạm luật rừng-núi |
| §6 | Bộ Binh | Đơn vị lính cơ bản, 3 cấp |
| §6 | Cung Thủ | Đơn vị bắn tên, 3 cấp |
| §6 | Kỵ Mã | Đơn vị có Truy Cùng Giết Tận, 3 cấp |
| §6 | Biên Chế | Định nghĩa gốc: "giới hạn số lính (10.000) khi tướng lệnh lính cùng hành động" (trang 16) |
| §7 | Nối lương / cắt lương | Thuật ngữ lặp lại xuyên suốt tài liệu cho việc liên kết Ô-Trì cấp lương |
| §7 | Chiếm Đất | Tên hàng thật trong bảng "BINH PHÁP – CHIẾM CÔNG THỦ" (trang 15): Đất Trống vs Đất Có Chủ |
| §7 | "Hành quân đầu game xuất phát từ đâu?" | Trích gần nguyên văn câu hỏi FAQ trang 26 — trả lời: từ bất kỳ Ô Trì nào |
| §8 | Tấn Công | Tên hàng thật (trang 15), chứa 2 công thức con bên dưới |
| §8 | Địch Không Phòng Thủ | Tên hàng thật (trang 15) |
| §8 | Địch Phòng Thủ | Tên hàng thật (trang 15) |
| §8 | Công Thức Kỵ Mã Truy Sát | Cụm nguyên văn trang 15; liên quan skill "Truy Cùng Giết Tận" của Kỵ Mã (trang 11) |
| §8 | Liên Quan Phòng Thủ | Tên hàng thật (trang 16): khi nào 1 ô mặc định bật Công/Thủ |
| §8 | Phòng Thủ Của Thành | Tên hàng thật (trang 16): công thức 6000/8000 Thủ Đá + lính + Núi |
| §8 *(edge-case)* | Cung Thủ Bắn | Tên hàng thật (trang 17), thuộc mục "Tài Liệu Thực Chiến" |
| §8 *(edge-case)* | Địa Hình Thật | Tên hàng thật (trang 17) |
| §8 *(edge-case)* | Cung Bắn Vào Ô Hỏa, Ô Hỗn Chiến | Tên hàng thật (trang 17) |
| §8 *(edge-case)* | Cung Các Nước Cùng Bắn Vào 1 Ô | Tên hàng thật (trang 17) |
| §8 *(edge-case)* | 3 Nước Cùng 1 Ô | Tên hàng thật (trang 17) |
| §8 *(edge-case)* | Hội Đồng Hỗn Chiến Cận | Tên hàng thật (trang 17) |
| §8 *(edge-case)* | Thiệt Hại | Tên hàng thật (trang 17): chia thiệt hại theo tỉ lệ loại lính |
| §9 | Mùa Xuân / Mùa Hạ / Mùa Thu / Mùa Đông | 4 tên hàng thật (trang 12) |
| §10 | Hỏa Phù / Tốc Phù / Phong Phù / Cổ Vũ / Thủy Phù | 5 tên hàng thật (trang 13) |
| §11 | Kỳ Binh (Ẩn Thân) / Đặt Bẫy / Trinh Sát | 3 tên hàng thật (trang 14) |
| §12 | Ngư Lân Trận / Trường Xà Trận / Thất Tinh Trận / Nhạn Hành Trận / Yển Nguyệt Trận / Phong Sát Trận / Trùy Hình Trận | 7 tên riêng thật (trang 22) |
| §12 | Thiên La Địa Võng | Tên riêng thật (cơ chế mai phục của Trường Xà & Thất Tinh) |
| §12 | Trấn Áp | Tên riêng thật (hiệu ứng phụ của Thất Tinh Trận) |
| §13 | Thuyền Đánh Cá / Thuyền Kho Lương / Thuyền Huấn Luyện | 3 tên hàng thật (trang 10) |
| §13 | Huấn Luyện Thủy Chiến | Tên hàng thật (trang 18) |
| §13 | Thuyền Trống Tướng | Cụm từ lặp lại nhiều lần (trang 18) |
| §13 | Phong Thuyền | Tên hàng thật (trang 18) |
| §13 | Trao Đổi Rút/Thuyền | Tên hàng thật (trang 18) |
| §13 | Hủy Thuyền | Tên hàng thật (trang 18) |
| §13 | Thuyền Dính Thủy, Hỏa | Tên hàng thật (trang 18) |
| §13 | Cung Bắn Vào (thuyền) | Tên hàng thật (trang 18) — trùng tên với mục Cung Bắn Vào ở §8, khác nội dung |
| §14 | Vũ Khí / Khiên | Tên hàng thật (trang 9): Đồng/Sắt/Thép |
| §14 | Tên (Hỏa Tiễn) | Tên hàng thật (trang 9) |
| §14 | Ngựa Chiến Mã | Tên hàng thật (trang 9): gồm Móng Ngựa, Sức Chạy |
| §14 | Xe Đục Thành | Tên hàng thật (trang 9) |
| §14 | Cơ Giới | Định nghĩa nhóm, nguyên văn trang 24: "Xe Đục Thành, Chiến Xa Mã, Tháp Bắn Tên, Máy Bắn Đá, Trâu Gỗ" |
| §15 | Mộc Ngưu Lưu Mã (còn gọi: Trâu Gỗ / Trâu) | Tên hàng thật (trang 19) — xem Phụ Lục B mục 2 về 3 tên gọi |
| §15 | Doanh Trại / Thao Trường | 2 tên hàng thật (trang 19) |
| §15 | Kỵ Tây Lương / Mã Cung Thủ / Chiến Xa Mã / Tháp Bắn Tên / Máy Bắn Đá / Nỏ Liên Châu | 6 tên hàng thật (trang 19–20) |
| §16 | Chiến Tướng / Đại Chiến Tướng | Tên riêng thật (trang 23) |
| §16 | 15 vị tướng (danh sách tên riêng nhân vật) | Trương Phi, Quan Vũ, Triệu Vân, Mã Siêu, Hoàng Trung, Hứa Chử, Trương Cáp, Trương Liêu, Nhạc Tiến, Từ Hoảng, Cam Ninh, Lữ Mông, Chu Du, Lục Tốn, Thái Sử Từ |
| §17 | Thần Y Hoa Đà | Tên riêng đầy đủ (trang 8) |
| §17 | Pháp Sư Tả Từ | Tên riêng đầy đủ (trang 8); dạy thành **Bát Quái** |
| §17 | Thủy Kính Tiên Sinh | Tên riêng đầy đủ (trang 8); dạy thành **Bát Kỳ** |
| §18 | "Không Thể Nhận Lại Kẻ Trục Xuất, Phản Bội, Xử Trảm" | Gần như nguyên văn trang 26 |

### A.2 — Quy tắc không có tên riêng trong bản gốc (chỉ là mô tả nội dung)

Các dòng dưới đây **không phải thuật ngữ** — bản gốc không đặt tên cho các đoạn luật này, chúng chỉ là những đoạn quy tắc rời rạc (thường ở trang FAQ 26) hoặc kết luận tổng quát rút ra từ nhiều dòng luật. Cột "Nội dung" là tóm tắt của mình, không phải trích dẫn.

| Mục | Nội dung (mô tả, không phải tên gọi) |
|---|---|
| §1 | Trình tự GM chọn Chủ Công → Chủ Công chọn Quân Sư → người chơi còn lại xin phò tá → được phân Văn/Tướng |
| §1 | Điều kiện thắng: 2 quốc gia sập hết Thành Trì, hoặc hết giờ chơi |
| §1 | Cách tính điểm lãnh thổ: chỉ Xuân/Thu; Trì +5, Châu +3, Trắng +1; các mốc so khi hòa điểm |
| §5 | Lính cần lúa mỗi turn mới không chết đói; nuôi lính chứ không nuôi dân |
| §5 | Lính ở gần vựa lúa hơn (theo đường nối lương) được ăn trước khi lúa cạn |
| §7 | Gửi/rút quân chỉ thực hiện ở ô nước mình, đầu lượt Go, phải để lại tối thiểu 1000 |
| §7 | 2 tướng đi ngược chiều qua nhau trong cùng 1 turn không tính là giao chiến (chỉ đánh quân đứng lại, nếu có) — nguyên gốc là 1 câu hỏi ký hiệu "EQ" ở trang 26 |
| §8 | Thứ tự ưu tiên khi hòa chỉ số: số tướng → số Chiến Tướng → số Kỵ Mã → đình chiến lùi 1 ô |
| §12 | Quy tắc chung của Trận Pháp: kích Go1, duy trì Atc1, tốn Uy Danh = số người tham gia |
| §13 | Lính không có thuyền có thể đi ké theo tướng có thuyền cùng ô (từ "ké" dùng trong đoạn văn, không phải tên mục) |
| §18 | Quy tắc nâng cấp: phải tuần tự 1→2→3, mỗi lần nâng delay 1 turn — rút ra từ câu hỏi FAQ "Nâng cấp… thế nào?" (trang 26) |
| §18 | 3 quốc gia không được GM chứng thực liên minh/giao dịch/khế ước — rút ra từ câu hỏi FAQ (trang 26): "→ Không" |
| §18 | Ví dụ minh họa nối lương (Thục bị Ngụy cắt đường lương qua B7) — không phải khái niệm riêng, chỉ là ví dụ áp dụng cho khái niệm "Nối lương" ở §7 |

*Không đưa vào cả 2 bảng: 3 trang trích dẫn cuối PDF gốc (câu nói Tào Tháo, 7 cách nhìn người của Gia Cát Lượng, câu nói Chu Du) — đã loại khỏi rulebook chuẩn hóa theo yêu cầu.*

---

## Phụ Lục B — Rà Soát Thuật Ngữ / Đặt Tên

Rà soát toàn bộ PDF gốc để tìm chỗ đặt tên nhập nhằng, không nhất quán, hoặc dùng 1 từ cho nhiều khái niệm khác nhau (và ngược lại). Xếp theo mức độ có thể gây hiểu sai luật khi chơi thật.

1. **"Kill" / "Giết" / "Liên Trảm" — 2 bộ đếm khác nhau dùng chung ngôn từ.** Cá nhân có "Liên Trảm" (giết liên tiếp, reset về 0 khi thua, dùng để thăng Đại Tướng Quân — trang 3). Quốc gia có tổng kill cộng dồn không reset, dùng để mở khóa Tinh Binh (trang 19: "Số Kill Địch Sẽ Cứ Tích Lũy Dồn Tới"). Tài liệu gốc dùng "giết"/"Kill" cho cả 2 mà không đặt tên riêng biệt — dễ nhầm 2 cơ chế đếm hoàn toàn khác nhau (1 cái thuộc về 1 người, 1 cái thuộc về cả nước, và chỉ 1 trong 2 cái bị reset khi thua trận). Đề xuất đặt tên tách bạch: "Liên Trảm cá nhân" vs "Tổng Kill Quốc Gia".

2. **"Mộc Ngưu Lưu Mã" / "Trâu Gỗ" / "Trâu" — 3 tên cho cùng 1 cơ giới.** Trang 19 gọi "Mộc Ngưu Lưu Mã" (tên chính thức, có mục riêng). Trang 17 gọi "Trâu ta". Trang 24 (định nghĩa nhóm Cơ Giới) gọi "Trâu Gỗ". Đề xuất chốt 1 tên chính thức trong rulebook, các tên còn lại ghi chú "còn gọi là".

3. **"Bát Quái" vs "Bát Kỳ" — 2 khái niệm khác nhau, tên gần giống nên dễ lẫn.** Tả Từ dạy thành "Bát Quái" (trang 8, mở khóa Siêu Phù). Thủy Kính dạy thành "Bát Kỳ" (trang 8, x5 tài nguyên hoặc tiềm năng Chiến Tướng) — theo xác nhận của tác giả, "Bát Kỳ" là tên gọi 8 đệ tử xuất chúng nhất của Thủy Kính Tiên Sinh (Tư Mã Huy), không liên quan đến chế độ Bát Kỳ nhà Thanh (đã cập nhật lore ở §17). Dù vậy 2 tên vẫn phát âm/nhìn gần giống nhau nên khi soạn hoặc đọc luật rất dễ gõ/hiểu nhầm giữa 2 khái niệm — luật Trận Pháp (trang 21) yêu cầu Văn "Phải Bát Kỳ" mới được cầm quân vào trận, liên quan Thủy Kính chứ không phải Tả Từ, dễ gõ nhầm nhất.

4. **"Siêu Tốc" — dùng cho ít nhất 2 nguồn khác nhau, không rõ có phải cùng 1 hiệu ứng.** (a) Ngựa Chiến cấp 2 "Sức Chạy": Tốc Phù đi được 2–3 ô, đứng trên núi "Tốc/Siêu Tốc" đi 2/3/4 ô (trang 9). (b) Quan Văn được Tả Từ dạy Bát Quái: mỗi turn miễn phí chọn 1 trong 3 "Siêu Phù", trong đó "Siêu Tốc" cho đi xa hơn +1 ô (trang 8). Tài liệu không nói rõ đây có phải cùng 1 buff hay 2 buff riêng biệt trùng tên, có cộng dồn được không. `[CẦN LÀM RÕ khi viết §10/§15]`

5. **"Thủ" / "Phòng" / "Thủ Đá" / "đá Thành" — nhiều tên cho cùng 1 loại chỉ số phòng thủ công trình.** Trang 4 dùng "Thủ" và "Phòng" xen kẽ cho cùng 1 trị số (6000 của Châu Thành). Trang 5 và trang 16 dùng "Thủ đá thành"/"Thủ Đá". Không có 1 thuật ngữ chuẩn duy nhất, dễ nhầm với "Thủ" là chỉ số phòng thủ của lính (Công/Thủ cá nhân).

6. **"Sa Trường" — chỉ định nghĩa vỏn vẹn 1 câu, dễ hiểu sai phạm vi áp dụng.** Định nghĩa duy nhất (trang 3, trong ngoặc kép ngay giữa câu luật khác): "Sa Trường: là không phải Ô Trì". Hiểu theo đúng nghĩa đen thì Châu Thành/Ô Trắng/Rừng/Núi/Sông đều tính là Sa Trường — tức đứng trên Châu Thành (có tường, có quân đồn trú) vẫn bị xem là "ở ngoài Sa Trường" khi áp luật Phản Bội/Trảm Đầu/hồi phục 2 turn. Bản thân tên gọi "Sa Trường" (nghĩa đen: bãi chiến trường) gợi ý 1 vùng đất trống giao tranh, khiến người đọc dễ ngỡ đứng trên thành/châu không tính — nhưng luật lại quy định ngược lại.

7. **"Cơ Giới" — định nghĩa xuất hiện muộn (trang 24) dù thuật ngữ được dùng từ trang 9.** Không phải lỗi đặt tên nhưng là lỗi trình bày: đọc tài liệu gốc theo thứ tự trang sẽ gặp "Cơ Giới" nhiều lần trước khi biết chính xác nó gồm những gì.

8. **"Chiếm" dùng chung cho 2 quy trình có độ khó khác nhau.** "Chiếm" Ô Trắng = kéo quân vào là xong. "Chiếm" Châu Thành = phải đánh bại 6000 lính trấn thủ trước. Thành Trì thì tài liệu lại không dùng từ "chiếm" mà dùng "phá/bắn sập" — nhất quán về logic nhưng cùng 1 động từ "chiếm" bị dùng cho 2 mức độ hoàn toàn khác nhau, dễ đọc lướt mà hiểu nhầm cả 2 đều dễ như nhau.

9. **"Tướng" trong luật Trận Pháp — không rõ có tính luôn Quan Văn (Bát Kỳ) vào số đếm hay là suất cộng thêm riêng.** Từng loại trận định nghĩa "Cần X Tướng" (ở trang 21–22), nhưng mãi đến phần luật rời rạc ở trang 21 mới có dòng: "Trận 2 và 3 người Văn được tham gia tối đa 1. Trận 4 và 5 người Văn được tham gia tối đa 2" — ngụ ý Văn CHIẾM 1 trong số "X người" đó chứ không phải slot cộng thêm. Vì câu làm rõ này nằm cách xa phần định nghĩa từng trận, người đọc chỉ xem mục "Cần X Tướng" của riêng 1 trận sẽ dễ hiểu lầm là cần đúng X vị Tướng Quân, không được thay bằng Văn.

10. **"Quân" vs "Lính" dùng lẫn lộn.** "Quân" khi thì chỉ tập hợp chung (VD "cầm quân", "quân địch"), khi thì thay hẳn cho "lính" lúc đếm số lượng cụ thể (VD "quân trên Xe Đục Thành" so với "1000 lính"). Không gây sai lệch nghiêm trọng nhưng thiếu nhất quán khi soạn thành luật chính thức, có thể cần chọn 1 từ chuẩn cho "đơn vị lính đếm được" và 1 từ khác cho "lực lượng quân sự nói chung".

11. **Cấu trúc bảng nâng cấp không nhất quán giữa các nhóm công trình/trang bị.** Mỏ/Nhà Dân/Ruộng: nhãn "Cấp 1/2/3" là tên của chính mức đó. Vũ Khí/Khiên: tên mức là "Đồng/Sắt/Thép", còn "Cấp 2/3" chỉ xuất hiện kèm dòng chi phí nâng cấp bên dưới — dễ đọc nhầm "Cấp 2" là 1 mức riêng biệt tách khỏi "Sắt", thay vì hiểu "Sắt" chính là "Cấp 2". Cùng là hệ thống 3 cấp nhưng 2 cách trình bày/đặt tên khác nhau trong cùng 1 tài liệu.

12. **Gốc rễ của phần lớn các vấn đề trên: PDF viết hoa gần như tùy tiện, không phân biệt được đâu là tên thuật ngữ chính thức và đâu chỉ là nhấn mạnh.** Gần như mọi cụm danh từ trong tài liệu đều được Viết Hoa Chữ Cái Đầu — kể cả những cụm rõ ràng không phải tên gọi (VD "Không Thể Phản Bội", "Sau Khi Ném"). Vì vậy khi lập Phụ Lục A (bảng tra cứu), rất khó tự động phân biệt "đây là 1 khái niệm có tên" hay "đây chỉ là 1 câu được nhấn mạnh" — mình phải đọc lại từng chỗ theo ngữ cảnh. Đây cũng chính là lý do lần đầu dựng bảng, nhiều dòng lẫn cụm mô tả tự đặt vào chung với tên gọi thật (đã tách lại thành A.1/A.2 ở Phụ Lục A).
