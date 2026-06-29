import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";



export function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="about"
      ref={ref}
      style={{ backgroundColor: "#11100F", padding: "200px 0 140px" }}
    >
      <div className="max-w-[1400px] mx-auto px-8 md:px-16">
        {/* Section Label */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
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
          — About
        </motion.p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left: Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.9, delay: 0.15 }}
            className="relative"
          >
            <div className="relative aspect-[3/4] overflow-hidden">
              <ImageWithFallback
                src="/images/about.jpg"
                alt="Nguyen Minh — musician portrait"
                className="w-full h-full object-cover"
                style={{ filter: "grayscale(20%)" }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background: `
                    linear-gradient(to top, rgba(17,16,15,1) 0%, rgba(17,16,15,0) 12%),
                    linear-gradient(to bottom, rgba(17,16,15,1) 0%, rgba(17,16,15,0) 12%),
                    linear-gradient(to left, rgba(17,16,15,1) 0%, rgba(17,16,15,0) 12%),
                    linear-gradient(to right, rgba(17,16,15,1) 0%, rgba(17,16,15,0) 12%)
                  `
                }}
              />
            </div>

            {/* Quote overlay */}
            <div
              className="absolute bottom-0 left-0 right-0 p-8"
            >
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "1.15rem",
                  fontWeight: 300,
                  fontStyle: "italic",
                  color: "rgba(255,255,255,0.7)",
                  lineHeight: 1.6,
                }}
              >
                "Music is a bridge — not a boundary."
              </p>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.65rem",
                  letterSpacing: "0.15em",
                  color: "#A09588",
                  textTransform: "uppercase",
                  marginTop: 8,
                }}
              >
                — Nguyen Minh, 2023
              </p>
            </div>
          </motion.div>

          {/* Right: Text */}
          <div className="lg:pt-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(2.8rem, 5vw, 4.5rem)",
                fontWeight: 400,
                lineHeight: 1.1,
                color: "#FFFDF8",
                marginBottom: "2.5rem",
              }}
            >
              A Voice Between
              <br />
              <em style={{ fontStyle: "italic", color: "#DED4C8" }}>Two Worlds</em>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <div style={{ width: 40, height: 1, backgroundColor: "#8A7F72", marginBottom: "2rem" }} />

              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.875rem",
                  lineHeight: 1.9,
                  color: "#BFB3A5",
                  fontWeight: 300,
                  marginBottom: "1.5rem",
                  textAlign: "justify",
                }}
              >
                Nguyen Minh is a Hanoi-born composer and multi-instrumentalist whose
                work inhabits the space between Vietnamese classical tradition and
                contemporary global music. Trained at the Hanoi Conservatory of Music
                and later at the Royal College of Music in London, he brings a rare
                depth of cultural fluency to every performance.
              </p>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.875rem",
                  lineHeight: 1.9,
                  color: "#B0A496",
                  fontWeight: 300,
                  textAlign: "justify",
                }}
              >
                His compositions have been performed at venues spanning Carnegie Hall,
                the Hanoi Opera House, and the Sydney Opera House — earning him
                recognition as one of Southeast Asia's most distinguished musical voices.
              </p>

              <Link
                to="/about"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  marginTop: "1.75rem",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.68rem",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#B0A496",
                  textDecoration: "none",
                  transition: "color 0.25s",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#FFFDF8"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#B0A496"; }}
              >
                See more <ArrowRight size={13} strokeWidth={1.5} />
              </Link>
            </motion.div>


          </div>
        </div>
      </div>
    </section>
  );
}
