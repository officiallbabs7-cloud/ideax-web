import { Link } from "react-router-dom";
import logo from "../assets/Logo2.svg";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 text-center">
      <Link to="/">
        <img src={logo} alt="IdeaX" className="h-16 w-auto" />
      </Link>
      <p className="mt-10 text-sm font-bold uppercase text-brand">Error 404</p>
      <h1 className="mt-2 text-3xl font-extrabold md:text-4xl">
        We can't find that page
      </h1>
      <p className="mt-3 max-w-md text-gray-600">
        The page you're looking for may have moved or never existed.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          to="/"
          className="rounded-lg bg-brand px-6 py-3 font-semibold text-white hover:opacity-90"
        >
          Back to home
        </Link>
        <Link
          to="/dashboard"
          className="rounded-lg border border-brand px-6 py-3 font-semibold text-brand hover:bg-violet-50"
        >
          Go to dashboard
        </Link>
      </div>
    </div>
  );
}