import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout.jsx";
import StatusBadge from "../components/features/StatusBadge.jsx";
import Button from "../components/ui/Button.jsx";
import { getOrders } from "../lib/api.js";

const filters = [
  { key: "all", label: "All", match: () => true },
  { key: "pending", label: "Awaiting payment", match: (o) => o.status === "pending_payment" },
  { key: "active", label: "In progress", match: (o) => ["paid", "in_progress"].includes(o.status) },
  { key: "done", label: "Completed", match: (o) => o.status === "completed" },
  { key: "cancelled", label: "Cancelled", match: (o) => o.status === "cancelled" },
];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    getOrders()
      .then((res) => {
        if (!cancelled) setOrders(res.orders);
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message || "Could not load your orders.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const active = filters.find((f) => f.key === filter);
  const visible = orders.filter(active.match);

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl">
        <h1 className="text-2xl font-extrabold md:text-3xl">My Orders</h1>
        <p className="mt-1 text-gray-600">Everything you've requested, in one place.</p>

        <div className="mt-6 flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                filter === f.key
                  ? "bg-brand text-white"
                  : "border border-gray-200 bg-white text-gray-700 hover:border-brand"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading && <div className="mt-6 h-64 animate-pulse rounded-2xl bg-gray-200" />}

        {!loading && error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-red-600">{error}</p>
            <Button onClick={() => setReloadKey((k) => k + 1)} className="mt-4">
              Try again
            </Button>
          </div>
        )}

        {!loading && !error && visible.length === 0 && (
          <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-10 text-center">
            <p className="text-gray-600">
              {orders.length === 0
                ? "You haven't placed an order yet."
                : "No orders in this group."}
            </p>
            {orders.length === 0 && (
              <Link
                to="/services"
                className="mt-4 inline-block rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
              >
                Browse services
              </Link>
            )}
          </div>
        )}

        {!loading && !error && visible.length > 0 && (
          <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white">
            {visible.map((o) => (
              <Link
                key={o.id}
                to={`/orders/${o.id}`}
                className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-gray-100 px-5 py-4 first:border-t-0 hover:bg-gray-50"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{o.title}</p>
                  <p className="text-sm text-gray-500">
                    {o.serviceName} ·{" "}
                    {new Date(o.createdAt).toLocaleDateString("en-NG", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <StatusBadge status={o.status} />
                <p className="w-24 text-right font-bold">
                  ₦{o.price.toLocaleString()}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}