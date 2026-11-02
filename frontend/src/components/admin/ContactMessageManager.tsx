"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  MessageSquare,
  Phone,
  Clock,
  Trash2,
  CheckCircle2,
  MailOpen,
  Mail,
  Loader2,
  AlertCircle,
  RefreshCw,
  Search,
  ExternalLink,
  X,
} from "lucide-react";
import type { ContactMessage } from "@/types/content";
import {
  getAdminContactMessagesAction,
  markContactMessageReadAction,
  markAllContactMessagesReadAction,
  deleteContactMessageAction,
} from "@/app/admin/(dashboard)/contact/actions";

export function ContactMessageManager() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter & Search
  const [filterRead, setFilterRead] = useState<"all" | "unread" | "read">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal Xem Chi Tiết
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  // Modal Xóa
  const [messageToDelete, setMessageToDelete] = useState<ContactMessage | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 4000);
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAdminContactMessagesAction();
      if (res.success && res.data) {
        setMessages(res.data);
      } else {
        setError(res.message || "Không thể tải danh sách tin nhắn.");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Đã có lỗi xảy ra.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    getAdminContactMessagesAction()
      .then((res) => {
        if (!ignore) {
          if (res.success && res.data) {
            setMessages(res.data);
          } else {
            setError(res.message || "Không thể tải danh sách tin nhắn.");
          }
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Đã có lỗi xảy ra.");
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  // Đánh dấu đã đọc / chưa đọc
  const handleToggleRead = async (item: ContactMessage, targetState?: boolean) => {
    if (!item.id) return;
    const newState = targetState !== undefined ? targetState : !item.isRead;

    // Optimistic update
    setMessages((prev) =>
      prev.map((m) => (m.id === item.id ? { ...m, isRead: newState } : m))
    );
    if (selectedMessage && selectedMessage.id === item.id) {
      setSelectedMessage((prev) => (prev ? { ...prev, isRead: newState } : null));
    }

    const res = await markContactMessageReadAction(item.id, newState);
    if (!res.success) {
      showToast("error", res.message);
      void loadData();
    }
  };

  // Đánh dấu tất cả đã đọc
  const handleMarkAllRead = async () => {
    setMessages((prev) => prev.map((m) => ({ ...m, isRead: true })));
    const res = await markAllContactMessagesReadAction();
    if (res.success) {
      showToast("success", res.message);
    } else {
      showToast("error", res.message);
      void loadData();
    }
  };

  // Mở chi tiết và tự động đánh dấu đã đọc
  const handleOpenDetail = (item: ContactMessage) => {
    setSelectedMessage(item);
    if (!item.isRead && item.id) {
      void handleToggleRead(item, true);
    }
  };

  // Xác nhận xóa
  const handleConfirmDelete = async () => {
    if (!messageToDelete || !messageToDelete.id) return;
    setIsDeleting(true);

    const res = await deleteContactMessageAction(messageToDelete.id);
    if (res.success) {
      showToast("success", res.message);
      setMessages((prev) => prev.filter((m) => m.id !== messageToDelete.id));
      if (selectedMessage?.id === messageToDelete.id) {
        setSelectedMessage(null);
      }
      setMessageToDelete(null);
    } else {
      showToast("error", res.message);
    }
    setIsDeleting(false);
  };

  // Filtered messages
  const filteredMessages = useMemo(() => {
    return messages.filter((m) => {
      const matchSearch =
        !searchQuery.trim() ||
        m.name.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
        m.phone.includes(searchQuery.trim()) ||
        m.message.toLowerCase().includes(searchQuery.trim().toLowerCase());

      let matchFilter = true;
      if (filterRead === "unread") matchFilter = !m.isRead;
      else if (filterRead === "read") matchFilter = Boolean(m.isRead);

      return matchSearch && matchFilter;
    });
  }, [messages, searchQuery, filterRead]);

  const unreadCount = useMemo(() => messages.filter((m) => !m.isRead).length, [messages]);

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium transition-all ${
            toast.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          {toast.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Tin Nhắn Liên Hệ
            </h1>
            {unreadCount > 0 ? (
              <span className="bg-red-50 text-red-700 border border-red-200 font-bold text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                {unreadCount} chưa đọc
              </span>
            ) : (
              <span className="bg-emerald-50 text-emerald-700 font-bold text-xs px-2.5 py-1 rounded-full">
                Tất cả đã đọc
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Danh sách yêu cầu tư vấn và đăng ký từ khách hàng gửi qua biểu mẫu liên hệ trên website.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => void loadData()}
            title="Tải lại danh sách"
            className="p-2.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <RefreshCw size={18} className={loading ? "animate-spin text-brand-primary" : ""} />
          </button>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={() => void handleMarkAllRead()}
              className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer"
            >
              <CheckCircle2 size={16} />
              <span>Đánh dấu tất cả đã đọc</span>
            </button>
          )}
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên, số điện thoại, nội dung..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            type="button"
            onClick={() => setFilterRead("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              filterRead === "all"
                ? "bg-brand-primary text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Tất cả ({messages.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterRead("unread")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              filterRead === "unread"
                ? "bg-red-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Chưa đọc ({unreadCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterRead("read")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              filterRead === "read"
                ? "bg-emerald-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Đã đọc ({messages.length - unreadCount})
          </button>
        </div>
      </div>

      {/* Messages List */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
          <Loader2 className="animate-spin text-brand-primary mx-auto mb-3" size={32} />
          <p className="text-sm text-slate-500 font-medium">Đang tải tin nhắn liên hệ...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
          <AlertCircle className="text-red-600 mx-auto mb-2" size={32} />
          <p className="text-red-800 font-semibold mb-4">{error}</p>
          <button
            onClick={() => void loadData()}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition-colors cursor-pointer"
          >
            Thử lại
          </button>
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare size={28} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">
            {messages.length === 0 ? "Chưa có tin nhắn nào" : "Không có tin nhắn phù hợp"}
          </h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            {messages.length === 0
              ? "Khi khách hàng gửi form liên hệ trên website, tin nhắn sẽ xuất hiện tại đây."
              : "Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
          {filteredMessages.map((item) => {
            const cleanPhone = (item.phone || "").replace(/[^\d+]/g, "");
            const zaloLink = `https://zalo.me/${cleanPhone.replace(/^0/, "84").replace(/^\+/, "")}`;
            const timeDisplay = item.createdAt ? new Date(item.createdAt).toLocaleString("vi-VN") : "";

            return (
              <div
                key={item.id}
                onClick={() => handleOpenDetail(item)}
                className={`p-5 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer ${
                  !item.isRead
                    ? "bg-blue-50/40 hover:bg-blue-50/70 border-l-4 border-l-brand-primary"
                    : "hover:bg-slate-50 border-l-4 border-l-transparent"
                }`}
              >
                {/* Left: Tên, SĐT, Nội dung rút gọn */}
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`text-base font-bold ${
                        !item.isRead ? "text-slate-950 font-extrabold" : "text-slate-800"
                      }`}
                    >
                      {item.name}
                    </span>
                    {!item.isRead && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" title="Chưa đọc" />
                    )}
                    <span className="text-xs font-mono font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      {item.phone}
                    </span>
                  </div>

                  <p
                    className={`text-xs line-clamp-1 leading-relaxed ${
                      !item.isRead ? "text-slate-900 font-medium" : "text-slate-500"
                    }`}
                  >
                    {item.message}
                  </p>
                </div>

                {/* Right: Thời gian & Thao tác */}
                <div
                  className="flex items-center gap-3 shrink-0 self-start md:self-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Clock size={13} />
                    <span>{timeDisplay}</span>
                  </div>

                  <div className="flex items-center gap-1 border-l border-slate-200 pl-3">
                    {/* Nút Gọi */}
                    <a
                      href={`tel:${cleanPhone}`}
                      title={`Gọi tới ${item.phone}`}
                      className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                    >
                      <Phone size={15} />
                    </a>

                    {/* Nút Zalo */}
                    <a
                      href={zaloLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Mở trò chuyện Zalo"
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-xs font-bold font-mono"
                    >
                      Zalo
                    </a>

                    {/* Nút Đổi trạng thái Đã đọc / Chưa đọc */}
                    <button
                      type="button"
                      onClick={() => void handleToggleRead(item)}
                      title={item.isRead ? "Đánh dấu là chưa đọc" : "Đánh dấu là đã đọc"}
                      className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    >
                      {item.isRead ? <Mail size={15} /> : <MailOpen size={15} />}
                    </button>

                    {/* Nút Xóa */}
                    <button
                      type="button"
                      onClick={() => setMessageToDelete(item)}
                      title="Xóa tin nhắn này"
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Xem Chi Tiết Tin Nhắn */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <MessageSquare size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Chi Tiết Tin Nhắn</h3>
                  <p className="text-[11px] text-slate-400">
                    {selectedMessage.createdAt
                      ? new Date(selectedMessage.createdAt).toLocaleString("vi-VN")
                      : ""}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedMessage(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Thông tin người gửi */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Họ và tên khách hàng:</span>
                <span className="text-sm font-bold text-slate-900">{selectedMessage.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Số điện thoại:</span>
                <span className="text-sm font-mono font-bold text-brand-primary">
                  {selectedMessage.phone}
                </span>
              </div>

              {/* Nút hành động nhanh: Gọi & Mở Zalo */}
              <div className="pt-2 border-t border-slate-200 flex items-center gap-2">
                <a
                  href={`tel:${selectedMessage.phone.replace(/[^\d+]/g, "")}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                >
                  <Phone size={14} />
                  <span>Gọi điện</span>
                </a>
                <a
                  href={`https://zalo.me/${selectedMessage.phone
                    .replace(/[^\d+]/g, "")
                    .replace(/^0/, "84")
                    .replace(/^\+/, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                >
                  <ExternalLink size={14} />
                  <span>Mở Zalo tư vấn</span>
                </a>
              </div>
            </div>

            {/* Nội dung tin nhắn (Hiển thị nguyên bản dạng text thuần, an toàn chống XSS) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Nội dung yêu cầu
              </label>
              <div className="p-4 bg-white rounded-xl border border-slate-200 text-sm text-slate-800 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
                {selectedMessage.message}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => void handleToggleRead(selectedMessage)}
                className="text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                {selectedMessage.isRead ? "Đánh dấu là chưa đọc" : "Đánh dấu là đã đọc"}
              </button>

              <button
                type="button"
                onClick={() => setSelectedMessage(null)}
                className="px-4 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Xác Nhận Xóa */}
      {messageToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-11 h-11 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-3">
              <Trash2 size={20} />
            </div>
            <h4 className="text-base font-bold text-slate-900 mb-1.5">Xác nhận xóa tin nhắn?</h4>
            <p className="text-xs text-slate-600 leading-relaxed mb-5">
              Bạn có chắc chắn muốn xóa tin nhắn từ khách hàng{" "}
              <strong className="text-slate-900">{messageToDelete.name}</strong> không? Lưu ý đây là
              dữ liệu liên hệ của khách hàng.
            </p>
            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setMessageToDelete(null)}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => void handleConfirmDelete()}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                {isDeleting && <Loader2 size={13} className="animate-spin" />}
                <span>{isDeleting ? "Đang xóa..." : "Xóa vĩnh viễn"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

