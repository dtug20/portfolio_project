import { createBrowserRouter } from "react-router";
import { Root } from "./Root";
import { Home } from "./pages/Home";
import { AboutPage } from "./pages/AboutPage";
import { MediaPage } from "./pages/MediaPage";
import { ServicesPage } from "./pages/ServicesPage";
import { ShowsPage } from "./pages/ShowsPage";

export const router = createBrowserRouter([
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
]);
