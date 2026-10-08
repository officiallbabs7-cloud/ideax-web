import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";

export default function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) return <p className="p-10 text-center">Loading...</p>;

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}