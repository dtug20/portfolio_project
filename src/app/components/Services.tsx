import { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { Link, useNavigate } from "react-router";
import { ArrowRight } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Doc } from "../../../convex/_generated/dataModel";
import { useLanguage } from "../contexts/LanguageContext";

type ServiceType = Doc<"services">;

export function Services() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const services = useQuery(api.services.listFeatured) ?? [];
  const { t } = useLanguage();

  return (
    <section
      id="services"
      ref={ref}
      style={{ backgroundColor: "#11100F", padding: "120px 0 140px" }}
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
                fontSize: "1rem",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "#A09588",
                marginBottom: "4rem",
              }}
            >
              — {t("services.label")}
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
              {t("services.offer")}
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
              color: "#A09588",
              maxWidth: 340,
              fontWeight: 300,
            }}
          >
            {t("services.desc")}
          </motion.p>
        </div>

        <div>
          {services.map((service, i) => (
            <ServiceRow key={service.title} service={service} index={i} inView={inView} />
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
              color: "#6E655B",
              letterSpacing: "0.08em",
            }}
          >
            {services.length} {t("services.count")}
          </p>
          <Link
            to="/services"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.68rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#B0A496",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#FFFDF8"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#B0A496"; }}
          >
            {t("general.seeMore")} <ArrowRight size={13} strokeWidth={1.5} />
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
  service: ServiceType;
  index: number;
  inView: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.15 + index * 0.1 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate("/services", { state: { expandService: service._id } })}
      className="relative overflow-hidden group"
      style={{
        borderTop: "1px solid rgba(255,255,255,0.07)",
        padding: "36px 0",
        transition: "background-color 0.3s",
        backgroundColor: hovered ? "rgba(255,255,255,0.02)" : "transparent",
        cursor: "pointer",
      }}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-700 ease-out"
        style={{
          opacity: hovered ? 0.3 : 0.15,
          zIndex: 0,
        }}
      >
        <ImageWithFallback
          src={service.imageUrl as string}
          alt={service.title}
          className="w-full h-full object-cover scale-100 group-hover:scale-[1.02] transition-transform duration-1000"
          style={{
            objectPosition: service.imagePosition || "center",
            maskImage: "linear-gradient(to right, transparent 0%, black 25%, black 75%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 25%, black 75%, transparent 100%)",
          }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start relative z-10">
        <div className="lg:col-span-4">
          <h3
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1.75rem",
              fontWeight: 400,
              color: hovered ? "#FFFDF8" : "#E8E1D8",
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
              color: "#B0A496",
              fontWeight: 300,
              marginBottom: "1.25rem",
            }}
          >
            {service.shortDesc}
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
                  color: "#8A7F72",
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
            <ArrowRight size={18} color="#FFFDF8" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
