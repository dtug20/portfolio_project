import { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { Send } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useLanguage, TranslationKey } from "../contexts/LanguageContext";

const inquiryTypes = ["Booking", "Composition", "Production", "Education", "Press", "Other"];

export function Contact() {
  const artistInfo = useQuery(api.artist.getArtistInfo);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const submitMessage = useMutation(api.contact.submit);
  const { t } = useLanguage();
  
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    type: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await submitMessage({
        name: formState.name,
        email: formState.email,
        type: formState.type || "Other",
        message: formState.message,
      });
      setSubmitted(true);
    } catch (error) {
      console.error("Failed to submit message", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      ref={ref}
      className="relative overflow-hidden"
      style={{ backgroundColor: "#171513", padding: "120px 0 140px" }}
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <ImageWithFallback
          src="/images/contact.webp"
          alt="Contact Background"
          className="w-full h-full object-cover"
          style={{ objectPosition: "center", opacity: 0.2 }}
        />
        {/* Gradient overlays to ensure text and form readability */}
        <div 
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to right, #171513 0%, rgba(23,21,19,0.6) 50%, rgba(23,21,19,0.2) 100%)",
          }}
        />
        <div 
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to top, #171513 0%, transparent 20%, transparent 80%, #171513 100%)",
          }}
        />
      </div>

      <div className="max-w-[1400px] mx-auto px-8 md:px-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32">
          {/* Left: Info */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
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
              — {t("nav.contact")}
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(2.5rem, 4.5vw, 4rem)",
                fontWeight: 400,
                lineHeight: 1.1,
                color: "#FFFDF8",
                marginBottom: "2.5rem",
              }}
            >
              {t("contact.title")}
              <br />
              <em style={{ fontStyle: "italic", color: "#DED4C8" }}>{t("contact.titleHighlight")}</em>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div style={{ width: 40, height: 1, backgroundColor: "#6E655B", marginBottom: "2rem" }} />

              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.85rem",
                  lineHeight: 1.9,
                  color: "#B0A496",
                  fontWeight: 300,
                  marginBottom: "3rem",
                }}
              >
                {t("contact.desc")}
              </p>

              <div className="flex flex-col gap-6">
                <ContactDetail label="Email" value={artistInfo?.bookingEmail || ""} />
                <ContactDetail label="Phone" value={artistInfo?.phone || ""} />
                <ContactDetail label={t("contact.basedIn")} value={t("contact.basedInValue")} />
              </div>
            </motion.div>
          </div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.25 }}
          >
            {submitted ? (
              <div
                className="flex flex-col items-center justify-center h-full"
                style={{ minHeight: 480, textAlign: "center" }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    border: "1px solid rgba(255,255,255,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "1.5rem",
                  }}
                >
                  <Send size={20} color="#FFFDF8" />
                </div>
                <h3
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "2rem",
                    fontWeight: 400,
                    color: "#FFFDF8",
                    marginBottom: "1rem",
                  }}
                >
                  {t("contact.received")}
                </h3>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.8rem",
                    color: "#B0A496",
                    lineHeight: 1.8,
                  }}
                >
                  {t("contact.receivedDesc")}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                {/* Inquiry Type */}
                <div>
                  <label style={labelStyle}>{t("contact.type")}</label>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {inquiryTypes.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFormState((s) => ({ ...s, type }))}
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "0.65rem",
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          padding: "7px 14px",
                          background: formState.type === type ? "rgba(255,255,255,0.1)" : "transparent",
                          border: "1px solid",
                          borderColor: formState.type === type ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.1)",
                          color: formState.type === type ? "#FFFDF8" : "#A09588",
                          cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                      >
                        {t(`contact.type.${type.toLowerCase()}` as TranslationKey)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    label={t("contact.name")}
                    value={formState.name}
                    onChange={(v) => setFormState((s) => ({ ...s, name: v }))}
                    placeholder={t("contact.namePlaceholder")}
                  />
                  <FormField
                    label={t("contact.email")}
                    value={formState.email}
                    onChange={(v) => setFormState((s) => ({ ...s, email: v }))}
                    placeholder={t("contact.emailPlaceholder")}
                    type="email"
                  />
                </div>

                <div>
                  <label style={labelStyle}>{t("contact.message")}</label>
                  <textarea
                    value={formState.message}
                    onChange={(e) => setFormState((s) => ({ ...s, message: e.target.value }))}
                    placeholder={t("contact.messagePlaceholder")}
                    rows={5}
                    style={{
                      ...inputStyle,
                      resize: "none",
                      display: "block",
                      width: "100%",
                    }}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-3 mt-2"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.7rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "#11100F",
                    backgroundColor: "#FFFDF8",
                    border: "none",
                    padding: "16px 40px",
                    cursor: isSubmitting ? "wait" : "pointer",
                    transition: "opacity 0.25s",
                    alignSelf: "flex-start",
                    opacity: isSubmitting ? 0.7 : 1,
                  }}
                  onMouseEnter={(e) => { if (!isSubmitting) (e.currentTarget as HTMLButtonElement).style.opacity = "0.85"; }}
                  onMouseLeave={(e) => { if (!isSubmitting) (e.currentTarget as HTMLButtonElement).style.opacity = "1"; }}
                >
                  {isSubmitting ? t("contact.sending") : t("contact.send")} {!isSubmitting && <Send size={13} />}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

const labelStyle: React.CSSProperties = {
  fontFamily: "'Inter', sans-serif",
  fontSize: "0.62rem",
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: "#A09588",
  display: "block",
  marginBottom: "10px",
};

const inputStyle: React.CSSProperties = {
  fontFamily: "'Inter', sans-serif",
  fontSize: "0.82rem",
  color: "#E8E1D8",
  backgroundColor: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  padding: "14px 16px",
  outline: "none",
  width: "100%",
  transition: "border-color 0.2s",
};

function FormField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={inputStyle}
        required
        onFocus={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = "rgba(255,255,255,0.25)"; }}
        onBlur={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = "rgba(255,255,255,0.08)"; }}
      />
    </div>
  );
}

function ContactDetail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "0.6rem",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "#8A7F72",
          marginBottom: 4,
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "0.82rem",
          color: "#CDC1B3",
          fontWeight: 300,
        }}
      >
        {value}
      </p>
    </div>
  );
}
