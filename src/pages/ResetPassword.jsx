import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, LinkIcon } from "lucide-react";
import AuthLayout from "../components/layout/AuthLayout.jsx";
import PasswordInput from "../components/ui/PasswordInput.jsx";
import Button from "../components/ui/Button.jsx";
import { resetPassword } from "../lib/api.js";

const schema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[a-z]/, "Add a lowercase letter")
      .regex(/[A-Z]/, "Add an uppercase letter")
      .regex(/[0-9]/, "Add a number"),
    confirm: z.string().min(1, "Confirm your new password"),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const email = params.get("email");
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async ({ password }) => {
    setServerError("");
    try {
      await resetPassword({ email, token, password });
      setDone(true);
    } catch (err) {
      setServerError(err?.message || "Could not reset your password.");
    }
  };

  const layoutProps = {
    prompt: "Remembered your password?",
    linkText: "Log in",
    linkTo: "/login",
    eyebrow: "Account help",
    headline: (
      <>
        Choose a <span className="text-brand">new password</span>
      </>
    ),
    description: "Pick something strong that you don't use anywhere else.",
  };

  if (!token || !email) {
    return (
      <AuthLayout {...layoutProps}>
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-700">
            <LinkIcon size={26} />
          </div>
          <h1 className="mt-4 text-2xl font-extrabold">This link isn't valid</h1>
          <p className="mt-2 text-sm text-gray-600">
            The reset link is incomplete or has already been used. Request a new
            one and try again.
          </p>
          <Link
            to="/forgot-password"
            className="mt-6 inline-block rounded-lg bg-brand px-5 py-3 font-semibold text-white hover:opacity-90"
          >
            Request a new link
          </Link>
        </div>
      </AuthLayout>
    );
  }

  if (done) {
    return (
      <AuthLayout {...layoutProps}>
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <CheckCircle2 size={26} />
          </div>
          <h1 className="mt-4 text-2xl font-extrabold">Password updated</h1>
          <p className="mt-2 text-sm text-gray-600">
            Your password has been changed. You can now log in with the new one.
          </p>
          <Link
            to="/login"
            className="mt-6 inline-block rounded-lg bg-brand px-5 py-3 font-semibold text-white hover:opacity-90"
          >
            Log in
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout {...layoutProps}>
      <h1 className="text-2xl font-extrabold">Reset your password</h1>
      <p className="mt-1 text-sm text-gray-500">
        For <span className="font-semibold">{email}</span>
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
        <PasswordInput
          label="New password*"
          placeholder="Create a new password"
          hint="At least 8 characters, with an uppercase letter, a lowercase letter and a number"
          {...register("password")}
          error={errors.password?.message}
        />
        <PasswordInput
          label="Confirm new password*"
          placeholder="Repeat the new password"
          {...register("confirm")}
          error={errors.confirm?.message}
        />

        {serverError && (
          <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {serverError}{" "}
            <Link to="/forgot-password" className="font-semibold underline">
              Request a new link
            </Link>
          </p>
        )}

        <Button type="submit" loading={isSubmitting} className="w-full">
          Update password
        </Button>
      </form>
    </AuthLayout>
  );
}