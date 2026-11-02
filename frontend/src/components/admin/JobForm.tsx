"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Lock,
  Unlock,
  Check,
} from "lucide-react";
import type { JobItem, JobStatus } from "@/types/content";
import { slugify, isValidSlug } from "@/lib/slugify";
import {
  createJobAction,
  updateJobAction,
  type JobInput,
} from "@/app/admin/(dashboard)/jobs/actions";

interface JobFormProps {
  initialData?: JobItem | null;
  jobId?: string;
}

export function JobForm({ initialData, jobId }: JobFormProps) {
  const router = useRouter();
  const isEdit = Boolean(jobId && initialData);

  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [isSlugLocked, setIsSlugLocked] = useState(isEdit);
  const [hasManuallyEditedSlug, setHasManuallyEditedSlug] = useState(isEdit);

  const [badge, setBadge] = useState(initialData?.badge || "Y Tế");
  const [shortDesc, setShortDesc] = useState(initialData?.shortDesc || "");
  const [description, setDescription] = useState(initialData?.description || "");

  const [requirements, setRequirements] = useState<string[]>(
    initialData?.requirements && initialData.requirements.length > 0
      ? initialData.requirements
      : [""]
  );
  const [benefits, setBenefits] = useState<string[]>(
    initialData?.benefits && initialData.benefits.length > 0
      ? initialData.benefits
      : [""]
  );

  const [workType, setWorkType] = useState(initialData?.workType || "Toàn thời gian");
  const [location, setLocation] = useState(initialData?.location || "TP. Hồ Chí Minh");
  const [status, setStatus] = useState<JobStatus>(initialData?.status || "open");
  const [sortOrder, setSortOrder] = useState<number>(initialData?.sortOrder ?? 0);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    setIsDirty(true);
    if (!isEdit && !hasManuallyEditedSlug) {
      setSlug(slugify(val));
    }
  };

  const handleSlugChange = (val: string) => {
    setSlug(val.toLowerCase());
    setHasManuallyEditedSlug(true);
    setIsDirty(true);
  };

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  // List helpers for requirements & benefits
  const handleAddRow = (type: "req" | "ben") => {
    if (type === "req") setRequirements([...requirements, ""]);
    else setBenefits([...benefits, ""]);
    setIsDirty(true);
  };

  const handleUpdateRow = (type: "req" | "ben", idx: number, val: string) => {
    if (type === "req") {
      const next = [...requirements];
      next[idx] = val;
      setRequirements(next);
    } else {
      const next = [...benefits];
      next[idx] = val;
      setBenefits(next);
    }
    setIsDirty(true);
  };

  const handleRemoveRow = (type: "req" | "ben", idx: number) => {
    if (type === "req") {
      const next = requirements.filter((_, i) => i !== idx);
      setRequirements(next.length > 0 ? next : [""]);
    } else {
      const next = benefits.filter((_, i) => i !== idx);
      setBenefits(next.length > 0 ? next : [""]);
    }
    setIsDirty(true);
  };

  const handleMoveRow = (type: "req" | "ben", idx: number, direction: "up" | "down") => {
    const list = type === "req" ? [...requirements] : [...benefits];
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;

    const temp = list[idx];
    list[idx] = list[targetIdx];
    list[targetIdx] = temp;

    if (type === "req") setRequirements(list);
    else setBenefits(list);
    setIsDirty(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanTitle = title.trim();
    if (!cleanTitle || cleanTitle.length < 2 || cleanTitle.length > 255) {
      setErrorMessage("Tiêu đề vị trí tuyển dụng phải từ 2 đến 255 ký tự.");
      return;
    }

    const cleanSlug = slug.trim().toLowerCase();
    if (!cleanSlug) {
      setErrorMessage("Slug không được để trống.");
      return;
    }
    if (!isValidSlug(cleanSlug)) {
      setErrorMessage("Slug không hợp lệ. Chỉ chấp nhận chữ thường không dấu, số và gạch nối.");
      return;
    }

    const cleanReqs = requirements.map((r) => r.trim()).filter(Boolean);
    const cleanBens = benefits.map((b) => b.trim()).filter(Boolean);

    const payload: JobInput = {
      title: cleanTitle,
      slug: cleanSlug,
      badge: badge.trim(),
      shortDesc: shortDesc.trim(),
      description: description.trim(),
      requirements: cleanReqs,
      benefits: cleanBens,
      workType: workType.trim(),
      location: location.trim(),
      status,
      sortOrder,
    };

    setIsSubmitting(true);
    try {
      let res;
      if (isEdit && jobId) {
        res = await updateJobAction(jobId, payload);
      } else {
        res = await createJobAction(payload);
      }

      if (res.success) {
        setIsDirty(false);
        setSuccessMessage(res.message);
        setTimeout(() => {
          router.push("/admin/jobs");
          router.refresh();
        }, 800);
      } else {
        setErrorMessage(res.message);
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Đã có lỗi xảy ra.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/jobs"
            className="p-2 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            title="Quay lại danh sách"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              {isEdit ? "Chỉnh sửa vị trí tuyển dụng" : "Thêm vị trí mới"}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Cung cấp thông tin yêu cầu và quyền lợi để thu hút ứng viên
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {isEdit && status === "open" && (
            <a
              href="/careers"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              <ExternalLink size={14} />
              <span>Xem trên web</span>
            </a>
          )}

          <Link
            href="/admin/jobs"
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Hủy
          </Link>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2 text-xs font-bold text-white bg-brand-primary hover:bg-brand-primary-dark rounded-xl shadow-sm transition-all disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                <span>Đang lưu...</span>
              </>
            ) : (
              <>
                <Save size={15} />
                <span>Lưu vị trí</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Messages */}
      {errorMessage && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-sm font-medium animate-in fade-in">
          <AlertCircle size={18} className="shrink-0 text-red-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="flex items-center gap-2 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm font-medium animate-in fade-in">
          <CheckCircle size={18} className="shrink-0 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Thông tin cơ bản */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brand-primary" />
          Thông tin vị trí tuyển dụng
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Tiêu đề */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Tên vị trí tuyển dụng <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Ví dụ: Điều Dưỡng Viên Chăm Sóc Tại Nhà"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 text-sm font-bold text-slate-900"
            />
          </div>

          {/* Nhãn Badge */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Nhãn phân loại (Badge)
            </label>
            <input
              type="text"
              value={badge}
              onChange={(e) => {
                setBadge(e.target.value);
                setIsDirty(true);
              }}
              placeholder="Y Tế, Cấp Cứu, Vận Tải..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 text-sm text-slate-800"
            />
          </div>
        </div>

        {/* Slug */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Đường dẫn tĩnh (Slug) <span className="text-red-500">*</span>
            </label>
            {isEdit && (
              <button
                type="button"
                onClick={() => setIsSlugLocked(!isSlugLocked)}
                className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 hover:text-amber-800 hover:underline cursor-pointer"
              >
                {isSlugLocked ? (
                  <>
                    <Unlock size={12} />
                    <span>Cho phép đổi slug</span>
                  </>
                ) : (
                  <>
                    <Lock size={12} />
                    <span>Khóa lại</span>
                  </>
                )}
              </button>
            )}
          </div>

          <div className="flex items-center rounded-xl border border-slate-300 bg-slate-50 overflow-hidden focus-within:border-brand-primary focus-within:ring-2 focus-within:ring-brand-primary/20">
            <span className="px-3.5 py-2.5 text-xs text-slate-400 bg-slate-100 font-mono border-r border-slate-300 select-none">
              /careers/
            </span>
            <input
              type="text"
              required
              disabled={isEdit && isSlugLocked}
              value={slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              placeholder="dieu-duong-vien-cham-soc-tai-nha"
              className="w-full px-3.5 py-2.5 bg-transparent text-sm font-mono text-slate-900 focus:outline-none disabled:text-slate-500 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Hình thức làm việc */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Hình thức làm việc
            </label>
            <input
              type="text"
              value={workType}
              onChange={(e) => {
                setWorkType(e.target.value);
                setIsDirty(true);
              }}
              placeholder="Toàn thời gian, Bán thời gian, Theo ca..."
              className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:outline-none text-sm text-slate-800"
            />
          </div>

          {/* Địa điểm */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Địa điểm làm việc
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                setIsDirty(true);
              }}
              placeholder="TP. Hồ Chí Minh, Cần Thơ..."
              className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:outline-none text-sm text-slate-800"
            />
          </div>
        </div>

        {/* Mô tả ngắn */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Mô tả tóm tắt (hiển thị trên thẻ)
          </label>
          <textarea
            rows={2}
            value={shortDesc}
            onChange={(e) => {
              setShortDesc(e.target.value);
              setIsDirty(true);
            }}
            placeholder="Tóm tắt 1-2 câu về cơ hội việc làm..."
            className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:outline-none text-sm text-slate-800"
          />
        </div>

        {/* Mô tả chi tiết */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Mô tả công việc chi tiết
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setIsDirty(true);
            }}
            placeholder="Chi tiết trách nhiệm công việc hằng ngày..."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none text-sm text-slate-800"
          />
        </div>
      </div>

      {/* Yêu cầu công việc */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              Yêu cầu ứng viên (Requirements)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Bằng cấp, kỹ năng chuyên môn, kinh nghiệm thực tế
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleAddRow("req")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-xl transition-all cursor-pointer"
          >
            <Plus size={14} />
            <span>Thêm yêu cầu</span>
          </button>
        </div>

        <div className="space-y-2.5">
          {requirements.map((req, idx) => {
            const isFirst = idx === 0;
            const isLast = idx === requirements.length - 1;

            return (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 w-5 text-center">#{idx + 1}</span>
                <input
                  type="text"
                  value={req}
                  onChange={(e) => handleUpdateRow("req", idx, e.target.value)}
                  placeholder="Ví dụ: Tốt nghiệp Trung cấp/Cao đẳng Điều dưỡng trở lên, có CCHN"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm text-slate-800 focus:outline-none"
                />
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleMoveRow("req", idx, "up")}
                    disabled={isFirst}
                    className={`p-1.5 rounded-lg border border-slate-200 transition-colors ${
                      isFirst ? "text-slate-300 cursor-not-allowed" : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <ArrowUp size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveRow("req", idx, "down")}
                    disabled={isLast}
                    className={`p-1.5 rounded-lg border border-slate-200 transition-colors ${
                      isLast ? "text-slate-300 cursor-not-allowed" : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <ArrowDown size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveRow("req", idx)}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quyền lợi */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              Quyền lợi đãi ngộ (Benefits)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Lương thưởng, bảo hiểm, phụ cấp và cơ hội phát triển
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleAddRow("ben")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-600 hover:text-white rounded-xl transition-all cursor-pointer"
          >
            <Plus size={14} />
            <span>Thêm quyền lợi</span>
          </button>
        </div>

        <div className="space-y-2.5">
          {benefits.map((ben, idx) => {
            const isFirst = idx === 0;
            const isLast = idx === benefits.length - 1;

            return (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 w-5 text-center">#{idx + 1}</span>
                <input
                  type="text"
                  value={ben}
                  onChange={(e) => handleUpdateRow("ben", idx, e.target.value)}
                  placeholder="Ví dụ: Thu nhập cạnh tranh từ 12 - 18 triệu/tháng + thưởng ca trực"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm text-slate-800 focus:outline-none"
                />
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleMoveRow("ben", idx, "up")}
                    disabled={isFirst}
                    className={`p-1.5 rounded-lg border border-slate-200 transition-colors ${
                      isFirst ? "text-slate-300 cursor-not-allowed" : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <ArrowUp size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveRow("ben", idx, "down")}
                    disabled={isLast}
                    className={`p-1.5 rounded-lg border border-slate-200 transition-colors ${
                      isLast ? "text-slate-300 cursor-not-allowed" : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <ArrowDown size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveRow("ben", idx)}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cài đặt hiển thị & Trạng thái */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-slate-700" />
          Cài đặt hiển thị & Trạng thái
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Trạng thái mở / đóng */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Trạng thái tin tuyển dụng
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setStatus("open");
                  setIsDirty(true);
                }}
                className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  status === "open"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-300 shadow-2xs"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                <Check size={14} />
                <span>Đang mở</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setStatus("closed");
                  setIsDirty(true);
                }}
                className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                  status === "closed"
                    ? "bg-slate-100 text-slate-800 border-slate-300 shadow-2xs"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                <span>Đã đóng</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">
              Tin đã đóng sẽ tự động ẩn khỏi trang /careers công khai.
            </p>
          </div>

          {/* Thứ tự */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Thứ tự hiển thị (Sort order)
            </label>
            <input
              type="number"
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(Number(e.target.value) || 0);
                setIsDirty(true);
              }}
              className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 focus:outline-none"
            />
            <p className="text-[11px] text-slate-400 mt-1.5">
              Số nhỏ hơn sẽ hiển thị trước (ví dụ 1, 2, 3...).
            </p>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="sticky bottom-4 z-40 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-xl flex items-center justify-between">
        <div className="text-xs text-slate-500">
          {isDirty ? (
            <span className="text-amber-600 font-semibold flex items-center gap-1">
              <AlertCircle size={14} /> Có thay đổi chưa lưu
            </span>
          ) : (
            <span className="text-slate-400">Dữ liệu đã đồng bộ</span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/jobs"
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Hủy bỏ
          </Link>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-brand-primary hover:bg-brand-primary-dark rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Đang lưu vị trí...</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>Lưu vị trí tuyển dụng</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}

