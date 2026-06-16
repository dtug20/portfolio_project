import { createRoot } from "react-dom/client";
import { ConvexProvider } from "convex/react";
import { convex } from "./lib/convexClient";
import App from "./app/App.tsx";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <ConvexProvider client={convex}>
    <App />
  </ConvexProvider>
);
