# Backlog - đường tới ván playtest đầu tiên

Cập nhật: 2026-08-22 (vòng 2) · Mục tiêu chi phối: xem `product-brief.md` · Phán quyết luật: xem
`rule-decisions.md`

Thứ tự trong file **là** thứ tự ưu tiên. Item trên xong mới xuống item dưới, trừ khi có lý do ghi
rõ. Mỗi item mô tả **hành vi mong muốn**, không mô tả cách cài - cách cài là việc của vòng ship.

Ký hiệu độ lớn: `S` dưới nửa buổi · `M` một buổi · `L` nhiều buổi. PO ước lượng thô, dev chỉnh lại.

> **Vòng 3 (2026-08-22):** `ENG-01` đã rút - Minh phán quyết rằng quân bị cắt lương luôn chết ở đầu
> Go của Turn kế, và engine làm đúng như vậy (`PQ-06`). Kết luận "engine thiếu cơ chế chết đói cuối
> lượt" ở vòng 2 là do PO đọc source sai. `PT-01` trở lại đầu backlog, không còn bị chặn.

---

## P0 - làm trước khi chạy playtest

### ENG-03 · Bỏ debuff STARVING `S` `chưa làm`

**Story:** Là tác giả luật, tôi cần engine chỉ chạy luật của tôi. Quân bị cắt lương chết theo `PQ-06`,
không yếu đi trước khi chết.

**Phán quyết:** `PQ-07` - bỏ hẳn, không có trong luật.

**Tại sao trước `PT-01`:** rẻ, và để playtest không đo một trò chơi có luật engine tự chế. Theo
`PQ-06` quân bị cắt lương vẫn đánh trọn lượt Atc trước khi chết, nên -0.5 rơi đúng vào những trận
quyết định của một đòn vây cắt.

**Acceptance criteria:**
- Tướng không nối được vựa đánh với đủ sức; kết quả trận chỉ còn phụ thuộc quân số, địa hình và thế
  trận theo §8.
- `updateSupply` vẫn cập nhật cờ `supplied` như cũ - đó là đầu vào của luật chết đói (`PQ-06`), chỉ
  bỏ phần biến nó thành hình phạt chiến đấu.
- Test nào đang dựa vào -0.5 thì sửa; thêm một test: hai tướng quân số bằng nhau, một bên mất nối
  lương, kết quả trận vẫn cân.
- Kiểm luôn hai hệ số còn lại trong `conditionModifier` (lửa -0.4, lụt -0.3): chúng là hook cho §10
  chưa cài, nên phải chứng minh `tile.effects` luôn rỗng trong scope §1-9. Nếu không rỗng thì đó là
  luật thứ hai engine tự chạy.

**Để dev quyết:** `Debuff` là union chỉ có mỗi `"STARVING"`. Bỏ giá trị duy nhất thì giữ khung
`debuffs` cho luật sau hay xóa luôn - việc kỹ thuật, PO không chốt.

---

### PT-01 · Chạy 6 Turn đầu và ghi nhật ký ma sát `M` `chờ ENG-03`

**Story:** Là GM, tôi muốn chạy thử sáu Turn bằng đúng công cụ hiện có, để biết cái gì thật sự cản
đường thay vì đoán.

**Tại sao trước mọi feature:** Toàn bộ P1 và P2 dưới đây là **giả thuyết của PO** dựa trên đọc code,
không dựa trên một lượt thật nào. Sáu Turn thật sẽ xếp lại thứ tự chính xác hơn bất kỳ phân tích nào.
Không build thêm gì trước khi có log này.

**Không còn gì chặn.** Cả sáu phán quyết luật đã đóng và engine khớp cả sáu, nên số liệu thu được từ
playtest đo đúng trò chơi thật.

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

### ENG-02 · Kiểm kê chỗ engine lệch source, cả hai chiều `S` `chưa làm`

**Story:** Là chủ sản phẩm, tôi cần biết engine thật sự chơi luật nào - không phải luật nào đã được
chép vào code, cũng không phải luật nào engine tự nghĩ ra.

**Hai chiều lệch, mỗi chiều một dấu hiệu:**

**a. Luật chép vào code mà không ai đọc.** `rulebook.ts` tự mô tả là "mọi con số của luật, nguồn sự
thật duy nhất", nên hằng số không có consumer là dấu hiệu một luật *tưởng đã cài mà chưa*. Đã thấy
`SUPPLY.cityGrainBuffer` (source dòng 233: vựa Châu cạn thì "Châu + toàn bộ vùng xung quanh bại đói
thành vô chủ" - engine chỉ xóa màu ô của chính tướng bị đói) và `SUPPLY.woodenOxUnlocks`.

**b. Luật engine tự chế, không có trong source.** Đã tìm được một cái và Minh đã bác nó
(`ENG-03`, bỏ debuff `STARVING`). Câu hỏi của item này là còn bao nhiêu cái nữa - một cái đã lọt tới
tận công thức chiến đấu thì khó tin nó là cái duy nhất.

**Acceptance criteria:**
- Danh sách hằng số trong `rulebook.ts` không có consumer trong `game/`, mỗi mục phân loại: cố ý
  ngoài scope §1-9 / trong scope nhưng chưa cài / chết hẳn nên xóa.
- Danh sách con số trong `game/` quyết định kết quả nhưng không truy được về source hay `rulebook.ts`.
- Minh phán quyết từng mục ở nhóm (b): giữ (thì đưa vào `rulebook.ts` và wiki như luật chính thức)
  hay bỏ.
- Kết quả ghi vào `product/rule-decisions.md`, không chỉ báo miệng.

---

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

### DOC-01 · Đồng bộ wiki với luật engine thật sự chạy `S` `chưa làm`

**Story:** Là người chơi đọc wiki, tôi cần trang luật khớp với cách engine thật sự xử.

Hai việc, cùng một lần mở file:

**a. Sửa bảng chiến đấu bị chép ngược.** Source (dòng 96) nói "Địch cao hơn" nghĩa là chỉ số **bên
thủ** cao hơn, tức bên công thua. `docs/wiki/04-quan-su-co-ban.md` chép thành "Công ta > Thủ địch",
đảo ngược cả hai kết cục, và lỗi lan sang `Luật Tối Giản §8`. `game/combat.ts` làm đúng theo source.
Wiki đang live tại ferez96.com và đang dạy sai.

**b. Ghi năm phán quyết ngày 2026-08-22** (`PQ-01` tới `PQ-05` trong `rule-decisions.md`) vào đúng
trang domain của chúng, để lần sau không ai phải hỏi lại.

**Acceptance criteria:**
- Minh xác nhận source thắng wiki ở điểm (a). Nếu ngược lại thì phải sửa `game/combat.ts` và test,
  không phải sửa wiki.
- `docs/wiki/04-quan-su-co-ban.md` và `Tam Quoc Tranh Hung - Luat Toi Gian.md` §8 khớp source và
  khớp `game/combat.ts`.
- Rà xem lỗi đảo này còn lan sang trang nào khác không (glossary, sơ đồ luật).
- Năm phán quyết xuất hiện trong wiki, không chỉ trong `product/`.
- Comment ở `game/supply.ts:97-111` không còn ghi `PQ-01` là chỗ luật gốc để ngỏ.

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
- Cắt lương có phải là đòn đáng dùng không, sau khi `ENG-01` xong?
- Điểm lãnh thổ Xuân/Thu có làm nửa sau của ván trở nên vô vọng cho nước đang thua không?

**Đây là cửa vào cho mọi luật nâng cao.** Phù, Trận Pháp, Chiến Tướng chỉ nên bàn sau khi item này
có kết luận - nếu nền §1-9 lệch thì luật nâng cao xây lên chỉ khuếch đại chỗ lệch.

---

## Đã đóng

### RULE-01 · Chốt ba phán quyết luật engine đang tự quyết `xong 2026-08-22`

Minh phán quyết cả ba, cộng ba điểm làm rõ phát sinh. Kết quả: **engine đúng ở cả sáu chỗ**. Chi
tiết và bằng chứng đối chiếu ở `rule-decisions.md` (`PQ-01` tới `PQ-06`).

### ENG-01 · Quân mất nối lương phải chết ở cuối lượt `rút 2026-08-22`

Không phải lỗi. PO đọc source ("bại chết đói sạch hết ngay cuối Go", dòng 173) thành một cơ chế
chết-cuối-lượt riêng, rồi kết luận engine thiếu nó. Minh phán quyết: mấy dòng đó mô tả thời điểm
quân *bị cắt*, còn thời điểm *chết* luôn là đầu Go của Turn kế, và engine làm đúng (`PQ-06`).

Item này từng chặn `PT-01` một vòng. Bài học ghi ở `product-brief.md`: đối chiếu cách đọc source với
tác giả trước khi cho nó đảo ưu tiên, đừng sau.

Phần duy nhất còn sống từ item này: debuff `STARVING` -0.5 vẫn không có nguồn trong source, chuyển
sang `ENG-02`.

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
