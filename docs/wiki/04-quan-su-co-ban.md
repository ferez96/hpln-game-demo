# Quân Sự Cơ Bản

Cần biết [Kinh Tế & Hậu Cần](03-kinh-te.md) (Tài Nguyên/Dân để tuyển quân, Lúa để nuôi quân) và [Địa Lý & Bản Đồ](01-dia-ly.md) (di chuyển/nối lương phụ thuộc loại ô).

## Bộ Binh

*Cơ bản*
- Chỉ số cấp 1 (mặc định, chưa nâng cấp): 1 Công, 1 Thủ (thủ giáp) mỗi lính.
- Tuyển quân: Cấp 1: 1 Tài Nguyên + 2000 Dân = 1000 Bộ (mặc định). Cấp 2: 1 Tài Nguyên + 3000 Dân = 2000 Bộ (nâng cấp tốn 4 Tài Nguyên). Cấp 3: 1 Tài Nguyên + 4000 Dân = 3000 Bộ (nâng cấp tốn 5 Tài Nguyên).
- Không cầm được Tên. Tấn công khi có địch cùng ô.

<details>
<summary>Cơ chế phụ</summary>

- Bộ Binh mới mua tự di chuyển (không cần Tướng dắt) trong giai đoạn đầu Go; sang giữa Go, Tướng mới chọn tiếp nhận chỉ huy số Bộ Binh mới và/hoặc Bộ Binh cũ để dắt đi tiếp; toàn bộ quân đó tự động giao chiến ở ô cuối cùng khi hết Go.

</details>

## Cung Thủ

*Cơ bản*
- Tuyển quân: quy đổi từ Bộ Binh có sẵn, không phải từ Dân trực tiếp. Cấp 1: 1 Tài Nguyên + 2000 Bộ = 1000 Cung (mặc định). Cấp 2: 1 Tài Nguyên + 3000 Bộ = 2000 Cung (nâng cấp 4 Tài Nguyên). Cấp 3: 1 Tài Nguyên + 4000 Bộ = 3000 Cung (nâng cấp 5 Tài Nguyên).
- Công thức sát thương: 1 Cung giữ 1 Tên thường = 2 Công; giữ 1 Hỏa Tiễn = 3 Công (ưu tiên dùng nếu có cả 2 loại); 1 Cung hết cả Tên lẫn Tên dư = 1 Công (như lính thường).
- Chỉ bắn được sang 1 ô kế bên (khác ô đứng); 1 Tướng chỉ huy Cung chỉ được chọn bắn vào 1 trong 4 ô xung quanh mình.
- Cần có Tướng chỉ huy ra lệnh mới được chủ động bắn; không tự ý bắn nếu không có lệnh.

<details>
<summary>Cơ chế phụ</summary>

- Nếu số Tên còn dư nhiều hơn số Cung Thủ, phần dư không cộng thêm Công; Cung tự nạp lại Tên dư sau khi bắn.
- Hỏa Tiễn chỉ có thể bị Thủy Phù dập ngay khi đang bắn ra (không phải lúc đang cầm trong người).
- Khi có địch cùng ô (cận chiến), Cung Thủ chỉ còn 1 Công/1 Thủ như lính thường bất kể đang cầm loại Tên nào.
- Bắn vào ô thuộc nước mình không gây thiệt hại cho quân mình.
- Tướng đứng trong thành muốn bắn Cung ra ngoài phải nói rõ với GM đang đứng ở Ô Thành nào để GM ghi lên bản đồ.
- Quyết định bắn hay không được chốt vào cuối lượt Atc.
- Tối đa 1 lần bắn huy động được 10.000 Cung Thủ (trùng giới hạn Biên Chế bên dưới).

</details>

## Kỵ Mã

*Cơ bản*
- Chỉ số như Bộ Binh (chưa nâng cấp): 1 Công, 1 Thủ. Không cầm được Tên.
- Tuyển quân: quy đổi từ Bộ Binh, cùng công thức chi phí như Cung Thủ (Cấp 1: 1 Tài Nguyên + 2000 Bộ = 1000 Kỵ; Cấp 2: 1 Tài Nguyên + 3000 Bộ = 2000 Kỵ, nâng cấp 4 Tài Nguyên; Cấp 3: 1 Tài Nguyên + 4000 Bộ = 3000 Kỵ, nâng cấp 5 Tài Nguyên).
- Có sẵn kỹ năng nội tại **Truy Cùng Giết Tận**: khi giao chiến thắng (kể cả khi đang ở thế thủ), Kỵ Mã tiêu diệt thêm tàn binh bên thua theo công thức ở mục Binh Pháp bên dưới. Cần tối thiểu 1000 Kỵ Mã trong đội hình để kích hoạt; kỹ năng này không cần Tướng chỉ huy riêng.
- Chỉ Kỵ Mã mới kết hợp được với Tốc Phù.

<details>
<summary>Cơ chế phụ</summary>

- Trên sông, Kỵ Mã tự động tắt Truy Cùng Giết Tận.

</details>

> **Xem trước — Phù Chú:** Tốc Phù là 1 trong 5 loại Phù mà Tướng Quân có thể mua (3 Tài Nguyên/cái) và dùng để cho Kỵ Mã đi thêm ô. Đây chỉ là điểm chạm đầu tiên — luật đầy đủ và tương tác với từng hệ thống khác nằm ở [Huyền Bí & Đặc Dị](07-huyen-bi.md), vì Phù tương tác sâu với gần như mọi hệ quân sự (xem giải thích ở [Lộ Trình Học](lo-trinh-hoc.md)).

## Biên Chế Chỉ Huy

*Cơ bản*
- Tướng chỉ huy ít nhất 1000 lính mới được di chuyển.
- Khi di chuyển, 1 Tướng chỉ huy tối đa 10.000 lính (Biên Chế mặc định) — bao gồm cả quân đang ở trên Xe Đục Thành. Cung Thủ chủ động bắn cũng giới hạn tối đa 10.000 Cung trong 1 lần.
- Khi đứng yên tại 1 ô, Tướng được chỉ huy không giới hạn số lính đang có ở ô đó (có thể chọn chỉ huy toàn bộ hoặc một phần).

<details>
<summary>Cơ chế phụ</summary>

- 1 lính chỉ được 1 Tướng chỉ huy tại 1 thời điểm — không thể 2 Tướng cùng chỉ huy chung 1 lính.
- 2 Tướng trở lên cùng 1 nước có thể đứng chung 1 ô, nhưng 1 Tướng không chỉ huy được 1 Tướng khác.
- Chiến Tướng có Biên Chế nâng lên 50.000 (xem [Huyền Bí & Đặc Dị](07-huyen-bi.md)).

</details>

## Di Chuyển

*Cơ bản*
- 1 Tướng di chuyển tối đa 1 ô mỗi Turn theo cạnh vuông; đi chéo tốn tương đương 2 ô di chuyển (nên về cơ bản không đi chéo được trong 1 Turn thường, trừ khi có hỗ trợ đặc biệt).
- Cung Thủ không bắn chéo được (trừ khi dùng trong Trận Phong Sát — xem [Quân Sự Nâng Cao](06-quan-su-nang-cao.md)).
- Tướng phải chỉ huy tối thiểu 1000 lính mới được di chuyển.

## Gửi / Rút Quân

*Cơ bản*
- Chỉ thực hiện được tại Ô đã thuộc về nước mình (Ô Trắng đã chiếm, Châu Thành, Thành Trì), vào đầu lượt Go.
- Được rút/gửi số lẻ, nhưng phải để lại tối thiểu 1000 quân tại chỗ; không giới hạn số lượng tối đa.
- Không thể gửi/rút quân, Văn, Xe, Tên, Thuyền xuyên qua Rừng, Núi, Sông (kể cả khi đã có thông lương qua đó), hoặc giữa các vùng đất không kết nối với nhau.

<details>
<summary>Cơ chế phụ</summary>

- `[GIẢ ĐỊNH]` Một dòng luật riêng (trang 15) liệt kê thêm rằng ô đang dính Thủy Phù, đang dính Hỏa Phù, đang là ô trung tâm Hỏa, hoặc Ô Trắng, đều không cho gửi/rút. Bản chuẩn hóa hiểu vế "Ô Trắng" ở đây là nói về Ô Trắng **chưa chiếm** (khớp với luật "Turn 1 chiếm rồi thì Turn 2 mới được gửi hoặc rút Quân"), chứ không phủ định việc Ô Trắng **đã chiếm** vẫn gửi/rút được bình thường như quy tắc "Cơ bản" ở trên.

</details>

## Chiếm Đất

*Cơ bản*
- Đất Trống (Ô Trắng): kéo quân vào là chiếm được, có thể để lại quân trấn giữ.
- Đất có chủ (đã thuộc nước khác): phải kéo quân vào để tấn công hoặc bắn phá (xem công thức chiến đấu ở mục Binh Pháp bên dưới).

## Nối Lương

*Cơ bản*
- Chỉ những Ô đã chiếm được của nước mình mới nối/chuyển lương thực qua lại được.
- Rừng, Núi, Sông không cho nối lương xuyên qua, trừ khi có Mộc Ngưu Lưu Mã thông lương (xem [Quân Sự Nâng Cao](06-quan-su-nang-cao.md)).
- 2 ô nối theo đường chéo không được tính là kết nối — chỉ nối theo 4 hướng cạnh vuông.
- Luật miễn nối lương chỉ áp dụng cho Tướng, Lính, và Văn — không áp dụng để giữ chủ quyền cho 1 ô đất không có 3 đối tượng này đứng.
- Tướng/lính/đồ khi xuất chinh phải có đường nối lương tính từ đúng vị trí đang đứng (dù ô đó có chiếm được hay không) vào cuối Go/Atc; không có đường nối thì chết đói bại trận (xem [Kinh Tế & Hậu Cần](03-kinh-te.md)).

<details>
<summary>Cơ chế phụ</summary>

- Nếu 1 vùng đất bị cắt khỏi mạng lưới nối lương của nước mình: quân ở đó áp dụng luật chết đói (xem [Kinh Tế & Hậu Cần](03-kinh-te.md)); vùng đất mất luôn màu sở hữu nếu chỉ nối với vựa Châu Thành đã cạn lúa, nhưng giữ màu nếu nối với kho chung quốc gia (qua Thành Trì) đã cạn lúa.
- Châu Thành bị cắt khỏi mạng lưới nhưng còn lúa dự trữ tại chỗ: quân xung quanh không chết đói cho đến khi kho đó cạn.

</details>

## Hành Quân Đầu Game

*Cơ bản*
- Tướng xuất phát từ bất kỳ Ô Thành Trì nào của nước mình (kể cả Trì đang bị cô lập khỏi phần còn lại), không cần Tốc Phù để ra khỏi Trì lần đầu.
- Turn đầu tiên xuất trì: chỉ ra được 1 trong các ô liền kề theo cạnh vuông của Trì (không ra chéo góc).

<details>
<summary>Cơ chế phụ</summary>

- Trong lúc còn đứng trong cụm Thành Trì nối liền nhau của nước mình, Tướng có thể chọn đứng ở bất kỳ Ô Trì nào trong cụm đó mà không tính là "di chuyển" (cả cụm Trì nối nhau được xét như 1 khối duy nhất).
- Nếu 1 Ô Trì bị cô lập do các Trì liền kề bị phá, Trì đó không còn xuất/nhập tự do sang các Trì khác được nữa, và tự mua lúa độc lập với phần còn lại của quốc gia.

</details>

## Đi Xuyên Nhau

*Cơ bản*
- Nếu Tướng A rời Ô1 để đi vào Ô2 trong khi Tướng B rời Ô2 để đi vào Ô1 cùng lúc, 2 bên không tính là giao chiến với nhau — họ "đi xuyên qua nhau". Mỗi bên vẫn phải giao chiến với quân (nếu có) đang đứng lại tại ô mà mình vừa tiến vào.

## Binh Pháp — Công Thức Chiến Đấu

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
- Công thức: 1 Ô Châu Thành = 6000 Thủ Đá + chỉ số lính đang đóng tại ô đó + bonus Núi nếu ô kề núi. 1 Ô Thành Trì = 8000 Thủ Đá + chỉ số lính đang đóng tại ô đó + bonus Núi nếu có.
- Nếu chỉ số các bên hòa nhau (sau khi đã tính hệ số Trận Pháp), xét ưu tiên lần lượt: (1) bên nào có nhiều Tướng hơn trong ô giao tranh thắng — nếu bằng số Tướng thì bên đi xa hơn (tới ô đó) thua; (2) bên nào có nhiều Chiến Tướng hơn thắng — nếu vẫn bằng thì so tổng Liên Trảm cộng dồn của các Tướng dự trận; (3) bên nào đem theo nhiều Kỵ Mã hơn thắng; (4) vẫn hòa: đình chiến, cả 2 bên tự lùi lại 1 ô về phía sau ô vừa hòa.
- Sát thương Cung Thủ nếu bằng đúng chỉ số nhóm địch thì nhóm địch đó thua (không tính là hòa).
- Quân/Tướng cùng 1 nước không thể tấn công/bắn/giết lẫn nhau (nhưng vẫn cùng chịu ảnh hưởng lan của Thủy/Hỏa Phù).

<details>
<summary>Cơ chế phụ (edge-case — trích "Tài Liệu Thực Chiến", trang 17)</summary>

- **Cung Thủ Bắn:** bắn tối thiểu 1000 Tên/lượt (tính cả khi bắn vào ô địch không có quân). Nếu Cung ta chủ động bắn nhưng thua, mà chỉ số Công của Cung ta vẫn đạt từ 80% chỉ số của địch trở lên: dù thua, địch vẫn bị thiệt hại 1/5 quân. Dưới ngưỡng 80% đó thì chiến báo không nêu rõ số lượng quân 2 bên (chỉ bên bị bắn biết chính xác số Tên đối phương đã bắn).
- **Địa Hình Thật:** muốn bắn Cung xuyên qua Thành/Núi, phải đứng trên Thành/Núi/Tháp Tiễn (Máy Bắn Đá không cần điều kiện này). Mỗi lần Tốc Phù xuyên qua 1 ô Núi/Rừng/Thành của nước khác: trừ 1 ô tốc (được miễn trừ nếu có Trâu Gỗ/Mộc Ngưu Lưu Mã đi cùng — xem [Quân Sự Nâng Cao](06-quan-su-nang-cao.md)).
- **Cung Bắn Vào Ô Hỏa, Ô Hỗn Chiến (chỉ nhắm địch):** cộng dồn chỉ số Cung của 1 nước rồi mới áp vào từng nước địch riêng biệt (VD ta bắn 1000 Công thì mỗi nước địch trong ô đó hứng trọn 1000, không chia nhỏ ra).
- **Cung Các Nước Cùng Bắn Vào 1 Ô:** nếu nhiều nước cùng bắn 1 mục tiêu, cộng dồn tổng Công của các nước bắn lại trước khi áp thiệt hại lên mục tiêu.
- **3 Nước Cùng 1 Ô:** nếu cả 3 nước đều thủ và 0 công thì đứng chung không đánh nhau. Nếu có ít nhất 1 nước công: so chỉ số tổng của cả 3, ai mạnh nhất thắng — thiệt hại của bên thua bị cộng lại thành thiệt hại của bên thắng; không phân được ai mạnh nhất thì đình chiến. Nếu có đúng 2 nước cùng công và 1 nước thủ: 2 nước công đấu nhau trước để tìm ra kẻ thắng/thua, sau đó lấy quân còn lại của kẻ thắng đấu tiếp với nước thủ; không phân được thắng thua giữa 2 nước công thì đình chiến.
- **Hội Đồng Hỗn Chiến Cận:** nếu nhiều người mỗi nước cùng đứng 1 ô, cộng dồn toàn bộ chỉ số quân của mỗi nước rồi so thắng bại theo tổng đó; nếu 1 nước có cả quân công lẫn quân thủ thì gộp thành 1 chỉ số chung (không tính toàn thủ) rồi mới so.
- **Thiệt Hại (chia theo tỉ lệ):** khi 1 Tướng chỉ huy nhiều loại lính, thiệt hại chia theo đúng tỉ lệ số lượng từng loại. VD: Tướng chỉ huy 2000 Bộ + 1000 Kỵ (tổng 3000), tổng thiệt hại trận đó là 600 quân → Bộ mất (2000/3000)×600 = 400, Kỵ mất (1000/3000)×600 = 200. Số lẻ làm tròn: 0,1–0,4 làm tròn xuống (=0), 0,5–0,9 làm tròn lên (=1).

</details>

---

*Tiếp theo: [Danh Vọng & Thăng Tiến](05-danh-vong.md) →*
