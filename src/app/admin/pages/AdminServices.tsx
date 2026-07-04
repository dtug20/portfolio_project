import { useState, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { convertToWebP } from "../../../lib/imageUtils";
import { AdminLayout } from "../AdminLayout";
import { Plus, Trash2, LayoutGrid, X, Check, Upload, Image } from "lucide-react";
import { toast } from "sonner";

interface ServiceForm {
  title: string;
  shortDesc: string;
  fullDesc: string;
  deliverables: string; // Newline separated
  timeline: string;
  tags: string; // Comma separated
  imagePosition: string;
  isPublished: boolean;
  isFeatured: boolean;
  imageUrl: string;
  imageStorageId?: Id<"_storage">;
}

const EMPTY_FORM: ServiceForm = {
  title: "",
  shortDesc: "",
  fullDesc: "",
  deliverables: "",
  timeline: "",
  tags: "",
  imagePosition: "center",
  isPublished: true,
  isFeatured: false,
  imageUrl: "",
};

export function AdminServices() {
  const allServices = useQuery(api.services.listAll) ?? [];
  const createService = useMutation(api.services.create);
  const updateService = useMutation(api.services.update);
  const removeService = useMutation(api.services.remove);
  const generateUploadUrl = useMutation(api.services.generateUploadUrl);

  const [editing, setEditing] = useState<string | null>(null); // service id or "new"
  const [form, setForm] = useState<ServiceForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const openNew = () => {
    setForm(EMPTY_FORM);
    setEditing("new");
  };

  const openEdit = (service: any) => {
    setForm({
      title: service.title || "",
      shortDesc: service.shortDesc || "",
      fullDesc: service.fullDesc || "",
      deliverables: (service.deliverables || []).join("\n"),
      timeline: service.timeline || "",
      tags: (service.tags || []).join(", "),
      imagePosition: service.imagePosition || "center",
      isPublished: service.isPublished ?? true,
      isFeatured: service.isFeatured ?? false,
      imageUrl: service.imageUrl || "",
      imageStorageId: service.imageStorageId,
    });
    setEditing(service._id);
  };

  const uploadFile = async (rawFile: File): Promise<Id<"_storage">> => {
    setUploadingImage(true);
    try {
      const file = await convertToWebP(rawFile);
      const uploadUrl = await generateUploadUrl();
      const res = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = await res.json();
      return storageId as Id<"_storage">;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    try {
      const storageId = await uploadFile(file);
      setForm((f) => ({ ...f, imageStorageId: storageId, imageUrl: previewUrl }));
    } catch (err) {
      toast.error("Lỗi khi tải ảnh");
    }
  };

  const handleSave = async () => {
    if (!form.title) return;
    setSaving(true);
    
    const data = {
      title: form.title,
      shortDesc: form.shortDesc,
      fullDesc: form.fullDesc,
      deliverables: form.deliverables.split("\n").map(s => s.trim()).filter(Boolean),
      timeline: form.timeline,
      tags: form.tags.split(",").map(s => s.trim()).filter(Boolean),
      imagePosition: form.imagePosition,
      isPublished: form.isPublished,
      isFeatured: form.isFeatured,
      imageUrl: form.imageStorageId ? undefined : form.imageUrl || undefined,
      imageStorageId: form.imageStorageId,
    };

    try {
      if (editing === "new") {
        await createService(data);
        toast.success("Đã thêm dịch vụ mới!");
      } else {
        await updateService({ id: editing as Id<"services">, ...data });
        toast.success("Đã cập nhật dịch vụ!");
      }
      setEditing(null);
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi lưu dịch vụ.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!editing || editing === "new") return;
    if (!window.confirm("Bạn có chắc chắn muốn xóa dịch vụ này?")) return;
    try {
      await removeService({ id: editing as Id<"services"> });
      toast.success("Đã xóa dịch vụ");
      setEditing(null);
    } catch (err) {
      toast.error("Lỗi khi xóa");
    }
  };

  return (
    <AdminLayout
      title="Dịch vụ"
      subtitle={`${allServices.length} dịch vụ`}
      actions={
        <button onClick={openNew} style={styles.btnPrimary}>
          <Plus size={16} strokeWidth={2} />
          Thêm dịch vụ
        </button>
      }
    >
      {/* Form Modal */}
      {editing && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ ...styles.formCard, maxHeight: "90vh", overflowY: "auto", width: "100%", maxWidth: 700 }}>
            <div style={styles.formHeader}>
              <span style={styles.formTitle}>{editing === "new" ? "Thêm dịch vụ mới" : "Chỉnh sửa dịch vụ"}</span>
              <button onClick={() => setEditing(null)} style={styles.iconBtn}>
                <X size={16} strokeWidth={1.5} />
              </button>
            </div>

            <div className="admin-grid-2" style={{ marginBottom: 20 }}>
              <Field label="Tiêu đề" required>
                <input style={styles.input} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Composition" />
              </Field>
              <Field label="Timeline">
                <input style={styles.input} value={form.timeline} onChange={(e) => setForm({ ...form, timeline: e.target.value })} placeholder="8 - 24 weeks" />
              </Field>
              <Field label="Mô tả ngắn" full>
                <input style={styles.input} value={form.shortDesc} onChange={(e) => setForm({ ...form, shortDesc: e.target.value })} />
              </Field>
              <Field label="Mô tả chi tiết" full>
                <textarea style={{ ...styles.input, minHeight: 250, resize: "vertical" }} value={form.fullDesc} onChange={(e) => setForm({ ...form, fullDesc: e.target.value })} />
              </Field>
              <Field label="Tags (cách nhau bởi dấu phẩy)" full>
                <input style={styles.input} value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="Orchestral, Chamber, Solo" />
              </Field>
              <Field label="Deliverables (mỗi mục một dòng)" full>
                <textarea style={{ ...styles.input, minHeight: 120, resize: "vertical" }} value={form.deliverables} onChange={(e) => setForm({ ...form, deliverables: e.target.value })} placeholder="Fully notated score&#10;MIDI mockup" />
              </Field>
              


              <div style={{ display: "flex", gap: 16, alignItems: "center" }}>

                <label style={styles.checkboxLabel}>
                  <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} style={{ marginRight: 8 }} />
                  Hiển thị nổi bật ở Home
                </label>
              </div>
            </div>

            {/* Image */}
            <div style={{ border: "1px solid #E5E7EB", borderRadius: "6px", padding: "16px", marginBottom: 16, marginTop: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <Image size={16} strokeWidth={1.5} color="#6B7280" />
                <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "#374151" }}>Ảnh nền</span>
              </div>
              
              {form.imageUrl ? (
                <div style={{ position: "relative", width: "100%", height: 180, borderRadius: 8, overflow: "hidden", border: "1px solid #E5E7EB", backgroundColor: "#F3F4F6" }}>
                  <img src={form.imageUrl} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: form.imagePosition || "center" }} />
                  <div style={{ position: "absolute", top: 8, right: 8, display: "flex", gap: 8 }}>
                    <button onClick={() => imageInputRef.current?.click()} style={{ ...styles.iconBtn, backgroundColor: "rgba(255,255,255,0.9)", padding: "6px 12px", borderRadius: 4, color: "#111827", fontSize: "0.75rem", fontWeight: 500 }}>
                      Thay đổi
                    </button>
                    <button onClick={() => setForm(f => ({ ...f, imageUrl: "", imageStorageId: undefined }))} style={{ ...styles.iconBtn, backgroundColor: "rgba(239,68,68,0.9)", padding: "6px 12px", borderRadius: 4, color: "#FFF", fontSize: "0.75rem", fontWeight: 500 }}>
                      Xóa
                    </button>
                  </div>
                  {uploadingImage && (
                    <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(255,255,255,0.5)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 500, color: "#111827" }}>
                      Đang tải...
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "24px", border: "1px dashed #D1D5DB", borderRadius: 8, backgroundColor: "#F9FAFB" }}>
                  <Upload size={24} color="#9CA3AF" style={{ marginBottom: 12 }} />
                  <button onClick={() => imageInputRef.current?.click()} disabled={uploadingImage} style={styles.btnSecondary}>
                    <Upload size={14} strokeWidth={1.5} />
                    {uploadingImage ? "Đang tải…" : "Chọn ảnh tải lên"}
                  </button>
                </div>
              )}
              <input ref={imageInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageChange} />
            </div>

            <div style={{ ...styles.formActions, justifyContent: "space-between" }}>
              {editing !== "new" ? (
                <button onClick={handleDelete} style={{ ...styles.iconBtn, color: "#EF4444", border: "1px solid #FCA5A5", padding: "8px 16px", borderRadius: 6, display: "flex", alignItems: "center", gap: 6, cursor: "pointer", background: "#FEF2F2" }}>
                  <Trash2 size={16} strokeWidth={1.5} /> Xóa
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

      {/* Table */}
      {allServices.length === 0 ? (
        <div style={styles.emptyState}>
          <LayoutGrid size={32} strokeWidth={1} color="#9CA3AF" />
          <p style={{ color: "#6B7280", fontSize: "0.875rem", marginTop: 16 }}>
            Không có dịch vụ nào.
          </p>
        </div>
      ) : (
        <div className="admin-table-wrapper" style={{ paddingBottom: 16, margin: "0 -4px", padding: "0 4px" }}>
          <div style={{ ...styles.table, minWidth: 700 }}>
            <div style={styles.tableHeader}>
              <span style={{ ...styles.th, flex: "0 0 60px" }}>Ảnh</span>
              <span style={{ ...styles.th, flex: 1 }}>Dịch vụ</span>
              <span style={{ ...styles.th, flex: "0 0 100px" }}>Published</span>
              <span style={{ ...styles.th, flex: "0 0 100px" }}>Featured</span>
            </div>
            {allServices.map((service) => (
              <div key={service._id} onClick={() => openEdit(service)} style={{ ...styles.tableRow, cursor: "pointer" }} className="table-row">
                <div style={{ flex: "0 0 60px" }}>
                  <div style={{ width: 40, height: 40, borderRadius: 4, overflow: "hidden", backgroundColor: "#F3F4F6", border: "1px solid #E5E7EB" }}>
                    {service.imageUrl ? (
                      <img src={service.imageUrl} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: service.imagePosition || "center" }} alt={service.title} />
                    ) : (
                      <Image size={16} color="#9CA3AF" style={{ margin: "12px" }} />
                    )}
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={styles.eventName}>{service.title}</p>
                  <p style={styles.eventVenue}>{service.shortDesc}</p>
                </div>
                <div style={{ flex: "0 0 100px" }}>
                  <span style={{ ...styles.typeBadge, backgroundColor: service.isPublished ? "#D1FAE5" : "#F3F4F6", color: service.isPublished ? "#065F46" : "#4B5563" }}>
                    {service.isPublished ? "Yes" : "No"}
                  </span>
                </div>
                <div style={{ flex: "0 0 100px" }}>
                  <span style={{ ...styles.typeBadge, backgroundColor: service.isFeatured ? "#DBEAFE" : "#F3F4F6", color: service.isFeatured ? "#1E40AF" : "#4B5563" }}>
                    {service.isFeatured ? "Yes" : "No"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <style>{`
        .table-row:hover { background-color: #F9FAFB !important; }
      `}</style>
    </AdminLayout>
  );
}

// ── Field wrapper ─────────────────────────────────────────
function Field({ label, children, required, full }: { label: string; children: React.ReactNode; required?: boolean; full?: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, gridColumn: full ? "1 / -1" : undefined }}>
      <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "#374151" }}>
        {label} {required && <span style={{ color: "#EF4444" }}>*</span>}
      </label>
      {children}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  formCard: { backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: "8px", padding: "24px", marginBottom: 24, boxShadow: "0 1px 3px 0 rgba(0,0,0,0.1)" },
  formHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  formTitle: { fontSize: "1.125rem", fontWeight: 600, color: "#111827" },
  formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 },
  formActions: { display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 24, paddingTop: 20, borderTop: "1px solid #F3F4F6" },
  input: { backgroundColor: "#FFFFFF", border: "1px solid #D1D5DB", borderRadius: "6px", color: "#111827", padding: "10px 14px", fontSize: "1rem", fontFamily: "'Inter', sans-serif", outline: "none", width: "100%", boxSizing: "border-box", transition: "border-color 0.2s" },
  checkboxLabel: { fontSize: "0.875rem", color: "#374151", cursor: "pointer", display: "flex", alignItems: "center" },
  btnPrimary: { display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "'Inter', sans-serif", fontSize: "0.875rem", fontWeight: 500, color: "#FFFFFF", backgroundColor: "#111827", border: "1px solid #111827", borderRadius: "6px", padding: "10px 20px", cursor: "pointer", transition: "background-color 0.2s" },
  btnSecondary: { display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "'Inter', sans-serif", fontSize: "0.875rem", fontWeight: 500, color: "#374151", backgroundColor: "#FFFFFF", border: "1px solid #D1D5DB", borderRadius: "6px", padding: "10px 20px", cursor: "pointer", transition: "background-color 0.2s" },
  iconBtn: { background: "none", border: "none", color: "#6B7280", cursor: "pointer", padding: "6px", borderRadius: "4px", display: "flex", alignItems: "center", transition: "color 0.2s, background-color 0.2s" },
  table: { border: "1px solid #E5E7EB", borderRadius: "8px", overflow: "hidden", backgroundColor: "#FFFFFF", boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)" },
  tableHeader: { display: "flex", gap: 16, padding: "14px 20px", borderBottom: "1px solid #E5E7EB", backgroundColor: "#F9FAFB" },
  tableRow: { display: "flex", alignItems: "center", gap: 16, padding: "16px 20px", borderBottom: "1px solid #E5E7EB", transition: "background-color 0.2s" },
  th: { fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", color: "#4B5563", letterSpacing: "0.05em" },
  eventName: { fontSize: "1rem", fontWeight: 500, color: "#111827", margin: "0 0 4px", lineHeight: 1.4 },
  eventVenue: { fontSize: "0.875rem", color: "#6B7280", margin: 0, maxHeight: 120, overflowY: "auto", paddingRight: 4 },
  typeBadge: { fontSize: "0.75rem", fontWeight: 500, backgroundColor: "#F3F4F6", borderRadius: "4px", padding: "4px 8px", color: "#374151" },
  emptyState: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 240, border: "1px dashed #D1D5DB", borderRadius: "8px", backgroundColor: "#F9FAFB" },
};
