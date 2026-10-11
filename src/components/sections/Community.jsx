import { Link } from "react-router-dom";
import SectionHeading from "./SectionHeading.jsx";
import { useAuth } from "../../hooks/useAuth.jsx";

const audiences = [
  {
    title: "Founders and startups",
    text: "Test your idea and build a first version without assembling a full team.",
  },
  {
    title: "Small businesses",
    text: "Get a website, an app or a better user experience without the hiring headache.",
  },
  {
    title: "Creators and teams",
    text: "Bring in design, engineering or product skills exactly when you need them.",
  },
];

export default function Community() {
  const { user } = useAuth();

  return (
    <section id="community" className="scroll-mt-24 bg-white">
      <div className="px-4 py-14 md:px-8 md:py-20">
        <SectionHeading
          label="Community"
          title="Built for people with ideas"
          text="Whether you're just starting out or scaling up, IdeaX gives you a team to turn ideas into real projects."
        />

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {audiences.map((a) => (
            <div
              key={a.title}
              className="rounded-2xl border border-gray-200 p-6"
            >
              <h3 className="text-lg font-bold">{a.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{a.text}</p>
            </div>
          ))}
        </div>

        <div className="relative mt-10 overflow-hidden rounded-2xl bg-[#2A1670] p-8 text-white md:p-12">
          <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-brand/60" />
          <div className="absolute -bottom-14 right-24 h-28 w-28 rounded-full bg-amber-500/80" />
          <h3 className="relative text-2xl font-extrabold md:text-3xl">
            Ready to start your first project?
          </h3>
          <p className="relative mt-2 max-w-xl text-violet-200">
            Create an account in a minute, pick a service and tell us what you
            need.
          </p>
          <div className="relative mt-6 flex flex-col gap-3 sm:flex-row">
            {user ? (
              <Link
                to="/dashboard"
                className="rounded-lg bg-white px-6 py-3 text-center font-bold text-[#2A1670] hover:bg-violet-50"
              >
                Go to dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="rounded-lg bg-white px-6 py-3 text-center font-bold text-[#2A1670] hover:bg-violet-50"
                >
                  Get started
                </Link>
                <Link
                  to="/login"
                  className="rounded-lg border border-white/60 px-6 py-3 text-center font-bold text-white hover:bg-white/10"
                >
                  Log in
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}