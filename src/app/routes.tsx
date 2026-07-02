import { createBrowserRouter } from "react-router";
import { Root } from "./Root";
import { Home } from "./pages/Home";

export const router = createBrowserRouter([
  // ── Public portfolio ─────────────────────────────────────
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "about", lazy: async () => ({ Component: (await import("./pages/AboutPage")).AboutPage }) },
      { path: "media", lazy: async () => ({ Component: (await import("./pages/MediaPage")).MediaPage }) },
      { path: "services", lazy: async () => ({ Component: (await import("./pages/ServicesPage")).ServicesPage }) },
      { path: "shows", lazy: async () => ({ Component: (await import("./pages/ShowsPage")).ShowsPage }) },
      { path: "blog/:id", lazy: async () => ({ Component: (await import("./pages/BlogDetailPage")).BlogDetailPage }) },
    ],
  },
  // ── Admin CRM ────────────────────────────────────────────
  {
    path: "/admin/*",
    lazy: async () => ({ Component: (await import("./admin/AdminRoot")).AdminRoot }),
  },
]);
