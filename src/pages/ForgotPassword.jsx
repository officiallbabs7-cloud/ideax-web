import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useSearchParams } from "react-router-dom";
import { MailCheck } from "lucide-react";
import AuthLayout from "../components/layout/AuthLayout.jsx";
import Input from "../components/ui/Input.jsx";
import Button from "../components/ui/Button.jsx";
import { forgotPassword } from "../lib/api.js";

const schema = z.object({
  email: z
    .string()
    .min(1, "Enter your email address")
    .email("Enter a valid email address"),
});

// Route: /forgot-password (public). The login page links here as
// /forgot-password?email=... so the email the user typed is already filled in.
export default function ForgotPassword() {
  const [params] = useSearchParams();
  const [sentTo, setSentTo] = useState("");
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: params.get("email") ?? "" },
  });

  const onSubmit = async ({ email }) => {
    setServerError("");
    try {
      await forgotPassword(email.trim());
      setSentTo(email.trim());
    } catch (err) {
      setServerError(err?.message || "Could not send the reset link. Try again.");
    }
  };

  const layoutProps = {
    prompt: "Remembered your password?",
    linkText: "Log in",
    linkTo: "/login",
    eyebrow: "Account help",
    headline: (
      <>
        Reset your <span className="text-brand">password</span>
      </>
    ),
    description: "We'll email you a link to choose a new one.",
  };

  if (sentTo) {
    return (
      <AuthLayout {...layoutProps}>
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <MailCheck size={26} />
          </div>
          <h1 className="mt-4 text-2xl font-extrabold">Check your email</h1>
          <p className="mt-2 text-sm text-gray-600">
            If an account exists for{" "}
            <span className="font-semibold">{sentTo}</span>, we've sent a link
            to reset your password. It works for 1 hour. Nothing in your inbox?
            Check your spam folder.
          </p>
          <button
            type="button"
            onClick={() => setSentTo("")}
            className="mt-6 text-sm font-semibold text-brand underline"
          >
            Use a different email
          </button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout {...layoutProps}>
      <h1 className="text-2xl font-extrabold">Forgot your password?</h1>
      <p className="mt-1 text-sm text-gray-500">
        Enter the email you signed up with.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
        <Input
          label="Email address*"
          type="email"
          placeholder="you@example.com"
          {...register("email")}
          error={errors.email?.message}
        />

        {serverError && (
          <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {serverError}
          </p>
        )}

        <Button type="submit" loading={isSubmitting} className="w-full">
          Send reset link
        </Button>

        <p className="text-center text-sm text-gray-500">
          <Link to="/login" className="font-semibold text-brand">
            Back to log in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
