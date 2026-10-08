import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sun, CloudSun, Moon } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout.jsx";
import StatusBadge from "../components/features/StatusBadge.jsx";
import Button from "../components/ui/Button.jsx";
import { useAuth } from "../hooks/useAuth.jsx";
import { getOrders, getServices } from "../lib/api.js";

const money = (n) => `₦${n.toLocaleString()}`;
const todayString = () => new Date().toISOString().slice(0, 10);

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12)
    return { text: "Good morning", Icon: Sun, color: "text-amber-300" };
  if (hour < 17)
    return { text: "Good afternoon", Icon: CloudSun, color: "text-orange-300" };
  return { text: "Good evening", Icon: Moon, color: "text-violet-200" };
}

export default function Dashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    Promise.all([getOrders(), getServices()])
      .then(([o, s]) => {
        if (cancelled) return;
        setOrders(o.orders);
        setServices(s.services);
      })
      .catch((err) => {
        if (!cancelled)
          setError(err?.message || "Could not load your dashboard.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const count = (...statuses) =>
    orders.filter((o) => statuses.includes(o.status)).length;

  const stats = [
    { label: "Total orders", value: orders.length, style: "bg-violet-100" },
    {
      label: "Awaiting payment",
      value: count("pending_payment"),
      style: "bg-yellow-100",
    },
    {
      label: "In progress",
      value: count("paid", "in_progress"),
      style: "bg-blue-100",
    },
    { label: "Completed", value: count("completed"), style: "bg-emerald-100" },
  ];

  const recent = orders.slice(0, 4);

  const deadlines = orders
    .filter(
      (o) =>
        o.deadline &&
        o.deadline >= todayString() &&
        !["completed", "cancelled"].includes(o.status),
    )
    .sort((a, b) => a.deadline.localeCompare(b.deadline))
    .slice(0, 3);

  const categories = Object.entries(
    services.reduce((acc, s) => {
      acc[s.category] = (acc[s.category] || 0) + 1;
      return acc;
    }, {}),
  );

  const firstName = user?.name?.split(" ")[0];
  const {
    text: greetingText,
    Icon: GreetingIcon,
    color: greetingColor,
  } = getGreeting();

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Welcome banner */}
        <div className="relative overflow-hidden rounded-2xl bg-[#2A1670] p-6 text-white md:p-8">
          <div className="absolute -right-14 -top-14 h-56 w-56 rounded-full bg-brand/60" />
          <div className="absolute -bottom-16 right-24 h-32 w-32 rounded-full bg-amber-500/80" />
          <h1 className="relative flex items-center gap-3 text-2xl font-extrabold md:text-3xl">
            {greetingText}, {firstName}
            <GreetingIcon size={30} className={greetingColor} />
          </h1>
          <p className="relative mt-2 text-violet-200">
            Ready to turn your next idea into reality?
          </p>
          <Link
            to="/services"
            className="relative mt-5 inline-block rounded-lg bg-white px-5 py-3 text-sm font-bold text-[#2A1670] hover:bg-violet-50"
          >
            Request a service
          </Link>
        </div>

        {loading && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-24 animate-pulse rounded-2xl bg-gray-200"
                />
              ))}
            </div>
            <div className="h-64 animate-pulse rounded-2xl bg-gray-200" />
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-red-600">{error}</p>
            <Button onClick={() => setReloadKey((k) => k + 1)} className="mt-4">
              Try again
            </Button>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label} className={`rounded-2xl p-5 ${s.style}`}>
                  <p className="text-sm font-semibold">{s.label}</p>
                  <p className="mt-2 text-3xl font-extrabold">{s.value}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
              <div className="min-w-0 space-y-6">
                {/* Recent orders */}
                <section className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold">Recent orders</h2>
                    {orders.length > 0 && (
                      <Link
                        to="/orders"
                        className="text-sm font-bold text-brand hover:underline"
                      >
                        View all
                      </Link>
                    )}
                  </div>

                  {recent.length === 0 ? (
                    <div className="py-8 text-center">
                      <p className="text-gray-600">
                        You haven't placed an order yet.
                      </p>
                      <Link
                        to="/services"
                        className="mt-4 inline-block rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
                      >
                        Browse services
                      </Link>
                    </div>
                  ) : (
                    <div className="mt-2">
                      {recent.map((o) => (
                        <Link
                          key={o.id}
                          to={`/orders/${o.id}`}
                          className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-gray-100 py-4 first:border-t-0 hover:bg-gray-50"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-semibold">{o.title}</p>
                            <p className="text-sm text-gray-500">
                              {o.serviceName}
                            </p>
                          </div>
                          <StatusBadge status={o.status} />
                          <p className="w-24 text-right font-bold">
                            {money(o.price)}
                          </p>
                        </Link>
                      ))}
                    </div>
                  )}
                </section>

                <section className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6">
                  <h2 className="text-lg font-bold">Browse services</h2>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {categories.map(([category, total]) => (
                      <Link
                        key={category}
                        to={`/services?q=${encodeURIComponent(category)}`}
                        className="flex items-center justify-between rounded-xl bg-violet-50 p-4 hover:bg-violet-100"
                      >
                        <div>
                          <p className="font-semibold">{category}</p>
                          <p className="text-sm text-gray-500">
                            {total} {total === 1 ? "service" : "services"}
                          </p>
                        </div>
                        <ArrowRight size={18} className="text-brand" />
                      </Link>
                    ))}
                  </div>
                </section>
              </div>

              <div className="space-y-6">
                
                <section className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6">
                  <h2 className="text-lg font-bold">Quick actions</h2>
                  <div className="mt-4 space-y-3">
                    <Link
                      to="/services"
                      className="flex items-center justify-between rounded-xl bg-violet-50 p-4 text-sm font-semibold hover:bg-violet-100"
                    >
                      Request a service <ArrowRight size={16} />
                    </Link>
                    <Link
                      to="/orders"
                      className="flex items-center justify-between rounded-xl bg-violet-50 p-4 text-sm font-semibold hover:bg-violet-100"
                    >
                      View my orders <ArrowRight size={16} />
                    </Link>
                  </div>
                </section>

                <section className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6">
                  <h2 className="text-lg font-bold">Upcoming deadlines</h2>
                  {deadlines.length === 0 ? (
                    <p className="mt-3 text-sm text-gray-500">
                      No upcoming deadlines.
                    </p>
                  ) : (
                    <div className="mt-3">
                      {deadlines.map((o) => {
                        const date = new Date(`${o.deadline}T12:00:00`);
                        return (
                          <Link
                            key={o.id}
                            to={`/orders/${o.id}`}
                            className="flex items-center gap-3 border-t border-gray-100 py-3 first:border-t-0"
                          >
                            <div className="w-12 rounded-lg bg-violet-100 py-1.5 text-center leading-tight">
                              <p className="text-lg font-extrabold">
                                {date.toLocaleDateString("en-NG", {
                                  day: "numeric",
                                })}
                              </p>
                              <p className="text-[11px] font-semibold">
                                {date.toLocaleDateString("en-NG", {
                                  month: "short",
                                })}
                              </p>
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold">
                                {o.title}
                              </p>
                              <p className="text-xs text-gray-500">
                                {o.serviceName}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </section>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
