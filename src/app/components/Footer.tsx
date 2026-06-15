import { motion } from "motion/react";

const footerLinks = ["Home", "About", "Media", "Services", "Contact"];

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="2" y="9" width="4" height="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="4" cy="4" r="2" stroke="currentColor" strokeWidth="1.5" />
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

function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const socialLinks = [
  { label: "LinkedIn", icon: LinkedInIcon, href: "#" },
  { label: "YouTube", icon: YouTubeIcon, href: "https://www.youtube.com/c/Nguyenminh" },
  { label: "Facebook", icon: FacebookIcon, href: "#" },
];

export function Footer() {
  const scrollTo = (id: string) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer
      style={{
        backgroundColor: "#0A0A0A",
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
                color: "#FFFFFF",
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
                color: "#444444",
                fontWeight: 300,
                maxWidth: 240,
              }}
            >
              Composer, performer, and music director based in Hanoi, Vietnam.
              Available for international engagements.
            </p>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.58rem",
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                color: "#444444",
                marginBottom: "1.25rem",
              }}
            >
              Navigation
            </p>
            <nav className="flex flex-col gap-3">
              {footerLinks.map((link) => (
                <button
                  key={link}
                  onClick={() => scrollTo(link)}
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.78rem",
                    color: "#666666",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    padding: 0,
                    transition: "color 0.2s",
                    fontWeight: 300,
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#CCCCCC"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#666666"; }}
                >
                  {link}
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
                color: "#444444",
                marginBottom: "1.25rem",
              }}
            >
              Follow
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
                      color: "#555555",
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
                      color: "#555555",
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
              color: "#333333",
              letterSpacing: "0.06em",
              fontWeight: 300,
            }}
          >
            © {new Date().getFullYear()} Nguyen Minh. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {["Privacy Policy", "Terms of Use"].map((item) => (
              <a
                key={item}
                href="#"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.62rem",
                  color: "#333333",
                  letterSpacing: "0.08em",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#888888"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#333333"; }}
              >
                {item}
              </a>
            ))}
          </div>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.62rem",
              color: "#2A2A2A",
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
