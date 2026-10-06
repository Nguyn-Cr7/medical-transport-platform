export function formatDate(dateString: string): string {
  try {
    return new Date(dateString).toLocaleString('vi-VN');
  } catch {
    return dateString;
  }
}
