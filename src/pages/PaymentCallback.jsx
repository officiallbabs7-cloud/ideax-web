import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout.jsx";
import { verifyPayment } from "../lib/api.js";

const CHECK_EVERY_MS = 4000;
const MAX_CHECKS = 15; // about one minute

const linkBase =
  "inline-flex items-center justify-center rounded-lg px-5 py-3 font-medium";

export default function PaymentCallback() {
  const [params] = useSearchParams();
  // Paystack sends back both "reference" and "trxref"
  const reference = params.get("reference") || params.get("trxref");

  const [result, setResult] = useState(
    reference
      ? { phase: "verifying" }
      : { phase: "error", message: "No payment reference was found." }
  );

  useEffect(() => {
    if (!reference) return;

    let cancelled = false;
    let timer;
    let checks = 0;

    const check = async () => {
      try {
        const res = await verifyPayment(reference);
        if (cancelled) return;

        if (res.status === "success") {
          setResult({ phase: "success", order: res.order });
        } else if (res.status === "failed") {
          setResult({ phase: "failed", order: res.order });
        } else if (checks < MAX_CHECKS) {
          checks += 1;
          timer = setTimeout(check, CHECK_EVERY_MS);
        } else {
          setResult({ phase: "pending", order: res.order });
        }
      } catch (err) {
        if (!cancelled) {
          setResult({
            phase: "error",
            message: err?.message || "We couldn't check your payment.",
          });
        }
      }
    };

    check();

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [reference]);

  const { phase, order, message } = result;
  const orderLink = order ? `/orders/${order.id}` : "/dashboard";

  const details = order && (
    <dl className="mt-6 space-y-3 rounded-xl bg-gray-50 p-4 text-left text-sm">
      <div className="flex justify-between gap-4">
        <dt className="text-gray-500">Order</dt>
        <dd className="font-semibold">{order.id}</dd>
      </div>
      <div className="flex justify-between gap-4">
        <dt className="text-gray-500">Service</dt>
        <dd className="font-semibold">{order.serviceName}</dd>
      </div>
      <div className="flex justify-between gap-4">
        <dt className="text-gray-500">Amount</dt>
        <dd className="font-semibold">₦{order.price.toLocaleString()}</dd>
      </div>
      <div className="flex justify-between gap-4">
        <dt className="text-gray-500">Reference</dt>
        <dd className="font-semibold">{reference}</dd>
      </div>
    </dl>
  );

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-xl">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
          {phase === "verifying" && (
            <>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand/10 text-brand">
                <Loader2 size={32} className="animate-spin" />
              </div>
              <h1 className="mt-5 text-2xl font-extrabold">
                Confirming your payment...
              </h1>
              <p className="mt-2 text-gray-600">
                Please don't close or refresh this page.
              </p>
            </>
          )}

          {phase === "success" && (
            <>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                <CheckCircle2 size={32} />
              </div>
              <h1 className="mt-5 text-2xl font-extrabold">
                Payment successful
              </h1>
              <p className="mt-2 text-gray-600">
                Thank you! Work on your request starts now. You'll also get a
                confirmation email.
              </p>
              {details}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link
                  to={orderLink}
                  className={`${linkBase} bg-brand text-white hover:opacity-90`}
                >
                  View order
                </Link>
                <Link
                  to="/dashboard"
                  className={`${linkBase} border border-brand text-brand hover:bg-gray-50`}
                >
                  Back to dashboard
                </Link>
              </div>
            </>
          )}

          {phase === "failed" && (
            <>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
                <XCircle size={32} />
              </div>
              <h1 className="mt-5 text-2xl font-extrabold">Payment failed</h1>
              <p className="mt-2 text-gray-600">
                Your payment didn't go through. You can try again. If you think
                you were charged, contact us and quote the reference below.
              </p>
              {details}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link
                  to={orderLink}
                  className={`${linkBase} bg-brand text-white hover:opacity-90`}
                >
                  Try again
                </Link>
                <Link
                  to="/dashboard"
                  className={`${linkBase} border border-brand text-brand hover:bg-gray-50`}
                >
                  Back to dashboard
                </Link>
              </div>
            </>
          )}

          {phase === "pending" && (
            <>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
                <Clock size={32} />
              </div>
              <h1 className="mt-5 text-2xl font-extrabold">
                We're still confirming your payment
              </h1>
              <p className="mt-2 text-gray-600">
                This is taking longer than usual. If your payment went through,
                we'll email you as soon as it's confirmed, so please don't pay
                again. You can check your order status below.
              </p>
              {details}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link
                  to={orderLink}
                  className={`${linkBase} bg-brand text-white hover:opacity-90`}
                >
                  View order
                </Link>
              </div>
            </>
          )}

          {phase === "error" && (
            <>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
                <AlertTriangle size={32} />
              </div>
              <h1 className="mt-5 text-2xl font-extrabold">
                Something went wrong
              </h1>
              <p className="mt-2 text-gray-600">{message}</p>
              <div className="mt-6">
                <Link
                  to="/dashboard"
                  className={`${linkBase} bg-brand text-white hover:opacity-90`}
                >
                  Back to dashboard
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}