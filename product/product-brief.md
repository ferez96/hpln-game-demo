# Product brief - Tam Quốc Tranh Hùng (công cụ GM)

Cập nhật: 2026-08-22 · Chủ sản phẩm: PO (Claude) · Người quyết cuối: Minh

## Sản phẩm này là gì

Một **công cụ điều hành** cho ván Tam Quốc Tranh Hùng, không phải một game người chơi đăng nhập.
Ván được cầm trịch bởi một GM qua ~20 ngày thực; người chơi PM lệnh, GM dán vào console, engine
soát lệnh theo luật, giải quyết lượt, sinh chiến báo để đăng lại.

Sản phẩm gồm ba mảnh:

| Mảnh | Vai trò | Trạng thái |
|---|---|---|
| Engine luật (`game/`) | Nguồn phán quyết duy nhất cho mọi lượt | §1-9 đã cài, 55 test pass |
| Console GM (`/gm`) | Nơi GM làm việc mỗi lượt | 3 tab, chạy local qua `npm run dev` |
| Wiki luật (ferez96.com) | Người chơi tra luật | Live, 10 trang domain + đồ thị luật |

## Người dùng

**Người dùng chính hiện tại: GM.** Ở giai đoạn này GM là Minh, và Minh cũng đóng luôn cả ba nước
(solo playtest). Nghĩa là người ra lệnh và người phán quyết là một - không có tranh chấp, không có
người quên nộp lệnh, không có ai chờ chiến báo.

**Người dùng tương lai: 24 người chơi + 1 GM.** Chưa có lịch, chưa có nhóm. Mọi thứ chỉ phục vụ
nhóm này (audit trail, deadline, phân phối bảng nước) **không thuộc phạm vi hiện tại**.

## Mục tiêu gần nhất

> **Chạy trọn một ván thật từ đầu đến khi có người thắng, bằng chính công cụ này, không sửa file
> save bằng tay.**

Đây là lần đầu tiên sản phẩm được dùng đúng cách nó được thiết kế. Tính tới 2026-08-22,
`data/game-save.json` và `docs/tran-bao/` đều **không tồn tại** - engine mới chỉ được kiểm chứng
bởi unit test, chưa bởi một ván nào.

### Vì sao mục tiêu là ván solo chứ không phải mở rộng luật

Engine mới phủ §1-9. Phần lớn nội dung tạo kịch tính (Phù, Trận Pháp, Chiến Tướng, phản bội) chưa
cài. Cám dỗ tự nhiên là cài tiếp. Rủi ro của việc đó: xây thêm ba tháng rồi mới phát hiện vòng làm
việc cơ bản không sống nổi qua lượt thứ năm, hoặc kinh tế §5 bế tắc từ Turn 3 khiến mọi luật nâng
cao xây trên nền đó đều vô nghĩa.

Một ván solo trọn vẹn trả lời được hai câu mà không lượng test nào trả lời thay được:
engine có đứng vững 40 lượt liên tiếp không, và ván có **đáng chơi** không.

## Định nghĩa thành công

Ván playtest được coi là thành công khi đủ cả bốn:

1. **Chạy hết** - tới Turn 20 hoặc tới khi một nước thống nhất, không lần nào phải sửa
   `data/game-save.json` bằng tay hay chạy lại engine ngoài console.
2. **Sinh được chiến báo** - mỗi lượt xuất bản được vào `docs/tran-bao/`, đọc lên hiểu chuyện gì
   đã xảy ra mà không cần mở save file.
3. **Ra kết quả hợp lệ** - có nước thắng theo `game/scoring.ts`, không phải hoà kỹ thuật do bug.
4. **Có số liệu** - nhật ký playtest ghi đủ: phút/lượt, lỗi engine, số lần muốn hoàn lượt, số ý đồ
   luật cho phép mà DSL không diễn đạt được.

Chỉ số theo dõi (đo trong `playtest-01-log.md`):

| Chỉ số | Ngưỡng chấp nhận | Ý nghĩa nếu vượt ngưỡng |
|---|---|---|
| Phút mỗi lượt | ≤ 5 | Vượt → ván 40 lượt tốn hơn 3 tiếng, ma sát nhập lệnh thành ưu tiên P1 |
| Lỗi engine chặn lượt | 0 | Có → dừng playtest, sửa trước khi chạy tiếp |
| Ý đồ không diễn đạt được bằng DSL | ≤ 2 mỗi Turn | Vượt → DSL thiếu verb, không phải thiếu luật |
| Turn có quyết định thật (tự chấm 1-5) | ≥ 3 | Dưới → vấn đề thiết kế game, không phải vấn đề công cụ |

## Không làm (đóng băng tới khi ván playtest xong)

Ghi rõ để không ai lỡ tay mở rộng:

- **Luật nâng cao**: Phù, Trận Pháp, thuyền và thủy chiến, lò rèn và cơ giới, Tinh Binh, Chiến
  Tướng, Hoa Đà/Tả Từ/Thủy Kính, Trảm Đầu/Trục Xuất/Phản Bội, Ẩn Thân/Đặt Bẫy/Trinh Sát.
- **Mọi thứ phục vụ nhiều người chơi**: hosting, đăng nhập, database, audit trail chống tranh cãi,
  đồng hồ đếm ngược Go/Atc, tự động gửi bảng nước cho Chủ Công.
- **Giao diện**: mobile, dark/light toggle, animation, tinh chỉnh bàn cờ 3D.
- **Sửa lại kiến trúc**: engine hiện tách sạch khỏi React và dùng chung cho console, trang công
  khai, script xuất bản, test. Không đụng vào cấu trúc này để phục vụ một feature đơn lẻ.

## Quyết định phạm vi ván playtest (PO chốt)

**Giữ nguyên 24 vai, 3 nước x 8 người** (`DEFAULT_SETUP` trong `game/setup.ts:296`), không rút gọn
roster.

- Được: kết quả cân bằng chuyển thẳng sang ván thật. Kinh tế, quân số, điểm lãnh thổ đều phụ thuộc
  số người mỗi nước, nên một ván 6 vai không nói được gì về ván 24 vai.
- Mất: khối lượng nhập lệnh. Cỡ 24 dòng/lượt x 40 lượt ≈ 900+ dòng lệnh, tất cả do một người nghĩ
  ra. Đây là chi phí có thật và là lý do `GM-03` nằm trong backlog.
- Giảm rủi ro: chạy **6 Turn đầu trước** rồi mới quyết chạy tiếp hay dừng sửa (xem `PT-01`). Không
  ép chạy hết 20 Turn ngay lần đầu.

Nếu sau 6 Turn thấy chi phí nhập lệnh không chịu nổi, phương án dự phòng là rút xuống 3 nước x 4
vai và **ghi rõ trong log rằng số liệu cân bằng không còn chuyển sang ván thật được**.

## Rủi ro đang mở

| Rủi ro | Ảnh hưởng | Xử lý |
|---|---|---|
| Wiki công khai dạy sai luật chiến đấu (hai dòng bảng bị đảo so với source; engine đúng, wiki sai) | Người chơi ván thật học sai mô hình, ra lệnh theo kỳ vọng sai | `DOC-01` |
| Ba điểm luật engine tự quyết chưa được tác giả xác nhận | Nếu chốt ngược lại, số liệu playtest mất giá trị | `RULE-01`, làm **trước** khi chạy |
| Chưa ai biết ván có vui không | Có thể phải đổi luật chứ không phải đổi code | Đo bằng chỉ số "Turn có quyết định thật" |
| Kinh tế §5 có thể bế tắc giữa ván | Ván chết trước Turn 20 | Phát hiện qua playtest, chưa xử lý trước |

## Điều đã biết chắc, đừng kiểm lại

- Validation là dry run của chính code giải quyết lượt (`validateOrders` clone state rồi gọi đúng
  hàm `resolvePhase` dùng). Xem trước không thể lệch với kết quả thật. **Đừng tách validation thành
  bộ luật thứ hai.**
- Console và API chỉ chạy ở dev, cả hai route từ chối khi `NODE_ENV === "production"`. Đây là chủ
  ý, không phải thiếu sót.
- Bàn cờ 13x13 chép từ `reference/3kd-map.jpg` bằng cách lấy mẫu màu ô, không phải vẽ tay. Id ô là
  chữ hàng + số cột.
