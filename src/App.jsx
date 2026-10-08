import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Landing from "./pages/Landing.jsx";
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import Terms from "./pages/Terms.jsx";
import Privacy from "./pages/Privacy.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Services from "./pages/Services.jsx";
import Orders from "./pages/Orders.jsx";
import ComingSoon from "./pages/ComingSoon.jsx";
import ServiceDetail from "./pages/ServiceDetail.jsx";
import OrderSummary from "./pages/OrderSummary.jsx";
import PaymentCallback from "./pages/PaymentCallback.jsx";
import MockPaystack from "./pages/MockPaystack.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import { AuthProvider } from "./hooks/useAuth.jsx";

export default function App() {
  return (
    <AuthProvider>
      <Toaster richColors position="top-center" />
      <Routes>
        
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />

        
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:id" element={<ServiceDetail />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<OrderSummary />} />
          <Route path="/payment/callback" element={<PaymentCallback />} />
          <Route path="/mock-paystack" element={<MockPaystack />} />
          <Route path="/notifications" element={<ComingSoon title="Notifications" />} />
          <Route path="/settings" element={<ComingSoon title="Settings" />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}