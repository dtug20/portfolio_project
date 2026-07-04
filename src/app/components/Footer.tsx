import { motion } from "motion/react";
import { useQuery } from "convex/react";
import { useNavigate, useLocation } from "react-router";
import { api } from "../../../convex/_generated/api";
import { useLanguage, TranslationKey } from "../contexts/LanguageContext";

const footerLinks = ["Home", "About", "Shows", "Media", "Services", "Contact"];

function SpotifyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10C22 6.477 17.523 2 12 2zm4.586 14.422c-.172.28-.544.364-.823.19-2.253-1.376-5.088-1.688-8.423-.924-.316.07-.63-.122-.7-.44-.07-.315.122-.63.44-.7 3.63-.83 6.75-.48 9.317 1.08.28.17.363.54.19.82zm1.2-3.197c-.22.353-.68.468-1.03.25-2.58-1.585-6.526-2.03-9.92-1.11-.403.11-.81-.13-.92-.53-.11-.404.13-.81.53-.92 3.88-1.04 8.24-.53 11.1 1.23.35.22.46.68.25 1.03zm.14-3.328C14.773 8.056 8.55 7.848 4.98 8.93c-.48.146-.98-.124-1.126-.604-.146-.48.124-.98.604-1.126 4.12-1.25 10.975-.99 15.166 1.49.43.254.576.81.32 1.24-.256.43-.81.575-1.24.32z" fill="currentColor"/>
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BandcampIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16.5 6l-9 0l-4 12l9 0l4 -12z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const socialLinks = [
  { label: "Instagram", icon: InstagramIcon, href: "https://www.instagram.com/studion2m" },
  { label: "Bandcamp", icon: BandcampIcon, href: "https://nguyennhatminh.bandcamp.com/" },
  { label: "Spotify", icon: SpotifyIcon, href: "https://open.spotify.com/artist/0bdGcGb18FuCTioczLplU8" },
  { label: "YouTube", icon: YouTubeIcon, href: "https://www.youtube.com/@NguyenMinh" },
];

export function Footer() {
  const artistInfo = useQuery(api.artist.getArtistInfo);
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (link: string) => {
    if (link === "Home") {
      if (location.pathname === "/") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        navigate("/");
      }
      return;
    }

    if (link === "Contact") {
      if (location.pathname === "/") {
        document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
      } else {
        navigate("/", { state: { scrollTo: "contact" } });
      }
      return;
    }

    const paths: Record<string, string> = {
      About: "/about",
      Shows: "/shows",
      Media: "/media",
      Services: "/services",
    };
    
    if (paths[link]) {
      navigate(paths[link]);
    }
  };

  return (
    <footer
      style={{
        backgroundColor: "#11100F",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        padding: "64px 0 40px",
      }}
    >
      <div className="max-w-[1400px] mx-auto px-8 md:px-16">
        {/* Top divider accent */}
        <div
          style={{
            width: 40,
            height: 1,
            backgroundColor: "rgba(255,255,255,0.2)",
            marginBottom: "48px",
          }}
        />

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 mb-16">
          {/* Col 1: Brand + copyright */}
          <div>
            <p
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "1.2rem",
                fontWeight: 600,
                letterSpacing: "0.18em",
                color: "#FFFDF8",
                marginBottom: "1rem",
              }}
            >
              NGUYEN MINH
            </p>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.72rem",
                lineHeight: 1.8,
                color: "#8A7F72",
                fontWeight: 300,
                maxWidth: 240,
                marginBottom: "1.5rem"
              }}
            >
              {t("footer.bio")}
            </p>
            <div className="flex flex-col gap-2">
              <a href={`mailto:${artistInfo?.bookingEmail || ""}`} style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.72rem", color: "#A09588", textDecoration: "none", transition: "color 0.2s", display: artistInfo?.bookingEmail ? "block" : "none" }} onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#FFFDF8"; }} onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#A09588"; }}>{artistInfo?.bookingEmail || ""}</a>
              <a href={`tel:${artistInfo?.phone || ""}`} style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.72rem", color: "#A09588", textDecoration: "none", transition: "color 0.2s", display: artistInfo?.phone ? "block" : "none" }} onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#FFFDF8"; }} onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#A09588"; }}>{artistInfo?.phone || ""}</a>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.58rem",
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                color: "#8A7F72",
                marginBottom: "1.25rem",
              }}
            >
              {t("footer.nav")}
            </p>
            <nav className="flex flex-col gap-3">
              {footerLinks.map((link) => (
                <button
                  key={link}
                  onClick={() => handleNavClick(link)}
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.78rem",
                    color: "#B0A496",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    padding: 0,
                    transition: "color 0.2s",
                    fontWeight: 300,
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#E8E1D8"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#B0A496"; }}
                >
                  {t(`nav.${link.toLowerCase()}` as TranslationKey)}
                </button>
              ))}
            </nav>
          </div>

          {/* Col 3: Social */}
          <div>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.58rem",
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                color: "#8A7F72",
                marginBottom: "1.25rem",
              }}
            >
              {t("footer.follow")}
            </p>
            <div className="flex flex-col gap-4">
              {socialLinks.map(({ label, icon: Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex items-center gap-3 group"
                  style={{ textDecoration: "none" }}
                >
                  <span
                    style={{
                      color: "#A09588",
                      transition: "color 0.2s",
                    }}
                    className="group-hover:text-white"
                  >
                    <Icon />
                  </span>
                  <span
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.75rem",
                      color: "#A09588",
                      transition: "color 0.2s",
                      fontWeight: 300,
                    }}
                    className="group-hover:text-white"
                  >
                    {label}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "28px" }}
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
        >
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.65rem",
              color: "#6E655B",
              letterSpacing: "0.06em",
              fontWeight: 300,
            }}
          >
            © {new Date().getFullYear()} Nguyen Minh. {t("general.allRightsReserved")}.
          </p>
          <div className="flex items-center gap-6">
            {["Privacy Policy", "Terms of Use"].map((item) => (
              <a
                key={item}
                href="#"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.62rem",
                  color: "#6E655B",
                  letterSpacing: "0.08em",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#CDC1B3"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#6E655B"; }}
              >
                {item === "Privacy Policy" ? t("footer.privacy") : t("footer.terms")}
              </a>
            ))}
          </div>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.62rem",
              color: "#514A42",
              letterSpacing: "0.06em",
            }}
          >
            nguyenminh.asia
          </p>
        </div>
      </div>
    </footer>
  );
}
