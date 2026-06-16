import { useState, FormEvent } from "react";
import { useConvex } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { AdminLayout } from "../AdminLayout";
import { useAdminAuth } from "../hooks/useAdminAuth";
import { Check, Eye, EyeOff, ExternalLink } from "lucide-react";

export function AdminSettings() {
  const { session } = useAdminAuth();
  const convex = useConvex();

  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    if (newPw !== confirmPw) {
      setMsg({ type: "err", text: "Mật khẩu mới không khớp" });
      return;
    }
    if (newPw.length < 8) {
      setMsg({ type: "err", text: "Mật khẩu phải ít nhất 8 ký tự" });
      return;
    }
    setSaving(true);
    setMsg(null);
    try {
      await convex.action(api.adminAuth.changePassword, {
        token: session!.token,
        currentPassword: currentPw,
        newPassword: newPw,
      });
      setMsg({ type: "ok", text: "Đã đổi mật khẩu thành công" });
      setCurrentPw(""); setNewPw(""); setConfirmPw("");
    } catch (err: any) {
      setMsg({ type: "err", text: err.message ?? "Lỗi khi đổi mật khẩu" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout title="Cài đặt" subtitle="Tài khoản & bảo mật">
      <div style={{ maxWidth: 560, display: "flex", flexDirection: "column", gap: 32 }}>
        {/* Account info */}
        <Section title="Thông tin tài khoản">
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Tên</span>
            <span style={styles.infoValue}>{session?.name}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Email</span>
            <span style={styles.infoValue}>{session?.email}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Vai trò</span>
            <span style={{ ...styles.infoValue, color: "#6B7280" }}>Administrator</span>
          </div>
        </Section>

        {/* Change password */}
        <Section title="Đổi mật khẩu">
          <form onSubmit={handleChangePassword} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <Field label="Mật khẩu hiện tại">
              <div style={styles.pwRow}>
                <input
                  type={showPw ? "text" : "password"}
                  value={currentPw}
                  onChange={(e) => setCurrentPw(e.target.value)}
                  required
                  style={{ ...styles.input, flex: 1, borderRight: "none", borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} style={styles.eyeBtn}>
                  {showPw ? <EyeOff size={16} strokeWidth={1.5} /> : <Eye size={16} strokeWidth={1.5} />}
                </button>
              </div>
            </Field>

            <Field label="Mật khẩu mới">
              <input
                type={showPw ? "text" : "password"}
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                required
                minLength={8}
                style={styles.input}
                placeholder="Ít nhất 8 ký tự"
              />
            </Field>

            <Field label="Xác nhận mật khẩu mới">
              <input
                type={showPw ? "text" : "password"}
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                required
                style={styles.input}
                placeholder="Nhập lại mật khẩu mới"
              />
            </Field>

            {msg && (
              <div style={{
                fontSize: "0.875rem",
                padding: "12px 16px",
                borderRadius: "6px",
                backgroundColor: msg.type === "ok" ? "#ECFDF5" : "#FEF2F2",
                border: `1px solid ${msg.type === "ok" ? "#A7F3D0" : "#FECACA"}`,
                color: msg.type === "ok" ? "#059669" : "#DC2626",
              }}>
                {msg.text}
              </div>
            )}

            <button type="submit" disabled={saving} style={styles.btnPrimary}>
              {saving ? "Đang lưu…" : <><Check size={16} strokeWidth={2} /> Đổi mật khẩu</>}
            </button>
          </form>
        </Section>

        {/* Convex info */}
        <Section title="Cơ sở dữ liệu (Convex)">
          <div style={styles.convexCard}>
            <p style={styles.convexText}>
              Dữ liệu được lưu trữ trên <strong style={{ color: "#111827" }}>Convex</strong> — serverless database với file storage tích hợp.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
              {[
                { label: "Convex Dashboard", url: "https://dashboard.convex.dev" },
                { label: "Tài liệu Convex", url: "https://docs.convex.dev" },
                { label: "File Storage", url: "https://docs.convex.dev/file-storage" },
              ].map((link) => (
                <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" style={styles.extLink}>
                  {link.label}
                  <ExternalLink size={14} strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>
        </Section>
      </div>
    </AdminLayout>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ borderTop: "1px solid #E5E7EB", paddingTop: 28, paddingBottom: 12 }}>
      <p style={{ fontSize: "0.875rem", fontWeight: 600, textTransform: "uppercase", color: "#4B5563", marginBottom: 20, letterSpacing: "0.05em" }}>{title}</p>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "#374151" }}>{label}</label>
      {children}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  infoRow: { display: "flex", alignItems: "center", gap: 24, padding: "14px 0", borderBottom: "1px solid #F3F4F6" },
  infoLabel: { fontSize: "0.875rem", fontWeight: 500, color: "#6B7280", width: 120, flexShrink: 0 },
  infoValue: { fontSize: "1rem", color: "#111827" },
  pwRow: { display: "flex", alignItems: "stretch" },
  input: { backgroundColor: "#FFFFFF", border: "1px solid #D1D5DB", borderRadius: "6px", color: "#111827", padding: "10px 14px", fontSize: "1rem", fontFamily: "'Inter', sans-serif", outline: "none", width: "100%", boxSizing: "border-box" as const, transition: "border-color 0.2s" },
  eyeBtn: { background: "#F9FAFB", border: "1px solid #D1D5DB", borderLeft: "none", borderTopRightRadius: "6px", borderBottomRightRadius: "6px", color: "#6B7280", cursor: "pointer", padding: "0 14px", display: "flex", alignItems: "center", transition: "color 0.2s" },
  btnPrimary: { display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "'Inter', sans-serif", fontSize: "0.875rem", fontWeight: 500, color: "#FFFFFF", backgroundColor: "#111827", border: "1px solid #111827", borderRadius: "6px", padding: "10px 24px", cursor: "pointer", alignSelf: "flex-start", transition: "background-color 0.2s" },
  convexCard: { backgroundColor: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: "8px", padding: "24px" },
  convexText: { fontSize: "0.875rem", color: "#4B5563", lineHeight: 1.6, margin: 0 },
  extLink: { display: "inline-flex", alignItems: "center", gap: 8, fontSize: "0.875rem", fontWeight: 500, color: "#374151", textDecoration: "none", transition: "color 0.2s" },
};
