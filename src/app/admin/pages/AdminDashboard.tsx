import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { AdminLayout } from "../AdminLayout";
import { Calendar, Film, User, ArrowUpRight, Clock, ChevronLeft, ChevronRight, BookOpen, Mail } from "lucide-react";
import { Link } from "react-router";

export function AdminDashboard() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const allShows = useQuery(api.shows.listAll) ?? [];
  const allMedia = useQuery(api.media.listAll) ?? [];
  const allBlogs = useQuery(api.blog.listAll) ?? [];
  const allMessages = useQuery(api.contact.list) ?? [];
  const artistInfo = useQuery(api.artist.getArtistInfo);

  const upcoming = allShows.filter((s) => !s.isPast).length;
  const past = allShows.filter((s) => s.isPast).length;
  const published = allMedia.filter((m) => m.isPublished).length;
  const draft = allMedia.filter((m) => !m.isPublished).length;
  const publishedBlogs = allBlogs.filter((b) => b.isPublished).length;
  const draftBlogs = allBlogs.filter((b) => !b.isPublished).length;

  const recentShows = [...allShows]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 5);

  const recentMessages = allMessages.slice(0, 5);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const startingDay = firstDay === 0 ? 6 : firstDay - 1; // Mon = 0, Sun = 6
    return { daysInMonth, startingDay, year, month };
  };

  const { daysInMonth, startingDay, year, month } = getDaysInMonth(currentDate);
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanksArray = Array.from({ length: startingDay }, (_, i) => i);

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
          label="Bài viết đã đăng"
          value={String(publishedBlogs)}
          sub={draftBlogs > 0 ? `${draftBlogs} bản nháp` : "Tất cả đã công bố"}
          icon={<BookOpen size={20} strokeWidth={1.5} />}
          link="/admin/blog"
          color="#8B5CF6"
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
        {/* Calendar View */}
        <div style={styles.panel}>
          <div style={styles.panelHeader}>
            <span style={styles.panelTitle}>Lịch diễn tháng {month + 1}/{year}</span>
            <div style={{ display: "flex", gap: 8 }}>
              <button 
                onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#6B7280", display: "flex", alignItems: "center", padding: 4 }}
              ><ChevronLeft size={18} /></button>
              <button 
                onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#6B7280", display: "flex", alignItems: "center", padding: 4 }}
              ><ChevronRight size={18} /></button>
            </div>
          </div>
          <div style={{ padding: "24px 20px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8, textAlign: "center", marginBottom: 12 }}>
              {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(d => (
                <div key={d} style={{ fontSize: "0.75rem", fontWeight: 600, color: "#6B7280" }}>{d}</div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8 }}>
              {blanksArray.map((_, i) => (
                <div key={`blank-${i}`} style={{ height: 40 }} />
              ))}
              {daysArray.map((day) => {
                const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const dayShows = allShows.filter(s => s.date === dateString);
                const hasEvent = dayShows.length > 0;
                const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();
                
                return (
                  <div key={day} style={{
                    height: 40,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 8,
                    fontSize: "0.875rem",
                    backgroundColor: hasEvent ? "#ECFDF5" : isToday ? "#F3F4F6" : "transparent",
                    color: hasEvent ? "#059669" : "#111827",
                    fontWeight: hasEvent || isToday ? 600 : 400,
                    border: hasEvent ? "1px solid #A7F3D0" : "1px solid transparent",
                    cursor: hasEvent ? "pointer" : "default"
                  }}
                  title={hasEvent ? dayShows.map(s => s.event).join('\n') : undefined}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 24, textAlign: "center", borderTop: "1px solid #F3F4F6", paddingTop: 16 }}>
              <Link to="/admin/shows" style={{ fontSize: "0.875rem", color: "#3B82F6", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4, fontWeight: 500 }}>
                Quản lý lịch diễn <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </div>

        {/* Recent messages */}
        <div style={styles.panel}>
          <div style={styles.panelHeader}>
            <span style={styles.panelTitle}>Tin nhắn liên hệ</span>
            <span style={{ fontSize: "0.75rem", color: "#6B7280" }}>Mới nhất</span>
          </div>
          {recentMessages.length === 0 ? (
            <Empty message="Chưa có tin nhắn nào" />
          ) : (
            recentMessages.map((msg) => (
              <div key={msg._id} style={styles.listRow}>
                <div style={{
                  width: 40, height: 40, borderRadius: "50%", backgroundColor: msg.isRead ? "#F3F4F6" : "#EFF6FF",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                }}>
                  <Mail size={18} color={msg.isRead ? "#9CA3AF" : "#3B82F6"} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                    <p style={{ ...styles.listTitle, fontWeight: msg.isRead ? 500 : 600 }}>{msg.name}</p>
                    <span style={{ fontSize: "0.7rem", color: "#9CA3AF" }}>{timeAgo(msg.createdAt)}</span>
                  </div>
                  <p style={styles.listMeta}>{msg.type} · {msg.email}</p>
                  <p style={{ fontSize: "0.8rem", color: "#4B5563", marginTop: 4, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical" }}>
                    {msg.message}
                  </p>
                </div>
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
            { label: "Viết blog mới", to: "/admin/blog", desc: "Đăng bài viết" },
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
