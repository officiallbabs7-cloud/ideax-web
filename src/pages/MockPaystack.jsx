import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import Button from "../components/ui/Button.jsx";
import { useAuth } from "../hooks/useAuth.jsx";
import { mockGetPaymentDetails, mockFinishPayment } from "../lib/api.js";

export default function MockPaystack() {
  const [params] = useSearchParams();
  const reference = params.get("reference");
  const navigate = useNavigate();
  const { user } = useAuth();
  const details = reference ? mockGetPaymentDetails(reference) : null;

  if (!details) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-100 px-4 text-center">
        <p className="text-gray-700">We couldn't find this payment.</p>
        <Link to="/dashboard" className="font-semibold text-brand">
          Back to dashboard
        </Link>
      </div>
    );
  }

  const { order } = details;

  const finish = (outcome) => {
    mockFinishPayment(reference, outcome);
    navigate(`/payment/callback?reference=${reference}`);
  };

  const cancel = () => {
    toast.info("Payment cancelled. You can try again when you're ready.");
    navigate(`/orders/${order.id}`);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-10">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-lg">
        <div className="bg-yellow-100 px-6 py-3 text-center text-xs font-semibold text-yellow-800">
          TEST MODE: this page only pretends to be the payment page, so we can
          test before the real Paystack is connected.
        </div>

        <div className="p-6 md:p-8">
          <p className="text-sm text-gray-500">Pay to IdeaX</p>
          <p className="mt-1 text-3xl font-extrabold">
            ₦{order.price.toLocaleString()}
          </p>

          <dl className="mt-5 space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-gray-500">Email</dt>
              <dd className="font-medium">{user?.email}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-gray-500">Order</dt>
              <dd className="font-medium">{order.id}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-gray-500">Service</dt>
              <dd className="font-medium">{order.serviceName}</dd>
            </div>
          </dl>

          <div className="mt-6 space-y-3">
            <Button className="w-full" onClick={() => finish("success")}>
              Pay ₦{order.price.toLocaleString()} (simulate success)
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => finish("failed")}
            >
              Simulate failed payment
            </Button>
            <button
              onClick={cancel}
              className="w-full text-sm font-medium text-gray-500 hover:text-brand"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}