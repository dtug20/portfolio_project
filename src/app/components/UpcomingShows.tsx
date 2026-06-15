import { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";

const shows = [
  {
    id: 1,
    date: "OCT 12, 2026",
    month: "OCT",
    day: "12",
    year: "2026",
    event: "Soul Live Project Arena",
    type: "Solo Recital",
    city: "Ho Chi Minh City, VN",
    status: "tickets" as const,
    soldOut: false,
  },
  {
    id: 2,
    date: "NOV 04, 2026",
    month: "NOV",
    day: "04",
    year: "2026",
    event: "Hanoi International Music Festival",
    type: "Headline Performance",
    city: "Hanoi, VN",
    status: "rsvp" as const,
    soldOut: false,
  },
  {
    id: 3,
    date: "NOV 28, 2026",
    month: "NOV",
    day: "28",
    year: "2026",
    event: "Esplanade Concert Hall",
    type: "Chamber Ensemble",
    city: "Singapore, SG",
    status: "tickets" as const,
    soldOut: true,
  },
  {
    id: 4,
    date: "JAN 17, 2027",
    month: "JAN",
    day: "17",
    year: "2027",
    event: "Sydney Opera House",
    type: "World Premiere",
    city: "Sydney, AU",
    status: "tickets" as const,
    soldOut: false,
  },
];

export function UpcomingShows() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="shows"
      ref={ref}
      style={{ backgroundColor: "#0A0A0A", padding: "120px 0 140px" }}
    >
      <div className="max-w-[1400px] mx-auto px-8 md:px-16">
        {/* Section Header */}
        <div className="mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45 }}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "1rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#444444",
              marginBottom: "4rem",
            }}
          >
            — LIVE
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.08 }}
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2.8rem, 5vw, 4.5rem)",
              fontWeight: 400,
              lineHeight: 1.05,
              color: "#FFFFFF",
              letterSpacing: "-0.01em",
            }}
          >
            Upcoming
            <br />
            <em style={{ fontStyle: "italic", color: "#AAAAAA", fontWeight: 300 }}>
              Appearances
            </em>
          </motion.h2>
        </div>

        {/* Column headers — desktop only */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="hidden md:grid grid-cols-12 gap-6 mb-0 pb-4"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
        >
          {["Date", "Event", ""].map((col, i) => (
            <span
              key={i}
              className={
                i === 0 ? "col-span-2" : i === 1 ? "col-span-7" : "col-span-3 text-right"
              }
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.9rem",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "#333333",
              }}
            >
              {col}
            </span>
          ))}
        </motion.div>

        {/* Show Rows */}
        <div>
          {shows.map((show, i) => (
            <ShowRow key={show.id} show={show} index={i} inView={inView} />
          ))}
        </div>

        {/* View All Dates */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="mt-12"
        >
          <Link
            to="/shows"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.68rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#666666",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              transition: "color 0.25s",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#FFFFFF"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#666666"; }}
          >
            View All Dates
            <ArrowRight size={13} strokeWidth={1.5} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function ShowRow({
  show,
  index,
  inView,
}: {
  show: (typeof shows)[0];
  index: number;
  inView: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: 0.25 + index * 0.08 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        padding: "28px 0",
        transition: "background-color 0.3s",
        backgroundColor: hovered ? "rgba(255,255,255,0.025)" : "transparent",
      }}
    >
      {/* Desktop layout */}
      <div className="hidden md:grid grid-cols-12 gap-6 items-center">
        {/* Date */}
        <div className="col-span-2">
          <div className="flex flex-col gap-0.5">
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.72rem",
                fontWeight: 500,
                letterSpacing: "0.12em",
                color: hovered ? "#FFFFFF" : "#AAAAAA",
                transition: "color 0.3s",
                textTransform: "uppercase",
              }}
            >
              {show.month} {show.day}
            </span>
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.6rem",
                letterSpacing: "0.12em",
                color: "#3A3A3A",
                textTransform: "uppercase",
              }}
            >
              {show.year}
            </span>
          </div>
        </div>

        {/* Event */}
        <div className="col-span-7 flex flex-col gap-1">
          <div className="flex items-center gap-4">
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.95rem",
                fontWeight: 400,
                color: hovered ? "#FFFFFF" : "#DDDDDD",
                transition: "color 0.3s",
                letterSpacing: "0.01em",
              }}
            >
              {show.event}
            </span>
            {show.soldOut && (
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.5rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "#555555",
                  border: "1px solid #2A2A2A",
                  padding: "2px 7px",
                }}
              >
                Sold Out
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.65rem",
                color: "#555555",
                letterSpacing: "0.06em",
              }}
            >
              {show.city}
            </span>
            <span style={{ color: "#2A2A2A", fontSize: "0.5rem" }}>·</span>
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.6rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#3A3A3A",
              }}
            >
              {show.type}
            </span>
          </div>
        </div>

        {/* CTA */}
        <div className="col-span-3 flex justify-end">
          <CtaButton show={show} hovered={hovered} />
        </div>
      </div>

      {/* Mobile layout */}
      <div className="flex md:hidden flex-col gap-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-0.5">
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.68rem",
                fontWeight: 500,
                letterSpacing: "0.12em",
                color: "#AAAAAA",
                textTransform: "uppercase",
              }}
            >
              {show.month} {show.day}, {show.year}
            </span>
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.92rem",
                fontWeight: 400,
                color: "#DDDDDD",
                marginTop: 4,
              }}
            >
              {show.event}
            </span>
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.65rem",
                color: "#555555",
                marginTop: 2,
              }}
            >
              {show.city}
            </span>
          </div>
          <CtaButton show={show} hovered={false} />
        </div>
      </div>
    </motion.div>
  );
}

function CtaButton({
  show,
  hovered,
}: {
  show: (typeof shows)[0];
  hovered: boolean;
}) {
  const [btnHovered, setBtnHovered] = useState(false);
  const active = hovered || btnHovered;

  if (show.soldOut) {
    return (
      <span
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "0.6rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "#333333",
          padding: "10px 20px",
          border: "1px solid #1E1E1E",
          display: "inline-block",
          whiteSpace: "nowrap",
        }}
      >
        Sold Out
      </span>
    );
  }

  return (
    <button
      onMouseEnter={() => setBtnHovered(true)}
      onMouseLeave={() => setBtnHovered(false)}
      style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: "0.6rem",
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color: active ? "#0A0A0A" : "#AAAAAA",
        backgroundColor: active ? "#FFFFFF" : "transparent",
        border: "1px solid",
        borderColor: active ? "#FFFFFF" : "rgba(255,255,255,0.18)",
        padding: "10px 24px",
        cursor: "pointer",
        transition: "all 0.25s ease",
        whiteSpace: "nowrap",
      }}
    >
      {show.status === "rsvp" ? "RSVP" : "Tickets"}
    </button>
  );
}
