import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Mail, User } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout.jsx";
import Input from "../components/ui/Input.jsx";
import PasswordInput from "../components/ui/PasswordInput.jsx";
import Button from "../components/ui/Button.jsx";
import Switch from "../components/ui/Switch.jsx";
import ConfirmDialog from "../components/ui/ConfirmDialog.jsx";
import { useAuth } from "../hooks/useAuth.jsx";
import {
  updateProfile,
  changePassword,
  getEmailPreferences,
  updateEmailPreferences,
  deleteAccount,
} from "../lib/api.js";

const card = "rounded-2xl border border-gray-200 bg-white p-6 md:p-8";

/* ---------- Profile ---------- */
const profileSchema = z.object({
  name: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email address"),
});

function ProfileCard() {
  const { user, updateUser } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name || "", email: user?.email || "" },
  });

  const onSubmit = async (data) => {
    try {
      const res = await updateProfile(data);
      updateUser(res.user);
      reset({ name: res.user.name, email: res.user.email });
      toast.success("Profile updated.");
    } catch (err) {
      toast.error(err?.message || "Could not update your profile.");
    }
  };

  const initial = user?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <section className={card}>
      <h2 className="text-lg font-bold">Profile</h2>
      <p className="mt-1 text-sm text-gray-500">
        Your name and the email we use to sign you in.
      </p>

      <div className="mt-5 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand text-2xl font-bold text-white">
          {initial}
        </div>
        <div className="min-w-0">
          <p className="truncate font-bold">{user?.name}</p>
          <p className="truncate text-sm text-gray-500">{user?.email}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-5">
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Full name"
            icon={User}
            {...register("name")}
            error={errors.name?.message}
          />
          <Input
            label="Email address"
            type="email"
            icon={Mail}
            hint="Used to sign in and to send order emails."
            {...register("email")}
            error={errors.email?.message}
          />
        </div>
        <div className="mt-5 flex justify-end">
          <Button type="submit" loading={isSubmitting} disabled={!isDirty}>
            Save changes
          </Button>
        </div>
      </form>
    </section>
  );
}

/* ---------- Password ---------- */
const passwordSchema = z
  .object({
    current: z.string().min(1, "Enter your current password"),
    next: z.string().min(8, "Password must be at least 8 characters"),
    confirm: z.string().min(1, "Confirm your new password"),
  })
  .refine((d) => d.next === d.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  })
  .refine((d) => d.next !== d.current, {
    message: "Choose a password different from your current one",
    path: ["next"],
  });

function PasswordCard() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(passwordSchema) });

  const onSubmit = async (data) => {
    try {
      await changePassword({
        currentPassword: data.current,
        newPassword: data.next,
      });
      reset();
      toast.success("Your password has been updated.");
    } catch (err) {
      toast.error(err?.message || "Could not update your password.");
    }
  };

  return (
    <section className={card}>
      <h2 className="text-lg font-bold">Password</h2>
      <p className="mt-1 text-sm text-gray-500">
        Choose a password you don't use anywhere else.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
        <PasswordInput
          label="Current password"
          placeholder="Enter your current password"
          {...register("current")}
          error={errors.current?.message}
        />
        <div className="grid gap-4 md:grid-cols-2">
          <PasswordInput
            label="New password"
            placeholder="Create a new password"
            hint="At least 8 characters long."
            {...register("next")}
            error={errors.next?.message}
          />
          <PasswordInput
            label="Confirm new password"
            placeholder="Repeat the new password"
            {...register("confirm")}
            error={errors.confirm?.message}
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit" loading={isSubmitting}>
            Update password
          </Button>
        </div>
      </form>
    </section>
  );
}

/* ---------- Email notifications ---------- */
const emailRows = [
  {
    key: "orderUpdates",
    label: "Order updates",
    text: "When your request is submitted, starts or is completed.",
  },
  {
    key: "payments",
    label: "Payment confirmations",
    text: "Receipts and payment status. These are always sent.",
    locked: true,
  },
  {
    key: "deadlineReminders",
    label: "Deadline reminders",
    text: "A reminder 3 days before your preferred deadline.",
  },
];

function EmailCard() {
  const [prefs, setPrefs] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    getEmailPreferences()
      .then((res) => {
        if (!cancelled) setPrefs(res.preferences);
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message || "Could not load your preferences.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const toggle = async (key, value) => {
    const previous = prefs;
    const next = { ...prefs, [key]: value };
    setPrefs(next);
    try {
      await updateEmailPreferences(next);
      toast.success("Preference saved.");
    } catch (err) {
      setPrefs(previous);
      toast.error(err?.message || "Could not save your preference.");
    }
  };

  return (
    <section className={card}>
      <h2 className="text-lg font-bold">Email notifications</h2>
      <p className="mt-1 text-sm text-gray-500">
        Choose which emails you get from IdeaX.
      </p>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      {!prefs && !error && (
        <div className="mt-4 h-40 animate-pulse rounded-xl bg-gray-100" />
      )}

      {prefs && (
        <div className="mt-3">
          {emailRows.map((row, i) => (
            <div
              key={row.key}
              className={`flex items-center gap-4 py-4 ${
                i > 0 ? "border-t border-gray-100" : ""
              }`}
            >
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{row.label}</p>
                <p className="mt-0.5 text-sm text-gray-500">{row.text}</p>
              </div>
              <Switch
                label={row.label}
                checked={row.locked ? true : prefs[row.key]}
                disabled={row.locked}
                onChange={(value) => toggle(row.key, value)}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

/* ---------- Delete account ---------- */
function DeleteCard() {
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState("");
  const [deleting, setDeleting] = useState(false);

  const close = () => {
    setOpen(false);
    setTyped("");
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteAccount();
      // A full reload clears everything from memory and signs the user out
      window.location.assign("/");
    } catch (err) {
      toast.error(err?.message || "Could not delete your account.");
      setDeleting(false);
    }
  };

  return (
    <section className="rounded-2xl border border-red-200 bg-white p-6 md:p-8">
      <h2 className="text-lg font-bold text-red-700">Delete account</h2>
      <p className="mt-1 text-sm text-gray-600">
        Permanently delete your account and personal details. Order and payment
        records are kept for accounting, as explained in our{" "}
        <Link
          to="/privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-brand hover:underline"
        >
          Privacy Policy
        </Link>
        .
      </p>
      <button
        onClick={() => setOpen(true)}
        className="mt-4 rounded-lg border border-red-600 px-5 py-3 text-sm font-semibold text-red-600 hover:bg-red-50"
      >
        Delete account
      </button>

      <ConfirmDialog
        open={open}
        title="Delete your account?"
        message="This permanently deletes your account and personal details, and it can't be undone. Order and payment records are kept for accounting."
        confirmText="Delete my account"
        cancelText="Keep my account"
        loading={deleting}
        confirmDisabled={typed.trim() !== "DELETE"}
        onConfirm={handleDelete}
        onCancel={close}
      >
        <label className="mt-4 block text-sm font-semibold">
          Type <span className="font-bold">DELETE</span> to confirm
          <input
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            autoComplete="off"
            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 font-normal outline-none focus:ring-2 focus:ring-brand"
          />
        </label>
      </ConfirmDialog>
    </section>
  );
}

/* ---------- Page ---------- */
export default function Settings() {
  return (
    <DashboardLayout>
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold md:text-3xl">Settings</h1>
          <p className="mt-1 text-gray-600">
            Manage your account and how we contact you.
          </p>
        </div>

        <ProfileCard />
        <PasswordCard />
        <EmailCard />
        <DeleteCard />
      </div>
    </DashboardLayout>
  );
}