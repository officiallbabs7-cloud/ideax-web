import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  CheckCircle2,
  ClipboardList,
  CalendarClock,
  User,
  BellOff,
  XCircle,
  Clock,
} from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout.jsx";
import Button from "../components/ui/Button.jsx";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../lib/api.js";

const types = {
  payment: { icon: CheckCircle2, style: "bg-emerald-100 text-emerald-700" },
  order: { icon: ClipboardList, style: "bg-violet-100 text-brand" },
  deadline: { icon: CalendarClock, style: "bg-amber-100 text-amber-700" },
  account: { icon: User, style: "bg-violet-100 text-brand" },
  payment_failed: { icon: XCircle, style: "bg-red-100 text-red-700" },
  status: { icon: Clock, style: "bg-blue-100 text-blue-700" },
};

const filters = [
  { key: "all", label: "All", match: () => true },
  { key: "unread", label: "Unread", match: (n) => !n.read },
  {
    key: "orders",
    label: "Orders",
    match: (n) => ["order", "deadline"].includes(n.type),
  },
  { key: "payments", label: "Payments", match: (n) => n.type === "payment" },
    {
    key: "orders",
    label: "Orders",
    match: (n) => ["order", "deadline", "status"].includes(n.type),
  },
  {
    key: "payments",
    label: "Payments",
    match: (n) => ["payment", "payment_failed"].includes(n.type),
  },
];

const startOfDay = (d) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

function groupLabel(dateString) {
  const diff = Math.round(
    (startOfDay(new Date()) - startOfDay(new Date(dateString))) / 86400000
  );
  if (diff <= 0) return "Today";
  if (diff === 1) return "Yesterday";
  return "Earlier";
}

function timeLabel(dateString) {
  const d = new Date(dateString);
  if (groupLabel(dateString) === "Earlier") {
    return d.toLocaleDateString("en-NG", { day: "numeric", month: "short" });
  }
  return d.toLocaleTimeString("en-NG", { hour: "numeric", minute: "2-digit" });
}

export default function Notifications() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    getNotifications()
      .then((res) => {
        if (!cancelled) setItems(res.notifications);
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message || "Could not load notifications.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const unread = items.filter((n) => !n.read).length;
  const active = filters.find((f) => f.key === filter);
  const visible = items.filter(active.match);

  const groups = ["Today", "Yesterday", "Earlier"]
    .map((label) => ({
      label,
      rows: visible.filter((n) => groupLabel(n.createdAt) === label),
    }))
    .filter((g) => g.rows.length > 0);

  const openNotification = async (n, to) => {
    if (!n.read) {
      setItems((prev) =>
        prev.map((x) => (x.id === n.id ? { ...x, read: true } : x))
      );
      try {
        await markNotificationRead(n.id);
        window.dispatchEvent(new Event("notifications-updated"));
      } catch {
        
      }
    }
    navigate(to);
  };

  const markAll = async () => {
    setItems((prev) => prev.map((x) => ({ ...x, read: true })));
    try {
      await markAllNotificationsRead();
      window.dispatchEvent(new Event("notifications-updated"));
    } catch {
      toast.error("Could not update your notifications.");
      setReloadKey((k) => k + 1);
    }
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold md:text-3xl">Notifications</h1>
            <p className="mt-1 text-gray-600">
              Updates about your orders and payments.
            </p>
          </div>
          <button
            onClick={markAll}
            disabled={unread === 0}
            className="rounded-full border border-brand px-4 py-2 text-sm font-semibold text-brand hover:bg-violet-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Mark all as read
          </button>
        </div>

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
              {f.key === "unread" && unread > 0 ? ` (${unread})` : ""}
            </button>
          ))}
        </div>

        {loading && (
          <div className="mt-6 h-72 animate-pulse rounded-2xl bg-gray-200" />
        )}

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
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-violet-100 text-brand">
              <BellOff size={26} />
            </div>
            <h2 className="mt-4 text-lg font-bold">You're all caught up</h2>
            <p className="mt-1 text-sm text-gray-600">
              {filter === "all"
                ? "New updates about your orders will show up here."
                : "Nothing in this group right now."}
            </p>
          </div>
        )}

        {!loading && !error && visible.length > 0 && (
          <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white">
            {groups.map((group) => (
              <div key={group.label}>
                <p className="border-t border-gray-100 px-5 pb-2 pt-4 text-xs font-bold uppercase tracking-wide text-gray-500 first:border-t-0">
                  {group.label}
                </p>
                {group.rows.map((n) => {
                  const type = types[n.type] || types.order;
                  const Icon = type.icon;
                  const target = n.orderId
                    ? { to: `/orders/${n.orderId}`, label: "View order" }
                    : { to: "/services", label: "Browse services" };

                  return (
                    <button
                      key={n.id}
                      onClick={() => openNotification(n, target.to)}
                      className={`flex w-full items-start gap-4 border-t border-gray-100 px-5 py-4 text-left transition hover:bg-gray-50 ${
                        n.read ? "bg-white" : "bg-violet-50"
                      }`}
                    >
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${type.style}`}
                      >
                        <Icon size={20} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span
                          className={`block ${n.read ? "font-semibold" : "font-bold"}`}
                        >
                          {n.title}
                        </span>
                        <span className="mt-0.5 block text-sm text-gray-600">
                          {n.message}
                        </span>
                        <span className="mt-2 block text-sm font-bold text-brand">
                          {target.label}
                        </span>
                      </span>
                      <span className="flex shrink-0 flex-col items-end gap-2 text-xs text-gray-500">
                        {timeLabel(n.createdAt)}
                        {!n.read && (
                          <span className="h-2 w-2 rounded-full bg-brand" />
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}