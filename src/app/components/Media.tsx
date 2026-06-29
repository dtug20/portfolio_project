import { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { Link, useNavigate } from "react-router";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Play, ArrowUpRight, ArrowLeft } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { ShowGalleryRow } from "../pages/MediaPage";

const filterTabs = ["Works", "Pictures", "Blog"];

export function Media() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [activeFilter, setActiveFilter] = useState("Works");
  const navigate = useNavigate();

  const dbMedia = useQuery(api.media.listFeatured);
  const mediaItems = dbMedia || [];

  const dbGallery = useQuery(api.gallery.listFeatured);
  const galleryItems = dbGallery || [];

  const dbBlog = useQuery(api.blog.listFeatured);
  const blogItems = dbBlog || [];

  // Use all featured gallery items directly
  const galleryImages = galleryItems.map(g => g.url).filter(Boolean);

  const renderWorks = () => {
    if (mediaItems.length === 0) {
      return (
        <div className="py-16 text-center text-[#8A7F72] font-['Inter'] text-sm tracking-widest uppercase">
          No featured works yet.
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-px" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
        {mediaItems.map((item: any, i: number) => (
          <motion.div
            key={item._id}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 + i * 0.08 }}
            className={
              i === 0
                ? "lg:col-span-8 group relative overflow-hidden cursor-pointer"
                : "lg:col-span-4 group relative overflow-hidden cursor-pointer"
            }
            style={{ backgroundColor: "#171513" }}
          >
            <MediaCard item={item} featured={i === 0} />
          </motion.div>
        ))}
      </div>
    );
  };

  const renderPictures = () => {
    if (galleryImages.length === 0) {
      return (
        <div className="py-16 text-center text-[#8A7F72] font-['Inter'] text-sm tracking-widest uppercase">
          No featured pictures yet.
        </div>
      );
    }
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="w-full"
      >
        <ShowGalleryRow title="Featured Pictures" allImages={galleryImages} setLightbox={() => {}} />
      </motion.div>
    );
  };

  const renderBlog = () => {
    if (blogItems.length === 0) {
      return (
        <div className="py-16 text-center text-[#8A7F72] font-['Inter'] text-sm tracking-widest uppercase">
          No featured blog posts yet.
        </div>
      );
    }
    return (
      <div className="max-w-4xl mx-auto flex flex-col gap-12">
        {blogItems.map((post: any, i: number) => (
          <motion.div
            key={post._id}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 + i * 0.1 }}
            onClick={() => navigate(`/blog/${post._id}`)}
            className="group flex flex-col md:flex-row gap-8 md:gap-12 cursor-pointer border-b border-white/10 pb-12 last:border-0"
          >
            {post.coverUrl && (
              <div className="w-full md:w-2/5 aspect-[4/3] overflow-hidden">
                <ImageWithFallback
                  src={post.coverUrl}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  style={{ filter: "brightness(0.8) contrast(1.1)" }}
                />
              </div>
            )}
            <div className="w-full md:w-3/5 flex flex-col justify-center">
              <span className="font-['Inter'] text-[0.65rem] tracking-[0.2em] uppercase text-[#8A7F72] mb-4">
                {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Draft'}
              </span>
              <h3 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl font-light text-[#FFFDF8] mb-4 group-hover:text-[#DED4C8] transition-colors">
                {post.title}
              </h3>
              <p className="font-['Inter'] text-sm text-[#B0A496] leading-relaxed mb-6 line-clamp-3">
                {post.excerpt}
              </p>
              <span className="font-['Inter'] text-[0.7rem] tracking-widest uppercase text-[#CDC1B3] flex items-center gap-2">
                Read More <ArrowLeft size={12} className="rotate-180" />
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <section
      id="media"
      ref={ref}
      style={{ backgroundColor: "#171513", padding: "120px 0 140px", overflowX: "hidden" }}
    >
      <div className="max-w-[1400px] mx-auto px-8 md:px-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "1rem",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "#A09588",
                marginBottom: "4rem",
              }}
            >
              — Media
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(2.5rem, 4.5vw, 4rem)",
                fontWeight: 400,
                lineHeight: 1.1,
                color: "#FFFDF8",
              }}
            >
              Featured Highlights
            </motion.h2>
          </div>

          {/* Filter tabs */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center gap-1 flex-wrap"
          >
            {filterTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.65rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  padding: "7px 16px",
                  background: activeFilter === tab ? "rgba(255,255,255,0.1)" : "transparent",
                  border: "1px solid",
                  borderColor: activeFilter === tab ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.08)",
                  color: activeFilter === tab ? "#FFFDF8" : "#A09588",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (activeFilter !== tab) {
                    (e.currentTarget as HTMLButtonElement).style.color = "#DED4C8";
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.15)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeFilter !== tab) {
                    (e.currentTarget as HTMLButtonElement).style.color = "#A09588";
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.08)";
                  }
                }}
              >
                {tab}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Content */}
        {activeFilter === "Works" && renderWorks()}
        {activeFilter === "Pictures" && renderPictures()}
        {activeFilter === "Blog" && renderBlog()}

        {/* View All */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex justify-center mt-16"
        >
          <Link
            to="/media"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.7rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#CDC1B3",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#FFFDF8"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#CDC1B3"; }}
          >
            View All Media <ArrowUpRight size={14} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function MediaCard({ item, featured }: { item: any; featured: boolean }) {
  return (
    <div className={`relative overflow-hidden ${featured ? "aspect-[16/10]" : "aspect-[4/5]"}`}>
      <ImageWithFallback
        src={item.coverUrl || item.image}
        alt={item.title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        style={{ filter: "brightness(0.6) grayscale(15%)" }}
      />
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          background: "linear-gradient(to top, rgba(10,10,10,0.9) 0%, rgba(10,10,10,0.1) 60%)",
        }}
      />

      {/* Play button */}
      {item.hasPlay && (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(8px)",
            }}
          >
            <Play size={18} color="#FFFDF8" fill="#FFFDF8" style={{ marginLeft: 3 }} />
          </div>
        </div>
      )}

      {/* Info */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.6rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#CDC1B3",
            display: "block",
            marginBottom: 6,
          }}
        >
          {item.category || item.type}
        </span>
        <h3
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: featured ? "1.75rem" : "1.3rem",
            fontWeight: 400,
            color: "#FFFDF8",
            lineHeight: 1.2,
            marginBottom: 4,
          }}
        >
          {item.title}
        </h3>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.7rem",
            color: "#B0A496",
            letterSpacing: "0.05em",
          }}
        >
          {item.venue || item.tag} {item.year ? `· ${item.year}` : ''}
        </p>
      </div>
    </div>
  );
}
