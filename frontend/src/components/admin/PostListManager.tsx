"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Edit3,
  Trash2,
  Eye,
  Loader2,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  Search,
  Filter,
  RefreshCw,
  Clock,
  FileText,
  ImageIcon,
} from "lucide-react";
import type { PostItem, PostStatus } from "@/types/content";
import {
  getAdminPostsAction,
  deletePostAction,
  togglePostStatusAction,
} from "@/app/admin/(dashboard)/posts/actions";

export function PostListManager() {
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // Modal Xóa
  const [postToDelete, setPostToDelete] = useState<PostItem | null>(null);
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
      const res = await getAdminPostsAction();
      if (res.success && res.data) {
        setPosts(res.data);
      } else {
        setError(res.message || "Không thể tải danh sách bài viết.");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Đã có lỗi xảy ra.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    getAdminPostsAction()
      .then((res) => {
        if (!ignore) {
          if (res.success && res.data) {
            setPosts(res.data);
          } else {
            setError(res.message || "Không thể tải danh sách bài viết.");
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
  const handleToggleStatus = async (item: PostItem) => {
    const newStatus: PostStatus = item.status === "published" ? "draft" : "published";
    // Optimistic update
    setPosts((prev) =>
      prev.map((p) => (p.id === item.id ? { ...p, status: newStatus } : p))
    );

    const res = await togglePostStatusAction(item.id, newStatus);
    if (res.success) {
      showToast("success", res.message);
    } else {
      showToast("error", res.message);
      void loadData();
    }
  };

  // Xác nhận xóa
  const handleConfirmDelete = async () => {
    if (!postToDelete) return;
    setIsDeleting(true);

    const res = await deletePostAction(postToDelete.id);
    if (res.success) {
      showToast("success", res.message);
      setPosts((prev) => prev.filter((p) => p.id !== postToDelete.id));
      setPostToDelete(null);
    } else {
      showToast("error", res.message);
    }
    setIsDeleting(false);
  };

  // Filtered posts
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        !searchQuery.trim() ||
        post.title.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
        post.slug.toLowerCase().includes(searchQuery.trim().toLowerCase());

      const matchesCat =
        selectedCategory === "all" || post.category === selectedCategory;

      const isScheduled =
        post.status === "published" &&
        Boolean(post.publishedAt && new Date(post.publishedAt) > new Date());

      let matchesStatus = true;
      if (selectedStatus === "published") {
        matchesStatus = post.status === "published" && !isScheduled;
      } else if (selectedStatus === "draft") {
        matchesStatus = post.status === "draft";
      } else if (selectedStatus === "scheduled") {
        matchesStatus = isScheduled;
      }

      return matchesSearch && matchesCat && matchesStatus;
    });
  }, [posts, searchQuery, selectedCategory, selectedStatus]);

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
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Tin Tức & Bài Viết</h1>
            <span className="bg-brand-primary/10 text-brand-primary font-bold text-xs px-2.5 py-1 rounded-full">
              {posts.length} bài
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Quản lý các bài viết tin tức y tế, thông tin dịch vụ và tin doanh nghiệp trên website.
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
            href="/admin/posts/new"
            className="inline-flex items-center gap-2 bg-brand-primary hover:bg-brand-primary-dark text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-sm transition-all"
          >
            <Plus size={18} />
            <span>Viết bài mới</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tiêu đề bài viết..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Lọc danh mục */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Filter size={14} className="text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="all">Tất cả danh mục</option>
              <option value="medical">Y Tế Tại Nhà</option>
              <option value="transport">Vận Tải Y Tế</option>
              <option value="company">Tin Doanh Nghiệp</option>
            </select>
          </div>

          {/* Lọc trạng thái */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="published">Đã đăng</option>
            <option value="draft">Bản nháp</option>
            <option value="scheduled">Hẹn giờ đăng</option>
          </select>
        </div>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
          <Loader2 className="animate-spin text-brand-primary mx-auto mb-3" size={32} />
          <p className="text-sm text-slate-500 font-medium">Đang tải danh sách bài viết...</p>
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
      ) : filteredPosts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText size={28} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">
            {posts.length === 0 ? "Chưa có bài viết nào" : "Không tìm thấy bài viết phù hợp"}
          </h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
            {posts.length === 0
              ? "Bắt đầu đăng bài viết đầu tiên để chia sẻ thông tin y tế hữu ích."
              : "Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm."}
          </p>
          {posts.length === 0 && (
            <Link
              href="/admin/posts/new"
              className="inline-flex items-center gap-2 bg-brand-primary hover:bg-brand-primary-dark text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-sm transition-all"
            >
              <Plus size={18} />
              <span>Tạo bài viết ngay</span>
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-xs uppercase tracking-wider">
                  <th className="py-4 px-4 w-16 text-center">Ảnh</th>
                  <th className="py-4 px-4">Tiêu đề bài viết</th>
                  <th className="py-4 px-4">Danh mục</th>
                  <th className="py-4 px-4 text-center">Trạng thái</th>
                  <th className="py-4 px-4">Thời gian</th>
                  <th className="py-4 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPosts.map((post) => {
                  const isScheduled =
                    post.status === "published" &&
                    Boolean(post.publishedAt && new Date(post.publishedAt) > new Date());
                  const isLive = post.status === "published" && !isScheduled;

                  return (
                    <tr key={post.id} className="hover:bg-slate-50/80 transition-colors group">
                      {/* Ảnh bìa */}
                      <td className="py-4 px-4 text-center">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 relative mx-auto shrink-0 flex items-center justify-center">
                          {post.coverImageUrl ? (
                            <Image
                              src={post.coverImageUrl}
                              alt={post.title}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          ) : (
                            <ImageIcon size={18} className="text-slate-400" />
                          )}
                        </div>
                      </td>

                      {/* Tiêu đề & Slug */}
                      <td className="py-4 px-4">
                        <div className="font-bold text-slate-900 text-base max-w-md line-clamp-1">
                          {post.title}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <code className="text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                            /news/{post.slug}
                          </code>
                          <span className="text-[11px] text-slate-400">
                            • Tác giả: {post.author || "CAREVIA"}
                          </span>
                        </div>
                      </td>

                      {/* Danh mục */}
                      <td className="py-4 px-4">
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                            post.category === "medical"
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : post.category === "transport"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-slate-100 text-slate-700 border border-slate-200"
                          }`}
                        >
                          {post.categoryLabel || post.category}
                        </span>
                      </td>

                      {/* Trạng thái */}
                      <td className="py-4 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => void handleToggleStatus(post)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all shadow-xs cursor-pointer ${
                            isScheduled
                              ? "bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100"
                              : isLive
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                              : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"
                          }`}
                          title="Bấm để đổi trạng thái"
                        >
                          {isScheduled ? (
                            <>
                              <Clock size={12} className="text-amber-600" />
                              <span>Hẹn giờ</span>
                            </>
                          ) : isLive ? (
                            <>
                              <span className="w-2 h-2 rounded-full bg-emerald-500" />
                              <span>Đã đăng</span>
                            </>
                          ) : (
                            <>
                              <span className="w-2 h-2 rounded-full bg-slate-400" />
                              <span>Bản nháp</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Thời gian */}
                      <td className="py-4 px-4 text-xs text-slate-500">
                        <div>{post.publishedAt || "Chưa đặt"}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{post.readTime}</div>
                      </td>

                      {/* Thao tác */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {isLive ? (
                            <a
                              href={`/news/${post.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Xem bài viết trên website"
                              className="p-2 text-slate-400 hover:text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-colors"
                            >
                              <ExternalLink size={16} />
                            </a>
                          ) : (
                            <span
                              title="Bài viết chưa hiển thị công khai"
                              className="p-2 text-slate-200 cursor-not-allowed"
                            >
                              <Eye size={16} />
                            </span>
                          )}

                          <Link
                            href={`/admin/posts/${post.id}/edit`}
                            title="Chỉnh sửa bài viết"
                            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                          >
                            <Edit3 size={16} />
                          </Link>

                          <button
                            type="button"
                            onClick={() => setPostToDelete(post)}
                            title="Xóa bài viết"
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
      {postToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4">
              <Trash2 size={24} />
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-2">Xác nhận xóa bài viết</h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Bạn có chắc chắn muốn xóa bài viết{" "}
              <strong className="text-slate-900 font-semibold">
                &ldquo;{postToDelete.title}&rdquo;
              </strong>
              ? Thao tác này sẽ xóa vĩnh viễn và <strong>không thể khôi phục</strong>.
            </p>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 mb-6">
              💡 <strong>Khuyên dùng:</strong> Nếu bạn chỉ muốn tạm gỡ bài viết khỏi website, hãy chuyển
              trạng thái về <strong>&ldquo;Bản nháp&rdquo;</strong> thay vì xóa bài.
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setPostToDelete(null)}
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
