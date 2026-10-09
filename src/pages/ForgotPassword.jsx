import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Mail, MailCheck } from "lucide-react";
import AuthLayout from "../components/layout/AuthLayout.jsx";
import Input from "../components/ui/Input.jsx";
import Button from "../components/ui/Button.jsx";
import { forgotPassword } from "../lib/api.js";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
});

export default function ForgotPassword() {
  const [sentTo, setSentTo] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async ({ email }) => {
    try {
      await forgotPassword(email);
      // Same message whether or not the email has an account (protects users' privacy)
      setSentTo(email);
    } catch (err) {
      toast.error(err?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <AuthLayout
      prompt="Remembered your password?"
      linkText="Log in"
      linkTo="/login"
      eyebrow="Account help"
      headline={
        <>
          Let's get you <span className="text-brand">back in</span>
        </>
      }
      description="Enter your email and we'll send you a link to choose a new password."
    >
      {sentTo ? (
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-violet-100 text-brand">
            <MailCheck size={26} />
          </div>
          <h1 className="mt-4 text-2xl font-extrabold">Check your email</h1>
          <p className="mt-2 text-sm text-gray-600">
            If an account exists for{" "}
            <span className="font-semibold">{sentTo}</span>, we've sent a link
            to reset your password. The link expires in 1 hour. Check your spam
            folder if you don't see it.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Link
              to="/login"
              className="rounded-lg bg-brand px-5 py-3 font-semibold text-white hover:opacity-90"
            >
              Back to log in
            </Link>
            <button
              onClick={() => setSentTo("")}
              className="text-sm font-semibold text-brand hover:underline"
            >
              Use a different email
            </button>
          </div>
        </div>
      ) : (
        <>
          <h1 className="text-2xl font-extrabold">Forgot your password?</h1>
          <p className="mt-1 text-sm text-gray-500">
            No problem. Tell us the email you signed up with.
          </p>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
            <Input
              label="Email Address*"
              type="email"
              icon={Mail}
              placeholder="Enter your email address"
              {...register("email")}
              error={errors.email?.message}
            />
            <Button type="submit" loading={isSubmitting} className="w-full">
              Send reset link
            </Button>
          </form>
        </>
      )}
    </AuthLayout>
  );
}