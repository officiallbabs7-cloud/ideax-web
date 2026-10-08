import { Link } from "react-router-dom";
import { Lightbulb } from "lucide-react";
import logo from "../../assets/logo.svg";
import iconCollaborate from "../../assets/icon-collaborate.svg";
import iconImpact from "../../assets/icon-impact.svg";
const features = [
  {
    image: iconCollaborate,
    title: "Collaborate",
    text: "Work with like-minded people and bring ideas to life.",
  },
  {
    Icon: Lightbulb,
    iconClass: "text-yellow-500",
    fill: "#FDE047",
    title: "Get Support",
    text: "Access resources, mentorship and feedback.",
  },
  {
    image: iconImpact,
    title: "Create Impact",
    text: "Turn your ideas into solutions that matter.",
  },
];

export default function AuthLayout({
  prompt,
  linkText,
  linkTo,
  eyebrow = "Join IdeaX",
  headline = (
    <>
      Turn your ideas
      <br />
      into real
      <br />
      <span className="text-brand">possibilities</span>
    </>
  ),
  description = "Join a community of creative minds, build amazing projects, and make an impact with your ideas.",
  children,
}) {
  return (
    <div className="flex min-h-screen flex-col bg-white lg:h-screen lg:overflow-hidden">
      {/* Header */}
      <header className="shrink-0 border-b border-gray-100 bg-white">
        <div className="flex h-20 items-center justify-between px-4 md:px-8 lg:h-18">
          <Link to="/">
            <img
              src={logo}
              alt="IdeaX"
              className="h-14 w-auto md:h-16 lg:h-14"
            />
          </Link>
          <div className="flex items-center gap-3 text-sm md:text-base">
            <span className="hidden text-brand sm:inline">{prompt}</span>
            <Link
              to={linkTo}
              className="rounded-lg border border-brand px-4 py-2 font-medium text-brand hover:bg-gray-50"
            >
              {linkText}
            </Link>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 bg-brand/5 lg:min-h-0">
        {/* Left panel (desktop only) */}
        <aside className="relative hidden shrink-0 flex-col justify-center overflow-hidden lg:flex lg:w-[46%] lg:pl-12 lg:pr-6 xl:pl-24">
          <p className="text-[15px] font-semibold uppercase text-brand">
            {eyebrow}
          </p>
          <h2 className="mt-2 max-w-85 text-[32px] font-bold leading-11">
            {headline}
          </h2>
          <p className="mt-3 max-w-82.5 text-[15px] leading-5 text-gray-500">
            {description}
          </p>

          <ul className="mt-10 space-y-5 2xl:mt-20">
            {features.map((item) => (
              <li key={item.title} className="flex items-center gap-5">
                {item.image ? (
                  <img src={item.image} alt="" className="h-15 w-15 shrink-0" />
                ) : (
                  <div
                    className={`flex h-15 w-15 shrink-0 items-center justify-center rounded-full bg-brand/20 ${
                      item.iconClass || "text-brand"
                    }`}
                  >
                    <item.Icon size={26} fill={item.fill || "none"} />
                  </div>
                )}
                <div>
                  <p className="text-[15px] font-semibold">{item.title}</p>
                  <p className="mt-0.5 max-w-47.5 text-sm leading-4 text-gray-500">
                    {item.text}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          {/* Decorative circles */}
          <div className="pointer-events-none absolute -bottom-10 -left-10 h-28 w-28 rounded-full bg-brand/20" />
          <div className="pointer-events-none absolute -bottom-6 left-6 h-24 w-24 rounded-full bg-brand/30" />
        </aside>

        {/* Form card */}
        <main className="flex flex-1 justify-center overflow-y-auto px-4 py-6 md:px-8 lg:w-[42%] lg:flex-none lg:px-0">
          <div className="my-auto w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8 lg:max-w-none">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
