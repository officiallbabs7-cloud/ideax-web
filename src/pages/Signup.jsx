import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { Mail, User } from "lucide-react";
import AuthLayout from "../components/layout/AuthLayout.jsx";
import Input from "../components/ui/Input.jsx";
import PasswordInput from "../components/ui/PasswordInput.jsx";
import Button from "../components/ui/Button.jsx";
import { useAuth } from "../hooks/useAuth.jsx";

const schema = z
  .object({
    name: z.string().min(2, "Enter your full name"),
    email: z.string().email("Enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirm: z.string().min(1, "Confirm your password"),
    agree: z
      .boolean()
      .refine((v) => v === true, {
        message: "Please accept the terms to continue",
      }),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { agree: false },
  });

  const onSubmit = async (data) => {
    try {
      await signup({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      toast.success("Welcome to IdeaX!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <AuthLayout
      prompt="Already have an account?"
      linkText="Log in"
      linkTo="/login"
    >
      <h1 className="text-2xl font-extrabold">Create your account</h1>
      <p className="mt-1 text-sm text-gray-500">
        Let's get you started on IdeaX. Fill in your details to join our growing
        community.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
        <Input
          label="Full Name*"
          icon={User}
          placeholder="Enter your full name"
          {...register("name")}
          error={errors.name?.message}
        />
        <Input
          label="Email Address*"
          type="email"
          icon={Mail}
          placeholder="Enter your email address"
          {...register("email")}
          error={errors.email?.message}
        />
        <PasswordInput
          label="Password*"
          placeholder="Create a password"
          hint="Password must be at least 8 characters long"
          {...register("password")}
          error={errors.password?.message}
        />
        <PasswordInput
          label="Confirm Password*"
          placeholder="Confirm your password"
          {...register("confirm")}
          error={errors.confirm?.message}
        />

        <div>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 accent-brand cursor-pointer"
              {...register("agree")}
            />
            <span>
              I agree to the{" "}
              <Link
                to="/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand hover:underline"
              >
                Terms of service
              </Link>{" "}
              and{" "}
              <Link
                to="/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand hover:underline"
              >
                Privacy policy
              </Link>
            </span>
          </label>
          {errors.agree && (
            <p className="mt-1 text-sm text-red-500">{errors.agree.message}</p>
          )}
        </div>

        <Button
          type="submit"
          loading={isSubmitting}
          className="w-full cursor-pointer"
        >
          Create Account
        </Button>
      </form>
    </AuthLayout>
  );
}
