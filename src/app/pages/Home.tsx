import { useEffect } from "react";
import { useLocation } from "react-router";
import { Hero } from "../components/Hero";
import { UpcomingShows } from "../components/UpcomingShows";
import { About } from "../components/About";
import { Media } from "../components/Media";
import { Services } from "../components/Services";
import { Contact } from "../components/Contact";

export function Home() {
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.scrollTo) {
      const targetId = location.state.scrollTo;
      let lastY = -1;
      let stableCount = 0;
      
      const interval = setInterval(() => {
        const element = document.getElementById(targetId);
        if (element) {
          const currentY = element.getBoundingClientRect().top + window.scrollY;
          
          // If the position changed (due to dynamic content loading like Services)
          if (Math.abs(currentY - lastY) > 20) {
            element.scrollIntoView({ behavior: "smooth" });
            lastY = currentY;
            stableCount = 0;
          } else {
            stableCount++;
            // If stable for ~500ms, stop checking
            if (stableCount > 5) {
              clearInterval(interval);
            }
          }
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, [location.state]);

  return (
    <>
      <Hero />
      <About />
      <UpcomingShows />
      <Media />
      <Services />
      <Contact />
    </>
  );
}
