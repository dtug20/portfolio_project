import { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

const services = [
  {
    number: "01",
    title: "Composition",
    shortDesc: "Original works for orchestral, chamber, and electronic forces.",
    fullDesc:
      "Bespoke compositions conceived from first principles — from intimate solo études to full orchestral canvases. Each score is shaped by a deep understanding of your brief, the acoustic context, and the cultural resonance you wish to create. Nguyen Minh's compositional voice bridges Vietnamese pentatonic tradition and late European modernism to produce music that is unmistakably particular, and universally felt.",
    deliverables: ["Fully notated score", "MIDI mockup / reference recording", "Performance notes", "Rights clearance support"],
    timeline: "8 – 24 weeks",
    tags: ["Orchestral", "Chamber", "Solo", "Electronic", "Film Score"],
  },
  {
    number: "02",
    title: "Live Performance",
    shortDesc: "Solo recitals, concertos, and bespoke ensemble programmes.",
    fullDesc:
      "From intimate salon recitals to headline festival slots, Nguyen Minh curates each performance programme with the precision of a dramatist. Engagements include solo piano recitals, concerto appearances with symphony orchestras, and collaborative projects with the Vietnam Contemporary Music Ensemble. All bookings include pre-concert programme notes, artist liaison, and technical rider.",
    deliverables: ["Custom programme design", "Programme notes for print", "Artist Q&A / Masterclass (optional)", "Technical rider"],
    timeline: "Minimum 12 weeks notice",
    tags: ["Solo Recital", "Concerto", "Festival", "Private Event", "Residency"],
  },
  {
    number: "03",
    title: "Music Production",
    shortDesc: "Full-service recording production — arrangement to final mix.",
    fullDesc:
      "End-to-end production for recording artists, film directors, and brands requiring original music of the highest standard. Services span creative arrangement, full orchestration, session direction (Hanoi, London, Singapore), and mix oversight at partner studios. Nguyen Minh has produced records released on Deutsche Grammophon, Sony Classical, and independent labels across Southeast Asia.",
    deliverables: ["Arrangement & orchestration", "Session direction", "Stem delivery", "Mastered final audio"],
    timeline: "4 – 16 weeks",
    tags: ["Recording", "Orchestration", "Arrangement", "Mixing", "Mastering"],
  },
  {
    number: "04",
    title: "Film & Media Scoring",
    shortDesc: "Original scores for film, television, documentary, and campaigns.",
    fullDesc:
      "Narrative-driven scores crafted to serve the story. From intimate documentary underscore to full orchestral feature film music, each project begins with a thorough review of picture, a creative brief session, and a detailed spotting process. Prior credits include Golden Kite Award-winning 'Homeland' and UNESCO international campaign films screened across 44 countries.",
    deliverables: ["Spotted cue list", "Recorded & mixed stems", "Deliverables to spec (M&E, stereo, 5.1)", "Sync licensing support"],
    timeline: "6 – 20 weeks",
    tags: ["Feature Film", "Documentary", "TV Series", "Campaign", "Trailers"],
  },
  {
    number: "05",
    title: "Masterclasses & Education",
    shortDesc: "Intensive programmes for conservatories, festivals, and institutions.",
    fullDesc:
      "Intensive workshops and masterclasses designed for advanced students, emerging professionals, and institutional education programmes. Topics include composition technique, cross-cultural musical language, career navigation for performing artists, and the business of new music. Delivered in person or via high-quality video link. Available in English and Vietnamese.",
    deliverables: ["Pre-session diagnostic", "Bespoke curriculum outline", "Post-session feedback document", "Follow-up consultation"],
    timeline: "2 – 8 weeks",
    tags: ["Masterclass", "Workshop", "Curriculum Design", "Residency", "Lecture"],
  },
];

const process = [
  { step: "01", title: "Initial Enquiry", desc: "Submit a brief via the contact form. We aim to respond within 48 hours with a short set of scoping questions." },
  { step: "02", title: "Creative Brief", desc: "A focused consultation — by video or in person — to align on vision, deliverables, timeline, and budget." },
  { step: "03", title: "Proposal & Agreement", desc: "A clear written proposal with scope, milestones, fees, and rights. No ambiguity, no surprises." },
  { step: "04", title: "Creation & Review", desc: "Iterative development with structured review checkpoints. You are part of the process, not an audience to it." },
  { step: "05", title: "Delivery", desc: "Final delivery to agreed specifications, with full handover documentation and ongoing support as required." },
];

export function ServicesPage() {
  const headerRef = useRef(null);
  const listRef = useRef(null);
  const processRef = useRef(null);
  const ctaRef = useRef(null);

  const headerInView = useInView(headerRef, { once: true });
  const listInView = useInView(listRef, { once: true, margin: "-60px" });
  const processInView = useInView(processRef, { once: true, margin: "-60px" });
  const ctaInView = useInView(ctaRef, { once: true, margin: "-60px" });

  const navigate = useNavigate();

  return (
    <div style={{ backgroundColor: "#11100F" }}>

      {/* ── HEADER ── */}
      <section
        ref={headerRef}
        className="relative w-full h-[65vh] min-h-[500px] flex flex-col justify-end overflow-hidden mb-0"
      >
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <ImageWithFallback
            src="/images/hero.jpg"
            alt="Services"
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
                Services &amp;
                <br />
                <em style={{ fontStyle: "italic", color: "#CDC1B3" }}>Expertise</em>
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
              key={service.number}
              service={service}
              index={i}
              inView={listInView}
              isLast={i === services.length - 1}
            />
          ))}
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section
        ref={processRef}
        style={{
          padding: "120px 0 140px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          backgroundColor: "#151412",
        }}
      >
        <div className="max-w-[1400px] mx-auto px-8 md:px-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={processInView ? { opacity: 1, y: 0 } : {}}
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
              — How It Works
            </p>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(2.5rem, 4.5vw, 3.8rem)",
                fontWeight: 400,
                lineHeight: 1.05,
                color: "#FFFDF8",
              }}
            >
              The{" "}
              <em style={{ fontStyle: "italic", color: "#CDC1B3", fontWeight: 300 }}>
                Process
              </em>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-px" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
            {process.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 16 }}
                animate={processInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: 0.1 + i * 0.08 }}
                style={{ backgroundColor: "#151412", padding: "40px 28px" }}
              >
                <span
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "2.2rem",
                    fontWeight: 300,
                    color: "#4E473F",
                    display: "block",
                    lineHeight: 1,
                    marginBottom: "1.5rem",
                  }}
                >
                  {step.step}
                </span>
                <h3
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.78rem",
                    fontWeight: 500,
                    color: "#E8E1D8",
                    letterSpacing: "0.04em",
                    marginBottom: "0.75rem",
                    lineHeight: 1.4,
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.72rem",
                    lineHeight: 1.75,
                    color: "#A09588",
                    fontWeight: 300,
                  }}
                >
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
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
            Have a project
            <br />
            <em style={{ fontStyle: "italic", color: "#CDC1B3" }}>in mind?</em>
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
            Whether you are commissioning a new work, seeking a headline
            performer, or looking for a collaborator who will elevate the
            ambition of your project — the conversation starts here.
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
              Get in Touch <ArrowRight size={13} strokeWidth={1.5} />
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
}: {
  service: (typeof services)[0];
  index: number;
  inView: boolean;
  isLast: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.1 + index * 0.09 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderTop: "1px solid rgba(255,255,255,0.08)",
        borderBottom: isLast ? "1px solid rgba(255,255,255,0.08)" : "none",
        transition: "background-color 0.3s",
        backgroundColor: hovered ? "rgba(255,255,255,0.02)" : "transparent",
      }}
    >
      {/* Main row — always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left"
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
          {/* Number */}
          <div className="col-span-1 hidden md:block">
            <span
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "0.9rem",
                fontWeight: 400,
                color: "#6E655B",
                letterSpacing: "0.06em",
              }}
            >
              {service.number}
            </span>
          </div>

          {/* Title + short desc */}
          <div className="col-span-11 md:col-span-7">
            <div className="flex items-baseline gap-4 mb-2">
              <span
                className="md:hidden"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "0.82rem",
                  color: "#6E655B",
                }}
              >
                {service.number}
              </span>
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
