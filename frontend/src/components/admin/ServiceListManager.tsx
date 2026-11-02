"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Plus,
  Edit3,
  Trash2,
  Eye,
  ArrowUp,
  ArrowDown,
  Loader2,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  MessageCircle,
  FileSpreadsheet,
  Ban,
  RefreshCw,
} from "lucide-react";
import type { ServiceItem, ServiceCategory } from "@/types/content";
import {
  getAdminServicesAction,
  deleteServiceAction,
  toggleServicePublishAction,
  swapServiceOrderAction,
} from "@/app/admin/(dashboard)/services/actions";

interface ServiceListManagerProps {
  category: ServiceCategory;
}

export function ServiceListManager({ category }: ServiceListManagerProps) {
  const isMedical = category === "medical";
  const title = isMedical ? "Dịch Vụ Y Tế" : "Dịch Vụ Vận Chuyển";
  const publicBaseUrl = isMedical ? "/medical" : "/transport";

  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal Xóa
  const [serviceToDelete, setServiceToDelete] = useState<ServiceItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast thông báo
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
      const res = await getAdminServicesAction(category);
      if (res.success && res.data) {
        setServices(res.data);
      } else {
        setError(res.message || "Không thể tải danh sách dịch vụ.");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Đã có lỗi xảy ra.");
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    let ignore = false;
    getAdminServicesAction(category)
      .then((res) => {
        if (!ignore) {
          if (res.success && res.data) {
            setServices(res.data);
          } else {
            setError(res.message || "Không thể tải danh sách dịch vụ.");
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
  }, [category]);

  // Bật/tắt xuất bản
  const handleTogglePublish = async (item: ServiceItem) => {
    const newStatus = !item.isPublished;
    // Cập nhật optimistic
    setServices((prev) =>
      prev.map((s) => (s.id === item.id ? { ...s, isPublished: newStatus } : s))
    );

    const res = await toggleServicePublishAction(item.id, newStatus, category);
    if (res.success) {
      showToast("success", res.message);
    } else {
      showToast("error", res.message);
      // Rollback nếu lỗi
      setServices((prev) =>
        prev.map((s) => (s.id === item.id ? { ...s, isPublished: item.isPublished } : s))
      );
    }
  };

  // Di chuyển thứ tự (Lên / Xuống)
  const handleMove = async (currentIndex: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= services.length) return;

    const currentItem = services[currentIndex];
    const targetItem = services[targetIndex];

    // Optimistic UI update
    const newServices = [...services];
    newServices[currentIndex] = { ...targetItem, sortOrder: currentItem.sortOrder };
    newServices[targetIndex] = { ...currentItem, sortOrder: targetItem.sortOrder };
    setServices(newServices);

    const res = await swapServiceOrderAction(
      currentItem.id,
      currentItem.sortOrder,
      targetItem.id,
      targetItem.sortOrder,
      category
    );

    if (res.success) {
      showToast("success", "Đã cập nhật thứ tự hiển thị.");
    } else {
      showToast("error", res.message);
      // Rollback
      void loadData();
    }
  };

  // Xác nhận và xóa
  const handleConfirmDelete = async () => {
    if (!serviceToDelete) return;
    setIsDeleting(true);

    const res = await deleteServiceAction(serviceToDelete.id, category);
    if (res.success) {
      showToast("success", res.message);
      setServices((prev) => prev.filter((s) => s.id !== serviceToDelete.id));
      setServiceToDelete(null);
    } else {
      showToast("error", res.message);
    }
    setIsDeleting(false);
  };

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
          {toast.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{title}</h1>
            <span className="bg-brand-primary/10 text-brand-primary font-bold text-xs px-2.5 py-1 rounded-full">
              {services.length} gói
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Quản lý danh sách, nội dung, thứ tự hiển thị và trạng thái xuất bản của các dịch vụ.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => void loadData()}
            title="Tải lại danh sách"
            className="p-2.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <RefreshCw size={18} className={loading ? "animate-spin text-brand-primary" : ""} />
          </button>
          <Link
            href={`/admin/${category}/new`}
            className="inline-flex items-center gap-2 bg-brand-primary hover:bg-brand-primary-dark text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-sm transition-all"
          >
            <Plus size={18} />
            <span>Thêm dịch vụ mới</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
          <Loader2 className="animate-spin text-brand-primary mx-auto mb-3" size={32} />
          <p className="text-sm text-slate-500 font-medium">Đang tải danh sách dịch vụ...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
          <AlertCircle className="text-red-600 mx-auto mb-2" size={32} />
          <p className="text-red-800 font-semibold mb-4">{error}</p>
          <button
            onClick={() => void loadData()}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition-colors"
          >
            Thử lại
          </button>
        </div>
      ) : services.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus size={28} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">Chưa có dịch vụ nào</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
            Bắt đầu tạo dịch vụ {isMedical ? "y tế" : "vận chuyển"} đầu tiên để hiển thị cho khách
            hàng trên website.
          </p>
          <Link
            href={`/admin/${category}/new`}
            className="inline-flex items-center gap-2 bg-brand-primary hover:bg-brand-primary-dark text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-sm transition-all"
          >
            <Plus size={18} />
            <span>Tạo dịch vụ ngay</span>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-xs uppercase tracking-wider">
                  <th className="py-4 px-4 text-center w-20">Thứ tự</th>
                  <th className="py-4 px-4">Dịch vụ</th>
                  <th className="py-4 px-4">Hành vi khi bấm</th>
                  <th className="py-4 px-4 text-center">Trạng thái</th>
                  <th className="py-4 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {services.map((service, index) => {
                  const isFirst = index === 0;
                  const isLast = index === services.length - 1;

                  // Đường dẫn public tương ứng
                  const publicLink =
                    service.actionType === "detail_page"
                      ? `/${category}/${service.slug}`
                      : publicBaseUrl;

                  return (
                    <tr
                      key={service.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* Cột Thứ tự & Nút Lên/Xuống */}
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <span className="font-bold text-slate-700 w-5 text-center text-xs">
                            {service.sortOrder ?? index + 1}
                          </span>
                          <div className="flex flex-col gap-0.5">
                            <button
                              type="button"
                              onClick={() => void handleMove(index, "up")}
                              disabled={isFirst}
                              title="Di chuyển lên"
                              className={`p-1 rounded hover:bg-slate-200 transition-colors ${
                                isFirst
                                  ? "text-slate-300 cursor-not-allowed"
                                  : "text-slate-600 hover:text-slate-900"
                              }`}
                            >
                              <ArrowUp size={13} />
                            </button>
                            <button
                              type="button"
                              onClick={() => void handleMove(index, "down")}
                              disabled={isLast}
                              title="Di chuyển xuống"
                              className={`p-1 rounded hover:bg-slate-200 transition-colors ${
                                isLast
                                  ? "text-slate-300 cursor-not-allowed"
                                  : "text-slate-600 hover:text-slate-900"
                              }`}
                            >
                              <ArrowDown size={13} />
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Cột Tên & Slug */}
                      <td className="py-4 px-4">
                        <div className="font-bold text-slate-900 text-base">{service.title}</div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <code className="text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                            /{category}/{service.slug}
                          </code>
                          {service.features && service.features.length > 0 && (
                            <span className="text-[11px] text-slate-400">
                              • {service.features.length} tiện ích
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Cột Hành vi khi bấm */}
                      <td className="py-4 px-4">
                        {service.actionType === "zalo" ? (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                            <MessageCircle size={13} />
                            <span>Mở Zalo</span>
                            {service.zaloUrl && (
                              <span className="text-[10px] text-blue-500 font-normal">
                                (link riêng)
                              </span>
                            )}
                          </div>
                        ) : service.actionType === "detail_page" ? (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                            <FileSpreadsheet size={13} />
                            <span>Trang chi tiết & Giá</span>
                            {service.priceImages && service.priceImages.length > 0 && (
                              <span className="bg-purple-200/70 text-purple-800 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                                {service.priceImages.length} ảnh
                              </span>
                            )}
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                            <Ban size={13} />
                            <span>Không bấm</span>
                          </div>
                        )}
                      </td>

                      {/* Cột Trạng thái Xuất bản */}
                      <td className="py-4 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => void handleTogglePublish(service)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all shadow-xs cursor-pointer ${
                            service.isPublished
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                              : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"
                          }`}
                          title="Bấm để đổi trạng thái xuất bản"
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              service.isPublished ? "bg-emerald-500" : "bg-slate-400"
                            }`}
                          />
                          <span>{service.isPublished ? "Đã xuất bản" : "Bản nháp"}</span>
                        </button>
                      </td>

                      {/* Cột Thao tác */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Nút Xem trên web */}
                          {service.isPublished ? (
                            <a
                              href={publicLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Xem hiển thị trên website"
                              className="p-2 text-slate-400 hover:text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-colors"
                            >
                              <ExternalLink size={16} />
                            </a>
                          ) : (
                            <span
                              title="Dịch vụ chưa xuất bản nên không thể xem công khai"
                              className="p-2 text-slate-200 cursor-not-allowed"
                            >
                              <Eye size={16} />
                            </span>
                          )}

                          {/* Nút Sửa */}
                          <Link
                            href={`/admin/${category}/${service.id}/edit`}
                            title="Chỉnh sửa dịch vụ"
                            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                          >
                            <Edit3 size={16} />
                          </Link>

                          {/* Nút Xóa */}
                          <button
                            type="button"
                            onClick={() => {
                              setServiceToDelete(service);
                            }}
                            title="Xóa dịch vụ"
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Xác nhận Xóa */}
      {serviceToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4">
              <Trash2 size={24} />
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-2">Xác nhận xóa dịch vụ</h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Bạn có chắc chắn muốn xóa dịch vụ{" "}
              <strong className="text-slate-900 font-semibold">
                &ldquo;{serviceToDelete.title}&rdquo;
              </strong>
              ? Thao tác này sẽ xóa vĩnh viễn và <strong>không thể khôi phục</strong>.
            </p>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 mb-6">
              💡 <strong>Khuyên dùng:</strong> Nếu bạn chỉ muốn tạm ngừng cung cấp dịch vụ này trên
              website, hãy chọn <strong>&ldquo;Ẩn (Bỏ xuất bản)&rdquo;</strong> thay vì xóa.
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => {
                  setServiceToDelete(null);
                }}
                className="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => void handleConfirmDelete()}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-xs transition-colors"
              >
                {isDeleting && <Loader2 size={16} className="animate-spin" />}
                <span>{isDeleting ? "Đang xóa..." : "Xóa vĩnh viễn"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
