import { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { Send } from "lucide-react";

const inquiryTypes = ["Booking", "Composition", "Production", "Education", "Press", "Other"];

export function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    type: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section
      id="contact"
      ref={ref}
      style={{ backgroundColor: "#111111", padding: "120px 0 140px" }}
    >
      <div className="max-w-[1400px] mx-auto px-8 md:px-16">
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
                color: "#555555",
                marginBottom: "4rem",
              }}
            >
              — Contact
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
                color: "#FFFFFF",
                marginBottom: "2.5rem",
              }}
            >
              Let's Create
              <br />
              <em style={{ fontStyle: "italic", color: "#AAAAAA" }}>Together</em>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div style={{ width: 40, height: 1, backgroundColor: "#333333", marginBottom: "2rem" }} />

              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.85rem",
                  lineHeight: 1.9,
                  color: "#666666",
                  fontWeight: 300,
                  marginBottom: "3rem",
                }}
              >
                For booking inquiries, commissioning projects, or press requests,
                reach out directly. All serious enquiries receive a personal response
                within 48 hours.
              </p>

              <div className="flex flex-col gap-6">
                <ContactDetail label="General Inquiries" value="hello@nguyenminh.asia" />
                <ContactDetail label="Booking & Management" value="booking@nguyenminh.asia" />
                <ContactDetail label="Press & Media" value="press@nguyenminh.asia" />
                <ContactDetail label="Based In" value="Hanoi, Vietnam · Available Worldwide" />
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
                  <Send size={20} color="#FFFFFF" />
                </div>
                <h3
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "2rem",
                    fontWeight: 400,
                    color: "#FFFFFF",
                    marginBottom: "1rem",
                  }}
                >
                  Message Received
                </h3>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.8rem",
                    color: "#666666",
                    lineHeight: 1.8,
                  }}
                >
                  Thank you for reaching out. I will be in touch within 48 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                {/* Inquiry Type */}
                <div>
                  <label style={labelStyle}>Inquiry Type</label>
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
                          color: formState.type === type ? "#FFFFFF" : "#555555",
                          cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    label="Full Name"
                    value={formState.name}
                    onChange={(v) => setFormState((s) => ({ ...s, name: v }))}
                    placeholder="Your name"
                  />
                  <FormField
                    label="Email Address"
                    value={formState.email}
                    onChange={(v) => setFormState((s) => ({ ...s, email: v }))}
                    placeholder="your@email.com"
                    type="email"
                  />
                </div>

                <div>
                  <label style={labelStyle}>Message</label>
                  <textarea
                    value={formState.message}
                    onChange={(e) => setFormState((s) => ({ ...s, message: e.target.value }))}
                    placeholder="Tell me about your project..."
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
                  className="flex items-center justify-center gap-3 mt-2"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.7rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "#0A0A0A",
                    backgroundColor: "#FFFFFF",
                    border: "none",
                    padding: "16px 40px",
                    cursor: "pointer",
                    transition: "opacity 0.25s",
                    alignSelf: "flex-start",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.85"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; }}
                >
                  Send Message <Send size={13} />
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
  color: "#555555",
  display: "block",
  marginBottom: "10px",
};

const inputStyle: React.CSSProperties = {
  fontFamily: "'Inter', sans-serif",
  fontSize: "0.82rem",
  color: "#CCCCCC",
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
          color: "#444444",
          marginBottom: 4,
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "0.82rem",
          color: "#888888",
          fontWeight: 300,
        }}
      >
        {value}
      </p>
    </div>
  );
}
