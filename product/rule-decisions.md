# Sổ phán quyết luật

Nơi ghi dứt điểm những chỗ luật gốc không nói rõ và tác giả đã quyết. Backlog trôi qua từng chu kỳ,
sổ này thì ở lại. Mỗi phán quyết ghi: câu hỏi, quyết định, engine khớp hay lệch.

Nguồn luật có thẩm quyền: `reference/Tam Quoc Chi - full text.txt`. Wiki `docs/wiki/` là bản chép
lại, và đã có ít nhất một chỗ chép ngược (xem `DOC-01`).

---

## 2026-08-22 · Nối lương, chết bệnh, mua lúa

Nguồn feedback: `product/customer-feedbacks/Minh-20260822-135700.md` và hỏi đáp bổ sung cùng ngày.

### PQ-01 · Quân đứng trên Rừng/Núi có nối lương không

**Phán quyết:** Rừng/Núi không cho nối lương *xuyên qua*. Quân đứng trong Rừng/Núi bắt buộc lấy
lương từ ô "đường lương" liền kề. Không ô liền kề nào khả dụng thì coi như bị cắt lương và xử theo
luật cắt lương.

**Engine: khớp.** `game/supply.ts:112 reachDistance` không bao giờ mở rộng BFS qua Rừng/Núi/Sông,
nhưng cho đúng một bước cuối đặt chân lên Rừng/Núi từ ô kề đã nối; không ô kề nào nối được thì
`isConnected` trả false. Không phải sửa.

**Việc còn lại:** comment ở `supply.ts:97-111` đang ghi đây là chỗ "luật gốc chưa nói dứt khoát" -
giờ đã dứt khoát, nên sửa lại cho khỏi hiểu nhầm là còn treo.

### PQ-02 · Chết bệnh ở Rừng/Núi tính vào Turn nào

**Phán quyết:** giữ mốc đầu Turn N+2 như engine đang làm. Bước lên ở Turn N thì hết Turn N+1 vẫn
sống, sang đầu Turn N+2 mới chết bệnh.

**Engine: khớp.** `game/resolve.ts:127 applyIllness`. Không phải sửa.

**Ghi chú từ source:** "Ăn no rồi vẫn có thể chết bệnh" (dòng 36) - bệnh và đói là hai cơ chế độc
lập, ăn đủ lúa không cứu được quân ở Rừng/Núi quá hạn.

### PQ-03 · Có mua lúa bằng Tài Nguyên không

**Phán quyết:** không. Chỉ tiêu sức dân để tạo lúa.

**Engine: khớp.** Không có verb `mua lua`; đường duy nhất ra lúa là Ruộng (Dân → Lúa). Không phải sửa.

### PQ-04 · "Không chạy được" khi đói nghĩa là gì

**Phán quyết:** *"Đói là chết luôn. Tính từ thời điểm ăn => no => điều quân được. Đến thời điểm đói
bắt buộc phải có lương thực để ăn. Không có đủ lương thực để ăn thì quân lính nào không được ăn sẽ
chết."*

Nghĩa là **không có trạng thái đang-đói**. Tới thời điểm ăn thì hoặc ăn được (no, điều quân bình
thường), hoặc không ăn được (chết ngay). Không khoá lệnh di chuyển, vì quân còn sống đều đã no.

**Engine: khớp phần đầu Go, thiếu phần cuối Go/Atc.** Xem `ENG-01` trong backlog.

**Hệ quả cần dev xem lại:** debuff `STARVING` (-0.5 hệ số đánh, `game/combat.ts:66`) mô hình hoá một
trạng thái "yếu vì đói" mà phán quyết này nói là không tồn tại. Nếu đói là chết ngay thì mọi quân
còn sống đều no, và debuff không còn đối tượng áp dụng.

### PQ-05 · Quân bị cắt lương chết bao nhiêu

**Phán quyết:** chết đúng phần thiếu. Thiếu 500 Lúa thì chết 500 lính, số còn lại sống tiếp. Cắt
lương hoàn toàn (không nối được vựa nào) thì fed = 0 nên cả đạo quân chết - đó là hệ quả của cùng
một công thức, không phải luật riêng.

**Engine: khớp.** `game/economy.ts:415`. Không phải sửa.

---

## Còn treo, chưa hỏi

- **Bộ/Kỵ xử cuối Go, Cung xử cuối Atc** - `game/rulebook.ts:292 starvationTiming` chép từ source
  rằng thời điểm chết đói phụ thuộc loại quân gây ra việc cắt. Chưa rõ đây là hai thời điểm kiểm
  khác nhau hay chỉ mô tả ai thường gây ra việc cắt ở lượt nào. Cần hỏi khi làm `ENG-01`.
- **Vùng quanh Châu Thành khi vựa Châu cạn** - source nói "Châu + toàn bộ vùng xung quanh bại đói
  thành vô chủ" (dòng 233), engine hiện chỉ xóa màu ô của chính tướng bị đói. Chưa hỏi.
