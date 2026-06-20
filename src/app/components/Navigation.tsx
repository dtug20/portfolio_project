import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLocation, useNavigate } from "react-router";
import { Menu, X } from "lucide-react";

const navLinks = ["Home", "Shows", "About", "Media", "Services", "Contact"];

const linkToPath: Record<string, string> = {
  Home: "/",
  About: "/about",
  Shows: "/shows",
  Media: "/media",
  Services: "/services",
};

const pathToSection: Record<string, string> = {
  "/about": "About",
  "/media": "Media",
  "/services": "Services",
  "/shows": "Shows",
};

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("Home");
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sync active indicator with current route on non-home pages
  useEffect(() => {
    const mapped = pathToSection[location.pathname];
    if (mapped) setActiveSection(mapped);
    else if (isHome) setActiveSection("Home");
  }, [location.pathname, isHome]);

  const handleNavClick = (link: string) => {
    setMobileOpen(false);

    if (link === "Home" && isHome) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setActiveSection("Home");
      return;
    }

    if (link === "Contact") {
      navigate("/", { state: { scrollTo: "contact" } });
      setActiveSection(link);
      return;
    }

    navigate(linkToPath[link]);
    setActiveSection(link);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          backgroundColor: scrolled ? "rgba(10,10,10,0.95)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
        }}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-8 lg:px-16 flex items-center justify-between h-[72px]">
          {/* Logo */}
          <button
            onClick={() => handleNavClick("Home")}
            className="flex items-center gap-0 group"
          >
            <span
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "1.35rem",
                fontWeight: 600,
                letterSpacing: "0.18em",
                color: "#FFFDF8",
                whiteSpace: "nowrap",
              }}
            >
              NGUYEN MINH
            </span>
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                backgroundColor: "#FFFDF8",
                marginLeft: 8,
                opacity: 0.5,
                display: "inline-block",
                transition: "opacity 0.3s",
              }}
              className="group-hover:opacity-100"
            />
          </button>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6 lg:gap-10">
            {navLinks.map((link) => (
              <NavLink
                key={link}
                label={link}
                active={activeSection === link}
                onClick={() => handleNavClick(link)}
              />
            ))}
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-white/70 hover:text-white transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="fixed top-[72px] left-0 right-0 z-40 flex flex-col gap-0"
            style={{
              backgroundColor: "rgba(10,10,10,0.98)",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {navLinks.map((link, i) => (
              <motion.button
                key={link}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => handleNavClick(link)}
                className="px-8 py-5 text-left transition-colors"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.85rem",
                  letterSpacing: "0.14em",
                  color: activeSection === link ? "#FFFDF8" : "#D7CCBF",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                  textTransform: "uppercase",
                }}
              >
                {link}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function NavLink({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="relative group flex flex-col items-center gap-1"
      style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: "0.72rem",
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        color: active ? "#FFFDF8" : "#CDC1B3",
        transition: "color 0.25s",
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: "4px 0",
      }}
    >
      <span
        className="group-hover:text-white transition-colors duration-200"
        style={{ color: "inherit" }}
      >
        {label}
      </span>
      <span
        style={{
          display: "block",
          height: 1,
          width: active ? "100%" : "0%",
          backgroundColor: "#FFFDF8",
          transition: "width 0.3s ease",
          position: "absolute",
          bottom: -2,
          left: 0,
        }}
        className="group-hover:w-full"
      />
    </button>
  );
}
