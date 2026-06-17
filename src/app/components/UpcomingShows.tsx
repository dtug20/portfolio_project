import { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";

const shows = [
  {
    id: 1,
    date: "2026-10-12",
    event: "Soul Live Project Arena",
    venue: "Soul Live Project Arena",
    type: "Personal",
    city: "Ho Chi Minh City",
    country: "VN",
    status: "tickets" as const,
    soldOut: false,
  },
  {
    id: 2,
    date: "2026-11-04",
    event: "Hanoi International Music Festival",
    venue: "Hanoi Opera House",
    type: "S.E Project",
    city: "Hanoi",
    country: "VN",
    status: "rsvp" as const,
    soldOut: false,
  },
  {
    id: 3,
    date: "2026-11-28",
    event: "Esplanade Concert Hall",
    venue: "Esplanade Concert Hall",
    type: "Bluemato",
    city: "Singapore",
    country: "SG",
    status: "tickets" as const,
    soldOut: true,
  },
  {
    id: 4,
    date: "2027-01-17",
    event: "Sydney Opera House",
    venue: "Sydney Opera House",
    type: "Personal",
    city: "Sydney",
    country: "AU",
    status: "tickets" as const,
    soldOut: false,
  },
];

function parseDateString(dateStr: string) {
  if (!dateStr) return { dayOfWeek: "", day: "", month: "", year: "" };
  const [y, m, d] = dateStr.split("-").map(Number);
  const dateObj = new Date(y, m - 1, d);
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  return {
    dayOfWeek: days[dateObj.getDay()],
    day: String(d).padStart(2, "0"),
    month: months[m - 1],
    year: String(y)
  };
}

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
          {["Date", "Event", "Location", ""].map((col, i) => (
            <span
              key={i}
              className={
                i === 0 ? "col-span-2" : i === 1 ? "col-span-3" : i === 2 ? "col-span-4" : "col-span-3 text-right"
              }
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.85rem",
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                color: "#444444",
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
  const { dayOfWeek, day, month, year } = parseDateString(show.date);

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
          <div className="flex flex-col gap-1 mt-1">
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.65rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#666666",
                marginBottom: -4,
              }}
            >
              {dayOfWeek}
            </span>
            <span
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "2.3rem",
                fontWeight: 300,
                color: hovered ? "#FFFFFF" : "#DDDDDD",
                transition: "color 0.3s",
                lineHeight: 1,
                letterSpacing: "-0.02em",
              }}
            >
              {day}
            </span>
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.68rem",
                letterSpacing: "0.15em",
                color: "#555555",
                textTransform: "uppercase",
              }}
            >
              {month} {year}
            </span>
          </div>
        </div>

        {/* Event */}
        <div className="col-span-3 flex flex-col gap-1 pt-1">
          <div className="flex items-center gap-4">
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "1.05rem",
                fontWeight: 500,
                color: hovered ? "#FFFFFF" : "#EEEEEE",
                transition: "color 0.3s",
                letterSpacing: "0.01em",
                lineHeight: 1.35,
              }}
            >
              {show.event}
            </p>
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
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.62rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#444444",
              border: "1px solid",
              borderColor: "rgba(255,255,255,0.09)",
              padding: "4px 10px",
              display: "inline-block",
              alignSelf: "flex-start",
              marginTop: 4,
            }}
          >
            {show.type}
          </span>
        </div>

        {/* Location */}
        <div className="col-span-4 flex flex-col pt-1">
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.95rem",
              color: hovered ? "#FFFFFF" : "#CCCCCC",
              fontWeight: 400,
              lineHeight: 1.35,
              marginBottom: 3,
              transition: "color 0.3s",
            }}
          >
            {show.venue}
          </p>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.78rem",
              color: "#888888",
              fontWeight: 300,
              lineHeight: 1.5,
            }}
          >
            {show.city}, {show.country}
          </p>
        </div>

        {/* CTA */}
        <div className="col-span-3 flex justify-end">
          <CtaButton show={show} hovered={hovered} />
        </div>
      </div>

      {/* Mobile layout */}
      <div className="md:hidden py-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1 flex-1">
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.68rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#666666",
                marginBottom: 4,
              }}
            >
              {dayOfWeek}, {month} {day}, {year}
            </p>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "1.05rem",
                fontWeight: 500,
                color: "#EEEEEE",
                marginBottom: 2,
                lineHeight: 1.3,
              }}
            >
              {show.event}
            </p>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.95rem",
                color: "#CCCCCC",
                fontWeight: 400,
                lineHeight: 1.35,
                marginTop: 4,
                marginBottom: 2,
              }}
            >
              {show.venue}
            </p>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.78rem",
                color: "#888888",
                fontWeight: 300,
              }}
            >
              {show.city}, {show.country}
            </p>
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

  const handleClick = () => {
    // Note: UpcomingShows static data doesn't currently use ticketUrl, but adding for future compatibility
    if ('ticketUrl' in show && show.ticketUrl) {
      let url = show.ticketUrl as string;
      if (!/^https?:\/\//i.test(url)) {
        url = "https://" + url;
      }
      window.open(url, "_blank");
    } else {
      const locationQuery = encodeURIComponent(`${show.venue}, ${show.city}, ${show.country}`);
      window.open(`https://www.google.com/maps/search/?api=1&query=${locationQuery}`, "_blank");
    }
  };

  return (
    <button
      onMouseEnter={() => setBtnHovered(true)}
      onMouseLeave={() => setBtnHovered(false)}
      onClick={handleClick}
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
