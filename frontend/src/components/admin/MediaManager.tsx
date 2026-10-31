"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Upload,
  Copy,
  Trash2,
  Check,
  Image as ImageIcon,
  Loader2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { sanitizeFileName } from "./MediaPicker";

interface StorageItem {
  name: string;
  id?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  last_accessed_at?: string | null;
  metadata?: {
    size?: number;
    mimetype?: string;
    [key: string]: unknown;
  } | null;
  publicUrl: string;
}

export function MediaManager() {
  const [files, setFiles] = useState<StorageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState("");
  const [copiedName, setCopiedName] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<StorageItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.storage.from("media").list("", {
          limit: 200,
          sortBy: { column: "created_at", order: "desc" },
        });

        if (!isMounted) return;

        if (error) {
          console.error("[MediaManager] Error listing media:", error);
          setErrorMessage("Không thể kết nối đến lưu trữ Supabase Storage.");
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
          console.error("[MediaManager] Error:", err);
          setErrorMessage("Đã xảy ra lỗi kết nối.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadData();

    return () => {
      isMounted = false;
    };
  }, [refreshKey]);

  const handleMultiUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    setErrorMessage("");
    setUploading(true);

    const supabase = createClient();
    const filesArray = Array.from(fileList);
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxBytes = 5 * 1024 * 1024;

    let successCount = 0;
    const errors: string[] = [];

    for (let i = 0; i < filesArray.length; i++) {
      const file = filesArray[i];
      setUploadProgress(`Đang tải lên ${i + 1}/${filesArray.length}: ${file.name}`);

      if (!allowedTypes.includes(file.type)) {
        errors.push(`"${file.name}": Chỉ chấp nhận định dạng JPG, PNG hoặc WEBP.`);
        continue;
      }

      if (file.size > maxBytes) {
        errors.push(`"${file.name}": Vượt quá dung lượng 5MB.`);
        continue;
      }

      const safeName = sanitizeFileName(file.name);
      const { error } = await supabase.storage.from("media").upload(safeName, file, {
        cacheControl: "3600",
        upsert: false,
      });

      if (error) {
        errors.push(`"${file.name}": ${error.message}`);
      } else {
        successCount++;
      }
    }

    if (errors.length > 0) {
      setErrorMessage(errors.join(" | "));
    }

    setUploading(false);
    setUploadProgress("");
    if (successCount > 0) {
      setRefreshKey((k) => k + 1);
    }
    // Reset file input
    e.target.value = "";
  };

  const copyUrl = (file: StorageItem) => {
    navigator.clipboard.writeText(file.publicUrl);
    setCopiedName(file.name);
    setTimeout(() => {
      setCopiedName("");
    }, 2000);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.storage
        .from("media")
        .remove([deleteTarget.name]);

      if (error) {
        setErrorMessage(`Lỗi khi xóa ảnh: ${error.message}`);
      } else {
        setFiles((prev) => prev.filter((f) => f.name !== deleteTarget.name));
        setDeleteTarget(null);
      }
    } catch (err) {
      console.error("[MediaManager] Delete failed:", err);
      setErrorMessage("Không thể xóa ảnh. Vui lòng thử lại.");
    } finally {
      setDeleting(false);
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "N/A";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Quản Lý Hình Ảnh (Media)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Lưu trữ hình ảnh trên Supabase Storage bucket <code className="bg-slate-200 px-1.5 py-0.5 rounded font-mono text-slate-800">media</code> (giới hạn 5MB/ảnh)
          </p>
        </div>

        <label className="inline-flex items-center gap-2 bg-brand-primary hover:bg-brand-primary-dark text-white font-bold py-2.5 px-5 rounded-xl transition-all shadow cursor-pointer text-sm shrink-0">
          <Upload size={16} />
          <span>{uploading ? "Đang tải ảnh lên..." : "Tải lên ảnh mới"}</span>
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            onChange={handleMultiUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {uploadProgress && (
        <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-800 text-xs flex items-center gap-3">
          <Loader2 className="w-4 h-4 animate-spin text-brand-primary shrink-0" />
          <span>{uploadProgress}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-3">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <span className="leading-relaxed">{errorMessage}</span>
        </div>
      )}

      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center text-slate-400 gap-3 bg-white rounded-3xl border border-slate-200">
          <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
          <span className="text-xs font-medium">Đang tải danh sách ảnh...</span>
        </div>
      ) : files.length === 0 ? (
        <div className="py-24 text-center bg-white rounded-3xl border border-slate-200 text-slate-400">
          <ImageIcon className="w-14 h-14 mx-auto mb-3 opacity-30 text-slate-500" />
          <h3 className="text-base font-bold text-slate-700 mb-1">
            Chưa có hình ảnh nào trong thư viện
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
            Bấm &quot;Tải lên ảnh mới&quot; ở trên để bắt đầu thêm ảnh bảng giá, logo hoặc tin tức.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {files.map((file) => (
            <div
              key={file.name}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="relative aspect-video bg-slate-100 overflow-hidden">
                <Image
                  src={file.publicUrl}
                  alt={file.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
              </div>

              <div className="p-4 flex-grow flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 truncate" title={file.name}>
                    {file.name}
                  </h4>
                  <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
                    <span>{formatFileSize(file.metadata?.size)}</span>
                    <span>
                      {file.created_at
                        ? new Date(file.created_at).toLocaleDateString("vi-VN")
                        : ""}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => copyUrl(file)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                    title="Sao chép đường dẫn ảnh"
                  >
                    {copiedName === file.name ? (
                      <>
                        <Check size={14} className="text-emerald-600" />
                        <span className="text-emerald-700">Đã chép!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        <span>Sao chép URL</span>
                      </>
                    )}
                  </button>

                  <a
                    href={file.publicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                    title="Mở ảnh gốc trong tab mới"
                  >
                    <ExternalLink size={16} />
                  </a>

                  <button
                    onClick={() => setDeleteTarget(file)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Xóa ảnh"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
              <Trash2 size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Xác nhận xóa hình ảnh này?
            </h3>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Bạn đang chuẩn bị xóa tệp <strong className="text-slate-900 break-all">{deleteTarget.name}</strong>.
            </p>
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs mb-6">
              ⚠️ <strong>Cảnh báo:</strong> Nếu hình ảnh này đang được sử dụng làm logo, ảnh bảng giá hoặc ảnh bài viết trên website, liên kết ảnh sẽ bị gián đoạn.
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow disabled:opacity-50 cursor-pointer"
              >
                {deleting ? "Đang xóa..." : "Xác nhận xóa"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
