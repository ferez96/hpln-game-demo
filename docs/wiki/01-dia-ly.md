# Địa Lý & Bản Đồ

*Đọc trước: [Tổng Quan](wiki/00-tong-quan.md).*

Bản đồ gồm sáu loại ô. Định nghĩa các loại ô ở đây là nền tảng cho luật di chuyển, chiếm đất, và hậu cần.

<img src="wiki/assets/ban-do-tam-quoc.jpg" alt="Bản đồ tham khảo Tam Quốc Tranh Hùng, 13×13 ô, 3 quốc gia và 6 Châu Thành" style="max-width:520px;width:100%;border:1px solid #d8d8d8;border-radius:6px;">

*Bản đồ tham khảo từ tài liệu gốc: lưới 13×13, mỗi nước chiếm 1 góc (Ngụy, Thục, Ngô), 6 Châu Thành có tên riêng (Lương Châu, Duyện Châu, Từ Châu, Ung Châu, Dự Châu, Kinh Châu). Bản đồ tham khảo này không vẽ ô Sông — xem quy tắc Sông ở mục dưới.*

## Bảng so sánh các loại ô

| Loại ô | Chiếm? | Thuộc nước? | Sinh lợi / Turn | Phòng thủ nền | Ở được | Là vựa lúa? |
|---|---|---|---|---|---|---|
| **Thành Trì** | Không (phá sập) | Có | — (điểm +5/mùa) | 8000 Thủ đá | Có (không gian ảo) | Có (tạo lúa) |
| **Châu Thành** | Kéo quân vào | Có | 3 Tài Nguyên (+3 đ/mùa) | 6000 Thủ | Không (không dưỡng) | Có (chỉ chứa) |
| **Ô Trắng** | Kéo quân vào | Có | 1 Tài Nguyên (+1 đ/mùa) | lính trấn giữ | Có | Không |
| **Rừng** | Không | Không | — | — | tối đa 1 Turn | Không |
| **Núi** | Không | Không | buff Thủ/Cung | — | tối đa 1 Turn | Không |
| **Sông** | Không | Không | (thuyền cá) | — | nhiều Turn (cần thuyền) | Không |

> **Sa Trường = mọi ô KHÔNG phải Thành Trì.** Tức Châu Thành, Ô Trắng, Rừng, Núi, Sông đều là Sa Trường — đứng trên Châu Thành vẫn bị xem là "ngoài Sa Trường". Khái niệm này quyết định điều kiện Phản Bội, thời điểm dưỡng thương, và điều kiện mời Hoa Đà.

## Luật Chung Toàn Bản Đồ

- Chỉ **3 loại ô** tô màu sở hữu được: Ô Trắng, Châu Thành, Thành Trì. Rừng/Núi/Sông không bao giờ thuộc nước nào.
- **Địa hình bất biến:** không hủy/dời Châu/Trì, không lấp sông, đào núi, chặt/trồng rừng; rừng cháy cũng không mất vĩnh viễn.
- GM công khai **vị trí Tướng** lên bản đồ chung (không lộ số lính/thuyền/cơ giới đi kèm) — trừ khi Tướng ở Rừng hoặc đang **Ẩn Thân** (xem [Quân Sự Nâng Cao](wiki/06-quan-su-nang-cao.md)).
- Tướng chỉ về "không gian ảo" (rời bản đồ) khi bị thương/bại; Tướng khỏe đứng trên thành vẫn luôn hiện. Riêng **Chiến Tướng** có màu riêng để toàn game dễ phân biệt.

## Ô Trắng (đất trống)

- Kéo quân vào là **chiếm được ngay**; mỗi Turn cho 1 Tài Nguyên.
- Được gửi quân/cơ giới ở lại trấn giữ (không hiện bản đồ) — nhưng chỉ **từ Turn sau khi chiếm** (Turn 1 chiếm, Turn 2 mới gửi/rút).
- Là nơi xây **Doanh Trại / Thao Trường** và đặt **Bẫy** (xem [Quân Sự Nâng Cao](wiki/06-quan-su-nang-cao.md)).

<details>
<summary>Cơ chế phụ</summary>

- Turn 1 chiếm thì dù Turn 2 Tướng rời đi, ô vẫn giữ màu nước mình.
- Nếu bị nước khác tiến vào mà ô không có Tướng/lính mình trấn giữ: ô thuộc bên xâm chiếm (nếu họ chiếm thành công).

</details>

## Châu Thành

- Chiếm giống Ô Trắng, nhưng khi **vô chủ** luôn có 6000 lính địa phương trấn — phải Công ≥ 6000 để chiếm (không thu phục lính địa phương). Khi có chủ: phòng thủ = 6000 Thủ đá + lính đồn trú + bonus Núi (xem công thức ở [Quân Sự Cơ Bản](wiki/04-quan-su-co-ban.md)).
- Mỗi Turn cho **3 Tài Nguyên**.
- Là **vựa lúa** (chỉ chứa, không tạo): vận lúa từ Trì tới trữ (tối thiểu 1000/lần, tối đa vô hạn); các Châu nối nhau chuyển lúa qua lại được.
- **Không** chứa Tướng/Lính/Văn bại trận về dưỡng.

<details>
<summary>Cơ chế phụ</summary>

- Châu sập → vô chủ ngay; Turn kế không ai chiếm thì Turn sau nữa hồi lại 6000 lính trấn.
- Nước chiếm được Châu: kho lúa có sẵn (nếu có) về nước đó (chỉ nước đó biết số). Châu vô chủ: lúa dự trữ vẫn còn nguyên chờ ai chiếm.

</details>

## Thành Trì

- **Lãnh thổ gốc** của mỗi nước từ đầu game — không "chiếm" bằng kéo quân, phải **đánh sập / bắn sập** trực tiếp.
- Mỗi nước có **9 Ô Thành Trì**, mỗi ô 8000 Thủ đá (+ lính đồn trú).
- Bị phá → lập tức thành **Ô Trắng** (áp luật Ô Trắng), không xây lại được.
- Phá hết cả 9 Trì → nước **sụp đổ hoàn toàn**.
- Mọi Trì đều là vựa lúa & mua lúa được. Tướng/Văn/Lính/đồ mới đều xuất phát ra bản đồ từ **bất kỳ Ô Trì nào** (kể cả Trì đang bị cô lập).

<details>
<summary>Cơ chế phụ</summary>

- Trì bị cô lập thành 2 cụm trong 1 Turn: kho lúa quốc gia chia đôi cho 2 cụm, mỗi cụm mua lúa độc lập.
- Kiến trúc/không gian ảo nội bộ (không hiện bản đồ) không bị xâm phạm; tự biến mất khi nước sụp đổ.
- 2 nước cùng phá Trì nước thứ 3: nước phá nhiều Trì hơn xâm chiếm thành công, nhận đất.
- Nước sắp sụp đổ **đầu tiên** không được đầu hàng — phải chơi tới khi sụp hẳn.
- Đất nước thua lúc sụp đổ sáp nhập vào nước thắng (phá nhiều Trì hơn). Chỉ sáp nhập đất — mọi thứ khác (kể cả người chơi nước cũ) biến mất.

</details>

## Rừng · Núi · Sông (ô không chiếm)

### Rừng

- Quân trong rừng **ẩn khỏi bản đồ**, miễn cả Trinh Sát.
- **Tối đa 1 Turn:** vào Go1 mà hết Go2 còn ở đó → tướng + lính **chết bệnh** (vào Atc1 thì mốc là hết Go3). Tướng bỏ lại lính (dù 1 lính) thì lính đó cũng chết bệnh.
- Có địch cùng ô thì **bắt buộc giao chiến**.

<details>
<summary>Cơ chế phụ</summary>

- 2 ô rừng khác nhau xét riêng: đi Rừng 1 → Rừng 2 không tính "ở 1 rừng 2 Turn", không chết bệnh.
- Rừng cháy: quân ẩn hiện lên & chết hết (riêng quân ngay tại ô tâm lửa thì cháy theo luật Hỏa Phù, không tự chết như trên).
- Không nối lương xuyên rừng, trừ khi có **Mộc Ngưu Lưu Mã** thông lương.

</details>

### Núi

- Đứng **cạnh** núi (1 trong 4 ô kề): **+10% Thủ** (cạnh 2 mặt núi: +20%).
- **Cung** đứng **trên** núi: **+50% Công**. Máy Bắn Đá trên núi: +30% Công.
- Tối đa 1 Turn như Rừng. Ngoại lệ: nếu có Cung chủ động bắn ngay Turn đầu, toàn quân do đúng Tướng chỉ huy Cung đó được ở thêm 1 Turn (kể cả bắn tiếp), chậm nhất hết Go Turn 3 phải rời.
- Có địch cùng ô thì bắt buộc giao chiến.

<img src="wiki/assets/dia-ly-ke-can.svg" alt="Sơ đồ bonus kề Núi và quy tắc cạnh vuông vs đường chéo" style="max-width:760px;width:100%;">

*"Kề" luôn nghĩa là 1 trong 4 ô cạnh vuông (Bắc/Nam/Đông/Tây) — 2 ô nối chéo nhau không tính. Quy tắc "chỉ tính cạnh vuông" này áp dụng chung cho bonus kề Núi, Nối Lương, Di chuyển, và phạm vi bắn của Cung (xem [Quân Sự Cơ Bản](wiki/04-quan-su-co-ban.md)).*

<details>
<summary>Cơ chế phụ</summary>

- "Ở lại thêm" chỉ cho lính do đúng Tướng chỉ huy Cung đó, không cho lính Tướng khác dù chung núi.
- Không nối lương xuyên núi, trừ khi có Mộc Ngưu Lưu Mã.

</details>

### Sông

- **Ở được nhiều Turn** (khác Núi/Rừng), nhưng cần ít nhất 1 loại **thuyền** của mình mới vào được (hoặc ô sông đã có thuyền mình, hoặc được thuyền/tốc chở xuống — xem [Quân Sự Nâng Cao](wiki/06-quan-su-nang-cao.md)).
- Kỵ Mã **tắt Truy Cùng Giết Tận** trên sông.
- Có địch cùng ô thì bắt buộc giao chiến.

<details>
<summary>Cơ chế phụ</summary>

- Từ bờ tốc phù xuống sông được nếu có thuyền mình ở đó (hoặc tốc ngược lên bờ), nhưng **không tốc xuyên sông** — kể cả Kỵ đã có Móng Ngựa.
- Sông dính Hỏa Phù: quân trên sông cháy đứng yên (hiệu ứng Hỏa Phù bình thường) và bị **giảm thêm 50%** sức mạnh cuối còn lại trong Turn cháy đó.
- Không nối lương xuyên sông, trừ khi có thuyền/thông lương hợp lệ.

</details>

---

*Tiếp theo: [Chính Trị Nội Bộ](wiki/02-chinh-tri.md) →*
