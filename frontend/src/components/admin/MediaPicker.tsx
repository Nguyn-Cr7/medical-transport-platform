"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  X,
  Upload,
  Check,
  Image as ImageIcon,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface StorageFile {
  name: string;
  id?: string | null;
  updated_at?: string | null;
  created_at?: string | null;
  last_accessed_at?: string | null;
  metadata?: {
    size?: number;
    mimetype?: string;
    [key: string]: unknown;
  } | null;
  publicUrl: string;
}

interface MediaPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  title?: string;
}

export function sanitizeFileName(originalName: string): string {
  const noAccents = originalName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");

  const clean = noAccents
    .toLowerCase()
    .replace(/[^a-z0-9.]/g, "-")
    .replace(/-+/g, "-");

  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 6);
  return `${timestamp}-${randomStr}-${clean}`;
}

export function MediaPicker({
  isOpen,
  onClose,
  onSelect,
  title = "Chọn Hình Ảnh Từ Thư Viện",
}: MediaPickerProps) {
  const [files, setFiles] = useState<StorageFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [selectedUrl, setSelectedUrl] = useState("");
  const [tab, setTab] = useState<"library" | "upload">("library");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = "unset";
      return;
    }
    document.body.style.overflow = "hidden";

    let isMounted = true;
    const loadFiles = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.storage.from("media").list("", {
          limit: 100,
          sortBy: { column: "created_at", order: "desc" },
        });

        if (!isMounted) return;

        if (error) {
          console.error("[MediaPicker] Error listing files:", error);
          setUploadError("Không thể tải danh sách hình ảnh từ lưu trữ.");
          return;
        }

        if (data) {
          const mapped = data
            .filter((item) => item.name !== ".emptyFolderPlaceholder")
            .map((item) => {
              const {
                data: { publicUrl },
              } = supabase.storage.from("media").getPublicUrl(item.name);
              return {
                ...item,
                publicUrl,
              };
            });
          setFiles(mapped);
        }
      } catch (err) {
        if (isMounted) {
          console.error("[MediaPicker] Unexpected error:", err);
          setUploadError("Lỗi kết nối khi lấy dữ liệu hình ảnh.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadFiles();

    return () => {
      isMounted = false;
      document.body.style.overflow = "unset";
    };
  }, [isOpen, refreshKey]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    setUploadError("");
    setUploading(true);

    const file = fileList[0];

    // Validate size (5MB = 5 * 1024 * 1024)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError(`File "${file.name}" vượt quá giới hạn 5MB.`);
      setUploading(false);
      return;
    }

    // Validate mime
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setUploadError(`File "${file.name}" không hợp lệ. Chỉ chấp nhận JPG, PNG hoặc WEBP.`);
      setUploading(false);
      return;
    }

    try {
      const supabase = createClient();
      const safeName = sanitizeFileName(file.name);

      const { error } = await supabase.storage.from("media").upload(safeName, file, {
        cacheControl: "3600",
        upsert: false,
      });

      if (error) {
        console.error("[MediaPicker] Upload error:", error);
        setUploadError(`Lỗi khi tải ảnh: ${error.message}`);
        setUploading(false);
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("media").getPublicUrl(safeName);

      setRefreshKey((k) => k + 1);
      setSelectedUrl(publicUrl);
      setTab("library");
    } catch (err) {
      console.error("[MediaPicker] Upload failed:", err);
      setUploadError("Đã xảy ra lỗi trong quá trình tải ảnh.");
    } finally {
      setUploading(false);
    }
  };

  const handleConfirmSelect = () => {
    if (selectedUrl) {
      onSelect(selectedUrl);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-light text-brand-primary flex items-center justify-center">
              <ImageIcon size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">{title}</h3>
              <p className="text-xs text-slate-500">
                Chọn ảnh có sẵn từ thư viện hoặc tải lên hình ảnh mới
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="px-6 pt-4 flex gap-3 border-b border-slate-100">
          <button
            onClick={() => setTab("library")}
            className={`pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
              tab === "library"
                ? "border-brand-primary text-brand-primary"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Thư viện ảnh ({files.length})
          </button>
          <button
            onClick={() => setTab("upload")}
            className={`pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
              tab === "upload"
                ? "border-brand-primary text-brand-primary"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Tải ảnh mới
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 min-h-[300px]">
          {uploadError && (
            <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          {tab === "upload" ? (
            <div className="border-2 border-dashed border-slate-300 rounded-3xl p-10 text-center flex flex-col items-center justify-center bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-brand-light text-brand-primary flex items-center justify-center mb-4">
                <Upload size={28} />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1">
                Kéo thả hoặc bấm để tải ảnh lên
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mb-6 leading-relaxed">
                Định dạng hỗ trợ: JPG, PNG, WEBP. Dung lượng tối đa: 5MB/file.
              </p>
              <label className="inline-flex items-center gap-2 bg-brand-primary hover:bg-brand-primary-dark text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow cursor-pointer text-sm">
                <Upload size={16} />
                <span>{uploading ? "Đang tải ảnh lên..." : "Chọn ảnh từ máy tính"}</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>
          ) : loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
              <span className="text-xs font-medium">Đang tải danh sách ảnh...</span>
            </div>
          ) : files.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="text-sm font-medium">Thư viện chưa có hình ảnh nào.</p>
              <button
                onClick={() => setTab("upload")}
                className="mt-3 text-xs font-bold text-brand-primary hover:underline cursor-pointer"
              >
                Tải ảnh đầu tiên ngay →
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {files.map((file) => {
                const isSelected = selectedUrl === file.publicUrl;
                return (
                  <div
                    key={file.name}
                    onClick={() => setSelectedUrl(file.publicUrl)}
                    className={`group relative aspect-square rounded-2xl border-2 overflow-hidden bg-slate-100 cursor-pointer transition-all ${
                      isSelected
                        ? "border-brand-primary ring-4 ring-brand-primary/20 shadow-md scale-[1.02]"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <Image
                      src={file.publicUrl}
                      alt={file.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-brand-primary text-white flex items-center justify-center shadow">
                        <Check size={14} />
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent p-2 text-white">
                      <p className="text-[11px] font-medium truncate">{file.name}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="text-xs text-slate-500 truncate max-w-sm sm:max-w-md">
            {selectedUrl ? (
              <span className="text-slate-700 font-medium truncate block">
                Đã chọn: <span className="text-brand-primary">{selectedUrl}</span>
              </span>
            ) : (
              "Vui lòng chọn 1 hình ảnh từ thư viện"
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              onClick={handleConfirmSelect}
              disabled={!selectedUrl}
              className="bg-brand-primary hover:bg-brand-primary-dark text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Chọn ảnh này
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
