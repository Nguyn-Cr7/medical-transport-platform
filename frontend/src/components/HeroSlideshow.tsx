"use client";

import React, { useState, useEffect, useCallback, useRef, useSyncExternalStore } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { HeroImageItem } from "@/types/content";

interface HeroSlideshowProps {
  images?: HeroImageItem[];
  intervalSeconds?: number;
}

// External store subscriptions for prefers-reduced-motion
function subscribeReducedMotion(callback: () => void) {
  if (typeof window === "undefined" || !window.matchMedia) {
    return () => {};
  }
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  mediaQuery.addEventListener?.("change", callback);
  return () => {
    mediaQuery.removeEventListener?.("change", callback);
  };
}

function getReducedMotionSnapshot() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

// External store subscriptions for document visibility
function subscribeVisibility(callback: () => void) {
  if (typeof document === "undefined") return () => {};
  document.addEventListener("visibilitychange", callback);
  return () => document.removeEventListener("visibilitychange", callback);
}

function getVisibilitySnapshot() {
  if (typeof document === "undefined") return true;
  return document.visibilityState === "visible";
}

function getVisibilityServerSnapshot() {
  return true;
}

export function HeroSlideshow({ images = [], intervalSeconds = 5 }: HeroSlideshowProps) {
  // Filter valid items
  const validImages = images.filter(
    (img) => Boolean(img && typeof img.url === "string" && img.url.trim().length > 0)
  );

  const total = validImages.length;
  const clampedInterval = Math.min(Math.max(intervalSeconds, 2), 30) * 1000;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);

  // Synchronize browser capabilities without triggering cascading renders
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  const isTabVisible = useSyncExternalStore(
    subscribeVisibility,
    getVisibilitySnapshot,
    getVisibilityServerSnapshot
  );

  // Swipe coordinates
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  const nextSlide = useCallback(() => {
    if (total < 2) return;
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    if (total < 2) return;
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // Autoplay timer
  useEffect(() => {
    if (total < 2) return;
    if (isHovered || isInteracting || !isTabVisible || prefersReducedMotion) {
      return;
    }

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % total);
    }, clampedInterval);

    return () => clearInterval(timer);
  }, [total, clampedInterval, isHovered, isInteracting, isTabVisible, prefersReducedMotion]);

  // Touch event handlers (swipe on mobile)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (total < 2) return;
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
    setIsInteracting(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current !== null && touchStartYRef.current !== null) {
      const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
      const deltaY = e.changedTouches[0].clientY - touchStartYRef.current;

      // Only trigger if horizontal movement is dominant and > 40px
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 40) {
        if (deltaX > 0) {
          prevSlide();
        } else {
          nextSlide();
        }
      }
    }
    touchStartXRef.current = null;
    touchStartYRef.current = null;
    setIsInteracting(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (total < 2) return;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      prevSlide();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      nextSlide();
    }
  };

  // 0 images -> keep exact current gray placeholder
  if (total === 0) {
    return (
      <div className="bg-slate-200 rounded-2xl aspect-[4/3] flex items-center justify-center border border-slate-300 shadow-sm overflow-hidden">
        <div className="text-slate-400 font-medium">Healthcare Image Placeholder</div>
      </div>
    );
  }

  // 1 image -> static image, no autoplay, no navigation controls
  if (total === 1) {
    const single = validImages[0];
    return (
      <div className="relative bg-slate-100 rounded-2xl aspect-[4/3] border border-slate-300 shadow-sm overflow-hidden">
        <Image
          src={single.url}
          alt={single.alt || "Dịch vụ y tế và vận chuyển CAREVIA"}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
          unoptimized
        />
      </div>
    );
  }

  // >= 2 images: Slideshow controls
  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Hình ảnh giới thiệu CAREVIA"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={() => {
        touchStartXRef.current = null;
        touchStartYRef.current = null;
        setIsInteracting(false);
      }}
      className="relative rounded-2xl aspect-[4/3] border border-slate-300 shadow-sm overflow-hidden bg-slate-900 group select-none focus:outline-none focus:ring-2 focus:ring-brand-primary"
    >
      {/* Screen Reader polite indicator */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {`Ảnh ${currentIndex + 1} trên tổng số ${total}`}
      </div>

      {/* Image Layers (Crossfade) */}
      {validImages.map((img, idx) => {
        const isActive = idx === currentIndex;
        return (
          <div
            key={img.url + idx}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
            aria-hidden={!isActive}
          >
            <Image
              src={img.url}
              alt={img.alt || `CAREVIA - Ảnh giới thiệu ${idx + 1}`}
              fill
              priority={idx === 0}
              loading={idx === 0 ? "eager" : "lazy"}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              unoptimized
            />
          </div>
        );
      })}

      {/* Desktop Prev/Next Buttons (Visible on hover & focus) */}
      <button
        type="button"
        onClick={prevSlide}
        aria-label="Xem ảnh trước đó"
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-slate-800 shadow-md backdrop-blur-xs flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus:opacity-100 transition-all cursor-pointer hover:scale-105 active:scale-95"
      >
        <ChevronLeft size={20} />
      </button>

      <button
        type="button"
        onClick={nextSlide}
        aria-label="Xem ảnh tiếp theo"
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-slate-800 shadow-md backdrop-blur-xs flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus:opacity-100 transition-all cursor-pointer hover:scale-105 active:scale-95"
      >
        <ChevronRight size={20} />
      </button>

      {/* Indicator Dots */}
      <div
        role="tablist"
        aria-label="Chọn ảnh trình chiếu"
        className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-black/40 backdrop-blur-xs px-3 py-1.5 rounded-full"
      >
        {validImages.map((_, idx) => {
          const isActive = idx === currentIndex;
          return (
            <button
              key={idx}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={`Ảnh ${idx + 1}/${total}`}
              onClick={() => goToSlide(idx)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                isActive
                  ? "w-6 bg-white shadow-xs"
                  : "w-2 bg-white/50 hover:bg-white/80"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
