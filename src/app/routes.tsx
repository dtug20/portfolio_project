import { createBrowserRouter } from "react-router";
import { Root } from "./Root";
import { Home } from "./pages/Home";
import { AboutPage } from "./pages/AboutPage";
import { MediaPage } from "./pages/MediaPage";
import { ServicesPage } from "./pages/ServicesPage";
import { ShowsPage } from "./pages/ShowsPage";
import { AdminRoot } from "./admin/AdminRoot";

export const router = createBrowserRouter([
  // ── Public portfolio ─────────────────────────────────────
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "about", Component: AboutPage },
      { path: "media", Component: MediaPage },
      { path: "services", Component: ServicesPage },
      { path: "shows", Component: ShowsPage },
    ],
  },
  // ── Admin CRM ────────────────────────────────────────────
  {
    path: "/admin/*",
    Component: AdminRoot,
  },
]);
