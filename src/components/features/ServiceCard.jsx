import { Link } from "react-router-dom";
import {
  Code,
  Monitor,
  Server,
  Smartphone,
  PenTool,
  Lightbulb,
  ClipboardList,
  Rocket,
  ArrowRight,
} from "lucide-react";

const icons = {
  code: Code,
  monitor: Monitor,
  server: Server,
  mobile: Smartphone,
  pen: PenTool,
  lightbulb: Lightbulb,
  clipboard: ClipboardList,
  rocket: Rocket,
};

export default function ServiceCard({ service }) {
  const Icon = icons[service.icon] || Code;

  return (
    <Link
      to={`/services/${service.id}`}
      className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-6 transition hover:border-brand hover:shadow-lg"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand">
        <Icon size={24} />
      </div>
      <h3 className="mt-4 text-lg font-bold">{service.name}</h3>
      <p className="mt-2 flex-1 text-sm text-gray-600">{service.description}</p>

      <div className="mt-5 flex items-end justify-between border-t border-gray-100 pt-4">
        <div>
          <p className="text-xs text-gray-500">Fixed price</p>
          <p className="text-lg font-extrabold">
            ₦{service.price.toLocaleString()}
          </p>
        </div>
        <span className="flex items-center gap-1 text-sm font-semibold text-brand">
          Select
          <ArrowRight
            size={16}
            className="transition group-hover:translate-x-1"
          />
        </span>
      </div>
    </Link>
  );
}