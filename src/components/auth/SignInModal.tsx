"use client";

import Link from "next/link";
import { useState } from "react";
import { Lock, LogOut, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/context/ToastContext";
import { useUI } from "@/context/UIContext";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function nameFromEmail(email: string) {
  const local = email.split("@")[0] ?? "";
  return (
    local
      .split(/[._-]+/)
      .filter(Boolean)
      .map((w) => w[0].toUpperCase() + w.slice(1))
      .join(" ") || "Customer"
  );
}

export function SignInModal() {
  const { signInOpen, closeOverlay, user } = useUI();
  return (
    <Modal
      open={signInOpen}
      onClose={closeOverlay}
      title={user ? "Your account" : "Sign in"}
      description={user ? undefined : "Access saved carts, order history and contractor pricing."}
      size="sm"
    >
      {user ? <AccountPanel /> : <SignInForm />}
    </Modal>
  );
}

function SignInForm() {
  const { signIn, closeOverlay } = useUI();
  const { toast } = useToast();
  const [mode, setMode] = useState<"signin" | "register">("signin");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");
    const name = String(data.get("name") ?? "").trim();
    const next: Record<string, string> = {};
    if (mode === "register" && !name) next.name = "Enter your name.";
    if (!EMAIL_RE.test(email)) next.email = "Enter a valid email address.";
    if (password.length < 6) next.password = "Password must be at least 6 characters.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setPending(true);
    window.setTimeout(() => {
      // Mock auth: only name + email are kept (in localStorage). The password is never stored.
      const displayName = mode === "register" ? name : nameFromEmail(email);
      signIn({ name: displayName, email });
      setPending(false);
      closeOverlay();
      toast({
        title: mode === "register" ? `Welcome, ${displayName.split(" ")[0]}!` : `Welcome back, ${displayName.split(" ")[0]}`,
        description: "You're signed in on this device (demo).",
      });
    }, 650);
  };

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4 px-6 py-5">
      {mode === "register" && (
        <Field label="Full name" htmlFor="auth-name" error={errors.name}>
          <Input id="auth-name" name="name" autoComplete="name" icon={User} data-autofocus aria-invalid={Boolean(errors.name)} />
        </Field>
      )}
      <Field label="Email" htmlFor="auth-email" error={errors.email}>
        <Input
          id="auth-email"
          name="email"
          type="email"
          autoComplete="email"
          icon={Mail}
          placeholder="you@company.com"
          data-autofocus={mode === "signin" ? true : undefined}
          aria-invalid={Boolean(errors.email)}
        />
      </Field>
      <Field label="Password" htmlFor="auth-password" error={errors.password}>
        <Input
          id="auth-password"
          name="password"
          type="password"
          autoComplete={mode === "register" ? "new-password" : "current-password"}
          icon={Lock}
          aria-invalid={Boolean(errors.password)}
        />
      </Field>
      <div className="flex items-center justify-between text-xs">
        <button
          type="button"
          onClick={() => toast({ title: "Password reset is disabled in this demo", tone: "info" })}
          className="text-subtle hover:text-brand"
        >
          Forgot password?
        </button>
        <button
          type="button"
          onClick={() => {
            setMode(mode === "signin" ? "register" : "signin");
            setErrors({});
          }}
          className="font-semibold text-brand-deep hover:underline"
        >
          {mode === "signin" ? "Create an account" : "I already have an account"}
        </button>
      </div>
      <Button type="submit" block size="md" disabled={pending}>
        {pending ? "Signing in…" : mode === "signin" ? "Sign in" : "Create account"}
      </Button>
      <p className="rounded-md bg-cream px-3 py-2.5 text-xs leading-relaxed text-muted">
        Demo storefront: sign-in is simulated in your browser and nothing is sent to a server. Contractor?{" "}
        <Link href="/contractors" onClick={closeOverlay} className="font-semibold text-brand-deep hover:underline">
          Apply for 15% pricing
        </Link>
        .
      </p>
    </form>
  );
}

function AccountPanel() {
  const { user, signOut, closeOverlay } = useUI();
  const { toast } = useToast();
  if (!user) return null;
  return (
    <div className="space-y-5 px-6 py-5">
      <div className="flex items-center gap-3">
        <span className="grid size-12 place-items-center rounded-full bg-brand font-display text-lg font-bold text-white">
          {user.name[0]?.toUpperCase()}
        </span>
        <div>
          <p className="font-semibold text-ink">{user.name}</p>
          <p className="text-sm text-subtle">{user.email}</p>
        </div>
      </div>
      <ul className="divide-y divide-line rounded-lg border border-line text-sm">
        {[
          { label: "View cart", href: "/cart" },
          { label: "Order status", href: "/info/order-status" },
          { label: "Contractor program", href: "/contractors" },
        ].map((l) => (
          <li key={l.href}>
            <Link href={l.href} onClick={closeOverlay} className="block px-4 py-3 hover:bg-cream">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
      <Button
        variant="outline"
        block
        onClick={() => {
          signOut();
          closeOverlay();
          toast({ title: "You've been signed out", tone: "info" });
        }}
      >
        <LogOut aria-hidden className="size-4" /> Sign out
      </Button>
    </div>
  );
}
