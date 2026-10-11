import { Lightbulb, Users, Hammer } from "lucide-react";
import SectionHeading from "./SectionHeading.jsx";

const pillars = [
  {
    icon: Lightbulb,
    title: "Innovate",
    text: "Turn a simple thought into a clear, testable plan.",
  },
  {
    icon: Users,
    title: "Collaborate",
    text: "Work with designers, engineers and product people on your idea.",
  },
  {
    icon: Hammer,
    title: "Build",
    text: "Go from concept to a working product, one step at a time.",
  },
];

const steps = [
  { title: "Pick a service", text: "Browse the services and choose what fits." },
  { title: "Describe what you need", text: "Share your goals, details and a preferred deadline." },
  { title: "Pay securely", text: "Pay the fixed price. Work starts once it's confirmed." },
  { title: "We get to work", text: "Follow your order from your dashboard." },
];

export default function About() {
  return (
    <section id="about" className="scroll-mt-24 bg-brand/5">
      <div className="px-4 py-14 md:px-8 md:py-20">
        <SectionHeading
          label="Why IdeaX?"
          title={
            <>
              Where ideas meet <span className="text-brand">opportunity</span>
            </>
          }
          text="From a simple thought to a solution that can make an impact, IdeaX gives you the space to think, collaborate and create."
        />

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {pillars.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-2xl border border-gray-200 bg-white p-6"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-brand">
                <Icon size={24} />
              </span>
              <h3 className="mt-4 text-lg font-bold">{title}</h3>
              <p className="mt-2 text-sm text-gray-600">{text}</p>
            </div>
          ))}
        </div>

        <h3 className="mt-16 text-2xl font-extrabold">How it works</h3>
        <ol className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <li key={step.title} className="flex gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand font-bold text-white">
                {i + 1}
              </span>
              <div>
                <p className="font-bold">{step.title}</p>
                <p className="mt-1 text-sm text-gray-600">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}