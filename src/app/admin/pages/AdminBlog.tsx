import { useState, useRef, ReactNode } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { AdminLayout } from "../AdminLayout";
import { Plus, Pencil, Trash2, X, Check, Upload, Image, Eye, EyeOff, AlertTriangle, Star } from "lucide-react";
import { BlogEditor } from "../components/BlogEditor";

interface BlogForm {
  title: string;
  excerpt: string;
  content: string;
  isPublished: boolean;
  isFeatured: boolean;
  coverUrl: string;
  coverStorageId?: Id<"_storage">;
}

const EMPTY_FORM: BlogForm = {
  title: "", excerpt: "", content: "", isPublished: false, isFeatured: false, coverUrl: "",
};

export function AdminBlog() {
  const items = useQuery(api.blog.listAll) ?? [];
  const createItem = useMutation(api.blog.create);
  const updateItem = useMutation(api.blog.update);
  const removeItem = useMutation(api.blog.remove);
  const generateUploadUrl = useMutation(api.blog.generateUploadUrl);

  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<BlogForm>(EMPTY_FORM);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  const coverInputRef = useRef<HTMLInputElement>(null);

  const openNew = () => {
    setForm(EMPTY_FORM);
    setEditing("new");
  };

  const openEdit = (item: any) => {
    setForm({
      title: item.title,
      excerpt: item.excerpt,
      content: item.content,
      isPublished: item.isPublished,
      isFeatured: item.isFeatured ?? false,
      coverUrl: item.coverUrl ?? "",
      coverStorageId: item.coverStorageId,
    });
    setEditing(item._id);
  };

  const uploadFile = async (file: File): Promise<Id<"_storage">> => {
    setUploadingCover(true);
    try {
      const uploadUrl = await generateUploadUrl();
      const res = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = await res.json();
      return storageId as Id<"_storage">;
    } finally {
      setUploadingCover(false);
    }
  };

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const storageId = await uploadFile(file);
    setForm((f) => ({ ...f, coverStorageId: storageId, coverUrl: "" }));
  };

  const handleSave = async () => {
    if (!form.title) return;
    if (editing !== "new") {
      if (!window.confirm("Bạn có chắc chắn muốn lưu các thay đổi này?")) return;
    }
    
    setSaving(true);
    const data = {
      title: form.title,
      excerpt: form.excerpt,
      content: form.content,
      isPublished: form.isPublished,
      isFeatured: form.isFeatured,
      coverUrl: form.coverStorageId ? undefined : form.coverUrl || undefined,
      coverStorageId: form.coverStorageId,
      publishedAt: form.isPublished && editing === "new" ? Date.now() : undefined,
    };
    try {
      if (editing === "new") {
        await createItem(data);
      } else {
        await updateItem({ id: editing as Id<"blogPosts">, ...data });
      }
      setEditing(null);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteFromForm = async () => {
    if (!editing || editing === "new") return;
    if (!window.confirm("Bạn có chắc chắn muốn xóa bài viết này không? Hành động này không thể hoàn tác.")) return;
    try {
      await removeItem({ id: editing as Id<"blogPosts"> });
      setEditing(null);
    } catch (err) {
      console.error(err);
    }
  };

  const togglePublish = async (e: React.MouseEvent, item: any) => {
    e.stopPropagation();
    const publishedAt = !item.isPublished && !item.publishedAt ? Date.now() : item.publishedAt;

    // Only pass fields defined in blogArgs
    await updateItem({
      id: item._id as Id<"blogPosts">,
      title: item.title,
      excerpt: item.excerpt,
      content: item.content,
      coverStorageId: item.coverStorageId,
      coverUrl: item.coverUrl,
      isPublished: !item.isPublished,
      publishedAt
    });
  };

  const toggleFeature = async (e: React.MouseEvent, item: any) => {
    e.stopPropagation();
    await updateItem({
      id: item._id as Id<"blogPosts">,
      title: item.title,
      excerpt: item.excerpt,
      content: item.content,
      coverStorageId: item.coverStorageId,
      coverUrl: item.coverUrl,
      isPublished: item.isPublished,
      isFeatured: !item.isFeatured,
      publishedAt: item.publishedAt
    });
  };

  return (
    <AdminLayout
      title="Blog"
      subtitle={`${items.length} bài viết`}
      actions={
        <button onClick={openNew} style={styles.btnPrimary}>
          <Plus size={16} strokeWidth={2} /> Thêm bài viết
        </button>
      }
    >
      {/* Edit form (Modal) */}
      {editing && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ ...styles.formCard, maxHeight: "90vh", overflowY: "auto", width: "100%", maxWidth: 800 }}>
            <div style={styles.formHeader}>
              <span style={styles.formTitle}>{editing === "new" ? "Thêm bài viết mới" : "Chỉnh sửa bài viết"}</span>
              <button onClick={() => setEditing(null)} style={styles.iconBtn}><X size={16} strokeWidth={1.5} /></button>
            </div>

            <div style={styles.formGrid}>
            <Field label="Tiêu đề" required>
              <input style={styles.input} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Enter blog title" />
            </Field>
          </div>

          <Field label="Tóm tắt (Excerpt)">
            <textarea style={{ ...styles.input, minHeight: 60, resize: "vertical" }}
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              placeholder="Short description..."
            />
          </Field>

          {/* Cover image */}
          <div style={styles.uploadSection}>
            <div style={styles.uploadHeader}>
              <Image size={16} strokeWidth={1.5} color="#6B7280" />
              <span style={styles.uploadLabel}>Ảnh bìa</span>
            </div>
            <div style={styles.uploadRow}>
              <input style={{ ...styles.input, flex: 1 }}
                value={form.coverUrl}
                onChange={(e) => setForm({ ...form, coverUrl: e.target.value, coverStorageId: undefined })}
                placeholder="URL ảnh (hoặc tải lên bên dưới)"
              />
              <button
                onClick={() => coverInputRef.current?.click()}
                disabled={uploadingCover}
                style={styles.uploadBtn}
              >
                <Upload size={14} strokeWidth={1.5} />
                {uploadingCover ? "Đang tải…" : "Tải ảnh"}
              </button>
              <input ref={coverInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleCoverChange} />
            </div>
            {form.coverStorageId && (
              <p style={styles.uploadNote}><Check size={14} strokeWidth={2} color="#10B981" /> Đã tải lên Convex Storage</p>
            )}
          </div>

          {/* ── Rich Text Editor (Tiptap) ── */}
          <Field label="Nội dung">
            <BlogEditor
              content={form.content}
              onChange={(html) => setForm((f) => ({ ...f, content: html }))}
            />
          </Field>

          <div style={{ display: "flex", gap: 24, marginTop: 12 }}>
            <label style={styles.checkboxLabel}>
              <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} style={{ accentColor: "#111827", marginRight: 8, width: 16, height: 16 }} />
              Công bố (Published)
            </label>
            <label style={styles.checkboxLabel}>
              <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} style={{ accentColor: "#111827", marginRight: 8, width: 16, height: 16 }} />
              Nổi bật (Homepage)
            </label>
          </div>

          <div style={{ ...styles.formActions, justifyContent: "space-between" }}>
            {editing !== "new" ? (
              <button onClick={handleDeleteFromForm} style={{ ...styles.iconBtn, color: "#EF4444", border: "1px solid #FCA5A5", padding: "8px 16px", borderRadius: 6, display: "flex", alignItems: "center", gap: 6, cursor: "pointer", background: "#FEF2F2" }}>
                <Trash2 size={16} strokeWidth={1.5} /> Delete
              </button>
            ) : <div />}
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setEditing(null)} style={styles.btnSecondary}>Hủy</button>
              <button onClick={handleSave} disabled={saving} style={styles.btnPrimary}>
                {saving ? "Đang lưu…" : <><Check size={16} strokeWidth={2} /> Lưu</>}
              </button>
            </div>
          </div>
        </div>
        </div>
      )}

      {/* Grid */}
      {items.length === 0 ? (
        <div style={styles.emptyState}>
          <p style={{ color: "#6B7280", fontSize: "0.875rem" }}>Chưa có bài viết nào.</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {items.map((item) => (
            <div key={item._id} onClick={() => openEdit(item)} style={{ ...styles.card, cursor: "pointer" }}>
              <div style={styles.cardCover}>
                {item.coverUrl ? (
                  <img src={item.coverUrl} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={styles.cardCoverPlaceholder}><Image size={24} strokeWidth={1} color="#9CA3AF" /></div>
                )}
                <div style={styles.cardOverlay}>
                  {item.isFeatured && <span style={styles.featureBadge}><Star size={10} fill="#FDE047" color="#FDE047" style={{ marginRight: 4 }}/> Nổi bật</span>}
                  {!item.isPublished && <span style={styles.draftBadge}>Bản nháp</span>}
                </div>
              </div>
              <div style={styles.cardBody}>
                <p style={styles.cardTitle}>{item.title}</p>
                <p style={styles.cardDesc}>{item.excerpt}</p>
              </div>
              <div style={styles.cardActions}>
                <button 
                  onClick={(e) => toggleFeature(e, item)} 
                  style={{ ...styles.iconBtn, flex: 1, justifyContent: "center", backgroundColor: item.isFeatured ? "#FEF9C3" : "#F3F4F6", color: item.isFeatured ? "#CA8A04" : "#6B7280", borderRadius: 4, padding: "8px 0" }} 
                  title={item.isFeatured ? "Đang nổi bật (Click để bỏ)" : "Bình thường (Click để nổi bật)"}
                >
                  <Star size={16} strokeWidth={1.5} fill={item.isFeatured ? "#CA8A04" : "none"} style={{ marginRight: 6 }}/> {item.isFeatured ? "Đã nổi bật" : "Nổi bật"}
                </button>
                <button 
                  onClick={(e) => togglePublish(e, item)} 
                  style={{ ...styles.iconBtn, flex: 1, justifyContent: "center", backgroundColor: item.isPublished ? "#ECFDF5" : "#F3F4F6", color: item.isPublished ? "#10B981" : "#6B7280", borderRadius: 4, padding: "8px 0" }} 
                  title={item.isPublished ? "Đang công bố (Click để ẩn)" : "Bản nháp (Click để công bố)"}
                >
                  {item.isPublished ? <><Eye size={16} strokeWidth={1.5} style={{ marginRight: 6 }}/> Đang công bố</> : <><EyeOff size={16} strokeWidth={1.5} style={{ marginRight: 6 }}/> Bản nháp</>}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}

function Field({ label, children, required }: { label: string; children: ReactNode; required?: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
      <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "#374151" }}>
        {label}{required && <span style={{ color: "#EF4444" }}> *</span>}
      </label>
      {children}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  formCard: { backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: "8px", padding: "24px", marginBottom: 24, boxShadow: "0 1px 3px 0 rgba(0,0,0,0.1)" },
  formHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  formTitle: { fontSize: "1.125rem", fontWeight: 600, color: "#111827" },
  formGrid: { display: "grid", gridTemplateColumns: "1fr", gap: 20, marginBottom: 16 },
  formActions: { display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 24, paddingTop: 20, borderTop: "1px solid #F3F4F6" },
  uploadSection: { border: "1px solid #E5E7EB", borderRadius: "6px", padding: "16px", marginBottom: 16 },
  uploadHeader: { display: "flex", alignItems: "center", gap: 8, marginBottom: 12 },
  uploadLabel: { fontSize: "0.875rem", fontWeight: 600, color: "#374151" },
  uploadRow: { display: "flex", gap: 12, alignItems: "center" },
  uploadBtn: { display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "'Inter', sans-serif", fontSize: "0.875rem", fontWeight: 500, color: "#374151", backgroundColor: "#FFFFFF", border: "1px solid #D1D5DB", borderRadius: "6px", padding: "10px 16px", cursor: "pointer", whiteSpace: "nowrap" as const, flexShrink: 0 },
  uploadNote: { fontSize: "0.875rem", color: "#10B981", display: "flex", alignItems: "center", gap: 6, margin: "12px 0 0" },
  input: { backgroundColor: "#FFFFFF", border: "1px solid #D1D5DB", borderRadius: "6px", color: "#111827", padding: "10px 14px", fontSize: "1rem", fontFamily: "'Inter', sans-serif", outline: "none", width: "100%", boxSizing: "border-box" as const, transition: "border-color 0.2s" },
  checkboxLabel: { fontSize: "0.875rem", color: "#374151", cursor: "pointer", display: "flex", alignItems: "center" },
  btnPrimary: { display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "'Inter', sans-serif", fontSize: "0.875rem", fontWeight: 500, color: "#FFFFFF", backgroundColor: "#111827", border: "1px solid #111827", borderRadius: "6px", padding: "10px 20px", cursor: "pointer", transition: "background-color 0.2s" },
  btnSecondary: { display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "'Inter', sans-serif", fontSize: "0.875rem", fontWeight: 500, color: "#374151", backgroundColor: "#FFFFFF", border: "1px solid #D1D5DB", borderRadius: "6px", padding: "10px 20px", cursor: "pointer", transition: "background-color 0.2s" },
  iconBtn: { background: "none", border: "none", color: "#6B7280", cursor: "pointer", padding: "6px", borderRadius: "4px", display: "flex", alignItems: "center", transition: "color 0.2s, background-color 0.2s" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 },
  card: { backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: "8px", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 1px 3px 0 rgba(0,0,0,0.1)", transition: "transform 0.2s, box-shadow 0.2s" },
  cardCover: { position: "relative", aspectRatio: "16/9", overflow: "hidden", backgroundColor: "#F3F4F6", borderBottom: "1px solid #E5E7EB" },
  cardCoverPlaceholder: { width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" },
  cardOverlay: { position: "absolute", top: 12, left: 12, display: "flex", gap: 8, flexWrap: "wrap" as const },
  draftBadge: { fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", backgroundColor: "#FEF3C7", color: "#D97706", padding: "4px 10px", borderRadius: "4px", border: "1px solid #FDE68A" },
  featureBadge: { fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", backgroundColor: "rgba(0,0,0,0.7)", color: "#FFF", padding: "4px 10px", borderRadius: "4px", display: "flex", alignItems: "center" },
  cardBody: { padding: "20px", flex: 1 },
  cardTitle: { fontSize: "1.125rem", fontWeight: 600, color: "#111827", margin: "0 0 4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const },
  cardDesc: { fontSize: "0.875rem", color: "#4B5563", margin: 0, lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" as const, overflow: "hidden" },
  cardActions: { display: "flex", justifyContent: "flex-end", gap: 4, padding: "12px 16px", borderTop: "1px solid #F3F4F6", backgroundColor: "#F9FAFB" },
  emptyState: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 240, border: "1px dashed #D1D5DB", borderRadius: "8px", backgroundColor: "#F9FAFB" },
};
