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
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Lock,
  Unlock,
  ImageIcon,
  MessageCircle,
  FileSpreadsheet,
  Ban,
  Check,
  Layers,
} from "lucide-react";
import type {
  ServiceItem,
  ServiceCategory,
  ServiceActionType,
  PriceImage,
} from "@/types/content";
import { slugify, isValidSlug } from "@/lib/slugify";
import { MediaPicker } from "./MediaPicker";
import {
  createServiceAction,
  updateServiceAction,
  type ServiceInput,
} from "@/app/admin/(dashboard)/services/actions";

interface ServiceFormProps {
  category: ServiceCategory;
  initialData?: ServiceItem | null;
  serviceId?: string;
}

interface ImagePair {
  id: string;
  group: string;
  front: { url: string; label: string };
  back: { url: string; label: string };
}

function parsePriceImagesToPairs(images?: PriceImage[]): ImagePair[] {
  if (!images || images.length === 0) {
    return [
      {
        id: "pair-1",
        group: "",
        front: { url: "", label: "Mặt trước" },
        back: { url: "", label: "Mặt sau" },
      },
    ];
  }

  const pairs: ImagePair[] = [];
  let i = 0;
  while (i < images.length) {
    const current = images[i];
    const next = images[i + 1];

    const currentGroup = current.group || "";
    const nextGroup = next?.group || "";

    // Nếu ảnh kế tiếp có cùng group hoặc cả hai đều không có group, ghép thành 1 cặp
    if (next && (currentGroup === nextGroup || (!current.group && !next.group))) {
      pairs.push({
        id: `pair-${i}-${Date.now()}`,
        group: currentGroup,
        front: { url: current.url, label: current.label || "Mặt trước" },
        back: { url: next.url, label: next.label || "Mặt sau" },
      });
      i += 2;
    } else {
      pairs.push({
        id: `pair-${i}-${Date.now()}`,
        group: currentGroup,
        front: { url: current.url, label: current.label || "Mặt trước" },
        back: { url: "", label: "Mặt sau" },
      });
      i += 1;
    }
  }

  if (pairs.length === 0) {
    pairs.push({
      id: "pair-1",
      group: "",
      front: { url: "", label: "Mặt trước" },
      back: { url: "", label: "Mặt sau" },
    });
  }

  return pairs;
}

export function ServiceForm({ category, initialData, serviceId }: ServiceFormProps) {
  const router = useRouter();
  const isMedical = category === "medical";
  const isEdit = Boolean(serviceId && initialData);

  // Form States
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [isSlugLocked, setIsSlugLocked] = useState(isEdit);
  const [hasManuallyEditedSlug, setHasManuallyEditedSlug] = useState(isEdit);

  const [shortDesc, setShortDesc] = useState(initialData?.shortDesc || "");
  const [fullDesc, setFullDesc] = useState(initialData?.fullDesc || "");
  const [features, setFeatures] = useState<string[]>(
    initialData?.features && initialData.features.length > 0 ? initialData.features : [""]
  );
  const [targetInfo, setTargetInfo] = useState(initialData?.targetInfo || "");
  const [icon, setIcon] = useState(initialData?.icon || "");
  const [sortOrder, setSortOrder] = useState<number>(initialData?.sortOrder ?? 0);
  const [isPublished, setIsPublished] = useState<boolean>(initialData?.isPublished ?? true);

  // Action & Price Images states
  const [actionType, setActionType] = useState<ServiceActionType>(
    initialData?.actionType || "none"
  );
  const [zaloUrl, setZaloUrl] = useState(initialData?.zaloUrl || "");

  // Multi-Pair Price Images (GĐ4.1)
  const [imagePairs, setImagePairs] = useState<ImagePair[]>(() =>
    parsePriceImagesToPairs(initialData?.priceImages)
  );

  // Modal Xóa Cặp Ảnh
  const [pairToDeleteIdx, setPairToDeleteIdx] = useState<number | null>(null);

  // Media Picker modal
  const [mediaPickerTarget, setMediaPickerTarget] = useState<{
    pairIdx: number;
    side: "front" | "back";
  } | null>(null);

  // Feedback states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  // Auto-generate slug from title if not manually edited on new
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

  // Cảnh báo rời trang khi có thay đổi chưa lưu
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  // Features List handlers
  const handleAddFeature = () => {
    setFeatures([...features, ""]);
    setIsDirty(true);
  };

  const handleUpdateFeature = (index: number, val: string) => {
    const next = [...features];
    next[index] = val;
    setFeatures(next);
    setIsDirty(true);
  };

  const handleRemoveFeature = (index: number) => {
    const next = features.filter((_, i) => i !== index);
    setFeatures(next.length > 0 ? next : [""]);
    setIsDirty(true);
  };

  const handleMoveFeature = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= features.length) return;
    const next = [...features];
    const temp = next[index];
    next[index] = next[targetIndex];
    next[targetIndex] = temp;
    setFeatures(next);
    setIsDirty(true);
  };

  // Pairs Management (GĐ4.1)
  const handleAddPair = () => {
    if (imagePairs.length >= 20) {
      setErrorMessage("Đã đạt giới hạn tối đa 20 cặp ảnh bảng giá.");
      return;
    }
    setImagePairs((prev) => [
      ...prev,
      {
        id: `pair-${prev.length}-${Date.now()}`,
        group: "",
        front: { url: "", label: "Mặt trước" },
        back: { url: "", label: "Mặt sau" },
      },
    ]);
    setIsDirty(true);
  };

  const handleMovePair = (idx: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= imagePairs.length) return;
    const next = [...imagePairs];
    const temp = next[idx];
    next[idx] = next[targetIdx];
    next[targetIdx] = temp;
    setImagePairs(next);
    setIsDirty(true);
  };

  const handleUpdatePairGroup = (idx: number, group: string) => {
    const next = [...imagePairs];
    next[idx] = { ...next[idx], group };
    setImagePairs(next);
    setIsDirty(true);
  };

  const handleUpdatePairImage = (
    pairIdx: number,
    side: "front" | "back",
    url: string,
    label?: string
  ) => {
    const next = [...imagePairs];
    const currentSide = next[pairIdx][side];
    next[pairIdx] = {
      ...next[pairIdx],
      [side]: {
        url,
        label: label !== undefined ? label : currentSide.label,
      },
    };
    setImagePairs(next);
    setIsDirty(true);
  };

  const handleConfirmDeletePair = (idx: number) => {
    if (imagePairs.length <= 1) {
      setImagePairs([
        {
          id: `pair-${Date.now()}`,
          group: "",
          front: { url: "", label: "Mặt trước" },
          back: { url: "", label: "Mặt sau" },
        },
      ]);
    } else {
      setImagePairs(imagePairs.filter((_, i) => i !== idx));
    }
    setPairToDeleteIdx(null);
    setIsDirty(true);
  };

  // Thống kê số lượng ảnh / cặp ảnh thực tế
  const activePairsCount = imagePairs.filter(
    (p) => p.front.url.trim() || p.back.url.trim()
  ).length;
  const activeImagesCount = imagePairs.reduce(
    (acc, p) => acc + (p.front.url.trim() ? 1 : 0) + (p.back.url.trim() ? 1 : 0),
    0
  );

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // 1. Client Validation
    const cleanTitle = title.trim();
    if (!cleanTitle || cleanTitle.length < 2 || cleanTitle.length > 255) {
      setErrorMessage("Tiêu đề dịch vụ không được để trống (từ 2 đến 255 ký tự).");
      return;
    }

    const cleanSlug = slug.trim().toLowerCase();
    if (!cleanSlug) {
      setErrorMessage("Slug dịch vụ không được để trống.");
      return;
    }
    if (!isValidSlug(cleanSlug)) {
      setErrorMessage(
        "Slug không đúng định dạng. Chỉ chấp nhận chữ thường không dấu, số và gạch nối (ví dụ: cham-soc-tai-nha)."
      );
      return;
    }

    if (actionType === "zalo" && zaloUrl.trim()) {
      if (!zaloUrl.trim().startsWith("https://")) {
        setErrorMessage(
          "Link Zalo riêng phải bắt đầu bằng 'https://' (ví dụ: https://zalo.me/0986767960)."
        );
        return;
      }
    }

    // Xây dựng mảng priceImages phẳng từ các cặp ảnh
    const priceImagesToSave: PriceImage[] = [];
    if (actionType === "detail_page") {
      for (const pair of imagePairs) {
        const cleanGroup = pair.group.trim();
        if (pair.front.url.trim()) {
          priceImagesToSave.push({
            url: pair.front.url.trim(),
            label: pair.front.label.trim() || "Mặt trước",
            ...(cleanGroup ? { group: cleanGroup } : {}),
          });
        }
        if (pair.back.url.trim()) {
          priceImagesToSave.push({
            url: pair.back.url.trim(),
            label: pair.back.label.trim() || "Mặt sau",
            ...(cleanGroup ? { group: cleanGroup } : {}),
          });
        }
      }

      if (priceImagesToSave.length > 40) {
        setErrorMessage("Tổng số ảnh bảng giá / thông tin vượt quá giới hạn tối đa 40 ảnh (20 cặp).");
        return;
      }
    }

    const cleanFeatures = features.map((f) => f.trim()).filter((f) => f.length > 0);

    const payload: ServiceInput = {
      title: cleanTitle,
      slug: cleanSlug,
      shortDesc: shortDesc.trim(),
      fullDesc: fullDesc.trim(),
      features: cleanFeatures,
      targetInfo: targetInfo.trim(),
      icon: icon.trim(),
      sortOrder,
      isPublished,
      actionType,
      zaloUrl: actionType === "zalo" ? zaloUrl.trim() : undefined,
      priceImages: priceImagesToSave,
    };

    setIsSubmitting(true);
    try {
      let res;
      if (isEdit && serviceId) {
        res = await updateServiceAction(serviceId, payload, category);
      } else {
        res = await createServiceAction(payload, category);
      }

      if (res.success) {
        setIsDirty(false);
        setSuccessMessage(res.message);
        setTimeout(() => {
          router.push(`/admin/${category}`);
          router.refresh();
        }, 800);
      } else {
        setErrorMessage(res.message);
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Đã có lỗi xảy ra khi lưu dữ liệu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // URL xem thử trên website
  const publicUrl =
    actionType === "detail_page" ? `/${category}/${slug}` : `/${category}`;

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Top Navigation & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            href={`/admin/${category}`}
            className="p-2 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            title="Quay lại danh sách"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              {isEdit ? "Chỉnh sửa dịch vụ" : "Thêm dịch vụ mới"}{" "}
              <span className="text-brand-primary">({isMedical ? "Y Tế" : "Vận Chuyển"})</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEdit
                ? "Cập nhật thông tin gói dịch vụ hiện có"
                : "Điền thông tin để tạo gói dịch vụ mới"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Nút Xem trên web nếu là Edit và đã xuất bản */}
          {isEdit && isPublished && (
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
            href={`/admin/${category}`}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Hủy
          </Link>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-brand-primary hover:bg-brand-primary-dark rounded-xl shadow-sm transition-all disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                <span>Đang lưu...</span>
              </>
            ) : (
              <>
                <Save size={15} />
                <span>Lưu dịch vụ</span>
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

      {/* Section 1: Thông tin cơ bản */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brand-primary" />
          Thông tin cơ bản
        </h2>

        {/* Tiêu đề */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Tiêu đề dịch vụ <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Ví dụ: Lấy Mẫu Xét Nghiệm Tận Nơi"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary text-sm font-semibold text-slate-900"
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
              /{category}/
            </span>
            <input
              type="text"
              required
              disabled={isEdit && isSlugLocked}
              value={slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              placeholder="lay-mau-xet-nghiem-tan-noi"
              className="w-full px-3.5 py-2.5 bg-transparent text-sm font-mono text-slate-900 focus:outline-none disabled:text-slate-500 disabled:cursor-not-allowed"
            />
          </div>

          {isEdit && !isSlugLocked && (
            <p className="text-xs text-amber-600 mt-1.5 flex items-center gap-1 font-medium">
              <AlertCircle size={13} />
              Cảnh báo: Đổi slug sẽ làm đổi địa chỉ trang chi tiết của dịch vụ này.
            </p>
          )}
        </div>

        {/* Mô tả ngắn */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Mô tả ngắn (hiển thị trên thẻ)
          </label>
          <textarea
            rows={2}
            value={shortDesc}
            onChange={(e) => {
              setShortDesc(e.target.value);
              setIsDirty(true);
            }}
            placeholder="Tóm tắt ngắn gọn 1-2 câu về dịch vụ..."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary text-sm text-slate-800"
          />
        </div>

        {/* Mô tả đầy đủ */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Mô tả đầy đủ (hiển thị ở đầu trang chi tiết)
          </label>
          <textarea
            rows={4}
            value={fullDesc}
            onChange={(e) => {
              setFullDesc(e.target.value);
              setIsDirty(true);
            }}
            placeholder="Giới thiệu chi tiết về quy trình, cam kết chất lượng..."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary text-sm text-slate-800"
          />
        </div>
      </div>

      {/* Section 2: Danh sách tiện ích "Bao gồm" */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-secondary" />
              Danh sách &ldquo;Bao gồm&rdquo; (Features)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Thẻ dịch vụ trên website public chỉ hiển thị <strong>3 mục đầu tiên</strong>.
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddFeature}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-brand-primary bg-brand-light hover:bg-brand-primary hover:text-white rounded-xl transition-all cursor-pointer"
          >
            <Plus size={14} />
            <span>Thêm mục</span>
          </button>
        </div>

        <div className="space-y-2.5">
          {features.map((feat, idx) => {
            const isFirst = idx === 0;
            const isLast = idx === features.length - 1;

            return (
              <div key={idx} className="flex items-center gap-2 group">
                <span className="text-xs font-bold text-slate-400 w-5 text-center">#{idx + 1}</span>

                <input
                  type="text"
                  value={feat}
                  onChange={(e) => handleUpdateFeature(idx, e.target.value)}
                  placeholder={`Ví dụ: Lấy mẫu tại nhà bởi điều dưỡng có chứng chỉ hành nghề`}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary text-sm text-slate-800"
                />

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleMoveFeature(idx, "up")}
                    disabled={isFirst}
                    title="Chuyển lên"
                    className={`p-1.5 rounded-lg border border-slate-200 transition-colors ${
                      isFirst
                        ? "text-slate-300 cursor-not-allowed"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <ArrowUp size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveFeature(idx, "down")}
                    disabled={isLast}
                    title="Chuyển xuống"
                    className={`p-1.5 rounded-lg border border-slate-200 transition-colors ${
                      isLast
                        ? "text-slate-300 cursor-not-allowed"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <ArrowDown size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(idx)}
                    title="Xóa mục này"
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

      {/* Section 3: Hành vi khi bấm thẻ & Các Cặp Ảnh Bảng Giá / Thông Tin */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-600" />
          Hành vi khi khách bấm vào thẻ dịch vụ
        </h2>

        {/* 3 lựa chọn action_type */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Option 1: Zalo */}
          <label
            className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
              actionType === "zalo"
                ? "border-blue-600 bg-blue-50/50 shadow-xs"
                : "border-slate-200 hover:border-slate-300 bg-white"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                  <MessageCircle size={18} />
                </div>
                <span className="text-sm font-bold text-slate-900">Mở Zalo</span>
              </div>
              <input
                type="radio"
                name="action_type"
                checked={actionType === "zalo"}
                onChange={() => {
                  setActionType("zalo");
                  setIsDirty(true);
                }}
                className="mt-1 text-blue-600 focus:ring-blue-500"
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Bấm thẻ sẽ mở trực tiếp ứng dụng hoặc trang chat Zalo tư vấn.
            </p>
          </label>

          {/* Option 2: Trang chi tiết & ảnh giá / thông tin */}
          <label
            className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
              actionType === "detail_page"
                ? "border-purple-600 bg-purple-50/50 shadow-xs"
                : "border-slate-200 hover:border-slate-300 bg-white"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                  <FileSpreadsheet size={18} />
                </div>
                <span className="text-sm font-bold text-slate-900">Trang chi tiết & Hình ảnh</span>
              </div>
              <input
                type="radio"
                name="action_type"
                checked={actionType === "detail_page"}
                onChange={() => {
                  setActionType("detail_page");
                  setIsDirty(true);
                }}
                className="mt-1 text-purple-600 focus:ring-purple-500"
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Bấm thẻ mở trang riêng /{category}/[slug] với các cặp ảnh chi tiết.
            </p>
          </label>

            {/* Option 3: Không bấm */}
            <label
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                actionType === "none"
                  ? "border-slate-600 bg-slate-50 shadow-xs"
                  : "border-slate-200 hover:border-slate-300 bg-white"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-600 flex items-center justify-center">
                    <Ban size={18} />
                  </div>
                  <span className="text-sm font-bold text-slate-900">Không bấm được</span>
                </div>
                <input
                  type="radio"
                  name="action_type"
                  checked={actionType === "none"}
                  onChange={() => {
                    setActionType("none");
                    setIsDirty(true);
                  }}
                  className="mt-1 text-slate-600 focus:ring-slate-500"
                />
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Thẻ cố định hiển thị nội dung thông thường, không điều hướng.
              </p>
            </label>
          </div>

          {/* Nếu chọn Mở Zalo: Nhập link Zalo riêng */}
          {actionType === "zalo" && (
            <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-xl space-y-2 animate-in fade-in">
              <label className="block text-xs font-bold uppercase tracking-wider text-blue-900">
                Link Zalo riêng (tùy chọn)
              </label>
              <input
                type="text"
                value={zaloUrl}
                onChange={(e) => {
                  setZaloUrl(e.target.value);
                  setIsDirty(true);
                }}
                placeholder="https://zalo.me/0986767960"
                className="w-full px-4 py-2 bg-white rounded-xl border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm text-slate-900"
              />
              <p className="text-xs text-blue-700">
                💡 Để trống sẽ tự động dùng link Zalo chung đã cài đặt trong{" "}
                <Link href="/admin/settings" className="underline font-bold" target="_blank">
                  Cấu hình website
                </Link>
                .
              </p>
            </div>
          )}

          {/* GĐ4.1: Nếu chọn Trang chi tiết: QUẢN LÝ NHIỀU CẶP ẢNH BẢNG GIÁ */}
          {actionType === "detail_page" && (
            <div className="space-y-6 pt-2 border-t border-slate-100 animate-in fade-in">
              {/* Header Thống Kê & Nút Thêm Cặp */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-purple-50/60 border border-purple-200 p-4 rounded-xl">
                <div>
                  <h3 className="text-sm font-bold text-purple-950 flex items-center gap-2">
                    <Layers size={17} className="text-purple-600" />
                    Danh sách Các Cặp Ảnh (Bảng Giá / Thông Tin)
                  </h3>
                  <p className="text-xs text-purple-700 mt-0.5">
                    Mỗi gói hoặc loại xe/dịch vụ tương ứng 1 cặp (Mặt trước + Mặt sau). Tối đa 20 cặp.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="bg-purple-100 text-purple-800 text-xs font-bold px-3 py-1 rounded-full border border-purple-200">
                    Tổng: {activePairsCount} cặp / {activeImagesCount} ảnh
                  </span>
                  <button
                    type="button"
                    onClick={handleAddPair}
                    disabled={imagePairs.length >= 20}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Thêm cặp ảnh</span>
                  </button>
                </div>
              </div>

              {/* Danh sách các cặp ảnh */}
              <div className="space-y-6">
                {imagePairs.map((pair, pairIdx) => {
                  const isFirst = pairIdx === 0;
                  const isLast = pairIdx === imagePairs.length - 1;
                  const hasAnyImage = Boolean(pair.front.url.trim() || pair.back.url.trim());

                  return (
                    <div
                      key={pair.id}
                      className="p-5 rounded-2xl border-2 border-slate-200 bg-slate-50/40 space-y-4 hover:border-purple-200 transition-colors"
                    >
                      {/* Tiêu đề Cặp & Thanh công cụ */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                        <div className="flex items-center gap-2 flex-1">
                          <span className="bg-slate-200 text-slate-700 text-xs font-extrabold px-2.5 py-1 rounded-lg">
                            Cặp #{pairIdx + 1}
                          </span>
                          <input
                            type="text"
                            value={pair.group}
                            onChange={(e) => handleUpdatePairGroup(pairIdx, e.target.value)}
                            placeholder="Tiêu đề nhóm/gói (ví dụ: Gói khám tổng quát, Bảng giá sinh hóa...)"
                            className="flex-1 px-3 py-1.5 text-xs bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-slate-900 font-semibold"
                          />
                        </div>

                        <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
                          <button
                            type="button"
                            onClick={() => handleMovePair(pairIdx, "up")}
                            disabled={isFirst}
                            title="Di chuyển cặp này lên trên"
                            className={`p-1.5 rounded-lg border border-slate-200 bg-white transition-colors ${
                              isFirst
                                ? "text-slate-300 cursor-not-allowed"
                                : "text-slate-600 hover:bg-slate-100"
                            }`}
                          >
                            <ArrowUp size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMovePair(pairIdx, "down")}
                            disabled={isLast}
                            title="Di chuyển cặp này xuống dưới"
                            className={`p-1.5 rounded-lg border border-slate-200 bg-white transition-colors ${
                              isLast
                                ? "text-slate-300 cursor-not-allowed"
                                : "text-slate-600 hover:bg-slate-100"
                            }`}
                          >
                            <ArrowDown size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (hasAnyImage) {
                                setPairToDeleteIdx(pairIdx);
                              } else {
                                handleConfirmDeletePair(pairIdx);
                              }
                            }}
                            title="Xóa cặp ảnh này"
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-red-600 hover:bg-red-50 text-xs font-semibold transition-colors"
                          >
                            <Trash2 size={13} />
                            <span>Xóa cặp</span>
                          </button>
                        </div>
                      </div>

                      {/* 2 Khung Cân Đối Bằng Nhau: Mặt trước & Mặt sau */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Khung 1: Mặt trước */}
                        <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3 shadow-2xs">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                              Mặt trước
                            </span>
                            {pair.front.url && (
                              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Check size={12} /> Đã có ảnh
                              </span>
                            )}
                          </div>

                          {/* Preview Khung Cân Đối */}
                          <div className="w-full aspect-[4/3] bg-slate-50 border border-dashed border-slate-300 rounded-xl overflow-hidden relative flex flex-col items-center justify-center">
                            {pair.front.url ? (
                              <Image
                                src={pair.front.url}
                                alt={pair.front.label || "Mặt trước"}
                                fill
                                unoptimized
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="object-contain p-2"
                              />
                            ) : (
                              <div className="text-center p-4 text-slate-400">
                                <ImageIcon size={32} className="mx-auto mb-2 opacity-50" />
                                <p className="text-xs font-medium">Chưa chọn ảnh mặt trước</p>
                              </div>
                            )}
                          </div>

                          {/* Nhãn khung 1 */}
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 mb-1">
                              Nhãn hiển thị
                            </label>
                            <input
                              type="text"
                              value={pair.front.label}
                              onChange={(e) =>
                                handleUpdatePairImage(
                                  pairIdx,
                                  "front",
                                  pair.front.url,
                                  e.target.value
                                )
                              }
                              placeholder="Mặt trước"
                              className="w-full px-3 py-1.5 text-xs bg-white rounded-lg border border-slate-300 text-slate-800"
                            />
                          </div>

                          {/* Nút Chọn / Đổi ảnh & Xóa ảnh */}
                          <div className="flex items-center gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => setMediaPickerTarget({ pairIdx, side: "front" })}
                              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                            >
                              <ImageIcon size={14} />
                              <span>{pair.front.url ? "Đổi ảnh" : "Chọn / Tải ảnh"}</span>
                            </button>
                            {pair.front.url && (
                              <button
                                type="button"
                                onClick={() => handleUpdatePairImage(pairIdx, "front", "")}
                                className="p-2 border border-slate-200 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                title="Xóa ảnh mặt trước"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Khung 2: Mặt sau */}
                        <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3 shadow-2xs">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                              Mặt sau
                            </span>
                            {pair.back.url && (
                              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Check size={12} /> Đã có ảnh
                              </span>
                            )}
                          </div>

                          {/* Preview Khung Cân Đối */}
                          <div className="w-full aspect-[4/3] bg-slate-50 border border-dashed border-slate-300 rounded-xl overflow-hidden relative flex flex-col items-center justify-center">
                            {pair.back.url ? (
                              <Image
                                src={pair.back.url}
                                alt={pair.back.label || "Mặt sau"}
                                fill
                                unoptimized
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="object-contain p-2"
                              />
                            ) : (
                              <div className="text-center p-4 text-slate-400">
                                <ImageIcon size={32} className="mx-auto mb-2 opacity-50" />
                                <p className="text-xs font-medium">Chưa chọn ảnh mặt sau</p>
                              </div>
                            )}
                          </div>

                          {/* Nhãn khung 2 */}
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 mb-1">
                              Nhãn hiển thị
                            </label>
                            <input
                              type="text"
                              value={pair.back.label}
                              onChange={(e) =>
                                handleUpdatePairImage(pairIdx, "back", pair.back.url, e.target.value)
                              }
                              placeholder="Mặt sau"
                              className="w-full px-3 py-1.5 text-xs bg-white rounded-lg border border-slate-300 text-slate-800"
                            />
                          </div>

                          {/* Nút Chọn / Đổi ảnh & Xóa ảnh */}
                          <div className="flex items-center gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => setMediaPickerTarget({ pairIdx, side: "back" })}
                              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                            >
                              <ImageIcon size={14} />
                              <span>{pair.back.url ? "Đổi ảnh" : "Chọn / Tải ảnh"}</span>
                            </button>
                            {pair.back.url && (
                              <button
                                type="button"
                                onClick={() => handleUpdatePairImage(pairIdx, "back", "")}
                                className="p-2 border border-slate-200 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                title="Xóa ảnh mặt sau"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Nút Thêm Cặp Ảnh ở Dưới Cùng */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={handleAddPair}
                  disabled={imagePairs.length >= 20}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-dashed border-purple-300 hover:border-purple-500 bg-purple-50/50 hover:bg-purple-50 text-purple-700 font-bold text-xs transition-all cursor-pointer disabled:opacity-50"
                >
                  <Plus size={16} />
                  <span>+ Thêm một cặp ảnh mới ({imagePairs.length}/20)</span>
                </button>
              </div>
            </div>
          )}
        </div>

      {/* Section 4: Cài đặt hiển thị & Đối tượng */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-slate-700" />
          Cài đặt hiển thị & Phân loại
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Đối tượng phù hợp */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Đối tượng phù hợp (Target info)
            </label>
            <input
              type="text"
              value={targetInfo}
              onChange={(e) => {
                setTargetInfo(e.target.value);
                setIsDirty(true);
              }}
              placeholder="Người cao tuổi, bệnh nhân sau phẫu thuật..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 text-sm text-slate-800"
            />
          </div>

          {/* Biểu tượng (Icon) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Biểu tượng (Icon key)
            </label>
            <input
              type="text"
              value={icon}
              onChange={(e) => {
                setIcon(e.target.value);
                setIsDirty(true);
              }}
              placeholder="Activity, Stethoscope..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 text-sm text-slate-800"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Tùy chọn. Thẻ dịch vụ hiện dùng icon cố định.
            </p>
          </div>

          {/* Thứ tự hiển thị */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Thứ tự ưu tiên (Sort order)
            </label>
            <input
              type="number"
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(Number(e.target.value) || 0);
                setIsDirty(true);
              }}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 text-sm font-semibold text-slate-800"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Số nhỏ hơn sẽ hiển thị trước (1, 2, 3...).
            </p>
          </div>
        </div>

        {/* Trạng thái Xuất bản */}
        <div className="pt-4 border-t border-slate-100">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => {
                setIsPublished(e.target.checked);
                setIsDirty(true);
              }}
              className="w-5 h-5 rounded text-brand-primary focus:ring-brand-primary/20 border-slate-300"
            />
            <div>
              <span className="text-sm font-bold text-slate-900">
                Xuất bản dịch vụ này lên website
              </span>
              <p className="text-xs text-slate-500">
                Nếu bỏ chọn, dịch vụ sẽ chuyển thành bản nháp và ẩn hoàn toàn khỏi website công khai.
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Sticky Bottom Actions Bar */}
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
            href={`/admin/${category}`}
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
                <span>Đang lưu dịch vụ...</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>Lưu dịch vụ</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Modal MediaPicker */}
      <MediaPicker
        isOpen={mediaPickerTarget !== null}
        onClose={() => setMediaPickerTarget(null)}
        onSelect={(url) => {
          if (mediaPickerTarget) {
            handleUpdatePairImage(mediaPickerTarget.pairIdx, mediaPickerTarget.side, url);
          }
          setMediaPickerTarget(null);
        }}
        title={
          mediaPickerTarget
            ? `Chọn ảnh ${mediaPickerTarget.side === "front" ? "Mặt trước" : "Mặt sau"} (Cặp #${
                mediaPickerTarget.pairIdx + 1
              })`
            : "Chọn ảnh bảng giá"
        }
      />

      {/* Modal Xác Nhận Xóa Cặp Ảnh */}
      {pairToDeleteIdx !== null && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-11 h-11 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-3">
              <Trash2 size={20} />
            </div>
            <h4 className="text-base font-bold text-slate-900 mb-1.5">
              Xóa Cặp Ảnh #{pairToDeleteIdx + 1}?
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed mb-5">
              Cặp ảnh này đang chứa hình ảnh. Bạn có chắc muốn xóa toàn bộ cặp ảnh này khỏi bảng giá không?
            </p>
            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setPairToDeleteIdx(null)}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={() => handleConfirmDeletePair(pairToDeleteIdx)}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-xs transition-colors"
              >
                Xóa cặp ảnh
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
