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

### PT-01 · Chạy 6 Turn đầu và ghi nhật ký ma sát `M` `sẵn sàng`

**Story:** Là GM, tôi muốn chạy thử sáu Turn bằng đúng công cụ hiện có, để biết cái gì thật sự cản
đường thay vì đoán.

**Tại sao trước mọi feature:** Toàn bộ P1 và P2 dưới đây là **giả thuyết của PO** dựa trên đọc code,
không dựa trên một lượt thật nào. Sáu Turn thật sẽ xếp lại thứ tự chính xác hơn bất kỳ phân tích nào.
Không build thêm gì trước khi có log này.

**Không còn gì chặn.** Bảy phán quyết luật đã đóng, `ENG-03` đã ship, engine khớp cả bảy.

**Ván này là ván dùng một lần - chấp nhận vứt.** `ENG-03` vừa bump `SAVE_VERSION` 3 → 4, và
`GM-01`/`GM-02` sắp tới cũng đổi shape file lưu (giữ state trước lượt, giữ lệnh thô). Mỗi lần bump
là save cũ không nạp được nữa, tức ván đang chạy chết. `PT-01` chỉ đo ma sát vận hành nên mất ván
không sao; `PT-02` - ván trọn vẹn có người thắng - thì phải đợi shape ổn định.

**Đã biết trước, đừng ghi làm lỗi mới:** nếu trong 6 Turn có nước chiếm được Châu Thành, vựa lúa của
Châu sẽ không hoạt động (`ENG-04`). Ghi vào log là "đã biết", không dừng playtest vì nó.

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

### ENG-04 · Châu Thành phải dùng được làm vựa lúa tiền phương `L` `chưa làm`

**Story:** Là người chơi tiến quân sâu vào đất địch, tôi muốn chiếm một Châu Thành rồi trữ lúa ở đó
làm bàn đạp, thay vì phải giữ một hành lang nối lương liên tục về Trì.

**Vấn đề:** cơ chế này chết ở hai tầng, và tầng nào cũng đủ để giết nó một mình.

**a. Chiếm Châu không chuyển quyền sở hữu Châu.** `CityState.owner` khởi tạo `null` cho cả 6 Châu
(`game/board.ts:95-100`) và **không dòng code nào trong `game/` từng gán lại nó** - toàn bộ 5 chỗ gán
`.owner` trong engine đều là `tile.owner` (`combat.ts:379,389`, `resolve.ts:239,449`,
`economy.ts:427`). Nên `ownedChau()` (`game/supply.ts:60-73`) luôn trả rỗng, `buildSupplyNetwork` chỉ
còn nhánh kho quốc gia, và 5.000 Lúa dự trữ mỗi Châu (`setup.ts:79,185`) không bao giờ rút được -
`drawFromChau` (`economy.ts:457`) không bao giờ được gọi trong một ván thật. Từng ô của Châu vẫn đổi
màu bình thường qua giao chiến; chỉ quyền sở hữu cấp Châu là không.

**b. Không có lệnh vận lúa.** Source dòng 23: *"Có 'kết nối' vận chuyển (Đầu Go) lúa từ Trì nước mình
đem đến dự trữ lúa ở đây (Rút/gởi tối thiểu 1000, tối đa vô hạn) để đề phòng quân bị cắt lương."* DSL
hiện không có verb nào cho việc này (`game/orders/parse.ts:111-174`: `di`, `danh`, `thu`/`cong`,
`chieu`, `gui` (chỉ chuyển quân), `doi`, `nang`). Nên kể cả khi sửa (a), vựa Châu chỉ có đúng 5.000
Lúa khởi tạo, dùng hết là hết.

**Hệ quả với ván:** mọi cuộc tiến công đều bị buộc phải kéo một hành lang liền mạch về Trì. Chiếm
Châu chỉ còn giá trị điểm và tài nguyên, không còn giá trị hậu cần. Đây đúng là loại lệch mà
`RULE-02` định đo, nên nó **chặn `PT-02`**, không chặn `PT-01` (6 Turn đầu khó ai đủ quân chiếm Châu
- Châu có 6.000 Thủ Đá).

**Acceptance criteria:**
- Chiếm đủ số ô của một Châu thì Châu đó thuộc về nước chiếm, và kho lúa của Châu về theo (source
  dòng 23: "Nước X chiếm, kho Lúa về Nước X").
- Quân nối được tới Châu của nước mình rút được lúa từ vựa Châu khi kho quốc gia không với tới -
  tức nhánh `chau` của `buildSupplyNetwork` thật sự có phần tử trong một ván chơi qua `resolvePhase`.
- Có lệnh gửi và rút lúa giữa Trì và Châu, tối thiểu 1.000 mỗi lần, chỉ chạy ở đầu Go và chỉ khi có
  kết nối.
- Luật §5 "ô chỉ nối vựa Châu mà vựa cạn thì thành ô trắng" kích hoạt được trong ván thật - hiện
  nhánh `chauOnly` (`economy.ts:314,398`) chạy vì lý do khác hẳn (mất kết nối hoàn toàn), nên nhãn
  đang nói dối về nguyên nhân.
- Test đi qua `resolvePhase` thật, không set tay `state.cities[...].owner` - chính việc phải set tay
  nó trong test của `ENG-03` là cách phát hiện ra lỗi này.

**Câu hỏi cần Minh chốt trước khi làm:**
1. **Chiếm Châu tính thế nào?** Châu 2x2 = 4 ô. Chiếm bao nhiêu ô thì Châu đổi chủ - đủ cả 4, hay
   quá bán, hay chiếm ô nào thì ô đó tính?
2. **"Châu sập vô chủ Turn 1, Turn 2 không ai chiếm thì Turn 3 hồi 6000 Thủ"** (source dòng 23) -
   engine có luật hồi Thủ Đá này chưa, và nó có thuộc scope §1-9 không?
3. **Kho lúa khi Châu đổi chủ:** về tay nước chiếm nguyên vẹn, hay mất một phần?

**Nguồn phát hiện:** vòng ship `ENG-03` (`.ship-runs/20260822-143829/32-friday-fix.md`, mục "Cần
biết"). PO đã tự kiểm lại bằng grep độc lập trước khi đưa vào backlog.

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

### PT-02 · Ván trọn vẹn có người thắng `L` `chờ PT-01, ENG-04, GM-01, GM-02`

**Story:** Là chủ sản phẩm, tôi muốn một ván trọn vẹn có người thắng, để biết luật §1-9 có tự đứng
được không.

**Vì sao chờ nhiều thứ thế:** đây là ván **không được phép vứt giữa chừng**, khác `PT-01`. Nên mọi
thay đổi shape file lưu (`GM-01` giữ state trước lượt, `GM-02` giữ lệnh thô) phải xong trước - bump
`SAVE_VERSION` giữa ván là mất ván. Và `ENG-04` phải xong, không thì ván đo một trò chơi mà Châu
Thành không có giá trị hậu cần.

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

### ENG-03 · Bỏ debuff STARVING `xong 2026-08-22`

Đã ship, PO nghiệm thu đạt cả 5 AC. Bằng chứng đáng giữ lại:

- Test mới đi qua `resolvePhase` thật (dựng hành lang nối lương rồi cho địch chiếm ô giữa), và
  **phân biệt được pre/post-fix**: copy nguyên hai test đó sang bản `d7adca5` thì fail
  `expected 4000 to be 2000` - đúng chữ ký -0.5 của debuff đã xóa. Bản test đầu tiên set tay
  `.supplied = false` rồi gọi thẳng `resolveTileBattle`, pass y hệt trên cả hai bản engine, tức không
  chứng minh gì; sunday bắt được và vòng fix đã thay.
- `SAVE_VERSION` bump 3 → 4 (shape `CommanderState` đổi). Không có save nào tồn tại nên chi phí bằng 0.
- `tile.effects` rỗng giờ được ghim bằng test, không còn chỉ là kết quả grep trong một báo cáo.
- PO tự chạy lại: `npm test` 58/58, `tsc --noEmit` exit 0.

**Lỗi trong AC của chính PO, đã sửa:** AC bullet 2 viết `supplied` là "đầu vào của luật chết đói
(`PQ-06`)". Sai - `applyGrainUpkeep` (`economy.ts:343`) tự dựng lại supply network và chưa bao giờ
đọc cờ này. Sau `ENG-03`, `commander.supplied` chỉ còn hai consumer, cả hai là hiển thị
(`report.ts:205` bảng nước, `components/BoardPanel.tsx:242`). Yêu cầu giữ cờ vẫn đúng, nhưng vì lý do
khác: nó là **cảnh báo sớm duy nhất** GM nhìn thấy để biết ai sắp chết đói ở đầu Go kế.

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
