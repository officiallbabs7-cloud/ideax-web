import { useEffect, useState } from "react";
import { getNotifications } from "../../lib/api.js";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Layers,
  ClipboardList,
  Bell,
  Settings,
  Search,
  Menu,
  X,
  LogOut,
  Infinity as InfinityIcon,
} from "lucide-react";
import Logo2 from "../../assets/Logo2.svg";
import { useAuth } from "../../hooks/useAuth.jsx";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/services", label: "Services", icon: Layers },
  { to: "/orders", label: "My Orders", icon: ClipboardList },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/settings", label: "Settings", icon: Settings },
];

function SidebarContent({ onNavigate, unread = 0 }) {
  return (
    <div className="flex h-full flex-col">
      <Link
        to="/dashboard"
        onClick={onNavigate}
        className="flex h-20 shrink-0 items-center justify-center border-b border-gray-100 bg-white"
      >
        <img src={Logo2} alt="IdeaX" className="h-16 w-auto" />
      </Link>

      <nav className="flex-1 space-y-1 px-4 pt-6">
        {nav.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                isActive
                  ? "bg-brand text-white"
                  : "text-violet-200 hover:bg-white/10"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={18} />
                {label}
                {to === "/notifications" && unread > 0 && (
                  <span
                    className={`ml-auto rounded-full px-2 py-0.5 text-xs font-bold ${
                      isActive ? "bg-white text-brand" : "bg-brand text-white"
                    }`}
                  >
                    {unread}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-6 py-6">
        <InfinityIcon size={36} strokeWidth={2} className="text-white" />
        <p className="mt-4 text-sm font-bold leading-snug text-white">
          Big ideas
          <br />
          start here.
        </p>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
    const [unread, setUnread] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const load = () =>
      getNotifications()
        .then((res) => {
          if (!cancelled)
            setUnread(res.notifications.filter((n) => !n.read).length);
        })
        .catch(() => {});
    load();
    window.addEventListener("notifications-updated", load);
    return () => {
      cancelled = true;
      window.removeEventListener("notifications-updated", load);
    };
  }, []);
  const initial = user?.name?.charAt(0)?.toUpperCase() || "U";

  const onSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/services?q=${encodeURIComponent(q)}` : "/services");
  };

  return (
    <div className="min-h-screen bg-[#F6F4FD]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 bg-[#1E1245] lg:block">
        <SidebarContent unread={unread} />
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-64 bg-[#1E1245]">
            <button
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="absolute right-3 top-6 z-10 rounded-lg bg-gray-100 p-2 text-gray-700 hover:bg-gray-200"
            >
              <X size={20} />
            </button>
            <SidebarContent unread={unread} onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}

      <div className="lg:pl-60">
        <header className="sticky top-0 z-20 flex h-20 items-center gap-3 border-b border-gray-100 bg-white px-4 md:px-8">
          <button
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            className="rounded-lg p-2 hover:bg-gray-100 lg:hidden"
          >
            <Menu size={22} />
          </button>
          <Link to="/dashboard" className="lg:hidden">
            <img src={Logo2} alt="IdeaX" className="h-10 w-auto" />
          </Link>

          <form
            onSubmit={onSearch}
            className="relative hidden max-w-md flex-1 sm:block"
          >
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search services"
              aria-label="Search services"
              className="w-full rounded-full border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-brand"
            />
          </form>

          <div className="ml-auto flex items-center gap-3">
            <div className="hidden text-right leading-tight md:block">
              <p className="text-sm font-semibold">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand font-semibold text-white">
              {initial}
            </div>
            <button
              onClick={logout}
              aria-label="Log out"
              title="Log out"
              className="rounded-lg border border-gray-200 p-2 hover:border-brand hover:text-brand"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        <main className="px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}
