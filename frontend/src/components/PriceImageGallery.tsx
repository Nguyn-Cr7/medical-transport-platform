"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { AlertCircle, Maximize2, X } from "lucide-react";
import type { PriceImage } from "@/types/content";

interface PriceImageGalleryProps {
  images: PriceImage[];
  title?: string;
}

export function PriceImageGallery({ images, title }: PriceImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<PriceImage | null>(null);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedImage(null);
      }
    };
    if (selectedImage) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [selectedImage]);

  // Case 0: Empty price images
  if (!images || images.length === 0) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 text-center my-8">
        <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
        <h4 className="text-lg font-bold text-amber-900 mb-2">
          {title ? `Bảng giá ${title} đang được cập nhật` : "Bảng giá đang được cập nhật"}
        </h4>
        <p className="text-sm text-amber-700 max-w-md mx-auto">
          Vui lòng liên hệ qua Zalo để được báo giá và tư vấn nhanh chóng.
        </p>
      </div>
    );
  }

  // Case 1: Exactly 1 image
  if (images.length === 1) {
    const img = images[0];
    const label = img.label || title || "Bảng giá dịch vụ";
    return (
      <>
        <div className="max-w-xl mx-auto my-8">
          <div
            onClick={() => setSelectedImage(img)}
            className="group relative aspect-[3/4] sm:aspect-[4/5] bg-slate-100 rounded-2xl border border-slate-200 overflow-hidden cursor-zoom-in shadow-sm hover:shadow-md transition-all"
            role="button"
            tabIndex={0}
            aria-label={`Phóng to ${label}`}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") setSelectedImage(img);
            }}
          >
            <Image
              src={img.url}
              alt={label}
              fill
              className="object-contain p-2 group-hover:scale-[1.02] transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, 600px"
            />
            <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full shadow">
              {label}
            </div>
            <div className="absolute bottom-4 right-4 bg-white/90 text-slate-700 p-2 rounded-xl shadow opacity-0 group-hover:opacity-100 transition-opacity">
              <Maximize2 size={18} />
            </div>
          </div>
          <p className="text-xs text-center text-slate-500 mt-2">Bấm vào ảnh để phóng to</p>
        </div>

        {/* Lightbox Modal */}
        {renderLightbox(selectedImage, () => setSelectedImage(null))}
      </>
    );
  }

  // Case 2+: 2 or more images in balanced 2-column grid
  return (
    <>
      <div className="my-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {images.slice(0, 2).map((img, idx) => {
            const defaultLabel = idx === 0 ? "Mặt trước" : "Mặt sau";
            const label = img.label || defaultLabel;
            return (
              <div key={idx} className="flex flex-col">
                <div
                  onClick={() => setSelectedImage(img)}
                  className="group relative aspect-[3/4] sm:aspect-[4/5] bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden cursor-zoom-in shadow-sm hover:shadow-md transition-all"
                  role="button"
                  tabIndex={0}
                  aria-label={`Phóng to ${label}`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") setSelectedImage(img);
                  }}
                >
                  <Image
                    src={img.url}
                    alt={label}
                    fill
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
      </div>

      {/* Lightbox Modal */}
      {renderLightbox(selectedImage, () => setSelectedImage(null))}
    </>
  );
}

function renderLightbox(img: PriceImage | null, onClose: () => void) {
  if (!img) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-colors z-50"
        aria-label="Đóng bảng giá"
      >
        <X size={24} />
      </button>

      {img.label && (
        <div className="absolute top-5 left-6 text-white text-sm font-semibold tracking-wide bg-black/50 px-3.5 py-1.5 rounded-full">
          {img.label}
        </div>
      )}

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-5xl max-h-[90vh] w-full h-[85vh] flex items-center justify-center"
      >
        <Image
          src={img.url}
          alt={img.label || "Bảng giá phóng to"}
          fill
          className="object-contain"
          sizes="90vw"
          priority
        />
      </div>
    </div>
  );
}
