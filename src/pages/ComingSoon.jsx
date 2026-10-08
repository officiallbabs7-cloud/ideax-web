import { Link } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout.jsx";

export default function ComingSoon({ title }) {
  return (
    <DashboardLayout>
      <div className="mx-auto max-w-3xl rounded-2xl border border-gray-200 bg-white p-10 text-center">
        <h1 className="text-2xl font-extrabold">{title}</h1>
        <p className="mt-2 text-gray-600">This section is coming soon.</p>
        <Link
          to="/dashboard"
          className="mt-6 inline-block font-semibold text-brand hover:underline"
        >
          Back to dashboard
        </Link>
      </div>
    </DashboardLayout>
  );
}