import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "motion/react";
import { Link, useNavigate, useLocation } from "react-router";
import { ArrowLeft, ArrowRight, ArrowUpRight, ChevronDown, CheckCircle2 } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Doc } from "../../../convex/_generated/dataModel";
import { useLanguage } from "../contexts/LanguageContext";

type ServiceType = Doc<"services">;

export function ServicesPage() {
  const headerRef = useRef(null);
  const listRef = useRef(null);
  const ctaRef = useRef(null);

  const headerInView = useInView(headerRef, { once: true });
  const listInView = useInView(listRef, { once: true, margin: "-60px" });
  const ctaInView = useInView(ctaRef, { once: true, margin: "-60px" });

  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const services = useQuery(api.services.listPublished) ?? [];
  const expandServiceId = location.state?.expandService;

  return (
    <div style={{ backgroundColor: "#11100F" }}>

      {/* ── HEADER ── */}
      <section
        ref={headerRef}
        className="relative w-full h-[65vh] min-h-[500px] flex flex-col justify-end overflow-hidden mb-16 md:mb-24"
      >
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <ImageWithFallback
            src="/images/engineer.webp"
            alt="Services"
            className="w-full h-full object-cover"
            style={{ 
              objectPosition: "center 50%", 
              transform: "scale(1.08)",
              maskImage: "linear-gradient(to bottom, black 0%, black 60%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 60%, transparent 100%)",
            }}
          />
          {/* Soft gradient overlays for readability without obscuring the image */}
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to right, rgba(17,16,15,0.95) 0%, rgba(17,16,15,0.6) 50%, rgba(17,16,15,0.15) 100%)",
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(to top, #11100F 0%, rgba(17,16,15,0.8) 15%, transparent 50%)",
            }}
          />
        </div>

        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-8 md:px-16 pb-12 md:pb-16">
          {/* Back */}


          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={headerInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.1 }}
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(3.5rem, 9vw, 8.5rem)",
                  fontWeight: 300,
                  lineHeight: 0.95,
                  color: "#FFFDF8",
                  letterSpacing: "-0.02em",
                }}
              >
                {t("page.services.title")}
                <br />
                <em style={{ fontStyle: "italic", color: "#CDC1B3" }}>{t("page.services.highlight")}</em>
              </motion.h1>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICE LIST ── */}
      <section
        ref={listRef}
        style={{ padding: "0" }}
      >
        <div className="max-w-[1400px] mx-auto px-8 md:px-16">
          {services.map((service, i) => (
            <ServiceBlock
              key={service._id}
              service={service}
              index={i}
              inView={listInView}
              isLast={i === services.length - 1}
              initiallyExpanded={expandServiceId === service._id}
            />
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        ref={ctaRef}
        style={{
          padding: "140px 0 160px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          textAlign: "center",
        }}
      >
        <div className="max-w-[1400px] mx-auto px-8 md:px-16 flex flex-col items-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45 }}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.62rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#8A7F72",
              marginBottom: "2rem",
            }}
          >
            — Let's Collaborate
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(3rem, 7vw, 7rem)",
              fontWeight: 300,
              lineHeight: 1.0,
              color: "#FFFDF8",
              letterSpacing: "-0.01em",
              marginBottom: "2rem",
            }}
          >
            {t("page.services.cta.title")}
            <br />
            <em style={{ fontStyle: "italic", color: "#CDC1B3" }}>{t("page.services.cta.titleHighlight")}</em>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={ctaInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.25 }}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.85rem",
              lineHeight: 1.85,
              color: "#A09588",
              fontWeight: 300,
              maxWidth: 500,
              marginBottom: "3.5rem",
            }}
          >
            {t("page.services.cta.desc")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.35 }}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <button
              onClick={() => navigate("/", { state: { scrollTo: "contact" } })}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.68rem",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "#11100F",
                backgroundColor: "#FFFDF8",
                border: "1px solid #FFFDF8",
                padding: "16px 44px",
                cursor: "pointer",
                transition: "all 0.25s ease",
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
              }}
              onMouseEnter={(e) => {
                const btn = e.currentTarget as HTMLButtonElement;
                btn.style.backgroundColor = "transparent";
                btn.style.color = "#FFFDF8";
              }}
              onMouseLeave={(e) => {
                const btn = e.currentTarget as HTMLButtonElement;
                btn.style.backgroundColor = "#FFFDF8";
                btn.style.color = "#11100F";
              }}
            >
              {t("page.services.cta.button")} <ArrowRight size={13} strokeWidth={1.5} />
            </button>


          </motion.div>
        </div>
      </section>
    </div>
  );
}

function ServiceBlock({
  service,
  index,
  inView,
  isLast,
  initiallyExpanded = false,
}: {
  service: ServiceType;
  index: number;
  inView: boolean;
  isLast: boolean;
  initiallyExpanded?: boolean;
}) {
  const [expanded, setExpanded] = useState(initiallyExpanded);
  const [hovered, setHovered] = useState(false);
  const blockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initiallyExpanded && blockRef.current) {
      setTimeout(() => {
        blockRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 300);
    }
  }, [initiallyExpanded]);

  return (
    <motion.div
      ref={blockRef}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.1 + index * 0.09 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative overflow-hidden group"
      style={{
        borderTop: "1px solid rgba(255,255,255,0.08)",
        borderBottom: isLast ? "1px solid rgba(255,255,255,0.08)" : "none",
        transition: "background-color 0.3s",
        backgroundColor: hovered ? "rgba(255,255,255,0.02)" : "transparent",
      }}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-700 ease-out"
        style={{
          opacity: expanded ? 0.25 : (hovered ? 0.3 : 0.15),
          zIndex: 0,
        }}
      >
        <ImageWithFallback
          src={service.imageUrl as string}
          alt={service.title}
          className="w-full h-full object-cover"
          style={{
            objectPosition: service.imagePosition || "center",
            maskImage: "linear-gradient(to right, transparent 0%, black 25%, black 75%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 25%, black 75%, transparent 100%)",
          }}
        />
      </div>

      {/* Main row — always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left relative z-10"
        style={{
          padding: "40px 0",
          background: "none",
          border: "none",
          cursor: "pointer",
          display: "block",
          width: "100%",
        }}
      >
        <div className="grid grid-cols-12 gap-6 items-center">
          {/* Title + short desc */}
          <div className="col-span-11 md:col-span-8">
            <div className="flex items-baseline gap-4 mb-2">
              <h3
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
                  fontWeight: 400,
                  color: hovered ? "#FFFDF8" : "#F0EAE3",
                  transition: "color 0.3s",
                  lineHeight: 1.1,
                }}
              >
                {service.title}
              </h3>
            </div>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.78rem",
                lineHeight: 1.65,
                color: "#A09588",
                fontWeight: 300,
                maxWidth: 480,
              }}
            >
              {service.shortDesc}
            </p>
          </div>

          {/* Tags — desktop */}
          <div className="col-span-3 hidden md:flex flex-wrap gap-2 justify-start">
            {service.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.55rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#776D62",
                  border: "1px solid rgba(255,255,255,0.07)",
                  padding: "4px 9px",
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Arrow */}
          <div className="col-span-1 flex justify-end">
            <motion.div
              animate={{ rotate: expanded ? 90 : 0 }}
              transition={{ duration: 0.25 }}
            >
              <ArrowRight
                size={18}
                strokeWidth={1.5}
                color={hovered ? "#FFFDF8" : "#8A7F72"}
                style={{ transition: "color 0.25s" }}
              />
            </motion.div>
          </div>
        </div>
      </button>

      {/* Expanded detail */}
      <motion.div
        initial={false}
        animate={{
          height: expanded ? "auto" : 0,
          opacity: expanded ? 1 : 0,
        }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="relative z-10"
        style={{ overflow: "hidden" }}
      >
        <div
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16"
          style={{
            padding: "0 0 48px",
            borderTop: "1px solid rgba(255,255,255,0.05)",
            paddingTop: 32,
          }}
        >
          {/* Full description */}
          <div className="lg:col-span-7 lg:col-start-2">
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.82rem",
                lineHeight: 1.9,
                color: "#BFB3A5",
                fontWeight: 300,
                marginBottom: "2rem",
              }}
            >
              {service.fullDesc}
            </p>

            {/* All tags */}
            <div className="flex flex-wrap gap-2">
              {service.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.58rem",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "#8A7F72",
                    border: "1px solid rgba(255,255,255,0.07)",
                    padding: "5px 11px",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Deliverables + timeline */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.58rem",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "#6E655B",
                  marginBottom: "0.75rem",
                }}
              >
                What's Included
              </p>
              <ul className="flex flex-col gap-2">
                {service.deliverables.map((d) => (
                  <li
                    key={d}
                    className="flex items-start gap-2"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.72rem",
                      color: "#B0A496",
                      fontWeight: 300,
                      lineHeight: 1.5,
                    }}
                  >
                    <span style={{ color: "#6E655B", marginTop: 2, flexShrink: 0 }}>—</span>
                    {d}
                  </li>
                ))}
              </ul>
            </div>

            <div
              style={{
                borderTop: "1px solid rgba(255,255,255,0.07)",
                paddingTop: "1.25rem",
              }}
            >
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.58rem",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "#6E655B",
                  marginBottom: "0.5rem",
                }}
              >
                Typical Timeline
              </p>
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "1.1rem",
                  fontWeight: 400,
                  color: "#DED4C8",
                }}
              >
                {service.timeline}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
