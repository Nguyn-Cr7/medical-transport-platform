/**
 * Chuyển đổi chuỗi tiếng Việt thành slug URL chuẩn SEO:
 * - Bỏ dấu tiếng Việt đầy đủ (kể cả đ, Đ)
 * - Chuyển chữ thường
 * - Thay khoảng trắng và ký tự đặc biệt bằng gạch nối '-'
 * - Loại bỏ gạch nối thừa ở đầu/cuối và các gạch nối liên tiếp
 */
export function slugify(text: string): string {
  if (!text) return "";

  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Bỏ dấu thanh, dấu mũ
    .replace(/[đĐ]/g, "d")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // Bỏ ký tự đặc biệt
    .replace(/[\s_]+/g, "-") // Thay khoảng trắng/gạch dưới bằng gạch nối
    .replace(/-+/g, "-") // Rút gọn nhiều gạch nối liên tiếp
    .replace(/^-+|-+$/g, ""); // Cắt gạch nối ở đầu và cuối
}

/**
 * Kiểm tra xem một chuỗi slug có hợp lệ theo chuẩn URL không
 */
export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

