import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Search } from "lucide-react";
import logo from "../../assets/logo.svg";
import useScrollSpy from "../../hooks/useScrollSpy.js";

const links = [
  { label: "Home", id: "home" },
  { label: "Features", id: "features" },
  { label: "Community", id: "community" },
  { label: "About", id: "about" },
  { label: "Contact", id: "contact" },
];

const sectionIds = links.map((link) => link.id);

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const active = useScrollSpy(sectionIds, 120);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <nav className="flex items-center justify-between px-4 md:px-8 h-24">
        {/* Logo + links */}
        <div className="flex items-center gap-10 lg:gap-16">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="IdeaX" className="h-16 md:h-20 w-auto" />
          </Link>

          <ul className="hidden md:flex items-center gap-8 text-base font-semibold">
            {links.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  className={`pb-1 border-b-2 transition-colors hover:text-brand ${
                    active === link.id
                      ? "border-brand"
                      : "border-transparent"
                  }`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-4">
          <button aria-label="Search" className="p-2 hover:text-brand">
            <Search size={20} />
          </button>
          <Link
            to="/login"
            className="px-4 py-2 text-sm font-medium rounded-lg border border-brand text-brand hover:bg-gray-50"
          >
            Log in
          </Link>
          <Link
            to="/signup"
            className="px-4 py-2 text-sm font-medium rounded-lg bg-brand text-white hover:opacity-90"
          >
            Get started
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          aria-label="Toggle menu"
          className="md:hidden p-2"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-4">
          <ul className="space-y-3 font-semibold">
            {links.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  onClick={() => setOpen(false)}
                  className={`block py-1 hover:text-brand ${
                    active === link.id ? "text-brand" : ""
                  }`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex gap-3">
            <Link
              to="/login"
              className="flex-1 text-center px-4 py-3 rounded-lg border border-brand text-brand font-medium"
            >
              Log in
            </Link>
            <Link
              to="/signup"
              className="flex-1 text-center px-4 py-3 rounded-lg bg-brand text-white font-medium"
            >
              Get started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}