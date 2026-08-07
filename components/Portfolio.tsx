import { BackToTop } from "./BackToTop";
import { GoldenParticles } from "./GoldenParticles";
import { Navbar } from "./Navbar";
import { Hero } from "./Hero";
import { Footer } from "./Footer";
import { ScrollProgress } from "./ScrollProgress";
import { Certifications } from "./sections/Certifications";
import { Contact } from "./sections/Contact";
import { DownloadResume } from "./sections/DownloadResume";
import { Experience } from "./sections/Experience";
import { FAQ } from "./sections/FAQ";
import { FeaturedProjects } from "./sections/FeaturedProjects";
import { Hackathons } from "./sections/Hackathons";
import { Journey } from "./sections/Journey";
import { OpenSource } from "./sections/OpenSource";
import { Skills } from "./sections/Skills";

export function Portfolio() {
  return (
    <div className="relative">
      <ScrollProgress />
      <GoldenParticles />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <FeaturedProjects />
        <Hackathons />
        <Experience />
        <Skills />
        <Journey />
        <OpenSource />
        <Certifications />
        <FAQ />
        <Contact />
        <DownloadResume />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
