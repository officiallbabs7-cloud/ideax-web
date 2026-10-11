import Navbar from "../components/layout/Navbar.jsx";
import Footer from "../components/layout/Footer.jsx";
import Hero from "../components/sections/Hero.jsx";
import ServicesOverview from "../components/sections/ServicesOverview.jsx";
import Features from "../components/sections/Features.jsx";
import Community from "../components/sections/Community.jsx";
import About from "../components/sections/About.jsx";
import Contact from "../components/sections/Contact.jsx";

export default function Landing() {
  return (
    <div>
      <Navbar />
      <Hero />
      <ServicesOverview />
      <Features />
      <Community />
      <About />
      <Contact />
      <Footer />
    </div>
  );
}