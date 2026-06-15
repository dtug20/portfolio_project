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
      className="relative w-full flex items-end overflow-hidden"
      style={{ minHeight: "100vh", backgroundColor: "#0A0A0A" }}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1558620013-a08999547a36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25jZXJ0JTIwbGl2ZSUyMHBlcmZvcm1hbmNlJTIwc3RhZ2UlMjBkYXJrJTIwZWxlZ2FudHxlbnwxfHx8fDE3ODE0MTc3ODR8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Stage performance"
          className="w-full h-full object-cover"
          style={{ objectPosition: "center 40%" }}
        />
        {/* Gradient overlays */}
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

      {/* Content */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-8 md:px-16 pb-24 md:pb-32 pt-32">
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
              color: "#888888",
              textTransform: "uppercase",
              marginBottom: "1.5rem",
            }}
          >
            Composer · Performer · Music Director
          </p>

          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(3.5rem, 9vw, 8.5rem)",
              fontWeight: 300,
              lineHeight: 1.0,
              color: "#FFFFFF",
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
              backgroundColor: "#FFFFFF",
              opacity: 0.3,
              marginBottom: "1.75rem",
            }}
          />

          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.9rem",
              lineHeight: 1.8,
              color: "#888888",
              maxWidth: "420px",
              fontWeight: 300,
            }}
          >
            Award-winning Vietnamese musician and composer blending
            classical mastery with contemporary expression.
          </p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex items-center gap-8 mt-12"
          >
            <button
              onClick={scrollToAbout}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.7rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#FFFFFF",
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
                color: "#666666",
                background: "none",
                border: "none",
                cursor: "pointer",
                transition: "color 0.25s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#FFFFFF"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#666666"; }}
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
        className="absolute bottom-8 right-16 z-10 flex flex-col items-center gap-2"
        style={{ background: "none", border: "none", cursor: "pointer" }}
      >
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.6rem",
            letterSpacing: "0.2em",
            color: "#444444",
            textTransform: "uppercase",
            writingMode: "vertical-rl",
          }}
        >
          Scroll
        </span>
        <ChevronDown size={14} color="#444444" />
      </motion.button>

      {/* Right edge vertical line */}
      <div
        className="hidden md:block absolute top-0 right-16 bottom-0 z-10"
        style={{ width: 1, backgroundColor: "rgba(255,255,255,0.05)" }}
      />
    </section>
  );
}
