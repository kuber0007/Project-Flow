import { useEffect } from "react";

import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import FeatureStrip from "../components/landing/FeatureStrip";
import PlatformSection from "../components/landing/PlatformSection";
import Footer from "../components/landing/Footer";

function Home() {
  useEffect(() => {
    document.title = "ProjectFlow | Project Management for Modern Teams";

    const description = document.querySelector(
      'meta[name="description"]'
    );

    if (description) {
      description.setAttribute(
        "content",
        "ProjectFlow helps modern teams manage projects, tasks, deadlines, and collaboration in one place."
      );
    }
  }, []);

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <FeatureStrip />
        <PlatformSection />
      </main>
      <Footer />
    </>
  );
}

export default Home;
