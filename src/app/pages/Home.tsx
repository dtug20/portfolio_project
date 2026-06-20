import { Hero } from "../components/Hero";
import { UpcomingShows } from "../components/UpcomingShows";
import { About } from "../components/About";
import { Media } from "../components/Media";
import { Services } from "../components/Services";
import { Contact } from "../components/Contact";

export function Home() {
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
