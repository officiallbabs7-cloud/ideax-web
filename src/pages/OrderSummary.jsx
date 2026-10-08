import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout.jsx";
import Button from "../components/ui/Button.jsx";
import ConfirmDialog from "../components/ui/ConfirmDialog.jsx";
import StatusBadge from "../components/features/StatusBadge.jsx";
import {
  getOrder,
  initializePayment,
  cancelOrder,
  deleteOrder,
} from "../lib/api.js";

export default function OrderSummary() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paying, setPaying] = useState(false);
  const [dialog, setDialog] = useState(null); // "cancel" | "delete" | null
  const [working, setWorking] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    getOrder(id)
      .then((res) => {
        if (!cancelled) setOrder(res.order);
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message || "Could not load this order.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handlePay = async () => {
    setPaying(true);
    try {
      const res = await initializePayment(order.id);
      window.location.href = res.authorizationUrl;
    } catch (err) {
      toast.error(err?.message || "Could not start the payment. Please try again.");
      setPaying(false);
    }
  };

  const handleCancel = async () => {
    setWorking(true);
    try {
      const res = await cancelOrder(order.id);
      setOrder(res.order || { ...order, status: "cancelled" });
      setDialog(null);
      toast.success("Your order has been cancelled.");
    } catch (err) {
      toast.error(err?.message || "Could not cancel this order.");
    } finally {
      setWorking(false);
    }
  };

  const handleDelete = async () => {
    setWorking(true);
    try {
      await deleteOrder(order.id);
      toast.success("Order deleted.");
      navigate("/orders");
    } catch (err) {
      toast.error(err?.message || "Could not delete this order.");
      setWorking(false);
    }
  };

  const isPaid =
    order && !["pending_payment", "cancelled"].includes(order.status);
  const isActive = order && ["paid", "in_progress"].includes(order.status);

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-3xl">
        <Link
          to="/orders"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-brand"
        >
          <ArrowLeft size={16} />
          Back to my orders
        </Link>

        {loading && (
          <div className="mt-6 h-72 animate-pulse rounded-2xl bg-gray-200" />
        )}

        {!loading && error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {!loading && !error && order && (
          <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm text-gray-500">Order {order.id}</p>
                <h1 className="mt-1 text-2xl font-extrabold">Order summary</h1>
              </div>
              <StatusBadge status={order.status} />
            </div>

            <dl className="mt-6 space-y-5">
              <div>
                <dt className="text-sm text-gray-500">Service</dt>
                <dd className="font-semibold">{order.serviceName}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Request title</dt>
                <dd className="font-semibold">{order.title}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Your description</dt>
                <dd className="whitespace-pre-wrap text-gray-700">
                  {order.description}
                </dd>
              </div>
              {order.deadline && (
                <div>
                  <dt className="text-sm text-gray-500">Preferred deadline</dt>
                  <dd className="font-semibold">
                    {new Date(`${order.deadline}T12:00:00`).toLocaleDateString(
                      "en-NG",
                      { day: "numeric", month: "long", year: "numeric" }
                    )}
                  </dd>
                </div>
              )}
            </dl>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 pt-6">
              <div>
                <p className="text-sm text-gray-500">
                  {isPaid ? "Amount paid" : "Total"}
                </p>
                <p className="text-3xl font-extrabold text-brand">
                  ₦{order.price.toLocaleString()}
                </p>
              </div>

              {order.status === "pending_payment" && (
                <div className="flex flex-col items-end gap-2">
                  <Button onClick={handlePay} loading={paying} className="px-8">
                    Pay now
                  </Button>
                  <button
                    onClick={() => setDialog("cancel")}
                    className="text-sm font-medium text-gray-500 hover:text-red-600"
                  >
                    Cancel order
                  </button>
                </div>
              )}

              {order.status === "cancelled" && (
                <button
                  onClick={() => setDialog("delete")}
                  className="rounded-lg border border-red-300 px-5 py-3 font-medium text-red-600 hover:bg-red-50"
                >
                  Delete order
                </button>
              )}
            </div>

            {order.status === "pending_payment" && (
              <p className="mt-4 text-xs text-gray-500">
                You'll be taken to a secure payment page. Work on your request
                starts once payment is confirmed.
              </p>
            )}

            {order.status === "cancelled" && (
              <p className="mt-4 rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
                This order was cancelled. You can delete it, or place a new
                order from the Services page.
              </p>
            )}

            {isActive && (
              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-3 rounded-xl bg-green-50 p-4 text-sm text-green-800">
                  <CheckCircle2 size={20} className="mt-0.5 shrink-0" />
                  <p>
                    Payment received. Work on your request has been scheduled,
                    and you'll hear from us by email.
                  </p>
                </div>
                <p className="text-xs text-gray-500">
                  Need to cancel or change something? Contact support and quote
                  order {order.id}. Cancellations and refunds follow our{" "}
                  <Link
                    to="/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand hover:underline"
                  >
                    Terms of Service
                  </Link>
                  .
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={dialog === "cancel"}
        title="Cancel this order?"
        message="Your request will be cancelled and you won't be charged. You can delete it afterwards, or place a new order any time."
        confirmText="Yes, cancel order"
        cancelText="Keep order"
        loading={working}
        onConfirm={handleCancel}
        onCancel={() => setDialog(null)}
      />
      <ConfirmDialog
        open={dialog === "delete"}
        title="Delete this order?"
        message="This removes the order from your account. It can't be undone."
        confirmText="Delete order"
        cancelText="Keep it"
        loading={working}
        onConfirm={handleDelete}
        onCancel={() => setDialog(null)}
      />
    </DashboardLayout>
  );
}