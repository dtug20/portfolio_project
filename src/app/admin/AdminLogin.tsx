import { useState, FormEvent } from "react";
import { useAdminAuth } from "./hooks/useAdminAuth";

interface AdminLoginProps {
  onSuccess: () => void;
}

export function AdminLogin({ onSuccess }: AdminLoginProps) {
  const { login, error, loading } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const ok = await login(email, password);
    setSubmitting(false);
    if (ok) onSuccess();
  };

  if (loading) {
    return (
      <div style={styles.root}>
        <div style={styles.dot} />
      </div>
    );
  }

  return (
    <div style={styles.root}>
      {/* Logo / wordmark */}
      <div style={styles.brand}>
        <p style={styles.brandLabel}>Admin</p>
        <h1 style={styles.brandName}>Nguyen Minh</h1>
      </div>

      {/* Card */}
      <form onSubmit={handleSubmit} style={styles.card}>
        <h2 style={styles.cardTitle}>Đăng nhập</h2>
        <div style={styles.divider} />

        <div style={styles.field}>
          <label style={styles.label}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="admin@example.com"
            style={styles.input}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#6366F1";
              e.currentTarget.style.boxShadow = "0 0 0 1px #6366F1";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "#D1D5DB";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Mật khẩu</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            style={styles.input}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#6366F1";
              e.currentTarget.style.boxShadow = "0 0 0 1px #6366F1";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "#D1D5DB";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
        </div>

        {error && <p style={styles.errorMsg}>{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          style={{
            ...styles.btn,
            opacity: submitting ? 0.7 : 1,
            cursor: submitting ? "not-allowed" : "pointer",
          }}
          onMouseEnter={(e) => {
            if (!submitting) {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#374151";
            }
          }}
          onMouseLeave={(e) => {
            if (!submitting) {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#111827";
            }
          }}
        >
          {submitting ? "Đang đăng nhập…" : "Đăng nhập"}
        </button>

        <p style={styles.hint}>
          Lần đầu sử dụng? Chạy{" "}
          <code style={styles.code}>npx convex run adminAuth:seedAdmin</code>
        </p>
      </form>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  root: {
    minHeight: "100vh",
    backgroundColor: "#F9FAFB",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    fontFamily: "'Inter', sans-serif",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    backgroundColor: "#111827",
    animation: "pulse 1s infinite",
  },
  brand: {
    textAlign: "center",
    marginBottom: "2rem",
  },
  brandLabel: {
    fontSize: "0.875rem",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#6B7280",
    marginBottom: "0.5rem",
    fontWeight: 500,
  },
  brandName: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "2.5rem",
    fontWeight: 600,
    color: "#111827",
    letterSpacing: "-0.01em",
    margin: 0,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#FFFFFF",
    border: "1px solid #E5E7EB",
    borderRadius: "8px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
    padding: "2.5rem",
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  cardTitle: {
    fontSize: "1.25rem",
    fontWeight: 600,
    color: "#111827",
    margin: 0,
    textAlign: "center",
  },
  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    margin: "0.25rem 0",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  label: {
    fontSize: "0.875rem",
    fontWeight: 500,
    color: "#374151",
  },
  input: {
    backgroundColor: "#FFFFFF",
    border: "1px solid #D1D5DB",
    color: "#111827",
    padding: "12px 16px",
    fontSize: "1rem",
    fontFamily: "'Inter', sans-serif",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    borderRadius: "6px",
  },
  errorMsg: {
    fontSize: "0.875rem",
    color: "#DC2626",
    margin: 0,
    padding: "12px 16px",
    backgroundColor: "#FEF2F2",
    border: "1px solid #FECACA",
    borderRadius: "6px",
  },
  btn: {
    fontFamily: "'Inter', sans-serif",
    fontSize: "1rem",
    fontWeight: 500,
    color: "#FFFFFF",
    backgroundColor: "#111827",
    border: "1px solid #111827",
    borderRadius: "6px",
    padding: "12px 24px",
    transition: "all 0.2s ease",
    marginTop: "0.5rem",
  },
  hint: {
    fontSize: "0.875rem",
    color: "#6B7280",
    margin: 0,
    lineHeight: 1.5,
    textAlign: "center",
    marginTop: "1rem",
  },
  code: {
    backgroundColor: "#F3F4F6",
    padding: "2px 6px",
    borderRadius: "4px",
    color: "#4B5563",
    fontSize: "0.75rem",
    fontFamily: "monospace",
  },
};
