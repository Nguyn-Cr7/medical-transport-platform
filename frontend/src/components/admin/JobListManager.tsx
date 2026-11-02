"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Plus,
  Edit3,
  Trash2,
  ArrowUp,
  ArrowDown,
  Loader2,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  RefreshCw,
  Briefcase,
  MapPin,
  Clock,
} from "lucide-react";
import type { JobItem, JobStatus } from "@/types/content";
import {
  getAdminJobsAction,
  deleteJobAction,
  toggleJobStatusAction,
  swapJobOrderAction,
} from "@/app/admin/(dashboard)/jobs/actions";

export function JobListManager() {
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal Xóa
  const [jobToDelete, setJobToDelete] = useState<JobItem | null>(null);
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
      const res = await getAdminJobsAction();
      if (res.success && res.data) {
        setJobs(res.data);
      } else {
        setError(res.message || "Không thể tải danh sách tuyển dụng.");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Đã có lỗi xảy ra.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    getAdminJobsAction()
      .then((res) => {
        if (!ignore) {
          if (res.success && res.data) {
            setJobs(res.data);
          } else {
            setError(res.message || "Không thể tải danh sách tuyển dụng.");
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

  // Bật/tắt trạng thái
  const handleToggleStatus = async (item: JobItem) => {
    const newStatus: JobStatus = item.status === "open" ? "closed" : "open";
    setJobs((prev) =>
      prev.map((j) => (j.id === item.id ? { ...j, status: newStatus } : j))
    );

    const res = await toggleJobStatusAction(item.id, newStatus);
    if (res.success) {
      showToast("success", res.message);
    } else {
      showToast("error", res.message);
      void loadData();
    }
  };

  // Di chuyển thứ tự
  const handleMove = async (currentIndex: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= jobs.length) return;

    const currentItem = jobs[currentIndex];
    const targetItem = jobs[targetIndex];

    const nextJobs = [...jobs];
    nextJobs[currentIndex] = { ...targetItem, sortOrder: currentItem.sortOrder };
    nextJobs[targetIndex] = { ...currentItem, sortOrder: targetItem.sortOrder };
    setJobs(nextJobs);

    const res = await swapJobOrderAction(
      currentItem.id,
      currentItem.sortOrder,
      targetItem.id,
      targetItem.sortOrder
    );

    if (res.success) {
      showToast("success", "Đã cập nhật thứ tự vị trí.");
    } else {
      showToast("error", res.message);
      void loadData();
    }
  };

  // Xác nhận xóa
  const handleConfirmDelete = async () => {
    if (!jobToDelete) return;
    setIsDeleting(true);

    const res = await deleteJobAction(jobToDelete.id);
    if (res.success) {
      showToast("success", res.message);
      setJobs((prev) => prev.filter((j) => j.id !== jobToDelete.id));
      setJobToDelete(null);
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
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Tuyển Dụng Nhân Sự</h1>
            <span className="bg-brand-primary/10 text-brand-primary font-bold text-xs px-2.5 py-1 rounded-full">
              {jobs.length} vị trí
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Quản lý các đợt tuyển dụng điều dưỡng, tài xế cấp cứu và nhân viên cho CAREVIA.
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
            href="/admin/jobs/new"
            className="inline-flex items-center gap-2 bg-brand-primary hover:bg-brand-primary-dark text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-sm transition-all"
          >
            <Plus size={18} />
            <span>Thêm vị trí mới</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
          <Loader2 className="animate-spin text-brand-primary mx-auto mb-3" size={32} />
          <p className="text-sm text-slate-500 font-medium">Đang tải danh sách tuyển dụng...</p>
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
      ) : jobs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase size={28} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">Chưa có vị trí tuyển dụng nào</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
            Tạo vị trí tuyển dụng để thu hút các ứng viên tiềm năng gia nhập đội ngũ CAREVIA.
          </p>
          <Link
            href="/admin/jobs/new"
            className="inline-flex items-center gap-2 bg-brand-primary hover:bg-brand-primary-dark text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-sm transition-all"
          >
            <Plus size={18} />
            <span>Thêm vị trí ngay</span>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-xs uppercase tracking-wider">
                  <th className="py-4 px-4 text-center w-20">Thứ tự</th>
                  <th className="py-4 px-4">Vị trí tuyển dụng</th>
                  <th className="py-4 px-4">Hình thức & Nơi làm việc</th>
                  <th className="py-4 px-4 text-center">Trạng thái</th>
                  <th className="py-4 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {jobs.map((job, index) => {
                  const isFirst = index === 0;
                  const isLast = index === jobs.length - 1;
                  const isOpen = job.status === "open";

                  return (
                    <tr key={job.id} className="hover:bg-slate-50/80 transition-colors group">
                      {/* Thứ tự & Lên/Xuống */}
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <span className="font-bold text-slate-700 w-5 text-center text-xs">
                            {job.sortOrder ?? index + 1}
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
                                  : "text-slate-600 hover:text-slate-900 cursor-pointer"
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
                                  : "text-slate-600 hover:text-slate-900 cursor-pointer"
                              }`}
                            >
                              <ArrowDown size={13} />
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Tiêu đề & Nhãn */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-base">{job.title}</span>
                          {job.badge && (
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                              {job.badge}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <code className="text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                            {job.slug}
                          </code>
                          {job.requirements && job.requirements.length > 0 && (
                            <span className="text-[11px] text-slate-400">
                              • {job.requirements.length} yêu cầu
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Hình thức & Địa điểm */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                          <Clock size={13} className="text-slate-400 shrink-0" />
                          <span>{job.workType || "Toàn thời gian"}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                          <MapPin size={13} className="text-slate-400 shrink-0" />
                          <span>{job.location || "TP. Hồ Chí Minh"}</span>
                        </div>
                      </td>

                      {/* Trạng thái */}
                      <td className="py-4 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => void handleToggleStatus(job)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all shadow-xs cursor-pointer ${
                            isOpen
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                              : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"
                          }`}
                          title="Bấm để Đóng / Mở lại tin"
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              isOpen ? "bg-emerald-500" : "bg-slate-400"
                            }`}
                          />
                          <span>{isOpen ? "Đang mở" : "Đã đóng"}</span>
                        </button>
                      </td>

                      {/* Thao tác */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {isOpen ? (
                            <a
                              href="/careers"
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Xem trang tuyển dụng công khai"
                              className="p-2 text-slate-400 hover:text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-colors"
                            >
                              <ExternalLink size={16} />
                            </a>
                          ) : null}

                          <Link
                            href={`/admin/jobs/${job.id}/edit`}
                            title="Chỉnh sửa tin"
                            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                          >
                            <Edit3 size={16} />
                          </Link>

                          <button
                            type="button"
                            onClick={() => setJobToDelete(job)}
                            title="Xóa tin tuyển dụng"
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
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
      {jobToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4">
              <Trash2 size={24} />
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-2">Xác nhận xóa tin tuyển dụng</h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Bạn có chắc chắn muốn xóa vị trí{" "}
              <strong className="text-slate-900 font-semibold">
                &ldquo;{jobToDelete.title}&rdquo;
              </strong>
              ? Thao tác này sẽ xóa vĩnh viễn và không thể khôi phục.
            </p>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 mb-6">
              💡 <strong>Khuyên dùng:</strong> Nếu đã tuyển đủ người hoặc tạm dừng đợt tuyển, hãy chọn{" "}
              <strong>&ldquo;Đóng tin&rdquo;</strong> thay vì xóa để lưu lại nội dung.
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setJobToDelete(null)}
                className="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => void handleConfirmDelete()}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-xs transition-colors cursor-pointer"
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

