export interface TransportServiceItem {
  id: string;
  slug: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  icon: string;
  features: string[];
  vehicleType: string;
  suitableFor: string;
  popular?: boolean;
}

export const TRANSPORT_SERVICES: TransportServiceItem[] = [
  {
    id: "trans-1",
    slug: "nha-den-benh-vien",
    title: "Vận Chuyển: Nhà ➔ Bệnh Viện",
    shortDesc: "Đưa đón bệnh nhân từ nhà riêng đến các bệnh viện, phòng khám an toàn, đúng giờ.",
    fullDesc: "Dịch vụ xe đưa đón người bệnh chuyên dụng hỗ trợ đón tận nhà, nhân viên hỗ trợ di chuyển băng ca/xe đẩy và đưa bệnh nhân vào tận khu vực khám bệnh của bệnh viện.",
    icon: "Ambulance",
    features: [
      "Đón tận nhà đúng giờ hẹn trước",
      "Trang bị xe đẩy, băng ca di chuyển nhẹ nhàng",
      "Tài xế điềm tĩnh, cẩn thận, thông thuộc đường xá",
      "Có chỗ ngồi thoải mái cho 1-2 người nhà đi cùng"
    ],
    vehicleType: "Xe vận chuyển y tế chuyên dụng / Xe cứu thương tiêu chuẩn",
    suitableFor: "Bệnh nhân không thể tự đi lại, người cao tuổi đi khám bệnh.",
    popular: true
  },
  {
    id: "trans-2",
    slug: "benh-vien-ve-nha",
    title: "Vận Chuyển: Bệnh Viện ➔ Nhà",
    shortDesc: "Đưa bệnh nhân xuất viện hoặc sau khám chữa bệnh trở về nhà an toàn, chu đáo.",
    fullDesc: "Hỗ trợ bệnh nhân làm xong thủ tục xuất viện di chuyển từ giường bệnh ra xe và vận chuyển về tận nhà riêng. Nhân viên hỗ trợ mang vác hành lý và di chuyển bệnh nhân vào nhà an toàn.",
    icon: "Home",
    features: [
      "Đón tại cổng hoặc khoa phòng bệnh viện",
      "Hỗ trợ đưa bệnh nhân lên/xuống xe an toàn",
      "Không gian xe sạch sẽ, khử khuẩn liên tục",
      "Hỗ trợ vận chuyển hành lý cá nhân"
    ],
    vehicleType: "Xe chuyên dụng y tế điều hòa thoáng mát",
    suitableFor: "Bệnh nhân mới xuất viện, bệnh nhân sau phẫu thuật cần về nhà nằm nghỉ.",
    popular: true
  },
  {
    id: "trans-3",
    slug: "chuyen-vien",
    title: "Vận Chuyển Chuyển Viện",
    shortDesc: "Hỗ trợ di chuyển bệnh nhân giữa các bệnh viện tuyến tỉnh ↔ tuyến trung ương.",
    fullDesc: "Dịch vụ vận chuyển cấp trung và liên tỉnh dành cho bệnh nhân cần chuyển viện cấp cứu hoặc chuyển tuyến điều trị. Xe được trang bị hệ thống oxy, máy hút đờm và trang thiết bị y tế cơ bản.",
    icon: "ArrowRightLeft",
    features: [
      "Hệ thống bình oxy & trang thiết bị hỗ trợ trên xe",
      "Đội ngũ tài xế am hiểu tuyến đường inter-city",
      "Có thể yêu cầu Y sĩ/Điều dưỡng đi cùng chăm sóc",
      "Liên lạc thông suốt 24/7 trong suốt hành trình"
    ],
    vehicleType: "Xe chuyên dùng y tế liên tỉnh",
    suitableFor: "Bệnh nhân chuyển tuyến điều trị giữa TP.HCM và các tỉnh lân cận."
  },
  {
    id: "trans-4",
    slug: "dua-don-tai-kham",
    title: "Đưa Đón Tái Khám Định Kỳ",
    shortDesc: "Gói vận chuyển đưa đón khứ hồi theo lịch hẹn tái khám định kỳ của bác sĩ.",
    fullDesc: "Giải pháp trọn gói đưa bệnh nhân từ nhà đến bệnh viện tái khám và chờ đưa về sau khi khám xong, giúp gia đình chủ động thời gian mà không lo lắng về phương tiện đi lại.",
    icon: "CalendarCheck",
    features: [
      "Lịch trình khứ hồi 2 chiều ưu đãi",
      "Tài xế kiên nhẫn chờ đợi trong suốt thời gian khám",
      "Nhắc lịch tái khám tự động trước 1 ngày",
      "Gói dịch vụ tiết kiệm cho bệnh nhân tái khám thường xuyên"
    ],
    vehicleType: "Xe y tế chuyên dụng chở người bệnh",
    suitableFor: "Bệnh nhân chạy thận, bệnh nhân ung thư hóa trị/xạ trị, tái khám định kỳ."
  },
  {
    id: "trans-5",
    slug: "van-chuyen-theo-yeu-cau",
    title: "Vận Chuyển Theo Yêu Cầu Riêng",
    shortDesc: "Cho thuê xe y tế đưa đón bệnh nhân thăm thân, về quê hoặc sự kiện y tế.",
    fullDesc: "Dịch vụ vận chuyển linh hoạt theo lộ trình cá nhân của gia đình bệnh nhân như đưa về quê nghỉ dưỡng, đi lại thăm hỏi người thân hay di chuyển giữa các cơ sở y tế theo mong muốn.",
    icon: "Navigation",
    features: [
      "Lộ trình tùy chỉnh hoàn toàn theo yêu cầu",
      "Phục vụ chu đáo, nhiệt tình",
      "Báo giá minh bạch trước chuyến đi",
      "Đảm bảo an toàn tuyệt đối suốt hành trình"
    ],
    vehicleType: "Đa dạng các dòng xe vận chuyển chuyên dụng",
    suitableFor: "Gia đình bệnh nhân có nhu cầu di chuyển đặc thù."
  },
  {
    id: "trans-6",
    slug: "xe-tu-lai",
    title: "Dịch Vụ Xe Tự Lái",
    shortDesc: "Cho thuê xe tự lái phục vụ nhu cầu di chuyển linh hoạt của cá nhân và gia đình.",
    fullDesc: "Dịch vụ cho thuê xe tự lái với đa dạng các dòng xe từ 4 chỗ đến 7 chỗ đời mới. Thủ tục đơn giản, giao xe tận nơi, giúp khách hàng chủ động hoàn toàn trong việc di chuyển theo lộ trình riêng.",
    icon: "Car",
    features: [
      "Đa dạng các dòng xe 4-7 chỗ đời mới",
      "Thủ tục thuê xe nhanh chóng, linh hoạt",
      "Giao nhận xe tận nhà theo yêu cầu",
      "Bảo hiểm 2 chiều, hỗ trợ kỹ thuật 24/7"
    ],
    vehicleType: "Xe 4 chỗ, 7 chỗ phổ thông và cao cấp",
    suitableFor: "Người có bằng lái xe muốn chủ động di chuyển cá nhân hoặc cùng gia đình."
  }
];

export const TRANSPORT_PROCESS = [
  { step: "01", title: "Liên Hệ Đặt Xe", desc: "Gọi Hotline/Zalo cung cấp địa chỉ đón, điểm đến và tình trạng bệnh nhân." },
  { step: "02", title: "Xác Nhận & Điều Xe", desc: "Xác nhận thời gian đón, loại xe phù hợp và thông tin tài xế." },
  { step: "03", title: "Đón & Vận Chuyển", desc: "Tài xế đón tận nơi, hỗ trợ bệnh nhân lên xe và vận chuyển an toàn." },
  { step: "04", title: "Đến Điểm Khám / Nhà", desc: "Đưa bệnh nhân vào tận nơi an toàn và hoàn tất chuyến đi." }
];

export const COVERAGE_AREAS = [
  { name: "TP. Hồ Chí Minh", detail: "Phục vụ 24/7 tất cả các Quận/Huyện & TP. Thủ Đức" },
  { name: "Bình Dương", detail: "Thủ Dầu Một, Thuận An, Dĩ An, Bến Cát, Tân Uyên" },
  { name: "Đồng Nai", detail: "TP. Biên Hòa, Long Thành, Nhơn Trạch, Trảng Bom" },
  { name: "Long An & Tiền Giang", detail: "Tân An, Bến Lức, Mỹ Tho và các khu vực lân cận" },
  { name: "Bà Rịa - Vũng Tàu", detail: "TP. Vũng Tàu, TP. Bà Rịa, Phú Mỹ" },
  { name: "Các Tỉnh Miền Tây & Tây Nguyên", detail: "Nhận chuyến liên tỉnh đưa đón tận nhà theo yêu cầu" }
];
