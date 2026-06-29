import { useState, useRef, ReactNode } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { AdminLayout } from "../AdminLayout";
import {
  Plus, Pencil, Trash2, X, Check, Upload, Film, Music, Image, Eye, EyeOff, AlertTriangle, Star
} from "lucide-react";

type Category = "Video" | "Projects" | "Campaigns";

interface MediaForm {
  category: Category;
  title: string;
  description: string;
  tag: string;
  year: string;
  hasPlay: boolean;
  isPublished: boolean;
  isFeatured: boolean;
  coverUrl: string;
  videoUrl: string;
  audioFilename: string;
  coverStorageId?: Id<"_storage">;
  audioStorageId?: Id<"_storage">;
  videoStorageId?: Id<"_storage">;
}

const EMPTY_FORM: MediaForm = {
  category: "Video", title: "", description: "", tag: "", year: new Date().getFullYear().toString(),
  hasPlay: false, isPublished: true, isFeatured: false, coverUrl: "", videoUrl: "", audioFilename: "",
};

const CATEGORIES: Category[] = ["Video", "Projects", "Campaigns"];

export function AdminMedia() {
  const items = useQuery(api.media.listAll) ?? [];
  const createItem = useMutation(api.media.create);
  const updateItem = useMutation(api.media.update);
  const removeItem = useMutation(api.media.remove);
  const generateUploadUrl = useMutation(api.media.generateUploadUrl);
  const seedMedia = useMutation(api.media.seedInitialMedia);

  const [filter, setFilter] = useState<Category | "All">("All");
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<MediaForm>(EMPTY_FORM);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const [seeding, setSeeding] = useState(false);

  const coverInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const displayed = filter === "All" ? items : items.filter((i) => i.category === filter);

  const openNew = () => {
    setForm({ ...EMPTY_FORM, order: items.length } as any);
    setEditing("new");
  };

  const openEdit = (item: any) => {
    setForm({
      category: item.category, title: item.title, description: item.description,
      tag: item.tag, year: item.year, hasPlay: item.hasPlay, isPublished: item.isPublished, isFeatured: item.isFeatured ?? false,
      coverUrl: item.coverUrl ?? "", videoUrl: item.videoUrl ?? "", audioFilename: item.audioFilename ?? "",
      coverStorageId: item.coverStorageId, audioStorageId: item.audioStorageId,
    });
    setEditing(item._id);
  };

  // File upload helper
  const uploadFile = async (file: File, field: "cover" | "audio"): Promise<Id<"_storage">> => {
    setUploading((u) => ({ ...u, [field]: true }));
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
      setUploading((u) => ({ ...u, [field]: false }));
    }
  };

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const storageId = await uploadFile(file, "cover");
    setForm((f) => ({ ...f, coverStorageId: storageId, coverUrl: "" }));
  };

  const handleAudioChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const storageId = await uploadFile(file, "audio");
    setForm((f) => ({ ...f, audioStorageId: storageId, audioFilename: file.name }));
  };

  const handleSave = async () => {
    if (!form.title || !form.category) return;
    if (editing !== "new") {
      if (!window.confirm("Bạn có chắc chắn muốn lưu các thay đổi này?")) return;
    }
    setSaving(true);
    const data = {
      category: form.category, title: form.title, description: form.description,
      tag: form.tag, year: form.year, hasPlay: form.hasPlay, isPublished: form.isPublished, isFeatured: form.isFeatured,
      order: editing === "new" ? items.length : (items.find((i) => i._id === editing)?.order ?? items.length),
      coverUrl: form.coverStorageId ? undefined : form.coverUrl || undefined,
      coverStorageId: form.coverStorageId,
      videoUrl: form.videoUrl || undefined,
      audioStorageId: form.audioStorageId,
      audioFilename: form.audioFilename || undefined,
    };
    try {
      if (editing === "new") {
        await createItem(data);
      } else {
        await updateItem({ id: editing as Id<"mediaItems">, ...data });
      }
      setEditing(null);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteFromForm = async () => {
    if (!editing || editing === "new") return;
    if (!window.confirm("Bạn có chắc chắn muốn xóa tác phẩm này không? Hành động này không thể hoàn tác.")) return;
    try {
      await removeItem({ id: editing as Id<"mediaItems"> });
      setEditing(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSeed = async () => {
    setSeeding(true);
    await seedMedia();
    setSeeding(false);
  };

  const togglePublish = async (e: React.MouseEvent, item: any) => {
    e.stopPropagation();
    await updateItem({ 
      id: item._id as Id<"mediaItems">, 
      category: item.category,
      title: item.title,
      description: item.description,
      tag: item.tag,
      year: item.year,
      hasPlay: item.hasPlay,
      isPublished: !item.isPublished,
      order: item.order,
      coverStorageId: item.coverStorageId,
      coverUrl: item.coverUrl,
      videoUrl: item.videoUrl,
      videoStorageId: item.videoStorageId,
      audioStorageId: item.audioStorageId,
      audioFilename: item.audioFilename,
      galleryStorageIds: item.galleryStorageIds,
    });
  };

  const toggleFeature = async (e: React.MouseEvent, item: any) => {
    e.stopPropagation();
    await updateItem({ 
      id: item._id as Id<"mediaItems">, 
      category: item.category,
      title: item.title,
      description: item.description,
      tag: item.tag,
      year: item.year,
      hasPlay: item.hasPlay,
      isPublished: item.isPublished,
      isFeatured: !item.isFeatured,
      order: item.order,
      coverStorageId: item.coverStorageId,
      coverUrl: item.coverUrl,
      videoUrl: item.videoUrl,
      videoStorageId: item.videoStorageId,
      audioStorageId: item.audioStorageId,
      audioFilename: item.audioFilename,
      galleryStorageIds: item.galleryStorageIds,
    });
  };

  return (
    <AdminLayout
      title="Tác phẩm & Media"
      subtitle={`${items.length} mục`}
      actions={
        <div style={{ display: "flex", gap: 8 }}>
          {items.length === 0 && (
            <button onClick={handleSeed} disabled={seeding} style={styles.btnSecondary}>
              {seeding ? "Đang tải…" : "Tải dữ liệu mẫu"}
            </button>
          )}
          <button onClick={openNew} style={styles.btnPrimary}>
            <Plus size={16} strokeWidth={2} /> Thêm tác phẩm
          </button>
        </div>
      }
    >
      {/* Category filter */}
      <div style={styles.filterRow}>
        {(["All", ...CATEGORIES] as const).map((cat) => (
          <button key={cat} onClick={() => setFilter(cat)}
            style={{ ...styles.filterBtn, ...(filter === cat ? styles.filterBtnActive : {}) }}
          >
            {cat === "All" ? "Tất cả" : cat}
            <span style={styles.filterCount}>{cat === "All" ? items.length : items.filter((i) => i.category === cat).length}</span>
          </button>
        ))}
      </div>

      {/* Edit form (Modal) */}
      {editing && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ ...styles.formCard, maxHeight: "90vh", overflowY: "auto", width: "100%", maxWidth: 800 }}>
            <div style={styles.formHeader}>
              <span style={styles.formTitle}>{editing === "new" ? "Thêm tác phẩm mới" : "Chỉnh sửa tác phẩm"}</span>
              <button onClick={() => setEditing(null)} style={styles.iconBtn}><X size={16} strokeWidth={1.5} /></button>
            </div>

            <div style={styles.formGrid}>
            <Field label="Tiêu đề" required>
              <input style={styles.input} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Echoes of the Red River" />
            </Field>
            <Field label="Danh mục">
              <select style={styles.select} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as Category })}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Tag / Nhãn">
              <input style={styles.input} value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} placeholder="Official Video" />
            </Field>
            <Field label="Năm">
              <input style={styles.input} value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} placeholder="2024" maxLength={4} />
            </Field>
          </div>

          <Field label="Mô tả">
            <textarea style={{ ...styles.input, minHeight: 88, resize: "vertical" }}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Mô tả về tác phẩm này…"
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
                disabled={uploading.cover}
                style={styles.uploadBtn}
              >
                <Upload size={14} strokeWidth={1.5} />
                {uploading.cover ? "Đang tải…" : "Tải ảnh"}
              </button>
              <input ref={coverInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleCoverChange} />
            </div>
            {form.coverStorageId && (
              <p style={styles.uploadNote}><Check size={14} strokeWidth={2} color="#10B981" /> Đã tải lên Convex Storage</p>
            )}
          </div>

          {/* Video */}
          <div style={styles.uploadSection}>
            <div style={styles.uploadHeader}>
              <Film size={16} strokeWidth={1.5} color="#6B7280" />
              <span style={styles.uploadLabel}>Video (URL YouTube / Vimeo)</span>
            </div>
            <input style={styles.input}
              value={form.videoUrl}
              onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </div>

          {/* Audio */}
          <div style={styles.uploadSection}>
            <div style={styles.uploadHeader}>
              <Music size={16} strokeWidth={1.5} color="#6B7280" />
              <span style={styles.uploadLabel}>File âm thanh (MP3 / WAV)</span>
            </div>
            <div style={styles.uploadRow}>
              <span style={{ ...styles.input, flex: 1, color: "#6B7280" }}>
                {form.audioFilename || "Chưa có file audio"}
              </span>
              <button onClick={() => audioInputRef.current?.click()} disabled={uploading.audio} style={styles.uploadBtn}>
                <Upload size={14} strokeWidth={1.5} />
                {uploading.audio ? "Đang tải…" : "Tải audio"}
              </button>
              <input ref={audioInputRef} type="file" accept="audio/*" style={{ display: "none" }} onChange={handleAudioChange} />
            </div>
          </div>

          <div style={{ display: "flex", gap: 24, marginTop: 12 }}>
            <label style={styles.checkboxLabel}>
              <input type="checkbox" checked={form.hasPlay} onChange={(e) => setForm({ ...form, hasPlay: e.target.checked })} style={{ accentColor: "#111827", marginRight: 8, width: 16, height: 16 }} />
              Hiển thị nút Play
            </label>
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
      {displayed.length === 0 ? (
        <div style={styles.emptyState}>
          <Film size={32} strokeWidth={1} color="#9CA3AF" />
          <p style={{ color: "#6B7280", fontSize: "0.875rem", marginTop: 16 }}>
            {items.length === 0 ? "Chưa có tác phẩm nào. Nhấn \"Tải dữ liệu mẫu\" hoặc thêm mới." : "Không có kết quả."}
          </p>
        </div>
      ) : (
        <div style={styles.grid}>
          {displayed.map((item) => (
            <div key={item._id} onClick={() => openEdit(item)} style={{ ...styles.card, cursor: "pointer" }}>
              {/* Cover */}
              <div style={styles.cardCover}>
                {item.coverUrl ? (
                  <img src={item.coverUrl} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={styles.cardCoverPlaceholder}><Image size={24} strokeWidth={1} color="#9CA3AF" /></div>
                )}
                {/* Overlay badges */}
                <div style={styles.cardOverlay}>
                  <span style={styles.catBadge}>{item.category}</span>
                  {item.hasPlay && <span style={styles.playBadge}>▶</span>}
                  {item.isFeatured && <span style={styles.featureBadge}><Star size={10} fill="#FDE047" color="#FDE047" style={{ marginRight: 4 }}/> Nổi bật</span>}
                  {!item.isPublished && <span style={styles.draftBadge}>Bản nháp</span>}
                </div>
              </div>
              {/* Info */}
              <div style={styles.cardBody}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={styles.cardTitle}>{item.title}</p>
                    <p style={styles.cardMeta}>{item.tag} · {item.year}</p>
                  </div>
                  <span style={{ ...styles.catPill, flexShrink: 0 }}>{item.category}</span>
                </div>
                <p style={styles.cardDesc}>{item.description}</p>
                <div style={styles.cardMedia}>
                  {item.videoUrl && <span style={styles.mediaChip}><Film size={12} strokeWidth={1.5} /> Video</span>}
                  {item.audioStorageId && <span style={styles.mediaChip}><Music size={12} strokeWidth={1.5} /> Audio</span>}
                  {(item.coverStorageId || item.coverUrl) && <span style={styles.mediaChip}><Image size={12} strokeWidth={1.5} /> Ảnh</span>}
                </div>
              </div>
              {/* Actions */}
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
  filterRow: { display: "flex", gap: 16, borderBottom: "1px solid #E5E7EB", marginBottom: 24 },
  filterBtn: { background: "none", border: "none", borderBottom: "2px solid transparent", color: "#6B7280", cursor: "pointer", fontSize: "0.875rem", fontWeight: 500, padding: "12px 16px", marginBottom: -1, fontFamily: "'Inter', sans-serif", transition: "color 0.2s", display: "flex", alignItems: "center", gap: 8 },
  filterBtnActive: { color: "#111827", borderBottom: "2px solid #111827" },
  filterCount: { fontSize: "0.75rem", color: "#4B5563", backgroundColor: "#F3F4F6", padding: "2px 8px", borderRadius: "10px" },
  formCard: { backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: "8px", padding: "24px", marginBottom: 24, boxShadow: "0 1px 3px 0 rgba(0,0,0,0.1)" },
  formHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  formTitle: { fontSize: "1.125rem", fontWeight: 600, color: "#111827" },
  formGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20, marginBottom: 16 },
  formActions: { display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 24, paddingTop: 20, borderTop: "1px solid #F3F4F6" },
  uploadSection: { border: "1px solid #E5E7EB", borderRadius: "6px", padding: "16px", marginBottom: 16 },
  uploadHeader: { display: "flex", alignItems: "center", gap: 8, marginBottom: 12 },
  uploadLabel: { fontSize: "0.875rem", fontWeight: 600, color: "#374151" },
  uploadRow: { display: "flex", gap: 12, alignItems: "center" },
  uploadBtn: { display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "'Inter', sans-serif", fontSize: "0.875rem", fontWeight: 500, color: "#374151", backgroundColor: "#FFFFFF", border: "1px solid #D1D5DB", borderRadius: "6px", padding: "10px 16px", cursor: "pointer", whiteSpace: "nowrap" as const, flexShrink: 0 },
  uploadNote: { fontSize: "0.875rem", color: "#10B981", display: "flex", alignItems: "center", gap: 6, margin: "12px 0 0" },
  input: { backgroundColor: "#FFFFFF", border: "1px solid #D1D5DB", borderRadius: "6px", color: "#111827", padding: "10px 14px", fontSize: "1rem", fontFamily: "'Inter', sans-serif", outline: "none", width: "100%", boxSizing: "border-box" as const, transition: "border-color 0.2s" },
  select: { backgroundColor: "#FFFFFF", border: "1px solid #D1D5DB", borderRadius: "6px", color: "#111827", padding: "10px 14px", fontSize: "1rem", fontFamily: "'Inter', sans-serif", outline: "none", width: "100%", cursor: "pointer" },
  checkboxLabel: { fontSize: "0.875rem", color: "#374151", cursor: "pointer", display: "flex", alignItems: "center" },
  btnPrimary: { display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "'Inter', sans-serif", fontSize: "0.875rem", fontWeight: 500, color: "#FFFFFF", backgroundColor: "#111827", border: "1px solid #111827", borderRadius: "6px", padding: "10px 20px", cursor: "pointer", transition: "background-color 0.2s" },
  btnSecondary: { display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "'Inter', sans-serif", fontSize: "0.875rem", fontWeight: 500, color: "#374151", backgroundColor: "#FFFFFF", border: "1px solid #D1D5DB", borderRadius: "6px", padding: "10px 20px", cursor: "pointer", transition: "background-color 0.2s" },
  iconBtn: { background: "none", border: "none", color: "#6B7280", cursor: "pointer", padding: "6px", borderRadius: "4px", display: "flex", alignItems: "center", transition: "color 0.2s, background-color 0.2s" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 },
  card: { backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: "8px", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 1px 3px 0 rgba(0,0,0,0.1)", transition: "transform 0.2s, box-shadow 0.2s" },
  cardCover: { position: "relative", aspectRatio: "16/9", overflow: "hidden", backgroundColor: "#F3F4F6", borderBottom: "1px solid #E5E7EB" },
  cardCoverPlaceholder: { width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" },
  cardOverlay: { position: "absolute", top: 12, left: 12, display: "flex", gap: 8, flexWrap: "wrap" as const },
  catBadge: { fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", backgroundColor: "rgba(255,255,255,0.9)", color: "#111827", padding: "4px 10px", borderRadius: "4px", border: "1px solid rgba(0,0,0,0.05)" },
  playBadge: { fontSize: "0.75rem", backgroundColor: "rgba(17,24,39,0.7)", color: "#FFFFFF", padding: "4px 10px", borderRadius: "4px", backdropFilter: "blur(4px)" },
  draftBadge: { fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", backgroundColor: "#FEF3C7", color: "#D97706", padding: "4px 10px", borderRadius: "4px", border: "1px solid #FDE68A" },
  featureBadge: { fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", backgroundColor: "rgba(0,0,0,0.7)", color: "#FFF", padding: "4px 10px", borderRadius: "4px", display: "flex", alignItems: "center" },
  cardBody: { padding: "20px", flex: 1 },
  cardTitle: { fontSize: "1.125rem", fontWeight: 600, color: "#111827", margin: "0 0 4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const },
  cardMeta: { fontSize: "0.875rem", color: "#6B7280", margin: "0 0 12px" },
  catPill: { fontSize: "0.75rem", fontWeight: 500, textTransform: "uppercase", backgroundColor: "#F3F4F6", border: "1px solid #E5E7EB", borderRadius: "4px", color: "#4B5563", padding: "4px 10px" },
  cardDesc: { fontSize: "0.875rem", color: "#4B5563", margin: 0, lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden" },
  cardMedia: { display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" as const },
  mediaChip: { display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.75rem", fontWeight: 500, color: "#374151", backgroundColor: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: "4px", padding: "4px 10px" },
  cardActions: { display: "flex", justifyContent: "flex-end", gap: 4, padding: "12px 16px", borderTop: "1px solid #F3F4F6", backgroundColor: "#F9FAFB" },
  emptyState: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 240, border: "1px dashed #D1D5DB", borderRadius: "8px", backgroundColor: "#F9FAFB" },
};
