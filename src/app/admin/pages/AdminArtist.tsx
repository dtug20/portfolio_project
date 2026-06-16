import { useState, useRef, ReactNode } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { AdminLayout } from "../AdminLayout";
import { Check, Upload, Plus, Pencil, Trash2, X, AlertTriangle, GripVertical } from "lucide-react";

export function AdminArtist() {
  const artistInfo = useQuery(api.artist.getArtistInfo);
  const milestones = useQuery(api.artist.listMilestones) ?? [];
  const upsertArtist = useMutation(api.artist.upsertArtistInfo);
  const generateUrl = useMutation(api.artist.generateUploadUrl);
  const createMilestone = useMutation(api.artist.createMilestone);
  const updateMilestone = useMutation(api.artist.updateMilestone);
  const deleteMilestone = useMutation(api.artist.deleteMilestone);
  const seedArtist = useMutation(api.artist.seedArtistInfo);
  const seedMilestones = useMutation(api.artist.seedMilestones);

  const [activeSection, setActiveSection] = useState<"profile" | "milestones">("profile");
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const [msEditing, setMsEditing] = useState<string | null>(null);
  const [msForm, setMsForm] = useState({ year: "", title: "", description: "" });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const heroInputRef = useRef<HTMLInputElement>(null);
  const portraitInputRef = useRef<HTMLInputElement>(null);

  // Form state — sync from DB on first load
  const [form, setForm] = useState<any>(null);
  if (artistInfo !== undefined && form === null) {
    setForm(
      artistInfo ?? {
        name: "Nguyen Minh",
        subtitle: "Composer · Performer · Music Director",
        heroBio: "",
        fullBio: "",
        aboutHeadline: "A Voice Between Two Worlds",
        heroImageUrl: "",
        portraitUrl: "",
        statYears: "20+",
        statConcerts: "300+",
        statAlbums: "12",
        statAwards: "8",
        bookingEmail: "booking@nguyenminh.asia",
        touringEmail: "touring@nguyenminh.asia",
        pressEmail: "press@nguyenminh.asia",
      }
    );
  }

  const uploadFile = async (file: File, field: string): Promise<Id<"_storage">> => {
    setUploading((u) => ({ ...u, [field]: true }));
    try {
      const uploadUrl = await generateUrl();
      const res = await fetch(uploadUrl, { method: "POST", headers: { "Content-Type": file.type }, body: file });
      const { storageId } = await res.json();
      return storageId as Id<"_storage">;
    } finally {
      setUploading((u) => ({ ...u, [field]: false }));
    }
  };

  const handleHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const id = await uploadFile(file, "hero");
    setForm((f: any) => ({ ...f, heroImageStorageId: id, heroImageUrl: "" }));
  };

  const handlePortraitUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const id = await uploadFile(file, "portrait");
    setForm((f: any) => ({ ...f, portraitStorageId: id, portraitUrl: "" }));
  };

  const handleSaveProfile = async () => {
    if (!form) return;
    setSaving(true);
    try {
      await upsertArtist({
        name: form.name, subtitle: form.subtitle, heroBio: form.heroBio,
        fullBio: form.fullBio, aboutHeadline: form.aboutHeadline,
        heroImageStorageId: form.heroImageStorageId,
        heroImageUrl: form.heroImageStorageId ? undefined : form.heroImageUrl || undefined,
        portraitStorageId: form.portraitStorageId,
        portraitUrl: form.portraitStorageId ? undefined : form.portraitUrl || undefined,
        statYears: form.statYears, statConcerts: form.statConcerts,
        statAlbums: form.statAlbums, statAwards: form.statAwards,
        bookingEmail: form.bookingEmail, touringEmail: form.touringEmail, pressEmail: form.pressEmail,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSeedAll = async () => {
    setSeeding(true);
    await seedArtist();
    await seedMilestones();
    setSeeding(false);
    setForm(null); // force re-read
  };

  const handleSaveMilestone = async () => {
    if (!msForm.year || !msForm.title) return;
    if (msEditing === "new") {
      await createMilestone({ ...msForm, order: milestones.length });
    } else {
      const ms = milestones.find((m) => m._id === msEditing);
      if (ms) await updateMilestone({ id: ms._id, ...msForm, order: ms.order });
    }
    setMsEditing(null);
  };

  if (form === null) return (
    <AdminLayout title="Hồ sơ nghệ sĩ">
      <div style={styles.loading}>Đang tải…</div>
    </AdminLayout>
  );

  return (
    <AdminLayout
      title="Hồ sơ nghệ sĩ"
      subtitle="Thông tin hiển thị trên trang chủ"
      actions={
        <div style={{ display: "flex", gap: 8 }}>
          {!artistInfo && (
            <button onClick={handleSeedAll} disabled={seeding} style={styles.btnSecondary}>
              {seeding ? "Đang tải…" : "Tải dữ liệu mẫu"}
            </button>
          )}
          {activeSection === "profile" && (
            <button onClick={handleSaveProfile} disabled={saving} style={styles.btnPrimary}>
              {saving ? "Đang lưu…" : <><Check size={16} strokeWidth={2} /> Lưu thay đổi</>}
            </button>
          )}
        </div>
      }
    >
      {/* Section tabs */}
      <div style={styles.tabs}>
        {(["profile", "milestones"] as const).map((s) => (
          <button key={s} onClick={() => setActiveSection(s)}
            style={{ ...styles.tab, ...(activeSection === s ? styles.tabActive : {}) }}
          >
            {s === "profile" ? "Hồ sơ & Liên hệ" : `Cột mốc sự nghiệp (${milestones.length})`}
          </button>
        ))}
      </div>

      {/* ── Profile section ── */}
      {activeSection === "profile" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          <Section title="Thông tin cơ bản">
            <div style={styles.grid2}>
              <Field label="Tên nghệ danh">
                <input style={styles.input} value={form.name ?? ""} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </Field>
              <Field label="Chức danh / Subtitle">
                <input style={styles.input} value={form.subtitle ?? ""} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
              </Field>
            </div>
            <Field label="Tiêu đề mục About">
              <input style={styles.input} value={form.aboutHeadline ?? ""} onChange={(e) => setForm({ ...form, aboutHeadline: e.target.value })} placeholder="A Voice Between Two Worlds" />
            </Field>
            <Field label="Bio ngắn (Hero section)">
              <textarea style={{ ...styles.input, minHeight: 96, resize: "vertical" }} value={form.heroBio ?? ""} onChange={(e) => setForm({ ...form, heroBio: e.target.value })} />
            </Field>
            <Field label="Bio đầy đủ (About page)">
              <textarea style={{ ...styles.input, minHeight: 160, resize: "vertical" }} value={form.fullBio ?? ""} onChange={(e) => setForm({ ...form, fullBio: e.target.value })} />
            </Field>
          </Section>

          <Section title="Thống kê hiển thị">
            <div style={styles.grid4}>
              <Field label="Năm hoạt động"><input style={styles.input} value={form.statYears ?? ""} onChange={(e) => setForm({ ...form, statYears: e.target.value })} placeholder="20+" /></Field>
              <Field label="Số buổi biểu diễn"><input style={styles.input} value={form.statConcerts ?? ""} onChange={(e) => setForm({ ...form, statConcerts: e.target.value })} placeholder="300+" /></Field>
              <Field label="Album"><input style={styles.input} value={form.statAlbums ?? ""} onChange={(e) => setForm({ ...form, statAlbums: e.target.value })} placeholder="12" /></Field>
              <Field label="Giải thưởng"><input style={styles.input} value={form.statAwards ?? ""} onChange={(e) => setForm({ ...form, statAwards: e.target.value })} placeholder="8" /></Field>
            </div>
          </Section>

          <Section title="Hình ảnh">
            <div style={styles.grid2}>
              <div>
                <p style={styles.imageLabel}>Ảnh nền Hero</p>
                {(form.heroImageUrl || artistInfo?.heroImageUrl) && (
                  <img src={form.heroImageUrl || artistInfo?.heroImageUrl} alt="Hero" style={styles.imagePreview} />
                )}
                <div style={styles.uploadRow}>
                  <input style={{ ...styles.input, flex: 1 }} value={form.heroImageUrl ?? ""} onChange={(e) => setForm({ ...form, heroImageUrl: e.target.value, heroImageStorageId: undefined })} placeholder="URL ảnh" />
                  <button onClick={() => heroInputRef.current?.click()} disabled={uploading.hero} style={styles.uploadBtn}>
                    <Upload size={14} strokeWidth={1.5} /> {uploading.hero ? "Đang tải…" : "Tải ảnh"}
                  </button>
                  <input ref={heroInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleHeroUpload} />
                </div>
              </div>
              <div>
                <p style={styles.imageLabel}>Ảnh chân dung</p>
                {(form.portraitUrl || artistInfo?.portraitUrl) && (
                  <img src={form.portraitUrl || artistInfo?.portraitUrl} alt="Portrait" style={styles.imagePreview} />
                )}
                <div style={styles.uploadRow}>
                  <input style={{ ...styles.input, flex: 1 }} value={form.portraitUrl ?? ""} onChange={(e) => setForm({ ...form, portraitUrl: e.target.value, portraitStorageId: undefined })} placeholder="URL ảnh" />
                  <button onClick={() => portraitInputRef.current?.click()} disabled={uploading.portrait} style={styles.uploadBtn}>
                    <Upload size={14} strokeWidth={1.5} /> {uploading.portrait ? "Đang tải…" : "Tải ảnh"}
                  </button>
                  <input ref={portraitInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handlePortraitUpload} />
                </div>
              </div>
            </div>
          </Section>

          <Section title="Thông tin liên hệ">
            <div style={styles.grid3}>
              <Field label="Email Booking"><input style={styles.input} type="email" value={form.bookingEmail ?? ""} onChange={(e) => setForm({ ...form, bookingEmail: e.target.value })} /></Field>
              <Field label="Email Touring"><input style={styles.input} type="email" value={form.touringEmail ?? ""} onChange={(e) => setForm({ ...form, touringEmail: e.target.value })} /></Field>
              <Field label="Email Press"><input style={styles.input} type="email" value={form.pressEmail ?? ""} onChange={(e) => setForm({ ...form, pressEmail: e.target.value })} /></Field>
            </div>
          </Section>
        </div>
      )}

      {/* ── Milestones section ── */}
      {activeSection === "milestones" && (
        <div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 24 }}>
            <button onClick={() => { setMsForm({ year: "", title: "", description: "" }); setMsEditing("new"); }} style={styles.btnPrimary}>
              <Plus size={16} strokeWidth={2} /> Thêm cột mốc
            </button>
          </div>

          {msEditing && (
            <div style={styles.msForm}>
              <div style={styles.formHeader}>
                <span style={styles.formTitle}>{msEditing === "new" ? "Thêm cột mốc" : "Sửa cột mốc"}</span>
                <button onClick={() => setMsEditing(null)} style={styles.iconBtn}><X size={16} strokeWidth={1.5} /></button>
              </div>
              <div style={styles.grid3}>
                <Field label="Năm"><input style={styles.input} value={msForm.year} onChange={(e) => setMsForm({ ...msForm, year: e.target.value })} placeholder="2024" /></Field>
                <Field label="Tiêu đề" required>
                  <input style={{ ...styles.input, gridColumn: "span 2" }} value={msForm.title} onChange={(e) => setMsForm({ ...msForm, title: e.target.value })} />
                </Field>
              </div>
              <Field label="Mô tả">
                <textarea style={{ ...styles.input, minHeight: 96, resize: "vertical" }} value={msForm.description} onChange={(e) => setMsForm({ ...msForm, description: e.target.value })} />
              </Field>
              <div style={styles.formActions}>
                <button onClick={() => setMsEditing(null)} style={styles.btnSecondary}>Hủy</button>
                <button onClick={handleSaveMilestone} style={styles.btnPrimary}><Check size={16} strokeWidth={2} /> Lưu</button>
              </div>
            </div>
          )}

          <div style={styles.msList}>
            {milestones.map((ms) => (
              <div key={ms._id} style={styles.msRow} className="ms-row">
                <GripVertical size={16} strokeWidth={1.5} color="#D1D5DB" style={{ flexShrink: 0, marginTop: 4, cursor: "grab" }} />
                <span style={styles.msYear}>{ms.year}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={styles.msTitle}>{ms.title}</p>
                  <p style={styles.msDesc}>{ms.description}</p>
                </div>
                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  <button onClick={() => { setMsForm({ year: ms.year, title: ms.title, description: ms.description }); setMsEditing(ms._id); }} style={styles.iconBtn} title="Sửa"><Pencil size={16} strokeWidth={1.5} /></button>
                  {deleteConfirm === ms._id ? (
                    <button onClick={() => { deleteMilestone({ id: ms._id }); setDeleteConfirm(null); }} style={{ ...styles.iconBtn, color: "#EF4444" }} title="Xác nhận xóa"><AlertTriangle size={16} strokeWidth={1.5} /></button>
                  ) : (
                    <button onClick={() => setDeleteConfirm(ms._id)} style={styles.iconBtn} title="Xóa"><Trash2 size={16} strokeWidth={1.5} /></button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <style>{`
        .ms-row:hover { background-color: #F9FAFB !important; }
      `}</style>
    </AdminLayout>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div style={{ borderTop: "1px solid #E5E7EB", paddingTop: 28, paddingBottom: 12 }}>
      <p style={{ fontSize: "0.875rem", fontWeight: 600, textTransform: "uppercase", color: "#4B5563", marginBottom: 20, letterSpacing: "0.05em" }}>{title}</p>
      {children}
    </div>
  );
}

function Field({ label, children, required }: { label: string; children: ReactNode; required?: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
      <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "#374151" }}>
        {label}{required && <span style={{ color: "#EF4444" }}> *</span>}
      </label>
      {children}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  loading: { color: "#6B7280", fontSize: "0.875rem", padding: 40, textAlign: "center" as const },
  tabs: { display: "flex", borderBottom: "1px solid #E5E7EB", marginBottom: 24, gap: 16 },
  tab: { background: "none", border: "none", borderBottom: "2px solid transparent", color: "#6B7280", cursor: "pointer", fontSize: "0.875rem", fontWeight: 500, padding: "12px 16px", marginBottom: -1, fontFamily: "'Inter', sans-serif", transition: "color 0.2s" },
  tabActive: { color: "#111827", borderBottom: "2px solid #111827" },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 },
  grid3: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 },
  grid4: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 },
  input: { backgroundColor: "#FFFFFF", border: "1px solid #D1D5DB", borderRadius: "6px", color: "#111827", padding: "10px 14px", fontSize: "1rem", fontFamily: "'Inter', sans-serif", outline: "none", width: "100%", boxSizing: "border-box" as const, transition: "border-color 0.2s" },
  imageLabel: { fontSize: "0.875rem", fontWeight: 500, color: "#374151", marginBottom: 12 },
  imagePreview: { width: "100%", aspectRatio: "16/9", objectFit: "cover", border: "1px solid #E5E7EB", borderRadius: "6px", marginBottom: 12 },
  uploadRow: { display: "flex", gap: 12, alignItems: "center" },
  uploadBtn: { display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "'Inter', sans-serif", fontSize: "0.875rem", fontWeight: 500, color: "#374151", backgroundColor: "#FFFFFF", border: "1px solid #D1D5DB", borderRadius: "6px", padding: "10px 16px", cursor: "pointer", flexShrink: 0, transition: "background-color 0.2s" },
  btnPrimary: { display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "'Inter', sans-serif", fontSize: "0.875rem", fontWeight: 500, color: "#FFFFFF", backgroundColor: "#111827", border: "1px solid #111827", borderRadius: "6px", padding: "10px 20px", cursor: "pointer", transition: "background-color 0.2s" },
  btnSecondary: { display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "'Inter', sans-serif", fontSize: "0.875rem", fontWeight: 500, color: "#374151", backgroundColor: "#FFFFFF", border: "1px solid #D1D5DB", borderRadius: "6px", padding: "10px 20px", cursor: "pointer", transition: "background-color 0.2s" },
  iconBtn: { background: "none", border: "none", color: "#6B7280", cursor: "pointer", padding: "6px", borderRadius: "4px", display: "flex", alignItems: "center", transition: "color 0.2s, background-color 0.2s" },
  msForm: { backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: "8px", padding: "24px", marginBottom: 24, boxShadow: "0 1px 3px 0 rgba(0,0,0,0.1)" },
  formHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  formTitle: { fontSize: "1.125rem", fontWeight: 600, color: "#111827" },
  formActions: { display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 24, paddingTop: 20, borderTop: "1px solid #F3F4F6" },
  msList: { display: "flex", flexDirection: "column", gap: 0, border: "1px solid #E5E7EB", borderRadius: "8px", overflow: "hidden", backgroundColor: "#FFFFFF", boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)" },
  msRow: { display: "flex", alignItems: "flex-start", gap: 16, padding: "20px", borderBottom: "1px solid #E5E7EB", transition: "background-color 0.2s" },
  msYear: { fontFamily: "'Inter', sans-serif", fontSize: "1.25rem", fontWeight: 600, color: "#111827", flexShrink: 0, width: 64, paddingTop: 2 },
  msTitle: { fontSize: "1rem", fontWeight: 500, color: "#111827", margin: "0 0 8px" },
  msDesc: { fontSize: "0.875rem", color: "#4B5563", margin: 0, lineHeight: 1.6 },
};
