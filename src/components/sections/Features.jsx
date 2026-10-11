import {
  Tag,
  FileText,
  ShieldCheck,
  ClipboardList,
  Mail,
  Smartphone,
} from "lucide-react";
import SectionHeading from "./SectionHeading.jsx";

const features = [
  {
    icon: Tag,
    title: "Fixed, upfront prices",
    text: "See the price before you order. No quotes to chase and no surprises.",
  },
  {
    icon: FileText,
    title: "Describe it your way",
    text: "Tell us what you need with a title, a description and a preferred deadline.",
  },
  {
    icon: ShieldCheck,
    title: "Secure payments",
    text: "Pay with Paystack. Work on your request starts once your payment is confirmed.",
  },
  {
    icon: ClipboardList,
    title: "Track every order",
    text: "Follow each request from payment to delivery in one dashboard.",
  },
  {
    icon: Mail,
    title: "Stay in the loop",
    text: "Get an email when your request is received, paid for and updated.",
  },
  {
    icon: Smartphone,
    title: "Works on any device",
    text: "Use IdeaX on your phone, tablet or laptop, wherever you are.",
  },
];

export default function Features() {
  return (
    <section id="features" className="scroll-mt-24 bg-brand/5">
      <div className="px-4 py-14 md:px-8 md:py-20">
        <SectionHeading
          label="Features"
          title="Everything you need to turn an idea into a project"
          text="A simple way to request, pay for and follow the work."
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-2xl border border-gray-200 bg-white p-6"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <Icon size={24} />
              </span>
              <h3 className="mt-4 text-lg font-bold">{title}</h3>
              <p className="mt-2 text-sm text-gray-600">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}