"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  Lock,
  Unlock,
  ImageIcon,
  Trash2,
  Calendar,
  Send,
} from "lucide-react";
import type { PostItem, PostCategory, PostStatus } from "@/types/content";
import { slugify, isValidSlug } from "@/lib/slugify";
import { MediaPicker } from "./MediaPicker";
import { RichTextEditor } from "./RichTextEditor";
import {
  createPostAction,
  updatePostAction,
  type PostInput,
} from "@/app/admin/(dashboard)/posts/actions";

interface PostFormProps {
  initialData?: PostItem | null;
  postId?: string;
}

export function PostForm({ initialData, postId }: PostFormProps) {
  const router = useRouter();
  const isEdit = Boolean(postId && initialData);

  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [isSlugLocked, setIsSlugLocked] = useState(isEdit);
  const [hasManuallyEditedSlug, setHasManuallyEditedSlug] = useState(isEdit);

  const [category, setCategory] = useState<PostCategory>(initialData?.category || "medical");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [coverImageUrl, setCoverImageUrl] = useState(initialData?.coverImageUrl || "");
  const [author, setAuthor] = useState(initialData?.author || "CAREVIA");
  const [status, setStatus] = useState<PostStatus>(initialData?.status || "draft");

  // Date formatted for datetime-local input (YYYY-MM-DDTHH:mm)
  const formatForDateInput = (isoDate?: string | null): string => {
    if (!isoDate) {
      const now = new Date();
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      return now.toISOString().slice(0, 16);
    }
    const d = new Date(isoDate);
    if (isNaN(d.getTime())) {
      const now = new Date();
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      return now.toISOString().slice(0, 16);
    }
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  };

  const [publishedAt, setPublishedAt] = useState<string>(() =>
    formatForDateInput(initialData?.publishedAt)
  );

  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
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

  const handleSubmit = async (submitStatus?: PostStatus) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanTitle = title.trim();
    if (!cleanTitle || cleanTitle.length < 2 || cleanTitle.length > 255) {
      setErrorMessage("Tiêu đề bài viết không được để trống (từ 2 đến 255 ký tự).");
      return;
    }

    const cleanSlug = slug.trim().toLowerCase();
    if (!cleanSlug) {
      setErrorMessage("Slug bài viết không được để trống.");
      return;
    }
    if (!isValidSlug(cleanSlug)) {
      setErrorMessage("Slug không hợp lệ. Chỉ chấp nhận chữ thường không dấu, số và gạch nối.");
      return;
    }

    const targetStatus = submitStatus || status;

    const payload: PostInput = {
      title: cleanTitle,
      slug: cleanSlug,
      category,
      excerpt: excerpt.trim(),
      content,
      coverImageUrl: coverImageUrl.trim() || null,
      author: author.trim() || "CAREVIA",
      status: targetStatus,
      publishedAt: new Date(publishedAt).toISOString(),
    };

    setIsSubmitting(true);
    try {
      let res;
      if (isEdit && postId) {
        res = await updatePostAction(postId, payload);
      } else {
        res = await createPostAction(payload);
      }

      if (res.success) {
        setIsDirty(false);
        setSuccessMessage(res.message);
        setTimeout(() => {
          router.push("/admin/posts");
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

  const publicUrl = `/news/${slug}`;

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/posts"
            className="p-2 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            title="Quay lại danh sách"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              {isEdit ? "Chỉnh sửa bài viết" : "Viết bài mới"}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Soạn thảo và xuất bản nội dung tin tức cho website CAREVIA
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {isEdit && status === "published" && (
            <a
              href={publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              <ExternalLink size={14} />
              <span>Xem trên web</span>
            </a>
          )}

          <Link
            href="/admin/posts"
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Hủy
          </Link>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => void handleSubmit("draft")}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all disabled:opacity-50 cursor-pointer"
          >
            <Save size={14} />
            <span>Lưu nháp</span>
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => void handleSubmit("published")}
            className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-brand-primary hover:bg-brand-primary-dark rounded-xl shadow-sm transition-all disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Đang lưu...</span>
              </>
            ) : (
              <>
                <Send size={14} />
                <span>Đăng bài</span>
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

      {/* Form Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2/3): Content and Excerpt */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            {/* Tiêu đề */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Tiêu đề bài viết <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Ví dụ: Quy trình chăm sóc người bệnh tại nhà an toàn"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary text-base font-bold text-slate-900"
              />
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
                  /news/
                </span>
                <input
                  type="text"
                  required
                  disabled={isEdit && isSlugLocked}
                  value={slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  placeholder="quy-trinh-cham-soc-nguoi-benh"
                  className="w-full px-3.5 py-2.5 bg-transparent text-sm font-mono text-slate-900 focus:outline-none disabled:text-slate-500 disabled:cursor-not-allowed"
                />
              </div>

              {isEdit && !isSlugLocked && (
                <p className="text-xs text-amber-600 mt-1.5 flex items-center gap-1 font-medium">
                  <AlertCircle size={13} />
                  Cảnh báo: Đổi slug sẽ làm đổi địa chỉ liên kết công khai của bài viết.
                </p>
              )}
            </div>

            {/* Tóm tắt */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Tóm tắt ngắn (Excerpt)
              </label>
              <textarea
                rows={3}
                value={excerpt}
                onChange={(e) => {
                  setExcerpt(e.target.value);
                  setIsDirty(true);
                }}
                placeholder="Tóm tắt nội dung chính trong 1-3 câu để hiển thị trên thẻ bài viết và mô tả tìm kiếm..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 text-sm text-slate-800"
              />
            </div>

            {/* Trình soạn thảo văn bản Tiptap */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Nội dung bài viết <span className="text-red-500">*</span>
              </label>
              <RichTextEditor
                content={content}
                onChange={(html) => {
                  setContent(html);
                  setIsDirty(true);
                }}
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Nội dung HTML được kiểm duyệt và làm sạch an toàn trước khi lưu.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column (1/3): Metadata & Image */}
        <div className="space-y-6">
          {/* Cài đặt xuất bản */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2.5">
              Cài đặt xuất bản
            </h2>

            {/* Trạng thái */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Trạng thái bài viết</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setStatus("published");
                    setIsDirty(true);
                  }}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    status === "published"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-300 shadow-2xs"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  Đã đăng
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStatus("draft");
                    setIsDirty(true);
                  }}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    status === "draft"
                      ? "bg-slate-100 text-slate-800 border-slate-300 shadow-2xs"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  Bản nháp
                </button>
              </div>
            </div>

            {/* Danh mục */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Danh mục</label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value as PostCategory);
                  setIsDirty(true);
                }}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
              >
                <option value="medical">Y Tế Tại Nhà</option>
                <option value="transport">Vận Tải Y Tế</option>
                <option value="company">Tin Doanh Nghiệp</option>
              </select>
            </div>

            {/* Tác giả */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Tác giả</label>
              <input
                type="text"
                value={author}
                onChange={(e) => {
                  setAuthor(e.target.value);
                  setIsDirty(true);
                }}
                placeholder="CAREVIA"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none"
              />
            </div>

            {/* Thời gian xuất bản (Hẹn giờ) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Calendar size={13} className="text-slate-400" />
                <span>Ngày giờ đăng (Hẹn giờ)</span>
              </label>
              <input
                type="datetime-local"
                value={publishedAt}
                onChange={(e) => {
                  setPublishedAt(e.target.value);
                  setIsDirty(true);
                }}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:outline-none"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Nếu chọn thời điểm ở tương lai, bài viết sẽ ở trạng thái hẹn giờ và chỉ hiển thị công khai khi đến giờ đó.
              </p>
            </div>
          </div>

          {/* Ảnh đại diện / Ảnh bìa */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2.5 flex items-center justify-between">
              <span>Ảnh đại diện bài viết</span>
              {coverImageUrl && (
                <span className="text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                  Đã có ảnh
                </span>
              )}
            </h2>

            <div className="w-full aspect-[16/10] bg-slate-50 border border-dashed border-slate-300 rounded-xl overflow-hidden relative flex flex-col items-center justify-center">
              {coverImageUrl ? (
                <Image
                  src={coverImageUrl}
                  alt={title || "Ảnh đại diện"}
                  fill
                  unoptimized
                  className="object-cover"
                />
              ) : (
                <div className="text-center p-4 text-slate-400">
                  <ImageIcon size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-xs font-medium">Chưa có ảnh đại diện</p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMediaPickerOpen(true)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-brand-light text-brand-primary hover:bg-brand-primary hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                <ImageIcon size={14} />
                <span>{coverImageUrl ? "Đổi ảnh bìa" : "Chọn ảnh bìa"}</span>
              </button>
              {coverImageUrl && (
                <button
                  type="button"
                  onClick={() => {
                    setCoverImageUrl("");
                    setIsDirty(true);
                  }}
                  className="p-2 border border-slate-200 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  title="Xóa ảnh bìa"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal MediaPicker */}
      <MediaPicker
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={(url) => {
          setCoverImageUrl(url);
          setMediaPickerOpen(false);
          setIsDirty(true);
        }}
        title="Chọn Ảnh Bìa Bài Viết"
      />
    </div>
  );
}

