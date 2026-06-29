import { useParams, useNavigate } from "react-router";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { ArrowLeft } from "lucide-react";

export function BlogDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const post = useQuery(api.blog.getById, { id: id as Id<"blogPosts"> });

  if (post === undefined) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
      </div>
    );
  }

  if (post === null) {
    return (
      <div style={styles.errorContainer}>
        <h2>Bài viết không tồn tại</h2>
        <button onClick={() => navigate("/media")} style={styles.backBtn}>
          Quay lại Media
        </button>
      </div>
    );
  }

  const dateStr = post.publishedAt 
    ? new Date(post.publishedAt).toLocaleDateString("vi-VN", { year: 'numeric', month: 'long', day: 'numeric' })
    : "Bản nháp";

  return (
    <div style={styles.container}>
      {post.coverUrl ? (
        <div style={styles.heroSection}>
          <img src={post.coverUrl} alt={post.title} style={styles.heroImage} />
          <div style={styles.heroOverlay}>
            <div style={styles.heroContent}>
              <button onClick={() => navigate("/media")} style={styles.backLinkHero}>
                <ArrowLeft size={16} /> Quay lại
              </button>
              <h1 style={styles.heroTitle}>{post.title}</h1>
              <div style={styles.metaHero}>
                <span>{dateStr}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div style={styles.contentWrapper}>
          <button onClick={() => navigate("/media")} style={styles.backLink}>
            <ArrowLeft size={16} /> Quay lại
          </button>
          <header style={styles.header}>
            <h1 style={styles.heroTitle}>{post.title}</h1>
            <div style={styles.meta}>
              <span>{dateStr}</span>
            </div>
          </header>
        </div>
      )}

      <div style={styles.contentWrapper}>
        {!post.coverUrl && <div style={{ marginTop: "20px" }} />}
        {/* The rich-text content rendered via dangerouslySetInnerHTML */}
        <article 
          className="blog-content"
          style={styles.article} 
          dangerouslySetInnerHTML={{ __html: post.content }} 
        />
      </div>

      {/* Scoped CSS for Blog Content to match the dark theme */}
      <style>{`
        .blog-content {
          font-family: 'Inter', sans-serif;
          font-size: 1.05rem;
          line-height: 1.8;
          color: #D1D5DB; /* light gray for dark mode */
        }
        .blog-content h1, .blog-content h2, .blog-content h3, .blog-content h4 {
          color: #F9FAFB; /* almost white for headings */
          font-weight: 600;
          margin-top: 2em;
          margin-bottom: 0.75em;
          line-height: 1.3;
        }
        .blog-content h1 { font-size: 2rem; }
        .blog-content h2 { font-size: 1.5rem; }
        .blog-content h3 { font-size: 1.25rem; }
        .blog-content p {
          margin-bottom: 1.25em;
        }
        .blog-content a {
          color: #E5E7EB;
          text-decoration: underline;
          text-underline-offset: 4px;
        }
        .blog-content a:hover {
          color: #FFFFFF;
        }
        .blog-content ul {
          list-style-type: disc;
          padding-left: 1.5em;
          margin-bottom: 1.25em;
        }
        .blog-content ol {
          list-style-type: decimal;
          padding-left: 1.5em;
          margin-bottom: 1.25em;
        }
        .blog-content li {
          margin-bottom: 0.5em;
        }
        .blog-content img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 2em 0;
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        }
        .blog-content blockquote {
          border-left: 4px solid #374151;
          padding-left: 1.25em;
          margin: 1.5em 0;
          color: #9CA3AF;
          font-style: italic;
        }
        .blog-content pre {
          background-color: #111827;
          border: 1px solid #374151;
          padding: 1em;
          border-radius: 6px;
          overflow-x: auto;
          margin-bottom: 1.25em;
          font-size: 0.9em;
        }
        .blog-content code {
          font-family: 'Courier New', Courier, monospace;
          background-color: #1F2937;
          padding: 0.2em 0.4em;
          border-radius: 4px;
          font-size: 0.9em;
        }
        .blog-content pre code {
          background-color: transparent;
          padding: 0;
        }
        .blog-content hr {
          border: 0;
          height: 1px;
          background: #374151;
          margin: 3em 0;
        }
        .blog-content ul[data-type="taskList"] {
          list-style: none;
          padding-left: 0;
        }
        .blog-content ul[data-type="taskList"] li {
          display: flex;
          align-items: flex-start;
          gap: 0.5em;
        }
        .blog-content ul[data-type="taskList"] li label {
          margin-top: 0.2em;
        }
      `}</style>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#030712", // match dark mode background
    color: "#E5E7EB",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  heroSection: {
    width: "100%",
    position: "relative",
    height: "60vh",
    minHeight: "400px",
    maxHeight: "600px",
  },
  heroImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  heroOverlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(to bottom, rgba(3,7,18,0.2) 0%, rgba(3,7,18,0.6) 50%, rgba(3,7,18,1) 100%)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: "40px",
  },
  heroContent: {
    width: "100%",
    maxWidth: "768px",
    padding: "0 24px",
    position: "relative",
  },
  backLinkHero: {
    background: "none",
    border: "none",
    color: "#D1D5DB",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "0.95rem",
    padding: "0",
    marginBottom: "24px",
    transition: "color 0.2s",
  },
  heroTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "3.5rem",
    fontWeight: 300,
    lineHeight: 1.1,
    color: "#FFFDF8",
    margin: "0 0 16px 0",
  },
  metaHero: {
    fontSize: "0.95rem",
    color: "#9CA3AF",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    fontFamily: "'Inter', sans-serif",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
  },
  contentWrapper: {
    width: "100%",
    maxWidth: "768px", // optimal reading width
    padding: "0 24px 60px 24px",
  },
  backLink: {
    background: "none",
    border: "none",
    color: "#9CA3AF",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "0.95rem",
    padding: "0",
    marginTop: "60px",
    marginBottom: "40px",
    transition: "color 0.2s",
  },
  header: {
    marginBottom: "40px",
  },
  meta: {
    fontSize: "0.95rem",
    color: "#9CA3AF",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    fontFamily: "'Inter', sans-serif",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
  },
  article: {
    // Styling handled by global CSS above to affect innerHTML
  },
  loadingContainer: {
    minHeight: "100vh",
    backgroundColor: "#030712",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "3px solid #1F2937",
    borderTopColor: "#E5E7EB",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  errorContainer: {
    minHeight: "100vh",
    backgroundColor: "#030712",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "#F9FAFB",
  },
  backBtn: {
    marginTop: "20px",
    padding: "10px 20px",
    backgroundColor: "#1F2937",
    color: "#FFF",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  }
};
