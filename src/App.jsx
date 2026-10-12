import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import Landing from "./pages/Landing.jsx";
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import Terms from "./pages/Terms.jsx";
import Privacy from "./pages/Privacy.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Services from "./pages/Services.jsx";
import Orders from "./pages/Orders.jsx";
import ServiceDetail from "./pages/ServiceDetail.jsx";
import OrderSummary from "./pages/OrderSummary.jsx";
import PaymentCallback from "./pages/PaymentCallback.jsx";
import MockPaystack from "./pages/MockPaystack.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import { AuthProvider } from "./hooks/useAuth.jsx";
import Notifications from "./pages/Notifications.jsx";
import SettingsPage from "./pages/Settings.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import NotFound from "./pages/NotFound.jsx";

// TEMPORARY: the backend currently sends users back to /YOUR_ROUTE after paying.
// This forwards them to the real payment result page and keeps the reference.
// Remove it once the backend uses /payment/callback.
function PaymentRedirect() {
  const { search } = useLocation();
  return <Navigate to={`/payment/callback${search}`} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <Toaster richColors position="top-center" />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />

        <Route path="/YOUR_ROUTE" element={<PaymentRedirect />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:id" element={<ServiceDetail />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<OrderSummary />} />
          <Route path="/payment/callback" element={<PaymentCallback />} />
          <Route path="/mock-paystack" element={<MockPaystack />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}
