export interface MedicalServiceItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  shortDesc: string;
  fullDesc: string;
  icon: string;
  features: string[];
  targetPatients: string;
  popular?: boolean;
}

export const MEDICAL_SERVICES: MedicalServiceItem[] = [
  {
    id: "med-1",
    slug: "cham-soc-tai-nha",
    title: "Chăm Sóc Y Tế Tại Nhà",
    category: "Chăm sóc sức khỏe",
    shortDesc: "Đội ngũ điều dưỡng, bác sĩ thăm khám, theo dõi sức khỏe và chăm sóc toàn diện tận nhà.",
    fullDesc: "Dịch vụ chăm sóc y tế tại nhà cung cấp giải pháp khám bệnh, thay băng, rửa vết thương, tiêm truyền theo y lệnh bác sĩ và chăm sóc người bệnh cao tuổi hoặc sau phẫu thuật ngay tại không gian sống quen thuộc của gia đình.",
    icon: "Stethoscope",
    features: [
      "Thăm khám và theo dõi sinh hiệu định kỳ",
      "Tiêm thuốc, truyền dịch theo chỉ định y khoa",
      "Thay băng, rửa vết thương, chăm sóc vết mổ",
      "Đặt và chăm sóc sonde dạ dày, sonde tiểu"
    ],
    targetPatients: "Người cao tuổi, bệnh nhân sau phẫu thuật, người mắc bệnh mãn tính khó di chuyển.",
    popular: true
  },
  {
    id: "med-2",
    slug: "ho-tro-tai-kham",
    title: "Hỗ Trợ Tái Khám Bệnh Viện",
    category: "Hỗ trợ y tế",
    shortDesc: "Nhân viên y tế đồng hành cùng bệnh nhân trong suốt quá trình tái khám tại các bệnh viện lớn.",
    fullDesc: "Dịch vụ nhân viên y tế đi cùng hỗ trợ bệnh nhân làm thủ tục đăng ký khám, hướng dẫn di chuyển giữa các khoa phòng, nhận kết quả xét nghiệm và mua thuốc theo đơn, giúp người bệnh và người nhà tiết kiệm thời gian và công sức.",
    icon: "UserCheck",
    features: [
      "Hỗ trợ đăng ký và lấy số khám ưu tiên",
      "Đồng hành hỗ trợ di chuyển nội bộ bệnh viện",
      "Ghi nhận chi tiết lời dặn của bác sĩ chuyên khoa",
      "Hỗ trợ lấy kết quả xét nghiệm và nhận thuốc"
    ],
    targetPatients: "Người cao tuổi đi khám một mình, người nhà bận rộn không thể đi cùng.",
    popular: true
  },
  {
    id: "med-3",
    slug: "ho-tro-nguoi-benh",
    title: "Hỗ Trợ & Chăm Sóc Người Bệnh",
    category: "Điều dưỡng & Chăm sóc",
    shortDesc: "Chăm sóc sinh hoạt, hỗ trợ vận động, phục hồi chức năng và tinh thần cho người bệnh.",
    fullDesc: "Cung cấp nhân viên điều dưỡng hoặc bảo mẫu y tế chuyên nghiệp túc trực hỗ trợ bệnh nhân trong các hoạt động sinh hoạt hàng ngày, tập vận động nhẹ nhàng, nhắc nhở uống thuốc đúng giờ và theo dõi diễn biến sức khỏe.",
    icon: "HeartHandshake",
    features: [
      "Hỗ trợ vệ sinh cá nhân và ăn uống theo chế độ",
      "Nhắc nhở và quản lý lịch uống thuốc chính xác",
      "Hỗ trợ tập phục hồi chức năng nhẹ tại nhà",
      "Theo dõi và báo cáo tình trạng cho người nhà"
    ],
    targetPatients: "Bệnh nhân tai biến, liệt nửa người, bệnh nhân cần điều dưỡng túc trực 24/7."
  },
  {
    id: "med-4",
    slug: "xet-nghiem-tuyen-truoc",
    title: "Lấy Mẫu Xét Nghiệm Tận Nơi",
    category: "Xét nghiệm & Chẩn đoán",
    shortDesc: "Lấy mẫu máu, mẫu xét nghiệm tại nhà và trả kết quả tận tay hoặc qua trực tuyến nhanh chóng.",
    fullDesc: "Kết hợp với các trung tâm xét nghiệm đạt chuẩn ISO, chúng tôi cử kỹ thuật viên đến tận nhà lấy mẫu an toàn, bảo quản theo quy chuẩn y tế và trả kết quả tư vấn cùng bác sĩ.",
    icon: "TestTube",
    features: [
      "Xét nghiệm công thức máu, đường huyết, mỡ máu",
      "Xét nghiệm chức năng gan, thận, vi chất",
      "Quy trình lấy mẫu chuẩn y khoa không đau",
      "Bác sĩ gọi điện tư vấn kết quả chi tiết"
    ],
    targetPatients: "Gia đình cần kiểm tra sức khỏe định kỳ, người ngại xếp hàng chờ đợi ở bệnh viện."
  }
];

export const MEDICAL_PROCESS = [
  { step: "01", title: "Đăng Ký Dịch Vụ", desc: "Liên hệ qua Hotline/Zalo hoặc form đăng ký trực tuyến để nêu nhu cầu y tế." },
  { step: "02", title: "Tư Vấn & Xác Nhận", desc: "Chuyên viên y tế tư vấn giải pháp phù hợp và xác nhận thời gian thăm khám." },
  { step: "03", title: "Thực Hiện Dịch Vụ", desc: "Đội ngũ y bác sĩ/điều dưỡng đến tận nhà thực hiện quy trình chuyên môn." },
  { step: "04", title: "Theo Dõi & Chăm Sóc", desc: "Lưu hồ sơ sức khỏe và hỗ trợ theo dõi diễn tiến sau thăm khám." }
];

export const MEDICAL_TEAM = [
  {
    name: "BS. CKI Nguyễn Văn An",
    role: "Cố Vấn Chuyên Môn Y Tế",
    exp: "15+ năm kinh nghiệm Bệnh viện Tuyến Trung ương",
    specialty: "Nội khoa & Chăm sóc lão khoa"
  },
  {
    name: "ThS. ĐD Trần Thị Mai",
    role: "Trưởng Đội Ngũ Điều Dưỡng",
    exp: "10+ năm kinh nghiệm quản lý điều dưỡng y tế tại nhà",
    specialty: "Chăm sóc vết thương & Điều dưỡng gia đình"
  },
  {
    name: "BS. Lê Hoàng Nam",
    role: "Bác Sĩ Gia Đình",
    exp: "8+ năm kinh nghiệm thăm khám tận nhà",
    specialty: "Y học gia đình & Tái khám định kỳ"
  }
];

export const MEDICAL_PARTNERS = [
  "Bệnh viện Đại học Y Dược",
  "Bệnh viện Chợ Rẫy",
  "Bệnh viện Nhân dân 115",
  "Trung tâm Xét nghiệm Y khoa Đạt chuẩn ISO"
];
