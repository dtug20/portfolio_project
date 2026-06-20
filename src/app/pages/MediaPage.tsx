import { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { Link } from "react-router";
import { ArrowLeft, Play } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

// Fallback data
const FALLBACK_MEDIA = [
  { _id: "1", category: "Video", title: "Echoes of the Red River", venue: "Hanoi Opera House · 2024", coverUrl: "https://images.unsplash.com/photo-1558620013-a08999547a36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25jZXJ0JTIwbGl2ZSUyMHBlcmZvcm1hbmNlJTIwc3RhZ2UlMjBkYXJrJTIwZWxlZ2FudHxlbnwxfHx8fDE3ODE0MTc3ODR8MA&ixlib=rb-4.1.0&q=80&w=1080", hasPlay: true },
  { _id: "2", category: "Projects", title: "Between Silence", venue: "Album · 2023", coverUrl: "https://images.unsplash.com/photo-1674572392130-1d36223d9673?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMHN0dWRpbyUyMHJlY29yZGluZyUyMHBpYW5vJTIwcHJvZmVzc2lvbmFsJTIwZGFya3xlbnwxfHx8fDE3ODE0MTc3OTB8MA&ixlib=rb-4.1.0&q=80&w=1080", hasPlay: false },
  { _id: "3", category: "Video", title: "Monsoon Suite", venue: "Carnegie Hall · 2023", coverUrl: "https://images.unsplash.com/photo-1499364615650-ec38552f4f34?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxjb25jZXJ0JTIwbGl2ZSUyMHBlcmZvcm1hbmNlJTIwc3RhZ2UlMjBkYXJrJTIwZWxlZ2FudHxlbnwxfHx8fDE3ODE0MTc3ODR8MA&ixlib=rb-4.1.0&q=80&w=1080", hasPlay: true },
  { _id: "4", category: "Campaigns", title: "Homeland", venue: "Feature Film · 2022", coverUrl: "https://images.unsplash.com/photo-1583795484071-3c453e3a7c71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxjb25jZXJ0JTIwbGl2ZSUyMHBlcmZvcm1hbmNlJTIwc3RhZ2UlMjBkYXJrJTIwZWxlZ2FudHxlbnwxfHx8fDE3ODE0MTc3ODR8MA&ixlib=rb-4.1.0&q=80&w=1080", hasPlay: false },
];

export function MediaPage() {
  const headerRef = useRef(null);
  const gridRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true });
  const gridInView = useInView(gridRef, { once: true, margin: "-40px" });

  const [activeTab, setActiveTab] = useState<string>("All");

  const dbMedia = useQuery(api.media.listPublished);
  const mediaItems = dbMedia && dbMedia.length > 0 ? dbMedia : FALLBACK_MEDIA;

  const tabs = ["All", "Video", "Projects", "Campaigns"];

  const filteredMedia = activeTab === "All"
    ? mediaItems
    : mediaItems.filter((m: any) => m.category === activeTab);

  return (
    <div style={{ backgroundColor: "#11100F", minHeight: "100vh" }}>
      {/* ── HERO HEADER ── */}
      <section
        ref={headerRef}
        className="relative w-full flex items-start overflow-hidden mb-0"
      >
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <ImageWithFallback
            src="/images/on_stage.jpeg"
            alt="Selected Works"
            className="w-full h-full object-cover"
            style={{ objectPosition: "center 40%" }}
          />
          {/* Soft gradient overlays for readability without obscuring the image */}
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to right, rgba(17,16,15,0.95) 0%, rgba(17,16,15,0.6) 50%, rgba(17,16,15,0.15) 100%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to top, rgba(17,16,15,1) 0%, rgba(17,16,15,0.5) 30%, rgba(17,16,15,0) 60%)",
            }}
          />
        </div>

        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-8 md:px-16 pt-32 pb-[120px] md:pb-[180px]">
          <motion.div initial={{ opacity: 0, x: -8 }} animate={headerInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.4 }} className="mb-14">
            <Link to="/" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#8A7F72", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, transition: "color 0.2s" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#DED4C8"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#8A7F72"; }}>
              <ArrowLeft size={12} strokeWidth={1.5} /> Back to Home
            </Link>
          </motion.div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <motion.h1 initial={{ opacity: 0, y: 28 }} animate={headerInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.85, delay: 0.1 }} style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(4rem, 10vw, 8rem)", fontWeight: 300, lineHeight: 0.93, color: "#FFFDF8", letterSpacing: "-0.025em" }}>
                Selected <em style={{ fontStyle: "italic", color: "#CDC1B3" }}>Works</em>
              </motion.h1>
            </div>
          </div>
        </div>
      </section>

      {/* ── MEDIA GRID ── */}
      <section ref={gridRef} style={{ padding: "0 0 120px" }}>
        <div className="max-w-[1400px] mx-auto px-8 md:px-16">

          {/* Tabs */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={gridInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.45 }} className="flex items-center gap-0 mb-12" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            {tabs.map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", letterSpacing: "0.16em", textTransform: "uppercase", color: activeTab === tab ? "#FFFDF8" : "#8A7F72", background: "none", border: "none", borderBottom: activeTab === tab ? "1px solid #FFFDF8" : "1px solid transparent", padding: "18px 32px 17px", cursor: "pointer", marginBottom: -1, transition: "color 0.2s", display: "flex", alignItems: "center", gap: 10 }}
                onMouseEnter={(e) => { if (activeTab !== tab) (e.currentTarget as HTMLButtonElement).style.color = "#DED4C8"; }}
                onMouseLeave={(e) => { if (activeTab !== tab) (e.currentTarget as HTMLButtonElement).style.color = "#8A7F72"; }}>
                {tab}
              </button>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMedia.map((item: any, i: number) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={gridInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 + i * 0.08 }}
                className="group relative overflow-hidden cursor-pointer bg-[#171513]"
              >
                <div className="relative overflow-hidden aspect-[4/5]">
                  <ImageWithFallback
                    src={item.coverUrl}
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
                  <div className="absolute bottom-0 left-0 right-0 p-6">
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
                      {item.category}
                    </span>
                    <h3
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: "1.5rem",
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
              </motion.div>
            ))}
          </div>

        </div>
      </section>
    </div>
  );
}
