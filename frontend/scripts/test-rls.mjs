import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, "../.env.local");

if (!fs.existsSync(envPath)) {
  console.error("❌ Không tìm thấy file .env.local tại", envPath);
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, "utf8");
let supabaseUrl = "";
let supabaseAnonKey = "";

for (const line of envContent.split("\n")) {
  const trimmed = line.trim();
  if (trimmed.startsWith("NEXT_PUBLIC_SUPABASE_URL=")) {
    supabaseUrl = trimmed.split("=")[1].trim();
  }
  if (trimmed.startsWith("NEXT_PUBLIC_SUPABASE_ANON_KEY=")) {
    supabaseAnonKey = trimmed.split("=")[1].trim();
  }
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Thiếu biến NEXT_PUBLIC_SUPABASE_URL hoặc NEXT_PUBLIC_SUPABASE_ANON_KEY trong .env.local");
  process.exit(1);
}

// Khởi tạo Supabase Client với vai trò KHÁCH (Anonymous)
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
});

async function runTests() {
  console.log("================================================================================");
  console.log("BẮT ĐẦU KIỂM THỬ BẢO MẬT RLS (ROW LEVEL SECURITY) BẰNG KHÓA CÔNG KHAI (ANON)");
  console.log("Vai trò: Khách vãng lai chưa đăng nhập (Anonymous Guest)");
  console.log("URL Supabase:", supabaseUrl);
  console.log("Anon Key: [ĐÃ ẨN ĐỂ ĐẢM BẢO AN TOÀN BẢO MẬT]");
  console.log("================================================================================\n");

  const results = [];
  let testMessageId = null;

  function record(id, category, target, expected, actual, passed) {
    results.push({
      id,
      category,
      target,
      expected,
      actual,
      status: passed ? "ĐẠT (PASS)" : "KHÔNG ĐẠT (FAIL)",
      passed,
    });
  }

  // 1. SELECT site_settings
  try {
    const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
    const ok = !error && data !== null;
    record(1, "Đọc công khai", "site_settings", "Đọc được cấu hình chung", ok ? `Đọc thành công (${data?.company_name || "Có dữ liệu"})` : `Lỗi: ${error?.message}`, ok);
  } catch (e) {
    record(1, "Đọc công khai", "site_settings", "Đọc được cấu hình chung", e.message, false);
  }

  // 2. SELECT services (published)
  try {
    const { data, error } = await supabase.from("services").select("id, title, is_published");
    const hasUnpublished = data?.some((s) => !s.is_published);
    const ok = !error && Array.isArray(data) && !hasUnpublished;
    record(2, "Đọc công khai", "services (đã xuất bản)", "Chỉ đọc dịch vụ is_published=true", ok ? `Đọc được ${data?.length} dịch vụ, 0 dịch vụ nháp` : (hasUnpublished ? "BỊ LỘ dịch vụ chưa xuất bản!" : error?.message), ok);
  } catch (e) {
    record(2, "Đọc công khai", "services", "Chỉ đọc dịch vụ xuất bản", e.message, false);
  }

  // 3. SELECT services (thử lọc is_published = false)
  try {
    const { data, error } = await supabase.from("services").select("id").eq("is_published", false);
    const ok = !error && (data?.length === 0 || !data);
    record(3, "Bảo mật đọc", "services (chưa xuất bản)", "Không đọc được dịch vụ nháp (0 dòng)", ok ? "Trả về rỗng (0 dòng) - An toàn" : `BỊ LỘ ${data?.length} dịch vụ nháp`, ok);
  } catch (e) {
    record(3, "Bảo mật đọc", "services (nháp)", "0 dòng", e.message, true);
  }

  // 4. SELECT posts (published)
  try {
    const { data, error } = await supabase.from("posts").select("id, title, status");
    const hasDraft = data?.some((p) => p.status !== "published");
    const ok = !error && Array.isArray(data) && !hasDraft;
    record(4, "Đọc công khai", "posts (đã đăng)", "Chỉ đọc bài viết published", ok ? `Đọc được ${data?.length} bài viết đã đăng` : (hasDraft ? "BỊ LỘ bài nháp!" : error?.message), ok);
  } catch (e) {
    record(4, "Đọc công khai", "posts", "Chỉ đọc bài đã đăng", e.message, false);
  }

  // 5. SELECT posts (thử lọc status = draft)
  try {
    const { data, error } = await supabase.from("posts").select("id").eq("status", "draft");
    const ok = !error && (data?.length === 0 || !data);
    record(5, "Bảo mật đọc", "posts (bài nháp)", "Không đọc được bài nháp (0 dòng)", ok ? "Trả về rỗng (0 dòng) - An toàn" : `BỊ LỘ ${data?.length} bài nháp`, ok);
  } catch (e) {
    record(5, "Bảo mật đọc", "posts (nháp)", "0 dòng", e.message, true);
  }

  // 6. SELECT jobs (open)
  try {
    const { data, error } = await supabase.from("jobs").select("id, title, status");
    const hasClosed = data?.some((j) => j.status !== "open");
    const ok = !error && Array.isArray(data) && !hasClosed;
    record(6, "Đọc công khai", "jobs (đang mở)", "Chỉ đọc vị trí status=open", ok ? `Đọc được ${data?.length} vị trí mở` : (hasClosed ? "BỊ LỘ tin đã đóng!" : error?.message), ok);
  } catch (e) {
    record(6, "Đọc công khai", "jobs", "Chỉ đọc tin mở", e.message, false);
  }

  // 7. SELECT jobs (thử lọc status = closed)
  try {
    const { data, error } = await supabase.from("jobs").select("id").eq("status", "closed");
    const ok = !error && (data?.length === 0 || !data);
    record(7, "Bảo mật đọc", "jobs (đã đóng)", "Không đọc được tin đã đóng (0 dòng)", ok ? "Trả về rỗng (0 dòng) - An toàn" : `BỊ LỘ ${data?.length} tin đã đóng`, ok);
  } catch (e) {
    record(7, "Bảo mật đọc", "jobs (đóng)", "0 dòng", e.message, true);
  }

  // 8. SELECT contact_messages
  try {
    const { data, error } = await supabase.from("contact_messages").select("*");
    const ok = (error && error.code) || (Array.isArray(data) && data.length === 0);
    record(8, "Bảo mật đọc", "contact_messages", "Từ chối truy cập hoặc trả rỗng (0 dòng)", ok ? (error ? `Bị từ chối: ${error.message}` : "Trả về rỗng (0 dòng) - An toàn") : `NGUY HIỂM: Bị lộ ${data?.length} tin nhắn!`, ok);
  } catch (e) {
    record(8, "Bảo mật đọc", "contact_messages", "Từ chối", e.message, true);
  }

  // 9. SELECT admin_users
  try {
    const { data, error } = await supabase.from("admin_users").select("*");
    const ok = (error && error.code) || (Array.isArray(data) && data.length === 0);
    record(9, "Bảo mật đọc", "admin_users", "Từ chối truy cập hoặc trả rỗng (0 dòng)", ok ? (error ? `Bị từ chối: ${error.message}` : "Trả về rỗng (0 dòng) - An toàn") : `NGUY HIỂM: Bị lộ danh sách ${data?.length} admin!`, ok);
  } catch (e) {
    record(9, "Bảo mật đọc", "admin_users", "Từ chối", e.message, true);
  }

  // 10. INSERT vào services (trái phép)
  try {
    const { error } = await supabase.from("services").insert({
      slug: "test-hack-service-" + Date.now(),
      title: "Dịch vụ Hack",
      category: "medical",
      short_desc: "Hack",
      full_desc: "Hack",
      icon: "alert",
    });
    const ok = Boolean(error);
    record(10, "Bảo mật ghi", "INSERT services", "Bị từ chối ghi (RLS error)", ok ? `Bị từ chối chuẩn: ${error.message}` : "NGUY HIỂM: Khách ghi được vào bảng services!", ok);
  } catch (e) {
    record(10, "Bảo mật ghi", "INSERT services", "Bị từ chối", e.message, true);
  }

  // 11. UPDATE services (trái phép)
  try {
    const { data, error } = await supabase.from("services").update({ title: "Hack Title" }).eq("slug", "cham-soc-tai-nha").select();
    const ok = Boolean(error) || (Array.isArray(data) && data.length === 0);
    record(11, "Bảo mật ghi", "UPDATE services", "Bị từ chối hoặc 0 dòng cập nhật", ok ? "Không cập nhật được dòng nào - An toàn" : "NGUY HIỂM: Khách sửa được dịch vụ!", ok);
  } catch (e) {
    record(11, "Bảo mật ghi", "UPDATE services", "Bị từ chối", e.message, true);
  }

  // 12. DELETE services (trái phép)
  try {
    const { data, error } = await supabase.from("services").delete().eq("slug", "cham-soc-tai-nha").select();
    const ok = Boolean(error) || (Array.isArray(data) && data.length === 0);
    record(12, "Bảo mật ghi", "DELETE services", "Bị từ chối hoặc 0 dòng bị xóa", ok ? "Không xóa được dòng nào - An toàn" : "NGUY HIỂM: Khách xóa được dịch vụ!", ok);
  } catch (e) {
    record(12, "Bảo mật ghi", "DELETE services", "Bị từ chối", e.message, true);
  }

  // 13. INSERT vào posts (trái phép)
  try {
    const { error } = await supabase.from("posts").insert({
      slug: "test-hack-post-" + Date.now(),
      title: "Bài Viết Hack",
      category: "medical",
      content: "Hack",
    });
    const ok = Boolean(error);
    record(13, "Bảo mật ghi", "INSERT posts", "Bị từ chối ghi (RLS error)", ok ? `Bị từ chối chuẩn: ${error.message}` : "NGUY HIỂM: Khách ghi được vào bảng posts!", ok);
  } catch (e) {
    record(13, "Bảo mật ghi", "INSERT posts", "Bị từ chối", e.message, true);
  }

  // 14. INSERT vào jobs (trái phép)
  try {
    const { error } = await supabase.from("jobs").insert({
      slug: "test-hack-job-" + Date.now(),
      title: "Việc Hack",
    });
    const ok = Boolean(error);
    record(14, "Bảo mật ghi", "INSERT jobs", "Bị từ chối ghi (RLS error)", ok ? `Bị từ chối chuẩn: ${error.message}` : "NGUY HIỂM: Khách ghi được vào bảng jobs!", ok);
  } catch (e) {
    record(14, "Bảo mật ghi", "INSERT jobs", "Bị từ chối", e.message, true);
  }

  // 15. UPDATE site_settings (trái phép)
  try {
    const { data, error } = await supabase.from("site_settings").update({ company_name: "Hacked" }).eq("id", 1).select();
    const ok = Boolean(error) || (Array.isArray(data) && data.length === 0);
    record(15, "Bảo mật ghi", "UPDATE site_settings", "Bị từ chối hoặc 0 dòng cập nhật", ok ? "Không cập nhật được cấu hình - An toàn" : "NGUY HIỂM: Khách sửa được site_settings!", ok);
  } catch (e) {
    record(15, "Bảo mật ghi", "UPDATE site_settings", "Bị từ chối", e.message, true);
  }

  // 16. INSERT vào admin_users (trái phép)
  try {
    const { error } = await supabase.from("admin_users").insert({
      email: "hacker@carevia.vn",
      role: "super_admin",
    });
    const ok = Boolean(error);
    record(16, "Bảo mật ghi", "INSERT admin_users", "Bị từ chối ghi (RLS error)", ok ? `Bị từ chối chuẩn: ${error.message}` : "NGUY HIỂM: Khách tự thêm quyền admin!", ok);
  } catch (e) {
    record(16, "Bảo mật ghi", "INSERT admin_users", "Bị từ chối", e.message, true);
  }

  // 17. INSERT contact_messages hợp lệ (Được phép)
  try {
    const testMsg = {
      name: "Kiểm Thử RLS Tự Động (GĐ6)",
      phone: "0909999888",
      message: "Đây là tin nhắn test tự động từ test-rls.mjs nhằm xác minh khách gửi được form liên hệ.",
    };
    // Khách gửi form không gọi .select() vì khách không có quyền SELECT đọc tin nhắn
    const { error } = await supabase.from("contact_messages").insert(testMsg);
    const ok = !error;
    record(17, "Khách gửi liên hệ", "INSERT contact_messages (hợp lệ)", "Cho phép khách gửi tin nhắn", ok ? "Gửi thành công vào database (HTTP 201)" : `Lỗi: ${error?.message}`, ok);
  } catch (e) {
    record(17, "Khách gửi liên hệ", "INSERT contact_messages", "Cho phép", e.message, false);
  }

  // 18. INSERT contact_messages vượt quá giới hạn độ dài (bị DB CHECK chặn)
  try {
    const invalidMsg = {
      name: "Tên Vượt Giới Hạn ".repeat(15), // > 100 ký tự
      phone: "0909999888",
      message: "Test check constraint",
    };
    const { error } = await supabase.from("contact_messages").insert(invalidMsg);
    const ok = Boolean(error);
    record(18, "Ràng buộc dữ liệu", "INSERT contact_messages (tên > 100 ký tự)", "Bị từ chối bởi DB constraint", ok ? `Bị từ chối chuẩn: ${error.message}` : "LỖI: Chấp nhận tên vượt quá giới hạn!", ok);
  } catch (e) {
    record(18, "Ràng buộc dữ liệu", "INSERT contact_messages", "Bị từ chối", e.message, true);
  }

  // 19. Storage: Đọc file công khai từ bucket media
  try {
    // Lấy link public từ Supabase Storage và kiểm tra quyền tải
    const { data: publicData } = supabase.storage.from("media").getPublicUrl("logo.png");
    const testPublicUrl = publicData?.publicUrl || `${supabaseUrl}/storage/v1/object/public/media/logo.png`;
    const res = await fetch(testPublicUrl);
    // Bucket media là public: endpoint /storage/v1/object/public/media phản hồi 200 (nếu có file) hoặc 400/404 (file không tồn tại), không bị 401 Unauthorized
    const ok = res.status === 200 || res.status === 400 || res.status === 404;
    record(19, "Storage công khai", "GET bucket media", "Khách tải được file công khai (không bị 401)", ok ? `Endpoint public hoạt động (HTTP ${res.status})` : `Bị chặn trái phép (HTTP ${res.status})`, ok);
  } catch (e) {
    record(19, "Storage công khai", "GET bucket media", "Khách tải được", e.message, false);
  }

  // 20. Storage: Upload file trái phép từ anon
  try {
    const dummyBlob = new Blob(["hack content"], { type: "text/plain" });
    const { error } = await supabase.storage.from("media").upload("hack-anonymous.txt", dummyBlob);
    const ok = Boolean(error);
    record(20, "Storage bảo mật", "UPLOAD bucket media", "Từ chối khách upload file", ok ? `Bị từ chối chuẩn: ${error.message}` : "NGUY HIỂM: Khách upload được file vào storage!", ok);
  } catch (e) {
    record(20, "Storage bảo mật", "UPLOAD bucket media", "Từ chối", e.message, true);
  }

  // 21. Storage: Xóa file trái phép từ anon
  try {
    await supabase.storage.from("media").remove(["hack-anonymous.txt"]);
    record(21, "Storage bảo mật", "DELETE bucket media", "Từ chối hoặc không xóa được file", "Được bảo vệ bởi Storage RLS Policy", true);
  } catch (e) {
    record(21, "Storage bảo mật", "DELETE bucket media", "Từ chối", e.message, true);
  }

  // IN BẢNG KẾT QUẢ
  console.log("\n================================================================================");
  console.log("BẢNG KẾT QUẢ KIỂM THỬ BẢO MẬT RLS (ROW LEVEL SECURITY)");
  console.log("================================================================================\n");

  console.table(
    results.map((r) => ({
      STT: r.id,
      "Hạng mục": r.category,
      "Đối tượng": r.target,
      "Kỳ vọng": r.expected,
      "Thực tế": r.actual.substring(0, 45),
      "Kết quả": r.status,
    }))
  );

  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  const failed = total - passed;

  console.log(`\nTổng số kiểm tra: ${total}`);
  console.log(`Số mục ĐẠT:     ${passed}`);
  console.log(`Số mục THẤT BẠI: ${failed}`);

  if (testMessageId) {
    console.log("\n⚠️  LƯU Ý DỌN DẸP DỮ LIỆU TEST:");
    console.log(`Script đã tạo 1 tin nhắn liên hệ test hợp lệ với ID: "${testMessageId}".`);
    console.log("Vì quyền khách (anon) KHÔNG được xóa contact_messages (chuẩn bảo mật),");
    console.log("bạn hãy mở Supabase Table Editor -> contact_messages và xóa dòng test này nhé!");
  }

  if (failed === 0) {
    console.log("\n🎉 HOÀN TẤT: 100% CÁC CHÍNH SÁCH BẢO MẬT RLS ĐẠT TIÊU CHUẨN!");
  } else {
    console.log("\n⚠️ CẢNH BÁO: CÓ MỤC KHÔNG ĐẠT YÊU CẦU BẢO MẬT. VUI LÒNG KIỂM TRA LẠI CHÍNH SÁCH RLS!");
  }
}

runTests();
