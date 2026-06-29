import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "motion/react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft, ArrowUpRight, Mail } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

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
  notes?: string;
  coverUrl?: string;
  time?: string;
}

// ── Fallback array removed ────

export function ShowsPage() {
  const headerRef = useRef(null);
  const tableRef = useRef(null);
  const ctaRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true });
  const tableInView = useInView(tableRef, { once: true, margin: "-40px" });
  const ctaInView = useInView(ctaRef, { once: true, margin: "-40px" });
  const [activeTab, setActiveTab] = useState<string>("All");
  const navigate = useNavigate();

  // Live data from Convex (undefined while loading, [] if no data yet)
  const dbUpcoming = useQuery(api.shows.listUpcoming);
  const dbPast = useQuery(api.shows.listPast);

  const upcomingShows: Show[] = dbUpcoming ? dbUpcoming : [];
  const pastShows: Show[] = dbPast ? dbPast : [];
  const allShows = [...upcomingShows, ...pastShows];
  const displayedShows = activeTab === "All" ? allShows : allShows.filter(s => s.type === activeTab);

  const getHeroImage = (tab: string) => {
    switch (tab) {
      case "S.E Project": return "/images/S.E_project.jpg";
      case "Bluemato": return "/images/bluemato.jpg";
      case "Personal": return "/images/personal.png";
      case "OPEN - project": return "/images/open_project.jpg";
      default: return "/images/on_stage.jpeg";
    }
  };

  const getHeroImagePosition = (tab: string) => {
    switch (tab) {
      case "Personal": return "center 35%";
      case "S.E Project": return "70% 40%";
      default: return "center 40%";
    }
  };

  const getHeroImageFilter = (tab: string) => {
    switch (tab) {
      case "S.E Project": return "brightness(1.15)";
      default: return "none";
    }
  };

  return (
    <div style={{ backgroundColor: "#11100F" }}>

      {/* ── HERO HEADER ── */}
      <section ref={headerRef} className="relative w-full h-[65vh] min-h-[500px] bg-[#0A0A0A] overflow-hidden flex flex-col justify-end">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 bg-[#11100F]">
          <AnimatePresence>
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <ImageWithFallback
                src={getHeroImage(activeTab)}
                alt={`${activeTab} Stage`}
                className="w-full h-full object-cover"
                style={{ 
                  objectPosition: getHeroImagePosition(activeTab),
                  filter: getHeroImageFilter(activeTab)
                }}
              />
            </motion.div>
          </AnimatePresence>
          {/* Soft gradient overlays for readability without obscuring the image */}
          <div
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              background: "linear-gradient(to right, rgba(17,16,15,0.95) 0%, rgba(17,16,15,0.6) 50%, rgba(17,16,15,0.15) 100%)",
            }}
          />
          <div
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              background: "linear-gradient(to top, rgba(17,16,15,1) 0%, rgba(17,16,15,0.5) 30%, rgba(17,16,15,0) 60%)",
            }}
          />
        </div>

        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-8 md:px-16 pb-12 md:pb-16">


          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
            <div>
              <motion.h1 initial={{ opacity: 0, y: 28 }} animate={headerInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.85, delay: 0.1 }} style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(4rem, 10vw, 9.5rem)", fontWeight: 300, lineHeight: 0.93, color: "#FFFDF8", letterSpacing: "-0.025em" }}>
                On <em style={{ fontStyle: "italic", color: "#CDC1B3" }}>Stage</em>
              </motion.h1>
            </div>
          </div>
        </div>
      </section>

      {/* ── SCHEDULE ── */}
      <section ref={tableRef} style={{ padding: "0" }}>
        <div className="max-w-[1400px] mx-auto px-8 md:px-16">
          {/* Tab row */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={tableInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.45 }} className="flex flex-wrap items-center gap-0 mb-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            {["All", ...Array.from(new Set(["Personal", "OPEN - project", "Bluemato", "S.E Project", ...allShows.map(s => s.type)]))].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", letterSpacing: "0.16em", textTransform: "uppercase", color: activeTab === tab ? "#FFFDF8" : "#8A7F72", background: "none", border: "none", borderBottom: activeTab === tab ? "1px solid #FFFDF8" : "1px solid transparent", padding: "18px 32px 17px", cursor: "pointer", marginBottom: -1, transition: "color 0.2s", display: "flex", alignItems: "center", gap: 10 }}
                onMouseEnter={(e) => { if (activeTab !== tab) (e.currentTarget as HTMLButtonElement).style.color = "#DED4C8"; }}
                onMouseLeave={(e) => { if (activeTab !== tab) (e.currentTarget as HTMLButtonElement).style.color = "#8A7F72"; }}>
                {tab}
                <span style={{ fontSize: "0.55rem", color: activeTab === tab ? "#A09588" : "#514A42", letterSpacing: "0.08em", transition: "color 0.2s" }}>
                  {tab === "All" ? allShows.length : allShows.filter(s => s.type === tab).length}
                </span>
              </button>
            ))}
          </motion.div>



          {/* Show rows */}
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3 }}>
              {displayedShows.map((show, i) => (
                <ShowRow key={show._id ?? (show as any).id ?? i} show={show} index={i} inView={tableInView} isPast={show.isPast} isLast={i === displayedShows.length - 1} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── BOOKING CTA ── */}
      <section ref={ctaRef} style={{ padding: "120px 0 140px", marginTop: "100px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-[1400px] mx-auto px-8 md:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={ctaInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }}>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.62rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#8A7F72", marginBottom: "1.5rem" }}>— Booking</p>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.5rem, 4.5vw, 4.2rem)", fontWeight: 400, lineHeight: 1.08, color: "#FFFDF8", marginBottom: "2rem" }}>
                For booking inquiries<br />and live <em style={{ fontStyle: "italic", color: "#CDC1B3", fontWeight: 300 }}>scheduling</em>
              </h2>
              <div style={{ width: 40, height: 1, backgroundColor: "#6E655B" }} />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={ctaInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.15 }} className="flex flex-col gap-8">
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.82rem", lineHeight: 1.9, color: "#A09588", fontWeight: 300, maxWidth: 420 }}>
                Please contact management directly for all live performance bookings, festival appearances, keynote engagements, and touring enquiries.
              </p>
              <div className="flex flex-col gap-4">
                <BookingContact label="General Booking" email="booking@nguyenminh.asia" />
                <BookingContact label="International Touring" email="touring@nguyenminh.asia" />
                <BookingContact label="Press & Media" email="press@nguyenminh.asia" />
              </div>
              <div className="flex items-center gap-4 mt-2">
                <button onClick={() => navigate("/", { state: { scrollTo: "contact" } })} style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.68rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#11100F", backgroundColor: "#FFFDF8", border: "1px solid #FFFDF8", padding: "14px 36px", cursor: "pointer", transition: "all 0.25s ease", display: "inline-flex", alignItems: "center", gap: 8 }}
                  onMouseEnter={(e) => { const b = e.currentTarget as HTMLButtonElement; b.style.backgroundColor = "transparent"; b.style.color = "#FFFDF8"; }}
                  onMouseLeave={(e) => { const b = e.currentTarget as HTMLButtonElement; b.style.backgroundColor = "#FFFDF8"; b.style.color = "#11100F"; }}>
                  Send an Enquiry <ArrowUpRight size={13} strokeWidth={1.5} />
                </button>
                <Link to="/services" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.68rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#8A7F72", textDecoration: "none", transition: "color 0.2s" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#DED4C8"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#8A7F72"; }}>
                  View Services
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
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



function ShowRow({ show, index, inView, isPast, isLast }: { show: Show; index: number; inView: boolean; isPast: boolean; isLast: boolean }) {
  const [hovered, setHovered] = useState(false);
  const { dayOfWeek, day, month, year } = parseDateString(show.date);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.05 + index * 0.07 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative overflow-hidden group"
      style={{
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        backgroundColor: hovered && !show.coverUrl ? "rgba(255,255,255,0.025)" : "transparent",
        transition: "background-color 0.3s"
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

      <div className="relative z-10 px-4 lg:px-6 py-10 lg:py-16">
        {/* Desktop */}
        <div className="hidden lg:flex items-center w-full min-h-[160px]">
          <div className="flex flex-1 items-center gap-10">
            <div className="flex flex-col items-center justify-center min-w-[90px]">
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: isPast ? "#6E655B" : "#B0A496", marginBottom: -4 }}>{dayOfWeek}</span>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "3.2rem", fontWeight: 300, color: isPast ? "#8A7F72" : hovered ? "#FFFDF8" : "#F0EAE3", lineHeight: 1, letterSpacing: "-0.02em", transition: "color 0.3s" }}>{day}</span>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.68rem", letterSpacing: "0.15em", textTransform: "uppercase", color: isPast ? "#6E655B" : "#B0A496", mt: 1 }}>{month} {year}</span>
              {show.time && <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", color: isPast ? "#6E655B" : "#B0A496", marginTop: 8 }}>{show.time}</span>}
            </div>

            {/* Event Info */}
            <div className="flex flex-col items-start flex-1 max-w-[65%]">
              <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.45rem", fontWeight: 500, color: isPast ? "#B0A496" : hovered ? "#FFFDF8" : "#F7F2EC", letterSpacing: "0.01em", transition: "color 0.3s", lineHeight: 1.3, marginBottom: 8 }}>{show.event}</h3>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.05rem", color: isPast ? "#A09588" : hovered ? "#FFFDF8" : "#E8E1D8", fontWeight: 400, lineHeight: 1.35, marginBottom: 2, transition: "color 0.3s" }}>{show.venue}</p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", color: isPast ? "#8A7F72" : "#CDC1B3", fontWeight: 300, lineHeight: 1.5, marginBottom: 12 }}>{show.city}, {show.country}</p>

              <div className="flex items-center gap-4">
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.62rem", letterSpacing: "0.12em", textTransform: "uppercase", color: isPast ? "#5B534A" : "#8A7F72", border: "1px solid", borderColor: isPast ? "#342F2A" : "rgba(255,255,255,0.09)", padding: "4px 10px", display: "inline-block" }}>{show.type}</span>
              </div>
            </div>
          </div>

          {/* Right side CTA (always show on the right) */}
          <div className="flex items-center justify-end min-w-[150px]">
            <ShowCta show={show} hovered={hovered} isPast={isPast} />
          </div>
        </div>

        {/* Mobile */}
        <div className="lg:hidden flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.68rem", letterSpacing: "0.15em", textTransform: "uppercase", color: isPast ? "#6E655B" : "#B0A496", marginBottom: 8 }}>
              {dayOfWeek}, {month} {day}, {year} {show.time && ` • ${show.time}`}
            </p>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.2rem", fontWeight: 500, color: isPast ? "#B0A496" : "#F7F2EC", marginBottom: 4, lineHeight: 1.3 }}>{show.event}</p>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.95rem", color: isPast ? "#A09588" : "#E8E1D8", fontWeight: 400, marginBottom: 2 }}>{show.venue}</p>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", color: isPast ? "#8A7F72" : "#CDC1B3", fontWeight: 300, marginBottom: 12 }}>{show.city}, {show.country}</p>

            <div className="flex items-center justify-between mt-2">
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.62rem", letterSpacing: "0.12em", textTransform: "uppercase", color: isPast ? "#5B534A" : "#8A7F72", border: "1px solid", borderColor: isPast ? "#342F2A" : "rgba(255,255,255,0.09)", padding: "4px 10px", display: "inline-block" }}>{show.type}</span>
              <ShowCta show={show} hovered={false} isPast={isPast} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ShowCta({ show, hovered, isPast }: { show: Show; hovered: boolean; isPast: boolean }) {
  const [btnHovered, setBtnHovered] = useState(false);
  const active = hovered || btnHovered;
  if (show.status === "sold_out") {
    return <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.58rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#6E655B", border: "1px solid #342F2A", padding: "9px 16px", display: "inline-block", whiteSpace: "nowrap" }}>Sold Out</span>;
  }
  const label = isPast ? "Details" : show.status === "rsvp" ? "RSVP" : "Get Tickets";
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
    <button onMouseEnter={() => setBtnHovered(true)} onMouseLeave={() => setBtnHovered(false)} style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.58rem", letterSpacing: "0.2em", textTransform: "uppercase", color: active ? "#11100F" : "#CDC1B3", backgroundColor: active ? "#FFFDF8" : "transparent", border: "1px solid", borderColor: active ? "#FFFDF8" : "rgba(255,255,255,0.15)", padding: "9px 20px", cursor: "pointer", transition: "all 0.25s ease", whiteSpace: "nowrap", display: "inline-flex", alignItems: "center", gap: 6 }}
      onClick={handleClick}>
      {label}
      {!isPast && <ArrowUpRight size={10} strokeWidth={1.5} />}
    </button>
  );
}

function BookingContact({ label, email }: { label: string; email: string }) {
  return (
    <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "1rem" }}>
      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.58rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#6E655B", marginBottom: 6 }}>{label}</p>
      <a href={`mailto:${email}`} style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.82rem", color: "#B0A496", textDecoration: "none", fontWeight: 300, transition: "color 0.2s", display: "inline-flex", alignItems: "center", gap: 8 }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#FFFDF8"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#B0A496"; }}>
        <Mail size={13} strokeWidth={1.5} color="currentColor" />
        {email}
      </a>
    </div>
  );
}
