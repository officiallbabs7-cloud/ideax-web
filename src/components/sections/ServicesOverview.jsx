import { Link } from "react-router-dom";
import { Code, PenTool, Lightbulb, Rocket, ArrowRight } from "lucide-react";
import SectionHeading from "./SectionHeading.jsx";
import { useAuth } from "../../hooks/useAuth.jsx";

const categories = [
  {
    name: "Software Engineering",
    icon: Code,
    text: "Websites, web apps, mobile apps and the backend systems behind them.",
  },
  {
    name: "Product Design",
    icon: PenTool,
    text: "UI/UX design and user flows that make your product easy to use.",
  },
  {
    name: "Research and Development",
    icon: Lightbulb,
    text: "Design thinking and ideation to shape an idea before you build it.",
  },
  {
    name: "Business Ventures",
    icon: Rocket,
    text: "Product management and startup development to launch and grow.",
  },
];

export default function ServicesOverview() {
  const { user } = useAuth();

  return (
    <section id="services" className="scroll-mt-24 bg-white">
      <div className="px-4 py-14 md:px-8 md:py-16">
        <SectionHeading
          label="What we help with"
          title="Pick a service, get it done"
        />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map(({ name, icon: Icon, text }) => (
            <Link
              key={name}
              to={user ? `/services?q=${encodeURIComponent(name)}` : "/signup"}
              className="group flex flex-col rounded-2xl border border-gray-200 p-6 transition hover:border-brand hover:shadow-lg"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <Icon size={24} />
              </span>
              <h3 className="mt-4 text-lg font-bold">{name}</h3>
              <p className="mt-2 flex-1 text-sm text-gray-600">{text}</p>
              <span className="mt-4 flex items-center gap-1 text-sm font-semibold text-brand">
                {user ? "View services" : "Get started"}
                <ArrowRight
                  size={16}
                  className="transition group-hover:translate-x-1"
                />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}