import { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { Link } from "react-router";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Play, ArrowUpRight } from "lucide-react";

const mediaItems = [
  {
    id: 1,
    type: "Live",
    title: "Echoes of the Red River",
    venue: "Hanoi Opera House · 2024",
    image: "https://images.unsplash.com/photo-1558620013-a08999547a36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25jZXJ0JTIwbGl2ZSUyMHBlcmZvcm1hbmNlJTIwc3RhZ2UlMjBkYXJrJTIwZWxlZ2FudHxlbnwxfHx8fDE3ODE0MTc3ODR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    featured: true,
  },
  {
    id: 2,
    type: "Studio",
    title: "Between Silence",
    venue: "Album · 2023",
    image: "https://images.unsplash.com/photo-1674572392130-1d36223d9673?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMHN0dWRpbyUyMHJlY29yZGluZyUyMHBpYW5vJTIwcHJvZmVzc2lvbmFsJTIwZGFya3xlbnwxfHx8fDE3ODE0MTc3OTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    featured: false,
  },
  {
    id: 3,
    type: "Performance",
    title: "Monsoon Suite",
    venue: "Carnegie Hall · 2023",
    image: "https://images.unsplash.com/photo-1499364615650-ec38552f4f34?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxjb25jZXJ0JTIwbGl2ZSUyMHBlcmZvcm1hbmNlJTIwc3RhZ2UlMjBkYXJrJTIwZWxlZ2FudHxlbnwxfHx8fDE3ODE0MTc3ODR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    featured: false,
  },
  {
    id: 4,
    type: "Film Score",
    title: "Homeland",
    venue: "Feature Film · 2022",
    image: "https://images.unsplash.com/photo-1583795484071-3c453e3a7c71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxjb25jZXJ0JTIwbGl2ZSUyMHBlcmZvcm1hbmNlJTIwc3RhZ2UlMjBkYXJrJTIwZWxlZ2FudHxlbnwxfHx8fDE3ODE0MTc3ODR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    featured: false,
  },
];

const filterTabs = ["All", "Live", "Studio", "Performance", "Film Score"];

export function Media() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = activeFilter === "All"
    ? mediaItems
    : mediaItems.filter((m) => m.type === activeFilter);

  return (
    <section
      id="media"
      ref={ref}
      style={{ backgroundColor: "#111111", padding: "120px 0 140px" }}
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
                fontSize: "0.65rem",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "#555555",
                marginBottom: "1.25rem",
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
                color: "#FFFFFF",
              }}
            >
              Selected Works
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
                  color: activeFilter === tab ? "#FFFFFF" : "#555555",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (activeFilter !== tab) {
                    (e.currentTarget as HTMLButtonElement).style.color = "#AAAAAA";
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.15)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeFilter !== tab) {
                    (e.currentTarget as HTMLButtonElement).style.color = "#555555";
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.08)";
                  }
                }}
              >
                {tab}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-px" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
          {filtered.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.08 }}
              className={
                item.featured
                  ? "lg:col-span-8 group relative overflow-hidden cursor-pointer"
                  : "lg:col-span-4 group relative overflow-hidden cursor-pointer"
              }
              style={{ backgroundColor: "#111111" }}
            >
              <MediaCard item={item} featured={item.featured} />
            </motion.div>
          ))}
        </div>

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
              color: "#888888",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#FFFFFF"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#888888"; }}
          >
            View All Works <ArrowUpRight size={14} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function MediaCard({ item, featured }: { item: (typeof mediaItems)[0]; featured: boolean }) {
  return (
    <div className={`relative overflow-hidden ${featured ? "aspect-[16/10]" : "aspect-[4/5]"}`}>
      <ImageWithFallback
        src={item.image}
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
          <Play size={18} color="#FFFFFF" fill="#FFFFFF" style={{ marginLeft: 3 }} />
        </div>
      </div>

      {/* Info */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.6rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#888888",
            display: "block",
            marginBottom: 6,
          }}
        >
          {item.type}
        </span>
        <h3
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: featured ? "1.75rem" : "1.3rem",
            fontWeight: 400,
            color: "#FFFFFF",
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
            color: "#666666",
            letterSpacing: "0.05em",
          }}
        >
          {item.venue}
        </p>
      </div>
    </div>
  );
}
