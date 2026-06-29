import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

const milestones = [
  {
    year: "1985",
    title: "Born in Hanoi, Vietnam",
    description:
      "Raised in a musical household, Nguyen Minh began formal piano studies at the age of five under master teacher Pham Thi Lan at the Hanoi School of Music.",
  },
  {
    year: "2003",
    title: "Hanoi Conservatory of Music — First Prize",
    description:
      "Graduated with highest honours from the Hanoi Conservatory of Music, earning the National Young Musician Prize for his original composition cycle 'Song of the Red River'.",
  },
  {
    year: "2007",
    title: "Royal College of Music, London",
    description:
      "Awarded a full scholarship to pursue postgraduate study in composition and performance at the Royal College of Music, studying under Sir Harrison Birtwistle.",
  },
  {
    year: "2010",
    title: "International Debut — Carnegie Hall",
    description:
      "Made his international solo debut at Carnegie Hall, New York, performing his own composition 'Monsoon Suite' to critical acclaim from The New York Times and Le Monde.",
  },
  {
    year: "2014",
    title: "UNESCO Artist for Peace",
    description:
      "Appointed as a UNESCO Artist for Peace in recognition of his contribution to cultural dialogue through music between Vietnam and the international community.",
  },
  {
    year: "2018",
    title: "Founding of the Vietnam Contemporary Music Ensemble",
    description:
      "Established the Vietnam Contemporary Music Ensemble, a pioneering chamber group dedicated to premiering new works by Southeast Asian composers.",
  },
  {
    year: "2021",
    title: "Grammy Nomination — Best Classical Composition",
    description:
      "Received a Grammy nomination for his orchestral work 'Between Silence', recorded with the London Symphony Orchestra and released on Deutsche Grammophon.",
  },
  {
    year: "2024",
    title: "Artist in Residence — Sydney Opera House",
    description:
      "Named Artist in Residence at the Sydney Opera House for the 2024–2025 season, premiering three new works exploring the intersection of Vietnamese folk tradition and electronic composition.",
  },
];

export function AboutPage() {
  const headerRef = useRef(null);
  const storyRef = useRef(null);
  const timelineRef = useRef(null);

  const headerInView = useInView(headerRef, { once: true });
  const storyInView = useInView(storyRef, { once: true, margin: "-60px" });
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
            src="/images/about.jpg"
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
                Biogra
                <em style={{ fontStyle: "italic" }}>phy</em>
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
                  src="https://nguyennhatminh.carrd.co/assets/images/image01.jpg?v=b"
                  alt="Nguyen Minh — official portrait"
                  className="w-full h-full object-cover"
                  style={{ filter: "grayscale(100%) contrast(1.05)" }}
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
                Nguyen Minh · Hanoi, 2024
              </p>
            </motion.div>

            {/* Right: Text */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={storyInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="lg:col-span-8 flex flex-col gap-8"
            >
              <BioParagraph
                label="Early Life & Formation"
                text="Born in Hanoi in 1985 into a family of educators and amateur musicians, Nguyen Minh's path was shaped early by the confluence of Vietnamese classical tradition and the recordings of Western masters that filled his childhood home. By the age of eight, he had composed his first piece — a short study for đàn tranh and piano — performed at his school's annual recital to standing applause."
              />

              <BioParagraph
                label="Education"
                text="Minh trained at the Hanoi Conservatory of Music before earning a full scholarship to the Royal College of Music in London, where he studied under Sir Harrison Birtwistle. It was in London that he developed the compositional language that would define his career: a harmonic architecture rooted in Vietnamese pentatonic modes, voiced through the vocabulary of late European modernism and filtered through a deep sensitivity to silence and space."
              />

              <BioParagraph
                label="Artistic Philosophy"
                text="'I am not interested in fusion as a concept,' Minh has said. 'I am interested in truth — the truth of what it sounds like to be Vietnamese, to have absorbed two musical worlds, and to speak honestly from that place.' His music avoids the superficial borrowing that characterises much cross-cultural work, instead seeking structural and emotional resonances between traditions that appear, on the surface, to have little in common."
              />

              <BioParagraph
                label="International Career"
                text="Over two decades of international touring have taken Minh to Carnegie Hall, the Barbican, the Seoul Arts Centre, and the Sydney Opera House, where he was named Artist in Residence for 2024–2025. His discography spans twelve studio albums, including the Grammy-nominated 'Between Silence' (Deutsche Grammophon, 2021) and the critically acclaimed film score for 'Homeland' (Best Original Score, Golden Kite Awards, 2022)."
              />

              <BioParagraph
                label="Legacy & Teaching"
                text="In 2018, Minh founded the Vietnam Contemporary Music Ensemble, a chamber group dedicated to premiering new works by Southeast Asian composers. He serves as a UNESCO Artist for Peace and regularly conducts masterclasses at leading conservatories across Asia, Europe, and the Americas, mentoring the next generation of composers who seek, as he does, to speak to the world from a deeply particular place."
              />
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
              04 / Milestones
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
              Key{" "}
              <em style={{ fontStyle: "italic", color: "#CDC1B3", fontWeight: 300 }}>
                Achievements
              </em>
            </h2>
          </motion.div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical spine — desktop */}
            <div
              className="hidden md:block absolute top-0 bottom-0"
              style={{
                left: "10rem",
                width: 1,
                backgroundColor: "rgba(255,255,255,0.06)",
              }}
            />

            <div className="flex flex-col">
              {milestones.map((item, i) => (
                <TimelineRow
                  key={item.year}
                  item={item}
                  index={i}
                  inView={timelineInView}
                  isLast={i === milestones.length - 1}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function BioParagraph({ label, text }: { label: string; text: string }) {
  return (
    <div>
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
  inView,
  isLast,
}: {
  item: (typeof milestones)[0];
  index: number;
  inView: boolean;
  isLast: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: 0.1 + index * 0.07 }}
      className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-0"
      style={{
        borderTop: "1px solid rgba(255,255,255,0.07)",
        paddingTop: 28,
        paddingBottom: isLast ? 0 : 28,
      }}
    >
      {/* Year */}
      <div className="md:col-span-2 flex items-start pt-0.5">
        <span
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1.15rem",
            fontWeight: 400,
            color: "#776D62",
            letterSpacing: "0.04em",
            lineHeight: 1,
          }}
        >
          {item.year}
        </span>
      </div>

      {/* Dot on spine — desktop */}
      <div className="hidden md:flex md:col-span-1 justify-center pt-1">
        <div
          style={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.25)",
            backgroundColor: "#11100F",
            flexShrink: 0,
            marginTop: 2,
          }}
        />
      </div>

      {/* Content */}
      <div className="md:col-span-9 md:pl-10">
        <h3
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1.35rem",
            fontWeight: 400,
            color: "#F0EAE3",
            lineHeight: 1.2,
            marginBottom: "0.6rem",
          }}
        >
          {item.title}
        </h3>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.78rem",
            lineHeight: 1.85,
            color: "#A09588",
            fontWeight: 300,
            maxWidth: 620,
          }}
        >
          {item.description}
        </p>
      </div>
    </motion.div>
  );
}
