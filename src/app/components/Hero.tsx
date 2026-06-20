import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ChevronDown } from "lucide-react";

export function Hero() {
  const scrollToAbout = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative w-full flex items-start overflow-hidden portrait:min-h-[80vh] landscape:min-h-screen"
      style={{ backgroundColor: "#11100F" }}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src="/images/hero.jpg"
          alt="Stage performance"
          className="w-full h-full object-cover landscape:object-contain object-center landscape:object-left"
          style={{ transform: "scaleX(-1)" }}
        />
        {/* Gradient overlays */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to right, rgba(17,16,15,0.95) 40%, rgba(17,16,15,0.2) 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to top, rgba(17,16,15,1) 0%, rgba(17,16,15,1) 3%, rgba(17,16,15,0) 40%)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-8 md:px-16 pb-24 md:pb-32 pt-24 md:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
          className="max-w-3xl"
        >
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.7rem",
              letterSpacing: "0.28em",
              color: "#CDC1B3",
              textTransform: "uppercase",
              marginBottom: "1.5rem",
              lineHeight: "1.8",
            }}
          >
            Composer
            <span className="hidden md:inline"> · </span>
            <br className="md:hidden" />
            Performer
            <span className="hidden md:inline"> · </span>
            <br className="md:hidden" />
            Music Director
          </p>

          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(3.5rem, 9vw, 8.5rem)",
              fontWeight: 300,
              lineHeight: 1.0,
              color: "#FFFDF8",
              letterSpacing: "-0.01em",
              marginBottom: "2rem",
            }}
          >
            Nguyen
            <br />

            <em style={{ fontStyle: "italic", fontWeight: 300 }}>Minh</em>
          </h1>

          <div
            style={{
              width: 48,
              height: 1,
              backgroundColor: "#FFFDF8",
              opacity: 0.3,
              marginBottom: "1.75rem",
            }}
          />

          {/* <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.9rem",
              lineHeight: 1.8,
              color: "#CDC1B3",
              maxWidth: "420px",
              fontWeight: 300,
            }}
          >
            I am an musician and performer working across ambient, film scoring, and theatre. My practice explores sound as space, blending performance, installation, and multimedia works. This portfolio showcases my projects in theatre, experimental concerts, and collaborative shows.
          </p> */}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8 mt-10 md:mt-12"
          >
            <button
              onClick={scrollToAbout}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.7rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#FFFDF8",
                border: "1px solid rgba(255,255,255,0.25)",
                padding: "14px 32px",
                background: "transparent",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(255,255,255,0.08)";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.5)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.25)";
              }}
            >
              Discover More
            </button>

            <button
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.7rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#B0A496",
                background: "none",
                border: "none",
                cursor: "pointer",
                transition: "color 0.25s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#FFFDF8"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#B0A496"; }}
            >
              Book a Session →
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={scrollToAbout}
        animate={{ y: [0, 6, 0] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
        className="absolute bottom-8 right-8 z-10 flex flex-col items-center gap-2"
        style={{ background: "none", border: "none", cursor: "pointer" }}
      >
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.6rem",
            letterSpacing: "0.2em",
            color: "#8A7F72",
            textTransform: "uppercase",
            writingMode: "vertical-rl",
          }}
        >
          Scroll
        </span>
        <ChevronDown size={14} color="#8A7F72" />
      </motion.button>


    </section>
  );
}
