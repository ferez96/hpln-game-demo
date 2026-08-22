# Backlog - đường tới ván playtest đầu tiên

Cập nhật: 2026-08-22 · Mục tiêu chi phối: xem `product-brief.md`

Thứ tự trong file **là** thứ tự ưu tiên. Item trên xong mới xuống item dưới, trừ khi có lý do ghi
rõ. Mỗi item mô tả **hành vi mong muốn**, không mô tả cách cài - cách cài là việc của vòng ship.

Ký hiệu độ lớn: `S` dưới nửa buổi · `M` một buổi · `L` nhiều buổi. PO ước lượng thô, dev chỉnh lại.

---

## P0 - làm trước khi chạy playtest

### RULE-01 · Chốt ba phán quyết luật engine đang tự quyết `S` `chưa làm`

**Story:** Là tác giả luật, tôi cần xác nhận engine đang chơi đúng ván tôi muốn, trước khi bỏ vài
tiếng chạy playtest lấy số liệu.

**Tại sao trước tiên:** Ba chỗ dưới đây source không nói rõ, engine tự chọn một cách đọc và mọi
kết quả playtest sẽ mang dấu vết của lựa chọn đó. Nếu Minh chốt ngược lại sau khi chạy xong, số
liệu cân bằng phải bỏ đi chạy lại.

Ba điểm cần phán quyết:

1. **Quân đứng trên Rừng/Núi có nối lương không?** §7 chỉ cấm nối *xuyên qua* Rừng/Núi/Sông. Engine
   (`game/supply.ts:reachDistance`) chọn cách đọc: không route xuyên qua, nhưng quân **đứng trên**
   vẫn rút lương từ ô kề đã nối. Cách đọc ngược lại khiến quân lên núi là chết đói không đường gỡ,
   làm vô nghĩa cả "ở tối đa 1 Turn" của §4 lẫn vai trò ẩn nấp của Rừng.
2. **Chết bệnh ở Rừng/Núi tính ở Turn nào?** Engine cho hạn tới đầu Turn N+2 thay vì N+1
   (`game/resolve.ts:applyIllness`), vì `beginTurn` chạy *trước* khi GM nhập lệnh Go - chốt N+1
   nghĩa là bước lên núi là án tử không kịp ra lệnh rút.
3. **Có mua lúa bằng Tài Nguyên không?** §4 gọi Trì là "nơi mua lúa" nhưng không chỗ nào cho tỉ giá.
   Engine cố ý **không có** verb `mua lua`; đường duy nhất ra lúa là Ruộng (Dân → Lúa).

**Acceptance criteria:**
- Mỗi điểm có một phán quyết dứt khoát, ghi vào wiki luật ở đúng trang domain của nó.
- `game/rulebook.ts` và test khớp phán quyết; điểm nào engine đang làm khác thì có test đổi theo.
- Điểm 3 nếu chốt "có mua lúa" thì phải kèm tỉ giá cụ thể, không để engine tự đoán.

**Bằng chứng:** memory `reference_rules_discrepancies.md` mục 2, 3, 4.

---

### PT-01 · Chạy 6 Turn đầu và ghi nhật ký ma sát `M` `chưa làm`

**Story:** Là GM, tôi muốn chạy thử sáu Turn bằng đúng công cụ hiện có, để biết cái gì thật sự cản
đường thay vì đoán.

**Tại sao trước mọi feature:** Toàn bộ P1 và P2 dưới đây là **giả thuyết của PO** dựa trên đọc code,
không dựa trên một lượt thật nào. Sáu Turn thật sẽ xếp lại thứ tự chính xác hơn bất kỳ phân tích nào.
Không build thêm gì trước khi có log này.

**Acceptance criteria:**
- Chạy Turn 1-6 (12 lượt Go/Atc) với `DEFAULT_SETUP` 24 vai, không sửa `data/game-save.json` tay.
- Mỗi lượt commit một lần, chiến báo xuất bản được vào `docs/tran-bao/`.
- `product/playtest-01-log.md` điền đủ mỗi lượt: phút bỏ ra, lỗi engine gặp phải, lần muốn hoàn
  lượt, ý đồ mà DSL không diễn đạt được, và điểm 1-5 cho "Turn này có quyết định đáng cân nhắc không".
- Kết thúc: một đoạn kết luận ba dòng - cái gì cản nhất, cái gì tưởng cản mà không cản, có chạy
  tiếp 14 Turn còn lại được không.

**Ghi chú:** Gặp lỗi engine chặn lượt thì **dừng**, ghi lại, không vá tạm để chạy tiếp - lượt sau lỗi
sẽ mang dữ liệu bẩn.

---

## P1 - gần như chắc chắn cần, đã có bằng chứng từ code

Thứ tự trong nhóm này có thể đảo sau khi đọc log PT-01.

### GM-01 · Hoàn lượt ngay trong console `M` `chưa làm`

**Story:** Là GM đang playtest, tôi muốn huỷ lượt vừa giải quyết bằng một nút, để thử nước đi khác
mà không phải rời console mở terminal.

**Tại sao:** Cách hoàn lượt duy nhất hiện nay là `git revert` trong terminal. Với người chơi thật
thì hiếm dùng; với **solo playtest thì đây là thao tác thường xuyên nhất** - Minh sẽ liên tục muốn
biết "nếu nước Ngụy đánh hướng kia thì sao". Đây là item P1 chỉ vì ván đầu là solo.

**Acceptance criteria:**
- Có nút hoàn lượt trong console; bấm xong trạng thái quay đúng về trước khi giải quyết.
- Khối lệnh vừa dán được trả lại ô soạn thảo để sửa rồi chạy lại, không phải gõ lại từ đầu.
- Hoàn lượt xong reload trang vẫn đúng trạng thái đã hoàn (không phải chỉ đúng trong bộ nhớ tab).
- Hoàn được ít nhất lượt gần nhất; hoàn sâu nhiều lượt là tuỳ chọn, không bắt buộc.

**Bằng chứng:** `app/gm/page.tsx:104-114` - `handleResolve` ghi đè state và xoá ô lệnh, không giữ
lại bản trước.

---

### GM-02 · Lưu lệnh thô của từng lượt vào ván `S` `chưa làm`

**Story:** Là GM, khi engine cho ra kết quả tôi không hiểu ở lượt 12, tôi muốn xem lại đúng khối
lệnh đã chạy ở lượt đó.

**Tại sao:** Hiện lệnh biến mất ngay sau khi giải quyết. Khi playtest phát hiện kết quả lạ, không
có cách nào dựng lại đầu vào - phải đoán. Đây là điều kiện để mọi bug tìm được trong playtest có
thể chuyển thành test case.

**Acceptance criteria:**
- File lưu ván chứa khối lệnh thô kèm số Turn/lượt tương ứng.
- Console xem lại được lệnh của ít nhất 3 lượt gần nhất mà không cần mở file.
- Lệnh sai cú pháp cũng được lưu nguyên văn (không lọc bỏ), vì chính chúng cho biết DSL thiếu gì.

---

### DOC-01 · Sửa bảng chiến đấu bị đảo trong wiki công khai `S` `chưa làm`

**Story:** Là người chơi đọc wiki, tôi cần bảng kết quả chiến đấu khớp với cách engine thật sự xử.

**Tại sao:** Wiki đang live tại ferez96.com và **dạy sai**. Source (`reference/Tam Quoc Chi - full
text.txt` dòng 96) nói "Địch cao hơn" nghĩa là chỉ số **bên thủ** cao hơn, tức bên công thua.
`docs/wiki/04-quan-su-co-ban.md` chép thành "Công ta > Thủ địch", đảo ngược cả hai kết cục, và lỗi
này lan sang cả `Luật Tối Giản §8`. `game/combat.ts` làm đúng theo source.

Với ván solo thì tác hại nhỏ, nhưng đây là defect sản phẩm đã xác định, sửa rẻ, và chỉ tác giả
mới quyết được.

**Acceptance criteria:**
- Minh xác nhận source thắng wiki ở điểm này (nếu ngược lại thì phải sửa `game/combat.ts` và test,
  không phải sửa wiki).
- `docs/wiki/04-quan-su-co-ban.md` và `Tam Quoc Tranh Hung - Luat Toi Gian.md` §8 khớp source và
  khớp `game/combat.ts`.
- Rà xem lỗi đảo này còn lan sang trang nào khác không (glossary, sơ đồ luật).

**Bằng chứng:** memory `reference_rules_discrepancies.md` mục 1.

---

## P2 - chờ số liệu PT-01 mới quyết

Không ai bắt đầu mấy item này trước khi log PT-01 có kết luận. Chúng ở đây để không bị quên,
không phải để làm ngay.

### GM-03 · Giảm ma sát nhập lệnh cho 24 vai `L` `chờ dữ liệu`

**Kích hoạt khi:** PT-01 cho thấy trung bình trên 5 phút mỗi lượt.

**Story:** Là GM đóng cả ba nước, tôi muốn ra lệnh cho 24 vai mà không phải gõ lại từ đầu mỗi lượt.

**Chưa chốt hình thức.** Vài hướng để cân nhắc *sau* khi có số liệu, không phải bây giờ: giữ lại
lệnh lượt trước làm điểm xuất phát; gợi ý tên người chơi khi gõ; điền sẵn các vai không có gì để
làm. Chọn hướng nào là câu hỏi mở, và log PT-01 phải chỉ ra thời gian thật sự đi đâu - gõ tên,
nghĩ nước đi, hay sửa lệnh sai.

---

### GM-04 · Nhìn cả ba nước cùng lúc `M` `chờ dữ liệu`

**Kích hoạt khi:** PT-01 ghi nhận việc bấm qua lại giữa ba nước ở tab Bảng nước là ma sát thật.

**Story:** Là người chơi thay cả ba nước, tôi cần thấy tài nguyên và quân số của cả ba cùng một
màn hình để ra quyết định.

**Ghi chú:** Với người chơi thật, tab-từng-nước là **đúng** (bảng riêng, PM riêng, không lộ thông
tin). Item này chỉ phục vụ chế độ solo, nên nó không được phá cách hiển thị hiện tại.

---

### PT-02 · Chạy nốt 14 Turn còn lại `L` `chờ PT-01`

**Story:** Là chủ sản phẩm, tôi muốn một ván trọn vẹn có người thắng, để biết luật §1-9 có tự đứng
được không.

**Acceptance criteria:** đủ bốn điều kiện thành công trong `product-brief.md`.

---

### RULE-02 · Đánh giá cân bằng kinh tế và chiến đấu `M` `chờ PT-02`

**Story:** Là tác giả luật, tôi muốn biết ván §1-9 có bế tắc hay một chiều không, trước khi cài
thêm bất kỳ luật nâng cao nào.

**Câu hỏi cần trả lời bằng số liệu ván thật:**
- Kinh tế có bế tắc không - có Turn nào cả ba nước đều không còn nước đi kinh tế đáng làm?
- Chiến đấu có quyết định không - hay hai bên cứ va vào nhau rồi cùng hao mà không đổi được đất?
- Điểm lãnh thổ Xuân/Thu có làm nửa sau của ván trở nên vô vọng cho nước đang thua không?

**Đây là cửa vào cho mọi luật nâng cao.** Phù, Trận Pháp, Chiến Tướng chỉ nên bàn sau khi item này
có kết luận - nếu nền §1-9 lệch thì luật nâng cao xây lên chỉ khuếch đại chỗ lệch.

---

## Đã cân nhắc và loại (đừng đề xuất lại trong chu kỳ này)

| Đề xuất | Lý do loại |
|---|---|
| Audit trail chống tranh cãi giữa người chơi | Ván đầu là solo, không có tranh cãi. Khác `GM-02`: cái đó phục vụ debug, không phục vụ trọng tài. |
| Đồng hồ đếm ngược Go 9h-20h / Atc 20h-9h | Solo thì Minh chạy lượt khi nào muốn. Chỉ có nghĩa khi có 24 người chờ nhau. |
| Danh sách "ai chưa nộp lệnh" | Cùng lý do. |
| Tự động gửi bảng nước cho Chủ Công | Không có Chủ Công nào khác ngoài Minh. |
| Hosting / đăng nhập / database | Đổi hẳn kiến trúc. Sản phẩm cố ý chạy local, save là file git-tracked để mỗi lượt là một commit. |
| Cài tiếp Phù / Trận Pháp / Chiến Tướng | Chặn bởi `RULE-02`. Xây thêm trên nền chưa kiểm chứng là rủi ro lớn nhất của project. |
| Rút roster xuống dưới 24 vai cho gọn | Đổi kinh tế và cân bằng, làm số liệu playtest không chuyển sang ván thật được. Chỉ dùng làm phương án dự phòng, có ghi chú. |
