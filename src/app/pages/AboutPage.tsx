import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useLanguage } from "../contexts/LanguageContext";

export function AboutPage() {
  const artistInfo = useQuery(api.artist.getArtistInfo);
  const fetchedMilestones = useQuery(api.artist.listMilestones);
  const currentMilestones = fetchedMilestones ?? [];
  const { t } = useLanguage();

  const headerRef = useRef(null);
  const storyRef = useRef(null);
  const timelineRef = useRef(null);

  const headerInView = useInView(headerRef, { once: true });
  const storyInView = useInView(storyRef, { once: true, margin: "-100px" });
  const timelineInView = useInView(timelineRef, { once: true, margin: "-60px" });

  return (
    <div style={{ backgroundColor: "#11100F" }}>
      {/* ── SECTION 1: Header ── */}
      <section
        ref={headerRef}
        className="relative w-full h-[65vh] min-h-[500px] flex flex-col justify-end overflow-hidden mb-0"
      >
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <ImageWithFallback
            src="/images/about.webp"
            alt="Biography"
            className="w-full h-full object-cover"
            style={{ objectPosition: "center" }}
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

        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-8 md:px-16 pb-12 md:pb-16">

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={headerInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.1 }}
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(4rem, 10vw, 9rem)",
                  fontWeight: 300,
                  lineHeight: 0.95,
                  color: "#FFFDF8",
                  letterSpacing: "-0.02em",
                }}
              >
                {t("page.about.title")}
                <em style={{ fontStyle: "italic" }}>{t("page.about.highlight")}</em>
              </motion.h1>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: Story (2-column) ── */}
      <section
        ref={storyRef}
        style={{ padding: "40px 0 120px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="max-w-[1400px] mx-auto px-8 md:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
            {/* Left: Portrait */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={storyInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="lg:col-span-4 relative"
            >
              <div
                className="relative overflow-hidden"
                style={{ aspectRatio: "3/4" }}
              >
                <ImageWithFallback
                  src="/images/biography.webp"
                  alt={artistInfo?.name ? `${artistInfo.name} — official portrait` : ""}
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(to top, rgba(10,10,10,0.5) 0%, transparent 60%)",
                  }}
                />
              </div>

              {/* Offset border decoration */}
              <div
                className="absolute -bottom-5 -right-5 w-full h-full pointer-events-none"
                style={{ border: "1px solid rgba(255,255,255,0.07)", zIndex: -1 }}
              />

              {/* Caption */}
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.62rem",
                  letterSpacing: "0.12em",
                  color: "#776D62",
                  marginTop: "1.25rem",
                  textTransform: "uppercase",
                }}
              >
                {artistInfo?.name || ""} · Hanoi, {new Date().getFullYear()}
              </p>
            </motion.div>

            {/* Right: Text */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={storyInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="lg:col-span-8 flex flex-col gap-8"
            >
              {artistInfo?.aboutHeadline && (
                <h3 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "2rem",
                  fontWeight: 400,
                  color: "#FFFDF8",
                  marginBottom: "0.5rem",
                  lineHeight: 1.2
                }}>
                  {artistInfo.aboutHeadline}
                </h3>
              )}

              {artistInfo?.fullBio && (
                artistInfo.fullBio.split('\n').filter(p => p.trim()).map((paragraph, idx) => (
                  <BioParagraph key={idx} text={paragraph} />
                ))
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: Timeline ── */}
      <section
        ref={timelineRef}
        style={{ padding: "100px 0 140px" }}
      >
        <div className="max-w-[1400px] mx-auto px-8 md:px-16">
          {/* Section label */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={timelineInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="mb-16"
          >
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.62rem",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "#8A7F72",
                marginBottom: "1.25rem",
              }}
            >
              {t("page.about.milestones")}
            </p>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(2.5rem, 5vw, 4rem)",
                fontWeight: 400,
                lineHeight: 1.05,
                color: "#FFFDF8",
              }}
            >
              {t("page.about.achievements")}{" "}
              <em style={{ fontStyle: "italic", color: "#CDC1B3", fontWeight: 300 }}>
                {t("page.about.achievementsHighlight")}
              </em>
            </h2>
          </motion.div>

          {/* Timeline */}
          <div className="relative mt-8">
            <div className="flex flex-col">
              {currentMilestones.map((item, i) => (
                <TimelineRow
                  key={item._id || item.year + i}
                  item={item}
                  index={i}
                  isLast={i === currentMilestones.length - 1}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function BioParagraph({ label, text }: { label?: string; text: string }) {
  return (
    <div>
      {label && (
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.58rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#776D62",
            marginBottom: "0.75rem",
          }}
        >
          {label}
        </p>
      )}
      <p
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "0.875rem",
          lineHeight: 1.9,
          color: "#BFB3A5",
          fontWeight: 300,
        }}
      >
        {text}
      </p>
    </div>
  );
}

function TimelineRow({
  item,
  index,
  isLast,
}: {
  item: any;
  index: number;
  isLast: boolean;
}) {
  return (
    <motion.div
      initial="initial"
      whileInView="animate"
      whileHover="hover"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.6, delay: index * 0.1, ease: "easeOut" } },
      }}
      className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-0 relative cursor-default"
      style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        paddingTop: 36,
        paddingBottom: 36,
      }}
    >
      {/* Subtle hover background highlight */}
      <motion.div
        variants={{
          hover: { opacity: 1 },
          initial: { opacity: 0 },
          animate: { opacity: 0 }
        }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 -mx-6 md:-mx-10 rounded-lg pointer-events-none"
        style={{ backgroundColor: "rgba(255,255,255,0.02)", zIndex: 0 }}
      />

      {/* Year */}
      <div className="md:col-span-3 lg:col-span-2 flex items-start pt-1 z-10">
        <motion.span
          variants={{ hover: { color: "#DED4C8" } }}
          transition={{ duration: 0.3 }}
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1.15rem",
            fontWeight: 400,
            color: "#8A7F72",
            letterSpacing: "0.04em",
            lineHeight: 1.2,
          }}
        >
          {item.year}
        </motion.span>
      </div>

      {/* Dot — desktop */}
      <div className="hidden md:flex md:col-span-1 justify-center pt-2.5 z-10">
        <motion.div
          variants={{
            hover: { scale: 1.8, backgroundColor: "rgba(255,253,248,0.15)", borderColor: "#FFFDF8" },
          }}
          transition={{ duration: 0.3 }}
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            border: "1px solid rgba(138,127,114,0.6)",
            backgroundColor: "transparent",
            flexShrink: 0,
          }}
        />
      </div>

      {/* Content */}
      <div className="md:col-span-8 lg:col-span-9 md:pl-6 lg:pl-10 z-10">
        <motion.h3
          variants={{ hover: { color: "#FFFFFF", x: 6 } }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1.45rem",
            fontWeight: 400,
            color: "#F0EAE3",
            lineHeight: 1.3,
            marginBottom: "0.6rem",
          }}
        >
          {item.title}
        </motion.h3>
        <motion.p
          variants={{ hover: { color: "#CDC1B3", x: 6 } }}
          transition={{ duration: 0.3, ease: "easeOut", delay: 0.03 }}
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.82rem",
            lineHeight: 1.85,
            color: "#8A7F72",
            fontWeight: 300,
            maxWidth: 680,
            margin: 0,
          }}
        >
          {item.description}
        </motion.p>
      </div>
    </motion.div>
  );
}
