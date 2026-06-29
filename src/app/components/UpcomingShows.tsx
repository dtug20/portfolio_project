import { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

type ShowStatus = "tickets" | "rsvp" | "sold_out" | "details";

interface Show {
  _id?: string;
  id?: number;
  date: string;
  event: string;
  venue: string;
  city: string;
  country: string;
  type: string;
  status: ShowStatus;
  ticketUrl?: string;
  isPast: boolean;
  coverUrl?: string;
  soldOut?: boolean;
  time?: string;
}

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

  const dbUpcoming = useQuery(api.shows.listUpcoming);
  const shows: Show[] = dbUpcoming ? dbUpcoming.slice(0, 4) : [];

  return (
    <section
      id="shows"
      ref={ref}
      style={{ backgroundColor: "#11100F", padding: "120px 0 140px" }}
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
              color: "#8A7F72",
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
              color: "#FFFDF8",
              letterSpacing: "-0.01em",
            }}
          >
            Upcoming
            <br />
            <em style={{ fontStyle: "italic", color: "#DED4C8", fontWeight: 300 }}>
              Appearances
            </em>
          </motion.h2>
        </div>



        {/* Show Rows */}
        <div>
          {shows.map((show, i) => (
            <ShowRow key={show._id ?? show.id} show={show} index={i} inView={inView} />
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
              color: "#B0A496",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              transition: "color 0.25s",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#FFFDF8"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#B0A496"; }}
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
  show: Show;
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
      className="relative overflow-hidden group"
      style={{
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        backgroundColor: hovered && !show.coverUrl ? "rgba(255,255,255,0.025)" : "transparent",
        transition: "background-color 0.3s",
      }}
    >
      {/* Background Image Logic */}
      {show.coverUrl && (
        <div className="absolute inset-0 z-0 pointer-events-none flex justify-center">
          <img 
            src={show.coverUrl} 
            alt={show.event}
            className="object-cover object-center transition-opacity duration-500 w-full h-full"
            style={{ 
              opacity: hovered ? 0.85 : 0.55,
              filter: "grayscale(20%)",
              WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)",
              maskImage: "linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)"
            }}
          />
          <div 
            className="absolute inset-0" 
            style={{ 
              background: "linear-gradient(to right, rgba(17,16,15,0.92) 0%, rgba(17,16,15,0.4) 45%, rgba(17,16,15,0.7) 100%)" 
            }} 
          />
        </div>
      )}

      {/* Content wrapper */}
      <div className="relative z-10 px-4 md:px-0 py-10 md:py-16">
        {/* Desktop Layout */}
        <div className="hidden md:flex items-center w-full min-h-[160px]">
          {/* Left side: Date & Info */}
          <div className="flex flex-1 items-center gap-10">
            {/* Date */}
            <div className="flex flex-col items-center justify-center min-w-[90px]">
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#B0A496", marginBottom: -4 }}>{dayOfWeek}</span>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "3.2rem", fontWeight: 300, color: hovered ? "#FFFDF8" : "#F0EAE3", lineHeight: 1, letterSpacing: "-0.02em", transition: "color 0.3s" }}>{day}</span>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.68rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#A09588", mt: 1 }}>{month} {year}</span>
              {show.time && <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", color: "#A09588", marginTop: 8 }}>{show.time}</span>}
            </div>

            {/* Event Info */}
            <div className="flex flex-col items-start flex-1 max-w-[65%]">
              <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.45rem", fontWeight: 500, color: hovered ? "#FFFDF8" : "#F7F2EC", letterSpacing: "0.01em", transition: "color 0.3s", lineHeight: 1.3, marginBottom: 8 }}>{show.event}</h3>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.05rem", color: hovered ? "#FFFDF8" : "#E8E1D8", fontWeight: 400, lineHeight: 1.35, marginBottom: 2, transition: "color 0.3s" }}>{show.venue}</p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", color: "#CDC1B3", fontWeight: 300, lineHeight: 1.5, marginBottom: 12 }}>{show.city}, {show.country}</p>
              
              <div className="flex items-center gap-4">
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.62rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#8A7F72", border: "1px solid", borderColor: "rgba(255,255,255,0.09)", padding: "4px 10px", display: "inline-block" }}>{show.type}</span>
              </div>
            </div>
          </div>

          {/* Right side CTA (always show on the right) */}
          <div className="flex items-center justify-end min-w-[150px]">
            <CtaButton show={show} hovered={hovered} />
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden flex flex-col gap-5">
           <div className="flex flex-col gap-1">
             <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.68rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#B0A496", marginBottom: 8 }}>
               {dayOfWeek}, {month} {day}, {year} {show.time && ` • ${show.time}`}
             </p>
             <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.2rem", fontWeight: 500, color: "#F7F2EC", marginBottom: 4, lineHeight: 1.3 }}>{show.event}</p>
             <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.95rem", color: "#E8E1D8", fontWeight: 400, marginBottom: 2 }}>{show.venue}</p>
             <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", color: "#CDC1B3", fontWeight: 300, marginBottom: 12 }}>{show.city}, {show.country}</p>
             
             <div className="flex items-center justify-between mt-2">
               <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.62rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#8A7F72", border: "1px solid", borderColor: "rgba(255,255,255,0.09)", padding: "4px 10px", display: "inline-block" }}>{show.type}</span>
               <CtaButton show={show} hovered={false} />
             </div>
           </div>
        </div>
      </div>
    </motion.div>
  );
}

function CtaButton({
  show,
  hovered,
}: {
  show: Show;
  hovered: boolean;
}) {
  const [btnHovered, setBtnHovered] = useState(false);
  const active = hovered || btnHovered;

  if (show.soldOut || show.status === "sold_out") {
    return (
      <span
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "0.6rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "#6E655B",
          padding: "10px 20px",
          border: "1px solid #342F2A",
          display: "inline-block",
          whiteSpace: "nowrap",
        }}
      >
        Sold Out
      </span>
    );
  }

  const handleClick = () => {
    if (show.ticketUrl) {
      let url = show.ticketUrl;
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
        color: active ? "#11100F" : "#DED4C8",
        backgroundColor: active ? "#FFFDF8" : "transparent",
        border: "1px solid",
        borderColor: active ? "#FFFDF8" : "rgba(255,255,255,0.18)",
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
