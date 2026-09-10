import { Outlet, useLocation } from "react-router";
import { useEffect } from "react";
import { Navigation } from "./components/Navigation";
import { Footer } from "./components/Footer";
import pages from "../seo/pages.json";

export function Root() {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname.replace(/\/+$/, "") || "/";
    const page = pages[path as keyof typeof pages];
    const url = `https://nguyenminh.asia${path}`;
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", url);
    const title = page?.title ?? "Bài viết | Nguyễn Nhật Minh";
    const description = page?.description ?? "Bài viết về âm nhạc và thiết kế âm thanh của Nguyễn Nhật Minh.";
    document.title = title;
    for (const key of ["title", "description", "og:title", "og:description", "og:url", "twitter:title", "twitter:description", "twitter:url"]) {
      const value = key.endsWith("url") ? url : key.endsWith("title") ? title : description;
      document.querySelector(`meta[name="${key}"], meta[property="${key}"]`)?.setAttribute("content", value);
    }
  }, [location.pathname]);

  useEffect(() => {
    const scrollTarget = (location.state as { scrollTo?: string } | null)?.scrollTo;

    if (scrollTarget) {
      // Coming from a sub-page nav click — scroll to the target section after mount
      const attempt = (tries = 0) => {
        const el = document.getElementById(scrollTarget);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        } else if (tries < 10) {
          setTimeout(() => attempt(tries + 1), 80);
        }
      };
      attempt();
    } else {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [location.pathname, location.key]);

  return (
    <div
      style={{
        backgroundColor: "#11100F",
        minHeight: "100vh",
        color: "#FFFDF8",
        fontFamily: "'Inter', sans-serif",
        overflowX: "hidden",
      }}
    >
      <style>{`
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #11100F; }
        ::-webkit-scrollbar-thumb { background: #514A42; border-radius: 2px; }
        ::-webkit-scrollbar-thumb:hover { background: #776D62; }
        ::selection { background: rgba(255,255,255,0.15); color: #FFFDF8; }
        input::placeholder, textarea::placeholder {
          color: #6E655B;
          font-family: 'Inter', sans-serif;
          font-size: 0.82rem;
        }
        input:focus, textarea:focus {
          outline: none;
          border-color: rgba(255,255,255,0.25) !important;
        }
        button { font-family: 'Inter', sans-serif; }
        .group:hover .group-hover\\:text-white { color: #FFFDF8 !important; }
        .group:hover .group-hover\\:opacity-100 { opacity: 1 !important; }
        .group:hover .group-hover\\:w-full { width: 100% !important; }
      `}</style>

      <Navigation />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
