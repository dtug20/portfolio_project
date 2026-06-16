import { useState, ReactNode } from "react";
import { Link, useLocation } from "react-router";
import {
  Calendar,
  Film,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  LayoutDashboard,
} from "lucide-react";
import { useAdminAuth } from "./hooks/useAdminAuth";
import { Toaster } from "sonner";

interface NavItem {
  label: string;
  path: string;
  icon: ReactNode;
  badge?: number;
}

const navItems: NavItem[] = [
  { label: "Tổng quan", path: "/admin", icon: <LayoutDashboard size={15} strokeWidth={1.5} /> },
  { label: "Lịch diễn", path: "/admin/shows", icon: <Calendar size={15} strokeWidth={1.5} /> },
  { label: "Tác phẩm & Media", path: "/admin/media", icon: <Film size={15} strokeWidth={1.5} /> },
  { label: "Hồ sơ nghệ sĩ", path: "/admin/artist", icon: <User size={15} strokeWidth={1.5} /> },
  { label: "Cài đặt", path: "/admin/settings", icon: <Settings size={15} strokeWidth={1.5} /> },
];

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export function AdminLayout({ children, title, subtitle, actions }: AdminLayoutProps) {
  const location = useLocation();
  const { session, logout } = useAdminAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div style={styles.root}>
      {/* ── Sidebar ── */}
      <aside
        style={{
          ...styles.sidebar,
          transform: mobileOpen ? "translateX(0)" : undefined,
        }}
        className={`admin-sidebar${mobileOpen ? " open" : ""}`}
      >
        {/* Brand */}
        <div style={styles.sidebarBrand}>
          <Link to="/" style={styles.brandLink} target="_blank">
            <span style={styles.brandLabel}>Portfolio</span>
            <span style={styles.brandName}>Nguyen Minh</span>
          </Link>
          <span style={styles.adminBadge}>Admin</span>
        </div>

        <div style={styles.sidebarDivider} />

        {/* Nav items */}
        <nav style={styles.nav}>
          {navItems.map((item) => {
            const isActive =
              item.path === "/admin"
                ? location.pathname === "/admin"
                : location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                style={{
                  ...styles.navItem,
                  backgroundColor: isActive ? "#F3F4F6" : "transparent",
                  color: isActive ? "#111827" : "#4B5563",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#F9FAFB";
                    (e.currentTarget as HTMLAnchorElement).style.color = "#111827";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent";
                    (e.currentTarget as HTMLAnchorElement).style.color = "#4B5563";
                  }
                }}
              >
                <span style={styles.navIcon}>{item.icon}</span>
                <span style={styles.navLabel}>{item.label}</span>
                {isActive && <ChevronRight size={14} strokeWidth={2} style={{ marginLeft: "auto", opacity: 0.5 }} />}
              </Link>
            );
          })}
        </nav>

        <div style={{ flex: 1 }} />

        {/* User info + logout */}
        <div style={styles.sidebarFooter}>
          <div style={styles.sidebarDivider} />
          <div style={styles.userRow}>
            <div style={styles.userAvatar}>{session?.name?.[0]?.toUpperCase() ?? "A"}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={styles.userName}>{session?.name}</p>
              <p style={styles.userEmail}>{session?.email}</p>
            </div>
            <button
              onClick={logout}
              style={styles.logoutBtn}
              title="Đăng xuất"
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "#EF4444";
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#FEF2F2";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "#6B7280";
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
              }}
            >
              <LogOut size={16} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          style={styles.overlay}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Main content ── */}
      <div style={styles.main} className="admin-main">
        {/* Top bar */}
        <header style={styles.topBar}>
          <button
            style={styles.mobileMenuBtn}
            onClick={() => setMobileOpen(!mobileOpen)}
            className="mobile-menu-btn"
          >
            {mobileOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
          </button>

          <div style={styles.pageTitle}>
            <h2 style={styles.pageTitleText}>{title}</h2>
            {subtitle && <p style={styles.pageTitleSub}>{subtitle}</p>}
          </div>

          {actions && <div style={styles.topBarActions}>{actions}</div>}
        </header>

        {/* Page content */}
        <main style={styles.content}>{children}</main>
      </div>

      <Toaster position="top-right" richColors />

      <style>{`
        @media (min-width: 768px) {
          .admin-sidebar { transform: translateX(0) !important; }
          .mobile-menu-btn { display: none !important; }
        }
        @media (max-width: 767px) {
          .mobile-menu-btn { display: flex !important; }
          .admin-main { margin-left: 0 !important; }
        }
        .admin-sidebar {
          transform: translateX(-100%);
          transition: transform 0.25s ease;
        }
      `}</style>
    </div>
  );
}

const SIDEBAR_W = 260;

const styles: Record<string, React.CSSProperties> = {
  root: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#F9FAFB",
    fontFamily: "'Inter', sans-serif",
    color: "#111827",
  },
  sidebar: {
    width: SIDEBAR_W,
    minWidth: SIDEBAR_W,
    backgroundColor: "#FFFFFF",
    borderRight: "1px solid #E5E7EB",
    display: "flex",
    flexDirection: "column",
    position: "fixed",
    top: 0,
    left: 0,
    bottom: 0,
    zIndex: 100,
    overflowY: "auto",
  },
  sidebarBrand: {
    padding: "28px 20px 20px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  brandLink: {
    textDecoration: "none",
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  brandLabel: {
    fontSize: "0.875rem",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#6B7280",
    fontWeight: 500,
  },
  brandName: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "1.5rem",
    fontWeight: 600,
    color: "#111827",
    lineHeight: 1,
  },
  adminBadge: {
    display: "inline-block",
    fontSize: "0.75rem",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#4B5563",
    backgroundColor: "#F3F4F6",
    border: "1px solid #E5E7EB",
    padding: "4px 8px",
    borderRadius: "4px",
    alignSelf: "flex-start",
    marginTop: 8,
    fontWeight: 500,
  },
  sidebarDivider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    margin: "0 20px",
  },
  nav: {
    padding: "16px 12px",
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "12px 14px",
    textDecoration: "none",
    fontSize: "0.9rem",
    fontWeight: 500,
    transition: "all 0.2s",
    borderRadius: "8px",
  },
  navIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  navLabel: {},
  sidebarFooter: {
    padding: "12px",
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  userRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 8px",
  },
  userAvatar: {
    width: 36,
    height: 36,
    backgroundColor: "#F3F4F6",
    border: "1px solid #E5E7EB",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1rem",
    color: "#4B5563",
    flexShrink: 0,
    fontWeight: 600,
  },
  userName: {
    fontSize: "0.875rem",
    color: "#111827",
    fontWeight: 600,
    margin: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  userEmail: {
    fontSize: "0.75rem",
    color: "#6B7280",
    margin: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  logoutBtn: {
    background: "none",
    border: "none",
    color: "#6B7280",
    cursor: "pointer",
    padding: 8,
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
    transition: "all 0.2s",
    flexShrink: 0,
  },
  main: {
    flex: 1,
    marginLeft: SIDEBAR_W,
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
    backgroundColor: "#F9FAFB",
  },
  topBar: {
    position: "sticky",
    top: 0,
    zIndex: 50,
    backgroundColor: "#FFFFFF",
    borderBottom: "1px solid #E5E7EB",
    display: "flex",
    alignItems: "center",
    gap: 16,
    padding: "16px 32px",
    minHeight: 70,
  },
  mobileMenuBtn: {
    background: "#F9FAFB",
    border: "1px solid #E5E7EB",
    color: "#111827",
    borderRadius: "6px",
    cursor: "pointer",
    padding: "8px",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    display: "none",
  },
  pageTitle: {
    flex: 1,
  },
  pageTitleText: {
    fontFamily: "'Inter', sans-serif",
    fontSize: "1.5rem",
    fontWeight: 600,
    color: "#111827",
    margin: 0,
  },
  pageTitleSub: {
    fontSize: "0.875rem",
    color: "#6B7280",
    margin: 0,
    marginTop: 4,
  },
  topBarActions: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    flexShrink: 0,
  },
  content: {
    flex: 1,
    padding: "32px",
    maxWidth: 1200,
    width: "100%",
  },
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 99,
  },
};
