import { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";

const services = [
  {
    number: "01",
    title: "Composition",
    description:
      "Original compositions for orchestral ensembles, chamber groups, solo instruments, and hybrid electronic formats. Each work crafted with narrative precision and cultural depth.",
    tags: ["Orchestral", "Chamber", "Electronic", "Film Score"],
  },
  {
    number: "02",
    title: "Live Performance",
    description:
      "Solo recitals, concerto performances, and collaborative ensemble appearances at concert halls, festivals, and private events worldwide. Bespoke programmes on request.",
    tags: ["Solo Recital", "Concerto", "Festival", "Private Events"],
  },
  {
    number: "03",
    title: "Music Production",
    description:
      "Full-service music production for recording artists, film productions, and commercial projects. Arrangement, orchestration, session direction, and final mix oversight.",
    tags: ["Recording", "Orchestration", "Arrangement", "Mix"],
  },
  {
    number: "04",
    title: "Masterclasses & Consulting",
    description:
      "Intensive masterclasses for advanced students and professional musicians. Creative consulting for arts organisations, cultural institutions, and music education programs.",
    tags: ["Masterclass", "Education", "Consulting", "Workshops"],
  },
];

export function Services() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="services"
      ref={ref}
      style={{ backgroundColor: "#0A0A0A", padding: "120px 0 140px" }}
    >
      <div className="max-w-[1400px] mx-auto px-8 md:px-16">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-20">
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
              — Services
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
              What I Offer
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.8rem",
              lineHeight: 1.8,
              color: "#555555",
              maxWidth: 340,
              fontWeight: 300,
            }}
          >
            A carefully curated range of musical services for discerning clients,
            institutions, and fellow artists.
          </motion.p>
        </div>

        <div>
          {services.map((service, i) => (
            <ServiceRow key={service.number} service={service} index={i} inView={inView} />
          ))}
        </div>

        {/* See more */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-14 flex items-center justify-between"
          style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: "2rem" }}
        >
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.7rem",
              color: "#333333",
              letterSpacing: "0.08em",
            }}
          >
            {services.length} services available
          </p>
          <Link
            to="/services"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.68rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#666666",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#FFFFFF"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#666666"; }}
          >
            See more <ArrowRight size={13} strokeWidth={1.5} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function ServiceRow({
  service,
  index,
  inView,
}: {
  service: (typeof services)[0];
  index: number;
  inView: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.15 + index * 0.1 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderTop: "1px solid rgba(255,255,255,0.07)",
        padding: "36px 0",
        transition: "background-color 0.3s",
        backgroundColor: hovered ? "rgba(255,255,255,0.02)" : "transparent",
        cursor: "default",
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">
        <div className="lg:col-span-1">
          <span
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "0.85rem",
              color: "#333333",
              fontWeight: 400,
            }}
          >
            {service.number}
          </span>
        </div>

        <div className="lg:col-span-3">
          <h3
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1.75rem",
              fontWeight: 400,
              color: hovered ? "#FFFFFF" : "#CCCCCC",
              transition: "color 0.3s",
              lineHeight: 1.2,
            }}
          >
            {service.title}
          </h3>
        </div>

        <div className="lg:col-span-6">
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.8rem",
              lineHeight: 1.85,
              color: "#666666",
              fontWeight: 300,
              marginBottom: "1.25rem",
            }}
          >
            {service.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {service.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.58rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#444444",
                  border: "1px solid rgba(255,255,255,0.07)",
                  padding: "4px 10px",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 flex justify-end items-start pt-1">
          <motion.div
            animate={{ x: hovered ? 4 : 0, opacity: hovered ? 1 : 0.25 }}
            transition={{ duration: 0.2 }}
          >
            <ArrowRight size={18} color="#FFFFFF" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
