import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Mail, CreditCard, KeyRound } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout.jsx";
import Button from "../components/ui/Button.jsx";
import { useAuth } from "../hooks/useAuth.jsx";
import { forgotPassword } from "../lib/api.js";
import { LEGAL } from "../lib/legal.js";

const card = "rounded-2xl border border-gray-200 bg-white p-6 md:p-8";
const ready = (value) => Boolean(value) && !value.startsWith("[");

const mailto = (subject, body) =>
  `mailto:${LEGAL.email}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;

/* ---------- Profile (read only) ---------- */
function ProfileCard() {
  const { user } = useAuth();
  const initial = user?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <section className={card}>
      <h2 className="text-lg font-bold">Profile</h2>
      <p className="mt-1 text-sm text-gray-500">The details on your account.</p>

      <div className="mt-5 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand text-2xl font-bold text-white">
          {initial}
        </div>
        <div className="min-w-0">
          <p className="truncate font-bold">{user?.name}</p>
          <p className="truncate text-sm text-gray-500">{user?.email}</p>
        </div>
      </div>

      <p className="mt-5 text-sm text-gray-600">
        Need to change your name or sign-in email?{" "}
        {ready(LEGAL.email) ? (
          <a
            href={mailto(
              "Change my IdeaX account details",
              `Hello, please update my account (${user?.email}).\n\nWhat I'd like changed:\n`
            )}
            className="font-semibold text-brand hover:underline"
          >
           Ideax.419@gmail.com
          </a>
        ) : (
          "Please contact support."
        )}
      </p>
    </section>
  );
}

/* ---------- Password: sends the real reset link ---------- */
function PasswordCard() {
  const { user } = useAuth();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const send = async () => {
    if (!user?.email) return;
    setSending(true);
    try {
      await forgotPassword(user.email);
      setSent(true);
      toast.success(`We've sent a reset link to ${user.email}.`);
      // Allow another email after a minute
      timer.current = setTimeout(() => setSent(false), 60000);
    } catch (err) {
      toast.error(err?.message || "Could not send the email. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section className={card}>
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
          <KeyRound size={20} />
        </span>
        <div>
          <h2 className="text-lg font-bold">Password</h2>
          <p className="mt-1 text-sm text-gray-500">
            To change your password, we'll email a secure link to{" "}
            <span className="font-semibold text-gray-700">{user?.email}</span>.
            The link works for 1 hour. Check your spam folder if you don't see
            it.
          </p>
        </div>
      </div>

      <div className="mt-5 flex justify-end">
        <Button onClick={send} loading={sending} disabled={sent}>
          {sent ? "Link sent. Check your inbox" : "Email me a reset link"}
        </Button>
      </div>
    </section>
  );
}

/* ---------- Emails we really send ---------- */
const emails = [
  {
    icon: Mail,
    label: "Request received",
    text: "Sent when you submit a request, with a link to review and pay.",
  },
  {
    icon: CreditCard,
    label: "Payment confirmation",
    text: "Your receipt, sent once your payment goes through.",
  },
  {
    icon: KeyRound,
    label: "Password reset",
    text: "Sent only when you ask for a reset link.",
  },
];

function EmailCard() {
  const { user } = useAuth();

  return (
    <section className={card}>
      <h2 className="text-lg font-bold">Emails you'll get from IdeaX</h2>
      <p className="mt-1 text-sm text-gray-500">
        We send these to {user?.email}. We don't send marketing emails.
      </p>

      <div className="mt-3">
        {emails.map(({ icon: Icon, label, text }, i) => (
          <div
            key={label}
            className={`flex items-center gap-4 py-4 ${
              i > 0 ? "border-t border-gray-100" : ""
            }`}
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
              <Icon size={20} />
            </span>
            <div className="min-w-0">
              <p className="font-semibold">{label}</p>
              <p className="mt-0.5 text-sm text-gray-500">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- Delete account: handled by support ---------- */
function DeleteCard() {
  const { user } = useAuth();

  return (
    <section className="rounded-2xl border border-red-200 bg-white p-6 md:p-8">
      <h2 className="text-lg font-bold text-red-700">Delete account</h2>
      <p className="mt-1 text-sm text-gray-600">
        To delete your account and personal details, email us from your sign-in
        address and we'll process it. Order and payment records are kept for
        accounting, as explained in our{" "}
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

      {ready(LEGAL.email) ? (
        <a
          href={mailto(
            "Delete my IdeaX account",
            `Hello, please delete my IdeaX account (${user?.email}) and my personal details.`
          )}
          className="mt-4 inline-block rounded-lg border border-red-600 px-5 py-3 text-sm font-semibold text-red-600 hover:bg-red-50"
        >
          Email support to delete my account
        </a>
      ) : (
        <p className="mt-4 text-sm text-gray-500">
          Contact details coming soon.
        </p>
      )}
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