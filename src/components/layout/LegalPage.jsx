import { useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.svg";

export default function LegalPage({
  title,
  lastUpdated,
  intro,
  sections,
  otherLink,
}) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100">
        <div className="mx-auto flex h-20 max-w-4xl items-center justify-between px-4 md:px-8">
          <Link to="/">
            <img src={logo} alt="IdeaX" className="h-14 w-auto" />
          </Link>
          <Link
            to="/"
            className="text-sm font-medium text-brand hover:underline"
          >
            Back to IdeaX
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-10 md:px-8 md:py-14">
        <h1 className="text-3xl font-extrabold md:text-4xl">{title}</h1>
        <p className="mt-2 text-sm text-gray-500">Last updated: {lastUpdated}</p>
        {intro && <p className="mt-6 text-gray-700">{intro}</p>}

        <div className="mt-10 space-y-10">
          {sections.map((section, i) => (
            <section key={section.title}>
              <h2 className="text-xl font-bold">
                {i + 1}. {section.title}
              </h2>
              <div className="mt-3 space-y-3 text-gray-700">
                {section.blocks.map((block, j) =>
                  Array.isArray(block) ? (
                    <ul key={j} className="list-disc space-y-1 pl-6">
                      {block.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p key={j}>{block}</p>
                  )
                )}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-14 border-t border-gray-100 pt-6 text-sm">
          <Link
            to={otherLink.to}
            className="font-semibold text-brand hover:underline"
          >
            {otherLink.label}
          </Link>
        </div>
      </main>
    </div>
  );
}