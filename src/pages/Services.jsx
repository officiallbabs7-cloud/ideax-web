import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout.jsx";
import ServiceCard from "../components/features/ServiceCard.jsx";
import Button from "../components/ui/Button.jsx";
import { getServices } from "../lib/api.js";

const categoryInfo = {
  "Software Engineering": "Build web and mobile products from the ground up.",
  "Product Design": "Design products that people love to use.",
  "Research and Development": "Explore and shape your ideas before you build them.",
  "Business Ventures": "Turn ideas into products and ventures that grow.",
};

export default function Services() {
  const [params] = useSearchParams();
  const q = (params.get("q") || "").trim();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    getServices()
      .then((res) => {
        if (!cancelled) setServices(res.services);
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message || "Could not load services.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const visible = q
    ? services.filter((s) =>
        [s.name, s.description, s.category]
          .join(" ")
          .toLowerCase()
          .includes(q.toLowerCase())
      )
    : services;

  const grouped = visible.reduce((groups, service) => {
    const key = service.category || "Other services";
    if (!groups[key]) groups[key] = [];
    groups[key].push(service);
    return groups;
  }, {});

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-6xl">
        <h1 className="text-2xl font-extrabold md:text-3xl">Services</h1>
        <p className="mt-1 text-gray-600">
          What do you need help with? Pick a service to get started.
        </p>

        {q && (
          <p className="mt-3 text-sm text-gray-600">
            Showing results for <span className="font-semibold">"{q}"</span>.{" "}
            <Link to="/services" className="font-semibold text-brand hover:underline">
              Clear
            </Link>
          </p>
        )}

        {loading && (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-56 animate-pulse rounded-2xl bg-gray-200" />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-red-600">{error}</p>
            <Button onClick={() => setReloadKey((k) => k + 1)} className="mt-4">
              Try again
            </Button>
          </div>
        )}

        {!loading && !error && visible.length === 0 && (
          <p className="mt-8 text-gray-500">No services match your search.</p>
        )}

        {!loading &&
          !error &&
          Object.entries(grouped).map(([category, items]) => (
            <section key={category} className="mt-10">
              <h2 className="text-xl font-bold">{category}</h2>
              {categoryInfo[category] && (
                <p className="mt-1 text-sm text-gray-500">{categoryInfo[category]}</p>
              )}
              <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            </section>
          ))}
      </div>
    </DashboardLayout>
  );
}