export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  category: 'medical' | 'transport' | 'company';
  categoryLabel: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  author: string;
  readTime: string;
  featured?: boolean;
}

export const NEWS_ARTICLES: NewsArticle[] = [
  {
    id: "news-1",
    slug: "nhung-luu-y-khi-cham-soc-nguoi-cao-tuoi-tai-nha",
    title: "Những Lưu Ý Quan Trọng Khi Chăm Sóc Người Cao Tuổi Tại Nhà",
    category: "medical",
    categoryLabel: "Y Tế Tại Nhà",
    excerpt: "Chăm sóc sức khỏe người cao tuổi cần chú trọng chế độ dinh dưỡng, theo dõi huyết áp thường xuyên và tâm lý thoải mái.",
    content: `
      <p>Chăm sóc người cao tuổi tại nhà đòi hỏi sự kiên nhẫn, am hiểu tâm lý và kiến thức y tế cơ bản. Dưới đây là những lưu ý quan trọng giúp người thân bảo vệ sức khỏe cho ông bà, cha mẹ:</p>
      <h3>1. Theo dõi các chỉ số sinh hiệu định kỳ</h3>
      <p>Huyết áp, nhịp tim và chỉ số đường huyết là 3 yếu tố cần được đo đạc và ghi chép thường xuyên. Bất kỳ sự thay đổi đột ngột nào cũng có thể là dấu hiệu của biến chứng nguy hiểm.</p>
      <h3>2. Chế độ dinh dưỡng cân bằng, dễ tiêu hóa</h3>
      <p>Người cao tuổi thường có hệ tiêu hóa yếu hơn. Nên chuẩn bị thức ăn mềm, chia nhỏ bữa ăn trong ngày và giảm bớt lượng muối, đường.</p>
      <h3>3. Tạo không gian sống an toàn, tránh trơn trượt</h3>
      <p>Té ngã ở người cao tuổi rất nguy hiểm. Hãy đảm bảo sàn nhà vệ sinh luôn khô ráo, có tay vịn và đủ ánh sáng trong phòng ngủ.</p>
      <p>Nếu gia đình bận rộn, việc đăng ký dịch vụ điều dưỡng chăm sóc tại nhà sẽ giúp người thân được theo dõi y tế chuyên nghiệp và chu đáo hơn.</p>
    `,
    publishedAt: "2026-10-02",
    author: "BS. CKI Nguyễn Văn An",
    readTime: "5 phút",
    featured: true
  },
  {
    id: "news-2",
    slug: "quy-trinh-dua-don-benh-nhan-tai-kham-an-toan",
    title: "Quy Trình Chuẩn Chuẩn Bị Khi Đưa Đón Bệnh Nhân Tái Khám Bệnh Viện",
    category: "transport",
    categoryLabel: "Vận Tải Y Tế",
    excerpt: "Hướng dẫn chuẩn bị hồ sơ y tế, phương tiện di chuyển và các lưu ý an toàn cho người bệnh trước ngày tái khám.",
    content: `
      <p>Mỗi chuyến đi tái khám bệnh viện thường ngốn rất nhiều thời gian và sức lực của bệnh nhân lẫn người nhà. Để chuyến đi diễn ra suôn sẻ, bạn nên chuẩn bị theo các bước sau:</p>
      <h3>1. Đóng gói đầy đủ hồ sơ bệnh án</h3>
      <p>Chuẩn bị sẵn sổ khám bệnh, đơn thuốc cũ, kết quả xét nghiệm, phim X-quang và thẻ BHYT vào một túi riêng để dễ tra cứu.</p>
      <h3>2. Lựa chọn phương tiện vận chuyển chuyên dụng</h3>
      <p>Với bệnh nhân khó vận động hoặc mới phẫu thuật, việc sử dụng xe y tế có băng ca và xe đẩy sẽ giúp tránh làm đau hay tổn thương vết mổ.</p>
      <h3>3. Đặt lịch xe đúng giờ</h3>
      <p>Nên đặt xe đón sớm hơn giờ hẹn khám từ 30-45 phút để chủ động làm thủ tục lấy số tại khoa khám bệnh.</p>
    `,
    publishedAt: "2026-09-28",
    author: "Đội Ngũ Vận Tải Y Tế",
    readTime: "4 phút",
    featured: true
  },
  {
    id: "news-3",
    slug: "khi-nao-can-goi-dieu-duong-den-cham-soc-tai-nha",
    title: "Khi Nào Gia Đình Nên Gọi Điều Dưỡng Đến Khám & Chăm Sóc Tại Nhà?",
    category: "medical",
    categoryLabel: "Y Tế Tại Nhà",
    excerpt: "Nhận biết các trường hợp cần sự hỗ trợ của điều dưỡng y tế chuyên nghiệp thay vì tự chăm sóc tại gia.",
    content: `
      <p>Nhiều gia đình lúng túng khi người thân gặp các vấn đề sức khỏe cần xử lý kỹ thuật y tế. Dưới đây là các trường hợp bạn nên tìm đến dịch vụ điều dưỡng tại nhà:</p>
      <ul>
        <li>Bệnh nhân có vết mổ, vết thương hở cần thay băng rửa trùng hàng ngày.</li>
        <li>Bệnh nhân cần tiêm thuốc hoặc truyền dịch theo y lệnh bác sĩ.</li>
        <li>Bệnh nhân đang đặt sonde dạ dày, sonde tiểu cần vệ sinh và thay mới định kỳ.</li>
        <li>Bệnh nhân tai biến cần người hỗ trợ tập vận động và chăm sóc sinh hoạt.</li>
      </ul>
    `,
    publishedAt: "2026-09-20",
    author: "ThS. ĐD Trần Thị Mai",
    readTime: "4 phút"
  },
  {
    id: "news-4",
    slug: "mo-rong-mang-luoi-xe-van-chuyen-y-te-khu-vuc-mien-tay",
    title: "Mở Rộng Mạng Lưới Xe Vận Chuyển Y Tế Phục Vụ Các Tỉnh Miền Tây",
    category: "company",
    categoryLabel: "Tin Doanh Nghiệp",
    excerpt: "Tăng cường thêm dàn xe chuyên dụng sẵn sàng đưa đón bệnh nhân chuyển viện tuyến tỉnh về TP.HCM.",
    content: `
      <p>Nhằm đáp ứng nhu cầu di chuyển khám chữa bệnh ngày càng tăng của người dân các tỉnh Đồng bằng Sông Cửu Long, chúng tôi chính thức tăng cường đội xe vận chuyển y tế chuyên dụng phục vụ các tuyến Long An, Tiền Giang, Bến Tre, Cần Thơ về các bệnh viện lớn tại TP.HCM.</p>
      <p>Các xe đều được trang bị hệ thống oxy, băng ca chống xóc và điều hòa khử khuẩn hiện đại, đảm bảo sự thoải mái tối đa cho người bệnh trên chặng đường dài.</p>
    `,
    publishedAt: "2026-09-15",
    author: "Ban Truyền Thông",
    readTime: "3 phút"
  }
];
