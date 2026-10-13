import { Link } from "react-router-dom";
import Logo from "../../assets/logo.png";

const linkClass = "text-violet-200 hover:text-white";

export default function Footer() {
  return (
    <footer className="bg-[#1E1245] text-white">
      <div className="grid gap-10 px-4 py-12 md:grid-cols-4 md:px-8">
        <div className="md:col-span-2">
          
          <img src={Logo} alt="IdeaX Labs" className="h-10 w-auto brightness-0 invert" />
          
          <p className="mt-3 max-w-sm text-sm text-violet-200">
            Turn bold ideas into real possibilities. Pick a service, tell us what
            you need and follow the work from one place.
          </p>
        </div>

        <div>
          <p className="font-bold">Explore</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><a href="#features" className={linkClass}>Features</a></li>
            <li><a href="#community" className={linkClass}>Community</a></li>
            <li><a href="#about" className={linkClass}>About</a></li>
            <li><a href="#contact" className={linkClass}>Contact</a></li>
          </ul>
        </div>

        <div>
          <p className="font-bold">Legal</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link to="/terms" className={linkClass}>Terms of Service</Link></li>
            <li><Link to="/privacy" className={linkClass}>Privacy Policy</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-5 text-sm text-violet-200 md:px-8">
        &copy; {new Date().getFullYear()} IdeaX. All rights reserved.
      </div>
    </footer>
  );
}