# Địa Lý & Bản Đồ

Chỉ cần biết [Khung Sườn & Tổng Quan](00-tong-quan.md). Domain này định nghĩa toàn bộ các loại ô trên bản đồ — mọi domain khác (Kinh Tế, Quân Sự, Chính Trị...) đều tham chiếu ngược lại đây.

## Luật Chung Toàn Bản Đồ

*Cơ bản*
- Chỉ 3 loại ô có thể thuộc về 1 quốc gia (được "tô màu" sở hữu): Ô Trắng, Châu Thành, Thành Trì. Rừng, Núi, Sông không bao giờ thuộc về quốc gia nào.
- Địa hình bản đồ bất biến trong suốt ván game: không hủy/di dời Châu/Trì, không lấp sông, không đào núi, không chặt/trồng rừng; rừng bị cháy cũng không biến mất vĩnh viễn.
- GM công khai vị trí chính xác của mỗi Tướng lên bản đồ chung cho toàn game thấy (không công khai số lính/thuyền/cơ giới đi kèm), trừ khi Tướng đó đang ở trong Ô Rừng (ẩn khỏi bản đồ) hoặc đang dùng kỹ năng Ẩn Thân (xem [Quân Sự Nâng Cao](06-quan-su-nang-cao.md)).
- Tướng chỉ được rút về "không gian ảo" (rời khỏi bản đồ) khi bị thương/bại trận; Tướng khỏe mạnh đứng trên thành vẫn luôn hiện trên bản đồ.

<details>
<summary>Cơ chế phụ</summary>

- Di chuyển mà bị Hỏa/Thủy Phù chặn đường dễ khiến Tướng kẹt sang Turn sau và vi phạm luật "tối đa 1 Turn" ở Núi/Rừng — xem cảnh báo cụ thể ở mục Núi/Rừng bên dưới và [Huyền Bí & Đặc Dị](07-huyen-bi.md) (Phù Chú).

</details>

## Sa Trường

**Định nghĩa:** Sa Trường = mọi ô **không phải** Ô Thành Trì. Tức Châu Thành, Ô Trắng, Rừng, Núi, Sông đều tính là Sa Trường — đứng trên Châu Thành (có tường, có quân đồn trú) vẫn bị xem là "ở ngoài Sa Trường".

`[GHI CHÚ]` Khái niệm này được dùng bởi nhiều domain khác (điều kiện Phản Bội, thời điểm dưỡng thương của Tướng Quân/Chủ Công, điều kiện mời Hoa Đà) nên được định nghĩa ngay tại đây thay vì lặp lại. Bản thân tên gọi "Sa Trường" (nghĩa đen: bãi chiến trường) dễ khiến người đọc ngỡ chỉ tính đất trống giao tranh, không tính lúc đứng trên thành/châu — nhưng luật gốc quy định ngược lại, xem thêm [Rà Soát Thuật Ngữ](terminology-audit.md) mục 6.

## Ô Trắng (đất trống)

*Cơ bản*
- Có thể chiếm: kéo quân vào là chiếm được ngay.
- Mỗi Turn 1 Ô Trắng đưa lại 1 điểm Tài Nguyên cho quốc gia sở hữu.
- Được phép gửi quân/cơ giới ở lại trấn giữ (không hiện lên bản đồ) từ Turn kế tiếp sau khi chiếm — chi tiết gửi/rút quân xem [Quân Sự Cơ Bản](04-quan-su-co-ban.md).

<details>
<summary>Cơ chế phụ</summary>

- Turn 1 chiếm được thì dù Turn 2 Tướng rời đi, ô vẫn tính là đã tô màu thuộc về nước mình.
- Nếu bị nước khác tiến quân vào mà không có Tướng/lính nào của mình trấn giữ tại đó: ô coi như thuộc về bên xâm chiếm (nếu họ chiếm thành công).

</details>

## Châu Thành

*Cơ bản*
- Cách chiếm giống Ô Trắng (kéo quân vào), nhưng khi còn vô chủ luôn có 6000 lính địa phương trấn thủ — muốn chiếm phải có Công ≥ 6000 (đánh bại chứ không thu phục được lính địa phương). Khi đã có chủ, phòng thủ chuyển thành 6000 Thủ Đá (giá trị cố định) + lính đồn trú của nước chủ + bonus Núi nếu có (công thức phòng thủ đầy đủ xem [Quân Sự Cơ Bản](04-quan-su-co-ban.md)).
- Mỗi Turn đưa lại 3 điểm Tài Nguyên cho quốc gia sở hữu (khác với Lúa — xem [Kinh Tế & Hậu Cần](03-kinh-te.md)).
- Là 1 vựa lúa: có thể vận chuyển lúa từ Thành Trì tới dự trữ ở đây (tối thiểu 1000 lúa/lần, tối đa vô hạn), và các Châu Thành nối nhau trong cùng quốc gia chuyển lúa qua lại được. Châu Thành chỉ chứa lúa — không tự sinh ra lúa như Thành Trì.
- Không thể chứa Tướng/Lính/Văn bại trận về dưỡng thương.

<details>
<summary>Cơ chế phụ</summary>

- Châu sập thì vô chủ ngay lập tức; nếu Turn kế tiếp không ai chiếm, đến Turn sau nữa sẽ hồi lại 6000 lính trấn thủ mặc định.
- Khi 1 quốc gia chiếm được Châu Thành: kho lúa có sẵn ở đó (nếu có) thuộc về quốc gia mới, chỉ quốc gia đó biết số lượng chính xác. Nếu Châu đang vô chủ, lúa dự trữ vẫn còn nguyên trong kho chờ ai chiếm.

</details>

## Thành Trì

*Cơ bản*
- Là lãnh thổ gốc của mỗi quốc gia ngay từ đầu game — không "chiếm" theo kiểu kéo quân vào như Ô Trắng, mà phải bị đánh sập trực tiếp hoặc bắn sập.
- Mỗi quốc gia có 9 Ô Thành Trì. Mỗi ô có 8000 lính trấn thủ đá thành (cộng thêm lính đồn trú tại đó, công thức đầy đủ xem [Quân Sự Cơ Bản](04-quan-su-co-ban.md)).
- Bị phá sập thì lập tức biến thành Ô Trắng (áp dụng toàn bộ luật Ô Trắng từ đó), và không thể xây lại.
- Quốc gia bị phá sập hết cả 9 Thành Trì thì sụp đổ hoàn toàn (xem điều kiện thắng-thua ở [Khung Sườn & Tổng Quan](00-tong-quan.md)).
- Mọi Ô Thành Trì đều được xem là vựa lúa và đều mua được lúa tại đó. Tướng/Văn/Lính/trang bị mới đều xuất phát ra bản đồ từ không gian ảo gắn với các Ô Thành Trì — có thể xuất phát từ bất kỳ Ô Trì nào, kể cả khi Trì đó đang bị cô lập khỏi phần còn lại của quốc gia.

<details>
<summary>Cơ chế phụ</summary>

- Nếu các Thành Trì của 1 quốc gia bị cô lập thành 2 cụm riêng biệt trong 1 Turn: kho lúa dự trữ quốc gia chia đôi cho 2 cụm, từ đó mỗi cụm mua lúa độc lập.
- Các kiến trúc/nơi trú ngụ nội bộ quốc gia (không gian ảo, không hiện trên bản đồ) không thể bị xâm phạm trực tiếp, và tự động biến mất khi quốc gia đó sụp đổ.
- Nếu 2 quốc gia cùng phá Thành Trì của quốc gia thứ 3: quốc gia nào phá được nhiều Trì hơn thì được xem là xâm chiếm thành công, nhận đất của quốc gia sụp đổ.
- Quốc gia có nguy cơ sụp đổ đầu tiên (trong 3 quốc gia) không được đầu hàng — phải chơi tiếp cho đến khi sụp đổ hoàn toàn.
- Toàn bộ đất mà quốc gia thua đang sở hữu ngay lúc sụp đổ sẽ sáp nhập vào quốc gia thắng (phá nhiều Trì hơn). Chỉ đất được sáp nhập — mọi thứ khác, kể cả người chơi của quốc gia cũ, biến mất khỏi game.

</details>

## Rừng

*Cơ bản*
- Không thể chiếm.
- Quân trong rừng ẩn khỏi bản đồ, kể cả không bị Trinh Sát nhìn thấy (xem [Quân Sự Nâng Cao](06-quan-su-nang-cao.md)).
- Chỉ được ở tối đa 1 Turn: vào rừng ở lượt Go 1 mà đến hết lượt Go 2 vẫn còn đó thì toàn bộ tướng + lính chết bệnh hết (vào ở lượt Atc 1 thì mốc chết là hết lượt Go 3). Tướng bỏ lại lính (dù chỉ 1 lính) ở rừng khi rời đi thì số lính bị bỏ lại đó cũng chết bệnh theo đúng mốc trên.
- Có địch cùng ô thì bắt buộc phải giao chiến.

<details>
<summary>Cơ chế phụ</summary>

- 2 ô rừng khác nhau được tính riêng biệt: di chuyển từ Rừng 1 sang Rừng 2 không bị coi là "ở yên 1 rừng 2 Turn", nên không bị chết bệnh.
- Nếu rừng bị lửa thiêu: toàn bộ quân đang ẩn trong đó hiện lên bản đồ và chết hết (riêng quân đứng đúng tại Ô Rừng là tâm lửa thì cháy theo luật Hỏa Phù bình thường, không tự động chết như trên).
- Không nối lương xuyên rừng trừ khi có Mộc Ngưu Lưu Mã thông lương (xem [Quân Sự Nâng Cao](06-quan-su-nang-cao.md), [Quân Sự Cơ Bản](04-quan-su-co-ban.md)).

</details>

## Núi

*Cơ bản*
- Không thể chiếm.
- Đứng cạnh núi (ở 1 trong 4 ô liền kề) được +10% Thủ (cạnh 2 mặt núi cùng lúc thì +20%).
- Cung Thủ đứng trên núi bắn tên xuống được +50% Công.
- Quân thường chỉ được ở trên núi tối đa 1 Turn giống Rừng. Ngoại lệ: nếu trong đội hình có Cung chủ động bắn ngay Turn đầu tiên, toàn bộ quân đi cùng vị Tướng chỉ huy Cung đó được ở lại thêm 1 Turn (kể cả tiếp tục bắn), nhưng chậm nhất đến hết lượt Go của Turn thứ 3 phải rời núi.
- Có địch cùng ô thì bắt buộc phải giao chiến.

<details>
<summary>Cơ chế phụ</summary>

- "Được ở lại thêm" chỉ áp dụng cho lính do đúng vị Tướng chỉ huy Cung đó, không áp dụng cho lính của Tướng khác dù đứng chung núi.
- Không nối lương xuyên núi trừ khi có Mộc Ngưu Lưu Mã thông lương (xem [Quân Sự Nâng Cao](06-quan-su-nang-cao.md), [Quân Sự Cơ Bản](04-quan-su-co-ban.md)).

</details>

## Sông

*Cơ bản*
- Không thể chiếm. Được ở trên sông nhiều Turn liên tục, không bị giới hạn 1 Turn như Núi/Rừng.
- Cần có ít nhất 1 loại thuyền của mình mới đi vào sông được (hoặc ô sông đó đã có sẵn thuyền nước mình, hoặc được thuyền khác chở/tốc xuống hộ — xem chi tiết thuyền ở [Quân Sự Nâng Cao](06-quan-su-nang-cao.md)).
- Có địch cùng ô thì bắt buộc phải giao chiến.

<details>
<summary>Cơ chế phụ</summary>

- Từ bờ có thể tốc phù xuống sông nếu có thuyền mình ở đó, hoặc được tốc ngược từ sông lên bờ; nhưng không bao giờ tốc xuyên qua sông được, kể cả Kỵ đã có Móng Ngựa.
- Nếu sông bị Hỏa Phù: toàn bộ quân trên sông cháy đứng yên tại chỗ (áp dụng các hiệu ứng khác của Hỏa Phù bình thường) và bị giảm thêm 50% sức mạnh cuối cùng còn lại ngay trong Turn cháy đó.
- Không nối lương xuyên sông trừ khi có thuyền/thông lương hợp lệ (xem [Quân Sự Cơ Bản](04-quan-su-co-ban.md), [Quân Sự Nâng Cao](06-quan-su-nang-cao.md)).

</details>

---

*Tiếp theo: [Chính Trị Nội Bộ](02-chinh-tri.md) →*
