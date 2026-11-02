"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  AlertCircle,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  Bookmark,
} from "lucide-react";
import type { PriceImage } from "@/types/content";

interface PriceImageGalleryProps {
  images: PriceImage[];
  title?: string;
}

interface DisplayPair {
  id: string;
  group?: string;
  items: {
    image: PriceImage;
    globalIndex: number;
  }[];
}

/**
 * Gom danh sách ảnh phẳng thành các cặp hiển thị (tối đa 2 ảnh / cặp)
 */
function groupImagesIntoPairs(images: PriceImage[]): DisplayPair[] {
  if (!images || images.length === 0) return [];

  const pairs: DisplayPair[] = [];
  let i = 0;

  while (i < images.length) {
    const current = images[i];
    const next = images[i + 1];

    const currentGroup = (current.group || "").trim();
    const nextGroup = next ? (next.group || "").trim() : "";

    // Nếu ảnh kế tiếp có cùng group hoặc cả hai đều không có group, ghép thành 1 cặp
    if (next && (currentGroup === nextGroup || (!currentGroup && !nextGroup))) {
      pairs.push({
        id: `pair-${pairs.length}`,
        group: currentGroup || undefined,
        items: [
          { image: current, globalIndex: i },
          { image: next, globalIndex: i + 1 },
        ],
      });
      i += 2;
    } else {
      pairs.push({
        id: `pair-${pairs.length}`,
        group: currentGroup || undefined,
        items: [{ image: current, globalIndex: i }],
      });
      i += 1;
    }
  }

  return pairs;
}

export function PriceImageGallery({ images, title }: PriceImageGalleryProps) {
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  const totalImages = images?.length || 0;
  const pairs = groupImagesIntoPairs(images);

  // Keyboard navigation for Lightbox
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (activeLightboxIndex === null) return;

      if (e.key === "Escape") {
        setActiveLightboxIndex(null);
      } else if (e.key === "ArrowLeft") {
        setActiveLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : totalImages - 1));
      } else if (e.key === "ArrowRight") {
        setActiveLightboxIndex((prev) => (prev !== null && prev < totalImages - 1 ? prev + 1 : 0));
      }
    },
    [activeLightboxIndex, totalImages]
  );

  useEffect(() => {
    if (activeLightboxIndex !== null) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [activeLightboxIndex, handleKeyDown]);

  // Cuộn mượt tới vị trí cặp ảnh
  const scrollToPair = (pairId: string) => {
    const el = document.getElementById(pairId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Case 0: Không có ảnh nào
  if (!images || images.length === 0) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 text-center my-8">
        <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
        <h4 className="text-lg font-bold text-amber-900 mb-2">
          {title ? `Bảng giá ${title} đang được cập nhật` : "Bảng giá đang được cập nhật"}
        </h4>
        <p className="text-sm text-amber-700 max-w-md mx-auto">
          Vui lòng liên hệ qua Zalo hoặc Hotline để được báo giá và tư vấn nhanh chóng.
        </p>
      </div>
    );
  }

  const activeImage = activeLightboxIndex !== null ? images[activeLightboxIndex] : null;

  return (
    <div className="my-8 space-y-12">
      {/* Mục lục nhảy nhanh (Chỉ hiển thị khi có từ 4 cặp trở lên) */}
      {pairs.length >= 4 && (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
            <Bookmark size={15} className="text-brand-primary" />
            <span>Mục lục các gói bảng giá ({pairs.length} phần):</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {pairs.map((pair, pIdx) => {
              const label = pair.group || `Bảng giá ${pIdx + 1}`;
              return (
                <button
                  key={pair.id}
                  type="button"
                  onClick={() => scrollToPair(pair.id)}
                  className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-brand-primary hover:text-white border border-slate-200 text-slate-700 text-xs font-semibold shadow-2xs transition-all cursor-pointer"
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Danh sách các cặp ảnh */}
      {pairs.map((pair) => {
        const isSingle = pair.items.length === 1;

        return (
          <section key={pair.id} id={pair.id} className="scroll-mt-24 space-y-4">
            {/* Tiêu đề nhóm / Gói (nếu có) */}
            {pair.group && (
              <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-200">
                <FileSpreadsheet className="text-brand-primary" size={22} />
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  {pair.group}
                </h3>
              </div>
            )}

            {/* Khung hiển thị ảnh: 2 Khung Cân Đối hoặc 1 Khung Giữa */}
            {isSingle ? (
              // Cặp chỉ có 1 ảnh: Hiển thị 1 khung ở giữa, giữ đúng tỷ lệ và kích thước tiêu chuẩn
              <div className="max-w-md mx-auto">
                <div className="flex flex-col">
                  <div
                    onClick={() => setActiveLightboxIndex(pair.items[0].globalIndex)}
                    className="group relative aspect-[3/4] sm:aspect-[4/5] bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden cursor-zoom-in shadow-xs hover:shadow-md transition-all"
                    role="button"
                    tabIndex={0}
                    aria-label={`Phóng to ${pair.items[0].image.label || "Bảng giá"}`}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        setActiveLightboxIndex(pair.items[0].globalIndex);
                      }
                    }}
                  >
                    <Image
                      src={pair.items[0].image.url}
                      alt={pair.items[0].image.label || "Bảng giá"}
                      fill
                      loading="lazy"
                      className="object-contain p-2 group-hover:scale-[1.02] transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, 450px"
                    />
                    <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full shadow">
                      {pair.items[0].image.label || "Bảng giá"}
                    </div>
                    <div className="absolute bottom-4 right-4 bg-white/90 text-slate-700 p-2 rounded-xl shadow opacity-0 group-hover:opacity-100 transition-opacity">
                      <Maximize2 size={18} />
                    </div>
                  </div>
                  <div className="mt-2 text-center text-xs font-medium text-slate-600">
                    {pair.items[0].image.label || "Bảng giá"} •{" "}
                    <span className="text-brand-primary">Bấm để phóng to</span>
                  </div>
                </div>
              </div>
            ) : (
              // Cặp đầy đủ 2 ảnh: Grid 2 cột cân đối trên desktop, 1 cột trên mobile
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pair.items.map((item, itemIdx) => {
                  const defaultLabel = itemIdx === 0 ? "Mặt trước" : "Mặt sau";
                  const label = item.image.label || defaultLabel;

                  return (
                    <div key={itemIdx} className="flex flex-col">
                      <div
                        onClick={() => setActiveLightboxIndex(item.globalIndex)}
                        className="group relative aspect-[3/4] sm:aspect-[4/5] bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden cursor-zoom-in shadow-xs hover:shadow-md transition-all"
                        role="button"
                        tabIndex={0}
                        aria-label={`Phóng to ${label}`}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            setActiveLightboxIndex(item.globalIndex);
                          }
                        }}
                      >
                        <Image
                          src={item.image.url}
                          alt={label}
                          fill
                          loading="lazy"
                          className="object-contain p-2 group-hover:scale-[1.02] transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full shadow">
                          {label}
                        </div>
                        <div className="absolute bottom-4 right-4 bg-white/90 text-slate-700 p-2 rounded-xl shadow opacity-0 group-hover:opacity-100 transition-opacity">
                          <Maximize2 size={18} />
                        </div>
                      </div>
                      <div className="mt-2 text-center text-xs font-medium text-slate-600">
                        {label} • <span className="text-brand-primary">Bấm để phóng to</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        );
      })}

      {/* Enhanced Lightbox Modal */}
      {activeImage && activeLightboxIndex !== null && (
        <div
          onClick={() => setActiveLightboxIndex(null)}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          {/* Top Bar: Nhãn, Số thứ tự ảnh, Nút Đóng */}
          <div className="absolute top-3 left-4 right-4 sm:top-5 sm:left-6 sm:right-6 flex items-center justify-between z-50">
            <div className="flex items-center gap-2 max-w-[70%] truncate">
              {activeImage.group && (
                <span className="text-white/80 text-xs sm:text-sm font-semibold bg-white/10 px-3 py-1 rounded-full truncate">
                  {activeImage.group}
                </span>
              )}
              {activeImage.label && (
                <span className="text-white text-xs sm:text-sm font-bold bg-brand-primary/80 px-3 py-1 rounded-full truncate">
                  {activeImage.label}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-white/80 text-xs sm:text-sm font-mono font-bold bg-white/10 px-3 py-1 rounded-full">
                {activeLightboxIndex + 1} / {totalImages}
              </span>

              <button
                type="button"
                onClick={() => setActiveLightboxIndex(null)}
                className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors cursor-pointer"
                aria-label="Đóng bảng giá"
              >
                <X size={22} />
              </button>
            </div>
          </div>

          {/* Navigation: Nút Trước (Prev) */}
          {totalImages > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveLightboxIndex(
                  activeLightboxIndex > 0 ? activeLightboxIndex - 1 : totalImages - 1
                );
              }}
              className="absolute left-2 sm:left-6 text-white/80 hover:text-white bg-white/10 hover:bg-white/25 p-3 rounded-full transition-all z-50 cursor-pointer"
              title="Ảnh trước (Mũi tên trái)"
            >
              <ChevronLeft size={28} />
            </button>
          )}

          {/* Khung Ảnh Phóng To */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl max-h-[85vh] w-full h-[80vh] flex items-center justify-center p-2"
          >
            <Image
              src={activeImage.url}
              alt={activeImage.label || "Bảng giá phóng to"}
              fill
              className="object-contain"
              sizes="95vw"
              priority
            />
          </div>

          {/* Navigation: Nút Kế Tiếp (Next) */}
          {totalImages > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveLightboxIndex(
                  activeLightboxIndex < totalImages - 1 ? activeLightboxIndex + 1 : 0
                );
              }}
              className="absolute right-2 sm:right-6 text-white/80 hover:text-white bg-white/10 hover:bg-white/25 p-3 rounded-full transition-all z-50 cursor-pointer"
              title="Ảnh kế tiếp (Mũi tên phải)"
            >
              <ChevronRight size={28} />
            </button>
          )}

          {/* Gợi ý phím tắt ở đáy */}
          <div className="absolute bottom-3 text-white/50 text-[11px] font-medium hidden sm:block">
            Sử dụng phím mũi tên <strong>←</strong> / <strong>→</strong> để chuyển ảnh • Phím{" "}
            <strong>ESC</strong> để đóng
          </div>
        </div>
      )}
    </div>
  );
}
