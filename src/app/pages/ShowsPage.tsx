import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "motion/react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft, ArrowUpRight, Mail } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

type ShowStatus = "tickets" | "rsvp" | "sold_out" | "details";

interface Show {
  id: number;
  date: string;
  day: string;
  month: string;
  year: string;
  event: string;
  venue: string;
  city: string;
  country: string;
  type: string;
  status: ShowStatus;
}

const upcomingShows: Show[] = [
  {
    id: 1,
    date: "OCT 12, 2026",
    day: "12",
    month: "OCT",
    year: "2026",
    event: "Soul Live Project Arena",
    venue: "Soul Live Project Arena",
    city: "Ho Chi Minh City",
    country: "VN",
    type: "Solo Recital",
    status: "tickets",
  },
  {
    id: 2,
    date: "NOV 04, 2026",
    day: "04",
    month: "NOV",
    year: "2026",
    event: "Hanoi International Music Festival",
    venue: "Hanoi Opera House",
    city: "Hanoi",
    country: "VN",
    type: "Headline Performance",
    status: "rsvp",
  },
  {
    id: 3,
    date: "NOV 28, 2026",
    day: "28",
    month: "NOV",
    year: "2026",
    event: "Esplanade Presents — Southeast Asia Series",
    venue: "Esplanade Concert Hall",
    city: "Singapore",
    country: "SG",
    type: "Chamber Ensemble",
    status: "sold_out",
  },
  {
    id: 4,
    date: "JAN 17, 2027",
    day: "17",
    month: "JAN",
    year: "2027",
    event: "World Premiere — Between Silence II",
    venue: "Sydney Opera House",
    city: "Sydney",
    country: "AU",
    type: "World Premiere",
    status: "tickets",
  },
  {
    id: 5,
    date: "FEB 08, 2027",
    day: "08",
    month: "FEB",
    year: "2027",
    event: "Asia Contemporary Music Summit",
    venue: "Seoul Arts Centre",
    city: "Seoul",
    country: "KR",
    type: "Keynote & Performance",
    status: "details",
  },
  {
    id: 6,
    date: "MAR 21, 2027",
    day: "21",
    month: "MAR",
    year: "2027",
    event: "Barbican International Residency",
    venue: "Barbican Centre",
    city: "London",
    country: "UK",
    type: "Artist Residency",
    status: "tickets",
  },
  {
    id: 7,
    date: "APR 05, 2027",
    day: "05",
    month: "APR",
    year: "2027",
    event: "Carnegie Hall — Spring Series",
    venue: "Carnegie Hall",
    city: "New York",
    country: "US",
    type: "Solo Recital",
    status: "tickets",
  },
];

const pastShows: Show[] = [
  {
    id: 101,
    date: "SEP 14, 2025",
    day: "14",
    month: "SEP",
    year: "2025",
    event: "Hanoi Opera House — Season Opening",
    venue: "Hanoi Opera House",
    city: "Hanoi",
    country: "VN",
    type: "Solo Recital",
    status: "details",
  },
  {
    id: 102,
    date: "JUL 22, 2025",
    day: "22",
    month: "JUL",
    year: "2025",
    event: "Esplanade Festival on the Bay",
    venue: "Esplanade Outdoor Theatre",
    city: "Singapore",
    country: "SG",
    type: "Live Set",
    status: "details",
  },
  {
    id: 103,
    date: "MAY 03, 2025",
    day: "03",
    month: "MAY",
    year: "2025",
    event: "UNESCO — World Press Freedom Day Concert",
    venue: "UNESCO Headquarters",
    city: "Paris",
    country: "FR",
    type: "Keynote & Performance",
    status: "details",
  },
  {
    id: 104,
    date: "MAR 18, 2025",
    day: "18",
    month: "MAR",
    year: "2025",
    event: "Sydney Opera House — Artist in Residence",
    venue: "Sydney Opera House",
    city: "Sydney",
    country: "AU",
    type: "Residency Concert",
    status: "details",
  },
  {
    id: 105,
    date: "NOV 30, 2024",
    day: "30",
    month: "NOV",
    year: "2024",
    event: "Barbican — Asian Music Now",
    venue: "Barbican Centre",
    city: "London",
    country: "UK",
    type: "Chamber Ensemble",
    status: "details",
  },
  {
    id: 106,
    date: "AUG 12, 2024",
    day: "12",
    month: "AUG",
    year: "2024",
    event: "Salzburg Music Festival",
    venue: "Mozarteum",
    city: "Salzburg",
    country: "AT",
    type: "Invited Performance",
    status: "details",
  },
];

export function ShowsPage() {
  const headerRef = useRef(null);
  const tableRef = useRef(null);
  const ctaRef = useRef(null);

  const headerInView = useInView(headerRef, { once: true });
  const tableInView = useInView(tableRef, { once: true, margin: "-40px" });
  const ctaInView = useInView(ctaRef, { once: true, margin: "-40px" });

  const allShows = [...upcomingShows, ...pastShows];
  const uniqueTypes = ["All", ...Array.from(new Set(allShows.map(s => s.type)))];

  const [activeTab, setActiveTab] = useState<string>("All");
  const navigate = useNavigate();

  const displayedShows = activeTab === "All" ? allShows : allShows.filter(s => s.type === activeTab);

  return (
    <div style={{ backgroundColor: "#0A0A0A", paddingTop: "72px" }}>

      {/* ── HERO HEADER ── */}
      <section
        ref={headerRef}
        className="relative w-full overflow-hidden"
        style={{ padding: "120px 0 100px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1540039155732-6761b54cbaca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxjb25jZXJ0fGVufDB8fHx8MTcxMTU1NjE1Mnww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Live Stage"
            className="w-full h-full object-cover"
            style={{ objectPosition: "center 40%" }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to right, rgba(10,10,10,0.92) 40%, rgba(10,10,10,0.3) 100%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to top, rgba(10,10,10,1) 0%, transparent 50%)",
            }}
          />
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-8 md:px-16">
          {/* Back */}
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={headerInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.4 }}
            className="mb-14"
          >
            <Link
              to="/"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.65rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#444444",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#AAAAAA"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#444444"; }}
            >
              <ArrowLeft size={12} strokeWidth={1.5} />
              Back to Home
            </Link>
          </motion.div>

          {/* Title block */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
            <div>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={headerInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.45, delay: 0.05 }}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "1rem",
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: "#444444",
                  marginBottom: "1.8rem",
                }}
              >
                - Live
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 28 }}
                animate={headerInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.85, delay: 0.1 }}
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(4rem, 10vw, 9.5rem)",
                  fontWeight: 300,
                  lineHeight: 0.93,
                  color: "#FFFFFF",
                  letterSpacing: "-0.025em",
                }}
              >
                On{" "}
                <em style={{ fontStyle: "italic", color: "#888888" }}>Stage</em>
              </motion.h1>
            </div>
          </div>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={headerInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.9, delay: 0.5, ease: "easeOut" }}
            style={{
              height: 1,
              backgroundColor: "rgba(255,255,255,0.08)",
              marginTop: "5rem",
              transformOrigin: "left",
            }}
          />
        </div>
      </section>

      {/* ── SCHEDULE ── */}
      <section ref={tableRef} style={{ padding: "72px 0 0" }}>
        <div className="max-w-[1400px] mx-auto px-8 md:px-16">

          {/* Tab row */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={tableInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45 }}
            className="flex flex-wrap items-center gap-0 mb-0"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
          >
            {uniqueTypes.map((tab) => {
              const count = tab === "All" ? allShows.length : allShows.filter(s => s.type === tab).length;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.7rem",
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: activeTab === tab ? "#FFFFFF" : "#444444",
                    background: "none",
                    border: "none",
                    borderBottom: activeTab === tab ? "1px solid #FFFFFF" : "1px solid transparent",
                    padding: "18px 20px 17px",
                    cursor: "pointer",
                    marginBottom: -1,
                    transition: "color 0.2s",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                  onMouseEnter={(e) => { if (activeTab !== tab) (e.currentTarget as HTMLButtonElement).style.color = "#AAAAAA"; }}
                  onMouseLeave={(e) => { if (activeTab !== tab) (e.currentTarget as HTMLButtonElement).style.color = "#444444"; }}
                >
                  {tab}
                  <span
                    style={{
                      fontSize: "0.55rem",
                      color: activeTab === tab ? "#555555" : "#2A2A2A",
                      letterSpacing: "0.08em",
                      transition: "color 0.2s",
                    }}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </motion.div>

          {/* Column headers */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={tableInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="hidden lg:grid lg:grid-cols-12 gap-6 py-5"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
          >
            {[
              { label: "Date", span: "lg:col-span-2" },
              { label: "Event", span: "lg:col-span-3" },
              { label: "Location", span: "lg:col-span-4" },
              { label: "Type", span: "lg:col-span-1" },
              { label: "", span: "lg:col-span-2" },
            ].map(({ label, span }) => (
              <span
                key={label}
                className={span}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.85rem",
                  letterSpacing: "0.24em",
                  textTransform: "uppercase",
                  color: "#2E2E2E",
                }}
              >
                {label}
              </span>
            ))}
          </motion.div>

          {/* Show rows */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
            >
              {displayedShows.map((show, i) => (
                <ShowRow
                  key={show.id}
                  show={show}
                  index={i}
                  inView={tableInView}
                  isPast={pastShows.some(p => p.id === show.id)}
                  isLast={i === displayedShows.length - 1}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── BOOKING CTA ── */}
      <section
        ref={ctaRef}
        style={{
          padding: "120px 0 140px",
          marginTop: "100px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="max-w-[1400px] mx-auto px-8 md:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={ctaInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
            >
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.62rem",
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: "#444444",
                  marginBottom: "1.5rem",
                }}
              >
                — Booking
              </p>
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(2.5rem, 4.5vw, 4.2rem)",
                  fontWeight: 400,
                  lineHeight: 1.08,
                  color: "#FFFFFF",
                  marginBottom: "2rem",
                }}
              >
                For booking inquiries
                <br />
                and live{" "}
                <em style={{ fontStyle: "italic", color: "#888888", fontWeight: 300 }}>
                  scheduling
                </em>
              </h2>
              <div style={{ width: 40, height: 1, backgroundColor: "#333333" }} />
            </motion.div>

            {/* Right */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={ctaInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="flex flex-col gap-8"
            >
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.82rem",
                  lineHeight: 1.9,
                  color: "#555555",
                  fontWeight: 300,
                  maxWidth: 420,
                }}
              >
                Please contact management directly for all live performance
                bookings, festival appearances, keynote engagements, and
                touring enquiries. All requests receive a personal response
                within 48 hours.
              </p>

              <div className="flex flex-col gap-4">
                <BookingContact
                  label="General Booking"
                  email="booking@nguyenminh.asia"
                />
                <BookingContact
                  label="International Touring"
                  email="touring@nguyenminh.asia"
                />
                <BookingContact
                  label="Press & Media"
                  email="press@nguyenminh.asia"
                />
              </div>

              <div className="flex items-center gap-4 mt-2">
                <button
                  onClick={() => navigate("/", { state: { scrollTo: "contact" } })}
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.68rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "#0A0A0A",
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #FFFFFF",
                    padding: "14px 36px",
                    cursor: "pointer",
                    transition: "all 0.25s ease",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                  onMouseEnter={(e) => {
                    const b = e.currentTarget as HTMLButtonElement;
                    b.style.backgroundColor = "transparent";
                    b.style.color = "#FFFFFF";
                  }}
                  onMouseLeave={(e) => {
                    const b = e.currentTarget as HTMLButtonElement;
                    b.style.backgroundColor = "#FFFFFF";
                    b.style.color = "#0A0A0A";
                  }}
                >
                  Send an Enquiry <ArrowUpRight size={13} strokeWidth={1.5} />
                </button>

                <Link
                  to="/services"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.68rem",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "#444444",
                    textDecoration: "none",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#AAAAAA"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#444444"; }}
                >
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

/* ── Sub-components ── */

function ShowRow({
  show,
  index,
  inView,
  isPast,
  isLast,
}: {
  show: Show;
  index: number;
  inView: boolean;
  isPast: boolean;
  isLast: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.05 + index * 0.07 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        backgroundColor: hovered ? "rgba(255,255,255,0.025)" : "transparent",
        transition: "background-color 0.3s",
      }}
    >
      {/* Desktop layout */}
      <div className="hidden lg:grid lg:grid-cols-12 gap-6 items-center py-7">
        {/* Date */}
        <div className="lg:col-span-2">
          <div className="flex flex-col gap-0.5">
            <span
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "2.4rem",
                fontWeight: 300,
                color: isPast ? "#3A3A3A" : hovered ? "#FFFFFF" : "#CCCCCC",
                lineHeight: 1,
                letterSpacing: "-0.01em",
                transition: "color 0.3s",
              }}
            >
              {show.day}
            </span>
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.8rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: isPast ? "#2A2A2A" : "#444444",
              }}
            >
              {show.month} {show.year}
            </span>
          </div>
        </div>

        {/* Event */}
        <div className="lg:col-span-3">
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.95rem",
              fontWeight: 500,
              color: isPast ? "#555555" : hovered ? "#FFFFFF" : "#DDDDDD",
              letterSpacing: "0.01em",
              marginBottom: 4,
              transition: "color 0.3s",
              lineHeight: 1.35,
            }}
          >
            {show.event}
          </p>
        </div>

        {/* Location */}
        <div className="lg:col-span-4">
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.85rem",
              color: isPast ? "#444444" : hovered ? "#EEEEEE" : "#BBBBBB",
              fontWeight: 400,
              lineHeight: 1.35,
              marginBottom: 2,
              transition: "color 0.3s",
            }}
          >
            {show.venue}
          </p>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.75rem",
              color: isPast ? "#333333" : "#666666",
              fontWeight: 300,
              lineHeight: 1.5,
            }}
          >
            {show.city}, {show.country}
          </p>
        </div>

        {/* Type */}
        <div className="lg:col-span-1">
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.62rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: isPast ? "#2E2E2E" : "#444444",
              border: "1px solid",
              borderColor: isPast ? "#1E1E1E" : "rgba(255,255,255,0.09)",
              padding: "4px 10px",
              display: "inline-block",
            }}
          >
            {show.type}
          </span>
        </div>

        {/* CTA */}
        <div className="lg:col-span-2 flex justify-end">
          <ShowCta show={show} hovered={hovered} isPast={isPast} />
        </div>
      </div>

      {/* Mobile layout */}
      <div className="lg:hidden py-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.6rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#444444",
                marginBottom: 6,
              }}
            >
              {show.month} {show.day}, {show.year}
            </p>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.9rem",
                fontWeight: 500,
                color: "#DDDDDD",
                marginBottom: 4,
                lineHeight: 1.3,
              }}
            >
              {show.event}
            </p>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.75rem",
                color: "#999999",
                fontWeight: 400,
                marginBottom: 2,
              }}
            >
              {show.venue}
            </p>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.7rem",
                color: "#555555",
                fontWeight: 300,
              }}
            >
              {show.city}, {show.country} · {show.type}
            </p>
          </div>
          <ShowCta show={show} hovered={false} isPast={isPast} />
        </div>
      </div>
    </motion.div>
  );
}

function ShowCta({
  show,
  hovered,
  isPast,
}: {
  show: Show;
  hovered: boolean;
  isPast: boolean;
}) {
  const [btnHovered, setBtnHovered] = useState(false);
  const active = hovered || btnHovered;

  if (show.status === "sold_out") {
    return (
      <span
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "0.58rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "#333333",
          border: "1px solid #1E1E1E",
          padding: "9px 16px",
          display: "inline-block",
          whiteSpace: "nowrap",
        }}
      >
        Sold Out
      </span>
    );
  }

  const label = isPast
    ? "Details"
    : show.status === "rsvp"
      ? "RSVP"
      : "Get Tickets";

  return (
    <button
      onMouseEnter={() => setBtnHovered(true)}
      onMouseLeave={() => setBtnHovered(false)}
      style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: "0.58rem",
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color: active ? "#0A0A0A" : "#888888",
        backgroundColor: active ? "#FFFFFF" : "transparent",
        border: "1px solid",
        borderColor: active ? "#FFFFFF" : "rgba(255,255,255,0.15)",
        padding: "9px 20px",
        cursor: "pointer",
        transition: "all 0.25s ease",
        whiteSpace: "nowrap",
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
      }}
    >
      {label}
      {!isPast && <ArrowUpRight size={10} strokeWidth={1.5} />}
    </button>
  );
}

function BookingContact({ label, email }: { label: string; email: string }) {
  return (
    <div
      style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        paddingTop: "1rem",
      }}
    >
      <p
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "0.58rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "#333333",
          marginBottom: 6,
        }}
      >
        {label}
      </p>
      <a
        href={`mailto:${email}`}
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "0.82rem",
          color: "#666666",
          textDecoration: "none",
          fontWeight: 300,
          transition: "color 0.2s",
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#FFFFFF"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#666666"; }}
      >
        <Mail size={13} strokeWidth={1.5} color="currentColor" />
        {email}
      </a>
    </div>
  );
}
