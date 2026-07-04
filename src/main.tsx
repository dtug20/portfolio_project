import { createRoot } from "react-dom/client";
import { ConvexProvider } from "convex/react";
import { convex } from "./lib/convexClient";
import App from "./app/App.tsx";
import "./styles/index.css";

import { LanguageProvider } from "./app/contexts/LanguageContext";

createRoot(document.getElementById("root")!).render(
  <ConvexProvider client={convex}>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </ConvexProvider>
);
