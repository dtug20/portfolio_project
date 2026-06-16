import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { AdminLayout } from "../AdminLayout";
import { Plus, Trash2, Calendar, X, Check } from "lucide-react";
import { toast } from "sonner";

type ShowStatus = "tickets" | "rsvp" | "sold_out" | "details";

interface ShowForm {
  date: string;
  event: string;
  venue: string;
  city: string;
  country: string;
  type: string;
  status: ShowStatus;
  ticketUrl: string;
  isPast: boolean;
  notes: string;
}

const EMPTY_FORM: ShowForm = {
  date: "",
  event: "", venue: "", city: "", country: "",
  type: "", status: "tickets", ticketUrl: "",
  isPast: false, notes: "",
};

const MONTHS = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
const STATUS_LABELS: Record<ShowStatus, string> = {
  tickets: "Bán vé", rsvp: "RSVP", sold_out: "Hết vé", details: "Chi tiết",
};
const STATUS_COLORS: Record<ShowStatus, string> = {
  tickets: "#4CAF50", rsvp: "#2196F3", sold_out: "#757575", details: "#FF9800",
};

export function AdminShows() {
  const allShows = useQuery(api.shows.listAll) ?? [];
  const createShow = useMutation(api.shows.create);
  const updateShow = useMutation(api.shows.update);
  const removeShow = useMutation(api.shows.remove);
  const seedShows = useMutation(api.shows.seedInitialShows);

  const [activeType, setActiveType] = useState<string>("All");
  const [editing, setEditing] = useState<string | null>(null); // show id or "new"
  const [form, setForm] = useState<ShowForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const types = ["All", ...Array.from(new Set(allShows.map(s => s.type || "").filter(Boolean)))];

  const displayed = allShows
    .filter((s) => activeType === "All" || s.type === activeType)
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""));

  const openNew = () => {
    setForm({ ...EMPTY_FORM, isPast: false });
    setEditing("new");
  };

  const openEdit = (show: any) => {
    setForm({
      date: show.date,
      event: show.event, venue: show.venue, city: show.city, country: show.country,
      type: show.type, status: show.status, ticketUrl: show.ticketUrl ?? "",
      isPast: show.isPast, notes: show.notes ?? "",
    });
    setEditing(show._id);
  };

  const handleSave = async () => {
    if (!form.event || !form.venue || !form.date) return;
    
    if (editing !== "new") {
      if (!window.confirm("Do you want to change this show?")) return;
    }

    setSaving(true);
    const data = {
      date: form.date,
      event: form.event, venue: form.venue, city: form.city, country: form.country,
      type: form.type, status: form.status,
      ticketUrl: form.ticketUrl || undefined,
      isPast: form.isPast,
      notes: form.notes || undefined,
    };
    try {
      if (editing === "new") {
        await createShow(data);
        toast.success("Đã thêm buổi diễn mới!");
      } else {
        await updateShow({ id: editing as Id<"shows">, ...data });
        toast.success("Đã cập nhật buổi diễn!");
      }
      setEditing(null);
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi lưu buổi diễn.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteFromForm = async () => {
    if (!editing || editing === "new") return;
    if (!window.confirm("Do you want to delete this show?")) return;
    try {
      await removeShow({ id: editing as Id<"shows"> });
      toast.success("Đã xóa buổi diễn");
      setEditing(null);
    } catch (err) {
      toast.error("Lỗi khi xóa");
    }
  };

  const handleSeed = async () => {
    setSeeding(true);
    try {
      await seedShows();
      toast.success("Đã tải dữ liệu mẫu!");
    } catch (err) {
      toast.error("Lỗi khi tải dữ liệu");
    }
    setSeeding(false);
  };

  return (
    <AdminLayout
      title="Lịch diễn"
      subtitle={`${allShows.length} buổi diễn`}
      actions={
        <div style={{ display: "flex", gap: 8 }}>
          {allShows.length === 0 && (
            <button onClick={handleSeed} disabled={seeding} style={styles.btnSecondary}>
              {seeding ? "Đang tải…" : "Tải dữ liệu mẫu"}
            </button>
          )}
          <button onClick={openNew} style={styles.btnPrimary}>
            <Plus size={16} strokeWidth={2} />
            Thêm buổi diễn
          </button>
        </div>
      }
    >
      {/* Types Tabs */}

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
        {types.map((t) => (
          <button
            key={t}
            onClick={() => setActiveType(t)}
            style={{
              padding: "6px 14px",
              borderRadius: 20,
              fontSize: "0.8rem",
              fontWeight: 500,
              cursor: "pointer",
              border: "1px solid",
              borderColor: activeType === t ? "#111827" : "#E5E7EB",
              backgroundColor: activeType === t ? "#111827" : "#FFFFFF",
              color: activeType === t ? "#FFFFFF" : "#6B7280",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              gap: 6
            }}
          >
            {t}
            <span style={{ opacity: 0.7, fontSize: "0.75rem" }}>
              {t === "All" ? allShows.length : allShows.filter(s => s.type === t).length}
            </span>
          </button>
        ))}
      </div>

      {/* Show form (Modal) */}
      {editing && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ ...styles.formCard, maxHeight: "90vh", overflowY: "auto", width: "100%", maxWidth: 600 }}>
          <div style={styles.formHeader}>
            <span style={styles.formTitle}>{editing === "new" ? "Thêm buổi diễn mới" : "Chỉnh sửa buổi diễn"}</span>
            <button onClick={() => setEditing(null)} style={styles.iconBtn}>
              <X size={16} strokeWidth={1.5} />
            </button>
          </div>

          <div style={styles.formGrid}>
            <Field label="Tên sự kiện" required>
              <input style={styles.input} value={form.event} onChange={(e) => setForm({ ...form, event: e.target.value })} placeholder="Hanoi International Music Festival" />
            </Field>
            <Field label="Địa điểm">
              <input style={styles.input} value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} placeholder="Hanoi Opera House" />
            </Field>
            <Field label="Ngày diễn" required>
              <input type="date" style={styles.input} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </Field>
            <Field label="Thành phố">
              <input style={styles.input} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Hanoi" />
            </Field>
            <Field label="Quốc gia (mã ISO)">
              <input style={styles.input} value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value.toUpperCase() })} placeholder="VN" maxLength={2} />
            </Field>
            <Field label="Loại">
              <select style={styles.select} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="" disabled>Chọn loại</option>
                <option value="S.E Project">S.E Project</option>
                <option value="Bluemato">Bluemato</option>
                <option value="Personal">Personal</option>
              </select>
            </Field>
            <Field label="Trạng thái">
              <select style={styles.select} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as ShowStatus })}>
                {(Object.keys(STATUS_LABELS) as ShowStatus[]).map((s) => (
                  <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                ))}
              </select>
            </Field>
            <Field label="URL vé (tùy chọn)">
              <input style={styles.input} value={form.ticketUrl} onChange={(e) => setForm({ ...form, ticketUrl: e.target.value })} placeholder="https://..." />
            </Field>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8 }}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={form.isPast}
                onChange={(e) => setForm({ ...form, isPast: e.target.checked })}
                style={{ accentColor: "#111827", marginRight: 8, width: 16, height: 16 }}
              />
              Buổi diễn đã qua
            </label>
          </div>

          <Field label="Ghi chú (tùy chọn)">
            <textarea style={{ ...styles.input, minHeight: 72, resize: "vertical" }} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Thông tin thêm…" />
          </Field>

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

      {/* Table */}
      {displayed.length === 0 ? (
        <div style={styles.emptyState}>
          <Calendar size={32} strokeWidth={1} color="#9CA3AF" />
          <p style={{ color: "#6B7280", fontSize: "0.875rem", marginTop: 16 }}>
            {allShows.length === 0 ? "Chưa có dữ liệu. Nhấn \"Tải dữ liệu mẫu\" hoặc thêm buổi diễn." : "Không có buổi diễn nào."}
          </p>
        </div>
      ) : (
        <div style={{ overflowX: "auto", paddingBottom: 16, margin: "0 -4px", padding: "0 4px" }}>
          <div style={{ ...styles.table, minWidth: 800 }}>
          <div style={styles.tableHeader}>
            <span style={{ ...styles.th, flex: "0 0 100px" }}>Ngày</span>
            <span style={{ ...styles.th, flex: 1 }}>Sự kiện</span>
            <span style={{ ...styles.th, flex: "0 0 160px" }}>Địa điểm</span>
            <span style={{ ...styles.th, flex: "0 0 100px" }}>Loại</span>
            <span style={{ ...styles.th, flex: "0 0 110px" }}>Trạng thái</span>
          </div>
          {displayed.map((show) => (
            <div key={show._id} onClick={() => openEdit(show)} style={{ ...styles.tableRow, cursor: "pointer" }} className="table-row">
              <div style={{ flex: "0 0 100px" }}>
                <span style={styles.dateMY}>{show.date}</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={styles.eventName}>{show.event}</p>
              </div>
              <div style={{ flex: "0 0 160px" }}>
                <p style={{ ...styles.eventName, fontSize: "0.85rem", fontWeight: 400 }}>{show.venue}</p>
                <p style={styles.eventVenue}>{show.city}, {show.country}</p>
              </div>
              <div style={{ flex: "0 0 100px" }}>
                <span style={styles.typeBadge}>{show.type}</span>
              </div>
              <div style={{ flex: "0 0 110px" }}>
                <span style={{ ...styles.statusDot, backgroundColor: STATUS_COLORS[show.status as ShowStatus] }} />
                <span style={styles.statusLabel}>{STATUS_LABELS[show.status as ShowStatus]}</span>
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
function Field({ label, children, required }: { label: string; children: ReactNode; required?: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "#374151" }}>
        {label} {required && <span style={{ color: "#EF4444" }}>*</span>}
      </label>
      {children}
    </div>
  );
}

// ── Import ─────────────────────────────────────────────────
import { ReactNode } from "react";

const styles: Record<string, React.CSSProperties> = {
  tabs: { display: "flex", borderBottom: "1px solid #E5E7EB", marginBottom: 24, gap: 16 },
  tab: { background: "none", border: "none", borderBottom: "2px solid transparent", color: "#6B7280", cursor: "pointer", fontSize: "0.875rem", fontWeight: 500, padding: "12px 16px", marginBottom: -1, fontFamily: "'Inter', sans-serif", transition: "color 0.2s", display: "flex", alignItems: "center", gap: 8 },
  tabActive: { color: "#111827", borderBottom: "2px solid #111827" },
  tabCount: { fontSize: "0.75rem", color: "#4B5563", backgroundColor: "#F3F4F6", padding: "2px 8px", borderRadius: "10px" },
  formCard: { backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: "8px", padding: "24px", marginBottom: 24, boxShadow: "0 1px 3px 0 rgba(0,0,0,0.1)" },
  formHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  formTitle: { fontSize: "1.125rem", fontWeight: 600, color: "#111827" },
  formGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20, marginBottom: 20 },
  formActions: { display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 24, paddingTop: 20, borderTop: "1px solid #F3F4F6" },
  input: { backgroundColor: "#FFFFFF", border: "1px solid #D1D5DB", borderRadius: "6px", color: "#111827", padding: "10px 14px", fontSize: "1rem", fontFamily: "'Inter', sans-serif", outline: "none", width: "100%", boxSizing: "border-box" as const, transition: "border-color 0.2s" },
  select: { backgroundColor: "#FFFFFF", border: "1px solid #D1D5DB", borderRadius: "6px", color: "#111827", padding: "10px 14px", fontSize: "1rem", fontFamily: "'Inter', sans-serif", outline: "none", width: "100%", cursor: "pointer" },
  checkboxLabel: { fontSize: "0.875rem", color: "#374151", cursor: "pointer", display: "flex", alignItems: "center" },
  btnPrimary: { display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "'Inter', sans-serif", fontSize: "0.875rem", fontWeight: 500, color: "#FFFFFF", backgroundColor: "#111827", border: "1px solid #111827", borderRadius: "6px", padding: "10px 20px", cursor: "pointer", transition: "background-color 0.2s" },
  btnSecondary: { display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "'Inter', sans-serif", fontSize: "0.875rem", fontWeight: 500, color: "#374151", backgroundColor: "#FFFFFF", border: "1px solid #D1D5DB", borderRadius: "6px", padding: "10px 20px", cursor: "pointer", transition: "background-color 0.2s" },
  iconBtn: { background: "none", border: "none", color: "#6B7280", cursor: "pointer", padding: "6px", borderRadius: "4px", display: "flex", alignItems: "center", transition: "color 0.2s, background-color 0.2s" },
  table: { border: "1px solid #E5E7EB", borderRadius: "8px", overflow: "hidden", backgroundColor: "#FFFFFF", boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)" },
  tableHeader: { display: "flex", gap: 16, padding: "14px 20px", borderBottom: "1px solid #E5E7EB", backgroundColor: "#F9FAFB" },
  tableRow: { display: "flex", alignItems: "center", gap: 16, padding: "16px 20px", borderBottom: "1px solid #E5E7EB", transition: "background-color 0.2s" },
  th: { fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", color: "#4B5563", letterSpacing: "0.05em" },
  dateDay: { fontFamily: "'Inter', sans-serif", fontSize: "1.125rem", fontWeight: 600, color: "#111827" },
  dateMY: { fontSize: "0.875rem", color: "#6B7280" },
  eventName: { fontSize: "1rem", fontWeight: 500, color: "#111827", margin: "0 0 4px", lineHeight: 1.4 },
  eventVenue: { fontSize: "0.875rem", color: "#6B7280", margin: 0 },
  typeBadge: { fontSize: "0.75rem", fontWeight: 500, backgroundColor: "#F3F4F6", borderRadius: "4px", padding: "4px 8px", color: "#374151" },
  statusDot: { display: "inline-block", width: 8, height: 8, borderRadius: "50%", marginRight: 8 },
  statusLabel: { fontSize: "0.875rem", color: "#4B5563" },
  emptyState: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 240, border: "1px dashed #D1D5DB", borderRadius: "8px", backgroundColor: "#F9FAFB" },
};
