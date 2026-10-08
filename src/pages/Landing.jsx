import Navbar from "../components/layout/Navbar.jsx";
import Hero from "../components/sections/Hero.jsx";
import SectionPlaceholder from "../components/sections/SectionPlaceholder.jsx";

export default function Landing() {
  return (
    <div>
      <Navbar />
      <Hero />
      <SectionPlaceholder id="features" title="Features" />
      <SectionPlaceholder id="community" title="Community" tint />
      <SectionPlaceholder id="about" title="About" />
      <SectionPlaceholder id="contact" title="Contact" tint />
    </div>
  );
}