import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "motion/react";
import { Link } from "react-router";
import { ArrowLeft, Play, ArrowUpRight } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

type Category = "All" | "Video" | "Projects" | "Campaigns";

const mediaItems = [
  {
    id: 1,
    category: "Video" as Category,
    title: "Echoes of the Red River",
    description: "Official music video — solo piano performance filmed at the Hanoi Opera House. Directed by Trần Anh Hùng.",
    image: "https://images.unsplash.com/photo-1558620013-a08999547a36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25jZXJ0JTIwbGl2ZSUyMHBlcmZvcm1hbmNlJTIwc3RhZ2UlMjBkYXJrJTIwZWxlZ2FudHxlbnwxfHx8fDE3ODE0MTc3ODR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    tag: "Official Video",
    hasPlay: true,
    year: "2024",
  },
  {
    id: 2,
    category: "Projects" as Category,
    title: "Between Silence — Studio Album",
    description: "Grammy-nominated studio album recorded with the London Symphony Orchestra. Released on Deutsche Grammophon, 2021.",
    image: "https://images.unsplash.com/photo-1674572392130-1d36223d9673?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMHN0dWRpbyUyMHJlY29yZGluZyUyMHBpYW5vJTIwcHJvZmVzc2lvbmFsJTIwZGFya3xlbnwxfHx8fDE3ODE0MTc3OTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    tag: "Studio Album",
    hasPlay: false,
    year: "2021",
  },
  {
    id: 3,
    category: "Video" as Category,
    title: "Monsoon Suite — Live at Carnegie Hall",
    description: "Full concert recording of the world-premiere performance at Carnegie Hall, New York. Mixed and mastered by Abbey Road Studios.",
    image: "https://images.unsplash.com/photo-1499364615650-ec38552f4f34?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxjb25jZXJ0JTIwbGl2ZSUyMHBlcmZvcm1hbmNlJTIwc3RhZ2UlMjBkYXJrJTIwZWxlZ2FudHxlbnwxfHx8fDE3ODE0MTc3ODR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    tag: "Live Recording",
    hasPlay: true,
    year: "2023",
  },
  {
    id: 4,
    category: "Campaigns" as Category,
    title: "UNESCO — Music Bridges Campaign",
    description: "Global cultural campaign video commissioned by UNESCO exploring music as a bridge between civilizations. Screened at 44 embassies worldwide.",
    image: "https://images.unsplash.com/photo-1551696785-927d4ac2d35b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmNoZXN0cmElMjBjbGFzc2ljYWwlMjBtdXNpYyUyMHBlcmZvcm1hbmNlJTIwZWxlZ2FudHxlbnwxfHx8fDE3ODE0NDk2NDh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    tag: "Campaign",
    hasPlay: true,
    year: "2023",
  },
  {
    id: 5,
    category: "Projects" as Category,
    title: "Homeland — Original Film Score",
    description: "Complete score for Đặng Nhật Minh's feature film 'Homeland'. Winner of Best Original Score, Golden Kite Awards 2022.",
    image: "https://images.unsplash.com/photo-1583795484071-3c453e3a7c71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxjb25jZXJ0JTIwbGl2ZSUyMHBlcmZvcm1hbmNlJTIwc3RhZ2UlMjBkYXJrJTIwZWxlZ2FudHxlbnwxfHx8fDE3ODE0MTc3ODR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    tag: "Film Score",
    hasPlay: false,
    year: "2022",
  },
  {
    id: 6,
    category: "Video" as Category,
    title: "The Space Between Notes",
    description: "Documentary short exploring Nguyen Minh's compositional process. Produced by VTV and the British Council. 22 minutes.",
    image: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxvcmNoZXN0cmElMjBjbGFzc2ljYWwlMjBtdXNpYyUyMHBlcmZvcm1hbmNlJTIwZWxlZ2FudHxlbnwxfHx8fDE3ODE0NDk2NDh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    tag: "Documentary",
    hasPlay: true,
    year: "2022",
  },
  {
    id: 7,
    category: "Campaigns" as Category,
    title: "Vietnam National Tourism — 'Sound of Home'",
    description: "Original composition and campaign soundtrack for the Vietnam National Administration of Tourism's international brand campaign.",
    image: "https://images.unsplash.com/photo-1519683109079-d5f539e1542f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxvcmNoZXN0cmElMjBjbGFzc2ljYWwlMjBtdXNpYyUyMHBlcmZvcm1hbmNlJTIwZWxlZ2FudHxlbnwxfHx8fDE3ODE0NDk2NDh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    tag: "Campaign",
    hasPlay: false,
    year: "2022",
  },
  {
    id: 8,
    category: "Projects" as Category,
    title: "Vietnam Contemporary Music Ensemble",
    description: "Debut album by the VCME, a chamber group Nguyen Minh founded in 2018. Eight world-premiere works by Southeast Asian composers.",
    image: "https://images.unsplash.com/photo-1488630228244-bcdf33562a43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxvcmNoZXN0cmElMjBjbGFzc2ljYWwlMjBtdXNpYyUyMHBlcmZvcm1hbmNlJTIwZWxlZ2FudHxlbnwxfHx8fDE3ODE0NDk2NDh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    tag: "Ensemble Album",
    hasPlay: false,
    year: "2020",
  },
  {
    id: 9,
    category: "Campaigns" as Category,
    title: "Rolex Arts Initiative — Residency Film",
    description: "Commissioned film documenting Nguyen Minh's mentorship partnership with emerging Vietnamese composer Linh Tran under the Rolex Arts Initiative.",
    image: "https://images.unsplash.com/photo-1515175192010-cf3250992719?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxjb25jZXJ0JTIwbGl2ZSUyMHBlcmZvcm1hbmNlJTIwc3RhZ2UlMjBkYXJrJTIwZWxlZ2FudHxlbnwxfHx8fDE3ODE0MTc3ODR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    tag: "Campaign Film",
    hasPlay: true,
    year: "2019",
  },
];

const filterTabs: Category[] = ["All", "Video", "Projects", "Campaigns"];

export function MediaPage() {
  const headerRef = useRef(null);
  const gridRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true });
  const gridInView = useInView(gridRef, { once: true, margin: "-60px" });

  const [activeFilter, setActiveFilter] = useState<Category>("All");

  const filtered =
    activeFilter === "All"
      ? mediaItems
      : mediaItems.filter((m) => m.category === activeFilter);

  return (
    <div style={{ backgroundColor: "#0A0A0A", paddingTop: "72px" }}>

      {/* ── PAGE HEADER ── */}
      <section
        ref={headerRef}
        style={{
          padding: "80px 0 100px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="max-w-[1400px] mx-auto px-8 md:px-16">
          {/* Back link */}
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={headerInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.4 }}
            className="mb-14"
          >
            <Link
              to="/"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.65rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#444444",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#AAAAAA"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#444444"; }}
            >
              <ArrowLeft size={12} strokeWidth={1.5} />
              Back to Home
            </Link>
          </motion.div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={headerInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.45, delay: 0.05 }}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.62rem",
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: "#444444",
                  marginBottom: "1.5rem",
                }}
              >
                04 / Media
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={headerInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.1 }}
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(4rem, 10vw, 9rem)",
                  fontWeight: 300,
                  lineHeight: 0.95,
                  color: "#FFFFFF",
                  letterSpacing: "-0.02em",
                }}
              >
                Selected
                <br />
                <em style={{ fontStyle: "italic", color: "#888888" }}>Works</em>
              </motion.h1>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={headerInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.8rem",
                lineHeight: 1.9,
                color: "#555555",
                maxWidth: 360,
                fontWeight: 300,
                paddingBottom: "0.5rem",
              }}
            >
              Videos, studio recordings, film scores, and campaign work
              spanning two decades of artistic output.
            </motion.p>
          </div>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={headerInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.9, delay: 0.45, ease: "easeOut" }}
            style={{
              height: 1,
              backgroundColor: "rgba(255,255,255,0.08)",
              marginTop: "5rem",
              transformOrigin: "left",
            }}
          />
        </div>
      </section>

      {/* ── FILTER TABS + GRID ── */}
      <section
        ref={gridRef}
        style={{ padding: "80px 0 140px" }}
      >
        <div className="max-w-[1400px] mx-auto px-8 md:px-16">

          {/* Filter row */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={gridInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-0 mb-16 overflow-x-auto"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
          >
            {filterTabs.map((tab) => (
              <FilterTab
                key={tab}
                label={tab}
                count={tab === "All" ? mediaItems.length : mediaItems.filter((m) => m.category === tab).length}
                active={activeFilter === tab}
                onClick={() => setActiveFilter(tab)}
              />
            ))}
          </motion.div>

          {/* Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16"
            >
              {filtered.map((item, i) => (
                <MediaCard key={item.id} item={item} index={i} inView={gridInView} />
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={gridInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex items-center justify-between mt-20 pt-12"
            style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
          >
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.68rem",
                color: "#333333",
                letterSpacing: "0.1em",
              }}
            >
              Showing {filtered.length} of {mediaItems.length} works
            </p>
            <a
              href="mailto:press@nguyenminh.asia"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.68rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#555555",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#FFFFFF"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#555555"; }}
            >
              Press & licensing inquiries <ArrowUpRight size={13} strokeWidth={1.5} />
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function FilterTab({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: "0.68rem",
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: active ? "#FFFFFF" : "#444444",
        background: "none",
        border: "none",
        borderBottom: active ? "1px solid #FFFFFF" : "1px solid transparent",
        padding: "16px 28px 15px",
        cursor: "pointer",
        transition: "color 0.2s",
        whiteSpace: "nowrap",
        marginBottom: -1,
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
      onMouseEnter={(e) => {
        if (!active) (e.currentTarget as HTMLButtonElement).style.color = "#AAAAAA";
      }}
      onMouseLeave={(e) => {
        if (!active) (e.currentTarget as HTMLButtonElement).style.color = "#444444";
      }}
    >
      {label}
      <span
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "0.55rem",
          color: active ? "#666666" : "#2A2A2A",
          letterSpacing: "0.08em",
          transition: "color 0.2s",
        }}
      >
        {count}
      </span>
    </button>
  );
}

function MediaCard({
  item,
  index,
  inView,
}: {
  item: (typeof mediaItems)[0];
  index: number;
  inView: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: 0.05 + index * 0.06 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ cursor: "pointer" }}
    >
      {/* Thumbnail — 16:9 */}
      <div
        className="relative overflow-hidden"
        style={{ aspectRatio: "16/9", marginBottom: "1.25rem", backgroundColor: "#1A1A1A" }}
      >
        <ImageWithFallback
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover"
          style={{
            filter: "brightness(0.75) grayscale(10%)",
            transform: hovered ? "scale(1.04)" : "scale(1)",
            transition: "transform 0.65s ease, filter 0.4s ease",
          }}
        />

        {/* Dark overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to top, rgba(10,10,10,0.5) 0%, transparent 60%)",
            opacity: hovered ? 1 : 0.5,
            transition: "opacity 0.4s",
          }}
        />

        {/* Play button */}
        {item.hasPlay && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ opacity: hovered ? 1 : 0, transition: "opacity 0.3s" }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                border: "1px solid rgba(255,255,255,0.4)",
                backgroundColor: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(6px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Play size={16} color="#FFFFFF" fill="#FFFFFF" style={{ marginLeft: 2 }} />
            </div>
          </div>
        )}

        {/* Category tag — top left */}
        <div className="absolute top-4 left-4">
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.52rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#888888",
              backgroundColor: "rgba(10,10,10,0.7)",
              backdropFilter: "blur(4px)",
              padding: "4px 9px",
              display: "inline-block",
            }}
          >
            {item.tag}
          </span>
        </div>

        {/* Year — top right */}
        <div className="absolute top-4 right-4">
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.52rem",
              letterSpacing: "0.14em",
              color: "#555555",
            }}
          >
            {item.year}
          </span>
        </div>
      </div>

      {/* Title */}
      <h3
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "0.9rem",
          fontWeight: 500,
          color: hovered ? "#FFFFFF" : "#DDDDDD",
          lineHeight: 1.35,
          marginBottom: "0.6rem",
          letterSpacing: "0.01em",
          transition: "color 0.25s",
        }}
      >
        {item.title}
      </h3>

      {/* Description */}
      <p
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "0.75rem",
          lineHeight: 1.7,
          color: "#555555",
          fontWeight: 300,
        }}
      >
        {item.description}
      </p>
    </motion.article>
  );
}
