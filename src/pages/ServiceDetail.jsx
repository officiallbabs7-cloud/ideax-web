import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout.jsx";
import Input from "../components/ui/Input.jsx";
import Textarea from "../components/ui/Textarea.jsx";
import Button from "../components/ui/Button.jsx";
import { getService, createOrder } from "../lib/api.js";

const todayString = () => new Date().toISOString().slice(0, 10);

const schema = z.object({
  title: z.string().min(3, "Give your request a short title"),
  description: z
    .string()
    .min(20, "Please describe what you need (at least 20 characters)"),
  deadline: z
    .string()
    .optional()
    .refine((value) => !value || value >= todayString(), {
      message: "The deadline can't be in the past",
    }),
});

export default function ServiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    getService(id)
      .then((res) => {
        if (!cancelled) setService(res.service);
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message || "Could not load this service.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  const onSubmit = async (data) => {
    try {
      const res = await createOrder({
        serviceId: service.id,
        title: data.title,
        description: data.description,
        deadline: data.deadline || null,
      });
      toast.success("Request saved. Review your order to continue.");
      navigate(`/orders/${res.order.id}`);
    } catch (err) {
      toast.error(err?.message || "Could not submit your request.");
    }
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-5xl">
        <Link
          to="/services"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-brand"
        >
          <ArrowLeft size={16} />
          Back to services
        </Link>

        {loading && (
          <div className="mt-6 h-72 animate-pulse rounded-2xl bg-gray-200" />
        )}

        {!loading && error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-red-600">{error}</p>
            <Link
              to="/dashboard"
              className="mt-4 inline-block font-semibold text-brand"
            >
              Go back to the dashboard
            </Link>
          </div>
        )}

        {!loading && !error && service && (
          <div className="mt-6 grid gap-6 lg:grid-cols-5">
            
            <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-6 lg:col-span-2">
              <p className="text-sm font-semibold uppercase text-brand">
                {service.category}
              </p>
              <h1 className="mt-2 text-2xl font-extrabold">{service.name}</h1>
              <p className="mt-3 text-gray-600">{service.description}</p>

              <div className="mt-6 rounded-xl bg-brand/5 p-4">
                <p className="text-sm text-gray-500">Fixed price</p>
                <p className="text-2xl font-extrabold text-brand">
                  ₦{service.price.toLocaleString()}
                </p>
              </div>

              <p className="mt-4 text-xs text-gray-500">
                You pay before work starts. Tell us what you need on the right,
                and you'll review your order before paying.
              </p>
            </aside>

            
            <section className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 lg:col-span-3">
              <h2 className="text-xl font-bold">Tell us what you need</h2>
              <p className="mt-1 text-sm text-gray-500">
                The more detail you give, the better we can help.
              </p>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="mt-6 space-y-5"
              >
                <Input
                  label="Request title*"
                  placeholder="e.g. Website for my bakery"
                  {...register("title")}
                  error={errors.title?.message}
                />
                <Textarea
                  label="Describe your request*"
                  placeholder="What do you want built or designed? Who is it for? Any examples or features you have in mind?"
                  {...register("description")}
                  error={errors.description?.message}
                />
                <Input
                  label="Preferred deadline (optional)"
                  type="date"
                  min={todayString()}
                  {...register("deadline")}
                  error={errors.deadline?.message}
                />

                <Button type="submit" loading={isSubmitting} className="w-full">
                  Continue to order summary
                </Button>
              </form>
            </section>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}