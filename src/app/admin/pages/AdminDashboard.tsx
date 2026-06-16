import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { AdminLayout } from "../AdminLayout";
import { Calendar, Film, User, ArrowUpRight, Clock } from "lucide-react";
import { Link } from "react-router";

export function AdminDashboard() {
  const allShows = useQuery(api.shows.listAll) ?? [];
  const allMedia = useQuery(api.media.listAll) ?? [];
  const artistInfo = useQuery(api.artist.getArtistInfo);

  const upcoming = allShows.filter((s) => !s.isPast).length;
  const past = allShows.filter((s) => s.isPast).length;
  const published = allMedia.filter((m) => m.isPublished).length;
  const draft = allMedia.filter((m) => !m.isPublished).length;

  const recentShows = [...allShows]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 5);

  const recentMedia = [...allMedia]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 5);

  return (
    <AdminLayout title="Tổng quan" subtitle={`Chào mừng trở lại, ${artistInfo?.name ?? "Admin"}`}>

      {/* Stats row */}
      <div style={styles.statsGrid}>
        <StatCard
          label="Buổi diễn sắp tới"
          value={String(upcoming)}
          sub={`${past} đã qua`}
          icon={<Calendar size={20} strokeWidth={1.5} />}
          link="/admin/shows"
          color="#10B981"
        />
        <StatCard
          label="Tác phẩm đã đăng"
          value={String(published)}
          sub={draft > 0 ? `${draft} bản nháp` : "Tất cả đã công bố"}
          icon={<Film size={20} strokeWidth={1.5} />}
          link="/admin/media"
          color="#3B82F6"
        />
        <StatCard
          label="Hồ sơ nghệ sĩ"
          value={artistInfo ? "Đã cập nhật" : "Chưa có"}
          sub={artistInfo ? `Cập nhật ${timeAgo(artistInfo.updatedAt)}` : "Nhấn để thiết lập"}
          icon={<User size={20} strokeWidth={1.5} />}
          link="/admin/artist"
          color="#F59E0B"
        />
      </div>

      {/* Recent activity */}
      <div style={styles.twoCol}>
        {/* Recent shows */}
        <div style={styles.panel}>
          <div style={styles.panelHeader}>
            <span style={styles.panelTitle}>Lịch diễn gần đây</span>
            <Link to="/admin/shows" style={styles.panelLink}>
              Xem tất cả <ArrowUpRight size={14} strokeWidth={1.5} />
            </Link>
          </div>
          {recentShows.length === 0 ? (
            <Empty message="Chưa có buổi diễn nào" />
          ) : (
            recentShows.map((show) => (
              <div key={show._id} style={styles.listRow}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={styles.listTitle}>{show.event}</p>
                  <p style={styles.listMeta}>{show.city}, {show.country} · {show.month} {show.day}, {show.year}</p>
                </div>
                <span style={{
                  ...styles.badge,
                  backgroundColor: show.isPast ? "#F3F4F6" : "#ECFDF5",
                  color: show.isPast ? "#6B7280" : "#059669",
                  border: `1px solid ${show.isPast ? "#E5E7EB" : "#A7F3D0"}`,
                }}>
                  {show.isPast ? "Đã qua" : "Sắp tới"}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Recent media */}
        <div style={styles.panel}>
          <div style={styles.panelHeader}>
            <span style={styles.panelTitle}>Tác phẩm gần đây</span>
            <Link to="/admin/media" style={styles.panelLink}>
              Xem tất cả <ArrowUpRight size={14} strokeWidth={1.5} />
            </Link>
          </div>
          {recentMedia.length === 0 ? (
            <Empty message="Chưa có tác phẩm nào" />
          ) : (
            recentMedia.map((item) => (
              <div key={item._id} style={styles.listRow}>
                {item.coverUrl && (
                  <img
                    src={item.coverUrl}
                    alt={item.title}
                    style={{ width: 48, height: 32, objectFit: "cover", flexShrink: 0, border: "1px solid #E5E7EB", borderRadius: 4 }}
                  />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={styles.listTitle}>{item.title}</p>
                  <p style={styles.listMeta}>{item.category} · {item.year}</p>
                </div>
                <span style={{
                  ...styles.badge,
                  backgroundColor: item.isPublished ? "#EFF6FF" : "#FEF3C7",
                  color: item.isPublished ? "#2563EB" : "#D97706",
                  border: `1px solid ${item.isPublished ? "#BFDBFE" : "#FDE68A"}`,
                }}>
                  {item.isPublished ? "Đã đăng" : "Bản nháp"}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick links */}
      <div style={styles.quickLinks}>
        <p style={styles.qlTitle}>Truy cập nhanh</p>
        <div style={styles.qlGrid}>
          {[
            { label: "Thêm buổi diễn", to: "/admin/shows", desc: "Tạo lịch diễn mới" },
            { label: "Thêm tác phẩm", to: "/admin/media", desc: "Upload media mới" },
            { label: "Sửa hồ sơ", to: "/admin/artist", desc: "Cập nhật thông tin" },
            { label: "Xem trang web", to: "/", desc: "Mở portfolio", external: true },
          ].map((item) => (
            <Link
              key={item.label}
              to={item.to}
              target={item.external ? "_blank" : undefined}
              style={styles.qlCard}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "#D1D5DB";
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#F9FAFB";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "#E5E7EB";
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#FFFFFF";
              }}
            >
              <span style={styles.qlLabel}>{item.label}</span>
              <span style={styles.qlDesc}>{item.desc}</span>
              <ArrowUpRight size={14} strokeWidth={1.5} color="#9CA3AF" style={{ marginTop: "auto", alignSelf: "flex-end" }} />
            </Link>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

function StatCard({ label, value, sub, icon, link, color }: any) {
  return (
    <Link to={link} style={styles.statCard}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.borderColor = "#D1D5DB";
        (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)";
        (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 4px 6px -1px rgba(0,0,0,0.05)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.borderColor = "#E5E7EB";
        (e.currentTarget as HTMLAnchorElement).style.transform = "none";
        (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 1px 2px 0 rgba(0,0,0,0.05)";
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div style={{ ...styles.statIcon, color, backgroundColor: `${color}15`, borderColor: `${color}30` }}>{icon}</div>
        <ArrowUpRight size={16} strokeWidth={1.5} color="#9CA3AF" />
      </div>
      <p style={styles.statValue}>{value}</p>
      <p style={styles.statLabel}>{label}</p>
      <p style={styles.statSub}>{sub}</p>
    </Link>
  );
}

function Empty({ message }: { message: string }) {
  return (
    <div style={{ padding: "40px 16px", textAlign: "center" }}>
      <p style={{ fontSize: "0.875rem", color: "#6B7280" }}>{message}</p>
    </div>
  );
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} phút trước`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} giờ trước`;
  return `${Math.floor(hours / 24)} ngày trước`;
}

const styles: Record<string, React.CSSProperties> = {
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20, marginBottom: 32 },
  statCard: { backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: "8px", padding: "24px", display: "flex", flexDirection: "column", textDecoration: "none", transition: "all 0.2s ease", cursor: "pointer", boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)" },
  statIcon: { width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "8px", border: "1px solid transparent" },
  statValue: { fontFamily: "'Inter', sans-serif", fontSize: "2rem", fontWeight: 600, color: "#111827", margin: "0 0 4px" },
  statLabel: { fontSize: "0.875rem", fontWeight: 500, color: "#374151", margin: "0 0 4px" },
  statSub: { fontSize: "0.75rem", color: "#6B7280", margin: 0 },
  twoCol: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20, marginBottom: 32 },
  panel: { backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: "8px", overflow: "hidden", boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)" },
  panelHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid #F3F4F6", backgroundColor: "#F9FAFB" },
  panelTitle: { fontSize: "0.875rem", fontWeight: 600, color: "#111827" },
  panelLink: { fontSize: "0.75rem", fontWeight: 500, color: "#6B7280", textDecoration: "none", display: "flex", alignItems: "center", gap: 4, transition: "color 0.2s" },
  listRow: { display: "flex", alignItems: "center", gap: 16, padding: "16px 20px", borderBottom: "1px solid #F3F4F6" },
  listTitle: { fontSize: "0.875rem", fontWeight: 500, color: "#111827", margin: "0 0 4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  listMeta: { fontSize: "0.75rem", color: "#6B7280", margin: 0 },
  badge: { fontSize: "0.75rem", fontWeight: 500, padding: "4px 8px", borderRadius: "4px", flexShrink: 0 },
  quickLinks: { borderTop: "1px solid #E5E7EB", paddingTop: 32 },
  qlTitle: { fontSize: "1rem", fontWeight: 600, color: "#111827", marginBottom: 16 },
  qlGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 },
  qlCard: { backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: "8px", padding: "20px", display: "flex", flexDirection: "column", gap: 8, textDecoration: "none", transition: "all 0.2s ease", minHeight: 110, boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)" },
  qlLabel: { fontSize: "0.875rem", fontWeight: 600, color: "#111827" },
  qlDesc: { fontSize: "0.75rem", color: "#6B7280" },
};
