"use client";

import React, { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import LinkExtension from "@tiptap/extension-link";
import ImageExtension from "@tiptap/extension-image";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Unlink,
  ImageIcon,
  Undo,
  Redo,
  RemoveFormatting,
} from "lucide-react";
import { MediaPicker } from "./MediaPicker";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [linkInputOpen, setLinkInputOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-brand-primary underline hover:text-brand-primary-dark",
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
      ImageExtension.configure({
        HTMLAttributes: {
          class: "rounded-xl max-w-full h-auto my-4 mx-auto border border-slate-200",
        },
      }),
    ],
    content: content || "<p></p>",
    editorProps: {
      attributes: {
        class:
          "prose prose-slate max-w-none focus:outline-none min-h-[300px] p-4 text-slate-800 text-sm leading-relaxed",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return (
      <div className="border border-slate-300 rounded-xl p-8 text-center text-slate-400 min-h-[300px] flex items-center justify-center">
        Đang tải trình soạn thảo văn bản...
      </div>
    );
  }

  const handleSetLink = () => {
    if (!linkUrl.trim()) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      setLinkInputOpen(false);
      return;
    }
    const cleanUrl = linkUrl.trim().startsWith("http") ? linkUrl.trim() : `https://${linkUrl.trim()}`;
    editor.chain().focus().extendMarkRange("link").setLink({ href: cleanUrl }).run();
    setLinkUrl("");
    setLinkInputOpen(false);
  };

  const handleInsertImage = (url: string) => {
    editor.chain().focus().setImage({ src: url, alt: "Hình ảnh minh họa" }).run();
    setMediaPickerOpen(false);
  };

  return (
    <div className="border border-slate-300 rounded-xl overflow-hidden bg-white focus-within:border-brand-primary focus-within:ring-2 focus-within:ring-brand-primary/20 transition-all">
      {/* Toolbar */}
      <div className="bg-slate-50 border-b border-slate-200 p-2 flex flex-wrap items-center gap-1 text-slate-700">
        {/* Undo / Redo */}
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Hoàn tác (Ctrl+Z)"
          className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 disabled:opacity-30 cursor-pointer"
        >
          <Undo size={15} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Làm lại (Ctrl+Y)"
          className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 disabled:opacity-30 cursor-pointer"
        >
          <Redo size={15} />
        </button>

        <span className="w-px h-5 bg-slate-300 mx-1" />

        {/* Headings */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          title="Tiêu đề H2"
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            editor.isActive("heading", { level: 2 })
              ? "bg-brand-primary text-white font-bold"
              : "hover:bg-slate-200 text-slate-700"
          }`}
        >
          <Heading2 size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          title="Tiêu đề H3"
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            editor.isActive("heading", { level: 3 })
              ? "bg-brand-primary text-white font-bold"
              : "hover:bg-slate-200 text-slate-700"
          }`}
        >
          <Heading3 size={16} />
        </button>

        <span className="w-px h-5 bg-slate-300 mx-1" />

        {/* Formatting */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="In đậm (Ctrl+B)"
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            editor.isActive("bold")
              ? "bg-brand-primary text-white font-bold"
              : "hover:bg-slate-200 text-slate-700"
          }`}
        >
          <Bold size={15} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="In nghiêng (Ctrl+I)"
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            editor.isActive("italic")
              ? "bg-brand-primary text-white font-bold"
              : "hover:bg-slate-200 text-slate-700"
          }`}
        >
          <Italic size={15} />
        </button>

        <span className="w-px h-5 bg-slate-300 mx-1" />

        {/* Lists */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Danh sách không thứ tự"
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            editor.isActive("bulletList")
              ? "bg-brand-primary text-white font-bold"
              : "hover:bg-slate-200 text-slate-700"
          }`}
        >
          <List size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Danh sách có thứ tự"
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            editor.isActive("orderedList")
              ? "bg-brand-primary text-white font-bold"
              : "hover:bg-slate-200 text-slate-700"
          }`}
        >
          <ListOrdered size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          title="Trích dẫn"
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            editor.isActive("blockquote")
              ? "bg-brand-primary text-white font-bold"
              : "hover:bg-slate-200 text-slate-700"
          }`}
        >
          <Quote size={15} />
        </button>

        <span className="w-px h-5 bg-slate-300 mx-1" />

        {/* Link */}
        <button
          type="button"
          onClick={() => {
            const previousUrl = editor.getAttributes("link").href || "";
            setLinkUrl(previousUrl);
            setLinkInputOpen(true);
          }}
          title="Chèn hoặc sửa liên kết"
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            editor.isActive("link")
              ? "bg-brand-primary text-white font-bold"
              : "hover:bg-slate-200 text-slate-700"
          }`}
        >
          <LinkIcon size={15} />
        </button>
        {editor.isActive("link") && (
          <button
            type="button"
            onClick={() => editor.chain().focus().unsetLink().run()}
            title="Gỡ bỏ liên kết"
            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 cursor-pointer"
          >
            <Unlink size={15} />
          </button>
        )}

        {/* MediaPicker Image Insert */}
        <button
          type="button"
          onClick={() => setMediaPickerOpen(true)}
          title="Chèn ảnh từ thư viện"
          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 cursor-pointer ml-1"
        >
          <ImageIcon size={14} className="text-brand-primary" />
          <span>Chèn ảnh</span>
        </button>

        <span className="w-px h-5 bg-slate-300 mx-1" />

        {/* Clear formatting */}
        <button
          type="button"
          onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
          title="Xóa định dạng"
          className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 cursor-pointer"
        >
          <RemoveFormatting size={15} />
        </button>
      </div>

      {/* Modal / Popover Nhập Link */}
      {linkInputOpen && (
        <div className="bg-slate-100 p-2 border-b border-slate-200 flex items-center gap-2 text-xs">
          <input
            type="text"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="Nhập đường dẫn https://..."
            className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSetLink();
              }
            }}
          />
          <button
            type="button"
            onClick={handleSetLink}
            className="px-3 py-1.5 bg-brand-primary text-white rounded-lg font-bold hover:bg-brand-primary-dark transition-colors"
          >
            Áp dụng
          </button>
          <button
            type="button"
            onClick={() => setLinkInputOpen(false)}
            className="px-2.5 py-1.5 text-slate-600 hover:bg-slate-200 rounded-lg"
          >
            Hủy
          </button>
        </div>
      )}

      {/* Editor Content Area */}
      <EditorContent editor={editor} />

      {/* Modal MediaPicker */}
      <MediaPicker
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={handleInsertImage}
        title="Chọn Hình Ảnh Chèn Vào Bài Viết"
      />
    </div>
  );
}

