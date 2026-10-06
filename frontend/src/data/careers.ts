export interface CareerGroup {
  id: string;
  categoryKey: string;
  title: string;
  badge: string;
  shortDesc: string;
  description: string;
  requirements: string[];
  benefits: string[];
  educationRequirement?: string;
  workType: string;
  location: string;
  subDivisions?: string[];
}

export const CAREER_GROUPS: CareerGroup[] = [
  {
    id: "ctv-y-te",
    categoryKey: "y-te",
    title: "Cộng Tác Viên Y Tế (Điều Dưỡng / Y Sĩ / Bác Sĩ)",
    badge: "Y Tế",
    shortDesc: "Thực hiện chăm sóc y tế tại nhà, tiêm truyền theo y lệnh, hỗ trợ bệnh nhân tái khám.",
    description: "Tham gia đội ngũ Y tế tận tâm cung cấp các dịch vụ chăm sóc sức khỏe tại nhà cho bệnh nhân cao tuổi, bệnh nhân sau phẫu thuật hoặc hỗ trợ người bệnh tái khám tại các bệnh viện lớn.",
    educationRequirement: "Tốt nghiệp Trung cấp, Cao đẳng hoặc Đại học thuộc lĩnh vực Y / Dược hoặc chuyên ngành phù hợp (Điều dưỡng, Y sĩ đa khoa, Bác sĩ).",
    requirements: [
      "Có bằng cấp/chứng chỉ hành nghề y tế hợp lệ",
      "Kỹ năng tiêm, truyền, thay băng vết thương thành thạo",
      "Tác phong nhanh nhẹn, giao tiếp lịch sự, có tâm với nghề",
      "Ưu tiên ứng viên có kinh nghiệm làm việc tại các BV hoặc phòng khám"
    ],
    benefits: [
      "Thu nhập hấp dẫn tính theo ca / lượt thăm khám (từ 8 - 15 triệu+/tháng)",
      "Thời gian làm việc linh hoạt, chủ động đăng ký ca",
      "Được trang bị dụng cụ y tế và đồng phục chuyên nghiệp",
      "Được đào tạo nâng cao kỹ năng điều dưỡng chuyên sâu"
    ],
    workType: "Part-time / Theo ca / Tự do",
    location: "TP.HCM & Các tỉnh lân cận (Bình Dương, Đồng Nai, Long An)"
  },
  {
    id: "ctv-tai-xe",
    categoryKey: "tai-xe",
    title: "Cộng Tác Viên Tài Xế Vận Chuyển Y Tế (Part-Time)",
    badge: "Vận Tải",
    shortDesc: "Đưa đón người bệnh đi khám, về nhà hoặc chuyển viện bằng xe chuyên dụng.",
    description: "Đảm nhận nhiệm vụ điều khiển xe đưa đón bệnh nhân di chuyển an toàn giữa Nhà ↔ Bệnh viện hoặc chuyển viện liên tỉnh. Hỗ trợ người bệnh lên xuống xe cẩn thận và ân cần.",
    requirements: [
      "Có Giấy phép lái xe (GPLX) hạng B2, C trở lên",
      "Kinh nghiệm lái xe an toàn từ 2 năm trở lên",
      "Có khả năng hỗ trợ bê giàn băng ca, xe đẩy hỗ trợ người bệnh",
      "Ưu tiên ứng viên có kiến thức sơ cấp cứu hoặc từng làm trong môi trường Y / Dược / Vận chuyển y tế"
    ],
    benefits: [
      "Thu nhập cao theo chuyến + phụ cấp hỗ trợ người bệnh",
      "Lịch nhận chuyến linh hoạt qua ứng dụng / nhóm thông báo",
      "Môi trường làm việc văn minh, đồng đội hỗ trợ nhiệt tình",
      "Được hướng dẫn kỹ năng giao tiếp và hỗ trợ y tế cơ bản"
    ],
    workType: "Part-time / Theo chuyến",
    location: "Khu vực TP.HCM, Bình Dương, Đồng Nai, Long An"
  },
  {
    id: "ctv-truyen-thong",
    categoryKey: "truyen-thong",
    title: "Cộng Tác Viên Truyền Thông & Marketing",
    badge: "Media & Marketing",
    shortDesc: "Sáng tạo nội dung, quản lý mạng xã hội, sản xuất video giới thiệu dịch vụ.",
    description: "Cùng xây dựng hình ảnh thương hiệu dịch vụ Y tế & Vận tải gần gũi, tin cậy thông qua các kênh truyền thông như Facebook, Zalo, TikTok, YouTube.",
    requirements: [
      "Yêu thích công việc sáng tạo nội dung (Content Writer, Video Creator, Designer)",
      "Có kinh nghiệm quản lý Fanpage, TikTok hoặc dựng video bằng CapCut/Premiere",
      "Hiểu biết cơ bản về lĩnh vực chăm sóc sức khỏe là một lợi thế lớn",
      "Có tinh thần trách nhiệm, chủ động và sáng tạo"
    ],
    benefits: [
      "Nhuận bút theo bài viết/video + Thưởng theo hiệu quả truyền thông",
      "Làm việc online 100%, không gò bó thời gian",
      "Được trải nghiệm thực tế công việc Marketing ngành Y tế",
      "Cơ hội trở thành Nhân viên chính thức"
    ],
    workType: "Online / Freelance",
    location: "Toàn quốc (Ưu tiên TP.HCM)",
    subDivisions: ["Content Writing", "Social Media", "Video Creation", "Digital Marketing"]
  },
  {
    id: "ctv-kinh-doanh",
    categoryKey: "kinh-doanh",
    title: "Cộng Tác Viên Phát Triển Kinh Doanh (Y Tế & Vận Tải)",
    badge: "Kinh Doanh",
    shortDesc: "Kết nối khách hàng có nhu cầu sử dụng dịch vụ Y tế tại nhà hoặc Xe đưa đón y tế.",
    description: "Tìm kiếm, giới thiệu và tư vấn các gói dịch vụ y tế tại nhà hoặc giải pháp vận chuyển bệnh nhân cho cá nhân, gia đình hoặc các phòng khám đối tác.",
    requirements: [
      "Có mạng lưới mối quan hệ rộng rãi hoặc khả năng tìm kiếm khách hàng tốt",
      "Giao tiếp tốt, thái độ tư vấn lịch sự, nhã nhặn",
      "Không yêu cầu bằng cấp, sẽ được hướng dẫn chi tiết về thông tin dịch vụ",
      "Trung thực, trách nhiệm với thông tin cung cấp cho khách hàng"
    ],
    benefits: [
      "Chiết khấu hoa hồng cao trên từng hợp đồng / lượt đăng ký dịch vụ",
      "Không áp doanh số tối thiểu, làm nhiều hưởng nhiều",
      "Được cung cấp đầy đủ tài liệu, brochure, tài nguyên truyền thông",
      "Thưởng nóng khi đạt mốc số lượng khách hàng xuất sắc"
    ],
    workType: "Linh hoạt / Freelance",
    location: "Toàn quốc",
    subDivisions: ["Kinh Doanh Mảng Y Tế", "Kinh Doanh Mảng Vận Tải Y Tế"]
  }
];
