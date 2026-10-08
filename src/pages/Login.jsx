import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { Mail } from "lucide-react";
import AuthLayout from "../components/layout/AuthLayout.jsx";
import Input from "../components/ui/Input.jsx";
import PasswordInput from "../components/ui/PasswordInput.jsx";
import Button from "../components/ui/Button.jsx";
import { useAuth } from "../hooks/useAuth.jsx";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Enter your password"),
  remember: z.boolean().optional(),
});

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { remember: false },
  });

  const onSubmit = async (data) => {
    try {
      await login(data);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err?.message || "Invalid email or password");
    }
  };

  return (
    <AuthLayout
      prompt="Don't have an account?"
      linkText="Sign up"
      linkTo="/signup"
    >
      <h1 className="text-2xl font-extrabold">Welcome Back.</h1>
      <p className="mt-1 text-sm text-gray-500">
        Log in to your IdeaX account and continue your learning journey.
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
        <PasswordInput
          label="Password*"
          placeholder="Enter your password"
          {...register("password")}
          error={errors.password?.message}
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 accent-brand cursor-pointer"
              {...register("remember")}
            />
            Remember me
          </label>
          <button
            type="button"
            onClick={() => toast.info("Password reset is coming soon.")}
            className="text-sm font-medium text-brand hover:underline"
          >
            Forgot password?
          </button>
        </div>

        <Button type="submit" loading={isSubmitting} className="w-full cursor-pointer">
          Log In
        </Button>

        <p className="text-center text-sm text-gray-600">
          By logging in, you agree to our{" "}
          <Link
            to="/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand hover:underline"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            to="/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand hover:underline"
          >
            Privacy Policy
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}