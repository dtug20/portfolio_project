import { useState, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { AdminLayout } from "../AdminLayout";
import { Plus, Trash2, Image as ImageIcon, Upload, Loader2, GripVertical, Star } from "lucide-react";

type GalleryType = "Personal" | "Open Project" | "S.E Project" | "Bluemato";
const CATEGORIES: GalleryType[] = ["Personal", "Open Project", "S.E Project", "Bluemato"];

export function AdminGallery() {
  const allGalleries = useQuery(api.gallery.list) ?? [];
  const addImage = useMutation(api.gallery.add);
  const removeImage = useMutation(api.gallery.remove);
  const toggleFeature = useMutation(api.gallery.toggleFeatured);
  const generateUploadUrl = useMutation(api.gallery.generateUploadUrl);
  
  const [filter, setFilter] = useState<GalleryType>("Personal");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const displayed = allGalleries.filter((i) => i.type === filter).sort((a, b) => a.order - b.order);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setUploading(true);
    try {
      // Tải lên tuần tự từng file
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const uploadUrl = await generateUploadUrl();
        const res = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });
        const { storageId } = await res.json();
        
        await addImage({
          type: filter,
          storageId: storageId as Id<"_storage">,
        });
      }
    } catch (err) {
      console.error("Upload failed", err);
      alert("Lỗi khi tải ảnh lên. Vui lòng thử lại.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (id: Id<"galleries">) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá ảnh này?")) return;
    try {
      await removeImage({ id });
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleFeature = async (id: Id<"galleries">, isFeatured: boolean) => {
    try {
      await toggleFeature({ id, isFeatured: !isFeatured });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AdminLayout
      title="Thư viện ảnh sự kiện"
      subtitle="Quản lý ảnh theo 4 danh mục"
      actions={
        <div style={{ display: "flex", gap: 8 }}>
          <input 
            ref={fileInputRef}
            type="file" 
            accept="image/*" 
            multiple
            style={{ display: "none" }} 
            onChange={handleUpload}
          />
          <button 
            onClick={() => fileInputRef.current?.click()} 
            disabled={uploading} 
            style={styles.btnPrimary}
          >
            {uploading ? (
              <><Loader2 size={16} strokeWidth={2} className="animate-spin" /> Đang tải lên...</>
            ) : (
              <><Upload size={16} strokeWidth={2} /> Tải ảnh lên</>
            )}
          </button>
        </div>
      }
    >
      {/* Category filter */}
      <div style={styles.filterRow}>
        {CATEGORIES.map((cat) => (
          <button 
            key={cat} 
            onClick={() => setFilter(cat)}
            style={{ ...styles.filterBtn, ...(filter === cat ? styles.filterBtnActive : {}) }}
          >
            {cat}
            <span style={styles.filterCount}>
              {allGalleries.filter((i) => i.type === cat).length}
            </span>
          </button>
        ))}
      </div>

      {/* Grid */}
      {displayed.length === 0 ? (
        <div style={styles.emptyState}>
          <ImageIcon size={32} strokeWidth={1} color="#9CA3AF" />
          <p style={{ color: "#6B7280", fontSize: "0.875rem", marginTop: 16 }}>
            Chưa có ảnh nào trong mục {filter}.
          </p>
        </div>
      ) : (
        <div style={styles.grid}>
          {displayed.map((item) => (
            <div key={item._id} style={styles.card}>
              <div style={styles.cardCover}>
                {item.url ? (
                  <img src={item.url} alt="Gallery item" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={styles.cardCoverPlaceholder}><ImageIcon size={24} strokeWidth={1} color="#9CA3AF" /></div>
                )}
                
                {/* Feature badge */}
                {item.isFeatured && (
                  <div style={{ position: "absolute", top: 8, left: 8 }}>
                    <span style={styles.featureBadge}><Star size={10} fill="#FDE047" color="#FDE047" style={{ marginRight: 4 }}/> Nổi bật</span>
                  </div>
                )}
                
                {/* Actions overlay */}
                <div style={styles.overlayActions}>
                  <button 
                    onClick={() => handleToggleFeature(item._id, item.isFeatured ?? false)} 
                    style={{ ...styles.actionBtn, backgroundColor: item.isFeatured ? "#FEF9C3" : "rgba(0,0,0,0.5)", color: item.isFeatured ? "#CA8A04" : "#FFFFFF" }}
                    title={item.isFeatured ? "Đang nổi bật (Click để bỏ)" : "Bình thường (Click để nổi bật)"}
                  >
                    <Star size={16} strokeWidth={2} fill={item.isFeatured ? "#CA8A04" : "none"} />
                  </button>
                  <button 
                    onClick={() => handleDelete(item._id)} 
                    style={styles.actionBtn}
                    title="Xoá ảnh"
                  >
                    <Trash2 size={16} strokeWidth={2} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}

const styles: Record<string, React.CSSProperties> = {
  filterRow: { display: "flex", gap: 16, borderBottom: "1px solid #E5E7EB", marginBottom: 24, overflowX: "auto" },
  filterBtn: { background: "none", border: "none", borderBottom: "2px solid transparent", color: "#6B7280", cursor: "pointer", fontSize: "0.875rem", fontWeight: 500, padding: "12px 16px", marginBottom: -1, fontFamily: "'Inter', sans-serif", transition: "color 0.2s", display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap" },
  filterBtnActive: { color: "#111827", borderBottom: "2px solid #111827" },
  filterCount: { fontSize: "0.75rem", color: "#4B5563", backgroundColor: "#F3F4F6", padding: "2px 8px", borderRadius: "10px" },
  btnPrimary: { display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "'Inter', sans-serif", fontSize: "0.875rem", fontWeight: 500, color: "#FFFFFF", backgroundColor: "#111827", border: "1px solid #111827", borderRadius: "6px", padding: "10px 20px", cursor: "pointer", transition: "background-color 0.2s" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 },
  card: { backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: "8px", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 1px 3px 0 rgba(0,0,0,0.1)", position: "relative" },
  cardCover: { position: "relative", aspectRatio: "1/1", overflow: "hidden", backgroundColor: "#F3F4F6" },
  cardCoverPlaceholder: { width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" },
  overlayActions: { position: "absolute", top: 8, right: 8, display: "flex", gap: 8 },
  actionBtn: { background: "rgba(0,0,0,0.5)", border: "none", color: "#FFFFFF", cursor: "pointer", padding: "8px", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", transition: "background-color 0.2s" },
  featureBadge: { fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", backgroundColor: "rgba(0,0,0,0.7)", color: "#FFF", padding: "4px 10px", borderRadius: "4px", display: "flex", alignItems: "center" },
  emptyState: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 240, border: "1px dashed #D1D5DB", borderRadius: "8px", backgroundColor: "#F9FAFB" },
};
