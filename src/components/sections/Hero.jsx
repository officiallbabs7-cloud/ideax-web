import { Link } from "react-router-dom";
import { Play } from "lucide-react";

export default function Hero() {
  return (
    <section id="home" className="scroll-mt-24 bg-brand/10">
      <div className="px-4 md:px-8 py-8 md:py-10">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand/20 px-4 py-2 text-sm font-bold text-brand">
            Innovate
            <Play size={10} fill="currentColor" />
            Collaborate
            <Play size={10} fill="currentColor" />
            Build
          </span>

          <h1 className="mt-4 text-4xl md:text-5xl font-extrabold leading-[1.05]">
            Ideas Start
            <span className="block text-brand">Here.</span>
          </h1>

          <p className="mt-3 text-lg md:text-xl font-bold">
            Turn bold ideas into real possibilities.
          </p>

          <p className="mt-2 max-w-md text-sm md:text-base text-gray-700">
            IdeaX is a creative innovation platform where ideas are shared,
            explored, refined, and transformed into meaningful solutions.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center min-w-44 px-6 py-3 rounded-lg border border-brand bg-brand text-white text-base md:text-lg font-semibold hover:opacity-90"
            >
              Share an idea
            </Link>
            <a
              href="#features"
              className="inline-flex items-center justify-center min-w-44 px-6 py-3 rounded-lg border border-brand bg-white text-brand text-base md:text-lg font-semibold hover:bg-gray-50"
            >
              Explore ideas
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}