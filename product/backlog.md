# Backlog - đường tới ván playtest đầu tiên

Cập nhật: 2026-08-22 (vòng 2) · Mục tiêu chi phối: xem `product-brief.md` · Phán quyết luật: xem
`rule-decisions.md`

Thứ tự trong file **là** thứ tự ưu tiên. Item trên xong mới xuống item dưới, trừ khi có lý do ghi
rõ. Mỗi item mô tả **hành vi mong muốn**, không mô tả cách cài - cách cài là việc của vòng ship.

Ký hiệu độ lớn: `S` dưới nửa buổi · `M` một buổi · `L` nhiều buổi. PO ước lượng thô, dev chỉnh lại.

> **Đổi ưu tiên ở vòng này:** `RULE-01` đã đóng (Minh phán quyết 2026-08-22, cả năm điểm engine đều
> đúng trừ một). Nhưng khi đối chiếu phán quyết với source, phát hiện engine **thiếu hẳn** cơ chế
> chết đói do cắt lương ở cuối lượt. Cắt lương là chiến thuật trung tâm của luật gốc, nên `ENG-01`
> chen lên trước `PT-01`: chạy playtest với cơ chế này còn thiếu sẽ cho số liệu cân bằng sai.

---

## P0 - làm trước khi chạy playtest

### ENG-01 · Quân mất nối lương phải chết ở cuối lượt `M` `chưa làm`

**Story:** Là người chơi vây cắt đường lương của địch, tôi cần việc cắt lương thật sự giết được quân
địch trong lượt đó, chứ không chỉ làm chúng yếu đi.

**Vấn đề:** Luật gốc có **hai** cơ chế đói riêng biệt. Engine mới cài một.

| Cơ chế | Source | Engine |
|---|---|---|
| Đầu Go: lính phải ăn, không đủ lúa thì lính không được ăn chết ngay | dòng 36: "đầu Go buộc lính phải ăn lúa, không ăn sẽ lập tức chết ngay" | Có - `applyGrainUpkeep`, `resolve.ts:563` |
| Cuối Go **và** cuối Atc: kiểm nối lương, mất kết nối là chết sạch và mất đất | dòng 195: "(Lúc cuối Go/Atc) có đường nối lương thì sống, nếu không nối sẽ chết đói bại trận"; dòng 190: "miễn cứ mất kết nối với Thành Trì Nước mình mặc định lính bại chết đói hết và đất cũng sẽ bị xóa màu"; dòng 36: "dù ăn đầu Go1, cuối Go/Atc 1 bị cắt lương thì xét tiếp luật chết đói vì bị cắt lương" | **Không có** |

Thay vào đó engine gắn debuff `STARVING` -0.5 hệ số đánh (`resolve.ts:583-588`, `combat.ts:66`) cho
tướng không nối được vựa. Đây là cơ chế engine tự đặt ra, không có trong source, và `PQ-04` vừa
phủ nhận chính khái niệm "đang đói mà còn sống".

Hệ quả hiện tại: quân bị cắt lương ở cuối Go vẫn sống hết lượt Atc, vẫn đánh nhau (chỉ yếu đi), và
chỉ chết vào đầu Go hôm sau. Vây cắt chậm một tới hai lượt và mất tính chí mạng.

**Bằng chứng bổ sung:** `game/rulebook.ts:292 starvationTiming` đã chép đúng luật này vào code
("Cuối GO (bộ, kỵ xử)" / "Cuối ATC (cung xử...)") nhưng **không dòng code nào đọc hằng số đó**.

**Acceptance criteria:**
- Cuối mỗi lượt (cả Go lẫn Atc), tướng không nối được vựa nào mất toàn bộ quân ngay lượt đó, không
  đợi sang đầu Go kế.
- Ô đất bị mất kết nối bị xóa màu theo luật đã có ở `PQ-01`/§5 (ô nối kho quốc gia mà kho cạn thì
  giữ màu; ô chỉ nối vựa Châu mà vựa cạn thì thành ô trắng).
- Tướng mất sạch quân do đói xử như bại trận về Trì; tàn binh không về theo (source dòng 20: "Tàn
  Binh Bại do Chết Đói/Bệnh thì coi như chết luôn không về").
- Debuff `STARVING` được xử lý dứt điểm: hoặc bỏ, hoặc chứng minh được nó còn đối tượng áp dụng sau
  thay đổi này. Không để lại một cơ chế không ai kích hoạt.
- Chiến báo nói rõ ai chết vì cắt lương ở lượt nào - đây là thông tin người chơi cần để biết đòn của
  mình có ăn không.
- Có test cho: cắt lương ở cuối Go, cắt lương ở cuối Atc, và ô mất màu.

**Câu hỏi phải hỏi Minh trước khi làm:** `starvationTiming` phân biệt "Bộ/Kỵ xử cuối Go" với "Cung
xử cuối Atc". Đây là hai thời điểm kiểm khác nhau tùy loại quân gây ra việc cắt, hay chỉ là mô tả
ai thường gây ra việc cắt ở lượt nào? Nếu là cái đầu thì AC ở trên phải viết lại.

---

### ENG-02 · Kiểm kê luật đã chép vào code nhưng chưa ai dùng `S` `chưa làm`

**Story:** Là chủ sản phẩm, tôi cần biết engine thật sự phủ tới đâu, chứ không phải phủ tới đâu trên
giấy.

**Tại sao:** `ENG-01` được phát hiện nhờ đúng một dấu hiệu: một hằng số luật trong `rulebook.ts` mà
không dòng code nào đọc. `rulebook.ts` tự mô tả là "mọi con số của luật, nguồn sự thật duy nhất", nên
mỗi hằng số không có consumer là một luật **tưởng đã cài mà chưa**. Kiểm kê một lượt rẻ hơn nhiều so
với phát hiện từng cái giữa playtest.

Đã thấy ít nhất hai chỗ ngoài `ENG-01`: `SUPPLY.cityGrainBuffer` (vựa Châu cạn thì "Châu + toàn bộ
vùng xung quanh bại đói thành vô chủ" - engine chỉ xóa màu ô của chính tướng bị đói) và
`SUPPLY.woodenOxUnlocks`.

**Acceptance criteria:**
- Một danh sách mọi hằng số trong `rulebook.ts` không có consumer trong `game/`.
- Mỗi mục phân loại: (a) cố ý ngoài scope §1-9, (b) luật trong scope nhưng chưa cài, (c) chết hẳn,
  xóa đi.
- Nhóm (b) thành item backlog mới, PO xếp lại ưu tiên trước khi chạy `PT-01`.
- Kết quả ghi vào `product/`, không chỉ báo miệng.

---

### PT-01 · Chạy 6 Turn đầu và ghi nhật ký ma sát `M` `chờ ENG-01, ENG-02`

**Story:** Là GM, tôi muốn chạy thử sáu Turn bằng đúng công cụ hiện có, để biết cái gì thật sự cản
đường thay vì đoán.

**Tại sao trước mọi feature:** Toàn bộ P1 và P2 dưới đây là **giả thuyết của PO** dựa trên đọc code,
không dựa trên một lượt thật nào. Sáu Turn thật sẽ xếp lại thứ tự chính xác hơn bất kỳ phân tích nào.
Không build thêm gì trước khi có log này.

**Vì sao lại phải chờ:** ban đầu item này đứng đầu backlog. `ENG-01` chen lên trước vì cắt lương
không giết được thì cả một nhánh chiến thuật biến mất khỏi ván, và số liệu "ván có đáng chơi không"
sẽ đo một trò chơi khác với trò chơi thật. `ENG-02` rẻ và có thể lộ thêm lỗ tương tự, làm một lượt
luôn thay vì phát hiện giữa chừng.

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

Minh phán quyết cả ba, cộng hai điểm làm rõ phát sinh. Kết quả: engine đúng ở cả năm chỗ. Chi tiết
và bằng chứng đối chiếu ở `rule-decisions.md` (`PQ-01` tới `PQ-05`).

Giá trị ngoài dự kiến: chính việc đối chiếu phán quyết với source đã lộ ra `ENG-01` - một cơ chế
trung tâm của luật mà engine chưa cài.

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
