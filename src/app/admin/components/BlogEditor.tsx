import { useCallback, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { Underline } from "@tiptap/extension-underline";
import { TextAlign } from "@tiptap/extension-text-align";
import { Highlight } from "@tiptap/extension-highlight";
import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import { FontFamily } from "@tiptap/extension-font-family";
import { Link } from "@tiptap/extension-link";
import { Image } from "@tiptap/extension-image";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { TaskList } from "@tiptap/extension-task-list";
import { TaskItem } from "@tiptap/extension-task-item";
import { type Level } from "@tiptap/extension-heading";

import { FontSizeExtension } from "../../../extensions/font-size";
import { LineHeightExtension } from "../../../extensions/line-height";

import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";

import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  ListTodo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Undo2,
  Redo2,
  Link as LinkIcon,
  ImageIcon,
  Upload,
  Type,
  Highlighter,
  RemoveFormatting,
  ChevronDown,
  Minus,
  Plus,
  ListCollapse,
  Code,
  Quote,
  Table as TableIcon,
  Palette,
} from "lucide-react";

import type { Editor } from "@tiptap/react";

/* ────────────────────────────────────────────────────────
 * Styles (inline, matching Admin aesthetic)
 * ──────────────────────────────────────────────────────── */
const S: Record<string, React.CSSProperties> = {
  toolbar: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 2,
    padding: "6px 8px",
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    marginBottom: 12,
    border: "1px solid #E5E7EB",
  },
  sep: {
    width: 1,
    height: 24,
    backgroundColor: "#D1D5DB",
    margin: "0 4px",
    flexShrink: 0,
  },
  btn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 30,
    height: 30,
    borderRadius: 4,
    border: "none",
    background: "none",
    cursor: "pointer",
    color: "#374151",
    fontSize: "0.8rem",
    transition: "background-color 0.15s, color 0.15s",
    flexShrink: 0,
    position: "relative" as const,
  },
  btnActive: {
    backgroundColor: "#E5E7EB",
    color: "#111827",
  },
  dropdown: {
    position: "absolute" as const,
    top: "100%",
    left: 0,
    marginTop: 4,
    backgroundColor: "#FFFFFF",
    border: "1px solid #E5E7EB",
    borderRadius: 6,
    boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
    padding: 4,
    zIndex: 100,
    minWidth: 140,
  },
  dropdownItem: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "6px 10px",
    borderRadius: 4,
    border: "none",
    background: "none",
    cursor: "pointer",
    fontSize: "0.85rem",
    color: "#374151",
    width: "100%",
    textAlign: "left" as const,
    fontFamily: "'Inter', sans-serif",
  },
  dropdownItemActive: {
    backgroundColor: "#F3F4F6",
  },
  editorWrapper: {
    border: "1px solid #D1D5DB",
    borderRadius: 6,
    minHeight: 400,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },
  colorGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(8, 1fr)",
    gap: 4,
    padding: 8,
  },
  colorSwatch: {
    width: 24,
    height: 24,
    borderRadius: 4,
    border: "1px solid #E5E7EB",
    cursor: "pointer",
  },
};

const COLORS = [
  "#000000", "#434343", "#666666", "#999999", "#B7B7B7", "#CCCCCC", "#D9D9D9", "#FFFFFF",
  "#980000", "#FF0000", "#FF9900", "#FFFF00", "#00FF00", "#00FFFF", "#4A86E8", "#0000FF",
  "#9900FF", "#FF00FF", "#E6B8AF", "#F4CCCC", "#FCE5CD", "#FFF2CC", "#D9EAD3", "#D0E0E3",
  "#C9DAF8", "#CFE2F3", "#D9D2E9", "#EAD1DC",
];

const FONTS = [
  { label: "Inter", value: "Inter" },
  { label: "Arial", value: "Arial" },
  { label: "Georgia", value: "Georgia" },
  { label: "Times New Roman", value: "Times New Roman" },
  { label: "Courier New", value: "Courier New" },
  { label: "Verdana", value: "Verdana" },
  { label: "Comic Sans MS", value: "Comic Sans MS" },
];

const HEADINGS = [
  { label: "Normal Text", value: 0, fontSize: "14px" },
  { label: "Heading 1", value: 1, fontSize: "28px" },
  { label: "Heading 2", value: 2, fontSize: "22px" },
  { label: "Heading 3", value: 3, fontSize: "18px" },
  { label: "Heading 4", value: 4, fontSize: "16px" },
];

const LINE_HEIGHTS = [
  { label: "Default", value: "normal" },
  { label: "1", value: "1" },
  { label: "1.15", value: "1.15" },
  { label: "1.5", value: "1.5" },
  { label: "2", value: "2" },
];

/* ────────────────────────────────────────────────────────
 * Toolbar sub-components
 * ──────────────────────────────────────────────────────── */

function ToolbarBtn({
  icon: Icon,
  active,
  onClick,
  title,
  style,
}: {
  icon: React.FC<any>;
  active?: boolean;
  onClick: () => void;
  title?: string;
  style?: React.CSSProperties;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{ ...S.btn, ...(active ? S.btnActive : {}), ...style }}
      onMouseEnter={(e) => {
        if (!active)
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#E5E7EB";
      }}
      onMouseLeave={(e) => {
        if (!active)
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
      }}
    >
      <Icon size={16} strokeWidth={1.5} />
    </button>
  );
}

function DropdownBtn({
  label,
  children,
  minWidth,
}: {
  label: React.ReactNode;
  children: React.ReactNode | ((close: () => void) => React.ReactNode);
  minWidth?: number;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  const handleBlur = useCallback(
    (e: React.FocusEvent) => {
      if (!ref.current?.contains(e.relatedTarget as Node)) {
        setOpen(false);
      }
    },
    []
  );

  return (
    <div
      ref={ref}
      style={{ position: "relative", display: "inline-flex" }}
      onBlur={handleBlur}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          ...S.btn,
          width: "auto",
          padding: "0 8px",
          gap: 4,
          minWidth: minWidth ?? 40,
          display: "inline-flex",
          alignItems: "center",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#E5E7EB";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
        }}
      >
        {label}
        <ChevronDown size={12} strokeWidth={2} />
      </button>
      {open && (
        <div style={S.dropdown} onMouseDown={(e) => e.preventDefault()}>
          {typeof children === "function"
            ? (children as any)(() => setOpen(false))
            : children}
        </div>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────────────
 * Toolbar
 * ──────────────────────────────────────────────────────── */
function EditorToolbar({ editor }: { editor: Editor }) {
  const generateUploadUrl = useMutation(api.blog.generateUploadUrl);

  // -- Font size logic
  const currentFontSize = editor.getAttributes("textStyle").fontsize
    ? editor.getAttributes("textStyle").fontsize.replace("px", "")
    : "16";
  const [fsInput, setFsInput] = useState(currentFontSize);
  const [fsEditing, setFsEditing] = useState(false);

  const updateFontSize = (val: string) => {
    const n = parseInt(val);
    if (!isNaN(n) && n > 0) {
      editor.chain().focus().setFontSize(`${n}px`).run();
      setFsInput(String(n));
      setFsEditing(false);
    }
  };

  const getImageUrl = useMutation(api.blog.getImageUrl);

  // -- Image upload
  const handleImageUpload = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = await result.json();
      
      const url = await getImageUrl({ storageId });
      if (url) {
        editor.chain().focus().setImage({ src: url }).run();
      }
    };
    input.click();
  };

  const handleImageUrl = () => {
    const url = prompt("Enter image URL:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  // -- Link
  const handleLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = prompt("Enter URL:", previousUrl);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    }
  };

  // -- Heading
  const getCurrentHeading = () => {
    for (let level = 1; level <= 4; level++) {
      if (editor.isActive("heading", { level })) return `Heading ${level}`;
    }
    return "Normal";
  };

  return (
    <div style={S.toolbar}>
      {/* Undo / Redo */}
      <ToolbarBtn icon={Undo2} onClick={() => editor.chain().focus().undo().run()} title="Undo" />
      <ToolbarBtn icon={Redo2} onClick={() => editor.chain().focus().redo().run()} title="Redo" />

      <div style={S.sep} />

      {/* Font Family */}
      <DropdownBtn
        label={<span style={{ fontSize: "0.75rem", maxWidth: 90, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{editor.getAttributes("textStyle").fontFamily || "Inter"}</span>}
        minWidth={90}
      >
        {(close: () => void) => (
          <>
            {FONTS.map(({ label, value }) => (
              <button
                key={value}
                style={{
                  ...S.dropdownItem,
                  fontFamily: value,
                  ...(editor.getAttributes("textStyle").fontFamily === value ? S.dropdownItemActive : {}),
                }}
                onClick={() => {
                  editor.chain().focus().setFontFamily(value).run();
                  close();
                }}
              >
                {label}
              </button>
            ))}
          </>
        )}
      </DropdownBtn>

      <div style={S.sep} />

      {/* Heading */}
      <DropdownBtn label={<span style={{ fontSize: "0.75rem" }}>{getCurrentHeading()}</span>} minWidth={80}>
        {(close: () => void) => (
          <>
            {HEADINGS.map(({ label, value, fontSize }) => (
              <button
                key={value}
                style={{
                  ...S.dropdownItem,
                  fontSize,
                  ...(value === 0 && !editor.isActive("heading") ? S.dropdownItemActive : {}),
                  ...(editor.isActive("heading", { level: value }) ? S.dropdownItemActive : {}),
                }}
                onClick={() => {
                  if (value === 0) {
                    editor.chain().focus().setParagraph().run();
                  } else {
                    editor.chain().focus().toggleHeading({ level: value as Level }).run();
                  }
                  close();
                }}
              >
                {label}
              </button>
            ))}
          </>
        )}
      </DropdownBtn>

      <div style={S.sep} />

      {/* Font Size */}
      <button
        onClick={() => {
          const n = parseInt(currentFontSize) - 1;
          if (n > 0) updateFontSize(String(n));
        }}
        style={S.btn}
        title="Decrease font size"
      >
        <Minus size={14} strokeWidth={2} />
      </button>
      {fsEditing ? (
        <input
          autoFocus
          type="text"
          value={fsInput}
          onChange={(e) => setFsInput(e.target.value)}
          onBlur={() => updateFontSize(fsInput)}
          onKeyDown={(e) => { if (e.key === "Enter") updateFontSize(fsInput); }}
          style={{
            width: 36,
            height: 28,
            textAlign: "center",
            border: "1px solid #D1D5DB",
            borderRadius: 4,
            fontSize: "0.8rem",
            outline: "none",
            fontFamily: "'Inter', sans-serif",
          }}
        />
      ) : (
        <button
          onClick={() => { setFsEditing(true); setFsInput(currentFontSize); }}
          style={{ ...S.btn, width: 36, fontSize: "0.8rem" }}
        >
          {currentFontSize}
        </button>
      )}
      <button
        onClick={() => updateFontSize(String(parseInt(currentFontSize) + 1))}
        style={S.btn}
        title="Increase font size"
      >
        <Plus size={14} strokeWidth={2} />
      </button>

      <div style={S.sep} />

      {/* Bold / Italic / Underline / Strikethrough */}
      <ToolbarBtn icon={Bold} active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()} title="Bold" />
      <ToolbarBtn icon={Italic} active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()} title="Italic" />
      <ToolbarBtn icon={UnderlineIcon} active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()} title="Underline" />
      <ToolbarBtn icon={Strikethrough} active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()} title="Strikethrough" />
      <ToolbarBtn icon={Code} active={editor.isActive("code")} onClick={() => editor.chain().focus().toggleCode().run()} title="Inline Code" />

      {/* Text Color */}
      <DropdownBtn label={<><Palette size={14} strokeWidth={1.5} /><div style={{ height: 3, width: 14, backgroundColor: editor.getAttributes("textStyle").color || "#000", borderRadius: 1 }} /></>}>
        {(close: () => void) => (
          <div style={S.colorGrid}>
            {COLORS.map((c) => (
              <button
                key={c}
                style={{ ...S.colorSwatch, backgroundColor: c }}
                onClick={() => {
                  editor.chain().focus().setColor(c).run();
                  close();
                }}
              />
            ))}
          </div>
        )}
      </DropdownBtn>

      {/* Highlight */}
      <DropdownBtn label={<Highlighter size={14} strokeWidth={1.5} />}>
        {(close: () => void) => (
          <div style={S.colorGrid}>
            {COLORS.map((c) => (
              <button
                key={c}
                style={{ ...S.colorSwatch, backgroundColor: c }}
                onClick={() => {
                  editor.chain().focus().setHighlight({ color: c }).run();
                  close();
                }}
              />
            ))}
          </div>
        )}
      </DropdownBtn>

      <div style={S.sep} />

      {/* Align */}
      <ToolbarBtn icon={AlignLeft} active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()} title="Align Left" />
      <ToolbarBtn icon={AlignCenter} active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()} title="Align Center" />
      <ToolbarBtn icon={AlignRight} active={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()} title="Align Right" />
      <ToolbarBtn icon={AlignJustify} active={editor.isActive({ textAlign: "justify" })} onClick={() => editor.chain().focus().setTextAlign("justify").run()} title="Justify" />

      <div style={S.sep} />

      {/* Line Height */}
      <DropdownBtn label={<ListCollapse size={14} strokeWidth={1.5} />}>
        {(close: () => void) => (
          <>
            {LINE_HEIGHTS.map(({ label, value }) => (
              <button
                key={value}
                style={{
                  ...S.dropdownItem,
                  ...(editor.getAttributes("paragraph").lineHeight === value ? S.dropdownItemActive : {}),
                }}
                onClick={() => {
                  editor.chain().focus().setLineHeight(value).run();
                  close();
                }}
              >
                {label}
              </button>
            ))}
          </>
        )}
      </DropdownBtn>

      {/* Lists */}
      <ToolbarBtn icon={List} active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Bullet List" />
      <ToolbarBtn icon={ListOrdered} active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Ordered List" />
      <ToolbarBtn icon={ListTodo} active={editor.isActive("taskList")} onClick={() => editor.chain().focus().toggleTaskList().run()} title="Task List" />

      <div style={S.sep} />

      {/* Quote / Link / Image / Table */}
      <ToolbarBtn icon={Quote} active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()} title="Blockquote" />
      <ToolbarBtn icon={LinkIcon} active={editor.isActive("link")} onClick={handleLink} title="Link" />

      {/* Image dropdown */}
      <DropdownBtn label={<ImageIcon size={14} strokeWidth={1.5} />}>
        {(close: () => void) => (
          <>
            <button style={S.dropdownItem} onClick={() => { handleImageUpload(); close(); }}>
              <Upload size={14} strokeWidth={1.5} /> Upload Image
            </button>
            <button style={S.dropdownItem} onClick={() => { handleImageUrl(); close(); }}>
              <LinkIcon size={14} strokeWidth={1.5} /> Paste URL
            </button>
          </>
        )}
      </DropdownBtn>

      {/* Table */}
      <ToolbarBtn
        icon={TableIcon}
        onClick={() =>
          editor
            .chain()
            .focus()
            .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
            .run()
        }
        title="Insert Table"
      />

      <div style={S.sep} />

      {/* Clear formatting */}
      <ToolbarBtn icon={RemoveFormatting} onClick={() => editor.chain().focus().unsetAllMarks().run()} title="Clear Formatting" />
    </div>
  );
}

/* ────────────────────────────────────────────────────────
 * Main BlogEditor component
 * ──────────────────────────────────────────────────────── */
interface BlogEditorProps {
  content: string;
  onChange: (html: string) => void;
}

export function BlogEditor({ content, onChange }: BlogEditorProps) {
  const generateUploadUrl = useMutation(api.blog.generateUploadUrl);
  const getImageUrl = useMutation(api.blog.getImageUrl);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4],
        },
      }),
      FontSizeExtension,
      LineHeightExtension.configure({
        types: ["heading", "paragraph"],
        defaultLineHeight: "normal",
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight.configure({
        multicolor: true,
      }),
      Color,
      TextStyle,
      FontFamily,
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
      }),
      Image,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableCell,
      TableHeader,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
    ],
    content: content || "",
    immediatelyRender: false,
    onUpdate: ({ editor: e }) => {
      onChange(e.getHTML());
    },
    editorProps: {
      handlePaste: (view, event) => {
        const items = Array.from(event.clipboardData?.items || []);
        const hasImage = items.some((item) => item.type.startsWith("image/"));
        
        if (hasImage) {
          event.preventDefault();
          items.forEach((item) => {
            if (item.type.startsWith("image/")) {
              const file = item.getAsFile();
              if (file) {
                (async () => {
                  try {
                    const postUrl = await generateUploadUrl();
                    const result = await fetch(postUrl, {
                      method: "POST",
                      headers: { "Content-Type": file.type },
                      body: file,
                    });
                    const { storageId } = await result.json();
                    const url = await getImageUrl({ storageId });
                    
                    if (url) {
                      const { schema } = view.state;
                      const node = schema.nodes.image.create({ src: url });
                      const transaction = view.state.tr.replaceSelectionWith(node);
                      view.dispatch(transaction);
                    }
                  } catch (e) {
                    console.error("Failed to upload pasted image", e);
                  }
                })();
              }
            }
          });
          return true; // We handled the paste
        }
        return false; // Let Tiptap handle other pastes (like text)
      },
      attributes: {
        class: "blog-tiptap-editor",
        style:
          "padding: 24px 32px; min-height: 400px; outline: none; font-family: 'Inter', sans-serif; font-size: 1rem; line-height: 1.75; color: #111827;",
      },
    },
  });

  if (!editor) return null;

  return (
    <div>
      <EditorToolbar editor={editor} />
      <div style={S.editorWrapper}>
        <EditorContent editor={editor} />
      </div>

      {/* Editor typography styles */}
      <style>{`
        .blog-tiptap-editor h1 { font-size: 2rem; font-weight: 700; margin: 0.5em 0; line-height: 1.2; }
        .blog-tiptap-editor h2 { font-size: 1.5rem; font-weight: 600; margin: 0.5em 0; line-height: 1.3; }
        .blog-tiptap-editor h3 { font-size: 1.25rem; font-weight: 600; margin: 0.5em 0; line-height: 1.4; }
        .blog-tiptap-editor h4 { font-size: 1.1rem; font-weight: 600; margin: 0.5em 0; }
        .blog-tiptap-editor p { margin: 0.5em 0; }
        .blog-tiptap-editor ul { padding-left: 1.5em; margin: 0.5em 0; list-style-type: disc; }
        .blog-tiptap-editor ol { padding-left: 1.5em; margin: 0.5em 0; list-style-type: decimal; }
        .blog-tiptap-editor li { margin: 0.25em 0; }
        .blog-tiptap-editor blockquote { border-left: 3px solid #D1D5DB; padding-left: 1em; margin: 0.75em 0; color: #6B7280; font-style: italic; }
        .blog-tiptap-editor code { background-color: #F3F4F6; padding: 2px 6px; border-radius: 3px; font-family: 'Courier New', monospace; font-size: 0.9em; }
        .blog-tiptap-editor pre { background-color: #1F2937; color: #F9FAFB; padding: 16px; border-radius: 6px; overflow-x: auto; margin: 0.75em 0; }
        .blog-tiptap-editor pre code { background: none; padding: 0; color: inherit; }
        .blog-tiptap-editor img { max-width: 100%; height: auto; border-radius: 6px; margin: 0.75em 0; }
        .blog-tiptap-editor a { color: #2563EB; text-decoration: underline; cursor: pointer; }
        .blog-tiptap-editor table { border-collapse: collapse; width: 100%; margin: 0.75em 0; }
        .blog-tiptap-editor th, .blog-tiptap-editor td { border: 1px solid #D1D5DB; padding: 8px 12px; text-align: left; }
        .blog-tiptap-editor th { background-color: #F3F4F6; font-weight: 600; }
        .blog-tiptap-editor ul[data-type="taskList"] { list-style: none; padding-left: 0; }
        .blog-tiptap-editor ul[data-type="taskList"] li { display: flex; align-items: flex-start; gap: 8px; }
        .blog-tiptap-editor ul[data-type="taskList"] li label { margin-top: 3px; }
        .blog-tiptap-editor hr { border: none; border-top: 1px solid #E5E7EB; margin: 1em 0; }
        .blog-tiptap-editor mark { border-radius: 2px; padding: 1px 2px; }
      `}</style>
    </div>
  );
}
