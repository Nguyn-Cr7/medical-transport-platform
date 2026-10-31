-- ==============================================================================
-- CAREVIA CMS - SEED DATA (DỮ LIỆU BAN ĐẦU)
-- Import từ các file src/data/*.ts hiện có
-- An toàn khi chạy lại nhiều lần (sử dụng ON CONFLICT ... DO UPDATE)
-- ==============================================================================

-- 1. SEED SITE_SETTINGS
INSERT INTO public.site_settings (
    id,
    company_name,
    slogan,
    hotline,
    phone,
    email,
    address,
    working_hours,
    zalo_url,
    facebook_url,
    youtube_url,
    footer_text
) VALUES (
    1,
    'CAREVIA - Nền Tảng Y Tế & Vận Tải Chuyên Nghiệp',
    'Đồng hành cùng sức khỏe và sự an tâm của gia đình bạn',
    '1900 888 999',
    '0988 123 456',
    'lienhe@medicaltransport.vn',
    'Tòa nhà Y Tế & Vận Tải, Số 123 Đường Nguyễn Văn Cừ, Quận 5, TP. Hồ Chí Minh',
    '24/7 (Phục vụ tất cả các ngày trong tuần, kể cả ngày lễ)',
    'https://zalo.me/0986767960',
    'https://facebook.com',
    'https://youtube.com',
    'CAREVIA - Hệ sinh thái kết nối dịch vụ Y tế tại nhà & Vận chuyển y tế hàng đầu. Phục vụ 24/7 tận tâm, an toàn, chu đáo.'
)
ON CONFLICT (id) DO UPDATE SET
    company_name = EXCLUDED.company_name,
    slogan = EXCLUDED.slogan,
    hotline = EXCLUDED.hotline,
    phone = EXCLUDED.phone,
    email = EXCLUDED.email,
    address = EXCLUDED.address,
    working_hours = EXCLUDED.working_hours,
    zalo_url = EXCLUDED.zalo_url,
    facebook_url = EXCLUDED.facebook_url,
    youtube_url = EXCLUDED.youtube_url,
    footer_text = EXCLUDED.footer_text;

-- 2. SEED SERVICES (Dịch vụ Y tế & Vận tải)
INSERT INTO public.services (
    id,
    category,
    slug,
    title,
    short_desc,
    full_desc,
    icon,
    features,
    target_info,
    sort_order,
    is_published,
    action_type,
    zalo_url,
    price_images
) VALUES
-- Dịch vụ y tế 1: Hỗ trợ tái khám bệnh viện (action_type: zalo)
(
    'med-2',
    'medical',
    'ho-tro-tai-kham',
    'Hỗ Trợ Tái Khám Bệnh Viện',
    'Nhân viên y tế đồng hành cùng bệnh nhân trong suốt quá trình tái khám tại các bệnh viện lớn.',
    'Dịch vụ nhân viên y tế đi cùng hỗ trợ bệnh nhân làm thủ tục đăng ký khám, hướng dẫn di chuyển giữa các khoa phòng, nhận kết quả xét nghiệm và mua thuốc theo đơn, giúp người bệnh và người nhà tiết kiệm thời gian và công sức.',
    'UserCheck',
    '["Đồng hành hỗ trợ di chuyển nội bộ bệnh viện", "Ghi nhận chi tiết lời dặn của bác sĩ chuyên khoa", "Hỗ trợ lấy kết quả xét nghiệm và nhận thuốc"]'::JSONB,
    'Người cao tuổi đi khám một mình, người nhà bận rộn không thể đi cùng.',
    1,
    TRUE,
    'zalo',
    NULL,
    '[]'::JSONB
),
-- Dịch vụ y tế 2: Hỗ trợ & Chăm sóc người bệnh (action_type: zalo)
(
    'med-3',
    'medical',
    'ho-tro-nguoi-benh',
    'Hỗ Trợ & Chăm Sóc Người Bệnh',
    'Chăm sóc sinh hoạt, hỗ trợ vận động, phục hồi chức năng và tinh thần cho người bệnh.',
    'Cung cấp nhân viên điều dưỡng hoặc bảo mẫu y tế chuyên nghiệp túc trực hỗ trợ bệnh nhân trong các hoạt động sinh hoạt hàng ngày, tập vận động nhẹ nhàng, nhắc nhở uống thuốc đúng giờ và theo dõi diễn biến sức khỏe.',
    'HeartHandshake',
    '["Hỗ trợ vệ sinh cá nhân và ăn uống theo chế độ", "Nhắc nhở và quản lý lịch uống thuốc chính xác", "Hỗ trợ tập phục hồi chức năng nhẹ tại nhà", "Theo dõi và báo cáo tình trạng cho người nhà"]'::JSONB,
    'Bệnh nhân tai biến, liệt nửa người, bệnh nhân cần điều dưỡng túc trực 24/7.',
    2,
    TRUE,
    'zalo',
    NULL,
    '[]'::JSONB
),
-- Dịch vụ y tế 3: Lấy mẫu xét nghiệm tận nơi (action_type: detail_page kèm 2 ảnh bảng giá)
(
    'med-4',
    'medical',
    'xet-nghiem-tuyen-truoc',
    'Lấy Mẫu Xét Nghiệm Tận Nơi',
    'Lấy mẫu máu, mẫu xét nghiệm tại nhà và trả kết quả tận tay hoặc qua trực tuyến nhanh chóng.',
    'Kết hợp với các trung tâm xét nghiệm đạt chuẩn ISO, chúng tôi cử kỹ thuật viên đến tận nhà lấy mẫu an toàn, bảo quản theo quy chuẩn y tế và trả kết quả tư vấn cùng bác sĩ.',
    'TestTube',
    '["Xét nghiệm công thức máu, đường huyết, mỡ máu", "Xét nghiệm chức năng gan, thận, vi chất", "Quy trình lấy mẫu chuẩn y khoa", "Bác sĩ gọi điện tư vấn kết quả chi tiết"]'::JSONB,
    'Gia đình cần kiểm tra sức khỏe định kỳ, người ngại xếp hàng chờ đợi ở bệnh viện.',
    3,
    TRUE,
    'detail_page',
    NULL,
    '[]'::JSONB
),
-- Dịch vụ vận tải 1: Nhà -> Bệnh viện
(
    'trans-1',
    'transport',
    'nha-den-benh-vien',
    'Vận Chuyển: Nhà ➔ Bệnh Viện',
    'Đưa đón bệnh nhân từ nhà riêng đến các bệnh viện, phòng khám an toàn, đúng giờ.',
    'Dịch vụ xe đưa đón người bệnh chuyên dụng hỗ trợ đón tận nhà, nhân viên hỗ trợ di chuyển băng ca/xe đẩy và đưa bệnh nhân vào tận khu vực khám bệnh của bệnh viện.',
    'Ambulance',
    '["Đón tận nhà đúng giờ hẹn trước", "Trang bị xe đẩy, băng ca di chuyển nhẹ nhàng", "Tài xế điềm tĩnh, cẩn thận, thông thuộc đường xá", "Có chỗ ngồi thoải mái cho 1-2 người nhà đi cùng"]'::JSONB,
    'Bệnh nhân không thể tự đi lại, người cao tuổi đi khám bệnh.',
    10,
    TRUE,
    'none',
    NULL,
    '[]'::JSONB
),
-- Dịch vụ vận tải 2: Bệnh viện -> Nhà
(
    'trans-2',
    'transport',
    'benh-vien-ve-nha',
    'Vận Chuyển: Bệnh Viện ➔ Nhà',
    'Đưa bệnh nhân xuất viện hoặc sau khám chữa bệnh trở về nhà an toàn, chu đáo.',
    'Hỗ trợ bệnh nhân làm xong thủ tục xuất viện di chuyển từ giường bệnh ra xe và vận chuyển về tận nhà riêng. Nhân viên hỗ trợ mang vác hành lý và di chuyển bệnh nhân vào nhà an toàn.',
    'Home',
    '["Đón tại cổng hoặc khoa phòng bệnh viện", "Hỗ trợ đưa bệnh nhân lên/xuống xe an toàn", "Không gian xe sạch sẽ, khử khuẩn liên tục", "Hỗ trợ vận chuyển hành lý cá nhân"]'::JSONB,
    'Bệnh nhân mới xuất viện, bệnh nhân sau phẫu thuật cần về nhà nằm nghỉ.',
    11,
    TRUE,
    'none',
    NULL,
    '[]'::JSONB
),
-- Dịch vụ vận tải 3: Chuyển viện
(
    'trans-3',
    'transport',
    'chuyen-vien',
    'Vận Chuyển Chuyển Viện',
    'Hỗ trợ di chuyển bệnh nhân giữa các bệnh viện tuyến tỉnh ↔ tuyến trung ương.',
    'Dịch vụ vận chuyển cấp trung và liên tỉnh dành cho bệnh nhân cần chuyển viện cấp cứu hoặc chuyển tuyến điều trị. Xe được trang bị hệ thống oxy, máy hút đờm và trang thiết bị y tế cơ bản.',
    'ArrowRightLeft',
    '["Hệ thống bình oxy & trang thiết bị hỗ trợ trên xe", "Đội ngũ tài xế am hiểu tuyến đường inter-city", "Có thể yêu cầu Y sĩ/Điều dưỡng đi cùng chăm sóc", "Liên lạc thông suốt 24/7 trong suốt hành trình"]'::JSONB,
    'Bệnh nhân chuyển tuyến điều trị giữa TP.HCM và các tỉnh lân cận.',
    12,
    TRUE,
    'none',
    NULL,
    '[]'::JSONB
),
-- Dịch vụ vận tải 4: Đưa đón tái khám định kỳ
(
    'trans-4',
    'transport',
    'dua-don-tai-kham',
    'Đưa Đón Tái Khám Định Kỳ',
    'Gói vận chuyển đưa đón khứ hồi theo lịch hẹn tái khám định kỳ của bác sĩ.',
    'Giải pháp trọn gói đưa bệnh nhân từ nhà đến bệnh viện tái khám và chờ đưa về sau khi khám xong, giúp gia đình chủ động thời gian mà không lo lắng về phương tiện đi lại.',
    'CalendarCheck',
    '["Lịch trình khứ hồi 2 chiều ưu đãi", "Tài xế kiên nhẫn chờ đợi trong suốt thời gian khám", "Nhắc lịch tái khám tự động trước 1 ngày", "Gói dịch vụ tiết kiệm cho bệnh nhân tái khám thường xuyên"]'::JSONB,
    'Bệnh nhân chạy thận, bệnh nhân ung thư hóa trị/xạ trị, tái khám định kỳ.',
    13,
    TRUE,
    'none',
    NULL,
    '[]'::JSONB
),
-- Dịch vụ vận tải 5: Vận chuyển theo yêu cầu riêng
(
    'trans-5',
    'transport',
    'van-chuyen-theo-yeu-cau',
    'Vận Chuyển Theo Yêu Cầu Riêng',
    'Cho thuê xe y tế đưa đón bệnh nhân thăm thân, về quê hoặc sự kiện y tế.',
    'Dịch vụ vận chuyển linh hoạt theo lộ trình cá nhân của gia đình bệnh nhân như đưa về quê nghỉ dưỡng, đi lại thăm hỏi người thân hay di chuyển giữa các cơ sở y tế theo mong muốn.',
    'Navigation',
    '["Lộ trình tùy chỉnh hoàn toàn theo yêu cầu", "Phục vụ chu đáo, nhiệt tình", "Báo giá minh bạch trước chuyến đi", "Đảm bảo an toàn tuyệt đối suốt hành trình"]'::JSONB,
    'Gia đình bệnh nhân có nhu cầu di chuyển đặc thù.',
    14,
    TRUE,
    'none',
    NULL,
    '[]'::JSONB
),
-- Dịch vụ vận tải 6: Dịch vụ xe tự lái
(
    'trans-6',
    'transport',
    'xe-tu-lai',
    'Dịch Vụ Xe Tự Lái',
    'Cho thuê xe tự lái phục vụ nhu cầu di chuyển linh hoạt của cá nhân và gia đình.',
    'Dịch vụ cho thuê xe tự lái với đa dạng các dòng xe từ 4 chỗ đến 7 chỗ đời mới. Thủ tục đơn giản, giao xe tận nơi, giúp khách hàng chủ động hoàn toàn trong việc di chuyển theo lộ trình riêng.',
    'Car',
    '["Đa dạng các dòng xe 4-7 chỗ đời mới", "Thủ tục thuê xe nhanh chóng, linh hoạt", "Giao nhận xe tận nhà theo yêu cầu", "Bảo hiểm 2 chiều, hỗ trợ kỹ thuật 24/7"]'::JSONB,
    'Người có bằng lái xe muốn chủ động di chuyển cá nhân hoặc cùng gia đình.',
    15,
    TRUE,
    'none',
    NULL,
    '[]'::JSONB
)
ON CONFLICT (slug) DO UPDATE SET
    category = EXCLUDED.category,
    title = EXCLUDED.title,
    short_desc = EXCLUDED.short_desc,
    full_desc = EXCLUDED.full_desc,
    icon = EXCLUDED.icon,
    features = EXCLUDED.features,
    target_info = EXCLUDED.target_info,
    sort_order = EXCLUDED.sort_order,
    is_published = EXCLUDED.is_published,
    action_type = EXCLUDED.action_type,
    zalo_url = EXCLUDED.zalo_url,
    price_images = EXCLUDED.price_images;

-- 3. SEED POSTS (Tin tức)
INSERT INTO public.posts (
    id,
    slug,
    title,
    category,
    excerpt,
    content,
    cover_image_url,
    author,
    status,
    published_at
) VALUES
(
    'news-1',
    'nhung-luu-y-khi-cham-soc-nguoi-cao-tuoi-tai-nha',
    'Những Lưu Ý Quan Trọng Khi Chăm Sóc Người Cao Tuổi Tại Nhà',
    'medical',
    'Chăm sóc sức khỏe người cao tuổi cần chú trọng chế độ dinh dưỡng, theo dõi huyết áp thường xuyên và tâm lý thoải mái.',
    '<p>Chăm sóc người cao tuổi tại nhà đòi hỏi sự kiên nhẫn, am hiểu tâm lý và kiến thức y tế cơ bản. Dưới đây là những lưu ý quan trọng giúp người thân bảo vệ sức khỏe cho ông bà, cha mẹ:</p><h3>1. Theo dõi các chỉ số sinh hiệu định kỳ</h3><p>Huyết áp, nhịp tim và chỉ số đường huyết là 3 yếu tố cần được đo đạc và ghi chép thường xuyên. Bất kỳ sự thay đổi đột ngột nào cũng có thể là dấu hiệu của biến chứng nguy hiểm.</p><h3>2. Chế độ dinh dưỡng cân bằng, dễ tiêu hóa</h3><p>Người cao tuổi thường có hệ tiêu hóa yếu hơn. Nên chuẩn bị thức ăn mềm, chia nhỏ bữa ăn trong ngày và giảm bớt lượng muối, đường.</p><h3>3. Tạo không gian sống an toàn, tránh trơn trượt</h3><p>Té ngã ở người cao tuổi rất nguy hiểm. Hãy đảm bảo sàn nhà vệ sinh luôn khô ráo, có tay vịn và đủ ánh sáng trong phòng ngủ.</p><p>Nếu gia đình bận rộn, việc đăng ký dịch vụ điều dưỡng chăm sóc tại nhà sẽ giúp người thân được theo dõi y tế chuyên nghiệp và chu đáo hơn.</p>',
    NULL,
    'BS. CKI Nguyễn Văn An',
    'published',
    '2026-10-02 00:00:00+00'
),
(
    'news-2',
    'quy-trinh-dua-don-benh-nhan-tai-kham-an-toan',
    'Quy Trình Chuẩn Chuẩn Bị Khi Đưa Đón Bệnh Nhân Tái Khám Bệnh Viện',
    'transport',
    'Hướng dẫn chuẩn bị hồ sơ y tế, phương tiện di chuyển và các lưu ý an toàn cho người bệnh trước ngày tái khám.',
    '<p>Mỗi chuyến đi tái khám bệnh viện thường ngốn rất nhiều thời gian và sức lực của bệnh nhân lẫn người nhà. Để chuyến đi diễn ra suôn sẻ, bạn nên chuẩn bị theo các bước sau:</p><h3>1. Đóng gói đầy đủ hồ sơ bệnh án</h3><p>Chuẩn bị sẵn sổ khám bệnh, đơn thuốc cũ, kết quả xét nghiệm, phim X-quang và thẻ BHYT vào một túi riêng để dễ tra cứu.</p><h3>2. Lựa chọn phương tiện vận chuyển chuyên dụng</h3><p>Với bệnh nhân khó vận động hoặc mới phẫu thuật, việc sử dụng xe y tế có băng ca và xe đẩy sẽ giúp tránh làm đau hay tổn thương vết mổ.</p><h3>3. Đặt lịch xe đúng giờ</h3><p>Nên đặt xe đón sớm hơn giờ hẹn khám từ 30-45 phút để chủ động làm thủ tục lấy số tại khoa khám bệnh.</p>',
    NULL,
    'Đội Ngũ Vận Tải Y Tế',
    'published',
    '2026-09-28 00:00:00+00'
),
(
    'news-3',
    'khi-nao-can-goi-dieu-duong-den-cham-soc-tai-nha',
    'Khi Nào Gia Đình Nên Gọi Điều Dưỡng Đến Khám & Chăm Sóc Tại Nhà?',
    'medical',
    'Nhận biết các trường hợp cần sự hỗ trợ của điều dưỡng y tế chuyên nghiệp thay vì tự chăm sóc tại gia.',
    '<p>Nhiều gia đình lúng túng khi người thân gặp các vấn đề sức khỏe cần xử lý kỹ thuật y tế. Dưới đây là các trường hợp bạn nên tìm đến dịch vụ điều dưỡng tại nhà:</p><ul><li>Bệnh nhân có vết mổ, vết thương hở cần thay băng rửa trùng hàng ngày.</li><li>Bệnh nhân cần tiêm thuốc hoặc truyền dịch theo y lệnh bác sĩ.</li><li>Bệnh nhân đang đặt sonde dạ dày, sonde tiểu cần vệ sinh và thay mới định kỳ.</li><li>Bệnh nhân tai biến cần người hỗ trợ tập vận động và chăm sóc sinh hoạt.</li></ul>',
    NULL,
    'ThS. ĐD Trần Thị Mai',
    'published',
    '2026-09-20 00:00:00+00'
),
(
    'news-4',
    'mo-rong-mang-luoi-xe-van-chuyen-y-te-khu-vuc-mien-tay',
    'Mở Rộng Mạng Lưới Xe Vận Chuyển Y Tế Phục Vụ Các Tỉnh Miền Tây',
    'company',
    'Tăng cường thêm dàn xe chuyên dụng sẵn sàng đưa đón bệnh nhân chuyển viện tuyến tỉnh về TP.HCM.',
    '<p>Nhằm đáp ứng nhu cầu di chuyển khám chữa bệnh ngày càng tăng của người dân các tỉnh Đồng bằng Sông Cửu Long, chúng tôi chính thức tăng cường đội xe vận chuyển y tế chuyên dụng phục vụ các tuyến Long An, Tiền Giang, Bến Tre, Cần Thơ về các bệnh viện lớn tại TP.HCM.</p><p>Các xe đều được trang bị hệ thống oxy, băng ca chống xóc và điều hòa khử khuẩn hiện đại, đảm bảo sự thoải mái tối đa cho người bệnh trên chặng đường dài.</p>',
    NULL,
    'Ban Truyền Thông',
    'published',
    '2026-09-15 00:00:00+00'
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    category = EXCLUDED.category,
    excerpt = EXCLUDED.excerpt,
    content = EXCLUDED.content,
    cover_image_url = EXCLUDED.cover_image_url,
    author = EXCLUDED.author,
    status = EXCLUDED.status,
    published_at = EXCLUDED.published_at;

-- 4. SEED JOBS (Tuyển dụng)
INSERT INTO public.jobs (
    id,
    slug,
    title,
    badge,
    short_desc,
    description,
    requirements,
    benefits,
    work_type,
    location,
    status,
    sort_order
) VALUES
(
    'ctv-y-te',
    'ctv-y-te',
    'Cộng Tác Viên Y Tế (Điều Dưỡng / Y Sĩ / Bác Sĩ)',
    'Y Tế',
    'Thực hiện chăm sóc y tế tại nhà, tiêm truyền theo y lệnh, hỗ trợ bệnh nhân tái khám.',
    'Tham gia đội ngũ Y tế tận tâm cung cấp các dịch vụ chăm sóc sức khỏe tại nhà cho bệnh nhân cao tuổi, bệnh nhân sau phẫu thuật hoặc hỗ trợ người bệnh tái khám tại các bệnh viện lớn.',
    '["Có bằng cấp/chứng chỉ hành nghề y tế hợp lệ", "Kỹ năng tiêm, truyền, thay băng vết thương thành thạo", "Tác phong nhanh nhẹn, giao tiếp lịch sự, có tâm với nghề", "Ưu tiên ứng viên có kinh nghiệm làm việc tại các BV hoặc phòng khám"]'::JSONB,
    '["Thu nhập hấp dẫn tính theo ca / lượt thăm khám (từ 8 - 15 triệu+/tháng)", "Thời gian làm việc linh hoạt, chủ động đăng ký ca", "Được trang bị dụng cụ y tế và đồng phục chuyên nghiệp", "Được đào tạo nâng cao kỹ năng điều dưỡng chuyên sâu"]'::JSONB,
    'Part-time / Theo ca / Tự do',
    'TP.HCM & Các tỉnh lân cận (Bình Dương, Đồng Nai, Long An)',
    'open',
    1
),
(
    'ctv-tai-xe',
    'ctv-tai-xe',
    'Cộng Tác Viên Tài Xế Vận Chuyển Y Tế (Part-Time)',
    'Vận Tải',
    'Đưa đón người bệnh đi khám, về nhà hoặc chuyển viện bằng xe chuyên dụng.',
    'Đảm nhận nhiệm vụ điều khiển xe đưa đón bệnh nhân di chuyển an toàn giữa Nhà ↔ Bệnh viện hoặc chuyển viện liên tỉnh. Hỗ trợ người bệnh lên xuống xe cẩn thận và ân cần.',
    '["Có Giấy phép lái xe (GPLX) hạng B2, C trở lên", "Kinh nghiệm lái xe an toàn từ 2 năm trở lên", "Có khả năng hỗ trợ bê giàn băng ca, xe đẩy hỗ trợ người bệnh", "Ưu tiên ứng viên có kiến thức sơ cấp cứu hoặc từng làm trong môi trường Y / Dược / Vận chuyển y tế"]'::JSONB,
    '["Thu nhập cao theo chuyến + phụ cấp hỗ trợ người bệnh", "Lịch nhận chuyến linh hoạt qua ứng dụng / nhóm thông báo", "Môi trường làm việc văn minh, đồng đội hỗ trợ nhiệt tình", "Được hướng dẫn kỹ năng giao tiếp và hỗ trợ y tế cơ bản"]'::JSONB,
    'Part-time / Theo chuyến',
    'Khu vực TP.HCM, Bình Dương, Đồng Nai, Long An',
    'open',
    2
),
(
    'ctv-truyen-thong',
    'ctv-truyen-thong',
    'Cộng Tác Viên Truyền Thông & Marketing',
    'Media & Marketing',
    'Sáng tạo nội dung, quản lý mạng xã hội, sản xuất video giới thiệu dịch vụ.',
    'Cùng xây dựng hình ảnh thương hiệu dịch vụ Y tế & Vận tải gần gũi, tin cậy thông qua các kênh truyền thông như Facebook, Zalo, TikTok, YouTube.',
    '["Yêu thích công việc sáng tạo nội dung (Content Writer, Video Creator, Designer)", "Có kinh nghiệm quản lý Fanpage, TikTok hoặc dựng video bằng CapCut/Premiere", "Hiểu biết cơ bản về lĩnh vực chăm sóc sức khỏe là một lợi thế lớn", "Có tinh thần trách nhiệm, chủ động và sáng tạo"]'::JSONB,
    '["Nhuận bút theo bài viết/video + Thưởng theo hiệu quả truyền thông", "Làm việc online 100%, không gò bó thời gian", "Được trải nghiệm thực tế công việc Marketing ngành Y tế", "Cơ hội trở thành Nhân viên chính thức"]'::JSONB,
    'Online / Freelance',
    'Toàn quốc (Ưu tiên TP.HCM)',
    'open',
    3
),
(
    'ctv-kinh-doanh',
    'ctv-kinh-doanh',
    'Cộng Tác Viên Phát Triển Kinh Doanh (Y Tế & Vận Tải)',
    'Kinh Doanh',
    'Kết nối khách hàng có nhu cầu sử dụng dịch vụ Y tế tại nhà hoặc Xe đưa đón y tế.',
    'Tìm kiếm, giới thiệu và tư vấn các gói dịch vụ y tế tại nhà hoặc giải pháp vận chuyển bệnh nhân cho cá nhân, gia đình hoặc các phòng khám đối tác.',
    '["Có mạng lưới mối quan hệ rộng rãi hoặc khả năng tìm kiếm khách hàng tốt", "Giao tiếp tốt, thái độ tư vấn lịch sự, nhã nhặn", "Không yêu cầu bằng cấp, sẽ được hướng dẫn chi tiết về thông tin dịch vụ", "Trung thực, trách nhiệm với thông tin cung cấp cho khách hàng"]'::JSONB,
    '["Chiết khấu hoa hồng cao trên từng hợp đồng / lượt đăng ký dịch vụ", "Không áp doanh số tối thiểu, làm nhiều hưởng nhiều", "Được cung cấp đầy đủ tài liệu, brochure, tài nguyên truyền thông", "Thưởng nóng khi đạt mốc số lượng khách hàng xuất sắc"]'::JSONB,
    'Linh hoạt / Freelance',
    'Toàn quốc',
    'open',
    4
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    badge = EXCLUDED.badge,
    short_desc = EXCLUDED.short_desc,
    description = EXCLUDED.description,
    requirements = EXCLUDED.requirements,
    benefits = EXCLUDED.benefits,
    work_type = EXCLUDED.work_type,
    location = EXCLUDED.location,
    status = EXCLUDED.status,
    sort_order = EXCLUDED.sort_order;

