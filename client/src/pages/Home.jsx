import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import FeatureStrip from "../components/landing/FeatureStrip";
import PlatformSection from "../components/landing/PlatformSection";
import Footer from "../components/landing/Footer";

function Home() {
  return (
    <div className="site">
      <Navbar />

      <main>
        <Hero />

        <FeatureStrip />

        <PlatformSection />
      </main>

      <Footer />
    </div>
  );
}

export default Home;