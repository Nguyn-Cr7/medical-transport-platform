# HƯỚNG DẪN HỆ THỐNG CMS CAREVIA (NEXT.JS + SUPABASE)

Tài liệu hướng dẫn vận hành, bảo trì và triển khai hệ thống quản trị nội dung (CMS) cho nền tảng CAREVIA.

---

## 1. TỔNG QUAN KIẾN TRÚC HỆ THỐNG

- **Frontend Framework**: Next.js 16 (App Router, Turbopack, React 19, Tailwind CSS v4).
- **Backend & Cơ sở dữ liệu**: Supabase (PostgreSQL, Supabase Auth, Supabase Storage, Row Level Security - RLS).
- **Bảo mật phân quyền (RLS)**:
  - Khách vãng lai (Anonymous Client - anon key) chỉ được đọc dữ liệu đã xuất bản (`is_published = true`, `status = 'published'`, `status = 'open'`) và chỉ được phép gửi biểu mẫu liên hệ (`INSERT contact_messages`).
  - Quyền ghi dữ liệu (INSERT, UPDATE, DELETE) được kiểm soát nghiêm ngặt qua phiên đăng nhập của quản trị viên (`auth.uid()`) kết hợp bảng kiểm tra `admin_users` (`is_admin()`).
  - Toàn bộ Server Action đều gọi `verifyAdmin()` trước khi thực hiện ghi dữ liệu. Tuyệt đối **không sử dụng Service Role Key** ở phía frontend.
- **Cơ chế Caching & Hiệu năng**:
  - Dữ liệu công khai áp dụng Next.js ISR (Incremental Static Regeneration) với chu kỳ làm mới nền mặc định `revalidate = 60s`.
  - Hỗ trợ On-demand Revalidation (`revalidateTag`, `updateTag`, `revalidatePath`): Khi Admin lưu bài viết, chỉnh sửa dịch vụ hoặc cấu hình, website sẽ làm mới dữ liệu tức thì.
- **Cơ chế Dự phòng (Fallback Data)**:
  - Nếu kết nối Supabase gặp sự cố hoặc chưa cấu hình biến môi trường, hệ thống tự động chuyển sang đọc dữ liệu tĩnh trong `src/data/*.ts`, đảm bảo website không bao giờ bị sập trắng trang.

---

## 2. CHẠY DỰ ÁN Ở MÔI TRƯỜNG LOCAL

### 2.1. Cài đặt biến môi trường
Tạo file `frontend/.env.local` (được bảo vệ trong `.gitignore`, không commit lên git):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-publishable-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 2.2. Khởi chạy
Trong thư mục `frontend/`:
```bash
npm install
npm run dev
```
Truy cập:
- Website công khai: `http://localhost:3000`
- Cổng quản trị CMS: `http://localhost:3000/admin` (Đăng nhập tại `/admin/login`)

---

## 3. THIẾT LẬP SUPABASE TỪ ĐẦU

### Bước 1: Tạo bảng & Chính sách bảo mật
- Mở **Supabase Dashboard** -> vào mục **SQL Editor**.
- Dán toàn bộ nội dung file `frontend/supabase/schema.sql` và bấm **Run**.

### Bước 2: Nạp dữ liệu mẫu ban đầu (CHỈ CHẠY 1 LẦN)
- Dán toàn bộ nội dung file `frontend/supabase/seed.sql` và bấm **Run**.
- ⚠️ **CẢNH BÁO QUAN TRỌNG**: Chỉ chạy file `seed.sql` **duy nhất một lần** khi khởi tạo dự án. Sau khi Admin đã bắt đầu chỉnh sửa nội dung thật trên giao diện web, **tuyệt đối không chạy lại `seed.sql`** vì câu lệnh sẽ ghi đè dữ liệu cũ.

### Bước 3: Tạo tài khoản Quản trị viên đầu tiên
1. Vào mục **Authentication** -> **Users** -> bấm **Add User** -> **Create User**.
2. Điền Email (ví dụ: `admin@carevia.vn`) và Mật khẩu an toàn.
3. Vào lại **SQL Editor**, chạy câu lệnh sau để cấp quyền quản trị:
   ```sql
   INSERT INTO public.admin_users (user_id)
   SELECT id FROM auth.users WHERE email = 'admin@carevia.vn'
   ON CONFLICT (user_id) DO NOTHING;
   ```
4. Vào **Authentication** -> **Sign In / Providers** -> **Email**: Nên tắt tùy chọn *"Enable Sign up"* để ngăn người ngoài tự tạo tài khoản.

---

## 4. QUẢN LÝ QUẢN TRỊ VIÊN (ADMIN)

- **Thêm Admin thứ hai**:
  1. Tạo tài khoản trong **Authentication** -> **Users**.
  2. Gán quyền admin bằng SQL:
     ```sql
     INSERT INTO public.admin_users (user_id)
     SELECT id FROM auth.users WHERE email = 'admin2@carevia.vn';
     ```
- **Đổi mật khẩu / Xóa tài khoản Admin**:
  - Thực hiện trực tiếp tại giao diện **Supabase Dashboard** -> **Authentication** -> **Users** -> bấm vào dấu ba chấm `...` cạnh tài khoản cần thao tác để gửi email Reset Password hoặc xóa tài khoản.
- **Thu hồi quyền Admin (không xóa tài khoản đăng nhập)**:
  - Chỉ cần xóa dòng tương ứng trong bảng `admin_users`:
    ```sql
    DELETE FROM public.admin_users 
    WHERE user_id = (SELECT id FROM auth.users WHERE email = 'admin2@carevia.vn');
    ```

---

## 5. HƯỚNG DẪN SỬ DỤNG CHO QUẢN TRỊ VIÊN (NON-TECH)

1. **Cấu hình Website & Hotline / Zalo** (`/admin/settings`):
   - Cập nhật Hotline, Số điện thoại hỗ trợ, Link chat Zalo, Địa chỉ công ty và Logo thương hiệu.
   - Thêm / thay đổi **Ảnh Banner Trang Chủ (Hero Image)** nằm cạnh tiêu đề chính.
2. **Quản lý Dịch vụ Y tế & Tuyến xe Vận chuyển** (`/admin/medical` & `/admin/transport`):
   - Thêm mới, chỉnh sửa nội dung mô tả, tính năng và mục tiêu phục vụ.
   - Bật/tắt trạng thái xuất bản tức thì.
   - Dùng nút mũi tên Lên/Xuống để sắp xếp thứ tự hiển thị ưu tiên trên trang chủ.
   - **Bảng giá nhiều cặp ảnh (Dịch vụ Xét nghiệm)**: Cho phép thêm linh hoạt các cặp ảnh bảng giá (Mặt trước - Mặt sau) theo từng gói khám, hỗ trợ xem trước và phóng to qua Lightbox.
3. **Quản lý Tin tức & Bài viết** (`/admin/posts`):
   - Soạn thảo trực quan với trình soạn thảo WYSIWYG: Tiêu đề H2/H3, in đậm, in nghiêng, danh sách số/gạch đầu dòng, trích dẫn, chèn link và chèn ảnh trực tiếp từ Thư viện media.
   - Hỗ trợ trạng thái **Nháp**, **Đã đăng**, và **Hẹn giờ đăng bài** (chọn ngày giờ tương lai; hệ thống tự động xuất bản khi đến giờ).
   - Tự động tính toán thời gian đọc (ví dụ: "3 phút đọc") dựa trên độ dài bài viết.
4. **Quản lý Tuyển dụng** (`/admin/jobs`):
   - Đăng tin tuyển dụng nhân sự (Điều dưỡng, Tài xế, CTV...), thêm các dòng yêu cầu và quyền lợi linh hoạt.
   - Khi đã tuyển đủ nhân sự, bấm nút chuyển trạng thái sang **Đã đóng** để tạm ẩn tin khỏi trang `/careers`.
5. **Hộp thư Liên hệ** (`/admin/contact`):
   - Xem danh sách tin nhắn gửi về từ khách hàng.
   - Bấm vào từng tin để xem chi tiết, bấm nút gọi điện thoại nhanh (`tel:`) hoặc nút mở cửa sổ chat Zalo kết nối trực tiếp với số điện thoại khách hàng.
   - Đánh dấu đã đọc hoặc dọn dẹp các tin nhắn rác.

---

## 6. CHECKLIST TRIỂN KHAI LÊN VERCEL

*(Quản trị viên tự thực hiện trên Vercel Dashboard, dự án đã sẵn sàng)*

- [ ] **1. Cấu hình Biến môi trường trên Vercel**:
  - Vào **Project Settings** -> **Environment Variables**, thêm:
    - `NEXT_PUBLIC_SUPABASE_URL`: URL project Supabase.
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Khóa công khai publishable anon.
    - `NEXT_PUBLIC_SITE_URL`: Domain thực tế (ví dụ: `https://carevia.vn`).
  - *Lưu ý*: Nếu dùng tính năng tích hợp Supabase của Vercel, Vercel có thể tự động sinh các biến `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` hoặc `SUPABASE_SERVICE_ROLE_KEY`. Hãy đảm bảo cấu hình đúng biến `NEXT_PUBLIC_SUPABASE_ANON_KEY` và **xóa các biến Service Role Key** thừa để bảo đảm an toàn.
- [ ] **2. Cấu hình Supabase Auth Redirect URLs**:
  - Vào **Supabase Dashboard** -> **Authentication** -> **URL Configuration**:
    - **Site URL**: `https://carevia.vn` (hoặc tên miền chính của bạn).
    - **Redirect URLs**: Thêm `https://carevia.vn/**` và domain preview `https://*.vercel.app/**`.
- [ ] **3. Cấu hình Build & Deploy**:
  - Root directory: `frontend`
  - Build command: `npm run build`
  - Output directory: `.next` (Không cần cấu hình `output: export`, hệ thống chạy Node.js Serverless chuẩn).
- [ ] **4. Kiểm tra bản Preview**:
  - Triển khai bản xem trước (Preview Deployment), đăng nhập thử vào `/admin`, test upload ảnh và kiểm tra hiển thị trang chủ.
- [ ] **5. Lưu ý gói Supabase Free**:
  - Các dự án gói miễn phí (Free Tier) sẽ **tự động tạm dừng (pause)** nếu không có lưu lượng truy cập trong 7 ngày liên tiếp. Khi bị tạm dừng, chỉ cần vào Supabase Dashboard bấm nút **Restore** để kích hoạt lại.
  - Định kỳ sao lưu dữ liệu: Vào **Table Editor** xuất file CSV/JSON hoặc dùng `pg_dump` để lưu trữ dữ liệu an toàn.

---

## 7. CÁC GIỚI HẠN ĐÃ BIẾT (KNOWN LIMITATIONS)

1. **Chống spam Form liên hệ**: Hiện tại form liên hệ đã được trang bị trường Honeypot ẩn và giới hạn độ dài ký tự ở tầng cơ sở dữ liệu. Để chống bot tự động triệt để hơn trong tương lai, có thể tích hợp thêm Cloudflare Turnstile hoặc Google reCAPTCHA v3.
2. **Độ trễ bài viết hẹn giờ**: Do cơ chế ISR làm mới trang nền định kỳ 60 giây, bài viết đặt lịch hẹn giờ sẽ xuất hiện trên trang tin tức công khai trong khoảng thời gian từ 0 đến 60 giây sau khi đến mốc giờ quy định.
3. **Dọn dẹp hình ảnh trong Storage**: Khi xóa bài viết hoặc xóa dịch vụ, các tệp ảnh đính kèm vẫn được lưu trong Storage bucket `media` để tránh ảnh hưởng đến những bài viết khác có thể đang dùng chung ảnh. Quản trị viên có thể dọn dẹp các tệp ảnh không còn sử dụng tại trang Quản lý hình ảnh (`/admin/media`).

